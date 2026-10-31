# The GM's Ledger

An interactive accounting and finance course for general managers, following BraceWorks Medical, a medical device maker and exporter in the Philippines. In English and Traditional Chinese (Taiwan).

The course is an installable web app: open the site, then use your browser's **Install** or **Add to Home Screen**. It works offline after the first visit, and progress is saved on each device.

## How it's built

- `src/`: the course. `shell.html` is the engine and interface; there is one file per module (`m01.js` … `m28.js`), plus shared content (capstone, practice packs, glossary, diagrams, stories, tools).
- `src/i18n/zh-TW/`: the Traditional Chinese edition, a translated copy of each content file. `src/ui_strings.js` holds the interface wording in both languages.
- `i18n_work/terms_zh-TW.tsv`: the agreed English → Taiwan accounting terminology. Use it for any change to the Chinese edition.
- `templates/`: the downloadable Excel templates.

```
python3 build.py      # builds dist/gm-ledger.html (claude.ai version) and dist/gm-ledger-standalone.html
python3 make_pwa.py   # packages the standalone build as the web app in site/
```

Commit and push `site/`; the **Publish web app** workflow deploys it to GitHub Pages.

Any change to the English course needs the matching change in `src/i18n/zh-TW/`.

## One-time setup

Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**. GitHub Pages on a private repository needs a paid GitHub plan.
