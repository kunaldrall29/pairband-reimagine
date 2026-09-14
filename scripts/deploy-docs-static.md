# Deploying docs.pairband.com

`docs.pairband.com` is the **pairband-docs** Vercel project. It must serve the
prebuilt Docusaurus output in `docs-static/` — never the TanStack app.

## Build static output

```bash
cd docs-site && npm ci && npm run build
rm -rf ../docs-static && cp -a build ../docs-static
```

## Safe production deploy (no monorepo leak)

Deploy only `docs-static` contents. Do **not** curl the full GitHub tarball into
the docs project without wiping non-docs files — that previously poisoned
production (app HTML on docs) and leaked `AGENTS.md` / `DEMO.md`.

Recommended pattern (MCP `deploy_to_vercel` / file deploy):

1. `framework: null`
2. `installCommand`: extract **only** `docs-static/` from the repo (or upload a `docs-static.tgz`)
3. `buildCommand`: copy those files into `.vercel/output/static` and write a minimal `config.json`
4. `outputDirectory`: `.vercel/output/static`
5. Confirm after deploy:
   - `https://docs.pairband.com/` title contains `Introduction`
   - `/business-model`, `/vault-agent`, `/quickstart` return 200
   - `/AGENTS.md` returns **404**

Aliases that must stay on this project: `docs.pairband.com`, `pairband-docs.vercel.app`.
