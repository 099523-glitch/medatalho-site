/* ===========================================================
   CASCA DO APLICATIVO
   Peso do paciente, painel de ajustes, backup das edicoes,
   gaveta do sumario e barra inferior. Roda depois do app.js.
   =========================================================== */
(function () {
  'use strict';

  var UI = {};

  /* preenche os marcadores data-ico do HTML com os SVG */
  [].forEach.call(document.querySelectorAll('[data-ico]'), function (el) {
    el.innerHTML = window.ICO ? ICO(el.dataset.ico) : '';
  });
  [['btnMenu','menu'],['btnSideX','fechar'],['btnAjustes','engren'],
   ['btnAjustesX','fechar'],['btnBuscaX','fechar'],
   ['btnBancX','fechar'],['btnBancTop','lapis']].forEach(function (par) {
    var el = document.getElementById(par[0]);
    if (el && window.ICO) el.innerHTML = ICO(par[1]);
  });
  var doc  = document.getElementById('doc');
  var side = document.getElementById('side');
  var veu  = document.getElementById('veu');

  function $(id) { return document.getElementById(id); }
  function ler(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function grava(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- aviso flutuante (o mesmo das Ferramentas) ---------- */
  var caixaAviso;
  UI.aviso = function (msg, ruim) {
    if (!caixaAviso) {
      caixaAviso = document.createElement('div');
      caixaAviso.className = 'ferr-toast';
      document.body.appendChild(caixaAviso);
    }
    caixaAviso.textContent = msg;
    caixaAviso.className = 'ferr-toast ' + (ruim ? 'ruim ' : '') + 'vivo';
    clearTimeout(caixaAviso._t);
    caixaAviso._t = setTimeout(function () { caixaAviso.className = 'ferr-toast'; }, 1900);
  };

  /* =========================================================
     PESO DO PACIENTE — resolve as doses por quilo
     ========================================================= */
  var campoPeso = $('peso');
  var UNI = { mg:1, mcg:1, g:1, ml:1, ui:1, u:1 };
  /* "10 mg/kg", "0,1 a 0,15 mg/kg", "30 mL/kg", "0,01 mg/kg/dose" */
  var RE_KG = /(\d+(?:[.,]\d+)?)(?:\s*(?:a|-|–|até)\s*(\d+(?:[.,]\d+)?))?\s*(mg|mcg|g|mL|ml|UI|U)\s*\/\s*kg/gi;

  function peso() {
    var v = parseFloat(String(campoPeso.value).replace(',', '.'));
    return (v > 0 && v <= 300) ? v : null;
  }
  function fmt(n) {
    var r = Math.round(n * 100) / 100;
    return String(r).replace('.', ',');
  }

  /* percorre os textos da tela e anota a dose calculada ao lado do mg/kg */
  function aplicaPeso() {
    limpaPeso();
    var kg = peso();
    if (!kg || !doc) return;

    var anda = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.length < 4) return NodeFilter.FILTER_REJECT;
        var pai = n.parentNode;
        if (!pai || pai.closest('.peso-calc, input, textarea, select, .ferr-saida, .pd-med, .bzf, .dz2-card, .pd3')) return NodeFilter.FILTER_REJECT;
        RE_KG.lastIndex = 0;
        return RE_KG.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    var alvos = [], n;
    while ((n = anda.nextNode())) alvos.push(n);

    alvos.forEach(function (no) {
      var txt = no.nodeValue, frag = document.createDocumentFragment(), fim = 0;
      RE_KG.lastIndex = 0;
      var m;
      while ((m = RE_KG.exec(txt))) {
        frag.appendChild(document.createTextNode(txt.slice(fim, m.index + m[0].length)));
        var uni = m[3].toLowerCase() === 'ml' ? 'mL' : m[3];
        if (UNI[m[3].toLowerCase()]) {
          var a = parseFloat(m[1].replace(',', '.')) * kg;
          var b = m[2] ? parseFloat(m[2].replace(',', '.')) * kg : null;
          var marca = document.createElement('span');
          marca.className = 'peso-calc';
          marca.textContent = '= ' + fmt(a) + (b ? ' a ' + fmt(b) : '') + ' ' + uni;
          marca.title = 'Calculado para ' + fmt(kg) + ' kg';
          frag.appendChild(marca);
        }
        fim = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(txt.slice(fim)));
      no.parentNode.replaceChild(frag, no);
    });

    document.body.classList.add('com-peso');
  }

  function limpaPeso() {
    if (!doc) return;
    document.body.classList.remove('com-peso');
    var marcas = doc.querySelectorAll('.peso-calc');
    for (var i = 0; i < marcas.length; i++) {
      var m = marcas[i], pai = m.parentNode;
      m.remove();
      if (pai) pai.normalize();
    }
  }

  campoPeso.value = ler('peso', '') || '';
  campoPeso.addEventListener('input', function () {
    grava('peso', campoPeso.value);
    campoPeso.classList.toggle('ativo', !!peso());
    aplicaPeso();
  });
  campoPeso.classList.toggle('ativo', !!peso());

  /* o app redesenha o miolo o tempo todo: reaplica depois de cada troca */
  var obs = new MutationObserver(function () {
    if (obs._t) return;
    obs._t = setTimeout(function () { obs._t = null; aplicaPeso(); }, 60);
  });
  if (doc) obs.observe(doc, { childList: true, subtree: true });
  aplicaPeso();

  /* =========================================================
     GAVETA DO SUMARIO (celular) E PAINEL DE AJUSTES
     ========================================================= */
  /* Gaveta e painel se comportam como diálogo modal: enquanto abertos,
     o foco fica preso dentro, o resto da página sai da ordem de tabulação
     e o foco volta para quem abriu. */
  var painelAberto = null;      /* elemento do diálogo em foco */
  var quemAbriu = null;         /* para devolver o foco ao fechar */
  var FORA = ['header.topo', '.abas-topo', '.tabbar', '#doc', 'footer'];

  function focaveis(raiz) {
    return [].slice.call(raiz.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]),' +
      'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      return el.offsetWidth || el.offsetHeight || el.getClientRects().length;
    });
  }
  /* tira o conteudo encoberto da ordem de tabulacao e dos leitores de tela */
  function escondeFundo(esconder) {
    FORA.forEach(function (sel) {
      [].forEach.call(document.querySelectorAll(sel), function (el) {
        if (esconder) { el.setAttribute('aria-hidden', 'true'); el.inert = true; }
        else { el.removeAttribute('aria-hidden'); el.inert = false; }
      });
    });
  }
  function prendeFoco(e) {
    if (e.key !== 'Tab' || !painelAberto) return;
    var lista = focaveis(painelAberto);
    if (!lista.length) { e.preventDefault(); return; }
    var primeiro = lista[0], ultimo = lista[lista.length - 1];
    if (!painelAberto.contains(document.activeElement)) {
      e.preventDefault(); primeiro.focus(); return;
    }
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  }

  function abre(qual) {
    quemAbriu = document.activeElement;
    var fechar;
    if (qual === 'side') {
      side.classList.add('aberta');
      side.setAttribute('role', 'dialog');
      side.setAttribute('aria-modal', 'true');
      side.setAttribute('aria-label', 'Sumário');
      $('btnMenu').setAttribute('aria-expanded', 'true');
      painelAberto = side; fechar = $('btnSideX');
    }
    if (qual === 'ajustes') {
      $('ajustes').hidden = false; contaEdicoes();
      $('ajustes').setAttribute('role', 'dialog');
      $('ajustes').setAttribute('aria-modal', 'true');
      $('btnAjustes').setAttribute('aria-expanded', 'true');
      painelAberto = $('ajustes'); fechar = $('btnAjustesX');
    }
    veu.hidden = false;
    document.body.classList.add('travado');
    escondeFundo(true);
    document.addEventListener('keydown', prendeFoco, true);
    /* foco inicial no botao de fechar, como manda o padrao de dialogo */
    if (fechar) setTimeout(function () { fechar.focus(); }, 30);
  }
  /* o mesmo botao abre e fecha */
  function alterna(qual) {
    var aberto = qual === 'side' ? side.classList.contains('aberta') : !$('ajustes').hidden;
    if (aberto) fecha(); else { fecha(); abre(qual); }
  }
  function fecha() {
    var tinha = painelAberto;
    side.classList.remove('aberta');
    side.removeAttribute('role'); side.removeAttribute('aria-modal');
    $('btnMenu').setAttribute('aria-expanded', 'false');
    $('btnAjustes').setAttribute('aria-expanded', 'false');
    $('ajustes').hidden = true;
    $('ajustes').removeAttribute('role'); $('ajustes').removeAttribute('aria-modal');
    veu.hidden = true;
    document.body.classList.remove('travado');
    escondeFundo(false);
    document.removeEventListener('keydown', prendeFoco, true);
    painelAberto = null;
    if (tinha && quemAbriu && document.contains(quemAbriu)) { quemAbriu.focus(); }
    quemAbriu = null;
  }
  UI.fecha = fecha;
  UI.abreAjustes = function () { fecha(); location.hash = '#ajustes'; };

  $('btnMenu').addEventListener('click', function () { alterna('side'); });
  $('btnSideX').addEventListener('click', fecha);
  /* configurações agora são uma página inteira (#ajustes) */
  $('btnAjustes').addEventListener('click', function () { fecha(); location.hash = '#ajustes'; });
  $('btnAjustesX').addEventListener('click', fecha);
  veu.addEventListener('click', fecha);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecha(); });
  /* tocar num link do sumario fecha a gaveta — menos quando o clique
     so abriu ou fechou uma area (aí o app.js cancela o link) */
  side.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    if (e.target.closest('a')) fecha();
  });

  /* =========================================================
     PREFERENCIAS
     ========================================================= */
  function pref(chave, padrao) {
    var v = ler('pref:' + chave, null);
    return v === null ? padrao : v;
  }
  function liga(id, chave, padrao) {
    var el = $(id);
    el.checked = pref(chave, padrao);
    el.addEventListener('change', function () {
      grava('pref:' + chave, el.checked);
      if (window.Guia) Guia.prefMudou();
      UI.aviso(el.checked ? 'Ligado' : 'Desligado');
    });
  }
  function pintaAutor() { document.body.classList.toggle('autor', pref('autor', false)); }
  liga('optAutor', 'autor', false);
  $('optAutor').addEventListener('change', pintaAutor);
  pintaAutor();
  /* o antigo "abrir em resumo" agora aplica o preset do filtro de blocos:
     um interruptor só, sem uma segunda camada de estado escondida */
  liga('optResumo', 'resumo', false);
  $('optResumo').addEventListener('change', function () {
    if (window.Guia && Guia.presetBlocos) Guia.presetBlocos(this.checked);
  });
  liga('optConferir', 'conferir', false);
  function pintaRx() { document.body.classList.toggle('rx-ajustes', pref('rx-ajustes', false)); }
  liga('optRxAjustes', 'rx-ajustes', false);
  $('optRxAjustes').addEventListener('change', pintaRx);
  pintaRx();

  /* responsável técnico: registrado, some o aviso de conteúdo não validado */
  var campoResp = $('optResponsavel');
  function pintaResp() {
    var d = pref('responsavel-data', '');
    var el = $('respData');
    if (el) el.textContent = campoResp.value.trim() ? ('Registrado em ' + d + '. O aviso deixa de aparecer nas condutas.') : '';
  }
  if (campoResp) {
    campoResp.value = pref('responsavel', '');
    pintaResp();
    campoResp.addEventListener('change', function () {
      var v = campoResp.value.trim();
      grava('pref:responsavel', v);
      grava('pref:responsavel-data', v ? new Date().toLocaleDateString('pt-BR') : '');
      pintaResp();
      if (window.Guia) Guia.prefMudou();
    });
  }

  /* nome do médico: aparece na saudação da home */
  var campoNome = $('optNome');
  campoNome.value = pref('nome', '');
  campoNome.addEventListener('change', function () {
    grava('pref:nome', campoNome.value.trim());
    if (window.Guia) Guia.prefMudou();
  });

  /* =========================================================
     BACKUP DAS EDICOES
     ========================================================= */
  var PREFIXOS = ['ferr:', 'pref:', 'favoritas', 'recentes', 'tema', 'peso'];
  function minhasChaves() {
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      for (var j = 0; j < PREFIXOS.length; j++) {
        if (k === PREFIXOS[j] || k.indexOf(PREFIXOS[j]) === 0) { out.push(k); break; }
      }
    }
    return out;
  }
  function contaEdicoes() {
    var n = minhasChaves().filter(function (k) { return k.indexOf('ferr:') === 0; }).length;
    $('contaEdicoes').textContent = n
      ? n + (n === 1 ? ' item editado neste aparelho.' : ' itens editados neste aparelho.')
      : 'Nada editado ainda — você está no conteúdo padrão.';
  }

  $('btnExportar').addEventListener('click', function () {
    var dados = {};
    minhasChaves().forEach(function (k) { dados[k] = localStorage.getItem(k); });
    var pacote = {
      arquivo: 'guia-de-plantao/backup',
      versao: 1,
      data: new Date().toISOString(),
      itens: dados
    };
    var d = new Date();
    var nome = 'medatalho-backup-' + d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '.json';
    var blob = new Blob([JSON.stringify(pacote, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    UI.aviso('Backup salvo em ' + nome);
  });

  $('btnImportar').addEventListener('click', function () { $('arqImportar').click(); });
  $('arqImportar').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    var leitor = new FileReader();
    leitor.onload = function () {
      var p;
      try { p = JSON.parse(leitor.result); } catch (err) { p = null; }
      if (!p || p.arquivo !== 'guia-de-plantao/backup' || !p.itens) {
        UI.aviso('Arquivo não reconhecido', true);
        return;
      }
      var n = Object.keys(p.itens).length;
      var quando = p.data ? new Date(p.data).toLocaleString('pt-BR') : 'data desconhecida';
      if (!confirm('Importar ' + n + ' itens do backup de ' + quando +
                   '?\n\nIsso substitui o que você tem neste aparelho.')) return;
      minhasChaves().forEach(function (k) { localStorage.removeItem(k); });
      Object.keys(p.itens).forEach(function (k) {
        try { localStorage.setItem(k, p.itens[k]); } catch (err) {}
      });
      UI.aviso('Backup importado — recarregando');
      setTimeout(function () { location.reload(); }, 700);
    };
    leitor.readAsText(f);
    e.target.value = '';
  });

  $('btnZerar').addEventListener('click', function () {
    if (!confirm('Apagar TODAS as suas edições, favoritas e preferências deste aparelho?\n\n' +
                 'O conteúdo padrão do guia volta ao normal. Não dá para desfazer — ' +
                 'exporte um backup antes se tiver dúvida.')) return;
    minhasChaves().forEach(function (k) { localStorage.removeItem(k); });
    location.reload();
  });

  /* =========================================================
     BARRA INFERIOR — marca onde estamos
     ========================================================= */
  var abas = [].slice.call(document.querySelectorAll('.tabbar a'));
  var btnMais = $('btnMais');
  if (btnMais) btnMais.addEventListener('click', function () { alterna('side'); });
  function pintaBarra() {
    var h = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    var atual = 'home';
    if (h.indexOf('doses') === 0) atual = 'doses';
    else if (h.indexOf('presc') === 0 || h.indexOf('atb') === 0) atual = 'presc';
    else if (h) atual = 'guia';
    abas.forEach(function (a) {
      var on = a.dataset.nav === atual;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', pintaBarra);
  pintaBarra();

  /* =========================================================
     BUSCA: botao de limpar e atalho de teclado
     ========================================================= */
  var busca = $('busca');
  var btnX = $('btnBuscaX');
  function pintaX() { btnX.hidden = !busca.value; }
  busca.addEventListener('input', pintaX);
  btnX.addEventListener('click', function () {
    if (window.Guia) Guia.limpaBusca();
    pintaX();
    busca.focus();
  });
  pintaX();

  /* =========================================================
     CELULAR: placeholder curto e peso como ação secundária
     ========================================================= */
  var LONGO = busca.getAttribute('placeholder');
  var estreito = window.matchMedia('(max-width: 420px)');
  var btnPeso  = $('btnPeso');
  var pesoBox  = $('pesoCampo');

  function pintaPeso() {
    var v = campoPeso.value;
    /* o botão mostra o número quando já há peso, para não esconder o dado */
    btnPeso.innerHTML = (v ? '<b>' + v + '</b><i>kg</i>' : (window.ICO ? ICO('peso') : ''));
    btnPeso.classList.toggle('com-valor', !!v);
    btnPeso.setAttribute('title', v ? 'Peso: ' + v + ' kg' : 'Informar o peso do paciente');
  }
  function aplicaEstreito(e) {
    var min = e.matches;
    busca.setAttribute('placeholder', min ? 'Buscar…' : LONGO);
    document.body.classList.toggle('estreito', min);
    if (!min) { pesoBox.classList.remove('solto'); btnPeso.setAttribute('aria-expanded', 'false'); }
    pintaPeso();
  }
  if (estreito.addEventListener) estreito.addEventListener('change', aplicaEstreito);
  else estreito.addListener(aplicaEstreito);
  aplicaEstreito(estreito);

  btnPeso.addEventListener('click', function () {
    var abrindo = !pesoBox.classList.contains('solto');
    pesoBox.classList.toggle('solto', abrindo);
    btnPeso.setAttribute('aria-expanded', abrindo ? 'true' : 'false');
    if (abrindo) campoPeso.focus();
  });
  campoPeso.addEventListener('input', pintaPeso);
  campoPeso.addEventListener('blur', function () {
    if (document.body.classList.contains('estreito')) {
      pesoBox.classList.remove('solto');
      btnPeso.setAttribute('aria-expanded', 'false');
    }
  });

  /* =========================================================
     AVISO DE VERSÃO NOVA (service worker)
     ========================================================= */
  UI.avisoAtualizacao = function (aoAceitar) {
    if (document.getElementById('avisoSW')) return;
    var d = document.createElement('div');
    d.id = 'avisoSW';
    d.className = 'aviso-sw';
    d.setAttribute('role', 'status');
    d.innerHTML = '<span>Há uma versão nova do guia.</span>' +
      '<button type="button" class="ferr-btn peq forte" id="swAtualiza">Atualizar</button>' +
      '<button type="button" class="ferr-btn peq" id="swDepois">Depois</button>';
    document.body.appendChild(d);
    document.getElementById('swAtualiza').addEventListener('click', aoAceitar);
    document.getElementById('swDepois').addEventListener('click', function () { d.remove(); });
  };

  /* estado da rede, para o usuário saber que está no cache */
  function pintaRede() { document.body.classList.toggle('offline', !navigator.onLine); }
  window.addEventListener('online', pintaRede);
  window.addEventListener('offline', pintaRede);
  pintaRede();

  /* =========================================================
     ÁREA DE ESCRITA — painel fixo à direita, recolhível
     ========================================================= */
  var bancAba = $('btnBanc'), bancTop = $('btnBancTop');
  function bancAberta() { return document.body.classList.contains('com-banc'); }
  function pintaAba() {
    var ab = bancAberta();
    bancAba.setAttribute('aria-expanded', ab ? 'true' : 'false');
    bancAba.hidden = ab;
    bancTop.setAttribute('aria-expanded', ab ? 'true' : 'false');
    bancTop.setAttribute('aria-label', (ab ? 'Fechar' : 'Abrir') + ' o rascunho');
    bancTop.setAttribute('title', (ab ? 'Fechar' : 'Abrir') + ' o rascunho');
    bancTop.classList.toggle('on', ab);
  }
  UI.abreBancada = function () {
    document.body.classList.add('com-banc');
    grava('pref:banc', true); pintaAba();
  };
  UI.fechaBancada = function () {
    document.body.classList.remove('com-banc');
    grava('pref:banc', false); pintaAba();
  };
  /* o mesmo botão abre e fecha, de qualquer tela */
  UI.alternaBancada = function () {
    if (bancAberta()) UI.fechaBancada(); else UI.abreBancada();
  };
  /* largura ajustável: arrastar a borda, ou setas com o foco na alça */
  var LARG_MIN = 280, LARG_MAX = 760;
  function aplicaLargura(px) {
    px = Math.max(LARG_MIN, Math.min(LARG_MAX, Math.round(px)));
    document.documentElement.style.setProperty('--banc-w', px + 'px');
    grava('pref:banc-w', px);
    return px;
  }
  aplicaLargura(+ler('pref:banc-w', 340) || 340);

  var alca = $('bancAlca'), arrastando = false;
  alca.addEventListener('pointerdown', function (e) {
    arrastando = true;
    alca.setPointerCapture(e.pointerId);
    document.body.classList.add('redimensionando');
    e.preventDefault();
  });
  alca.addEventListener('pointermove', function (e) {
    if (!arrastando) return;
    aplicaLargura(window.innerWidth - e.clientX);
  });
  function soltou(e) {
    if (!arrastando) return;
    arrastando = false;
    try { alca.releasePointerCapture(e.pointerId); } catch (err) {}
    document.body.classList.remove('redimensionando');
  }
  alca.addEventListener('pointerup', soltou);
  alca.addEventListener('pointercancel', soltou);
  alca.addEventListener('dblclick', function () { aplicaLargura(340); });
  alca.addEventListener('keydown', function (e) {
    var atual = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--banc-w'), 10) || 340;
    if (e.key === 'ArrowLeft')  { aplicaLargura(atual + 24); e.preventDefault(); }
    if (e.key === 'ArrowRight') { aplicaLargura(atual - 24); e.preventDefault(); }
    if (e.key === 'Home')       { aplicaLargura(340); e.preventDefault(); }
  });

  bancAba.addEventListener('click', UI.abreBancada);
  bancTop.addEventListener('click', UI.alternaBancada);
  $('btnBancX').addEventListener('click', function () {
    UI.fechaBancada(); bancTop.focus();
  });
  if (ler('pref:banc', false)) document.body.classList.add('com-banc');
  pintaAba();
  if (window.Ferramentas && Ferramentas.iniciaBancada) Ferramentas.iniciaBancada();

  /* uma região só, para tudo que acontece sem mudar de tela */
  var viva = $('aviva');
  UI.anuncia = function (txt) {
    if (!viva || !txt) return;
    /* limpar antes força o leitor a reler quando a mensagem se repete */
    viva.textContent = '';
    setTimeout(function () { viva.textContent = txt; }, 40);
  };

  /* aviso de primeira visita: quem recebe o link precisa saber o que é */
  (function () {
    var cx = $('primeira');
    if (!cx || ler('pref:avisado', false)) return;
    cx.hidden = false;
    document.body.classList.add('travado');
    $('primeiraOk').focus();
    $('primeiraOk').addEventListener('click', function () {
      grava('pref:avisado', true);
      cx.hidden = true;
      document.body.classList.remove('travado');
    });
  })();

  window.UI = UI;
})();
