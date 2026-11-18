# Manual de administração — Portal da 8ª OFEX
O portal pertence à OFEX, não a uma gestão. Nenhum nome de gestor está no código.

## 1. Calendário (planilha "01_Calendario_Regional_GERAL")
O site lê a aba **LISTA GERAL** da planilha Geral (https://docs.google.com/spreadsheets/d/14e_ASIlzcEdfKKi5n8IeHK2xGw4vvbyZHGB4IY8qK34). Os Capítulos cadastram as atividades nas planilhas deles; a Geral junta tudo sozinha. Ninguém digita na Geral nem no site.
1. Compartilhar a planilha Geral como "Qualquer pessoa com o link" → **Leitor** (obrigatório). Atenção: isso deixa a planilha inteira legível por quem tiver o link.
2. Não renomeie a aba LISTA GERAL nem as colunas (Data, Atividade, Horário, Local, Capítulo, Observações, Aviso). Se mudar o nome da aba, atualize `sheetAba` em `assets/js/config.js`.
3. Se a lista estiver vazia no site, confira na própria planilha se a aba CONFIGURAÇÃO mostra "Conectado" para todos os Capítulos.
4. As cores dos Capítulos no site ficam em `data/capitulos.json` (campo `cor`).

## 2. Formulário (Google Forms)
Crie um Forms com: Nome (opcional), Capítulo, Categoria (Sugestão/Dúvida/Reclamação), Assunto, Descrição, E-mail (opcional). Enviar → copiar link → colar em `formUrl` no `config.js`. Vincule as respostas a uma planilha e compartilhe com a administração.

## 3. Comunicados e projetos (planilha "Portal_OFEX_Conteudo")
Planilha: https://docs.google.com/spreadsheets/d/1bzDTMVvp31H4gLiAGlPtDXRwpBkTm7pz1VJ4_FJY7B0
- Abas COMUNICADOS e PROJETOS: uma linha por item. Só aparece no site o que tem **Publicar = Sim**. Não renomeie abas nem cabeçalhos.
- Compartilhar como "Qualquer pessoa com o link" → Leitor; editores só da administração.
- Links de imagem/anexo: arquivos do Drive com acesso por link. Para trocar de planilha, altere `conteudoSheetId` em `assets/js/config.js`.
- Se a planilha ficar inacessível, o site usa os arquivos `data/comunicados.json` e `data/projetos.json` como reserva.

## 3b. Documentos, galeria e Capítulos (arquivos em `data/`)
- `capitulos.json`: nome, numero, cidade, apresentacao, logo, instagram, facebook, email
- `documentos.json`: titulo, categoria, atualizado, url (PDF no Drive com acesso por link, ou link externo)
- `galeria.json`: evento, categoria, data, legenda, alt, url (imagem em `assets/images/` ou link direto)
Use apenas dados fornecidos e autorizados. Valide o JSON em jsonlint.com.

## 4. Privacidade
Não publique documentos internos, dados pessoais ou fotos sem autorização. Nunca coloque senhas ou chaves no código.

## 5. Passagem de gestão
Adicione a nova administração como colaboradora do repositório (Settings → Collaborators) e editora da planilha; remova os acessos antigos.

## 6. Logos
- Brasão da OFEX: `assets/images/logo-ofex.png` (também usado como ícone da aba).
- Logo da gestão: `assets/images/logo-gestao.png`, indicada em `logoGestao` no `config.js`. Na troca de gestão, envie a nova imagem (de preferência PNG com fundo transparente, pensada para fundo escuro) e ajuste o caminho; deixe `""` para ocultar.
