# MedAtalho — site de vendas

Página de vendas publicada em https://medatalho.com (GitHub Pages + Cloudflare).

- `index.html`: a página. É montada no navegador pelo `assets/js/dc-runtime.js` (React) a partir do `<x-dc>`.
- `assets/`: scripts, fontes, favicon e `og.jpg` (prévia do link no WhatsApp/redes).
- `demo/`: o app que aparece dentro das telas de demonstração (iframes).
- `scripts/desempacota.py`: gera tudo acima a partir do HTML exportado pelo designer.
- `CNAME`: domínio. `robots.txt` + meta `noindex`: fora dos buscadores até o lançamento.

## Página nova do designer

O designer exporta um HTML "empacotado" (tudo em base64 dentro de um arquivo, com tela de espera).
Não publique esse arquivo direto: desempacote.

```sh
python3 scripts/desempacota.py ~/Downloads/"Pagina de Venda.html" .
```

O script para com erro se a exportação mudar de um jeito que ele não conhece, em vez de publicar quebrado.
