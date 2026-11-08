# Axiom

Part of **Voltaxis**, a family of free study trainers (Skyvolt and Axiom). Free, open study trainers for Science Olympiad Division B students and anyone learning along: **Vertex** (Algebra 1 to Honors Geometry), **Apex** (Algebra 2, Trigonometry, Precalculus, Intro Calculus) and **Quanta** (electrical engineering and physics).

Short lessons, typed answers, worked solutions, interactive question types, and practice that adapts to each student. Everything runs in the browser. Progress and personalization stay on the device unless the student signs in to sync.

> **AI-generated content.** The lessons, questions and code were produced with AI assistance and checked with automated tests, but they may still contain mistakes. Please read the [AI disclosure](<Axiom_repo/ai-disclosure/index.html>) and report errors through Issues.

## Layout
- `Axiom_repo/` the static site (the folder Cloudflare serves)
- `backend/` account API (`worker.js`, `functions/`) and the D1 `schema.sql`; configured by `wrangler.jsonc`
- `docs/` deployment, accounts, security, learning design, accessibility
- `source/` question-bank and engine sources used to build the site


## Contributing and safety
See `CONTRIBUTING.md` and `SECURITY.md`. Questions about a wrong answer? Open an issue using the template.

## License
Code MIT, content CC BY-NC (see `LICENSE`).
