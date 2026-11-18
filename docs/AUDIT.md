# Multi-perspective audit

**Read this first.** This audit was written by the AI that built the app, reviewing it from twelve professional viewpoints. It is a structured self-review, not an opinion from real specialists. Have real people in these roles look before relying on it, especially for student data, wellbeing and legal questions.

Status key: Fixed, Open, Needs a human.

## Cybersecurity
- Fixed: nicknames are temporary and cleaned on the server; game data is dropped about 10 minutes after a game ends.
- Fixed: native pop-ups replaced with in-app dialogs (no reliance on browser dialogs).
- Open: confirm the `PEPPER` secret is set the same on both Workers.
- Needs a human: privacy and children's-data review (COPPA/FERPA/district policy) by the school or district.

## Educator access code
- Added: Me > Educator access. A code (only its salted SHA-256 hash is in the source) unlocks tools to skip the placement check, preview each learning plan, unlock every cosmetic and add coins. It is client-side, so treat it as a convenience and not a security boundary. It only changes progress saved on that device, shows a red DEV MODE badge while on, and turning it off takes the added looks and coins back.
- Needs a human: keep the code private; anyone who has it can use it, and a leaked code can only be replaced by changing the hash in `engine3/dev.js`.

## Web development
- Fixed: sideways scroll and clipped icons across 17 screen sizes; Escape closes menus.
- Fixed: mission crash when a lesson card was included; mock-test progress bar did not move.
- Open: Firefox and Safari have not been run yet. The GitHub Actions matrix in each repo does this on its next run.

## Electrical engineering / Physics
- Open: Quanta labs are free-roam but simplified (ideal wires, no air drag unless stated). Each lab should state its assumptions on screen.

## Mathematics / College professor
- Open: question and proof audit is partial; extend Apex toward AP Statistics, multivariable calculus and Calculus III.

## Elementary, middle and high school teachers
- Open: grade 5-6 on-ramps and more Foundation and Bridge questions.
- Open: printable worksheets.

## Child psychologist / Psychiatrist / Addiction specialist
- Fixed: rewards are cosmetic only; odds are shown; no hidden modifiers.
- Fixed: sleep-first bonus and after-school coin hours; no late-night streak pressure.
- Open: daily caps on coins and a "done for today" screen should be reviewed by a specialist.

## Education professor
- Fixed: research table linked to features (see RESEARCH.md).
- Open: no outcome study; collect pre/post scores before claiming effects.

## Accessibility
- Fixed: dialogs have roles and labels and close with Escape.
- Open: screen-reader pass with a real device.

## Security, technical and legal audit, November 17, 2026
Scope: the full client bundle, the accounts and friends API, headers, privacy and terms, and the features added this month (practice screen, packs, friend polling, username suggestions, print sheets, lesson deep dives). Method: code reading, grep for dangerous sinks, backend test suite (all pass), browser load tests on all four trainers, stubbed end-to-end test of friend requests.

Security
- Fixed: state merged from local storage, cloud saves and backup files could carry `__proto__`, `constructor` or `prototype` keys and alter the state object; those keys are now skipped.
- Checked: no `eval`, `new Function`, `document.write` in the app; user-supplied names (usernames, nicknames) are escaped or limited to `[a-z0-9_]` before being placed in HTML; new code (choice chips, print sheets, friend banner, suggestions) uses `textContent` or `esc()`.
- Checked: CSP still forbids inline scripts and third-party hosts other than Google sign-in; new files are bundled, so no policy change was needed. Printing uses the browser's own print dialog; nothing is uploaded.
- New API routes: `GET /api/friends/ping` (own data only, two small queries) and `GET /api/friends/suggest` (sign-in plus a username required, rate limited to 90 per hour, 3 to 16 characters, LIKE patterns escaped, prefix or one-typo matches only, at most 5 results). Trade-off: suggestions let a signed-in user test whether a username exists, which the friend-request route deliberately hides. The rate limit makes bulk guessing slow; accounts are for students 13 and up and usernames are already shown to friends and in leagues. Open: if this is a concern, restrict suggestions to people in the same class or league.
- Open: the server cannot verify answers (the question bank lives in the browser), so XP and league scores can be cheated by a determined user; this is documented in ONLINE_PLAY.md and XP per sync is capped server-side.
- Open: set the `PEPPER` secret on the Workers project, add the production origins to the Google OAuth client, and rotate the pepper only with a plan for password resets.

Technical
- Fixed: duplicated "back" header on library pages; the two "How sure?" rows that were both injected into the practice footer; footer overlapping the question on small phones; break timer counted time away from the site.
- Added: arrangement caching (an answer order is never repeated back to back), duplicate removal inside a session, and recent-question spreading across sessions (already in the coach).
- Added: polling for friend requests only while the tab is visible and signed in (every 10 seconds); stops when hidden. Cost is about 2 small D1 reads per poll, which suits a class-size group on the free plan; revisit with Durable Objects/WebSockets if usage grows past a few hundred concurrent students.
- Open: Firefox, Safari and iOS were not available in the test environment; only Chromium was exercised. Run the manual checklist in docs/ACCESSIBILITY.md on real devices.

Legal and policy
- Fixed: the site said it avoids loot boxes while the shop has random cosmetic packs. The statement now says what is true: packs cost only coins earned by studying, can never be bought with money, hold cosmetics only, publish their drop rates (tables in the shop), guarantee a rare character within a set number of packs, and say when a seasonal pack leaves the shop.
- Fixed: the earlier note "odds are shown" was not true until the odds tables were added this month; the tables use the same numbers the game rolls with.
- Updated: privacy policy (November 17, 2026) now lists the letters typed into "Add a friend" and the 10-second request check.
- Checked: no real-money purchases, no ads, no trackers; students 13 and up; guests store nothing off-device; account deletion exists. Character names and art are original; no third-party game characters, logos or Science Olympiad materials are copied. "Science Olympiad" is used only to describe the events the content prepares for; a trademark and non-affiliation notice was added to the footer of every site page on November 17, 2026 (it did not exist before this audit).
- Open (needs a person): school-district review of the student-data terms (California student privacy laws apply to operators of services used for school purposes), a named contact email on a domain the coach controls, and counsel review of the privacy policy and terms before wider distribution.
- Open: Frostbyte season packs use limited-time framing; keep the window long and avoid countdown pressure, and have a specialist review before adding more seasonal content.

## Apex honors audit (Nov 17 2026): Algebra 2 / Trigonometry for PAUSD Math Validation
Scope: topics fn, qd2, pl, ra, ex, lg, sq, tc, tg, ti, iv, id, tl, cn, pp (2,009 questions before this pass).
Findings (script: audit_honors.py in the kit):
- Every question was typed-answer; no multiple choice, ordering or matching in the honors range.
- 936 solutions were under 50 characters (answer without reasoning); about 126 short answers rely on text keys.
- Thin coverage of identities (30), inverse trig (58), angle formulas (54) relative to their weight on honors exams.
- Few level-3 (exam-hardest) items in iv, id, ti, cn.
Action: src/mkhonors.py generates verified items (answers computed with Python math, never hand-typed), merged by applyextra into apex-math. First batch = 109 questions (82 typed, 23 multiple choice, 2 ordering, 2 matching) across 14 topics, each with concept-first multi-step solutions.
Still open: expand thin existing solutions (936), more level-3 items, and a pass comparing topic order with the PAUSD honors course outline. The Geometry Honors textbook and symbolic logic slides remain reference only.
