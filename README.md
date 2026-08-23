# Encryption Explorer

Interactive web app that walks through classical and modern ciphers—from Caesar and substitution through Feistel-style DES, AES, RSA, and post-quantum ideas. Each topic includes short history (who / where / when), math summaries, implementation steps, **interactive visuals** (including a 3D globe for invention locations), **editable sample code** with live output, and plain-language notes on classical vs quantum attack angles.

**Educational only.** Rough “break time” figures are teaching aids, not security proofs. For real systems, use Web Crypto and well-vetted libraries.

## Stack

- [React](https://react.dev/) 19 + [Vite](https://vite.dev/) 8
- [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) / [@react-three/drei](https://github.com/pmndrs/drei) for the invention globe

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Production build with the correct `/repo/` base and push `dist/` to the `gh-pages` branch ([gh-pages](https://github.com/tschaub/gh-pages)) |

## Deploy (GitHub Pages)

GitHub only allows **one** Pages source: either **GitHub Actions** or **Deploy from a branch**. Pick one.

### Option A — `npm run deploy` (from your machine)

1. Set **`repository.url`** in `package.json` to your real GitHub repo (default is `https://github.com/ronpicard/encryption-explorer-web-app.git`). The deploy script reads the repo name from that URL for Vite’s `base`.
2. On GitHub: **Settings → Pages → Build and deployment**, set **Source** to **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**. (If you previously chose **GitHub Actions**, switch to this so pushes to `gh-pages` actually go live.)
3. From the project root, with `git` configured and `origin` pointing at GitHub:

   ```bash
   npm run deploy
   ```

   That runs [`scripts/deploy.mjs`](scripts/deploy.mjs): `vite build --base=/<repo>/` then `gh-pages -d dist`.

4. Site URL: `https://ronpicard.github.io/<repository-name>/` (repository name must match `package.json` `repository.url`).

### Option B — GitHub Actions on every push

The repo includes [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). Use **Settings → Pages → Source: GitHub Actions** (not “Deploy from a branch”). Push to `main` (or `master`); check the **Actions** tab if it fails.

For this path, `vite.config.js` uses `GITHUB_REPOSITORY` in CI so `base` matches the repo.

`npm run build` (without deploy) still uses base `/` locally so `npm run preview` works.

## Project layout

- `src/App.jsx` — Shell: topic navigation, sorting (by time / by strength), topic panels
- `src/cryptoTopics.js` — Topic copy, code samples, metadata
- `src/CryptoDemos.jsx` — Cipher visuals (Caesar, substitution, Vigenère, Feistel round, AES round, etc.)
- `src/CryptoInternetVisuals.jsx` — RSA / quantum / PQC–style explainer visuals
- `src/InventionGlobe.jsx` — Lazy-loaded 3D globe for geographic context
- `src/LiveCodeRunner.jsx` + `src/codeRunners.js` — Safe evaluation of topic snippets in the browser

## License

Private project (`"private": true` in `package.json`). Adjust if you publish the repo.

