-- Sash marketplace schema + Token2049 seed

CREATE TABLE IF NOT EXISTS sash_users (
  user_id TEXT PRIMARY KEY,
  x_user_id TEXT,
  x_handle TEXT,
  display_name TEXT,
  wallet_pubkey TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT,
  starts_on DATE,
  ends_on DATE,
  theme TEXT NOT NULL DEFAULT 'light',
  hero_image TEXT,
  blurb TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  seller_user_id TEXT,
  seller_x_handle TEXT,
  title TEXT NOT NULL,
  item_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  referral_code TEXT,
  cover_image TEXT,
  source_tweet_url TEXT,
  source_tweet_author_id TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS slots (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  zone TEXT NOT NULL,
  pricing_mode TEXT NOT NULL DEFAULT 'fixed',
  price_usdc NUMERIC(18, 6) NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  url TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  tweet_url TEXT,
  tweet_author_id TEXT,
  tweet_author_handle TEXT,
  tweet_text TEXT,
  event_slug TEXT,
  ai_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  draft_link_token TEXT NOT NULL UNIQUE,
  bot_replied BOOLEAN NOT NULL DEFAULT FALSE,
  bot_reply_note TEXT,
  created_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id),
  slot_id TEXT NOT NULL REFERENCES slots(id),
  buyer_user_id TEXT,
  seller_user_id TEXT,
  amount_usdc NUMERIC(18, 6) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  logo_url TEXT,
  escrow_mode TEXT NOT NULL DEFAULT 'treasury_ledger',
  lock_tx TEXT,
  release_tx TEXT,
  refund_tx TEXT,
  challenge_deadline TIMESTAMPTZ,
  proof_hash TEXT,
  attestation JSONB,
  platform_fee_bps INT NOT NULL DEFAULT 500,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bids (
  id TEXT PRIMARY KEY,
  slot_id TEXT NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  bidder_user_id TEXT,
  amount_usdc NUMERIC(18, 6) NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  funded BOOLEAN NOT NULL DEFAULT FALSE,
  fund_tx TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proofs (
  id TEXT PRIMARY KEY,
  deal_id TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  uploader_user_id TEXT,
  wide_url TEXT,
  closeup_url TEXT,
  recap_url TEXT,
  recap_post_url TEXT,
  notes TEXT,
  content_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_reports (
  id TEXT PRIMARY KEY,
  deal_id TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  report JSONB NOT NULL DEFAULT '{}'::jsonb,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
  id TEXT PRIMARY KEY,
  deal_id TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  opener_user_id TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id TEXT PRIMARY KEY,
  deal_id TEXT,
  kind TEXT NOT NULL,
  amount_usdc NUMERIC(18, 6) NOT NULL,
  from_pubkey TEXT,
  to_pubkey TEXT,
  tx_sig TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_event ON listings(event_id);
CREATE INDEX IF NOT EXISTS idx_slots_listing ON slots(listing_id);
CREATE INDEX IF NOT EXISTS idx_deals_listing ON deals(listing_id);
CREATE INDEX IF NOT EXISTS idx_drafts_token ON drafts(draft_link_token);

-- Seed events
INSERT INTO events (id, slug, name, city, starts_on, ends_on, theme, hero_image, blurb)
VALUES
  (
    'evt_token2049',
    'token2049',
    'Token2049 Singapore',
    'Singapore',
    '2026-10-07',
    '2026-10-08',
    'light',
    '/art/hero.jpg',
    'Marina Bay Sands. Side events and travel days count if the listing says so.'
  ),
  (
    'evt_breakpoint',
    'breakpoint',
    'Breakpoint',
    'TBD',
    NULL,
    NULL,
    'dark',
    '/art/hallway.jpg',
    'Solana Breakpoint hub — dark theme preview. Listings open closer to the event.'
  )
ON CONFLICT (id) DO NOTHING;

-- Seed seller placeholder (unowned until claimed)
INSERT INTO sash_users (user_id, x_user_id, x_handle, display_name, wallet_pubkey, role)
VALUES
  ('seed_sgfloorwalker', 'x_seed_1', 'sgfloorwalker', 'SG Floorwalker', NULL, 'seller'),
  ('seed_lunaonchain', 'x_seed_2', 'lunaonchain', 'Luna Onchain', NULL, 'seller'),
  ('seed_boothcrew', 'x_seed_3', 'boothcrew', 'Booth Crew', NULL, 'seller')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO listings (
  id, event_id, seller_user_id, seller_x_handle, title, item_type, description, status,
  featured, referral_code, cover_image, source_tweet_url, source_tweet_author_id, published_at
) VALUES
(
  'lst_hoodie_floor',
  'evt_token2049',
  'seed_sgfloorwalker',
  'sgfloorwalker',
  'Hoodie · floor + side events',
  'hoodie',
  'Black techwear hoodie on the Token2049 floor and two side events. Chest and sleeve zones priced separately.',
  'live',
  TRUE,
  'T2049-FLOOR',
  '/art/hoodie.jpg',
  'https://x.com/sgfloorwalker/status/seed1',
  'x_seed_1',
  NOW()
),
(
  'lst_dress_nights',
  'evt_token2049',
  'seed_lunaonchain',
  'lunaonchain',
  'Slip dress · two nights',
  'dress',
  'Silk slip dress for opening night and afterparty. Front panel auction; hem fixed.',
  'live',
  TRUE,
  'T2049-LUNA',
  '/art/dress.jpg',
  'https://x.com/lunaonchain/status/seed2',
  'x_seed_2',
  NOW()
),
(
  'lst_tote_cap',
  'evt_token2049',
  'seed_boothcrew',
  'boothcrew',
  'Tote + cap booth kit',
  'tote',
  'Canvas tote and structured cap for booth roaming. Laptop lid slot optional add-on.',
  'live',
  FALSE,
  'T2049-BOOTH',
  '/art/cap.jpg',
  'https://x.com/boothcrew/status/seed3',
  'x_seed_3',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO slots (id, listing_id, zone, pricing_mode, price_usdc, status, sort_order) VALUES
  ('slt_h_chest', 'lst_hoodie_floor', 'Chest', 'fixed', 420, 'locked', 1),
  ('slt_h_sleeve', 'lst_hoodie_floor', 'Right sleeve', 'fixed', 90, 'open', 2),
  ('slt_h_back', 'lst_hoodie_floor', 'Back panel', 'fixed', 260, 'open', 3),
  ('slt_d_front', 'lst_dress_nights', 'Front', 'auction', 350, 'open', 1),
  ('slt_d_hem', 'lst_dress_nights', 'Front hem', 'fixed', 140, 'open', 2),
  ('slt_t_front', 'lst_tote_cap', 'Tote front', 'fixed', 180, 'open', 1),
  ('slt_t_cap', 'lst_tote_cap', 'Cap front', 'fixed', 120, 'open', 2),
  ('slt_t_laptop', 'lst_tote_cap', 'Laptop lid', 'fixed', 200, 'open', 3)
ON CONFLICT (id) DO NOTHING;

-- Demo locked deal on hoodie chest (shows LOCKED before print path)
INSERT INTO deals (
  id, listing_id, slot_id, buyer_user_id, seller_user_id, amount_usdc, status,
  logo_url, escrow_mode, lock_tx, platform_fee_bps
) VALUES (
  'deal_demo_locked',
  'lst_hoodie_floor',
  'slt_h_chest',
  NULL,
  'seed_sgfloorwalker',
  420,
  'locked',
  '/art/sticker.jpg',
  'treasury_ledger',
  'DEMO_LOCK_SIG_PLACEHOLDER',
  500
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ledger_entries (id, deal_id, kind, amount_usdc, from_pubkey, to_pubkey, tx_sig, note)
VALUES (
  'led_demo_1',
  'deal_demo_locked',
  'lock',
  420,
  'BUYER_DEMO',
  'SASH_TREASURY',
  'DEMO_LOCK_SIG_PLACEHOLDER',
  'Seeded locked escrow for Token2049 demo'
) ON CONFLICT (id) DO NOTHING;
