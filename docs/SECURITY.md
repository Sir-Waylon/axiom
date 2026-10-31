# Security

Honest summary: a static site cannot be made unhackable. What we do:
- Strict Content-Security-Policy, HSTS, COOP/CORP and related headers (`_headers`).
- No third-party trackers. Practice data and personalization stay on the device.
- Account passwords are hashed server-side (PBKDF2 plus pepper); cookies are `__Host-`, HttpOnly, SameSite.
- Google ID tokens are verified for audience.

Report vulnerabilities privately through GitHub Security Advisories. Do not post secrets in issues.
