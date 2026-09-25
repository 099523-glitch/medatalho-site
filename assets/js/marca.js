/* MedAtalho — peças da marca como elementos: <ma-simbolo>, <ma-logo>, <ma-icone>, <ma-traco> */
(function () {
  if (window.__maMarca) return; window.__maMarca = 1;
  var n = 0;
  function simbolo(s, cor, peso) {
    var id = 'maM' + (++n), w = peso || 4.6;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 48 48" aria-hidden="true" style="display:block;overflow:visible;color:' + cor + '">' +
      '<mask id="' + id + '" maskUnits="userSpaceOnUse" x="-4" y="-4" width="56" height="56"><rect x="-4" y="-4" width="56" height="56" fill="#fff"/>' +
      '<path d="M22 28H37" stroke="#000" stroke-width="' + (w + 5.4) + '"/></mask>' +
      '<g fill="none" stroke="currentColor" stroke-width="' + w + '" stroke-linecap="round">' +
      '<path d="M2.5 40H8L21 7L34 40" stroke-linejoin="miter" stroke-miterlimit="10" mask="url(#' + id + ')"/>' +
      '<path d="M12.7 28H44.5" stroke-linejoin="round"/><path d="M39 22.5L44.5 28L39 33.5" stroke-linejoin="round"/></g></svg>';
  }
  function base(el) { el.style.display = 'inline-flex'; el.style.flexShrink = '0'; el.style.lineHeight = '0'; el.style.alignItems = 'center'; }
  function box(el) { if (!el._b || el._b.parentNode !== el) { el._b = document.createElement('span'); el._b.style.cssText = 'display:inline-flex;align-items:center;line-height:0'; el.appendChild(el._b); } return el._b; }
  function def(tag, render, attrs) {
    if (customElements.get(tag)) return;
    customElements.define(tag, class extends HTMLElement {
      static get observedAttributes() { return attrs; }
      connectedCallback() { if (this.closest('x-dc')) return; base(this); render(this); }
      attributeChangedCallback() { if (this.isConnected && !this.closest('x-dc')) render(this); }
    });
  }
  function a(el, k, d) { var v = el.getAttribute(k); return v == null || v === '' ? d : v; }

  def('ma-simbolo', function (el) {
    box(el).innerHTML = simbolo(+a(el, 'size', 48), a(el, 'color', 'currentColor'), +a(el, 'weight', 4.6));
  }, ['size', 'color', 'weight']);

  def('ma-logo', function (el) {
    var s = +a(el, 'size', 48), sc = a(el, 'symbol-color', '#0038E5'), tc = a(el, 'text-color', '#1E2740');
    box(el).style.gap = (s * .24) + 'px';
    box(el).innerHTML = simbolo(s, sc) + '<span style="font:800 ' + (s * .74) + 'px/1 Manrope,Inter,sans-serif;letter-spacing:-.04em;color:' + tc + ';white-space:nowrap;padding-top:' + (s * .04) + 'px">MedAtalho</span>';
  }, ['size', 'symbol-color', 'text-color']);

  def('ma-icone', function (el) {
    var s = +a(el, 'size', 96), bg = a(el, 'bg', '#0038E5'), fg = a(el, 'fg', '#FFFFFF'), r = a(el, 'radius', '22.37%'), k = +a(el, 'scale', .62);
    var shadow = a(el, 'shadow', '');
    box(el).innerHTML = '<span style="width:' + s + 'px;height:' + s + 'px;border-radius:' + r + ';background:' + bg + ';display:flex;align-items:center;justify-content:center;' + (shadow ? 'box-shadow:' + shadow + ';' : '') + '">' + simbolo(Math.round(s * k), fg, +a(el, 'weight', 4.6)) + '</span>';
  }, ['size', 'bg', 'fg', 'radius', 'scale', 'shadow', 'weight']);

  /* o traçado: linha de base, um pico em A e a barra que corta caminho */
  def('ma-traco', function (el) {
    var w = +a(el, 'width', 600), c = a(el, 'color', '#0038E5'), sw = +a(el, 'weight', 3), op = a(el, 'opacity', 1), at = +a(el, 'at', .42);
    var h = 60, x = Math.round(w * at), id = 'maT' + (++n);
    box(el).innerHTML = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true" style="display:block;opacity:' + op + '">' +
      '<mask id="' + id + '" maskUnits="userSpaceOnUse" x="0" y="0" width="' + w + '" height="' + h + '"><rect width="' + w + '" height="' + h + '" fill="#fff"/><path d="M' + (x + 20) + ' 31H' + (x + 33) + '" stroke="#000" stroke-width="' + (sw * 3.2) + '"/></mask>' +
      '<g fill="none" stroke="' + c + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' +
      '<path mask="url(#' + id + ')" d="M0 50H' + (x - 34) + 'L' + (x - 28) + ' 43L' + (x - 22) + ' 50H' + x + 'L' + (x + 17) + ' 8L' + (x + 34) + ' 50H' + (x + 60) + 'L' + (x + 66) + ' 44L' + (x + 74) + ' 50H' + w + '"/>' +
      '<path d="M' + (x + 8.5) + ' 31H' + (x + 60) + '"/><path d="M' + (x + 54) + ' 25L' + (x + 60) + ' 31L' + (x + 54) + ' 37"/></g></svg>';
  }, ['width', 'color', 'weight', 'opacity', 'at']);

  /* traçado contínuo do carrossel: um só caminho atravessa N slides; cada slide mostra a sua janela */
  def('ma-ecg', function (el) {
    var i = +a(el, 'slide', 1) - 1, N = +a(el, 'total', 10), W = +a(el, 'width', 540), H = 120, B = 90,
        c = a(el, 'color', '#FFFFFF'), sw = +a(el, 'weight', 2), op = a(el, 'opacity', 1), id = 'maE' + (++n);
    var x0 = +a(el, 'start', 132), ax = (N - 1) * W + +a(el, 'end', 286), h = +a(el, 'peak', 58), k = h / 33;
    var pos = [170, 150, 110, 160, 120, 150, 110, 160, 250];
    var d = 'M' + x0 + ' ' + B;
    for (var s = 0; s < N - 1; s++) {
      var x = s * W + pos[s % pos.length];
      d += 'H' + (x - 14) + 'L' + (x - 10) + ' ' + (B - 4) + 'L' + (x - 6) + ' ' + B + 'H' + (x - 2) + 'L' + x + ' ' + (B + 3) + 'L' + (x + 5) + ' ' + (B - 17) + 'L' + (x + 10) + ' ' + (B + 5) + 'L' + (x + 13) + ' ' + B + 'H' + (x + 24) + 'L' + (x + 29) + ' ' + (B - 5) + 'L' + (x + 34) + ' ' + B;
    }
    var P = ax + 13 * k, R = ax + 26 * k, by = B - 12 * k, lx = ax + 4.727 * k, tip = ax + 36.5 * k, hd = 5.5 * k, rx = R - 4.727 * k, TW = N * W;
    d += 'H' + ax + 'L' + P + ' ' + (B - h) + 'L' + R + ' ' + B;
    box(el).innerHTML = '<svg width="' + W + '" height="' + H + '" viewBox="' + (i * W) + ' 0 ' + W + ' ' + H + '" aria-hidden="true" style="display:block;opacity:' + op + '">' +
      '<mask id="' + id + '" maskUnits="userSpaceOnUse" x="0" y="0" width="' + TW + '" height="' + H + '"><rect width="' + TW + '" height="' + H + '" fill="#fff"/><path d="M' + (rx - 8) + ' ' + by + 'H' + (rx + 8) + '" stroke="#000" stroke-width="' + (sw * 4) + '"/></mask>' +
      '<g fill="none" stroke="' + c + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="' + x0 + '" cy="' + B + '" r="' + (sw * 2.2) + '" fill="' + c + '" stroke="none"/>' +
      '<path mask="url(#' + id + ')" d="' + d + '"/>' +
      '<path d="M' + lx + ' ' + by + 'H' + tip + '"/><path d="M' + (tip - hd) + ' ' + (by - hd) + 'L' + tip + ' ' + by + 'L' + (tip - hd) + ' ' + (by + hd) + '"/></g></svg>';
  }, ['slide', 'total', 'width', 'color', 'weight', 'opacity', 'start', 'end', 'peak']);
})();
