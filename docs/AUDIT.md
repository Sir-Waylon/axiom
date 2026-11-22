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

## Automatic explanations after a wrong answer (Nov 18 2026)
- Behaviour: a wrong answer shows "Not yet" for about one second, then the review opens by itself (not in mock exams, untimed no-feedback sessions, or auto-advance mode).
- engine3/why.js adds, above the step-by-step solution: (1) a diagnosis of the likely slip for numeric answers (sign, factor of 2, power of ten, degrees vs radians, reciprocal, off by one, rounding); (2) the subject mental model, analogy and common trap from engine3/whydata.js (written per topic for all Apex and Quanta topics; Circuit and Meteorology reuse the lesson "Go deeper" text); (3) a small animated picture for topics where motion helps (balance, slope, growth, area, parabola, right triangle, unit circle, sine wave, limit, derivative, integral, histogram, projectile, pendulum, travelling wave, vectors, current loop, pressure); animations are removed when reduced-motion is on.
- "How I learn" switch: Picture / Steps / Story / Quick, saved on the device (S.lp). A second miss on the same question switches the style on purpose and says so.
- Limitations: the picture set is generic per topic (not per question); Circuit/Meteorology topics without a matching lesson card show no concept text; no per-option explanation of why a chosen wrong choice is wrong yet.

## Nov 18 follow-up
- "Go deeper" on lesson cards: cards with no card-level text (all Apex cards except 11, all Quanta except 5) now show a Topic overview (mental model, analogy, trap, animated picture) from whydata.js, labelled "topic overview" so it is not mistaken for card-specific text. Card-level text still takes priority.
- Rounded corners: one scale (12 small, 16 medium, 20 large, pill) appended to app.css.
- Accent colour is inlined in each trainer's head so the first paint no longer flashes the old purple.

## KaTeX (Nov 18 2026)
- Loaded from jsDelivr, pinned to 0.16.11, in each trainer head (CSS + two deferred scripts). engine3/math.js typesets new screens as they appear (MutationObserver, throttled, no re-render loop). Delimiters: \( \), \[ \], $$ $$. Single $ is not a delimiter (money questions).
- Not used: the integrity="sha384-..." values supplied in the request. They are not valid SRI digests, and a wrong digest makes the browser refuse the file, so math would never load. To add SRI, copy the real hashes from https://katex.org/docs/browser or compute them from the downloaded files and add them to the three tags in build_open.py.
- The inline onload="renderMathInElement(...)" from the snippet cannot run under our CSP (no inline scripts); math.js does the same job.
- CSP now allows https://cdn.jsdelivr.net/npm/katex@0.16.11/ for script, style and fonts. Privacy page lists jsDelivr. Offline/blocked: plain text remains.
- Safer later option: self-host KaTeX under engine3/vendor and drop the third-party host (students' IPs would then never reach a CDN).
- Content migration still to do: existing questions use Unicode (x², √, π). Write new maths as \(x^2\) and convert gradually.

## Apex honors batch 2 (Nov 18 2026)
src/mkhonors2.py: 75 more computed items (41 level 2, 34 level 3): composition, inverses, transformations, even/odd, vertex form, complex modulus and conjugates, remainder/factor theorem, end behaviour, rational equations and domains, half-life, change of base, log equations with extraneous roots, geometric sums, recursive sequences, sigma notation, radian conversion, graph equations from amplitude/period, half-angle and double-angle, inverse trig ranges, Law of Sines/Cosines choice, conic equations, polar and parametric. Types: 49 typed, 22 multiple choice, 3 select-all, 1 ordering. Honors-range total added so far: 184 (batch 1 + 2). Regression: all four trainers bad = 0.
Note: numeric tolerance `tol` is relative, so rounded decimals with small values need tol of about 0.004.
Still open: thin solutions on the original 936, matching items in batch 2, and an outline check against the PAUSD honors syllabus.

## Thin Apex solutions (Nov 18 2026)
src/mkenrich.py adds a concept-first "Idea:" step to very short solutions, chosen by question shape (46 rules: Vieta, percent growth, half-life, log meaning, arithmetic vs geometric sequences, sectors, asymptotes, polar to rectangular, and so on). 803 of the 936 thin honors-range solutions now start with the idea; 141 remain thin and need hand-written reasoning. The lead-ins are general to the problem type and never state anything about the specific numbers.

## Nov 20: adaptive lessons, tolerance fix, KaTeX loading
- Lessons now adapt to mastery (engine3/session.js `lessonMode`): **new** = card → worked example (stepwise reveal) → easy try; **build** = card → try; **review** (lesson done, or ≥8 answers at ≥75%) = retrieval first, the card returns as a "Refresher" only after a miss, then one stretch question.
- Meteorology numeric tolerances written as absolute (±1) were read as relative (wind chill −35 accepted 0 to −70). Converted with `at()` in src_met/q_gen.py.
- KaTeX is injected from math.js after page load, so a stalled CDN cannot delay first paint or DOMContentLoaded (tested with a hanging CDN: interactive in ~300 ms).
- Lessons also open (new mode) with a "big idea" card and end with a "watch out" trap card from WHY[unit]; WHY now covers all Circuit and Meteorology units too.
- src/qaudit.py checks packs for duplicate options, bad tokens, tolerance range, match/order sanity. Fixed: in Meteorology the correct MCQ option was the longest in 84% of questions; 354 options rewritten (src/audit_met/zlenfix.json, sorts after m*.json so it applies to the generated xm ids), now 24% (chance). Also removed 3 duplicate questions and fixed ambiguous match items (Meteorology hurricane names, Apex tg-xh1068 periods).

## Nov 20: sign-in every time
- Trainers show a full-screen sign-in gate (accounts.js `gate()`, focus-trapped, rest of the page `inert`) whenever the API is reachable and nobody is signed in. If the API cannot be reached (offline, file://), the gate is skipped and progress stays on the device.
- Sessions are browser-session cookies (no Max-Age) and expire server-side after 8 h (`SESSION_TTL`); sign-out clears both cookies. Backend tests pass.
- Site: "Create an account" CTAs are now "Sign in" (and become "Sign out" when signed in); guest mode wording removed from the account, privacy and terms pages. Account creation stays available as a link inside the sign-in form.
- Limit: the gate is a UI gate (the study content is a static public file). The API enforces sign-in for server data.

## Nov 20: multiplayer menus and Arcade
- Join / Versus / Host menus restyled Kahoot-style (engine3/widgets.css): colour-coded cards, big code box, centered, no horizontal overflow at 390 px.
- engine3/arcade.js: Gold Quest (chests with published odds, bot-labelled leaderboard, pirate-ambush forced questions), Boss Raid (attack questions; every third turn a timed "dodge" question), Rocket Run (tap falling stars; gates stop the run and force a question). Reduced motion respected; keys 1-4 answer; coins are cosmetic only. Reachable from Play → Solo, Practice and the online menu.
- Limit: arcade modes run on the device against labelled bots; class/versus rooms still use the server-synchronised quiz (the server scores only correct/incorrect and time).
- Bug found by the centering audit: the Profile page threw (`metacog.js cal()` expected S.cal keys 1-3, `lock.js` creates {g,t,s}). cal() now fills missing keys. Layout audit (t130.js) of every tab and Me sub-page at 390/820/1280 px: all blocks symmetric, no overflow.

## Nov 21: offline math, cross-trainer progress, sister links
- engine3/math.js: if KaTeX cannot load (CDN blocked/offline) after ~6 s, LaTeX is converted to readable Unicode (`plainTeX`: fractions, roots, powers, subscripts, Greek, relations). Tested with the CDN aborted.
- Bug fixed: the startup sanity check wiped XP and coins to 0 when coins > 2×XP + 20 (online/arcade coin rewards could trigger it). It now only clamps impossible values.
- Level counter verified: need(l)=40l²+60l; Level = l+1; ring % and "XP to next" correct at boundaries; level-up modal fires once.
- New `GET /api/xp` (per-pack XP for the account). Me/Profile/header show a combined "Voltaxis level" across trainers; progress, looks and streak refresh when the tab regains focus (max once per 45 s). Both sites share the D1 database `voltaxis-accounts`, so one account works on Skyvolt and Axiom (each site still signs in separately because cookies are per site).
- Skyvolt ↔ Axiom links: footer sentence + landing band on the sites, "More from Voltaxis" row in the Me tab. The sister URL is the current host name with `skyvolt`↔`axiom` swapped; set `meta.sisterUrl` if the real domains differ.

## Nov 21 — privacy policy
Rewrote guest-mode text (sign-in is now required), added shared Skyvolt/Axiom account, shop/odds, anti-abuse counters, no-E2E-encryption, parent/teacher deletion, breach notice; fixed 30-day session claim (8h). Backend: rate-limit keys are now peppered SHA-256 hashes (previously raw IP/login id).

## Nov 21 — mega audit, part 1
- Site pages (both sites, 8+ pages each at 360/768/1280, axe-core WCAG 2.2 AA + best practice, 370 links): fixed trainer pages having no h1 and weak titles, a low-contrast link in the landing note, tiny checkboxes.
- Questions: arithmetic recheck of 2,286 worked equations (0 real errors); show/value match on 4,057 numeric keys (0); expert read of 210 stratified questions found 4 certain issues.
- Real bug class found and fixed: for prefixed units (mA, kΩ, ms, µF, kWh) some answers were stored in the displayed unit while the grader expects base units, so a correct typed answer could be marked wrong and the "Answer:" line was nonsense (e.g. 20000 ms). `src/unitfix.py` now normalises at build (21 Circuit questions). Fuse-rating questions now list the standard ratings (exact match); binary-sum answers graded exactly; est-014/kvl-092/cir-031 keys corrected; cir-151 reason fixed; Apex wording fixes (lm-010, sr-009, ra-123, tc-098).
- Not changed (judgement calls): some Quanta/Apex items go beyond Division B (calculus, Gauss's law); a few level labels look one step high.

## Nov 22 — mega audit, part 2
- CSP: both sites and all four trainers load with the production Content-Security-Policy and produce zero violations (all tabs, arcade, online menu).
- Backend review: parameterized SQL only, double-submit CSRF plus Origin check, per-route rate limits (keys now hashed), PBKDF2-SHA256 100k (the Workers maximum) with per-user salt and pepper, body-size caps, 8 h sessions. No findings.
- Cross-browser: Firefox/WebKit cannot be installed in the build sandbox, so only Chromium was run. Static audit: every modern CSS feature has a fallback (added one for the Host/Versus tile gradients). Real-device check on Safari/iOS and Firefox is still recommended.
- Site: added top-right search (client-side, over pages and topic names), breadcrumbs on inner pages, and fixed zero side gutters on phones (header, legal pages, hero) that the symmetry test could not see.
- Docs: README/ACCOUNTS deploy steps now describe Workers (not Pages).
