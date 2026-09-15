import { Link } from "@tanstack/react-router";
import { UserButton, SignedIn, SignedOut } from "@/lib/auth/gates";
import { SASH } from "@/lib/sash/constants";
import { cn } from "@/lib/utils";

export function SashShell({
  children,
  dark = false,
  className,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(dark && "dark", "min-h-dvh bg-paper text-ink dark:bg-ink dark:text-paper")}>
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/85 backdrop-blur-md dark:border-paper/10 dark:bg-ink/85">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/art/logo.jpg"
              alt=""
              className="h-8 w-8 rounded-lg object-cover shadow-border"
              width={32}
              height={32}
            />
            <span className="font-display text-lg tracking-tight">{SASH.name}</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <Link
              to="/e/$slug"
              params={{ slug: "token2049" }}
              className="rounded-lg px-2.5 py-2 text-muted hover:text-ink dark:text-muted-dark dark:hover:text-paper"
            >
              Token2049
            </Link>
            <Link
              to="/import"
              className="hidden rounded-lg px-2.5 py-2 text-muted hover:text-ink sm:inline dark:text-muted-dark dark:hover:text-paper"
            >
              Import
            </Link>
            <Link
              to="/me"
              className="rounded-lg px-2.5 py-2 text-muted hover:text-ink dark:text-muted-dark dark:hover:text-paper"
            >
              Me
            </Link>
            <SignedOut>
              <Link
                to="/login"
                className="rounded-xl bg-sash px-3 py-2 font-medium text-white hover:bg-sash-2"
              >
                Sign in
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </header>
      <div className={cn(className)}>{children}</div>
      <footer className="mt-16 border-t border-ink/8 px-4 py-10 text-sm text-muted dark:border-paper/10 dark:text-muted-dark">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SASH.domain} ·{" "}
            <a className="text-sash hover:underline" href={SASH.xUrl} target="_blank" rel="noreferrer">
              {SASH.handle}
            </a>
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.18em]">
            AI recommends · policy attests · Anchor enforces
          </p>
        </div>
      </footer>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "locked" || status === "LOCKED" ? "bg-sash/15 text-sash-2 dark:text-sash-glow"
    : status === "open" || status === "OPEN" || status === "live" ? "bg-ok/15 text-ok"
    : status === "refunded" || status === "challenged" ? "bg-danger/15 text-danger"
    : "bg-ink/8 text-muted dark:bg-paper/10 dark:text-muted-dark";
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em]",
        tone,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
