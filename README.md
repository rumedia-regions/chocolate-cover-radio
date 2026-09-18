# Chocolate Cover Radio — GitHub Pages / PWA

Production frontend for the Chocolate Cover Radio station-launch portal.

## Architecture

GitHub Pages/PWA is the visible frontend.

Apps Script remains the backend and keeps the existing business logic,
Google Sheets/Drive access, authorization and sessions.

The browser does **not** call `google.script.run` directly.
A hidden Apps Script bridge iframe receives JSON RPC messages with `postMessage`
and invokes the existing server functions inside the Apps Script environment.
This avoids exposing the Apps Script UI and avoids browser CORS/redirect problems.

## Files

- `index.html` — static Chocolate UI
- `styles.css` — approved responsive UI
- `app.js` — approved application logic + GitHub RPC bridge
- `config.js` — Apps Script `/exec` URL
- `manifest.webmanifest` — PWA manifest
- `sw.js` — static-shell service worker
- icons — PWA assets
- `.nojekyll` — GitHub Pages
- `AppsScript_Bridge.html` — add to Apps Script as HTML file named `Bridge`
- `AppsScript_Code_REPLACE.gs` — replacement for the current Code.gs shown during migration

## Required Apps Script deployment

1. In Apps Script, create an HTML file named **Bridge**.
2. Paste the contents of `AppsScript_Bridge.html`.
3. Replace the current `Code.gs` contents with `AppsScript_Code_REPLACE.gs`
   **only if your current Code.gs is the same one supplied for this migration**.
   If Code.gs contains additional code not present there, keep that code and replace
   only `doGet`/`include` with the bridge-enabled versions.
4. Save.
5. Deploy → Manage deployments → edit the current Web app deployment → New version.
6. Execute as: **Me**.
7. Who has access: use the same access setting as the currently working portal.
8. Copy the final URL ending with `/exec`.
9. Paste it into `config.js`.

## GitHub Pages

Repository:
`https://github.com/rumedia-regions/chocolate-cover-radio`

Expected Pages URL:
`https://rumedia-regions.github.io/chocolate-cover-radio/`

Upload the files from the ZIP to the repository root, then:

Settings → Pages → Source: Deploy from a branch → Branch: `main` → `/ (root)`.

## Service worker policy

Only same-origin static GitHub assets are cached.

The service worker does not intercept or cache:
- Apps Script bridge traffic
- authentication responses
- session tokens
- Google Drive files
- user/station API data

## Updating the app

When publishing a frontend update:
1. update asset query versions in `index.html` if needed;
2. bump `CACHE_NAME` in `sw.js`;
3. commit/upload;
4. reload the PWA once online.
