# Portal institucional da 8ª OFEX — Oficialaria Executiva
Site estático (HTML/CSS/JS), sem build, gratuito no GitHub Pages.

## Publicar
1. Crie uma conta no github.com e um repositório público (ex.: `ofex-portal`), de preferência numa **organização** da OFEX.
2. Envie todos os arquivos (Add file → Upload files), mantendo as pastas e o `.nojekyll`.
3. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
4. Endereço: `https://SEU-USUARIO.github.io/ofex-portal/`

## Configurar
Edite `assets/js/config.js` (planilha do calendário já informada; falta o `formUrl`). Detalhes em `docs/manual-administracao.md`.

## Testar localmente
Na pasta, rode `python3 -m http.server` e abra http://localhost:8000 (abrir o HTML direto bloqueia a leitura dos JSON).
