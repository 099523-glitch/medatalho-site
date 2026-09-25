/* ===========================================================
   FERRAMENTAS DO PLANTAO — motor
   Renderiza a aba "Ferramentas" dentro do guia. O conteudo vem
   de js/ferramentas-dados.js; o que o usuario edita fica no
   aparelho (localStorage, prefixo "ferr:") e vence o padrao.
   Nao depende do app.js: expoe window.Ferramentas.
   =========================================================== */
(function () {
  'use strict';

  var F = {};

  /* ---------- guarda no aparelho ---------- */
  /* o padrao SEMPRE sai clonado: sem isso, editar a lista mexeria no
     array de ferramentas-dados.js e "Restaurar padrao" nao restauraria nada */
  function clonar(x) {
    return (x && typeof x === 'object') ? JSON.parse(JSON.stringify(x)) : x;
  }
  function ler(chave, padrao) {
    try {
      var v = localStorage.getItem(chave);
      return v === null ? clonar(padrao) : JSON.parse(v);
    } catch (e) { return clonar(padrao); }
  }
  function grava(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* modo privado */ }
  }
  function apaga(chave) {
    try { localStorage.removeItem(chave); } catch (e) { /* modo privado */ }
  }

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function hora() {
    var d = new Date();
    return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' +
           (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }
  function dataHoje() { return new Date().toLocaleDateString('pt-BR'); }
  function marcas(t) {
    return String(t || '').replace(/\{HORA\}/g, hora()).replace(/\{DATA\}/g, dataHoje());
  }
  /* mesma preferência do painel de ajustes do app.js */
  function modoAutor() {
    try { return JSON.parse(localStorage.getItem('pref:autor')) === true; } catch (e) { return false; }
  }
  function idNovo(p) { return p + '-' + Date.now().toString(36) + Math.floor(Math.random() * 1e3); }
  function num(v) { var n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; }

  /* ---------- copiar + aviso ---------- */
  var aviso;
  function toast(msg, ruim) {
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'ferr-toast';
      document.body.appendChild(aviso);
    }
    aviso.textContent = msg;
    aviso.className = 'ferr-toast ' + (ruim ? 'ruim ' : '') + 'vivo';
    if (window.UI && UI.anuncia) UI.anuncia(msg);
    clearTimeout(aviso._t);
    aviso._t = setTimeout(function () { aviso.className = 'ferr-toast'; }, 1900);
  }
  function copiar(txt, oque) {
    var t = marcas(txt);
    function ok() { toast((oque || 'Texto') + ' copiado'); }
    function falhou() { toast('Não consegui copiar — selecione e copie na mão', true); }
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(t).then(ok, function () { velho(t) ? ok() : falhou(); });
    } else {
      velho(t) ? ok() : falhou();
    }
    return t;
  }
  /* =========================================================
     CONFERÊNCIA ANTES DE COPIAR
     Prescrição e antibiótico passam por um checklist curto. O que o
     app já sabe (peso, idade) entra pré-preenchido no texto do item.
     Desligável em Ajustes; ligado por padrão.
     ========================================================= */
  /* opt-in: por padrão a cópia é direta, sem passo extra */
  function conferenciaLigada() { return !!ler('pref:conferir', false); }
  function contexto() {
    var el = document.getElementById('peso');
    var kg = el && el.value ? el.value : null;
    var im = ler('ferr:pedia-idade', '');
    var idade = im === '' ? null : im;
    return { kg:kg, idade:idade };
  }
  function itensConferencia(tipo) {
    var c = contexto();
    var l = [
      { k:'pop', t:'É adulto ou pediátrico?' +
          (c.idade !== null ? ' <b>Idade informada: ' + esc(c.idade) + ' meses.</b>' : '') },
      { k:'peso', t: c.kg
          ? 'Peso confirmado: <b>' + esc(c.kg) + ' kg</b> — é do paciente certo?'
          : '<b>Nenhum peso informado.</b> As doses por quilo não estão calculadas.' },
      { k:'alergia', t:'Alergias revisadas, inclusive a reação anterior.' },
      { k:'renal', t:'Função renal e hepática consideradas para o ajuste de dose.' },
      { k:'gestacao', t:'Gestação e amamentação descartadas ou consideradas.' },
      { k:'local', t:'Confere com a padronização e a apresentação disponíveis no seu serviço.' }
    ];
    if (tipo === 'atb') {
      l.push({ k:'antibiograma', t:'Culturas colhidas antes da 1ª dose, e antibiograma ou protocolo local consultado.' });
      l.push({ k:'stewardship', t:'Foco definido, duração estabelecida e reavaliação em 48–72 h para descalonar.' });
    }
    return l;
  }
  function confirmaCopia(tipo, oque, aoConfirmar) {
    if (!conferenciaLigada()) { aoConfirmar(); return; }
    var itens = itensConferencia(tipo);
    var velhoFoco = document.activeElement;
    var fundo = document.createElement('div');
    fundo.className = 'cf-fundo';
    fundo.innerHTML =
      '<div class="cf-caixa" role="dialog" aria-modal="true" aria-labelledby="cfTit">' +
        '<header class="cf-topo">' + ICO('escudo') +
          '<h3 id="cfTit">Antes de copiar' + (oque ? ' — ' + esc(oque) : '') + '</h3>' +
          '<button type="button" class="icone" data-cf="x" aria-label="Cancelar">' + ICO('fechar') + '</button>' +
        '</header>' +
        (tipo === 'atb'
          ? '<p class="cf-lead">Esquema empírico: ajuste ao protocolo e ao perfil de resistência do serviço.</p>'
          : '<p class="cf-lead">Confira antes de copiar.</p>') +
        '<div class="cf-itens">' + itens.map(function (i, n) {
          return '<label class="cf-item"><input type="checkbox" data-cf-k="' + i.k + '">' +
                 '<span>' + i.t + '</span></label>';
        }).join('') + '</div>' +
        '<footer class="cf-acoes">' +
          '<span class="cf-conta" data-cf="conta">0 de ' + itens.length + '</span>' +
          '<button type="button" class="ferr-btn" data-cf="x">Cancelar</button>' +
          '<button type="button" class="ferr-btn forte" data-cf="ok" disabled>Conferi, copiar</button>' +
        '</footer>' +
      '</div>';
    document.body.appendChild(fundo);
    document.body.classList.add('travado');

    var cxs = [].slice.call(fundo.querySelectorAll('input[data-cf-k]'));
    var btnOk = fundo.querySelector('[data-cf="ok"]');
    var conta = fundo.querySelector('[data-cf="conta"]');
    function reconta() {
      var n = cxs.filter(function (c) { return c.checked; }).length;
      conta.textContent = n + ' de ' + cxs.length;
      btnOk.disabled = (n < cxs.length);
    }
    cxs.forEach(function (c) { c.addEventListener('change', reconta); });

    function encerra() {
      fundo.remove();
      document.body.classList.remove('travado');
      document.removeEventListener('keydown', tecla, true);
      if (velhoFoco && document.contains(velhoFoco)) velhoFoco.focus();
    }
    function tecla(e) {
      if (e.key === 'Escape') { e.preventDefault(); encerra(); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(fundo.querySelectorAll('button:not([disabled]), input'));
      if (!f.length) return;
      var pri = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    }
    fundo.addEventListener('click', function (e) {
      if (e.target === fundo) { encerra(); return; }
      var a = e.target.closest('[data-cf]');
      if (!a) return;
      if (a.dataset.cf === 'x') { encerra(); return; }
      if (a.dataset.cf === 'ok') { encerra(); aoConfirmar(); }
    });
    document.addEventListener('keydown', tecla, true);
    setTimeout(function () { (cxs[0] || btnOk).focus(); }, 30);
  }
  /* copia que passa pela conferência */
  function copiarClinico(txt, oque, tipo) {
    confirmaCopia(tipo || 'presc', oque, function () { copiar(txt, oque); });
  }

  function velho(t) {
    try {
      var a = document.createElement('textarea');
      a.value = t;
      a.setAttribute('readonly', '');
      a.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(a);
      a.select(); a.setSelectionRange(0, a.value.length);
      var r = document.execCommand('copy');
      document.body.removeChild(a);
      return r;
    } catch (e) { return false; }
  }

  /* ---------- base viva: padrao + o que o usuario mexeu ---------- */
  var Base = {
    cards: function (p) { return ler('ferr:cards:' + p, FERR_CARDS[p] || []); },
    setCards: function (p, v) { grava('ferr:cards:' + p, v); },
    resetCards: function (p) { apaga('ferr:cards:' + p); },

    atb: function () { return ler('ferr:atb', FERR_ATB); },
    setAtb: function (v) { grava('ferr:atb', v); },
    resetAtb: function () { apaga('ferr:atb'); },

    quadros: function () { return ler('ferr:quadros', FERR_QUADROS); },
    setQuadros: function (v) { grava('ferr:quadros', v); },
    resetQuadros: function () { apaga('ferr:quadros'); },

    exame: function () { return ler('ferr:exame', FERR_EXAME); },
    setExame: function (v) { grava('ferr:exame', v); },
    resetExame: function () { apaga('ferr:exame'); },

    po: function () { return ler('ferr:po', FERR_PO); },
    setPo: function (v) { grava('ferr:po', v); },
    resetPo: function () { apaga('ferr:po'); },

    meds: function (ctx) {
      var padrao = { im: FERR_IM, ev: FERR_EV, has: FERR_HAS, psiq: FERR_PSIQ }[ctx] || [];
      return ler('ferr:meds:' + ctx, padrao);
    },
    setMeds: function (ctx, v) { grava('ferr:meds:' + ctx, v); },
    resetMeds: function (ctx) { apaga('ferr:meds:' + ctx); },

    combos: function (ctx) { return ler('ferr:combos:' + ctx, []); },
    setCombos: function (ctx, v) { grava('ferr:combos:' + ctx, v); },

    ordem: function (ctx, todos) {
      var g = ler('ferr:ordem:' + ctx, null);
      if (!g) return { ordem: todos.slice(), ocultos: [] };
      var faltando = todos.filter(function (x) { return g.ordem.indexOf(x) === -1; });
      return { ordem: g.ordem.filter(function (x) { return todos.indexOf(x) !== -1; }).concat(faltando),
               ocultos: g.ocultos || [] };
    },
    setOrdem: function (ctx, v) { grava('ferr:ordem:' + ctx, v); },

    rascunho: function (p) { return ler('ferr:rascunho:' + p, ''); },
    setRascunho: function (p, v) { grava('ferr:rascunho:' + p, v); }
  };

  /* ---------- estado de tela ---------- */
  var abaAtual = 'anamnese';
  var form_alvo = null;          /* item sendo editado no formulario aberto */
  var form_ctx  = null;          /* contexto do formulario de medicacao */
  var subEsp   = 'has';           /* sub-aba de Especiais */
  var alvo     = null;            /* container onde desenhamos */
  var form     = null;            /* qual formulario esta aberto */
  var filtroEx = 'todos';         /* sistema filtrado nas manobras */
  var sel      = {};              /* selecao por contexto: [{id,qtd,modo,volume}] */
  var desfecho = {};              /* desfecho por contexto */
  var tempoEV  = '';
  var calcAberta = null;
  var calcVal  = {};              /* valores digitados por calculadora */
  var glicemia = null;
  var quadroAberto = null;       /* id do quadro expandido */
  /* prescrição ajustada para ESTE paciente: vive só na sessão, não
     mexe no modelo salvo. `null` = ainda não editada. */
  var rxEdit = {};               /* { quadroId: {unidade:[], receita:[]} } */
  var rxEditando = null;         /* 'quadroId:parte' em edição agora */
  var atbAberto    = null;       /* id do esquema expandido */
  var alvoAtb      = null;
  var slugAtb      = null;
  var filtroAtb    = 'todos';
  var buscaAtb     = '';
  var filtroQuadro = 'todos';    /* grupo filtrado */
  /* contexto da prescrição: porta (na unidade) · internados (enfermaria) · casa (receita) */
  var ctxRx = (function () { var v = ler('pref:rx-ctx', 'porta'); return v === 'internados' || v === 'casa' ? v : 'porta'; })();
  function partesDoCtx() { return ctxRx === 'casa' ? ['receita'] : ['unidade']; }
  var buscaQuadro  = '';         /* busca local da aba Prescrições */
  var inalSel  = {};
  var inalCiclos = 1;
  var inalDiluente = FERR_INAL_DILUENTES[0];

  var ABAS = [
    { id: 'anamnese',    nome: 'Anamnese',    icone: 'prontuar', desc: 'Modelos de anamnese, exame físico e manobras' },
    { id: 'calculadoras',nome: 'Calculadoras',icone: 'calc', desc: 'Escores e contas do plantão' },
    { id: 'conduta',     nome: 'Conduta',     icone: 'esteto', desc: 'Orientações, alta, recusa e encaminhamento' },
    { id: 'evasao',      nome: 'Evasão',      icone: 'porta', desc: 'Registros de ausência, com horário automático' },
    { id: 'laudos',      nome: 'Laudos',      icone: 'laudo', desc: 'RX, ECG e POCUS' },
    { id: 'quadros',     nome: 'Prescrições', icone: 'receita', desc: 'Prescrição pronta por quadro clínico — da chegada à alta' },
    { id: 'oral',        nome: 'Oral',        icone: 'comprim', desc: 'Prescrição oral — receita de alta por grupos' },
    { id: 'im',          nome: 'IM',          icone: 'seringa', desc: 'Prescrição intramuscular na unidade' },
    { id: 'ev',          nome: 'EV',          icone: 'soro', desc: 'Prescrição endovenosa — soluções, ampolas e protocolos' },
    { id: 'especiais',   nome: 'Especiais',   icone: 'ajustes', desc: 'HAS, DM, psiquiatria e inalação' }
  ];
  var PASTAS = { anamnese: 'anamnese', conduta: 'conduta', evasao: 'evasao', laudos: 'laudos' };

  function ehAba(id) {
    for (var i = 0; i < ABAS.length; i++) if (ABAS[i].id === id) return true;
    return false;
  }
  function abaDe(id) {
    for (var i = 0; i < ABAS.length; i++) if (ABAS[i].id === id) return ABAS[i];
    return ABAS[0];
  }

  /* ---------- pecas de interface ---------- */
  function cabecalho(a) {
    return '<p class="ferr-lead">' + esc(a.desc) + '.</p>';
  }
  function barra(botoes) {
    return '<div class="ferr-barra">' + botoes.join('') + '</div>';
  }
  function btn(acao, rotulo, extra) {
    return '<button type="button" class="ferr-btn' + (extra ? ' ' + extra : '') +
           '" data-acao="' + acao + '">' + rotulo + '</button>';
  }
  function campo(nome, rotulo, valor, tipo) {
    return '<label class="ferr-campo"><span>' + esc(rotulo) + '</span>' +
      (tipo === 'area'
        ? '<textarea name="' + nome + '" rows="7">' + esc(valor || '') + '</textarea>'
        : '<input type="' + (tipo || 'text') + '" name="' + nome + '" value="' + esc(valor || '') + '">') +
    '</label>';
  }
  /* O rascunho virou painel fixo à direita (index.html).
     Uma única chave global: o texto acompanha o médico em todas as telas. */
  var CHAVE_BANC = 'bancada';
  function bancTexto()      { return Base.rascunho(CHAVE_BANC); }
  function bancGrava(v)     { Base.setRascunho(CHAVE_BANC, v); pintaBanc(); }
  function bancada() { return ''; }   /* compat: as telas não desenham mais */
  function pintaBanc() {
    var t = bancTexto(), n = t.trim() ? t.trim().split(/\n+/).length : 0;
    var c = document.getElementById('bancConta');
    if (c) c.textContent = n ? (n + (n === 1 ? ' linha' : ' linhas')) : '';
    var a = document.getElementById('bancAbaN');
    if (a) { a.textContent = n; a.hidden = !n; }
    document.body.classList.toggle('banc-cheia', !!n);
  }
  F.pintaBanc = pintaBanc;
  F.bancTexto = bancTexto;

  /* migra o que ficou nas chaves antigas, por seção, para a global */
  function migraBancadas() {
    if (ler('ferr:banc-migrado', false)) return;
    var junta = [], apagar = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k.indexOf('ferr:rascunho:') !== 0) continue;
      if (k === 'ferr:rascunho:' + CHAVE_BANC) continue;
      var t = ler(k, '');
      if (typeof t === 'string' && t.trim()) junta.push(t.trim());
      apagar.push(k);
    }
    if (junta.length) {
      var atual = bancTexto();
      Base.setRascunho(CHAVE_BANC, (atual ? atual.replace(/\s*$/, '') + '\n\n' : '') + junta.join('\n\n'));
    }
    apagar.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
    grava('ferr:banc-migrado', true);
  }

  /* =========================================================
     PASTAS DE TEXTO — anamnese, conduta, evasao, laudos
     ========================================================= */
  function cartaoTexto(c, pasta) {
    var aberto = cardAberto === c.id;
    return '<article class="ferr-card' + (aberto ? ' aberta' : '') + '" data-id="' + esc(c.id) + '">' +
      '<div class="fc-linha">' +
        '<button type="button" class="fc-abre" data-acao="card-abrir" data-id="' + esc(c.id) + '">' +
          '<span class="fc-seta">' + ICO(aberto ? 'setaBai' : 'setaDir') + '</span>' +
          '<span class="fc-txt"><b>' + esc(c.label) + (c.hora ? ' <i class="ferr-tag hora">horário</i>' : '') + '</b>' +
            (c.sub ? '<i>' + esc(c.sub) + '</i>' : '') + '</span>' +
        '</button>' +
        '<button type="button" class="rxl-btn forte" data-acao="card-copiar" data-id="' + esc(c.id) + '"' +
          ' title="Copiar e enviar ao rascunho">' + ICO('copiar') + '<i>Copiar</i></button>' +
      '</div>' +
      (aberto
        ? '<div class="fc-corpo">' +
            '<textarea class="fc-area" data-card-txt="' + esc(c.id) + '" rows="12" spellcheck="false">' +
              esc(c.texto) + '</textarea>' +
            '<div class="fc-acoes">' +
              '<button type="button" class="ferr-btn peq forte" data-acao="card-salvar" data-id="' + esc(c.id) + '">Salvar</button>' +
              '<button type="button" class="ferr-btn peq" data-acao="card-empilhar" data-id="' + esc(c.id) + '">Empilhar</button>' +
              '<button type="button" class="ferr-btn peq perigo" data-acao="card-apagar" data-id="' + esc(c.id) + '">Apagar</button>' +
            '</div>' +
          '</div>'
        : '<p class="fc-previa">' + esc((c.texto || '').slice(0, 150).replace(/\s+/g, ' ')) + '…</p>') +
    '</article>';
  }

  function formCard(pasta, c) {
    c = c || { label: '', sub: '', texto: '', hora: false };
    return '<form class="ferr-form" data-form="card" data-id="' + esc(c.id || '') + '">' +
      '<h3>' + (c.id ? 'Editar' : 'Novo') + ' texto</h3>' +
      campo('label', 'Nome do cartão', c.label) +
      campo('sub', 'Descrição curta (opcional)', c.sub) +
      campo('texto', 'Texto — use {HORA} e {DATA} onde quiser o horário e a data do clique', c.texto, 'area') +
      '<label class="ferr-check"><input type="checkbox" name="hora"' + (c.hora ? ' checked' : '') + '> ' +
        'Marcar como cartão com horário</label>' +
      '<div class="ferr-form-acoes">' +
        '<button type="submit" class="ferr-btn forte">Salvar</button>' +
        btn('form-fechar', 'Cancelar') +
      '</div>' +
    '</form>';
  }

  function telaPasta(pasta, opts) {
    opts = opts || {};
    var a = abaDe(pasta === 'anamnese' ? 'anamnese' : pasta);
    var lista = Base.cards(pasta);
    var html = opts.nu ? '' : cabecalho(a);

    if (modoAutor()) {
      html += barra([
        btn('card-novo', '+ Novo texto', 'forte'),
        btn('pasta-restaurar', 'Restaurar padrão')
      ]);
    }
    if (form === 'card') html += formCard(pasta, form_alvo);

    html += '<div class="ferr-grade">' +
      (lista.length ? lista.map(function (c) { return cartaoTexto(c, pasta); }).join('')
                    : '<div class="pendente">Nenhum texto nesta pasta. Toque em “Novo texto”.</div>') +
    '</div>';

    /* a anamnese ganha ainda o bloco de manobras */
    if (pasta === 'anamnese' && !opts.semManobras) html += telaManobras();

    if (!opts.semBancada) html += bancada(pasta);
    return html;
  }

  /* ---------- atestado: nome, CPF, CID, dias → texto pronto ---------- */
  var CIDS = [
    ['A09','Diarreia e gastroenterite de origem infecciosa presumível'],
    ['A90','Dengue'],['B34.9','Infecção viral não especificada'],['B01.9','Varicela'],
    ['J00','Nasofaringite aguda (resfriado comum)'],['J01.9','Sinusite aguda'],['J02.9','Faringite aguda'],
    ['J03.9','Amigdalite aguda'],['J04.0','Laringite aguda'],['J06.9','Infecção aguda das vias aéreas superiores'],
    ['J11','Influenza (gripe)'],['J18.9','Pneumonia'],['J20.9','Bronquite aguda'],['J45.9','Asma'],
    ['J44.1','DPOC com exacerbação aguda'],['H10.9','Conjuntivite'],['H66.9','Otite média'],['H81.1','Vertigem posicional benigna'],
    ['K29.7','Gastrite'],['K30','Dispepsia'],['K52.9','Gastroenterite não infecciosa'],['K80.2','Cálculo da vesícula'],
    ['K35.8','Apendicite aguda'],['K59.0','Constipação'],['R10.4','Dor abdominal'],['R11','Náusea e vômito'],
    ['N10','Pielonefrite aguda'],['N20.0','Cálculo do rim'],['N23','Cólica renal'],['N30.0','Cistite aguda'],['N39.0','Infecção do trato urinário'],
    ['N94.6','Dismenorreia'],['N76.0','Vaginite aguda'],['O21.0','Hiperêmese gravídica leve'],
    ['M54.5','Dor lombar baixa'],['M54.2','Cervicalgia'],['M54.4','Lumbago com ciática'],['M79.1','Mialgia'],['M25.5','Dor articular'],
    ['M10.9','Gota'],['M77.9','Entesopatia (tendinite)'],['S93.4','Entorse de tornozelo'],['S63.5','Entorse de punho'],
    ['S61.9','Ferimento do punho e da mão'],['S01.9','Ferimento da cabeça'],['T14.0','Contusão'],['T14.1','Ferimento aberto'],
    ['W57','Picada de inseto'],['L03.9','Celulite'],['L02.9','Abscesso cutâneo'],['L50.9','Urticária'],['L23.9','Dermatite de contato'],['B86','Escabiose'],
    ['G43.9','Enxaqueca'],['G44.2','Cefaleia tensional'],['R51','Cefaleia'],['R42','Tontura'],['R55','Síncope'],['G40.9','Epilepsia'],
    ['I10','Hipertensão arterial'],['I20.9','Angina'],['I48','Fibrilação atrial'],['R07.4','Dor torácica'],['I80.2','Trombose venosa profunda'],
    ['E11.9','Diabetes mellitus tipo 2'],['E16.2','Hipoglicemia'],['E86','Desidratação'],['R50.9','Febre'],
    ['F41.1','Ansiedade generalizada'],['F41.0','Transtorno de pânico'],['F32.9','Depressão'],['F43.0','Reação aguda ao estresse'],['F10.0','Intoxicação alcoólica aguda'],
    ['K04.7','Abscesso periapical'],['K08.8','Dor de dente'],['Z00.0','Exame médico geral'],['Z76.3','Acompanhante de pessoa doente']
  ];
  var at = { tipo:'afast', nome:'', cpf:'', cid:'', cidTxt:'', dias:'1', data:'', ini:'', fim:'', comCid:false };
  var atBuscaCid = '';

  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function dataBR(iso) {
    var p = String(iso || '').split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : '';
  }
  function dataExtenso(iso) {
    var p = String(iso || '').split('-');
    var meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    return p.length === 3 ? parseInt(p[2], 10) + ' de ' + meses[parseInt(p[1], 10) - 1] + ' de ' + p[0] : '';
  }
  function extenso(n) {
    var u = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
    var d = ['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
    n = parseInt(n, 10);
    if (isNaN(n) || n < 0) return '';
    if (n < 20) return u[n];
    if (n < 100) return d[Math.floor(n / 10)] + (n % 10 ? ' e ' + u[n % 10] : '');
    return String(n);
  }
  function mascaraCPF(v) {
    var d = String(v || '').replace(/\D/g, '').slice(0, 11);
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  function medico() {
    var nome = ler('pref:nome', ''), crm = ler('pref:crm', ''), cidade = ler('pref:cidade', '');
    return { nome: typeof nome === 'string' ? nome : '', crm: typeof crm === 'string' ? crm : '', cidade: typeof cidade === 'string' ? cidade : '' };
  }

  function textoAtestado() {
    var m = medico();
    if (!at.data) at.data = hojeISO();
    var nome = at.nome.trim() || '________________________';
    var cpf = at.cpf ? ', CPF ' + at.cpf : '';
    var t = 'ATESTADO MÉDICO\n\n';
    if (at.tipo === 'afast') {
      var n = parseInt(at.dias, 10) || 1;
      t += 'Atesto, para os devidos fins, que ' + nome + cpf + ' foi atendido(a) neste serviço em ' + dataBR(at.data) +
        ', necessitando de afastamento de suas atividades por ' + n + ' (' + extenso(n) + ') dia' + (n === 1 ? '' : 's') +
        ', a partir desta data.';
    } else {
      t += 'Atesto, para os devidos fins, que ' + nome + cpf + ' compareceu a este serviço em ' + dataBR(at.data) +
        (at.ini ? ', das ' + at.ini + (at.fim ? ' às ' + at.fim : '') + ' horas' : '') + ', para atendimento médico.';
    }
    if (at.comCid && (at.cid || at.cidTxt)) {
      t += '\n\nCID-10: ' + (at.cid || at.cidTxt) + ' (informado com autorização do(a) paciente).';
    }
    t += '\n\n' + (m.cidade ? m.cidade + ', ' : '') + dataExtenso(at.data) + '.';
    t += '\n\n\n______________________________\n' + (m.nome || 'Dr(a). ________________') + (m.crm ? '\nCRM ' + m.crm : '\nCRM ________');
    return t;
  }

  function cidsFiltrados() {
    var q = norm(atBuscaCid);
    if (!q) return [];
    return CIDS.filter(function (c) { return norm(c[0] + ' ' + c[1]).indexOf(q) !== -1; }).slice(0, 8);
  }

  function telaAtestado() {
    if (!at.data) at.data = hojeISO();
    var m = medico();
    var html = '<div class="at">';
    html += '<div class="at-form">';
    html += '<div class="el-opcoes"><span class="el-opcoes-rot">Tipo</span><div class="el-seg">' +
      '<button type="button" class="el-op' + (at.tipo === 'afast' ? ' on' : '') + '" data-acao="at-tipo" data-v="afast">Afastamento</button>' +
      '<button type="button" class="el-op' + (at.tipo === 'comp' ? ' on' : '') + '" data-acao="at-tipo" data-v="comp">Comparecimento</button>' +
      '</div></div>';
    html += '<div class="ferr-campos">' +
      '<label class="ferr-campo larga"><span>Nome do(a) paciente</span><input type="text" data-at="nome" autocomplete="off" value="' + esc(at.nome) + '" placeholder="Nome completo"></label>' +
      '<label class="ferr-campo"><span>CPF</span><input type="text" inputmode="numeric" data-at="cpf" autocomplete="off" value="' + esc(at.cpf) + '" placeholder="000.000.000-00"></label>' +
      '<label class="ferr-campo"><span>Data</span><input type="date" data-at="data" value="' + esc(at.data) + '"></label>';
    if (at.tipo === 'afast') {
      html += '<label class="ferr-campo"><span>Dias de afastamento</span><input type="number" min="1" max="90" data-at="dias" value="' + esc(at.dias) + '"></label>';
    } else {
      html += '<label class="ferr-campo"><span>Chegada</span><input type="time" data-at="ini" value="' + esc(at.ini) + '"></label>' +
        '<label class="ferr-campo"><span>Saída</span><input type="time" data-at="fim" value="' + esc(at.fim) + '"></label>';
    }
    html += '</div>';

    /* CID */
    html += '<div class="at-cid">' +
      '<label class="ferr-check at-check"><input type="checkbox" data-at="comCid"' + (at.comCid ? ' checked' : '') + '>' +
        '<span>Incluir CID-10 <i>só com autorização do(a) paciente</i></span></label>';
    if (at.comCid) {
      html += '<div class="ferr-campos">' +
        '<label class="ferr-campo larga"><span>CID</span>' +
          '<input type="text" data-at="cidBusca" autocomplete="off" placeholder="Buscar por código ou nome — ou digitar direto" value="' + esc(atBuscaCid) + '"></label></div>';
      var lst = cidsFiltrados();
      if (lst.length) {
        html += '<div class="at-cids">' + lst.map(function (c) {
          return '<button type="button" class="cg" data-acao="at-cid" data-v="' + esc(c[0]) + '"><b>' + esc(c[0]) + '</b> ' + esc(c[1]) + '</button>';
        }).join('') + '</div>';
      }
      if (at.cid) html += '<div class="at-cid-sel">Selecionado: <b>' + esc(at.cid) + '</b> <button type="button" class="cg" data-acao="at-cid" data-v="">tirar</button></div>';
    }
    html += '</div>';

    /* médico */
    html += '<details class="at-medico"' + ((!m.nome || !m.crm) ? ' open' : '') + '><summary>Médico(a): ' +
      esc(m.nome || 'sem nome') + (m.crm ? ' · CRM ' + esc(m.crm) : ' · sem CRM') + (m.cidade ? ' · ' + esc(m.cidade) : '') + '</summary>' +
      '<div class="ferr-campos">' +
        '<label class="ferr-campo"><span>Nome como assina</span><input type="text" data-at="mNome" value="' + esc(m.nome) + '" placeholder="Dr. Nome Sobrenome"></label>' +
        '<label class="ferr-campo"><span>CRM</span><input type="text" data-at="mCrm" value="' + esc(m.crm) + '" placeholder="00000/UF"></label>' +
        '<label class="ferr-campo"><span>Cidade</span><input type="text" data-at="mCidade" value="' + esc(m.cidade) + '" placeholder="Cidade"></label>' +
      '</div><p class="ferr-nota">Fica salvo neste aparelho e vale para os próximos atestados.</p></details>';
    html += '</div>';

    /* saída */
    html += '<div class="at-saida" id="atSaida">' + corpoAtestado() + '</div>';
    return html + '</div>';
  }
  function corpoAtestado() {
    var txt = textoAtestado();
    return '<pre class="at-texto">' + esc(txt) + '</pre>' +
      '<div class="pp-barra">' +
        '<button type="button" class="pp-copiar" data-acao="at-copiar">' + ICO('copiar') + ' Copiar atestado</button>' +
        '<button type="button" class="pp-imprimir" data-acao="at-imprimir">' + ICO('laudo') + ' Imprimir</button>' +
        '<button type="button" class="pp-sec" data-acao="at-rascunho" title="Enviar ao rascunho">' + ICO('empilhar') + '</button>' +
        '<button type="button" class="pp-sec" data-acao="at-limpar" title="Limpar">' + ICO('lixo') + '</button>' +
      '</div>';
  }
  function redesenhaAtestadoSaida() {
    var el = document.getElementById('atSaida');
    if (el) el.innerHTML = corpoAtestado();
  }

  document.addEventListener('input', function (e) {
    var el = e.target.closest && e.target.closest('[data-at]');
    if (!el) return;
    var k = el.dataset.at;
    if (k === 'cpf') { el.value = mascaraCPF(el.value); at.cpf = el.value; }
    else if (k === 'comCid') { at.comCid = el.checked; redesenhaFixo(); return; }
    else if (k === 'cidBusca') { atBuscaCid = el.value; at.cidTxt = el.value; redesenhaFixo(); focaAt('cidBusca'); return; }
    else if (k === 'mNome') { grava('pref:nome', el.value.trim()); }
    else if (k === 'mCrm') { grava('pref:crm', el.value.trim()); }
    else if (k === 'mCidade') { grava('pref:cidade', el.value.trim()); }
    else at[k] = el.value;
    redesenhaAtestadoSaida();
  });
  function focaAt(k) {
    var i = document.querySelector('[data-at="' + k + '"]');
    if (i) { i.focus(); try { i.setSelectionRange(i.value.length, i.value.length); } catch (x) { /* date */ } }
  }

  /* =========================================================
     DOCUMENTAL — passagem de plantão, regulação, declaração de
     óbito e notificação compulsória. Conteúdo em FERR_DOC_*
     (ferramentas-dados.js). Como no atestado, nada do paciente
     fica gravado no aparelho: vive só na memória da aba.
     ========================================================= */
  function temDoc() { return typeof FERR_DOC_OBITO !== 'undefined'; }
  function ricoDoc(t) { return esc(t).replace(/\*([^*]+)\*/g, '<b>$1</b>'); }
  function listaDoc(titulo, itens, cls) {
    return '<div class="el-lista' + (cls ? ' ' + cls : '') + '"><b>' + esc(titulo) + '</b><ul>' +
      itens.map(function (i) { return '<li>' + ricoDoc(i) + '</li>'; }).join('') + '</ul></div>';
  }
  function campoDoc(attr, k, rot, val, o) {
    o = o || {};
    var cls = 'ferr-campo' + (o.larga ? ' larga' : '');
    var dado = 'data-' + attr + '="' + k + '"';
    if (o.area) {
      return '<label class="' + cls + '"><span>' + esc(rot) + '</span><textarea ' + dado + ' rows="' + (o.rows || 3) +
        '" placeholder="' + esc(o.ph || '') + '">' + esc(val) + '</textarea></label>';
    }
    if (o.opcoes) {
      return '<label class="' + cls + '"><span>' + esc(rot) + '</span><select ' + dado + '>' +
        '<option value="">—</option>' + o.opcoes.map(function (x) {
          return '<option' + (x === val ? ' selected' : '') + '>' + esc(x) + '</option>';
        }).join('') + '</select></label>';
    }
    return '<label class="' + cls + '"><span>' + esc(rot) + '</span><input type="' + (o.tipo || 'text') + '" ' + dado +
      ' autocomplete="off" value="' + esc(val) + '" placeholder="' + esc(o.ph || '') + '"' +
      (o.im ? ' inputmode="' + o.im + '"' : '') + '></label>';
  }
  function barraDoc(pref, rotulo) {
    return '<div class="pp-barra">' +
      '<button type="button" class="pp-copiar" data-acao="' + pref + '-copiar">' + ICO('copiar') + ' Copiar ' + esc(rotulo) + '</button>' +
      '<button type="button" class="pp-imprimir" data-acao="' + pref + '-imprimir">' + ICO('laudo') + ' Imprimir</button>' +
      '<button type="button" class="pp-sec" data-acao="' + pref + '-rascunho" title="Enviar ao rascunho">' + ICO('empilhar') + '</button>' +
      '<button type="button" class="pp-sec" data-acao="' + pref + '-limpar" title="Limpar">' + ICO('lixo') + '</button>' +
    '</div>';
  }
  function linhasDoc(t) {
    return String(t || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function ouTraco(v) { v = String(v || '').trim(); return v || '—'; }

  /* ---------- passagem de plantão (I-PASS) ---------- */
  function pacNovo() { return { leito:'', nome:'', idade:'', dx:'', grav:'observar', resumo:'', pend:'', cont:'', sint:false }; }
  var ph = { para:'', pacs:[pacNovo()], at:0 };
  var ORDEM_GRAV = { instavel:0, observar:1, estavel:2 };
  function gravDe(id) {
    var g = typeof FERR_DOC_GRAV !== 'undefined' ? FERR_DOC_GRAV : [];
    for (var i = 0; i < g.length; i++) if (g[i][0] === id) return g[i];
    return ['observar', 'Observar de perto', ''];
  }
  function pacPreenchido(p) { return !!(p.leito || p.nome || p.dx || p.resumo || p.pend || p.cont); }
  function textoPlantao() {
    var m = medico();
    var pacs = ph.pacs.map(function (p, i) { return { p:p, i:i }; })
      .filter(function (x) { return pacPreenchido(x.p); })
      .sort(function (a, b) { return (ORDEM_GRAV[a.p.grav] - ORDEM_GRAV[b.p.grav]) || (a.i - b.i); });
    var inst = pacs.filter(function (x) { return x.p.grav === 'instavel'; }).length;
    var t = 'PASSAGEM DE PLANTÃO — ' + dataHoje() + ' ' + hora() + '\n';
    t += 'Passa: ' + (m.nome || '________________') + (m.crm ? ' (CRM ' + m.crm + ')' : '') +
      ' · Recebe: ' + (ph.para.trim() || '________________') + '\n';
    t += pacs.length + ' paciente' + (pacs.length === 1 ? '' : 's') +
      (inst ? ' · ' + inst + ' instáve' + (inst === 1 ? 'l' : 'is') : '') + ' — em ordem de gravidade\n';
    if (!pacs.length) t += '\n[preencha pelo menos um paciente]\n';
    pacs.forEach(function (x, n) {
      var p = x.p, g = gravDe(p.grav);
      var idade = String(p.idade || '').trim();
      if (/^\d+$/.test(idade)) idade += ' anos';
      t += '\n' + (n + 1) + ') ' + [p.leito ? 'Leito ' + p.leito.trim() : '', p.nome.trim(), idade].filter(Boolean).join(' — ') + '\n';
      t += 'I · Gravidade: ' + g[1].toUpperCase() + '\n';
      var resumo = [p.dx.trim(), p.resumo.trim()].filter(Boolean).join('. ');
      t += 'P · Resumo: ' + ouTraco(resumo) + '\n';
      var pend = linhasDoc(p.pend), cont = linhasDoc(p.cont);
      t += 'A · Pendências:' + (pend.length ? '\n' + pend.map(function (l) { return '   • ' + l; }).join('\n') : ' nenhuma') + '\n';
      t += 'S · Se… então…:' + (cont.length ? '\n' + cont.map(function (l) { return '   • ' + l; }).join('\n') : ' —') + '\n';
      t += 'S · Síntese de quem recebe: ' + (p.sint ? 'confirmada' : 'PENDENTE') + '\n';
    });
    return t;
  }
  function telaPlantao() {
    if (ph.at >= ph.pacs.length) ph.at = ph.pacs.length - 1;
    var p = ph.pacs[ph.at];
    var html = '<div class="at doc">';
    html += '<div class="at-form">';
    html += '<p class="ferr-nota doc-lead">Modelo I-PASS: <b>I</b>ndicação de gravidade, <b>P</b>aciente (resumo), <b>A</b>ções pendentes, ' +
      '<b>S</b>ituação e contingência, <b>S</b>íntese de quem recebe. O texto sai em ordem de gravidade. Nada fica salvo no aparelho — copie antes de sair.</p>';
    html += '<div class="ferr-campos">' + campoDoc('ph', 'para', 'Quem recebe o plantão', ph.para, { ph:'Dr(a). …', larga:true }) + '</div>';
    html += '<div class="doc-pacs">' + ph.pacs.map(function (q, i) {
      var rot = q.leito ? 'Leito ' + q.leito : (q.nome || 'Paciente ' + (i + 1));
      return '<button type="button" class="cg doc-pac g-' + esc(q.grav) + (i === ph.at ? ' on' : '') + '" data-acao="ph-pac" data-v="' + i + '">' + esc(rot) + '</button>';
    }).join('') + '<button type="button" class="cg" data-acao="ph-novo">+ Paciente</button></div>';
    html += '<div class="el-opcoes"><span class="el-opcoes-rot">I · Gravidade</span><div class="el-seg">' +
      (typeof FERR_DOC_GRAV !== 'undefined' ? FERR_DOC_GRAV : []).map(function (g) {
        return '<button type="button" class="el-op' + (p.grav === g[0] ? ' on' : '') + '" data-acao="ph-grav" data-v="' + g[0] + '" title="' + esc(g[2]) + '">' + esc(g[1]) + '</button>';
      }).join('') + '</div></div>';
    html += '<div class="ferr-campos">' +
      campoDoc('ph', 'leito', 'Leito', p.leito, { ph:'Ex.: 4 ou Obs 2' }) +
      campoDoc('ph', 'idade', 'Idade', p.idade, { ph:'Ex.: 67' }) +
      campoDoc('ph', 'nome', 'Nome', p.nome, { larga:true, ph:'Nome ou iniciais' }) +
      campoDoc('ph', 'dx', 'Diagnóstico ou hipótese principal', p.dx, { larga:true, ph:'Ex.: Sepse de foco urinário' }) +
      campoDoc('ph', 'resumo', 'P · Resumo', p.resumo, { larga:true, area:true, ph:'O que aconteceu, o que já foi feito, como está agora' }) +
      campoDoc('ph', 'pend', 'A · Pendências — uma por linha, com responsável e horário', p.pend, { larga:true, area:true,
        ph:'Lactato de controle às 22 h — plantonista\nLaudo da TC — ligar para a radiologia' }) +
      campoDoc('ph', 'cont', 'S · Se… então… — uma por linha', p.cont, { larga:true, area:true,
        ph:'Se PAM < 65 depois de 30 mL/kg: iniciar noradrenalina e chamar a UTI' }) +
    '</div>';
    html += '<label class="ferr-check at-check"><input type="checkbox" data-ph="sint"' + (p.sint ? ' checked' : '') + '>' +
      '<span>Quem recebe repetiu o resumo e as pendências <i>síntese confirmada</i></span></label>';
    if (ph.pacs.length > 1) html += '<button type="button" class="ferr-btn peq perigo" data-acao="ph-del">Remover este paciente</button>';
    html += '</div>';
    html += '<div class="at-saida" id="docSaida">' + saidaDoc('ph') + '</div>';
    return html + '</div>';
  }

  /* ---------- regulação / transferência ---------- */
  function rgNovo() {
    return { nome:'', idade:'', sexo:'', origem:'', contato:'', dx:'', recurso:'', motivo:'', hist:'',
      pa:'', fc:'', fr:'', spo2:'', o2:'', tax:'', gcs:'', glic:'', via:'', drogas:'', disp:'', exames:'',
      conduta:'', isol:'Não', alergia:'', chk:{} };
  }
  var rg = rgNovo();
  var ISOL = ['Não', 'Contato', 'Gotícula', 'Aerossol'];
  function textoRegulacao() {
    var m = medico();
    var sv = [
      rg.pa ? 'PA ' + rg.pa + ' mmHg' : '', rg.fc ? 'FC ' + rg.fc + ' bpm' : '', rg.fr ? 'FR ' + rg.fr + ' irpm' : '',
      rg.spo2 ? 'SpO₂ ' + rg.spo2 + '%' + (rg.o2 ? ' em ' + rg.o2 : ' em ar ambiente') : '',
      rg.tax ? 'Tax ' + rg.tax + ' °C' : '', rg.gcs ? 'Glasgow ' + rg.gcs : '', rg.glic ? 'Glicemia ' + rg.glic + ' mg/dL' : ''
    ].filter(Boolean).join(' · ');
    var itens = typeof FERR_DOC_TRANSPORTE !== 'undefined' ? FERR_DOC_TRANSPORTE : [];
    var feitos = itens.filter(function (x, i) { return rg.chk[i]; }).length;
    var falta = itens.filter(function (x, i) { return !rg.chk[i]; });
    var t = 'SOLICITAÇÃO DE REGULAÇÃO / TRANSFERÊNCIA — ' + dataHoje() + ' ' + hora() + '\n\n';
    t += 'Origem: ' + ouTraco(rg.origem) + '\n';
    t += 'Médico solicitante: ' + (m.nome || '________________') + (m.crm ? ', CRM ' + m.crm : '') +
      (rg.contato ? ' · Contato: ' + rg.contato : '') + '\n\n';
    t += 'Paciente: ' + [ouTraco(rg.nome), rg.idade ? rg.idade + (/^\d+$/.test(rg.idade.trim()) ? ' anos' : '') : '', rg.sexo].filter(Boolean).join(', ') + '\n';
    t += 'Diagnóstico / hipótese: ' + ouTraco(rg.dx) + '\n';
    t += 'Recurso solicitado: ' + ouTraco(rg.recurso) + '\n';
    t += 'Motivo da transferência: ' + ouTraco(rg.motivo) + '\n\n';
    t += 'Quadro e evolução: ' + ouTraco(rg.hist) + '\n';
    t += 'Sinais vitais (' + hora() + '): ' + ouTraco(sv) + '\n';
    t += 'Via aérea / suporte ventilatório: ' + ouTraco(rg.via) + '\n';
    t += 'Drogas em curso: ' + ouTraco(rg.drogas) + '\n';
    t += 'Dispositivos: ' + ouTraco(rg.disp) + '\n';
    t += 'Exames relevantes: ' + ouTraco(rg.exames) + '\n';
    t += 'Conduta realizada: ' + ouTraco(rg.conduta) + '\n';
    t += 'Isolamento: ' + ouTraco(rg.isol) + '\n';
    t += 'Alergias: ' + ouTraco(rg.alergia) + '\n';
    if (itens.length) {
      t += '\nTransporte seguro: ' + feitos + ' de ' + itens.length + ' itens conferidos' +
        (falta.length ? '.\nPendentes:\n' + falta.map(function (l) { return '   • ' + l; }).join('\n') : ' — todos.') + '\n';
    }
    return t;
  }
  function telaRegulacao() {
    var html = '<div class="at doc">';
    html += '<div class="at-form">';
    html += '<p class="ferr-nota doc-lead">O texto que a central de regulação precisa para decidir a vaga — na ordem em que o regulador pergunta. Campo vazio sai como "—": melhor o regulador ver que falta do que achar que foi esquecido.</p>';
    html += '<div class="ferr-campos">' +
      campoDoc('rg', 'origem', 'Serviço de origem', rg.origem, { larga:true, ph:'Ex.: UPA Centro, sala vermelha' }) +
      campoDoc('rg', 'contato', 'Telefone de contato', rg.contato, { im:'tel', ph:'(00) 0000-0000' }) +
      campoDoc('rg', 'nome', 'Paciente', rg.nome, { ph:'Nome completo' }) +
      campoDoc('rg', 'idade', 'Idade', rg.idade, { ph:'Ex.: 58' }) +
      campoDoc('rg', 'sexo', 'Sexo', rg.sexo, { opcoes:['Feminino', 'Masculino'] }) +
      campoDoc('rg', 'dx', 'Diagnóstico ou hipótese', rg.dx, { larga:true, ph:'Ex.: IAM com supra de parede anterior, Killip II' }) +
      campoDoc('rg', 'recurso', 'Recurso solicitado', rg.recurso, { opcoes:(typeof FERR_DOC_RECURSO !== 'undefined' ? FERR_DOC_RECURSO : []) }) +
      campoDoc('rg', 'motivo', 'Motivo da transferência', rg.motivo, { ph:'O que falta aqui' }) +
      campoDoc('rg', 'hist', 'Quadro e evolução', rg.hist, { larga:true, area:true, ph:'Início, o que mudou, resposta ao tratamento' }) +
    '</div>';
    html += '<div class="doc-sub">Sinais vitais</div><div class="ferr-campos doc-sv">' +
      campoDoc('rg', 'pa', 'PA (mmHg)', rg.pa, { ph:'120/80' }) +
      campoDoc('rg', 'fc', 'FC', rg.fc, { im:'numeric' }) +
      campoDoc('rg', 'fr', 'FR', rg.fr, { im:'numeric' }) +
      campoDoc('rg', 'spo2', 'SpO₂ (%)', rg.spo2, { im:'numeric' }) +
      campoDoc('rg', 'o2', 'Em (O₂ / VNI / VM)', rg.o2, { ph:'cateter 3 L/min' }) +
      campoDoc('rg', 'tax', 'Tax (°C)', rg.tax, { im:'decimal' }) +
      campoDoc('rg', 'gcs', 'Glasgow', rg.gcs, { im:'numeric' }) +
      campoDoc('rg', 'glic', 'Glicemia', rg.glic, { im:'numeric' }) +
    '</div>';
    html += '<div class="ferr-campos">' +
      campoDoc('rg', 'via', 'Via aérea / ventilação', rg.via, { larga:true, ph:'Ex.: IOT tubo 7,5 a 22 cm, VCV 450 × 18, PEEP 8, FiO₂ 50%' }) +
      campoDoc('rg', 'drogas', 'Drogas em curso', rg.drogas, { larga:true, ph:'Ex.: noradrenalina 0,2 mcg/kg/min; fentanil 100 mcg/h' }) +
      campoDoc('rg', 'disp', 'Dispositivos', rg.disp, { larga:true, ph:'Acessos, sonda, dreno, cateter central' }) +
      campoDoc('rg', 'exames', 'Exames relevantes', rg.exames, { larga:true, area:true, rows:2, ph:'ECG, troponina, lactato, TC…' }) +
      campoDoc('rg', 'conduta', 'Conduta realizada', rg.conduta, { larga:true, area:true, rows:2, ph:'O que já foi feito e a que horas' }) +
      campoDoc('rg', 'alergia', 'Alergias', rg.alergia, { ph:'Nega ou quais' }) +
    '</div>';
    html += '<div class="el-opcoes"><span class="el-opcoes-rot">Isolamento</span><div class="el-seg">' + ISOL.map(function (x) {
      return '<button type="button" class="el-op' + (rg.isol === x ? ' on' : '') + '" data-acao="rg-isol" data-v="' + esc(x) + '">' + esc(x) + '</button>';
    }).join('') + '</div></div>';
    var itens = typeof FERR_DOC_TRANSPORTE !== 'undefined' ? FERR_DOC_TRANSPORTE : [];
    html += '<div class="doc-sub">Transporte seguro — antes de sair</div><div class="doc-check">' + itens.map(function (l, i) {
      return '<label class="ferr-check"><input type="checkbox" data-rgchk="' + i + '"' + (rg.chk[i] ? ' checked' : '') + '><span>' + esc(l) + '</span></label>';
    }).join('') + '</div>';
    html += '</div>';
    html += '<div class="at-saida" id="docSaida">' + saidaDoc('rg') + '</div>';
    return html + '</div>';
  }

  /* ---------- declaração de óbito: guia + rascunho da causa ---------- */
  function dobNovo() { return { a:'', ta:'', b:'', tb:'', c:'', tc:'', d:'', td:'', p2:'', tp2:'' }; }
  var dob = dobNovo();
  function avisosObito() {
    var av = [];
    var modos = typeof FERR_DOC_MODOS !== 'undefined' ? FERR_DOC_MODOS : [];
    var linhasI = ['a', 'b', 'c', 'd'].filter(function (k) { return dob[k].trim(); });
    if (!linhasI.length) return av;
    /* choque, insuficiência e falência de um órgão são aceitos no meio da
       cadeia, com a causa embaixo; só erram quando viram a causa básica */
    var BRANDOS = ['choque', 'insuficiencia respiratoria', 'insuficiencia cardiaca', 'falencia'];
    var ultimaI = linhasI[linhasI.length - 1];
    ['a', 'b', 'c', 'd', 'p2'].forEach(function (k) {
      var v = dob[k].trim();
      if (!v) return;
      var n = ' ' + norm(v).replace(/[^a-z0-9 ]/g, ' ') + ' ';
      var duro = false;
      modos.forEach(function (mo) {
        if (BRANDOS.indexOf(mo[0]) !== -1 || n.indexOf(' ' + mo[0] + ' ') === -1) return;
        duro = true;
        if (av.indexOf(mo[1]) === -1) av.push(mo[1]);
      });
      if (duro || k !== ultimaI) return;
      modos.forEach(function (mo) {
        if (BRANDOS.indexOf(mo[0]) !== -1 && n.indexOf(' ' + mo[0] + ' ') !== -1 && av.indexOf(mo[1]) === -1) av.push(mo[1]);
      });
    });
    var siglas = [];
    ['a', 'b', 'c', 'd', 'p2'].forEach(function (k) {
      (dob[k].match(/\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,6}\b/g) || []).forEach(function (s) { if (siglas.indexOf(s) === -1) siglas.push(s); });
    });
    var out = [];
    if (av.length) out.push(['Modo de morrer, não causa', 'Troque por a doença que levou a isso: ' + av.join(', ') + '.']);
    if (siglas.length) out.push(['Siglas', 'Escreva por extenso: ' + siglas.join(', ') + '.']);
    if (linhasI.length === 1 && av.length) out.push(['Falta a causa básica', 'Só a linha a está preenchida e ela é um modo de morrer: acrescente o que causou isso nas linhas de baixo.']);
    ['a', 'b', 'c', 'd'].forEach(function (k, i) {
      if (i > 0 && dob[k].trim() && !dob[['a', 'b', 'c', 'd'][i - 1]].trim()) out.push(['Linha pulada', 'A linha ' + k + ' está preenchida e a de cima não: a cadeia tem de ser contínua, de a até a causa básica.']);
    });
    ['a', 'b', 'c', 'd', 'p2'].forEach(function (k) {
      if (dob[k].trim() && !dob['t' + k].trim()) { if (!out.some(function (o) { return o[0] === 'Intervalo'; })) out.push(['Intervalo', 'Informe o tempo aproximado entre o início de cada condição e a morte.']); }
    });
    return out;
  }
  function textoObito() {
    var t = 'DECLARAÇÃO DE ÓBITO — rascunho das causas da morte\n\nPARTE I\n';
    var ks = ['a', 'b', 'c', 'd'].filter(function (k) { return dob[k].trim(); });
    if (!ks.length) t += 'a) ________________\n';
    ks.forEach(function (k, i) {
      t += k + ') ' + dob[k].trim() + (dob['t' + k].trim() ? ' — ' + dob['t' + k].trim() : '') + '\n';
      if (i < ks.length - 1) t += '   devido ou como consequência de\n';
    });
    t += '\nPARTE II\n' + (dob.p2.trim() ? dob.p2.trim() + (dob.tp2.trim() ? ' — ' + dob.tp2.trim() : '') : '—') + '\n';
    if (ks.length) t += '\nCausa básica (última linha da Parte I): ' + dob[ks[ks.length - 1]].trim() + '\n';
    return t;
  }
  function telaObito() {
    if (!temDoc()) return '';
    var D = FERR_DOC_OBITO;
    var html = '<div class="doc">';
    html += '<div class="doc-sub">Quem preenche</div>';
    html += D.quem.map(function (q) {
      return '<div class="el-status ' + q.c + ' doc-quem"><b>' + ricoDoc(q.t) + '</b><span>' + ricoDoc(q.x) + '</span></div>';
    }).join('');
    html += listaDoc('Parte I — a sequência que levou à morte', D.parte1);
    html += listaDoc('Parte II — o que contribuiu', D.parte2);
    html += '<div class="el-lista grave"><b>Não escrever como causa (é o modo de morrer)</b><ul><li>' +
      (typeof FERR_DOC_MODOS !== 'undefined' ? FERR_DOC_MODOS : []).filter(function (m, i, arr) {
        return ['pcr', 'falencia multipla', 'falencia'].indexOf(m[0]) === -1;
      }).map(function (m) { return esc(m[1]); }).join(' · ') + '</li></ul></div>';
    html += '<div class="el-lista"><b>Exemplo</b><ul>' + D.exemplo.map(function (e) {
      return '<li><b class="doc-ex">' + esc(e[0] === 'II' ? 'Parte II' : e[0] + ')') + '</b> ' + esc(e[1]) + ' <i class="doc-int">' + esc(e[2]) + '</i></li>';
    }).join('') + '</ul></div>';
    html += listaDoc('Regras que evitam a DO devolvida', D.regras, 'atencao');

    html += '<div class="doc-sub">Rascunho das causas — confira antes de passar a limpo</div>';
    html += '<div class="at"><div class="at-form"><div class="ferr-campos doc-causas">';
    ['a', 'b', 'c', 'd'].forEach(function (k) {
      html += campoDoc('dob', k, 'Parte I — linha ' + k + (k === 'a' ? ' (causa direta)' : ''), dob[k], { ph: k === 'a' ? 'Ex.: Choque séptico' : 'devido a…' }) +
        campoDoc('dob', 't' + k, 'Intervalo', dob['t' + k], { ph:'horas, dias, anos' });
    });
    html += campoDoc('dob', 'p2', 'Parte II', dob.p2, { ph:'Ex.: Diabetes mellitus tipo 2' }) +
      campoDoc('dob', 'tp2', 'Intervalo', dob.tp2, { ph:'anos' });
    html += '</div><button type="button" class="ferr-btn peq" data-acao="dob-exemplo">Carregar o exemplo</button></div>';
    html += '<div class="at-saida" id="docSaida">' + saidaDoc('dob') + '</div></div>';
    html += '<p class="ferr-nota doc-fonte">' + esc(D.fonte) + '. Este é um rascunho de apoio: vale o formulário oficial e o manual do Ministério da Saúde.</p>';
    return html + '</div>';
  }

  /* ---------- notificação compulsória ---------- */
  var ntBusca = '';
  var GRUPOS_NT = [
    ['ms', 'Imediata (até 24 h) — Ministério, Estado e Município', 'grave'],
    ['ses', 'Imediata (até 24 h) — Estado e Município', 'grave'],
    ['sms', 'Imediata (até 24 h) — Município', 'atencao'],
    ['sem', 'Semanal', '']
  ];
  function listaNotif() {
    if (typeof FERR_DOC_NOTIF === 'undefined') return '';
    var q = norm(ntBusca).trim();
    var itens = FERR_DOC_NOTIF.itens.filter(function (x) { return !q || norm(x[0] + ' ' + (x[2] || '')).indexOf(q) !== -1; });
    if (!itens.length) return '<p class="ferr-nota">Nada com "' + esc(ntBusca) + '". Confira o nome na lista oficial.</p>';
    return GRUPOS_NT.map(function (g) {
      var l = itens.filter(function (x) { return x[1] === g[0]; });
      if (!l.length) return '';
      return '<div class="el-lista' + (g[2] ? ' ' + g[2] : '') + '"><b>' + esc(g[1]) + ' · ' + l.length + '</b><ul>' +
        l.map(function (x) { return '<li>' + esc(x[0]) + (x[2] ? '<br><i class="doc-int">' + esc(x[2]) + '</i>' : '') + '</li>'; }).join('') +
      '</ul></div>';
    }).join('');
  }
  function telaNotificacao() {
    if (typeof FERR_DOC_NOTIF === 'undefined') return '';
    var N = FERR_DOC_NOTIF;
    var html = '<div class="doc">';
    html += listaDoc('Como notificar', N.regras, 'atencao');
    html += '<input type="search" class="ferr-busca-local doc-busca" data-nt="busca" placeholder="Buscar agravo — ex.: dengue, meningite, violência" value="' + esc(ntBusca) + '">';
    html += '<div id="docNotif">' + listaNotif() + '</div>';
    html += '<p class="ferr-nota doc-fonte">Lista Nacional de Notificação Compulsória — ' + esc(N.portaria) + '. Estados e municípios podem acrescentar agravos: confira a lista local.</p>';
    return html + '</div>';
  }

  function saidaDoc(pref) {
    if (pref === 'ph') return '<pre class="at-texto">' + esc(textoPlantao()) + '</pre>' + barraDoc('ph', 'passagem');
    if (pref === 'rg') return '<pre class="at-texto">' + esc(textoRegulacao()) + '</pre>' + barraDoc('rg', 'regulação');
    if (pref === 'dob') {
      var av = avisosObito();
      return (av.length ? av.map(function (a) {
        return '<div class="el-alerta">' + ICO('alerta') + '<div><b>' + esc(a[0]) + '</b>' + esc(a[1]) + '</div></div>';
      }).join('') : '') +
        '<pre class="at-texto">' + esc(textoObito()) + '</pre>' + barraDoc('dob', 'causas');
    }
    return '';
  }
  function repintaDoc(pref) {
    var el = document.getElementById('docSaida');
    if (el) el.innerHTML = saidaDoc(pref);
  }

  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el || !el.dataset) return;
    var d = el.dataset;
    if (d.ph !== undefined) {
      if (d.ph === 'para') ph.para = el.value;
      else if (d.ph === 'sint') ph.pacs[ph.at].sint = el.checked;
      else ph.pacs[ph.at][d.ph] = el.value;
      repintaDoc('ph'); return;
    }
    if (d.rg !== undefined) { rg[d.rg] = el.value; repintaDoc('rg'); return; }
    if (d.rgchk !== undefined) { rg.chk[d.rgchk] = el.checked; repintaDoc('rg'); return; }
    if (d.dob !== undefined) { dob[d.dob] = el.value; repintaDoc('dob'); return; }
    if (d.nt !== undefined) {
      ntBusca = el.value;
      var box = document.getElementById('docNotif');
      if (box) box.innerHTML = listaNotif();
    }
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-acao]');
    if (!b || !dentro(e)) return;
    var a = b.dataset.acao, v = b.dataset.v;
    if (!/^(ph|rg|dob)-/.test(a)) return;
    /* passagem */
    if (a === 'ph-pac')  { ph.at = parseInt(v, 10) || 0; redesenhaFixo(); return; }
    if (a === 'ph-novo') { ph.pacs.push(pacNovo()); ph.at = ph.pacs.length - 1; redesenhaFixo(); return; }
    if (a === 'ph-grav') { ph.pacs[ph.at].grav = v; redesenhaFixo(); return; }
    if (a === 'ph-del')  {
      if (ph.pacs.length < 2 || !confirm('Remover este paciente da passagem?')) return;
      ph.pacs.splice(ph.at, 1); ph.at = Math.max(0, ph.at - 1); redesenhaFixo(); return;
    }
    if (a === 'ph-copiar')   { copiar(textoPlantao(), 'Passagem de plantão'); return; }
    if (a === 'ph-imprimir') { imprimir('Passagem de plantão', textoPlantao().replace(/^PASSAGEM DE PLANTÃO — [^\n]*\n/, '')); return; }
    if (a === 'ph-rascunho') { pilha(textoPlantao()); return; }
    if (a === 'ph-limpar')   {
      if (!confirm('Apagar todos os pacientes desta passagem?')) return;
      ph = { para:'', pacs:[pacNovo()], at:0 }; redesenhaFixo(); return;
    }
    /* regulação */
    if (a === 'rg-isol')     { rg.isol = v; redesenhaFixo(); return; }
    if (a === 'rg-copiar')   { copiar(textoRegulacao(), 'Texto da regulação'); return; }
    if (a === 'rg-imprimir') { imprimir('Solicitação de regulação', textoRegulacao().replace(/^SOLICITAÇÃO[^\n]*\n\n/, '')); return; }
    if (a === 'rg-rascunho') { pilha(textoRegulacao()); return; }
    if (a === 'rg-limpar')   { if (!confirm('Limpar todos os campos da regulação?')) return; rg = rgNovo(); redesenhaFixo(); return; }
    /* óbito */
    if (a === 'dob-exemplo') {
      var ex = temDoc() ? FERR_DOC_OBITO.exemplo : [];
      dob = dobNovo();
      ex.forEach(function (x) { var k = x[0] === 'II' ? 'p2' : x[0]; dob[k] = x[1]; dob['t' + k] = x[2]; });
      redesenhaFixo(); return;
    }
    if (a === 'dob-copiar')   { copiar(textoObito(), 'Causas da morte'); return; }
    if (a === 'dob-imprimir') { imprimir('Declaração de óbito — rascunho das causas', textoObito().replace(/^DECLARAÇÃO[^\n]*\n\n/, '')); return; }
    if (a === 'dob-rascunho') { pilha(textoObito()); return; }
    if (a === 'dob-limpar')   { dob = dobNovo(); redesenhaFixo(); return; }
  });

  /* ---------- manobras e sinais ---------- */
  function telaManobras() {
    var itens = Base.exame();
    var sistemas = [];
    itens.forEach(function (i) { if (sistemas.indexOf(i.sistema) === -1) sistemas.push(i.sistema); });
    var mostra = filtroEx === 'todos' ? itens : itens.filter(function (i) { return i.sistema === filtroEx; });

    var chips = ['<button type="button" class="ferr-chip' + (filtroEx === 'todos' ? ' on' : '') +
                 '" data-acao="ex-filtro" data-v="todos">Todos</button>']
      .concat(sistemas.map(function (s) {
        return '<button type="button" class="ferr-chip' + (filtroEx === s ? ' on' : '') +
               '" data-acao="ex-filtro" data-v="' + esc(s) + '">' + esc(s) + '</button>';
      })).join('');

    var html = '<div class="ferr-bloco">' +
      '<div class="ferr-bloco-topo"><h3>Manobras e sinais</h3>' +
        (modoAutor() ? '<div class="ferr-mini">' +
          '<button type="button" class="ferr-btn peq forte" data-acao="ex-novo">+ Nova manobra</button>' +
          '<button type="button" class="ferr-btn peq" data-acao="ex-restaurar">Restaurar padrão</button>' +
        '</div>' : '') +
      '</div>' +
      '<p class="ferr-nota">Achado positivo do exame dirigido, já em frase de prontuário. Tocar copia.</p>' +
      '<div class="ferr-chips">' + chips + '</div>';

    if (form === 'exame') html += formExame(form_alvo);

    html += '<div class="ferr-lista-ex">' + mostra.map(function (i) {
      return '<div class="ferr-ex" data-id="' + esc(i.id) + '">' +
        '<button type="button" class="ferr-ex-corpo" data-acao="ex-copiar" data-id="' + esc(i.id) + '">' +
          '<span class="ferr-ex-nome">' + esc(i.nome) + '</span>' +
          '<span class="ferr-ex-desc">' + esc(i.sistema) + (i.desc ? ' · ' + esc(i.desc) : '') + '</span>' +
        '</button>' +
        '<div class="ferr-card-acoes">' +
          '<button type="button" title="Empilhar" data-acao="ex-empilhar" data-id="' + esc(i.id) + '">+</button>' +
          '<button type="button" title="Editar" data-acao="ex-editar" data-id="' + esc(i.id) + '"'+ICO('lapis')+'</button>' +
          '<button type="button" title="Apagar" data-acao="ex-apagar" data-id="' + esc(i.id) + '"'+ICO('fechar')+'</button>' +
        '</div>' +
      '</div>';
    }).join('') + '</div></div>';
    return html;
  }

  function formExame(i) {
    i = i || { sistema: '', nome: '', desc: '', texto: '' };
    return '<form class="ferr-form" data-form="exame" data-id="' + esc(i.id || '') + '">' +
      '<h3>' + (i.id ? 'Editar' : 'Nova') + ' manobra</h3>' +
      campo('sistema', 'Sistema (agrupa os chips)', i.sistema) +
      campo('nome', 'Nome da manobra ou sinal', i.nome) +
      campo('desc', 'Descrição curta', i.desc) +
      campo('texto', 'Frase para o prontuário', i.texto, 'area') +
      '<div class="ferr-form-acoes">' +
        '<button type="submit" class="ferr-btn forte">Salvar</button>' +
        btn('form-fechar', 'Cancelar') +
      '</div>' +
    '</form>';
  }

  /* =========================================================
     CALCULADORAS
     ========================================================= */
  function calcDe(id) {
    for (var i = 0; i < FERR_CALC.length; i++) if (FERR_CALC[i].id === id) return FERR_CALC[i];
    return null;
  }

  /* devolve {valor, classe, detalhe} ou null se faltar dado */
  function calcResultado(c) {
    var v = calcVal[c.id] || {};
    if (c.tipo === 'formula') {
      var dados = {}, faltou = false;
      c.campos.forEach(function (cp) {
        var bruto = v[cp.k];
        if (bruto === undefined || bruto === '') { if (!cp.opcional) faltou = true; return; }
        if (cp.data || cp.opcoes) dados[cp.k] = bruto;
        else {
          var n = num(bruto);
          if (n === null) { faltou = true; return; }
          dados[cp.k] = n;
        }
      });
      if (faltou) return null;
      try { return virgula(c.calc(dados)); } catch (e) { return null; }
    }
    /* escore */
    var total = 0, respondeu = false, faltando = 0;
    c.itens.forEach(function (it, i) {
      var r = v['i' + i];
      if (c.seletor || it.opcoes) {
        if (r === undefined || r === '') { faltando++; return; }
        respondeu = true;
        total += num(r) || 0;
      } else if (r) {
        respondeu = true;
        total += it.pts;
      }
    });
    /* escore longo so mostra resultado com tudo respondido: parcial engana */
    if (c.exige && faltando) return null;
    if (c.seletor && !respondeu) return null;
    total = Math.round(total * 10) / 10;
    return virgula(c.faixa(total));
  }

  /* numero brasileiro: 1.44 vira 1,44 */
  function virgula(r) {
    if (r && r.valor) r.valor = String(r.valor).replace(/(\d)\.(\d)/g, '$1,$2');
    return r;
  }

  function textoResultado(c, r) {
    return c.nome + ': ' + r.valor + (r.detalhe ? ' — ' + r.detalhe : '');
  }

  /* celular: pergunta com as respostas à vista, um toque em vez de abrir lista */
  var focoHash = '', yLista = 0;
  function celCalc() { return !!(window.matchMedia && window.matchMedia('(max-width:760px)').matches); }
  function perguntaCalc(c, k, rot, opcoes, val) {
    var curtas = opcoes.length <= 3 && opcoes.every(function (o) { return String(o[1]).length <= 14; });
    return '<fieldset class="cc-q' + (val !== '' ? ' ok' : '') + '"><legend>' + esc(rot) + '</legend>' +
      '<div class="cc-ops' + (curtas ? ' lado' : '') + '">' + opcoes.map(function (o) {
        return '<label class="cc-op"><input type="radio" name="cc-' + esc(c.id) + '-' + k + '" data-calc="' + c.id + '" data-k="' + k + '" value="' + esc(o[0]) + '"' +
          (String(val) === String(o[0]) ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>';
      }).join('') + '</div></fieldset>';
  }

  function calcCorpo(c) {
    var v = calcVal[c.id] || {};
    var cel = celCalc();
    var html = '<div class="ferr-calc-corpo">';
    if (c.quando) html += '<p class="ferr-quando">' + esc(c.quando) + '</p>';

    if (c.tipo === 'formula') {
      html += '<div class="ferr-campos">' + c.campos.map(function (cp) {
        var val = v[cp.k] === undefined ? '' : v[cp.k];
        if (cp.opcoes && cel && cp.opcoes.length <= 6) return '<div class="ferr-campo larga">' + perguntaCalc(c, cp.k, cp.rot, cp.opcoes, val) + '</div>';
        if (cp.opcoes) {
          return '<label class="ferr-campo"><span>' + esc(cp.rot) + '</span><select data-calc="' + c.id + '" data-k="' + cp.k + '">' +
            '<option value="">Selecione</option>' +
            cp.opcoes.map(function (o) {
              return '<option value="' + esc(o[0]) + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
            }).join('') + '</select></label>';
        }
        if (cp.data) {
          return '<label class="ferr-campo"><span>' + esc(cp.rot) + '</span>' +
            '<input type="date" data-calc="' + c.id + '" data-k="' + cp.k + '" value="' + esc(val) + '"></label>';
        }
        return '<label class="ferr-campo"><span>' + esc(cp.rot) + '</span>' +
          '<input type="number" inputmode="decimal" step="' + (cp.passo || 1) + '"' +
          (cp.min !== undefined ? ' min="' + cp.min + '"' : '') +
          (cp.max !== undefined ? ' max="' + cp.max + '"' : '') +
          ' data-calc="' + c.id + '" data-k="' + cp.k + '" value="' + esc(val) + '"></label>';
      }).join('') + '</div>';

    } else if (c.seletor && cel) {
      html += '<div class="cc-qs">' + c.itens.map(function (it, i) {
        return perguntaCalc(c, 'i' + i, it.rot, it.opcoes, v['i' + i] === undefined ? '' : v['i' + i]);
      }).join('') + '</div>';

    } else if (c.seletor) {
      html += '<div class="ferr-campos">' + c.itens.map(function (it, i) {
        var val = v['i' + i] === undefined ? '' : v['i' + i];
        return '<label class="ferr-campo larga"><span>' + esc(it.rot) + '</span>' +
          '<select data-calc="' + c.id + '" data-k="i' + i + '"><option value="">Selecione</option>' +
          it.opcoes.map(function (o) {
            return '<option value="' + esc(o[0]) + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
          }).join('') + '</select></label>';
      }).join('') + '</div>';

    } else {
      html += '<div class="ferr-itens">' + c.itens.map(function (it, i) {
        var on = !!v['i' + i];
        return '<label class="ferr-item' + (on ? ' on' : '') + '">' +
          '<input type="checkbox" data-calc="' + c.id + '" data-k="i' + i + '"' + (on ? ' checked' : '') + '>' +
          '<span class="ferr-item-rot">' + esc(it.rot) + '</span>' +
          '<span class="ferr-item-pts">' + (it.pts > 0 ? '+' : '') + String(it.pts).replace('.', ',') + '</span>' +
        '</label>';
      }).join('') + '</div>';
    }

    var r = calcResultado(c);
    if (r) {
      html += '<div class="ferr-res ' + esc(r.classe) + '">' +
        '<div class="ferr-res-num">' + esc(r.valor) + '</div>' +
        (r.detalhe ? '<div class="ferr-res-txt">' + esc(r.detalhe) + '</div>' : '') +
        '<div class="ferr-res-acoes">' +
          '<button type="button" class="ferr-btn peq forte" data-acao="calc-copiar" data-id="' + c.id + '">Copiar</button>' +
          '<button type="button" class="ferr-btn peq" data-acao="calc-limpar" data-id="' + c.id + '">Limpar</button>' +
        '</div>' +
      '</div>';
    } else {
      html += '<div class="ferr-res vazio">' +
        (c.exige ? 'Responda todos os itens para ver o resultado.' : 'Preencha os campos para ver o resultado.') +
      '</div>';
    }
    /* limitações e fonte ficam num toque: o resultado vem primeiro */
    if (c.limites || c.fonte) {
      html += '<details class="ferr-mais"><summary>' + ICO('setaDir') + (c.limites ? 'Limitações e fonte' : 'Fonte') + '</summary>' +
        (c.limites ? '<div class="ferr-limites">' + esc(c.limites) + '</div>' : '') +
        (c.fonte ? '<p class="ferr-fonte">Fonte: ' + esc(c.fonte) + '</p>' : '') +
      '</details>';
    }
    return html + '</div>';
  }

  /* escore de caixa soma 0 sem ninguem ter mexido; o selo so aparece
     depois de interacao, senao toda a lista fecha com um "0" verde falso.
     Dentro do corpo o zero continua valendo (PERC e NEXUS negativos). */
  function tocado(c) {
    var v = calcVal[c.id];
    if (!v) return false;
    for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k)) return true;
    return false;
  }

  /* um cartao de calculadora/escore */
  function cartaoCalc(c) {
    var aberta = calcAberta === c.id;
    var r = tocado(c) ? calcResultado(c) : null;
    var n = (c.tipo === 'escore') ? (c.itens || []).length : (c.campos || []).length;
    return '<section class="ferr-calc cc' + (aberta ? ' aberta' : '') + '">' +
      '<button type="button" class="ferr-calc-topo" data-acao="calc-abrir" data-id="' + c.id + '">' +
        '<span class="ferr-calc-nome">' + esc(c.nome) +
          '<span class="ferr-calc-sub">' + esc(c.sub) + '</span></span>' +
        (r ? '<span class="ferr-calc-badge ' + esc(r.classe) + '">' + esc(r.valor) + '</span>'
           : '<span class="cc-n">' + n + (n === 1 ? ' campo' : ' campos') + '</span>') +
        '<span class="ferr-calc-seta">' + ICO(aberta ? 'setaBai' : 'setaDir') + '</span>' +
      '</button>' +
      (aberta ? calcCorpo(c) : '') +
    '</section>';
  }

  /* quantas vezes cada escore foi aberto: alimenta "mais usados" */
  function usoCalc() { var v = ler('ferr:uso-calc', {}); return (v && typeof v === 'object') ? v : {}; }
  function marcaUso(id) {
    var u = usoCalc(); u[id] = (u[id] || 0) + 1; grava('ferr:uso-calc', u);
  }
  /* o que o plantão abre mais, até haver histórico próprio */
  var CALC_COMUNS = ['glasgow','qsofa','curb65','heart','wells-tep','cha2ds2vasc','news2','sofa'];
  function maisUsados(lista) {
    var u = usoCalc();
    var com = lista.filter(function (c) { return u[c.id]; })
      .sort(function (a, b) { return u[b.id] - u[a.id]; });
    if (com.length >= 4) return com.slice(0, 6);
    /* completa com os comuns, sem repetir */
    var out = com.slice(0);
    CALC_COMUNS.forEach(function (id) {
      if (out.length >= 6) return;
      lista.forEach(function (c) {
        if (c.id === id && out.indexOf(c) === -1) out.push(c);
      });
    });
    return out.slice(0, 6);
  }

  function telaCalculadoras(tipo, nu) {
    /* `secao` decide onde o item aparece; `tipo` decide como ele calcula.
       MELD, PESI, PSI, Blatchford e Baux calculam por formula mas sao escores. */
    var lista = tipo ? FERR_CALC.filter(function (c) { return (c.secao || c.tipo) === tipo; }) : FERR_CALC;
    var ramos = (window.FERR_RAMOS || []).filter(function (g) {
      return lista.some(function (c) { return c.ramo === g.id; });
    });
    var html = nu ? '' : cabecalho(abaDe('calculadoras'));

    /* celular: o escore aberto ocupa a tela sozinho, com volta para a lista */
    if (calcAberta && celCalc() && focoHash !== location.hash) calcAberta = null;
    var foco = calcAberta && celCalc() && lista.filter(function (c) { return c.id === calcAberta; })[0];
    if (foco) {
      return html + '<div class="cc-foco">' +
        '<button type="button" class="cc-voltar" data-acao="calc-abrir" data-id="' + esc(foco.id) + '">' + ICO('setaEsq') +
          (tipo === 'escore' ? 'Todos os scores' : 'Todas as calculadoras') + '</button>' +
        '<section class="ferr-calc cc aberta cc-isolado">' +
          '<header class="cc-foco-cab"><h2>' + esc(foco.nome) + '</h2>' + (foco.sub ? '<p>' + esc(foco.sub) + '</p>' : '') + '</header>' +
          calcCorpo(foco) +
        '</section></div>';
    }

    /* 1. atalho para o que se abre mais */
    var top = maisUsados(lista);
    if (top.length && !buscaCalc && filtroRamo === 'todos') {
      html += '<div class="cc-topo"><h4>' + ICO('estrela') + 'Mais usados</h4>' +
        '<div class="cc-atalhos">' + top.map(function (c) {
          return '<button type="button" class="cc-atalho' + (calcAberta === c.id ? ' on' : '') +
            '" data-acao="calc-abrir" data-id="' + esc(c.id) + '">' + esc(c.nome) + '</button>';
        }).join('') + '</div></div>';
    }

    /* 2. busca local */
    html += '<input type="search" class="ferr-busca-local" id="ferrBuscaCalc" ' +
      'placeholder="Buscar por nome, sigla ou quando usar\u2026" value="' + esc(buscaCalc) + '">';

    /* 3. filtro por ramo */
    if (ramos.length > 1) {
      html += '<div class="ferr-chips tira">' +
        '<button type="button" class="ferr-chip' + (filtroRamo === 'todos' ? ' on' : '') +
          '" data-acao="calc-ramo" data-v="todos">Todos <i>' + lista.length + '</i></button>' +
        ramos.map(function (g) {
          var n = lista.filter(function (c) { return c.ramo === g.id; }).length;
          return '<button type="button" class="ferr-chip' + (filtroRamo === g.id ? ' on' : '') +
            '" data-acao="calc-ramo" data-v="' + esc(g.id) + '">' +
            ICO(g.icone) + esc(g.nome) + ' <i>' + n + '</i></button>';
        }).join('') + '</div>';
    }

    html += '<div id="ferrListaCalc">' + listaCalc(lista, ramos) + '</div>';
    if (!nu) html += bancada('calculadoras');
    return html;
  }

  /* filtro + grade; o item aberto ocupa a linha inteira */
  function listaCalc(lista, ramos) {
    var termo = norm(buscaCalc);
    var vis = lista.filter(function (c) {
      if (filtroRamo !== 'todos' && c.ramo !== filtroRamo) return false;
      if (!termo) return true;
      return norm([c.nome, c.sub, c.quando, c.fonte].join(' ')).indexOf(termo) !== -1;
    });
    if (!vis.length) {
      return '<div class="ferr-vazio">Nada encontrado. Tente pelo nome, pela sigla ou por quando se usa.</div>';
    }
    /* sem filtro nem busca, mantém a leitura por ramo */
    if (filtroRamo === 'todos' && !termo && ramos.length > 1) {
      var h = '';
      ramos.forEach(function (g) {
        var doRamo = vis.filter(function (c) { return c.ramo === g.id; });
        if (!doRamo.length) return;
        h += '<section class="cc-ramo"><h4>' + ICO(g.icone) + esc(g.nome) +
             '<i>' + doRamo.length + '</i></h4>' +
             '<div class="cc-grade">' + doRamo.map(cartaoCalc).join('') + '</div></section>';
      });
      var soltos = vis.filter(function (c) { return !c.ramo; });
      if (soltos.length) {
        h += '<section class="cc-ramo"><h4>' + ICO('calc') + 'Outros<i>' + soltos.length + '</i></h4>' +
             '<div class="cc-grade">' + soltos.map(cartaoCalc).join('') + '</div></section>';
      }
      return h;
    }
    return '<div class="cc-grade">' + vis.map(cartaoCalc).join('') + '</div>';
  }

  /* =========================================================
     PEDIATRIA — dose por quilo com faixa etária
     O peso vem do campo global do topo (#peso), para nao existir
     um segundo estado de peso no aplicativo.
     ========================================================= */
  var filtroRamo = 'todos';   /* ramo filtrado nos escores */
  var buscaCalc  = '';        /* busca local dos escores */
  var filtroPedia = 'todos';
  /* concentração da apresentação em uso, quando o serviço tem outra.
     Só na sessão: não altera o dado da medicação. */
  var concPed = {};   /* { medId: mg/mL } */
  var buscaPedia  = '';
  var pedAberto = null;   /* medicação expandida na lista */

  function pesoGlobal() {
    var el = document.getElementById('peso');
    var n = el ? parseFloat(String(el.value).replace(',', '.')) : NaN;
    return (isFinite(n) && n > 0 && n <= 150) ? n : null;
  }
  function idadePedia() {
    var v = ler('pedia-idade', '');
    var n = parseFloat(String(v).replace(',', '.'));
    return (isFinite(n) && n >= 0 && n <= 216) ? n : null;
  }
  function idadeTexto(m) {
    if (m === null) return '';
    if (m < 24) return m + (m === 1 ? ' mês' : ' meses');
    var a = Math.floor(m / 12), r = Math.round(m % 12);
    return a + (a === 1 ? ' ano' : ' anos') + (r ? ' e ' + r + (r === 1 ? ' mês' : ' meses') : '');
  }
  /* o medicamento e proibido nesta idade? */
  function vetado(m, idade) {
    if (idade === null || !m.veto) return false;
    return idade < m.veto.meses;
  }

  function concDe(m, d) {
    var c = concPed[m.id];
    return (c && isFinite(c) && c > 0) ? c : d.conc;
  }

  /* calcula uma linha de dose para o peso informado */
  function calcPedia(d, kg, conc) {
    if (conc === undefined) conc = d.conc;
    if (!kg || d.mgkg == null) return null;
    /* unid mL com conc 1000: o valor por kg já é mL/kg (SRO 75 mL/kg) — o resultado
       é volume, não "mg ÷ 1000" (antes saía 1,13 mL em vez de 1.125 mL para 15 kg) */
    if (d.unid === 'mL' && d.conc === 1000) {
      var ml = function (x) { return String(Math.round(x)).replace('.', ','); };
      var v = ml(kg * d.mgkg) + (d.mgkgMax && d.mgkgMax !== d.mgkg ? ' a ' + ml(kg * d.mgkgMax) : '') + ' mL';
      return { mg:v, vol:'', limitou:false };
    }
    var mg = kg * d.mgkg;
    var mgAlto = d.mgkgMax && d.mgkgMax !== d.mgkg ? kg * d.mgkgMax : null;
    var limitou = false;
    if (d.maxMg && mg > d.maxMg) { mg = d.maxMg; limitou = true; }
    if (d.maxMg && mgAlto && mgAlto > d.maxMg) { mgAlto = d.maxMg; limitou = true; }
    function br(x) { return String(x).replace('.', ','); }
    function nm(x) { return br(x >= 100 ? Math.round(x) : (Math.round(x * 100) / 100)); }
    var un = d.unid === 'UI' ? ' UI' : ' mg';
    var txt = nm(mg) + (mgAlto ? ' a ' + nm(mgAlto) : '') + un;
    var vol = '';
    if (conc) {
      var v1 = mg / conc, v2 = mgAlto ? mgAlto / conc : null;
      function nv(x) { return br(x >= 10 ? Math.round(x * 10) / 10 : Math.round(x * 100) / 100); }
      vol = nv(v1) + (v2 ? ' a ' + nv(v2) : '') + ' mL';
    }
    return { mg:txt, vol:vol, limitou:limitou };
  }

  /* apresentação em uso: campo editável mais atalho para as que a
     própria medicação documenta. Nada é inventado aqui. */
  function seletorConc(m, d) {
    var atual = concDe(m, d);
    var mexeu = concPed[m.id] && concPed[m.id] !== d.conc;
    return '<div class="pd-apres-sel' + (mexeu ? ' mexido' : '') + '">' +
      '<span>Apresentação</span>' +
      '<input type="number" inputmode="decimal" step="0.1" min="0.01" ' +
        'data-conc="' + esc(m.id) + '" value="' + atual + '"><i>mg/mL</i>' +
      ((m.alt || []).length
        ? '<span class="pd-alt">' + m.alt.map(function (a) {
            return '<button type="button" class="pd-alt-b' + (+a[0] === +atual ? ' on' : '') +
              '" data-acao="pedia-conc" data-id="' + esc(m.id) + '" data-v="' + a[0] + '">' +
              esc(a[1]) + '</button>';
          }).join('') + '</span>'
        : '') +
      (mexeu ? '<button type="button" class="pd-alt-b volta" data-acao="pedia-conc" ' +
                 'data-id="' + esc(m.id) + '" data-v="">Original</button>' : '') +
    '</div>';
  }

  /* uma linha por medicação: dose calculada à vista e Copiar direto;
     o detalhe (faixa, teto, apresentação, observações) abre ao clicar */
  function doseResumo(m, kg) {
    var d = (m.doses || [])[0];
    if (!d) return '';
    var r = calcPedia(d, kg, d.conc ? concDe(m, d) : undefined);
    if (r) return (r.vol ? r.vol + ' · ' : '') + r.mg + (d.freq ? ' · ' + d.freq : '');
    if (d.fixa) return d.fixa + (d.freq ? ' · ' + d.freq : '');
    return kg ? '' : 'informe o peso';
  }
  function textoPedia(m, kg) {
    var linhas = [m.nome + (m.apres ? ' — ' + m.apres : '')];
    (m.doses || []).forEach(function (d) {
      var r = calcPedia(d, kg, d.conc ? concDe(m, d) : undefined);
      linhas.push('  ' + d.rot + ': ' + (r ? (r.vol ? r.vol + ' (' + r.mg + ')' : r.mg) : (d.fixa || '')) +
        (d.freq ? ' — ' + d.freq : '') + (m.via ? ' — ' + m.via : ''));
    });
    if (kg) linhas.push('  (peso ' + String(kg).replace('.', ',') + ' kg)');
    return linhas.join('\n');
  }

  function cartaoPedia(m, kg, idade) {
    var veta = vetado(m, idade);
    var aberto = pedAberto === m.id;
    var resumo = veta ? 'não usar nesta idade' : doseResumo(m, kg);

    var html = '<section class="pdl' + (veta ? ' vetado' : '') + (aberto ? ' aberta' : '') + '">' +
      '<div class="pdl-linha">' +
        '<button type="button" class="pdl-abre" data-acao="pedia-abrir" data-id="' + esc(m.id) + '">' +
          '<span class="pdl-seta">' + ICO(aberto ? 'setaBai' : 'setaDir') + '</span>' +
          '<span class="pdl-nome">' + esc(m.nome) +
            '<i>' + esc(m.apres) + '</i></span>' +
          '<span class="pdl-via">' + esc(m.via) + '</span>' +
          '<span class="pdl-dose' + (veta ? ' ruim' : (kg ? '' : ' fraca')) + '">' + esc(resumo) + '</span>' +
        '</button>' +
        (veta ? '' :
          '<button type="button" class="rxl-btn forte" data-acao="pedia-copiar" data-id="' + esc(m.id) + '"' +
            ' title="Copiar e enviar ao rascunho">' + ICO('copiar') + '<i>Copiar</i></button>') +
      '</div>';

    if (!aberto) return html + '</section>';

    html += '<div class="pdl-corpo">' +
      '<p class="pd-idade' + (veta ? ' ruim' : '') + '">' + ICO(veta ? 'alerta' : 'crianca') +
        '<span>' + esc(m.idade) + '</span></p>';
    if (veta) html += '<div class="pd-veto"><b>Não usar nesta idade</b>' + esc(m.veto.txt) + '</div>';
    else if (m.veto) html += '<div class="pd-veto leve"><b>Restrição de idade</b>' + esc(m.veto.txt) + '</div>';

    html += '<div class="pd-doses">' + (m.doses || []).map(function (d) {
      var r = calcPedia(d, kg, d.conc ? concDe(m, d) : undefined);
      return '<div class="pd-dose">' +
        '<div class="pd-dose-cab"><b>' + esc(d.rot) + '</b>' +
          '<span class="pd-freq">' + esc(d.freq) + '</span></div>' +
        '<div class="pd-dose-linha">' +
          '<span class="pd-mgkg">' + (d.mgkg != null
              ? esc(String(d.mgkg).replace('.', ',') +
                  (d.mgkgMax && d.mgkgMax !== d.mgkg ? ' a ' + String(d.mgkgMax).replace('.', ',') : '') +
                  ' ' + (d.unid === 'UI' ? 'UI' : 'mg') + '/kg')
              : esc(d.fixa || '')) + '</span>' +
          (r ? '<span class="pd-calc">' + esc(r.mg) +
                 (r.vol ? ' &middot; <b>' + esc(r.vol) + '</b>' : '') +
                 (r.limitou ? ' <i>no teto</i>' : '') + '</span>'
             : (d.mgkg != null ? '<span class="pd-semkg">informe o peso</span>' : '')) +
        '</div>' +
        (d.maxMg ? '<span class="pd-max">Máximo ' + esc(String(d.maxMg).replace('.', ',')) +
                   (d.unid === 'UI' ? ' UI' : ' mg') + ' por dose</span>' : '') +
        (d.nota ? '<span class="pd-nota">' + esc(d.nota) + '</span>' : '') +
        (d.conc ? seletorConc(m, d) : '') +
      '</div>';
    }).join('') + '</div>';

    if (m.atencao) html += '<div class="ferr-atencao"><b>Atenção</b>' + esc(m.atencao) + '</div>';
    if ((m.obs || []).length) {
      html += '<ul class="pd-obs">' + m.obs.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>';
    }
    return html + '</div></section>';
  }

  function listaPedia() {
    var kg = pesoGlobal(), idade = idadePedia();
    var termo = norm(buscaPedia);
    var lista = FERR_PEDIA.filter(function (m) {
      if (filtroPedia !== 'todos' && m.grupo !== filtroPedia) return false;
      if (!termo) return true;
      var alvo = norm([m.nome, m.apres, m.via, m.idade,
        (m.doses || []).map(function (d) { return d.rot; }).join(' ')].join(' '));
      return alvo.indexOf(termo) !== -1;
    });
    if (!lista.length) return '<div class="ferr-vazio">Nenhuma medicação encontrada.</div>';

    var html = '';
    FERR_PEDIA_GRUPOS.forEach(function (g) {
      var doGrupo = lista.filter(function (m) { return m.grupo === g.id; });
      if (!doGrupo.length) return;
      html += '<div class="ferr-grupo ramo"><h4>' + ICO(g.icone) + esc(g.nome) +
              '<i>' + doGrupo.length + '</i></h4>' +
              doGrupo.map(function (m) { return cartaoPedia(m, kg, idade); }).join('') + '</div>';
    });
    return html;
  }

  /* banner de idade + lista: o unico pedaco que muda ao digitar peso ou idade */
  function corpoPedia() {
    var idade = idadePedia(), html = '';
    if (idade !== null) {
      var proibidos = FERR_PEDIA.filter(function (m) { return vetado(m, idade); });
      if (proibidos.length) {
        html += '<div class="pd-alerta-idade"><b>' + ICO('alerta') +
          'Com ' + esc(idadeTexto(idade)) + ', não use:</b> ' +
          proibidos.map(function (m) { return esc(m.nome); }).join(' &middot; ') + '</div>';
      }
    }
    return html + '<div id="ferrListaPed">' + listaPedia() + '</div>';
  }

  function telaPediatria() {
    var kg = pesoGlobal(), idade = idadePedia();

    var html = '<div class="pd-estado" role="status">' +
      ICO('crianca') + '<b>Pediatria</b>' +
      '<span class="pd-est-item' + (idade === null ? ' falta' : '') + '">' +
        (idade === null ? 'idade não informada' : idadeTexto(idade)) + '</span>' +
      '<span class="pd-est-item' + (kg === null ? ' falta' : '') + '">' +
        (kg === null ? 'peso não informado' : String(kg).replace('.', ',') + ' kg') + '</span>' +
    '</div>' +
    '<div class="pd-barra">' +
      '<label class="pd-campo"><span>Peso</span>' +
        '<input type="number" inputmode="decimal" step="0.1" min="0.5" max="150" id="ferrPesoPed" ' +
        'placeholder="kg" value="' + (kg === null ? '' : kg) + '"><i>kg</i></label>' +
      '<label class="pd-campo"><span>Idade</span>' +
        '<input type="number" inputmode="numeric" step="1" min="0" max="216" id="ferrIdadePed" ' +
        'placeholder="meses" value="' + (idade === null ? '' : idade) + '"><i>meses</i></label>' +
      '<span class="pd-idade-txt" id="ferrIdadeTxt"' + (idade === null ? ' hidden' : '') + '>' +
        esc(idadeTexto(idade)) + '</span>' +
    '</div>';

    html += '<input type="search" class="ferr-busca-local" id="ferrBuscaPed" ' +
      'placeholder="Buscar medicação, via ou indicação…" value="' + esc(buscaPedia) + '">';

    html += '<div class="ferr-chips tira">' +
      '<button type="button" class="ferr-chip' + (filtroPedia === 'todos' ? ' on' : '') +
        '" data-acao="pedia-filtro" data-v="todos">Todas <i>' + FERR_PEDIA.length + '</i></button>' +
      FERR_PEDIA_GRUPOS.map(function (g) {
        var n = FERR_PEDIA.filter(function (m) { return m.grupo === g.id; }).length;
        if (!n) return '';
        return '<button type="button" class="ferr-chip' + (filtroPedia === g.id ? ' on' : '') +
          '" data-acao="pedia-filtro" data-v="' + esc(g.id) + '">' + esc(g.nome) + ' <i>' + n + '</i></button>';
      }).join('') + '</div>';

    html += '<div id="ferrPediaCorpo">' + corpoPedia() + '</div>';

    /* tabela do que nao se usa por idade */
    html += '<div class="pd-vetos"><h4>' + ICO('perigo') + 'Não use nesta faixa etária</h4>' +
      FERR_PEDIA_VETOS.map(function (v) {
        return '<div class="pd-veto-item"><b>' + esc(v.nome) + '</b>' +
          '<span class="pd-veto-faixa">' + esc(v.faixa) + '</span>' +
          '<span class="pd-veto-txt">' + esc(v.txt) + '</span></div>';
      }).join('') + '</div>';

    html += '<p class="ferr-fonte">Doses de referência para pronto-socorro pediátrico. ' +
      'A apresentação varia por fabricante — confira a concentração do frasco antes de prescrever o volume.</p>';
    return html;
  }

  /* =========================================================
     PRESCRICOES — motor comum (oral, IM, EV, HAS, psiquiatria)
     ========================================================= */
  var CFG = {
    oral: { titulo:'Prescrição oral', unidade:'', agrupa:'categoria', desfecho:false, tempo:false,
            cab:'RECEITUÁRIO — USO ORAL DOMICILIAR' },
    im:   { titulo:'Prescrição IM', unidade:'ampola', agrupa:null, desfecho:true, tempo:false,
            cab:'PRESCRIÇÃO — MEDICAÇÃO INTRAMUSCULAR NA UNIDADE' },
    ev:   { titulo:'Prescrição EV', unidade:'ampola', agrupa:'grupo', desfecho:true, tempo:true, ordem:true,
            cab:'PRESCRIÇÃO — MEDICAÇÃO ENDOVENOSA NA UNIDADE' },
    has:  { titulo:'Crise / ajuste de HAS', unidade:'comprimido', agrupa:'grupo', desfecho:true, tempo:false,
            cab:'PRESCRIÇÃO — ANTI-HIPERTENSIVO VIA ORAL' },
    psiq: { titulo:'Psiquiatria', unidade:'', agrupa:'via', desfecho:true, tempo:false,
            cab:'PRESCRIÇÃO — CONTENÇÃO QUÍMICA / PSIQUIATRIA' }
  };
  var DESFECHOS = ['Alta após a medicação', 'Reavaliação médica após a medicação',
                   'Manter em observação', 'Aguardar resultado de exames'];

  /* ---- prescricao oral: garante id em categoria e medicamento ---- */
  function po() {
    var d = Base.po(), mudou = false;
    d.forEach(function (cat) {
      if (!cat.id) { cat.id = idNovo('cat'); mudou = true; }
      (cat.meds || []).forEach(function (m) { if (!m.id) { m.id = idNovo('med'); mudou = true; } });
    });
    if (mudou) Base.setPo(d);
    return d;
  }
  function poMed(id) {
    var achou = null;
    po().forEach(function (c) {
      (c.meds || []).forEach(function (m) { if (m.id === id) achou = m; });
    });
    return achou;
  }

  function meds(ctx) { return ctx === 'oral' ? [] : Base.meds(ctx); }
  function medPorId(ctx, id) {
    if (ctx === 'oral') return poMed(id);
    var l = meds(ctx);
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }

  function selDe(ctx) { if (!sel[ctx]) sel[ctx] = []; return sel[ctx]; }
  function selIdx(ctx, id) {
    var l = selDe(ctx);
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return i;
    return -1;
  }
  function selToggle(ctx, id) {
    var i = selIdx(ctx, id);
    if (i !== -1) { selDe(ctx).splice(i, 1); return false; }
    var m = medPorId(ctx, id) || {};
    selDe(ctx).push({
      id: id, qtd: 1,
      modo: m.modo || '',
      volume: (m.volumes && m.volumes[0]) || ''
    });
    return true;
  }
  function selItem(ctx, id) { var i = selIdx(ctx, id); return i === -1 ? null : selDe(ctx)[i]; }

  /* ---- uma linha da prescricao gerada ---- */
  function linhaPresc(ctx, s, n) {
    var m = medPorId(ctx, s.id);
    if (!m) return '';
    if (ctx === 'oral') {
      return n + ') ' + m.nome + '\n   ' + m.uso;
    }
    var qtd, via = '';
    if (ctx === 'ev') {
      if (m.tipo === 'solucao') {
        qtd = (s.qtd > 1 ? s.qtd + ' x ' : '') + (s.volume || (m.volumes && m.volumes[0]) || '');
        via = ' — EV' + (tempoEV ? ', correr em ' + tempoEV : '');
      } else {
        qtd = s.qtd + (s.qtd > 1 ? ' ampolas' : ' ampola');
        via = ' — EV' + (s.modo ? ', ' + s.modo.toLowerCase() : ', em bolus');
      }
    } else if (ctx === 'im') {
      qtd = s.qtd + (s.qtd > 1 ? ' ampolas' : ' ampola');
      via = ' — IM agora';
    } else if (ctx === 'has') {
      qtd = s.qtd + (s.qtd > 1 ? ' comprimidos' : ' comprimido');
      via = ' — VO agora';
    } else { /* psiq */
      var uni = m.via === 'VO' ? 'comprimido' : 'ampola';
      qtd = s.qtd + ' ' + uni + (s.qtd > 1 ? 's' : '');
      via = ' — ' + m.via + ' agora';
    }
    return n + ') ' + m.value + ' .......... ' + qtd + via;
  }

  function textoPresc(ctx) {
    var l = selDe(ctx);
    if (!l.length) return '';
    var linhas = l.map(function (s, i) { return linhaPresc(ctx, s, i + 1); })
                  .filter(function (x) { return x; });
    var t = CFG[ctx].cab + '\n\n' + linhas.join('\n');
    if (CFG[ctx].desfecho) t += '\n\nDesfecho: ' + (desfecho[ctx] || DESFECHOS[0]) + '.';
    return t;
  }

  /* ---- controles de quantidade e modo dentro do cartao ---- */
  function controles(ctx, m, s) {
    var h = '<div class="ferr-med-ctrl">';
    if (ctx === 'ev' && m.tipo === 'solucao') {
      h += '<select data-acao="med-volume" data-ctx="' + ctx + '" data-id="' + esc(m.id) + '">' +
        (m.volumes || []).map(function (v) {
          return '<option value="' + esc(v) + '"' + (s.volume === v ? ' selected' : '') + '>' + esc(v) + '</option>';
        }).join('') + '</select>';
    }
    h += '<button type="button" data-acao="med-menos" data-ctx="' + ctx + '" data-id="' + esc(m.id) + '">−</button>' +
         '<b>' + s.qtd + '</b>' +
         '<button type="button" data-acao="med-mais" data-ctx="' + ctx + '" data-id="' + esc(m.id) + '">+</button>';
    if (ctx === 'ev' && m.tipo !== 'solucao') {
      var modos = ['Em bolus', 'Bolus lento', 'Diluído em SF 0,9% 100 mL', 'Bomba de infusão', 'Diluir — nunca em bolus'];
      if (m.modo && modos.indexOf(m.modo) === -1) modos.unshift(m.modo);
      h += '<select data-acao="med-modo" data-ctx="' + ctx + '" data-id="' + esc(m.id) + '">' +
        modos.map(function (v) {
          return '<option value="' + esc(v) + '"' + (s.modo === v ? ' selected' : '') + '>' + esc(v) + '</option>';
        }).join('') + '</select>';
    }
    return h + '</div>';
  }

  function cartaoMed(ctx, m) {
    var s = selItem(ctx, m.id);
    var rot = ctx === 'oral' ? m.nome : m.label;
    var sub = ctx === 'oral' ? m.uso : m.value;
    return '<article class="ferr-med' + (s ? ' on' : '') + '">' +
      '<button type="button" class="ferr-med-corpo" data-acao="med-toggle" data-ctx="' + ctx + '" data-id="' + esc(m.id) + '">' +
        '<span class="ferr-med-nome">' + esc(rot) +
          (m.faltaSus ? '<span class="ferr-tag falta">falta no SUS</span>' : '') +
          (ctx === 'psiq' ? '<span class="ferr-tag via">' + esc(m.via) + '</span>' : '') +
        '</span>' +
        '<span class="ferr-med-sub">' + esc(sub) + '</span>' +
      '</button>' +
      (s ? controles(ctx, m, s) : '') +
      '<div class="ferr-card-acoes">' +
        '<button type="button" title="Editar" data-acao="med-editar" data-ctx="' + ctx + '" data-id="' + esc(m.id) + '"'+ICO('lapis')+'</button>' +
        '<button type="button" title="Apagar" data-acao="med-apagar" data-ctx="' + ctx + '" data-id="' + esc(m.id) + '"'+ICO('fechar')+'</button>' +
      '</div>' +
    '</article>';
  }

  /* ---- combos salvos ---- */
  function painelCombos(ctx) {
    var cs = Base.combos(ctx);
    return '<div class="ferr-bloco">' +
      '<div class="ferr-bloco-topo"><h3>Meus combos</h3>' +
        '<div class="ferr-mini">' +
          '<button type="button" class="ferr-btn peq forte" data-acao="combo-salvar" data-ctx="' + ctx + '">Salvar seleção</button>' +
        '</div>' +
      '</div>' +
      (cs.length
        ? '<div class="ferr-chips">' + cs.map(function (c) {
            return '<span class="ferr-combo">' +
              '<button type="button" data-acao="combo-usar" data-ctx="' + ctx + '" data-id="' + esc(c.id) + '">' +
                esc(c.nome) + ' <i>' + c.itens.length + '</i></button>' +
              '<button type="button" class="x" title="Apagar combo" data-acao="combo-apagar" data-ctx="' + ctx + '" data-id="' + esc(c.id) + '"'+ICO('fechar')+'</button>' +
            '</span>';
          }).join('') + '</div>'
        : '<p class="ferr-nota">Selecione as medicações que costuma usar juntas e toque em “Salvar seleção”.</p>') +
    '</div>';
  }

  /* ---- painel da prescricao gerada ---- */
  function painelSaida(ctx) {
    var t = textoPresc(ctx);
    var cfg = CFG[ctx];
    var h = '<div class="ferr-bloco saida" id="ferrSaida">' +
      '<div class="ferr-bloco-topo"><h3>Prescrição gerada</h3>' +
        '<div class="ferr-mini">' +
          '<button type="button" class="ferr-btn peq forte" data-acao="presc-copiar" data-ctx="' + ctx + '">Copiar tudo</button>' +
          '<button type="button" class="ferr-btn peq" data-acao="presc-limpar" data-ctx="' + ctx + '">Limpar</button>' +
        '</div>' +
      '</div>';

    var opts = [];
    if (cfg.desfecho) {
      opts.push('<label class="ferr-campo"><span>Desfecho</span><select data-acao="presc-desfecho" data-ctx="' + ctx + '">' +
        DESFECHOS.map(function (d) {
          return '<option value="' + esc(d) + '"' + ((desfecho[ctx] || DESFECHOS[0]) === d ? ' selected' : '') + '>' + esc(d) + '</option>';
        }).join('') + '</select></label>');
    }
    if (cfg.tempo) {
      var tempos = ['', '30 minutos', '1 h', '2 h', '4 h', '6 h', '8 h', '12 h', '24 h'];
      opts.push('<label class="ferr-campo"><span>Tempo de infusão das soluções</span><select data-acao="presc-tempo">' +
        tempos.map(function (v) {
          return '<option value="' + esc(v) + '"' + (tempoEV === v ? ' selected' : '') + '>' + (v || 'não especificar') + '</option>';
        }).join('') + '</select></label>');
    }
    if (opts.length) h += '<div class="ferr-campos">' + opts.join('') + '</div>';

    h += t
      ? '<pre class="ferr-saida">' + esc(t) + '</pre>'
      : '<div class="pendente">Nenhuma medicação selecionada.</div>';
    return h + '</div>';
  }

  /* ---- formulario de medicamento ---- */
  function formMed(ctx, m) {
    m = m || {};
    if (ctx === 'oral') {
      var cats = po();
      return '<form class="ferr-form" data-form="med" data-ctx="oral" data-id="' + esc(m.id || '') + '">' +
        '<h3>' + (m.id ? 'Editar' : 'Novo') + ' medicamento</h3>' +
        campo('nome', 'Nome e apresentação', m.nome) +
        campo('uso', 'Modo de uso (o que sai na receita)', m.uso, 'area') +
        '<label class="ferr-campo"><span>Grupo — digite um nome novo para criar outro grupo</span>' +
          '<input type="text" name="categoria" list="ferrCats" value="' + esc(m._cat || '') + '">' +
          '<datalist id="ferrCats">' + cats.map(function (c) {
            return '<option value="' + esc(c.categoria) + '">';
          }).join('') + '</datalist></label>' +
        '<label class="ferr-check"><input type="checkbox" name="faltaSus"' + (m.faltaSus ? ' checked' : '') + '> ' +
          'Marcar como “falta no SUS”</label>' +
        '<div class="ferr-form-acoes"><button type="submit" class="ferr-btn forte">Salvar</button>' +
          btn('form-fechar', 'Cancelar') + '</div>' +
      '</form>';
    }
    var grupos = [];
    meds(ctx).forEach(function (x) {
      var g = ctx === 'psiq' ? x.via : x.grupo;
      if (g && grupos.indexOf(g) === -1) grupos.push(g);
    });
    return '<form class="ferr-form" data-form="med" data-ctx="' + ctx + '" data-id="' + esc(m.id || '') + '">' +
      '<h3>' + (m.id ? 'Editar' : 'Nova') + ' medicação</h3>' +
      campo('label', 'Rótulo curto (o que aparece no botão)', m.label) +
      campo('value', 'Nome técnico completo (o que sai na prescrição)', m.value, 'area') +
      '<label class="ferr-campo"><span>' + (ctx === 'psiq' ? 'Via' : 'Grupo — digite um nome novo para criar outro') + '</span>' +
        '<input type="text" name="grupo" list="ferrGrupos' + ctx + '" value="' + esc((ctx === 'psiq' ? m.via : m.grupo) || '') + '">' +
        '<datalist id="ferrGrupos' + ctx + '">' + grupos.map(function (g) {
          return '<option value="' + esc(g) + '">';
        }).join('') + '</datalist></label>' +
      (ctx === 'ev'
        ? '<label class="ferr-campo"><span>Tipo</span><select name="tipo">' +
            '<option value="ampola"' + (m.tipo !== 'solucao' ? ' selected' : '') + '>Ampola ou frasco (conta ampolas)</option>' +
            '<option value="solucao"' + (m.tipo === 'solucao' ? ' selected' : '') + '>Solução (escolhe volume)</option>' +
          '</select></label>' +
          campo('volumes', 'Volumes disponíveis, separados por vírgula', (m.volumes || []).join(', '))
        : '') +
      '<div class="ferr-form-acoes"><button type="submit" class="ferr-btn forte">Salvar</button>' +
        btn('form-fechar', 'Cancelar') + '</div>' +
    '</form>';
  }

  /* ---- organizar grupos (ordem e ocultar) ---- */
  function painelOrdem(ctx, grupos) {
    var o = Base.ordem(ctx, grupos);
    return '<div class="ferr-bloco">' +
      '<div class="ferr-bloco-topo"><h3>Organizar grupos</h3>' +
        '<div class="ferr-mini">' + btn('ordem-restaurar', 'Restaurar', 'peq') +
          btn('form-fechar', 'Fechar', 'peq') + '</div></div>' +
      '<ol class="ferr-ordem">' + o.ordem.map(function (g, i) {
        var oculto = o.ocultos.indexOf(g) !== -1;
        return '<li class="' + (oculto ? 'oculto' : '') + '">' +
          '<span>' + esc(g) + '</span>' +
          '<button type="button" data-acao="ordem-sobe" data-ctx="' + ctx + '" data-v="' + esc(g) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
          '<button type="button" data-acao="ordem-desce" data-ctx="' + ctx + '" data-v="' + esc(g) + '"' + (i === o.ordem.length - 1 ? ' disabled' : '') + '>↓</button>' +
          '<button type="button" data-acao="ordem-oculta" data-ctx="' + ctx + '" data-v="' + esc(g) + '">' + (oculto ? 'mostrar' : 'ocultar') + '</button>' +
        '</li>';
      }).join('') + '</ol>' +
    '</div>';
  }

  /* ---- tela de prescricao ---- */
  function telaPresc(ctx, semCabecalho) {
    var cfg = CFG[ctx];
    var html = '';

    var acoes = [];
    if (modoAutor()) {
      acoes.push(ctx === 'oral' ? btn('med-novo', '+ Novo medicamento', 'forte')
                                : btn('med-novo', '+ Nova medicação', 'forte'));
      acoes.push(btn('meds-restaurar', 'Restaurar padrão'));
    }
    if (cfg.ordem) acoes.push(btn('ordem-abrir', 'Organizar grupos'));
    acoes.push(btn('presc-limpar', 'Limpar seleção'));
    html += '<div class="ferr-barra" data-ctx="' + ctx + '">' + acoes.join('') + '</div>';

    if (form === 'med' && form_ctx === ctx) html += formMed(ctx, form_alvo);

    /* monta os grupos */
    var lista, grupos = [], porGrupo = {};
    if (ctx === 'oral') {
      po().forEach(function (c) { grupos.push(c.categoria); porGrupo[c.categoria] = c.meds || []; });
    } else {
      lista = meds(ctx);
      lista.forEach(function (m) {
        var g = cfg.agrupa === 'via' ? m.via : (cfg.agrupa ? m.grupo : 'Medicações');
        if (grupos.indexOf(g) === -1) { grupos.push(g); porGrupo[g] = []; }
        porGrupo[g].push(m);
      });
      if (cfg.agrupa === 'grupo') {
        var pref = ctx === 'ev' ? FERR_EV_ORDEM : [];
        grupos.sort(function (a, b) {
          var ia = pref.indexOf(a), ib = pref.indexOf(b);
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });
      }
    }

    if (form === 'ordem' && form_ctx === ctx) html += painelOrdem(ctx, grupos);

    var o = cfg.ordem ? Base.ordem(ctx, grupos) : { ordem: grupos, ocultos: [] };
    html += '<div class="ferr-grupos">' + o.ordem.filter(function (g) {
      return o.ocultos.indexOf(g) === -1;
    }).map(function (g) {
      return '<section class="ferr-grupo">' +
        '<h4>' + esc(g) + '<i>' + (porGrupo[g] || []).length + '</i></h4>' +
        '<div class="ferr-meds">' + (porGrupo[g] || []).map(function (m) {
          return cartaoMed(ctx, m);
        }).join('') + '</div>' +
      '</section>';
    }).join('') + '</div>';

    html += painelCombos(ctx);
    html += painelSaida(ctx);
    return html;
  }

  /* =========================================================
     QUADROS — prescricao pronta por apresentacao clinica
     ========================================================= */
  function quadroDe(id) {
    var l = Base.quadros();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }

  /* uma linha do bloco "na unidade" */
  function linhaUnidade(u, n) {
    var vazio = !u.dose || u.dose === '—';
    var t = n + ') ' + u.med;
    if (!vazio) t += ' .......... ' + u.dose + (u.via && u.via !== '—' ? ' — ' + u.via : '');
    if (u.obs) t += '\n   ' + u.obs;
    return t;
  }

  /* 'receita' sai no formato de receituário; o resto, no formato de lista */
  function textoParte(q, parte) {
    return parte === 'receita' ? textoReceita(q) : textoQuadro(q, parte || 'rx');
  }

  function textoQuadro(q, parte) {
    var p = [];
    if (parte === 'tudo' || parte === 'rx' || parte === 'unidade') {
      var lu = rxDe(q, 'unidade');
      if (lu.length) {
        p.push('NA UNIDADE\n' + lu.map(function (u, i) {
          return linhaUnidade(u, i + 1);
        }).join('\n'));
      }
    }
    if (parte === 'tudo' || parte === 'rx' || parte === 'receita') {
      var lr = rxDe(q, 'receita');
      if (lr.length) {
        p.push('RECEITA PARA CASA\n' + lr.map(function (r, i) {
          return (i + 1) + ') ' + r.med + '\n   ' + r.uso;
        }).join('\n'));
      }
    }
    if (parte === 'tudo' || parte === 'orientacoes') {
      if (q.orientacoes && q.orientacoes.length) {
        p.push('ORIENTAÇÕES\n' + q.orientacoes.map(function (o) { return '- ' + o; }).join('\n'));
      }
    }
    if (!p.length) return '';
    var cab = (parte === 'tudo' || parte === 'rx')
      ? q.nome.toUpperCase() + (q.sub ? ' — ' + q.sub : '')
      : q.nome.toUpperCase();
    return cab + '\n\n' + p.join('\n\n');
  }

  /* ---------- receituário ----------
     A quantidade a dispensar é ARITMÉTICA da posologia escrita, não um
     dado da fonte: doses por dia x dias x unidades por dose. Quando a
     posologia não define isso (uso contínuo, "se necessário", tópico),
     sai uma linha em branco para o médico preencher — que é como se
     faz num receituário impresso. */
  var RX_UN   = /(\d+(?:[.,]\d+)?)\s*(comprimidos?|c[áa]psulas?|dr[áa]geas?|sach[êe]s?|ampolas?|mL|ml|gotas?|jatos?|puffs?)/i;
  var RX_H    = /de\s*(\d+)\s*(?:\/|em)\s*\d+\s*h/i;
  var RX_V    = /(\d+)\s*vez(?:es)?\s*ao\s*dia|1\s*x\s*\/\s*dia/i;
  var RX_UMA  = /(?:^|[,\s])(?:1\s*vez|uma\s*vez|[àa]\s*noite|pela\s*manh[ãa]|ao\s*deitar|ao\s*acordar|em\s*jejum)/i;
  var RX_DIAS = /por\s*(?:at[ée]\s*)?(\d+)(?:\s*a\s*(\d+))?\s*(dias?|semanas?)/i;
  var RX_CONT = /uso\s*cont[íi]nuo|enquanto\s/i;
  var ABREV = { comprimido:'cp', capsula:'c\u00e1ps', dragea:'dg', sache:'sach\u00ea',
                ampola:'amp', ml:'mL', gota:'gotas', jato:'jatos', puff:'jatos' };

  function qtdReceita(uso) {
    if (!uso || RX_CONT.test(uso)) return null;
    var un = RX_UN.exec(uso);
    if (!un) return null;
    var h = RX_H.exec(uso), v = RX_V.exec(uso);
    var vezes = h ? Math.round(24 / (+h[1])) : (v ? (+(v[1] || 1)) : (RX_UMA.test(uso) ? 1 : null));
    if (!vezes || !isFinite(vezes) || vezes < 1) return null;
    var d = RX_DIAS.exec(uso);
    if (!d) return null;
    var dias = +(d[2] || d[1]);
    if (/semana/i.test(d[3])) dias *= 7;
    var porDose = parseFloat(String(un[1]).replace(',', '.'));
    var total = porDose * vezes * dias;
    if (!isFinite(total) || total <= 0) return null;
    var chave = norm(un[2]).replace(/s$/, '');
    var rot = ABREV[chave] || un[2];
    return { n: (Math.round(total * 10) / 10), un: rot };
  }
  function qtdTexto(uso) {
    var q = qtdReceita(uso);
    return q ? (String(q.n).replace('.', ',') + ' ' + q.un) : '';
  }

  /* cabeçalho de via, para o receituário sair agrupado */
  function viaReceita(uso) {
    var u = norm(uso || '');
    if (/aplicar|pomada|creme|gel|topic|loc[ãa]o|xampu/.test(u)) return 'USO T\u00d3PICO';
    if (/inalar|espa[çc]ador|nebuliza|jato/.test(u))             return 'USO INALAT\u00d3RIO';
    if (/colirio|ocular|conjuntival|olho/.test(u))               return 'USO OFTALMICO';
    if (/nasal|narina/.test(u))                                  return 'USO NASAL';
    if (/via anal|region anal|supositorio|retal/.test(u))         return 'USO RETAL';
    return 'USO ORAL';
  }

  function textoReceita(q) {
    var itens = rxDe(q, 'receita');
    if (!itens.length) return '';
    var vias = [], porVia = {};
    itens.forEach(function (r) {
      var v = viaReceita(r.uso);
      if (vias.indexOf(v) === -1) { vias.push(v); porVia[v] = []; }
      porVia[v].push(r);
    });
    var COL = 58;
    /* sem nome do quadro: a receita começa na via. O diagnóstico não vai
       para a mão do paciente, e no impresso o nome já está no cabeçalho. */
    var linhas = [];
    var n = 0;
    vias.forEach(function (v, iv) {
      if (iv) linhas.push('');
      linhas.push(v);
      linhas.push('');
      porVia[v].forEach(function (r) {
        n++;
        var med = String(r.med || "").replace(/\*/g, "");
        var qtd = qtdTexto(r.uso) || '__________';
        var esq = (n < 10 ? ' ' : '') + n + ' - ' + med + ' ';
        var pontos = Math.max(3, COL - esq.length);
        linhas.push(esq + new Array(pontos + 1).join('.') + ' ' + qtd);
        linhas.push("     " + String(r.uso || "").replace(/\*/g, ""));
        linhas.push('');
      });
    });
    while (linhas.length && !linhas[linhas.length - 1]) linhas.pop();
    return linhas.join('\n');
  }

  /* a prescrição em uso: a editada, se houver; senão o modelo */
  function rxDe(q, parte) {
    var e = rxEdit[q.id];
    if (e && e[parte]) return e[parte];
    return (q[parte] || []).map(function (x) {
      var c = {}; for (var k in x) if (x.hasOwnProperty(k)) c[k] = x[k];
      return c;
    });
  }
  function rxAlterado(q, parte) { return !!(rxEdit[q.id] && rxEdit[q.id][parte]); }
  function rxGrava(q, parte, itens) {
    if (!rxEdit[q.id]) rxEdit[q.id] = {};
    rxEdit[q.id][parte] = itens;
  }
  function rxReset(q, parte) {
    if (rxEdit[q.id]) delete rxEdit[q.id][parte];
  }

  /* formulário de edição de uma parte da prescrição */
  function formRx(q, parte) {
    var itens = rxDe(q, parte);
    var naUnidade = (parte === 'unidade');
    var h = '<div class="rxe" data-q="' + esc(q.id) + '" data-parte="' + parte + '">';
    h += itens.map(function (it, i) {
      return '<div class="rxe-item">' +
        '<span class="rxe-n">' + (i + 1) + '</span>' +
        '<div class="rxe-campos">' +
          '<label class="rxe-c larga"><span>Medicamento</span>' +
            '<input type="text" data-rxe="med" data-i="' + i + '" value="' + esc(naUnidade ? it.med : it.med) + '"></label>' +
          (naUnidade
            ? '<label class="rxe-c"><span>Dose</span>' +
                '<input type="text" data-rxe="dose" data-i="' + i + '" value="' + esc(it.dose || '') + '"></label>' +
              '<label class="rxe-c curta"><span>Via</span>' +
                '<input type="text" data-rxe="via" data-i="' + i + '" value="' + esc(it.via || '') + '"></label>' +
              '<label class="rxe-c larga"><span>Observação</span>' +
                '<input type="text" data-rxe="obs" data-i="' + i + '" value="' + esc(it.obs || '') + '"></label>'
            : '<label class="rxe-c larga"><span>Posologia</span>' +
                '<input type="text" data-rxe="uso" data-i="' + i + '" value="' + esc(it.uso || '') + '"></label>') +
        '</div>' +
        '<button type="button" class="rxe-x" data-acao="rx-remover" data-i="' + i + '" ' +
          'aria-label="Remover item ' + (i + 1) + '">' + ICO('lixo') + '</button>' +
      '</div>';
    }).join('');
    h += '<div class="rxe-acoes">' +
      '<button type="button" class="ferr-btn peq" data-acao="rx-add">' + ICO('mais') + ' Adicionar item</button>' +
      '<span class="rxe-sep"></span>' +
      (rxAlterado(q, parte)
        ? '<button type="button" class="ferr-btn peq" data-acao="rx-restaurar">Restaurar original</button>' : '') +
      '<button type="button" class="ferr-btn peq forte" data-acao="rx-pronto">Pronto</button>' +
    '</div></div>';
    return h;
  }

  /* ============================================================
     MODO PEDIATRIA nas prescrições
     Os 104 quadros têm dose de ADULTO — não existe versão pediátrica
     deles. O que este modo faz é CRUZAR cada linha com a aba Pediatria
     e, onde há equivalente cadastrado, mostrar a dose por quilo já
     calculada. Onde não há, a linha fica marcada como dose de adulto:
     nada é inferido nem convertido por conta própria.
     ============================================================ */
  /* princípio ativo: o que vem antes do primeiro número */
  function ativoDe(nome) {
    return norm(nome).split(/\d/)[0].replace(/[^a-z+ ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  /* mesmo item, nome diferente entre as duas bases */
  var APELIDO_PED = {
    'cloreto de sodio': 'p-sf-bolus',
    'soro fisiologico': 'p-sf-bolus',
    'ringer': 'p-sf-bolus',
    'soro glicosado': 'p-glicose',
    'glicose': 'p-glicose'
  };
  var _idxPed = null;
  function idxPed() {
    if (_idxPed) return _idxPed;
    _idxPed = [];
    Object.keys(APELIDO_PED).forEach(function (k) {
      var alvo = null;
      (typeof FERR_PEDIA === 'undefined' ? [] : FERR_PEDIA).forEach(function (m) {
        if (m.id === APELIDO_PED[k]) alvo = m;
      });
      if (alvo) _idxPed.push({ chave: k, med: alvo });
    });
    (typeof FERR_PEDIA === 'undefined' ? [] : FERR_PEDIA).forEach(function (m) {
      ativoDe(m.nome).split('+').forEach(function (a) {
        a = a.trim();
        /* palavra curta casa demais: 'b' de vitamina B6, 'c' de vitamina C */
        if (a.length >= 5) _idxPed.push({ chave: a, med: m });
      });
    });
    _idxPed.sort(function (x, y) { return y.chave.length - x.chave.length; });
    return _idxPed;
  }
  function pedDe(nomeAdulto) {
    var a = ' ' + ativoDe(nomeAdulto) + ' ';
    var l = idxPed();
    for (var i = 0; i < l.length; i++) {
      if (a.indexOf(' ' + l[i].chave) !== -1) return l[i].med;
    }
    return null;
  }

  /* a linha pediátrica de um medicamento, para o peso e a idade atuais */
  function linhaPed(m) {
    var kg = pesoGlobal(), idade = idadePedia();
    if (vetado(m, idade)) {
      return { veto:true, txt:'Não usar com ' + idadeTexto(idade) + ' — ' + m.veto.txt };
    }
    var d = (m.doses || [])[0];
    if (!d) return null;
    var r = calcPedia(d, kg, d.conc ? concDe(m, d) : undefined);
    var regra = (d.mgkg != null)
      ? String(d.mgkg).replace('.', ',') +
        (d.mgkgMax && d.mgkgMax !== d.mgkg ? ' a ' + String(d.mgkgMax).replace('.', ',') : '') +
        ' ' + (d.unid === 'UI' ? 'UI' : 'mg') + '/kg'
      : (d.fixa || '');
    return {
      veto:false, med:m, regra:regra, freq:d.freq,
      calc: r ? (r.mg + (r.vol ? ' · ' + r.vol : '')) : null,
      semPeso: !kg && d.mgkg != null
    };
  }

  /* peso ou idade mudou: redesenha quem depende disso, sem perder o foco
     do campo que está sendo digitado */
  function atualizaPorPeso() {
    var cl = document.getElementById('ferrListaPed');
    if (cl) cl.innerHTML = listaPedia();
  }

  /* ---------- sintomáticos ----------
     Reaproveita FERR_PO, a lista de prescrição oral que já existe.
     O + empilha a linha no rascunho, sem sair da tela. */
  var sintAberto = null;   /* categoria expandida */
  var pacAberto = false;   /* o cabeçalho do paciente está aberto? */
  var SINT_FORA = { 'Antibióticos':1 };   /* ATB tem tela própria */

  function blocoSintomaticos(ctxId) {
    var cats = po().filter(function (c) { return !SINT_FORA[c.categoria]; });
    if (!cats.length) return '';
    return '<details class="sint"' + (sintAberto ? ' open' : '') + '>' +
      '<summary>' + ICO('mais') + '<span>Adicionar sintomático</span>' +
        '<i>' + cats.reduce(function (n, c) { return n + c.meds.length; }, 0) + '</i></summary>' +
      '<div class="sint-corpo">' +
        '<div class="ferr-chips tira">' + cats.map(function (c) {
          return '<button type="button" class="ferr-chip' + (sintAberto === c.categoria ? ' on' : '') +
            '" data-acao="sint-cat" data-v="' + esc(c.categoria) + '">' +
            esc(c.categoria) + ' <i>' + c.meds.length + '</i></button>';
        }).join('') + '</div>' +
        (sintAberto
          ? '<ul class="sint-lista">' + (function () {
              var cat = null;
              cats.forEach(function (c) { if (c.categoria === sintAberto) cat = c; });
              if (!cat) return '';
              return cat.meds.map(function (m) {
                return '<li>' +
                  '<span class="sint-txt"><b>' + esc(m.nome) + '</b>' +
                    '<span>' + esc(m.uso) + '</span></span>' +
                  '<button type="button" class="sint-add" data-acao="sint-add" ' +
                    'data-id="' + esc(m.id || '') + '" data-cat="' + esc(cat.categoria) + '" ' +
                    'aria-label="Adicionar ' + esc(m.nome) + '">' + ICO('mais') + '</button>' +
                '</li>';
              }).join('');
            })() + '</ul>'
          : '<p class="sint-dica">Escolha um grupo acima.</p>') +
      '</div></details>';
  }

  /* ============================================================
     CABEÇALHO DO PACIENTE
     Preenchido uma vez por plantão e colado no topo de toda
     prescrição copiada, impressa ou empilhada. O peso é o mesmo
     campo global do topo — não existe um segundo peso no app.
     ============================================================ */
  function pacNome()  { return String(ler('pac-nome', '') || '').trim(); }
  function pacIdade() { return String(ler('pac-idade', '') || '').trim(); }

  function pacResumo() {
    var p = [], kg = pesoGlobal();
    if (pacNome())  p.push(pacNome());
    if (pacIdade()) p.push(pacIdade());
    if (kg !== null) p.push(String(kg).replace('.', ',') + ' kg');
    return p.join(' · ');
  }
  /* as linhas que abrem o texto copiado; vazio quando nada foi preenchido */
  function cabPaciente() {
    var r = pacResumo();
    return r ? 'Paciente: ' + r + '\n' + hoje() + '\n\n' : '';
  }
  function hoje() {
    var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; };
    return z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + d.getFullYear();
  }

  function blocoPaciente() {
    var r = pacResumo(), kg = pesoGlobal();
    return '<details class="pac"' + (pacAberto ? ' open' : '') + '>' +
      '<summary>' + ICO('pessoa') + '<span>Paciente</span>' +
        '<i>' + (r ? esc(r) : 'não informado') + '</i></summary>' +
      '<div class="pac-campos">' +
        '<label>Nome<input type="text" id="pacNome" value="' + esc(pacNome()) +
          '" autocomplete="off" placeholder="opcional"></label>' +
        '<label>Idade<input type="text" id="pacIdade" value="' + esc(pacIdade()) +
          '" autocomplete="off" placeholder="ex.: 34 anos"></label>' +
        '<label>Peso<input type="text" id="pacPeso" inputmode="decimal" value="' +
          (kg === null ? '' : esc(String(kg).replace('.', ','))) + '" placeholder="kg"></label>' +
        '<button type="button" class="ferr-btn peq" data-acao="pac-limpar">Limpar</button>' +
      '</div></details>';
  }

  /* ============================================================
     PRESCREVER EM DOIS CLIQUES
     Abrir o quadro é o primeiro clique, copiar é o segundo.
     Tudo vem marcado; desmarcar é opcional. Um botão só copia o
     que estiver marcado das duas partes de uma vez.
     ============================================================ */
  var rxFora = {};   /* { quadroId: { 'unidade:2':1 } } — o que foi desmarcado */

  function foraDe(q, parte, i) {
    return !!(rxFora[q.id] && rxFora[q.id][parte + ':' + i]);
  }
  function alternaItem(q, parte, i) {
    if (!rxFora[q.id]) rxFora[q.id] = {};
    var k = parte + ':' + i;
    if (rxFora[q.id][k]) delete rxFora[q.id][k]; else rxFora[q.id][k] = 1;
  }
  function contaMarcados(q) {
    var n = 0;
    ['unidade', 'receita'].forEach(function (parte) {
      rxDe(q, parte).forEach(function (_, i) { if (!foraDe(q, parte, i)) n++; });
    });
    return n;
  }

  /* o texto final: as duas partes, só o que ficou marcado */
  function textoProto(q) {
    var bl = [];
    var u = ctxRx === 'casa' ? [] : rxDe(q, 'unidade').filter(function (_, i) { return !foraDe(q, 'unidade', i); });
    if (u.length) {
      bl.push('NA UNIDADE\n' + u.map(function (x, i) { return linhaUnidade(x, i + 1); }).join('\n'));
    }
    var r = ctxRx === 'porta' ? [] : rxDe(q, 'receita').filter(function (_, i) { return !foraDe(q, 'receita', i); });
    if (r.length) {
      var COL = 58, n = 0;
      var lin = ['RECEITA — USO ORAL', ''];
      r.forEach(function (x) {
        n++;
        var med = String(x.med || '').replace(/\*/g, '');
        var qt = qtdTexto(x.uso) || '__________';
        var esq = (n < 10 ? ' ' : '') + n + ' - ' + med + ' ';
        lin.push(esq + new Array(Math.max(3, COL - esq.length) + 1).join('.') + ' ' + qt);
        lin.push('     ' + String(x.uso || '').replace(/\*/g, ''));
        lin.push('');
      });
      while (lin.length && !lin[lin.length - 1]) lin.pop();
      bl.push(lin.join('\n'));
      if (ctxRx === 'casa' && (q.orientacoes || []).length) {
        bl.push('ORIENTAÇÕES\n' + q.orientacoes.map(function (o) { return '- ' + String(o).replace(/\*/g, ''); }).join('\n'));
      }
    }
    if (!bl.length) return '';
    return cabPaciente() + bl.join('\n\n');
  }

  /* ---------- ajuste rápido da posologia ----------
     Reescreve só o número de dias ou o intervalo na frase já escrita.
     A quantidade a dispensar é recalculada sozinha por qtdTexto(). */
  var DIAS_OPC  = [3, 5, 7, 10];
  var HORAS_OPC = [6, 8, 12, 24];

  function diasDe(uso) {
    var d = RX_DIAS.exec(uso || '');
    if (!d || /semana/i.test(d[3])) return null;
    return +(d[2] || d[1]);
  }
  function horasDe(uso) {
    var h = RX_H.exec(uso || '');
    return h ? +h[1] : null;
  }
  function trocaDias(uso, n) {
    return String(uso).replace(RX_DIAS, 'por ' + n + ' dias');
  }
  function trocaHoras(uso, n) {
    return String(uso).replace(RX_H, n === 24 ? '1 vez ao dia' : 'de ' + n + '/' + n + ' h');
  }

  function chipsUso(q, i, uso) {
    var d = diasDe(uso), hr = horasDe(uso), c = '';
    if (hr !== null) {
      HORAS_OPC.forEach(function (n) {
        if (n === hr) return;
        c += '<button type="button" class="pp-chip" data-acao="rx-horas" ' +
          'data-id="' + esc(q.id) + '" data-i="' + i + '" data-n="' + n + '">' +
          (n === 24 ? '1x/dia' : n + '/' + n + 'h') + '</button>';
      });
    }
    if (d !== null) {
      DIAS_OPC.forEach(function (n) {
        if (n === d) return;
        c += '<button type="button" class="pp-chip" data-acao="rx-dias" ' +
          'data-id="' + esc(q.id) + '" data-i="' + i + '" data-n="' + n + '">' + n + 'd</button>';
      });
    }
    return c ? '<span class="pp-chips">' + c + '</span>' : '';
  }

  function linhaProto(q, parte, x, i) {
    var fora = foraDe(q, parte, i);
    var vazio = parte === 'unidade' && (!x.dose || x.dose === '\u2014');
    var qt = parte === 'receita' ? qtdTexto(x.uso) : '';
    return '<label class="pp-item' + (fora ? ' fora' : '') + '">' +
      '<input type="checkbox"' + (fora ? '' : ' checked') +
        ' data-acao="proto-item" data-id="' + esc(q.id) + '"' +
        ' data-parte="' + parte + '" data-i="' + i + '">' +
      '<span class="pp-txt">' +
        '<span class="pp-med">' + esc(x.med) + '</span>' +
        '<span class="pp-linha">' +
          (parte === 'unidade'
            ? (vazio ? '' : '<b>' + esc(x.dose) + '</b>' +
                 (x.via && x.via !== '\u2014' ? '<i>' + esc(x.via) + '</i>' : '')) +
              (x.obs ? '<em>' + esc(x.obs) + '</em>' : '')
            : '<b>' + esc(x.uso) + '</b>' + (qt ? '<i>' + esc(qt) + '</i>' : '')) +
        '</span>' +
        (parte === 'receita' ? chipsUso(q, i, x.uso) : '') +
      '</span></label>';
  }

  function corpoProto(q) {
    var n = contaMarcados(q);
    var h = '<div class="ferr-quadro-corpo pp">';
    if (q.atencao) h += '<div class="ferr-atencao"><b>Atenção</b>' + esc(q.atencao) + '</div>';

    [['unidade', 'Na unidade'], ['receita', 'Receita para casa']].forEach(function (par) {
      if (partesDoCtx().indexOf(par[0]) === -1) return;
      var lista = rxDe(q, par[0]);
      if (!lista.length) return;
      var todosFora = lista.every(function (_, i) { return foraDe(q, par[0], i); });
      var editando = rxEditando === q.id + ':' + par[0];
      h += '<section class="pp-parte"><h5>' +
        '<span class="pp-tit">' + par[1] + '</span>' +
        (rxAlterado(q, par[0]) ? '<span class="rx-mexido">' + ICO('lapis') + ' ajustada</span>' : '') +
        '<button type="button" class="pp-todos" data-acao="rx-editar" ' +
          'data-id="' + esc(q.id) + '" data-p="' + par[0] + '">' +
          (editando ? 'cancelar' : 'editar') + '</button>' +
        (editando ? '' :
          '<button type="button" class="pp-todos" data-acao="proto-todos" ' +
            'data-id="' + esc(q.id) + '" data-parte="' + par[0] + '">' +
            (todosFora ? 'marcar todos' : 'desmarcar todos') + '</button>') + '</h5>' +
        (editando ? formRx(q, par[0])
                  : lista.map(function (x, i) { return linhaProto(q, par[0], x, i); }).join('')) +
      '</section>';
    });

    h += blocoSintomaticos('quadro:' + q.id);

    /* a barra que resolve tudo */
    h += '<div class="pp-barra">' +
      '<button type="button" class="pp-copiar" data-acao="proto-copiar" data-id="' + esc(q.id) + '"' +
        (n ? '' : ' disabled') + '>' + ICO('copiar') +
        ' Copiar<span>' + n + (n === 1 ? ' item' : ' itens') + '</span></button>' +
      '<button type="button" class="pp-sec oculto" data-acao="proto-rascunho" data-id="' + esc(q.id) + '"' +
        (n ? '' : ' disabled') + ' title="Enviar ao rascunho">' + ICO('empilhar') + '</button>' +
      (q.conduta ? '<a class="pp-sec ver" href="#' + esc(q.conduta) + '" title="Ver a conduta">' +
        ICO('livro') + '</a>' : '') +
    '</div>';
    return h + '</div>';
  }

  /* linha de edicao: "MED | dose | via | obs" */
  function linhasUnidade(l) {
    return (l || []).map(function (u) {
      return [u.med, u.dose || '', u.via || '', u.obs || ''].join(' | ').replace(/(\s*\|\s*)+$/, '');
    }).join('\n');
  }
  function parseUnidade(txt) {
    return String(txt || '').split('\n').map(function (l) { return l.trim(); })
      .filter(function (l) { return l; })
      .map(function (l) {
        var p = l.split('|').map(function (x) { return x.trim(); });
        return { med: p[0] || '', dose: p[1] || '', via: p[2] || '', obs: p[3] || '' };
      });
  }
  function linhasReceita(l) {
    return (l || []).map(function (r) { return r.med + ' | ' + r.uso; }).join('\n');
  }
  function parseReceita(txt) {
    return String(txt || '').split('\n').map(function (l) { return l.trim(); })
      .filter(function (l) { return l; })
      .map(function (l) {
        var i = l.indexOf('|');
        return i === -1 ? { med: l, uso: '' }
                        : { med: l.slice(0, i).trim(), uso: l.slice(i + 1).trim() };
      });
  }

  function formQuadro(q) {
    q = q || { grupo: '', nome: '', sub: '', tags: [], atencao: '', unidade: [], receita: [], orientacoes: [] };
    var grupos = [];
    Base.quadros().forEach(function (x) { if (grupos.indexOf(x.grupo) === -1) grupos.push(x.grupo); });
    return '<form class="ferr-form" data-form="quadro" data-id="' + esc(q.id || '') + '">' +
      '<h3>' + (q.id ? 'Editar' : 'Novo') + ' quadro</h3>' +
      campo('nome', 'Nome do quadro', q.nome) +
      campo('sub', 'Uma linha do que é', q.sub) +
      '<label class="ferr-campo"><span>Grupo — digite um nome novo para criar outro</span>' +
        '<input type="text" name="grupo" list="ferrGruposQ" value="' + esc(q.grupo) + '">' +
        '<datalist id="ferrGruposQ">' + grupos.map(function (g) {
          return '<option value="' + esc(g) + '">';
        }).join('') + '</datalist></label>' +
      campo('tags', 'Palavras de busca, separadas por vírgula', (q.tags || []).join(', ')) +
      campo('conduta', 'Id da conduta no guia (opcional, ex.: crise-hipertensiva)', q.conduta) +
      campo('atencao', 'Atenção / armadilha (opcional)', q.atencao, 'area') +
      '<label class="ferr-campo"><span>Na unidade — uma por linha: <code>medicação | dose | via | observação</code></span>' +
        '<textarea name="unidade" rows="7">' + esc(linhasUnidade(q.unidade)) + '</textarea></label>' +
      '<label class="ferr-campo"><span>Receita para casa — uma por linha: <code>medicação | posologia</code></span>' +
        '<textarea name="receita" rows="6">' + esc(linhasReceita(q.receita)) + '</textarea></label>' +
      '<label class="ferr-campo"><span>Orientações — uma por linha</span>' +
        '<textarea name="orientacoes" rows="5">' + esc((q.orientacoes || []).join('\n')) + '</textarea></label>' +
      '<div class="ferr-form-acoes"><button type="submit" class="ferr-btn forte">Salvar</button>' +
        btn('form-fechar', 'Cancelar') + '</div>' +
    '</form>';
  }

  /* so a lista filtrada — trocada sozinha quando o usuario digita na busca */
  function listaQuadros(lista) {
    var termos = norm(buscaQuadro).split(/\s+/).filter(Boolean);
    var mostra = lista.filter(function (q) {
      if (!(q[partesDoCtx()[0]] || []).length) return false;
      if (filtroQuadro !== 'todos' && q.grupo !== filtroQuadro) return false;
      if (!termos.length) return true;
      var ix = norm([q.nome, q.sub, q.grupo, (q.tags || []).join(' '), q.atencao,
        (q.unidade || []).map(function (u) { return u.med + ' ' + u.obs; }).join(' '),
        (q.receita || []).map(function (r) { return r.med + ' ' + r.uso; }).join(' '),
        (q.orientacoes || []).join(' ')].join(' '));
      return termos.every(function (t) { return ix.indexOf(t) !== -1; });
    });

    /* antibióticos: cada doença é uma linha, agrupada pelo sítio */
    var atbs = (filtroQuadro === 'todos' || /^Antibi/.test(filtroQuadro)) ? Base.atb().filter(function (a) {
      if (filtroQuadro !== 'todos' && 'Antibióticos · ' + a.sitio !== filtroQuadro) return false;
      if (!termos.length) return true;
      var ix = norm([a.quadro, a.sub, a.sitio, (a.tags || []).join(' '), a.agentes, a.atencao,
        (a.escolha || []).concat(a.alt || []).map(function (e) { return e.atb + ' ' + e.dose; }).join(' ')].join(' '));
      return termos.every(function (t) { return ix.indexOf(t) !== -1; });
    }) : [];

    if (!mostra.length && !atbs.length) return '<div class="pendente">Nenhum quadro encontrado.</div>';

    var porGrupo = {}, ordem = [];
    mostra.forEach(function (q) {
      if (!porGrupo[q.grupo]) { porGrupo[q.grupo] = []; ordem.push(q.grupo); }
      porGrupo[q.grupo].push(q);
    });
    var atbPorSitio = {}, ordemAtb = [];
    atbs.forEach(function (a) {
      var g = 'Antibióticos · ' + a.sitio;
      if (!atbPorSitio[g]) { atbPorSitio[g] = []; ordemAtb.push(g); }
      atbPorSitio[g].push(a);
    });
    var htmlAtb = ordemAtb.map(function (g) {
      return '<section class="atb-secao"><h4>' + esc(g) + '<i>' + atbPorSitio[g].length + '</i></h4>' +
        '<div class="cc-grade">' + atbPorSitio[g].map(cartaoAtb).join('') + '</div></section>';
    }).join('');

    return '<div class="ferr-grupos">' + ordem.map(function (g) {
      return '<section class="atb-secao"><h4>' + esc(g) + '<i>' + porGrupo[g].length + '</i></h4>' +
        '<div class="cc-grade">' + porGrupo[g].map(function (q) {
          var aberto = quadroAberto === q.id;
          var n = (q[partesDoCtx()[0]] || []).length;
          return '<article class="ferr-quadro' + (aberto ? ' aberto' : '') + '">' +
            '<div class="rxl">' +
              '<button type="button" class="rxl-abrir" data-acao="quadro-abrir" data-id="' + esc(q.id) + '"' +
                ' aria-expanded="' + (aberto ? 'true' : 'false') + '">' +
                '<span class="rxl-seta">' + ICO(aberto ? 'setaBai' : 'setaDir') + '</span>' +
                '<span class="rxl-nome">' + esc(q.nome) + '</span>' +
                '<span class="rxl-sub">' + esc(q.sub) + '</span>' +
                '<span class="rxl-n">' + n + '</span>' +
              '</button>' +
              '<span class="rxl-acoes">' +
                '<button type="button" class="rxl-btn forte" data-acao="proto-copiar" data-id="' + esc(q.id) + '"' +
                  ' title="Copiar e enviar ao rascunho">' + ICO('copiar') + '<i>Copiar</i></button>' +
                (modoAutor() ?
                  '<button type="button" class="rxl-btn so-ico" title="Editar" data-acao="quadro-editar" data-id="' + esc(q.id) + '">' + ICO('lapis') + '</button>' +
                  '<button type="button" class="rxl-btn so-ico" title="Apagar" data-acao="quadro-apagar" data-id="' + esc(q.id) + '">' + ICO('fechar') + '</button>' : '') +
              '</span>' +
            '</div>' +
            (aberto ? corpoProto(q) : '') +
          '</article>';
        }).join('') + '</div>' +
      '</section>';
    }).join('') + htmlAtb + '</div>';
  }

  /* ---------- internados: prescrição de enfermaria ---------- */
  var internadoAberto = null;
  function internadoDe(id) {
    var l = typeof FERR_INTERNADOS !== 'undefined' ? FERR_INTERNADOS : [];
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }
  function textoInternado(p) {
    var t = cabPaciente() + 'PRESCRIÇÃO — ' + p.nome.toUpperCase() + (p.sub ? ' (' + p.sub + ')' : '') + '\n\n';
    t += (p.itens || []).map(function (x, i) {
      var l = (i + 1) + '. ' + x.med;
      if (x.dose && x.dose !== '—') l += ' — ' + x.dose;
      if (x.via && x.via !== '—') l += ' — ' + x.via;
      if (x.obs) l += '\n   ' + x.obs;
      return l;
    }).join('\n');
    if ((p.cuidados || []).length) t += '\n\nCUIDADOS\n' + p.cuidados.map(function (c) { return '- ' + c; }).join('\n');
    return t;
  }
  function corpoInternado(p) {
    var h = '<div class="ferr-quadro-corpo pp">';
    h += '<section class="pp-parte"><h5><span class="pp-tit">Prescrição de enfermaria</span></h5>' +
      (p.itens || []).map(function (x, i) {
        return '<div class="pp-item"><span class="pp-txt">' +
          '<span class="pp-med">' + (i + 1) + '. ' + esc(x.med) + '</span>' +
          '<span class="pp-linha">' + (x.dose && x.dose !== '—' ? '<b>' + esc(x.dose) + '</b>' : '') +
            (x.via && x.via !== '—' ? '<i>' + esc(x.via) + '</i>' : '') +
            (x.obs ? '<em>' + esc(x.obs) + '</em>' : '') + '</span></span></div>';
      }).join('') + '</section>';
    if ((p.cuidados || []).length) {
      h += '<section class="pp-parte"><h5><span class="pp-tit">Cuidados</span></h5><ul class="pp-cuidados">' +
        p.cuidados.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></section>';
    }
    h += '<div class="pp-barra">' +
      '<button type="button" class="pp-copiar" data-acao="int-copiar" data-id="' + esc(p.id) + '">' + ICO('copiar') + ' Copiar prescrição</button>' +
      '<button type="button" class="pp-sec oculto" data-acao="int-rascunho" data-id="' + esc(p.id) + '" title="Enviar ao rascunho">' + ICO('empilhar') + '</button>' +
      (p.conduta ? '<a class="pp-sec ver" href="#' + esc(p.conduta) + '" title="Ver a conduta">' + ICO('livro') + '</a>' : '') +
    '</div>';
    return h + '</div>';
  }
  function listaInternados() {
    var l = typeof FERR_INTERNADOS !== 'undefined' ? FERR_INTERNADOS : [];
    var termos = norm(buscaQuadro).split(/\s+/).filter(Boolean);
    var mostra = l.filter(function (p) {
      if (!termos.length) return true;
      var ix = norm([p.nome, p.sub, p.grupo, (p.itens || []).map(function (x) { return x.med + ' ' + x.obs; }).join(' ')].join(' '));
      return termos.every(function (t) { return ix.indexOf(t) !== -1; });
    });
    if (!mostra.length) return '<div class="pendente">Nenhuma prescrição de internação encontrada.</div>';
    var porGrupo = {}, ordem = [];
    mostra.forEach(function (p) { if (!porGrupo[p.grupo]) { porGrupo[p.grupo] = []; ordem.push(p.grupo); } porGrupo[p.grupo].push(p); });
    return '<div class="ferr-grupos">' + ordem.map(function (g) {
      return '<section class="atb-secao"><h4>' + esc(g) + '<i>' + porGrupo[g].length + '</i></h4>' +
        '<div class="cc-grade">' + porGrupo[g].map(function (p) {
          var aberto = internadoAberto === p.id;
          return '<article class="ferr-quadro' + (aberto ? ' aberto' : '') + '"><div class="rxl">' +
            '<button type="button" class="rxl-abrir" data-acao="int-abrir" data-id="' + esc(p.id) + '" aria-expanded="' + (aberto ? 'true' : 'false') + '">' +
              '<span class="rxl-seta">' + ICO(aberto ? 'setaBai' : 'setaDir') + '</span>' +
              '<span class="rxl-nome">' + esc(p.nome) + '</span>' +
              '<span class="rxl-sub">' + esc(p.sub) + '</span>' +
              '<span class="rxl-n">' + (p.itens || []).length + '</span></button>' +
            '<span class="rxl-acoes">' +
              '<button type="button" class="rxl-btn forte" data-acao="int-copiar" data-id="' + esc(p.id) + '" title="Copiar e enviar ao rascunho">' + ICO('copiar') + '<i>Copiar</i></button>' +
            '</span></div>' + (aberto ? corpoInternado(p) : '') + '</article>';
        }).join('') + '</div></section>';
    }).join('') + '</div>';
  }

  function telaQuadros() {
    var lista = Base.quadros();
    var html = '';

    /* ações de autoria só no modo autor — no modo leitura, poluem */
    if (modoAutor()) {
      html += '<div class="ferr-barra" data-ctx="quadros">' +
        btn('quadro-novo', '+ Novo quadro', 'forte') +
        btn('quadros-restaurar', 'Restaurar padrão') +
      '</div>';
    }

    if (form === 'quadro') html += formQuadro(form_alvo);

    /* onde o paciente está decide o que se copia */
    html += '<div class="rx-ctx">' + [
        ['porta', 'Porta', 'na unidade — medicar e observar'],
        ['internados', 'Internados', 'prescrição de enfermaria'],
        ['casa', 'Casa', 'receita para levar']
      ].map(function (c) {
        return '<button type="button" class="rx-ctx-b' + (ctxRx === c[0] ? ' on' : '') + '" data-acao="rx-ctx" data-v="' + c[0] + '">' +
          '<b>' + c[1] + '</b><span>' + c[2] + '</span></button>';
      }).join('') + '</div>';

    html += blocoPaciente();

    if (ctxRx === 'internados') {
      html += '<div id="ferrListaQ">' + listaInternados() + '</div>';
      html += bancada('quadros');
      return html;
    }

    /* chips por grupo (só os grupos que têm algo neste contexto) */
    var parte = partesDoCtx()[0];
    lista = lista.filter(function (q) { return (q[parte] || []).length; });
    var grupos = [];
    lista.forEach(function (q) { if (grupos.indexOf(q.grupo) === -1) grupos.push(q.grupo); });
    var atbTodos = Base.atb();
    SITIOS.forEach(function (st) {
      if (atbTodos.some(function (a) { return a.sitio === st.nome; })) grupos.push('Antibióticos · ' + st.nome);
    });
    html += '<div class="ferr-chips tira">' +
      '<button type="button" class="ferr-chip' + (filtroQuadro === 'todos' ? ' on' : '') +
        '" data-acao="quadro-filtro" data-v="todos">Todos <i>' + (lista.length + atbTodos.length) + '</i></button>' +
      grupos.map(function (g) {
        var n = /^Antibi/.test(g)
          ? atbTodos.filter(function (a) { return 'Antibióticos · ' + a.sitio === g; }).length
          : lista.filter(function (q) { return q.grupo === g; }).length;
        return '<button type="button" class="ferr-chip' + (filtroQuadro === g ? ' on' : '') +
          '" data-acao="quadro-filtro" data-v="' + esc(g) + '">' + esc(g) + ' <i>' + n + '</i></button>';
      }).join('') + '</div>';

    html += '<div id="ferrListaQ">' + listaQuadros(lista) + '</div>';

    html += bancada('quadros');
    return html;
  }

  /* =========================================================
     ANTIBIOTICOS — escolha empirica por sitio
     ========================================================= */
  var SITIOS = [
    { id:'snc',      nome:'Sistema nervoso central',                icone:'cerebro' },
    { id:'vas',      nome:'Vias aéreas superiores',                 icone:'cabeca' },
    { id:'vai',      nome:'Vias aéreas inferiores',                 icone:'pulmao' },
    { id:'cardio',   nome:'Cardiovascular',                         icone:'coracao' },
    { id:'abdome',   nome:'Abdome',                                 icone:'estomago' },
    { id:'urinario', nome:'Trato urinário',                         icone:'gota' },
    { id:'ist',      nome:'Infecções sexualmente transmissíveis',   icone:'escudo' },
    { id:'pele',     nome:'Pele e partes moles',                    icone:'curativo' },
    { id:'osso',     nome:'Ossos e articulações',                   icone:'osso' },
    { id:'outros',   nome:'Outros',                                 icone:'frasco' }
  ];
  function sitioDe(slug) {
    for (var i = 0; i < SITIOS.length; i++) if (SITIOS[i].id === slug) return SITIOS[i];
    return null;
  }
  function slugDoSitio(nome) {
    for (var i = 0; i < SITIOS.length; i++) if (SITIOS[i].nome === nome) return SITIOS[i].id;
    return '';
  }

  function atbDe(id) {
    var l = Base.atb();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }

  function linhaAtb(e) {
    var partes = [e.dose, e.via, e.freq].filter(function (x) { return x && x !== '—'; });
    return e.atb + (partes.length ? ' — ' + partes.join(', ') : '') +
           (e.dur && e.dur !== '—' ? ' · ' + e.dur : '');
  }

  function textoAtb(a) {
    var t = a.quadro.toUpperCase() + (a.sub ? ' — ' + a.sub : '') + '\n\n';
    if (a.agentes) t += 'AGENTES PROVÁVEIS\n' + a.agentes + '\n\n';
    t += 'PRIMEIRA ESCOLHA\n' + (a.escolha || []).map(function (e, i) {
      return (i + 1) + ') ' + linhaAtb(e);
    }).join('\n');
    if ((a.alt || []).length) {
      t += '\n\nALTERNATIVAS\n' + a.alt.map(function (e, i) {
        return (i + 1) + ') ' + linhaAtb(e);
      }).join('\n');
    }
    if (a.atencao) t += '\n\nATENÇÃO\n' + a.atencao;
    if (a.nota)    t += '\n\nOBSERVAÇÃO\n' + a.nota;
    return t;
  }

  /* --- um esquema aberto --- */
  function esquemaAtb(e, principal, id, i) {
    var partes = [e.dose, e.via, e.freq].filter(function (x) { return x && x !== '—'; });
    return '<li class="atb-linha' + (principal ? '' : ' alt') + '">' +
      '<div class="atb-droga">' + esc(e.atb) + '</div>' +
      (partes.length ? '<div class="atb-dose">' + partes.map(function (x) {
        return '<span>' + esc(x) + '</span>';
      }).join('<i>·</i>') + '</div>' : '') +
      (e.dur && e.dur !== '—' ? '<div class="atb-dur">' + esc(e.dur) + '</div>' : '') +
      /* copiar SÓ esta escolha, sem levar junto a alternativa */
      '<button type="button" class="atb-copia1" data-acao="atb-copiar-um" ' +
        'data-id="' + esc(id) + '" data-l="' + (principal ? 'e' : 'a') + '" data-i="' + i + '" ' +
        'title="Copiar só ' + esc(e.atb) + '" aria-label="Copiar só ' + esc(e.atb) + '">' +
        ICO('copiar') + '</button>' +
    '</li>';
  }

  /* via do esquema -> cabeçalho do receituário */
  function viaAtb(v) {
    var u = norm(v || '');
    if (!u) return 'USO ORAL';
    if (/vaginal/.test(u))       return 'USO VAGINAL';
    if (/topic/.test(u))         return 'USO T\u00d3PICO';
    if (/inal/.test(u))          return 'USO INALAT\u00d3RIO';
    if (/ev.*vo|vo.*ev/.test(u)) return 'USO ENDOVENOSO OU ORAL';
    if (/^im/.test(u))           return 'USO INTRAMUSCULAR';
    if (/ev|iv/.test(u))         return 'USO ENDOVENOSO';
    return 'USO ORAL';
  }
  /* nº de doses = doses por dia x dias. Só a contagem: a apresentação
     (comprimido, frasco, ampola) não existe no dado do antibiótico. */
  function dosesAtb(e) {
    var f = norm(e.freq || '');
    if (/dose unica|unica/.test(f)) return '1 dose';
    var h = /(\d+)\s*\/\s*\d+\s*h/.exec(e.freq || '');
    if (!h) return '';
    var porDia = Math.round(24 / (+h[1]));
    if (!porDia || !isFinite(porDia)) return '';
    var d = /(\d+)(?:\s*a\s*(\d+))?\s*dias?/i.exec(e.dur || '');
    if (!d) return '';
    var dias = +(d[2] || d[1]);          /* faixa: dispensa o maior */
    var n = porDia * dias;
    return n > 0 ? (n + ' doses') : '';
  }

  /* o nome traz o contexto na frente ("Vaginose bacteriana: metronidazol").
     Na tela isso ajuda a escolher; na receita, só a droga entra. */
  function nomeDroga(atb) {
    var t = String(atb || '').replace(/\*/g, '');
    var i = t.indexOf(': ');
    if (i > 2) {
      var depois = t.slice(i + 2).trim();
      if (depois.length >= 3) return depois.charAt(0).toUpperCase() + depois.slice(1);
    }
    return t;
  }

  /* uma escolha só, no mesmo formato de receituário das prescrições */
  function textoAtbUm(a, e) {
    var COL = 58;
    var esq = ' 1 - ' + nomeDroga(e.atb) + ' ';
    var qtd = dosesAtb(e) || '__________';
    var pontos = Math.max(3, COL - esq.length);

    var pos = [];
    if (e.dose && e.dose !== '\u2014') pos.push(e.dose);
    if (e.via  && e.via  !== '\u2014') pos.push(e.via);
    if (e.freq && e.freq !== '\u2014') {
      pos.push(/^\d+\s*\//.test(e.freq) ? 'de ' + e.freq : e.freq);
    }
    var linhas = [viaAtb(e.via), '',
      esq + new Array(pontos + 1).join('.') + ' ' + qtd,
      '     ' + pos.join(', ') + '.'];
    if (e.dur && e.dur !== '\u2014') linhas.push('     Dura\u00e7\u00e3o: ' + e.dur + '.');
    return cabPaciente() + linhas.join('\n');
  }

  function corpoAtb(a) {
    var h = '<div class="atb-corpo">';
    if (a.agentes) {
      h += '<div class="atb-agentes"><b>Agentes prováveis</b><span>' + esc(a.agentes) + '</span></div>';
    }
    if (a.atencao) h += '<div class="ferr-atencao"><b>Atenção</b>' + esc(a.atencao) + '</div>';

    h += '<div class="atb-bloco primeiro"><h5>Primeira escolha</h5><ul class="atb-lista">' +
      (a.escolha || []).map(function (e, i) { return esquemaAtb(e, true, a.id, i); }).join('') + '</ul></div>';

    if ((a.alt || []).length) {
      h += '<div class="atb-bloco"><h5>Alternativas</h5><ul class="atb-lista">' +
        a.alt.map(function (e, i) { return esquemaAtb(e, false, a.id, i); }).join('') + '</ul></div>';
    }
    if (a.nota) h += '<p class="atb-nota">' + esc(a.nota) + '</p>';

    h += blocoSintomaticos('atb:' + a.id);

    h += '<div class="ferr-quadro-acoes">' +
      '<button type="button" class="ferr-btn peq forte" data-acao="atb-copiar" data-id="' + esc(a.id) + '">Copiar tudo</button>' +
      '<button type="button" class="ferr-btn peq" data-acao="atb-empilhar" data-id="' + esc(a.id) + '">Empilhar</button>' +
    '</div>';
    return h + '</div>';
  }

  function cartaoAtb(a) {
    var aberto = atbAberto === a.id;
    var n = (a.escolha || []).length + (a.alt || []).length;
    return '<article class="atb-item' + (aberto ? ' aberto' : '') + '">' +
      '<button type="button" class="atb-topo" data-acao="atb-abrir" data-id="' + esc(a.id) + '">' +
        '<span class="atb-nome">' + esc(a.quadro) +
          '<span class="atb-sub">' + esc(a.sub) + '</span></span>' +
        (a.atencao ? '<span class="atb-flag" title="Tem armadilha para conferir">!</span>' : '') +
        '<span class="atb-n">' + n + (n === 1 ? ' esquema' : ' esquemas') + '</span>' +
        '<span class="atb-seta">' + ICO(aberto ? 'setaBai' : 'setaDir') + '</span>' +
      '</button>' +
      (aberto ? corpoAtb(a) : '') +
    '</article>';
  }

  /* --- resultados da busca dentro da secao --- */
  function listaAtb(lista) {
    var termos = norm(buscaAtb).split(/\s+/).filter(Boolean);
    var mostra = lista.filter(function (a) {
      var ix = norm([a.quadro, a.sub, a.sitio, (a.tags || []).join(' '), a.agentes, a.atencao, a.nota,
        (a.escolha || []).concat(a.alt || []).map(function (e) {
          return e.atb + ' ' + e.dose + ' ' + e.dur;
        }).join(' ')].join(' '));
      return termos.every(function (t) { return ix.indexOf(t) !== -1; });
    });
    if (!mostra.length) return '<div class="pendente">Nenhum esquema encontrado.</div>';

    var porSitio = {}, ordem = [];
    mostra.forEach(function (a) {
      if (!porSitio[a.sitio]) { porSitio[a.sitio] = []; ordem.push(a.sitio); }
      porSitio[a.sitio].push(a);
    });
    return ordem.map(function (g) {
      var s = sitioDe(slugDoSitio(g)) || { icone: '' };
      return '<section class="atb-secao"><h4>' + ICO(s.icone) + esc(g) + '<i>' + porSitio[g].length + '</i></h4>' +
        '<div class="cc-grade">' + porSitio[g].map(cartaoAtb).join('') + '</div></section>';
    }).join('');
  }

  /* --- a capa: escolhe-se o sitio --- */
  function capaAtb(lista) {
    return '<div class="atb-grade">' + SITIOS.map(function (s) {
      var n = lista.filter(function (a) { return a.sitio === s.nome; }).length;
      if (!n) return '';
      var exemplos = lista.filter(function (a) { return a.sitio === s.nome; })
        .slice(0, 3).map(function (a) { return a.quadro.split(' — ')[0]; }).join(' · ');
      return '<a class="atb-sitio" href="#atb/' + s.id + '">' +
        '<span class="as-emoji">' + ICO(s.icone) + '</span>' +
        '<span class="as-nome">' + esc(s.nome) + '</span>' +
        '<span class="as-conta">' + n + (n === 1 ? ' esquema' : ' esquemas') + '</span>' +
      '</a>';
    }).join('') + '</div>';
  }

  /* o miolo da secao: busca, sitio escolhido ou a capa */
  function conteudoAtb(lista) {
    if (buscaAtb.trim()) return listaAtb(lista);
    var sitio = slugAtb ? sitioDe(slugAtb) : null;
    if (sitio) {
      return '<div class="atb-secao"><div class="cc-grade">' + lista.filter(function (a) {
        return a.sitio === sitio.nome;
      }).map(cartaoAtb).join('') + '</div></div>';
    }
    return capaAtb(lista);
  }

  /* =========================================================
     SECOES DE TOPO
     Cada uma tem capa de cartoes e telas filhas, no padrao do ATB.
     ========================================================= */
  function contaCards(p) { return Base.cards(p).length; }

  var SECOES = [
    { id:'presc', nome:'Receitas prontas', icone:'receita',
      lead:'',
      plana: function () { return telaQuadros(); } },

    { id:'eletrolitos', nome:'Eletrólitos', icone:'gota',
      lead:'',
      capa: function () { return window.Eletrolitos ? Eletrolitos.capa() : ''; },
      filhas: function () { return window.Eletrolitos ? Eletrolitos.filhas() : []; } },

    { id:'pediatria', nome:'Pediatria', icone:'crianca',
      lead:'',
      plana: function () { return telaPediatria(); } },

    { id:'calc', nome:'Calculadoras', icone:'calc',
      lead:'',
      plana: function () { return telaCalculadoras('formula', true); } },

    { id:'scores', nome:'Scores', icone:'grafico',
      lead:'',
      plana: function () { return telaCalculadoras('escore', true); } },

    { id:'prontuario', nome:'Prontuário', icone:'prontuar',
      lead:'',
      filhas: function () {
        return [
          { id:'modelos',  nome:'Modelos de anamnese', icone:'prontuar',
            conta: contaCards('anamnese') + ' modelos',
            ex: '',
            tela: function () { return telaPasta('anamnese', { nu:true, semManobras:true, semBancada:true }); } },
          { id:'atestado', nome:'Atestado', icone:'laudo',
            conta: 'nome, CPF e CID',
            ex: '',
            tela: function () { return telaAtestado(); } },
          { id:'conduta',  nome:'Conduta e orientações', icone:'esteto',
            conta: contaCards('conduta') + ' textos',
            ex: '',
            tela: function () { return telaPasta('conduta', { nu:true, semBancada:true }); } },
          { id:'evasao',   nome:'Evasão', icone:'porta',
            conta: contaCards('evasao') + ' registros',
            ex: '',
            tela: function () { return telaPasta('evasao', { nu:true, semBancada:true }); } },
          { id:'laudos',   nome:'Laudos', icone:'laudo',
            conta: contaCards('laudos') + ' laudos',
            ex: '',
            tela: function () { return telaPasta('laudos', { nu:true, semBancada:true }); } },
          { id:'plantao',  nome:'Passagem de plantão', icone:'relogio',
            conta: 'modelo I-PASS, por gravidade',
            ex: '',
            tela: function () { return telaPlantao(); } },
          { id:'regulacao', nome:'Regulação e transferência', icone:'elo',
            conta: 'texto para a central + transporte',
            ex: '',
            tela: function () { return telaRegulacao(); } },
          { id:'obito',    nome:'Declaração de óbito', icone:'livro',
            conta: 'quem preenche e como',
            ex: '',
            tela: function () { return telaObito(); } },
          { id:'notificacao', nome:'Notificação compulsória', icone:'escudo',
            conta: 'lista nacional vigente',
            ex: '',
            tela: function () { return telaNotificacao(); } }
        ];
      } }
  ];

  function secaoDe(id) {
    for (var i = 0; i < SECOES.length; i++) if (SECOES[i].id === id) return SECOES[i];
    return null;
  }
  function filhaDe(sec, id) {
    var f = sec.filhas ? sec.filhas() : [];
    for (var i = 0; i < f.length; i++) if (f[i].id === id) return f[i];
    return null;
  }

  /* a bancada de cada secao guarda o rascunho na propria chave */
  var secAtual = null, subAtual = null, alvoSec = null;

  function capaSecao(sec) {
    return '<div class="atb-grade">' + sec.filhas().map(function (f) {
      return '<a class="atb-sitio" href="#' + sec.id + '/' + f.id + '">' +
        '<span class="as-emoji">' + ICO(f.icone) + '</span>' +
        '<span class="as-nome">' + esc(f.nome) + '</span>' +
        '<span class="as-conta">' + esc(f.conta) + '</span>' +
      '</a>';
    }).join('') + '</div>';
  }

  F.secoes = SECOES;

  F.sumarioSecao = function (sec, ativo) {
    var f = (ativo && sec.filhas) ? sec.filhas() : [];
    return '<a href="#' + sec.id + '" class="toplink atb-top' + (ativo ? ' active' : '') + '">' +
        ICO(sec.icone) + '<span>' + esc(sec.nome) + '</span></a>' +
      (ativo && f.length ? f.map(function (x) {
        return '<a class="sub' + (ativo === x.id ? ' aqui' : '') + '" href="#' + sec.id + '/' + x.id + '">' +
          ICO(x.icone) + '<span>' + esc(x.nome) + '</span>' + '</a>';
      }).join('') : '');
  };

  F.desenhaSecao = function (container, secId, subId) {
    var sec = secaoDe(secId);
    if (!sec) return;
    secAtual = secId; subAtual = subId || null; alvoSec = container;

    var filha = sec.filhas && subId ? filhaDe(sec, subId) : null;
    var html = '<section class="phase atb ferr">';

    html += '<div class="atb-head">' +
      (filha ? '<a class="voltar" href="#' + sec.id + '">&larr; ' + esc(sec.nome) + '</a>' : '') +
      '<div class="atb-titulo">' +
        '<span class="atb-emoji">' + ICO(filha ? filha.icone : sec.icone) + '</span>' +
        '<h2>' + esc(filha ? filha.nome : sec.nome) + '</h2>' +
      '</div>' +

    '</div>';

    if (sec.plana)      html += sec.plana();
    else if (filha)     html += filha.tela();
    else if (sec.capa)  html += sec.capa();
    else                html += capaSecao(sec);

    /* algumas telas filhas ja trazem a propria area de trabalho */
    if (html.indexOf('id="ferrBancada"') === -1) html += bancada(secId);
    container.innerHTML = html + '</section>';
    rolaAoAberto();
  };

  /* =========================================================
     ANTIBIOTICOS — secao propria, fora das Ferramentas
     ========================================================= */
  F.sumarioAtb = function (ativo) {
    return '<a href="#atb" class="toplink atb-top' + (ativo ? ' active' : '') + '">' +
        ICO('micro') + '<span>Antibióticos</span></a>' +
      (ativo ? SITIOS.map(function (s) {
        var n = Base.atb().filter(function (a) { return a.sitio === s.nome; }).length;
        if (!n) return '';
        return '<a class="sub' + (ativo === s.id ? ' aqui' : '') + '" href="#atb/' + s.id + '">' +
          ICO(s.icone) + '<span>' + esc(s.nome) + '</span>' + '</a>';
      }).join('') : '') +
      '<div class="ferr-sep"></div>';
  };

  F.desenhaAtb = function (container, slug) {
    alvoAtb = container;
    slugAtb = slug || null;
    var lista = Base.atb();
    var sitio = slug ? sitioDe(slug) : null;

    /* a classe `ferr` e o que liga a delegacao de eventos comum */
    var html = '<section class="phase atb ferr">';

    html += '<div class="atb-head">' +
      (sitio ? '<a class="voltar" href="#atb">&larr; Antibióticos</a>' : '') +
      '<div class="atb-titulo">' +
        '<span class="atb-emoji">' + ICO(sitio ? sitio.icone : 'micro') + '</span>' +
        '<h2>' + (sitio ? esc(sitio.nome) : 'Antibióticos') + '</h2>' +
      '</div>' +
      '</div>';

    html += '<input type="search" class="ferr-busca-local atb-busca" id="ferrBuscaAtb" ' +
      'placeholder="Buscar por germe, antibiótico ou quadro…" value="' + esc(buscaAtb) + '">';

    html += '<div id="ferrListaAtb">' + conteudoAtb(lista) + '</div>';

    html += bancada('atb');
    container.innerHTML = html + '</section>';
    rolaAoAberto();
  };

  /* =========================================================
     ESPECIAIS — HAS, DM, psiquiatria, inalacao
     ========================================================= */
  var SUBS_ESP = [
    { id:'has',  nome:'HAS' },
    { id:'dm',   nome:'DM' },
    { id:'psiq', nome:'Psiquiatria' },
    { id:'inal', nome:'Inalação' }
  ];

  function escalaDM() { return ler('ferr:dm', FERR_DM_ESCALA); }

  function textoDM(completa) {
    var e = escalaDM();
    if (completa) {
      return 'PRESCRIÇÃO — ESQUEMA DE INSULINA REGULAR SUBCUTÂNEA\n\n' +
        'Verificar glicemia capilar de 6/6 h e aplicar insulina regular SC conforme a escala:\n' +
        e.map(function (f) {
          return '  ' + f.faixa + ' .......... ' + (f.ui ? f.ui + ' UI SC' : 'não aplicar');
        }).join('\n') +
        '\n\nComunicar o médico se glicemia menor que 70 mg/dL ou maior que 400 mg/dL.';
    }
    if (glicemia === null) return '';
    var f = e[glicemia];
    return 'PRESCRIÇÃO — INSULINA REGULAR SUBCUTÂNEA\n\n' +
      'Glicemia capilar aferida: ' + f.faixa + '.\n' +
      (f.ui
        ? '1) INSULINA HUMANA REGULAR 100 UI/ML .......... ' + f.ui + ' UI — SC agora\n\n' +
          'Reavaliar glicemia capilar em 1 hora após a aplicação.'
        : 'Não há indicação de insulina regular nesta faixa. Reavaliar glicemia capilar em 4 horas.');
  }

  function telaDM() {
    var e = escalaDM();
    var h = '<div class="ferr-bloco">' +
      '<div class="ferr-bloco-topo"><h3>Glicemia capilar → insulina regular SC</h3>' +
        '<div class="ferr-mini">' +
          '<button type="button" class="ferr-btn peq" data-acao="dm-escala">Copiar escala completa</button>' +
          '<button type="button" class="ferr-btn peq" data-acao="dm-limpar">Limpar</button>' +
        '</div></div>' +
      '<p class="ferr-nota">Escala de correção. Conferir sempre com o protocolo da unidade e com a insulina basal em uso.</p>' +
      '<div class="ferr-escala">' + e.map(function (f, i) {
        return '<button type="button" class="ferr-faixa' + (glicemia === i ? ' on' : '') + '" ' +
          'data-acao="dm-faixa" data-i="' + i + '">' +
          '<span class="ferr-faixa-v">' + esc(f.faixa) + '</span>' +
          '<span class="ferr-faixa-ui">' + (f.ui ? f.ui + ' UI' : '—') + '</span>' +
        '</button>';
      }).join('') + '</div></div>';

    var t = textoDM(false);
    h += '<div class="ferr-bloco saida">' +
      '<div class="ferr-bloco-topo"><h3>Prescrição gerada</h3>' +
        '<div class="ferr-mini">' +
          '<button type="button" class="ferr-btn peq forte" data-acao="dm-copiar">Copiar tudo</button>' +
        '</div></div>' +
      (t ? '<pre class="ferr-saida">' + esc(t) + '</pre>'
         : '<div class="pendente">Selecione a faixa de glicemia para gerar a prescrição.</div>') +
    '</div>';
    return h;
  }

  function textoInal() {
    var ids = Object.keys(inalSel).filter(function (k) { return inalSel[k]; });
    if (!ids.length) return '';
    var linhas = ids.map(function (id, n) {
      var m = null;
      FERR_INAL.forEach(function (x) { if (x.id === id) m = x; });
      return (n + 1) + ') ' + m.value + ' .......... ' + inalSel[id];
    });
    return 'PRESCRIÇÃO — INALAÇÃO\n\n' + linhas.join('\n') +
      '\n\nDiluir em ' + inalDiluente + ' e nebulizar com oxigênio a 6 a 8 L/min.' +
      '\nRealizar ' + inalCiclos + (inalCiclos > 1 ? ' ciclos, com intervalo de 20 minutos entre eles.' : ' ciclo.') +
      '\n\nDesfecho: ' + (desfecho.inal || DESFECHOS[1]) + '.';
  }

  function telaInal() {
    var h = '<div class="ferr-bloco">' +
      '<div class="ferr-bloco-topo"><h3>Medicações inalatórias</h3>' +
        '<div class="ferr-mini"><button type="button" class="ferr-btn peq" data-acao="inal-limpar">Limpar</button></div>' +
      '</div>' +
      '<div class="ferr-meds">' + FERR_INAL.map(function (m) {
        var on = !!inalSel[m.id];
        return '<article class="ferr-med' + (on ? ' on' : '') + '">' +
          '<button type="button" class="ferr-med-corpo" data-acao="inal-toggle" data-id="' + esc(m.id) + '">' +
            '<span class="ferr-med-nome">' + esc(m.label) + '</span>' +
            '<span class="ferr-med-sub">' + esc(m.value) + '</span>' +
          '</button>' +
          (on ? '<div class="ferr-med-ctrl"><select data-acao="inal-dose" data-id="' + esc(m.id) + '">' +
              m.opcoes.map(function (o) {
                return '<option value="' + esc(o) + '"' + (inalSel[m.id] === o ? ' selected' : '') + '>' + esc(o) + '</option>';
              }).join('') + '</select></div>' : '') +
        '</article>';
      }).join('') + '</div>' +

      '<div class="ferr-campos">' +
        '<label class="ferr-campo"><span>Diluente</span><select data-acao="inal-diluente">' +
          FERR_INAL_DILUENTES.map(function (d) {
            return '<option value="' + esc(d) + '"' + (inalDiluente === d ? ' selected' : '') + '>' + esc(d) + '</option>';
          }).join('') + '</select></label>' +
        '<label class="ferr-campo"><span>Ciclos</span><select data-acao="inal-ciclos">' +
          [1,2,3].map(function (n) {
            return '<option value="' + n + '"' + (inalCiclos === n ? ' selected' : '') + '>' + n + '</option>';
          }).join('') + '</select></label>' +
        '<label class="ferr-campo"><span>Desfecho</span><select data-acao="presc-desfecho" data-ctx="inal">' +
          DESFECHOS.map(function (d) {
            return '<option value="' + esc(d) + '"' + ((desfecho.inal || DESFECHOS[1]) === d ? ' selected' : '') + '>' + esc(d) + '</option>';
          }).join('') + '</select></label>' +
      '</div></div>';

    var t = textoInal();
    h += '<div class="ferr-bloco saida">' +
      '<div class="ferr-bloco-topo"><h3>Prescrição gerada</h3>' +
        '<div class="ferr-mini"><button type="button" class="ferr-btn peq forte" data-acao="inal-copiar">Copiar tudo</button></div>' +
      '</div>' +
      (t ? '<pre class="ferr-saida">' + esc(t) + '</pre>'
         : '<div class="pendente">Selecione ao menos uma medicação.</div>') +
    '</div>';
    return h;
  }

  function telaEspeciais() {
    var html = '';
    html += '<div class="ferr-subabas">' + SUBS_ESP.map(function (s) {
      return '<button type="button" class="ferr-subaba' + (subEsp === s.id ? ' on' : '') +
             '" data-acao="esp-sub" data-v="' + s.id + '">' + esc(s.nome) + '</button>';
    }).join('') + '</div>';
    if (subEsp === 'has')  html += telaPresc('has', true);
    if (subEsp === 'psiq') html += telaPresc('psiq', true);
    if (subEsp === 'dm')   html += telaDM();
    if (subEsp === 'inal') html += telaInal();
    return html;
  }

  /* =========================================================
     ROTEADOR E DESENHO
     ========================================================= */
  function tela() {
    if (PASTAS[abaAtual])          return telaPasta(abaAtual);
    if (abaAtual === 'calculadoras') return telaCalculadoras();
    if (abaAtual === 'quadros')    return telaQuadros();
    if (abaAtual === 'especiais')  return telaEspeciais();
    if (CFG[abaAtual])             return telaPresc(abaAtual);
    return telaPasta('anamnese');
  }

  F.abas = ABAS;
  F.ehAba = function (id) { return ehAba(id); };
  F.aba   = function () { return abaAtual; };

  /* sumario lateral: uma linha por aba */
  F.sumario = function (ativa) {
    return '<a href="#ferramentas" class="toplink ferr-top' + (ativa ? ' active' : '') + '">' +
        'Ferramentas</a><div class="ferr-sep"></div>';
  };

  /* ---------- indice para a busca unificada do guia ----------
     Devolve tudo que mora nas Ferramentas num formato comum:
     { tipo, id, titulo, sub, href, texto } — o app.js junta com as condutas. */
  var cacheIx = null;
  /* rascunhos com conteúdo, para a home mostrar "continue o atendimento" */
  F.contaQuadros = function () { return Base.quadros().length; };

  F.rascunhos = function () {
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k.indexOf('ferr:rascunho:') !== 0) continue;
      var txt = ler(k, '');
      if (typeof txt !== 'string' || !txt.trim()) continue;
      var chave = k.replace('ferr:rascunho:', '');
      out.push({ chave:chave, texto:txt, linhas:txt.trim().split('\n').length });
    }
    return out;
  };
  F.limpaRascunho = function (chave) { Base.setRascunho(chave, ''); };

  F.iniciaBancada = function () {
    migraBancadas();
    var b = document.getElementById('ferrBancada');
    if (b) b.value = bancTexto();
    pintaBanc();
  };

  F.copiarClinico = copiarClinico;
  F.pilha = pilha;
  F.indice = function () {
    if (cacheIx) return cacheIx;
    var out = [];

    Base.quadros().forEach(function (q) {
      out.push({ tipo:'quadro', id:q.id, titulo:q.nome, sub:q.sub, href:'#presc',
        abre:q.id,
        texto:[q.nome, q.sub, q.grupo, (q.tags||[]).join(' '), q.atencao,
          (q.unidade||[]).map(function(u){return u.med+' '+u.dose+' '+u.obs;}).join(' '),
          (q.receita||[]).map(function(r){return r.med+' '+r.uso;}).join(' '),
          (q.orientacoes||[]).join(' ')].join(' ') });
    });

    Base.atb().forEach(function (a) {
      out.push({ tipo:'antibiotico', id:a.id, titulo:a.quadro, sub:a.sitio,
        href:'#atb/' + slugDoSitio(a.sitio), abre:a.id,
        texto:[a.quadro, a.sub, a.sitio, (a.tags||[]).join(' '), a.agentes, a.atencao, a.nota,
          (a.escolha||[]).concat(a.alt||[]).map(function(e){return e.atb+' '+e.dose+' '+e.via+' '+e.dur;}).join(' ')].join(' ') });
    });

    if (window.Eletrolitos) Eletrolitos.indice().forEach(function (x) { out.push(x); });
    (typeof FERR_INTERNADOS !== 'undefined' ? FERR_INTERNADOS : []).forEach(function (p) {
      out.push({ tipo:'quadro', id:p.id, titulo:p.nome, sub:'Internados · ' + p.sub, href:'#presc', abre:p.id,
        texto:[p.nome, p.sub, p.grupo, (p.itens || []).map(function (x) { return x.med + ' ' + x.obs; }).join(' ')].join(' ') });
    });

    FERR_CALC.forEach(function (c) {
      out.push({ tipo:(c.tipo === 'escore' ? 'score' : 'calculadora'),
        id:c.id, titulo:c.nome, sub:c.sub,
        href:'#' + ((c.secao || c.tipo) === 'escore' ? 'scores' : 'calc'), abre:c.id,
        texto:[c.nome, c.sub, (c.campos||[]).map(function(x){return x.rot;}).join(' '),
          (c.itens||[]).map(function(x){return x.rot;}).join(' ')].join(' ') });
    });

    [['plantao', 'Passagem de plantão', 'I-PASS, pendências, se… então…, troca de plantão, handoff, SBAR'],
     ['regulacao', 'Regulação e transferência', 'central de regulação, vaga, transferência, transporte, ambulância, UTI'],
     ['obito', 'Declaração de óbito', 'atestado de óbito, DO, causa básica, SVO, IML, óbito fetal'],
     ['notificacao', 'Notificação compulsória', 'SINAN, vigilância, notificar, agravo, portaria, CIEVS, violência']
    ].forEach(function (x) {
      out.push({ tipo:'texto', id:'doc-' + x[0], titulo:x[1], sub:'Prontuário', href:'#prontuario/' + x[0], texto:x[1] + ' ' + x[2] });
    });
    if (typeof FERR_DOC_NOTIF !== 'undefined') FERR_DOC_NOTIF.itens.forEach(function (x, i) {
      out.push({ tipo:'texto', id:'notif-' + i, titulo:'Notificação: ' + x[0],
        sub:{ ms:'Imediata — MS, Estado e Município', ses:'Imediata — Estado e Município', sms:'Imediata — Município', sem:'Semanal' }[x[1]],
        href:'#prontuario/notificacao', texto:'notificacao compulsoria ' + x[0] });
    });

    Object.keys(FERR_CARDS).forEach(function (pasta) {
      Base.cards(pasta).forEach(function (c) {
        out.push({ tipo:'texto', id:c.id, titulo:c.label, sub:c.sub || abaDe(pasta).nome,
          href:'#' + ({anamnese:'prontuario/modelos',conduta:'prontuario/conduta',evasao:'prontuario/evasao',laudos:'prontuario/laudos'}[pasta] || 'prontuario'),
          texto:[c.label, c.sub, c.texto].join(' ') });
      });
    });

    /* manobras e sinais saíram da navegação; ficam só como dado da anamnese */

    ['im','ev','has','psiq'].forEach(function (ctx) {
      Base.meds(ctx).forEach(function (m) {
        out.push({ tipo:'medicacao', id:m.id, titulo:m.label,
          sub:(m.grupo || m.via || '') + ' · ' + abaDe(ctx === 'has' || ctx === 'psiq' ? 'especiais' : ctx).nome,
          href:'#presc/' + (ctx === 'has' || ctx === 'psiq' ? 'especiais' : ctx),
          texto:[m.label, m.value, m.grupo, m.via].join(' ') });
      });
    });
    po().forEach(function (cat) {
      (cat.meds || []).forEach(function (m) {
        out.push({ tipo:'medicacao', id:m.id, titulo:m.nome, sub:cat.categoria + ' · Oral',
          href:'#presc/oral', texto:[m.nome, m.uso, cat.categoria].join(' ') });
      });
    });

    out.forEach(function (o) { o.norm = norm(o.texto); });
    cacheIx = out;
    return out;
  };
  F.limpaIndice = function () { cacheIx = null; };

  /* o item aberto pela busca precisa aparecer sozinho na tela:
     abrir sem rolar deixa o cartao perdido no meio de 104 quadros */
  var focarApos = null;
  function rolaAoAberto() {
    if (!focarApos) return;
    var sel = focarApos; focarApos = null;
    requestAnimationFrame(function () {
      var el = document.querySelector(sel);
      if (!el) return;
      var topo = el.getBoundingClientRect().top + window.scrollY -
                 (parseInt(getComputedStyle(document.documentElement)
                   .getPropertyValue('--h-topo'), 10) || 57) - 14;
      window.scrollTo({ top: Math.max(0, topo), behavior: 'smooth' });
    });
  }

  /* #atb e #atb/<sítio> caem nas Prescrições, no contexto Antibióticos */
  F.irAtb = function (slug) {
    if (ctxRx === 'internados') { ctxRx = 'porta'; grava('pref:rx-ctx', 'porta'); }
    var st = slug ? sitioDe(slug) : null;
    filtroQuadro = st ? 'Antibióticos · ' + st.nome : 'todos';
    alvoAtb = null;
  };

  /* abre a aba certa ja com o item expandido (usado pela busca) */
  F.abrirItem = function (tipo, id) {
    if (tipo === 'quadro')      { quadroAberto = id; filtroQuadro = 'todos'; buscaQuadro = ''; }
    if (tipo === 'calculadora' || tipo === 'score') { calcAberta = id; }
    if (tipo === 'antibiotico') {
      atbAberto = id; buscaAtb = ''; buscaQuadro = ''; filtroQuadro = 'todos';
      if (ctxRx === 'internados') { ctxRx = 'porta'; grava('pref:rx-ctx', 'porta'); }
    }
    if (tipo === 'manobra')     { filtroEx = 'todos'; }
    focarApos = { quadro:'.ferr-quadro.aberto', calculadora:'.ferr-calc.aberta',
                  score:'.ferr-calc.aberta', antibiotico:'.atb-item.aberto' }[tipo] || null;
  };

  F.desenha = function (container, sub) {
    alvo = container;
    if (sub && ehAba(sub)) abaAtual = sub;
    grava('ferr:aba', abaAtual);
    container.innerHTML = '<section class="phase ferr">' +
      '<div class="ferr-abas">' + ABAS.map(function (a) {
        return '<a class="ferr-aba' + (abaAtual === a.id ? ' on' : '') + '" href="#ferramentas/' + a.id + '">' +
          esc(a.nome) + '</a>';
      }).join('') + '</div>' +
      tela() +
    '</section>';
  };

  function redesenha() {
    F.limpaIndice();
    var h = (location.hash || '').replace(/^#/, '');
    /* cada secao tem tela propria: nao redesenhar as Ferramentas por cima */
    if (alvoAtb && h.indexOf('atb') === 0) { F.desenhaAtb(alvoAtb, slugAtb); return; }
    if (alvoSec && secAtual && h.indexOf(secAtual) === 0) {
      F.desenhaSecao(alvoSec, secAtual, subAtual);
      return;
    }
    if (alvo) F.desenha(alvo, abaAtual);
  }
  /* qual pasta de texto esta aberta: pela secao, com a aba antiga de reserva */
  var PASTA_DA_FILHA = { modelos:'anamnese', conduta:'conduta', evasao:'evasao', laudos:'laudos' };
  function pastaAtual() {
    var h = (location.hash || '').replace(/^#/, '').split('/');
    if (h[0] === 'prontuario' && PASTA_DA_FILHA[h[1]]) return PASTA_DA_FILHA[h[1]];
    return PASTAS[abaAtual];
  }

  function chaveRascunho() {
    var h = (location.hash || '').replace(/^#/, '').split('/')[0];
    if (h === 'atb' || secaoDe(h)) return h;
    return abaAtual;
  }
  /* imprime só a prescrição, em folha de receituário */
  function imprimir(titulo, texto, sub) {
    var velha = document.getElementById('ferrImpressao');
    if (velha) velha.remove();
    var el = document.getElementById('peso');
    var kg = el && el.value ? el.value : '';
    var agora = new Date();
    var dd = String(agora.getDate()).padStart(2, '0') + '/' +
      String(agora.getMonth() + 1).padStart(2, '0') + '/' + agora.getFullYear();
    var hh = String(agora.getHours()).padStart(2, '0') + ':' +
      String(agora.getMinutes()).padStart(2, '0');
    var d = document.createElement('div');
    d.id = 'ferrImpressao';
    d.innerHTML =
      '<header class="fi-topo">' +
        '<div class="fi-tit"><h1>' + esc(titulo) + '</h1>' +
          (sub ? '<p class="fi-sub">' + esc(sub) + '</p>' : '') + '</div>' +
        '<div class="fi-meta"><span>' + dd + ' · ' + hh + '</span>' +
          (kg ? '<span>Peso: <b>' + esc(kg) + ' kg</b></span>' : '') + '</div>' +
      '</header>' +
      '<div class="fi-paciente">' +
        '<span>Paciente</span><span class="fi-linha"></span>' +
        '<span>Registro</span><span class="fi-linha curta"></span>' +
      '</div>' +
      '<pre>' + esc(texto) + '</pre>' +
      '<div class="fi-assina">' +
        '<span class="fi-linha"></span>' +
        '<span class="fi-rot">Assinatura e CRM</span>' +
      '</div>' +
      '<footer>Conferir peso, alergias, função renal e a padronização do serviço antes de administrar.</footer>';
    document.body.appendChild(d);
    document.body.classList.add('imprimindo');
    function limpa() {
      document.body.classList.remove('imprimindo');
      var x = document.getElementById('ferrImpressao');
      if (x) x.remove();
      window.removeEventListener('afterprint', limpa);
    }
    window.addEventListener('afterprint', limpa);
    setTimeout(function () { window.print(); setTimeout(limpa, 800); }, 60);
  }

  function pilha(txt) {
    var atual = bancTexto();
    var novo = (atual ? atual.replace(/\s*$/, '') + '\n\n' : '') + marcas(txt);
    Base.setRascunho(CHAVE_BANC, novo);
    toast('Empilhado no rascunho');
    var b = document.getElementById('ferrBancada');
    if (b) b.value = novo;
    pintaBanc();
    /* abrir ANTES de rolar: com o painel fechado a textarea nao tem altura
       e o scrollTop nao sai do zero, escondendo o que acabou de entrar */
    if (window.UI && UI.abreBancada) UI.abreBancada();
    mostraFim(b);
  }

  /* leva o painel ao trecho recem-empilhado e o pisca uma vez */
  function mostraFim(b) {
    if (!b) return;
    requestAnimationFrame(function () {
      b.scrollTop = b.scrollHeight;
      var p = document.getElementById('banc');
      if (!p) return;
      p.classList.remove('banc-chegou');
      void p.offsetWidth;
      p.classList.add('banc-chegou');
    });
  }

  /* =========================================================
     EVENTOS
     ========================================================= */
  function dentro(e) { return e.target.closest && e.target.closest('.ferr'); }
  function redesenhaFixo() {
    var y = window.scrollY;
    redesenha();
    window.scrollTo(0, y);
  }
  var cardAberto = null;
  function achaCard(pasta, id) {
    var l = Base.cards(pasta);
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }
  function achaEx(id) {
    var l = Base.exame();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }
  function abreForm(qual, item, ctx) {
    form = qual; form_alvo = item || null; form_ctx = ctx || null;
    redesenhaFixo();
  }
  function fechaForm() { form = null; form_alvo = null; form_ctx = null; redesenhaFixo(); }

  /* ---------- cliques ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-acao]');
    if (!b || !dentro(e)) return;
    var acao = b.dataset.acao, id = b.dataset.id, ctx = b.dataset.ctx, v = b.dataset.v;
    var pasta = pastaAtual();

    /* --- formularios --- */
    if (acao === 'form-fechar') { e.preventDefault(); fechaForm(); return; }

    /* --- atestado --- */
    if (acao === 'at-tipo')     { at.tipo = v; redesenhaFixo(); return; }
    if (acao === 'at-cid')      { at.cid = v; if (v) { atBuscaCid = ''; at.cidTxt = ''; } redesenhaFixo(); return; }
    if (acao === 'at-copiar')   { copiar(textoAtestado(), 'Atestado'); return; }
    if (acao === 'at-rascunho') { pilha(textoAtestado()); return; }
    if (acao === 'at-imprimir') { imprimir('Atestado médico', textoAtestado().replace(/^ATESTADO MÉDICO\n\n/, '')); return; }
    if (acao === 'at-limpar')   { at = { tipo:at.tipo, nome:'', cpf:'', cid:'', cidTxt:'', dias:'1', data:hojeISO(), ini:'', fim:'', comCid:false }; atBuscaCid = ''; redesenhaFixo(); return; }

    /* --- pastas de texto --- */
    if (acao === 'card-novo')    { abreForm('card', null); return; }
    if (acao === 'card-abrir')   { cardAberto = (cardAberto === id ? null : id); redesenhaFixo(); return; }
    if (acao === 'card-editar')  { cardAberto = id; redesenhaFixo(); return; }
    if (acao === 'card-salvar') {
      var ta = document.querySelector('[data-card-txt="' + id + '"]');
      var cs = achaCard(pasta, id);
      if (!ta || !cs) return;
      cs.texto = ta.value;
      var lc = Base.cards(pasta).map(function (x) { return x.id === id ? cs : x; });
      Base.setCards(pasta, lc);
      toast('Salvo'); redesenhaFixo(); return;
    }
    if (acao === 'card-apagar') {
      var c0 = achaCard(pasta, id);
      if (!c0 || !confirm('Apagar “' + c0.label + '”?')) return;
      Base.setCards(pasta, Base.cards(pasta).filter(function (x) { return x.id !== id; }));
      toast('Apagado'); redesenhaFixo(); return;
    }
    if (acao === 'card-copiar')   { var c1 = achaCard(pasta, id); if (c1) { copiar(c1.texto, c1.label); pilha(c1.texto); } return; }
    if (acao === 'card-empilhar') { var c2 = achaCard(pasta, id); if (c2) pilha(c2.texto); return; }
    if (acao === 'pasta-restaurar') {
      if (!confirm('Restaurar os textos padrão desta pasta? Isso apaga o que você editou aqui.')) return;
      Base.resetCards(pasta); toast('Padrão restaurado'); redesenhaFixo(); return;
    }

    /* --- manobras --- */
    if (acao === 'ex-filtro')    { filtroEx = v; redesenhaFixo(); return; }
    if (acao === 'ex-novo')      { abreForm('exame', null); return; }
    if (acao === 'ex-editar')    { abreForm('exame', achaEx(id)); return; }
    if (acao === 'ex-apagar') {
      var x0 = achaEx(id);
      if (!x0 || !confirm('Apagar “' + x0.nome + '”?')) return;
      Base.setExame(Base.exame().filter(function (x) { return x.id !== id; }));
      toast('Apagado'); redesenhaFixo(); return;
    }
    if (acao === 'ex-copiar')    { var x1 = achaEx(id); if (x1) copiar(x1.texto, x1.nome); return; }
    if (acao === 'ex-empilhar')  { var x2 = achaEx(id); if (x2) pilha(x2.texto); return; }
    if (acao === 'ex-restaurar') {
      if (!confirm('Restaurar as manobras padrão? Isso apaga o que você editou aqui.')) return;
      Base.resetExame(); filtroEx = 'todos'; toast('Padrão restaurado'); redesenhaFixo(); return;
    }

    /* --- area de trabalho --- */
    if (acao === 'banc-copiar') {
      var t0 = (document.getElementById('ferrBancada') || {}).value || '';
      if (!t0.trim()) { toast('O rascunho está vazio', true); return; }
      copiar(t0, 'Texto'); return;
    }
    if (acao === 'banc-imprimir') {
      var tb = (document.getElementById('ferrBancada') || {}).value || '';
      if (!tb.trim()) { toast('O rascunho está vazio', true); return; }
      imprimir('Prescrição', tb); return;
    }
    if (acao === 'banc-limpar') {
      if (!confirm('Limpar o rascunho?')) return;
      Base.setRascunho(CHAVE_BANC, '');
      var bl = document.getElementById('ferrBancada'); if (bl) bl.value = '';
      pintaBanc(); return;
    }

    if (acao === 'calc-ramo') { filtroRamo = v; calcAberta = null; redesenhaFixo(); return; }

    /* --- cabeçalho do paciente --- */
    if (acao === 'pac-limpar') {
      grava('pac-nome', ''); grava('pac-idade', '');
      var gp = document.getElementById('peso');
      if (gp) { gp.value = ''; gp.dispatchEvent(new Event('input', { bubbles:true })); }
      pacAberto = true; redesenhaFixo(); return;
    }

    /* --- ajuste rápido de posologia --- */
    if (acao === 'rx-dias' || acao === 'rx-horas') {
      var qd = quadroDe(id);
      if (!qd) return;
      var itens = rxDe(qd, 'receita').map(function (x) { return { med:x.med, uso:x.uso }; });
      var alvo = itens[+b.dataset.i];
      if (!alvo) return;
      alvo.uso = (acao === 'rx-dias')
        ? trocaDias(alvo.uso, +b.dataset.n)
        : trocaHoras(alvo.uso, +b.dataset.n);
      rxGrava(qd, 'receita', itens);
      redesenhaFixo(); return;
    }

    /* --- protótipo de prescrição --- */
    if (acao === 'proto-todos') {
      var qp = quadroDe(id), pa = b.dataset.parte;
      if (!qp) return;
      var l = rxDe(qp, pa);
      var todosFora = l.every(function (_, i) { return foraDe(qp, pa, i); });
      if (!rxFora[qp.id]) rxFora[qp.id] = {};
      l.forEach(function (_, i) {
        if (todosFora) delete rxFora[qp.id][pa + ':' + i];
        else rxFora[qp.id][pa + ':' + i] = 1;
      });
      redesenhaFixo(); return;
    }
    if (acao === 'rx-ctx') { ctxRx = v; grava('pref:rx-ctx', v); quadroAberto = null; internadoAberto = null; atbAberto = null; redesenhaFixo(); return; }
    if (acao === 'int-abrir') { internadoAberto = internadoAberto === id ? null : id; redesenhaFixo(); return; }
    if (acao === 'int-copiar') { var i1 = internadoDe(id); if (i1) { copiarClinico(textoInternado(i1), i1.nome, 'presc'); pilha(textoInternado(i1)); } return; }
    if (acao === 'int-imprimir') { var i2 = internadoDe(id); if (i2) imprimir(i2.nome, textoInternado(i2), i2.sub); return; }
    if (acao === 'int-rascunho') { var i3 = internadoDe(id); if (i3) pilha(textoInternado(i3)); return; }
    if (acao === 'proto-copiar') {
      var q1p = quadroDe(id);
      if (q1p) { copiarClinico(textoProto(q1p), q1p.nome, 'presc'); pilha(textoProto(q1p)); }
      return;
    }
    if (acao === 'proto-imprimir') {
      var q2p = quadroDe(id);
      if (q2p) imprimir(q2p.nome, textoProto(q2p), q2p.sub);
      return;
    }
    if (acao === 'proto-rascunho') {
      var q3p = quadroDe(id);
      if (q3p) pilha(textoProto(q3p));
      return;
    }

    /* --- sintomáticos --- */
    if (acao === 'sint-cat') {
      sintAberto = (sintAberto === v) ? null : v;
      redesenhaFixo(); return;
    }
    if (acao === 'sint-add') {
      var cat = b.dataset.cat, alvo = null;
      po().forEach(function (c) {
        if (c.categoria !== cat) return;
        (c.meds || []).forEach(function (m) { if (String(m.id) === b.dataset.id) alvo = m; });
      });
      if (!alvo) return;
      pilha(alvo.nome + '\n' + alvo.uso);
      return;
    }

    /* --- pediatria --- */
    if (acao === 'pedia-filtro') { filtroPedia = v; redesenhaFixo(); return; }
    if (acao === 'pedia-abrir') {
      pedAberto = (pedAberto === id ? null : id);
      var clp = document.getElementById('ferrListaPed');
      if (clp) clp.innerHTML = listaPedia();
      return;
    }
    if (acao === 'pedia-copiar') {
      var mp = null;
      FERR_PEDIA.forEach(function (x) { if (x.id === id) mp = x; });
      if (mp) { var tp = textoPedia(mp, pesoGlobal()); copiarClinico(tp, mp.nome, 'presc'); pilha(tp); }
      return;
    }
    if (acao === 'pedia-conc') {
      if (v === '') delete concPed[id]; else concPed[id] = parseFloat(v);
      var cl2 = document.getElementById('ferrListaPed');
      if (cl2) cl2.innerHTML = listaPedia();
      return;
    }

    /* --- quadros --- */
    if (acao === 'quadro-abrir')  { quadroAberto = (quadroAberto === id ? null : id); redesenhaFixo(); return; }
    if (acao === 'quadro-filtro') { filtroQuadro = v; redesenhaFixo(); return; }
    if (acao === 'quadro-novo')   { abreForm('quadro', null); return; }
    if (acao === 'quadro-editar') { abreForm('quadro', quadroDe(id)); return; }
    if (acao === 'quadro-apagar') {
      var qq = quadroDe(id);
      if (!qq || !confirm('Apagar o quadro "' + qq.nome + '"?')) return;
      Base.setQuadros(Base.quadros().filter(function (x) { return x.id !== id; }));
      toast('Apagado'); redesenhaFixo(); return;
    }
    if (acao === 'quadros-restaurar') {
      if (!confirm('Restaurar os quadros padrão? Isso apaga o que você editou aqui.')) return;
      Base.resetQuadros(); filtroQuadro = 'todos'; buscaQuadro = '';
      toast('Padrão restaurado'); redesenhaFixo(); return;
    }
    /* --- editor de prescrição (só nesta sessão) --- */
    if (acao === 'rx-editar') {
      var chave = id + ':' + b.dataset.p;
      rxEditando = (rxEditando === chave) ? null : chave;
      redesenhaFixo(); return;
    }
    if (acao === 'rx-pronto')  { rxEditando = null; redesenhaFixo(); return; }
    if (acao === 'rx-add' || acao === 'rx-remover' || acao === 'rx-restaurar') {
      var cx = b.closest('.rxe'); if (!cx) return;
      var qe = quadroDe(cx.dataset.q), pe = cx.dataset.parte;
      if (!qe) return;
      if (acao === 'rx-restaurar') { rxReset(qe, pe); rxEditando = null; redesenhaFixo(); return; }
      var lista = rxDe(qe, pe);
      if (acao === 'rx-add') lista.push(pe === 'unidade' ? { med:'', dose:'', via:'', obs:'' } : { med:'', uso:'' });
      else lista.splice(+b.dataset.i, 1);
      rxGrava(qe, pe, lista);
      redesenhaFixo(); return;
    }

    if (acao === 'quadro-copiar') {
      var q1 = quadroDe(id), t1 = q1 && textoParte(q1, b.dataset.p);
      if (t1) copiarClinico(t1, q1.nome, 'presc'); return;
    }
    if (acao === 'quadro-empilhar') {
      var q2 = quadroDe(id);
      if (!q2) return;
      pilha(textoParte(q2, b.dataset.p || 'rx'));
      /* leva o olho até o rascunho, no painel da direita */
      setTimeout(function () {
        var b = document.getElementById('ferrBancada');
        if (!b) return;
        b.scrollIntoView({ block:'center', behavior:'smooth' });
        b.focus({ preventScroll:true });
      }, 80);
      return;
    }
    if (acao === 'quadro-imprimir') {
      var q3 = quadroDe(id);
      if (q3) imprimir(q3.nome + (q3.sub ? ' — ' + q3.sub : ''), textoParte(q3, b.dataset.p || 'rx'));
      return;
    }

    /* --- antibioticos --- */
    if (acao === 'atb-abrir')  { atbAberto = (atbAberto === id ? null : id); redesenhaFixo(); return; }
    if (acao === 'atb-filtro') { filtroAtb = v; redesenhaFixo(); return; }
    if (acao === 'atb-copiar-um') {
      var au = atbDe(id);
      if (!au) return;
      var lista = (b.dataset.l === 'e') ? (au.escolha || []) : (au.alt || []);
      var esq = lista[+b.dataset.i];
      if (esq) copiarClinico(textoAtbUm(au, esq), esq.atb, 'atb');
      return;
    }
    if (acao === 'atb-copiar') { var a1 = atbDe(id); if (a1) copiarClinico(textoAtb(a1), a1.quadro, 'atb'); return; }
    if (acao === 'atb-empilhar') { var a2 = atbDe(id); if (a2) pilha(textoAtb(a2)); return; }

    /* --- calculadoras --- */
    if (acao === 'calc-abrir' && calcAberta !== id) marcaUso(id);
    if (acao === 'calc-abrir') {
      var abrir = calcAberta !== id;
      calcAberta = abrir ? id : null;
      if (celCalc()) {
        if (abrir) { yLista = window.scrollY; focoHash = location.hash; redesenha(); window.scrollTo(0, 0); }
        else { redesenha(); window.scrollTo(0, yLista || 0); }
      } else redesenhaFixo();
      return;
    }
    if (acao === 'calc-limpar')  { calcVal[id] = {}; redesenhaFixo(); return; }
    if (acao === 'calc-limpar-tudo') { calcVal = {}; redesenhaFixo(); return; }
    if (acao === 'calc-copiar' || acao === 'calc-empilhar') {
      var cc = calcDe(id), rr = cc && calcResultado(cc);
      if (!rr) return;
      var tt = textoResultado(cc, rr);
      if (acao === 'calc-copiar') { copiar(tt, cc.nome); pilha(tt); } else pilha(tt);
      return;
    }

    /* --- prescricoes --- */
    if (acao === 'med-novo') {
      var cx = b.closest('.ferr-barra') ? b.closest('.ferr-barra').dataset.ctx : abaAtual;
      abreForm('med', null, cx); return;
    }
    if (acao === 'med-editar') { abreForm('med', medPorId(ctx, id), ctx); return; }
    if (acao === 'med-apagar') {
      var m0 = medPorId(ctx, id);
      if (!m0 || !confirm('Apagar “' + (m0.label || m0.nome) + '”?')) return;
      if (ctx === 'oral') {
        var d0 = po();
        d0.forEach(function (cat) {
          cat.meds = (cat.meds || []).filter(function (m) { return m.id !== id; });
        });
        Base.setPo(d0.filter(function (cat) { return cat.meds.length; }));
      } else {
        Base.setMeds(ctx, meds(ctx).filter(function (m) { return m.id !== id; }));
      }
      var i0 = selIdx(ctx, id); if (i0 !== -1) selDe(ctx).splice(i0, 1);
      toast('Apagado'); redesenhaFixo(); return;
    }
    if (acao === 'med-toggle') {
      var virou = selToggle(ctx, id);
      redesenhaFixo();
      if (virou) {
        var tx = textoPresc(ctx);
        if (tx) copiarClinico(tx, 'Prescrição', 'presc');
      }
      return;
    }
    if (acao === 'med-mais' || acao === 'med-menos') {
      var s0 = selItem(ctx, id); if (!s0) return;
      s0.qtd = Math.max(1, Math.min(20, s0.qtd + (acao === 'med-mais' ? 1 : -1)));
      redesenhaFixo(); return;
    }
    if (acao === 'presc-copiar') {
      var tp = textoPresc(ctx);
      if (!tp) { toast('Nenhuma medicação selecionada', true); return; }
      copiarClinico(tp, 'Prescrição', 'presc'); return;
    }
    if (acao === 'presc-limpar') {
      var cx2 = ctx || (b.closest('.ferr-barra') ? b.closest('.ferr-barra').dataset.ctx : abaAtual);
      sel[cx2] = []; redesenhaFixo(); return;
    }
    if (acao === 'meds-restaurar') {
      var cx3 = b.closest('.ferr-barra').dataset.ctx;
      if (!confirm('Restaurar a lista padrão de medicações? Isso apaga o que você adicionou ou editou aqui.')) return;
      if (cx3 === 'oral') Base.resetPo(); else Base.resetMeds(cx3);
      sel[cx3] = []; toast('Padrão restaurado'); redesenhaFixo(); return;
    }

    /* --- combos --- */
    if (acao === 'combo-salvar') {
      if (!selDe(ctx).length) { toast('Selecione as medicações primeiro', true); return; }
      var nome = prompt('Nome do combo:');
      if (!nome) return;
      var cs = Base.combos(ctx);
      cs.push({ id: idNovo('cb'), nome: nome, itens: JSON.parse(JSON.stringify(selDe(ctx))) });
      Base.setCombos(ctx, cs); toast('Combo salvo'); redesenhaFixo(); return;
    }
    if (acao === 'combo-usar') {
      var cb = null;
      Base.combos(ctx).forEach(function (c) { if (c.id === id) cb = c; });
      if (!cb) return;
      cb.itens.forEach(function (it) {
        if (!medPorId(ctx, it.id)) return;
        var j = selIdx(ctx, it.id);
        if (j === -1) selDe(ctx).push(JSON.parse(JSON.stringify(it)));
        else selDe(ctx)[j] = JSON.parse(JSON.stringify(it));
      });
      redesenhaFixo();
      var t3 = textoPresc(ctx);
      if (t3) copiarClinico(t3, 'Prescrição', 'presc');
      return;
    }
    if (acao === 'combo-apagar') {
      if (!confirm('Apagar este combo?')) return;
      Base.setCombos(ctx, Base.combos(ctx).filter(function (c) { return c.id !== id; }));
      redesenhaFixo(); return;
    }

    /* --- organizar grupos --- */
    if (acao === 'ordem-abrir') {
      abreForm('ordem', null, b.closest('.ferr-barra').dataset.ctx); return;
    }
    if (acao === 'ordem-sobe' || acao === 'ordem-desce' || acao === 'ordem-oculta') {
      var todos = [];
      meds(ctx).forEach(function (m) { if (todos.indexOf(m.grupo) === -1) todos.push(m.grupo); });
      var o1 = Base.ordem(ctx, todos), k = o1.ordem.indexOf(v);
      if (acao === 'ordem-oculta') {
        var j1 = o1.ocultos.indexOf(v);
        if (j1 === -1) o1.ocultos.push(v); else o1.ocultos.splice(j1, 1);
      } else {
        var alvoK = acao === 'ordem-sobe' ? k - 1 : k + 1;
        if (alvoK < 0 || alvoK >= o1.ordem.length) return;
        var tmp = o1.ordem[alvoK]; o1.ordem[alvoK] = o1.ordem[k]; o1.ordem[k] = tmp;
      }
      Base.setOrdem(ctx, o1); redesenhaFixo(); return;
    }
    if (acao === 'ordem-restaurar') { apaga('ferr:ordem:' + form_ctx); redesenhaFixo(); return; }

    /* --- especiais --- */
    if (acao === 'esp-sub')   { subEsp = v; form = null; redesenhaFixo(); return; }
    if (acao === 'dm-faixa')  { var i2 = +b.dataset.i; glicemia = (glicemia === i2 ? null : i2); redesenhaFixo();
                                var td = textoDM(false); if (td) copiarClinico(td, 'Prescrição', 'presc'); return; }
    if (acao === 'dm-copiar') { var td2 = textoDM(false); if (td2) copiarClinico(td2, 'Prescrição', 'presc');
                                else toast('Selecione a faixa de glicemia', true); return; }
    if (acao === 'dm-escala') { copiar(textoDM(true), 'Escala'); return; }
    if (acao === 'dm-limpar') { glicemia = null; redesenhaFixo(); return; }

    if (acao === 'inal-toggle') {
      var mi = null; FERR_INAL.forEach(function (x) { if (x.id === id) mi = x; });
      if (inalSel[id]) delete inalSel[id]; else inalSel[id] = mi.padrao;
      redesenhaFixo(); return;
    }
    if (acao === 'inal-limpar') { inalSel = {}; redesenhaFixo(); return; }
    if (acao === 'inal-copiar') {
      var ti = textoInal();
      if (!ti) { toast('Selecione ao menos uma medicação', true); return; }
      copiarClinico(ti, 'Prescrição', 'presc'); return;
    }
  });

  /* ---------- campos que mudam ---------- */
  /* o acordeão do paciente tem que sobreviver aos redesenhos */
  document.addEventListener('toggle', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('pac')) {
      pacAberto = e.target.open;
    }
  }, true);

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'ferrBancada') {
      bancGrava(t.value);
      return;
    }
    if (t.id === 'ferrBuscaAtb') {
      buscaAtb = t.value;
      var ca = document.getElementById('ferrListaAtb');
      if (ca) ca.innerHTML = conteudoAtb(Base.atb());
      return;
    }
    if (t.dataset && t.dataset.rxe) {
      var cxe = t.closest('.rxe'); if (!cxe) return;
      var qq = quadroDe(cxe.dataset.q), pp = cxe.dataset.parte;
      if (!qq) return;
      var l2 = rxDe(qq, pp);
      var it = l2[+t.dataset.i];
      if (it) { it[t.dataset.rxe] = t.value; rxGrava(qq, pp, l2); }
      return;   /* não redesenha: perderia o foco no meio da digitação */
    }
    if (t.dataset && t.dataset.conc) {
      var nc = parseFloat(String(t.value).replace(',', '.'));
      if (isFinite(nc) && nc > 0) concPed[t.dataset.conc] = nc; else delete concPed[t.dataset.conc];
      /* atualiza só as doses deste cartão, para não perder o foco do campo */
      var cart = t.closest('.pd-med');
      var mm = null;
      for (var z = 0; z < FERR_PEDIA.length; z++) if (FERR_PEDIA[z].id === t.dataset.conc) mm = FERR_PEDIA[z];
      if (cart && mm) {
        var kgx = pesoGlobal();
        [].forEach.call(cart.querySelectorAll('.pd-dose'), function (el, i) {
          var dd = (mm.doses || [])[i]; if (!dd) return;
          var rr = calcPedia(dd, kgx, dd.conc ? concDe(mm, dd) : undefined);
          var alvo = el.querySelector('.pd-calc');
          if (alvo && rr) alvo.innerHTML = esc(rr.mg) + (rr.vol ? ' &middot; <b>' + esc(rr.vol) + '</b>' : '') +
            (rr.limitou ? ' <i>no teto</i>' : '');
        });
      }
      return;
    }
    if (t.id === 'ferrBuscaCalc') {
      buscaCalc = t.value;
      var cc2 = document.getElementById('ferrListaCalc');
      if (cc2) {
        var tipoAtual = (location.hash.indexOf('scores') > -1) ? 'escore'
                      : (location.hash.indexOf('calc') > -1 ? 'formula' : null);
        var l2 = tipoAtual ? FERR_CALC.filter(function (c) { return (c.secao || c.tipo) === tipoAtual; }) : FERR_CALC;
        var r2 = (window.FERR_RAMOS || []).filter(function (g) {
          return l2.some(function (c) { return c.ramo === g.id; });
        });
        cc2.innerHTML = listaCalc(l2, r2);
      }
      return;
    }
    if (t.id === 'ferrBuscaPed') {
      buscaPedia = t.value;
      var cp = document.getElementById('ferrListaPed');
      if (cp) cp.innerHTML = listaPedia();
      return;
    }
    /* cabeçalho do paciente: grava e atualiza só o resumo do summary,
       redesenhar aqui destruiria o próprio campo e mataria o foco */
    if (t.id === 'pacNome' || t.id === 'pacIdade' || t.id === 'pacPeso') {
      if (t.id === 'pacPeso') {
        var gk = document.getElementById('peso');
        if (gk) { gk.value = t.value; gk.dispatchEvent(new Event('input', { bubbles:true })); }
        atualizaPorPeso();
      } else {
        grava(t.id === 'pacNome' ? 'pac-nome' : 'pac-idade', t.value);
      }
      var res = document.querySelector('.pac > summary > i');
      if (res) res.textContent = pacResumo() || 'não informado';
      return;
    }
    /* o peso da aba pediatrica E o peso global: escreve no campo do topo */
    if (t.id === 'ferrPesoPed') {
      var g = document.getElementById('peso');
      if (g) { g.value = t.value; g.dispatchEvent(new Event('input', { bubbles:true })); }
      atualizaPorPeso();
      return;
    }
    /* redesenhar a tela inteira aqui destruiria o proprio campo e
       o foco se perderia no segundo digito da idade */
    if (t.id === 'ferrIdadePed') {
      grava('pedia-idade', t.value);
      var rot = document.getElementById('ferrIdadeTxt');
      if (rot) {
        var im = idadePedia();
        rot.textContent = idadeTexto(im);
        rot.hidden = (im === null);
      }
      var cc = document.getElementById('ferrPediaCorpo');
      if (cc) cc.innerHTML = corpoPedia();
      atualizaPorPeso();
      return;
    }
    if (t.dataset && t.dataset.calc) { mudouCalc(t); return; }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!dentro(e)) return;
    if (t.dataset && t.dataset.calc) { mudouCalc(t); return; }
    var acao = t.dataset ? t.dataset.acao : null;
    if (!acao) return;
    var ctx = t.dataset.ctx, id = t.dataset.id;

    if (acao === 'proto-item') {
      var qi = quadroDe(t.dataset.id);
      if (!qi) return;
      alternaItem(qi, t.dataset.parte, +t.dataset.i);
      redesenhaFixo(); return;
    }
    if (acao === 'med-volume') { var s1 = selItem(ctx, id); if (s1) s1.volume = t.value; redesenhaFixo(); return; }
    if (acao === 'med-modo')   { var s2 = selItem(ctx, id); if (s2) s2.modo = t.value; redesenhaFixo(); return; }
    if (acao === 'presc-desfecho') { desfecho[ctx] = t.value; redesenhaFixo(); return; }
    if (acao === 'presc-tempo')    { tempoEV = t.value; redesenhaFixo(); return; }
    if (acao === 'inal-dose')      { inalSel[id] = t.value; redesenhaFixo(); return; }
    if (acao === 'inal-diluente')  { inalDiluente = t.value; redesenhaFixo(); return; }
    if (acao === 'inal-ciclos')    { inalCiclos = +t.value; redesenhaFixo(); return; }
  });

  /* calculadora: atualiza so o resultado, para nao perder o foco do campo */
  function mudouCalc(t) {
    var id = t.dataset.calc, k = t.dataset.k;
    if (!calcVal[id]) calcVal[id] = {};
    calcVal[id][k] = t.type === 'checkbox' ? t.checked : t.value;
    var sec = t.closest('.ferr-calc');
    if (!sec) return;
    if (window.UI && UI.anuncia) {
      var cAlvo = calcDe(id);
      var rr = cAlvo && calcResultado(cAlvo);
      if (rr) UI.anuncia(rr.valor + (rr.detalhe ? '. ' + rr.detalhe : ''));
    }
    var c = calcDe(id), r = calcResultado(c);
    var caixa = sec.querySelector('.ferr-res');
    if (caixa) {
      caixa.className = 'ferr-res ' + (r ? r.classe : 'vazio');
      caixa.innerHTML = r
        ? '<div class="ferr-res-num">' + esc(r.valor) + '</div>' +
          (r.detalhe ? '<div class="ferr-res-txt">' + esc(r.detalhe) + '</div>' : '') +
          '<div class="ferr-res-acoes">' +
            '<button type="button" class="ferr-btn peq forte" data-acao="calc-copiar" data-id="' + id + '">Copiar</button>' +
            '<button type="button" class="ferr-btn peq" data-acao="calc-limpar" data-id="' + id + '">Limpar</button>' +
          '</div>'
        : 'Preencha os campos para ver o resultado.';
    }
    var badge = sec.querySelector('.ferr-calc-badge');
    if (r && badge) { badge.className = 'ferr-calc-badge ' + r.classe; badge.textContent = r.valor; }
    else if (r && !badge) {
      var topo = sec.querySelector('.ferr-calc-topo');
      if (topo) {
        var novo = document.createElement('span');
        novo.className = 'ferr-calc-badge ' + r.classe;
        novo.textContent = r.valor;
        topo.insertBefore(novo, topo.querySelector('.ferr-calc-seta'));
      }
    } else if (!r && badge) { badge.remove(); }
    if (t.type === 'checkbox') t.closest('.ferr-item').classList.toggle('on', t.checked);
    if (t.type === 'radio') { var q = t.closest('.cc-q'); if (q) q.classList.add('ok'); }
  }

  /* ---------- salvar formularios ---------- */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-form]');
    if (!f || !dentro(e)) return;
    e.preventDefault();
    var d = new FormData(f), qual = f.dataset.form, id = f.dataset.id;

    if (qual === 'card') {
      var pasta = pastaAtual();
      var lista = Base.cards(pasta);
      var novo = {
        id: id || idNovo('c'),
        label: (d.get('label') || '').trim() || 'Sem nome',
        sub: (d.get('sub') || '').trim(),
        texto: d.get('texto') || '',
        hora: !!d.get('hora')
      };
      var i = -1;
      lista.forEach(function (x, k) { if (x.id === id) i = k; });
      if (i === -1) lista.push(novo); else lista[i] = novo;
      Base.setCards(pasta, lista);
      toast('Salvo'); fechaForm(); return;
    }

    if (qual === 'exame') {
      var le = Base.exame();
      var ne = {
        id: id || idNovo('x'),
        sistema: (d.get('sistema') || '').trim() || 'Geral',
        nome: (d.get('nome') || '').trim() || 'Sem nome',
        desc: (d.get('desc') || '').trim(),
        texto: d.get('texto') || ''
      };
      var j = -1;
      le.forEach(function (x, k) { if (x.id === id) j = k; });
      if (j === -1) le.push(ne); else le[j] = ne;
      Base.setExame(le);
      toast('Salvo'); fechaForm(); return;
    }

    if (qual === 'quadro') {
      var lq = Base.quadros();
      var nq = {
        id: id || idNovo('q'),
        grupo: (d.get('grupo') || '').trim() || 'Outros',
        nome: (d.get('nome') || '').trim() || 'Sem nome',
        sub: (d.get('sub') || '').trim(),
        tags: (d.get('tags') || '').split(',').map(function (x) { return x.trim(); })
                .filter(function (x) { return x; }),
        conduta: (d.get('conduta') || '').trim(),
        atencao: (d.get('atencao') || '').trim(),
        unidade: parseUnidade(d.get('unidade')),
        receita: parseReceita(d.get('receita')),
        orientacoes: String(d.get('orientacoes') || '').split('\n')
                       .map(function (x) { return x.trim(); }).filter(function (x) { return x; })
      };
      var kq = -1;
      lq.forEach(function (x, i3) { if (x.id === id) kq = i3; });
      if (kq === -1) lq.push(nq); else lq[kq] = nq;
      Base.setQuadros(lq);
      quadroAberto = nq.id;
      toast('Salvo'); fechaForm(); return;
    }

    if (qual === 'med') {
      var ctx = f.dataset.ctx;
      if (ctx === 'oral') {
        var cat = (d.get('categoria') || '').trim() || 'Outros';
        var reg = {
          id: id || idNovo('m'),
          nome: (d.get('nome') || '').trim() || 'Sem nome',
          uso: (d.get('uso') || '').trim(),
          faltaSus: !!d.get('faltaSus')
        };
        var dados = po();
        dados.forEach(function (c) { c.meds = (c.meds || []).filter(function (m) { return m.id !== reg.id; }); });
        var achou = null;
        dados.forEach(function (c) { if (c.categoria === cat) achou = c; });
        if (!achou) { achou = { id: idNovo('cat'), categoria: cat, meds: [] }; dados.push(achou); }
        achou.meds.push(reg);
        Base.setPo(dados.filter(function (c) { return c.meds.length; }));
      } else {
        var lm = meds(ctx);
        var g = (d.get('grupo') || '').trim() || 'Outros';
        var nm = {
          id: id || idNovo('m'),
          label: (d.get('label') || '').trim() || 'Sem nome',
          value: (d.get('value') || '').trim()
        };
        if (ctx === 'psiq') nm.via = g.toUpperCase(); else nm.grupo = g;
        if (ctx === 'ev') {
          nm.tipo = d.get('tipo') === 'solucao' ? 'solucao' : 'ampola';
          var vols = (d.get('volumes') || '').split(',').map(function (x) { return x.trim(); })
                       .filter(function (x) { return x; });
          if (nm.tipo === 'solucao') nm.volumes = vols.length ? vols : ['500 mL'];
        }
        var k2 = -1;
        lm.forEach(function (x, i2) { if (x.id === id) k2 = i2; });
        if (k2 === -1) lm.push(nm); else lm[k2] = nm;
        Base.setMeds(ctx, lm);
      }
      toast('Salvo'); fechaForm(); return;
    }
  });

  /* ---------- estado inicial ---------- */
  abaAtual = ler('ferr:aba', 'anamnese');
  if (!ehAba(abaAtual)) abaAtual = 'anamnese';

  /* usados pela tela nova de doses (app.js) */
  F.ped = {
    lista: function () { return typeof FERR_PEDIA !== 'undefined' ? FERR_PEDIA : []; },
    calc: function (m, d, kg) { return calcPedia(d, kg, d.conc ? concDe(m, d) : undefined); },
    vetado: function (m, idade) { return vetado(m, idade); },
    idade: function () { return idadePedia(); },
    setIdade: function (v) { grava('pedia-idade', v); },
    idadeTexto: function (m) { return idadeTexto(m); },
    texto: function (m, kg) { return textoPedia(m, kg); },
    copiar: function (m, kg) { var t = textoPedia(m, kg); copiarClinico(t, m.nome, 'presc'); pilha(t); },
    /* a concentração que o volume usa (a escolhida pelo usuário, senão a padrão da dose) */
    conc: function (m, d) { return d && d.conc ? concDe(m, d) : null; },
    setConc: function (id, v) { if (v === '' || v == null) delete concPed[id]; else concPed[id] = parseFloat(v); }
  };
  /* usados pela tela nova de receitas (app.js) */
  F.quadrosTodos = function () { return Base.quadros(); };
  F.textoRx = function (id, ctx) {
    var q = quadroDe(id); if (!q) return '';
    var velhoCtx = ctxRx; ctxRx = ctx;
    var t = textoProto(q);
    ctxRx = velhoCtx;
    return t;
  };
  F.linhasRx = function (id) {
    var q = quadroDe(id); if (!q) return { unidade:[], receita:[], orient:[] };
    return { unidade:rxDe(q, 'unidade'), receita:rxDe(q, 'receita'), orient:q.orientacoes || [] };
  };
  F.copiarRx = function (txt, nome) { if (!txt) return; copiarClinico(txt, nome, 'presc'); pilha(txt); };

  window.Ferramentas = F;
})();
