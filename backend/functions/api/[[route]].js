/* Accounts API for Cloudflare Pages Functions + D1.
   Bindings: DB (D1). Vars/secrets: GOOGLE_CLIENT_ID (optional), PEPPER (secret, required).
   Security: PBKDF2-SHA256 (per-user salt, server pepper), constant-time compare, HttpOnly __Host- session cookie
   (token stored only as SHA-256), double-submit CSRF + Origin check, rate limits, parameterized SQL, strict validation. */
const enc = new TextEncoder();
const J = (o, s = 200, h = {}) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...h } });
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
function pwProblem(pw, email, user) {
  if (typeof pw !== 'string' || pw.length < 10) return 'Use at least 10 characters.';
  if (pw.length > 128) return 'Use at most 128 characters.';
  const l = pw.toLowerCase();
  if (COMMON.includes(l) || /^(.)\1+$/.test(pw)) return 'That password is too common.';
  if (email && l.includes(email.split('@')[0].toLowerCase()) && email.split('@')[0].length > 3) return 'Do not put your email in your password.';
  if (user && l.includes(user)) return 'Do not put your username in your password.';
  return null;
}
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const day = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - day); return t.toISOString().slice(0, 10); }

async function rate(env, key, max, win) {
  const now = Math.floor(Date.now() / 1000), w = Math.floor(now / win);
  const r = await env.DB.prepare('SELECT w,n FROM rl WHERE k=?').bind(key).first();
  if (r && r.w === w) { if (r.n >= max) return false; await env.DB.prepare('UPDATE rl SET n=n+1 WHERE k=?').bind(key).run(); }
  else await env.DB.prepare('INSERT INTO rl(k,w,n) VALUES(?,?,1) ON CONFLICT(k) DO UPDATE SET w=excluded.w,n=1').bind(key, w).run();
  return true;
}
const cookie = (name, val, age, http) => `${name}=${val}; Path=/; Max-Age=${age}; Secure; SameSite=Lax${http ? '; HttpOnly' : ''}`;
function getCookie(req, n) { const m = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(n + '=')); return m ? m.slice(n.length + 1) : null; }

async function newSession(env, uid) {
  const tok = hex(rnd(32)), csrf = hex(rnd(16)), exp = Math.floor(Date.now() / 1000) + 30 * 86400;
  await env.DB.prepare('INSERT INTO sessions(h,uid,exp,csrf) VALUES(?,?,?,?)').bind(await sha(tok), uid, exp, csrf).run();
  await env.DB.prepare('DELETE FROM sessions WHERE uid=? AND h NOT IN (SELECT h FROM sessions WHERE uid=? ORDER BY exp DESC LIMIT 5)').bind(uid, uid).run();
  return { 'set-cookie': [cookie('__Host-sid', tok, 30 * 86400, true), cookie('__Host-csrf', csrf, 30 * 86400, false)] };
}
function withCookies(h) { const r = new Headers(); for (const [k, v] of Object.entries(h)) Array.isArray(v) ? v.forEach((x) => r.append(k, x)) : r.set(k, v); return r; }
function out(o, s, h) { const res = J(o, s); if (h && h['set-cookie']) h['set-cookie'].forEach((c) => res.headers.append('set-cookie', c)); return res; }

async function auth(req, env) {
  const tok = getCookie(req, '__Host-sid'); if (!tok) return null;
  const s = await env.DB.prepare('SELECT s.uid,s.exp,s.csrf,u.username,u.email,u.pub,u.shared FROM sessions s JOIN users u ON u.id=s.uid WHERE s.h=?').bind(await sha(tok)).first();
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
  return { username: s.username, email: s.email, needUsername: !s.username, packs: saves, shared: JSON.parse(s.shared || '{}'), pub: JSON.parse(s.pub || '{}'), csrf: s.csrf };
}

const R = {};
R['POST /signup'] = async (req, env, ip) => {
  if (!(await rate(env, 'su:' + ip, 8, 3600))) return J({ error: 'Too many attempts. Try later.' }, 429);
  const b = await body(req); const email = String(b.email || '').trim().toLowerCase(), user = String(b.username || '').trim().toLowerCase();
  if (!ok_email(email)) return J({ error: 'Enter a valid email.' }, 400);
  if (!ok_user(user)) return J({ error: 'Username: 3-16 letters, numbers or _. Do not use your real name.' }, 400);
  const pr = pwProblem(b.password, email, user); if (pr) return J({ error: pr }, 400);
  const ex = await env.DB.prepare('SELECT 1 FROM users WHERE email=? OR username=?').bind(email, user).first();
  if (ex) return J({ error: 'That email or username is already in use.' }, 409);
  const r = await env.DB.prepare('INSERT INTO users(email,username,pw,created) VALUES(?,?,?,?)').bind(email, user, await hashPw(b.password, env), Date.now()).run();
  const uid = r.meta.last_row_id; const h = await newSession(env, uid);
  const s = await auth(new Request(req.url, { headers: { cookie: h['set-cookie'][0].split(';')[0] } }), env);
  return out(await meObj(env, s), 200, h);
};
R['POST /login'] = async (req, env, ip) => {
  const b = await body(req); const id = String(b.id || '').trim().toLowerCase();
  if (!(await rate(env, 'li:' + ip, 30, 900)) || !(await rate(env, 'lu:' + id.slice(0, 64), 10, 900))) return J({ error: 'Too many attempts. Wait 15 minutes.' }, 429);
  const u = await env.DB.prepare('SELECT id,pw FROM users WHERE email=? OR username=?').bind(id, id).first();
  const dummy = 'pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$' + b64(new Uint8Array(32));
  const good = await checkPw(String(b.password || '').slice(0, 128), u && u.pw ? u.pw : dummy, env);
  if (!u || !u.pw || !good) return J({ error: 'Wrong email/username or password.' }, 401);
  const h = await newSession(env, u.id);
  const s = await auth(new Request(req.url, { headers: { cookie: h['set-cookie'][0].split(';')[0] } }), env);
  return out(await meObj(env, s), 200, h);
};
R['POST /google'] = async (req, env, ip) => {
  if (!(await rate(env, 'go:' + ip, 30, 900))) return J({ error: 'Too many attempts.' }, 429);
  const b = await body(req, 4096); let g;
  try { g = await googleVerify(b.credential, env); } catch (e) { return J({ error: e.message === 'nogoogle' ? 'Google sign-in is not set up.' : 'Google sign-in failed.' }, 401); }
  let u = await env.DB.prepare('SELECT id FROM users WHERE gsub=?').bind(g.sub).first();
  if (!u) { u = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(g.email).first(); if (u) await env.DB.prepare('UPDATE users SET gsub=?, pw=NULL WHERE id=?').bind(g.sub, u.id).run(); /* pw cleared: stops pre-registration takeover of an email nobody verified */ }
  if (!u) { const r = await env.DB.prepare('INSERT INTO users(email,gsub,created) VALUES(?,?,?)').bind(g.email, g.sub, Date.now()).run(); u = { id: r.meta.last_row_id }; }
  const h = await newSession(env, u.id);
  const s = await auth(new Request(req.url, { headers: { cookie: h['set-cookie'][0].split(';')[0] } }), env);
  return out(await meObj(env, s), 200, h);
};
R['GET /config'] = async (req, env) => J({ google: env.GOOGLE_CLIENT_ID || null });
/* authenticated */
const A = {};
A['GET /me'] = async (req, env, s) => J(await meObj(env, s));
A['POST /logout'] = async (req, env, s) => { await env.DB.prepare('DELETE FROM sessions WHERE uid=? AND csrf=?').bind(s.uid, s.csrf).run(); return out({ ok: 1 }, 200, { 'set-cookie': [cookie('__Host-sid', '', 0, true), cookie('__Host-csrf', '', 0, false)] }); };
A['POST /username'] = async (req, env, s) => {
  const b = await body(req); const user = String(b.username || '').trim().toLowerCase();
  if (s.username) return J({ error: 'Username already set.' }, 400);
  if (!ok_user(user)) return J({ error: 'Username: 3-16 letters, numbers or _. Do not use your real name.' }, 400);
  if (await env.DB.prepare('SELECT 1 FROM users WHERE username=?').bind(user).first()) return J({ error: 'Taken.' }, 409);
  await env.DB.prepare('UPDATE users SET username=? WHERE id=?').bind(user, s.uid).run(); return J({ username: user });
};
A['POST /delete'] = async (req, env, s) => {
  const b = [['DELETE FROM sessions WHERE uid=?'], ['DELETE FROM saves WHERE uid=?'], ['DELETE FROM weekly WHERE uid=?'], ['DELETE FROM friends WHERE a=? OR b=?', 2], ['DELETE FROM users WHERE id=?']];
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

export async function onRequest({ request, env }) {
  const url = new URL(request.url), path = url.pathname.replace(/^\/api/, '') || '/', key = request.method + ' ' + path;
  try {
    if (!env.DB || !env.PEPPER) return J({ error: 'Accounts are not configured.' }, 503);
    const ip = request.headers.get('cf-connecting-ip') || 'x';
    if (request.method === 'POST') { const o = request.headers.get('origin'); if (o && o !== url.origin) return J({ error: 'forbidden' }, 403); }
    if (R[key]) { if (request.method === 'POST' && !(request.headers.get('content-type') || '').startsWith('application/json')) return J({ error: 'bad type' }, 415); return await R[key](request, env, ip); }
    if (A[key]) {
      const s = await auth(request, env); if (!s) return J({ error: 'Sign in required.' }, 401);
      if (request.method === 'POST' && !csrfOk(request, s)) return J({ error: 'forbidden' }, 403);
      return await A[key](request, env, s);
    }
    return J({ error: 'Not found' }, 404);
  } catch (e) { return J({ error: e.message === 'big' ? 'Too large' : e.message === 'json' ? 'Bad request' : 'Server error' }, e.message === 'big' ? 413 : e.message === 'json' ? 400 : 500); }
}
