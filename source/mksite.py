#!/usr/bin/env python3
"""mksite.py <site: skyvolt|axiom> <app_build_dir> <final_out_dir>
Wraps a built app (build_open.py output) in a full website: landing, account, privacy, terms, accessibility,
science, resources, 404, shared css/js, root headers and a cleanup service worker."""
import sys,os,json,shutil,html,re
site,appdir,out=sys.argv[1:4]
K=os.path.dirname(os.path.abspath(__file__))+'/'
CFG=json.load(open(K+'site.config.json'))
DATE=CFG['effective']
CONTACT=CFG['contact']
def lum(h):
    h=h.lstrip('#');r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c:c/12.92 if c<=.03928 else ((c+.055)/1.055)**2.4
    return .2126*f(r)+.7152*f(g)+.0722*f(b)
def cr(a,b):
    x,y=sorted([lum(a),lum(b)],reverse=True);return (x+.05)/(y+.05)
PK={'skyvolt':['circuit-lab-b','meteorology-b'],'axiom':['geometry-readiness','apex-math','quanta-physics']}[site]
packs=[json.load(open(K+f'events/{p}/pack.json')) for p in PK]
nq=sum(len(p['questions']) for p in packs);nt=sum(len(p['topics']) for p in packs)
nl=sum(sum(len(u['lessons']) for u in p['units']) for p in packs);npf=sum(len(p.get('proofs',[])) for p in packs)
def fmt(n):return f"{n//100*100:,}+"
if site=='skyvolt':
    B=dict(name='Skyvolt',pri='#0b7a45',pri_d='#46d98b',acc='#1a62c8',acc_d='#7bb6ff',gold='#ffb703',
        h1='Circuits and weather, one small win at a time.',
        sub='Short interactive lessons start with ideas a 5th grader already knows and climb to high-school exam level. Built for Science Olympiad Circuit Lab and Meteorology.',
        tracks=[('Voltaic','Circuit Lab B','#0b7a45',[t['name'] for t in packs[0]['topics']]),('Stratus','Meteorology B','#1a62c8',[t['name'] for t in packs[1]['topics']])],
        what='circuits, Ohm’s law, Kirchhoff, capacitors, logic, fronts, soundings, severe storms and more',stations=True,
        exam='a high-school physics or Earth-science exam written by an electrical engineer or a meteorologist')
else:
    B=dict(name='Axiom',pri='#4b3bd9',pri_d='#a99dff',acc='#8a5a00',acc_d='#ffd23f',gold='#ffd23f',
        h1='Math, engineering and physics, one small win at a time.',
        sub='Short interactive lessons start with ideas a 5th grader already knows and climb to high-school exam level. Three tracks: Geometry readiness, Algebra 2 through Calculus, and electrical engineering with physics.',
        tracks=[('Axiom Geometry','Algebra 1 → Geometry Honors','#4b3bd9',[t['name'] for t in packs[0]['topics']]),('Apex','Algebra 2 → Calculus','#b4410a',[t['name'] for t in packs[1]['topics']]),('Quanta','Electrical engineering and physics','#0a6e8a',[t['name'] for t in packs[2]['topics']])],
        what='equations, proofs, similarity, polynomials, logarithms, trigonometry, limits, derivatives, circuits, motion, energy and waves',stations=False,
        exam='a high-school math or physics exam written by a mathematician, physicist or electrical engineer')
for a,b_,m in [(B['pri'],'#ffffff',4.5),('#14213d','#fbfbf8',7),('#46506b','#fbfbf8',4.5),(B['acc'],'#fbfbf8',4.5),('#eef0fb','#10142b',7),(B['pri_d'],'#10142b',4.5),(B['acc_d'],'#10142b',4.5)]:
    assert cr(a,b_)>=m,(site,a,b_,cr(a,b_))
N=B['name']
CSS='''
:root{--bg:#fbfbf8;--tx:#14213d;--mut:#46506b;--card:#fff;--line:#d8dbe8;--pri:%(pri)s;--onpri:#fff;--acc:%(acc)s;--gold:%(gold)s;--soft:#eef0fb;--r:18px;--ring:#1a62c8}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#10142b;--tx:#eef0fb;--mut:#b4b9d6;--card:#1a1f3f;--line:#2f3566;--pri:%(pri_d)s;--onpri:#10142b;--acc:%(acc_d)s;--soft:#222850;--ring:#ffd23f}}
:root[data-theme=dark]{--bg:#10142b;--tx:#eef0fb;--mut:#b4b9d6;--card:#1a1f3f;--line:#2f3566;--pri:%(pri_d)s;--onpri:#10142b;--acc:%(acc_d)s;--soft:#222850;--ring:#ffd23f}
[hidden]{display:none!important}*{box-sizing:border-box}html{-webkit-text-size-adjust:100%%;text-size-adjust:100%%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--tx);font:1rem/1.6 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--acc);text-underline-offset:3px}a:hover{text-decoration-thickness:2px}
:focus-visible{outline:3px solid var(--ring);outline-offset:3px;border-radius:6px}
.skip{position:absolute;left:12px;top:-60px;background:var(--pri);color:var(--onpri);padding:10px 16px;border-radius:10px;z-index:99;font-weight:700}.skip:focus{top:12px}
.wrap{width:min(1080px,100%%);margin:0 auto;padding:0 max(16px,env(safe-area-inset-left))}
header.top{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 92%%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
header .in{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 0}
.logo{display:flex;align-items:center;gap:10px;color:var(--tx);text-decoration:none;font-weight:800;font-size:1.25rem}
.logo svg{width:34px;height:34px}
nav ul{display:flex;gap:4px 16px;flex-wrap:wrap;list-style:none;margin:0;padding:0}nav a{color:var(--tx);text-decoration:none;font-weight:600;padding:10px 4px;display:inline-block;min-height:44px}nav a:hover,nav a[aria-current]{color:var(--acc);text-decoration:underline}
.sp{flex:1}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 22px;border-radius:14px;border:2px solid var(--pri);background:var(--pri);color:var(--onpri);font:700 1rem/1 inherit;text-decoration:none;cursor:pointer;box-shadow:0 4px 0 color-mix(in srgb,var(--pri) 55%%,#000);transition:transform .12s,box-shadow .12s}
.btn:hover{transform:translateY(1px);box-shadow:0 3px 0 color-mix(in srgb,var(--pri) 55%%,#000)}.btn:active{transform:translateY(4px);box-shadow:none}
.btn.sec{background:transparent;color:var(--tx);border-color:var(--line);box-shadow:none}.btn.sec:hover{border-color:var(--pri)}
.btn[disabled]{opacity:.55;cursor:not-allowed}
.hero{padding:56px 0 40px;display:grid;gap:32px;grid-template-columns:1.1fr .9fr;align-items:center}
h1{font-size:clamp(2rem,5.5vw,3.4rem);line-height:1.1;margin:0 0 16px;letter-spacing:-.02em}h2{font-size:clamp(1.5rem,3.6vw,2.1rem);line-height:1.2;margin:0 0 12px}h3{font-size:1.15rem;margin:0 0 6px}
.lead{font-size:1.2rem;color:var(--mut);max-width:34em}.cta{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0 8px}
.pill{display:inline-block;background:var(--soft);color:var(--tx);border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-size:.9rem;font-weight:600}
.art{background:var(--card);border:2px solid var(--line);border-radius:24px;padding:18px;box-shadow:0 8px 0 var(--line)}.art svg{width:100%%;height:auto;display:block}
section.s{padding:44px 0}section.alt{background:var(--soft)}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
a.trk{display:block;color:var(--tx);text-decoration:none}a.trk:hover{border-color:var(--pri)}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:20px}.card p{margin:0;color:var(--mut)}
.num{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%%;background:var(--pri);color:var(--onpri);font-weight:800;margin-bottom:8px}
.stats{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-top:20px}.stats div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:14px;text-align:center}.stats b{display:block;font-size:1.8rem;line-height:1.1}.stats span{color:var(--mut);font-size:.9rem}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 0;padding:0;list-style:none}
footer{border-top:1px solid var(--line);padding:28px 0 40px;color:var(--mut);font-size:.95rem}footer ul{display:flex;flex-wrap:wrap;gap:4px 20px;list-style:none;padding:0;margin:0 0 10px}footer a{color:var(--tx);display:inline-block;padding:8px 0}
.doc{max-width:760px;margin:0 auto;padding:36px 0 56px}.doc h2{margin-top:32px;font-size:1.45rem}.doc li{margin:6px 0}.doc table{border-collapse:collapse;width:100%%;font-size:.95rem}.doc th,.doc td{border:1px solid var(--line);padding:10px;text-align:left;vertical-align:top}.doc th{background:var(--soft)}
.note{background:var(--soft);border-left:5px solid var(--pri);border-radius:10px;padding:12px 16px;margin:16px 0}
form.acc{background:var(--card);border:2px solid var(--line);border-radius:24px;padding:24px;max-width:460px;margin:0 auto}
.fld{display:block;margin:0 0 14px}.fld span{display:block;font-weight:700;margin-bottom:4px}.fld small{color:var(--mut)}
input[type=text],input[type=email],input[type=password]{width:100%%;min-height:48px;border:2px solid var(--line);border-radius:12px;padding:0 14px;font:inherit;background:var(--bg);color:var(--tx)}
input:focus{border-color:var(--pri)}input[aria-invalid=true]{border-color:#c4302b}
.chk{display:flex;gap:10px;align-items:flex-start;margin:0 0 14px}.chk input{width:22px;height:22px;margin-top:3px;accent-color:var(--pri)}
.seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:var(--soft);padding:6px;border-radius:14px;margin-bottom:18px}.seg button{min-height:44px;border:0;border-radius:10px;background:transparent;color:var(--tx);font:700 1rem inherit;cursor:pointer}.seg button[aria-pressed=true]{background:var(--card);box-shadow:0 1px 4px rgba(0,0,0,.25)}
.msg{min-height:1.5em;margin:10px 0;font-weight:600}.msg.bad{color:#c4302b}@media(prefers-color-scheme:dark){.msg.bad{color:#ff8f8a}input[aria-invalid=true]{border-color:#ff8f8a}}
.or{display:flex;align-items:center;gap:12px;color:var(--mut);margin:16px 0}.or:before,.or:after{content:"";flex:1;height:1px;background:var(--line)}
@media(max-width:700px){header.top{position:static}header .in nav{order:3;width:100%%}header .in .btn{min-height:44px;padding:0 14px}nav a{padding:6px 2px;min-height:32px}}
@media(max-width:820px){.hero{grid-template-columns:1fr;padding-top:32px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
@media print{header.top,.cta,.skip{display:none}}
'''%B
BOLT='<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="var(--pri)"/><path d="M34 8 18 36h12l-4 20 20-30H33z" fill="#ffd23f" stroke="#1b1464" stroke-width="3" stroke-linejoin="round"/></svg>'
NAV=[('/#how','How it works'),('/#topics','Topics'),('/science/','The science'),('/resources/','Resources')]
def page(path,title,body,desc='',cur='',head='',tail=''):
    nav=''.join(f'<li><a href="{h}"{" aria-current=page" if h==cur else ""}>{t}</a></li>' for h,t in NAV)
    d=html.escape(desc or B['sub'],quote=True)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="{B['pri']}">
<title>{html.escape(title)}</title><meta name="description" content="{d}"><meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{d}"><meta property="og:type" content="website">
<link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="/site.css">{head}</head><body>
<a class="skip" href="#main">Skip to main content</a>
<header class="top"><div class="wrap in"><a class="logo" href="/" aria-label="{N} home">{BOLT}<span>{N}</span></a><nav aria-label="Main"><ul>{nav}</ul></nav><span class="sp"></span><a class="btn sec" href="/account/">Sign in</a><a class="btn" href="/app/">Start learning</a></div></header>
<main id="main" tabindex="-1">{body}</main>
<footer><div class="wrap"><nav aria-label="Footer"><ul><li><a href="/privacy/">Privacy</a></li><li><a href="/terms/">Terms</a></li><li><a href="/accessibility/">Accessibility</a></li><li><a href="/ai-disclosure/">AI disclosure</a></li><li><a href="/science/">The science</a></li><li><a href="/resources/">Resources</a></li><li><a href="/account/">Account</a></li></ul></nav>
<p>{N} is part of <strong>Voltaxis</strong>, a family of free study trainers (Skyvolt and Axiom).</p><p>{N} was created with AI assistance. <a href="/ai-disclosure/">Read the AI disclosure</a>.</p><p>{N} is an independent, free study tool. It is not an official product of Science Olympiad, Inc., any school district or any textbook publisher.</p></div></footer>
{'<script src="/account.js" defer></script>' if path=='account' else ''}{tail}
</body></html>'''
def chips(l):return '<ul class="chips">'+''.join(f'<li><span class="pill">{html.escape(x)}</span></li>' for x in l)+'</ul>'
ART='''<svg viewBox="0 0 320 220" role="img" aria-label="Example of an interactive question: drag the ray to make a 50 degree angle"><rect x="0" y="0" width="320" height="220" rx="14" fill="none"/><text x="16" y="28" font-size="15" font-weight="700" fill="var(--tx)">Drag the ray to make a 50° angle</text><path d="M50 170H260" stroke="var(--tx)" stroke-width="3" stroke-linecap="round"/><path d="M50 170 200 83" stroke="var(--pri)" stroke-width="6" stroke-linecap="round"/><circle cx="200" cy="83" r="12" fill="var(--pri)"/><path d="M110 170A60 60 0 0 0 98 134" fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><text x="116" y="158" font-size="15" font-weight="800" fill="var(--tx)">50°</text><rect x="16" y="188" width="288" height="16" rx="8" fill="var(--soft)"/><rect x="16" y="188" width="170" height="16" rx="8" fill="var(--pri)"/></svg>'''
REPO=CFG.get('repo',{}).get(site,'')
REPOLINK=f' · <a href="{REPO}" rel="noopener">View the source code on GitHub</a>' if REPO else ''
def landing():
    tr=''.join(f'<div class="card" style="border-top:6px solid {c}"><h3>{html.escape(n)}</h3><p>{html.escape(s)}</p>{chips(t)}</div>' for n,s,c,t in B['tracks'])
    st=''
    if B['stations']:st='<div class="card"><h3>Practice stations</h3><p>Simulations that recreate the event tasks, with real-equipment instructions for each one.</p></div>'
    feats=[('Starts where you are','Every topic opens with ideas from 5th and 6th grade, then builds one step at a time.'),
     ('Practice by doing','Drag angles, tap points, adjust values, build proofs and type answers. Multiple choice is the exception.'),
     ('Explains why','A wrong answer shows the steps and points you to the exact notes.'),
     ('No repeated questions','A question appears once until you have seen the whole bank. After that, only for scheduled review.'),
     ('Read-aloud support','A voice reads questions, hints and explanations aloud. You choose the voice and speed.'),
     ('Friends and leagues','Add friends by username and compare XP in a weekly league. No real names needed.'),('Private and free','No ads, no trackers, no purchases. Coins are only for fun.')]
    fh=''.join(f'<div class="card"><h3>{a}</h3><p>{b}</p></div>' for a,b in feats)+st
    body=f'''<div class="wrap"><section class="hero"><div><p><span class="pill">Free · No ads · Any device</span></p><h1>{B['h1']}</h1><p class="lead">{B['sub']}</p>
<div class="cta"><a class="btn" href="/app/">Start learning</a><a class="btn sec" href="/account/">Create an account</a></div><p class="lead" style="font-size:1rem">No account needed to start. Accounts save progress across devices and unlock friends.</p></div>
<div class="art" aria-hidden="false">{ART}</div></section></div>
<section class="s alt" id="how"><div class="wrap"><h2>How a lesson works</h2><div class="grid">
<div class="card"><span class="num">1</span><h3>Learn it</h3><p>A short idea with a diagram you can manipulate.</p></div>
<div class="card"><span class="num">2</span><h3>Try it</h3><p>Answer right away. Questions get harder as you get them right.</p></div>
<div class="card"><span class="num">3</span><h3>Understand it</h3><p>After a miss, study the worked steps, then try a fresh version.</p></div>
<div class="card"><span class="num">4</span><h3>Retain it</h3><p>Earlier topics return on a spaced schedule, just before they fade.</p></div></div></div></section>
<section class="s"><div class="wrap"><h2>Built to get you to an A+</h2><p class="lead">Lessons begin easy and end at the level of the hardest questions on {B['exam']}. You master a topic by getting those right.</p>
<div class="stats"><div><b>{fmt(nq)}</b><span>questions</span></div><div><b>{nt}</b><span>topics</span></div><div><b>{nl}</b><span>lessons</span></div>{f'<div><b>{npf}</b><span>proofs</span></div>' if npf else ''}</div></div></section>
<section class="s alt" id="topics"><div class="wrap"><h2>What you will learn</h2><p class="lead">{B['what'][0].upper()+B['what'][1:]}.</p><div class="grid">{tr}</div></div></section>
<section class="s"><div class="wrap"><h2>Why it works</h2><div class="grid">{fh}</div><p style="margin-top:20px"><a href="/science/">See the research behind each feature →</a></p></div></section>
<section class="s"><div class="wrap"><div class="note" role="note"><b>Created with AI assistance.</b> The lessons, questions, explanations and code were produced with an AI model (Claude, by Anthropic) under the direction of a Science Olympiad coach, and checked with automated tests. Errors are still possible, so confirm important facts with your textbook or teacher. <a href="/ai-disclosure/">Read the full disclosure</a>{REPOLINK}.</div></div></section>
<section class="s alt"><div class="wrap" style="text-align:center"><h2>Start practicing today.</h2><div class="cta" style="justify-content:center"><a class="btn" href="/app/">Start learning</a><a class="btn sec" href="/account/">Create an account</a></div></div></section>'''
    body=body.replace('{REPOLINK}',REPOLINK)
    return page('index',f'{N}: {B["h1"]}',body,cur='/')
def legal(kind):
    P=CONTACT
    if kind=='privacy':
        b=f'''<div class="wrap doc"><h1>Privacy Policy</h1><p><b>Effective {DATE}.</b> This policy explains what {N} collects, why, and the choices you have. It is written in plain language.</p>
<div class="note"><b>Short version:</b> you can use {N} as a guest and nothing leaves your device. If you make an account we store only what is needed to save your progress and connect you with friends. We show no ads, use no trackers and never sell data.</div>
<h2>Who runs this</h2><p>{N} is a free educational tool run by an independent volunteer coach. It is not run by a school, a school district or Science Olympiad, Inc. {P}</p>
<h2>Guest mode</h2><p>If you do not make an account, your progress is saved only in your own browser (local storage) on your device. We do not receive it. Clearing site data erases it. You can export a backup in Settings.</p>
<h2>What we collect if you make an account</h2><table><tr><th>Data</th><th>Why</th></tr>
<tr><td>Email address</td><td>To sign you in and recover your account. Never shown to other users.</td></tr>
<tr><td>Username (not your real name)</td><td>So friends can find you. Shown to your friends and in your league.</td></tr>
<tr><td>Password</td><td>We never see or store it. We store a salted, slow hash (PBKDF2-SHA-256 with a server-side secret) so it cannot be read back.</td></tr>
<tr><td>Google account ID and email (only if you choose “Continue with Google”)</td><td>To recognise you. We do not receive your Google password, contacts or files.</td></tr>
<tr><td>Learning progress: XP, level, streak, avatar, answers history, settings</td><td>So your progress follows you between devices and powers your lessons.</td></tr>
<tr><td>Friend links and weekly XP</td><td>To run friend lists and the weekly league.</td></tr>
<tr><td>Session cookie and anti-forgery cookie</td><td>To keep you signed in securely (30 days, then you sign in again).</td></tr></table>
<h2>What we do not do</h2><ul><li>No advertising, no ad networks, no analytics or tracking scripts, no fingerprinting.</li><li>We never sell, rent or share your data for marketing.</li><li>We do not ask for your real name, phone number, address, school or photo.</li><li>We do not use your answers to train AI models.</li></ul>
<h2>Cookies and local storage</h2><p>Only essential ones: a sign-in session cookie (<code>__Host-sid</code>, HttpOnly), an anti-forgery cookie (<code>__Host-csrf</code>) and local storage for your progress and settings. No consent banner is needed because there are no optional cookies.</p>
<h2>Voice assistant</h2><p>Reading aloud uses the speech voices built into your browser or device. The text is not sent to us. Some browsers use online voices run by the browser or device maker; their policies then apply. You can turn the voice off in Settings.</p>
<h2>Other companies involved</h2><ul><li><b>Cloudflare</b> hosts the site and database. Like any host it processes technical data such as your IP address to deliver pages and block abuse. <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare privacy policy</a>.</li><li><b>Google</b>, only if you press the Google button: the sign-in button loads from Google, which then receives standard browser data. <a href="https://policies.google.com/privacy">Google privacy policy</a>.</li></ul>
<h2>Children and students</h2><p>{N} is designed for students aged 13 and up. If you are under 13, please use guest mode, which collects nothing, unless a parent or teacher has given permission. We do not knowingly collect personal information from children under 13 without verifiable parental consent; if you believe we have, contact us and we will delete it. {N} is not a school record and is not run by a school.</p>
<h2>How long we keep data</h2><p>Account data is kept until you delete your account. Sessions expire after 30 days. Anti-abuse counters expire within hours. Deleted data may remain in the host’s protected backups for a short time before it is overwritten.</p>
<h2>Your choices and rights</h2><ul><li><b>Delete:</b> Me → Friends → “Delete my account” erases your account, saved progress and friend links.</li><li><b>Access or correct:</b> ask us and we will send or fix what we hold.</li><li><b>Export:</b> Settings has a backup you can download at any time.</li><li>If you live in California or another region with privacy laws, you have the rights those laws give you. We do not sell or share personal information.</li></ul>
<h2>Security</h2><p>All traffic uses HTTPS. We use strict browser protections (content security policy, HttpOnly cookies, anti-forgery tokens), hashed passwords, rate limits, and parameterised database queries. No system is perfectly secure, so please use a unique password.</p>
<h2>Changes</h2><p>If we change this policy we will update the date above and, for significant changes, show a notice in the app.</p>
<h2>Contact</h2><p>{P}</p></div>'''
        return page('privacy',f'Privacy Policy · {N}',b,'What {N} collects, why, and your choices.'.replace('{N}',N))
    b=f'''<div class="wrap doc"><h1>Terms of Service</h1><p><b>Effective {DATE}.</b> By using {N} you agree to these terms. If you do not agree, please do not use it.</p>
<h2>1. Who can use {N}</h2><p>You must be 13 or older to create an account. If you are younger, use guest mode, or have a parent or teacher’s permission. If you are under 18, please make sure a parent or guardian is comfortable with you using the site.</p>
<h2>2. What {N} is</h2><p>{N} is a free practice tool. It is independent and is <b>not</b> affiliated with or endorsed by Science Olympiad, Inc., any school or district, or any textbook publisher. Names such as “Science Olympiad” belong to their owners. Lessons and questions are original study material written for practice. They are not official event questions.</p>
<h2>3. No guarantees</h2><p>{N} was created with AI assistance (see the <a href="/ai-disclosure/">AI disclosure</a>). We work hard to make content correct and check it carefully, but errors can happen. Always check important facts against your textbook, your teacher or the official rules. {N} does not promise any grade, score or competition result. The service is provided “as is” and “as available”.</p>
<h2>4. Your account</h2><ul><li>Give accurate information and keep your password private. You are responsible for activity on your account.</li><li>Pick a username that is not your real name and is appropriate for a school audience. We may change or remove names that are not.</li><li>One person per account. Do not impersonate others.</li></ul>
<h2>5. Fair play and acceptable use</h2><ul><li>Do not cheat the XP or league system with scripts, edited data or automated tools. We may reset impossible progress.</li><li>Do not attack, overload, scan or try to break the service or other users’ accounts.</li><li>Do not scrape the question bank, or copy it to sell it.</li><li>Be kind to friends. Harassment, hate or sharing personal information is not allowed and can lead to removal.</li></ul>
<h2>6. Coins, avatars and rewards</h2><p>Coins, XP, streaks and avatars are cosmetic and for fun. They have no cash value, cannot be bought, sold or transferred, and can be reset if we find abuse.</p>
<h2>7. Content and licence</h2><p>The site’s code and original lessons and questions are provided for personal, non-commercial educational use unless the project’s repository states a different licence. Your progress data belongs to you.</p>
<h2>8. Third-party links</h2><p>We link to outside learning resources such as Khan Academy, universities and NOAA. We do not control them and are not responsible for their content.</p>
<h2>9. Ending your use</h2><p>You can stop at any time and delete your account in the app. We may suspend accounts that break these terms or end the service, with notice where possible.</p>
<h2>10. Limits of liability</h2><p>To the fullest extent the law allows, the people who run {N} are not liable for indirect or consequential losses from using the site. Nothing here limits rights you have under law that cannot be limited.</p>
<h2>11. Changes and law</h2><p>We may update these terms and will change the date above; continued use means you accept the update. These terms are governed by the laws of the State of California, USA.</p>
<h2>12. Contact</h2><p>{P}</p></div>'''
    return page('terms',f'Terms of Service · {N}',b,f'The rules for using {N}.')
def access():
    b=f'''<div class="wrap doc"><h1>Accessibility</h1><p>{N} is for every learner. We aim to meet the <a href="https://www.w3.org/TR/WCAG22/">Web Content Accessibility Guidelines (WCAG) 2.2, level AA</a> on every page and in the learning app.</p>
<h2>What we do</h2><ul><li><b>Keyboard:</b> everything works without a mouse. Drag questions have arrow-key versions; grid questions use arrow keys and Enter.</li><li><b>Screen readers:</b> landmarks, labelled controls, live announcements for right and wrong answers, and text descriptions for pictures and simulations.</li><li><b>Voice:</b> a built-in voice reads questions, hints and explanations. Choose the voice and speed in Settings.</li><li><b>Vision:</b> text meets contrast ratios of 4.5:1 or better, works at 200% zoom and in light and dark themes, and never uses colour alone to show right or wrong.</li><li><b>Motion and sound:</b> animations turn off if your device asks for reduced motion. Sounds can be switched off.</li><li><b>Touch:</b> large tap targets, no required gestures or timing (timed tests are optional and say so).</li><li><b>Reading level:</b> short sentences and plain words; every topic starts at a 5th–6th grade level.</li></ul>
<h2>Known gaps</h2><ul><li>Some interactive simulations are visual by nature. Each has a written description and a keyboard or typed alternative, but the experience is not identical.</li><li>Maths is written in plain text (for example “x² + 3x”) rather than MathML, so some screen readers may read symbols differently.</li></ul>
<h2>Tell us</h2><p>If something is hard to use, tell us and we will fix it. {CONTACT}</p></div>'''
    return page('accessibility',f'Accessibility · {N}',b,f'How {N} supports all learners.')
REFS=[
('Retrieval practice','Quick answers, not re-reading. Every question asks you to recall or produce an answer.','Roediger &amp; Karpicke (2006), <i>Psychological Science</i> 17(3), 249–255','10.1111/j.1467-9280.2006.01693.x'),
('Retrieval beats note-making','Short-answer practice beats copying or mapping notes, even for later concept questions.','Karpicke &amp; Blunt (2011), <i>Science</i> 331, 772–775','10.1126/science.1199327'),
('Spaced review','Old topics return on a growing schedule, just before you would forget.','Cepeda, Pashler, Vul, Wixted &amp; Rohrer (2006), <i>Psychological Bulletin</i> 132(3), 354–380','10.1037/0033-2909.132.3.354'),
('Interleaving','Practice mixes topics so you learn to choose the right method, not just run one.','Rohrer &amp; Taylor (2007), <i>Instructional Science</i> 35, 481–498','10.1007/s11251-007-9015-8'),
('The 85% rule','Difficulty adapts to keep you getting most answers right but not all, the zone where learning is fastest.','Wilson, Shenhav, Straccia &amp; Cohen (2019), <i>Nature Communications</i> 10, 4646','10.1038/s41467-019-12552-4'),
('Worked examples first','New ideas start with a solved example, then fade to your own attempts.','Sweller &amp; Cooper (1985), <i>Cognition and Instruction</i> 2(1), 59–89','10.1207/s1532690xci0201_3'),
('Adapting to your level','Beginners get more guidance; stronger students get less, because extra help can slow experts.','Kalyuga, Ayres, Chandler &amp; Sweller (2003), <i>Educational Psychologist</i> 38(1), 23–31','10.1207/S15326985EP3801_4'),
('Feedback that teaches','Wrong answers show where you are, where you are going, and the next step.','Hattie &amp; Timperley (2007), <i>Review of Educational Research</i> 77(1), 81–112','10.3102/003465430298487'),
('Active, then constructive','Dragging, building and explaining beats watching or reading.','Chi &amp; Wylie (2014), <i>Educational Psychologist</i> 49(4), 219–243','10.1080/00461520.2014.965823'),
('Try first, then learn','Labs let you explore an idea before the formal rule is shown.','Kapur (2008), <i>Cognition and Instruction</i> 26(3), 379–424','10.1080/07370000802212669'),
('Pictures and words together','Diagrams sit next to the words that explain them and avoid clutter.','Mayer &amp; Moreno (2003), <i>Educational Psychologist</i> 38(1), 43–52','10.1207/S15326985EP3801_6'),
('Effective study methods','Overview of which techniques work: practice testing and spacing are high-utility.','Dunlosky, Rawson, Marsh, Nathan &amp; Willingham (2013), <i>Psychological Science in the Public Interest</i> 14(1), 4–58','10.1177/1529100612453266'),
('Honest gamification','Game elements help motivation when they support the learning task. We keep rewards cosmetic.','Hamari, Koivisto &amp; Sarsa (2014), <i>HICSS</i>, 3025–3034','10.1109/HICSS.2014.377')]
def science():
    rows=''.join(f'<tr><th scope="row">{a}</th><td>{b}</td><td>{c} · <a href="https://doi.org/{d}">doi:{d}</a></td></tr>' for a,b,c,d in REFS)
    b=f'''<div class="wrap doc" style="max-width:960px"><h1>The science behind {N}</h1><p>Every feature below is chosen because research on how people learn supports it. This page lists the papers so you can check us.</p>
<div class="note"><b>What we avoid on purpose:</b> loot boxes, paid power-ups, guilt-trip streak penalties, ads and endless-scroll tricks. Coins are cosmetic. Research on gamification shows mixed results, so we use game ideas only to support practice.</div>
<table><thead><tr><th scope="col">Idea</th><th scope="col">What you see in {N}</th><th scope="col">Source</th></tr></thead><tbody>{rows}</tbody></table>
<h2>Content quality</h2><p>Topics follow public curricula and the event rules, and lessons are cross-checked against open university and Khan Academy material listed on the <a href="/resources/">resources page</a>. Every numeric question is generated from a formula and checked by a program that solves it independently. Hardest-tier questions are written at the level of the toughest items on high-school sophomore exams.</p></div>'''
    return page('science',f'The science · {N}',b,f'Research that shaped {N}.',cur='/science/')
RES={'skyvolt':[('Circuits and electricity',[('Khan Academy: Electrical engineering','https://www.khanacademy.org/science/electrical-engineering','Free video lessons and exercises.'),('PhET Circuit Construction Kit (University of Colorado Boulder)','https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc','Build and measure circuits in a simulator.'),('HyperPhysics (Georgia State University)','https://hyperphysics.phy-astr.gsu.edu/hbase/electric/elecon.html','Concise concept maps for electricity.'),('MIT OpenCourseWare','https://ocw.mit.edu/','Free university course materials, including circuits.'),('All About Circuits textbook','https://www.allaboutcircuits.com/textbook/','Free online electronics textbook.')]),
('Meteorology',[('NOAA National Weather Service JetStream','https://www.weather.gov/jetstream/','An online school for weather from the NWS.'),('UCAR COMET MetEd','https://www.meted.ucar.edu/','Free professional meteorology training modules.'),('UCAR Center for Science Education','https://scied.ucar.edu/','Student-friendly atmosphere explainers.'),('NOAA Storm Prediction Center','https://www.spc.noaa.gov/','Real forecasts, outlooks and storm reports.'),('Penn State Department of Meteorology','https://www.e-education.psu.edu/meteo3/','Free introductory course notes.')]),
('Competition',[('Science Olympiad','https://www.soinc.org/','Official rules and event information.')])],
'axiom':[('Algebra and geometry',[('Khan Academy: Algebra 1','https://www.khanacademy.org/math/algebra','Free lessons and practice.'),('Khan Academy: High school geometry','https://www.khanacademy.org/math/geometry','Free lessons and practice.'),('Desmos graphing calculator','https://www.desmos.com/calculator','Plot equations and see them move.'),('Paul’s Online Math Notes (Lamar University)','https://tutorial.math.lamar.edu/','Clear worked notes for algebra.'),('MIT OpenCourseWare','https://ocw.mit.edu/','Free university course materials.'),('Art of Problem Solving','https://artofproblemsolving.com/','Challenge problems and AMC contest archives.'),('Geometry (Jurgensen, Brown &amp; King) on the Internet Archive','https://archive.org/details/geometry00brow','The textbook this course follows, free to borrow.')])]}[site]
def resources():
    s=''.join(f'<h2>{a}</h2><ul>'+''.join(f'<li><a href="{u}" rel="noopener">{t}</a> — {d}</li>' for t,u,d in L)+'</ul>' for a,L in RES)
    b=f'<div class="wrap doc"><h1>Resources</h1><p>Trusted places to go deeper. These are run by universities, government science agencies and non-profits.</p>{s}<p class="note">Links open other websites that {N} does not control.</p></div>'
    return page('resources',f'Resources · {N}',b,f'Free, reliable learning resources for {N} topics.',cur='/resources/')
def account():
    b=f'''<div class="wrap" style="padding:40px 0 56px"><div style="text-align:center;margin-bottom:20px"><h1 style="font-size:2rem">Your {N} account</h1><p class="lead" style="margin:0 auto">Save progress on every device and add friends. No account is needed to learn.</p></div>
<div id="signed" hidden class="card" style="max-width:460px;margin:0 auto;text-align:center"><p>Signed in as <b id="who"></b>.</p><a class="btn" href="/app/">Continue learning</a></div>
<form class="acc" id="f" novalidate aria-describedby="msg"><div class="seg" role="group" aria-label="Choose"><button type="button" id="mIn" aria-pressed="true">Sign in</button><button type="button" id="mUp" aria-pressed="false">Create account</button></div>
<label class="fld" id="wId"><span id="lId">Email or username</span><input id="id" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required></label>
<label class="fld" id="wEm" hidden><span>Email</span><input id="em" type="email" autocomplete="email" autocapitalize="none" spellcheck="false"><small>Used only to sign in. Never shown to others.</small></label>
<label class="fld" id="wUn" hidden><span>Username</span><input id="un" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="16" aria-describedby="uh"><small id="uh">3 to 16 letters, numbers or _ . Not your real name.</small></label>
<label class="fld"><span>Password</span><input id="pw" type="password" autocomplete="current-password" required aria-describedby="ph"><small id="ph" hidden>At least 10 characters.</small></label>
<div class="chk"><input type="checkbox" id="sh"><label for="sh">Show password</label></div>
<div class="chk" id="wCo" hidden><input type="checkbox" id="co"><label for="co">I am 13 or older, or I have a parent or teacher’s permission. I agree to the <a href="/terms/">Terms</a> and <a href="/privacy/">Privacy Policy</a>.</label></div>
<button class="btn" id="go" type="submit" style="width:100%">Sign in</button>
<p class="msg" id="msg" role="alert" aria-live="assertive"></p>
<div id="gw" hidden><div class="or">or</div><div id="gbtn" style="display:flex;justify-content:center"></div></div></form>
<form class="acc" id="uf" hidden novalidate><h2 style="font-size:1.3rem">Pick a username</h2><p>Friends find you by it. Do not use your real name.</p><label class="fld"><span>Username</span><input id="un2" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="16"></label><button class="btn" type="submit" style="width:100%">Save and continue</button><p class="msg" id="msg2" role="alert"></p></form>
<p style="text-align:center;margin-top:20px"><a href="/app/">Continue as a guest</a></p></div>'''
    return page('account',f'Sign in or create an account · {N}',b,f'Create a free {N} account or sign in.')
ACCJS=r'''(function(){"use strict";
var $=function(i){return document.getElementById(i)},up=false,csrf="";
function ck(){var m=document.cookie.split("; ").filter(function(c){return c.indexOf("__Host-csrf=")===0})[0];return m?m.slice(12):""}
function api(m,p,b){return fetch("/api"+p,{method:m,credentials:"same-origin",headers:{"content-type":"application/json","x-csrf":csrf||ck()},body:m==="POST"?JSON.stringify(b||{}):undefined}).then(function(r){return r.json().catch(function(){return{error:"The server is not reachable. You can still learn as a guest."}}).then(function(j){j.__s=r.status;return j})})}
function say(t,id){var e=$(id||"msg");e.textContent=t||"";e.className="msg"+(t?" bad":"")}
function mark(el,bad){el.setAttribute("aria-invalid",bad?"true":"false")}
function mode(u){up=u;$("mIn").setAttribute("aria-pressed",!u);$("mUp").setAttribute("aria-pressed",u);$("wId").hidden=u;$("wEm").hidden=!u;$("wUn").hidden=!u;$("wCo").hidden=!u;$("ph").hidden=!u;$("pw").autocomplete=u?"new-password":"current-password";$("go").textContent=u?"Create account":"Sign in";say("")}
function next(){var q=/[?&]next=([^&]+)/.exec(location.search),n=q?decodeURIComponent(q[1]):"";return/^\/app\/[a-z0-9\/_-]*$/.test(n)?n:"/app/"}
function done(j){if(j.error){say(j.error);$("go").disabled=false;return}csrf=j.csrf||csrf;if(j.needUsername){$("f").hidden=true;$("uf").hidden=false;$("un2").focus();return}location.href=next()}
$("mIn").onclick=function(){mode(false)};$("mUp").onclick=function(){mode(true)};
$("sh").onchange=function(){$("pw").type=this.checked?"text":"password"};
$("f").onsubmit=function(e){e.preventDefault();say("");var pw=$("pw").value,bad=0;
 if(up){var em=$("em").value.trim(),un=$("un").value.trim().toLowerCase();
  if(!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(em)){mark($("em"),1);say("Enter a valid email.");$("em").focus();return}mark($("em"),0);
  if(!/^[a-z0-9_]{3,16}$/.test(un)){mark($("un"),1);say("Username: 3 to 16 letters, numbers or _.");$("un").focus();return}mark($("un"),0);
  if(pw.length<10){mark($("pw"),1);say("Use at least 10 characters.");$("pw").focus();return}mark($("pw"),0);
  if(!$("co").checked){say("Please confirm the age and agreement box.");$("co").focus();return}
  $("go").disabled=true;api("POST","/signup",{email:em,username:un,password:pw}).then(done)}
 else{var id=$("id").value.trim();if(!id||!pw){say("Enter your email or username and password.");return}$("go").disabled=true;api("POST","/login",{id:id,password:pw}).then(done)}};
$("uf").onsubmit=function(e){e.preventDefault();var u=$("un2").value.trim().toLowerCase();if(!/^[a-z0-9_]{3,16}$/.test(u)){say("Username: 3 to 16 letters, numbers or _.","msg2");return}api("POST","/username",{username:u}).then(function(j){if(j.error)say(j.error,"msg2");else location.href=next()})};
function loadG(cid){var s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.onload=function(){try{google.accounts.id.initialize({client_id:cid,callback:function(r){say("");api("POST","/google",{credential:r.credential}).then(done)},auto_select:false});google.accounts.id.renderButton($("gbtn"),{theme:"outline",size:"large",text:"continue_with",shape:"pill",width:320});$("gw").hidden=false}catch(x){}};document.head.appendChild(s)}
fetch("/api/config",{credentials:"same-origin"}).then(function(r){if(!r.ok||!/json/.test(r.headers.get("content-type")||""))throw 0;return r.json()}).then(function(c){if(c.google)loadG(c.google);return api("GET","/me")}).then(function(j){
 if(j.__s===200){csrf=j.csrf||"";if(j.needUsername){$("f").hidden=true;$("uf").hidden=false}else{$("f").hidden=true;$("signed").hidden=false;$("who").textContent=j.username}}}).catch(function(){say("Accounts are not available on this copy of the site. You can still learn as a guest.");$("go").disabled=true});
})();'''

SLUGS=['circuit','meteorology'] if site=='skyvolt' else ['geometry','apex','quanta']
def hub():
    cards=''.join(f'<a class="card trk" href="/app/{slug}/" style="border-top:6px solid {c}"><h2>{n}</h2><p><b>{html.escape(s)}</b></p>{chips(t[:6])}<p style="margin-top:12px;color:{c};font-weight:700">Open {n} →</p></a>' for (n,s,c,t),slug in zip(B['tracks'],SLUGS))
    b=f'''<div class="wrap" style="padding:40px 0 56px"><h1 style="font-size:2.2rem">Choose a track</h1><p class="lead">Both tracks share one account, so you can switch at any time. Your progress in each track is saved separately.</p><div class="grid" style="margin-top:24px">{cards}</div><p style="margin-top:24px"><a href="/">Back to the {N} home page</a> · <a href="/account/">Account and friends</a></p></div>'''
    return page('hub',f'Choose a track · {N}',b,'Choose a track to open.',head='<link rel="manifest" href="/app/manifest.webmanifest">',tail='<script src="/app/reg.js"></script>')

def aidisc():
    rl=f'<li>Source code, issue tracker and documentation: <a href="{REPO}" rel="noopener">{REPO}</a>.</li>' if REPO else '<li>Source code, issue tracker and documentation are published in the project’s public GitHub repository.</li>'
    b=f'''<div class="wrap doc"><h1>AI disclosure</h1><p>{N} was built with generative AI. This page explains what that means, how the material is checked, and how you can help us correct mistakes.</p>
<h2>What was made with AI</h2><ul><li>The lessons, practice questions, hints and worked explanations.</li><li>The diagrams, avatars and other illustrations, which are original vector graphics produced with code.</li><li>The website, the learning app and the account system code.</li></ul>
<p>The AI model used was Claude, made by Anthropic. It worked under the direction of a Science Olympiad coach, who set the scope, the topics and the design goals.</p>
<h2>What is not AI</h2><ul><li>No AI model runs while you use {N}. The app is static code in your browser plus a small accounts service.</li><li>Your answers, progress and messages are never sent to an AI service.</li><li>The read-aloud voice is your device’s built-in text-to-speech.</li></ul>
<h2>How the content is checked</h2><ul><li>Numeric and algebraic questions are generated from formulas, and an independent program re-solves every one to confirm the stored answer.</li><li>Automated tests confirm that every question can be answered correctly in the app and that explanations are present.</li><li>Content follows public curricula, the event rules and open university and Khan Academy material listed on the <a href="/resources/">resources page</a>.</li></ul>
<div class="note"><b>Limits.</b> Not every item has been reviewed line by line by a subject-matter expert. AI systems can state incorrect facts with confidence. Treat {N} as practice, and confirm anything important with your textbook, teacher or the official event rules.</div>
<h2>Report a problem</h2><ul>{rl}<li>Include the question text or a screenshot and the correct answer you expect. Errors are fixed and the question bank is rebuilt.</li></ul>
<p>See also the <a href="/terms/">Terms of Service</a>, <a href="/privacy/">Privacy Policy</a> and <a href="/science/">research behind the design</a>.</p></div>'''
    return page('ai-disclosure',f'AI disclosure · {N}',b,f'How {N} was created with AI and how it is checked.')
def notfound():
    return page('404',f'Page not found · {N}',f'<div class="wrap doc" style="text-align:center"><h1>Page not found</h1><p>The address may be mistyped or the page may have moved.</p><p><a class="btn" href="/">Go home</a> <a class="btn sec" href="/app/">Open the trainer</a></p></div>')
if os.path.exists(out):shutil.rmtree(out)
shutil.copytree(appdir,out+'/app',ignore=shutil.ignore_patterns('_headers'))
W=lambda p,s:(os.makedirs(os.path.dirname(out+'/'+p),exist_ok=True),open(out+'/'+p,'w',encoding='utf8').write(s))
W('index.html',landing());W('privacy/index.html',legal('privacy'));W('terms/index.html',legal('terms'));W('accessibility/index.html',access())
W('ai-disclosure/index.html',aidisc());W('science/index.html',science());W('resources/index.html',resources());W('account/index.html',account());W('404.html',notfound())
W('app/index.html',hub())
W('site.css',CSS);W('account.js',ACCJS);shutil.copy(appdir+'/icon.svg',out+'/icon.svg')
W('robots.txt','User-agent: *\nAllow: /\nDisallow: /api/\n')
W('sw.js',"/* retires the old root service worker (the app now lives in /app/) */\nself.addEventListener('install',function(){self.skipWaiting()});\nself.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.map(function(x){return caches.delete(x)}))}).then(function(){return self.registration.unregister()}).then(function(){return self.clients.matchAll()}).then(function(c){c.forEach(function(w){w.navigate(w.url)})}))});\n")
CSP="default-src 'none'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style; img-src 'self' data:; font-src 'self'; connect-src 'self' https://accounts.google.com/gsi/; frame-src https://accounts.google.com/gsi/; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests"
W('_headers',f"""/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Cross-Origin-Opener-Policy: same-origin-allow-popups
  Cross-Origin-Resource-Policy: same-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Content-Security-Policy: {CSP}
/
  Cache-Control: no-cache
/*/
  Cache-Control: no-cache
/*.html
  Cache-Control: no-cache
/sw.js
  Cache-Control: no-cache
/app/sw.js
  Cache-Control: no-cache
/site.css
  Cache-Control: public, max-age=3600
/app/app.*
  Cache-Control: public, max-age=31536000, immutable
/app/*/app.*
  Cache-Control: public, max-age=31536000, immutable
""")
print('site',site,out,sum(len(files) for _,_,files in os.walk(out)),'files')
