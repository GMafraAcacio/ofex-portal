// Camada de dados do calendário: lê a planilha Google (CSV público) e devolve eventos.
(() => {
  const nk = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const A = { nome:["atividade","nome","evento","titulo"], data:["data"], hora:["horario","hora"], local:["local"],
    capitulo:["capitulo","responsavel"], categoria:["categoria","tipo"], descricao:["observacoes","descricao"], aviso:["aviso"],
    link:["link","inscricao","link de inscricao"] };
  const pd = s => { s = s.trim(); let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[0] : ""; };
  function csv(t) { const r = []; let row = [], c = "", q = 0;
    for (let i = 0; i < t.length; i++) { const ch = t[i];
      if (q) { if (ch == '"') { if (t[i+1] == '"') { c += '"'; i++; } else q = 0; } else c += ch; }
      else if (ch == '"') q = 1; else if (ch == ",") { row.push(c); c = ""; }
      else if (ch == "\n" || ch == "\r") { if (ch == "\r" && t[i+1] == "\n") i++; row.push(c); r.push(row); row = []; c = ""; }
      else c += ch; }
    row.push(c); r.push(row); return r; }
  window.pd = pd;
  // Lê uma aba de qualquer planilha pública como lista de objetos (chaves = cabeçalhos sem acento/minúsculos). Falha → null.
  window.getAba = (id, aba) => fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&headers=0&sheet=${encodeURIComponent(aba)}`)
    .then(r => { if (!r.ok) throw 0; return r.text(); })
    .then(t => { const [h, ...rows] = csv(t); const ks = h.map(nk); if (!ks.includes("publicar")) throw 0;
      return rows.filter(r => r.some(x => x.trim())).map(r => Object.fromEntries(ks.map((k, i) => [k, (r[i] || "").trim()]))); })
    .catch(() => null);
  let cache;
  window.getEvents = () => cache || (cache = fetch(`https://docs.google.com/spreadsheets/d/${OFEX.sheetId}/gviz/tq?tqx=out:csv&headers=0&sheet=${encodeURIComponent(OFEX.sheetAba || "LISTA GERAL")}`)
    .then(r => { if (!r.ok) throw 0; return r.text(); })
    .then(t => { const all = csv(t), hi = all.findIndex(r => r.some(x => nk(x) == "data") && r.some(x => nk(x) == "atividade"));
      if (hi < 0) throw 0; const h = all[hi], rows = all.slice(hi + 1), ix = {};
      for (const k in A) ix[k] = h.findIndex(x => A[k].includes(nk(x)));
      if (ix.nome < 0 || ix.data < 0) throw 0;
      return rows.map((r, i) => { const g = k => ix[k] >= 0 ? (r[ix[k]] || "").trim() : "";
        return { id:i, nome:g("nome"), data:pd(g("data")), hora:g("hora"), local:g("local"), capitulo:g("capitulo"),
          categoria:g("categoria"), descricao:g("descricao"), link:g("link"), aviso:g("aviso") }; })
        .filter(e => e.nome && e.data).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora)); })
    .catch(() => { window.evErro = true; return []; }));
})();
