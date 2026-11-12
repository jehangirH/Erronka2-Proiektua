(function () {
  "use strict";
  const P = window.PLAN;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // ---------- Datak ----------
  const DAY = 864e5;
  const d = s => { const [y, m, x] = s.split("-").map(Number); return Date.UTC(y, m - 1, x); };
  const now = new Date();
  const TODAY = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const MS = ["urt.", "ots.", "mar.", "api.", "mai.", "eka.", "uzt.", "abu.", "ira.", "urr.", "aza.", "abe."];
  const ML = ["urtarrilaren", "otsailaren", "martxoaren", "apirilaren", "maiatzaren", "ekainaren", "uztailaren", "abuztuaren", "irailaren", "urriaren", "azaroaren", "abenduaren"];
  const MN = ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"];
  const WD = ["ig", "al", "ar", "az", "og", "or", "lr"];
  const fS = t => { const x = new Date(t); return `${MS[x.getUTCMonth()]} ${x.getUTCDate()}`; };
  const fL = t => { const x = new Date(t); return `${ML[x.getUTCMonth()]} ${x.getUTCDate()}`; };
  const range = (a, b) => a === b ? fS(a) : `${fS(a)} – ${fS(b)}`;
  const nDays = (a, b) => Math.round((b - a) / DAY) + 1;

  const STATES = { eginda: "Eginda", egiten: "Egiten", egiteke: "Egiteke" };
  const ORDER = ["eginda", "egiten", "egiteke"];
  const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const badge = st => `<span class="badge ${st}">${STATES[st]}</span>`;

  // ---------- Datuak prestatu ----------
  const A = P.atalak.map((a, ai) => {
    let n = 0;
    const blokeak = a.blokeak.map(b => ({
      ...b,
      atazak: b.atazak.map(t => ({ ...t, zk: `${ai + 1}.${String(++n).padStart(2, "0")}`, s: d(t.hasi), e: d(t.buka), kodea: b.kodea }))
    }));
    const tasks = blokeak.flatMap(b => b.atazak);
    return { ...a, ai, blokeak, tasks, s: d(a.hasiera), e: d(a.amaiera), h: sum(tasks, t => t.h) };
  });
  const ALL = A.flatMap(a => a.tasks);
  const codeLabel = k => k === "AURK" ? "Entrega" : k;

  // ---------- Sarrera ----------
  $("#i-ikastaroa").textContent = P.ikastaroa;
  $("#i-enpresa").textContent = P.enpresa;
  $("#i-taldea").textContent = P.taldea.join(", ");
  $("#i-epea").textContent = `${fS(A[0].s)} – ${fS(A[A.length - 1].e)}, ${P.eguneratua.slice(0, 4)}`;
  $("#i-eguneratua").textContent = `${P.eguneratua.slice(0, 4)}ko ${fL(d(P.eguneratua))}`;
  $("#iturria").textContent = P.iturria;

  // ---------- 1. Laburpena ----------
  const legend = ORDER.map(st => `<li><i class="dot ${st}"></i>${STATES[st]}</li>`).join("");
  $("#legend-top").innerHTML = legend;
  A.forEach(a => {
    const by = st => a.tasks.filter(t => t.egoera === st);
    const done = pct(sum(by("eginda"), t => t.h), a.h);
    const state = TODAY > a.e ? ["past", "Amaituta"] : TODAY >= a.s ? ["now", "Martxan"] : ["next", "Hasteko"];
    const ms = a.tasks.find(t => t.mugarria);
    const c = el("article", "card phase");
    c.innerHTML = `
      <header>
        <div><p class="ph-id">${a.izena} · ${a.id}</p><h3>${esc(a.azpititulua)}</h3></div>
        <span class="pill ${state[0]}">${state[1]}</span>
      </header>
      <p class="ph-goal">${esc(a.helburua)}</p>
      <dl class="ph-facts">
        <div><dt>Datak</dt><dd>${range(a.s, a.e)}</dd></div>
        <div><dt>Aurkezpena</dt><dd>${ms ? fS(ms.s) : "—"}</dd></div>
        <div><dt>Atazak</dt><dd>${a.tasks.length}</dd></div>
        <div><dt>Ordu estimatuak</dt><dd>${a.h} h</dd></div>
      </dl>
      <div class="prog">
        <div class="prog-top"><span>Aurrerapena (orduen arabera)</span><b>${done}%</b></div>
        <div class="bar">${ORDER.map(st => { const h = sum(by(st), t => t.h); return h ? `<i class="${st}" style="width:${h / a.h * 100}%" title="${STATES[st]}: ${h} h"></i>` : ""; }).join("")}</div>
        <p class="prog-n">${ORDER.map(st => `<span><i class="dot ${st}"></i>${by(st).length} ${STATES[st].toLowerCase()}</span>`).join("")}</p>
      </div>`;
    $("#phases").append(c);
  });

  // ---------- 2. Kronograma ----------
  const tabs = $("#g-tabs");
  A.forEach(a => {
    const b = el("button", "tab", `${a.izena} <span>${range(a.s, a.e)}</span>`);
    b.type = "button"; b.setAttribute("role", "tab");
    b.addEventListener("click", () => drawGantt(a.ai));
    tabs.append(b);
  });

  function drawGantt(ai) {
    const a = A[ai];
    [...tabs.children].forEach((b, i) => { b.classList.toggle("on", i === ai); b.setAttribute("aria-selected", i === ai); });
    const N = nDays(a.s, a.e);
    const g = $("#gantt");
    g.innerHTML = "";
    g.style.setProperty("--n", N);
    let row = 1;
    const put = (node, r, c1, c2) => { node.style.gridRow = r; node.style.gridColumn = `${c1} / ${c2}`; g.append(node); return node; };
    const isWe = k => [0, 6].includes(new Date(a.s + k * DAY).getUTCDay());
    const isToday = k => a.s + k * DAY === TODAY;

    // hilabeteak
    put(el("div", "g-corner", "Ataza"), "1 / span 2", 1, 2);
    let k0 = 0;
    while (k0 < N) {
      const m = new Date(a.s + k0 * DAY).getUTCMonth();
      let k1 = k0; while (k1 + 1 < N && new Date(a.s + (k1 + 1) * DAY).getUTCMonth() === m) k1++;
      put(el("div", "g-month", `${MN[m]}`), 1, k0 + 2, k1 + 3);
      k0 = k1 + 1;
    }
    for (let k = 0; k < N; k++) {
      const x = new Date(a.s + k * DAY);
      put(el("div", "g-day" + (isWe(k) ? " we" : "") + (isToday(k) ? " today" : ""), `<b>${x.getUTCDate()}</b><span>${WD[x.getUTCDay()]}</span>`), 2, k + 2, k + 3);
    }
    row = 3;
    a.blokeak.forEach(b => {
      if (b.kodea !== "AURK") {
        put(el("div", "g-group", `<b>${esc(b.kodea)}</b> ${esc(b.izenburua)}`), row++, 1, N + 2);
      }
      b.atazak.forEach(t => {
        put(el("div", "g-label" + (t.mugarria ? " ms" : ""), `<span class="zk">${t.zk}</span><span class="nm" title="${esc(t.izena)}">${esc(t.izena)}</span>`), row, 1, 2);
        for (let k = 0; k < N; k++) put(el("div", "g-cell" + (isWe(k) ? " we" : "") + (isToday(k) ? " today" : "")), row, k + 2, k + 3);
        const c1 = Math.round((t.s - a.s) / DAY) + 2, c2 = Math.round((t.e - a.s) / DAY) + 3;
        const bar = el("div", `g-bar ${t.egoera}` + (t.mugarria ? " ms" : ""), t.mugarria ? "◆" : `${t.h}h`);
        bar.title = `${t.zk} · ${t.izena}\n${range(t.s, t.e)} · ${t.h} h · ${t.kideak.join(", ")}\nEgoera: ${STATES[t.egoera]}`;
        put(bar, row, c1, c2);
        row++;
      });
    });
  }
  const cur = A.findIndex(a => TODAY <= a.e);
  drawGantt(cur < 0 ? A.length - 1 : cur);

  // ---------- 3. Atazen taulak ----------
  const fK = $("#f-kidea"), fE = $("#f-egoera");
  P.taldea.forEach(n => fK.append(new Option(n, n)));
  ORDER.forEach(st => fE.append(new Option(STATES[st], st)));

  function drawTables() {
    const ok = t => (!fK.value || t.kideak.includes(fK.value)) && (!fE.value || t.egoera === fE.value);
    const box = $("#tables");
    box.innerHTML = "";
    let n = 0, h = 0;
    A.forEach(a => {
      const blocks = a.blokeak.map(b => ({ ...b, atazak: b.atazak.filter(ok) })).filter(b => b.atazak.length);
      if (!blocks.length) return;
      const wrap = el("div", "atala");
      wrap.append(el("h3", "atala-h", `${a.izena} <span>(${a.id}) · ${range(a.s, a.e)}</span>`));
      const card = el("div", "card table-wrap");
      let html = `<table class="tasks"><thead><tr><th class="c-zk">Zk.</th><th>Ataza</th><th class="c-d">Datak</th><th class="c-h">Orduak</th><th class="c-w">Arduradunak</th><th class="c-s">Egoera</th></tr></thead><tbody>`;
      blocks.forEach(b => {
        html += `<tr class="grp"><td colspan="6"><b>${esc(codeLabel(b.kodea))}</b> ${esc(b.izenburua)}</td></tr>`;
        b.atazak.forEach(t => {
          n++; h += t.h;
          html += `<tr${t.mugarria ? ' class="ms"' : ""}>
            <td class="c-zk">${t.zk}</td>
            <td><p class="t-n">${esc(t.izena)}</p><p class="t-d">${esc(t.azalpena)}</p></td>
            <td class="c-d">${range(t.s, t.e)}</td>
            <td class="c-h">${t.h} h</td>
            <td class="c-w">${t.kideak.length === P.taldea.length ? "<span class=\"all\">Talde osoa</span>" : t.kideak.map(esc).join(", ")}</td>
            <td class="c-s">${badge(t.egoera)}</td></tr>`;
        });
      });
      html += "</tbody></table>";
      card.innerHTML = html;
      wrap.append(card);
      box.append(wrap);
    });
    if (!n) box.innerHTML = `<p class="empty">Ez dago iragazkiekin bat datorren atazarik.</p>`;
    $("#f-count").textContent = `${n} ataza · ${h} h`;
  }
  [fK, fE].forEach(s => s.addEventListener("change", drawTables));
  drawTables();

  // ---------- 4. Taldea ----------
  // Talde-atazetan orduak parte hartzen duten kideen artean berdin banatzen dira.
  const share = t => t.h / t.kideak.length;
  const fH = x => String(Math.round(x * 10) / 10).replace(".", ",") + " h";
  const grand = sum(ALL, t => t.h);
  let th = `<thead><tr><th>Kidea</th>${A.map(a => `<th class="num">${a.izena}</th>`).join("")}<th class="num">Guztira</th><th>Lan-kargaren zatia</th><th>Lan-ildo nagusiak</th></tr></thead><tbody>`;
  P.taldea.forEach(nm => {
    const mine = ALL.filter(t => t.kideak.includes(nm));
    const hh = sum(mine, share);
    const p = Math.round(hh / grand * 100);
    const byCode = {};
    mine.filter(t => !["PLAN", "AURK"].includes(t.kodea)).forEach(t => byCode[t.kodea] = (byCode[t.kodea] || 0) + share(t));
    const codes = Object.entries(byCode).sort((x, y) => y[1] - x[1]);
    th += `<tr><th>${esc(nm)}</th>${A.map(a => { const ts = a.tasks.filter(t => t.kideak.includes(nm)); return `<td class="num">${fH(sum(ts, share))}<small>${ts.length} ataza</small></td>`; }).join("")}
      <td class="num"><b>${fH(hh)}</b><small>${mine.length} ataza</small></td>
      <td><div class="share"><div class="share-bar"><i style="width:${hh / grand * 200}%"></i></div><b>% ${p}</b></div></td>
      <td>${codes.map(([k, v]) => `<span class="tag" title="${esc(P.moduluak[k] || k)}">${esc(k)} <small>${fH(v)}</small></span>`).join("")}</td></tr>`;
  });
  th += `</tbody><tfoot><tr><th>Guztira</th>${A.map(a => `<td class="num">${fH(a.h)}</td>`).join("")}<td class="num"><b>${fH(grand)}</b></td><td colspan="2">Batez beste ${fH(grand / P.taldea.length)} kide bakoitzeko (% ${Math.round(100 / P.taldea.length)})</td></tr></tfoot>`;
  $("#team").innerHTML = th;

  // ---------- 5. Kodeak ----------
  $("#codes").innerHTML = Object.entries(P.moduluak).filter(([k]) => k !== "AURK")
    .map(([k, v]) => `<div><dt><span class="code">${esc(k)}</span></dt><dd>${esc(v)}</dd></div>`).join("");

  // ---------- 5. Dokumentuak ----------
  // Irakasgaika (moduluka) taldekatuta, moduluen ordenan. Aurkibidea goian, eta dokumentu bakoitzak bere atal nagusiak.
  const DOCS = P.dokumentuak || [];
  const docBox = $("#docs");
  if (docBox) {
    const kodeak = Object.keys(P.moduluak).filter(k => DOCS.some(x => x.kodea === k));
    const slug = k => "dok-" + k.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let n = 0;
    const idx = el("nav", "card pad doc-index");
    idx.setAttribute("aria-label", "Dokumentuen aurkibidea");
    idx.innerHTML = `<h3>Aurkibidea</h3><ol>${kodeak.map(k => {
      const ds = DOCS.filter(x => x.kodea === k);
      return `<li><a href="#${slug(k)}"><span class="code">${esc(k)}</span> ${esc(P.moduluak[k])}</a> <small>(${ds.length})</small>
        <ol>${ds.map(x => `<li><a href="#dok-${++n}">${esc(x.izenburua)}</a></li>`).join("")}</ol></li>`;
    }).join("")}</ol>`;
    docBox.append(idx);
    n = 0;
    kodeak.forEach(k => {
      const g = el("div", "doc-group");
      g.id = slug(k);
      g.append(el("h3", "atala-h", `<span class="code">${esc(k)}</span> ${esc(P.moduluak[k])}`));
      const list = el("div", "doc-list");
      DOCS.filter(x => x.kodea === k).forEach(x => {
        const c = el("article", "card doc");
        c.id = `dok-${++n}`;
        const izena = x.fitxategia.split("/").pop();
        c.innerHTML = `
          <div class="doc-top">
            <span class="doc-ico" aria-hidden="true">DOCX</span>
            <div class="doc-txt"><h4>${esc(x.izenburua)}</h4><p>${esc(x.azalpena)}</p>
              <p class="doc-file">${esc(izena)} · ${x.kb} KB</p></div>
            <a class="doc-btn" href="${encodeURI(x.fitxategia)}" download>Deskargatu</a>
          </div>
          ${x.aurkibidea && x.aurkibidea.length ? `<details class="doc-toc"><summary>Aurkibidea (${x.aurkibidea.length} atal)</summary><ul>${x.aurkibidea.map(h => `<li>${esc(h)}</li>`).join("")}</ul></details>` : ""}`;
        list.append(c);
      });
      g.append(list);
      docBox.append(g);
    });
    if (!DOCS.length) docBox.innerHTML = `<p class="empty">Oraindik ez dago dokumenturik.</p>`;
  }

  // ---------- Nabigazioa ----------
  const links = [...document.querySelectorAll(".top nav a")];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => io.observe(s));
})();
