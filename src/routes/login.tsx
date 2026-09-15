import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { SashShell } from "@/components/sash/shell";
import { SASH } from "@/lib/sash/constants";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <SashShell>
      <main className="mx-auto grid min-h-[70dvh] max-w-md place-items-center px-4 py-16">
        <div className="w-full space-y-5 rise">
          <img src="/art/logo.jpg" alt="" className="h-12 w-12 rounded-xl object-cover" />
          <h1 className="text-3xl">Sign in to {SASH.name}</h1>
          <p className="text-sm text-muted">
            Connect with X to publish listings from your tweets. Then attach a Solana wallet for
            USDC escrow.
          </p>
          {authEnabled ? (
            <div className="space-y-3">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => signIn(p.providerId, { callbackURL: "/me" })}
                  className="w-full min-h-12 rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-left font-medium hover:bg-paper-2"
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
      </main>
    </SashShell>
  );
}
