# Pairband Docs

Production documentation for [Pairband](https://pairband.com) — the Arc launchpad with USDC bonding curves, locked AMM liquidity, and an on-chain CLOB.

Built with [Docusaurus 3](https://docusaurus.io/) and `@docusaurus/preset-classic`.

## Local development

```bash
cd docs-site
npm install
npm start
```

Opens the dev server (default port 3000). Docs are served at `/` via `routeBasePath: '/'`.

## Build

```bash
npm run build
npm run serve   # preview production build locally
```

Output directory: `build/`

## Deploy to docs.pairband.com (Vercel)

1. **Import** this folder as a Vercel project (monorepo root: set **Root Directory** to `docs-site`).
2. **Framework preset:** Docusaurus (or Other — build command below).
3. **Build settings:**
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `build`
4. **Domain:** add `docs.pairband.com` in Vercel → Settings → Domains and point DNS (CNAME to `cname.vercel-dns.com` or Vercel nameservers).
5. **Environment:** none required for static docs. `docusaurus.config.ts` sets `url: https://docs.pairband.com` and `baseUrl: /`.

### Optional: deploy hook

Connect the GitHub repo so pushes to `main` auto-deploy. Preview deployments run on pull requests.

## Project structure

```
docs-site/
├── docs/              # Markdown documentation
├── src/css/custom.css # Pairband brand theme
├── static/img/        # Logo and static assets
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

## Brand

- Background: `#F5F5F2`
- Text: `#1A1A1A`
- Accent: `#3D9B8F` / `#4FB3A5`
- Fonts: Manrope, IBM Plex Mono

## License

Documentation follows the Pairband project license. Protocol contracts are unaudited — testnet first.
