// Cross-browser, cross-OS, cross-viewport compatibility check.
// Usage: BROWSER=chromium|firefox|webkit node tests/compat.mjs   (run `npm ci` first)
// Serves ./public on a local port, opens every trainer at many screen sizes, and fails on
// page errors, sideways scroll, clipped nav icons, broken Today/Play panel, and dead menus.
import {chromium, firefox, webkit} from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = [path.join(here, '..', 'site'), path.join(here, '..', 'public')].find(d => fs.existsSync(d));
const MIME = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.png':'image/png','.pdf':'application/pdf'};
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end('nf'); }
  r.writeHead(200, {'content-type': MIME[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(r);
});
await new Promise(ok => srv.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${srv.address().port}`;
const name = process.env.BROWSER || 'chromium';
const engine = {chromium, firefox, webkit}[name];
const VIEWS = [ // [label, w, h, touch]
  ['phone-small 4:3-ish 320x568', 320, 568, true], ['phone 9:16 360x640', 360, 640, true], ['phone 9:19.5 390x844', 390, 844, true],
  ['phone 9:21 412x915', 412, 915, true], ['phone-landscape 844x390', 844, 390, true], ['foldable 280x653', 280, 653, true],
  ['tablet 3:4 768x1024', 768, 1024, true], ['tablet 4:3 1024x768', 1024, 768, true], ['tablet 10in 800x1280', 800, 1280, true],
  ['laptop 16:10 1280x800', 1280, 800, false], ['laptop 16:9 1366x768', 1366, 768, false], ['desktop 1920x1080', 1920, 1080, false],
  ['ultrawide 21:9 2560x1080', 2560, 1080, false], ['super-ultrawide 32:9 3840x1080', 3840, 1080, false], ['tv 4k 3840x2160', 3840, 2160, false],
  ['square 1:1 900x900', 900, 900, false], ['short-wide 1920x600', 1920, 600, false]];
const apps = fs.readdirSync(path.join(root, 'app'), {withFileTypes: true}).filter(d => d.isDirectory() && fs.existsSync(path.join(root, 'app', d.name, 'index.html'))).map(d => d.name);
const fails = []; let n = 0;
const browser = await engine.launch(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox']} : {});
for (const app of apps) for (const [label, w, h, touch] of VIEWS) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, hasTouch: touch, isMobile: touch && name !== 'firefox'});
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto(`${base}/app/${app}/`, {waitUntil: 'load'}); await p.waitForTimeout(400);
  const note = m => fails.push(`[${name}] ${app} @ ${label}: ${m}`);
  try {
    await p.evaluate(() => { if (typeof ALL === 'undefined') return; S.dgr = {}; ALL.forEach((t, i) => S.dgr[t] = i % 2); S.dg = today(); S.cu = null; route(); });
    for (const tab of ['learn', 'course', 'practice', 'library', 'me']) {
      await p.evaluate(t => document.querySelector(`#nav button[data-t="${t}"]`).click(), tab); await p.waitForTimeout(120);
      const r = await p.evaluate(() => {
        const bad = [], de = document.documentElement;
        if (de.scrollWidth > innerWidth + 1) bad.push('sideways scroll ' + de.scrollWidth + '>' + innerWidth);
        document.querySelectorAll('#nav button').forEach(b => { const s = b.querySelector('svg'); if (!s) return; const a = s.getBoundingClientRect(), c = b.getBoundingClientRect(); if (a.width < 14 || a.left < c.left - 1 || a.right > c.right + 1) bad.push('nav icon clipped: ' + b.dataset.t); });
        const m = document.getElementById('main'); if (!m || m.innerText.trim().length < 20) bad.push('empty view');
        document.querySelectorAll('#main button, #main a, #main input').forEach(e => { const q = e.getBoundingClientRect(); if (q.width && q.right > innerWidth + 1) bad.push('control off-screen: ' + (e.innerText || e.id || e.tagName).slice(0, 24)); });
        return bad.slice(0, 4);
      });
      r.forEach(x => note(`${tab}: ${x}`));
    }
    await p.evaluate(() => document.querySelector('#nav button[data-t="learn"]').click()); await p.waitForTimeout(120);
    const tiles = await p.$$eval('[data-og]', a => a.map(e => e.dataset.og)); if (!['host', 'solo', 'vs'].every(k => tiles.includes(k))) note('Play tiles missing: ' + tiles);
    await p.evaluate(() => document.querySelector('[data-og="solo"]').click()); await p.waitForTimeout(150);
    if (!(await p.$('[data-solo]'))) note('solo menu did not open');
    await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    if (await p.$('.modal [data-solo]')) note('Escape did not close the solo menu');
  } catch (e) { note('test crashed: ' + e.message.split('\n')[0]); }
  errs.filter(e => !/api\/config|Failed to fetch|NetworkError|Load failed/.test(e)).slice(0, 3).forEach(x => note(x));
  n++; await ctx.close();
}
await browser.close(); srv.close();
console.log(`${name}: ${n} app/viewport combinations checked, ${fails.length} problem(s)`);
fails.forEach(f => console.log(' - ' + f));
process.exit(fails.length ? 1 : 0);
