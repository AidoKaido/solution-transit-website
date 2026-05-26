# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing website for **Solution Transit** — a Cameroon-based import/transit/logistics company (Douala, Bonapriso). All copy is in French; EN translation is wired through an in-page toggle. Hosted on Vercel as a flat static site.

No build system, no package manager, no tests. Edit HTML/CSS/JS directly and `git push` — Vercel auto-deploys.

## Commands

```bash
# Local preview — any static server works:
python -m http.server 8000      # then open http://localhost:8000
# or just open index.html in a browser

# Deploy: commit and push to the connected GitHub repo
git add . && git commit -m "..." && git push
```

There is no lint, test, or build step. `vercel.json` configures clean URLs (`/blog/foo` resolves to `/blog/foo.html`) and aggressive immutable caching on `/assets/*`.

## Architecture — things you can't see from a single file

### Shared chrome is duplicated, not included
Every page inlines its own copy of the promo bar, nav, footer, and sticky WhatsApp button. There are **16 HTML files** that need synchronized changes: 7 root pages (`index`, `services`, `how-it-works`, `success-stories`, `about`, `blog`, `devis`) + 9 blog articles in `blog/`. When changing nav links, footer links, social URLs, or the promo bar — update all 16. The homepage is the canonical reference for the chrome markup.

### Path convention for blog articles
Files in `blog/` are one folder deep, so every internal href and asset src uses `../` prefix (`../index.html`, `../assets/images/logo.png`, `../assets/js/i18n.js`). When duplicating chrome from a root page to a blog article (or vice-versa), every path must be adjusted.

### CTAs all go to `devis.html`
The 3-step quote funnel at `devis.html` is the single conversion endpoint. There is **no** `contact.html` — it was intentionally removed. Any CTA that suggests "contact us" should link to `devis.html`. The header CTA button, hero CTAs, footer column items, and end-of-article CTAs all point there.

### i18n system (`assets/js/i18n.js`)
Custom lightweight runtime translation. ~156 keys, FR + EN dicts. Elements get translated via `data-i18n="key"` (innerHTML), `data-i18n-placeholder="key"` (input placeholders), or `data-i18n-aria="key"` (aria-labels). If the value contains HTML, it's set as `innerHTML`; otherwise as `textContent`. Lang preference is persisted in `localStorage` under `st_lang`. **Adding new translatable copy requires editing both the `fr` and `en` dictionaries** — strings without a matching key stay untranslated.

### Forms — FormSubmit.co + honeypot
All `<form>` elements POST to `https://formsubmit.co/solutionstransit@yahoo.fr` with these required hidden inputs:
- `_cc` → `ivanovsuarez123@gmail.com` (second recipient)
- `_subject`, `_template=table`, `_captcha=true`
- `_honey` (the honeypot — bots fill it, humans don't; CSS class `.honeypot` hides it off-screen)

Field `name` attributes (`Nom`, `WhatsApp`, `Email`, `Produit`, `Origine`, `Volume`, `Mode`, `Message`) become the column labels in FormSubmit's email template, so don't rename them casually.

### 3-step funnel (`devis.html` + `assets/js/funnel.js`)
Steps are progressively disclosed. Current order: **Vous → Projet → Expédition** (Step 1 collects identity, Step 2 the project, Step 3 the shipment). The funnel JS:
- Validates required fields per step before allowing `.btn--next` to advance
- Hides the back button on step 1
- On the form's `submit`, checks the honeypot, then if `data-ajax="true"` it does a `fetch()` POST and shows `.funnel-success`; otherwise it lets the normal POST submit happen

If you reorder steps, update the `.fp-label` text in `.funnel-progress`, the `step-count` text ("Étape X / 3"), and put the `type="submit"` button on the **last** step (the others use `type="button"` with `.btn--next`).

### Design system (`assets/css/main.css`)
Single CSS file, ~1188 lines, sectioned with `/* ---------- Section ---------- */` banners. Notable variables:

- `--accent: #1E2A85` — logo navy blue; primary CTA color
- `--ochre: #E8A639` — used for icons sitting on dark navy backgrounds (blue-on-navy has too little contrast)
- `--bg: #F4F1EA` — cream body background

**Section background utilities** create visual rhythm between blocks on the same page: `.bg-paper` (white), `.bg-cream`, `.bg-soft`, `.bg-alt` (darker cream), `.bg-ink` (dark navy + auto-inverted text colors). Alternate them across consecutive sections — that's the dominant pattern across pages.

**Brand-mark behavior**: `.brand-text` is `display:none` in the header (logo-only nav) but `display:block` in the footer (logo + "Solution Transit" + tagline). Don't add the brand text back to the header — it was intentionally removed for the bigger logo treatment.

### Sticky WhatsApp is currently off
`.sticky-whatsapp` has `display: none !important;` near the top of its CSS rule. To re-enable, remove that one line — every page already has the `<a class="sticky-whatsapp">` markup at the bottom of its `<body>`.

### Staff photos hot-swap
The team section uses `<img src="assets/images/staff/team-{1..4}.jpg" onerror="...">` with text-initial placeholders that show only if the image fails to load. Drop new files at those paths to replace the placeholders — no markup changes needed.

### Real social URLs
Always use the real handles (not `#`):
- Facebook: `https://www.facebook.com/Solutionstransit`
- Instagram: `https://www.instagram.com/solutionstransit`
- TikTok: `https://www.tiktok.com/@solutionstransit`
- LinkedIn: `https://cm.linkedin.com/in/solutions-transit-943511402`

### Award/year facts that appear in copy
The "19 ans d'expérience" number and the 7 award rows (Prix de célérité CDA Transport maritime 2016/2012/2011, Diplôme Commissaire en Douane Agréé 2012/2011, Certificat Label Qualité 2011, Prix de célérité Conseil National des Chargeurs 2009) are real distinctions — keep them consistent across `index.html` (Awards section) and `about.html`.

## Known cruft (safe to clean up if asked)

- Root-level PNGs (`Commissaire-en-douane.png`, `Responsable-logistiaue.png`, `directeur-generale.png`, `responsable-clientele.png`) — leftover staff portrait uploads; the working files are renamed in `assets/images/staff/`
- Empty `pages/` folder at the repo root — leftover scaffolding
