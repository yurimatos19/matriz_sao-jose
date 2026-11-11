#!/usr/bin/env python3
"""Atualiza as homilias do Pe. Davi a partir do feed público do YouTube (sem chave de API, sem custo).
Uso:  python3 tools/atualizar_homilias.py   (depois rode tools/build_site.py)
Pode rodar num cron diário ou numa GitHub Action."""
import json, re, urllib.request, os, html
CANAL = 'UCzZOORfha30vhWdUZ19BCvw'   # Pe. Davi Melo — youtube.com/@davi_amelo
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
url = f'https://www.youtube.com/feeds/videos.xml?channel_id={CANAL}'
xml = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=20).read().decode('utf-8')
itens = []
for e in re.findall(r'<entry>(.*?)</entry>', xml, re.S):
    vid = re.search(r'<yt:videoId>(.*?)<', e).group(1)
    titulo = html.unescape(re.search(r'<title>(.*?)</title>', e).group(1))
    data = re.search(r'<published>(.*?)<', e).group(1)[:10]
    desc = re.search(r'<media:description>(.*?)</media:description>', e, re.S)
    itens.append({'id': vid, 'titulo': titulo, 'data': data, 'descricao': html.unescape(desc.group(1)).strip()[:280] if desc else ''})
json.dump({'canal': CANAL, 'homilias': itens}, open(os.path.join(RAIZ, 'assets/data/homilias.json'), 'w'), ensure_ascii=False, indent=1)
print(len(itens), 'homilias ·', itens[0]['data'], itens[0]['titulo'])
