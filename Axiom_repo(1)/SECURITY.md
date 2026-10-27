# Security notes (honest version)

This is a static website: all code and questions are delivered to the browser, so a determined user can always read or change them. What is in place:

- Strict Content Security Policy (no inline scripts, same-origin only), no third-party scripts, no tracking, no cookies, no network calls after load.
- Security headers (`_headers`): nosniff, no referrer, frame-ancestors none, permissions policy off.
- Progress is saved only in the browser (localStorage) with a tamper-evident checksum; edited saves are discarded. XP and coins are range-checked against questions answered. This stops casual edits, not a skilled attacker.
- Coins are cosmetic only, so there is nothing of practical value to hack.
- Backup and friend codes are checksummed text; they contain no personal data.
- Service worker caches the app for offline use and updates when a new version is published.

For true tamper-proof scoring you would need a server that checks answers. That is not possible on static hosting.
