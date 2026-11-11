#!/usr/bin/env python3
"""Gera as páginas do site a partir de src/ (cabeçalho e rodapé únicos + homilias do feed).
Uso: python3 tools/build_site.py      (rode antes tools/atualizar_homilias.py para trazer homilias novas)"""
import json, os, html, datetime, urllib.parse, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import hashlib
VER = hashlib.md5((open(os.path.join(R,'assets/css/site.css'),'rb').read() + open(os.path.join(R,'assets/js/site.js'),'rb').read())).hexdigest()[:8]  # quebra o cache a cada mudança
SITE = 'https://matrizdesaojose.com.br'
ASAAS = 'https://www.asaas.com/c/fw001yxxge7pea3w'  # link de pagamento da paróquia (dízimo mensal no cartão)
# ESPAÇOS RESERVADOS: cole o link entre as aspas e rode este script. Vazio = o site se vira sem ele.
DOACAO = ''       # link de doação avulsa (Pix) no Asaas. Vazio: "doar agora" abre o WhatsApp da secretaria
GRUPO_JOVEM = 'https://chat.whatsapp.com/HoxMIQxl9ef3jNXhMayMEE'  # link da comunidade do grupo jovem. Vazio: o botão não aparece
WA_MSG = {
 'duvida': 'Olá! Tenho uma dúvida sobre a Matriz de São José.',
 'doacao': 'Olá! Quero fazer uma doação para a Matriz de São José por Pix ou boleto.',
 'casamento': 'Olá! Quero abrir o processo de casamento na Matriz de São José.',
 'catequese': 'Olá! Quero saber das inscrições da catequese de jovens e adultos.',
 'batismo': 'Olá! Preciso de uma certidão de batismo da Matriz de São José.',
 'autenticar': 'Olá! Quero conferir a autenticidade de uma certidão emitida pela paróquia.',
}
_DEST = 'Matriz de São José, Rua Vidal de Negreiros, 377, São José, Recife - PE'
LAT, LON = '-8.0723277', '-34.8822693'  # Rua Vidal de Negreiros, 377 (OpenStreetMap)
ROTAS = {  # abrem o aplicativo já com a rota até a Matriz
 'WAZE': f'https://waze.com/ul?ll={LAT}%2C{LON}&navigate=yes',
 'UBER': f'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Blatitude%5D={LAT}&dropoff%5Blongitude%5D={LON}&dropoff%5Bnickname%5D=' + urllib.parse.quote('Matriz de São José') + '&dropoff%5Bformatted_address%5D=' + urllib.parse.quote(_DEST),
 'GMAPS': 'https://www.google.com/maps/dir/?api=1&destination=' + urllib.parse.quote(_DEST),
 'AMAPS': 'https://maps.apple.com/?daddr=' + urllib.parse.quote(_DEST),
}
IG = 'https://www.instagram.com/matrizdesaojose/'
YT = 'https://www.youtube.com/@davi_amelo/videos'
WA = {k: 'https://wa.me/558132245801?text=' + urllib.parse.quote(v) for k, v in WA_MSG.items()}
MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

ICONS = {
 'arrow': '<path d="M4 12h16M14 6l6 6-6 6"/>',
 'play': '<path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" fill="currentColor" stroke="none"/>',
 'menu': '<path d="M3 7h18M3 12h18M3 17h18"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'wa': '<path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8.4 19z"/><path d="M9 8.8c0 3.3 2.9 6.2 6.2 6.2l1.2-1.6-2-1-1 .8a4.6 4.6 0 0 1-2.6-2.6l.8-1-1-2z"/>',
 'heart': '<path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z"/>',
 'ig': '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
 'yt': '<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="M10 9.2v5.6l5-2.8z" fill="currentColor" stroke="none"/>',
 'pin': '<path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
 'home': '<path d="M4 10.5 12 4l8 6.5V20H4z"/><path d="M10 20v-5.5h4V20"/>',
 'lock': '<rect x="5" y="11" width="14" height="10"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
}
SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(
    f'<symbol id="i-{k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{v}</symbol>' for k, v in ICONS.items()) + '</svg>'
I = lambda n: f'<svg aria-hidden="true"><use href="#i-{n}"/></svg>'

def head(m, ld):
    url = SITE + m['path']
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{m['title']}</title>
<meta name="description" content="{m['desc']}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#1e1109">
<meta name="robots" content="{m.get('robots', 'index, follow, max-image-preview:large')}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Matriz de São José">
<meta property="og:title" content="{m['ogt']}">
<meta property="og:description" content="{m['desc']}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og-matriz-sao-jose.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Matriz de São José, Recife – PE, desde 1844: fachada da igreja ao entardecer com o monograma SJ">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{m['ogt']}">
<meta name="twitter:description" content="{m['desc']}">
<meta name="twitter:image" content="{SITE}/assets/img/og-matriz-sao-jose.jpg">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/img/icon-192.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="text/plain" title="Resumo para IAs" href="/llms.txt">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gloock&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css?v={VER}">
{m.get('extra_head', '')}
{'<script type="application/ld+json">' + chr(10) + ld + chr(10) + '</script>' if ld else ''}
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
{SPRITE}
'''

def header(cur):
    nav = [('/#missas', 'Missas'), ('/a-matriz/', 'A Matriz'), ('/#pe-davi', 'Pe. Davi'), ('/#sacramentos', 'Sacramentos'), ('/sao-jose/', 'São José'), ('/#visite', 'Visite')]
    lis = ''.join(f'<li><a href="{h}"{" aria-current=\"page\"" if h == cur else ""}>{t}</a></li>' for h, t in nav)
    return f'''<div class="liturgy" data-cor>
  <div class="wrap">
    <span class="day"><i class="dot" aria-hidden="true"></i><span data-liturgia>Tempo Comum</span></span>
    <span class="next"><span>Próxima missa: <b data-proxima>consulte os horários</b></span><a class="wa" href="https://wa.me/558132245801">WhatsApp da secretaria</a></span>
  </div>
</div>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="Matriz de São José — início">
      <img src="/assets/img/monograma-sj-escuro.png" alt="" width="44" height="51">
      <span>Matriz de São José<small>Recife, desde 1844</small></span>
    </a>
    <button class="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu">{I('menu')}</button>
    <ul class="menu" id="menu">{lis}<li><a class="btn btn-gold" href="{ASAAS}" target="_blank" rel="noopener">{I('heart')}Seja dizimista</a></li></ul>
  </div>
</header>
'''

FOOTER = f'''<section class="ig" aria-label="Instagram">
  <div class="wrap">
    <p>A vida da Matriz, todo dia, em <a href="https://www.instagram.com/matrizdesaojose/" target="_blank" rel="noopener">@matrizdesaojose</a></p>
    <a class="btn" href="https://www.instagram.com/matrizdesaojose/" target="_blank" rel="noopener">Seguir no Instagram</a>
  </div>
</section>
<footer class="site-footer">
  <div class="wrap">
    <div class="foot">
      <div>
        <img src="/assets/img/logo-creme.png" alt="Paróquia de São José · Recife – PE · 1844" width="144" height="120" loading="lazy">
        <p>Paróquia de São José<br>Rua Vidal de Negreiros, 377 · São José<br>Recife – PE · CEP 50020-480<br>CNPJ 01.709.537/0001-98</p>
      </div>
      <div><h4>Celebrações</h4><ul>
        <li><a href="/#missas">Horários de missa</a></li><li><a href="/#missas">Confissões</a></li>
        <li><a href="https://drive.google.com/file/d/1Oa4m8mOYm9moAjNcewmuWGRhUWsKcy-6/view?usp=sharing">Livro da Missa em Latim</a></li>
        <li><a href="/#pe-davi">Homilias do Pe. Davi</a></li></ul></div>
      <div><h4>Secretaria</h4><ul>
        <li><a href="{WA['batismo']}">Certidão de batismo</a></li><li><a href="{WA['casamento']}">Casamento</a></li>
        <li><a href="{WA['catequese']}">Catequese</a></li><li><a href="{WA['autenticar']}">Conferir uma certidão</a></li></ul></div>
      <div><h4>A paróquia</h4><ul>
        <li><a href="/a-matriz/">A Matriz por dentro</a></li><li><a href="/sao-jose/">Quem foi São José</a></li>
        <li><a href="/#primeira-vez">Primeira vez na Matriz</a></li><li><a href="/#dizimo">Dízimo e doações</a></li>{'<li><a href="' + html.escape(GRUPO_JOVEM) + '" target="_blank" rel="noopener">Grupo jovem</a></li>' if GRUPO_JOVEM else ''}<li><a href="mailto:contato@matrizdesaojose.com.br">contato@matrizdesaojose.com.br</a></li></ul></div>
    </div>
    <div class="legal"><span>© <span data-year>2026</span> Paróquia de São José, Recife – PE</span><i>São José, rogai por nós.</i></div>
    <p class="credit">Desenvolvido com amor pela <a href="https://useautogenius.com" target="_blank" rel="noopener">useautogenius.com</a></p>
  </div>
</footer>
<nav class="mbar" aria-label="Atalhos">
  <a href="/#missas">{I('clock')}Missas</a>
  <a href="https://wa.me/558132245801">{I('wa')}WhatsApp</a>
  <a class="red" href="{ASAAS}" target="_blank" rel="noopener">{I('heart')}Dízimo</a>
</nav>
<script src="/assets/js/site.js?v={VER}" defer></script>
</body>
</html>
'''

def data_br(s):
    d = datetime.date.fromisoformat(s); return f'{d.day} {MESES[d.month - 1]} {d.year}'
def titulo(t):  # os títulos do canal usam CAIXA ALTA para ênfase; no site, só a primeira letra
    t = html.unescape(t).strip()
    PROPRIOS = {'deus', 'maria', 'igreja', 'estado', 'jesus', 'cristo', 'senhor', 'virgem', 'teresinha', 'joão', 'paulo', 'josé', 'espírito', 'santo', 'nossa', 'senhora', 'eucaristia'}
    import re as _re
    def w_(w):
        core = _re.sub(r'[^\wÀ-ÿ]', '', w)
        if not w.isupper() or len(core) < 2: return w
        if _re.fullmatch(r'[IVXLC]+', core): return w
        lw = w.lower()
        return lw.replace(core.lower(), core.lower().capitalize()) if core.lower() in PROPRIOS else lw
    words = [w_(w) for w in t.split()]
    s = ' '.join(words); return s[0].upper() + s[1:]

def homilias():
    H = json.load(open(os.path.join(R, 'assets/data/homilias.json')))['homilias']
    f = H[0]
    feat = f'''<div class="feature reveal">
          <button class="yt" data-id="{f['id']}" aria-label="Assistir: {html.escape(titulo(f['titulo']))}">
            <img src="https://i.ytimg.com/vi/{f['id']}/maxresdefault.jpg" alt="" loading="lazy" width="1280" height="720">
            <span class="play">{I('play')}Assistir à homilia</span>
          </button>
          <h3>{html.escape(titulo(f['titulo']))}</h3>
          <div class="meta">{data_br(f['data'])}, no YouTube</div>
        </div>'''
    items = ''.join(f'''<li><a href="https://www.youtube.com/watch?v={h['id']}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/{h['id']}/mqdefault.jpg" alt="" loading="lazy" width="320" height="180"><span class="t">{html.escape(titulo(h['titulo']))}</span><time datetime="{h['data']}">{data_br(h['data'])}</time></a></li>''' for i, h in enumerate(H[:6]))
    return f'<ul class="hlist">{items}</ul>'

PAGES = [
  ('index', '/', {'title': 'Matriz de São José · Recife – PE · desde 1844',
    'desc': 'Paróquia de São José, no centro do Recife. Horários de missas e confissões, homilias do Pe. Davi de Melo, dízimo e doações, batismo, casamento, catequese e contato da Matriz de São José.',
    'ogt': 'Matriz de São José · Recife – PE · desde 1844', 'extra_head': '<link rel="preload" as="image" href="/assets/img/hero-matriz.jpg" media="(min-width:901px)"><link rel="preload" as="image" href="/assets/img/hero-matriz-m.jpg" media="(max-width:900px)">'}),
  ('a-matriz', '/a-matriz/', {'title': 'A Matriz por dentro · história e tour de drone · Matriz de São José, Recife',
    'desc': 'História da Matriz de São José, no bairro de São José, Recife, paróquia desde 1844, e um tour em vídeo de drone pelo altar-mor, o resplendor, as galerias e os painéis.',
    'ogt': 'A Matriz de São José por dentro'}),
  ('sao-jose', '/sao-jose/', {'title': 'Quem foi São José · vida, oração e animação · Matriz de São José',
    'desc': 'Quem foi São José, esposo de Maria e pai adotivo de Jesus: a vida nos Evangelhos, os quatro sonhos, a fuga para o Egito, por que é padroeiro da Igreja e dos trabalhadores, a oração A vós, São José e uma animação para assistir.',
    'ogt': 'Quem foi São José? Assista à animação'}),
]
def corpo(slug):
    body = open(os.path.join(R, f'src/{slug}.html')).read()
    if '{{HOMILIAS}}' in body: body = body.replace('{{HOMILIAS}}', homilias())
    for k in ICONS: body = body.replace('{{i:' + k + '}}', I(k))
    for k in WA: body = body.replace('{{wa:' + k + '}}', html.escape(WA[k]))
    for k in ROTAS: body = body.replace('{{' + k + '}}', html.escape(ROTAS[k]))
    for k, v in (('DOACAO', DOACAO), ('GRUPO_JOVEM', GRUPO_JOVEM)):  # {{#X}}só com link{{/X}}  {{^X}}só sem link{{/X}}
        body = re.sub(r'\{\{#%s\}\}(.*?)\{\{/%s\}\}' % (k, k), (lambda mo: mo.group(1)) if v else '', body, flags=re.S)
        body = re.sub(r'\{\{\^%s\}\}(.*?)\{\{/%s\}\}' % (k, k), '' if v else (lambda mo: mo.group(1)), body, flags=re.S)
        body = body.replace('{{' + k + '}}', html.escape(v))
    return body.replace('{{ASAAS}}', ASAAS).replace('{{IG}}', IG).replace('{{YT}}', YT)

for slug, path, m in PAGES:
    m['path'] = path
    body = corpo(slug)
    ld = open(os.path.join(R, f'src/ld-{slug}.json')).read()
    out = head(m, ld) + header(path if path != '/' else '') + '<main id="conteudo">\n' + body + '\n</main>\n' + FOOTER
    dst = os.path.join(R, 'index.html' if slug == 'index' else f'{slug}/index.html')
    open(dst, 'w').write(out); print('ok', dst)

# /links/ — página de atalhos para a bio do Instagram (sem cabeçalho nem rodapé do site)
m = {'path': '/links/', 'title': 'Matriz de São José · links', 'ogt': 'Matriz de São José · Recife',
     'desc': 'Atalhos da Matriz de São José, Recife: seja dizimista, faça uma doação, horários de missa, site, Instagram, YouTube, WhatsApp e como chegar.',
     'robots': 'noindex, follow', 'extra_head': '<link rel="preload" as="image" href="/assets/img/hero-matriz-m.jpg">'}
out = head(m, '').replace('<body>', '<body class="lk-body">') + '<main id="conteudo">\n' + corpo('links') + '\n</main>\n' + f'<script src="/assets/js/site.js?v={VER}" defer></script>\n</body>\n</html>\n'
os.makedirs(os.path.join(R, 'links'), exist_ok=True)
dst = os.path.join(R, 'links/index.html'); open(dst, 'w').write(out); print('ok', dst)

# Lembretes da missa de domingo para a agenda do celular (.ics, repetição semanal, aviso 1 h antes)
os.makedirs(os.path.join(R, 'assets/agenda'), exist_ok=True)
for hhmm in ('0800', '1100', '1730'):
    ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Matriz de Sao Jose Recife//Missas//PT', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
           'BEGIN:VTIMEZONE', 'TZID:America/Recife', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0300', 'TZOFFSETTO:-0300', 'TZNAME:-03', 'END:STANDARD', 'END:VTIMEZONE',
           'BEGIN:VEVENT', f'UID:missa-domingo-{hhmm}@matrizdesaojose.com.br', 'DTSTAMP:20261111T000000Z',
           f'DTSTART;TZID=America/Recife:20261115T{hhmm}00', 'DURATION:PT1H', 'RRULE:FREQ=WEEKLY;BYDAY=SU',
           'SUMMARY:Missa na Matriz de São José', 'LOCATION:Matriz de São José\\, Rua Vidal de Negreiros\\, 377\\, São José\\, Recife - PE',
           'DESCRIPTION:Chegue 10 minutos antes: a missa costuma lotar. https://matrizdesaojose.com.br',
           'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Missa na Matriz de São José em 1 hora', 'END:VALARM',
           'END:VEVENT', 'END:VCALENDAR']
    open(os.path.join(R, f'assets/agenda/missa-domingo-{hhmm}.ics'), 'w', newline='').write('\r\n'.join(ics) + '\r\n')
print('ok agenda')
