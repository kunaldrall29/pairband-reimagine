export type ListingStatus = "draft" | "live" | "paused" | "archived";
export type SlotStatus = "open" | "locked" | "proof_due" | "released" | "refunded";
export type DealStatus =
  | "pending_payment"
  | "locked"
  | "proof_submitted"
  | "attested"
  | "challenged"
  | "released"
  | "refunded";

export type EventRow = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  starts_on: string | null;
  ends_on: string | null;
  theme: string;
  hero_image: string | null;
  blurb: string | null;
};

export type ListingRow = {
  id: string;
  event_id: string;
  seller_user_id: string | null;
  seller_x_handle: string | null;
  title: string;
  item_type: string;
  description: string | null;
  status: string;
  featured: boolean;
  referral_code: string | null;
  cover_image: string | null;
  source_tweet_url: string | null;
  source_tweet_author_id: string | null;
  published_at: string | null;
};

export type SlotRow = {
  id: string;
  listing_id: string;
  zone: string;
  pricing_mode: string;
  price_usdc: string | number;
  status: string;
  sort_order: number;
};

export type DealRow = {
  id: string;
  listing_id: string;
  slot_id: string;
  buyer_user_id: string | null;
  seller_user_id: string | null;
  amount_usdc: string | number;
  status: string;
  logo_url: string | null;
  escrow_mode: string;
  lock_tx: string | null;
  release_tx: string | null;
  refund_tx: string | null;
  challenge_deadline: string | null;
  proof_hash: string | null;
  attestation: unknown;
  platform_fee_bps: number;
  created_at: string;
  updated_at: string;
};

export type DraftRow = {
  id: string;
  tweet_url: string | null;
  tweet_author_id: string | null;
  tweet_author_handle: string | null;
  tweet_text: string | null;
  event_slug: string | null;
  ai_payload: unknown;
  status: string;
  draft_link_token: string;
  bot_replied: boolean;
  bot_reply_note: string | null;
  created_by_user_id: string | null;
  created_at: string;
};

export type ListingWithSlots = ListingRow & {
  slots: SlotRow[];
  event_slug?: string;
  event_name?: string;
};
