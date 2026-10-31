# Accounts (optional)

The trainers work fully without accounts. To enable sign-in and friends:

1. Cloudflare dashboard, Storage & Databases, D1, create a database.
2. Run `schema.sql` in the D1 console.
3. Bind the database as `DB` in the Pages project (Settings, Functions, D1 bindings).
4. Add a secret named `PEPPER` (a long random string).
5. For Google sign-in, create an OAuth client ID, add each site origin as an authorized origin, and set the client ID in the site configuration.
6. Set `repo` and `site_url` in `site.config.json` and rebuild to show the repository link.

Passwords are hashed server-side with PBKDF2 and a pepper. Session cookies are `__Host-` prefixed with CSRF protection. Rotate any secret that has been shared in chat or email.
