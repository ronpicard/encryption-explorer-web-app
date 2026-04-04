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
| `npm run lint` | Run ESLint |

## Deploy (GitHub Pages)

The repo includes [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). It builds on every push to `main` and publishes `dist/` to Pages.

1. On GitHub: **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
2. Push `main` (including the workflow and `vite.config.js` changes). Check **Actions** for the run; when it finishes, the site is at `https://<your-username>.github.io/encryption-explorer-web-app/`.
3. If your repository name is not `encryption-explorer-web-app`, edit `repoName` in `vite.config.js` so it matches the repo (path segment after `github.io`).

Local builds use base `/` so `npm run preview` works. CI sets `CI=true`, so the published build uses `/encryption-explorer-web-app/` asset paths.

## Project layout

- `src/App.jsx` — Shell: topic navigation, sorting (by time / by strength), topic panels
- `src/cryptoTopics.js` — Topic copy, code samples, metadata
- `src/CryptoDemos.jsx` — Cipher visuals (Caesar, substitution, Vigenère, Feistel round, AES round, etc.)
- `src/CryptoInternetVisuals.jsx` — RSA / quantum / PQC–style explainer visuals
- `src/InventionGlobe.jsx` — Lazy-loaded 3D globe for geographic context
- `src/LiveCodeRunner.jsx` + `src/codeRunners.js` — Safe evaluation of topic snippets in the browser

## License

Private project (`"private": true` in `package.json`). Adjust if you publish the repo.
