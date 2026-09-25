"""Desempacota a página exportada (bundler de design) num site estático de verdade.

Uso: python3 scripts/desempacota.py "<Pagina de Venda.html exportada>" .
     (regrava index.html, assets/js, assets/fontes e demo/; não mexe em CNAME, robots.txt nem assets/og.jpg)

O que muda para o visitante:
  - some a tela de espera (a miniatura gigante) e a descompactação de ~2 MB a cada visita;
  - cada arquivo é baixado uma vez e fica em cache (a demo também: os 5 iframes dividem os mesmos arquivos);
  - título, descrição e prévia do link ficam no HTML (WhatsApp/Instagram não executam JS).
"""
import base64, gzip, json, os, re, shutil, sys

ORIGEM, DESTINO = sys.argv[1], sys.argv[2]
SITE = 'https://medatalho.com'


def abre(html):
    bl = {m.group(1): m.group(2) for m in re.finditer(r'<script type="__bundler/([a-z_]+)"[^>]*>(.*?)</script>', html, re.S)}
    man = json.loads(bl['manifest'])
    rec = {}
    for uid, e in man.items():
        b = base64.b64decode(e['data'])
        rec[uid] = (e['mime'], gzip.decompress(b) if e['compressed'] else b)
    return (json.loads(bl['template']), rec,
            json.loads(bl.get('ext_resources') or '[]'), set(json.loads(bl.get('page_order') or '[]')))


def grava(rel, dados):
    p = os.path.join(DESTINO, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'wb' if isinstance(dados, bytes) else 'w', **({} if isinstance(dados, bytes) else {'encoding': 'utf-8'})).write(dados)


def troca(txt, velho, novo, n=1):
    """replace que falha alto: se o trecho sumiu numa exportação nova, o script para em vez de publicar errado."""
    if txt.count(velho) != n:
        sys.exit(f'esperava {n}x, achei {txt.count(velho)}x: {velho[:80]!r}')
    return txt.replace(velho, novo)


def sem_subsets_inuteis(css_html, arquivos):
    """Tira @font-face cirílico/vietnamita (página em pt-BR); devolve o html e os arquivos que sobraram em uso."""
    css_html = re.sub(r'/\* (cyrillic-ext|cyrillic|vietnamese) \*/\s*@font-face\s*\{[^}]*\}\s*', '', css_html)
    return css_html, {a for a in arquivos if a in css_html}


for velho in ('assets/js', 'assets/fontes', 'demo'):
    shutil.rmtree(os.path.join(DESTINO, velho), ignore_errors=True)

# ---------------------------------------------------------------- demo (app dentro dos iframes)
tpl, rec, ext, paginas = abre(open(ORIGEM, encoding='utf-8').read())
assert len(paginas) == 1
demo_uid = next(iter(paginas))
dtpl, drec, _, dpag = abre(rec[demo_uid][1].decode('utf-8'))
assert not dpag, 'demo com páginas aninhadas: não previsto'

NOMES_DEMO = [  # cabeçalho do arquivo → nome (mesmos nomes do projeto plantao-guia)
    ('ICONES', 'icones.js'), ('BASE DE CONTEUDO', 'dados.js'), ('SUBPASTAS', 'subpastas.js'),
    ('QUEIXAS', 'queixas.js'), ('FERRAMENTAS DO PLANTAO — base', 'ferramentas-dados.js'),
    ('ESCORES CLÍNICOS', 'scores-dados.js'), ('PEDIATRIA', 'pediatria.js'),
    ('BULÁRIO', 'bulario-dados.js'), ('FERRAMENTAS DO PLANTAO — motor', 'ferramentas.js'),
    ('ELETRÓLITOS', 'eletrolitos.js'), ('Render do documento', 'app.js'), ('CASCA DO APLICATIVO', 'ui.js'),
]
fontes_demo = {}
for uid, (mime, b) in drec.items():
    if mime == 'text/javascript':
        cab = b[:200].decode('utf-8', 'replace')
        nome = next(n for k, n in NOMES_DEMO if k in cab)
        grava('demo/js/' + nome, b)
        dtpl = troca(dtpl, f'<script src="{uid}">', f'<script src="js/{nome}">')
    elif mime == 'font/woff2':
        fontes_demo[f'fontes/{uid[:8]}.woff2'] = b
        dtpl = dtpl.replace(uid, f'fontes/{uid[:8]}.woff2')
# no iframe não há ícone, manifesto nem instalação: tudo isso dava 404 ou registrava um service worker à toa
dtpl = re.sub(r'<link rel="(manifest|icon|apple-touch-icon|apple-touch-startup-image)"[^>]*>\n?', '', dtpl)
dtpl = re.sub(r'<meta (name="apple-mobile-web-app[^"]*"|property="og:[^"]*"|name="twitter:[^"]*")[^>]*>\n?', '', dtpl)
dtpl = re.sub(r'<script>\s*/\* offline: registra o service worker.*?</script>\n?', '', dtpl, flags=re.S)
assert 'serviceWorker' not in dtpl and not re.search(r'[0-9a-f]{8}-[0-9a-f]{4}-', dtpl)
dtpl, usadas = sem_subsets_inuteis(dtpl, fontes_demo)
for rel in usadas:
    grava('demo/' + rel, fontes_demo[rel])
grava('demo/index.html', dtpl)

# ---------------------------------------------------------------- página de vendas
NOMES = {'d958af28': 'dc-runtime.js', '2902b188': 'react.production.min.js',
         '8180a679': 'react-dom.production.min.js', '363977ec': 'marca.js'}
# ds-bundle (namespace vazio) e o scaffold <image-slot> (nenhum na página): 65 KB que só atrasavam
DESCARTA = {'8a5c573b', '35636323'}
fontes = {}
for uid, (mime, b) in rec.items():
    curto = uid[:8]
    if uid == demo_uid:
        tpl = re.sub(r'about:blank#' + uid + r'(#[^"]*)?', lambda m: 'demo/index.html' + (m.group(1) or ''), tpl)
    elif curto in DESCARTA:
        tpl = re.sub(r'\s*<script src="' + uid + r'"></script>', '', tpl)
    elif mime == 'font/woff2':
        fontes[f'assets/fontes/{curto}.woff2'] = b
        tpl = tpl.replace(uid, f'assets/fontes/{curto}.woff2')
    elif mime == 'image/svg+xml':
        grava('assets/favicon.svg', b)
        tpl = tpl.replace(uid, 'assets/favicon.svg')
    else:
        if NOMES[curto] == 'marca.js':
            # marca.js roda no meio do parse e desenhava o logo DENTRO do <x-dc> cru; o runtime copiava esse
            # desenho como se fosse template e o elemento ainda desenhava outro → logo duplicado. Molde não se pinta.
            b = troca(b.decode('utf-8'),
                      "connectedCallback() { base(this); render(this); }\n      attributeChangedCallback() { if (this.isConnected) render(this); }",
                      "connectedCallback() { if (this.closest('x-dc')) return; base(this); render(this); }\n      attributeChangedCallback() { if (this.isConnected && !this.closest('x-dc')) render(this); }").encode('utf-8')
        grava('assets/js/' + NOMES[curto], b)
        tpl = tpl.replace(uid, 'assets/js/' + NOMES[curto])
assert not re.search(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-', tpl), 'sobrou uuid na página'
tpl, usadas = sem_subsets_inuteis(tpl, fontes)
for rel in usadas:
    grava(rel, fontes[rel])

# decisões já tomadas sobre o conteúdo (valem também para uma exportação nova do designer)
tpl = re.sub(r'(&quot;teste&quot;:\{[^}]*?&quot;default&quot;:)true', r'\1false', tpl)  # modo garantia, sem "teste grátis"
tpl = re.sub(r'\s*<span [^<>]*>UpToDate</span>', '', tpl)                                   # não citar UpToDate
assert 'UpToDate' not in tpl

# bug do original: iframe ainda não carregado era apontado para "app/index.html", que não existe
tpl = troca(tpl, "f.setAttribute('src', 'app/index.html' + hash);", "f.setAttribute('src', 'demo/index.html' + hash);")

# título/descrição/prévia saem do <helmet> (montado por JS) e vão para o <head> estático
helmet_meta = re.search(r'<helmet>\s*(.*?)\s*<style>', tpl, re.S).group(1)
tpl = troca(tpl, helmet_meta, '')
titulo = re.search(r'<title>(.*?)</title>', helmet_meta).group(1)
desc = re.search(r'name="description" content="([^"]*)"', helmet_meta).group(1)
og_t = re.search(r'property="og:title" content="([^"]*)"', helmet_meta).group(1)
react = {r['id']: 'assets/js/' + NOMES[r['uuid'][:8]] for r in ext}
head = f'''<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0A0F1F">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}/">
<meta property="og:title" content="{og_t}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<!-- React baixa junto com o runtime, em vez de só depois dele -->
<link rel="preload" href="assets/js/react.production.min.js" as="script">
<link rel="preload" href="assets/js/react-dom.production.min.js" as="script">
<script>window.__resources = {json.dumps(react)};</script>
<script src="assets/js/dc-runtime.js"></script>
</head>'''
tpl = re.sub(r'<html>\s*<head>.*?</head>', lambda m: '<html lang="pt-BR">\n' + head, tpl, count=1, flags=re.S)
assert '<html lang="pt-BR">' in tpl and 'dc-runtime.js' in tpl
grava('index.html', tpl)

tam = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(DESTINO) for f in fs)
print(f'ok: {sum(len(fs) for _, _, fs in os.walk(DESTINO))} arquivos, {tam // 1024} KB; '
      f'index.html {len(tpl.encode()) // 1024} KB; demo/index.html {len(dtpl.encode()) // 1024} KB')
