(function () {
  "use strict";
  const P = window.PLAN;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Datak ---------- */
  const DAY = 86400000;
  const d = s => { const [y, m, dd] = s.split("-").map(Number); return Date.UTC(y, m - 1, dd); };
  const nowLocal = new Date();
  const TODAY = Date.UTC(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate());
  const MS = ["urt", "ots", "mar", "api", "mai", "eka", "uzt", "abu", "ira", "urr", "aza", "abe"];
  const ML = ["urtarrilak", "otsailak", "martxoak", "apirilak", "maiatzak", "ekainak", "uztailak", "abuztuak", "irailak", "urriak", "azaroak", "abenduak"];
  const MN = ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];
  const WD = ["ig", "al", "ar", "az", "og", "or", "lr"];
  const fShort = t => { const x = new Date(t); return `${MS[x.getUTCMonth()]}. ${x.getUTCDate()}`; };
  const fLong = t => { const x = new Date(t); return `${ML[x.getUTCMonth()]} ${x.getUTCDate()}`; };
  const days = (a, b) => Math.round((b - a) / DAY) + 1;

  const START = d(P.hasiera), END = d(P.amaiera);
  const NDAYS = days(START, END);

  /* ---------- Egoerak ---------- */
  const STATES = {
    eginda: { label: "Eginda", color: "var(--ok)" },
    egiten: { label: "Egiten", color: "var(--wip)" },
    egiteke: { label: "Egiteke", color: "var(--todo)" },
    atzeratuta: { label: "Atzeratuta", color: "var(--late)" }
  };
  const MOD = Object.fromEntries(P.moduluak.map(m => [m.id, m]));

  const T = P.atazak.map((t, i) => {
    const s = d(t.hasi), e = d(t.buka);
    const late = t.egoera !== "eginda" && e < TODAY;
    return { ...t, i, s, e, late, st: late ? "atzeratuta" : t.egoera };
  });

  const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
  const totalH = sum(T, t => t.h);
  const hBy = st => sum(T.filter(t => t.egoera === st), t => t.h);
  const nBy = st => T.filter(t => t.egoera === st).length;
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;

  /* ---------- Hero ---------- */
  $("#h-epea").textContent = `${fLong(START)} – ${fLong(END)}`;
  $("#h-taldea").textContent = `${P.taldea.length} kide`;
  $("#h-entrega").textContent = fLong(END);
  $("#h-eguneratua").textContent = fLong(d(P.eguneratua)) + ", " + P.eguneratua.slice(0, 4);

  /* ---------- KPIak ---------- */
  const left = Math.round((END - TODAY) / DAY);
  const kpis = [
    { k: "Atazak guztira", v: T.length, s: `${P.moduluak.length - 1} lan-ildo + aurkezpena` },
    { k: "Ordu estimatuak", v: totalH + "h", s: `Batez beste ${(totalH / T.length).toFixed(1)}h ataza bakoitzeko` },
    { k: "Amaitutako atazak", v: `${nBy("eginda")}<small>/${T.length}</small>`, s: `${nBy("egiten")} martxan · ${nBy("egiteke")} egiteke` },
    { k: left > 0 ? "Entregara arte" : left === 0 ? "Entrega" : "Entrega", v: left > 0 ? `${left} <small>egun</small>` : left === 0 ? "Gaur" : "Eginda", s: `Aurkezpena: ${fLong(END)}` }
  ];
  const kWrap = $("#kpis");
  kpis.forEach(k => kWrap.append(el("div", "kpi card", `<span>${k.k}</span><strong>${k.v}</strong><em>${k.s}</em>`)));

  const doneP = pct(hBy("eginda"), totalH);
  $("#pc-num").textContent = doneP + "%";
  const stack = $("#pc-stack");
  stack.setAttribute("aria-label", `Eginda ${hBy("eginda")}h, egiten ${hBy("egiten")}h, egiteke ${hBy("egiteke")}h`);
  ["eginda", "egiten", "egiteke"].forEach(st => {
    const h = hBy(st); if (!h) return;
    const seg = el("div", "seg " + st);
    seg.style.width = (h / totalH * 100) + "%";
    seg.title = `${STATES[st].label}: ${h}h`;
    stack.append(seg);
  });
  const pl = $("#pc-legend");
  ["eginda", "egiten", "egiteke"].forEach(st =>
    pl.append(el("li", "", `<i style="background:${STATES[st].color}"></i>${STATES[st].label} <b>${hBy(st)}h</b> <span class="muted">· ${nBy(st)} ataza</span>`)));

  /* ---------- Lan-ildoak ---------- */
  const mWrap = $("#modules");
  P.moduluak.filter(m => m.id !== "AURK").forEach(m => {
    const ts = T.filter(t => t.m === m.id);
    const h = sum(ts, t => t.h), hd = sum(ts.filter(t => t.egoera === "eginda"), t => t.h);
    const who = [...new Set(ts.flatMap(t => t.kideak))];
    const s = Math.min(...ts.map(t => t.s)), e = Math.max(...ts.map(t => t.e));
    const c = el("article", "module card");
    c.style.setProperty("--mc", m.kolorea);
    c.innerHTML = `
      <header><span class="mcode">${m.id === "ZG" ? "ZG / SGSI" : m.id}</span><span class="mdates">${fShort(s)} – ${fShort(e)}</span></header>
      <h3>${esc(m.izena)}</h3>
      <p>${esc(m.azalpena)}</p>
      <div class="mbar"><div style="width:${pct(hd, h)}%"></div></div>
      <footer><span><b>${ts.length}</b> ataza · <b>${h}h</b></span><span>${pct(hd, h)}% eginda</span></footer>
      <div class="mwho">${who.map(n => avatar(n)).join("")}</div>`;
    mWrap.append(c);
  });

  /* ---------- Faseak ---------- */
  const PHASES = [
    { n: "1", izena: "Abiapena", s: "2026-10-23", e: "2026-10-26", desc: "Proposamena eta lanaren banaketa." },
    { n: "2", izena: "Diseinua eta oinarriak", s: "2026-10-27", e: "2026-11-02", desc: "Sare-eskema, suebakia, araudia, arriskuak eta webgunea." },
    { n: "3", izena: "Inplementazioa", s: "2026-11-03", e: "2026-11-08", desc: "AD, VPN, babeskopiak, Python, SGSI eta auditoriaren hasiera." },
    { n: "4", izena: "Auditoria eta itxiera", s: "2026-11-09", e: "2026-11-13", desc: "Ustiapena, forentsea, txostenak eta aurkezpena." }
  ];
  const phWrap = $("#phases");
  PHASES.forEach(p => {
    const s = d(p.s), e = d(p.e);
    const ts = T.filter(t => t.s >= s && t.s <= e);
    const h = sum(ts, t => t.h), hd = sum(ts.filter(t => t.egoera === "eginda"), t => t.h);
    const now = TODAY >= s && TODAY <= e;
    const c = el("div", "phase card" + (now ? " now" : "") + (TODAY > e ? " past" : ""));
    c.innerHTML = `<div class="ph-top"><span class="ph-n">${p.n}. fasea</span>${now ? '<span class="ph-now">Orain</span>' : ""}</div>
      <h4>${p.izena}</h4><p class="ph-d">${fShort(s)} – ${fShort(Math.min(e, END))}</p><p class="muted small">${p.desc}</p>
      <div class="mbar"><div style="width:${pct(hd, h)}%"></div></div><p class="small"><b>${ts.length}</b> ataza · ${pct(hd, h)}% eginda</p>`;
    phWrap.append(c);
  });

  /* ---------- Gantt ---------- */
  const gl = $("#gantt-legend");
  ["eginda", "egiten", "egiteke", "atzeratuta"].forEach(st => gl.append(el("li", "", `<i style="background:${STATES[st].color}"></i>${STATES[st].label}`)));
  gl.append(el("li", "", `<i class="lg-today"></i>Gaur`));
  gl.append(el("li", "", `<i class="lg-ms"></i>Mugarria`));

  const g = $("#gantt");
  g.style.setProperty("--n", NDAYS);
  // atzeko zutabeak
  const bg = el("div", "g-bg");
  for (let k = 0; k < NDAYS; k++) {
    const t = START + k * DAY, wd = new Date(t).getUTCDay();
    bg.append(el("div", "g-col" + (wd === 0 || wd === 6 ? " we" : "")));
  }
  g.append(bg);
  if (TODAY >= START && TODAY <= END) {
    const line = el("div", "g-today");
    line.style.setProperty("--x", ((TODAY - START) / DAY + 0.5) / NDAYS);
    line.innerHTML = "<span>Gaur</span>";
    g.append(line);
  }
  // goiburua
  const hm = el("div", "g-row g-head g-months");
  hm.append(el("div", "g-label", ""));
  const mtrack = el("div", "g-track");
  let k0 = 0;
  while (k0 < NDAYS) {
    const m = new Date(START + k0 * DAY).getUTCMonth();
    let k1 = k0; while (k1 + 1 < NDAYS && new Date(START + (k1 + 1) * DAY).getUTCMonth() === m) k1++;
    const sp = el("div", "g-month", MN[m] + " 2026");
    sp.style.left = (k0 / NDAYS * 100) + "%"; sp.style.width = ((k1 - k0 + 1) / NDAYS * 100) + "%";
    mtrack.append(sp); k0 = k1 + 1;
  }
  hm.append(mtrack); g.append(hm);

  const hd = el("div", "g-row g-head g-days");
  hd.append(el("div", "g-label", "<b>Ataza</b>"));
  const dtrack = el("div", "g-track g-daycells");
  for (let k = 0; k < NDAYS; k++) {
    const t = START + k * DAY, x = new Date(t);
    dtrack.append(el("div", "g-day" + (t === TODAY ? " today" : ""), `<b>${x.getUTCDate()}</b><span>${WD[x.getUTCDay()]}</span>`));
  }
  hd.append(dtrack); g.append(hd);

  P.moduluak.forEach(m => {
    const ts = T.filter(t => t.m === m.id);
    if (!ts.length) return;
    if (m.id !== "AURK") {
      const gr = el("div", "g-row g-group");
      gr.style.setProperty("--mc", m.kolorea);
      gr.innerHTML = `<div class="g-label"><i></i>${m.id === "ZG" ? "ZG/SGSI" : m.id} · ${esc(m.izena)}</div><div class="g-track"></div>`;
      g.append(gr);
    }
    ts.forEach(t => {
      const r = el("div", "g-row g-task" + (t.mugarria ? " is-ms" : ""));
      const lab = el("div", "g-label", `<span title="${esc(t.izena)}">${esc(t.izena)}</span>`);
      const tr = el("div", "g-track");
      const a = (t.s - START) / DAY, len = days(t.s, t.e);
      const b = el("button", "g-bar " + t.st + (t.mugarria ? " ms" : ""));
      b.type = "button";
      b.style.left = `calc(${a / NDAYS * 100}% + 3px)`;
      b.style.width = `calc(${len / NDAYS * 100}% - 6px)`;
      b.innerHTML = t.mugarria ? "<i></i>" : `<span>${t.h}h</span>`;
      b.setAttribute("aria-label", `${t.izena}: ${fLong(t.s)}–${fLong(t.e)}, ${STATES[t.st].label}`);
      b.dataset.i = t.i;
      tr.append(b);
      r.append(lab, tr);
      g.append(r);
    });
  });

  /* tooltip */
  const tip = $("#tip");
  const showTip = (t, x, y) => {
    const m = MOD[t.m];
    tip.innerHTML = `<p class="tt-m" style="color:${m.kolorea}">${m.id === "ZG" ? "ZG/SGSI" : m.id} · ${esc(m.izena)}</p>
      <p class="tt-t">${esc(t.izena)}</p>
      <p class="tt-d">${esc(t.azalpena)}</p>
      <div class="tt-g"><span>Datak</span><b>${fLong(t.s)}${t.e !== t.s ? " – " + fLong(t.e) : ""}</b>
      <span>Orduak</span><b>${t.h}h</b><span>Arduradunak</span><b>${t.kideak.join(", ")}</b>
      <span>Egoera</span><b>${badge(t)}</b></div>`;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let L = x + 14, Tp = y + 14;
    if (L + r.width > innerWidth - 8) L = Math.max(8, x - r.width - 14);
    if (Tp + r.height > innerHeight - 8) Tp = Math.max(8, y - r.height - 14);
    tip.style.left = L + "px"; tip.style.top = Tp + "px";
  };
  g.addEventListener("mousemove", e => { const b = e.target.closest(".g-bar"); if (b) showTip(T[b.dataset.i], e.clientX, e.clientY); else tip.hidden = true; });
  g.addEventListener("mouseleave", () => tip.hidden = true);
  g.addEventListener("click", e => { const b = e.target.closest(".g-bar"); if (b) { const r = b.getBoundingClientRect(); showTip(T[b.dataset.i], r.left, r.bottom); e.stopPropagation(); } });
  g.addEventListener("focusin", e => { const b = e.target.closest(".g-bar"); if (b) { const r = b.getBoundingClientRect(); showTip(T[b.dataset.i], r.left, r.bottom); } });
  g.addEventListener("focusout", () => tip.hidden = true);
  document.addEventListener("click", () => tip.hidden = true);
  addEventListener("scroll", () => tip.hidden = true, { passive: true });

  /* ---------- Laguntzaileak ---------- */
  function avatar(n) {
    const i = P.taldea.indexOf(n);
    return `<span class="av av${i}" title="${esc(n)}">${esc(n[0])}</span>`;
  }
  function badge(t) {
    return `<span class="badge ${t.st}">${STATES[t.st].label}</span>`;
  }

  /* ---------- Atazen taula ---------- */
  const fK = $("#f-kidea"), fM = $("#f-modulua"), fE = $("#f-egoera"), fQ = $("#f-q");
  P.taldea.forEach(n => fK.append(new Option(n, n)));
  P.moduluak.forEach(m => fM.append(new Option((m.id === "ZG" ? "ZG/SGSI" : m.id) + " · " + m.izena, m.id)));
  Object.entries(STATES).forEach(([k, v]) => fE.append(new Option(v.label, k)));
  const tb = $("#tasks-body");

  function renderTable() {
    const q = fQ.value.trim().toLowerCase();
    const list = T.filter(t =>
      (!fK.value || t.kideak.includes(fK.value)) &&
      (!fM.value || t.m === fM.value) &&
      (!fE.value || t.st === fE.value) &&
      (!q || (t.izena + " " + t.azalpena).toLowerCase().includes(q)));
    tb.innerHTML = "";
    let lastM = null;
    list.forEach(t => {
      const m = MOD[t.m];
      if (t.m !== lastM) {
        const gr = el("tr", "grp"); gr.style.setProperty("--mc", m.kolorea);
        gr.innerHTML = `<td colspan="5"><i></i>${m.id === "ZG" ? "ZG/SGSI" : m.id} — ${esc(m.izena)}</td>`;
        tb.append(gr); lastM = t.m;
      }
      const n = days(t.s, t.e);
      const tr = el("tr", t.mugarria ? "ms-row" : "");
      tr.style.setProperty("--mc", m.kolorea);
      tr.innerHTML = `
        <td data-l="Ataza"><p class="t-name">${t.mugarria ? "◆ " : ""}${esc(t.izena)}</p><p class="t-desc">${esc(t.azalpena)}</p></td>
        <td data-l="Datak" class="t-dates">${fShort(t.s)}${t.e !== t.s ? " → " + fShort(t.e) : ""}<span>${n} egun</span></td>
        <td data-l="Orduak" class="num">${t.h}h</td>
        <td data-l="Arduradunak"><div class="who">${t.kideak.map(k => `<span class="chip">${avatar(k)}${esc(k)}</span>`).join("")}</div></td>
        <td data-l="Egoera">${badge(t)}</td>`;
      tb.append(tr);
    });
    if (!list.length) tb.innerHTML = `<tr><td colspan="5" class="empty">Ez dago iragazkiekin bat datorren atazarik.</td></tr>`;
    $("#f-count").textContent = `${list.length} ataza · ${sum(list, t => t.h)}h`;
  }
  [fK, fM, fE].forEach(s => s.addEventListener("change", renderTable));
  fQ.addEventListener("input", renderTable);
  renderTable();

  /* ---------- Taldea ---------- */
  const team = $("#team");
  const maxH = Math.max(...P.taldea.map(n => sum(T.filter(t => t.kideak.includes(n)), t => t.h)));
  P.taldea.forEach((n, i) => {
    const ts = T.filter(t => t.kideak.includes(n));
    const h = sum(ts, t => t.h);
    const byMod = P.moduluak.map(m => ({ m, h: sum(ts.filter(t => t.m === m.id), t => t.h) }))
      .filter(x => x.h && !["PLAN", "AURK"].includes(x.m.id)).sort((a, b) => b.h - a.h);
    const segs = ["eginda", "egiten", "egiteke"].map(st => ({ st, h: sum(ts.filter(t => t.egoera === st), t => t.h) }));
    const solo = ts.filter(t => t.kideak.length === 1).length;
    const c = el("article", "member card");
    c.innerHTML = `
      <header><span class="av big av${i}">${n[0]}</span><div><h3>${n}</h3><p class="muted small">${byMod.slice(0, 2).map(x => x.m.id === "ZG" ? "ZG/SGSI" : x.m.id).join(" · ") + " ardatz nagusiak"}</p></div></header>
      <div class="m-stats">
        <div><strong>${ts.length}</strong><span>ataza</span></div>
        <div><strong>${h}h</strong><span>estimatuak</span></div>
        <div><strong>${pct(segs[0].h, h)}%</strong><span>eginda</span></div>
      </div>
      <div class="load"><div class="stack sm" style="width:${h / maxH * 100}%">${segs.filter(x => x.h).map(x => `<div class="seg ${x.st}" style="width:${x.h / h * 100}%" title="${STATES[x.st].label}: ${x.h}h"></div>`).join("")}</div></div>
      <ul class="m-mods">${byMod.map(x => `<li style="--mc:${x.m.kolorea}"><i></i>${x.m.id === "ZG" ? "ZG/SGSI" : x.m.id}<b>${x.h}h</b></li>`).join("")}</ul>
      <p class="muted small">${solo} ataza bakarka · ${ts.length - solo} taldean</p>`;
    team.append(c);
  });

  /* matrizea */
  const mx = $("#matrix");
  const mxMax = Math.max(...P.moduluak.flatMap(m => P.taldea.map(n => sum(T.filter(t => t.m === m.id && t.kideak.includes(n)), t => t.h))));
  let html = `<thead><tr><th>Lan-ildoa</th>${P.taldea.map((n, i) => `<th><span class="av av${i}">${n[0]}</span>${n}</th>`).join("")}<th>Guztira</th></tr></thead><tbody>`;
  P.moduluak.forEach(m => {
    const ts = T.filter(t => t.m === m.id);
    html += `<tr style="--mc:${m.kolorea}"><th><i></i>${m.id === "ZG" ? "ZG/SGSI" : m.id} <span class="muted">${esc(m.izena)}</span></th>`;
    P.taldea.forEach(n => {
      const h = sum(ts.filter(t => t.kideak.includes(n)), t => t.h);
      html += h ? `<td><span class="cell" style="--a:${(0.15 + 0.6 * h / mxMax).toFixed(2)}">${h}h</span></td>` : `<td class="muted">—</td>`;
    });
    html += `<td class="num"><b>${sum(ts, t => t.h)}h</b></td></tr>`;
  });
  html += `</tbody><tfoot><tr><th>Guztira</th>${P.taldea.map(n => `<td><b>${sum(T.filter(t => t.kideak.includes(n)), t => t.h)}h</b></td>`).join("")}<td class="num"><b>${totalH}h</b></td></tr></tfoot>`;
  mx.innerHTML = html;

  /* ---------- Mugarriak ---------- */
  const MSL = [
    { t: "2026-10-23", n: "Abiapena eta proposamenaren aurkezpena", d: "Enpresaren egoera eta segurtasun-proposamena." },
    { t: "2026-10-31", n: "Diseinu-fasea itxita", d: "Sare-eskema, suebakia, araudia eta arrisku-analisia." },
    { t: "2026-11-07", n: "Inplementazio nagusia amaituta", d: "Gotortzea, VPN, babeskopiak, Python automatizazioa eta SGSI." },
    { t: "2026-11-12", n: "Auditoria- eta forentse-txostenak prest", d: "CVSS txostena eta ikerketa forentsearen dokumentazioa." },
    { t: "2026-11-13", n: "1. atalaren entrega eta aurkezpena", d: "Emaitza guztiak taldean aurkeztu." }
  ];
  const ol = $("#milestones");
  MSL.forEach(x => {
    const t = d(x.t), st = t < TODAY ? "past" : t === TODAY ? "now" : "next";
    ol.append(el("li", st, `<span class="ms-date">${fLong(t)}</span><div><b>${x.n}</b><p class="muted small">${x.d}</p></div>`));
  });

  /* ---------- Nabigazio aktiboa ---------- */
  const links = [...document.querySelectorAll(".nav a")];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => io.observe(s));
})();
