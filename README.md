# Reformed Thinking

**Open / share:** https://jdhier12-bit.github.io/reformed-thinking/

Ask a theological question; see the Calvinist answer (Calvin's *Institutes*, Beveridge 1845), the Lutheran answer (Book of Concord, Triglot 1921; public-domain Luther translations), the KJV verses behind each, and a comparison. Free, no accounts.

- Installable web app (PWA): iPhone — Safari ▸ Share ▸ Add to Home Screen; Android/Chrome — "Install app".
- `sw.js` service worker: network-first for the app shell (updates arrive on next open), versioned cache-first for the source texts (offline). Bump `VERSION` in `sw.js` and the `?v=` strings in `index.html` on each deploy.
- `rag.js`: on-device full-text search (BM25) + optional on-device AI summaries (WebLLM, Llama 3.2 1B) that are filtered to remove any quote or citation not found in the retrieved passages.
- Data: `data/topics.json` (30 curated topics, every quote verified word-for-word by `kb/build.py`), `data/src-*.json` (chunked source texts), `data/kjv.json`.
