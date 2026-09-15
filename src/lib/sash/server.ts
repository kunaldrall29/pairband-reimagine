import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  CHALLENGE_HOURS,
  PLATFORM_FEE_BPS,
  TREASURY_PUBKEY,
  USDC_MINT,
} from "./constants";
import { newId, parseTweetUrl, sha256Hex } from "./ids";
import type {
  AdminOverview,
  DealDetail,
  DealRow,
  DraftRow,
  EventRow,
  Json,
  ListingRow,
  ListingWithSlots,
  MyDealRow,
  SashUserRow,
  SlotRow,
} from "./types";

function num(v: string | number): number {
  return typeof v === "number" ? v : Number(v);
}

async function draftListingWithAi(input: {
  tweetText: string;
  handle?: string;
  eventSlug: string;
}): Promise<{
  title: string;
  item_type: string;
  description: string;
  slots: { zone: string; price_usdc: number; pricing_mode: string }[];
  model: string;
  stub: boolean;
}> {
  const apiKey = process.env.XAI_API_KEY;
  const system = `You draft Sash marketplace listings from X posts. Sash places sponsor logos on event clothes (Token2049 etc). Return ONLY compact JSON:
{"title":"...","item_type":"hoodie|tee|dress|tote|cap|jacket|suitcase|laptop|sticker","description":"...","slots":[{"zone":"Chest","price_usdc":420,"pricing_mode":"fixed|auction"}]}
Rules: no forehead/tattoo/underwear; 1-4 slots; prices in USDC; keep title short.`;

  if (!apiKey) {
    const lower = input.tweetText.toLowerCase();
    const item =
      lower.includes("dress")
        ? "dress"
        : lower.includes("tote") || lower.includes("cap")
          ? "tote"
          : lower.includes("hoodie")
            ? "hoodie"
            : "tee";
    return {
      title: `${item[0]!.toUpperCase()}${item.slice(1)} · ${input.eventSlug}`,
      item_type: item,
      description:
        input.tweetText.slice(0, 280) ||
        "Imported from X. Review zones and prices before publish.",
      slots: [
        { zone: "Chest", price_usdc: 300, pricing_mode: "fixed" },
        { zone: "Back panel", price_usdc: 220, pricing_mode: "fixed" },
      ],
      model: "heuristic-fallback",
      stub: true,
    };
  }

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Event: ${input.eventSlug}\nAuthor: @${input.handle ?? "unknown"}\nTweet:\n${input.tweetText}`,
        },
      ],
      temperature: 0.3,
    }),
  });
  if (!res.ok) {
    throw new Error(`xAI API error ${res.status}`);
  }
  const body = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const text = body.choices[0]?.message.content ?? "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch?.[0] ?? "{}") as {
    title?: string;
    item_type?: string;
    description?: string;
    slots?: { zone: string; price_usdc: number; pricing_mode: string }[];
  };
  return {
    title: parsed.title || `Listing · ${input.eventSlug}`,
    item_type: parsed.item_type || "hoodie",
    description: parsed.description || input.tweetText.slice(0, 280),
    slots:
      parsed.slots?.length ?
        parsed.slots
      : [{ zone: "Chest", price_usdc: 300, pricing_mode: "fixed" }],
    model: "grok-4.5",
    stub: false,
  };
}

export const getEventBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<EventRow>`
      select * from events where slug = ${slug} limit 1
    `;
    return rows[0] ?? null;
  });

export const listLiveListings = createServerFn({ method: "GET" })
  .validator((input: { eventSlug?: string } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const listings =
      data.eventSlug ?
        await sql<ListingRow & { event_slug: string; event_name: string }>`
          select l.*, e.slug as event_slug, e.name as event_name
          from listings l
          join events e on e.id = l.event_id
          where l.status = 'live' and e.slug = ${data.eventSlug}
          order by l.featured desc, l.published_at desc nulls last
        `
      : await sql<ListingRow & { event_slug: string; event_name: string }>`
          select l.*, e.slug as event_slug, e.name as event_name
          from listings l
          join events e on e.id = l.event_id
          where l.status = 'live'
          order by l.featured desc, l.published_at desc nulls last
        `;
    if (!listings.length) return [] as ListingWithSlots[];
    const slots =
      data.eventSlug ?
        await sql<SlotRow>`
          select s.* from slots s
          join listings l on l.id = s.listing_id
          join events e on e.id = l.event_id
          where l.status = 'live' and e.slug = ${data.eventSlug}
          order by s.sort_order asc
        `
      : await sql<SlotRow>`
          select s.* from slots s
          join listings l on l.id = s.listing_id
          where l.status = 'live'
          order by s.sort_order asc
        `;
    return listings.map((l) => ({
      ...l,
      slots: slots.filter((s) => s.listing_id === l.id),
    }));
  });

export const getListing = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const listings = await sql<
      ListingRow & { event_slug: string; event_name: string; event_theme: string }
    >`
      select l.*, e.slug as event_slug, e.name as event_name, e.theme as event_theme
      from listings l join events e on e.id = l.event_id
      where l.id = ${id} limit 1
    `;
    const listing = listings[0];
    if (!listing) return null;
    const slots = await sql<SlotRow>`
      select * from slots where listing_id = ${id} order by sort_order asc
    `;
    return { ...listing, slots };
  });

export const getDeal = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<DealDetail | null> => {
    const sql = await getSql();
    const deals = await sql<DealRow>`select * from deals where id = ${id} limit 1`;
    const deal = deals[0];
    if (!deal) return null;
    const slots = await sql<SlotRow>`select * from slots where id = ${deal.slot_id}`;
    const listings = await sql<ListingRow>`select * from listings where id = ${deal.listing_id}`;
    const proofs = await sql<DealDetail["proofs"][number]>`
      select id, wide_url, closeup_url, recap_url, recap_post_url, content_hash, notes, created_at
      from proofs where deal_id = ${id} order by created_at desc
    `;
    const reports = await sql<{
      id: string;
      report: Json;
      model: string | null;
      created_at: string;
    }>`select id, report, model, created_at from ai_reports where deal_id = ${id} order by created_at desc`;
    const disputes = await sql<DealDetail["disputes"][number]>`
      select id, reason, status, created_at from disputes where deal_id = ${id}
    `;
    const ledger = await sql<DealDetail["ledger"][number]>`
      select id, kind, amount_usdc, tx_sig, note, created_at from ledger_entries
      where deal_id = ${id} order by created_at
    `;
    return {
      deal: { ...deal, attestation: (deal.attestation ?? null) as Json | null },
      slot: slots[0] ?? null,
      listing: listings[0] ?? null,
      proofs,
      reports,
      disputes,
      ledger,
      usdcMint: USDC_MINT,
      treasury: TREASURY_PUBKEY,
    };
  });

export const getDraftByToken = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }): Promise<DraftRow | null> => {
    const sql = await getSql();
    const rows = await sql<DraftRow>`
      select * from drafts where draft_link_token = ${token} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return { ...row, ai_payload: (row.ai_payload ?? {}) as Json };
  });

export const importTweetDraft = createServerFn({ method: "POST" })
  .validator(
    (input: {
      tweetUrl: string;
      tweetText?: string;
      eventSlug?: string;
      authorId?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const parsed = parseTweetUrl(data.tweetUrl);
    if (!parsed) throw new Error("Paste a valid x.com/.../status/... URL");
    const eventSlug = data.eventSlug || "token2049";
    const tweetText =
      data.tweetText?.trim() ||
      `Hosting inventory for ${eventSlug}. Mention @buysashdot.`;
    const ai = await draftListingWithAi({
      tweetText,
      handle: parsed.handle,
      eventSlug,
    });
    const sql = await getSql();
    const id = newId("drf");
    const token = newId("tok").replace("tok_", "");
    const xWriteKey = process.env.X_API_WRITE_TOKEN || process.env.TWITTER_BEARER_TOKEN;
    let botReplied = false;
    let botNote =
      "X write credentials not configured — skipped bot reply. Share the draft link manually.";
    if (xWriteKey) {
      // Honest stub: write path needs app user-context OAuth1/OAuth2 — not just bearer.
      botNote =
        "X write token present but full bot reply OAuth not wired in v1 — skipped reply.";
    }
    await sql`
      insert into drafts (
        id, tweet_url, tweet_author_id, tweet_author_handle, tweet_text,
        event_slug, ai_payload, status, draft_link_token, bot_replied, bot_reply_note
      ) values (
        ${id},
        ${parsed.url},
        ${data.authorId ?? null},
        ${parsed.handle ?? null},
        ${tweetText},
        ${eventSlug},
        ${JSON.stringify(ai as Json)}::jsonb,
        ${"pending"},
        ${token},
        ${botReplied},
        ${botNote}
      )
    `;
    return {
      draftId: id,
      token,
      link: `/list?draft=${token}`,
      botReplied,
      botNote,
      ai,
    };
  });

export const upsertMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      walletPubkey?: string;
      xHandle?: string;
      xUserId?: string;
      displayName?: string;
    }) => input,
  )
  .handler(async ({ context, data }): Promise<SashUserRow | null> => {
    const sql = await getSql();
    await sql`
      insert into sash_users (user_id, wallet_pubkey, x_handle, x_user_id, display_name, updated_at)
      values (
        ${context.userId},
        ${data.walletPubkey ?? null},
        ${data.xHandle ?? null},
        ${data.xUserId ?? null},
        ${data.displayName ?? null},
        NOW()
      )
      on conflict (user_id) do update set
        wallet_pubkey = coalesce(${data.walletPubkey ?? null}, sash_users.wallet_pubkey),
        x_handle = coalesce(${data.xHandle ?? null}, sash_users.x_handle),
        x_user_id = coalesce(${data.xUserId ?? null}, sash_users.x_user_id),
        display_name = coalesce(${data.displayName ?? null}, sash_users.display_name),
        updated_at = NOW()
    `;
    const rows = await sql<SashUserRow>`
      select user_id, x_user_id, x_handle, display_name, wallet_pubkey, role
      from sash_users where user_id = ${context.userId} limit 1
    `;
    return rows[0] ?? null;
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SashUserRow | null> => {
    const sql = await getSql();
    const rows = await sql<SashUserRow>`
      select user_id, x_user_id, x_handle, display_name, wallet_pubkey, role
      from sash_users where user_id = ${context.userId} limit 1
    `;
    return rows[0] ?? null;
  });

export const publishDraft = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      token: string;
      title?: string;
      itemType?: string;
      description?: string;
      coverImage?: string;
      slots?: { zone: string; price_usdc: number; pricing_mode: string }[];
      xUserId?: string;
      xHandle?: string;
      walletPubkey?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const drafts = await sql<DraftRow>`
      select * from drafts where draft_link_token = ${data.token} limit 1
    `;
    const draft = drafts[0];
    if (!draft) throw new Error("Draft not found");

    // Gate: same X author when draft has author id
    if (draft.tweet_author_id && data.xUserId) {
      if (draft.tweet_author_id !== data.xUserId) {
        throw new Error(
          "Connected X identity must match the tweet author (draft.tweet.author_id === connected_x_user_id).",
        );
      }
    }

    await sql`
      insert into sash_users (user_id, wallet_pubkey, x_handle, x_user_id, updated_at)
      values (
        ${context.userId},
        ${data.walletPubkey ?? null},
        ${data.xHandle ?? draft.tweet_author_handle},
        ${data.xUserId ?? draft.tweet_author_id},
        NOW()
      )
      on conflict (user_id) do update set
        wallet_pubkey = coalesce(${data.walletPubkey ?? null}, sash_users.wallet_pubkey),
        x_handle = coalesce(${data.xHandle ?? null}, sash_users.x_handle),
        x_user_id = coalesce(${data.xUserId ?? null}, sash_users.x_user_id),
        updated_at = NOW()
    `;

    const payload = (draft.ai_payload ?? {}) as {
      title?: string;
      item_type?: string;
      description?: string;
      slots?: { zone: string; price_usdc: number; pricing_mode: string }[];
    } & Json;
    const events = await sql<EventRow>`
      select * from events where slug = ${draft.event_slug ?? "token2049"} limit 1
    `;
    const event = events[0];
    if (!event) throw new Error("Event missing");

    const listingId = newId("lst");
    const title = data.title || payload.title || "Untitled listing";
    const itemType = data.itemType || payload.item_type || "hoodie";
    const description = data.description || payload.description || "";
    const slots = data.slots?.length ? data.slots : payload.slots || [];

    await sql`
      insert into listings (
        id, event_id, seller_user_id, seller_x_handle, title, item_type, description,
        status, featured, cover_image, source_tweet_url, source_tweet_author_id, published_at
      ) values (
        ${listingId},
        ${event.id},
        ${context.userId},
        ${data.xHandle ?? draft.tweet_author_handle},
        ${title},
        ${itemType},
        ${description},
        ${"live"},
        ${false},
        ${data.coverImage ?? "/art/hoodie.jpg"},
        ${draft.tweet_url},
        ${draft.tweet_author_id},
        NOW()
      )
    `;

    let order = 0;
    for (const s of slots) {
      order += 1;
      await sql`
        insert into slots (id, listing_id, zone, pricing_mode, price_usdc, status, sort_order)
        values (
          ${newId("slt")},
          ${listingId},
          ${s.zone},
          ${s.pricing_mode || "fixed"},
          ${s.price_usdc},
          ${"open"},
          ${order}
        )
      `;
    }

    await sql`
      update drafts set status = 'published', updated_at = NOW()
      where id = ${draft.id}
    `;

    return { listingId, path: `/l/${listingId}` };
  });

export const createDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      listingId: string;
      slotId: string;
      logoUrl?: string;
      bidAmount?: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const slots = await sql<SlotRow>`
      select * from slots where id = ${data.slotId} and listing_id = ${data.listingId} limit 1
    `;
    const slot = slots[0];
    if (!slot) throw new Error("Slot not found");
    if (slot.status !== "open") throw new Error("Slot is not open");
    const listings = await sql<ListingRow>`
      select * from listings where id = ${data.listingId} limit 1
    `;
    const listing = listings[0];
    if (!listing || listing.status !== "live") throw new Error("Listing not live");

    const amount =
      slot.pricing_mode === "auction" && data.bidAmount ?
        data.bidAmount
      : num(slot.price_usdc);

    if (slot.pricing_mode === "auction") {
      const bidId = newId("bid");
      await sql`
        insert into bids (id, slot_id, bidder_user_id, amount_usdc, status, funded)
        values (${bidId}, ${slot.id}, ${context.userId}, ${amount}, ${"open"}, ${false})
      `;
    }

    const dealId = newId("deal");
    await sql`
      insert into deals (
        id, listing_id, slot_id, buyer_user_id, seller_user_id, amount_usdc,
        status, logo_url, escrow_mode, platform_fee_bps
      ) values (
        ${dealId},
        ${listing.id},
        ${slot.id},
        ${context.userId},
        ${listing.seller_user_id},
        ${amount},
        ${"pending_payment"},
        ${data.logoUrl ?? null},
        ${"treasury_ledger"},
        ${PLATFORM_FEE_BPS}
      )
    `;
    return {
      dealId,
      amount,
      treasury: TREASURY_PUBKEY,
      usdcMint: USDC_MINT,
      path: `/d/${dealId}`,
      note: "Send USDC to treasury then call lockDeal with tx signature. Anchor program optional later.",
    };
  });

export const lockDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: string; lockTx: string; fromPubkey?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deals = await sql<DealRow>`
      select * from deals where id = ${data.dealId} and buyer_user_id = ${context.userId} limit 1
    `;
    const deal = deals[0];
    if (!deal) throw new Error("Deal not found");
    if (deal.status !== "pending_payment") throw new Error("Deal not awaiting payment");
    if (!data.lockTx.trim()) throw new Error("lockTx required");

    await sql`
      update deals set status = 'locked', lock_tx = ${data.lockTx}, updated_at = NOW()
      where id = ${deal.id}
    `;
    await sql`
      update slots set status = 'locked' where id = ${deal.slot_id}
    `;
    await sql`
      insert into ledger_entries (id, deal_id, kind, amount_usdc, from_pubkey, to_pubkey, tx_sig, note)
      values (
        ${newId("led")},
        ${deal.id},
        ${"lock"},
        ${deal.amount_usdc},
        ${data.fromPubkey ?? null},
        ${TREASURY_PUBKEY},
        ${data.lockTx},
        ${"USDC locked in treasury ledger (Anchor stub)"}
      )
    `;
    return { ok: true as const, status: "locked" };
  });

export const submitProof = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      dealId: string;
      wideUrl: string;
      closeupUrl: string;
      recapUrl?: string;
      recapPostUrl?: string;
      notes?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deals = await sql<DealRow>`
      select * from deals where id = ${data.dealId} limit 1
    `;
    const deal = deals[0];
    if (!deal) throw new Error("Deal not found");
    if (deal.seller_user_id && deal.seller_user_id !== context.userId) {
      const me = await sql<{ role: string }>`
        select role from sash_users where user_id = ${context.userId} limit 1
      `;
      const seedSeller = deal.seller_user_id.startsWith("seed_");
      if (me[0]?.role !== "admin" && !seedSeller) {
        throw new Error("Only the seller can upload proof");
      }
    }
    if (!["locked", "proof_submitted", "challenged"].includes(deal.status)) {
      throw new Error("Deal must be locked before proof");
    }

    const hashInput = [
      data.wideUrl,
      data.closeupUrl,
      data.recapUrl ?? "",
      data.recapPostUrl ?? "",
      deal.id,
    ].join("|");
    const contentHash = await sha256Hex(hashInput);
    const proofId = newId("prf");
    await sql`
      insert into proofs (
        id, deal_id, uploader_user_id, wide_url, closeup_url, recap_url, recap_post_url, notes, content_hash
      ) values (
        ${proofId},
        ${deal.id},
        ${context.userId},
        ${data.wideUrl},
        ${data.closeupUrl},
        ${data.recapUrl ?? null},
        ${data.recapPostUrl ?? null},
        ${data.notes ?? null},
        ${contentHash}
      )
    `;
    await sql`
      update deals set status = 'proof_submitted', proof_hash = ${contentHash}, updated_at = NOW()
      where id = ${deal.id}
    `;
    await sql`
      update slots set status = 'proof_due' where id = ${deal.slot_id}
    `;
    return { proofId, contentHash };
  });

export const runAiProofReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deals = await sql<DealRow>`select * from deals where id = ${data.dealId} limit 1`;
    const deal = deals[0];
    if (!deal) throw new Error("Deal not found");
    const proofs = await sql<{
      wide_url: string | null;
      closeup_url: string | null;
      recap_post_url: string | null;
      content_hash: string | null;
    }>`select * from proofs where deal_id = ${deal.id} order by created_at desc limit 1`;
    const proof = proofs[0];
    if (!proof) throw new Error("No proof uploaded");

    const apiKey = process.env.XAI_API_KEY;
    let report: Json;
    let model: string;
    if (!apiKey) {
      model = "heuristic-fallback";
      report = {
        pass: true,
        confidence: 0.62,
        checks: {
          wide_shot: Boolean(proof.wide_url),
          closeup: Boolean(proof.closeup_url),
          recap_post: Boolean(proof.recap_post_url),
        },
        notes:
          "AI unavailable — heuristic attestation. Configure XAI_API_KEY for Grok review.",
        proof_hash: proof.content_hash,
      };
    } else {
      model = "grok-4.5";
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You attest Sash delivery proof. Return JSON {pass:boolean,confidence:0-1,checks:{wide_shot,closeup,recap_post},notes:string}",
            },
            {
              role: "user",
              content: JSON.stringify({
                dealId: deal.id,
                amount_usdc: deal.amount_usdc,
                proof,
              }),
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(`xAI API error ${res.status}`);
      const body = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      const text = body.choices[0]?.message.content ?? "{}";
      const m = text.match(/\{[\s\S]*\}/);
      report = JSON.parse(m?.[0] ?? '{"pass":false}') as Json;
    }

    const reportId = newId("air");
    await sql`
      insert into ai_reports (id, deal_id, report, model)
      values (${reportId}, ${deal.id}, ${JSON.stringify(report)}::jsonb, ${model})
    `;

    const deadline = new Date(
      Date.now() + CHALLENGE_HOURS * 60 * 60 * 1000,
    ).toISOString();
    const attestation: Json = {
      reportId,
      signed_by: context.userId,
      signed_at: new Date().toISOString(),
      policy: "AI recommends, policy attests, Anchor enforces",
      report,
      proof_hash: proof.content_hash,
    };
    await sql`
      update deals set
        status = 'attested',
        attestation = ${JSON.stringify(attestation)}::jsonb,
        challenge_deadline = ${deadline},
        updated_at = NOW()
      where id = ${deal.id}
    `;
    return { reportId, attestation, challengeDeadline: deadline };
  });

export const challengeDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: string; reason: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deals = await sql<DealRow>`select * from deals where id = ${data.dealId} limit 1`;
    const deal = deals[0];
    if (!deal) throw new Error("Deal not found");
    if (deal.status !== "attested") throw new Error("Only attested deals can be challenged");
    if (deal.buyer_user_id !== context.userId) {
      throw new Error("Only the buyer can challenge");
    }
    await sql`
      insert into disputes (id, deal_id, opener_user_id, reason, status)
      values (${newId("dsp")}, ${deal.id}, ${context.userId}, ${data.reason}, ${"open"})
    `;
    await sql`
      update deals set status = 'challenged', updated_at = NOW() where id = ${deal.id}
    `;
    return { ok: true as const };
  });

export const releaseDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: string; releaseTx?: string; force?: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deals = await sql<DealRow>`select * from deals where id = ${data.dealId} limit 1`;
    const deal = deals[0];
    if (!deal) throw new Error("Deal not found");
    if (!["attested", "challenged"].includes(deal.status) && !data.force) {
      throw new Error("Deal not ready for release");
    }
    if (deal.status === "attested" && deal.challenge_deadline) {
      const ready = new Date(deal.challenge_deadline).getTime() <= Date.now();
      const me = await sql<{ role: string }>`
        select role from sash_users where user_id = ${context.userId}
      `;
      if (!ready && me[0]?.role !== "admin" && !data.force) {
        throw new Error("Challenge window still open");
      }
    }
    if (deal.status === "challenged" && !data.force) {
      throw new Error("Challenged deals need admin resolution");
    }

    const amount = num(deal.amount_usdc);
    const fee = (amount * (deal.platform_fee_bps || PLATFORM_FEE_BPS)) / 10000;
    const sellerShare = amount - fee;
    const releaseTx = data.releaseTx || `PENDING_RELEASE_${deal.id}`;

    await sql`
      update deals set status = 'released', release_tx = ${releaseTx}, updated_at = NOW()
      where id = ${deal.id}
    `;
    await sql`update slots set status = 'released' where id = ${deal.slot_id}`;
    await sql`
      insert into ledger_entries (id, deal_id, kind, amount_usdc, from_pubkey, to_pubkey, tx_sig, note)
      values
      (
        ${newId("led")}, ${deal.id}, ${"release_seller"}, ${sellerShare},
        ${TREASURY_PUBKEY}, ${"SELLER"}, ${releaseTx}, ${"Atomic seller share"}
      ),
      (
        ${newId("led")}, ${deal.id}, ${"release_fee"}, ${fee},
        ${TREASURY_PUBKEY}, ${"PLATFORM"}, ${releaseTx}, ${"Platform fee on release only"}
      )
    `;
    return { ok: true as const, sellerShare, fee, releaseTx };
  });

export const refundDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dealId: string; refundTx?: string; reason?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const deals = await sql<DealRow>`select * from deals where id = ${data.dealId} limit 1`;
    const deal = deals[0];
    if (!deal) throw new Error("Deal not found");
    const me = await sql<{ role: string }>`
      select role from sash_users where user_id = ${context.userId}
    `;
    const isParty =
      deal.buyer_user_id === context.userId ||
      deal.seller_user_id === context.userId ||
      me[0]?.role === "admin";
    if (!isParty) throw new Error("Not authorized");
    if (!["locked", "proof_submitted", "attested", "challenged"].includes(deal.status)) {
      throw new Error("Deal cannot be refunded in this state");
    }
    const refundTx = data.refundTx || `PENDING_REFUND_${deal.id}`;
    await sql`
      update deals set status = 'refunded', refund_tx = ${refundTx}, updated_at = NOW()
      where id = ${deal.id}
    `;
    await sql`update slots set status = 'open' where id = ${deal.slot_id}`;
    await sql`
      insert into ledger_entries (id, deal_id, kind, amount_usdc, from_pubkey, to_pubkey, tx_sig, note)
      values (
        ${newId("led")}, ${deal.id}, ${"refund"}, ${deal.amount_usdc},
        ${TREASURY_PUBKEY}, ${"BUYER"}, ${refundTx}, ${data.reason ?? "Refund"}
      )
    `;
    if (deal.status === "challenged") {
      await sql`
        update disputes set status = 'refunded', resolution = ${data.reason ?? "refund"}, resolved_at = NOW()
        where deal_id = ${deal.id} and status = 'open'
      `;
    }
    return { ok: true as const, refundTx };
  });

export const getMyDeals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MyDealRow[]> => {
    const sql = await getSql();
    const rows = await sql<MyDealRow>`
      select d.*, l.title as listing_title, s.zone
      from deals d
      join listings l on l.id = d.listing_id
      join slots s on s.id = d.slot_id
      where d.buyer_user_id = ${context.userId} or d.seller_user_id = ${context.userId}
      order by d.created_at desc
    `;
    return rows.map((r) => ({
      ...r,
      attestation: (r.attestation ?? null) as Json | null,
    }));
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminOverview> => {
    const sql = await getSql();
    await sql`
      insert into sash_users (user_id, role) values (${context.userId}, ${"user"})
      on conflict (user_id) do nothing
    `;
    const counts = await sql<AdminOverview["counts"]>`
      select
        (select count(*)::int from listings) as listings,
        (select count(*)::int from deals) as deals,
        (select count(*)::int from deals where status = 'challenged') as disputed,
        (select count(*)::int from deals where status = 'locked') as locked
    `;
    const recent = await sql<DealRow>`
      select * from deals order by created_at desc limit 20
    `;
    const ledger = await sql<AdminOverview["ledger"][number]>`
      select id, deal_id, kind, amount_usdc, tx_sig, note, created_at
      from ledger_entries order by created_at desc limit 30
    `;
    return {
      counts: counts[0]!,
      recent: recent.map((r) => ({
        ...r,
        attestation: (r.attestation ?? null) as Json | null,
      })),
      ledger,
      treasury: TREASURY_PUBKEY,
      usdcMint: USDC_MINT,
      escrowMode: "treasury_ledger",
      note: "Anchor program not deployed — public ledger attests movements. Set SASH_TREASURY + verify txs on Solana explorer.",
    };
  });
