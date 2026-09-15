import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { n as TREASURY_PUBKEY, o as getSql, r as USDC_MINT } from "./constants-B2y20_qc.mjs";
import { t as authMiddleware } from "./middleware-LLcWCD5e.mjs";
import { n as parseTweetUrl, r as sha256Hex, t as newId } from "./ids-C0GLR5Pk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-7cefiMPu.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function num(v) {
	return typeof v === "number" ? v : Number(v);
}
async function draftListingWithAi(input) {
	const apiKey = process.env.XAI_API_KEY;
	const system = `You draft Sash marketplace listings from X posts. Sash places sponsor logos on event clothes (Token2049 etc). Return ONLY compact JSON:
{"title":"...","item_type":"hoodie|tee|dress|tote|cap|jacket|suitcase|laptop|sticker","description":"...","slots":[{"zone":"Chest","price_usdc":420,"pricing_mode":"fixed|auction"}]}
Rules: no forehead/tattoo/underwear; 1-4 slots; prices in USDC; keep title short.`;
	if (!apiKey) {
		const lower = input.tweetText.toLowerCase();
		const item = lower.includes("dress") ? "dress" : lower.includes("tote") || lower.includes("cap") ? "tote" : lower.includes("hoodie") ? "hoodie" : "tee";
		return {
			title: `${item[0].toUpperCase()}${item.slice(1)} · ${input.eventSlug}`,
			item_type: item,
			description: input.tweetText.slice(0, 280) || "Imported from X. Review zones and prices before publish.",
			slots: [{
				zone: "Chest",
				price_usdc: 300,
				pricing_mode: "fixed"
			}, {
				zone: "Back panel",
				price_usdc: 220,
				pricing_mode: "fixed"
			}],
			model: "heuristic-fallback",
			stub: true
		};
	}
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: `Event: ${input.eventSlug}\nAuthor: @${input.handle ?? "unknown"}\nTweet:\n${input.tweetText}`
			}],
			temperature: .3
		})
	});
	if (!res.ok) throw new Error(`xAI API error ${res.status}`);
	const jsonMatch = ((await res.json()).choices[0]?.message.content ?? "{}").match(/\{[\s\S]*\}/);
	const parsed = JSON.parse(jsonMatch?.[0] ?? "{}");
	return {
		title: parsed.title || `Listing · ${input.eventSlug}`,
		item_type: parsed.item_type || "hoodie",
		description: parsed.description || input.tweetText.slice(0, 280),
		slots: parsed.slots?.length ? parsed.slots : [{
			zone: "Chest",
			price_usdc: 300,
			pricing_mode: "fixed"
		}],
		model: "grok-4.5",
		stub: false
	};
}
var getEventBySlug_createServerFn_handler = createServerRpc({
	id: "7501ebcf429b39d58ffefb6db255bdaac4f1684b97b81d13f37d919b9ed3847f",
	name: "getEventBySlug",
	filename: "src/lib/sash/server.ts"
}, (opts) => getEventBySlug.__executeServer(opts));
var getEventBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getEventBySlug_createServerFn_handler, async ({ data: slug }) => {
	return (await (await getSql())`
      select * from events where slug = ${slug} limit 1
    `)[0] ?? null;
});
var listLiveListings_createServerFn_handler = createServerRpc({
	id: "465c350b33078be447c5366ab16a99d24917f21af526b6ac46fac2cd4eef3393",
	name: "listLiveListings",
	filename: "src/lib/sash/server.ts"
}, (opts) => listLiveListings.__executeServer(opts));
var listLiveListings = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(listLiveListings_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const listings = data.eventSlug ? await sql`
          select l.*, e.slug as event_slug, e.name as event_name
          from listings l
          join events e on e.id = l.event_id
          where l.status = 'live' and e.slug = ${data.eventSlug}
          order by l.featured desc, l.published_at desc nulls last
        ` : await sql`
          select l.*, e.slug as event_slug, e.name as event_name
          from listings l
          join events e on e.id = l.event_id
          where l.status = 'live'
          order by l.featured desc, l.published_at desc nulls last
        `;
	if (!listings.length) return [];
	const slots = data.eventSlug ? await sql`
          select s.* from slots s
          join listings l on l.id = s.listing_id
          join events e on e.id = l.event_id
          where l.status = 'live' and e.slug = ${data.eventSlug}
          order by s.sort_order asc
        ` : await sql`
          select s.* from slots s
          join listings l on l.id = s.listing_id
          where l.status = 'live'
          order by s.sort_order asc
        `;
	return listings.map((l) => ({
		...l,
		slots: slots.filter((s) => s.listing_id === l.id)
	}));
});
var getListing_createServerFn_handler = createServerRpc({
	id: "89673ddce95df0be49684a1688f8929f79631d651591b99d22af9b46bd9326cb",
	name: "getListing",
	filename: "src/lib/sash/server.ts"
}, (opts) => getListing.__executeServer(opts));
var getListing = createServerFn({ method: "GET" }).validator((id) => id).handler(getListing_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	const listing = (await sql`
      select l.*, e.slug as event_slug, e.name as event_name, e.theme as event_theme
      from listings l join events e on e.id = l.event_id
      where l.id = ${id} limit 1
    `)[0];
	if (!listing) return null;
	const slots = await sql`
      select * from slots where listing_id = ${id} order by sort_order asc
    `;
	return {
		...listing,
		slots
	};
});
var getDeal_createServerFn_handler = createServerRpc({
	id: "4ef1c18d9099f82c81fc1e2207136dc138d95f9491d11905a5532d1008e82bf5",
	name: "getDeal",
	filename: "src/lib/sash/server.ts"
}, (opts) => getDeal.__executeServer(opts));
var getDeal = createServerFn({ method: "GET" }).validator((id) => id).handler(getDeal_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	const deal = (await sql`select * from deals where id = ${id} limit 1`)[0];
	if (!deal) return null;
	const slots = await sql`select * from slots where id = ${deal.slot_id}`;
	const listings = await sql`select * from listings where id = ${deal.listing_id}`;
	const proofs = await sql`
      select id, wide_url, closeup_url, recap_url, recap_post_url, content_hash, notes, created_at
      from proofs where deal_id = ${id} order by created_at desc
    `;
	const reports = await sql`select id, report, model, created_at from ai_reports where deal_id = ${id} order by created_at desc`;
	const disputes = await sql`
      select id, reason, status, created_at from disputes where deal_id = ${id}
    `;
	const ledger = await sql`
      select id, kind, amount_usdc, tx_sig, note, created_at from ledger_entries
      where deal_id = ${id} order by created_at
    `;
	return {
		deal: {
			...deal,
			attestation: deal.attestation ?? null
		},
		slot: slots[0] ?? null,
		listing: listings[0] ?? null,
		proofs,
		reports,
		disputes,
		ledger,
		usdcMint: USDC_MINT,
		treasury: TREASURY_PUBKEY
	};
});
var getDraftByToken_createServerFn_handler = createServerRpc({
	id: "efb48d9fc1175efce2434389c7632da2683fc6569c239f65fad4afdd3ec46353",
	name: "getDraftByToken",
	filename: "src/lib/sash/server.ts"
}, (opts) => getDraftByToken.__executeServer(opts));
var getDraftByToken = createServerFn({ method: "GET" }).validator((token) => token).handler(getDraftByToken_createServerFn_handler, async ({ data: token }) => {
	const row = (await (await getSql())`
      select * from drafts where draft_link_token = ${token} limit 1
    `)[0];
	if (!row) return null;
	return {
		...row,
		ai_payload: row.ai_payload ?? {}
	};
});
var importTweetDraft_createServerFn_handler = createServerRpc({
	id: "fecb348d89fbab0881943ffd816c5400a80945faefb85e80703e6373978fa2ac",
	name: "importTweetDraft",
	filename: "src/lib/sash/server.ts"
}, (opts) => importTweetDraft.__executeServer(opts));
var importTweetDraft = createServerFn({ method: "POST" }).validator((input) => input).handler(importTweetDraft_createServerFn_handler, async ({ data }) => {
	const parsed = parseTweetUrl(data.tweetUrl);
	if (!parsed) throw new Error("Paste a valid x.com/.../status/... URL");
	const eventSlug = data.eventSlug || "token2049";
	const tweetText = data.tweetText?.trim() || `Hosting inventory for ${eventSlug}. Mention @buysashdot.`;
	const ai = await draftListingWithAi({
		tweetText,
		handle: parsed.handle,
		eventSlug
	});
	const sql = await getSql();
	const id = newId("drf");
	const token = newId("tok").replace("tok_", "");
	const xWriteKey = process.env.X_API_WRITE_TOKEN || process.env.TWITTER_BEARER_TOKEN;
	let botReplied = false;
	let botNote = "X write credentials not configured — skipped bot reply. Share the draft link manually.";
	if (xWriteKey) botNote = "X write token present but full bot reply OAuth not wired in v1 — skipped reply.";
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
        ${JSON.stringify(ai)}::jsonb,
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
		ai
	};
});
var upsertMyProfile_createServerFn_handler = createServerRpc({
	id: "f6f93d910e14a7e38629d35f0f1ad348f0144f65a4db4ddc57e0dcbbdf10ce90",
	name: "upsertMyProfile",
	filename: "src/lib/sash/server.ts"
}, (opts) => upsertMyProfile.__executeServer(opts));
var upsertMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertMyProfile_createServerFn_handler, async ({ context, data }) => {
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
	return (await sql`
      select user_id, x_user_id, x_handle, display_name, wallet_pubkey, role
      from sash_users where user_id = ${context.userId} limit 1
    `)[0] ?? null;
});
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "3ad432dc08314943d3188e54b66b307793874164d6701ad294837336a237ae2c",
	name: "getMyProfile",
	filename: "src/lib/sash/server.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select user_id, x_user_id, x_handle, display_name, wallet_pubkey, role
      from sash_users where user_id = ${context.userId} limit 1
    `)[0] ?? null;
});
var publishDraft_createServerFn_handler = createServerRpc({
	id: "d016da9fc60536609d474ec0b73a7dc69b72cfa19d643ee5dec065a6bea6fd8b",
	name: "publishDraft",
	filename: "src/lib/sash/server.ts"
}, (opts) => publishDraft.__executeServer(opts));
var publishDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(publishDraft_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const draft = (await sql`
      select * from drafts where draft_link_token = ${data.token} limit 1
    `)[0];
	if (!draft) throw new Error("Draft not found");
	if (draft.tweet_author_id && data.xUserId) {
		if (draft.tweet_author_id !== data.xUserId) throw new Error("Connected X identity must match the tweet author (draft.tweet.author_id === connected_x_user_id).");
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
	const payload = draft.ai_payload ?? {};
	const event = (await sql`
      select * from events where slug = ${draft.event_slug ?? "token2049"} limit 1
    `)[0];
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
	return {
		listingId,
		path: `/l/${listingId}`
	};
});
var createDeal_createServerFn_handler = createServerRpc({
	id: "1a7ba4a6aff79d8efc6437f6077ed7903d35d60aa388f6dbfdeff0033afc6346",
	name: "createDeal",
	filename: "src/lib/sash/server.ts"
}, (opts) => createDeal.__executeServer(opts));
var createDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createDeal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const slot = (await sql`
      select * from slots where id = ${data.slotId} and listing_id = ${data.listingId} limit 1
    `)[0];
	if (!slot) throw new Error("Slot not found");
	if (slot.status !== "open") throw new Error("Slot is not open");
	const listing = (await sql`
      select * from listings where id = ${data.listingId} limit 1
    `)[0];
	if (!listing || listing.status !== "live") throw new Error("Listing not live");
	const amount = slot.pricing_mode === "auction" && data.bidAmount ? data.bidAmount : num(slot.price_usdc);
	if (slot.pricing_mode === "auction") await sql`
        insert into bids (id, slot_id, bidder_user_id, amount_usdc, status, funded)
        values (${newId("bid")}, ${slot.id}, ${context.userId}, ${amount}, ${"open"}, ${false})
      `;
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
        ${500}
      )
    `;
	return {
		dealId,
		amount,
		treasury: TREASURY_PUBKEY,
		usdcMint: USDC_MINT,
		path: `/d/${dealId}`,
		note: "Send USDC to treasury then call lockDeal with tx signature. Anchor program optional later."
	};
});
var lockDeal_createServerFn_handler = createServerRpc({
	id: "de6b5504bd65a4d28364b44dddda2ffb013cafc57b37843ec2105b865839d477",
	name: "lockDeal",
	filename: "src/lib/sash/server.ts"
}, (opts) => lockDeal.__executeServer(opts));
var lockDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(lockDeal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const deal = (await sql`
      select * from deals where id = ${data.dealId} and buyer_user_id = ${context.userId} limit 1
    `)[0];
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
	return {
		ok: true,
		status: "locked"
	};
});
var submitProof_createServerFn_handler = createServerRpc({
	id: "119776eed05733bb9d7dc58f9c0131197386288290a98c7e2769022ce9169063",
	name: "submitProof",
	filename: "src/lib/sash/server.ts"
}, (opts) => submitProof.__executeServer(opts));
var submitProof = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(submitProof_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const deal = (await sql`
      select * from deals where id = ${data.dealId} limit 1
    `)[0];
	if (!deal) throw new Error("Deal not found");
	if (deal.seller_user_id && deal.seller_user_id !== context.userId) {
		const me = await sql`
        select role from sash_users where user_id = ${context.userId} limit 1
      `;
		const seedSeller = deal.seller_user_id.startsWith("seed_");
		if (me[0]?.role !== "admin" && !seedSeller) throw new Error("Only the seller can upload proof");
	}
	if (![
		"locked",
		"proof_submitted",
		"challenged"
	].includes(deal.status)) throw new Error("Deal must be locked before proof");
	const hashInput = [
		data.wideUrl,
		data.closeupUrl,
		data.recapUrl ?? "",
		data.recapPostUrl ?? "",
		deal.id
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
	return {
		proofId,
		contentHash
	};
});
var runAiProofReport_createServerFn_handler = createServerRpc({
	id: "cdc8e29921d6b7f5dab2d10117710059af0b44f533fe1d58a6d8c433c17ba0d5",
	name: "runAiProofReport",
	filename: "src/lib/sash/server.ts"
}, (opts) => runAiProofReport.__executeServer(opts));
var runAiProofReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(runAiProofReport_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const deal = (await sql`select * from deals where id = ${data.dealId} limit 1`)[0];
	if (!deal) throw new Error("Deal not found");
	const proof = (await sql`select * from proofs where deal_id = ${deal.id} order by created_at desc limit 1`)[0];
	if (!proof) throw new Error("No proof uploaded");
	const apiKey = process.env.XAI_API_KEY;
	let report;
	let model;
	if (!apiKey) {
		model = "heuristic-fallback";
		report = {
			pass: true,
			confidence: .62,
			checks: {
				wide_shot: Boolean(proof.wide_url),
				closeup: Boolean(proof.closeup_url),
				recap_post: Boolean(proof.recap_post_url)
			},
			notes: "AI unavailable — heuristic attestation. Configure XAI_API_KEY for Grok review.",
			proof_hash: proof.content_hash
		};
	} else {
		model = "grok-4.5";
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model,
				messages: [{
					role: "system",
					content: "You attest Sash delivery proof. Return JSON {pass:boolean,confidence:0-1,checks:{wide_shot,closeup,recap_post},notes:string}"
				}, {
					role: "user",
					content: JSON.stringify({
						dealId: deal.id,
						amount_usdc: deal.amount_usdc,
						proof
					})
				}]
			})
		});
		if (!res.ok) throw new Error(`xAI API error ${res.status}`);
		const m = ((await res.json()).choices[0]?.message.content ?? "{}").match(/\{[\s\S]*\}/);
		report = JSON.parse(m?.[0] ?? "{\"pass\":false}");
	}
	const reportId = newId("air");
	await sql`
      insert into ai_reports (id, deal_id, report, model)
      values (${reportId}, ${deal.id}, ${JSON.stringify(report)}::jsonb, ${model})
    `;
	const deadline = new Date(Date.now() + 1728e5).toISOString();
	const attestation = {
		reportId,
		signed_by: context.userId,
		signed_at: (/* @__PURE__ */ new Date()).toISOString(),
		policy: "AI recommends, policy attests, Anchor enforces",
		report,
		proof_hash: proof.content_hash
	};
	await sql`
      update deals set
        status = 'attested',
        attestation = ${JSON.stringify(attestation)}::jsonb,
        challenge_deadline = ${deadline},
        updated_at = NOW()
      where id = ${deal.id}
    `;
	return {
		reportId,
		attestation,
		challengeDeadline: deadline
	};
});
var challengeDeal_createServerFn_handler = createServerRpc({
	id: "f1d9340e4cd8e6f77b84d989a39936c69c419c92c558fdbc3f2b337d769fea97",
	name: "challengeDeal",
	filename: "src/lib/sash/server.ts"
}, (opts) => challengeDeal.__executeServer(opts));
var challengeDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(challengeDeal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const deal = (await sql`select * from deals where id = ${data.dealId} limit 1`)[0];
	if (!deal) throw new Error("Deal not found");
	if (deal.status !== "attested") throw new Error("Only attested deals can be challenged");
	if (deal.buyer_user_id !== context.userId) throw new Error("Only the buyer can challenge");
	await sql`
      insert into disputes (id, deal_id, opener_user_id, reason, status)
      values (${newId("dsp")}, ${deal.id}, ${context.userId}, ${data.reason}, ${"open"})
    `;
	await sql`
      update deals set status = 'challenged', updated_at = NOW() where id = ${deal.id}
    `;
	return { ok: true };
});
var releaseDeal_createServerFn_handler = createServerRpc({
	id: "c29dad3b47aabe42153433921f9b3cb84035641344481027ea01e6ad60c8b2af",
	name: "releaseDeal",
	filename: "src/lib/sash/server.ts"
}, (opts) => releaseDeal.__executeServer(opts));
var releaseDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(releaseDeal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const deal = (await sql`select * from deals where id = ${data.dealId} limit 1`)[0];
	if (!deal) throw new Error("Deal not found");
	if (!["attested", "challenged"].includes(deal.status) && !data.force) throw new Error("Deal not ready for release");
	if (deal.status === "attested" && deal.challenge_deadline) {
		const ready = new Date(deal.challenge_deadline).getTime() <= Date.now();
		const me = await sql`
        select role from sash_users where user_id = ${context.userId}
      `;
		if (!ready && me[0]?.role !== "admin" && !data.force) throw new Error("Challenge window still open");
	}
	if (deal.status === "challenged" && !data.force) throw new Error("Challenged deals need admin resolution");
	const amount = num(deal.amount_usdc);
	const fee = amount * (deal.platform_fee_bps || 500) / 1e4;
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
	return {
		ok: true,
		sellerShare,
		fee,
		releaseTx
	};
});
var refundDeal_createServerFn_handler = createServerRpc({
	id: "b6a6908e7b6ec9c56e74bcc26c8cf55fec395f5e4dfbaa70250ffa02b7535310",
	name: "refundDeal",
	filename: "src/lib/sash/server.ts"
}, (opts) => refundDeal.__executeServer(opts));
var refundDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(refundDeal_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const deal = (await sql`select * from deals where id = ${data.dealId} limit 1`)[0];
	if (!deal) throw new Error("Deal not found");
	const me = await sql`
      select role from sash_users where user_id = ${context.userId}
    `;
	if (!(deal.buyer_user_id === context.userId || deal.seller_user_id === context.userId || me[0]?.role === "admin")) throw new Error("Not authorized");
	if (![
		"locked",
		"proof_submitted",
		"attested",
		"challenged"
	].includes(deal.status)) throw new Error("Deal cannot be refunded in this state");
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
	if (deal.status === "challenged") await sql`
        update disputes set status = 'refunded', resolution = ${data.reason ?? "refund"}, resolved_at = NOW()
        where deal_id = ${deal.id} and status = 'open'
      `;
	return {
		ok: true,
		refundTx
	};
});
var getMyDeals_createServerFn_handler = createServerRpc({
	id: "167bd746fe7234af5c28187e16ddb57a384087eaec4e48532ea17f035b96b0a0",
	name: "getMyDeals",
	filename: "src/lib/sash/server.ts"
}, (opts) => getMyDeals.__executeServer(opts));
var getMyDeals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyDeals_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select d.*, l.title as listing_title, s.zone
      from deals d
      join listings l on l.id = d.listing_id
      join slots s on s.id = d.slot_id
      where d.buyer_user_id = ${context.userId} or d.seller_user_id = ${context.userId}
      order by d.created_at desc
    `).map((r) => ({
		...r,
		attestation: r.attestation ?? null
	}));
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "142b8cef83a75e14feeb6e12148ecdc00e65a321cae9fa3bfdbea98bb1ecdbc6",
	name: "adminOverview",
	filename: "src/lib/sash/server.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await sql`
      insert into sash_users (user_id, role) values (${context.userId}, ${"user"})
      on conflict (user_id) do nothing
    `;
	const counts = await sql`
      select
        (select count(*)::int from listings) as listings,
        (select count(*)::int from deals) as deals,
        (select count(*)::int from deals where status = 'challenged') as disputed,
        (select count(*)::int from deals where status = 'locked') as locked
    `;
	const recent = await sql`
      select * from deals order by created_at desc limit 20
    `;
	const ledger = await sql`
      select id, deal_id, kind, amount_usdc, tx_sig, note, created_at
      from ledger_entries order by created_at desc limit 30
    `;
	return {
		counts: counts[0],
		recent: recent.map((r) => ({
			...r,
			attestation: r.attestation ?? null
		})),
		ledger,
		treasury: TREASURY_PUBKEY,
		usdcMint: USDC_MINT,
		escrowMode: "treasury_ledger",
		note: "Anchor program not deployed — public ledger attests movements. Set SASH_TREASURY + verify txs on Solana explorer."
	};
});
//#endregion
export { adminOverview_createServerFn_handler, challengeDeal_createServerFn_handler, createDeal_createServerFn_handler, getDeal_createServerFn_handler, getDraftByToken_createServerFn_handler, getEventBySlug_createServerFn_handler, getListing_createServerFn_handler, getMyDeals_createServerFn_handler, getMyProfile_createServerFn_handler, importTweetDraft_createServerFn_handler, listLiveListings_createServerFn_handler, lockDeal_createServerFn_handler, publishDraft_createServerFn_handler, refundDeal_createServerFn_handler, releaseDeal_createServerFn_handler, runAiProofReport_createServerFn_handler, submitProof_createServerFn_handler, upsertMyProfile_createServerFn_handler };
