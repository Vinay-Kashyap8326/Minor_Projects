(() => {
const B = document.body, P = B.dataset.page, ROLE = B.dataset.role, R = B.dataset.root || '';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s ?? '').toLowerCase().normalize('NFKD').replace(/\s+/g, ' ').trim();
const today = () => new Date().toISOString().slice(0, 10);
const COPY = '© 2026 Clean City. All rights reserved. No part of this project may be copied, reproduced or redistributed without written permission.';
const LOGO = '<svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#fff"/><path d="M13 31c4-13 17-15 22-12-1 9-8 15-19 14" fill="#16a34a"/><path d="M13 31c3-6 7-9 12-11" stroke="#0284c7" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
const Q = new URLSearchParams(location.search);
const F = {status: Q.get('status') || 'All', cat: Q.get('cat') || '', q: Q.get('q') || ''};

let ls = window.localStorage;
try { ls.setItem('__t', '1'); ls.removeItem('__t'); } catch (e) { const m = {}; ls = {getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; }}; }
const safe = (v, fb) => { try { return JSON.parse(v) ?? fb; } catch (e) { return fb; } };

/* ============ CONSTANTS ============ */
const STATUS = ['Pending', 'In Progress', 'Solved', 'Rejected', 'Cancelled'];
const PROG = {Pending: 33, 'In Progress': 66, Solved: 100, Rejected: 100, Cancelled: 0};
const CAT = {
  air:   {name: 'Air Pollution', icon: '💨', color: '#2563eb', subs: ['Smoke / Factory Emission', 'Dust / Construction', 'Vehicle Emission', 'Garbage Burning']},
  water: {name: 'Water Pollution', icon: '💧', color: '#0891b2', subs: ['River / Pond Contamination', 'Drain Overflow', 'Groundwater Pollution']},
  noise: {name: 'Noise Pollution', icon: '🔊', color: '#7c3aed', subs: ['Loudspeaker', 'Construction Noise', 'Traffic Horn']},
  waste: {name: 'Waste & Cleanliness', icon: '♻️', color: '#16a34a', subs: ['Garbage on Road', 'Uncollected Waste', 'Open Debris']}
};
const TEAMS = ['Municipal Team A', 'Jal Board', 'PWD', 'Traffic Police'];
const TREND_U = [1, 2, 1, 3, 2, 4, 3], TREND_A = [12, 15, 11, 18, 16, 22, 20];
const NAV = {
  user: [['dashboard', 'Dashboard', '▦'], ['report', 'Report Complaint', '＋'], ['complaints', 'My Complaints', '☰'], ['aqi', 'AQI Data', '◉'], ['map', 'Location Search', '⌖'], ['reports', 'Reports (PDF)', '⇩'], ['profile', 'Profile', '☺']],
  admin: [['dashboard', 'Overview', '▦'], ['complaints', 'Manage Complaints', '☰'], ['aqi', 'Update AQI', '◉'], ['users', 'Users', '☺'], ['reports', 'Report Control', '⇩']]
};
/* name, AQI, map x%, map y% — 20 localities */
const LOCS = [
  ['Hazratganj',142,30,40],['Gomti Nagar',118,58,28],['Aliganj',165,74,56],['Charbagh',189,44,74],['KMCLU Campus',97,16,68],
  ['Alambagh',176,22,52],['Indira Nagar',128,66,40],['Aminabad',181,36,22],['Chowk',158,46,46],['Kaiserbagh',170,26,30],
  ['Rajajipuram',103,82,20],['Jankipuram',121,84,74],['Mahanagar',135,62,84],['Vikas Nagar',110,80,44],['Sarojini Nagar',94,70,14],
  ['Ashiyana',88,10,30],['Telibagh',149,12,86],['Nishatganj',112,56,10],['Hussainganj',169,48,30],['Lalbagh',157,40,88]
];
const DEF = {
  users: [
    {name: 'Vinay', email: 'vinay@example.com', phone: '9876543210', city: 'Lucknow', role: 'User'},
    {name: 'Ravi Kumar', email: 'ravi@example.com', phone: '9123456780', city: 'Lucknow', role: 'User'}
  ],
  aqi: LOCS.map(([loc, aqi, x, y]) => ({loc, aqi, x, y})),
  complaints: [
    {id:'CC-1041',by:'ravi@example.com',cat:'air',sub:'Dust / Construction',loc:'Aliganj',desc:'Heavy dust from road construction.',status:'In Progress',date:'2026-11-10',remark:'Team dispatched',assigned:'PWD',photo:false,inc:true},
    {id:'CC-1042',by:'vinay@example.com',cat:'waste',sub:'Garbage on Road',loc:'Gomti Nagar',desc:'Garbage has been lying on the main road for three days.',status:'Pending',date:'2026-11-12',remark:'',assigned:'',photo:true,inc:true},
    {id:'CC-1043',by:'ravi@example.com',cat:'noise',sub:'Loudspeaker',loc:'Hazratganj',desc:'Loud music after 11 PM.',status:'Solved',date:'2026-11-05',remark:'Action completed',assigned:'Traffic Police',photo:false,inc:true},
    {id:'CC-1044',by:'vinay@example.com',cat:'water',sub:'Drain Overflow',loc:'Charbagh',desc:'Drain water is flowing onto the street.',status:'Pending',date:'2026-11-14',remark:'',assigned:'',photo:false,inc:true},
    {id:'CC-1045',by:'ravi@example.com',cat:'air',sub:'Garbage Burning',loc:'KMCLU Campus',desc:'Garbage is being burned nearby.',status:'Rejected',date:'2026-11-08',remark:'Area is not under municipal jurisdiction',assigned:'',photo:false,inc:false}
  ]
};

/* ============ DATA LAYER (backend team: replace with API calls) ============ */
const KEY = 'cleancity.v3', SKEY = 'cleancity.session';
let D = safe(ls.getItem(KEY), null);
if (!D || !D.complaints || !D.aqi || !D.users) D = JSON.parse(JSON.stringify(DEF));
// BACKEND: replace save() with API writes, e.g. fetch('/api/complaints/' + id, {method:'PATCH', body: ...})
const save = () => ls.setItem(KEY, JSON.stringify(D));
// BACKEND: replace SES() with the server session / token check
const SES = () => safe(ls.getItem(SKEY), null);
const me = () => { const s = SES(); return s && D.users.find(u => u.email === s.email); };
const mine = () => D.complaints.filter(c => c.by === SES().email);
const uname = e => (D.users.find(u => u.email === e) || {name: e}).name;
const lvl = v => v <= 50 ? ['Good', '#16a34a'] : v <= 100 ? ['Satisfactory', '#65a30d'] : v <= 200 ? ['Moderate', '#d97706'] : v <= 300 ? ['Poor', '#ea580c'] : ['Very Poor', '#dc2626'];
const pill = s => `<span class="pill s-${s.replace(/ /g, '-')}">${s}</span>`;
const catTag = c => `<span class="cat">${CAT[c].icon} ${CAT[c].name}</span>`;

/* ============ ANIMATION HELPERS ============ */
function countUp(el) {
  const to = +el.dataset.count, t0 = performance.now();
  const f = t => { const p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function animateIn(c) {
  $$('.rise', c).forEach((el, i) => el.style.setProperty('--d', Math.min(i, 14) * 55 + 'ms'));
  requestAnimationFrame(() => {
    $$('[data-count]', c).forEach(countUp);
    $$('[data-w]', c).forEach(b => b.style.width = b.dataset.w + '%');
    $$('[data-ring]', c).forEach(r => r.style.strokeDashoffset = 100 - r.dataset.ring);
    $$('[data-l]', c).forEach(b => b.style.left = b.dataset.l + '%');
  });
}
const paint = (c, html) => { c.innerHTML = html; animateIn(c); };

function toast(m, type = 'ok') {
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `<span>${type === 'ok' ? '✔' : type === 'err' ? '✖' : 'ℹ'}</span><div>${esc(m)}</div>`;
  $('#toasts').append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3000);
}

function modal(html, ok) {
  const m = $('#modal');
  m.innerHTML = `<div class="modal-box">${html}<div class="actions"><button class="btn ghost" data-x>Close</button><button class="btn primary" data-ok>Confirm</button></div></div>`;
  m.classList.add('show');
  const close = () => m.classList.remove('show');
  m.querySelector('[data-x]').onclick = close;
  m.querySelector('[data-ok]').onclick = () => { ok(); close(); };
  m.onclick = e => { if (e.target === m) close(); };
}

/* ============ CHART + DASHBOARD ============ */
function chart(vals) {
  const W = 640, H = 200, m = Math.max(...vals, 5) * 1.2;
  const p = vals.map((v, i) => [i * W / (vals.length - 1), H - v / m * (H - 24) - 12]);
  const ln = p.map(x => x[0].toFixed(1) + ',' + x[1].toFixed(1)).join(' ');
  const days = vals.map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (vals.length - 1 - i)); return d.getDate() + ' ' + d.toLocaleString('en', {month: 'short'}); });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16a34a" stop-opacity=".35"/><stop offset="1" stop-color="#16a34a" stop-opacity="0"/></linearGradient></defs>
    <polygon class="area" points="0,${H} ${ln} ${W},${H}" fill="url(#gr)"/>
    <polyline class="line draw" pathLength="1" points="${ln}"/>
    ${p.map((x, i) => `<circle class="dot" cx="${x[0].toFixed(1)}" cy="${x[1].toFixed(1)}" r="5"><title>${days[i]}: ${vals[i]} complaints</title></circle>`).join('')}</svg>
    <div class="xl">${days.map(d => `<span>${d}</span>`).join('')}</div>`;
}

const recent = (list, role) => list.slice(-5).reverse().map(c => `<a class="rrow rise" href="${role === 'user' ? 'complaint.html?id=' + c.id : 'complaints.html?q=' + c.id}"><span class="id">${c.id}</span><span>${esc(c.sub)}</span><span class="muted">${esc(c.loc)}</span>${pill(c.status)}</a>`).join('') || '<p class="muted">No complaints yet.</p>';

function board(list, trend, role, quick) {
  const n = s => list.filter(c => c.status === s).length, t = list.length, sv = t ? Math.round(n('Solved') / t * 100) : 0;
  const kp = (l, v, col, st) => `<a class="kpi rise" href="complaints.html?status=${encodeURIComponent(st)}" style="--k:${col}"><span>${l}</span><b data-count="${v}">0</b><i>View →</i></a>`;
  const bars = Object.keys(CAT).map(k => {
    const m = list.filter(c => c.cat === k).length, p = t ? Math.round(m / t * 100) : 0;
    return `<a class="cbar rise" href="complaints.html?cat=${k}"><div class="cl"><span><i class="ci">${CAT[k].icon}</i>${CAT[k].name}</span><b>${m} · ${p}%</b></div><div class="bar-track"><div class="bar-fill" data-w="${p}" style="background:${CAT[k].color}"></div></div></a>`;
  }).join('');
  const worst = [...D.aqi].sort((a, b) => b.aqi - a.aqi).slice(0, 3).map(a => {
    const [l, col] = lvl(a.aqi);
    return `<a class="rrow rise" href="map.html?q=${encodeURIComponent(a.loc)}" style="grid-template-columns:1fr auto"><span>${esc(a.loc)}</span><span class="pill" style="background:${col}22;color:${col}">AQI ${a.aqi}</span></a>`;
  }).join('');
  const pins = D.aqi.map(a => { const [, col] = lvl(a.aqi); return `<a class="pin" href="map.html?q=${encodeURIComponent(a.loc)}" style="left:${a.x}%;top:${a.y}%;background:${col}">${a.aqi}</a>`; }).join('');
  return `<div class="kpis">${kp('Pending', n('Pending'), '#f59e0b', 'Pending')}${kp('In Progress', n('In Progress'), '#2563eb', 'In Progress')}${kp('Solved', n('Solved'), '#16a34a', 'Solved')}${kp('Total', t, '#0d9488', 'All')}</div>
  <div class="dash-grid">
    <div class="card rise"><div class="ctitle">Complaint trend · last 7 days</div>${chart(trend)}</div>
    <div class="card ringcard rise"><div class="ctitle">Service level</div><div class="ringwrap">
      <svg viewBox="0 0 120 120" class="ring"><circle class="track" cx="60" cy="60" r="50" pathLength="100"/><circle class="arc" cx="60" cy="60" r="50" pathLength="100" data-ring="${sv}"/></svg>
      <div class="ringval"><b data-count="${sv}">0</b><span>% resolved</span></div></div></div>
  </div>
  <div class="grid3">
    <div class="card rise"><div class="ctitle">By category</div>${bars}</div>
    <div class="card rise"><div class="ctitle">Quick actions</div>${quick}</div>
    <div class="card rise"><div class="ctitle">Worst AQI today</div>${worst}<div class="mini-map" style="margin-top:12px">${pins}</div></div>
  </div>
  <div class="card rise"><div class="ctitle">Recent complaints</div>${recent(list, role)}</div>`;
}

const QUICK_USER = `<div class="quick"><button class="qbtn" data-go="report">＋ Report issue</button><button class="qbtn" data-go="complaints">📋 My complaints</button><button class="qbtn" data-go="map">📍 Search location</button><button class="qbtn" data-go="reports">⇩ Download PDF</button></div>`;
const QUICK_ADMIN = `<div class="quick"><button class="qbtn" data-go="complaints">☰ Assign complaints</button><button class="qbtn" data-go="aqi">◉ Update AQI</button><button class="qbtn" data-go="users">☺ Manage users</button><button class="qbtn" data-go="reports">⇩ Report control</button></div>`;

/* ============ COMPLAINT LISTS ============ */
const filtered = list => list.filter(c =>
  (F.status === 'All' || c.status === F.status) &&
  (!F.cat || c.cat === F.cat) &&
  (!norm(F.q) || norm([c.id, c.sub, c.loc, c.desc, c.status, CAT[c.cat].name].join(' ')).includes(norm(F.q))));

const ccard = c => `<article class="card ccard rise">
  <div class="cc-top"><div><span class="id">${c.id}</span> ${catTag(c.cat)}</div>${pill(c.status)}</div>
  <h3><a href="complaint.html?id=${c.id}">${esc(c.sub)}</a></h3>
  <p class="muted small">📍 ${esc(c.loc)} · ${c.date}${c.photo ? ' · 📷 Photo attached' : ''}</p>
  <p>${esc(c.desc)}</p>
  <div class="bar-track"><div class="bar-fill" data-w="${PROG[c.status]}" style="background:${c.status === 'Rejected' || c.status === 'Cancelled' ? '#dc2626' : 'var(--green)'}"></div></div>
  ${c.remark ? `<div class="remark"><b>Remark:</b> ${esc(c.remark)}</div>` : ''}
  <div class="cc-actions">${c.status === 'Pending'
    ? `<button class="btn ghost sm" data-edit="${c.id}">Edit</button><button class="btn danger sm" data-cancel="${c.id}">Cancel</button>`
    : '<span class="muted small">Editing is no longer possible</span>'}</div>
</article>`;

const arow = x => `<tr class="rise"><td class="id">${x.id}</td><td>${esc(uname(x.by))}</td><td>${CAT[x.cat].icon} ${CAT[x.cat].name}</td>
  <td><select class="as">${TEAMS.map(t => `<option ${x.assigned === t ? 'selected' : ''}>${t}</option>`).join('')}</select></td>
  <td><select class="st">${STATUS.map(s => `<option ${x.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
  <td><input class="rm" value="${esc(x.remark)}" style="min-width:170px"></td>
  <td><button class="btn primary sm" data-save="${x.id}">Save</button></td></tr>`;

function updateList() {
  const c = $('#clist'); if (!c) return;
  const list = filtered(mine().slice().reverse());
  c.innerHTML = list.length ? list.map(ccard).join('') : '<div class="empty rise">No complaints match this filter.</div>';
  animateIn(c);
}
function updateAdmin() {
  const b = $('#atbody'); if (!b) return;
  const list = filtered(D.complaints.slice().reverse());
  b.innerHTML = list.length ? list.map(arow).join('') : '<tr><td colspan="7" class="muted">No complaints match this filter.</td></tr>';
}
const refresh = () => { updateList(); updateAdmin(); };
const chipsHTML = () => ['All', ...STATUS].map(s => `<button class="chip ${F.status === s ? 'on' : ''}" data-chip="${s}">${s}</button>`).join('') +
  (F.cat ? `<button class="chip on" data-clearcat>${CAT[F.cat].name} ✕</button>` : '');

/* ============ MAP + AQI ============ */
function drawMap(q) {
  const nq = norm(q);
  const list = D.aqi.map((a, i) => ({...a, i})).filter(a => !nq || norm(a.loc).includes(nq));
  $('#mL').innerHTML = list.map(a => { const [l, col] = lvl(a.aqi); return `<button class="loc-item rise" data-loc="${a.i}"><b>${esc(a.loc)}</b><span class="pill" style="background:${col}22;color:${col}">AQI ${a.aqi}</span></button>`; }).join('') || '<p class="muted">No locality found. Try another spelling.</p>';
  $('#mM').innerHTML = '<div class="map-note">Google Maps: API will be connected by the backend team</div>' + D.aqi.map(a => {
    const [, col] = lvl(a.aqi), hit = !nq || norm(a.loc).includes(nq);
    return `<div class="pin ${hit ? '' : 'dim'}" data-loc="${a.i}" style="left:${a.x}%;top:${a.y}%;background:${col}">${a.aqi}</div>`;
  }).join('');
  animateIn($('#mL'));
}
function showInfo(i) {
  const a = D.aqi[i], [l, col] = lvl(a.aqi);
  const n = D.complaints.filter(c => norm(c.loc) === norm(a.loc)).length;
  const box = $('#mi'); box.hidden = false;
  box.innerHTML = `<div class="cc-top"><b>${esc(a.loc)}</b><span class="pill" style="background:${col}22;color:${col}">${l}</span></div>
    <div class="aqi-val" style="color:${col}" data-count="${a.aqi}">0</div>
    <p class="muted">Complaints in this area: <b>${n}</b></p>
    <div class="actions"><button class="btn ghost sm" id="miClose">Close</button><a class="btn primary sm" href="complaints.html?q=${encodeURIComponent(a.loc)}">View complaints</a></div>`;
  box.classList.remove('rise'); void box.offsetWidth; box.classList.add('rise');
  animateIn(box);
}
function drawAqi(q) {
  const list = D.aqi.filter(a => norm(a.loc).includes(norm(q)));
  $('#agrid').innerHTML = list.map(a => { const [l, col] = lvl(a.aqi); return `<a class="card aqi-card rise" href="map.html?q=${encodeURIComponent(a.loc)}" style="--c:${col}"><div class="muted small">${esc(a.loc)}</div><div class="aqi-val" data-count="${a.aqi}">0</div><span class="pill" style="background:${col}22;color:${col};justify-self:start">${l}</span><div class="aqi-scale"><i data-l="${Math.min(a.aqi / 3, 100)}"></i></div></a>`; }).join('') || '<div class="empty rise">No localities found.</div>';
  $('#aqn').textContent = list.length + ' localities';
  animateIn($('#agrid'));
}

function fillSub() { const s = $('#rSub'); if (s) s.innerHTML = CAT[$('#rCat').value].subs.map(x => `<option>${x}</option>`).join(''); }

/* ============ ACTIONS ============ */
function editC(id) {
  const x = D.complaints.find(z => z.id === id);
  modal(`<h3>Edit complaint · ${x.id}</h3>
    <label>Location<input id="mL2" value="${esc(x.loc)}" list="locs"></label>
    <label>Description<textarea id="mD" rows="4">${esc(x.desc)}</textarea></label>`,
    () => { x.loc = $('#mL2').value; x.desc = $('#mD').value; save(); toast('Complaint updated'); again(); });
}
function cancelC(id) {
  const x = D.complaints.find(z => z.id === id);
  modal(`<h3>Cancel complaint?</h3><p class="muted">${x.id} will be cancelled. This action cannot be undone.</p>`,
    () => { x.status = 'Cancelled'; save(); toast(`${x.id} cancelled`, 'err'); again(); });
}
const again = () => PAGES[ROLE][P]($('#pc'));

/* ============ PAGES: USER ============ */
const PAGES = {
  user: {
    dashboard(c) {
      const l = mine();
      paint(c, `<div class="head row rise"><div><h2>Hello, ${esc(SES().name)} 👋</h2><p>Here is the cleanliness snapshot for your area.</p></div><a class="btn primary" href="report.html">+ New complaint</a></div>${board(l, TREND_U, 'user', QUICK_USER)}`);
    },
    report(c) {
      const u = me();
      paint(c, `<div class="head rise"><h2>Report a Complaint</h2><p>Your name and phone are filled automatically from your profile.</p></div>
        <form id="rForm" class="card form-grid rise">
          <label>Pollution type<select id="rCat" name="ccat">${Object.entries(CAT).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join('')}</select></label>
          <label>Sub-category<select id="rSub" name="csub"></select></label>
          <label class="full">Title<input name="ctitle" maxlength="80" required placeholder="e.g. Drain overflowing on main road"></label>
          <label class="full">Description <small id="dc" class="muted">0 / 400</small><textarea name="cdesc" rows="4" maxlength="400" required placeholder="Describe the problem in detail"></textarea></label>
          <label class="full">Location<div class="inline"><input name="cloc" list="locs" required placeholder="Start typing a locality…"><a class="btn ghost sm" href="map.html">Open map</a></div></label>
          <label>Name<input value="${esc(u.name)}" disabled></label>
          <label>Phone<input value="${esc(u.phone || '')}" disabled></label>
          <label class="full">Photo (optional)<input type="file" name="cphoto" accept="image/*"></label>
          <div class="full actions"><button type="reset" class="btn ghost">Reset</button><button class="btn primary" id="rSubmit">Submit complaint</button></div>
        </form>
        <datalist id="locs">${D.aqi.map(a => `<option value="${esc(a.loc)}">`).join('')}</datalist>`);
      fillSub();
    },
    complaints(c) {
      paint(c, `<div class="head row rise"><div><h2>My Complaints</h2><p>Track progress. Pending complaints can be edited or cancelled.</p></div><a class="btn primary" href="report.html">+ New</a></div>
        <div class="toolbar rise"><input id="cq" class="search" placeholder="Search ID, type, location…" value="${esc(F.q)}"><div class="chips" id="chips">${chipsHTML()}</div></div>
        <div id="clist"></div>`);
      updateList();
    },
    complaint(c) {
      const id = Q.get('id'), x = D.complaints.find(z => z.id === id && z.by === SES().email);
      if (!x) { paint(c, `<div class="empty rise">Complaint not found.<br><a href="complaints.html">Go to my complaints</a></div>`); return; }
      const steps = ['Pending', 'In Progress', 'Solved'], idx = steps.indexOf(x.status), closed = idx < 0;
      paint(c, `<a href="complaints.html" class="muted small back">← My Complaints</a>
        <div class="head rise"><h2>${esc(x.sub)} <span class="id">${x.id}</span></h2></div>
        <div class="dash-grid">
          <div class="card rise">
            <div class="cc-top">${catTag(x.cat)}${pill(x.status)}</div>
            <p style="margin:16px 0">${esc(x.desc)}</p>
            <p class="muted small">📍 ${esc(x.loc)} · Filed: ${x.date}${x.photo ? ' · 📷 Photo attached' : ''}</p>
            ${closed ? `<p class="muted" style="margin-top:14px">This complaint is ${x.status}.</p>` : `<div class="tl">${steps.map((s, i) => `<div class="${i <= idx ? 'on' : ''}">${s}</div>`).join('')}</div>`}
            ${x.remark ? `<div class="remark rise"><b>Remark:</b> ${esc(x.remark)}</div>` : ''}
          </div>
          <div class="card rise">
            <div class="ctitle">Assigned team</div>
            <p><b>${esc(x.assigned || 'Not assigned yet')}</b></p>
            <div class="ctitle" style="margin-top:22px">Actions</div>
            <div class="cc-actions">${x.status === 'Pending'
              ? `<button class="btn ghost" data-edit="${x.id}">Edit</button><button class="btn danger" data-cancel="${x.id}">Cancel</button>`
              : '<span class="muted small">No changes allowed now</span>'}</div>
          </div>
        </div>`);
    },
    aqi(c) {
      paint(c, `<div class="head rise"><h2>AQI Data</h2><p>Air Quality Index across Lucknow localities (demo data). Tap a card to see it on the map.</p></div>
        <div class="toolbar rise"><input id="aqq" class="search" placeholder="Search locality (any letter case)…"><span class="muted small" id="aqn"></span></div>
        <div class="aqi-grid" id="agrid"></div>`);
      drawAqi('');
    },
    map(c) {
      const q = Q.get('q') || '';
      paint(c, `<div class="head rise"><h2>Location Search</h2><p>Search any locality and tap a pin to see AQI and complaint details.</p></div>
        <div class="map-wrap">
          <div class="card map-side rise"><input id="mS" class="search" list="locs" placeholder="Search locality…" value="${esc(q)}"><div id="mL" class="mlist"></div></div>
          <div class="map rise" id="mM"></div>
        </div>
        <div id="mi" class="card mi" hidden></div>
        <datalist id="locs">${D.aqi.map(a => `<option value="${esc(a.loc)}">`).join('')}</datalist>`);
      drawMap(q);
      if (q) { const i = D.aqi.findIndex(a => norm(a.loc) === norm(q)); if (i > -1) showInfo(i); }
    },
    reports(c) {
      const l = mine();
      paint(c, `<div class="head rise"><h2>Reports (PDF)</h2><p>Download your complaint report or send it to your Gmail.</p></div>
        <div class="card rise"><div class="kpis">${[['Total', l.length, '#0ea5e9'], ['Solved', l.filter(x => x.status === 'Solved').length, '#16a34a'], ['Pending', l.filter(x => x.status === 'Pending').length, '#f59e0b']].map(([a, v, k]) => `<div class="kpi" style="--k:${k}"><span>${a}</span><b data-count="${v}">0</b></div>`).join('')}</div>
        <div class="actions"><button class="btn ghost" id="rMail">Send to Gmail</button><button class="btn primary" id="rPdf">Download PDF</button></div></div>`);
    },
    profile(c) {
      const u = me();
      paint(c, `<div class="head rise"><h2>Profile</h2><p>Update your details. Email cannot be changed.</p></div>
        <div class="card profile rise"><div class="avatar">${esc((u.name[0] || 'U').toUpperCase())}</div>
        <form id="pForm" class="form-grid">
          <label>Name<input name="fn" value="${esc(u.name)}" required></label>
          <label>Email<input value="${esc(u.email)}" disabled></label>
          <label>Phone<input name="fp" value="${esc(u.phone || '')}"></label>
          <label>City<input name="fc" value="${esc(u.city || '')}"></label>
          <div class="full actions"><button class="btn primary">Save</button></div>
        </form></div>`);
    }
  },

  /* ============ PAGES: ADMIN ============ */
  admin: {
    dashboard(c) {
      paint(c, `<div class="head rise"><h2>Admin Overview</h2><p>All complaints and service level at a glance.</p></div>${board(D.complaints, TREND_A, 'admin', QUICK_ADMIN)}`);
    },
    complaints(c) {
      paint(c, `<div class="head rise"><h2>Manage Complaints</h2><p>Assign teams, update status and add remarks. Saving sends an email to the user.</p></div>
        <div class="toolbar rise"><input id="aq" class="search" placeholder="Search ID, user, location…" value="${esc(F.q)}"><div class="chips" id="chips">${chipsHTML()}</div></div>
        <div class="card table-wrap rise"><table class="tbl"><thead><tr><th>ID</th><th>User</th><th>Type</th><th>Assign</th><th>Status</th><th>Remark</th><th></th></tr></thead><tbody id="atbody"></tbody></table></div>`);
      updateAdmin();
    },
    aqi(c) {
      paint(c, `<div class="head rise"><h2>Update AQI</h2><p>Change the AQI for any locality. Saved values appear on the user side.</p></div>
        <div class="card table-wrap rise"><table class="tbl"><thead><tr><th>Locality</th><th>Current AQI</th><th>New value</th><th>Level</th></tr></thead><tbody>
        ${D.aqi.map((a, i) => `<tr><td>${esc(a.loc)}</td><td><b>${a.aqi}</b></td><td><input type="number" min="0" max="500" class="ai" data-i="${i}" value="${a.aqi}" style="width:120px"></td><td>${lvl(a.aqi)[0]}</td></tr>`).join('')}
        </tbody></table><div class="actions" style="margin-top:18px"><button class="btn primary" id="aqiSave">Save all changes</button></div></div>`);
    },
    users(c) {
      paint(c, `<div class="head rise"><h2>Users</h2><p>Change roles or block and unblock accounts.</p></div>
        <div class="card table-wrap rise"><table class="tbl"><thead><tr><th>Name</th><th>Email</th><th>City</th><th>Complaints</th><th>Role</th><th>Status</th></tr></thead><tbody>
        ${D.users.map((u, i) => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.city)}</td>
          <td>${D.complaints.filter(x => x.by === u.email).length}</td>
          <td><select data-role="${i}"><option ${u.role !== 'Admin' ? 'selected' : ''}>User</option><option ${u.role === 'Admin' ? 'selected' : ''}>Admin</option></select></td>
          <td><button class="btn sm ${u.blocked ? 'danger' : 'ghost'}" data-block="${i}">${u.blocked ? 'Blocked' : 'Active'}</button></td></tr>`).join('')}
        </tbody></table></div>`);
    },
    reports(c) {
      paint(c, `<div class="head rise"><h2>Report Control</h2><p>Choose which complaints go into the report. Only selected complaints are included in the PDF.</p></div>
        <div class="card table-wrap rise"><table class="tbl"><thead><tr><th>Include</th><th>ID</th><th>Type</th><th>Location</th><th>Status</th></tr></thead><tbody>
        ${D.complaints.map(x => `<tr><td><input type="checkbox" data-inc="${x.id}" ${x.inc ? 'checked' : ''}></td><td class="id">${x.id}</td><td>${CAT[x.cat].name}</td><td>${esc(x.loc)}</td><td>${pill(x.status)}</td></tr>`).join('')}
        </tbody></table><div class="actions" style="margin-top:18px"><button class="btn primary" id="apdf">Download selected PDF</button></div></div>`);
    }
  }
};

/* ============ PDF ============ */
function printReport(list, title) {
  const w = window.open('', '_blank');
  if (!w) return toast('Pop-up blocked. Please allow pop-ups.', 'err');
  w.document.write(`<html><head><meta charset="UTF-8"><title>${esc(title)}</title><style>
    body{font-family:sans-serif;padding:36px;color:#0d2b22}h1{color:#16a34a;margin-bottom:4px}
    p{color:#5b776c}table{width:100%;border-collapse:collapse;margin-top:18px}
    th,td{border-bottom:1px solid #d9ece2;padding:9px;text-align:left;font-size:13px}th{background:#f2faf6}
    </style></head><body><h1>Clean City — ${esc(title)}</h1><p>Date: ${today()} · Total: ${list.length}</p>
    <table><tr><th>ID</th><th>Type</th><th>Location</th><th>Status</th><th>Date</th></tr>
    ${list.map(c => `<tr><td>${c.id}</td><td>${CAT[c.cat].name}</td><td>${esc(c.loc)}</td><td>${c.status}</td><td>${c.date}</td></tr>`).join('')}
    </table></body></html>`);
  w.document.close(); w.focus(); w.print();
}

/* ============ EVENTS ============ */
function toggleMenu() {
  const o = !$('#sidebar').classList.contains('open');
  $('#sidebar').classList.toggle('open', o);
  $('#menuBtn').classList.toggle('x', o);
  $('#overlay').classList.toggle('show', o);
}
function closeMenu() {
  $('#sidebar')?.classList.remove('open');
  $('#menuBtn')?.classList.remove('x');
  $('#overlay')?.classList.remove('show');
}
function logout() { ls.removeItem(SKEY); toast('Logged out'); setTimeout(() => location.href = R + 'login.html', 300); }

document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn,.nav-item,.kpi,.tab,.loc-item,.qbtn,.chip,.social button');
  if (!b) return;
  const r = b.getBoundingClientRect(), s = document.createElement('span'), z = Math.max(r.width, r.height);
  s.className = 'ripple';
  s.style.cssText = `width:${z}px;height:${z}px;left:${e.clientX - r.left - z / 2}px;top:${e.clientY - r.top - z / 2}px`;
  b.classList.add('rel'); b.append(s); setTimeout(() => s.remove(), 600);
});

document.addEventListener('click', e => {
  const t = e.target;
  const go = t.closest('[data-go]');
  if (go) { location.href = R + ROLE + '/' + go.dataset.go + '.html'; return; }
  const ch = t.closest('[data-chip]');
  if (ch) { F.status = ch.dataset.chip; $('#chips').innerHTML = chipsHTML(); return refresh(); }
  if (t.closest('[data-clearcat]')) { F.cat = ''; $('#chips').innerHTML = chipsHTML(); return refresh(); }
  const ed = t.closest('[data-edit]'); if (ed) return editC(ed.dataset.edit);
  const cn = t.closest('[data-cancel]'); if (cn) return cancelC(cn.dataset.cancel);
  const sv = t.closest('[data-save]');
  if (sv) {
    const row = sv.closest('tr'), x = D.complaints.find(z => z.id === sv.dataset.save);
    x.assigned = row.querySelector('.as').value;
    x.status = row.querySelector('.st').value;
    x.remark = row.querySelector('.rm').value;
    save(); toast(`${x.id} updated · email sent to user (Gmail, demo)`);
    row.classList.add('flash'); setTimeout(() => refresh(), 350); return;
  }
  const bl = t.closest('[data-block]');
  if (bl) { const u = D.users[+bl.dataset.block]; u.blocked = !u.blocked; save(); toast(`${u.name}: ${u.blocked ? 'blocked' : 'active'}`, u.blocked ? 'err' : 'ok'); return again(); }
  if (t.closest('#miClose')) { $('#mi').hidden = true; return; }
  const lc = t.closest('[data-loc]');
  if (lc && P === 'map') return showInfo(+lc.dataset.loc);
  if (t.closest('#aqiSave')) { $$('.ai').forEach(i => { D.aqi[+i.dataset.i].aqi = +i.value || 0; }); save(); toast('AQI data updated'); return again(); }
  if (t.closest('#apdf')) return printReport(D.complaints.filter(x => x.inc), 'Report Control');
  if (t.closest('#rPdf')) { const b = t.closest('#rPdf'); b.classList.add('loading'); setTimeout(() => { b.classList.remove('loading'); printReport(mine(), 'My Complaint Report'); }, 400); return; }
  if (t.closest('#rMail')) { const b = t.closest('#rMail'); b.classList.add('loading'); setTimeout(() => { b.classList.remove('loading'); toast('Report sent to your Gmail (demo)'); }, 900); return; }
  if (t.closest('#logoutBtn')) return logout();
  if (t.closest('#menuBtn')) return toggleMenu();
  if (t.closest('#overlay')) return closeMenu();
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'rCat') return fillSub();
  if (t.dataset.inc) { const x = D.complaints.find(z => z.id === t.dataset.inc); x.inc = t.checked; save(); toast(`${x.id} ${x.inc ? 'included' : 'excluded'}`, 'info'); return; }
  if (t.dataset.role) { D.users[+t.dataset.role].role = t.value; save(); toast('Role updated'); }
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'cq' || t.id === 'aq') { F.q = t.value; return refresh(); }
  if (t.id === 'mS') return drawMap(t.value);
  if (t.id === 'aqq') return drawAqi(t.value);
  if (t.name === 'cdesc') { const d = $('#dc'); if (d) d.textContent = t.value.length + ' / 400'; }
});

document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'rForm') {
    e.preventDefault();
    const b = $('#rSubmit'); b.classList.add('loading'); b.textContent = 'Submitting…';
    setTimeout(() => {
      const id = 'CC-' + (1040 + D.complaints.length + 1);
      D.complaints.push({id, by: SES().email, cat: f.ccat.value, sub: f.csub.value, loc: f.cloc.value, desc: f.cdesc.value, status: 'Pending', date: today(), remark: '', assigned: '', photo: !!f.cphoto.files[0], inc: true});
      save(); toast('Complaint submitted · ' + id);
      setTimeout(() => location.href = 'complaints.html', 600);
    }, 700);
  }
  if (f.id === 'pForm') {
    e.preventDefault();
    const u = me();
    Object.assign(u, {name: f.fn.value.trim(), phone: f.fp.value.trim(), city: f.fc.value.trim()});
    const s = SES(); Object.assign(s, {name: u.name, phone: u.phone, city: u.city});
    ls.setItem(SKEY, JSON.stringify(s)); save();
    toast('Profile saved'); setTimeout(() => location.reload(), 700);
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); $('#modal')?.classList.remove('show'); } });

/* ============ APP SHELL ============ */
function initApp() {
  const act = P === 'complaint' ? 'complaints' : P, s = SES();
  $('#root').innerHTML = `
  <header class="topbar">
    <a class="brand" href="${R}${ROLE}/dashboard.html">Clean City</a>
    <div class="grow"></div>
    <div class="who"><div class="avatar sm">${esc((s.name || 'U')[0].toUpperCase())}</div><span>${esc(s.name)}</span></div>
    <button class="btn ghost sm" id="logoutBtn">Logout</button>
  </header>
  <aside id="sidebar" class="sidebar">
    <button id="menuBtn" class="menu-btn tab-btn" aria-label="Menu"><span></span><span></span><span></span></button>
    <div class="nav-label">${ROLE === 'admin' ? 'Admin Panel' : 'Menu'}</div>
    ${NAV[ROLE].map(([k, l, i], n) => `<a class="nav-item ${k === act ? 'current' : ''}" style="--d:${n * 60}ms" href="${R}${ROLE}/${k}.html"><span class="ico">${i}</span>${l}</a>`).join('')}
  </aside>
  <div id="overlay" class="overlay"></div>
  <main id="main" class="main"><section class="panel" id="pc"></section></main>
  <footer class="foot">${COPY}</footer>`;
  const fn = PAGES[ROLE][P];
  if (fn) fn($('#pc')); else $('#pc').innerHTML = '<div class="empty">Page not found.</div>';
}

/* ============ LOGIN ============ */
function signIn(p) {
  ls.setItem(SKEY, JSON.stringify({email: p.email, name: p.name, phone: p.phone, city: p.city, isAdmin: p.admin}));
  if (!D.users.find(u => u.email === p.email)) D.users.push({name: p.name, email: p.email, phone: p.phone, city: p.city, role: p.admin ? 'Admin' : 'User'});
  save();
  toast('Welcome, ' + p.name);
  setTimeout(() => location.href = p.admin ? 'admin/dashboard.html' : 'user/dashboard.html', 500);
}

function initLogin() {
  $('#root').innerHTML = `<section class="auth">
    <div class="auth-hero"><span class="blob b1"></span><span class="blob b2"></span>
      <a class="logo" href="index.html">${LOGO}<span>Clean City</span></a>
      <h1>Keep your city<br>clean & green.</h1>
      <p>शिकायत दर्ज करें, प्रगति ट्रैक करें और अपने इलाके की हवा की गुणवत्ता जानें।</p>
      <ul class="feat"><li style="--d:.3s">Live AQI data</li><li style="--d:.45s">Complaint tracking</li><li style="--d:.6s">PDF reports & email updates</li></ul>
    </div>
    <div class="auth-card">
      <div class="tabs"><button class="tab active" data-tab="login">Login</button><button class="tab" data-tab="signup">Sign up</button></div>
      <form id="loginForm" class="stack">
        <label>Email<input name="email" type="email" placeholder="you@example.com" required></label>
        <label>Password<input name="pass" type="password" placeholder="At least 6 characters" required></label>
        <label class="check"><input type="checkbox" name="admin"> Login as Admin</label>
        <button class="btn primary full">Send OTP</button>
      </form>
      <form id="signupForm" class="stack" hidden>
        <label>Full name<input name="fullname" required></label>
        <label>Phone<input name="sphone" inputmode="numeric" maxlength="10" required></label>
        <label>City<input name="scity" required></label>
        <label>Email<input name="semail" type="email" required></label>
        <label>Password<input name="spass" type="password" required></label>
        <button class="btn primary full">Create account & get OTP</button>
      </form>
      <form id="otpForm" class="stack" hidden>
        <p class="muted">OTP sent to <b id="otpTo"></b></p>
        <div class="otp" id="otpBox">${'<input class="otp-box" inputmode="numeric">'.repeat(6)}</div>
        <button class="btn primary full">Verify</button>
        <button type="button" class="link" id="otpBack">Back</button>
      </form>
      <div class="divider"><span>or continue with</span></div>
      <div class="social">
        <button data-p="Google"><b>G</b> Google</button>
        <button data-p="Facebook"><b>f</b> Facebook</button>
        <button data-p="Apple"><b></b> Apple</button>
      </div>
    </div></section>`;
  let pending = null;
  const otp = $$('.otp-box');
  $$('.tab').forEach(b => b.onclick = () => {
    $$('.tab').forEach(t => t.classList.toggle('active', t === b));
    $('#loginForm').hidden = b.dataset.tab !== 'login';
    $('#signupForm').hidden = b.dataset.tab !== 'signup';
    $('#otpForm').hidden = true;
  });
  const sendOtp = () => {
    $('#loginForm').hidden = $('#signupForm').hidden = true;
    $('#otpForm').hidden = false;
    $('#otpTo').textContent = pending.email;
    otp.forEach(b => b.value = ''); otp[0].focus();
    toast('OTP sent · demo OTP: 123456', 'info');
  };
  $('#loginForm').onsubmit = e => {
    e.preventDefault();
    const f = e.target, email = f.email.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Enter a valid email', 'err');
    if (f.pass.value.length < 6) return toast('Password must be at least 6 characters', 'err');
    const ex = D.users.find(u => u.email === email);
    pending = {email, name: ex ? ex.name : email.split('@')[0], phone: ex?.phone || '', city: ex?.city || '', admin: f.admin.checked, signup: false};
    sendOtp();
  };
  $('#signupForm').onsubmit = e => {
    e.preventDefault();
    const f = e.target, phone = f.sphone.value.trim(), email = f.semail.value.trim();
    if (!f.fullname.value.trim()) return toast('Enter your name', 'err');
    if (!/^\d{10}$/.test(phone)) return toast('Enter a 10-digit phone number', 'err');
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Enter a valid email', 'err');
    if (f.spass.value.length < 6) return toast('Password must be at least 6 characters', 'err');
    pending = {email, name: f.fullname.value.trim(), phone, city: f.scity.value.trim(), admin: false, signup: true};
    sendOtp();
  };
  otp.forEach((b, i) => {
    b.oninput = () => {
      const digits = b.value.replace(/\D/g, '');
      for (let k = 0; k < digits.length && i + k < otp.length; k++) otp[i + k].value = digits[k];
      if (digits.length) otp[Math.min(i + digits.length, otp.length - 1)].focus();
    };
    b.onkeydown = e => { if (e.key === 'Backspace' && !b.value && otp[i - 1]) otp[i - 1].focus(); };
  });
  $('#otpForm').onsubmit = e => {
    e.preventDefault();
    if (otp.map(b => b.value).join('') !== '123456') {
      const box = $('#otpBox'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
      return toast('Wrong OTP', 'err');
    }
    signIn(pending);
  };
  $('#otpBack').onclick = () => { $('#otpForm').hidden = true; $(pending.signup ? '#signupForm' : '#loginForm').hidden = false; };
  $$('[data-p]').forEach(b => b.onclick = () => {
    toast(`${b.dataset.p} login demo · activates when backend is connected`, 'info');
    signIn({email: `demo.${b.dataset.p.toLowerCase()}@example.com`, name: 'Demo ' + b.dataset.p, phone: '', city: '', admin: false});
  });
}

/* ============ LANDING + 404 ============ */
function initLanding() {
  const avg = Math.round(D.aqi.reduce((a, x) => a + x.aqi, 0) / D.aqi.length), [l, c] = lvl(avg);
  $('#root').innerHTML = `
  <header class="pub-nav"><a class="brand" href="index.html">Clean City</a><div class="grow"></div>
    <a class="btn ghost" href="login.html">Login</a><a class="btn primary" href="login.html">Get started</a></header>
  <section class="landing"><div>
    <span class="eyebrow">Clean City · Digital Complaint System</span>
    <h1>Keep your city <span>clean & green</span>.</h1>
    <p class="lead">प्रदूषण की शिकायत दर्ज करें, प्रगति ट्रैक करें और अपने इलाके की हवा का AQI जानें।</p>
    <div class="actions" style="justify-content:flex-start;margin-top:28px"><a class="btn primary" href="login.html">Report a complaint →</a><a class="btn ghost" href="login.html">View AQI</a></div>
  </div>
  <div class="card hero-card"><div class="muted small">Lucknow · average AQI (demo)</div><div class="aqi-val" style="color:${c}" data-count="${avg}">0</div><span class="pill" style="background:${c}22;color:${c}">${l}</span></div></section>
  <section class="strip">
    <div class="card kpi rise" style="--k:#16a34a"><span>Localities tracked</span><b data-count="${D.aqi.length}">0</b></div>
    <div class="card kpi rise" style="--k:#0d9488"><span>Pollution categories</span><b data-count="4">0</b></div>
    <div class="card kpi rise" style="--k:#2563eb"><span>Complaints logged</span><b data-count="${D.complaints.length}">0</b></div>
  </section>
  <section class="cat-row">${Object.values(CAT).map(v => `<div class="card cat-card rise"><div class="cat-head"><i class="ci">${v.icon}</i><b>${v.name}</b></div><p class="muted small">${v.subs.join(' · ')}</p></div>`).join('')}</section>
  <section class="steps">
    <div class="card step rise"><div class="cat-head"><i class="ci">👤</i><h3>Register</h3></div><p class="muted">Sign up with email and OTP.</p></div>
    <div class="card step rise"><div class="cat-head"><i class="ci">📣</i><h3>Report</h3></div><p class="muted">Add type, location and details.</p></div>
    <div class="card step rise"><div class="cat-head"><i class="ci">🔍</i><h3>Track</h3></div><p class="muted">Follow progress until it is solved.</p></div>
  </section>
  <footer class="foot">${COPY}</footer>`;
  animateIn($('#root'));
}

function init404() {
  $('#root').innerHTML = `<div class="not-found"><h1>Page not found</h1><p class="muted">The link you opened does not exist.</p><a class="btn primary" href="index.html" style="justify-self:center">Go to home</a></div>`;
}

/* ============ BOOT ============ */
const sess = SES();
const guarded = !['login', 'landing', '404'].includes(P);
if (guarded) {
  if (!sess) location.replace(R + 'login.html');
  else if (sess.isAdmin !== (ROLE === 'admin')) location.replace(R + (sess.isAdmin ? 'admin/dashboard.html' : 'user/dashboard.html'));
  else initApp();
} else if (P === 'login') initLogin();
else if (P === 'landing') initLanding();
else if (P === '404') init404();
})();
