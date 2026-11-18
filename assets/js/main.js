const C = window.OFEX, Q = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = d => d ? new Date(d + "T12:00").toLocaleDateString("pt-BR") : "";
const u = x => /^https?:\/\//.test(x || "") ? x : "";
const im = x => /^(https?:\/\/|assets\/)/.test(x || "") ? x : "";
const json = n => fetch("data/" + n + ".json").then(r => r.json()).catch(() => []);
const col = (r, p) => { const k = Object.keys(r).find(x => x.startsWith(p)); return k ? r[k] : ""; };
const dimg = x => { const m = /\/d\/([\w-]+)|[?&]id=([\w-]+)/.exec(x || ""); return /drive\.google\.com/.test(x || "") && m ? `https://drive.google.com/thumbnail?id=${m[1] || m[2]}&sz=w1200` : x; };
const sim = r => /^s/i.test(col(r, "publicar"));
const ABA = {
  comunicados: ["COMUNICADOS", r => ({ titulo: col(r, "titulo"), data: pd(col(r, "data")), categoria: col(r, "categoria"), texto: col(r, "texto"), imagem: dimg(col(r, "imagem")), alt: col(r, "titulo"), anexo: col(r, "anexo") })],
  projetos: ["PROJETOS", r => ({ nome: col(r, "nome"), categoria: col(r, "categoria"), situacao: col(r, "situacao"), objetivo: col(r, "objetivo"), descricao: col(r, "descricao"), inicio: pd(col(r, "inicio")), prazo: pd(col(r, "prazo")), capitulos: col(r, "capitulos").split(",").map(x => x.trim()).filter(Boolean), resultados: col(r, "resultados"), destaque: /^s/i.test(col(r, "destaque")), imagens: col(r, "imagem") ? [dimg(col(r, "imagem"))] : [], documentos: col(r, "documento (l") ? [{ titulo: col(r, "documento (t") || "Documento", url: col(r, "documento (l") }] : [] })]
};
// comunicados e projetos vêm da planilha Portal_OFEX_Conteudo; se ela falhar, usa os arquivos em data/
const load = async n => { if (ABA[n] && C.conteudoSheetId) { const rows = await getAba(C.conteudoSheetId, ABA[n][0]); if (rows) return rows.filter(sim).map(ABA[n][1]).filter(x => x.titulo || x.nome); } return json(n); };
const byDate = (a, b) => (b.data || b.atualizado || "").localeCompare(a.data || a.atualizado || "");
const ex = i => i.exemplo ? '<span class="tag ex">Exemplo de estrutura</span>' : "";
const lk = (h, t) => u(h) ? `<a class="btn" href="${u(h)}" target="_blank" rel="noopener">${t}</a>` : "";
const show = (s, items, fn, msg) => Q(s).innerHTML = items.length ? items.map(fn).join("") : `<p class="empty">${msg}</p>`;
function withFilter(items, key, draw) {
  const s = Q("#f"); [...new Set(items.map(i => i[key]).filter(Boolean))].forEach(c => s.add(new Option(c, c)));
  const go = () => draw(s.value ? items.filter(i => i[key] == s.value) : items); s.onchange = go; go();
}
const nav = [["index.html","Início"],["calendario.html","Calendário"],["comunicados.html","Comunicados"],["capitulos.html","Capítulos"],["projetos.html","Projetos"],["documentos.html","Documentos"],["galeria.html","Galeria"],["contato.html","Contato"]];
const here = location.pathname.split("/").pop() || "index.html";
Q("#hd").innerHTML = `<a class="brand" href="index.html"><img src="assets/images/logo-ofex.png" alt=""><span><span>8ª</span> OFEX</span></a><button id="mb" aria-expanded="false" aria-controls="nv" aria-label="Abrir menu">☰</button><nav id="nv" aria-label="Principal">${nav.map(([h,t]) => `<a href="${h}"${h == here ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>`;
Q("#mb").onclick = e => { const o = Q("#nv").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", o); };
Q("#ft").innerHTML = `<p><strong>${esc(C.nome)}</strong> — Ordem DeMolay</p><p>Portal institucional mantido pela administração da OFEX.${C.email ? ` <a href="mailto:${esc(C.email)}">${esc(C.email)}</a>` : ""}${u(C.instagram) ? ` <a href="${u(C.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ""}</p>`;

let CAP = [];
const MES = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"], DIA = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
const cor = n => { const x = /\d+/.exec(n || ""); return (CAP.find(c => x && String(c.numero) == x[0]) || {}).cor || "#9a8a78"; };
const dl = (...p) => p.filter(x => x[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
const R = {
  ev: e => { const d = new Date(e.data + "T12:00"); return `<article class="ev" id="e-${e.id}" style="--c:${cor(e.capitulo)}"><time datetime="${e.data}"><b>${d.getDate()}</b>${MES[d.getMonth()]}<small>${DIA[d.getDay()]}</small></time><div><h3>${esc(e.nome)}</h3><dl>${dl(["Horário", e.hora], ["Local", e.local], ["Capítulo", e.capitulo])}</dl>${e.descricao ? `<p>${esc(e.descricao)}</p>` : ""}${e.aviso ? `<p class="aviso">${esc(e.aviso)}</p>` : ""}${lk(e.link, "Inscrição")}</div></article>`; },
  com: i => `<article class="nota">${ex(i)}<header><time>${fmt(i.data)}</time><span class="tag">${esc(i.categoria)}</span></header><h3>${esc(i.titulo)}</h3><p>${esc(i.texto)}</p>${im(i.imagem) ? `<img src="${im(i.imagem)}" alt="${esc(i.alt || i.titulo)}" loading="lazy">` : ""}${lk(i.anexo, "Abrir anexo")}</article>`,
  cap: i => `<article class="cap" style="--c:${i.cor || "#9a8a78"}"><b class="num">${esc(i.numero)}</b><div>${ex(i)}<h3>${esc(i.nome)}</h3>${i.cidade ? `<p class="meta">${esc(i.cidade)}</p>` : ""}${i.apresentacao ? `<p>${esc(i.apresentacao)}</p>` : ""}${lk(i.instagram, "Instagram")}${lk(i.facebook, "Facebook")}${i.email ? `<p><a href="mailto:${esc(i.email)}">${esc(i.email)}</a></p>` : ""}</div>${im(i.logo) ? `<img class="logo" src="${im(i.logo)}" alt="Brasão do ${esc(i.nome)}">` : ""}</article>`,
  proj: i => `<article class="proj${i.destaque ? " star" : ""}">${ex(i)}<p><span class="tag">${esc(i.categoria)}</span><span class="st">${esc(i.situacao)}</span></p><h3>${esc(i.nome)}</h3><p><b>Objetivo:</b> ${esc(i.objetivo)}</p><p>${esc(i.descricao)}</p><dl>${dl(["Início", fmt(i.inicio)], ["Prazo", fmt(i.prazo)], ["Capítulos", (i.capitulos || []).join(", ")])}</dl>${i.resultados ? `<p><b>Resultados:</b> ${esc(i.resultados)}</p>` : ""}${(i.imagens || []).map(x => im(x) ? `<img src="${im(x)}" alt="Foto do projeto ${esc(i.nome)}" loading="lazy">` : "").join("")}${(i.documentos || []).map(d => lk(d.url, esc(d.titulo))).join("")}</article>`,
  doc: i => `<article class="doc">${ex(i)}<div><span class="tag">${esc(i.categoria)}</span><h3>${esc(i.titulo)}</h3><p class="meta">Atualizado em ${fmt(i.atualizado)}</p></div>${lk(i.url, "Abrir")}</article>`
};
async function cal() {
  const ev = await getEvents(), hoje = new Date().toLocaleDateString("sv"), p = n => String(n).padStart(2, "0");
  let d = new Date(), y = d.getFullYear(), m = d.getMonth(); const nx = ev.find(e => e.data >= hoje); if (nx) { y = +nx.data.slice(0, 4); m = +nx.data.slice(5, 7) - 1; }
  Q("#leg").innerHTML = CAP.map(c => `<span style="--c:${c.cor}"><i></i>${esc(c.numero)} ${esc(c.nome.replace(/^Capítulo\s+/, "").replace(/\s*nº.*$/, ""))}</span>`).join("");
  const draw = () => {
    const first = new Date(y, m, 1), n = new Date(y, m + 1, 0).getDate(), key = `${y}-${p(m + 1)}`, mon = ev.filter(e => e.data.startsWith(key));
    Q("#mt").textContent = first.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    let h = ["D","S","T","Q","Q","S","S"].map(x => `<div class="dh">${x}</div>`).join("") + "<div></div>".repeat(first.getDay());
    for (let i = 1; i <= n; i++) { const es = mon.filter(e => e.data == `${key}-${p(i)}`);
      h += `<div class="day${key + "-" + p(i) == hoje ? " hoje" : ""}"><b>${i}</b>${es.map(e => `<a href="#e-${e.id}" style="--c:${cor(e.capitulo)}">${esc(e.nome)}</a>`).join("")}</div>`; }
    Q("#grid").innerHTML = h;
    window.evErro ? Q("#lst").innerHTML = '<p class="empty">Não foi possível ler a planilha. Confira se ela está compartilhada como "Qualquer pessoa com o link" (Leitor) e se a aba LISTA GERAL não foi renomeada.</p>' : show("#lst", mon, R.ev, "Nenhuma atividade cadastrada neste mês.");
  };
  Q("#pv").onclick = () => { if (--m < 0) { m = 11; y--; } draw(); };
  Q("#nx").onclick = () => { if (++m > 11) { m = 0; y++; } draw(); };
  draw();
}
async function home() {
  const [ev, co, pr] = await Promise.all([getEvents(), load("comunicados"), load("projetos")]);
  const hoje = new Date().toLocaleDateString("sv"), prox = ev.filter(e => e.data >= hoje);
  Q("#destaque").innerHTML = "<h2>Próximo compromisso</h2>" + (prox[0] ? `<div class="grid">${R.ev(prox[0])}</div>` : '<p class="empty">Nenhuma atividade futura cadastrada no calendário.</p>');
  Q("#stats").innerHTML = "<dl class='strip'>" + [[CAP.length, "Capítulos"], [prox.length, "atividades futuras"], [co.filter(x => !x.exemplo).length, "comunicados"], [pr.filter(x => !x.exemplo && x.situacao == "Em andamento").length, "projetos em andamento"]].map(([n, t]) => `<div><dd>${n}</dd><dt>${t}</dt></div>`).join("") + "</dl>";
  show("#prox", prox.slice(0, 4), R.ev, "Sem atividades futuras.");
  show("#com", co.sort(byDate).slice(0, 3), R.com, "Nenhum comunicado publicado.");
  show("#proj", pr.filter(p => p.situacao == "Em andamento" || p.exemplo).slice(0, 3), R.proj, "Nenhum projeto em andamento.");
}
const pages = {
  home, cal,
  com: async () => withFilter((await load("comunicados")).sort(byDate), "categoria", x => show("#lst", x, R.com, "Nenhum comunicado publicado.")),
  cap: () => show("#lst", CAP, R.cap, "Nenhum Capítulo cadastrado."),
  proj: async () => withFilter(await load("projetos"), "categoria", x => show("#lst", x, R.proj, "Nenhum projeto cadastrado.")),
  doc: async () => withFilter((await load("documentos")).sort(byDate), "categoria", x => show("#lst", x, R.doc, "Nenhum documento disponível.")),
  gal: async () => withFilter((await load("galeria")).sort(byDate), "categoria", x => {
    show("#lst", x, (i, n) => `<button class="ph" data-n="${n}"><img src="${im(i.url)}" alt="${esc(i.alt || i.legenda)}" loading="lazy"><span>${esc(i.evento)}</span></button>`, "Nenhuma foto publicada.");
    document.querySelectorAll(".ph").forEach(b => b.onclick = () => { const i = x[b.dataset.n];
      Q("#dlg div").innerHTML = `<img src="${im(i.url)}" alt="${esc(i.alt || i.legenda)}"><p><b>${esc(i.evento)}</b>, ${fmt(i.data)}<br>${esc(i.legenda)}</p>`; Q("#dlg").showModal(); });
  }),
  contato: () => { const f = u(C.formUrl);
    Q("#frm").innerHTML = f ? `<iframe src="${f}${f.includes("?") ? "&" : "?"}embedded=true" title="Formulário de contato"></iframe>${lk(f, "Abrir formulário em nova aba")}` : '<p class="empty">O formulário ainda não foi configurado. Veja o passo a passo em docs/manual-administracao.md.</p>'; }
};
if (Q("#lg") && C.logoGestao) { Q("#lg").src = C.logoGestao; Q("#lg").hidden = false; }
(async () => { CAP = await load("capitulos"); await pages[document.body.dataset.page]?.(); })();
