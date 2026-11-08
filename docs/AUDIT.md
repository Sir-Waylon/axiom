# Multi-perspective audit

**Read this first.** This audit was written by the AI that built the app, reviewing it from twelve professional viewpoints. It is a structured self-review, not an opinion from real specialists. Have real people in these roles look before relying on it, especially for student data, wellbeing and legal questions.

Status key: Fixed, Open, Needs a human.

## Cybersecurity
- Fixed: nicknames are temporary and cleaned on the server; game data is dropped about 10 minutes after a game ends.
- Fixed: native pop-ups replaced with in-app dialogs (no reliance on browser dialogs).
- Open: confirm the `PEPPER` secret is set the same on both Workers.
- Needs a human: privacy and children's-data review (COPPA/FERPA/district policy) by the school or district.

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
