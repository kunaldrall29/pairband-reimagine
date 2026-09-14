-- Pairband mainnet waitlist (unowned rows — no auth).
-- Wallet + interest only; no emails/names (auth-off DB rule).
create table if not exists waitlist (
  id            serial primary key,
  wallet        text not null,
  interest      text not null check (interest in ('launch', 'trade')),
  project_name  text,
  x_handle      text,
  pitch         text,
  created_at    timestamptz not null default now()
);

create unique index if not exists waitlist_wallet_interest_uidx
  on waitlist (wallet, interest);

create index if not exists waitlist_created_at_idx on waitlist (created_at desc);
