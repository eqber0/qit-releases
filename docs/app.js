/* qiT sitesi: modül bölümleri modules.json'dan çizilir; sürümler GitHub'dan okunur. Çerez, izleyici yok. */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const mb = b => (b / 1048576).toFixed(1).replace('.', ',') + ' MB';
const day = d => new Date(d + 'T12:00:00').toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'});
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sysDark = matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;
const NUM = ['Sıfır', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On', 'On bir', 'On iki'];
let CFG = {repo: 'eqber0/qit-releases', tap: 'eqber0/qit', fallbackVersion: '', modules: []};

/* tema: sistem -> açık -> koyu. Gerçek arayüz görselleri de temaya göre (açık/koyu) seçilir. */
const theme = () => root.dataset.theme || (sysDark.matches ? 'dark' : 'light');
function applyShots() {
  const t = theme();
  $$('img.shot[data-shot]').forEach(i => { const s = i.dataset.shot + '-' + t + '.webp'; if (i.getAttribute('src') !== s) i.src = s; });
}
(function themeButton() {
  const b = $('#theme');
  const label = () => {
    const t = root.dataset.theme;
    b.setAttribute('aria-label', 'Tema: ' + (t === 'light' ? 'açık' : t === 'dark' ? 'koyu' : 'sistem') + '. Değiştir');
  };
  label();
  b.addEventListener('click', () => {
    const t = root.dataset.theme;
    const n = !t ? 'light' : t === 'light' ? 'dark' : '';
    if (n) root.dataset.theme = n; else delete root.dataset.theme;
    try { n ? localStorage.setItem('qit-theme', n) : localStorage.removeItem('qit-theme'); } catch (e) {}
    label(); applyShots();
  });
  sysDark.addEventListener('change', applyShots);
})();

/* demolar: modules.json'daki "demo" kimliği -> sahne. Kimliği olmayan modül genel kartı alır. */
const CUR = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6.2 1.6L10 19z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>';
const CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2v8M12 14v8M2 12h8M14 12h8"/></svg>';
const lines = n => '<div class="d-lines">' + '<i></i>'.repeat(n) + '</div>';
const DEMOS = {
  capture: () => `<div class="d-abs cap-photo"></div>
    <div class="d-abs cap-sel"><b>1280×800</b></div>
    <div class="cursor cap-cur">${CROSS}</div>
    <div class="d-abs cap-flash"></div>
    <div class="d-toast cap-toast"><span class="cap-thumb"></span><span>Panoya kopyalandı<small>PNG · 1280×800</small></span></div>`,
  snap: () => `<div class="d-win snap-bg">${lines(6)}</div>
    <div class="d-abs snap-zone"></div>
    <div class="d-win snap-win">${lines(7)}</div>
    <div class="cursor snap-cur">${CUR}</div>`,
  media: () => `<div class="d-abs med-keys"><span class="d-kc">⏮</span><span class="d-kc">⏯</span><span class="d-kc">⏭</span></div>
    <div class="d-abs med-beam"></div>
    <div class="d-abs med-card">
      <div class="med-players"><span>Müzik</span><span class="on">Spotify</span><span>Doppler</span><span>VOX</span></div>
      <div class="med-row"><div class="med-art"></div><div><div class="med-t">Gece Yolu</div><div class="med-a">Örnek Sanatçı</div></div></div>
      <div class="med-bar"><i></i></div><div class="med-st"><span>Duraklatıldı</span><span>Çalıyor · Spotify</span></div>
    </div>`,
  scroll: () => `<span class="scr-lbl a">Tekerlek: çentik çentik</span><span class="scr-lbl b">qroL: akıcı</span>
    <div class="d-abs scr-col a"><div class="scr-list">${'<i></i>'.repeat(12)}</div></div>
    <div class="d-abs scr-mouse"></div>
    <div class="d-abs scr-col b"><div class="scr-list">${'<i></i>'.repeat(12)}</div></div>`,
  convert: () => {
    const f = ['PNG', 'PDF', 'WEBP', 'HEIC', 'MP4', 'JPG'];
    const pos = f.map((x, i) => { const a = i * Math.PI / 3; return [50 + 38 * Math.sin(a), 50 - 38 * Math.cos(a)]; });
    return `<div class="d-abs cv-file cv-src"><i></i>tatil.heic</div>
    <div class="d-abs cv-file cv-out"><i></i>tatil.png</div>
    <div class="d-abs cv-done"><span class="d-ok">✓</span> Kaynak aynen duruyor</div>
    <div class="d-abs cv-file cv-drag"><i></i></div>
    <div class="d-abs cv-ring">${f.map((x, i) => `<span${i === 0 ? ' class="on"' : ''} style="left:${pos[i][0].toFixed(1)}%;top:${pos[i][1].toFixed(1)}%">${x}</span>`).join('')}</div>
    <span class="d-abs d-kc cv-shift">⇧ Shift</span>
    <div class="cursor cv-cur">${CUR}</div>`;
  },
  display: () => `<div class="ds">
      <div class="d-abs ds-row">
        <div class="ds-dev lap"><div class="ds-scr"></div><div class="ds-base"></div><span class="ds-name">Yerleşik Retina</span></div>
        <div class="ds-dev mon"><div class="ds-scr"></div><div class="ds-stand"></div><div class="ds-foot"></div><span class="ds-name">DELL U2720Q · DDC</span></div>
      </div>
      <div class="d-abs ds-ctl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5"/></svg>
        <div class="ds-track"><div class="ds-fill"></div><div class="ds-knob"></div></div><span class="ds-val"></span></div>
    </div>`,
  trigger: () => `<div class="d-abs tr-keys"><span class="d-kc">⌃</span><span class="d-kc">⌥</span><span class="d-kc">T</span></div>
    <div class="d-abs tr-arrow"></div>
    <div class="d-abs tr-card"><div class="tr-h">Terminal'e geç <small>⌃⌥T</small></div>
      <div class="tr-step"><b>1</b>Uygulamayı aç: Terminal</div>
      <div class="tr-step"><b>2</b>Pencere: sağ yarı</div>
      <div class="tr-step"><b>3</b>Metin yaz: ssh sunucu</div></div>`
};
const generic = m => `<div class="gen"><img src="${esc(m.icon)}" alt="" width="128" height="128"><p>${esc(m.tagline)}</p></div>`;

const CHECK = '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke-opacity=".35"/><path d="m6.5 10.2 2.3 2.3 4.7-4.9"/></svg>';

function renderModules(mods) {
  $('#modCount').textContent = NUM[mods.length] || mods.length;
  $('#chips').innerHTML = mods.map(m => `<li><a href="#m-${esc(m.id)}"><img src="${esc(m.icon)}" alt="" width="28" height="28" loading="lazy">${esc(m.name)}</a></li>`).join('');
  $('#modules').innerHTML = mods.map(m => {
    const id = esc(m.id);
    const plat = (m.platforms || []).map(p => `<span class="badge">${esc(p)}</span>`).join('') +
      (m.soon || []).map(p => `<span class="badge soon">${esc(p)}: yolda</span>`).join('') +
      (m.isNew ? '<span class="badge new">Yeni</span>' : '');
    const keys = (m.keys || []).map(([k, d]) => `<span><kbd>${esc(k)}</kbd>${esc(d)}</span>`).join('');
    const demo = DEMOS[m.demo];
    const tabs = m.shot ? `<div class="seg" role="tablist" aria-label="${esc(m.name)} görünümü">
        <button type="button" role="tab" id="t-d-${id}" aria-controls="v-d-${id}" aria-selected="true">Demo</button>
        <button type="button" role="tab" id="t-r-${id}" aria-controls="v-r-${id}" aria-selected="false" tabindex="-1">Gerçek arayüz</button></div>` : '';
    return `<article class="mod" id="m-${id}" aria-labelledby="h-${id}"><div class="wrap mod-in">
      <div class="mod-copy rv">
        <div class="mod-top"><img src="${esc(m.icon)}" alt="" width="52" height="52" loading="lazy"><h3 id="h-${id}">${esc(m.name)}</h3><div class="badges">${plat}</div></div>
        <p class="pitch">${esc(m.tagline)}</p>
        <p class="desc">${esc(m.description)}</p>
        <ul class="feat">${(m.features || []).slice(0, 6).map(f => `<li>${CHECK}<span>${esc(f)}</span></li>`).join('')}</ul>
        ${keys ? `<div class="keys">${keys}</div>` : ''}
      </div>
      <div class="stage rv">
        <div class="stage-bar"><span class="stage-t">${esc(m.name)}</span>${tabs}</div>
        <div class="view" id="v-d-${id}" role="${m.shot ? 'tabpanel' : 'presentation'}" ${m.shot ? `aria-labelledby="t-d-${id}"` : ''}>
          <div class="demo" role="img" aria-label="${esc(m.name)}: ${esc(m.tagline)}">${demo ? demo() : generic(m)}</div>
        </div>
        ${m.shot ? `<div class="view" id="v-r-${id}" role="tabpanel" aria-labelledby="t-r-${id}" hidden>
          <div class="real"><div class="wall" aria-hidden="true"></div><img class="shot" data-shot="${esc(m.shot)}" alt="qiT panelindeki ${esc(m.name)} bölümü" loading="lazy" width="368"></div></div>` : ''}
      </div></div></article>`;
  }).join('');

  /* sekmeler: tıklama ve ok tuşları */
  $$('.seg').forEach(seg => {
    const tabs = [...seg.querySelectorAll('[role="tab"]')];
    const select = t => tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    seg.addEventListener('click', e => { const t = e.target.closest('[role="tab"]'); if (t) select(t); });
    seg.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0 || !/Arrow(Left|Right)/.test(e.key)) return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(n); n.focus(); e.preventDefault();
    });
  });

  /* demolar yalnız görünürken oynar */
  const demos = $$('.demo');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('play', e.isIntersecting)), {threshold: .25});
    demos.forEach(d => io.observe(d));
  }
}

/* ayar penceresi: modül başına gerçek ayar sayfası */
function renderSettings(mods) {
  const list = mods.filter(m => m.settings);
  if (!list.length) { $('#ayarlar').hidden = true; return; }
  const img = $('#setImg');
  const show = (m, btns) => {
    btns.forEach(b => { const on = b.dataset.id === m.id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    img.dataset.shot = m.settings; img.alt = 'qiT Ayarları › ' + m.name + ' sayfası';
    $('#setWinTitle').textContent = 'qiT Ayarları · ' + m.name;
    applyShots();
  };
  $('#setTabs').innerHTML = list.map(m => `<button type="button" role="tab" aria-controls="setImg" data-id="${esc(m.id)}"><img src="${esc(m.icon)}" alt="" width="22" height="22" loading="lazy">${esc(m.name)}</button>`).join('');
  const btns = [...$$('#setTabs button')];
  $('#setTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(list.find(m => m.id === b.dataset.id), btns); });
  $('#setTabs').addEventListener('keydown', e => {
    const i = btns.indexOf(document.activeElement);
    if (i < 0 || !/Arrow(Left|Right)/.test(e.key)) return;
    const n = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
    show(list.find(m => m.id === n.dataset.id), btns); n.focus(); e.preventDefault();
  });
  show(list.find(m => m.id === 'qale') || list[0], btns);
}

/* sürümler ve indirme */
function macAsset(r) { return r.assets.find(a => /\.dmg$/i.test(a.name)) || r.assets.find(a => /macOS.*\.zip$/i.test(a.name)); }
function winAsset(r) { return r.assets.find(a => /Setup.*\.exe$/i.test(a.name)); }

/* wr: Windows kurulumu olan en yeni sürüm (--mac-only sürümlerde exe yok) */
function renderDownload(r, wr = r) {
  const v = r.tag.replace(/^qit-v/, '');
  $('#dlVer').textContent = 'v' + v;
  $('#heroVer').textContent = 'qiT ' + v;
  const mac = macAsset(r), win = wr && winAsset(wr);
  const rel = 'https://github.com/' + CFG.repo + '/releases/latest';
  $('#macBtn').href = mac ? mac.url : rel;
  $('#macBtn').textContent = mac && /\.dmg$/i.test(mac.name) ? 'DMG indir' : 'macOS için indir';
  $('#macFile').textContent = mac ? mac.name + (mac.size ? ' · ' + mb(mac.size) : '') : '';
  if (win) { $('#winBtn').href = win.url; $('#winFile').textContent = win.name + (win.size ? ' · ' + mb(win.size) : ''); }
  const winOs = /Win/i.test(navigator.userAgent || '');
  const pick = winOs ? win : mac, pv = winOs && wr ? wr.tag.replace(/^qit-v/, '') : v, pd = winOs && wr ? wr.date : r.date;
  $('#heroDlText').textContent = (winOs ? 'Windows' : 'macOS') + ' için indir';
  $('#heroDl').href = pick ? pick.url : '#kurulum';
  $('#endDl').href = pick ? pick.url : '#kurulum';
  $('#cardWin').classList.toggle('rec', winOs); $('#cardMac').classList.toggle('rec', !winOs);
  const other = winOs ? '<a href="#kurulum">macOS</a>' : '<a href="#kurulum">Windows</a>';
  $('#heroMeta').innerHTML = `<b>v${esc(pv)}</b>${pd ? ' · ' + day(pd) : ''}${pick && pick.size ? ' · ' + mb(pick.size) : ''} · ${other} için de var`;
}

function renderReleases(list) {
  $('#rel').innerHTML = list.slice(0, 8).map((r, i) => {
    const v = r.tag.replace(/^qit-v/, '');
    const notes = r.notes.length ? `<ul>${r.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : '';
    const files = r.assets.map(a => `<a href="${esc(a.url)}">${esc(a.name)} · ${mb(a.size)}</a>`).join('');
    return `<details${i === 0 ? ' open' : ''}><summary><span class="v">${esc(v)}</span><span class="d">${day(r.date)}</span>${i === 0 ? '<span class="cur">güncel</span>' : ''}</summary>
      <div class="more">${notes}<div class="files">${files}</div></div></details>`;
  }).join('') + `<p class="muted" style="padding-top:16px"><a href="https://github.com/${esc(CFG.repo)}/releases">Tüm sürümler</a></p>`;
}

async function loadReleases() {
  try {
    const res = await fetch(`https://api.github.com/repos/${CFG.repo}/releases?per_page=12`);
    if (!res.ok) throw 0;
    const list = (await res.json()).filter(r => /^qit-v/.test(r.tag_name) && !r.draft && !r.prerelease).map(r => ({
      tag: r.tag_name, date: r.published_at.slice(0, 10),
      notes: (r.body || '').split('\n').map(l => l.replace(/^\s*[-*]\s*/, '').trim()).filter(l => l && !/^qiT \d/.test(l)),
      assets: r.assets.map(a => ({name: a.name, size: a.size, url: a.browser_download_url}))
    }));
    if (!list.length) throw 0;
    renderDownload(list[0], list.find(winAsset)); renderReleases(list);
  } catch (e) {
    /* GitHub'a ulaşılamazsa: sabit "latest" bağlantıları yeterli */
    $('#rel').innerHTML = `<p class="muted">Sürüm listesi şu an okunamadı. <a href="https://github.com/${esc(CFG.repo)}/releases">GitHub'da sürümlere bak</a>.</p>`;
  }
}

/* panoya kopyala (hero ve kurulum kartı) */
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  const txt = 'brew install --cask ' + CFG.tap + '/qit';
  let ok = false;
  try { await navigator.clipboard.writeText(txt); ok = true; } catch (err) {
    const t = document.createElement('textarea'); t.value = txt; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { ok = document.execCommand('copy'); } catch (_) {} t.remove();
  }
  b.classList.toggle('done', ok);
  $('#copyLive').textContent = ok ? 'Komut panoya kopyalandı' : 'Kopyalanamadı, komutu seçip kopyala';
  setTimeout(() => b.classList.remove('done'), 1800);
});

/* kaydırınca belirme */
function reveal() {
  const els = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px'});
  els.forEach(e => io.observe(e));
}

(async function init() {
  applyShots();
  try {
    CFG = await (await fetch('modules.json')).json();
  } catch (e) {
    $('#modules').innerHTML = '<p class="wrap muted">Modül listesi yüklenemedi. <a href="https://github.com/eqber0/qit">GitHub sayfasına bak</a>.</p>';
  }
  const cmd = 'brew install --cask ' + CFG.tap + '/qit';
  $$('.brew-cmd, #brewCmd').forEach(c => { c.textContent = cmd; });
  renderModules(CFG.modules); renderSettings(CFG.modules); applyShots(); reveal();
  if (CFG.fallbackVersion) {
    const v = CFG.fallbackVersion, base = `https://github.com/${CFG.repo}/releases/download/qit-v${v}/`;
    renderDownload({tag: 'qit-v' + v, date: '', assets: [{name: 'qiT-macOS-' + v + '.zip', size: 0, url: base + 'qiT-macOS-' + v + '.zip'}, {name: 'qiT-Setup-x64.exe', size: 0, url: `https://github.com/${CFG.repo}/releases`}]});
  }
  loadReleases();
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
})();
