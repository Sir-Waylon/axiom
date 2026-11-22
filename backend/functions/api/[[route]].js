/* Accounts API for Cloudflare Pages Functions + D1.
   Bindings: DB (D1). Vars/secrets: GOOGLE_CLIENT_ID (optional), PEPPER (secret, required).
   Security: PBKDF2-SHA256 (per-user salt, server pepper), constant-time compare, HttpOnly __Host- session cookie
   (token stored only as SHA-256), double-submit CSRF + Origin check, rate limits, parameterized SQL, strict validation. */
const enc = new TextEncoder();
const J = (o, s = 200, h = {}) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer', 'cross-origin-resource-policy': 'same-origin', ...h } });
const b64 = (u) => btoa(String.fromCharCode(...new Uint8Array(u)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64u = (s) => unb64(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '='));
const rnd = (n) => crypto.getRandomValues(new Uint8Array(n));
const hex = (u) => [...new Uint8Array(u)].map((x) => x.toString(16).padStart(2, '0')).join('');
const sha = async (s) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const ITER = 100000;
const BAD_WORDS = ['fuck', 'shit', 'bitch', 'nigg', 'fag', 'cunt', 'dick', 'porn', 'sex', 'rape', 'nazi', 'kill', 'admin', 'mod_'];
const COMMON = ['password12', '1234567890', 'qwertyuiop', 'iloveyou12', 'password123', 'letmein123', '0123456789', 'abcdefghij'];

async function pbk(pw, salt, pepper, iter = ITER) {
  const k = await crypto.subtle.importKey('raw', enc.encode(pw + '\u0000' + pepper), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, k, 256));
}
function ceq(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; }
async function hashPw(pw, env) { const s = rnd(16); return `pbkdf2$${ITER}$${b64(s)}$${b64(await pbk(pw, s, env.PEPPER))}`; }
async function checkPw(pw, stored, env) { const [, it, s, h] = stored.split('$'); return ceq(await pbk(pw, unb64(s), env.PEPPER, +it), unb64(h)); }

const ok_email = (e) => typeof e === 'string' && e.length <= 254 && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(e);
const ok_user = (u) => typeof u === 'string' && /^[a-z0-9_]{3,16}$/.test(u) && !BAD_WORDS.some((w) => u.includes(w));
const SITE_WORDS = ['voltaxis', 'skyvolt', 'axiom', 'quanta', 'voltaic', 'stratus', 'password', 'olympiad'];
const RUNS = ['qwertyuiopasdfghjklzxcvbnm', 'abcdefghijklmnopqrstuvwxyz', '01234567890'];
const hasRun = (l) => RUNS.some((r) => { const f = r, b = [...r].reverse().join(''); for (let i = 0; i + 5 <= l.length; i++) { const c = l.slice(i, i + 5); if (f.includes(c) || b.includes(c)) return true; } return false; });
/* rules (12+ chars; a number or 16+ chars; no runs, repeats, site words, personal info, common or breached passwords) */
function pwProblem(pw, email, user) {
  if (typeof pw !== 'string' || pw.length < 12) return 'Use at least 12 characters.';
  if (pw.length > 128) return 'Use at most 128 characters.';
  const l = pw.toLowerCase();
  if (!(pw.length >= 16 || (/[a-z]/i.test(pw) && /\d/.test(pw)))) return 'Add a number, or make it 16+ characters (four random words works well).';
  if (new Set(l).size < 6) return 'Use more different characters.';
  if (/(.)\1{3,}/.test(l)) return 'Avoid repeating one character four times in a row.';
  if (hasRun(l)) return 'Avoid runs like 12345 or qwert.';
  if (SITE_WORDS.some((w) => l.includes(w))) return 'Do not use the site name or the word "password".';
  if (COMMON.includes(l)) return 'That password is too common.';
  if (email && l.includes(email.split('@')[0].toLowerCase()) && email.split('@')[0].length > 3) return 'Do not put your email in your password.';
  if (user && l.includes(user)) return 'Do not put your username in your password.';
  return null;
}
/* Have I Been Pwned range API: only the first 5 characters of the SHA-1 leave the Worker (k-anonymity). Fails open. */
async function pwBreached(pw) {
  try {
    const h = hex(await crypto.subtle.digest('SHA-1', enc.encode(pw))).toUpperCase();
    const r = await fetch('https://api.pwnedpasswords.com/range/' + h.slice(0, 5), { headers: { 'Add-Padding': 'true' }, signal: AbortSignal.timeout(2000) });
    if (!r.ok) return false;
    return (await r.text()).split('\n').some((x) => { const [sfx, n] = x.trim().split(':'); return sfx === h.slice(5) && +n > 0; });
  } catch { return false; }
}
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const day = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - day); return t.toISOString().slice(0, 10); }

async function rate(env, key, max, win) {
  key = (await sha((env.PEPPER || '') + '|' + key)).slice(0, 32); // one-way hash: no raw IP or login name is stored
  const now = Math.floor(Date.now() / 1000), w = Math.floor(now / win);
  const r = await env.DB.prepare('SELECT w,n FROM rl WHERE k=?').bind(key).first();
  if (r && r.w === w) { if (r.n >= max) return false; await env.DB.prepare('UPDATE rl SET n=n+1 WHERE k=?').bind(key).run(); }
  else await env.DB.prepare('INSERT INTO rl(k,w,n) VALUES(?,?,1) ON CONFLICT(k) DO UPDATE SET w=excluded.w,n=1').bind(key, w).run();
  return true;
}
/* session cookies: no Max-Age, so the browser forgets them when it closes; the server also expires a session after SESSION_TTL */
const SESSION_TTL = 8 * 3600;
const cookie = (name, val, age, http) => `${name}=${val}; Path=/;${age === null ? '' : ` Max-Age=${age};`} Secure; SameSite=Strict${http ? '; HttpOnly' : ''}`;
function getCookie(req, n) { const m = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(n + '=')); return m ? m.slice(n.length + 1) : null; }

/* ---- schema self-migration: adds email verification and 2FA without a manual D1 step. Existing accounts count as verified. ---- */
let schemaOk = false;
async function ensureSchema(env) {
  if (schemaOk) return;
  try {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS otp(uid INTEGER NOT NULL,kind TEXT NOT NULL,h TEXT NOT NULL,ch TEXT,exp INTEGER NOT NULL,tries INTEGER NOT NULL DEFAULT 0,sent INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(uid,kind))').run();
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS otp_ch ON otp(ch)').run();
    for (const c of ['ver INTEGER NOT NULL DEFAULT 1', 'tfa INTEGER NOT NULL DEFAULT 0']) { try { await env.DB.prepare('ALTER TABLE users ADD COLUMN ' + c).run(); } catch (e) { /* already present */ } }
    schemaOk = true;
  } catch (e) { console.error('schema', e && e.message); }
}
/* ---- email: Mailtrap Email API (MAILTRAP_API_TOKEN) or the Cloudflare EMAIL binding; MAIL_FROM must be on a verified domain ---- */
const mailOk = (env) => !!(env.MAIL_FROM && (env.MAILTRAP_API_TOKEN || env.EMAIL));
async function sendMail(env, to, subject, text, html) {
  if (env.MAILTRAP_API_TOKEN) {
    const m = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(env.MAIL_FROM), from = m ? { email: m[2].trim(), name: m[1].trim() || undefined } : { email: env.MAIL_FROM.trim() };
    const r = await fetch('https://send.api.mailtrap.io/api/send', { method: 'POST', headers: { authorization: 'Bearer ' + env.MAILTRAP_API_TOKEN, 'content-type': 'application/json' }, body: JSON.stringify({ from, to: [{ email: to }], subject, text, html, category: 'account' }), signal: AbortSignal.timeout(6000) });
    if (!r.ok) throw new Error('mail ' + r.status);
    return;
  }
  await env.EMAIL.send({ to, from: env.MAIL_FROM, subject, text, html });
}
/* ---- one-time email codes: 6 digits, 10 minutes, 5 tries, stored only as a peppered hash ---- */
const code6 = () => { const u = new Uint32Array(1); let n; do { crypto.getRandomValues(u); n = u[0]; } while (n >= 4294000000); return String(n % 1000000).padStart(6, '0'); };
const otpHash = (env, uid, kind, code) => sha((env.PEPPER || '') + '|otp|' + uid + '|' + kind + '|' + code);
const WHY = { ver: 'confirm your email', login: 'finish signing in', tfa: 'turn on sign-in codes' };
async function sendOtp(env, uid, email, kind, ch) {
  const row = await env.DB.prepare('SELECT sent FROM otp WHERE uid=? AND kind=?').bind(uid, kind).first();
  if (row && kind !== 'login' && Date.now() - row.sent < 60000) return 'wait';
  const code = code6(), now = Date.now();
  await env.DB.prepare('INSERT INTO otp(uid,kind,h,ch,exp,tries,sent) VALUES(?,?,?,?,?,0,?) ON CONFLICT(uid,kind) DO UPDATE SET h=excluded.h,ch=excluded.ch,exp=excluded.exp,tries=0,sent=excluded.sent').bind(uid, kind, await otpHash(env, uid, kind, code), ch ? await sha(ch) : null, now + 600000, now).run();
  const brand = env.BRAND || 'Voltaxis';
  await sendMail(env, email, brand + ' code: ' + code, 'Your code to ' + WHY[kind] + ' is ' + code + '.\n\nIt works for 10 minutes. If you did not ask for it, ignore this email. Nobody can get in without it.\n', '<p>Your code to ' + WHY[kind] + ':</p><p style="font:700 28px monospace;letter-spacing:6px">' + code + '</p><p style="color:#555">It works for 10 minutes. If you did not ask for it, ignore this email.</p>');
  return 'sent';
}
async function checkOtp(env, uid, kind, code) {
  const row = await env.DB.prepare('SELECT h,exp,tries FROM otp WHERE uid=? AND kind=?').bind(uid, kind).first();
  if (!row || row.exp < Date.now() || row.tries >= 5) return false;
  await env.DB.prepare('UPDATE otp SET tries=tries+1 WHERE uid=? AND kind=?').bind(uid, kind).run();
  if (!/^\d{6}$/.test(String(code || '')) || row.h !== (await otpHash(env, uid, kind, String(code)))) return false;
  await env.DB.prepare('DELETE FROM otp WHERE uid=? AND kind=?').bind(uid, kind).run();
  return true;
}
const maskEmail = (e) => { const [n, d] = e.split('@'); return n.slice(0, 2) + '***@' + d; };
/* ---- Cloudflare Turnstile (CAPTCHA). Off until TURNSTILE_SECRET is set. ---- */
async function captchaOk(env, b, req, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  const tok = String(b.cf || '').slice(0, 2048); if (!tok) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: tok, remoteip: ip }), signal: AbortSignal.timeout(5000) });
    const j = await r.json(); return !!j.success && (!j.hostname || j.hostname === new URL(req.url).hostname);
  } catch { return false; }
}
/* accounts that never confirmed their email are deleted after 7 days (data minimisation) */
async function purgeUnverified(env) {
  const t = Date.now() - 7 * 864e5, sub = '(SELECT id FROM users WHERE ver=0 AND created<?)';
  await env.DB.prepare('DELETE FROM sessions WHERE uid IN ' + sub).bind(t).run();
  await env.DB.prepare('DELETE FROM otp WHERE uid IN ' + sub).bind(t).run();
  await env.DB.prepare('DELETE FROM users WHERE ver=0 AND created<?').bind(t).run();
}
async function newSession(env, uid) {
  const tok = hex(rnd(32)), csrf = hex(rnd(16)), exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  await env.DB.prepare('INSERT INTO sessions(h,uid,exp,csrf) VALUES(?,?,?,?)').bind(await sha(tok), uid, exp, csrf).run();
  await env.DB.prepare('DELETE FROM sessions WHERE uid=? AND h NOT IN (SELECT h FROM sessions WHERE uid=? ORDER BY exp DESC LIMIT 5)').bind(uid, uid).run();
  return { 'set-cookie': [cookie('__Host-sid', tok, null, true), cookie('__Host-csrf', csrf, null, false)] };
}
function withCookies(h) { const r = new Headers(); for (const [k, v] of Object.entries(h)) Array.isArray(v) ? v.forEach((x) => r.append(k, x)) : r.set(k, v); return r; }
function out(o, s, h) { const res = J(o, s); if (h && h['set-cookie']) h['set-cookie'].forEach((c) => res.headers.append('set-cookie', c)); return res; }

async function auth(req, env) {
  const tok = getCookie(req, '__Host-sid'); if (!tok) return null;
  const s = await env.DB.prepare('SELECT s.uid,s.exp,s.csrf,u.username,u.email,u.pub,u.shared,u.ver,u.tfa,(u.pw IS NOT NULL) AS haspw FROM sessions s JOIN users u ON u.id=s.uid WHERE s.h=?').bind(await sha(tok)).first();
  if (!s || s.exp < Date.now() / 1000) return null;
  return s;
}
function csrfOk(req, s) {
  const o = req.headers.get('origin'); if (o && o !== new URL(req.url).origin) return false;
  const hd = req.headers.get('x-csrf'); return !!hd && !!s && hd === s.csrf;
}
async function body(req, max = 8192) { const t = await req.text(); if (t.length > max) throw new Error('big'); try { const o = JSON.parse(t || '{}'); return o && typeof o === 'object' ? o : {}; } catch { throw new Error('json'); } }

/* ---- Google ID token ---- */
let jwks = null, jwksAt = 0;
async function googleVerify(cred, env) {
  if (!env.GOOGLE_CLIENT_ID) throw new Error('nogoogle');
  const [h, p, s] = String(cred).split('.'); if (!s) throw new Error('bad');
  const hd = JSON.parse(new TextDecoder().decode(b64u(h))), pl = JSON.parse(new TextDecoder().decode(b64u(p)));
  if (hd.alg !== 'RS256') throw new Error('alg');
  if (!jwks || Date.now() - jwksAt > 3600e3) { const r = await fetch('https://www.googleapis.com/oauth2/v3/certs'); jwks = (await r.json()).keys; jwksAt = Date.now(); }
  const jwk = jwks.find((k) => k.kid === hd.kid); if (!jwk) throw new Error('kid');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  if (!(await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(s), enc.encode(h + '.' + p)))) throw new Error('sig');
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(pl.iss) || pl.aud !== env.GOOGLE_CLIENT_ID || pl.exp * 1000 < Date.now() || !pl.email_verified || !pl.sub) throw new Error('claims');
  return { sub: pl.sub, email: String(pl.email).toLowerCase() };
}

const clampN = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+v) || 0));
async function meObj(env, s) {
  const saves = (await env.DB.prepare('SELECT pack,xp,upd FROM saves WHERE uid=?').bind(s.uid).all()).results;
  return { username: s.username, email: s.email, needUsername: !s.username, packs: saves, shared: JSON.parse(s.shared || '{}'), pub: JSON.parse(s.pub || '{}'), csrf: s.csrf, verified: s.ver !== 0, tfa: !!s.tfa, canTfa: mailOk(env) && !!s.haspw && s.ver !== 0 };
}

const R = {};
R['POST /signup'] = async (req, env, ip) => {
  if (!(await rate(env, 'su:' + ip, 8, 3600))) return J({ error: 'Too many attempts. Try later.' }, 429);
  const b = await body(req); const email = String(b.email || '').trim().toLowerCase(), user = String(b.username || '').trim().toLowerCase();
  if (!ok_email(email)) return J({ error: 'Enter a valid email.' }, 400);
  if (!ok_user(user)) return J({ error: 'Username: 3-16 letters, numbers or _. Do not use your real name.' }, 400);
  const pr = pwProblem(b.password, email, user); if (pr) return J({ error: pr }, 400);
  if (!(await captchaOk(env, b, req, ip))) return J({ error: 'Please complete the security check.' }, 400);
  if (await pwBreached(b.password)) return J({ error: 'That password appears in known data breaches. Choose a different one.' }, 400);
  const ex = await env.DB.prepare('SELECT 1 FROM users WHERE email=? OR username=?').bind(email, user).first();
  if (ex) return J({ error: 'That email or username is already in use.' }, 409);
  const r = await env.DB.prepare('INSERT INTO users(email,username,pw,created,ver) VALUES(?,?,?,?,?)').bind(email, user, await hashPw(b.password, env), Date.now(), mailOk(env) ? 0 : 1).run();
  const uid = r.meta.last_row_id;
  if (mailOk(env)) { await purgeUnverified(env); try { await sendOtp(env, uid, email, 'ver'); } catch (e) { console.error('verify mail', e && e.message); } } const h = await newSession(env, uid);
  const s = await auth(new Request(req.url, { headers: { cookie: h['set-cookie'][0].split(';')[0] } }), env);
  return out(await meObj(env, s), 200, h);
};
R['POST /login'] = async (req, env, ip) => {
  const b = await body(req); const id = String(b.id || '').trim().toLowerCase();
  if (!(await rate(env, 'li:' + ip, 30, 900)) || !(await rate(env, 'lu:' + id.slice(0, 64), 10, 900))) return J({ error: 'Too many attempts. Wait 15 minutes.' }, 429);
  if (!(await captchaOk(env, b, req, ip))) return J({ error: 'Please complete the security check.' }, 400);
  const u = await env.DB.prepare('SELECT id,pw,email,tfa FROM users WHERE email=? OR username=?').bind(id, id).first();
  const dummy = 'pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$' + b64(new Uint8Array(32));
  const good = await checkPw(String(b.password || '').slice(0, 128), u && u.pw ? u.pw : dummy, env);
  if (!u || !u.pw || !good) return J({ error: 'Wrong email/username or password.' }, 401);
  if (u.tfa && mailOk(env)) { /* 2FA: password was right, now an emailed code finishes the sign-in */
    const ch = hex(rnd(16));
    try { await sendOtp(env, u.id, u.email, 'login', ch); } catch (e) { console.error('2fa mail', e && e.message); return J({ error: 'We could not send your code. Try again in a minute.' }, 503); }
    return J({ need2fa: true, ch, to: maskEmail(u.email) });
  }
  const h = await newSession(env, u.id);
  const s = await auth(new Request(req.url, { headers: { cookie: h['set-cookie'][0].split(';')[0] } }), env);
  return out(await meObj(env, s), 200, h);
};
R['POST /login/2fa'] = async (req, env, ip) => {
  if (!(await rate(env, 'l2:' + ip, 20, 900))) return J({ error: 'Too many attempts. Wait 15 minutes.' }, 429);
  const b = await body(req, 1024), ch = String(b.ch || '');
  if (!/^[a-f0-9]{32}$/.test(ch)) return J({ error: 'That code did not work.' }, 401);
  const row = await env.DB.prepare("SELECT uid FROM otp WHERE kind='login' AND ch=?").bind(await sha(ch)).first();
  if (!row || !(await checkOtp(env, row.uid, 'login', b.code))) return J({ error: 'That code did not work. Check it or sign in again for a new one.' }, 401);
  const h = await newSession(env, row.uid);
  const s = await auth(new Request(req.url, { headers: { cookie: h['set-cookie'][0].split(';')[0] } }), env);
  return out(await meObj(env, s), 200, h);
};
R['POST /google'] = async (req, env, ip) => {
  if (!(await rate(env, 'go:' + ip, 30, 900))) return J({ error: 'Too many attempts.' }, 429);
  const b = await body(req, 4096); let g;
  try { g = await googleVerify(b.credential, env); } catch (e) { return J({ error: e.message === 'nogoogle' ? 'Google sign-in is not set up.' : 'Google sign-in failed.' }, 401); }
  let u = await env.DB.prepare('SELECT id FROM users WHERE gsub=?').bind(g.sub).first();
  if (!u) { u = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(g.email).first(); if (u) await env.DB.prepare('UPDATE users SET gsub=?, pw=NULL, ver=1, tfa=0 WHERE id=?').bind(g.sub, u.id).run(); /* pw cleared: stops pre-registration takeover of an email nobody verified */ }
  if (!u) { const r = await env.DB.prepare('INSERT INTO users(email,gsub,created) VALUES(?,?,?)').bind(g.email, g.sub, Date.now()).run(); u = { id: r.meta.last_row_id }; }
  const h = await newSession(env, u.id);
  const s = await auth(new Request(req.url, { headers: { cookie: h['set-cookie'][0].split(';')[0] } }), env);
  return out(await meObj(env, s), 200, h);
};
R['GET /config'] = async (req, env) => J({ google: env.GOOGLE_CLIENT_ID || null, turnstile: env.TURNSTILE_SITE_KEY || null, verify: mailOk(env), tfa: mailOk(env) });
/* authenticated */
const A = {};
const UNVERIFIED_OK = new Set(['GET /me', 'POST /logout', 'POST /verify', 'POST /verify/resend', 'POST /delete']);
A['GET /me'] = async (req, env, s) => J(await meObj(env, s));
A['POST /verify'] = async (req, env, s) => {
  if (s.ver !== 0) return J({ ok: 1 });
  if (!(await rate(env, 'vc:' + s.uid, 12, 900))) return J({ error: 'Too many tries. Wait 15 minutes.' }, 429);
  const b = await body(req, 512);
  if (!(await checkOtp(env, s.uid, 'ver', b.code))) return J({ error: 'That code did not work. Check it or send a new one.' }, 400);
  await env.DB.prepare('UPDATE users SET ver=1 WHERE id=?').bind(s.uid).run(); return J({ ok: 1 });
};
A['POST /verify/resend'] = async (req, env, s) => {
  if (s.ver !== 0) return J({ ok: 1 });
  if (!mailOk(env)) return J({ error: 'Email is not set up.' }, 503);
  if (!(await rate(env, 'vr:' + s.uid, 6, 3600))) return J({ error: 'Too many emails. Try again in an hour.' }, 429);
  try { return (await sendOtp(env, s.uid, s.email, 'ver')) === 'wait' ? J({ error: 'Wait a minute before asking again.' }, 429) : J({ ok: 1, to: maskEmail(s.email) }); } catch (e) { console.error('verify mail', e && e.message); return J({ error: 'We could not send the email. Try again soon.' }, 503); }
};
A['POST /2fa/start'] = async (req, env, s) => {
  if (!mailOk(env) || !s.haspw) return J({ error: 'Sign-in codes are not available for this account.' }, 400);
  if (!(await rate(env, 'tf:' + s.uid, 6, 3600))) return J({ error: 'Too many emails. Try again in an hour.' }, 429);
  try { return (await sendOtp(env, s.uid, s.email, 'tfa')) === 'wait' ? J({ error: 'Wait a minute before asking again.' }, 429) : J({ ok: 1, to: maskEmail(s.email) }); } catch (e) { console.error('2fa mail', e && e.message); return J({ error: 'We could not send the email. Try again soon.' }, 503); }
};
A['POST /2fa/confirm'] = async (req, env, s) => {
  if (!(await rate(env, 'tc:' + s.uid, 12, 900))) return J({ error: 'Too many tries. Wait 15 minutes.' }, 429);
  const b = await body(req, 512);
  if (!(await checkOtp(env, s.uid, 'tfa', b.code))) return J({ error: 'That code did not work.' }, 400);
  await env.DB.prepare('UPDATE users SET tfa=1 WHERE id=?').bind(s.uid).run(); return J({ ok: 1 });
};
A['POST /2fa/off'] = async (req, env, s) => {
  if (!(await rate(env, 'to:' + s.uid, 8, 900))) return J({ error: 'Too many tries. Wait 15 minutes.' }, 429);
  const b = await body(req, 1024), u = await env.DB.prepare('SELECT pw FROM users WHERE id=?').bind(s.uid).first();
  if (!u || !u.pw || !(await checkPw(String(b.password || '').slice(0, 128), u.pw, env))) return J({ error: 'Wrong password.' }, 401);
  await env.DB.prepare('UPDATE users SET tfa=0 WHERE id=?').bind(s.uid).run(); return J({ ok: 1 });
};
A['POST /logout'] = async (req, env, s) => { await env.DB.prepare('DELETE FROM sessions WHERE uid=? AND csrf=?').bind(s.uid, s.csrf).run(); return out({ ok: 1 }, 200, { 'set-cookie': [cookie('__Host-sid', '', 0, true), cookie('__Host-csrf', '', 0, false)] }); };
A['POST /username'] = async (req, env, s) => {
  const b = await body(req); const user = String(b.username || '').trim().toLowerCase();
  if (s.username) return J({ error: 'Username already set.' }, 400);
  if (!ok_user(user)) return J({ error: 'Username: 3-16 letters, numbers or _. Do not use your real name.' }, 400);
  if (await env.DB.prepare('SELECT 1 FROM users WHERE username=?').bind(user).first()) return J({ error: 'Taken.' }, 409);
  await env.DB.prepare('UPDATE users SET username=? WHERE id=?').bind(user, s.uid).run(); return J({ username: user });
};
A['POST /delete'] = async (req, env, s) => {
  const b = [['DELETE FROM sessions WHERE uid=?'], ['DELETE FROM saves WHERE uid=?'], ['DELETE FROM weekly WHERE uid=?'], ['DELETE FROM notify WHERE uid=?'], ['DELETE FROM otp WHERE uid=?'], ['DELETE FROM friends WHERE a=? OR b=?', 2], ['DELETE FROM users WHERE id=?']];
  for (const [q, n] of b) await env.DB.prepare(q).bind(...Array(n || 1).fill(s.uid)).run();
  return out({ ok: 1 }, 200, { 'set-cookie': [cookie('__Host-sid', '', 0, true), cookie('__Host-csrf', '', 0, false)] });
};
A['POST /sync'] = async (req, env, s) => {
  if (!(await rate(env, 'sy:' + s.uid, 120, 3600))) return J({ error: 'Slow down.' }, 429);
  const b = await body(req, 400000);
  const pack = String(b.pack || ''); if (!/^[a-z0-9-]{3,40}$/.test(pack)) return J({ error: 'bad pack' }, 400);
  const st = b.state; if (!st || typeof st !== 'object' || typeof st.xp !== 'number' || st.xp < 0 || st.xp > 5e6) return J({ error: 'bad state' }, 400);
  const prev = await env.DB.prepare('SELECT xp,upd FROM saves WHERE uid=? AND pack=?').bind(s.uid, pack).first();
  const now = Date.now(), days = prev ? Math.max(1, (now - prev.upd) / 864e5) : 7;
  const maxGain = Math.ceil(2500 + 2500 * days); /* plausibility: the server cannot see answers, so it bounds how fast XP can grow */
  let xp = Math.round(st.xp);
  if (prev && xp > prev.xp + maxGain) return J({ error: 'Progress looks unusual and was not saved.' }, 422);
  const data = JSON.stringify(st); if (data.length > 380000) return J({ error: 'too big' }, 413);
  const gain = Math.max(0, xp - (prev ? prev.xp : xp));
  await env.DB.prepare('INSERT INTO saves(uid,pack,data,xp,upd) VALUES(?,?,?,?,?) ON CONFLICT(uid,pack) DO UPDATE SET data=excluded.data,xp=excluded.xp,upd=excluded.upd').bind(s.uid, pack, data, xp, now).run();
  if (gain) await env.DB.prepare('INSERT INTO weekly(uid,wk,xp) VALUES(?,?,?) ON CONFLICT(uid,wk) DO UPDATE SET xp=xp+excluded.xp').bind(s.uid, weekKey(), Math.min(gain, 3000)).run();
  const sh = b.shared && typeof b.shared === 'object' ? b.shared : null, pu = b.pub || {};
  const pub = { av: String(pu.av || 'a0').slice(0, 4), lv: clampN(pu.lv, 1, 200), st: clampN(pu.st, 0, 2000) };
  if (sh) { const sj = JSON.stringify(sh); if (sj.length < 20000) await env.DB.prepare('UPDATE users SET shared=?,pub=? WHERE id=?').bind(sj, JSON.stringify(pub), s.uid).run(); }
  else await env.DB.prepare('UPDATE users SET pub=? WHERE id=?').bind(JSON.stringify(pub), s.uid).run();
  return J({ ok: 1, upd: now });
};
/* XP per trainer for this account, so every trainer can show one combined level */
A['GET /xp'] = async (req, env, s) => {
  const rows = (await env.DB.prepare('SELECT pack,xp FROM saves WHERE uid=?').bind(s.uid).all()).results;
  const packs = {}; let total = 0; for (const r of rows) { packs[r.pack] = r.xp; total += r.xp; }
  return J({ total, packs });
};
A['GET /save'] = async (req, env, s) => {
  const pack = new URL(req.url).searchParams.get('pack') || ''; if (!/^[a-z0-9-]{3,40}$/.test(pack)) return J({ error: 'bad pack' }, 400);
  const r = await env.DB.prepare('SELECT data,upd FROM saves WHERE uid=? AND pack=?').bind(s.uid, pack).first();
  return J(r ? { state: JSON.parse(r.data), upd: r.upd } : { state: null });
};
async function friendList(env, uid) {
  const rows = (await env.DB.prepare(`SELECT f.a,f.b,f.status,u.id uid,u.username,u.pub FROM friends f JOIN users u ON u.id=CASE WHEN f.a=? THEN f.b ELSE f.a END WHERE f.a=? OR f.b=?`).bind(uid, uid, uid).all()).results;
  const wk = weekKey(), ids = rows.filter((r) => r.status === 'ok').map((r) => r.uid).concat([uid]);
  const xp = {}, wx = {};
  for (const id of ids) { xp[id] = (await env.DB.prepare('SELECT COALESCE(SUM(xp),0) x FROM saves WHERE uid=?').bind(id).first()).x; wx[id] = ((await env.DB.prepare('SELECT xp FROM weekly WHERE uid=? AND wk=?').bind(id, wk).first()) || { xp: 0 }).xp; }
  const card = (id, name, pub) => ({ username: name, ...JSON.parse(pub || '{}'), xp: xp[id] || 0, wk: wx[id] || 0 });
  const me = await env.DB.prepare('SELECT username,pub FROM users WHERE id=?').bind(uid).first();
  return {
    league: [card(uid, me.username, me.pub), ...rows.filter((r) => r.status === 'ok').map((r) => card(r.uid, r.username, r.pub))].map((c) => ({ ...c, me: c.username === me.username })).sort((a, b) => b.wk - a.wk),
    incoming: rows.filter((r) => r.status === 'pending' && r.b === uid).map((r) => ({ username: r.username })),
    outgoing: rows.filter((r) => r.status === 'pending' && r.a === uid).map((r) => ({ username: r.username })),
  };
}
A['GET /friends'] = async (req, env, s) => J(await friendList(env, s.uid));
/* light-weight poll (2 small queries) so a new friend request can pop up within seconds without reloading the full list */
A['GET /friends/ping'] = async (req, env, s) => {
  const inc = (await env.DB.prepare("SELECT u.username FROM friends f JOIN users u ON u.id=f.a WHERE f.b=? AND f.status='pending' LIMIT 20").bind(s.uid).all()).results.map((r) => r.username);
  const n = (await env.DB.prepare("SELECT COUNT(*) c FROM friends WHERE (a=? OR b=?) AND status='ok'").bind(s.uid, s.uid).first()).c;
  return J({ inc, n });
};
/* username suggestions ("did you mean"): prefix matches and one-typo matches only, signed-in users with a username, rate limited */
const lev1 = (a, b) => { if (a === b) return true; if (Math.abs(a.length - b.length) > 1) return false; let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; const x = a.slice(i), y = b.slice(i); return x.length === y.length ? x.slice(1) === y.slice(1) : x.length > y.length ? x.slice(1) === y : y.slice(1) === x; };
A['GET /friends/suggest'] = async (req, env, s) => {
  if (!s.username) return J({ names: [] });
  if (!(await rate(env, 'sg:' + s.uid, 90, 3600))) return J({ names: [] }, 429);
  const q = String(new URL(req.url).searchParams.get('q') || '').trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
  if (q.length < 3 || q.length > 16) return J({ names: [] });
  const esc = (x) => x.replace(/[%_\\]/g, '\\$&');
  const pre = (await env.DB.prepare("SELECT username FROM users WHERE username LIKE ? ESCAPE '\\' AND id<>? LIMIT 5").bind(esc(q) + '%', s.uid).all()).results.map((r) => r.username);
  let names = pre;
  if (names.length < 3) {
    const cand = (await env.DB.prepare("SELECT username FROM users WHERE (username LIKE ? ESCAPE '\\' OR username LIKE ? ESCAPE '\\') AND id<>? LIMIT 150").bind(esc(q.slice(0, 1)) + '%', '%' + esc(q.slice(-3)), s.uid).all()).results.map((r) => r.username);
    names = [...new Set([...pre, ...cand.filter((u) => lev1(q, u))])].slice(0, 5);
  }
  return J({ names });
};
const target = async (env, b) => { const u = String(b.username || '').trim().toLowerCase(); return ok_user(u) ? env.DB.prepare('SELECT id FROM users WHERE username=?').bind(u).first() : null; };
A['POST /friends/request'] = async (req, env, s) => {
  if (!s.username) return J({ error: 'Pick a username first.' }, 400);
  if (!(await rate(env, 'fr:' + s.uid, 20, 3600))) return J({ error: 'Too many requests.' }, 429);
  const t = await target(env, await body(req));
  if (t && t.id !== s.uid) {
    const rev = await env.DB.prepare('SELECT status FROM friends WHERE a=? AND b=?').bind(t.id, s.uid).first();
    if (rev) { if (rev.status === 'pending') await env.DB.prepare("UPDATE friends SET status='ok' WHERE a=? AND b=?").bind(t.id, s.uid).run(); }
    else await env.DB.prepare("INSERT OR IGNORE INTO friends(a,b,status) VALUES(?,?,'pending')").bind(s.uid, t.id).run();
  }
  return J({ ok: 1 }); /* same answer whether or not the user exists: no username probing */
};
A['POST /friends/accept'] = async (req, env, s) => { const t = await target(env, await body(req)); if (t) await env.DB.prepare("UPDATE friends SET status='ok' WHERE a=? AND b=? AND status='pending'").bind(t.id, s.uid).run(); return J(await friendList(env, s.uid)); };
A['POST /friends/remove'] = async (req, env, s) => { const t = await target(env, await body(req)); if (t) await env.DB.prepare('DELETE FROM friends WHERE (a=? AND b=?) OR (a=? AND b=?)').bind(s.uid, t.id, t.id, s.uid).run(); return J(await friendList(env, s.uid)); };

/* ================= Online play: class games + versus (polling over D1; guests allowed) =================
   Honest limits: the question bank lives in the browser, so the server cannot know the right answer. It never trusts a
   client for more than a bounded amount: per-question points are capped, answer times are clamped to what the server
   itself measured, one answer per player per question, late/early answers are rejected. A determined cheater can still
   report "correct" every time. These modes are for fun and class use and only ever award cosmetic coins. */
const CODE_AL = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const mkCode = () => { const r = rnd(6); let s = ''; for (let i = 0; i < 6; i++) s += CODE_AL[r[i] % CODE_AL.length]; return s; };
const NICK_BAD = ['fuck', 'shit', 'bitch', 'nigg', 'fag', 'cunt', 'dick', 'porn', 'sex', 'rape', 'nazi', 'whore', 'slut', 'penis', 'vagin', 'retard', 'kkk', 'hitler', 'anal', 'cock', 'pussy'];
function cleanNick(n) {
  n = String(n == null ? '' : n).replace(/\s+/g, ' ').trim();
  if (!/^[\p{L}\p{N}][\p{L}\p{N} _.'-]{1,15}$/u.test(n)) return null;
  const f = n.toLowerCase().replace(/[^a-z0-9$@!]/g, '').replace(/0/g, 'o').replace(/[1!]/g, 'i').replace(/3/g, 'e').replace(/4|@/g, 'a').replace(/5|\$/g, 's');
  if (NICK_BAD.some((w) => f.includes(w))) return null;
  return n;
}
const okPack = (p) => typeof p === 'string' && /^[a-z0-9-]{3,40}$/.test(p);
const okIds = (a, max) => Array.isArray(a) && a.length >= 1 && a.length <= max && a.every((x) => typeof x === 'string' && /^[A-Za-z0-9._-]{2,40}$/.test(x));
const okAv = (a) => (typeof a === 'string' && /^[a-z0-9]{1,8}$/.test(a) ? a : 'a0');
const cleanLims = (l, n, def) => { const out = []; for (let i = 0; i < n; i++) { const v = Array.isArray(l) ? +l[i] : NaN; out.push(Number.isFinite(v) ? Math.max(8000, Math.min(90000, Math.round(v))) : def); } return out; };
const gTok = () => hex(rnd(16));
const nowMs = () => Date.now();
const ROOM_TTL = 3 * 3600 * 1000, MAX_PLAYERS = 60, SEEN_OK = 15000, LATE_GRACE = 2500;
const MEM = new Map();
function memRate(k, max, win) { const n = nowMs(), e = MEM.get(k); if (!e || n - e.t > win) { MEM.set(k, { t: n, c: 1 }); if (MEM.size > 5000) for (const [kk, v] of MEM) if (n - v.t > win) MEM.delete(kk); return true; } return ++e.c <= max; }
const changed = (r) => (r && r.meta && typeof r.meta.changes === 'number' ? r.meta.changes : 1);
const gtokOf = (req) => { const t = req.headers.get('x-gtok') || ''; return /^[a-f0-9]{32}$/.test(t) ? t : null; };
function h32(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const pr = (s) => (h32(s) % 10007) / 10007;

async function gcOnline(env) {
  const n = nowMs();
  await env.DB.prepare('DELETE FROM room_answers WHERE code IN (SELECT code FROM rooms WHERE exp<?)').bind(n).run();
  await env.DB.prepare('DELETE FROM room_players WHERE code IN (SELECT code FROM rooms WHERE exp<?)').bind(n).run();
  await env.DB.prepare('DELETE FROM rooms WHERE exp<?').bind(n).run();
  await env.DB.prepare('DELETE FROM vs_queue WHERE t<?').bind(n - 90000).run();
}
async function loadRoom(env, code) {
  if (typeof code !== 'string' || !/^[A-Z2-9]{6}$/.test(code)) return null;
  const r = await env.DB.prepare('SELECT * FROM rooms WHERE code=?').bind(code).first();
  if (!r || r.exp < nowMs()) return null;
  try { r.qids = JSON.parse(r.qids); r.lims = JSON.parse(r.lims); } catch { return null; }
  return r;
}
async function who(env, room, tok) {
  const th = await sha(tok), isHost = th === room.host;
  const me = await env.DB.prepare('SELECT * FROM room_players WHERE code=? AND tok=?').bind(room.code, th).first();
  return { th, isHost, me };
}
async function makeRoom(env, o) { /* o: mode, pack, host(hash), qids, lims, state, qi, qat, players:[{nick,tok,av,bot,acc,spd}] */
  for (let a = 0; a < 6; a++) {
    const code = mkCode(), n = nowMs();
    try {
      await env.DB.prepare('INSERT INTO rooms(code,mode,pack,host,qids,lims,state,qi,qat,rat,bots,created,exp) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)')
        .bind(code, o.mode, o.pack, o.host, JSON.stringify(o.qids), JSON.stringify(o.lims), o.state, o.qi, o.qat, 0, o.players.filter((p) => p.bot).length, n, n + ROOM_TTL).run();
    } catch (e) { continue; }
    for (const p of o.players) await env.DB.prepare('INSERT INTO room_players(code,nick,tok,av,bot,acc,spd,seen) VALUES(?,?,?,?,?,?,?,?)').bind(code, p.nick, p.tok, p.av, p.bot ? 1 : 0, p.acc || 0, p.spd || 0, n).run();
    return code;
  }
  throw new Error('code');
}
async function addPts(env, room, p, ok, ms) {
  const lim = room.lims[room.qi] || 20000, streak = ok ? p.streak + 1 : 0;
  const pts = ok ? Math.min(1200, 500 + Math.round(500 * Math.max(0, 1 - ms / lim)) + Math.min(p.streak, 4) * 50) : 0;
  const ins = await env.DB.prepare('INSERT OR IGNORE INTO room_answers(code,pid,qi,ok,ms,pts) VALUES(?,?,?,?,?,?)').bind(room.code, p.id, room.qi, ok ? 1 : 0, ms, pts).run();
  if (changed(ins) < 1) return null; /* one answer per player per question */
  await env.DB.prepare('UPDATE room_players SET score=score+?,right=right+?,streak=?,seen=? WHERE id=?').bind(pts, ok ? 1 : 0, streak, nowMs(), p.id).run();
  return pts;
}
async function botsAnswer(env, room) {
  if (!room.bots || room.state !== 'q') return;
  const n = nowMs(), el = n - room.qat; if (el < 800) return;
  const lim = room.lims[room.qi] || 20000;
  const bs = (await env.DB.prepare('SELECT p.* FROM room_players p WHERE p.code=? AND p.bot=1 AND NOT EXISTS(SELECT 1 FROM room_answers a WHERE a.code=p.code AND a.pid=p.id AND a.qi=?)').bind(room.code, room.qi).all()).results;
  for (const b of bs) {
    const d = Math.max(1500, Math.min(lim - 1500, lim * b.spd * (0.6 + 0.8 * pr(room.code + b.id + 'd' + room.qi))));
    if (el >= d) await addPts(env, room, b, pr(room.code + b.id + 'a' + room.qi) < b.acc, Math.round(d));
  }
}
async function setReveal(env, room) {
  const n = nowMs();
  const r = await env.DB.prepare("UPDATE rooms SET state='reveal',rat=? WHERE code=? AND state='q' AND qi=?").bind(n, room.code, room.qi).run();
  if (changed(r) > 0) { room.state = 'reveal'; room.rat = n; }
  else { const f = await loadRoom(env, room.code); if (f) Object.assign(room, f); }
}
async function maybeReveal(env, room, full) {
  if (room.state !== 'q') return;
  await botsAnswer(env, room);
  const lim = room.lims[room.qi] || 20000, n = nowMs();
  let rev = n - room.qat >= lim + LATE_GRACE;
  if (!rev && (full || room.bots)) {
    const c = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM room_players WHERE code=? AND (bot=1 OR seen>?)) pl,(SELECT COUNT(*) FROM room_answers a JOIN room_players p ON p.id=a.pid WHERE a.code=? AND a.qi=? AND (p.bot=1 OR p.seen>?)) an').bind(room.code, n - SEEN_OK, room.code, room.qi, n - SEEN_OK).first();
    if (c && c.pl > 0 && c.an >= c.pl) rev = true;
  }
  if (rev) await setReveal(env, room);
}
async function nextQ(env, room) { /* from lobby or reveal */
  const n = nowMs(), last = room.qi + 1 >= room.qids.length;
  let r;
  if (room.state === 'lobby') r = await env.DB.prepare("UPDATE rooms SET state='q',qi=0,qat=? WHERE code=? AND state='lobby'").bind(n, room.code).run();
  else if (last) r = await env.DB.prepare("UPDATE rooms SET state='done',rat=?,exp=? WHERE code=? AND state='reveal' AND qi=?").bind(n, n + 600000, room.code, room.qi).run();
  else r = await env.DB.prepare("UPDATE rooms SET state='q',qi=qi+1,qat=? WHERE code=? AND state='reveal' AND qi=?").bind(n, room.code, room.qi).run();
  const f = await loadRoom(env, room.code); if (f) Object.assign(room, f);
  return changed(r) > 0;
}
async function roomView(env, room, w) {
  const n = nowMs(), v = { mode: room.mode, code: room.code, state: room.state, qi: room.qi, n: room.qids.length, lim: room.lims[Math.max(0, room.qi)] || 20000, qat: room.qat, rat: room.rat, t: n, host: w.isHost, player: !!w.me };
  if (room.state === 'q' || room.state === 'reveal') v.qid = room.qids[room.qi];
  if (room.state === 'q') {
    if (w.isHost) { const c = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM room_players WHERE code=?) np,(SELECT COUNT(*) FROM room_answers WHERE code=? AND qi=?) an').bind(room.code, room.code, room.qi).first(); v.np = c.np; v.an = c.an; }
    if (w.me) { const a = await env.DB.prepare('SELECT ok,pts FROM room_answers WHERE code=? AND pid=? AND qi=?').bind(room.code, w.me.id, room.qi).first(); if (a) { v.done = 1; v.mine = { ok: a.ok, pts: a.pts }; } }
    if (room.mode === 'vs') { const o = await env.DB.prepare('SELECT nick,bot,av,score FROM room_players WHERE code=? AND id<>? LIMIT 1').bind(room.code, w.me ? w.me.id : 0).first(); if (o) v.opp = { n: o.nick, b: o.bot, av: o.av, s: o.score }; }
  } else {
    const qi = room.state === 'reveal' ? room.qi : -1;
    const rows = (await env.DB.prepare('SELECT p.nick n,p.score s,p.right r,p.bot b,p.av av,a.ok k,a.pts p FROM room_players p LEFT JOIN room_answers a ON a.pid=p.id AND a.code=p.code AND a.qi=? WHERE p.code=? ORDER BY p.score DESC,p.right DESC,p.id LIMIT ?').bind(qi, room.code, MAX_PLAYERS).all()).results;
    v.players = rows.map((r) => ({ n: r.n, s: r.s, r: r.r, b: r.b, av: r.av, k: r.k === null || r.k === undefined ? null : r.k, p: r.p || 0 }));
  }
  if (w.me) { v.me = { n: w.me.nick, s: w.me.score, r: w.me.right, av: w.me.av }; if (v.players) { const i = v.players.findIndex((x) => x.n === w.me.nick); v.me.rank = i + 1; } }
  return v;
}
const G = {};
G['GET /ping'] = async () => J({ ok: 1, t: nowMs() });
G['POST /room/create'] = async (req, env, ip) => {
  if (!(await rate(env, 'rc:' + ip, 20, 3600))) return J({ error: 'Too many games started from this network. Try again later.' }, 429);
  const b = await body(req, 8000);
  if (!okPack(b.pack) || !okIds(b.qids, 40)) return J({ error: 'Bad game setup.' }, 400);
  const lims = cleanLims(b.lims, b.qids.length, 25000), tok = gTok(), th = await sha(tok);
  let nick = null; if (b.nick !== undefined && b.nick !== null && b.nick !== '') { nick = cleanNick(b.nick); if (!nick) return J({ error: 'Pick a different name (2 to 16 letters or numbers).' }, 400); }
  await gcOnline(env);
  const code = await makeRoom(env, { mode: 'class', pack: b.pack, host: th, qids: b.qids, lims, state: 'lobby', qi: -1, qat: 0, players: nick ? [{ nick, tok: th, av: okAv(b.av) }] : [] });
  return J({ code, tok, host: true, player: !!nick });
};
G['POST /room/join'] = async (req, env, ip) => {
  if (!(await rate(env, 'rj:' + ip, 300, 3600))) return J({ error: 'Too many tries. Wait a bit.' }, 429);
  const b = await body(req, 600), code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const nick = cleanNick(b.nick); if (!nick) return J({ error: 'Pick a different name (2 to 16 letters or numbers).' }, 400);
  const room = await loadRoom(env, code);
  if (!room || room.mode !== 'class') return J({ error: 'No game with that code.' }, 404);
  if (b.pack && b.pack !== room.pack) return J({ error: 'That game is for a different trainer.' }, 409);
  if (room.state === 'done') return J({ error: 'That game has ended.' }, 409);
  const cnt = await env.DB.prepare('SELECT COUNT(*) c FROM room_players WHERE code=?').bind(code).first();
  if (cnt.c >= MAX_PLAYERS) return J({ error: 'That game is full.' }, 409);
  const tok = gTok(), th = await sha(tok);
  try { await env.DB.prepare('INSERT INTO room_players(code,nick,tok,av,seen) VALUES(?,?,?,?,?)').bind(code, nick, th, okAv(b.av), nowMs()).run(); }
  catch (e) { return J({ error: 'That name is taken in this game.' }, 409); }
  return J({ code, tok, pack: room.pack });
};
G['GET /room/state'] = async (req, env) => {
  const tok = gtokOf(req); if (!tok) return J({ error: 'Not in a game.' }, 401);
  const url = new URL(req.url), code = (url.searchParams.get('code') || '').toUpperCase();
  if (!memRate('st:' + tok, 150, 60000)) return J({ error: 'Slow down.' }, 429);
  const room = await loadRoom(env, code); if (!room) return J({ gone: 1, error: 'This game has ended.' }, 404);
  const w = await who(env, room, tok); if (!w.isHost && !w.me) return J({ error: 'Not in this game.' }, 401);
  if (w.me && nowMs() - w.me.seen > 8000) await env.DB.prepare('UPDATE room_players SET seen=? WHERE id=?').bind(nowMs(), w.me.id).run();
  await maybeReveal(env, room, false);
  if (room.mode === 'vs' && room.state === 'reveal' && nowMs() - room.rat >= 3500) await nextQ(env, room);
  return J(await roomView(env, room, w));
};
G['POST /room/answer'] = async (req, env) => {
  const tok = gtokOf(req); if (!tok) return J({ error: 'Not in a game.' }, 401);
  if (!memRate('an:' + tok, 90, 60000)) return J({ error: 'Slow down.' }, 429);
  const b = await body(req, 400), room = await loadRoom(env, String(b.code || '').toUpperCase());
  if (!room) return J({ gone: 1, error: 'This game has ended.' }, 404);
  const w = await who(env, room, tok); if (!w.me) return J({ error: 'Not a player here.' }, 403);
  await maybeReveal(env, room, false);
  if (room.state !== 'q' || room.qi !== (b.qi | 0)) return J({ late: 1, state: room.state, qi: room.qi });
  const lim = room.lims[room.qi] || 20000, n = nowMs(), el = n - room.qat;
  if (el < -300) return J({ late: 1, state: room.state, qi: room.qi });
  const ms = Math.max(500, Math.min(lim, Math.round(+b.ms) || lim, Math.max(500, el + 400)));
  const pts = await addPts(env, room, w.me, b.ok === true || b.ok === 1, ms);
  if (pts === null) return J({ dup: 1 });
  await maybeReveal(env, room, true);
  return J({ ok: 1, pts, state: room.state });
};
G['POST /room/next'] = async (req, env) => {
  const tok = gtokOf(req); if (!tok) return J({ error: 'Not in a game.' }, 401);
  const b = await body(req, 300), room = await loadRoom(env, String(b.code || '').toUpperCase());
  if (!room || room.mode !== 'class') return J({ gone: 1, error: 'This game has ended.' }, 404);
  const w = await who(env, room, tok); if (!w.isHost) return J({ error: 'Only the host can do that.' }, 403);
  if (room.state === 'lobby') { const c = await env.DB.prepare('SELECT COUNT(*) c FROM room_players WHERE code=?').bind(room.code).first(); if (!c.c) return J({ error: 'Wait for at least one player to join.' }, 409); await nextQ(env, room); }
  else if (room.state === 'q') await setReveal(env, room);
  else if (room.state === 'reveal') await nextQ(env, room);
  return J(await roomView(env, room, w));
};
G['POST /room/end'] = async (req, env) => {
  const tok = gtokOf(req); if (!tok) return J({ error: 'Not in a game.' }, 401);
  const b = await body(req, 300), room = await loadRoom(env, String(b.code || '').toUpperCase());
  if (!room) return J({ ok: 1 });
  const w = await who(env, room, tok); if (!w.isHost && !(room.mode === 'vs' && w.me)) return J({ error: 'Only the host can do that.' }, 403);
  await env.DB.prepare("UPDATE rooms SET state='done',rat=?,exp=? WHERE code=?").bind(nowMs(), nowMs() + 600000, room.code).run();
  return J({ ok: 1 });
};
/* ---- versus ---- */
const BOT_NAMES = ['Volt', 'Nova', 'Quark', 'Echo', 'Pixel', 'Vector', 'Ion', 'Delta', 'Orbit', 'Sigma', 'Prism', 'Axis'];
async function vsRoom(env, a, b) { /* a,b: {nick,th,av} or b bot */
  const qids = JSON.parse(a.qids), lims = JSON.parse(a.lims);
  let n2 = b.nick; if (n2.toLowerCase() === a.nick.toLowerCase()) n2 = (n2.slice(0, 14) + ' 2').slice(0, 16);
  return makeRoom(env, { mode: 'vs', pack: a.pack, host: 'vs', qids, lims, state: 'q', qi: 0, qat: nowMs() + 3000, players: [{ nick: a.nick, tok: a.th, av: a.av }, { nick: n2, tok: b.th, av: b.av, bot: b.bot, acc: b.acc, spd: b.spd }] });
}
G['POST /vs/queue'] = async (req, env, ip) => {
  if (!(await rate(env, 'vq:' + ip, 240, 3600))) return J({ error: 'Too many tries. Wait a bit.' }, 429);
  const b = await body(req, 4000);
  const nick = cleanNick(b.nick); if (!nick) return J({ error: 'Pick a different name (2 to 16 letters or numbers).' }, 400);
  if (!okPack(b.pack) || !okIds(b.qids, 12)) return J({ error: 'Bad match request.' }, 400);
  const lims = cleanLims(b.lims, b.qids.length, 25000), tok = gTok(), th = await sha(tok), n = nowMs();
  const me = { nick, th, av: okAv(b.av), pack: b.pack, qids: JSON.stringify(b.qids), lims: JSON.stringify(lims) };
  await gcOnline(env);
  if (!b.bot) {
    const cand = await env.DB.prepare('SELECT * FROM vs_queue WHERE pack=? AND match IS NULL AND t>? AND th<>? ORDER BY t LIMIT 1').bind(b.pack, n - 12000, th).first();
    if (cand) {
      const code = await vsRoom(env, cand, me);
      const c = await env.DB.prepare('UPDATE vs_queue SET match=? WHERE th=? AND match IS NULL').bind(code, cand.th).run();
      if (changed(c) > 0) return J({ tok, matched: true, code });
      await env.DB.prepare('DELETE FROM room_answers WHERE code=?').bind(code).run(); await env.DB.prepare('DELETE FROM room_players WHERE code=?').bind(code).run(); await env.DB.prepare('DELETE FROM rooms WHERE code=?').bind(code).run();
    }
    await env.DB.prepare('INSERT INTO vs_queue(th,pack,nick,av,qids,lims,lvl,bav,t,match) VALUES(?,?,?,?,?,?,?,?,?,NULL)').bind(th, me.pack, nick, me.av, me.qids, me.lims, Math.max(0.2, Math.min(0.98, +b.lvl || 0.6)), okAv(b.bav), n).run();
    return J({ tok, matched: false });
  }
  const row = { ...me, lvl: Math.max(0.2, Math.min(0.98, +b.lvl || 0.6)), bav: okAv(b.bav) };
  const code = await botRoom(env, row);
  return J({ tok, matched: true, code, bot: true });
};
async function botRoom(env, row) { /* row: nick, th, av, pack, qids, lims, lvl, bav */
  const name = BOT_NAMES[h32(row.th) % BOT_NAMES.length] + ' (bot)';
  const acc = Math.max(0.3, Math.min(0.93, row.lvl * 0.95 + 0.04 + (pr(row.th + 'acc') - 0.5) * 0.12));
  const spd = 0.28 + 0.3 * pr(row.th + 'spd');
  return vsRoom(env, row, { nick: name, th: 'bot:' + gTok(), av: row.bav, bot: 1, acc, spd });
}
G['GET /vs/status'] = async (req, env) => {
  const tok = gtokOf(req); if (!tok) return J({ error: 'Not in the queue.' }, 401);
  if (!memRate('vs:' + tok, 120, 60000)) return J({ error: 'Slow down.' }, 429);
  const th = await sha(tok), row = await env.DB.prepare('SELECT match,t FROM vs_queue WHERE th=?').bind(th).first();
  if (!row) return J({ gone: 1 });
  if (row.match) return J({ code: row.match });
  return J({ waiting: 1, waited: nowMs() - row.t });
};
G['POST /vs/bot'] = async (req, env) => {
  const tok = gtokOf(req); if (!tok) return J({ error: 'Not in the queue.' }, 401);
  if (!memRate('vb:' + tok, 20, 60000)) return J({ error: 'Slow down.' }, 429);
  const th = await sha(tok), row = await env.DB.prepare('SELECT * FROM vs_queue WHERE th=?').bind(th).first();
  if (!row) return J({ gone: 1 });
  if (row.match) return J({ code: row.match });
  if (nowMs() - row.t < 6000) return J({ waiting: 1, waited: nowMs() - row.t });
  const code = await botRoom(env, row);
  const c = await env.DB.prepare('UPDATE vs_queue SET match=? WHERE th=? AND match IS NULL').bind(code, th).run();
  if (changed(c) > 0) return J({ code, bot: true });
  await env.DB.prepare('DELETE FROM room_answers WHERE code=?').bind(code).run(); await env.DB.prepare('DELETE FROM room_players WHERE code=?').bind(code).run(); await env.DB.prepare('DELETE FROM rooms WHERE code=?').bind(code).run();
  const r2 = await env.DB.prepare('SELECT match FROM vs_queue WHERE th=?').bind(th).first();
  return J(r2 && r2.match ? { code: r2.match } : { waiting: 1 });
};
G['POST /vs/cancel'] = async (req, env) => {
  const tok = gtokOf(req); if (tok) await env.DB.prepare('DELETE FROM vs_queue WHERE th=? AND match IS NULL').bind(await sha(tok)).run();
  return J({ ok: 1 });
};


/* ================= Optional streak reminders by email (opt-in, one-click unsubscribe) =================
   Needs: a Cloudflare Email Sending binding named EMAIL, MAIL_FROM (an address on an onboarded domain) and SITE_URL.
   Without them the feature reports itself as unavailable and nothing is ever sent. Both sites share one database,
   so each reminder is claimed atomically and can only be sent once per day. */
const mailReady = (env) => !!(env.EMAIL && env.MAIL_FROM && env.SITE_URL);
const okTz = (z) => { try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return typeof z === 'string' && z.length < 60; } catch { return false; } };
function localParts(ms, tz) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms));
  const g = (t) => f.find((x) => x.type === t).value; return { date: g('year') + '-' + g('month') + '-' + g('day'), hour: +g('hour') };
}
A['GET /notify'] = async (req, env, s) => {
  const r = await env.DB.prepare('SELECT on_,hr,tz FROM notify WHERE uid=?').bind(s.uid).first();
  return J({ available: mailReady(env), on: !!(r && r.on_), hr: r ? r.hr : 17, tz: r ? r.tz : null, email: s.email });
};
A['POST /notify'] = async (req, env, s) => {
  if (!mailReady(env)) return J({ error: 'Email reminders are not set up on this site yet.' }, 503);
  if (!(await rate(env, 'nt:' + s.uid, 30, 3600))) return J({ error: 'Slow down.' }, 429);
  const b = await body(req, 400), on = b.on ? 1 : 0, hr = Math.max(0, Math.min(23, Math.round(+b.hr))), tz = okTz(b.tz) ? b.tz : 'America/Los_Angeles';
  if (!Number.isFinite(hr)) return J({ error: 'Pick an hour.' }, 400);
  await env.DB.prepare('INSERT INTO notify(uid,on_,hr,tz,sent,tok) VALUES(?,?,?,?,NULL,?) ON CONFLICT(uid) DO UPDATE SET on_=excluded.on_,hr=excluded.hr,tz=excluded.tz').bind(s.uid, on, hr, tz, hex(rnd(16))).run();
  return J({ ok: 1, on: !!on, hr, tz });
};
async function unsubPage(req, env) {
  const t = new URL(req.url).searchParams.get('t') || '', ok = /^[a-f0-9]{32}$/.test(t);
  if (ok) await env.DB.prepare('UPDATE notify SET on_=0 WHERE tok=?').bind(t).run();
  const body = ok ? 'You are unsubscribed. No more reminder emails will be sent.' : 'This unsubscribe link is not valid.';
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title><body style="font:18px system-ui;max-width:30rem;margin:15vh auto;padding:0 1rem"><h1>' + (ok ? 'Done' : 'Hmm') + '</h1><p>' + body + '</p>', { status: ok ? 200 : 400, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}
export async function runReminders(env) {
  if (!env.DB || !mailReady(env)) return { sent: 0 };
  const now = Date.now(); let sent = 0;
  const rows = (await env.DB.prepare('SELECT n.uid,n.hr,n.tz,n.sent,n.tok,u.email,u.pub FROM notify n JOIN users u ON u.id=n.uid WHERE n.on_=1 LIMIT 2000').all()).results || [];
  for (const r of rows) {
    try {
      const lp = localParts(now, r.tz); if (lp.hour !== r.hr || r.sent === lp.date) continue;
      let pub = {}; try { pub = JSON.parse(r.pub || '{}'); } catch { /* ignore */ }
      const streak = Math.max(0, pub.st | 0); if (streak < 1) continue;
      const last = await env.DB.prepare('SELECT MAX(upd) m FROM saves WHERE uid=?').bind(r.uid).first();
      if (last && last.m && localParts(last.m, r.tz).date === lp.date) continue; /* already studied today */
      const claim = await env.DB.prepare('UPDATE notify SET sent=? WHERE uid=? AND (sent IS NULL OR sent<>?)').bind(lp.date, r.uid, lp.date).run();
      if (changed(claim) < 1) continue;
      const brand = env.BRAND || 'your study app', link = env.SITE_URL.replace(/\/$/, ''), un = link + '/api/unsub?t=' + r.tok;
      const text = 'Your ' + streak + '-day streak is waiting on ' + brand + '. A short session keeps it going.\n\nOpen: ' + link + '/app/\n\nYou asked for these reminders. Unsubscribe in one click: ' + un + '\n';
      const html = '<p>Your <b>' + streak + '-day streak</b> is waiting on ' + brand + '. A short session keeps it going.</p><p><a href="' + link + '/app/">Open ' + brand + '</a></p><p style="color:#666;font-size:12px">You asked for these reminders. <a href="' + un + '">Unsubscribe in one click</a>.</p>';
      await env.EMAIL.send({ to: r.email, from: env.MAIL_FROM, subject: 'Your ' + streak + '-day streak is waiting', html, text, headers: { 'List-Unsubscribe': '<' + un + '>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } });
      sent++;
    } catch (e) { console.error('reminder failed', e && e.code, e && e.message); }
  }
  return { sent };
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url), path = url.pathname.replace(/^\/api/, '') || '/', key = request.method + ' ' + path;
  try {
    const ip = request.headers.get('cf-connecting-ip') || 'x';
    if (request.method === 'POST') { const o = request.headers.get('origin'); if (o && o !== url.origin) return J({ error: 'forbidden' }, 403); }
    if (request.method === 'POST' && path === '/csp-report') { /* browsers send CSP violation reports here (report-only trial); logged briefly, never stored */
      try { console.log('csp-report', (await request.text()).slice(0, 3000).replace(/\s+/g, ' ')); } catch { /* ignore */ }
      return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
    }
    if (request.method === 'GET' && path === '/unsub') { if (!env.DB) return J({ error: 'Not available.' }, 503); return await unsubPage(request, env); }
    if (G[key]) { /* online play needs only the database: guests may play without accounts */
      if (!env.DB) return J({ error: 'Online play is not available here.' }, 503);
      if (request.method === 'POST' && !(request.headers.get('content-type') || '').startsWith('application/json')) return J({ error: 'bad type' }, 415);
      return await G[key](request, env, ip);
    }
    if (!env.DB || !env.PEPPER) return J({ error: 'Accounts are not configured.' }, 503);
    await ensureSchema(env);
    if (R[key]) { if (request.method === 'POST' && !(request.headers.get('content-type') || '').startsWith('application/json')) return J({ error: 'bad type' }, 415); return await R[key](request, env, ip); }
    if (A[key]) {
      const s = await auth(request, env); if (!s) return J({ error: 'Sign in required.' }, 401);
      if (request.method === 'POST' && !csrfOk(request, s)) return J({ error: 'forbidden' }, 403);
      if (s.ver === 0 && !UNVERIFIED_OK.has(key)) return J({ error: 'Confirm your email first.', verify: true }, 403);
      return await A[key](request, env, s);
    }
    return J({ error: 'Not found' }, 404);
  } catch (e) { return J({ error: e.message === 'big' ? 'Too large' : e.message === 'json' ? 'Bad request' : 'Server error' }, e.message === 'big' ? 413 : e.message === 'json' ? 400 : 500); }
}
