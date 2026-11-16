document.addEventListener('DOMContentLoaded', () => {
  let localStorage = window.localStorage;
  try {
    localStorage.setItem('__t', '1'); localStorage.removeItem('__t');
  }
  catch (e) {
    const m = {}; localStorage = {
      getItem: k => (k in m ? m[k]: null), setItem: (k, v) => {
        m[k] = String(v);
      }, removeItem: k => {
        delete m[k];
      }
    };
  }

  const B = document.body, P = B.dataset.page, ROLE = B.dataset.role, R = B.dataset.root || '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
    const today = () => new Date().toISOString().slice(0, 10);

    /* ============ CONSTANTS ============ */
    const CAT = {
    air: {
      name: 'वायु प्रदूषण', icon: '💨', color: '#2563eb', subs: ['धुआं / फैक्ट्री उत्सर्जन', 'धूल / निर्माण कार्य', 'वाहन उत्सर्जन', 'कचरा जलाना']},
    water: {
      name: 'जल प्रदूषण', icon: '💧', color: '#0891b2', subs: ['नदी / तालाब गंदा', 'नाली का गंदा पानी', 'भूजल प्रदूषण']},
    noise: {
      name: 'ध्वनि प्रदूषण', icon: '🔊', color: '#7c3aed', subs: ['लाउडस्पीकर', 'निर्माण शोर', 'ट्रैफिक हॉर्न']},
    waste: {
      name: 'कचरा व सफ़ाई', icon: '♻️', color: '#16a34a', subs: ['सड़क पर कचरा', 'कूड़ा न उठना', 'खुले में मलबा']}
    };
    const HI = {Pending: 'लंबित', 'In Progress': 'प्रगति पर', Solved: 'हल हुई', Rejected: 'अस्वीकृत', Cancelled: 'रद्द'};
    const PROG = {Pending: 33, 'In Progress': 66, Solved: 100, Rejected: 100, Cancelled: 0};
    const TEAMS = ['नगर निगम टीम A','जल बोर्ड','PWD','ट्रैफिक पुलिस'];
    const POS = [[28,38],[55,26],[72,58],[42,72],[18,70]];
    const TREND_U = [1,2,1,3,2,4,3], TREND_A = [12,15,11,18,16,22,20];
    const NAV = {
    user: [['dashboard', 'डैशबोर्ड', '▦'], ['report', 'शिकायत दर्ज करें', '＋'], ['complaints', 'मेरी शिकायतें', '☰'], ['aqi', 'AQI डेटा', '◉'], ['map', 'लोकेशन खोजें', '⌖'], ['reports', 'रिपोर्ट (PDF)', '⇩'], ['profile', 'प्रोफ़ाइल', '☺']],
    admin: [['dashboard', 'ओवरव्यू', '▦'], ['complaints', 'शिकायतें मैनेज करें', '☰'], ['aqi', 'AQI अपडेट', '◉'], ['users', 'यूज़र्स', '☺'], ['reports', 'रिपोर्ट नियंत्रण', '⇩']]
    };
    const DEF = {
    users: [{
      name: 'विनय', email: 'vinay@example.com', phone: '9876543210', city: 'लखनऊ', role: 'User'
    },
      {
        name: 'Ravi Kumar', email: 'ravi@example.com', phone: '9123456780', city: 'लखनऊ', role: 'User'
      }],
    aqi: [{
      loc: 'हज़रतगंज', aqi: 142
    }, {
      loc: 'गोमती नगर', aqi: 118
    }, {
      loc: 'अलीगंज', aqi: 165
    }, {
      loc: 'चारबाग', aqi: 189
    }, {
      loc: 'KMCLU परिसर', aqi: 97
    }],
    complaints: [{
      id: 'CC-1041', by: 'ravi@example.com', cat: 'air', sub: 'धूल / निर्माण कार्य', loc: 'अलीगंज', desc: 'सड़क निर्माण से भारी धूल उड़ रही है।', status: 'In Progress', date: '2026-11-10', remark: 'टीम भेजी गई', assigned: 'PWD', photo: false, inc: true
    },
      {
        id: 'CC-1042', by: 'vinay@example.com', cat: 'waste', sub: 'सड़क पर कचरा', loc: 'गोमती नगर', desc: 'मुख्य सड़क पर तीन दिन से कचरा पड़ा है।', status: 'Pending', date: '2026-11-12', remark: '', assigned: '', photo: true, inc: true
      },
      {
        id: 'CC-1043', by: 'ravi@example.com', cat: 'noise', sub: 'लाउडस्पीकर', loc: 'हज़रतगंज', desc: 'रात 11 बजे के बाद तेज़ आवाज़।', status: 'Solved', date: '2026-11-05', remark: 'कार्रवाई पूरी', assigned: 'ट्रैफिक पुलिस', photo: false, inc: true
      },
      {
        id: 'CC-1044', by: 'vinay@example.com', cat: 'water', sub: 'नाली का गंदा पानी', loc: 'चारबाग', desc: 'नाली का पानी सड़क पर बह रहा है।', status: 'Pending', date: '2026-11-14', remark: '', assigned: '', photo: false, inc: true
      },
      {
        id: 'CC-1045', by: 'ravi@example.com', cat: 'air', sub: 'कचरा जलाना', loc: 'KMCLU परिसर', desc: 'पास में कचरा जलाया जा रहा है।', status: 'Rejected', date: '2026-11-08', remark: 'क्षेत्र नगर निगम के अंतर्गत नहीं', assigned: '', photo: false, inc: false
      }]
    };

    /* ============ STORAGE ============ */
    const KEY = 'cleancity.v2', SKEY = 'cleancity.session';
    const safeParse = (v, fb) => { try {
      return JSON.parse(v) ?? fb;
    } catch (e) {
      return fb;
    } };
    const D = safeParse(localStorage.getItem(KEY), null) || JSON.parse(JSON.stringify(DEF));
    const save = () => localStorage.setItem(KEY, JSON.stringify(D));
    const SES = () => safeParse(localStorage.getItem(SKEY), null);const me = () => { const s = SES(); return s && D.users.find(u => u.email === s.email); };
    const mine = () => D.complaints.filter(c => c.by === SES().email);
    /* ============ HELPERS ============ */
    const uname = e => (D.users.find(u => u.email === e) || {name: e}).name;
    const pill = s => `<span class="pill s-${s.replace(/ /g,'-')}">${HI[s]}</span>`;
    const catTag = c => `<span class="cat">${CAT[c].icon} ${CAT[c].name}</span>`;
    const kpi = (l, v, c) => `<div class="kpi" style="--k:${c}">
      <span>${l}</span><b>${v}</b>
    </div>
    `;
    const lvl = v => v <= 50 ? ['अच्छा','#16a34a'] : v <= 100 ? ['संतोषजनक','#65a30d'] : v <= 200 ? ['मध्यम','#d97706'] : v <= 300 ? ['खराब','#ea580c'] : ['बहुत खराब','#dc2626'];
    const recent = l => l.slice(-4).reverse().map(c => `<div class="rrow">
      <span class="id">${c.id}</span><span>${CAT[c.cat].name}</span><span class="muted">${esc(c.loc)}</span>${pill(c.status)}
    </div>
    `).join('') || `<p class="muted">
      कोई शिकायत नहीं
    </p>
    `;
    const again = () => PAGES[ROLE][P]($('#pc'));

    function toast(m) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = m;
    $('#toasts').append(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show'); setTimeout(() => t.remove(), 300);
    }, 3200);
    }

    function modal(html, ok) {
    const m = $('#modal');
    m.innerHTML = `<div class="modal-box">${html}<div class="actions"><button class="btn ghost" data-x>बंद करें</button><button class="btn primary" data-ok>पुष्टि करें</button></div></div>`;
    m.classList.add('show');
    const close = () => m.classList.remove('show');
    m.querySelector('[data-x]').onclick = close;
    m.querySelector('[data-ok]').onclick = () => {
      ok(); close();
    };
    m.onclick = e => {
      if (e.target === m) close();
    };
    }

    function chart(vals) {
    const W = 640,
    H = 200,
    max = Math.max(...vals, 5) * 1.2;
    const p = vals.map((v, i) => [(i * W / (vals.length - 1)).toFixed(1), (H - v / max * (H - 20) - 10).toFixed(1)]);
    const ln = p.map(x => x.join(',')).join(' ');
    const days = vals.map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (vals.length - 1 - i)); return d.getDate() + ' ' + d.toLocaleString('en', {
        month: 'short'
      });
    });
    return `<svg class="chart" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16a34a" stop-opacity=".3"/><stop offset="1" stop-color="#16a34a" stop-opacity="0"/></linearGradient></defs>
    <polygon points="0,${H} ${ln} ${W},${H}" fill="url(#gr)"/>
    <polyline class="line" points="${ln}"/>
    ${p.map(x => `<circle cx="${x[0]}" cy="${x[1]}" r="4"/>`).join('')}</svg>
    <div class="xl">${days.map(d => `<span>${d}</span>`).join('')}</div>`;
    }

    function stats(list, trend) {
    const n = s => list.filter(c => c.status === s).length,
    t = list.length;
    const sv = t ? Math.round(n('Solved') / t * 100): 0;
    const bars = Object.keys(CAT).map(k => {
      const m = list.filter(c => c.cat === k).length, p = t ? Math.round(m / t * 100): 0;
      return `<div class="cbar"><div class="cl"><span>${CAT[k].icon} ${CAT[k].name}</span><b>${m} · ${p}%</b></div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${CAT[k].color}"></div></div></div>`;
    }).join('');
    return `<div class="kpis">${kpi('लंबित', n('Pending'), '#f59e0b')}${kpi('प्रगति पर', n('In Progress'), '#2563eb')}${kpi('हल हुईं', n('Solved'), '#16a34a')}${kpi('कुल शिकायतें', t, '#0ea5e9')}</div>
    <div class="dash-grid">
    <div class="card"><div class="ctitle">शिकायत ट्रेंड · पिछले 7 दिन</div>${chart(trend)}</div>
    <div class="card ringcard"><div class="ctitle">सर्विस लेवल</div>
    <div class="ringwrap"><svg viewBox="0 0 120 120" class="ring"><circle cx="60" cy="60" r="50" class="track"/><circle cx="60" cy="60" r="50" class="arc" stroke-dasharray="${sv * 3.14} 314"/></svg>
    <div class="ringval"><b>${sv}%</b><span>हल दर</span></div></div></div>
    </div>
    <div class="card"><div class="ctitle">श्रेणी अनुसार अनुपात</div>${bars}</div>`;
    }

    function printReport(list, title) {
    const w = window.open('', '_blank');
    if (!w) return toast('पॉप-अप ब्लॉक है, कृपया अनुमति दें');
    w.document.write(`<html><head><meta charset="UTF-8"><title>${esc(title)}</title><style>
      body{font-family:sans-serif;padding:36px;color:#0f2a3d}h1{color:#0284c7;margin-bottom:4px}
      p{color:#64808f}table{width:100%;border-collapse:collapse;margin-top:18px}
      th,td{border-bottom:1px solid #e2edf4;padding:9px;text-align:left;font-size:13px}th{background:#f4f9fc}
      </style></head><body><h1>Clean City — ${esc(title)}</h1><p>तारीख: ${today()} · कुल: ${list.length}</p>
      <table><tr><th>ID</th><th>प्रकार</th><th>स्थान</th><th>स्थिति</th><th>तारीख</th></tr>
      ${list.map(c => `<tr><td>${c.id}</td><td>${CAT[c.cat].name}</td><td>${esc(c.loc)}</td><td>${HI[c.status]}</td><td>${c.date}</td></tr>`).join('')}
      </table></body></html>`);
    w.document.close(); w.focus(); w.print();
    }

    function ccard(c) {
    return `<article class="card ccard">
    <div class="cc-top"><div><span class="id">${c.id}</span> ${catTag(c.cat)}</div>${pill(c.status)}</div>
    <h3><a href="complaint.html?id=${c.id}">${esc(c.sub)}</a></h3>
    <p class="muted small">📍 ${esc(c.loc)} · ${c.date}${c.photo ? ' · 📷 फ़ोटो संलग्न': ''}</p>
    <p>${esc(c.desc)}</p>
    <div class="bar-track"><div class="bar-fill" style="width:${PROG[c.status]}%;background:${c.status === 'Rejected' || c.status === 'Cancelled' ? '#dc2626': 'var(--green)'}"></div></div>
    ${c.remark ? `<div class="remark">एडमिन: ${esc(c.remark)}</div>`: ''}
    <div class="cc-actions">${c.status === 'Pending'
    ? `<button class="btn ghost sm" data-edit="${c.id}">एडिट</button><button class="btn danger sm" data-cancel="${c.id}">रद्द करें</button>`: '<span class="muted small">अब एडिट/रद्द नहीं हो सकती</span>'}</div>
    </article>`;
    }

    function editC(id) {
    const x = D.complaints.find(z => z.id === id);
    modal(`<h3>शिकायत एडिट करें · ${x.id}</h3>
      <label>स्थान<input id="mL" value="${esc(x.loc)}"></label>
      <label>विवरण<textarea id="mD" rows="4">${esc(x.desc)}</textarea></label>`,
      () => {
        x.loc = $('#mL').value; x.desc = $('#mD').value; save(); toast('शिकायत अपडेट हुई'); again();
      });
    }

    function cancelC(id) {
    const x = D.complaints.find(z => z.id === id);
    modal(`<h3>शिकायत रद्द करें?</h3><p class="muted">${x.id} रद्द हो जाएगी। यह क्रिया वापस नहीं होगी।</p>`,
      () => {
        x.status = 'Cancelled'; save(); toast(`${x.id} रद्द हुई`); again();
      });
    }

    function drawMap(q) {
    const items = D.aqi.map((a, i) => ({
      ...a, i
    })).filter(a => a.loc.includes(q.trim()));
    $('#mL').innerHTML = items.map(a => {
      const c = lvl(a.aqi)[1]; return `<button class="loc-item" data-i="${a.i}"><b>${esc(a.loc)}</b><span class="pill" style="background:${c}22;color:${c}">AQI ${a.aqi}</span></button>`;
    }).join('') || '<p class="muted">कोई स्थान नहीं मिला</p>';
    $('#mM').innerHTML = `<div class="map-note">📍 Google Maps · API बैकएंड टीम द्वारा जुड़ेगी</div>` +
    items.map(a => `<div class="pin" data-i="${a.i}" style="left:${POS[a.i][0]}%;top:${POS[a.i][1]}%;background:${lvl(a.aqi)[1]}">${a.aqi}</div>`).join('');
    }

    function mapInfo(i) {
    const a = D.aqi[i];
    const n = D.complaints.filter(c => c.loc.includes(a.loc) || a.loc.includes(c.loc)).length;
    toast(`${a.loc}: AQI ${a.aqi} (${lvl(a.aqi)[0]}) · शिकायतें: ${n}`);
    }

    function fillSub() { const s = $('#rSub'); if (s) s.innerHTML = CAT[$('#rCat').value].subs.map(x => `<option>${x}</option>`).join(''); }

    /* ============ PAGES: USER ============ */
    const PAGES = {
    user: {
      dashboard(c) {
        const l = mine();
        c.innerHTML = `<div class="head row"><div><h2>नमस्ते, ${esc(SES().name)} 👋</h2><p>आपके इलाके की सफ़ाई का ताज़ा हाल।</p></div><a class="btn primary" href="report.html">+ नई शिकायत</a></div>
        ${stats(l, TREND_U)}
        <div class="card" style="margin-top:18px"><div class="ctitle">हाल की शिकायतें</div>${recent(l)}</div>`;
      },
      report(c) {
        const u = me();
        c.innerHTML = `<div class="head"><h2>नई शिकायत दर्ज करें</h2><p>नाम और संपर्क आपकी प्रोफ़ाइल से अपने-आप भरे हैं।</p></div>
        <form id="rForm" class="card form-grid">
        <label>प्रदूषण का प्रकार<select id="rCat" name="ccat">${Object.entries(CAT).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join('')}</select></label>
        <label>उप-श्रेणी<select id="rSub" name="csub"></select></label>
        <label class="full">शीर्षक<input name="ctitle" maxlength="80" required placeholder="जैसे: नाली का पानी सड़क पर"></label>
        <label class="full">विवरण<textarea name="cdesc" rows="4" required placeholder="समस्या का पूरा विवरण लिखें"></textarea></label>
        <label class="full">स्थान<div style="display:flex;gap:10px"><input name="cloc" required placeholder="मोहल्ला / लैंडमार्क"><a class="btn ghost" href="map.html">मैप पर देखें</a></div></label>
        <label>शिकायतकर्ता<input value="${esc(u.name)}" disabled></label>
        <label>संपर्क फ़ोन<input value="${esc(u.phone || '')}" disabled></label>
        <label class="full">फ़ोटो (वैकल्पिक)<input type="file" name="cphoto" accept="image/*"></label>
        <div class="full actions"><button type="reset" class="btn ghost">साफ़ करें</button><button class="btn primary">शिकायत दर्ज करें</button></div>
        </form>`;
        fillSub();
      },
      complaints(c) {
        const l = mine().slice().reverse();
        c.innerHTML = `<div class="head"><h2>मेरी शिकायतें</h2><p>प्रगति देखें। लंबित शिकायत एडिट या रद्द की जा सकती है।</p></div>` +
        (l.length ? l.map(ccard).join(''): `<div class="empty">अभी कोई शिकायत नहीं है।<br><a class="btn primary" style="margin-top:14px" href="report.html">पहली शिकायत दर्ज करें</a></div>`);
      },
      complaint(c) {
        const id = new URLSearchParams(location.search).get('id');
        const x = D.complaints.find(z => z.id === id && z.by === SES().email);
        if (!x) {
          c.innerHTML = `<div class="empty">शिकायत नहीं मिली।<br><a href="complaints.html">सूची पर जाएं</a></div>`; return;
        }
        const steps = [['दर्ज',
          'Pending'],
          ['प्रगति पर',
            'In Progress'],
          ['हल हुई',
            'Solved']];
        const idx = {
          Pending: 0,
          'In Progress': 1,
          Solved: 2
        }[x.status];
        const closed = idx === undefined;
        c.innerHTML = `<a href="complaints.html" class="muted small back">← मेरी शिकायतें</a>
        <div class="head"><h2>${esc(x.sub)} <span class="id">${x.id}</span></h2></div>
        <div class="dash-grid">
        <div class="card">
        <div class="cc-top">${catTag(x.cat)}${pill(x.status)}</div>
        <p style="margin:16px 0">${esc(x.desc)}</p>
        <p class="muted small">📍 ${esc(x.loc)} · दर्ज: ${x.date}${x.photo ? ' · 📷 फ़ोटो संलग्न': ''}</p>
        ${closed ? `<p class="muted" style="margin-top:14px">यह शिकायत ${HI[x.status]} है।</p>`: `<div class="tl">${steps.map((s, i) => `<div class="${i <= idx ? 'on': ''}">${s[0]}</div>`).join('')}</div>`}
        ${x.remark ? `<div class="remark">एडमिन: ${esc(x.remark)}</div>`: ''}
        </div>
        <div class="card">
        <div class="ctitle">असाइन टीम</div>
        <p><b>${esc(x.assigned || 'अभी असाइन नहीं')}</b></p>
        <div class="ctitle" style="margin-top:22px">कार्रवाई</div>
        <div class="cc-actions">${x.status === 'Pending'
        ? `<button class="btn ghost" data-edit="${x.id}">एडिट</button><button class="btn danger" data-cancel="${x.id}">रद्द करें</button>`: '<span class="muted small">अब बदलाव संभव नहीं</span>'}</div>
        </div>
        </div>`;
      },
      aqi(c) {
        c.innerHTML = `<div class="head"><h2>AQI डेटा</h2><p>लखनऊ के प्रमुख स्थानों का वायु गुणवत्ता सूचकांक (डेमो डेटा)।</p></div>
        <div class="aqi-grid">${D.aqi.map(a => {
          const [l, col] = lvl(a.aqi); return `<div class="card aqi-card" style="--c:${col}">
          <div class="muted small">${esc(a.loc)}</div><div class="aqi-val">${a.aqi}</div>
          <span class="pill" style="background:${col}22;color:${col};justify-self:start">${l}</span>
          <div class="aqi-scale"><i style="left:${Math.min(a.aqi / 3, 100)}%"></i></div></div>`;
        }).join('')}</div>`;
      },
      map(c) {
        c.innerHTML = `<div class="head"><h2>लोकेशन खोजें</h2><p>स्थान खोजें और मैप पर AQI व शिकायतों की संख्या देखें।</p></div>
        <div class="map-wrap"><div class="card map-side"><input id="mS" placeholder="स्थान खोजें, जैसे: गोमती नगर"><div id="mL" class="mlist"></div></div><div class="map" id="mM"></div></div>`;
        drawMap('');
      },
      reports(c) {
        const l = mine();
        c.innerHTML = `<div class="head"><h2>रिपोर्ट (PDF)</h2><p>अपनी शिकायतों की रिपोर्ट डाउनलोड करें या ईमेल पर पाएं।</p></div>
        <div class="card"><div class="kpis">${kpi('कुल', l.length, '#0ea5e9')}${kpi('हल हुईं', l.filter(x => x.status === 'Solved').length, '#16a34a')}${kpi('लंबित', l.filter(x => x.status === 'Pending').length, '#f59e0b')}</div>
        <div class="actions"><button class="btn ghost" id="rMail">Gmail पर भेजें</button><button class="btn primary" id="rPdf">PDF डाउनलोड करें</button></div></div>`;
      },
      profile(c) {
        const u = me();
        c.innerHTML = `<div class="head"><h2>प्रोफ़ाइल</h2><p>अपनी जानकारी अपडेट करें।</p></div>
        <div class="card profile"><div class="avatar">${esc((u.name[0] || 'U').toUpperCase())}</div>
        <form id="pForm" class="form-grid">
        <label>नाम<input name="fn" value="${esc(u.name)}" required></label>
        <label>ईमेल<input value="${esc(u.email)}" disabled></label>
        <label>फ़ोन<input name="fp" value="${esc(u.phone || '')}"></label>
        <label>शहर<input name="fc" value="${esc(u.city || '')}"></label>
        <div class="full actions"><button class="btn primary">सेव करें</button></div>
        </form></div>`;
      }
    },

    /* ============ PAGES: ADMIN ============ */
    admin: {
      dashboard(c) {
        c.innerHTML = `<div class="head"><h2>एडमिन ओवरव्यू</h2><p>सभी शिकायतों और सेवा स्तर का सारांश।</p></div>
        ${stats(D.complaints, TREND_A)}
        <div class="card" style="margin-top:18px"><div class="ctitle">ताज़ा शिकायतें</div>${recent(D.complaints)}</div>`;
      },
      complaints(c) {
        c.innerHTML = `<div class="head"><h2>शिकायतें मैनेज करें</h2><p>असाइन करें, स्टेटस बदलें और रिमार्क लिखें। सेव करने पर यूज़र को ईमेल जाएगा।</p></div>
        <div class="card table-wrap"><table class="tbl"><thead><tr><th>ID</th><th>यूज़र</th><th>प्रकार</th><th>असाइन</th><th>स्टेटस</th><th>रिमार्क</th><th></th></tr></thead><tbody>
        ${D.complaints.map(x => `<tr><td class="id">${x.id}</td><td>${esc(uname(x.by))}</td><td>${CAT[x.cat].icon} ${CAT[x.cat].name}</td>
          <td><select class="as">${TEAMS.map(t => `<option ${x.assigned === t ? 'selected': ''}>${t}</option>`).join('')}</select></td>
          <td><select class="st">${Object.keys(HI).map(k => `<option value="${k}" ${x.status === k ? 'selected': ''}>${HI[k]}</option>`).join('')}</select></td>
          <td><input class="rm" value="${esc(x.remark)}" style="min-width:180px"></td>
          <td><button class="btn primary sm" data-save="${x.id}">सेव</button></td></tr>`).join('')}
        </tbody></table></div>`;
      },
      aqi(c) {
        c.innerHTML = `<div class="head"><h2>AQI डेटा अपडेट</h2><p>स्थान का AQI बदलें। सेव करने पर यूज़र व्यू में नया डेटा दिखेगा।</p></div>
        <div class="card table-wrap"><table class="tbl"><thead><tr><th>स्थान</th><th>वर्तमान AQI</th><th>नया मान</th><th>स्तर</th></tr></thead><tbody>
        ${D.aqi.map((a, i) => `<tr><td>${esc(a.loc)}</td><td><b>${a.aqi}</b></td><td><input type="number" min="0" max="500" class="ai" data-i="${i}" value="${a.aqi}" style="width:120px"></td><td>${lvl(a.aqi)[0]}</td></tr>`).join('')}
        </tbody></table><div class="actions" style="margin-top:18px"><button class="btn primary" id="aqiSave">सभी बदलाव सेव करें</button></div></div>`;
      },
      users(c) {
        c.innerHTML = `<div class="head"><h2>यूज़र्स मैनेज करें</h2><p>रोल बदलें या खाता ब्लॉक/अनब्लॉक करें।</p></div>
        <div class="card table-wrap"><table class="tbl"><thead><tr><th>नाम</th><th>ईमेल</th><th>शहर</th><th>शिकायतें</th><th>रोल</th><th>स्थिति</th></tr></thead><tbody>
        ${D.users.map((u, i) => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.city)}</td>
          <td>${D.complaints.filter(x => x.by === u.email).length}</td>
          <td><select data-role="${i}"><option ${u.role !== 'Admin' ? 'selected': ''}>User</option><option ${u.role === 'Admin' ? 'selected': ''}>Admin</option></select></td>
          <td><button class="btn sm ${u.blocked ? 'danger': 'ghost'}" data-block="${i}">${u.blocked ? 'ब्लॉक': 'सक्रिय'}</button></td></tr>`).join('')}
        </tbody></table></div>`;
      },
      reports(c) {
        c.innerHTML = `<div class="head"><h2>रिपोर्ट नियंत्रण</h2><p>तय करें कि कौन सी शिकायत रिपोर्ट में शामिल हो। केवल चुनी हुई शिकायतें PDF में जाएंगी।</p></div>
        <div class="card table-wrap"><table class="tbl"><thead><tr><th>शामिल</th><th>ID</th><th>प्रकार</th><th>स्थान</th><th>स्थिति</th></tr></thead><tbody>
        ${D.complaints.map(x => `<tr><td><input type="checkbox" data-inc="${x.id}" ${x.inc ? 'checked': ''}></td><td class="id">${x.id}</td><td>${CAT[x.cat].name}</td><td>${esc(x.loc)}</td><td>${pill(x.status)}</td></tr>`).join('')}
        </tbody></table><div class="actions" style="margin-top:18px"><button class="btn primary" id="apdf">चुनी हुई रिपोर्ट PDF</button></div></div>`;
      }
    }
    };

    /* ============ DELEGATED EVENTS (app pages) ============ */
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
    function logout() { localStorage.removeItem(SKEY); location.href = R + 'login.html'; }

    document.addEventListener('click', e => {
    const t = e.target;
    const go = t.closest('[data-go]');
    if (go) {
      location.href = R + ROLE + '/' + go.dataset.go + '.html'; return;
    }
    const ed = t.closest('[data-edit]'); if (ed) return editC(ed.dataset.edit);
    const cn = t.closest('[data-cancel]'); if (cn) return cancelC(cn.dataset.cancel);
    const sv = t.closest('[data-save]');
    if (sv) {
      const row = sv.closest('tr'),
      x = D.complaints.find(z => z.id === sv.dataset.save);
      x.assigned = row.querySelector('.as').value;
      x.status = row.querySelector('.st').value;
      x.remark = row.querySelector('.rm').value;
      save(); toast(`${x.id} अपडेट हुई · यूज़र को ईमेल भेजा गया (Gmail, डेमो)`); return again();
    }
    const bl = t.closest('[data-block]');
    if (bl) {
      const u = D.users[+bl.dataset.block]; u.blocked = !u.blocked; save();
      toast(`${u.name}: ${u.blocked ? 'ब्लॉक किया गया': 'सक्रिय किया गया'}`); return again();
    }
    const pin = t.closest('[data-i]');
    if (pin && ROLE === 'user' && P === 'map') return mapInfo(+pin.dataset.i);
    if (t.closest('#aqiSave')) {
      $$('.ai').forEach(i => {
        D.aqi[+i.dataset.i].aqi = +i.value || 0;
      }); save(); toast('AQI डेटा अपडेट हुआ'); return again();
    }
    if (t.closest('#apdf')) return printReport(D.complaints.filter(x => x.inc), 'प्रशासनिक रिपोर्ट');
    if (t.closest('#rPdf')) return printReport(mine(), 'मेरी शिकायत रिपोर्ट');
    if (t.closest('#rMail')) return toast('रिपोर्ट Gmail पर भेजी गई (डेमो)');
    if (t.closest('#logoutBtn')) return logout();
    if (t.closest('#menuBtn')) return toggleMenu();
    if (t.closest('#overlay')) return closeMenu();
    });

    document.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'rCat') return fillSub();
    if (t.dataset.inc) {
      const x = D.complaints.find(z => z.id === t.dataset.inc); x.inc = t.checked; save(); return;
    }
    if (t.dataset.role) {
      D.users[+t.dataset.role].role = t.value; save(); toast('रोल अपडेट हुआ');
    }
    });

    document.addEventListener('input', e => { if (e.target.id === 'mS') drawMap(e.target.value); });

    document.addEventListener('submit', e => {
    if (e.target.id === 'rForm') {
      e.preventDefault();
      const f = e.target,
      id = 'CC-' + (1040 + D.complaints.length + 1);
      D.complaints.push({
        id, by: SES().email, cat: f.ccat.value, sub: f.csub.value, title: f.ctitle.value, loc: f.cloc.value,
        desc: f.cdesc.value, status: 'Pending', date: today(), remark: '', assigned: '', photo: !!f.cphoto.files[0], inc: true
      });
      save(); toast(`शिकायत दर्ज हुई · ${id}`);
      setTimeout(() => location.href = 'complaints.html', 700);
    }
    if (e.target.id === 'pForm') {
      e.preventDefault();
      const f = e.target,
      u = me();
      Object.assign(u, {
        name: f.fn.value.trim(), phone: f.fp.value.trim(), city: f.fc.value.trim()});
      const s = SES(); Object.assign(s, {
        name: u.name, phone: u.phone, city: u.city
      });
      localStorage.setItem(SKEY, JSON.stringify(s)); save();
      toast('प्रोफ़ाइल सेव हुई'); setTimeout(() => location.reload(), 600);
    }
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') {
      closeMenu(); $('#modal').classList.remove('show');
    } });

    /* ============ INIT: APP SHELL ============ */
    function initApp() {
    const act = P === 'complaint' ? 'complaints': P,
    s = SES();
    $('#root').innerHTML = `
    <header class="topbar">
    <button id="menuBtn" class="menu-btn" aria-label="मेनू"><span></span><span></span><span></span></button>
    <a class="brand" href="${R}${ROLE}/dashboard.html">Clean City</a>
    <div class="grow"></div>
    <div class="who"><div class="avatar sm">${esc((s.name || 'U')[0].toUpperCase())}</div><span>${esc(s.name)}</span></div>
    <button class="btn ghost sm" id="logoutBtn">लॉगआउट</button>
    </header>
    <aside id="sidebar" class="sidebar"><div class="nav-label">${ROLE === 'admin' ? 'एडमिन पैनल': 'मेनू'}</div>
    ${NAV[ROLE].map(([k, l, i]) => `<a class="nav-item ${k === act ? 'current': ''}" href="${R}${ROLE}/${k}.html"><span class="ico">${i}</span>${l}</a>`).join('')}
    </aside>
    <div id="overlay" class="overlay"></div>
    <main id="main" class="main"><section class="panel active" id="pc"></section></main>`;
    const fn = PAGES[ROLE][P];
    if (fn) fn($('#pc')); else $('#pc').innerHTML = `<div class="empty">पेज नहीं मिला।</div>`;
    if (P === 'map') drawMap('');
    if (P === 'report') fillSub();
    }

    /* ============ INIT: LOGIN ============ */
    function signIn(p) {
    localStorage.setItem(SKEY, JSON.stringify({
      email: p.email, name: p.name, phone: p.phone, city: p.city, isAdmin: p.admin
    }));
    if (!D.users.find(u => u.email === p.email)) D.users.push({
      name: p.name, email: p.email, phone: p.phone, city: p.city, role: p.admin ? 'Admin': 'User'
    });
    save();
    location.href = p.admin ? 'admin/dashboard.html': 'user/dashboard.html';
    }

    function initLogin() {
    $('#root').innerHTML = `<section class="auth">
    <div class="auth-hero">
    <a class="logo" href="index.html" style="color:#fff;text-decoration:none">
    <svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#fff"/><path d="M13 31c4-13 17-15 22-12-1 9-8 15-19 14" fill="#16a34a"/><path d="M13 31c3-6 7-9 12-11" stroke="#0284c7" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
    <span>Clean City</span></a>
    <h1>स्वच्छ शहर,<br>सुंदर भविष्य।</h1>
    <p>शिकायत दर्ज करें, प्रगति ट्रैक करें और अपने इलाके की हवा की गुणवत्ता जानें।</p>
    <ul class="feat"><li>AQI लाइव डेटा</li><li>शिकायत ट्रैकिंग</li><li>PDF रिपोर्ट व ईमेल अपडेट</li></ul>
    </div>
    <div class="auth-card">
    <div class="tabs"><button class="tab active" data-tab="login">लॉगिन</button><button class="tab" data-tab="signup">साइनअप</button></div>
    <form id="loginForm" class="stack">
    <label>ईमेल<input name="email" type="email" placeholder="you@example.com" required></label>
    <label>पासवर्ड<input name="pass" type="password" placeholder="••••••" required></label>
    <label class="check"><input type="checkbox" name="admin"> एडमिन के रूप में लॉगिन करें</label>
    <button class="btn primary full">OTP भेजें</button>
    </form>
    <form id="signupForm" class="stack" hidden>
    <label>पूरा नाम<input name="fullname" required></label>
    <label>फ़ोन नंबर<input name="sphone" inputmode="numeric" maxlength="10" required></label>
    <label>शहर<input name="scity" required></label>
    <label>ईमेल<input name="semail" type="email" required></label>
    <label>पासवर्ड<input name="spass" type="password" required></label>
    <button class="btn primary full">अकाउंट बनाएं और OTP लें</button>
    </form>
    <form id="otpForm" class="stack" hidden>
    <p class="muted">OTP भेजा गया: <b id="otpTo"></b></p>
    <div class="otp">${'<input class="otp-box" inputmode="numeric">'.repeat(6)}</div>
    <button class="btn primary full">वेरिफ़ाई करें</button>
    <button type="button" class="link" id="otpBack">वापस जाएं</button>
    </form>
    <div class="divider"><span>या इससे जारी रखें</span></div>
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
      toast('OTP भेजा गया · डेमो OTP: 123456');
    };
    $('#loginForm').onsubmit = e => {
      e.preventDefault();
      const f = e.target,
      email = f.email.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) return toast('सही ईमेल डालें');
      if (f.pass.value.length < 6) return toast('पासवर्ड कम से कम 6 अक्षर का हो');
      const ex = D.users.find(u => u.email === email);
      pending = {
        email,
        name: ex ? ex.name: email.split('@')[0],
        phone: ex?.phone || '',
        city: ex?.city || '',
        admin: f.admin.checked,
        signup: false
      };
      sendOtp();
    };
    $('#signupForm').onsubmit = e => {
      e.preventDefault();
      const f = e.target,
      phone = f.sphone.value.trim(),
      email = f.semail.value.trim();
      if (!f.fullname.value.trim()) return toast('नाम लिखें');
      if (!/^\d{10}$/.test(phone)) return toast('10 अंकों का फ़ोन नंबर डालें');
      if (!/^\S+@\S+\.\S+$/.test(email)) return toast('सही ईमेल डालें');
      if (f.spass.value.length < 6) return toast('पासवर्ड कम से कम 6 अक्षर का हो');
      pending = {
        email,
        name: f.fullname.value.trim(),
        phone,
        city: f.scity.value.trim(),
        admin: false,
        signup: true
      };
      sendOtp();
    };
    otp.forEach((b, i) => {
      b.oninput = () => {
        const digits = b.value.replace(/\D/g, '');
        for (let k = 0; k < digits.length && i + k < otp.length; k++) otp[i + k].value = digits[k];
        if (digits.length) otp[Math.min(i + digits.length, otp.length - 1)].focus();
      };
      b.onkeydown = e => {
        if (e.key === 'Backspace' && !b.value && otp[i - 1]) otp[i - 1].focus();
      };
    });
    $('#otpForm').onsubmit = e => {
      e.preventDefault();
      if (otp.map(b => b.value).join('') !== '123456') return toast('OTP गलत है');
      signIn(pending);
    };
    $('#otpBack').onclick = () => {
      $('#otpForm').hidden = true; $(pending.signup ? '#signupForm': '#loginForm').hidden = false;
    };
    $$('[data-p]').forEach(b => b.onclick = () => {
      toast(`${b.dataset.p} लॉगिन डेमो · बैकएंड जुड़ने पर सक्रिय होगा`);
      signIn( {
        email: `demo.${b.dataset.p.toLowerCase()}@example.com`, name: 'Demo ' + b.dataset.p, phone: '', city: '', admin: false
      });
    });
    }

    /* ============ INIT: LANDING + 404 ============ */
    function initLanding() {
    const avg = Math.round(D.aqi.reduce((a, x) => a + x.aqi, 0) / D.aqi.length),
    [l,
      c] = lvl(avg);
    $('#root').innerHTML = `
    <header class="pub-nav"><a class="brand" href="index.html">Clean City</a><div class="grow"></div>
    <a class="btn ghost" href="login.html">लॉगिन</a><a class="btn primary" href="login.html">शुरू करें</a></header>
    <section class="landing"><div>
    <span class="eyebrow">स्वच्छ शहर · डिजिटल शिकायत प्रणाली</span>
    <h1>अपने शहर की सफ़ाई, <span>एक क्लिक</span> दूर।</h1>
    <p>प्रदूषण की शिकायत दर्ज करें, प्रगति ट्रैक करें, और अपने इलाके की हवा का AQI जानें।</p>
    <div class="actions" style="justify-content:flex-start;margin-top:26px"><a class="btn primary" href="login.html">शिकायत दर्ज करें</a><a class="btn ghost" href="login.html">AQI देखें</a></div>
    </div>
    <div class="card hero-card"><div class="muted small">लखनऊ · औसत AQI (डेमो)</div><div class="aqi-val" style="color:${c}">${avg}</div><span class="pill" style="background:${c}22;color:${c}">${l}</span></div>
    </section>
    <section class="cat-row">${Object.values(CAT).map(v => `<div class="card cat-card"><div class="cat-ico">${v.icon}</div><b>${v.name}</b><p class="muted small">${v.subs.join(' · ')}</p></div>`).join('')}</section>
    <footer class="foot">© 2026 Clean City · KMCLU Hackathon</footer>`;
    }

    function init404() {
    $('#root').innerHTML = `<div class="not-found"><h1>पेज नहीं मिला</h1><p class="muted">जो लिंक आपने खोला वह मौजूद नहीं है।</p><a class="btn primary" href="index.html" style="justify-self:center">होम पर जाएं</a></div>`;
    }

    /* ============ BOOT ============ */
    const sess = SES();
    const guarded = !['login', 'landing', '404'].includes(P);
    if (guarded) {
    if (!sess) location.replace(R + 'login.html');
    else if (sess.isAdmin !== (ROLE === 'admin')) location.replace(R + (sess.isAdmin ? 'admin/dashboard.html': 'user/dashboard.html'));
    else initApp();
    } else if (P === 'login') initLogin();
    else if (P === 'landing') initLanding();
    else if (P === '404') init404();
    });