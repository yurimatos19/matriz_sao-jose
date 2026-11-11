# Site da Matriz de São José — Recife

Site estático (HTML, CSS e JS puros). Basta publicar esta pasta na raiz de `matrizdesaojose.com.br`.

## Editar e atualizar

- O conteúdo das páginas fica em `src/` (`index.html`, `a-matriz.html`, `sao-jose.html`). Cabeçalho, rodapé e metadados ficam em `tools/build_site.py`.
- **Homilias do Pe. Davi:** `python3 tools/atualizar_homilias.py && python3 tools/build_site.py` puxa as homilias novas pelo feed público do YouTube (sem chave, sem custo) e regera as páginas. Dá para agendar 1× por dia.
- Depois de editar qualquer arquivo em `src/`, rode `python3 tools/build_site.py`.

## Páginas

| Caminho | Conteúdo |
|---|---|
| `/` (`index.html`) | Faixa litúrgica do dia (tempo, semana e cor litúrgica + próxima missa), abertura com a foto da fachada ao entardecer e as missas de hoje, horários em três colunas com o dia de hoje destacado, desenho da fachada (1844), **voo de drone controlado pela rolagem** (do altar-mor ao arco dourado, 1920 px), Pe. Davi e homilias, dízimo direto no Asaas, animação de São José, sacramentos, mapa e contato |
| `/a-matriz/` | História da paróquia + tour de drone em 5 capítulos (altar-mor, pomba do Espírito Santo, resplendor, galerias, painel) |
| `/sao-jose/` | Animação "Quem foi São José", vida em linha do tempo (com citações bíblicas), padroeiro da Igreja, oração "A vós, São José", perguntas frequentes |
| `/links/` | Página de atalhos para a bio do Instagram (estilo Linktree): dizimista, doação, missas, site, Instagram, YouTube, WhatsApp, Waze e Google Maps. Conteúdo em `src/links.html`; fica fora do Google (`noindex`) |
| `/llms.txt` (e cópia `/llm.txt`) | Resumo oficial para ChatGPT, Claude, Perplexity, Gemini etc. indicarem a igreja |
| `/robots.txt`, `/sitemap.xml`, `/site.webmanifest` | SEO, liberação explícita para robôs de IA, sitemap com vídeo |

## Dízimo e secretaria (nada aponta para o WordPress antigo)

Este site substitui o WordPress. Nenhum link leva às páginas antigas.

- **Dízimo:** os botões "Seja dizimista" abrem direto o link de pagamento do Asaas (dízimo mensal no cartão, valor livre). O endereço fica em `ASAAS`, no topo de `tools/build_site.py`.
- **Doação única, Pix ou boleto, certidão de batismo, casamento, catequese e conferência de certidão:** abrem o WhatsApp da secretaria com a mensagem já escrita (`WA_MSG` em `tools/build_site.py`). Para trocar por um segundo link do Asaas ou por um formulário, basta mudar ali.

## Espaços reservados (preencher quando o link chegar)

No topo de `tools/build_site.py`:

- `DOACAO = ''` — link de doação avulsa (Pix) no Asaas. Enquanto estiver vazio, "Fazer uma doação agora" abre o WhatsApp da secretaria. Ao colar o link, os botões da home, de `/a-matriz/` e de `/links/` passam a apontar para ele.
- `GRUPO_JOVEM = ''` — link da comunidade do grupo jovem. Vazio: o botão não aparece. Preenchido: aparece em `/links/` e no rodapé.

Depois de preencher, rode `python3 tools/build_site.py`.

## Primeira vez, pedido de oração, lembretes e rotas

- **Primeira vez na Matriz** (`#primeira-vez` na home): chegar 10 minutos antes, estacionamento e rampa na parte de trás, banheiros (masculino, feminino e família).
- **Pedido de oração / intenção de missa:** formulário na mesma seção. Não guarda nada: monta a mensagem e abre o WhatsApp da secretaria (`assets/js/site.js`).
- **Lembrete da missa de domingo:** `assets/agenda/missa-domingo-*.ics` (8h, 11h, 17h30), gerados pelo `build_site.py`. Se os horários mudarem, ajuste lá.
- **Como chegar:** Waze, Google Maps, Mapas da Apple e Uber usam as coordenadas `LAT, LON` do `build_site.py`. A 99 não tem link direto confiável; por isso há o botão "Copiar o endereço".

## Domínio provisório

Por enquanto o site está em `https://matrizsao-jose.vercel.app`, e é esse endereço que aparece no Open Graph, no sitemap e nos dados estruturados. Quando o domínio `matrizdesaojose.com.br` apontar para o site novo, troque de volta:

```bash
grep -rl "https://matrizsao-jose.vercel.app" tools src sitemap.xml robots.txt llms.txt | xargs sed -i '' "s#https://matrizsao-jose.vercel.app#https://matrizdesaojose.com.br#g" && cp llms.txt llm.txt && python3 tools/build_site.py
```

## Dados estruturados

JSON-LD em cada página: `CatholicChurch` (endereço, telefone, CNPJ, horários, pároco, `DonateAction` para o dízimo), `Event` da missa dominical, `VideoObject`, `BreadcrumbList` e `FAQPage` (página São José).

## Mídia

- `assets/scrub-hd/` (1920 px) e `assets/scrub-m/` (960 px, celular) — quadros do drone; o site usa os 114 primeiros, do altar-mor ao arco dourado (os finais mostram uma rachadura).
- `assets/video/` — abertura e clipes do tour (1920 px, sem áudio; `hero-m.mp4` para celular), reel da homilia, animação de São José (`sao-jose-filme.mp4` + legendas `.vtt`).
- `assets/img/og-matriz-sao-jose.jpg` — imagem de compartilhamento (Open Graph) 1200×630.

## Testar localmente

```bash
cd ~/matriz-sao-jose && python3 -m http.server 8765
```

Abrir http://127.0.0.1:8765/

## O filme

Fonte em `filme/sao-jose/` (estilo Impasto, Lemo-Opuscar). `sh filme/sao-jose/build.sh` reconstrói tudo: trilha, mixagem, quadros e master.
