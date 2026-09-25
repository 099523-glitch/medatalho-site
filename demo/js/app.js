/* ===========================================================
   Render do documento + sumario + busca + vista isolada.
   Nao precisa editar para adicionar conteudo (ver js/dados.js).

   Duas telas:
     #cardio                -> lista de condutas da area (so os titulos)
     #cardio/sca-com-supra  -> a conduta sozinha na pagina
   =========================================================== */
(function () {
  'use strict';

  var doc   = document.getElementById('doc');
  var toc   = document.getElementById('toc');
  var side  = document.getElementById('side');
  var busca = document.getElementById('busca');

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* *texto* vira negrito */
  function rico(s) {
    return esc(s).replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  }
  /* mesma coisa, mas devolvendo texto puro (para copiar) */
  function cru(s) {
    return String(s == null ? '' : s).replace(/\*([^*]+)\*/g, '$1');
  }
  function normaliza(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function dois(n) { return n < 10 ? '0' + n : String(n); }
  function porCategoria(id) {
    return PROTOCOLOS.filter(function (p) { return p.categoria === id; });
  }
  /* a lista que a tela usa: no modo leitura esconde as nao preenchidas */
  function listaArea(id) { return visiveis(porCategoria(id)); }
  /* conduta "preenchida" = ja tem ficha ou secoes */
  function preenchida(p) {
    return !!((p.ficha || []).length || (p.secoes || []).length);
  }
  function progresso(lista) {
    return lista.filter(preenchida).length;
  }

  /* ---------- blocos ---------- */
  var LABEL = {
    alerta:     'Red flags',
    passos:     'Passo a passo',
    lista:      'Lista',
    naofazer:   'Não fazer',
    dica:       'Dica',
    tempo:      'Linha do tempo',
    ordem:      'Ordem',
    texto:      'Observação',
    doses:      'Medicações',
    prescricao: 'Prescrição mínima'
  };

  function itensSteps(itens) {
    return '<ul class="steps">' + (itens || []).map(function (i) {
      return '<li>' + rico(i) + '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- no do fluxograma ---------- */
  /* a conduta cujo fluxograma esta sendo desenhado: os `meds` de cada no
     buscam a dose na tabela `doses` dela */
  var fluxoConduta = null;

  /* linha de doses embaixo do no: `meds:['Diazepam 10 mg/2 mL']` aponta
     para a linha da tabela `doses` da propria conduta (pelo rotulo exato,
     senao pelo nome base); `{droga,dose,via}` escreve a dose ali mesmo.
     Cada chip abre o verbete #droga/<slug> quando ele existe. */
  function acharLinhaDose(rotulo) {
    if (!fluxoConduta) return null;
    var linhas = [];
    dosesDe(fluxoConduta).forEach(function (s) { linhas = linhas.concat(s.itens || []); });
    var k = normaliza(String(rotulo).replace(/\*/g, '')), i;
    for (i = 0; i < linhas.length; i++)
      if (normaliza(String(linhas[i].droga).replace(/\*/g, '')) === k) return linhas[i];
    var b = normaliza(baseDroga(rotulo));
    for (i = 0; i < linhas.length; i++)
      if (normaliza(baseDroga(linhas[i].droga)) === b) return linhas[i];
    return null;
  }
  function medsHtml(meds) {
    if (!meds || !meds.length) return '';
    var chips = meds.map(function (m) {
      var item = typeof m === 'string' ? acharLinhaDose(m) : m;
      if (!item && typeof m === 'string' && acharDroga(slugDroga(m))) item = { droga:m };
      if (!item || !item.droga) return '';
      var slug = slugDroga(item.droga), d = acharDroga(slug);
      var dentro = '<b>' + esc(baseDroga(item.droga)) + '</b>' +
        (item.dose ? '<span>' + rico(item.dose) + '</span>' : '') +
        (item.via ? '<i>' + esc(item.via) + '</i>' : '');
      return d
        ? '<a class="fx-med" href="#droga/' + esc(slug) + '" aria-label="' + esc(d.nome) + ': abrir no bulário">' + dentro + ICO('setaDir') + '</a>'
        : '<span class="fx-med sem">' + dentro + '</span>';
    }).join('');
    return chips ? '<span class="fx-meds">' + chips + '</span>' : '';
  }

  /* `ir:'id-da-conduta'` num no ou ramo: link para a conduta que continua dali */
  function irHtml(id) {
    var p = id && acharConduta(id);
    if (!p) return '';
    return '<a class="fx-ir" href="' + esc(hrefConduta(p)) + '">' + esc(p.titulo) + ICO('setaDir') + '</a>';
  }

  function caixa(n) {
    var cls = 'fx ' + (n.tipo || 'passo');
    return '<div class="' + cls + '">' +
      (n.rotulo ? '<span class="fx-rot">' + esc(n.rotulo) + '</span>' : '') +
      '<span class="fx-txt">' + rico(n.texto) + '</span>' +
      (n.nota ? '<span class="fx-nota">' + rico(n.nota) + '</span>' : '') +
      medsHtml(n.meds) + irHtml(n.ir) +
    '</div>';
  }

  function no(n) {
    /* varias caixas lado a lado */
    if (n.tipo === 'paralelo') {
      return '<div class="fx-seta"></div><div class="fx-par">' +
        (n.colunas || []).map(caixa).join('') + '</div>';
    }
    /* pergunta que abre ramos */
    if (n.tipo === 'decisao') {
      var ramos = n.ramos || [];
      return '<div class="fx-decisao">' +
        '<div class="fxd-perg">' + ICO('setaBai') + '<span>' + rico(n.texto) + '</span></div>' +
        '<div class="fxd-ramos' + (ramos.length > 2 ? ' tres' : '') + '">' +
        ramos.map(function (r) {
          return '<div class="fxd-ramo' + (r.cor ? ' ' + esc(r.cor) : '') + '">' +
            '<span class="fxd-se">' + rico(r.rotulo) + '</span>' +
            '<b class="fxd-entao">' + rico(r.texto) + '</b>' +
            (r.nota ? '<span class="fxd-nota">' + rico(r.nota) + '</span>' : '') +
            medsHtml(r.meds) + irHtml(r.ir) +
          '</div>';
        }).join('') + '</div></div>';
    }
    /* caixa simples; a primeira nao leva seta antes */
    return (n.tipo === 'inicio' ? '' : '<div class="fx-seta"></div>') + caixa(n);
  }

  /* ---------- prescricao: uma linha ---------- */
  /* { item, via, obs, se, grupo } — `se` marca o condicional (so faz se...) */
  function linhaPresc(i, n) {
    var cond = !!i.se;
    var txt  = '<span class="presc-item">' + rico(i.item) + '</span>' +
               (i.via ? '<span class="presc-via">' + esc(i.via) + '</span>' : '');
    var pe   = '';
    if (i.se)  pe += '<span class="presc-se">SE ' + rico(i.se) + '</span>';
    if (i.obs) pe += '<span class="presc-obs">' + rico(i.obs) + '</span>';
    return '<li class="presc-linha' + (cond ? ' cond' : '') + '">' +
             '<i>' + n + '</i><div>' + txt + pe + '</div>' +
           '</li>';
  }

  function bloco(sec) {
    var t = sec.tipo;
    var titulo = sec.titulo || LABEL[t] || '';

    if (t === 'prescricao') {
      var n = 0;
      var linhas = (sec.itens || []).map(function (i) {
        if (i.grupo) return '<li class="presc-grupo">' + esc(i.grupo) + '</li>';
        n++;
        return linhaPresc(i, n);
      }).join('');
      return '<div class="presc">' +
        '<div class="presc-head"><span>' + esc(titulo) + '</span>' +
          '<button class="btn-copiar" type="button">Copiar</button></div>' +
        (sec.nota ? '<p class="presc-nota">' + rico(sec.nota) + '</p>' : '') +
        '<ol class="presc-lista">' + linhas + '</ol>' +
      '</div>';
    }

    if (t === 'doses') {
      return '<div class="spec spec-dose"><div class="spec-head">' + esc(titulo) + '</div><dl>' +
        (sec.itens || []).map(function (d) {
          var linha = '<span class="dv-dose">' + rico(d.dose) + '</span>' +
            (d.via ? '<span class="dv-via">' + esc(d.via) + '</span>' : '');
          if (d.obs) linha += '<span class="dv-obs">' + rico(d.obs) + '</span>';
          return '<dt>' + esc(d.droga) + '</dt><dd>' + linha + '</dd>';
        }).join('') + '</dl></div>';
    }

    if (t === 'fluxo') {
      return '<div class="fluxo-wrap"><div class="fluxo-head">' + esc(titulo) + '</div>' +
             '<div class="fluxo">' + (sec.itens || []).map(no).join('') + '</div></div>';
    }

    if (t === 'tempo') {
      return '<div class="rule cost"><span class="rlabel">' + esc(titulo) + '</span><ul class="tl">' +
        (sec.itens || []).map(function (i) {
          return '<li><b class="hr' + (i.fim ? ' fim' : '') + '">' + esc(i.quando) + '</b>' +
                 rico(i.o_que) + '</li>';
        }).join('') + '</ul></div>';
    }

    if (t === 'ordem') {
      return '<div class="rule cost"><span class="rlabel">' + esc(titulo) + '</span><ol class="rank">' +
        (sec.itens || []).map(function (i, n) {
          return '<li><i>' + (n + 1) + '</i><span>' + rico(i) + '</span></li>';
        }).join('') + '</ol></div>';
    }

    if (t === 'texto') {
      return '<div class="rule cost"><span class="rlabel">' + esc(titulo) + '</span>' +
             '<p>' + rico(sec.conteudo) + '</p></div>';
    }

    var classe = { alerta:'warn', naofazer:'cut', dica:'tip', passos:'', lista:'' }[t];
    if (classe) {
      return '<div class="rule ' + classe + '"><span class="rlabel">' + esc(titulo) + '</span>' +
             itensSteps(sec.itens) + '</div>';
    }
    /* passos e lista ficam soltos no corpo, como no manual */
    return '<h4 class="sub-head">' + esc(titulo) + '</h4>' + itensSteps(sec.itens);
  }

  /* prescricao em texto puro, para o prontuario */
  function prescTexto(p, sec) {
    var n = 0;
    var linhas = (sec.itens || []).map(function (i) {
      if (i.grupo) return '\n' + cru(i.grupo).toUpperCase();
      n++;
      var l = n + '. ' + cru(i.item) + (i.via ? ' — ' + i.via : '');
      if (i.se)  l += ' [SE ' + cru(i.se) + ']';
      if (i.obs) l += ' (' + cru(i.obs) + ')';
      return l;
    }).join('\n');
    return cru(p.titulo) + ' — ' + cru(sec.titulo || 'Prescrição mínima') + '\n' +
           (sec.nota ? cru(sec.nota) + '\n' : '') + '\n' + linhas.trim() +
           '\n\n(conferir dose, peso e alergias na diretriz vigente)';
  }


  /* ---------- indice de busca: varre a conduta INTEIRA ----------
     Sem isto, procurar "amiodarona" ou "noradrenalina" nao acha nada,
     porque a droga mora dentro de secoes.doses, nao no titulo. */
  var IGNORAR = { id:1, tipo:1, categoria:1, cor:1, fim:1, gravidade:1 };

  function coleta(v, saida) {
    if (typeof v === 'string') { saida.push(v); return; }
    if (Array.isArray(v)) { v.forEach(function (x) { coleta(x, saida); }); return; }
    if (v && typeof v === 'object') {
      Object.keys(v).forEach(function (k) { if (!IGNORAR[k]) coleta(v[k], saida); });
    }
  }

  var cacheIndice = {};
  function indiceDe(p) {
    if (cacheIndice[p.id]) return cacheIndice[p.id];
    var partes = [];
    coleta(p, partes);
    partes.push(area(p.categoria).nome);
    var cruTxt = partes.join(' · ').replace(/\*/g, '');
    cacheIndice[p.id] = { cru: cruTxt, norm: normaliza(cruTxt) };
    return cacheIndice[p.id];
  }
  /* o que aparece no cartao quando o termo casou no miolo, e nao no titulo */
  function trecho(p, termos) {
    var ix = indiceDe(p);
    var cabecalho = normaliza([p.titulo, p.resumo, (p.tags || []).join(' ')].join(' '));
    for (var i = 0; i < termos.length; i++) {
      if (cabecalho.indexOf(termos[i]) !== -1) continue;
      var at = ix.norm.indexOf(termos[i]);
      if (at === -1) continue;
      var ini = Math.max(0, at - 45), fim = Math.min(ix.cru.length, at + termos[i].length + 55);
      return (ini > 0 ? '…' : '') + ix.cru.slice(ini, fim).trim() + (fim < ix.cru.length ? '…' : '');
    }
    return '';
  }

  /* ---------- favoritas (ficam no aparelho) ---------- */
  function ler(chave, padrao) {
    try { return JSON.parse(localStorage.getItem(chave)) || padrao; } catch (e) { return padrao; }
  }
  function grava(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* modo privado */ }
  }
  function apaga(chave) {
    try { localStorage.removeItem(chave); } catch (e) { /* modo privado */ }
  }
  var favoritas = ler('favoritas', []);

  function ehFavorita(id) { return favoritas.indexOf(id) !== -1; }
  function alternaFavorita(id) {
    var i = favoritas.indexOf(id);
    if (i === -1) favoritas.unshift(id); else favoritas.splice(i, 1);
    grava('favoritas', favoritas);
  }

  /* ---------- estado ---------- */
  var areaAtual    = CATEGORIAS[0].id;
  var condutaAtual = null;     // id da conduta aberta sozinha, ou null
  var dosesGrupo   = null;     // grupo aberto em #doses/<grupo>
  var drogaAtual   = null;     // verbete aberto em #droga/<slug>
  var termoBusca   = '';
  var modo         = 'home';   // 'home' | 'guia' | 'ferramentas' | 'atb' | 'favoritas'
  var abaFerr      = null;     // sub-aba das ferramentas
  var sitioAtb     = null;     // sítio de infecção aberto na seção Antibióticos
  var subAtual = null, subAberta = null;
  var queixaAtual = null;
  var secAtual     = null;     // seção de topo aberta (presc, calc, scores, prontuario)
  var subSecao     = null;     // tela filha da seção
  /* rotas antigas continuam funcionando */
  /* as telas por via saíram do menu de Prescrições; as rotas antigas
     continuam válidas e caem em "por quadro clínico" */
  var LEGADO = {
    'agora':'', 'protocolos':'cardio', 'prescrever':'presc', 'plantao':'favoritas',
    'presc/pediatria':'pediatria', 'presc/quadro':'presc', 'prontuario/manobras':'prontuario',
    'presc/oral':'presc', 'presc/im':'presc', 'presc/ev':'presc',
    'presc/especiais':'presc', 'ferramentas/quadros':'presc',
    'ferramentas/oral':'presc', 'ferramentas/im':'presc',
    'ferramentas/ev':'presc', 'ferramentas/especiais':'presc', 'ferramentas/atb':'atb',
    'ferramentas/calculadoras':'calc', 'ferramentas/anamnese':'prontuario/modelos',
    'ferramentas/conduta':'prontuario/conduta', 'ferramentas/evasao':'prontuario/evasao',
    'ferramentas/laudos':'prontuario/laudos', 'ferramentas':'presc'
  };
  function ehSecao(id) {
    if (!temFerramentas()) return false;
    for (var i = 0; i < Ferramentas.secoes.length; i++) {
      if (Ferramentas.secoes[i].id === id) return true;
    }
    return false;
  }
  function temFerramentas() { return typeof window.Ferramentas !== 'undefined'; }

  /* preferencias que mudam o que a tela mostra (painel de ajustes) */
  function pref(chave, padrao) {
    var v = ler('pref:' + chave, null);
    return v === null ? padrao : v;
  }
  function modoAutor()  { return pref('autor', false); }
  function resumoPadrao() { return pref('resumo', true); }
  var areaAberta   = null;    // qual area esta expandida no sumario (independe da rota)

  /* no modo leitura, conduta sem conteudo nao aparece */
  function visiveis(lista) {
    return modoAutor() ? lista : lista.filter(preenchida);
  }

  function indiceArea(id) {
    for (var i = 0; i < CATEGORIAS.length; i++) if (CATEGORIAS[i].id === id) return i;
    return 0;
  }
  function area(id) { return CATEGORIAS[indiceArea(id)]; }
  function existeArea(id) {
    return CATEGORIAS.some(function (c) { return c.id === id; });
  }
  function acharConduta(id) {
    for (var i = 0; i < PROTOCOLOS.length; i++) if (PROTOCOLOS[i].id === id) return PROTOCOLOS[i];
    return null;
  }

  /* ---------- dobrar um bloco ----------
     Clicar no próprio bloco fecha ele: fica só o título, e clicar de
     novo abre. Vale em todo o guia — quem fechou red flags não quer
     red flags em conduta nenhuma. O fluxograma nunca dobra. */
  var LEITURA = { texto:1, lista:1, dica:1 };   /* o que o "só o essencial" fecha */

  function rotuloBloco(sec) { return sec.titulo || LABEL[sec.tipo] || sec.tipo; }
  function chaveBloco(sec) {
    if (sec.tipo !== 'lista') return sec.tipo;
    var t = sec.titulo || LABEL.lista;
    return 'lista::' + normaliza(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  /* na primeira visita os blocos de leitura ("O que pedir", "Reavaliar",
     "Internação x alta", dicas, observações) já vêm fechados: quem abre
     uma conduta no plantão quer red flags, fluxograma e dose. */
  function blocosOff() {
    var v = ler('pref:blocos-off', null);
    if (Array.isArray(v)) return v;
    var seed = chavesLeitura().slice();
    grava('pref:blocos-off', seed);
    return seed;
  }
  /* o que o plantonista abriu a conduta para ver nunca vem fechado */
  var SEMPRE_ABERTO = { fluxo:1, alerta:1, doses:1, passos:1, ordem:1, prescricao:1 };
  function blocoDobrado(sec) {
    /* bloco com `topo:true` é a explicação de entrada: também nunca vem fechado */
    return !SEMPRE_ABERTO[sec.tipo] && !sec.topo && blocosOff().indexOf(chaveBloco(sec)) > -1;
  }
  function alternaBloco(k) {
    var off = blocosOff(), i = off.indexOf(k);
    if (i > -1) off.splice(i, 1); else off.push(k);
    grava('pref:blocos-off', off);
  }

  /* as chaves de todos os blocos de leitura do guia, para o preset
     dos Ajustes valer em qualquer conduta */
  var cacheLeitura = null;
  function chavesLeitura() {
    if (cacheLeitura) return cacheLeitura;
    var out = {};
    function varre(lista) {
      (lista || []).forEach(function (p) {
        (p.secoes || []).forEach(function (sec) {
          if (LEITURA[sec.tipo]) out[chaveBloco(sec)] = 1;
        });
      });
    }
    varre(PROTOCOLOS);
    if (typeof QUEIXAS !== 'undefined') varre(QUEIXAS);
    cacheLeitura = Object.keys(out);
    return cacheLeitura;
  }
  function soEssencial() { grava('pref:blocos-off', chavesLeitura().slice()); }
  function tudoVisivel() { grava('pref:blocos-off', []); }

  /* embrulha o bloco para poder dobrar; display:contents mantém o
     layout exatamente como estava */
  function dobravel(sec) {
    var html = bloco(sec);
    if (sec.tipo === 'fluxo') return html;
    var d = blocoDobrado(sec);
    return '<div class="dobra t-' + esc(sec.tipo) + (d ? ' dobrado' : '') +
      '" data-dobra="' + esc(chaveBloco(sec)) + '" data-bl="' + esc(chaveBloco(sec)) + '"' +
      ' role="button" tabindex="0" aria-expanded="' + (d ? 'false' : 'true') + '"' +
      ' aria-label="' + esc(rotuloBloco(sec)) + ' — ' + (d ? 'abrir' : 'fechar') + '">' + html + '</div>';
  }

  /* ordem única de leitura em todo o guia: o que fazer primeiro, depois o
     fluxograma, depois doses, e só então red flags, não fazer e o resto —
     na ordem em que foram escritos. Sort estável: empates não trocam. */
  /* teste: o fluxograma abre a conduta; o resto vem abaixo, na mesma ordem */
  var POSICAO = { fluxo:-1, alerta:0, doses:1, passos:2, ordem:2 };
  function ordenaSecoes(secoes) {
    return (secoes || []).map(function (sec, i) { return { sec: sec, i: i }; })
      .sort(function (a, b) {
        var pa = POSICAO[a.sec.tipo], pb = POSICAO[b.sec.tipo];
        if (pa === undefined) pa = 4;
        if (pb === undefined) pb = 4;
        /* `topo:true` no bloco: sobe para o começo (ex.: explicação para leigo na VNI) */
        if (a.sec.topo) pa = -2;   /* acima até do fluxograma (-1) */
        if (b.sec.topo) pb = -2;
        return pa - pb || a.i - b.i;
      })
      .map(function (x) { return x.sec; });
  }

  /* a faixa do topo: os primeiros passos do pacote, do próprio dados.js.
     Nada inventado — é a seção de passos/ordem da conduta, truncada. */
  function faixaAgora(p) {
    var sec = (p.secoes || []).filter(function (s) {
      return (s.tipo === 'passos' || s.tipo === 'ordem') && (s.itens || []).length;
    })[0];
    if (!sec) return '';
    var itens = sec.itens.slice(0, 3);
    return '<div class="agora">' +
      '<div class="agora-head"><span>' + ICO('perigo') + ' Minuto zero</span></div>' +
      '<div class="agora-grade">' + itens.map(function (i, n) {
        var t = typeof i === 'string' ? i : (i.o_que || '');
        /* o que vem antes do travessão/dois-pontos é a ação; o resto é detalhe */
        var m = String(t).match(/^([^—:.]{3,72})(?:\s*[—:]\s*|\.\s+)([\s\S]+)$/);
        var acao = m ? m[1].trim() : t;
        var det  = m ? m[2].trim() : '';
        return '<div class="ag-passo"><span class="ag-n">' + (n + 1) + '</span>' +
          '<span class="ag-txt"><b>' + rico(acao) + '</b>' +
          (det ? '<span>' + rico(det) + '</span>' : '') + '</span></div>';
      }).join('') + '</div></div>';
  }

  /* o índice da própria conduta  /* o índice da própria conduta: uma tira de chips sob o título */
  function indiceConduta(secoes) {
    if (!secoes.length) return '';
    return '<nav class="chips-grupo ind-conduta">' + secoes.map(function (s) {
      return '<a class="cg" href="#" data-ir="' + esc(chaveBloco(s)) + '">' +
        esc(s.titulo || LABEL[s.tipo] || s.tipo) +
        ((s.itens || []).length ? '<i>' + s.itens.length + '</i>' : '') + '</a>';
    }).join('') + '<button type="button" class="cg cg-ess" data-so-essencial>Só o essencial</button></nav>';
  }

  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-so-essencial]')) return;
    soEssencial(); render();
    if (window.UI && UI.aviso) UI.aviso('Só o essencial');
  });

  /* rolar até o bloco sem mexer no hash (o hash é a rota do app) */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ir]');
    if (!a) return;
    e.preventDefault();
    var alvo = doc.querySelector('[data-bl="' + a.getAttribute('data-ir').replace(/"/g, '') + '"]');
    if (!alvo) return;
    if (alvo.classList.contains('dobrado')) alvo.classList.remove('dobrado');
    var y = alvo.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });

  /* perfil → esquema: a escolha do antibiótico deixa de ser
     tabela de consulta e passa a ser resposta a uma pergunta.
     Lê o campo `esquemas` da conduta; sem ele, não renderiza. */
  function blocoEsquemas(p) {
    var es = p.esquemas;
    if (!es || !es.opcoes || !es.opcoes.length) return '';
    var ativo = escolhaEsquema(p.id) || es.opcoes[0].id;
    var op = es.opcoes.filter(function (o) { return o.id === ativo; })[0] || es.opcoes[0];
    return '<div class="esq" data-esq="' + esc(p.id) + '">' +
      '<div class="esq-head"><span>' + esc(es.titulo || 'Qual esquema') + '</span>' +
        (es.sub ? '<i>' + esc(es.sub) + '</i>' : '') + '</div>' +
      '<div class="esq-perfis">' + es.opcoes.map(function (o) {
        return '<button type="button" class="esq-p' + (o.id === ativo ? ' on' : '') + '"' +
          ' data-esq-pick="' + esc(o.id) + '">' +
          '<b>' + esc(o.nome) + '</b>' +
          (o.sub ? '<span>' + esc(o.sub) + '</span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="esq-doses">' + (op.doses || []).map(function (d) {
        return '<div class="esq-d">' +
          '<b class="esq-droga">' + rico(d.droga) + '</b>' +
          '<span class="esq-dose">' + rico(d.dose) + '</span>' +
          (d.via ? '<span class="esq-via">' + esc(d.via) + '</span>' : '') +
          (d.obs ? '<span class="esq-obs">' + rico(d.obs) + '</span>' : '') +
        '</div>';
      }).join('') +
      (op.extra ? '<p class="esq-extra">' + rico(op.extra) + '</p>' : '') +
      '</div></div>';
  }

  var escolhasEsq = {};
  function escolhaEsquema(id) { return escolhasEsq[id]; }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-esq-pick]');
    if (!b) return;
    var caixa = b.closest('[data-esq]');
    if (!caixa) return;
    escolhasEsq[caixa.getAttribute('data-esq')] = b.getAttribute('data-esq-pick');
    render();
  });

  function corpoProtocolo(p) {
    var secoes = p.secoes || [];
    fluxoConduta = p;
    /* a ficha rápida (p.ficha) não é mais mostrada: a conduta abre direto
       no que fazer e no fluxograma */
    var html = ordenaSecoes(secoes).map(dobravel).join('');
    if (!(p.ficha || []).length && !secoes.length) {
      html += '<div class="pendente">Conduta ainda não preenchida.</div>';
    }
    if (p.fonte) html += '<p class="muted fonte">Referência: ' + rico(p.fonte) + '</p>';
    return html;
  }

  /* ---------- lista da area: so o titulo, e cada um leva para a vista isolada ---------- */
  function cartao(p, numero, mostrarArea, achou) {
    var g = p.gravidade || 'rotina';
    var c = area(p.categoria);
    return '<a class="cartao" href="#' + esc(p.categoria) + '/' + esc(p.id) + '">' +
      '<span class="pasta-num">' + esc(numero) + '</span>' +
      '<span class="pasta-nome">' + esc(p.titulo) +
        (p.resumo ? '<span class="pasta-resumo">' + rico(p.resumo) + '</span>' : '') +
        (achou ? '<span class="pasta-achou">↳ ' + esc(achou) + '</span>' : '') +
      '</span>' +
      (ehFavorita(p.id) ? '<span class="pasta-fav">' + ICO('estrela') + '</span>' : '') +
      (mostrarArea ? '<span class="pasta-area">' + esc(c.nome) + '</span>' : '') +
      (preenchida(p) ? '' : '<span class="pasta-tag vazia">a preencher</span>') +
      '<span class="pasta-tag ' + esc(g) + '">' + esc(LABEL_GRAV[g] || g) + '</span>' +
      '<span class="pasta-seta">' + ICO('setaDir') + '</span>' +
    '</a>';
  }

  /* o rótulo da gravidade, escrito como se lê */
  var LABEL_GRAV = { emergencia:'emergência', urgencia:'urgência', rotina:'rotina' };

  /* a linha da lista: gravidade na barra lateral, título e uma frase curta.
     Sem etiqueta repetida e sem seta: a cor já diz a gravidade. */
  function linhaConduta(p) {
    var g = p.gravidade || 'rotina';
    var cat = CATEGORIAS.filter(function (c) { return c.id === p.categoria; })[0];
    var sub = p.resumo ? cru(p.resumo) : '';
    return '<a class="qx-card gc ' + esc(g) + '" href="' + esc(hrefConduta(p)) + '"' +
      (sub ? ' title="' + esc(sub) + '"' : '') + '>' +
      '<span class="qx-i">' + ICO((cat && cat.icone) || 'livro') + '</span>' +
      '<span class="qx-t"><b>' + esc(p.titulo) + '</b>' +
        (sub ? '<i>' + esc(sub) + '</i>' : '') + '</span>' +
      '<span class="qx-s">' + ICO('setaDir') + '</span></a>';
  }

  /* ---------- render ---------- */
  /* ---------- tolerância a erro de digitação ----------
     Só entra em ação quando a busca exata não achou nada: aí cada termo
     ganha uma variante com até 1 erro (troca, falta, sobra ou inversão
     de letra) procurada palavra a palavra no índice. Rodar isso sempre
     deixaria a busca lenta e traria resultado errado por cima do certo. */
  /* distância de edição com teto: para assim que passa do limite */
  function distAte(a, b, lim) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > lim) return lim + 1;
    var ant = new Array(lb + 1), atual = new Array(lb + 1), i, j;
    for (j = 0; j <= lb; j++) ant[j] = j;
    for (i = 1; i <= la; i++) {
      atual[0] = i;
      var menor = atual[0];
      for (j = 1; j <= lb; j++) {
        var custo = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        atual[j] = Math.min(atual[j - 1] + 1, ant[j] + 1, ant[j - 1] + custo);
        if (atual[j] < menor) menor = atual[j];
      }
      if (menor > lim) return lim + 1;
      var t = ant; ant = atual; atual = t;
    }
    return ant[lb];
  }
  /* quanto erro se perdoa: palavra curta erra pouco, longa erra mais */
  function limiteErro(n) { return n >= 8 ? 2 : (n >= 4 ? 1 : 0); }

  /* o termo aparece no texto, aceitando um errinho de digitação? */
  function casaTolerante(texto, termo) {
    if (texto.indexOf(termo) !== -1) return true;
    var lim = limiteErro(termo.length);
    if (!lim) return false;
    var palavras = texto.split(/[^a-z0-9]+/);
    var vistas = {};
    for (var i = 0; i < palavras.length; i++) {
      var w = palavras[i];
      if (!w || vistas[w]) continue;
      vistas[w] = 1;
      if (Math.abs(w.length - termo.length) > lim) continue;
      if (distAte(w, termo, lim) <= lim) return true;
    }
    return false;
  }

  function resultadosBusca() {
    var termos = normaliza(termoBusca).trim().split(/\s+/).filter(Boolean);
    if (!termos.length) return null;
    function acha(tolerante) {
      return PROTOCOLOS.filter(function (p) {
        var ix = indiceDe(p).norm;
        return termos.every(function (x) {
          return tolerante ? casaTolerante(ix, x) : ix.indexOf(x) !== -1;
        });
      });
    }
    var achados = acha(false);
    buscaTolerou = false;
    if (!achados.length) {
      var t2 = acha(true);
      if (t2.length) { achados = t2; buscaTolerou = true; }
    }
    /* ordem: preenchida antes de vazia; depois, quem casa no titulo
       antes de quem casa so no miolo. Achar uma pasta vazia no topo
       do resultado e o pior jeito de perder tempo no plantao. */
    function peso(p) {
      var cab = normaliza([p.titulo, (p.tags || []).join(' ')].join(' '));
      var n = termos.filter(function (x) { return cab.indexOf(x) !== -1; }).length;
      return (preenchida(p) ? 0 : 100) - n;
    }
    achados.sort(function (a, b) { return peso(a) - peso(b); });
    ultimosTermos = termos;
    return achados;
  }
  var ultimosTermos = [];
  var escopoBusca = 'tudo';   /* aba de escopo da busca */
  var ESCOPOS = [
    { id:'tudo',    rot:'Condutas' },
    { id:'droga',   rot:'Drogas e doses' },
    { id:'score',   rot:'Escores' },
    { id:'presc',   rot:'Prescrições' }
  ];


  function renderSumario(resultados) {
    function link(href, ico, nome, on) {
      return '<a href="' + esc(href) + '" class="toplink' + (on ? ' active' : '') + '">' +
        ICO(ico) + '<span>' + esc(nome) + '</span></a>';
    }
    var html = '<div class="nav-g"><span class="nav-t">Navegar</span>' +
      link('#', 'casa', 'Início', !resultados && modo === 'home') +
      link(celular() ? '#guia' : '#' + (areaAtual || (CATEGORIAS[0] && CATEGORIAS[0].id) || ''), 'livro', 'Guia clínico',
           !resultados && (modo === 'guia' || modo === 'areas' || !!condutaAtual));
    if (temQueixas()) {
      html += link('#queixa', 'porta', 'Queixas', !resultados && modo === 'queixa') +
              link('#critico', 'perigo', 'Sala vermelha', !resultados && modo === 'critico');
    }
    html += link('#doses', 'seringa', 'Doses', !resultados && (modo === 'doses' || modo === 'droga')) +
      '</div>';

    if (temFerramentas()) {
      html += '<div class="nav-g"><span class="nav-t">Ferramentas</span>';
      Ferramentas.secoes.forEach(function (sec) {
        var ativo = (!resultados && modo === 'secao' && secAtual === sec.id) ? (subSecao || true) : null;
        html += Ferramentas.sumarioSecao(sec, ativo);
      });
      html += '</div>';
    }

    /* a árvore de condutas só aparece dentro do guia — é onde ela serve */
    if (!resultados && (modo === 'guia' || condutaAtual)) {
      html += '<div class="nav-g guia"><span class="nav-t"><span>Condutas</span><i>' +
        PROTOCOLOS.filter(preenchida).length + '</i></span>';
      CATEGORIAS.forEach(function (c, ci) {
        var lista = listaArea(c.id);
        if (!lista.length && !modoAutor()) return;
        var aqui = (modo === 'guia' && c.id === areaAtual);
        var sel  = (c.id === areaAberta);
        var todas = porCategoria(c.id), feitas = progresso(todas);
        html += '<a href="#' + esc(c.id) + '" class="toplink' + (aqui ? ' active' : '') +
                '" data-area="' + esc(c.id) + '">' +
                '<span class="n">' + dois(ci + 1) + '</span><span>' + esc(c.nome) + '</span>' +
                (modoAutor()
                  ? '<span class="prog' + (feitas === todas.length ? ' full' : '') + '">' + feitas + '/' + todas.length + '</span>'
                  : '<span class="prog">' + lista.length + '</span>') +
                '<span class="cor">' + ICO(sel ? 'setaBai' : 'setaDir') + '</span></a>';
        if (!sel) return;
        var grupos = subsDe(c.id);
        if (!grupos.length) {
          lista.forEach(function (p) {
            html += '<a href="#' + esc(c.id) + '/' + esc(p.id) + '" class="sub' +
                    (p.id === condutaAtual ? ' aqui' : '') + '">' + esc(p.titulo) + '</a>';
          });
          return;
        }
        grupos.forEach(function (g) {
          var dela = listaSub(g);
          if (!dela.length) return;
          var aberto = (g.id === subAberta);
          html += '<a href="#' + esc(c.id) + '/' + esc(g.id) + '" class="sub grupo' +
                  (aberto ? ' aberta' : '') + (!condutaAtual && g.id === subAtual ? ' aqui' : '') + '">' +
                  '<span>' + esc(g.nome) + '</span><span class="prog">' + dela.length + '</span>' +
                  '<span class="cor">' + ICO(aberto ? 'setaBai' : 'setaDir') + '</span></a>';
          if (!aberto) return;
          dela.forEach(function (p) {
            html += '<a href="' + esc(hrefConduta(p)) + '" class="sub folha' +
                    (p.id === condutaAtual ? ' aqui' : '') + '">' + esc(p.titulo) + '</a>';
          });
        });
      });
      html += '</div>';
    }
    toc.innerHTML = html;
  }

  /* ---------- recentes ---------- */
  var RECENTES_MAX = 8;
  function recentes() {
    var v = ler('recentes', []);
    return Array.isArray(v) ? v : [];
  }
  function marcaRecente(id) {
    var l = recentes().filter(function (x) { return x !== id; });
    l.unshift(id);
    grava('recentes', l.slice(0, RECENTES_MAX));
  }

  /* ---------- sala vermelha ----------
     As condutas que não admitem consulta demorada. Lista curada, não
     um filtro por gravidade: nem toda emergência é sala vermelha. */
  var CRITICAS_GRUPOS = [
    { nome:'Parada e via aérea', quando:'sem pulso, sem via aérea, sem oxigenação',
      ids:['pcr-adulto','sequencia-rapida-intubacao','via-aerea-dificil','insuficiencia-respiratoria',
           'ventilacao-mecanica-inicial','acesso-intraosseo','cardioversao-desfibrilacao'] },
    { nome:'Choque e circulação', quando:'perfusão ruim, pressão caindo',
      ids:['choque-abordagem','sepse','anafilaxia','tamponamento','tep','sindrome-aortica',
           'neutropenia-febril','fasciite-necrotizante'] },
    { nome:'Coração instável', quando:'ritmo, isquemia e congestão',
      ids:['sca-com-supra','sca-sem-supra','taquiarritmia-instavel','taqui-qrs-largo','bradiarritmia',
           'eap-ic-descompensada','crise-hipertensiva'] },
    { nome:'Pulmão e tórax', quando:'broncoespasmo grave, ar ou sangue no lugar errado',
      ids:['asma-crise','pneumotorax','hemoptise','drenagem-torax','ruptura-esofago'] },
    { nome:'Neurológico agudo', quando:'tempo de cérebro',
      ids:['avc-isquemico','avc-hemorragico','status-epilepticus','rebaixamento-consciencia',
           'hipertensao-intracraniana','compressao-medular','meningite'] },
    { nome:'Metabólico e endócrino', quando:'o exame muda a conduta na hora',
      ids:['hipoglicemia','hipercalemia','hiponatremia','cetoacidose','estado-hiperosmolar',
           'crise-tireotoxica','coma-mixedematoso','insuficiencia-adrenal','indicacao-dialise'] },
    { nome:'Trauma e sangramento', quando:'xABCDE e controle de hemorragia',
      ids:['atendimento-trauma','tce','trauma-toracico','trauma-abdominal','trauma-raquimedular',
           'queimaduras','sindrome-compartimental','hda'] },
    { nome:'Abdome cirúrgico', quando:'cirurgião no telefone',
      ids:['abdome-agudo','isquemia-mesenterica','colecistite-colangite','cirrose-descompensada'] },
    { nome:'Gestante e puérpera', quando:'duas vidas, obstetra cedo',
      ids:['pre-eclampsia','sangramento-gestacao','hemorragia-pos-parto'] },
    { nome:'Criança', quando:'limiar de agir menor',
      ids:['crianca-gravemente-doente','pcr-pediatrica','sepse-pediatrica','asma-pedia'] },
    { nome:'Intoxicação e peçonhentos', quando:'antídoto e soro têm hora',
      ids:['intoxicado-abordagem','benzo-opioide','paracetamol','triciclicos','organofosforado',
           'alcool-metanol','cocaina-estimulantes','monoxido-carbono','sindrome-serotoninergica',
           'acidente-ofidico','acidente-escorpiao-aranha'] },
    { nome:'Agitação e abstinência', quando:'risco para o paciente e para a equipe',
      ids:['agitacao-psicomotora','abstinencia-alcool','risco-suicidio'] }
  ];
  /* rede de segurança: conduta nova marcada `emergencia` que ninguém
     colocou num grupo aparece no fim em vez de sumir da sala */
  (function () {
    var vistos = {};
    CRITICAS_GRUPOS.forEach(function (g) { g.ids.forEach(function (id) { vistos[id] = 1; }); });
    var soltas = PROTOCOLOS.filter(function (p) { return p.gravidade === 'emergencia' && !vistos[p.id]; })
      .map(function (p) { return p.id; });
    if (soltas.length) CRITICAS_GRUPOS.push({ nome:'Outras emergências', quando:'ainda sem grupo', ids:soltas });
  })();
  var CRITICAS = CRITICAS_GRUPOS.reduce(function (t, g) { return t.concat(g.ids); }, []);

  /* ---------- PAINEL DE GRUPOS: a peça das telas de lista ----------
     Barra escura fixa (voltar, título com total, filtro, rascunho, atalhos
     numerados) + grade de cartões alinhados, um por grupo. A cor diz o tipo:
     vermelho = sala vermelha, laranja = urgências, amarelo = queixas,
     azul = áreas do guia. */
  function dois(n) { return (n < 10 ? '0' : '') + n; }
  function painel(o) {
    var grupos = o.grupos.filter(function (g) { return g.itens.length; });
    var total = grupos.reduce(function (t, g) { return t + g.itens.length; }, 0);
    return '<section class="tz sv9 pg-' + o.cor + '">' +
      '<header class="sv9-barra">' +
        '<div class="sv9-b1">' +
          '<a class="sv9-volta" href="' + esc(o.volta || '#') + '" aria-label="Voltar">' + ICO('setaEsq') + '</a>' +
          '<h1>' + esc(o.titulo) + '<span>' + total + '</span></h1>' +
          (o.extra || '') +
          '<label class="sv9-filtro">' + ICO('lupa') +
            '<input type="search" id="svFiltro" autocomplete="off" placeholder="' + esc(o.ph || 'Filtrar nesta lista') + '" aria-label="Filtrar"></label>' +
          '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
        '</div>' +
        (grupos.length > 1 ? '<nav class="sv9-saltos">' + grupos.map(function (g, k) {
          return '<button type="button" data-sv-ir="' + k + '"><i>' + dois(k + 1) + '</i>' + esc(g.nome) + '</button>';
        }).join('') + '</nav>' : '') +
        (o.legenda || '') +
      '</header>' +
      '<div class="sv9-quadro">' + grupos.map(function (g, k) {
        return '<section class="sv9-g" id="svg-' + k + '">' +
          '<div class="sv9-g-cab">' +
            '<span class="sv9-g-n">' + dois(k + 1) + '</span>' +
            '<div><h2>' + esc(g.nome) + '</h2>' + (g.quando ? '<p>' + esc(g.quando) + '</p>' : '') + '</div>' +
            '<span class="sv9-g-c">' + g.itens.length + '</span>' +
          '</div>' +
          '<div class="sv9-g-l">' + g.itens.map(function (it) {
            return '<a class="sv9-it' + (it.cls ? ' ' + it.cls : '') + '" href="' + esc(it.href) + '"' + (it.attrs || '') +
              ' data-busca="' + esc(normaliza(it.titulo + ' ' + (it.sub || ''))) + '">' +
              '<i class="sv9-dot"></i><span><b>' + esc(it.titulo) + '</b>' + (it.sub ? '<em>' + esc(it.sub) + '</em>' : '') + '</span>' +
              ICO('setaDir') + '</a>';
          }).join('') + '</div>' +
          (g.ver ? '<a class="sv9-g-ver" href="' + esc(g.ver) + '">Abrir grupo' + ICO('setaDir') + '</a>' : '') +
        '</section>';
      }).join('') + '</div>' +
      '<p class="sv9-vazio" id="svVazio" hidden>Nada com esse termo aqui. Use a busca geral no início.</p>' +
    '</section>';
  }
  function itemP(p, cls) {
    var cat = catDe(p);
    return { href:hrefConduta(p), titulo:p.titulo, sub:cat ? cat.nome : '', cls:cls };
  }

  function renderCritico() {
    doc.innerHTML = painel({ cor:'vermelho', titulo:'Sala vermelha', ph:'Filtrar: PCR, choque, intubação…',
      grupos:CRITICAS_GRUPOS.map(function (g) {
        return { nome:g.nome, quando:g.quando, itens:g.ids.map(acharConduta).filter(Boolean).map(function (p) { return itemP(p); }) };
      }) });
  }




  /* chips da sala vermelha: rolam até o grupo, sem mexer no hash */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ir-grupo]');
    if (!a) return;
    e.preventDefault();
    var alvo = doc.querySelector('[data-grupo="' + a.getAttribute('data-ir-grupo').replace(/"/g, '') + '"]');
    if (!alvo) return;
    window.scrollTo({ top: alvo.getBoundingClientRect().top + window.pageYOffset - 66, behavior:'smooth' });
  });

  /* ---------- subpastas: area > subpasta > conduta ----------
     SUBPASTAS e um const de topo, entao so o typeof cru enxerga. */
  function temSub() { return typeof SUBPASTAS !== 'undefined'; }
  function subsDe(areaId) { return (temSub() && SUBPASTAS[areaId]) || []; }
  function acharSub(areaId, subId) {
    var l = subsDe(areaId);
    for (var i = 0; i < l.length; i++) if (l[i].id === subId) return l[i];
    return null;
  }
  /* em que subpasta esta conduta mora */
  var _subDe = null;
  function subDaConduta(p) {
    if (!_subDe) {
      _subDe = {};
      if (temSub()) Object.keys(SUBPASTAS).forEach(function (a) {
        SUBPASTAS[a].forEach(function (g) {
          g.ids.forEach(function (id) { _subDe[id] = { area:a, sub:g }; });
        });
      });
    }
    return _subDe[p.id] || null;
  }
  /* condutas visiveis de uma subpasta, na ordem em que foram declaradas */
  function listaSub(g) {
    return g.ids.map(acharConduta).filter(function (p) {
      return p && (modoAutor() || preenchida(p));
    });
  }
  function contaSub(g) { return g.ids.filter(function (id) { return !!acharConduta(id); }).length; }
  /* rota canonica de uma conduta, ja com a subpasta */
  function hrefConduta(p) {
    var d = subDaConduta(p);
    return '#' + p.categoria + (d ? '/' + d.sub.id : '') + '/' + p.id;
  }

  /* ---------- queixas: a porta de entrada de quem nao tem diagnostico ---------- */
  /* QUEIXAS e um const de topo: nao vai para o window, so o typeof cru enxerga */
  function temQueixas() { return typeof QUEIXAS !== 'undefined' && QUEIXAS.length > 0; }
  function acharQueixa(id) {
    if (!temQueixas()) return null;
    for (var i = 0; i < QUEIXAS.length; i++) if (QUEIXAS[i].id === id) return QUEIXAS[i];
    return null;
  }
  var HREF_ATALHO = {
    calc: '#calc', score: '#scores', presc: '#presc', atb: '#atb'
  };
  function hrefAtalho(a) {
    if (a.tipo === 'conduta') {
      var alvo = acharConduta(a.id);
      return alvo ? '#' + alvo.categoria + '/' + alvo.id : '#';
    }
    var base = HREF_ATALHO[a.tipo] || '#';
    return a.id ? base + (a.tipo === 'atb' ? '/' + a.id : '') : base;
  }
  function abreAtalho(a) {
    /* calculadoras e scores abrem o item direto pela mesma ponte da busca */
    if ((a.tipo === 'calc' || a.tipo === 'score') && a.id) return 'calculadora:' + a.id;
    return '';
  }

  /* indice de uma queixa, para a busca global */
  var cacheIxQ = {};
  function indiceQueixa(q) {
    if (cacheIxQ[q.id]) return cacheIxQ[q.id];
    var partes = [];
    coleta(q, partes);
    var cruTxt = partes.join(' \u00b7 ').replace(/\*/g, '');
    cacheIxQ[q.id] = { cru: cruTxt, norm: normaliza(cruTxt) };
    return cacheIxQ[q.id];
  }
  function buscaDrogas(termos) {
    if (!termos || !termos.length) return [];
    return indiceDrogas().filter(function (d) {
      var ix = normaliza(d.nome + ' ' + Object.keys(d.sin).join(' ') + ' ' + Object.keys(d.apres).join(' ') +
        ' ' + d.usos.map(function (u) { return u.rotulo; }).join(' ') +
        (d.bul ? ' ' + d.bul.classe + ' ' + (d.bul.ind || []).map(function (u) { return u.sit; }).join(' ') : ''));
      return termos.every(function (t) { return casaTolerante(ix, t); });
    });
  }
  /* ---------- busca: a resposta principal ----------
     Antes da lista, o que o plantonista provavelmente quis dizer:
     a DROGA (dose por indicação, onde é usada, queixas ligadas) e/ou a
     INTOXICAÇÃO (a conduta com o antídoto, não só a dose da medicação).
     O mapa de agentes existe porque ninguém digita o título da conduta:
     digita o que o paciente tomou. */
  var TOX_AGENTES = [
    { id:'benzo-opioide', t:['benzodiazepinico','benzodiazepina','benzo','diazepam','clonazepam','rivotril','alprazolam',
      'lorazepam','bromazepam','midazolam','zolpidem','opioide','opiaceo','morfina','tramadol','codeina','fentanil',
      'metadona','heroina','oxicodona'] },
    { id:'paracetamol', t:['paracetamol','acetaminofeno','tylenol'] },
    { id:'triciclicos', t:['triciclico','amitriptilina','nortriptilina','imipramina','clomipramina','tryptanol'] },
    { id:'organofosforado', t:['organofosforado','carbamato','chumbinho','aldicarbe','inseticida','agrotoxico',
      'pesticida','veneno de rato','colinergic'] },
    { id:'alcool-metanol', t:['alcool','etanol','embriaguez','metanol','etilenoglicol','anticongelante'] },
    { id:'cocaina-estimulantes', t:['cocaina','crack','anfetamina','metanfetamina','ecstasy','mdma','estimulante'] },
    { id:'monoxido-carbono', t:['monoxido','carboxihemoglobina','fumaca','incendio'] },
    { id:'sindrome-serotoninergica', t:['serotoninergic','neuroleptica maligna'] },
    { id:'acidente-ofidico', t:['ofidico','cobra','serpente','jararaca','cascavel','surucucu','coral','botropico','crotalico'] },
    { id:'acidente-escorpiao-aranha', t:['escorpiao','escorpionico','aranha','armadeira','loxosceles','viuva negra','araneismo'] }
  ];
  var RE_INTOX = /(^|\s)(intox|envenen|overdose|superdosagem|ingeriu|ingestao)/;
  var PALAVRAS_VAZIAS = /(^|\s)(intoxicacao|intoxicado|intoxicada|envenenamento|overdose|por|de|da|do|com|dose|doses)(?=\s|$)/g;

  /* nome comercial ou sinônimo → slug da droga no índice (o que se fala no plantão) */
  var SINONIMOS_BUSCA = {
    'epinefrina':'adrenalina', 'adrenalin':'adrenalina', 'norepinefrina':'noradrenalina', 'nora':'noradrenalina',
    'metamizol':'dipirona', 'novalgina':'dipirona', 'acetaminofeno':'paracetamol', 'tylenol':'paracetamol',
    'albuterol':'salbutamol', 'aerolin':'salbutamol', 'berotec':'fenoterol', 'atrovent':'brometo-de-ipratropio',
    'ipratropio':'brometo-de-ipratropio', 'hidantal':'fenitoina', 'dormonid':'midazolam', 'valium':'diazepam',
    'haldol':'haloperidol', 'plasil':'metoclopramida', 'buscopan':'escopolamina', 'decadron':'dexametasona',
    'solu cortef':'hidrocortisona', 'ancoron':'amiodarona', 'clexane':'enoxaparina', 'rocefin':'ceftriaxona',
    'zofran':'ondansetrona', 'vonau':'ondansetrona', 'tridil':'nitroglicerina', 'nipride':'nitroprussiato-de-sodio',
    'lasix':'furosemida', 'dimorf':'morfina', 'tramal':'tramadol', 'transamin':'acido-tranexamico',
    'isordil':'dinitrato-de-isossorbida', 'kanakion':'fitomenadiona', 'narcan':'naloxona', 'lanexat':'flumazenil',
    'fluimucil':'n-acetilcisteina', 'nac':'n-acetilcisteina', 'bicarbonato':'bicarbonato-de-sodio', 'kcl':'cloreto-de-potassio'
  };

  function intencaoBusca() {
    var qn = normaliza(termoBusca).replace(/\s+/g, ' ').trim();
    if (qn.length < 3) return { droga:null, tox:[], intox:false };
    var intox = RE_INTOX.test(qn);
    /* intoxicação: agente reconhecido no começo de uma palavra */
    var tox = [];
    TOX_AGENTES.forEach(function (a) {
      var bate = a.t.some(function (t) { return new RegExp('(^|\\s)' + t).test(qn); });
      var p = bate && acharConduta(a.id);
      if (p && tox.indexOf(p) === -1) tox.push(p);
    });
    if (!tox.length && intox && acharConduta('intoxicado-abordagem')) tox.push(acharConduta('intoxicado-abordagem'));
    /* droga: nome (ou sinônimo) igual ao digitado, ou começando por ele */
    var alvo = qn.replace(PALAVRAS_VAZIAS, ' ').replace(/\s+/g, ' ').trim();
    var droga = null, melhor = 0;
    var aliasSlug = SINONIMOS_BUSCA[alvo] || ALIAS_DROGA[alvo.replace(/\s+/g, '-')] || '';
    if (alvo.length >= 3) indiceDrogas().forEach(function (d) {
      if (aliasSlug && d.slug === aliasSlug) { if (melhor < 3 || !droga) { melhor = 3; droga = d; } return; }
      var nomes = [d.nome].concat(Object.keys(d.sin)).map(normaliza).concat([d.slug.replace(/-/g, ' ')]);
      var pts = 0;
      nomes.forEach(function (n) {
        if (n === alvo) pts = Math.max(pts, 3);
        else if (alvo.length >= 4 && n.indexOf(alvo) === 0) pts = Math.max(pts, 2);
      });
      if (pts > melhor || (pts && pts === melhor && d.usos.length > (droga ? droga.usos.length : 0))) { melhor = pts; droga = d; }
    });
    return { droga:droga, tox:tox, intox:intox };
  }

  /* as queixas que levam a estas condutas (lista de condutas ou "não posso deixar passar") */
  function queixasDe(condutas) {
    if (!temQueixas()) return [];
    var ids = condutas.map(function (p) { return p.id; });
    return QUEIXAS.map(function (q) {
      var ligadas = [];
      (q.condutas || []).concat((q.naopode || []).map(function (n) { return n.conduta; })).forEach(function (id) {
        if (ids.indexOf(id) !== -1 && ligadas.indexOf(id) === -1) ligadas.push(id);
      });
      return { q:q, por:ligadas.map(acharConduta).filter(Boolean) };
    }).filter(function (x) { return x.por.length; })
      .sort(function (a, b) { return b.por.length - a.por.length; });
  }

  var PESO_GRAV = { emergencia:0, urgencia:1, rotina:2 };
  function hrefDe(p) { return typeof hrefConduta === 'function' ? hrefConduta(p) : '#' + p.categoria + '/' + p.id; }

  /* antídoto de verdade: o nome da droga está nas tags da conduta de intoxicação (atropina, naloxona, flumazenil, NAC…) */
  function ehAntidoto(d, condutas) {
    var nomes = [d.nome].concat(Object.keys(d.sin)).map(normaliza);
    return condutas.some(function (p) {
      var tags = normaliza((p.tags || []).join(' '));
      return nomes.some(function (n) { return n.length > 3 && tags.indexOf(n) !== -1; });
    });
  }
  function cartaoDroga(d) {
    var b = d.bul, vias = viasLimpas(d.vias);
    var apres = b && (b.apres || []).length ? b.apres : Object.keys(d.apres);
    var linhas = b && (b.ind || []).length
      ? b.ind.slice(0, 3).map(function (u) { return { sit:u.sit, dose:u.dose, via:u.via }; })
      : d.usos.slice(0, 3).map(function (u) { return { sit:u.detalhe || u.situacao, dose:u.dose, via:u.via }; });
    var antidoto = [];
    d.usos.forEach(function (u) {
      if (u.conduta.categoria === 'toxico' && antidoto.indexOf(u.conduta) === -1) antidoto.push(u.conduta);
    });
    return '<article class="bzr-card bzr-droga">' +
      '<header><span class="bzr-ico">' + ICO('seringa') + '</span>' +
        '<div><small>Droga' + (b && b.classe ? ' · ' + esc(b.classe) : '') + '</small><h2>' + esc(d.nome) + '</h2>' +
        (apres.length ? '<p>' + esc(apres.slice(0, 2).join(' · ')) + '</p>' : '') + '</div>' +
        (vias.length ? '<span class="bzr-vias">' + vias.map(function (v) { return '<i>' + esc(v) + '</i>'; }).join('') + '</span>' : '') +
      '</header>' +
      (linhas.length ? '<ul class="bzr-doses">' + linhas.map(function (l) {
        return '<li><span>' + rico(l.sit || '') + '</span><b>' + rico(l.dose || '') + '</b>' + (l.via ? '<i>' + esc(l.via) + '</i>' : '') + '</li>';
      }).join('') + '</ul>' : '') +
      (antidoto.length ? '<p class="bzr-antidoto">' + ICO('escudo') + '<span>' + (ehAntidoto(d, antidoto) ? 'Antídoto em ' : 'Usada nas intoxicações: ') + antidoto.map(function (p) {
        return '<a href="' + esc(hrefDe(p)) + '">' + esc(p.titulo) + '</a>'; }).join(', ') + '</span></p>' : '') +
      '<footer><a class="bzr-cta" href="#droga/' + esc(d.slug) + '">Abrir verbete completo' + ICO('setaDir') + '</a>' +
        (d.usos.length ? '<span>' + d.usos.length + (d.usos.length === 1 ? ' uso' : ' usos') + ' no guia</span>' : '') + '</footer>' +
    '</article>';
  }

  /* doses pediátricas (módulo de pediatria) que são desta droga */
  var VAZIAS_DROGA = { acido:1, sulfato:1, cloreto:1, brometo:1, cloridrato:1, solucao:1, soro:1, sais:1, sal:1, gluconato:1 };
  function palavrasDroga(t) {
    return normaliza(t).split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 5 && !VAZIAS_DROGA[w]; });
  }
  function pediatriaDe(d) {
    if (!temFerramentas() || !Ferramentas.ped) return [];
    var alvo = {}; [d.nome].concat(Object.keys(d.sin)).forEach(function (n) { palavrasDroga(n).forEach(function (w) { alvo[w] = 1; }); });
    return Ferramentas.ped.lista().filter(function (m) {
      var pw = palavrasDroga(m.nome)[0];
      return pw && alvo[pw];
    });
  }
  function linhasPediatria(lista) {
    var P = Ferramentas.ped, kg = pesoAtual();
    return lista.map(function (m) {
      var linhas = (m.doses || []).map(function (d) {
        var r = kg ? P.calc(m, d, kg) : null;
        var un = d.unid === 'UI' ? ' UI' : ' mg';
        var faixa = d.mgkg != null ? br(d.mgkg) + (d.mgkgMax && d.mgkgMax !== d.mgkg ? '–' + br(d.mgkgMax) : '') + un + '/kg' : (d.fixa || '');
        var conc = r && r.vol && P.conc ? P.conc(m, d) : null;
        return '<li><span class="bzf-sit">' + esc(d.rot || 'Dose') + (d.freq ? '<i>' + esc(d.freq) + '</i>' : '') + '</span>' +
          '<span class="bzf-dose">' + (r ? '<b>' + milhar(esc(r.vol || r.mg)) + '</b>' + (r.vol ? '<em>' + milhar(esc(r.mg)) + '</em>' : '') : '<b>' + milhar(esc(faixa)) + '</b>') +
            '<small>' + (r ? milhar(esc(faixa)) + ' · ' : '') + (d.maxMg ? 'máx. ' + milhar(br(d.maxMg)) + un : '') + (conc ? ' · volume para ' + br(conc) + un + '/mL' : '') + '</small>' +
            (d.nota && RE_NOTA_FORTE.test(d.nota) ? '<small class="forte">' + esc(d.nota) + '</small>' : '') + '</span></li>';
      }).join('');
      return '<div class="bzf-ped"><h4>' + esc(m.nome) + (m.via ? ' <i>' + esc(m.via) + '</i>' : '') + '</h4>' +
        (m.apres ? '<p class="bzf-apres">' + esc(m.apres) + '</p>' : '') +
        (m.veto && m.veto.txt ? '<p class="bzf-veto">' + ICO('alerta') + '<span>' + esc(m.veto.txt) + '</span></p>' : '') +
        '<ul class="bzf-lista">' + linhas + '</ul></div>';
    }).join('');
  }
  function fichaDroga(d) {
    var b = d.bul, vias = viasLimpas(d.vias);
    var apres = b && (b.apres || []).length ? b.apres : Object.keys(d.apres);
    var adulto = b && (b.ind || []).length
      ? b.ind.map(function (u) { return { sit:u.sit, dose:u.dose, via:u.via, prep:u.prep }; })
      : d.usos.filter(function (u) { return u.conduta.categoria !== 'pedia'; }).slice(0, 8)
          .map(function (u) { return { sit:u.detalhe || u.situacao, dose:u.dose, via:u.via, prep:u.preparo }; });
    var ped = pediatriaDe(d), kg = pesoAtual();
    var tox = []; d.usos.forEach(function (u) { if (u.conduta.categoria === 'toxico' && tox.indexOf(u.conduta) === -1) tox.push(u.conduta); });
    return '<article class="bzr-card bzr-droga bzf">' +
      '<header><span class="bzr-ico">' + ICO('seringa') + '</span>' +
        '<div><small>Droga' + (b && b.classe ? ' · ' + esc(b.classe) : '') + '</small><h2>' + esc(d.nome) + '</h2>' +
        (apres.length ? '<p>' + esc(apres.slice(0, 3).join(' · ')) + '</p>' : '') + '</div>' +
        (vias.length ? '<span class="bzr-vias">' + vias.map(function (v) { return '<i>' + esc(v) + '</i>'; }).join('') + '</span>' : '') +
      '</header>' +
      '<div class="bzf-cols">' +
        '<section class="bzf-col"><h3><span class="bzf-tag adulto">Adulto</span><em>' + adulto.length + (adulto.length === 1 ? ' indicação' : ' indicações') + '</em></h3>' +
          (adulto.length ? '<ul class="bzf-lista">' + adulto.map(function (l) {
            return '<li><span class="bzf-sit">' + rico(l.sit || '') + '</span><span class="bzf-dose"><b>' + rico(l.dose || '') + '</b>' +
              (l.via ? '<i>' + esc(l.via) + '</i>' : '') + (l.prep ? '<small>' + rico(l.prep) + '</small>' : '') + '</span></li>';
          }).join('') + '</ul>' : '<p class="bzf-vazio">Sem dose de adulto no guia.</p>') +
          (b && b.dil ? '<p class="bzf-dil"><b>Diluição</b>' + rico(b.dil) + '</p>' : '') +
        '</section>' +
        '<section class="bzf-col crianca"><h3><span class="bzf-tag crianca">Criança</span>' +
          (ped.length ? '<label class="bzf-peso' + (kg ? ' cheio' : '') + '"><span>Peso</span><input type="text" inputmode="decimal" id="bzPeso" value="' + (kg ? br(kg) : '') + '" placeholder="—" aria-label="Peso da criança em kg"><i>kg</i></label>' : '') + '</h3>' +
          (ped.length ? (kg ? '' : '<p class="bzf-dica">Informe o peso para ver o volume em mL.</p>') + linhasPediatria(ped)
                      : '<p class="bzf-vazio">Sem dose pediátrica no módulo de pediatria.</p>') +
        '</section>' +
      '</div>' +
      (tox.length ? '<p class="bzr-antidoto">' + ICO('escudo') + '<span>' + (ehAntidoto(d, tox) ? 'Antídoto em ' : 'Usada nas intoxicações: ') + tox.map(function (p) {
        return '<a href="' + esc(hrefDe(p)) + '">' + esc(p.titulo) + '</a>'; }).join(', ') + '</span></p>' : '') +
      '<footer><a class="bzr-cta" href="#droga/' + esc(d.slug) + '">Verbete completo' + ICO('setaDir') + '</a>' +
        (b && b.max ? '<span>Máximo: ' + esc(b.max) + '</span>' : '') + '</footer>' +
    '</article>';
  }

  /* onde a droga aparece: condutas de adulto e de pediatria (com a dose da situação) + queixas em pílulas */
  function ondeUsar(d, excluir) {
    var porConduta = {}, conds = [];
    d.usos.forEach(function (u) {
      if (excluir.indexOf(u.conduta) !== -1 || porConduta[u.conduta.id]) return;
      porConduta[u.conduta.id] = u; conds.push(u.conduta);
    });
    var ord = function (a, b) { return (PESO_GRAV[a.gravidade] || 2) - (PESO_GRAV[b.gravidade] || 2) || (a.titulo < b.titulo ? -1 : 1); };
    var adulto = conds.filter(function (p) { return p.categoria !== 'pedia'; }).sort(ord);
    var pedia = conds.filter(function (p) { return p.categoria === 'pedia'; }).sort(ord);
    function linha(p) {
      var u = porConduta[p.id];
      return '<a class="bzr-li g-' + esc(p.gravidade || 'rotina') + '" href="' + esc(hrefDe(p)) + '"><i class="bzr-dot"></i>' +
        '<span class="bzr-t"><b>' + esc(p.titulo) + '</b>' + (u.detalhe ? '<small>' + esc(u.detalhe) + '</small>' : '') + '</span>' +
        '<span class="bzr-pill">' + rico(u.dose) + (u.via ? ' <i>' + esc(u.via) + '</i>' : '') + '</span>' + ICO('setaDir') + '</a>';
    }
    function coluna(titulo, cls, lista) {
      if (!lista.length) return '';
      var mostra = lista.slice(0, 10), resto = lista.slice(10);
      return '<section class="bzr-rel ' + cls + '"><header><h3>' + titulo + '</h3><span>' + lista.length + '</span></header><div>' +
        mostra.map(linha).join('') +
        (resto.length ? '<details class="bzr-mais-d"><summary>Ver mais ' + resto.length + '</summary>' + resto.map(linha).join('') + '</details>' : '') +
        '</div></section>';
    }
    var qxs = queixasDe(conds);
    var h = '<div class="bzr-rels' + (adulto.length && pedia.length ? '' : ' um') + '">' +
      coluna('Condutas — adulto', 'bzr-ad', adulto) + coluna('Condutas — pediatria', 'bzr-pd', pedia) + '</div>';
    if (qxs.length) h += '<div class="bzr-qpills"><span>Queixas</span>' + qxs.map(function (x) {
      return '<a href="#queixa/' + esc(x.q.id) + '">' + ICO(x.q.icone || 'porta') + esc(x.q.nome) + '</a>';
    }).join('') + '</div>';
    return h;
  }

  function cartaoIntox(p, secundaria) {
    var ficha = (p.ficha || []).filter(function (f) { return /quando|suspeit|pensar/i.test(f.rotulo); })[0];
    var alerta = (p.secoes || []).filter(function (x) { return x.tipo === 'alerta'; })[0];
    var pista = ficha ? ficha.valor : (alerta && alerta.itens && alerta.itens[0]) || p.resumo || '';
    var vistos = {}, chips = [];
    dosesDe(p).forEach(function (sec) {
      (sec.itens || []).forEach(function (i) {
        if (chips.length >= 4 || !i || !i.droga) return;
        var nome = ehDroga(i.droga) ? baseDroga(i.droga) : String(i.droga).replace(/\*/g, '').split(/\s+[—–-]\s+/)[0];
        var k = normaliza(nome); if (vistos[k]) return; vistos[k] = 1;
        var slug = ehDroga(i.droga) ? slugDroga(i.droga) : '';
        var dentro = '<b>' + esc(nome) + '</b>' + (i.dose ? '<span>' + rico(i.dose) + '</span>' : '');
        chips.push(slug && acharDroga(slug) ? '<a href="#droga/' + esc(slug) + '">' + dentro + '</a>' : '<span class="sem">' + dentro + '</span>');
      });
    });
    return '<article class="bzr-card bzr-tox' + (secundaria ? ' sec' : '') + '">' +
      '<header><span class="bzr-ico">' + ICO('perigo') + '</span>' +
        '<div><small>' + (secundaria ? 'Se for intoxicação' : 'Intoxicação') + ' · ' + esc(LABEL_GRAV[p.gravidade] || p.gravidade || '') + '</small>' +
        '<h2>' + esc(p.titulo) + '</h2>' + (p.resumo ? '<p>' + rico(p.resumo) + '</p>' : '') + '</div></header>' +
      (pista ? '<p class="bzr-pista"><b>Pense quando</b>' + rico(pista) + '</p>' : '') +
      (chips.length ? '<div class="bzr-chips"><small>Antídoto e medidas</small>' + chips.join('') + '</div>' : '') +
      '<footer><a class="bzr-cta" href="' + esc(hrefDe(p)) + '">Abrir a conduta' + ICO('setaDir') + '</a>' +
        '<a class="bzr-tel" href="tel:08007226001">' + ICO('alerta') + 'Disque-Intoxicação 0800 722 6001</a></footer>' +
    '</article>';
  }

  function blocoRelacionados(condutas, dosePorConduta, titulo, baseQueixas) {
    var lista = condutas.slice().sort(function (a, b) {
      return (PESO_GRAV[a.gravidade] || 2) - (PESO_GRAV[b.gravidade] || 2) || (a.titulo < b.titulo ? -1 : 1);
    });
    var qxs = queixasDe((baseQueixas || []).concat(condutas));
    var h = '';
    if (lista.length) {
      h += '<section class="bzr-rel"><header><h3>' + esc(titulo) + '</h3><span>' + lista.length + '</span></header><div>' +
        lista.slice(0, 8).map(function (p) {
          var u = dosePorConduta && dosePorConduta[p.id];
          return '<a class="bzr-li g-' + esc(p.gravidade || 'rotina') + '" href="' + esc(hrefDe(p)) + '">' +
            '<i class="bzr-dot"></i><span class="bzr-t"><b>' + esc(p.titulo) + '</b>' +
            (u && u.detalhe ? '<small>' + esc(u.detalhe) + '</small>' : '<small>' + esc(area(p.categoria).nome) + '</small>') + '</span>' +
            (u ? '<span class="bzr-pill">' + rico(u.dose) + (u.via ? ' <i>' + esc(u.via) + '</i>' : '') + '</span>' : '') +
            ICO('setaDir') + '</a>';
        }).join('') +
        (lista.length > 8 ? '<p class="bzr-mais">e mais ' + (lista.length - 8) + ' na lista abaixo</p>' : '') + '</div></section>';
    }
    if (qxs.length) {
      h += '<section class="bzr-rel bzr-qx"><header><h3>Queixas em que aparece</h3><span>' + qxs.length + '</span></header><div>' +
        qxs.slice(0, 6).map(function (x) {
          return '<a class="bzr-li" href="#queixa/' + esc(x.q.id) + '"><span class="bzr-qi">' + ICO(x.q.icone || 'porta') + '</span>' +
            '<span class="bzr-t"><b>' + esc(x.q.nome) + '</b><small>por ' + esc(x.por.slice(0, 2).map(function (p) { return p.titulo; }).join(' · ')) + '</small></span>' +
            ICO('setaDir') + '</a>';
        }).join('') + '</div></section>';
    }
    return h ? '<div class="bzr-rels">' + h + '</div>' : '';
  }

  function respostaPrincipal(it) {
    if (!it.droga && !it.tox.length) return '';
    var h = '<div class="bzr">';
    var toxPrimeiro = it.tox.length && (it.intox || !it.droga);
    h += '<div class="bzr-herois' + ((it.droga ? 1 : 0) + it.tox.length > 1 ? ' duplo' : '') + '">';
    if (toxPrimeiro) {
      h += it.tox.slice(0, 2).map(function (p) { return cartaoIntox(p, false); }).join('');
      if (it.droga) h += cartaoDroga(it.droga);
    } else {
      /* droga: a ficha de bolso ocupa a largura toda; a intoxicação (se houver) vem logo abaixo */
      h = h.replace('<div class="bzr-herois duplo">', '<div class="bzr-herois">');
      if (it.droga) h += fichaDroga(it.droga);
      h += it.tox.slice(0, 1).map(function (p) { return cartaoIntox(p, true); }).join('');
    }
    h += '</div>';
    /* relacionados: da droga (onde é usada, com a dose) ou da intoxicação */
    if (it.droga && !toxPrimeiro) {
      h += ondeUsar(it.droga, it.tox);
    } else if (it.tox.length) {
      var outras = it.droga ? it.droga.usos.map(function (u) { return u.conduta; })
        .filter(function (p, i, a) { return a.indexOf(p) === i && it.tox.indexOf(p) === -1; }) : [];
      var geral = acharConduta('intoxicado-abordagem');
      h += blocoRelacionados(outras, null, 'Outras condutas com ' + (it.droga ? it.droga.nome : 'o agente'),
        it.tox.concat(geral && it.tox.indexOf(geral) === -1 &&
          !it.tox.some(function (p) { return /^acidente-/.test(p.id); }) ? [geral] : []));
    }
    return h + '</div>';
  }

  function buscaQueixas(termos) {
    if (!temQueixas() || !termos || !termos.length) return [];
    return QUEIXAS.filter(function (q) {
      var ix = indiceQueixa(q);
      return termos.every(function (t) { return ix.norm.indexOf(t) !== -1; });
    });
  }

  /* capa: "estou diante de um paciente com..." */
  var QX_GRUPOS = [
    { nome:'Respiração e circulação', ids:['dispneia','dor-toracica-q','hipotensao','palpitacoes','edema'] },
    { nome:'Neurológico', ids:['alteracao-consciencia','convulsao-q','cefaleia-q','sincope-q','tontura','agitacao'] },
    { nome:'Abdome e perdas', ids:['dor-abdominal','vomito-diarreia','sangramento'] },
    { nome:'Sistêmico e metabólico', ids:['febre','glicemia'] }
  ];
  function linhaQueixa(q) {
    return '<a class="lc" href="#queixa/' + esc(q.id) + '">' +
      '<span class="lq-ico">' + ICO(q.icone) + '</span>' +
      '<span class="lc-txt"><span class="lc-topo"><b>' + esc(q.nome) + '</b></span>' +
        '<span class="lc-sub">' + esc(q.sub) + '</span></span>' +
      '<span class="lc-seta">' + ICO('setaDir') + '</span></a>';
  }
  function renderQueixas() {
    var usados = {};
    var grupos = QX_GRUPOS.map(function (g) {
      var itens = g.ids.map(acharQueixa).filter(Boolean);
      itens.forEach(function (q) { usados[q.id] = 1; });
      return { nome:g.nome, itens:itens };
    });
    var sobra = QUEIXAS.filter(function (q) { return !usados[q.id]; });
    if (sobra.length) grupos.push({ nome:'Outras', itens:sobra });
    doc.innerHTML = painel({ cor:'amarelo', titulo:'Queixas', ph:'Filtrar: falta de ar, febre, desmaio…',
      grupos:grupos.map(function (g) {
        return { nome:g.nome, quando:'sem diagnóstico ainda', itens:g.itens.map(function (q) {
          return { href:'#queixa/' + q.id, titulo:q.nome, sub:q.sub }; }) };
      }) });
  }



  /* uma queixa aberta */
  /* ---------- QUEIXA: mesmo console da conduta, em amarelo ----------
     instável agora → fazer agora → fluxograma + "não posso deixar passar"
     ao lado → demais blocos em cartões → ferramentas ligadas */
  function renderQueixa(q) {
    fluxoConduta = q;
    var secoes = (q.secoes || []).map(function (s, k) { return { s:s, k:k }; });
    var fluxos = secoes.filter(function (x) { return x.s.tipo === 'fluxo'; });
    var resto = ordenaSecoes((q.secoes || []).filter(function (s) { return s.tipo !== 'fluxo'; }))
      .map(function (s) { return { s:s, k:(q.secoes || []).indexOf(s) }; });
    var criticos = (q.naopode || []).filter(function (d) {
      return d.conduta && CRITICAS.indexOf(d.conduta) !== -1 && acharConduta(d.conduta);
    });
    var saltos = [];
    if ((q.agora || []).length) saltos.push({ id:'cds-agora', nome:'Fazer agora' });
    fluxos.forEach(function (x) { saltos.push({ id:'cds-' + x.k, nome:x.s.titulo || 'Fluxograma' }); });
    if ((q.naopode || []).length) saltos.push({ id:'qx-np', nome:'Não deixar passar' });
    resto.forEach(function (x) { saltos.push({ id:'cds-' + x.k, nome:x.s.titulo || LABEL[x.s.tipo] || '' }); });
    if ((q.atalhos || []).length) saltos.push({ id:'qx-ferr', nome:'Ferramentas' });

    var html = '<section class="tz sv9 cd qx2 pg-amarelo">' +
      '<header class="sv9-barra cd-barra">' +
        '<div class="sv9-b1">' +
          '<a class="sv9-volta cd-volta" href="#queixa">' + ICO('setaEsq') + '<span>Queixas</span></a>' +
          '<div class="cd-tit"><h1>' + esc(q.nome) + '</h1>' + (q.sub ? '<p>' + esc(q.sub) + '</p>' : '') + '</div>' +
          '<span class="cd-grav g-queixa">Sem diagnóstico</span>' +
          '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
        '</div>' +
        (saltos.length > 1 ? '<nav class="sv9-saltos">' + saltos.map(function (s, n) {
          return '<button type="button" data-cd-ir="' + esc(s.id) + '"><i>' + dois(n + 1) + '</i>' + esc(s.nome) + '</button>';
        }).join('') + '</nav>' : '') +
      '</header>';

    if (criticos.length) {
      html += '<section class="qx2-inst"><header>' + ICO('perigo') + '<b>Se instável agora</b><i>vai direto para a emergência</i></header><div>' +
        criticos.map(function (d) {
          var alvo = acharConduta(d.conduta);
          return '<a href="' + esc(hrefConduta(alvo)) + '">' + esc(d.dx) + ICO('setaDir') + '</a>';
        }).join('') + '</div></section>';
    }

    if ((q.agora || []).length) html += cdAgora({ titulo:'Fazer agora', itens:q.agora });

    var np = (q.naopode || []).length ? '<section class="cd-card qx2-np" id="qx-np">' +
      '<header class="cd-card-cab"><span class="cd-card-i">' + ICO('alerta') + '</span><h3>Não posso deixar passar</h3><span class="cd-card-n">' + q.naopode.length + '</span></header>' +
      '<div class="qx2-np-l">' + q.naopode.map(function (d) {
        var alvo = d.conduta && acharConduta(d.conduta);
        var crit = alvo && CRITICAS.indexOf(d.conduta) !== -1;
        var corpo = '<b>' + esc(d.dx) + '</b><span>' + rico(d.pista) + '</span>';
        return alvo ? '<a class="qx2-np-i' + (crit ? ' crit' : '') + '" href="' + esc(hrefConduta(alvo)) + '"><div>' + corpo + '</div>' + ICO('setaDir') + '</a>'
                    : '<div class="qx2-np-i"><div>' + corpo + '</div></div>';
      }).join('') + '</div></section>' : '';

    if (fluxos.length || np) {
      html += '<div class="cd-meio' + (fluxos.length ? '' : ' so-lado') + '">' +
        (fluxos.length ? '<div class="cd-fluxos">' + fluxos.map(function (x) {
          return '<section class="cd-fluxo" id="cds-' + x.k + '">' + fluxoV2(x.s) + '</section>'; }).join('') + '</div>' : '') +
        (np ? '<aside class="cd-lado">' + np + '</aside>' : '') + '</div>';
    }
    if (resto.length) html += '<div class="cd-resto">' + resto.map(function (x) { return cdCartao(x.s, x.k, true); }).join('') + '</div>';

    if ((q.atalhos || []).length) {
      html += '<section class="qx2-ferr" id="qx-ferr"><h3>Ferramentas para este caso</h3><div>' +
        q.atalhos.map(function (at) {
          var ab = abreAtalho(at);
          return '<a href="' + esc(hrefAtalho(at)) + '"' + (ab ? ' data-abre="' + esc(ab) + '"' : '') + '>' + esc(at.rotulo) + ICO('setaDir') + '</a>';
        }).join('') + '</div></section>';
    }
    html += '<p class="cd-aviso">' + ICO('livro') + '<span><b>Base:</b> ' + esc(q.fonte || '') + (q.revisao ? ' · ' + esc(q.revisao) : '') + '</span></p>';
    doc.innerHTML = html + '</section>';
  }


  /* ---------- doses de emergencia ----------
     Vista DERIVADA: nao guarda dose nenhuma. Le as secoes `doses` das
     condutas que ja existem, agrupadas por situacao. Editar a conduta
     atualiza esta pagina sozinho. */
  var DOSES_GRUPOS = [
    { id:'parada', nome:'Parada e ritmos de parada', icone:'coracao', cor:'c-fire',
      sub:'Adrenalina, amiodarona, cargas de choque',
      ids:['pcr-adulto','cardioversao-desfibrilacao'] },
    { id:'arritmias', nome:'Arritmias com instabilidade', icone:'coracao', cor:'c-pink',
      sub:'Adenosina, amiodarona, atropina, cardioversão',
      ids:['taquiarritmia-instavel','taqui-qrs-estreito','taqui-qrs-largo','bradiarritmia'] },
    { id:'via-aerea', nome:'Anafilaxia e via aérea', icone:'pulmao', cor:'c-blue',
      sub:'Adrenalina IM, sequência rápida, crise de asma',
      ids:['anafilaxia','sequencia-rapida-intubacao','asma-crise'] },
    { id:'convulsao', nome:'Convulsão', icone:'cerebro', cor:'c-purple',
      sub:'Benzodiazepínico, fenitoína, estado de mal',
      ids:['status-epilepticus'] },
    { id:'glicemia', nome:'Glicemia', icone:'seringa', cor:'c-amber',
      sub:'Glicose hipertônica, insulina, cetoacidose',
      ids:['hipoglicemia','cetoacidose'] },
    { id:'eletrolitos', nome:'Eletrólitos', icone:'rim', cor:'c-cyan',
      sub:'Potássio, sódio, cálcio e as diluições',
      ids:['hipercalemia','hipocalemia','hiponatremia','calcio'] },
    { id:'choque', nome:'Choque e sepse', icone:'gota', cor:'c-orange',
      sub:'Noradrenalina, vasopressina, antibiótico na primeira hora',
      ids:['choque-abordagem','sepse'] },
    { id:'reperfusao', nome:'Reperfusão e crise hipertensiva', icone:'coracao', cor:'c-indigo',
      sub:'Trombolítico, nitroglicerina, nitroprussiato',
      ids:['sca-com-supra','avc-isquemico','crise-hipertensiva','eap-ic-descompensada'] },
    { id:'sedacao', nome:'Sedação e analgesia', icone:'seringa', cor:'c-teal',
      sub:'Fentanila, midazolam, cetamina, propofol',
      ids:['sedacao-analgesia','analgesia-ps'] },
    { id:'intoxicacoes', nome:'Intoxicações e antídotos', icone:'frasco', cor:'c-green',
      sub:'Naloxona, flumazenil, N-acetilcisteína, atropina',
      ids:['intoxicado-abordagem','benzo-opioide','paracetamol','organofosforado','triciclicos'] },
    { id:'pediatria', nome:'Pediatria', icone:'crianca', cor:'c-slate',
      sub:'Parada, sepse, asma e desidratação na criança',
      ids:['pcr-pediatrica','sepse-pediatrica','asma-pedia','desidratacao-crianca'] }
  ];
  function grupoDoses(id) {
    for (var i = 0; i < DOSES_GRUPOS.length; i++) if (DOSES_GRUPOS[i].id === id) return DOSES_GRUPOS[i];
    return null;
  }
  /* quantas condutas do grupo têm bloco de doses */
  function contaGrupoDoses(g) {
    return g.ids.filter(function (id) { var p = acharConduta(id); return p && dosesDe(p).length; }).length;
  }

  function dosesDe(p) {
    return (p.secoes || []).filter(function (s) { return s.tipo === 'doses'; });
  }

  /* ---------- índice de drogas ----------
     Também derivado: varre as seções `doses` de todas as condutas e
     junta cada droga num verbete só, com um uso por situação. */
  var cacheDrogas = null;

  /* mesma droga, grafias diferentes: vira um verbete só */
  var ALIAS_DROGA = {
    'aas':'acido-acetilsalicilico', 'asa':'acido-acetilsalicilico',
    'epinefrina':'adrenalina', 'norepinefrina':'noradrenalina',
    'nora':'noradrenalina', 'noradrenalina-norepinefrina':'noradrenalina',
    'atc':'acido-tranexamico', 'txa':'acido-tranexamico',
    'nac':'n-acetilcisteina', 'acetilcisteina':'n-acetilcisteina',
    'hco3':'bicarbonato-de-sodio', 'bicarbonato':'bicarbonato-de-sodio',
    'sf':'soro-fisiologico', 'sf-a':'soro-fisiologico', 'salina':'soro-fisiologico',
    'rl':'ringer-lactato', 'ringer':'ringer-lactato',
    'sg':'soro-glicosado', 'glicose-hipertonica':'glicose',
    'kcl':'cloreto-de-potassio', 'nacl':'cloreto-de-sodio',
    'mgso':'sulfato-de-magnesio', 'sulfato-de-mg':'sulfato-de-magnesio',
    'hidrocortisona-succinato':'hidrocortisona', 'metilpred':'metilprednisolona',
    'dva':'droga-vasoativa', 'o':'oxigenio', 'oxigenio-suplementar':'oxigenio',
    'penicilina':'penicilina-g', 'penicilina-cristalina':'penicilina-g', 'penicilina-g-cristalina':'penicilina-g',
    'vitamina-k':'fitomenadiona', 'valproato':'acido-valproico', 'valproato-de-sodio':'acido-valproico',
    'rtpa':'alteplase', 'tnk':'tenecteplase', 'ccp':'complexo-protrombinico', 'complexo-protrombinico-ccp':'complexo-protrombinico',
    'heparina':'heparina-nao-fracionada', 'hnf':'heparina-nao-fracionada', 'ketamina':'cetamina',
    'pantoprazol':'omeprazol', 'gluconato-de-calcio-10':'gluconato-de-calcio', 'ipratropio-brometo':'brometo-de-ipratropio',
    'azul-de-metileno-1':'azul-de-metileno', 'bicarbonato-de-sodio-8-4':'bicarbonato-de-sodio',
    'ipratropio':'brometo-de-ipratropio', 'nac-oral':'n-acetilcisteina', 'nac':'n-acetilcisteina'
  };
  /* o que não é droga: procedimento, unidade solta, fragmento */
  var RE_NAO_DROGA = new RegExp('^(acesso|cardiovers|desfibril|intuba|punc|puncao|manobra|massagem|' +
    'compress|monitoriz|marca-?passo|sonda|dreno|toracocentese|pericardiocentese|' +
    'lavagem|aquecimento|imobiliza|curativo|sutura|exame|ecg|glasgow|repouso|' +
    'jejum|hidrata|dieta|elevar|cabeceira|considerar|avaliar|se |quando |apos |ate |acima( |$)|abaixo( |$)|glicemia( |$)|' +
    /* material, procedimento, parâmetro, conduta genérica: não são medicação */
    'agua|agulha|amostra|analgesia|antibiotico|antifungico|antipsicotico|antitussigeno|' +
    'benzodiazepinico|beta-?$|binivel|bloqueador|bloqueio|botropico|crotalico|elapidico|bougie|burp|' +
    'canula|carboidrato|cateter|cinta|cistostomia|contraste|controle|corticoide|cpap|cristaloide|' +
    'derivac|desbrid|descompress|driving|emboliz|empirico|evitar|fascio|fase |fase$|fibrinolitico intra|' +
    'fio |fio$|fio2|fluxo|foco|frequencia|fundo de olho|gelo|glicemia|glicose ou|gota espessa|hemodialise|' +
    'infeccao|infusao sob|inquerito|interface|isolamento|janela|linhas b|mascara|meia elastica|meningite|' +
    'nao prescrever|oxigenio hiperbarico|oxigenio suplementar|peep|plasmaferese|pr normal|pressao|prevencao|profilaxia|' +
    'profundidade|qrs|reaquecimento|reposicao oral|retirar|reversao|revisao|sedacao|sequencia|sistema|' +
    'sitio|suporte|suspender|tomografia|torniquete|transdutor|tratamento|tratar|vacina|vigilancia|' +
    'volume|videolaringo|ventilacao|aspiracao)', 'i');

  /* "Adrenalina 1:10.000 (epinefrina)" -> chave "adrenalina" */
  function baseDroga(nome) {
    var s = String(nome || '').replace(/\*/g, '').replace(/\([^)]*\)/g, ' ');
    s = s.split(/\s+[—–-]\s+/)[0];
    s = s.replace(/\b\d[\d.,:/%]*\s*(mg|g|mcg|ui|u|ml|%)?\b/gi, ' ');
    /* o que sobra de "10 mg/2 mL", "500 mg/mL", "50%": barra e unidade órfãs */
    s = s.replace(/\/\s*(ml|l|h|kg|min|dl|dia|dose|semana)\b/gi, ' ');
    s = s.replace(/(^|\s)[\/%:]+(?=\s|$)/g, ' ');
    s = s.replace(/\b(ampola|frasco|comprimido|solu[cç][aã]o|hipert[oô]nica|a\s*\d+%)\b/gi, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    /* "Adrenalina em infusão", "Adrenalina IM", "Adrenalina nebulizada"
       são a MESMA droga: o qualificador vira forma de uso, não verbete */
    var qual = new RegExp('[\\s,]+(dilu[ií]d[ao]s?|em infus[aã]o|infus[aã]o|cont[ií]nu[ao]|' +
      'nebulizad[ao]|inalat[oó]ri[ao]|aeross?ol|spray|t[oó]pic[ao]|' +
      'im|ev|iv|vo|sc|io|sl|ir|in|endovenos[ao]|intramuscular|subcut[aâ]ne[ao]|' +
      'lent[ao]|r[aá]pid[ao]|em bolus|bolus|de ataque|ataque|manuten[cç][aã]o|' +
      'de resgate|resgate|profil[aá]tic[ao]|dobro|puro|gotas|para nebuliza[cç][aã]o|' +
      'pedi[aá]tric[ao]|em dose (analg[eé]sica|alta|baixa)|intranasal|oral|intra[oó]ssea|' +
      'sem vasoconstritor|com vasoconstritor|cristalina|para o balonete)$', 'i');
    /* conector que sobra quando o número some ("Cefalexina 500 mg a 1 g" → "Cefalexina a") */
    var solto = /[\s,]+(a|ou|e|de|em|com|por)$/i;
    for (var k = 0; k < 6; k++) {
      var antes = s;
      s = s.replace(qual, '').replace(solto, '').trim();
      if (s === antes) break;
    }
    return s;
  }
  function slugDroga(nome) {
    var s = normaliza(baseDroga(nome)).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return ALIAS_DROGA[s] || s;
  }
  /* serve de verbete? precisa parecer nome de droga */
  function ehDroga(nome) {
    var b = baseDroga(nome);
    if (b.length < 4) return false;
    if (b.indexOf('/') !== -1 || b.indexOf('%') !== -1) return false;
    if (!/^[A-ZÁÂÃÀÉÊÍÓÔÕÚÇ]/.test(b)) return false;
    if (b.split(/\s+/).length > 5) return false;
    if (b.indexOf(',') !== -1) return false;
    if (/\s+(e|ou|\+|com)\s+/i.test(b)) return false;
    return !RE_NAO_DROGA.test(normaliza(b));
  }
  /* separa da observação o que é preparo/diluição do que é cuidado */
  var RE_PREPARO = /(dilu|bic|bomba|seringa|ampola|frasco|mcg\/m|mg\/m|ml\/h|correr|infund|flush|soro|\bsf\b|\bsg\b|sg\s*\d|sf\s*0|\d+\s*ml|bolus lento|em\s*\d+\s*min)/i;
  function fatiaObs(obs) {
    var partes = String(obs || '').split(/(?<=\.)\s+|\s*;\s*/).map(function (x) {
      return x.replace(/\s+/g, ' ').trim();
    }).filter(Boolean);
    var prep = [], cuid = [];
    partes.forEach(function (x) { (RE_PREPARO.test(x) ? prep : cuid).push(x); });
    return { preparo: prep, cuidado: cuid };
  }

  function indiceDrogas() {
    if (cacheDrogas) return cacheDrogas;
    var mapa = {};
    PROTOCOLOS.forEach(function (p) {
      dosesDe(p).forEach(function (sec) {
        (sec.itens || []).forEach(function (i) {
          if (!i || !i.droga || !i.dose) return;
          if (!/\d|ampola|comprimido|gota|jato|frasco|sach[eê]|envelope|c[aá]psula|unidade/i.test(i.dose)) return;
          if (!ehDroga(i.droga)) return;
          var slug = slugDroga(i.droga);
          if (!slug) return;
          var d = mapa[slug] || (mapa[slug] = {
            slug: slug, nome: baseDroga(i.droga), usos: [], vias: {}, apres: {}, sin: {}
          });
          /* entre grafias, vence o nome escrito por extenso */
          var nb = baseDroga(i.droga);
          if (nb.length > d.nome.length) { d.sin[d.nome] = 1; d.nome = nb; }
          else if (nb !== d.nome) d.sin[nb] = 1;
          var f = fatiaObs(i.obs);
          var gen = /^(medicac|medicament|doses|drogas|posologia|prescric)/
            .test(normaliza(sec.titulo || ''));
          d.usos.push({
            conduta: p, situacao: p.titulo,
            detalhe: (!gen && sec.titulo) ? sec.titulo : '',
            rotulo: String(i.droga).replace(/\*/g, ''),
            dose: i.dose, via: i.via || '', preparo: f.preparo, cuidado: f.cuidado
          });
          if (i.via) d.vias[i.via] = 1;
          var ap = String(i.droga).replace(/\*/g, '').replace(baseDroga(i.droga), '').trim();
          if (ap) d.apres[ap] = 1;
        });
      });
    });
    /* o bulário curado entra por cima: nome oficial, apresentações, diluição,
       indicações e ajuste renal; o que veio das condutas fica como "nas condutas" */
    (typeof FERR_BULARIO !== 'undefined' ? FERR_BULARIO : []).forEach(function (b) {
      var k = ALIAS_DROGA[b.slug] || b.slug;
      var d = mapa[k] || (mapa[k] = { slug:k, nome:b.nome, usos:[], vias:{}, apres:{}, sin:{} });
      if (d.nome !== b.nome) { d.sin[d.nome] = 1; d.nome = b.nome; }
      d.bul = b;
      (b.ind || []).forEach(function (u) { if (u.via) d.vias[u.via] = 1; });
    });
    cacheDrogas = Object.keys(mapa).map(function (k) { return mapa[k]; })
      .filter(function (d) { return d.nome.length > 2; })
      .sort(function (a, b) { return normaliza(a.nome) < normaliza(b.nome) ? -1 : 1; });
    return cacheDrogas;
  }
  /* a via vinha como texto livre ("VO ou SNG", "EV / INAL"): quebra em
     siglas, tira repetição e devolve no máximo duas */
  var VIAS_OK = ['EV','IM','VO','SC','IO','SL','IN','IR','ID','SNG','INAL','TÓPICO','NEB','RETAL','INTRAÓSSEA','INFILTRAÇÃO','INTRALUMINAL'];
  function viasLimpas(mapa) {
    var vistas = {}, out = [];
    Object.keys(mapa).forEach(function (v) {
      String(v).toUpperCase().split(/[^A-ZÁÉÍÓÚÂÊÔÃÕÇ]+/).forEach(function (t) {
        if (!t || t === 'OU' || t === 'E') return;
        if (VIAS_OK.indexOf(t) === -1) return;
        if (vistas[t]) return;
        vistas[t] = 1; out.push(t);
      });
    });
    return out.slice(0, 2);
  }
  function acharDroga(slug) {
    var l = indiceDrogas();
    for (var i = 0; i < l.length; i++) if (l[i].slug === slug) return l[i];
    return null;
  }

  /* o bloco curado do bulário: classe, apresentação, diluição, indicações, renal, cuidados */
  function verbeteBulario(b) {
    var h = '<div class="bul">';
    h += '<p class="bul-classe">' + esc(b.classe) + '</p>';
    if ((b.apres || []).length) h += '<div class="bul-bloco"><b>Apresentação</b><ul>' + b.apres.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>';
    if (b.dil) h += '<div class="bul-bloco bul-dil"><b>Diluição de bancada</b><p>' + rico(b.dil) + '</p></div>';
    if ((b.ind || []).length) {
      h += '<div class="bul-bloco"><b>Indicações e doses</b><div class="bul-ind">' + b.ind.map(function (u) {
        return '<article class="bul-uso">' +
          '<div class="bul-sit">' + esc(u.sit) + '</div>' +
          '<div class="bul-dose"><span class="bul-valor">' + rico(u.dose) + '</span>' + (u.via ? '<span class="dgu-via">' + esc(u.via) + '</span>' : '') + '</div>' +
          (u.prep ? '<p class="bul-prep">' + rico(u.prep) + '</p>' : '') +
          (u.obs ? '<p class="bul-obs">' + rico(u.obs) + '</p>' : '') +
        '</article>';
      }).join('') + '</div></div>';
    }
    var aj = [];
    if (b.renal) aj.push('<li><b>Função renal:</b> ' + rico(b.renal) + '</li>');
    if (b.hep) aj.push('<li><b>Fígado:</b> ' + rico(b.hep) + '</li>');
    if (b.gest) aj.push('<li><b>Gestação:</b> ' + rico(b.gest) + '</li>');
    if (b.max) aj.push('<li><b>Dose máxima:</b> ' + rico(b.max) + '</li>');
    if (aj.length) h += '<div class="bul-bloco bul-ajuste"><b>Ajustes</b><ul>' + aj.join('') + '</ul></div>';
    if (b.contra) h += '<div class="bul-bloco bul-contra"><b>Contraindicações</b><p>' + rico(b.contra) + '</p></div>';
    if ((b.cuidado || []).length) h += '<div class="bul-bloco bul-cuidado"><b>Conferir antes e vigiar</b><ul>' + b.cuidado.map(function (c) { return '<li>' + rico(c) + '</li>'; }).join('') + '</ul></div>';
    return h + '</div>';
  }

  /* o verbete: uma droga, um uso por situação, preparo e cuidados */
  /* ---------- DROGA: seletor de situação ----------
     Uma pergunta por vez: "pra quê?" → a dose aparece grande, com via e
     preparo. Bancada (apresentação + diluição) numa faixa só. O que
     conferir fica em abas curtas, com a contraindicação sempre visível. */
  var dgSel = 0, dgAba = null, dgSlug = null;
  function renderDroga(slug) {
    var d = acharDroga(slug);
    if (!d) { renderDosesNovo(); return; }
    if (dgSlug !== slug) { dgSlug = slug; dgSel = 0; dgAba = null; }
    var b = d.bul || {};
    var vias = viasLimpas(d.vias), sin = Object.keys(d.sin);
    var apres = (b.apres || []).length ? b.apres : Object.keys(d.apres);
    var sits = (b.ind || []).map(function (u) {
      return { nome:u.sit, via:u.via, dose:u.dose, prep:u.prep ? [u.prep] : [], obs:u.obs, cuid:[], fonte:'bul' };
    }).concat(d.usos.map(function (u) {
      return { nome:u.situacao, sub:[u.detalhe, u.rotulo !== d.nome ? u.rotulo : ''].filter(Boolean).join(' · '), via:u.via, dose:u.dose,
        prep:u.preparo, obs:'', cuid:u.cuidado, fonte:'guia', href:hrefConduta(u.conduta) };
    }));
    if (dgSel >= sits.length) dgSel = 0;
    var s = sits[dgSel];
    var nB = (b.ind || []).length;

    var abas = [];
    if ((b.cuidado || []).length) abas.push({ id:'cuid', rot:'Vigiar', n:b.cuidado.length, html:'<ul>' + b.cuidado.map(function (x) { return '<li>' + rico(x) + '</li>'; }).join('') + '</ul>' });
    var aj = [['Dose máxima', b.max], ['Rim', b.renal], ['Fígado', b.hep], ['Gestação', b.gest]].filter(function (x) { return x[1]; });
    if (aj.length) abas.push({ id:'aj', rot:'Ajustes', n:aj.length, html:'<dl>' + aj.map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + rico(x[1]) + '</dd></div>'; }).join('') + '</dl>' });
    if (!dgAba && abas.length) dgAba = abas[0].id;

    var html = '<section class="tz sv9 dg4 pg-azul">' +
      '<header class="sv9-barra dg4-barra"><div class="sv9-b1">' +
        '<a class="sv9-volta" href="#doses" data-dg-volta aria-label="Voltar">' + ICO('setaEsq') + '</a>' +
        '<div class="dg4-tit"><h1>' + esc(d.nome) + '</h1><p>' + esc(b.classe || '') + (sin.length ? (b.classe ? ' · ' : '') + sin.map(esc).join(' · ') : '') + '</p></div>' +
        '<div class="dg4-vias">' + vias.map(function (v) { return '<i>' + esc(v) + '</i>'; }).join('') + '</div>' +
        '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
      '</div></header>';

    if (b.contra) html += '<p class="dg4-contra">' + ICO('alerta') + '<b>Não usar</b><span>' + rico(b.contra) + '</span></p>';

    html += '<div class="dg4-palco">' +
      '<nav class="dg4-sits" aria-label="Situações">' +
        '<p class="dg4-k">Pra quê? <i>' + sits.length + '</i></p>' +
        sits.map(function (x, n) {
          return (n === nB && nB ? '<p class="dg4-k sep">Nas condutas do guia</p>' : '') +
            '<button type="button" data-dg-sel="' + n + '" class="' + (n === dgSel ? 'on' : '') + '"><b>' + esc(x.nome) + '</b>' +
            (x.via ? '<i>' + esc(x.via) + '</i>' : '') + '</button>';
        }).join('') + '</nav>' +
      (s ? '<article class="dg4-dose">' +
        '<header><span>' + esc(s.nome) + '</span>' + (s.sub ? '<em>' + esc(s.sub) + '</em>' : '') + '</header>' +
        '<p class="dg4-valor">' + rico(s.dose) + '</p>' +
        (s.via ? '<p class="dg4-via">' + ICO('seringa') + esc(s.via) + '</p>' : '') +
        (s.prep.length ? '<div class="dg4-bl prep"><b>Como fazer</b><ul>' + s.prep.map(function (x) { return '<li>' + rico(x) + '</li>'; }).join('') + '</ul></div>' : '') +
        (s.cuid.length ? '<div class="dg4-bl cuid"><b>Atenção</b><ul>' + s.cuid.map(function (x) { return '<li>' + rico(x) + '</li>'; }).join('') + '</ul></div>' : '') +
        (s.obs ? '<p class="dg4-obs">' + rico(s.obs) + '</p>' : '') +
        (s.href ? '<a class="dg4-abre" href="' + esc(s.href) + '">Abrir a conduta' + ICO('setaDir') + '</a>' : '') +
      '</article>' : '<article class="dg4-dose"><p class="dg4-obs">Sem dose cadastrada.</p></article>') +
    '</div>';

    if (apres.length || b.dil) html += '<section class="dg4-banc">' +
      (apres.length ? '<div><span class="dg4-k">Vem assim</span><p>' + apres.map(esc).join(' <i>·</i> ') + '</p></div>' : '') +
      (b.dil ? '<div><span class="dg4-k">Diluir</span><p>' + rico(b.dil) + '</p></div>' : '') + '</section>';

    if (abas.length) {
      var at = abas.filter(function (x) { return x.id === dgAba; })[0] || abas[0];
      html += '<section class="dg4-conf"><nav>' + abas.map(function (x) {
        return '<button type="button" data-dg-aba="' + x.id + '" class="' + (x === at ? 'on' : '') + '">' + x.rot + '<i>' + x.n + '</i></button>'; }).join('') +
        '</nav><div class="dg4-conf-c">' + at.html + '</div></section>';
    }
    html += '<p class="dg4-fonte">Conferir peso, alergia e função renal antes de administrar.</p>';
    doc.innerHTML = html + '</section>';
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-dg-sel]');
    if (t) { dgSel = +t.dataset.dgSel; renderDroga(dgSlug); if (window.innerWidth < 900) { var p = doc.querySelector('.dg4-dose'); if (p) window.scrollTo({ top:p.getBoundingClientRect().top + window.scrollY - 12, behavior:'smooth' }); } return; }
    t = e.target.closest('[data-dg-aba]');
    if (t) { dgAba = t.dataset.dgAba; renderDroga(dgSlug); }
  });



  /* a capa: uma grande área por cartão; dentro, as tabelas do grupo */
  function renderDoses() {
    var g = dosesGrupo && grupoDoses(dosesGrupo);
    if (!g) { renderDosesCapa(); return; }

    var html = '<section class="phase">' +
      '<a class="voltar" href="#doses">' + ICO('setaEsq') + ' Doses de emergência</a>' +
      '<div class="solo-head"><span class="atb-emoji">' + ICO(g.icone) + '</span><h2>' + esc(g.nome) + '</h2></div>';
    var linhas = '';
    g.ids.forEach(function (id) {
      var p = acharConduta(id);
      if (!p) return;
      var blocos = dosesDe(p);
      if (!blocos.length) return;
      linhas += '<div class="dz-quadro">' +
        '<a class="dz-titulo" href="#' + esc(p.categoria) + '/' + esc(p.id) + '">' +
          esc(p.titulo) + ICO('setaDir') + '</a>' +
        blocos.map(function (sec) {
          return (sec.titulo ? '<h4 class="dz-sub">' + esc(sec.titulo) + '</h4>' : '') +
            '<table class="dz-tab">' +
            '<thead><tr><th>Droga</th><th>Dose</th><th>Via</th><th>Conferir</th></tr></thead>' +
            '<tbody>' + (sec.itens || []).map(function (i) {
            return '<tr><th>' + rico(i.droga) + '</th>' +
              '<td class="dz-dose">' + rico(i.dose) + '</td>' +
              '<td class="dz-via">' + esc(i.via || '') + '</td>' +
              '<td class="dz-obs">' + rico(i.obs || '') + '</td></tr>';
          }).join('') + '</tbody></table>';
        }).join('') +
      '</div>';
    });
    html += linhas || '<div class="pendente">Nenhuma conduta deste grupo tem bloco de doses ainda.</div>';
    html += '<p class="fonte-linha">' + ICO('alerta') +
      ' Conferir a dose na conduta de origem antes de administrar.</p>';
    doc.innerHTML = html + '</section>';
  }

  function renderDosesCapa() {
    var drogas = indiceDrogas();
    var porLetra = {};
    drogas.forEach(function (d) {
      var L = normaliza(d.nome).charAt(0).toUpperCase();
      (porLetra[L] = porLetra[L] || []).push(d);
    });
    var letras = Object.keys(porLetra).sort();

    var html = '<section class="phase doses2">' +
      '<div class="phase-head area-head"><h2>Doses de emergência</h2>' +
        '<span class="phase-conta">' + drogas.length + ' drogas</span></div>';

    /* situação primeiro: é assim que se procura dose com o paciente na maca */
    html += '<div class="dz-sec"><h3>Por situação</h3><div class="qx-grade dz-grade">' +
      DOSES_GRUPOS.map(function (g) {
        var n = contaGrupoDoses(g);
        return n ? '<a class="qx-card dz" href="#doses/' + esc(g.id) + '">' +
          '<span class="qx-i">' + ICO(g.icone || 'seringa') + '</span>' +
          '<span class="qx-t"><b>' + esc(g.nome) + '</b><i>' + n + ' drogas</i></span>' +
          '<span class="qx-s">' + ICO('setaDir') + '</span></a>' : '';
      }).join('') + '</div></div>';

    html += '<div class="dz-sec"><h3>Bulário A–Z</h3>' +
      '<div class="dg-barra">' +
        '<label class="dg-filtro">' + ICO('lupa') +
          '<input type="search" id="dgFiltro" autocomplete="off" placeholder="Filtrar por nome da droga">' +
        '</label>' +
        '<nav class="dg-az">' + letras.map(function (L) {
          return '<a href="#" data-ir-letra="' + L + '">' + L + '</a>';
        }).join('') + '</nav>' +
      '</div>';

    html += '<div class="dg-index">' + letras.map(function (L) {
      return '<section class="dg-letra" data-letra="' + L + '">' +
        '<h3>' + L + '<span>' + porLetra[L].length + '</span></h3>' +
        '<div class="dg-col">' + porLetra[L].map(function (d) {
          var n = d.usos.length + (d.bul ? (d.bul.ind || []).length : 0);
          return '<a class="dg-item" href="#droga/' + esc(d.slug) + '"' +
            ' data-nome="' + esc(normaliza(d.nome)) + '">' +
            '<span class="dg-nome">' + esc(d.nome) + '</span>' +
            (n > 1 ? '<span class="dg-usos-n">' + n + ' usos</span>' : '') +
            '<span class="dg-seta">' + ICO('setaDir') + '</span></a>';
        }).join('') + '</div></section>';
    }).join('') + '</div></div></section>';

    doc.innerHTML = html;
  }

  doc.addEventListener('input', function (e) {
    if (!e.target.matches('#dgFiltro')) return;
    var t = normaliza(e.target.value.trim());
    doc.querySelectorAll('.dg-item[data-nome]').forEach(function (el) {
      el.hidden = !!t && el.getAttribute('data-nome').indexOf(t) === -1;
    });
    doc.querySelectorAll('.dg-letra').forEach(function (s) {
      s.hidden = !s.querySelector('.dg-item:not([hidden])');
    });
  });

  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ir-letra]');
    if (!a) return;
    e.preventDefault();
    var alvo = doc.querySelector('[data-letra="' + a.getAttribute('data-ir-letra') + '"]');
    if (!alvo) return;
    doc.querySelectorAll('.dg-az a').forEach(function (x) { x.classList.remove('on'); });
    a.classList.add('on');
    window.scrollTo({ top: alvo.getBoundingClientRect().top + window.pageYOffset - 104, behavior:'smooth' });
  });

  /* ---------- busca unificada: condutas + tudo das Ferramentas ---------- */
  var buscaTolerou = false;

  var ROTULO_TIPO = {
    droga:'Drogas e doses',
    queixa:'Queixas',
    conduta:'Condutas', quadro:'Prescrições por quadro', antibiotico:'Antibióticos',
    score:'Scores', calculadora:'Calculadoras', medicacao:'Medicações',
    texto:'Textos prontos', manobra:'Manobras e sinais'
  };
  var ORDEM_TIPO = ['droga','queixa','conduta','quadro','antibiotico','score','calculadora','medicacao','texto','manobra'];

  function buscaFerramentas(termos) {
    if (!temFerramentas()) return [];
    var ix = Ferramentas.indice();
    function f(tol) {
      return ix.filter(function (o) {
        return termos.every(function (t) {
          return tol ? casaTolerante(o.norm, t) : o.norm.indexOf(t) !== -1;
        });
      });
    }
    var r = f(false);
    return (!r.length && buscaTolerou) ? f(true) : r;
  }

  function itemBusca(o) {
    var href = o.href + (o.abre ? '' : '');
    return '<a class="res-item" href="' + esc(href) + '"' +
      (o.abre ? ' data-abre="' + esc(o.tipo) + ':' + esc(o.abre) + '"' : '') + '>' +
      '<span class="res-nome">' + esc(o.titulo) + '</span>' +
      (o.sub ? '<span class="res-sub">' + esc(o.sub) + '</span>' : '') +
      '<span class="res-seta">' + ICO('setaDir') + '</span>' +
    '</a>';
  }

  function renderBusca(condutas) {
    var ferr = buscaFerramentas(ultimosTermos);
    var qxs  = buscaQueixas(ultimosTermos);
    var drg  = buscaDrogas(ultimosTermos);
    var total = condutas.length + ferr.length + qxs.length + drg.length;

    if (window.UI && UI.anuncia) {
      UI.anuncia(total + (total === 1 ? ' resultado' : ' resultados') +
        ' para ' + termoBusca + (buscaTolerou ? ', busca aproximada' : ''));
    }
    var ESC2 = [{ id:'tudo', rot:'Tudo' }, { id:'conduta', rot:'Condutas' }, { id:'droga', rot:'Drogas e doses' }, { id:'queixa', rot:'Queixas' }, { id:'quadro', rot:'Receitas' }, { id:'score', rot:'Escores' }];
    if (!ESC2.some(function (e) { return e.id === escopoBusca; })) escopoBusca = 'tudo';
    var grupos = { droga: drg.map(function (d) {
      var vias = Object.keys(d.vias).slice(0, 3);
      return { tipo:'droga', titulo: d.nome,
               sub: (vias.length ? vias.join(' · ') + ' · ' : '') +
                    d.usos.length + (d.usos.length === 1 ? ' uso' : ' usos'),
               dose: d.usos[0] && d.usos[0].dose,
               href: '#droga/' + d.slug };
    }), queixa: qxs.map(function (q) {
      return { tipo:'queixa', titulo: q.nome, sub: q.sub, href: '#queixa/' + q.id };
    }), conduta: condutas.map(function (p) {
      return { tipo:'conduta', titulo:p.titulo, sub:area(p.categoria).nome,
               href:'#' + p.categoria + '/' + p.id, achou:trecho(p, ultimosTermos),
               vazia:!preenchida(p) };
    }) };
    ferr.forEach(function (o) { (grupos[o.tipo] = grupos[o.tipo] || []).push(o); });

    var cont = {}; ORDEM_TIPO.forEach(function (t) { cont[t] = (grupos[t] || []).length; });
    var html = '<section class="tz sv9 bz pg-azul">' +
      '<header class="sv9-barra bz-barra">' +
        '<div class="sv9-b1">' +
          '<a class="sv9-volta" href="#" data-bz-limpa aria-label="Voltar">' + ICO('setaEsq') + '</a>' +
          '<label class="bz-campo">' + ICO('lupa') +
            '<input type="search" id="heroBusca" autocomplete="off" value="' + esc(termoBusca) + '" placeholder="Buscar conduta, droga, dose ou receita" aria-label="Buscar em todo o guia">' +
            '<button type="button" class="bz-x" data-bz-limpa aria-label="Limpar">' + ICO('fechar') + '</button></label>' +
          '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
        '</div>' +
        '<nav class="bz-abas">' + ESC2.map(function (e) {
          var n = e.id === 'tudo' ? total : (cont[e.id] || 0);
          if (e.id !== 'tudo' && !n) return '';
          return '<button type="button" data-escopo="' + e.id + '" class="' + (escopoBusca === e.id ? 'on' : '') + '">' + esc(e.rot) + '<i>' + n + '</i></button>';
        }).join('') + '</nav>' +
        '<p class="bz-info"><b>' + total + '</b> ' + (total === 1 ? 'resultado' : 'resultados') + ' para “' + esc(termoBusca) + '”' +
          (buscaTolerou && total ? ' · <i>busca aproximada</i>' : '') + '</p>' +
      '</header>';
    if (!total) {
      var so = escopoBusca === 'tudo' ? respostaPrincipal(intencaoBusca()) : '';
      if (so) html = html.replace(/<p class="bz-info">[\s\S]*?<\/p>/, '<p class="bz-info">Resposta direta para “' + esc(termoBusca) + '”</p>');
      doc.innerHTML = html + (so || '<div class="bz-nada"><b>Nada encontrado.</b><span>Tente o nome da droga, o sintoma ou o nome do quadro.</span></div>') + '</section>';
      return;
    }
    var COR = { droga:'azul', queixa:'amarelo', conduta:'escuro', quadro:'verde', score:'roxo', calculadora:'roxo' };
    var recolhe = false;
    if (escopoBusca === 'tudo') {
      var it = intencaoBusca();
      var resp = respostaPrincipal(it);
      if (resp) {
        html += resp;
        /* não repetir na lista o que já está em destaque */
        if (it.droga) grupos.droga = (grupos.droga || []).filter(function (o) { return o.href !== '#droga/' + it.droga.slug; });
        var destaque = it.tox.map(function (p) { return p.id; });
        grupos.conduta = (grupos.conduta || []).filter(function (o) { return destaque.indexOf(String(o.href).split('/').pop()) === -1; });
        var nSobra = ORDEM_TIPO.reduce(function (t, k) { return t + (grupos[k] || []).length; }, 0);
        recolhe = nSobra > 0;
        if (recolhe) html += '<details class="bzr-outros"><summary>Outros resultados <span>' + nSobra + '</span></summary>';
      }
    }
    /* drogas: o nome que começa pelo termo antes das que só o citam */
    if (grupos.droga && grupos.droga.length > 1) {
      var q1 = normaliza(termoBusca).trim();
      grupos.droga.sort(function (a, b) {
        var pa = normaliza(a.titulo).indexOf(q1) === 0 ? 0 : normaliza(a.titulo).indexOf(q1) !== -1 ? 1 : 2;
        var pb = normaliza(b.titulo).indexOf(q1) === 0 ? 0 : normaliza(b.titulo).indexOf(q1) !== -1 ? 1 : 2;
        return pa - pb;
      });
    }
    html += '<div class="bz-grupos">';
    ORDEM_TIPO.forEach(function (t) {
      var l = grupos[t];
      if (!l || !l.length) return;
      if (escopoBusca !== 'tudo' && t !== escopoBusca) return;
      var lim = escopoBusca === 'tudo' ? 8 : 60;
      html += '<section class="bz-g c-' + (COR[t] || 'cinza') + '"><header><h2>' + esc(ROTULO_TIPO[t] === 'Prescrições por quadro' ? 'Receitas prontas' : ROTULO_TIPO[t]) + '</h2><span>' + l.length + '</span>' +
        (escopoBusca === 'tudo' && l.length > lim ? '<button type="button" data-escopo="' + t + '">Ver todos' + ICO('setaDir') + '</button>' : '') + '</header><div class="bz-lista">' +
        l.slice(0, lim).map(function (o) {
          var p = t === 'conduta' ? acharConduta(String(o.href).split('/').pop()) : null;
          var grav = p ? (p.gravidade || 'rotina') : '';
          return '<a class="bz-it' + (grav ? ' g-' + grav : '') + '" href="' + esc(o.href || '#') + '"' + (o.abre ? ' data-abre="' + esc(o.abre) + '"' : '') + '>' +
            '<i class="bz-dot"></i><span class="bz-t"><b>' + esc(o.titulo || o.nome || '') + (o.vazia ? ' <em class="bz-vz">a preencher</em>' : '') + '</b>' +
            (o.sub ? '<small>' + esc(o.sub) + '</small>' : '') +
            (o.achou ? '<small class="bz-achou">' + esc(o.achou) + '</small>' : '') + '</span>' +
            (o.dose ? '<span class="bz-dose">' + rico(o.dose) + '</span>' : '') + ICO('setaDir') + '</a>';
        }).join('') + '</div></section>';
    });
    doc.innerHTML = html + '</div>' + (recolhe ? '</details>' : '') + '</section>';
  }

  /* ---------- tela inicial ----------
     Saudação com o nome do médico, busca, as funcionalidades do guia
     em cartões (com contagem viva), queixas, o que ele estava vendo e
     as áreas. Nada escondido em acordeão. */
  function nomeMedico() {
    var n = ler('pref:nome', '');
    return typeof n === 'string' ? n.trim() : '';
  }
  /* sol de dia, lua à noite — só um sinal, sem enfeite */
  function periodo() {
    var h = new Date().getHours();
    return (h < 6 || h >= 18) ? 'noite' : 'dia';
  }
  function saudacao() {
    var h = new Date().getHours();
    return h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  }
  function dataHoje() {
    var d = new Date();
    var dias = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
    var meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    var t = dias[d.getDay()] + ', ' + d.getDate() + ' de ' + meses[d.getMonth()];
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function contaCalc(tipo) {
    if (typeof FERR_CALC === 'undefined') return 0;
    return FERR_CALC.filter(function (c) { return c.tipo === tipo; }).length;
  }
  /* os dados são const de escopo global, não propriedades de window */
  function tam(lista) { return typeof lista !== 'undefined' && lista ? lista.length : 0; }

  /* um cartão só para tudo na home: azulejo colorido + nome. O resto
     vai no title, para não poluir. */
  var PALETA = ['c-blue','c-fire','c-purple','c-orange','c-green','c-teal','c-pink','c-indigo','c-amber','c-cyan','c-slate'];
  function tile(href, icone, nome, cor, dica, sub) {
    return '<a class="tile' + (cor ? ' ' + esc(cor) : '') + '" href="' + esc(href) + '"' +
      (dica ? ' title="' + esc(dica) + '"' : '') + '>' +
      '<span class="tile-ico">' + ICO(icone) + '</span>' +
      '<span class="tile-txt"><span class="tile-nome">' + esc(nome) + '</span>' +
        (sub ? '<span class="tile-sub">' + esc(sub) + '</span>' : '') + '</span></a>';
  }

  /* ---------- home: saudação + busca, urgência, áreas e queixas ---------- */
  var HUB_SEC = {
    presc:       { tag:'Prescrição',  desc:'Por quadro clínico, da chegada à alta — oral, IM e EV.' },
    eletrolitos: { tag:'Diluição',    desc:'Sódio, potássio, cálcio e magnésio com a conta feita.' },
    pediatria:   { tag:'Criança',     desc:'Doses por peso, hidratação e condutas pediátricas.' },
    calc:        { tag:'Cálculo',     desc:'Peso ideal, clearance, gotejamento e as demais contas do plantão.' },
    scores:      { tag:'Escore',      desc:'Escores com o resultado interpretado, pronto para o prontuário.' },
    prontuario:  { tag:'Registro',    desc:'Modelos de anamnese, conduta, evasão, atestado e laudo para copiar.' }
  };
  function hubCard(href, icone, tag, titulo, desc, meta, cls) {
    return '<a class="hub-card' + (cls ? ' ' + cls : '') + '" href="' + esc(href) + '">' +
      '<div class="hub-top"><span class="hub-ico">' + ICO(icone) + '</span>' +
        '<span class="hub-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></span></div>' +
      '<span class="hub-tag">' + esc(tag) + '</span>' +
      '<h2>' + esc(titulo) + '</h2>' +
      '<p>' + esc(desc) + '</p>' +
      (meta ? '<div class="hub-foot">' + ICO('check') + '<span>' + esc(meta) + '</span></div>' : '') +
    '</a>';
  }
  /* ---------- home ----------
     Saudação + busca; abaixo, a sala vermelha em destaque e o resto
     em cartões: entradas principais, áreas do guia e ferramentas. */
  function cartaoEntrada(href, icone, nome, meta, cls) {
    return '<a class="ce' + (cls ? ' ' + cls : '') + '" href="' + esc(href) + '">' +
      '<span class="ce-i">' + ICO(icone) + '</span>' +
      '<span class="ce-t"><b>' + esc(nome) + '</b>' +
      (meta ? '<i>' + esc(meta) + '</i>' : '') + '</span>' +
      '<span class="ce-s">' + ICO('setaDir') + '</span></a>';
  }
  function azulejo(href, icone, nome, conta) {
    return '<a class="az" href="' + esc(href) + '">' +
      '<span class="az-i">' + ICO(icone) + '</span>' +
      '<span class="az-n">' + esc(nome) + '</span>' +
      (conta || conta === 0 ? '<span class="az-c">' + conta + '</span>' : '') + '</a>';
  }

  /* uma conduta sozinha na pagina */
  /* ---------- CONDUTA: painel de atendimento ----------
     Barra fixa (voltar, título, prioridade, atalhos das seções) →
     "Fazer agora" em passos grandes → fluxograma à esquerda com as doses,
     red flags e o que não fazer sempre ao lado → o resto em cartões.
     Conteúdo intacto: cada cartão reaproveita o bloco() de sempre. */
  var CD_ICO = { fluxo:'setaBai', alerta:'alerta', passos:'perigo', doses:'seringa', tempo:'relogio', ordem:'setaDir',
    lista:'livro', naofazer:'fechar', texto:'livro', dica:'estrela', prescricao:'copiar' };
  var CD_TOM = { alerta:'vermelho', naofazer:'escuro', dica:'amarelo', doses:'azul', prescricao:'verde', tempo:'neutro',
    ordem:'neutro', lista:'neutro', texto:'neutro', passos:'vermelho', fluxo:'neutro' };
  /* cartões secundários (dobra=true) vêm fechados no celular: só o título,
     abre com um toque. No desktop o botão não aparece e nada muda. */
  var cdAbertos = {};
  function cdCartao(sec, k, dobra) {
    var t = sec.tipo;
    var tit = sec.titulo || LABEL[t] || '';
    var chave = dobra ? ((fluxoConduta && fluxoConduta.id) || '') + ':' + k : '';
    var aberto = dobra && !!cdAbertos[chave];
    return '<section class="cd-card t-' + esc(t) + ' tom-' + (CD_TOM[t] || 'neutro') + (dobra ? ' cd-dobra' + (aberto ? ' aberto' : '') : '') + '" id="cds-' + k + '"' +
        (dobra ? ' data-cd-chave="' + esc(chave) + '"' : '') + '>' +
      '<header class="cd-card-cab"><span class="cd-card-i">' + ICO(CD_ICO[t] || 'livro') + '</span>' +
        '<h3>' + esc(tit) + '</h3>' +
        (t !== 'texto' && (sec.itens || []).length ? '<span class="cd-card-n">' + sec.itens.length + '</span>' : '') +
        (dobra ? '<button type="button" class="cd-card-abre" aria-expanded="' + (aberto ? 'true' : 'false') + '" aria-controls="cds-' + k + '-c" aria-label="' + esc(tit) + '">' + ICO('setaBai') + '</button>' : '') +
      '</header>' +
      '<div class="cd-card-corpo" id="cds-' + k + '-c">' + bloco(sec) + '</div></section>';
  }
  function cdAlterna(card, abrir) {
    card.classList.toggle('aberto', abrir);
    var b = card.querySelector('.cd-card-abre');
    if (b) b.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    var ch = card.getAttribute('data-cd-chave');
    if (ch) { if (abrir) cdAbertos[ch] = 1; else delete cdAbertos[ch]; }
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('.cd-card-abre');
    if (!b) return;
    var card = b.closest('.cd-card');
    if (card) cdAlterna(card, !card.classList.contains('aberto'));
  });
  function cdAgora(sec) {
    return '<section class="cd-agora" id="cds-agora">' +
      '<header><span>' + ICO('perigo') + '</span><h2>' + esc(sec.titulo || 'Fazer agora') + '</h2><i>nesta ordem</i></header>' +
      '<ol>' + (sec.itens || []).map(function (it, n) {
        var t = typeof it === 'string' ? it : (it.o_que || it.texto || '');
        var s = String(t);
        var m = s.match(/^([^—:.]{3,72})(?:\s*[—:]\s*|\.\s+)([\s\S]+)$/) || s.match(/^(.{12,70}?)[,;]\s+([\s\S]{12,})$/);
        if (m && (m[1].split('*').length - 1) % 2) m = null;
        var acao = m ? m[1].trim() : s, det = m ? m[2].trim() : '';
        return '<li><b class="cd-ag-n">' + (n + 1) + '</b><div><strong class="cd-ag-acao">' + rico(acao) + '</strong>' +
          (det ? '<p class="cd-ag-det">' + rico(det) + '</p>' : '') + '</div></li>';
      }).join('') + '</ol></section>';
  }

  /* ---------- FLUXOGRAMA v2: fluxograma de verdade, centrado ----------
     Cada etapa é um cartão ligado ao próximo por seta; decisão vira a
     pergunta em pílula escura que se abre em caminhos lado a lado, cada um
     com a sua cor e a sua conduta. Mesmos dados de sempre. */
  function fx2Caixa(n, k) {
    var tipo = n.tipo || 'passo';
    return '<div class="fx2-no t-' + esc(tipo) + '">' +
      (tipo === 'passo' ? '<i class="fx2-n">' + k + '</i>' : '') +
      (tipo === 'inicio' ? '<i class="fx2-n ini">' + ICO('perigo') + '</i>' : '') +
      (tipo === 'alerta' ? '<i class="fx2-n al">!</i>' : '') +
      (tipo === 'fim' ? '<i class="fx2-n fim">' + ICO('check') + '</i>' : '') +
      '<div class="fx2-c">' +
        (n.rotulo ? '<span class="fx2-rot">' + esc(n.rotulo) + '</span>' : '') +
        '<b class="fx2-txt">' + rico(n.texto) + '</b>' +
        (n.nota ? '<p class="fx2-nota">' + rico(n.nota) + '</p>' : '') +
        medsHtml(n.meds) + irHtml(n.ir) +
      '</div></div>';
  }
  function fluxoV2(sec) {
    var k = 0, itens = sec.itens || [];
    var corpo = itens.map(function (n, i) {
      var seta = i ? '<i class="fx2-seta"></i>' : '';
      if (n.tipo === 'paralelo') {
        return seta + '<div class="fx2-par">' + (n.colunas || []).map(function (c) { k++; return fx2Caixa(c, k); }).join('') + '</div>';
      }
      if (n.tipo === 'decisao') {
        var ramos = n.ramos || [];
        return seta + '<div class="fx2-dec">' +
          '<div class="fx2-perg"><span>?</span>' + (n.rotulo ? '<em>' + esc(n.rotulo) + '</em>' : '') + '<b>' + rico(n.texto) + '</b></div>' +
          '<div class="fx2-ramos n' + Math.min(ramos.length, 3) + '">' + ramos.map(function (r) {
            return '<div class="fx2-ramo ' + esc(r.cor || 'neutro') + '">' +
              '<span class="fx2-se">' + rico(r.rotulo) + '</span>' +
              '<b class="fx2-entao">' + rico(r.texto) + '</b>' +
              (r.nota ? '<p class="fx2-nota">' + rico(r.nota) + '</p>' : '') +
              medsHtml(r.meds) + irHtml(r.ir) +
            '</div>';
          }).join('') + '</div></div>';
      }
      if (n.tipo !== 'inicio' && n.tipo !== 'alerta' && n.tipo !== 'fim') k++;
      return seta + fx2Caixa(n, k);
    }).join('');
    return '<div class="fx2">' +
      '<header class="fx2-cab"><span class="fx2-cab-i">' + ICO('setaBai') + '</span><h3>' + esc(sec.titulo || 'Fluxograma') + '</h3>' +
        '<span class="fx2-leg"><i class="l-ini"></i>início<i class="l-dec"></i>decisão<i class="l-al"></i>alerta<i class="l-fim"></i>desfecho</span></header>' +
      '<div class="fx2-corpo">' + corpo + '</div></div>';
  }

  /* ---------- RECEITAS PRONTAS ----------
     1 clique: "Copiar" no cartão copia e empilha no rascunho.
     2 cliques: abrir o cartão, ver a receita inteira, copiar.
     Alterna "Para casa" (receita de alta) e "Na unidade" (prescrição do PS). */
  var rxModo = ler('pref:rp-modo', 'casa');
  var rxAberta = null;
  function rxLista() {
    var todos = Ferramentas.quadrosTodos();
    var grupos = [];
    todos.forEach(function (q) {
      var g = grupos.filter(function (x) { return x.nome === q.grupo; })[0];
      if (!g) { g = { nome:q.grupo || 'Outros', itens:[] }; grupos.push(g); }
      g.itens.push(q);
    });
    return { todos:todos, grupos:grupos };
  }
  function rxTem(q, modoX) { var l = Ferramentas.linhasRx(q.id); return modoX === 'casa' ? l.receita.length : l.unidade.length; }
  function curtoMed(m) { return String(m || '').replace(/\*/g, '').split(/\s+\d/)[0].toLowerCase().replace(/(^|\s)\S/g, function (s) { return s.toUpperCase(); }); }

  window.addEventListener('hashchange', function () { if (!/^#presc\b/.test(location.hash)) window.__rxCompleto = false; });
  /* capa limpa: grupos numa coluna à esquerda, receitas em lista de uma
     linha à direita (nome + indicação curta). Copiar é um ícone na ponta. */
  var rxGrupo = ler('pref:rp-grupo', 'todas');
  function renderReceitas() {
    var L = rxLista();
    if (rxGrupo !== 'todas' && !L.grupos.some(function (g) { return g.nome === rxGrupo; })) rxGrupo = 'todas';
    var casa = rxModo === 'casa';
    var vis = rxGrupo === 'todas' ? L.grupos : L.grupos.filter(function (g) { return g.nome === rxGrupo; });
    var html = '<section class="tz sv9 rp rp2 pg-verde">' +
      '<header class="sv9-barra rp-barra">' +
        '<div class="sv9-b1">' +
          '<a class="sv9-volta" href="#" aria-label="Voltar">' + ICO('setaEsq') + '</a>' +
          '<h1>Receitas prontas</h1>' +
          '<div class="rp-modo" role="tablist" aria-label="Tipo de receita">' +
            '<button type="button" data-rp-modo="casa" class="' + (casa ? 'on' : '') + '">Para casa</button>' +
            '<button type="button" data-rp-modo="porta" class="' + (!casa ? 'on' : '') + '">Na unidade</button>' +
          '</div>' +
          '<label class="sv9-filtro">' + ICO('lupa') + '<input type="search" id="svFiltro" autocomplete="off" placeholder="Buscar receita: cólica, ITU, asma…" aria-label="Buscar receita"></label>' +
          '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
        '</div>' +
      '</header>' +
      '<div class="rp2-corpo">' +
        '<nav class="rp2-rail" aria-label="Grupos">' +
          '<button type="button" data-rp-grupo="todas" class="' + (rxGrupo === 'todas' ? 'on' : '') + '"><b>Todas</b><i>' + L.todos.filter(function (q) { return rxTem(q, rxModo); }).length + '</i></button>' +
          L.grupos.map(function (g) {
            var n = g.itens.filter(function (q) { return rxTem(q, rxModo); }).length;
            return '<button type="button" data-rp-grupo="' + esc(g.nome) + '" class="' + (rxGrupo === g.nome ? 'on' : '') + (n ? '' : ' zero') + '"><b>' + esc(g.nome) + '</b><i>' + n + '</i></button>';
          }).join('') +
        '</nav>' +
        '<div class="rp2-main">' + vis.map(function (g) {
          return '<section class="rp-grupo rp2-g">' +
            (vis.length > 1 ? '<h2 class="rp2-gt">' + esc(g.nome) + '</h2>' : '') +
            '<div class="rp2-lista">' + g.itens.filter(function (q) { return rxTem(q, rxModo); }).map(function (q) {
              var tem = true;
              return '<article class="rp-card rp2-it' + (tem ? '' : ' vazio') + '" data-busca="' + esc(normaliza(q.nome + ' ' + (q.sub || '') + ' ' + (q.tags || []).join(' '))) + '">' +
                '<button type="button" class="rp2-abre" data-rp-abrir="' + esc(q.id) + '">' +
                  '<b>' + esc(q.nome) + '</b>' +
                  '<em>' + (tem ? esc(q.sub || '') : 'sem ' + (casa ? 'receita de alta' : 'prescrição na unidade')) + '</em>' +
                '</button>' +
                (tem ? '<button type="button" class="rp2-cp" data-rp-copiar="' + esc(q.id) + '" title="Copiar e mandar ao rascunho" aria-label="Copiar ' + esc(q.nome) + '">' + ICO('copiar') + '<span>Copiar</span></button>' : '') +
              '</article>';
            }).join('') + '</div>' + (function () {
              var n = g.itens.filter(function (q) { return !rxTem(q, rxModo); }).length;
              return n ? '<button type="button" class="rp2-outro" data-rp-modo="' + (casa ? 'porta' : 'casa') + '">+ ' + n + ' só ' + (casa ? 'na unidade' : 'para casa') + '</button>' : '';
            })() + '</section>';
        }).join('') +
        '<p class="sv9-vazio" id="svVazio" hidden>Nenhuma receita com esse termo.</p>' +
        '<p class="rp-completo"><button type="button" data-rp-completo>Editar receitas, internados e antibióticos</button></p>' +
        '</div>' +
      '</div>' +
    '</section>' + (rxAberta ? rxFolha(rxAberta) : '');
    doc.innerHTML = html;
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-rp-grupo]');
    if (!t) return;
    rxGrupo = t.dataset.rpGrupo; grava('pref:rp-grupo', rxGrupo);
    var f = document.getElementById('svFiltro'); var termo = f ? f.value : '';
    renderReceitas();
    if (termo) { var f2 = document.getElementById('svFiltro'); f2.value = termo; f2.dispatchEvent(new Event('input', { bubbles:true })); }
    var m = doc.querySelector('.rp2-corpo'); if (m && m.getBoundingClientRect().top < 0) window.scrollTo({ top:m.getBoundingClientRect().top + window.scrollY - 12, behavior:'smooth' });
  });
  /* buscar sempre procura em todas */
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'svFiltro' || !doc.querySelector('.rp2') || rxGrupo === 'todas' || !e.target.value) return;
    var v = e.target.value; rxGrupo = 'todas'; renderReceitas();
    var f = document.getElementById('svFiltro'); f.value = v; f.focus(); f.dispatchEvent(new Event('input', { bubbles:true }));
  }, true);

  function rxFolha(id) {
    var q = Ferramentas.quadrosTodos().filter(function (x) { return x.id === id; })[0];
    if (!q) return '';
    var l = Ferramentas.linhasRx(id);
    var casa = rxModo === 'casa';
    var linhas = casa
      ? l.receita.map(function (x, n) { return '<li><i>' + (n + 1) + '</i><div><b>' + esc(String(x.med).replace(/\*/g, '')) + '</b><span>' + rico(x.uso || '') + '</span></div></li>'; }).join('')
      : l.unidade.map(function (x, n) { return '<li><i>' + (n + 1) + '</i><div><b>' + esc(String(x.med).replace(/\*/g, '')) + '</b><span><strong>' + esc(x.dose || '') + '</strong>' + (x.via ? ' · ' + esc(x.via) : '') + (x.obs ? ' — ' + rico(x.obs) : '') + '</span></div></li>'; }).join('');
    return '<div class="rp-veu" data-rp-fechar></div>' +
      '<aside class="rp-folha" role="dialog" aria-label="' + esc(q.nome) + '">' +
        '<header><div><span class="rp-f-k">' + esc(q.grupo || '') + '</span><h2>' + esc(q.nome) + '</h2></div>' +
          '<button type="button" class="rp-x" data-rp-fechar aria-label="Fechar">' + ICO('fechar') + '</button></header>' +
        '<div class="rp-modo mini">' +
          '<button type="button" data-rp-modo="casa" class="' + (casa ? 'on' : '') + '">Para casa</button>' +
          '<button type="button" data-rp-modo="porta" class="' + (!casa ? 'on' : '') + '">Na unidade</button></div>' +
        '<div class="rp-papel">' +
          '<p class="rp-papel-cab">' + (casa ? 'Receita · uso oral' : 'Prescrição · na unidade') + '</p>' +
          (linhas ? '<ol>' + linhas + '</ol>' : '<p class="rp-sem">Sem itens nesta parte.</p>') +
          (casa && l.orient.length ? '<div class="rp-orient"><b>Orientações</b><ul>' + l.orient.map(function (o) { return '<li>' + rico(o) + '</li>'; }).join('') + '</ul></div>' : '') +
        '</div>' +
        (q.atencao ? '<p class="rp-atencao">' + ICO('alerta') + '<span>' + rico(q.atencao) + '</span></p>' : '') +
        '<footer>' +
          (linhas ? '<button type="button" class="rp-copiar grande" data-rp-copiar="' + esc(q.id) + '">' + ICO('copiar') + '<span>Copiar ' + (casa ? 'receita' : 'prescrição') + '</span></button>' : '') +
          (q.conduta && acharConduta(q.conduta) ? '<a class="rp-cond" href="' + esc(hrefConduta(acharConduta(q.conduta))) + '">Ver a conduta' + ICO('setaDir') + '</a>' : '') +
        '</footer>' +
      '</aside>';
  }

  doc.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-rp-copiar]'))) {
      var q = Ferramentas.quadrosTodos().filter(function (x) { return x.id === t.dataset.rpCopiar; })[0];
      Ferramentas.copiarRx(Ferramentas.textoRx(t.dataset.rpCopiar, rxModo), q ? q.nome : 'Receita');
      t.classList.add('ok'); var s = t.querySelector('span'); if (s) s.textContent = 'Copiado';
      setTimeout(function () { t.classList.remove('ok'); if (s) s.textContent = t.classList.contains('grande') ? 'Copiar de novo' : 'Copiar'; }, 1600);
      return;
    }
    if ((t = e.target.closest('[data-rp-modo]'))) { rxModo = t.dataset.rpModo; grava('pref:rp-modo', rxModo); renderReceitas(); return; }
    if ((t = e.target.closest('[data-rp-abrir]'))) { rxAberta = t.dataset.rpAbrir; renderReceitas(); return; }
    if (e.target.closest('[data-rp-fechar]')) { rxAberta = null; renderReceitas(); return; }
    if (e.target.closest('[data-rp-completo]')) { window.__rxCompleto = true; render(); return; }
  });
  /* receita escolhida na home já abre conferida na folha */
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-abre^="quadro:"]');
    if (t) { rxAberta = t.dataset.abre.slice(7); window.__rxCompleto = false; }
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rxAberta) { rxAberta = null; if (doc.querySelector('.rp')) renderReceitas(); }
  });

  /* ---------- DOSES: console único, adulto e pediatria ----------
     Paciente no topo (adulto/criança, peso, idade) → à esquerda as
     situações, à direita as drogas daquela situação em cartões com a dose
     grande. Na pediatria a dose já sai calculada em mg e mL para o peso. */
  var dzModo = ler('pref:dz-modo', 'adulto');
  function pesoAtual() { var e = document.getElementById('peso'); var n = e ? parseFloat(String(e.value).replace(',', '.')) : NaN; return isFinite(n) && n > 0 ? n : null; }
  function br(n) { return String(n).replace('.', ','); }

  function renderDosesNovo() {
    var ped = dzModo === 'ped' && Ferramentas.ped;
    var kg = pesoAtual();
    var idade = ped ? Ferramentas.ped.idade() : null;
    var html = '<section class="tz sv9 dz2 pg-azul">' +
      '<header class="sv9-barra dz2-barra">' +
        '<div class="sv9-b1">' +
          '<a class="sv9-volta" href="#" aria-label="Voltar">' + ICO('setaEsq') + '</a>' +
          '<h1>Doses e diluições</h1>' +
          '<div class="rp-modo dz2-modo">' +
            '<button type="button" data-dz-modo="adulto" class="' + (!ped ? 'on' : '') + '">Adulto</button>' +
            '<button type="button" data-dz-modo="ped" class="' + (ped ? 'on' : '') + '">Pediatria</button>' +
          '</div>' +
          '<label class="sv9-filtro">' + ICO('lupa') + '<input type="search" id="svFiltro" autocomplete="off" placeholder="' + (ped ? 'Filtrar: amoxicilina, dipirona…' : 'Filtrar: adrenalina, amiodarona…') + '" aria-label="Filtrar drogas"></label>' +
          '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
        '</div>' +
        '<div class="dz2-pac">' +
          '<label class="dz2-campo' + (kg ? ' cheio' : '') + '"><span>Peso</span><input type="text" inputmode="decimal" id="tzPeso" value="' + (kg ? br(kg) : '') + '" placeholder="—"><i>kg</i></label>' +
          (ped ? '<label class="dz2-campo' + (idade !== null ? ' cheio' : '') + '"><span>Idade</span><input type="text" inputmode="numeric" id="dzIdade" value="' + (idade !== null ? idade : '') + '" placeholder="—"><i>meses</i></label>' : '') +
          '<p class="dz2-pac-txt">' + (kg
            ? (ped ? 'Doses calculadas para <b>' + br(kg) + ' kg</b>' + (idade !== null ? ' · ' + esc(Ferramentas.ped.idadeTexto(idade)) : '') + '. Confira a apresentação antes de aspirar.'
                   : 'Doses por kg resolvidas para <b>' + br(kg) + ' kg</b>.')
            : (ped ? 'Informe o <b>peso</b> para ver cada dose em mg e mL.' : 'Informe o peso para resolver as doses por kg.')) + '</p>' +
        '</div>' +
      '</header>';
    html += '<div class="dz2-fixo"><label class="sv9-filtro dz2-busca">' + ICO('lupa') +
      '<input type="search" id="dzBusca" autocomplete="off" enterkeyhint="search" placeholder="' + (ped ? 'Buscar: amoxicilina, dipirona…' : 'Buscar: adrenalina, midazolam…') + '" aria-label="Buscar droga em todos os grupos" value="' + esc(dzQ) + '">' +
      '<button type="button" class="dz2-limpa" data-dz-limpa aria-label="Limpar busca"' + (dzQ ? '' : ' hidden') + '>' + ICO('fechar') + '</button></label></div>';
    html += '<div class="dz2-res" id="dzRes" hidden></div>';
    html += ped ? dzPed(kg, idade) : dzAdulto();
    html += '</section>';
    doc.innerHTML = html;
    var f1 = document.getElementById('svFiltro'); if (f1) f1.value = dzQ;
    if (dzQ) dzBuscar(dzQ);
  }

  /* busca em TODOS os grupos: a droga aparece onde quer que esteja */
  var dzQ = '';
  function dzCardAdulto(i, p) {
    var slug = slugDroga(i.droga), temB = slug && acharDroga(slug);
    return '<article class="dz2-card" data-busca="' + esc(normaliza(cru(i.droga))) + '">' +
      '<div class="dz2-c1"><b>' + rico(i.droga) + '</b>' +
        (i.via ? '<span class="dz2-via">' + esc(i.via) + '</span>' : '') +
        (temB ? '<a class="dz2-bulico" href="#droga/' + esc(slug) + '" title="Diluição e apresentação" aria-label="Diluição e apresentação">' + ICO('livro') + '</a>' : '') + '</div>' +
      '<p class="dz2-dose">' + rico(i.dose) + '</p>' +
      (i.obs ? '<p class="dz2-obs" data-dz-obs title="Toque para ler tudo">' + rico(i.obs) + '</p>' : '') +
      (p ? '<a class="dz2-ctx" href="' + esc(hrefConduta(p)) + '">' + esc(p.titulo) + ICO('setaDir') + '</a>' : '') +
    '</article>';
  }
  function dzBuscar(v) {
    dzQ = v || '';
    var res = document.getElementById('dzRes'), corpo = doc.querySelector('.dz2-corpo, .dz2-capa');
    if (!res || !corpo) return;
    doc.querySelectorAll('#dzBusca, #svFiltro').forEach(function (el) { if (el.value !== dzQ) el.value = dzQ; });
    var lp = doc.querySelector('[data-dz-limpa]'); if (lp) lp.hidden = !dzQ;
    var q = normaliza(dzQ.trim());
    if (!q) { res.hidden = true; res.innerHTML = ''; corpo.hidden = false; return; }
    var ped = dzModo === 'ped' && Ferramentas.ped, html = '', n = 0;
    if (ped) {
      var kg = pesoAtual(), idade = Ferramentas.ped.idade();
      var ms = pedLista().filter(function (m) { return normaliza(m.nome + ' ' + (m.apres || '')).indexOf(q) !== -1; });
      n = ms.length;
      html = '<div class="pd4-grade">' + ms.map(function (m) { return cartaoPed4(m, kg, idade); }).join('') + '</div>';
    } else {
      var vistos = {};
      DOSES_GRUPOS.forEach(function (g) {
        g.ids.forEach(function (id) {
          var p = acharConduta(id); if (!p) return;
          dosesDe(p).forEach(function (sec) {
            (sec.itens || []).forEach(function (i) {
              var nome = normaliza(cru(i.droga));
              if (nome.indexOf(q) === -1) return;
              var k = nome + '|' + normaliza(cru(i.dose || ''));
              if (vistos[k]) return;
              vistos[k] = 1; n++;
              html += dzCardAdulto(i, p);
            });
          });
        });
      });
      html = '<div class="dz2-grade">' + html + '</div>';
    }
    res.innerHTML = '<p class="dz2-res-n">' + (n ? n + (n === 1 ? ' resultado' : ' resultados') + ' em todos os grupos' : 'Nenhuma droga com esse termo.') + '</p>' + (n ? html : '');
    res.hidden = false; corpo.hidden = true;
  }
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'dzBusca' && !(e.target.id === 'svFiltro' && doc.querySelector('.dz2'))) return;
    dzBuscar(e.target.value);
  });
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-dz-limpa]')) return;
    dzBuscar('');
    var i = document.getElementById('dzBusca'); if (i) i.focus();
  });

  /* celular: primeiro as áreas em cartões; o toque abre as medicações */
  function dzCapa(itens, azHref, azAttr, azConta) {
    return '<div class="dz2-capa"><p class="dz2-capa-t">Escolha a área</p><div class="dz2-areas">' + itens.map(function (a) {
      return '<a class="dz2-area" ' + a.attr + '><span class="dz2-area-i">' + ICO(a.icone || 'seringa') + '</span><b>' + esc(a.nome) + '</b>' +
        (a.conta ? '<i>' + esc(a.conta) + '</i>' : '') + '</a>';
    }).join('') + '<a class="dz2-area az" ' + azAttr + '><span class="dz2-area-i">' + ICO('livro') + '</span><b>Todas A–Z</b><i>' + esc(azConta) + '</i></a></div></div>';
  }
  function dzVolta(attr, nome) {
    return '<div class="dz2-volta-l"><a class="dz2-volta" ' + attr + '>' + ICO('setaEsq') + 'Áreas</a><h2>' + esc(nome) + '</h2></div>';
  }
  function dzAdulto() {
    var grupos = DOSES_GRUPOS.filter(function (g) { return contaGrupoDoses(g); });
    if (celular() && !dosesGrupo) {
      return dzCapa(grupos.map(function (g) {
        var n = 0; g.ids.forEach(function (id) { var p = acharConduta(id); if (p) dosesDe(p).forEach(function (s) { n += (s.itens || []).length; }); });
        return { attr:'href="#doses/' + esc(g.id) + '"', nome:g.nome, icone:g.icone, conta:n + (n === 1 ? ' droga' : ' drogas') };
      }), '', 'href="#doses/az"', 'bulário completo');
    }
    var atual = dosesGrupo && grupoDoses(dosesGrupo) || grupos[0];
    var az = dosesGrupo === 'az';
    var rail = '<nav class="dz2-rail">' + grupos.map(function (g) {
      return '<a href="#doses/' + esc(g.id) + '" class="' + (!az && g === atual ? 'on' : '') + '"><span>' + ICO(g.icone) + '</span><b>' + esc(g.nome) + '</b><i>' + esc(g.sub || '') + '</i></a>';
    }).join('') + '<a href="#doses/az" class="az' + (az ? ' on' : '') + '"><span>' + ICO('livro') + '</span><b>Todas as drogas A–Z</b><i>bulário completo</i></a></nav>';
    var corpo = '';
    if (az) {
      var drogas = indiceDrogas();
      corpo = '<div class="dz2-az">' + drogas.map(function (d) {
        return '<a class="dz2-azi" href="#droga/' + esc(d.slug) + '" data-busca="' + esc(normaliza(d.nome)) + '"><b>' + esc(d.nome) + '</b><i>' + d.usos.length + (d.usos.length === 1 ? ' uso' : ' usos') + '</i>' + ICO('setaDir') + '</a>';
      }).join('') + '</div>';
    } else {
      corpo = atual.ids.map(function (id) {
        var p = acharConduta(id); if (!p) return '';
        var bl = dosesDe(p); if (!bl.length) return '';
        return '<section class="dz2-bloco rp-grupo"><header><h2>' + esc(p.titulo) + '</h2><a href="' + esc(hrefConduta(p)) + '">Ver conduta' + ICO('setaDir') + '</a></header>' +
          bl.map(function (sec) {
            return (sec.titulo && bl.length > 1 ? '<h3 class="dz2-sub">' + esc(sec.titulo) + '</h3>' : '') +
              '<div class="dz2-grade">' + (sec.itens || []).map(function (i) { return dzCardAdulto(i); }).join('') + '</div>';
          }).join('') + '</section>';
      }).join('');
    }
    return '<div class="dz2-corpo">' + rail + '<div class="dz2-main">' +
      (celular() ? dzVolta('href="#doses"', az ? 'Todas as drogas A–Z' : atual.nome) : '') +
      (az ? '<h2 class="dz2-tit">Todas as drogas A–Z</h2>' : '<h2 class="dz2-tit">' + esc(atual.nome) + '<span>' + esc(atual.sub || '') + '</span></h2>') + corpo + '</div></div>';
  }

  /* pediatria no mesmo padrão do adulto: grupos na coluna, cartões limpos
     à direita. Cada indicação vira uma linha: rótulo · volume grande · mg. */
  var dzPedGrupo = ler('pref:dz-ped-grupo', ''), dzPedCapa = true;
  function milhar(t) { return String(t).replace(/\b\d{4,}\b/g, function (n) { return Number(n).toLocaleString('pt-BR'); }); }
  var RE_NOTA_FORTE = /(dose do dia|\bDIA\b|UNIDADES|SOMENTE|dilu|volume|metade|n[aã]o substitui|m[aá]ximo de)/i;
  var PED_GRUPO_NOME = { analgesia:'Analgesia e febre', antiemetico:'Antieméticos', cortico:'Corticoides', inalacao:'Inalação e broncodilatador',
    'atb-oral':'Antibiótico oral', 'atb-ev':'Antibiótico venoso', alergia:'Alergia', emergencia:'Emergência', digestivo:'Digestivo', convulsao:'Convulsão', sedacao:'Sedação e analgesia',
    reanimacao:'Reanimação', hidratacao:'Hidratação venosa', gastro:'Gastro', outros:'Outros',
    antiacido:'Antiácidos', antiespasmodico:'Cólica e antiespasmódico', antiinflamatorio:'Anti-inflamatórios', antiparasitario:'Antiparasitários',
    tosse:'Tosse e xaropes', laxante:'Laxantes', olhos:'Colírios', ouvido:'Gotas otológicas' };
  /* as do app primeiro; as da planilha (pediatria-planilha.js) só entram se o id ainda não existe */
  function pedLista() {
    var app = Ferramentas.ped.lista(), ids = {};
    app.forEach(function (m) { ids[m.id] = 1; });
    var pl = typeof PED_PLANILHA !== 'undefined' ? PED_PLANILHA.filter(function (m) { return !ids[m.id]; }) : [];
    return app.concat(pl);
  }
  function dzPed(kg, idade) {
    var P = Ferramentas.ped, lista = pedLista();
    var grupos = [];
    lista.forEach(function (m) {
      var gn = PED_GRUPO_NOME[m.grupo] || (m.grupo ? m.grupo.charAt(0).toUpperCase() + m.grupo.slice(1).replace(/-/g, ' ') : 'Medicações');
      var g = grupos.filter(function (x) { return x.nome === gn; })[0];
      if (!g) { g = { nome:gn, itens:[] }; grupos.push(g); }
      g.itens.push(m);
    });
    var PED_ICO = { analgesia:'soro', antiemetico:'estomago', cortico:'escudo', inalacao:'pulmao', 'atb-oral':'comprim', 'atb-ev':'seringa',
      alergia:'alerta', emergencia:'perigo', digestivo:'estomago', antiacido:'estomago', antiespasmodico:'estomago', antiinflamatorio:'osso',
      antiparasitario:'virus', tosse:'pulmao', laxante:'estomago', olhos:'gota', ouvido:'cabeca', convulsao:'cerebro', sedacao:'mente', hidratacao:'soro' };
    if (celular() && dzPedCapa) {
      return dzCapa(grupos.map(function (g) {
        var m0 = g.itens[0] || {};
        return { attr:'href="#" data-dz-pgrupo="' + esc(g.nome) + '"', nome:g.nome, icone:PED_ICO[m0.grupo] || 'seringa', conta:g.itens.length + (g.itens.length === 1 ? ' droga' : ' drogas') };
      }), '', 'href="#" data-dz-pgrupo="az"', lista.length + ' drogas');
    }
    var az = dzPedGrupo === 'az';
    var atual = grupos.filter(function (g) { return g.nome === dzPedGrupo; })[0] || (az ? null : grupos[0]);
    var itens = az ? lista.slice().sort(function (x, y) { return x.nome.localeCompare(y.nome, 'pt'); }) : atual.itens;

    var rail = '<nav class="dz2-rail">' + grupos.map(function (g, k) {
      return '<a href="#" data-dz-pgrupo="' + esc(g.nome) + '" class="' + (!az && g === atual ? 'on' : '') + '"><span class="dz2-rn">' + dois(k + 1) + '</span><b>' + esc(g.nome) + '</b><i>' + g.itens.length + (g.itens.length === 1 ? ' droga' : ' drogas') + '</i></a>';
    }).join('') + '<a href="#" data-dz-pgrupo="az" class="az' + (az ? ' on' : '') + '"><span>' + ICO('livro') + '</span><b>Todas A–Z</b><i>' + lista.length + ' drogas</i></a></nav>';

    pedTextos = {};
    var cards = itens.map(function (m) { return cartaoPed4(m, kg, idade); }).join('');

    return '<div class="dz2-corpo">' + rail + '<div class="dz2-main">' +
      (celular() ? dzVolta('href="#" data-dz-pcapa', az ? 'Todas as drogas A–Z' : atual.nome) : '') +
      '<h2 class="dz2-tit">' + (az ? 'Todas as drogas A–Z' : esc(atual.nome)) +
        '<span>' + (kg ? 'Volumes para ' + br(kg) + ' kg — confira a apresentação antes de aspirar' : 'Informe o peso no topo para ver cada dose em mL') + '</span></h2>' +
      '<section class="rp-grupo dz2-bloco"><div class="pd4-grade">' + cards + '</div></section>' +
    '</div></div>';
  }

  /* ---------- cartão pediátrico (layout do designer, 25/09) ----------
     Cada indicação: rótulo + faixa por kg, volume grande + intervalo por
     extenso, mg por dose embaixo. Dose "dividida" (dividido de 8/8 h…) sai
     POR TOMADA: teto diário primeiro, depois divide pelo número de tomadas.
     Como no desenho, à vista só o volume, o intervalo e o veto por idade;
     atenção, máximos, notas e UI ficam em "Detalhes e cuidados". */
  var pedTextos = {}, pedAbertos = {};
  function pdNum(x, casas) { return Number(x).toLocaleString('pt-BR', { maximumFractionDigits:casas }); }
  function pdMg(x) { return pdNum(x, x >= 100 ? 0 : x >= 0.1 ? 2 : 3); }
  function pdMl(x) { return pdNum(x, x >= 1 ? 1 : 2); }
  function pdFaixa(lo, hi, f) { return f(lo) + (hi != null ? ' a ' + f(hi) : ''); }
  /* "dividido de 8/8 h" vira dose de cada tomada; o resto só ganha texto por extenso */
  function pdIntervalos(f) {
    f = f || '';
    if (/^dividido de /.test(f)) {
      var hs = [];
      f.replace(/(\d+)\/\1/g, function (t, h) { hs.push(+h); return t; });
      if (hs.length) return hs.map(function (h) { return { txt:'de ' + h + ' em ' + h + ' horas', div:24 / h }; });
    }
    var s = f.replace(/(\d+)\/\1 a (\d+)\/\2 h/, 'de $1 em $1 ou $2 em $2 horas')
      .replace(/(\d+)\/\1 h/, 'de $1 em $1 horas')
      .replace(/1× ao dia/, '1 vez ao dia').replace(/(\d+)× ao dia/, '$1 vezes ao dia').replace(/1× /, '1 vez ')
      .replace(/, (\d)/, ' · $1').replace(/ por (\d+ a \d+ dias)/, ' · $1')
      .replace(/ se necessário/, ', se precisar').replace(/ conforme dor/, ' conforme a dor');
    return [{ txt:s, div:1 }];
  }
  function pdCalc(m, d, kg, div, idade) {
    var P = Ferramentas.ped, c = d.conc && P.conc ? P.conc(m, d) : null;
    var un = d.unid === 'UI' ? ' UI' : ' mg';
    var hiK = d.mgkgMax && d.mgkgMax !== d.mgkg ? d.mgkgMax : null;
    /* faixas fixas por idade (meses) ou por peso (kg) — planilha */
    if (d.porIdade || d.porPeso) {
      var x = d.porIdade ? idade : kg;
      if (x == null) return { calc:false, valor:d.regra, sub:d.porIdade ? 'Informe a idade para escolher a dose' : 'Informe o peso para escolher a dose' };
      var fx = (d.porIdade || d.porPeso).filter(function (f) { return x >= f.min && x <= f.max; })[0];
      return fx ? { calc:true, valor:fx.txt, sub:fx.rot } : { calc:false, valor:d.regra, sub:d.fora || 'Fora das faixas da planilha' };
    }
    /* quantidade por kg já na unidade de saída (mL ou gotas) — planilha */
    if (d.porKg != null) {
      var g = d.saida === 'gotas';
      var fu = function (v) { return g ? String(Math.max(1, Math.round(v))) : pdMl(v); };
      var uni = function (t) { return g ? (t === '1' ? ' gota' : ' gotas') : ' mL'; };
      if (!kg) return { calc:false, valor:(d.regra || pdNum(d.porKg, 3) + (g ? ' gota' : ' mL') + '/kg') + (div > 1 ? ' por dia' : ''), sub:'Informe o peso para ver a dose' };
      var v = kg * d.porKg / div, limK = false;
      if (d.maxSaida && v > d.maxSaida) { v = d.maxSaida; limK = true; }
      var vt = fu(v);
      return { calc:true, valor:vt + uni(vt), sub:d.conc && !g ? pdMg(v * d.conc) + ' mg por dose' : '', mg:d.conc && !g ? pdMg(v * d.conc) + ' mg' : '', lim:limK };
    }
    if (d.mgkg == null) {
      var mk = /^(\d+(?:,\d+)?)(?: a (\d+(?:,\d+)?))? mL\/kg$/.exec(d.fixa || '');
      if (mk && kg) {
        var a = kg * parseFloat(mk[1].replace(',', '.')), b = mk[2] ? kg * parseFloat(mk[2].replace(',', '.')) : null;
        return { calc:true, valor:pdFaixa(a, b, pdMg) + ' mL', sub:d.fixa + ' para ' + pdNum(kg, 1) + ' kg' };
      }
      return { calc:false, valor:d.fixa || '—', sub:mk ? 'Informe o peso para ver o volume' : '' };
    }
    /* unid mL com conc 1000: o "mg/kg" da planilha já é mL/kg (SRO 75 mL/kg) */
    if (d.unid === 'mL' && d.conc === 1000) {
      if (!kg) return { calc:false, valor:pdFaixa(d.mgkg, hiK, function (x) { return pdNum(x, 2); }) + ' mL/kg', sub:'Informe o peso para ver o volume' };
      return { calc:true, valor:pdFaixa(kg * d.mgkg, hiK ? kg * hiK : null, pdMg) + ' mL', sub:pdNum(d.mgkg, 2) + ' mL/kg' };
    }
    if (!kg) return { calc:false, valor:pdFaixa(d.mgkg, hiK, function (x) { return pdNum(x, 4); }) + un + '/kg' + (div > 1 ? '/dia' : ''),
      sub:'Informe o peso para ver ' + (c ? 'o volume' : 'a dose') + ' de cada dose' };
    var lo = kg * d.mgkg, hi = hiK ? kg * hiK : null, lim = false;
    if (d.maxMg && lo > d.maxMg) { lo = d.maxMg; lim = true; }
    if (d.maxMg && hi != null && hi > d.maxMg) { hi = d.maxMg; lim = true; }
    if (hi != null && Math.abs(hi - lo) < 1e-9) hi = null;
    var loD = lo / div, hiD = hi != null ? hi / div : null;
    var mg = pdFaixa(loD, hiD, pdMg) + un;
    return { calc:true, valor:c ? pdFaixa(loD / c, hiD != null ? hiD / c : null, pdMl) + ' mL' : mg, sub:c ? mg + ' por dose' : 'por dose', mg:c ? mg : '', lim:lim };
  }
  function pdRegra(d, div) {
    if (d.porKg != null) return d.saida === 'gotas' && d.regra ? d.regra : pdNum(d.porKg, 3) + (d.saida === 'gotas' ? ' gota' : ' mL') + '/kg' + (div ? '/dia' : '/dose');
    if (d.mgkg == null) return '';
    var hiK = d.mgkgMax && d.mgkgMax !== d.mgkg ? d.mgkgMax : null;
    if (d.unid === 'mL' && d.conc === 1000) return pdFaixa(d.mgkg, hiK, function (x) { return pdNum(x, 2); }) + ' mL/kg';
    return pdFaixa(d.mgkg, hiK, function (x) { return pdNum(x, 4); }) + (d.unid === 'UI' ? ' UI' : ' mg') + '/kg' + (div ? '/dia' : '/dose');
  }
  /* a nota que mandava "dividir a dose do dia" perde o sentido quando a dose já sai por tomada */
  function pdLimpaNota(n, div) {
    if (!n) return '';
    var t = n;
    if (div || /dose do dia/i.test(t)) {
      t = t.replace(/O valor mostrado é a dose do DIA[^.]*\./i, '')
           .replace(/Dose do dia(?: em UNIDADES, não em mg)?(?:, [^.]*)?\./i, '')
           .replace(/Divida em \d tomadas\./i, '');
    }
    return t.trim();
  }
  function cartaoPed4(m, kg, idade) {
    var P = Ferramentas.ped, veta = P.vetado(m, idade), aberto = !!pedAbertos[m.id];
    var copia = [m.nome + (m.apres ? ' — ' + m.apres : '') + (m.via ? ' (' + m.via + ')' : '')];
    var regras = [], nDoses = (m.doses || []).length;
    var doses = (m.doses || []).map(function (d) {
      var ops = pdIntervalos(d.freq), div = ops.some(function (o) { return o.div > 1; });
      var rot = div && /^Dose diária$/i.test(d.rot || '') ? 'Dose habitual' : (d.rot || 'Dose');
      var regra = kg ? pdRegra(d, div) : '';
      var linhas = ops.map(function (o) {
        var r = pdCalc(m, d, kg, o.div, idade);
        copia.push('  ' + rot + ': ' + r.valor + (r.mg ? ' (' + r.mg + ')' : '') + (o.txt ? ' ' + o.txt : ''));
        return '<div class="pd4-op"><div class="pd4-v">' +
            (r.calc ? '<b class="pd4-num">' + esc(r.valor) + '</b>' : '<b class="pd4-regra">' + esc(r.valor) + '</b>') +
            (o.txt ? '<span class="pd4-freq">' + ICO('relogio') + '<span>' + esc(o.txt) + '</span></span>' : '') + '</div>' +
          (r.sub || r.lim ? '<div class="pd4-sub">' + (r.sub ? '<span>' + esc(r.sub) + '</span>' : '') + (r.lim ? '<i class="pd4-max">dose máxima</i>' : '') + '</div>' : '') +
        '</div>';
      }).join('');
      /* máximo, unidade e nota vão para "Detalhes e cuidados", como no desenho */
      var un = d.unid === 'UI' ? ' UI' : ' mg', c = d.conc && P.conc ? P.conc(m, d) : null;
      var nota = pdLimpaNota(d.nota, div);
      if (c && d.conc && +c !== +d.conc) nota = 'Volume calculado para o frasco escolhido: ' + pdNum(c, 2) + un + '/mL.';
      var extra = d.unid === 'UI' ? 'Dose em UNIDADES (UI), não em mg.' : '';
      var max = '';
      if (d.porKg != null && d.maxSaida) max = 'Máximo de ' + pdNum(d.maxSaida, 2) + (d.saida === 'gotas' ? ' gotas' : ' mL') + ' por dose';
      else if (d.mgkg != null && d.maxMg && !(d.unid === 'mL' && d.conc === 1000)) max = 'Máximo de ' + pdNum(d.maxMg, 2) + un + (div ? ' por dia' : ' por dose');
      if (max || extra || nota) regras.push('<div>' + (nDoses > 1 ? '<b>' + esc(rot) + '</b><br>' : '') + [max, extra, nota].filter(Boolean).map(esc).join('<br>') + '</div>');
      return '<div class="pd4-dose"><p class="pd4-rot"><span>' + esc(rot) + '</span>' + (regra ? '<b>' + esc(regra) + '</b>' : '') + '</p>' + linhas + '</div>';
    }).join('');
    if (kg) copia.push('  (peso ' + pdNum(kg, 1) + ' kg)');
    if (!veta && kg) pedTextos[m.id] = copia.join('\n');
    var d0 = (m.doses || []).filter(function (d) { return d.conc; })[0];
    var cAtual = d0 && P.conc ? P.conc(m, d0) : null;
    var det = (m.atencao ? '<p class="pd4-alerta verm">' + ICO('alerta') + '<span>' + esc(m.atencao) + '</span></p>' : '') +
      regras.join('') +
      (m.idade && !/^Qualquer idade$/i.test(m.idade) ? '<div><b>Idade</b> · ' + esc(m.idade) + '</div>' : '') +
      (m.obs || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    return '<article class="dz2-card pd4' + (veta ? ' veto' : '') + (aberto ? ' aberto' : '') + '" data-pd="' + esc(m.id) + '" data-busca="' + esc(normaliza(m.nome + ' ' + (m.apres || ''))) + '">' +
      '<div class="pd4-top"><b>' + esc(m.nome) + '</b>' + (m.via ? '<span class="pd4-via">' + esc(m.via) + '</span>' : '') +
        (!veta && kg ? '<button type="button" class="pd4-cp" data-dz-copiar="' + esc(m.id) + '" title="Copiar e mandar ao rascunho" aria-label="Copiar">' + ICO('copiar') + '</button>' : '') + '</div>' +
      (m.apres ? '<p class="pd4-apres">' + esc(m.apres) + '</p>' : '') +
      ((m.alt || []).length && !veta ? '<div class="pd4-alt" role="group" aria-label="Frasco usado no cálculo"><span>Frasco</span>' + m.alt.map(function (a) {
        return '<button type="button" data-pconc="' + esc(m.id) + '" data-v="' + a[0] + '" class="' + (+a[0] === +cAtual ? 'on' : '') + '">' + esc(a[1]) + '</button>';
      }).join('') + '</div>' : '') +
      (veta ? '<p class="pd4-veto">' + ICO('alerta') + '<span><b>Não usar nesta idade.</b> ' + esc(m.veto.txt || '') + '</span></p>' :
        '<div class="pd4-doses">' + doses + '</div>' +
        (det ? '<button type="button" class="pd4-det" data-pd-det="' + esc(m.id) + '" aria-expanded="' + aberto + '">' + ICO('setaDir') + '<span>' + (aberto ? 'Fechar detalhes' : 'Detalhes e cuidados') + '</span></button>' +
          '<div class="pd4-det-corpo">' + det + '</div>' : '')) +
    '</article>';
  }
  /* troca a apresentação (frasco) usada no cálculo pediátrico, sem perder a rolagem */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pconc]');
    if (!b || !window.Ferramentas || !Ferramentas.ped || !Ferramentas.ped.setConc) return;
    var y = window.scrollY;
    Ferramentas.ped.setConc(b.dataset.pconc, b.dataset.v);
    render();
    window.scrollTo(0, y);
  });
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-dz-pgrupo]');
    if (!t) return;
    e.preventDefault();
    dzPedGrupo = t.dataset.dzPgrupo; grava('pref:dz-ped-grupo', dzPedGrupo); dzPedCapa = false;
    renderDosesNovo();
    if (celular()) window.scrollTo(0, 0);
    var m = doc.querySelector('.dz2-corpo'); if (m && m.getBoundingClientRect().top < 0) window.scrollTo({ top:m.getBoundingClientRect().top + window.scrollY - 12, behavior:'smooth' });
  });

  doc.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-dg-volta]')) && history.length > 1) { e.preventDefault(); history.back(); return; }
    if ((t = e.target.closest('[data-dz-obs]'))) { t.classList.toggle('aberta'); return; }
    if ((t = e.target.closest('[data-dz-pcapa]'))) { e.preventDefault(); dzPedCapa = true; renderDosesNovo(); window.scrollTo(0, 0); return; }
    if ((t = e.target.closest('[data-dz-modo]'))) { dzModo = t.dataset.dzModo; grava('pref:dz-modo', dzModo); renderDosesNovo(); return; }
    if ((t = e.target.closest('[data-pd-det]'))) {
      var card = t.closest('.pd4'), id = t.dataset.pdDet;
      pedAbertos[id] = !pedAbertos[id];
      if (card) card.classList.toggle('aberto', pedAbertos[id]);
      t.setAttribute('aria-expanded', String(pedAbertos[id]));
      t.querySelector('span').textContent = pedAbertos[id] ? 'Fechar detalhes' : 'Detalhes e cuidados';
      return;
    }
    if ((t = e.target.closest('[data-dz-copiar]'))) {
      var m = pedLista().filter(function (x) { return x.id === t.dataset.dzCopiar; })[0];
      /* o texto copiado é o mesmo da tela (dose por tomada); sem ele, cai no texto antigo */
      if (m && pedTextos[m.id]) Ferramentas.copiarRx(pedTextos[m.id], m.nome);
      else if (m) Ferramentas.ped.copiar(m, pesoAtual());
      t.classList.add('ok'); setTimeout(function () { t.classList.remove('ok'); }, 1400);
    }
  });
  var dzTimer = null;
  doc.addEventListener('input', function (e) {
    if (!doc.querySelector('.dz2')) return;
    if (e.target.id === 'dzIdade') { Ferramentas.ped.setIdade(e.target.value.replace(/[^0-9]/g, '')); }
    else if (e.target.id !== 'tzPeso') return;
    clearTimeout(dzTimer);
    var id = e.target.id, pos = e.target.selectionStart;
    dzTimer = setTimeout(function () {
      renderDosesNovo();
      var el = document.getElementById(id);
      if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (x) {} }
    }, 450);
  });

  function renderConduta(p) {
    var c = area(p.categoria);
    var d = subDaConduta(p);
    var g = p.gravidade || 'rotina';
    var cor = { emergencia:'vermelho', urgencia:'laranja', rotina:'azul' }[g] || 'azul';
    var volta = CRITICAS.indexOf(p.id) !== -1 && g === 'emergencia' ? '#critico' : (d ? '#' + c.id + '/' + d.sub.id : '#' + c.id);
    var voltaTxt = volta === '#critico' ? 'Sala vermelha' : (d ? d.sub.nome : c.nome);
    fluxoConduta = p;

    var secoes = (p.secoes || []).map(function (s, k) { return { s:s, k:k }; });
    /* `topo:true`: explicação de entrada (ex.: VNI para quem nunca usou) — vem antes de tudo */
    var topo = secoes.filter(function (x) { return x.s.topo; });
    secoes = secoes.filter(function (x) { return !x.s.topo; });
    var agora = secoes.filter(function (x) { return x.s.tipo === 'passos' && (x.s.itens || []).length; })[0];
    var fluxos = secoes.filter(function (x) { return x.s.tipo === 'fluxo'; });
    var lado = secoes.filter(function (x) { return { prescricao:1, doses:1, alerta:1, naofazer:1 }[x.s.tipo]; });
    lado.sort(function (a, b) { var o = { prescricao:0, doses:1, alerta:2, naofazer:3 }; return o[a.s.tipo] - o[b.s.tipo] || a.k - b.k; });
    var usados = {}; [agora].concat(fluxos, lado).forEach(function (x) { if (x) usados[x.k] = 1; });
    var resto = secoes.filter(function (x) { return !usados[x.k]; });

    var saltos = [];
    topo.forEach(function (x) { saltos.push({ id:'cds-' + x.k, nome:x.s.titulo || LABEL[x.s.tipo] || '' }); });
    if (agora) saltos.push({ id:'cds-agora', nome:agora.s.titulo || 'Fazer agora' });
    fluxos.concat(lado, resto).forEach(function (x) { saltos.push({ id:'cds-' + x.k, nome:x.s.titulo || LABEL[x.s.tipo] || '' }); });

    var html = '<section class="tz sv9 cd pg-' + cor + '">' +
      '<header class="sv9-barra cd-barra">' +
        '<div class="sv9-b1">' +
          '<a class="sv9-volta cd-volta" href="' + esc(volta) + '">' + ICO('setaEsq') + '<span>' + esc(voltaTxt) + '</span></a>' +
          '<div class="cd-tit"><h1>' + esc(p.titulo) + '</h1>' + (p.resumo ? '<p>' + rico(p.resumo) + '</p>' : '') + '</div>' +
          '<span class="cd-grav g-' + esc(g) + '">' + esc(LABEL_GRAV[g] || g) + '</span>' +
          '<button type="button" class="tz-bt btn-fav' + (ehFavorita(p.id) ? ' on' : '') + '" data-fav="' + esc(p.id) + '" aria-pressed="' + (ehFavorita(p.id) ? 'true' : 'false') + '" title="Favoritar">' + ICO('estrela') + '</button>' +
          '<button type="button" class="tz-bt" data-link title="Copiar o link">' + ICO('elo') + '</button>' +
          '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
        '</div>' +
        '<nav class="sv9-saltos">' + saltos.map(function (s, n) {
          return '<button type="button" data-cd-ir="' + esc(s.id) + '"><i>' + dois(n + 1) + '</i>' + esc(s.nome) + '</button>';
        }).join('') + '</nav>' +
      '</header>';

    if (!(p.secoes || []).length) html += '<div class="pendente">Conduta ainda não preenchida.</div>';
    if (topo.length) html += '<div class="cd-resto cd-topo">' + topo.map(function (x) { return cdCartao(x.s, x.k); }).join('') + '</div>';
    if (agora) html += cdAgora(agora.s);

    if (fluxos.length || lado.length) {
      html += '<div class="cd-meio' + (fluxos.length ? '' : ' so-lado') + '">' +
        (fluxos.length ? '<div class="cd-fluxos">' + fluxos.map(function (x) {
          return '<section class="cd-fluxo" id="cds-' + x.k + '">' + fluxoV2(x.s) + '</section>'; }).join('') + '</div>' : '') +
        (lado.length ? '<aside class="cd-lado">' + lado.map(function (x) { return cdCartao(x.s, x.k); }).join('') + '</aside>' : '') +
      '</div>';
    }
    if (resto.length) html += '<div class="cd-resto">' + resto.map(function (x) { return cdCartao(x.s, x.k, true); }).join('') + '</div>';

    html += '<p class="cd-aviso">' + ICO('alerta') + '<span>Apoio à decisão, sem revisão clínica formal. Confira dose, apresentação e diretriz vigente antes de prescrever.' +
      (p.fonte ? ' <b>Referência:</b> ' + esc(p.fonte) + '.' : '') + '</span></p>';
    html += '</section>';
    marcaRecente(p.id);
    doc.innerHTML = html;
  }

  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cd-ir]');
    if (!b) return;
    var alvo = document.getElementById(b.dataset.cdIr);
    if (!alvo) return;
    if (alvo.classList.contains('cd-dobra') && !alvo.classList.contains('aberto')) cdAlterna(alvo, true);
    var barra = doc.querySelector('.cd-barra');
    var folga = celular() ? barraVisivel(barra) + 12 : (barra ? barra.offsetHeight + 14 : 14);
    window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - folga, behavior: 'smooth' });
    alvo.classList.remove('pisca'); void alvo.offsetWidth; alvo.classList.add('pisca');
  });

  /* celular: a mesma quebra do CSS (760 px) */
  function celular() { return !!(window.matchMedia && window.matchMedia('(max-width:760px)').matches); }

  /* ---------- dados comuns às versões de home ---------- */
  function homeDados() {
    var crit = [];
    CRITICAS_GRUPOS.forEach(function (g) {
      g.ids.slice(0, 2).forEach(function (id) { var p = acharConduta(id); if (p && crit.length < 8) crit.push(p); });
    });
    var nCrit = CRITICAS_GRUPOS.reduce(function (t, g) { return t + g.ids.filter(acharConduta).length; }, 0);
    var favs = favoritas.map(acharConduta).filter(Boolean).slice(0, 4);
    var recs = recentes().map(acharConduta).filter(Boolean)
      .filter(function (p) { return favs.indexOf(p) === -1; }).slice(0, 5);
    var areas = CATEGORIAS.map(function (c) { return { c:c, n:listaArea(c.id).length }; })
      .filter(function (x) { return x.n; });
    return { nome:nomeMedico(), crit:crit, nCrit:nCrit, favs:favs, recs:recs, areas:areas,
      total:PROTOCOLOS.filter(preenchida).length };
  }
  function ola(d) { return esc(saudacao()) + (d.nome ? ', <span>' + esc(d.nome) + '</span>' : ''); }
  function campoBusca(cls, ph) {
    return '<label class="' + cls + '">' + ICO('lupa') +
      '<input type="search" id="heroBusca" autocomplete="off" placeholder="' + esc(ph || 'Buscar conduta, quadro, droga ou dose') +
      '" aria-label="Buscar em todo o guia"><kbd>/</kbd></label>';
  }
  function catDe(p) { return CATEGORIAS.filter(function (c) { return c.id === p.categoria; })[0]; }
  function linkP(p, cls, extra) {
    return '<a class="' + cls + '" href="' + esc(hrefConduta(p)) + '">' + (extra || '') + '<span>' + esc(p.titulo) + '</span></a>';
  }
  /* ---------- FAIXA: a unidade visual do guia inteiro ----------
     cor = prioridade (vermelho, laranja, amarelo, verde, azul), à esquerda o
     rótulo, à direita os itens em pílulas. Home, Sala vermelha, Queixas,
     Urgências e as áreas usam a mesma peça. */
  function faixa(o) {
    return '<section class="fxa ' + o.cor + (o.alta ? ' alta' : '') + '">' +
      '<div class="fxa-rot">' +
        '<span class="fxa-nivel">' + esc(o.rot) + '</span>' +
        (o.titulo ? '<b class="fxa-tit">' + esc(o.titulo) + '</b>' : '') +
        (o.sub ? '<span class="fxa-sub">' + esc(o.sub) + '</span>' : '') +
        (o.conta != null ? '<span class="fxa-conta">' + o.conta + '</span>' : '') +
      '</div>' +
      '<div class="fxa-itens">' + o.itens +
        (o.mais ? '<a class="fxa-mais" href="' + esc(o.mais.href) + '">' + esc(o.mais.txt) + ICO('setaDir') + '</a>' : '') +
      '</div></section>';
  }
  function pilula(href, txt, extra, attrs) {
    return '<a class="fxa-p" href="' + esc(href) + '"' + (attrs || '') + '>' + esc(txt) + (extra || '') + '</a>';
  }
  function pilulaP(p) { return pilula(hrefConduta(p), p.titulo); }
  var FXA_GRAV = {
    emergencia:{ cor:'vermelho', rot:'Emergência', sub:'atender já' },
    urgencia:  { cor:'laranja',  rot:'Urgência',   sub:'em minutos' },
    rotina:    { cor:'verde',    rot:'Rotina',     sub:'pode esperar' }
  };
  function urgencias() {
    return PROTOCOLOS.filter(function (p) { return preenchida(p) && p.gravidade === 'urgencia'; });
  }
  function quadrosRapidos() {
    if (typeof FERR_QUADROS === 'undefined') return [];
    var ok = { 'Dor':1, 'Respiratório':1, 'Gastro':1, 'Infeccioso':1, 'Alérgico':1, 'Trauma e pele':1 };
    return FERR_QUADROS.filter(function (q) { return ok[q.grupo]; });
  }

  /* ---------- HOME: painel de triagem, do zero ----------
     A home é dona da tela inteira: barra própria, pergunta central e cinco
     colunas de prioridade (vermelho → azul), como um quadro de triagem. */
  function homeT() {
    var d = homeDados();
    var urg = urgencias();
    var rx = quadrosRapidos();
    var agora = new Date();
    var hora = ('0' + agora.getHours()).slice(-2) + ':' + ('0' + agora.getMinutes()).slice(-2);
    var pesoV = (document.getElementById('peso') || {}).value || '';

    function coluna(o) {
      return '<section class="tz-col ' + o.cor + (o.cls ? ' ' + o.cls : '') + '">' +
        '<a class="tz-col-cab" href="' + esc(o.href) + '">' +
          '<span class="tz-nivel">' + esc(o.nivel) + '<i>' + esc(o.tempo) + '</i></span>' +
          '<b>' + esc(o.titulo) + '</b>' +
          '<span class="tz-num">' + o.n + '</span>' +
          '<span class="tz-seta" aria-hidden="true">' + ICO('setaDir') + '</span>' +
        '</a>' +
        '<div class="tz-lista">' + o.itens + '</div>' +
        (o.rodape ? '<a class="tz-ver" href="' + esc(o.href) + '">' + esc(o.rodape) + ICO('setaDir') + '</a>' : '') +
      '</section>';
    }
    function item(href, txt, extra, attrs) {
      return '<a class="tz-it" href="' + esc(href) + '"' + (attrs || '') + '><span>' + esc(txt) + '</span>' + (extra || '') + '</a>';
    }

    var ecg = '<svg class="tz-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 H250 L270 70 L285 30 L300 105 L315 70 H520 L540 70 L555 20 L570 110 L585 70 H790 L810 70 L825 30 L840 105 L855 70 H1060 L1080 70 L1095 20 L1110 110 L1125 70 H1200"/></svg>';
    var html = '<section class="tz">' +
      '<header class="tz-topo">' + ecg +
        '<div class="tz-l1">' +
          '<a class="tz-marca" href="#" aria-label="MedAtalho — início"><span><svg viewBox="-4 -4 56 56" fill="none" aria-hidden="true"><mask id="maHome" maskUnits="userSpaceOnUse" x="-4" y="-4" width="56" height="56"><rect x="-4" y="-4" width="56" height="56" fill="#fff"/><path d="M22 28H37" stroke="#000" stroke-width="10"/></mask><g stroke="currentColor" stroke-width="4.6" stroke-linecap="round"><path d="M2.5 40H8L21 7L34 40" stroke-linejoin="miter" stroke-miterlimit="10" mask="url(#maHome)"/><path d="M12.7 28H44.5" stroke-linejoin="round"/><path d="M39 22.5L44.5 28L39 33.5" stroke-linejoin="round"/></g></svg></span><b>MedAtalho</b></a>' +
          '<span class="tz-status"><i></i>' + (periodo() === 'noite' ? 'Plantão noturno' : 'Plantão diurno') + '<b id="tzHora">' + hora + '</b></span>' +
          '<div class="tz-acoes">' +
            '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
            '<button type="button" class="tz-bt" data-proxy="btnTema" title="Modo noturno">' + ICO('lua') + '</button>' +
            '<button type="button" class="tz-bt" data-proxy="btnAjustes" title="Configurações">' + ICO('ajustes') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="tz-l2 so">' +
          '<div class="tz-pergunta">' +
            '<p>' + ola(d) + ' <em>·</em> ' + esc(dataHoje()) + '</p>' +
            campoBusca('tz-busca', celular() ? 'Buscar conduta, droga ou dose' : 'Busque conduta, droga, dose ou receita') +
          '</div>' +
        '</div>' +
      '</header>' +

      '<div class="tz-quadro">' +
        coluna({ cor:'vermelho', nivel:'Emergência', tempo:'imediato', titulo:'Sala vermelha', n:d.nCrit, href:'#critico',
          itens:d.crit.slice(0, 7).map(function (p) { return item(hrefConduta(p), p.titulo); }).join(''), rodape:'Ver as ' + d.nCrit }) +
        coluna({ cor:'laranja', nivel:'Urgência', tempo:'minutos', titulo:'Urgências', n:urg.length, href:'#urgencias',
          itens:urg.slice(0, 7).map(function (p) { return item(hrefConduta(p), p.titulo); }).join(''), rodape:'Ver as ' + urg.length }) +
        coluna({ cor:'amarelo', nivel:'Sem diagnóstico', tempo:'pela queixa', titulo:'Queixas', n:QUEIXAS.length, href:'#queixa',
          itens:QUEIXAS.slice(0, 7).map(function (q) { return item('#queixa/' + q.id, q.nome); }).join(''), rodape:'Ver as ' + QUEIXAS.length }) +
        coluna({ cor:'verde', nivel:'Pouco urgente', tempo:'copiar e alta', titulo:'Receita pronta', n:rx.length, href:'#presc',
          itens:rx.slice(0, 7).map(function (q) { return item('#presc', q.nome, '<i class="tz-rx">Rx</i>', ' data-abre="quadro:' + esc(q.id) + '"'); }).join(''),
          rodape:'Todas as prescrições' }) +
        coluna({ cor:'escuro', nivel:'Guia clínico', tempo:'por área', titulo:'Condutas', n:d.total, href:celular() ? '#guia' : '#' + (d.areas[0] ? d.areas[0].c.id : ''),
          itens:d.areas.map(function (x) { return item('#' + x.c.id, x.c.nome, '<i class="tz-ct">' + x.n + '</i>'); }).join('') }) +
        coluna({ cor:'azul', cls:'tz-ferr', nivel:'Consulta', tempo:'cálculo e modelo', titulo:'Ferramentas', n:Ferramentas.secoes.length + 1, href:'#doses',
          itens:item('#doses', 'Doses e pediatria') + Ferramentas.secoes.filter(function (s) { return s.id !== 'presc' && s.id !== 'pediatria'; }).map(function (s) { return item('#' + s.id, s.nome); }).join('') }) +
      '</div>';

    /* celular: a coluna Ferramentas vira um cartão por ferramenta, um toque só */
    var atalhos = [{ href:'#doses', nome:'Doses e pediatria', ico:'seringa' }].concat(
      Ferramentas.secoes.filter(function (s) { return s.id !== 'presc' && s.id !== 'pediatria'; })
        .map(function (s) { return { href:'#' + s.id, nome:s.nome, ico:s.icone }; }));
    html += '<nav class="tz-atalhos" aria-label="Ferramentas"><h2>Ferramentas</h2>' + atalhos.map(function (a) {
      return '<a class="tz-at" href="' + esc(a.href) + '"><b>' + esc(a.nome) + '</b>' + ICO(a.ico) + '</a>';
    }).join('') + '</nav>';

    html += '</section>';
    return html;
  }

  /* botões da barra da home acionam os do topo global (que some na home) */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-proxy]');
    if (!b) return;
    var alvo = document.getElementById(b.dataset.proxy);
    if (alvo) alvo.click();
  });
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-intencao]');
    if (!b) return;
    var q = document.getElementById('heroBusca');
    if (!q) return;
    q.value = b.dataset.intencao;
    q.focus();
    q.setSelectionRange(q.value.length, q.value.length);
  });
  setInterval(function () {
    var el = document.getElementById('tzHora');
    if (!el) return;
    var t = new Date();
    el.textContent = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
  }, 20000);
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'svFiltro' || doc.querySelector('.dz2')) return;
    var q = normaliza(e.target.value.trim()), algum = false;
    doc.querySelectorAll('.sv9-g, .rx-grupo').forEach(function (g) {
      var vis = 0;
      g.querySelectorAll('.sv9-it, .rp-card, .dz2-card, .dz2-azi').forEach(function (it) {
        var ok = !q || it.dataset.busca.indexOf(q) !== -1;
        it.hidden = !ok; if (ok) vis++;
      });
      g.hidden = !vis; if (vis) algum = true;
    });
    var v = document.getElementById('svVazio'); if (v) v.hidden = algum;
  });
  doc.addEventListener('change', function (e) {
    var s = e.target.closest('[data-ir-area]');
    if (s) location.hash = '#' + s.value;
  });
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sv-ir]');
    if (!b) return;
    var alvo = document.getElementById('svg-' + b.dataset.svIr);
    if (!alvo) return;
    var barra = doc.querySelector('.sv9-barra');
    var folga = celular() ? barraVisivel(barra) + 12 : (barra ? barra.offsetHeight + 16 : 16);
    window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - folga, behavior: 'smooth' });
    alvo.classList.remove('pisca'); void alvo.offsetWidth; alvo.classList.add('pisca');
  });
  /* peso digitado na ficha da droga (busca): vale para o guia inteiro e recalcula as doses pediátricas */
  var bzPesoTimer = null;
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'bzPeso') return;
    var p = document.getElementById('peso');
    if (!p) return;
    p.value = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
    clearTimeout(bzPesoTimer);
    var pos = e.target.selectionStart;
    bzPesoTimer = setTimeout(function () {
      p.dispatchEvent(new Event('input', { bubbles:true }));
      var y = window.scrollY;
      render();
      window.scrollTo(0, y);
      var el = document.getElementById('bzPeso');
      if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (x) {} }
    }, 450);
  });
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'tzPeso') return;
    var p = document.getElementById('peso');
    if (!p) return;
    p.value = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
    p.dispatchEvent(new Event('input', { bubbles:true }));
  });

  function renderUrgencias() {
    var urg = urgencias();
    doc.innerHTML = painel({ cor:'laranja', titulo:'Urgências', ph:'Filtrar urgências…',
      grupos:CATEGORIAS.map(function (c) {
        return { nome:c.nome, quando:'resolver em minutos', itens:urg.filter(function (p) { return p.categoria === c.id; })
          .map(function (p) { return { href:hrefConduta(p), titulo:p.titulo, sub:p.resumo ? cru(p.resumo) : '' }; }) };
      }) });
  }


  function renderHome() {
    var v = window.HOME_VAR || 't';
    var f = { t:homeT, a:homeA, b:homeB, c:homeC, d:homeD, e:homeE }[v];
    doc.innerHTML = f ? (v === 't' ? homeT() : f(homeDados())) : homeH8();
  }
  function homeH8() {
    var nome = nomeMedico();

    /* 1. saudação + busca */
    var html = '<section class="phase home8">' +
      '<header class="h8-hero">' +
        '<div class="h8-ola">' +
          '<p class="h8-data">' + ICO(periodo() === 'noite' ? 'lua' : 'sol') + '<span>' + esc(dataHoje()) + '</span></p>' +
          '<h1>' + esc(saudacao()) + (nome ? ', <span>' + esc(nome) + '</span>' : '') + '</h1>' +
          (nome ? '' :
            '<form class="h8-nome" data-form-nome>' +
              '<input type="text" placeholder="Como quer ser chamado? Ex.: Dr. Rafael" aria-label="Seu nome">' +
              '<button type="submit">Salvar</button></form>') +
        '</div>' +
        '<label class="h8-busca">' + ICO('lupa') +
          '<input type="search" id="heroBusca" autocomplete="off" ' +
          'placeholder="Buscar conduta, quadro, droga ou dose" aria-label="Buscar em todo o guia">' +
          '<kbd>/</kbd></label>' +
      '</header>';

    /* 2. sala vermelha + meu plantão */
    html += '<div class="h8-grade">';
    if (temQueixas()) {
      var crit = [];
      CRITICAS_GRUPOS.forEach(function (g) {
        g.ids.slice(0, 2).forEach(function (id) { var p = acharConduta(id); if (p && crit.length < 8) crit.push(p); });
      });
      var nCrit = CRITICAS_GRUPOS.reduce(function (t, g) { return t + g.ids.filter(acharConduta).length; }, 0);
      html += '<section class="h8-card h8-sv">' +
        '<div class="h8-cab">' +
          '<span class="h8-cab-i">' + ICO('perigo') + '</span>' +
          '<div><h2>Sala vermelha</h2><p>' + nCrit + ' condutas de emergência</p></div>' +
          '<a class="h8-ver" href="#critico">Ver todas' + ICO('setaDir') + '</a>' +
        '</div>' +
        '<div class="h8-sv-l">' + crit.map(function (p) {
          return '<a href="' + esc(hrefConduta(p)) + '"><i></i><span>' + esc(p.titulo) + '</span></a>';
        }).join('') + '</div>' +
      '</section>';
    }

    var favs = favoritas.map(acharConduta).filter(Boolean).slice(0, 4);
    var recs = recentes().map(acharConduta).filter(Boolean)
      .filter(function (p) { return favs.indexOf(p) === -1; }).slice(0, 5);
    function linhaMeu(p) {
      var cat = CATEGORIAS.filter(function (c) { return c.id === p.categoria; })[0];
      return '<a class="h8-meu-it" href="' + esc(hrefConduta(p)) + '">' +
        '<span>' + esc(p.titulo) + '</span>' +
        (cat ? '<i>' + esc(cat.nome) + '</i>' : '') + '</a>';
    }
    html += '<section class="h8-card h8-meu">' +
      '<div class="h8-cab">' +
        '<span class="h8-cab-i azul">' + ICO('estrela') + '</span>' +
        '<div><h2>Meu plantão</h2><p>favoritas e últimas abertas</p></div>' +
        (favs.length ? '<a class="h8-ver azul" href="#favoritas">Todas' + ICO('setaDir') + '</a>' : '') +
      '</div>' +
      (favs.length || recs.length
        ? (favs.length ? '<h3>Favoritas</h3>' + favs.map(linhaMeu).join('') : '') +
          (recs.length ? '<h3>Recentes</h3>' + recs.map(linhaMeu).join('') : '')
        : '<p class="h8-vazio">As condutas que você abrir ou favoritar com a estrela aparecem aqui.</p>') +
    '</section>';
    html += '</div>';

    /* 3. áreas do guia */
    html += '<section class="h8-areas">' +
      '<div class="h8-sec"><h2>Áreas do guia</h2></div>' +
      '<div class="h8-az">' + CATEGORIAS.map(function (c) {
        var n = listaArea(c.id).length;
        return n ? '<a class="h8-area" href="#' + esc(c.id) + '">' +
          '<span class="h8-area-i">' + ICO(c.icone) + '</span>' +
          '<span class="h8-area-t"><b>' + esc(c.nome) + '</b><i>' + n + (n === 1 ? ' conduta' : ' condutas') + '</i></span>' +
        '</a>' : '';
      }).join('') + '</div>' +
    '</section>';

    return html + '</section>';
  }

  /* A — COMANDO: tela limpa, busca no centro, emergência em pílulas */
  function homeA(d) {
    return '<section class="phase hA">' +
      '<div class="hA-topo"><p>' + esc(dataHoje()) + '</p><h1>' + ola(d) + '</h1></div>' +
      campoBusca('hA-busca', 'O que você precisa agora?') +
      '<div class="hA-sv"><span class="hA-sv-t">' + ICO('perigo') + 'Sala vermelha</span>' +
        d.crit.map(function (p) { return linkP(p, 'hA-pill'); }).join('') +
        '<a class="hA-mais" href="#critico">+' + (d.nCrit - d.crit.length) + '</a></div>' +
      '<div class="hA-cols">' +
        '<div><h2>Áreas</h2><div class="hA-lista">' + d.areas.map(function (x) {
          return '<a href="#' + esc(x.c.id) + '">' + ICO(x.c.icone) + '<span>' + esc(x.c.nome) + '</span><i>' + x.n + '</i></a>';
        }).join('') + '</div></div>' +
        '<div><h2>Recentes</h2><div class="hA-lista">' + (d.recs.concat(d.favs).length
          ? d.favs.concat(d.recs).slice(0, 8).map(function (p) { return linkP(p, '', ICO('relogio')); }).join('')
          : '<p class="hA-vazio">Nada aberto ainda.</p>') + '</div></div>' +
      '</div></section>';
  }

  /* B — PAINEL: coluna de saudação à esquerda, emergência ocupa o palco */
  function homeB(d) {
    return '<section class="phase hB">' +
      '<aside class="hB-lado">' +
        '<div class="hB-ola"><span class="hB-av">' + esc((d.nome || 'Dr').replace(/^(Dra?\.?\s*)/i, '').charAt(0).toUpperCase() || 'D') + '</span>' +
          '<div><p>' + esc(dataHoje()) + '</p><h1>' + ola(d) + '</h1></div></div>' +
        campoBusca('hB-busca') +
        '<h3>Meu plantão</h3>' + ((d.favs.length || d.recs.length)
          ? d.favs.concat(d.recs).slice(0, 6).map(function (p) {
              var c = catDe(p); return '<a class="hB-it" href="' + esc(hrefConduta(p)) + '"><b>' + esc(p.titulo) + '</b>' + (c ? '<i>' + esc(c.nome) + '</i>' : '') + '</a>';
            }).join('')
          : '<p class="hB-vazio">Suas favoritas e últimas abertas aparecem aqui.</p>') +
      '</aside>' +
      '<div class="hB-palco">' +
        '<div class="hB-sv"><div class="hB-sv-cab"><h2>' + ICO('perigo') + 'Sala vermelha</h2><a href="#critico">Ver as ' + d.nCrit + '</a></div>' +
          '<div class="hB-sv-g">' + d.crit.map(function (p, i) {
            return '<a href="' + esc(hrefConduta(p)) + '"><i>' + (i < 9 ? '0' : '') + (i + 1) + '</i><span>' + esc(p.titulo) + '</span></a>';
          }).join('') + '</div></div>' +
        '<h2 class="hB-t">Áreas</h2><div class="hB-areas">' + d.areas.map(function (x) {
          return '<a href="#' + esc(x.c.id) + '"><span>' + ICO(x.c.icone) + '</span><b>' + esc(x.c.nome) + '</b><i>' + x.n + '</i></a>';
        }).join('') + '</div>' +
      '</div></section>';
  }

  /* C — EDITORIAL: tipografia manda, sem caixas, três colunas de texto */
  function homeC(d) {
    function col(t, itens, cor) {
      return '<div class="hC-col' + (cor ? ' ' + cor : '') + '"><h2>' + t + '</h2>' + itens + '</div>';
    }
    return '<section class="phase hC">' +
      '<p class="hC-data">' + esc(dataHoje()) + '</p>' +
      '<h1>' + ola(d) + '.</h1>' +
      '<p class="hC-sub">' + d.total + ' condutas, ' + d.nCrit + ' de emergência.</p>' +
      campoBusca('hC-busca') +
      '<div class="hC-cols">' +
        col('Sala vermelha', d.crit.map(function (p) { return linkP(p, 'hC-l'); }).join('') +
          '<a class="hC-ver" href="#critico">Todas as emergências →</a>', 'sv') +
        col('Áreas', d.areas.map(function (x) {
          return '<a class="hC-l" href="#' + esc(x.c.id) + '"><span>' + esc(x.c.nome) + '</span><i>' + x.n + '</i></a>';
        }).join('')) +
        col('Meu plantão', (d.favs.length || d.recs.length)
          ? d.favs.concat(d.recs).slice(0, 8).map(function (p) { return linkP(p, 'hC-l'); }).join('')
          : '<p class="hC-vazio">Abra ou favorite condutas para vê-las aqui.</p>') +
      '</div></section>';
  }

  /* D — BENTO: blocos de tamanhos diferentes num grid */
  function homeD(d) {
    var m = d.favs.concat(d.recs).slice(0, 4);
    return '<section class="phase hD"><div class="hD-grid">' +
      '<div class="hD-b hD-ola"><p>' + esc(dataHoje()) + '</p><h1>' + ola(d) + '</h1>' + campoBusca('hD-busca') + '</div>' +
      '<a class="hD-b hD-num" href="#critico"><b>' + d.nCrit + '</b><span>condutas de emergência</span>' + ICO('setaDir') + '</a>' +
      '<div class="hD-b hD-sv"><h2>' + ICO('perigo') + 'Sala vermelha</h2><div>' +
        d.crit.map(function (p) { return linkP(p, 'hD-sv-it'); }).join('') + '</div></div>' +
      '<div class="hD-b hD-meu"><h2>' + ICO('estrela') + 'Meu plantão</h2>' + (m.length
        ? m.map(function (p) { return linkP(p, 'hD-meu-it'); }).join('')
        : '<p>Suas favoritas e recentes aparecem aqui.</p>') + '</div>' +
      '<a class="hD-b hD-atalho" href="#doses">' + ICO('seringa') + '<b>Doses</b><i>diluição e bulário</i></a>' +
      '<a class="hD-b hD-atalho" href="#queixa">' + ICO('porta') + '<b>Queixas</b><i>sem diagnóstico ainda</i></a>' +
      '<div class="hD-b hD-areas"><h2>Áreas do guia</h2><div>' + d.areas.map(function (x) {
        return '<a href="#' + esc(x.c.id) + '">' + ICO(x.c.icone) + '<span>' + esc(x.c.nome) + '</span></a>';
      }).join('') + '</div></div>' +
    '</div></section>';
  }

  /* E — NOITE: faixa escura que já traz a emergência, áreas em ícones */
  function homeE(d) {
    return '<section class="phase hE">' +
      '<header class="hE-hero">' +
        '<div class="hE-l1"><div><p>' + esc(dataHoje()) + '</p><h1>' + ola(d) + '</h1></div>' +
          '<a class="hE-sos" href="#critico">' + ICO('perigo') + 'Sala vermelha</a></div>' +
        campoBusca('hE-busca') +
        '<div class="hE-chips"><span>Emergência:</span>' + d.crit.slice(0, 6).map(function (p) { return linkP(p, 'hE-chip'); }).join('') + '</div>' +
      '</header>' +
      ((d.favs.length || d.recs.length)
        ? '<div class="hE-rec"><h2>Continuar de onde parou</h2><div>' + d.favs.concat(d.recs).slice(0, 4).map(function (p) {
            var c = catDe(p); return '<a href="' + esc(hrefConduta(p)) + '"><i>' + (c ? esc(c.nome) : '') + '</i><b>' + esc(p.titulo) + '</b></a>';
          }).join('') + '</div></div>' : '') +
      '<h2 class="hE-t">Áreas</h2><div class="hE-areas">' + d.areas.map(function (x) {
        return '<a href="#' + esc(x.c.id) + '"><span>' + ICO(x.c.icone) + '</span><b>' + esc(x.c.nome) + '</b><i>' + x.n + '</i></a>';
      }).join('') + '</div></section>';
  }

  /* o nome salvo pela home */
  doc.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-form-nome]');
    if (!f) return;
    e.preventDefault();
    var v = (f.querySelector('input').value || '').trim();
    if (!v) return;
    grava('pref:nome', v);
    if (window.UI && UI.aviso) UI.aviso('Salvo');
    render();
  });

  /* ---------- favoritas ---------- */
  function renderFavoritas() {
    var favs = (favoritas || []).map(acharConduta).filter(Boolean);
    var rec = recentes().map(function (x) { return typeof x === 'string' ? acharConduta(x) : x; }).filter(Boolean).filter(function (p) { return favs.indexOf(p) === -1; }).slice(0, 12);
    var grupos = [{ nome:'Favoritas', quando:favs.length ? 'marcadas com a estrela' : 'toque na estrela de uma conduta para fixar aqui', itens:favs.map(function (p) { return itemP(p, 'g-' + (p.gravidade || 'rotina')); }) }];
    if (rec.length) grupos.push({ nome:'Abertas há pouco', quando:'neste aparelho', itens:rec.map(function (p) { return itemP(p, 'g-' + (p.gravidade || 'rotina')); }) });
    var html = painel({ cor:'azul', titulo:'Meu plantão', ph:'Filtrar favoritas…', grupos:grupos });
    if (!favs.length && !rec.length) html = html.replace('<div class="sv9-quadro"></div>', '<div class="bz-nada"><b>Nada fixado ainda.</b><span>Abra uma conduta e toque na estrela do topo para ela aparecer aqui.</span></div>');
    doc.innerHTML = html;
  }


  /* ---------- CONFIGURAÇÕES: página inteira, no mesmo console ----------
     Perfil → aparência → leitura → prescrição → validação → dados → sobre.
     Tudo grava neste aparelho na hora: não existe botão "salvar". */
  var AJ_SECS = [
    { id:'aj-perfil',    nome:'Perfil',             ico:'pessoa' },
    { id:'aj-aparencia', nome:'Aparência',          ico:'lua' },
    { id:'aj-leitura',   nome:'Leitura',            ico:'livro' },
    { id:'aj-presc',     nome:'Prescrição e cópia', ico:'receita' },
    { id:'aj-valid',     nome:'Validação clínica',  ico:'escudo' },
    { id:'aj-dados',     nome:'Seus dados',         ico:'empilhar' },
    { id:'aj-sobre',     nome:'Sobre',              ico:'engren' }
  ];
  var AJ_SIM = '<svg viewBox="-4 -4 56 56" fill="none" aria-hidden="true"><mask id="maAj" maskUnits="userSpaceOnUse" x="-4" y="-4" width="56" height="56"><rect x="-4" y="-4" width="56" height="56" fill="#fff"/><path d="M22 28H37" stroke="#000" stroke-width="10"/></mask><g stroke="currentColor" stroke-width="4.6" stroke-linecap="round"><path d="M2.5 40H8L21 7L34 40" stroke-linejoin="miter" stroke-miterlimit="10" mask="url(#maAj)"/><path d="M12.7 28H44.5" stroke-linejoin="round"/><path d="M39 22.5L44.5 28L39 33.5" stroke-linejoin="round"/></g></svg>';
  function ajIniciais(n) {
    var p = String(n || '').replace(/^dra?\.?\s+/i, '').trim().split(/\s+/).filter(Boolean);
    return p.length ? (p[0].charAt(0) + (p[1] ? p[1].charAt(0) : '')).toUpperCase() : '';
  }
  function ajSec(id, titulo, sub, corpo) {
    return '<section class="aj-sec" id="' + id + '"><header class="aj-sec-cab"><h2>' + esc(titulo) + '</h2>' +
      (sub ? '<p>' + esc(sub) + '</p>' : '') + '</header>' + corpo + '</section>';
  }
  function ajSw(k, titulo, sub) {
    var on = !!pref(k, false);
    return '<label class="aj-row aj-tg">' +
      '<span class="aj-rt"><b>' + esc(titulo) + '</b><span>' + esc(sub) + '</span></span>' +
      '<input type="checkbox" role="switch" class="aj-sw-in" data-aj-pref="' + k + '"' + (on ? ' checked' : '') + '>' +
      '<span class="aj-sw" aria-hidden="true"></span></label>';
  }
  function ajSeg(k, titulo, sub, opcoes, atual) {
    return '<div class="aj-row">' +
      '<span class="aj-rt"><b>' + esc(titulo) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</span>' +
      '<div class="aj-seg" role="radiogroup" aria-label="' + esc(titulo) + '">' + opcoes.map(function (o) {
        var on = String(o[0]) === String(atual);
        return '<button type="button" role="radio" aria-checked="' + on + '"' + (on ? ' class="on"' : '') +
          ' data-aj-set="' + k + '" data-v="' + esc(o[0]) + '">' + o[1] + '</button>';
      }).join('') + '</div></div>';
  }
  function ajTema(v, nome, sub, atual) {
    var on = v === atual;
    return '<button type="button" role="radio" aria-checked="' + on + '" class="aj-tema t-' + v + (on ? ' on' : '') + '" data-aj-tema="' + v + '">' +
      '<span class="aj-tema-mini" aria-hidden="true"><i class="m-bar"></i><i class="m-l1"></i><i class="m-l2"></i><i class="m-card"></i></span>' +
      '<span class="aj-tema-txt"><b>' + esc(nome) + '</b><span>' + esc(sub) + '</span></span>' +
      '<span class="aj-tema-ok">' + ICO('check') + '</span></button>';
  }
  function ajSaudacao(n) { return esc(saudacao()) + (n ? ', <em>' + esc(n) + '</em>' : ''); }

  function renderAjustes() {
    var nome = nomeMedico(), ini = ajIniciais(nome), tema = temaEscolhido();
    var zoom = Number(pref('zoom', 1)) || 1;
    var resp = String(pref('responsavel', '') || '').trim(), respData = pref('responsavel-data', '');
    var nFav = (favoritas || []).length, nRec = recentes().length, nEd = 0;
    try { for (var i = 0; i < localStorage.length; i++) { if ((localStorage.key(i) || '').indexOf('ferr:') === 0) nEd++; } } catch (e) {}

    var h = '<section class="tz sv9 aj pg-azul">' +
      '<header class="sv9-barra aj-barra"><div class="sv9-b1">' +
        '<a class="sv9-volta" href="#" aria-label="Voltar ao início">' + ICO('setaEsq') + '</a>' +
        '<div class="cd-tit"><h1>Configurações</h1><p>Tudo fica salvo neste aparelho, na hora.</p></div>' +
        '<span class="aj-off" id="ajOff"><i></i><span>Verificando…</span></span>' +
      '</div></header>' +
      '<div class="aj-grade">' +
        '<nav class="aj-nav" aria-label="Seções das configurações">' + AJ_SECS.map(function (s, k) {
          return '<button type="button" data-aj-ir="' + s.id + '"' + (k === 0 ? ' class="on"' : '') + '>' + ICO(s.ico) + '<span>' + esc(s.nome) + '</span></button>';
        }).join('') + '</nav>' +
        '<div class="aj-corpo">';

    h += ajSec('aj-perfil', 'Perfil', 'Como o MedAtalho fala com você.',
      '<div class="aj-card aj-perfil">' +
        '<span class="aj-av" id="ajAv">' + (ini ? esc(ini) : ICO('pessoa')) + '</span>' +
        '<label class="aj-campo"><span>Como quer ser chamado</span>' +
          '<input type="text" id="ajNome" maxlength="40" autocomplete="off" placeholder="Dr. Gustavo" value="' + esc(nome) + '"></label>' +
        '<div class="aj-previa"><span>Na tela inicial</span><b id="ajPrevia">' + ajSaudacao(nome) + '</b></div>' +
      '</div>');

    h += ajSec('aj-aparencia', 'Aparência', 'Para ler rápido de dia ou às 3 da manhã.',
      '<div class="aj-card">' +
        '<div class="aj-row aj-col"><span class="aj-rt"><b>Tema</b><span>O automático escurece a tela das 19h às 7h, sem você precisar mexer.</span></span>' +
          '<div class="aj-temas" role="radiogroup" aria-label="Tema">' +
            ajTema('claro', 'Claro', 'Padrão', tema) +
            ajTema('escuro', 'Escuro', 'Sempre noturno', tema) +
            ajTema('auto', 'Automático', 'Escuro das 19h às 7h', tema) +
          '</div></div>' +
        ajSeg('zoom', 'Tamanho do texto', 'Aumenta letras e botões de todo o guia.',
          [[1, '<i class="z1">Aa</i>Padrão'], [1.12, '<i class="z2">Aa</i>Grande'], [1.25, '<i class="z3">Aa</i>Maior']], zoom) +
      '</div>');

    h += ajSec('aj-leitura', 'Leitura das condutas', 'O que aparece aberto quando você entra numa conduta.',
      '<div class="aj-card">' +
        ajSw('resumo', 'Só o essencial', 'Fecha os blocos de leitura em todo o guia. O fluxograma nunca fecha.') +
        ajSw('autor', 'Modo autor', 'Mostra as condutas ainda não preenchidas e o progresso de cada área.') +
      '</div>');

    h += ajSec('aj-presc', 'Prescrição e cópia', 'Como receitas e doses abrem, e o que acontece ao copiar.',
      '<div class="aj-card">' +
        ajSeg('rp-modo', 'Receitas abrem em', '', [['casa', 'Para casa'], ['porta', 'Na unidade']], rxModo) +
        ajSeg('dz-modo', 'Doses abrem em', '', [['adulto', 'Adulto'], ['ped', 'Pediatria']], dzModo) +
        ajSw('conferir', 'Conferir antes de copiar', 'Checklist de peso, alergia, função renal e gestação antes de cada cópia.') +
        ajSw('rx-ajustes', 'Ajustes na prescrição', 'Caixas para tirar itens, atalhos de posologia e sintomáticos dentro do quadro.') +
      '</div>');

    h += ajSec('aj-valid', 'Validação clínica', 'Quem revisou o conteúdo usado neste aparelho.',
      '<div class="aj-card">' +
        '<div class="aj-selo ' + (resp ? 'ok' : 'pend') + '">' + ICO(resp ? 'check' : 'alerta') +
          '<span><b>' + (resp ? 'Revisado por ' + esc(resp) : 'Conteúdo ainda não validado') + '</b>' +
          '<span>' + (resp ? 'Registrado em ' + esc(respData || '—') + '. O aviso de conteúdo não validado deixou de aparecer nas condutas.'
                           : 'Enquanto ninguém assinar, toda conduta mostra o aviso de conteúdo não validado.') + '</span></span></div>' +
        '<label class="aj-row aj-col"><span class="aj-rt"><b>Responsável técnico</b><span>Nome e CRM de quem revisou. Apague para voltar a mostrar o aviso.</span></span>' +
          '<input type="text" id="ajResp" maxlength="80" autocomplete="off" placeholder="Dra. Ana Souza · CRM 12345" value="' + esc(resp) + '"></label>' +
      '</div>');

    h += ajSec('aj-dados', 'Seus dados', 'Nada sai deste aparelho sem você exportar.',
      '<div class="aj-card">' +
        '<div class="aj-nums">' +
          '<div><b>' + nFav + '</b><span>Favoritas</span></div>' +
          '<div><b>' + nRec + '</b><span>Abertas há pouco</span></div>' +
          '<div><b>' + nEd + '</b><span>Edições</span></div>' +
        '</div>' +
        '<div class="aj-row"><span class="aj-rt"><b>Backup</b><span>Leve favoritas, modelos e preferências para outro aparelho.</span></span>' +
          '<div class="aj-bts"><button type="button" class="aj-bt forte" data-aj-acao="exportar">Exportar</button>' +
          '<button type="button" class="aj-bt" data-aj-acao="importar">Importar</button></div></div>' +
        '<div class="aj-row"><span class="aj-rt"><b>Histórico</b><span>As condutas abertas há pouco, que aparecem em Meu plantão.</span></span>' +
          '<div class="aj-bts"><button type="button" class="aj-bt" data-aj-acao="limpar-rec"' + (nRec ? '' : ' disabled') + '>Limpar histórico</button></div></div>' +
      '</div>' +
      '<div class="aj-card aj-perigo">' +
        '<div class="aj-row"><span class="aj-rt"><b>Apagar tudo deste aparelho</b><span>Edições, favoritas, histórico e preferências. O conteúdo do guia volta ao padrão e não dá para desfazer.</span></span>' +
          '<div class="aj-bts"><button type="button" class="aj-bt perigo" data-aj-acao="zerar">' + ICO('lixo') + 'Apagar tudo</button></div></div>' +
      '</div>');

    h += ajSec('aj-sobre', 'Sobre', '',
      '<div class="aj-card">' +
        '<div class="aj-marca"><span class="aj-marca-sim">' + AJ_SIM + '</span>' +
          '<span class="aj-marca-t"><b>MedAtalho</b><span>O atalho do plantão</span></span><i class="aj-ver" id="ajVer"></i></div>' +
        '<div class="aj-row"><span class="aj-rt"><b>Uso sem internet</b><span id="ajOffTxt">Verificando…</span></span>' +
          '<div class="aj-bts"><button type="button" class="aj-bt" data-aj-acao="atualizar">Procurar atualização</button></div></div>' +
        '<p class="aj-aviso">' + ICO('alerta') + '<span>Apoio à decisão, redigido a partir de diretrizes brasileiras. Confira dose, apresentação e diretriz vigente antes de prescrever.</span></p>' +
      '</div>');

    doc.innerHTML = h + '</div></div></section>';
    ajDepois();
  }

  var ajObs = null;
  function ajDepois() {
    var on = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
    var chip = document.getElementById('ajOff'), txt = document.getElementById('ajOffTxt');
    if (chip) { chip.classList.toggle('ok', on); chip.lastChild.textContent = on ? 'Pronto sem internet' : 'Só online aqui'; }
    if (txt) txt.textContent = on ? 'O guia inteiro está guardado neste aparelho e abre mesmo sem rede.'
                                  : 'O modo offline liga quando o app é aberto pelo endereço publicado.';
    var ver = document.getElementById('ajVer');
    if (ver && window.caches && caches.keys) caches.keys().then(function (ks) {
      var v = ks.map(function (k) { var m = /v(\d+)/i.exec(k); return m ? +m[1] : 0; }).sort(function (x, y) { return y - x; })[0];
      if (v) ver.textContent = 'versão ' + v;
    }).catch(function () {});
    if (ajObs) { ajObs.disconnect(); ajObs = null; }
    if (!('IntersectionObserver' in window)) return;
    ajObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        [].forEach.call(document.querySelectorAll('.aj-nav button'), function (b) { b.classList.toggle('on', b.dataset.ajIr === en.target.id); });
      });
    }, { rootMargin:'-25% 0px -65% 0px' });
    [].forEach.call(document.querySelectorAll('.aj-sec'), function (s) { ajObs.observe(s); });
  }
  function ajAviso(t, erro) { if (window.UI && UI.aviso) UI.aviso(t, erro); }

  doc.addEventListener('click', function (e) {
    if (modo !== 'ajustes') return;
    var t;
    if ((t = e.target.closest('[data-aj-ir]'))) {
      var alvo = document.getElementById(t.dataset.ajIr);
      if (alvo) window.scrollTo({ top:alvo.getBoundingClientRect().top + window.scrollY - 16, behavior:'smooth' });
      return;
    }
    if ((t = e.target.closest('[data-aj-tema]'))) {
      var y = window.scrollY; defineTema(t.dataset.ajTema); renderAjustes(); window.scrollTo(0, y); return;
    }
    if ((t = e.target.closest('[data-aj-set]'))) {
      var k = t.dataset.ajSet, v = t.dataset.v;
      if (k === 'zoom') {
        v = Number(v) || 1; grava('pref:zoom', v);
        if (v > 1) document.documentElement.style.setProperty('--zoom', v); else document.documentElement.style.removeProperty('--zoom');
      } else if (k === 'rp-modo') { rxModo = v; grava('pref:rp-modo', v); }
      else if (k === 'dz-modo') { dzModo = v; grava('pref:dz-modo', v); }
      [].forEach.call(t.parentNode.children, function (b) { var on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
      ajAviso('Salvo');
      return;
    }
    if ((t = e.target.closest('[data-aj-acao]'))) {
      var a = t.dataset.ajAcao;
      var velho = { exportar:'btnExportar', importar:'btnImportar', zerar:'btnZerar' }[a];
      if (velho) { var bv = document.getElementById(velho); if (bv) bv.click(); return; }
      if (a === 'limpar-rec') { grava('recentes', []); ajAviso('Histórico limpo'); renderAjustes(); return; }
      if (a === 'atualizar') {
        if (!navigator.serviceWorker || !navigator.serviceWorker.getRegistration) { ajAviso('Este navegador não guarda o app offline'); return; }
        t.disabled = true; t.textContent = 'Procurando…';
        navigator.serviceWorker.getRegistration().then(function (r) {
          if (!r) { ajAviso('Modo offline ainda não ligado neste endereço'); return; }
          return r.update().then(function () {
            ajAviso(r.installing || r.waiting ? 'Versão nova chegando — o app avisa quando estiver pronta' : 'Você já está na versão mais recente');
          });
        }).catch(function () { ajAviso('Sem conexão para procurar agora', true); })
          .then(function () { t.disabled = false; t.textContent = 'Procurar atualização'; });
      }
    }
  });
  doc.addEventListener('change', function (e) {
    if (modo !== 'ajustes') return;
    var t = e.target;
    if (t.matches('[data-aj-pref]')) {
      var k = t.dataset.ajPref, on = t.checked;
      grava('pref:' + k, on);
      if (k === 'autor') document.body.classList.toggle('autor', on);
      if (k === 'rx-ajustes') document.body.classList.toggle('rx-ajustes', on);
      if (k === 'resumo') { if (on) soEssencial(); else tudoVisivel(); }
      var espelho = document.getElementById({ autor:'optAutor', resumo:'optResumo', conferir:'optConferir', 'rx-ajustes':'optRxAjustes' }[k]);
      if (espelho) espelho.checked = on;
      ajAviso(on ? 'Ligado' : 'Desligado');
      return;
    }
    if (t.id === 'ajNome') {
      var n = t.value.trim(); grava('pref:nome', n);
      var en = document.getElementById('optNome'); if (en) en.value = n;
      ajAviso('Salvo'); return;
    }
    if (t.id === 'ajResp') {
      var r = t.value.trim();
      grava('pref:responsavel', r);
      grava('pref:responsavel-data', r ? new Date().toLocaleDateString('pt-BR') : '');
      var er = document.getElementById('optResponsavel'); if (er) er.value = r;
      var y = window.scrollY; renderAjustes(); window.scrollTo(0, y);
      ajAviso(r ? 'Validação registrada' : 'Validação removida');
    }
  });
  doc.addEventListener('input', function (e) {
    if (modo !== 'ajustes' || e.target.id !== 'ajNome') return;
    var n = e.target.value.trim();
    var p = document.getElementById('ajPrevia'); if (p) p.innerHTML = ajSaudacao(n);
    var av = document.getElementById('ajAv'); if (av) { var i = ajIniciais(n); av.innerHTML = i ? esc(i) : ICO('pessoa'); }
  });

  function renderDoc(resultados) {
    if (resultados) { renderBusca(resultados); return; }
    if (modo === 'home')      { renderHome(); return; }
    if (modo === 'favoritas') { renderFavoritas(); return; }
    if (modo === 'ajustes')   { renderAjustes(); return; }
    if (modo === 'areas')     { renderAreas(); return; }
    if (modo === 'urgencias') { renderUrgencias(); return; }
    if (modo === 'doses') { renderDosesNovo(); return; }
    if (modo === 'droga') { renderDroga(drogaAtual); return; }
    if (modo === 'critico') { renderCritico(); return; }
    if (modo === 'queixa' && temQueixas()) {
      var q = queixaAtual && acharQueixa(queixaAtual);
      if (q) { renderQueixa(q); return; }
      renderQueixas(); return;
    }

    /* seções de topo */
    if (modo === 'secao' && temFerramentas() && !(secAtual === 'pediatria') && !(secAtual === 'presc' && !subSecao && !window.__rxCompleto)) {
      var sec = Ferramentas.secoes.filter(function (s) { return s.id === secAtual; })[0];
      if (sec) {
        var filhas = sec.filhas ? sec.filhas() : [];
        var filha = filhas.filter(function (x) { return x.id === subSecao; })[0];
        var COR = { eletrolitos:'azul', calc:'azul', scores:'azul', prontuario:'verde', atestado:'verde', presc:'verde', regulacao:'laranja', notificacao:'amarelo' };
        doc.innerHTML = '<section class="tz sv9 fr pg-' + (COR[sec.id] || 'azul') + '">' +
          '<header class="sv9-barra fr-barra">' +
            '<div class="sv9-b1">' +
              '<a class="sv9-volta" href="' + (filha ? '#' + sec.id : '#') + '" aria-label="Voltar">' + ICO('setaEsq') + '</a>' +
              '<div class="cd-tit"><h1>' + esc(filha ? filha.nome : sec.nome) + '</h1>' + (filha ? '<p>' + esc(sec.nome) + '</p>' : '') + '</div>' +
              '<nav class="fr-secs">' + [{ id:'doses', nome:'Doses e pediatria', icone:'seringa' }].concat(Ferramentas.secoes.filter(function (s) { return s.id !== 'pediatria' && s.id !== 'presc'; })).map(function (s) {
                var curto = { doses:'Doses', presc:'Receitas', eletrolitos:'Eletrólitos', calc:'Cálculos', calculadoras:'Cálculos', scores:'Scores', prontuario:'Prontuário' }[s.id] || s.nome;
                return '<a href="#' + s.id + '" class="' + (s.id === sec.id ? 'on' : '') + '" title="' + esc(s.nome) + '"' + (s.id === sec.id ? ' aria-current="page"' : '') + '>' + ICO(s.icone) +
                  '<span class="fr-sl">' + esc(s.nome) + '</span><span class="fr-sc">' + esc(curto) + '</span></a>';
              }).join('') + '</nav>' +
              '<button type="button" class="tz-bt" data-proxy="btnBancTop" title="Rascunho">' + ICO('empilhar') + '</button>' +
            '</div>' +
            (filhas.length > 1 ? '<nav class="sv9-saltos fr-filhas">' + filhas.map(function (x, n) {
              return '<a href="#' + sec.id + '/' + x.id + '" class="' + (x.id === subSecao ? 'on' : '') + '"><i>' + dois(n + 1) + '</i>' + esc(x.nome) + '</a>';
            }).join('') + '</nav>' : '') +
          '</header><div class="fr-corpo" id="frCorpo"></div></section>';
        Ferramentas.desenhaSecao(document.getElementById('frCorpo'), secAtual, subSecao);
        return;
      }
    }
    if (modo === 'secao' && temFerramentas()) {
      if (secAtual === 'pediatria' && Ferramentas.ped) { dzModo = 'ped'; renderDosesNovo(); return; }
      if (secAtual === 'presc' && !subSecao && !window.__rxCompleto && Ferramentas.textoRx) { renderReceitas(); return; }
      Ferramentas.desenhaSecao(doc, secAtual, subSecao);
      return;
    }

    /* seção de antibióticos */
    if (modo === 'atb' && temFerramentas()) {
      Ferramentas.desenhaAtb(doc, sitioAtb);
      return;
    }

    /* aba de ferramentas */
    if (modo === 'ferramentas' && temFerramentas()) {
      Ferramentas.desenha(doc, abaFerr);
      return;
    }

    /* vista isolada */
    if (condutaAtual) {
      var alvo = acharConduta(condutaAtual);
      if (alvo) { renderConduta(alvo); return; }
      condutaAtual = null;
    }

    /* lista da area: o mesmo painel das outras listas, em azul */
    var ci = indiceArea(areaAtual);
    var c  = CATEGORIAS[ci];
    var lista = listaArea(c.id);
    var todas = porCategoria(c.id);
    var gAtual = subAtual && acharSub(c.id, subAtual);
    var cel = celular(), todasHash = /\/todas$/.test(location.hash);
    function itG(p) {
      var g = p.gravidade || 'rotina';
      return { href:hrefConduta(p), titulo:p.titulo, sub:p.resumo ? cru(p.resumo) : '', cls:'g-' + g };
    }
    var grupos;
    if (!lista.length) grupos = [];
    else if (gAtual) grupos = ['emergencia', 'urgencia', 'rotina'].map(function (k) {
      return { nome:FXA_GRAV[k].rot, quando:FXA_GRAV[k].sub, itens:listaSub(gAtual).filter(function (p) { return (p.gravidade || 'rotina') === k; }).map(itG) };
    });
    else if (subsDe(c.id).length) grupos = subsDe(c.id).map(function (g) {
      var l = listaSub(g);
      var ne = l.filter(function (p) { return p.gravidade === 'emergencia'; }).length;
      return { nome:g.nome, quando:ne ? ne + (ne === 1 ? ' emergência' : ' emergências') : 'sem emergência', itens:l.map(itG), ver:'#' + c.id + '/' + g.id };
    });
    else grupos = ['emergencia', 'urgencia', 'rotina'].map(function (k) {
      return { nome:FXA_GRAV[k].rot, quando:FXA_GRAV[k].sub, itens:lista.filter(function (p) { return (p.gravidade || 'rotina') === k; }).map(itG) };
    });
    var seletor = '<label class="pg-area"><select data-ir-area aria-label="Trocar de área">' + CATEGORIAS.map(function (x) {
      if (!listaArea(x.id).length && !modoAutor()) return '';
      return '<option value="' + esc(x.id) + '"' + (x.id === c.id ? ' selected' : '') + '>' + esc(x.nome) + '</option>';
    }).join('') + '</select>' + ICO('setaBai') + '</label>';
    var legenda = '<div class="pg-legenda"><span class="g-emergencia"><i></i>Emergência</span><span class="g-urgencia"><i></i>Urgência</span><span class="g-rotina"><i></i>Rotina</span></div>';
    var html = painel({ cor:'azul', titulo:gAtual ? gAtual.nome : (cel ? c.nome : 'Guia clínico'),
      volta:gAtual || (cel && todasHash) ? '#' + c.id : (cel ? '#guia' : '#'),
      extra:cel ? '' : seletor, legenda:legenda, ph:'Filtrar em ' + (gAtual ? gAtual.nome : c.nome) + '…', grupos:grupos });
    if (!lista.length) html = html.replace('<div class="sv9-quadro"></div>', '<div class="pendente">Esta área ainda não tem conduta preenchida. Ligue o <a href="#ajustes"><b>modo autor</b></a> nas configurações para ver as ' + todas.length + ' pendentes.</div>');
    doc.innerHTML = html;
  }

  /* ---------- GUIA CLÍNICO por níveis (celular): áreas → subáreas → condutas ---------- */
  function gcCard(href, ico, nome, conta, emerg, cls) {
    return '<a class="gc-card' + (cls ? ' ' + cls : '') + '" href="' + esc(href) + '" data-busca="' + esc(normaliza(nome)) + '">' +
      '<span class="gc-i">' + ICO(ico || 'livro') + '</span><b>' + esc(nome) + '</b>' +
      '<span class="gc-m"><i>' + esc(conta) + '</i>' + (emerg ? '<em>' + emerg + (emerg === 1 ? ' emergência' : ' emergências') + '</em>' : '') + '</span></a>';
  }
  function gcBarra(volta, titulo, total, ph, escopo) {
    return '<header class="sv9-barra"><div class="sv9-b1">' +
      '<a class="sv9-volta" href="' + esc(volta) + '" aria-label="Voltar">' + ICO('setaEsq') + '</a>' +
      '<h1>' + esc(titulo) + '<span>' + total + '</span></h1>' +
      '<label class="sv9-filtro">' + ICO('lupa') + '<input type="search" id="gcBusca" data-escopo="' + esc(escopo) + '" autocomplete="off" enterkeyhint="search" placeholder="' + esc(ph) + '" aria-label="Buscar conduta"></label>' +
    '</div></header>';
  }
  function nEmerg(l) { return l.filter(function (p) { return p.gravidade === 'emergencia'; }).length; }
  /* primeira tela: uma lista única, linhas finas, ícone com a cor da área */
  var GC_TOM = ['#E5372B','#0038E5','#7C3AED','#F57C1F','#0E9F8E','#DB2777','#1F9D55','#B7791F','#0891B2','#4F46E5','#64748B','#C2410C','#0F766E','#9333EA','#2563EB','#BE123C'];
  function renderAreas() {
    var total = 0, k = 0;
    var linhas = CATEGORIAS.map(function (c) {
      var l = listaArea(c.id); if (!l.length && !modoAutor()) return '';
      total += l.length;
      var ne = nEmerg(l), tom = GC_TOM[k++ % GC_TOM.length];
      return '<a class="gc-row" href="#' + esc(c.id) + '" data-busca="' + esc(normaliza(c.nome)) + '" style="--gc:' + tom + '">' +
        '<span class="gc-ri">' + ICO(c.icone || 'livro') + '</span>' +
        '<span class="gc-rt"><b>' + esc(c.nome) + '</b><i>' + l.length + (l.length === 1 ? ' conduta' : ' condutas') + '</i></span>' +
        (ne ? '<span class="gc-re" title="' + ne + (ne === 1 ? ' emergência' : ' emergências') + '"><i></i>' + ne + '</span>' : '') +
        ICO('setaDir') + '</a>';
    }).join('');
    doc.innerHTML = '<section class="tz sv9 pg-azul gc">' + gcBarra('#', 'Guia clínico', total, 'Buscar conduta em todas as áreas…', '*') +
      '<div class="gc-t gc-t2" id="gcLeg"><span>Áreas</span><span class="gc-leg"><i></i>emergências</span></div>' +
      '<nav class="gc-lista2" id="gcGrade" aria-label="Áreas do guia">' + linhas + '</nav>' +
      '<div class="gc-res" id="gcRes" hidden></div></section>';
  }
  function renderSubareas(c, lista) {
    var cards = subsDe(c.id).map(function (g) {
      var l = listaSub(g); if (!l.length) return '';
      return gcCard('#' + c.id + '/' + g.id, c.icone, g.nome, l.length + (l.length === 1 ? ' conduta' : ' condutas'), nEmerg(l));
    }).join('');
    doc.innerHTML = '<section class="tz sv9 pg-azul gc">' + gcBarra('#guia', c.nome, lista.length, 'Buscar em ' + c.nome + '…', c.id) +
      '<p class="gc-t">Escolha o tema</p><div class="gc-grade" id="gcGrade">' + cards +
        gcCard('#' + c.id + '/todas', 'menu', 'Todas as condutas de ' + c.nome, lista.length + ' condutas', 0, 'todas') + '</div>' +
      '<div class="gc-res" id="gcRes" hidden></div></section>';
  }
  /* busca das telas de nível: condutas que batem, em lista única */
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'gcBusca') return;
    var q = normaliza(e.target.value.trim()), esc0 = e.target.dataset.escopo;
    var grade = document.getElementById('gcGrade'), res = document.getElementById('gcRes'), tt = doc.querySelector('.gc-t');
    if (!q) { res.hidden = true; res.innerHTML = ''; grade.hidden = false; if (tt) tt.hidden = false; return; }
    var base = esc0 === '*' ? CATEGORIAS.reduce(function (t, c) { return t.concat(listaArea(c.id)); }, []) : listaArea(esc0);
    var achou = base.filter(function (p) { return normaliza(p.titulo + ' ' + cru(p.resumo || '')).indexOf(q) !== -1; });
    res.innerHTML = '<p class="gc-n">' + (achou.length ? achou.length + (achou.length === 1 ? ' conduta' : ' condutas') : 'Nenhuma conduta com esse termo.') + '</p>' +
      (achou.length ? '<div class="sv9-g gc-lista"><div class="sv9-g-l">' + achou.map(function (p) {
        var cat = esc0 === '*' ? catDe(p) : null;
        return '<a class="sv9-it g-' + (p.gravidade || 'rotina') + '" href="' + esc(hrefConduta(p)) + '"><i class="sv9-dot"></i><span><b>' + esc(p.titulo) + '</b>' +
          '<em>' + esc(cat ? cat.nome : cru(p.resumo || '')) + '</em></span>' + ICO('setaDir') + '</a>';
      }).join('') + '</div></div>' : '');
    res.hidden = false; grade.hidden = true; if (tt) tt.hidden = true;
  });

  function render() {
    var res = resultadosBusca();
    side.classList.toggle('buscando', !!res);
    /* na home a busca do topo some: a do painel é a que vale */
    document.body.classList.toggle('na-home', (modo === 'home' || modo === 'ajustes' || modo === 'areas' || modo === 'favoritas' || modo === 'doses' || modo === 'droga' || modo === 'secao' || (modo === 'secao' && secAtual === 'presc' && !subSecao && !window.__rxCompleto) || modo === 'critico' || modo === 'urgencias' || modo === 'queixa' || modo === 'guia') || !!res);
    renderSumario(res);
    renderDoc(res);
    renderAbasTopo(res);
    eyebrow(res);
    ajustaBarra();
  }

  /* ---------- celular: barra grudada só com a tira de atalhos ----------
     A barra escura das listas é alta demais para ficar inteira na tela.
     Com top negativo ela rola junto até sobrar só a tira de atalhos. */
  function barraVisivel(b) {
    if (!b || getComputedStyle(b).position !== 'sticky') return 0;
    return Math.max(0, b.offsetHeight + (parseFloat(b.style.top) || 0));
  }
  function ajustaBarra() {
    /* tira de seções das ferramentas: a ativa sempre à vista */
    var on = celular() && doc.querySelector('.fr-filhas a.on, .dz2-rail a.on');
    if (on) {
      var n = on.parentElement, dx = on.getBoundingClientRect().left - n.getBoundingClientRect().left;
      if (dx < 0 || dx + on.offsetWidth > n.clientWidth) n.scrollLeft += dx - 14;
    }
    var b = doc.querySelector('.sv9-barra');
    if (!b) return;
    b.style.top = '';
    if (!celular() || getComputedStyle(b).position !== 'sticky') return;
    var s = b.querySelector('.sv9-saltos');
    b.style.top = (s ? -(s.offsetTop - 8) : -(b.offsetHeight + 24)) + 'px';
  }
  if (window.MutationObserver) new MutationObserver(function () { requestAnimationFrame(ajustaBarra); }).observe(doc, { childList:true });
  window.addEventListener('resize', ajustaBarra);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustaBarra);

  /* ---------- abas principais no topo ----------
     A mesma lista do sumário (acesso rápido + ferramentas + guia), em linha
     rolável sob o cabeçalho. O sumário completo continua na gaveta. */
  var abasTopo = document.getElementById('abasTopo');
  function renderAbasTopo(res) {
    if (!abasTopo) return;
    var itens = [];
    itens.push({ href:celular() ? '#guia' : '#' + (areaAtual || (CATEGORIAS[0] && CATEGORIAS[0].id) || ''), nome:'Guia clínico', ico:'livro',
                 on: !res && (modo === 'guia' || modo === 'areas' || !!condutaAtual) });
    if (temQueixas()) {
      itens.push({ href:'#queixa', nome:'Queixas', ico:'porta', on: !res && modo === 'queixa' });
      itens.push({ href:'#critico', nome:'Sala vermelha', ico:'perigo', on: !res && modo === 'critico' });
    }
    itens.push({ href:'#doses', nome:'Doses', ico:'seringa', on: !res && (modo === 'doses' || modo === 'droga') });
    if (temFerramentas()) Ferramentas.secoes.forEach(function (sec) {
      itens.push({ href:'#' + sec.id, nome:sec.nome, ico:sec.icone,
                   on: !res && ((modo === 'secao' && secAtual === sec.id) || (modo === 'atb' && sec.id === 'presc')) });
    });
    abasTopo.innerHTML = itens.map(function (i) {
      return '<a class="aba-topo' + (i.on ? ' on' : '') + '" href="' + esc(i.href) + '"' +
        (i.on ? ' aria-current="page"' : '') + '>' + ICO(i.ico) + '<span>' + esc(i.nome) + '</span></a>';
    }).join('');
    var on = abasTopo.querySelector('.on');
    if (on && on.scrollIntoView) {
      var r = on.getBoundingClientRect(), b = abasTopo.getBoundingClientRect();
      if (r.left < b.left || r.right > b.right) abasTopo.scrollLeft += r.left - b.left - 12;
    }
  }

  /* linha pequena azul acima do título da página (PASTA / VIA ORAL no
     app de referência): diz de onde a tela vem. Só rotula, não navega. */
  function rotuloEyebrow(res) {
    if (res) return 'Busca';
    if (modo === 'home') return '';
    if (modo === 'favoritas') return 'Meu plantão';
    if (modo === 'doses' || modo === 'droga') return modo === 'droga' ? 'Bulário' : 'Acesso rápido';
    if (modo === 'critico') return 'Acesso rápido';
    if (modo === 'queixa') return queixaAtual ? 'Queixas' : 'Acesso rápido';
    if (modo === 'secao') {
      var sec = temFerramentas() && Ferramentas.secoes ? Ferramentas.secoes.filter(function (x) { return x.id === secAtual; })[0] : null;
      return subSecao && sec ? sec.nome : 'Ferramentas';
    }
    if (modo === 'atb') return sitioAtb ? 'Antibióticos' : 'Ferramentas';
    if (modo === 'ferramentas') return 'Ferramentas';
    if (condutaAtual) {
      var p = acharConduta(condutaAtual);
      var c = p && area(p.categoria);
      return c ? c.nome : 'Guia clínico';
    }
    return 'Guia clínico';
  }
  function eyebrow(res) {
    var txt = rotuloEyebrow(res);
    if (!txt) return;
    var h = doc.querySelector('.phase-head h2, .solo-head h2, .atb-titulo h2');
    if (!h || h.querySelector('.eyebrow')) return;
    var e = document.createElement('span');
    e.className = 'eyebrow';
    e.textContent = txt;
    h.insertBefore(e, h.firstChild);
  }
  /* as Ferramentas redesenham por conta própria: repõe o eyebrow quando o doc muda */
  if (window.MutationObserver) {
    var eyebrowPend = false;
    new MutationObserver(function () {
      if (eyebrowPend) return;
      eyebrowPend = true;
      requestAnimationFrame(function () { eyebrowPend = false; eyebrow(resultadosBusca()); });
    }).observe(doc, { childList: true });
  }

  /* ---------- rota: #area  ou  #area/conduta ---------- */
  function lerHash() {
    var h = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    var partes = h.split('/');
    condutaAtual = null;
    modo = 'guia';
    abaFerr = null;
    if (!h) { modo = 'home'; return; }
    if (LEGADO[h]) { location.replace('#' + LEGADO[h]); return; }
    if (partes[0] === 'favoritas') { modo = 'favoritas'; return; }
    if (partes[0] === 'guia') { modo = 'areas'; return; }
    if (partes[0] === 'ajustes' || partes[0] === 'configuracoes') { modo = 'ajustes'; return; }
    if (partes[0] === 'urgencias') { modo = 'urgencias'; return; }
    if (partes[0] === 'queixa') { modo = 'queixa'; queixaAtual = partes[1] || null; return; }
    if (partes[0] === 'doses') { modo = 'doses'; dosesGrupo = partes[1] || null; return; }
    if (partes[0] === 'droga') { modo = 'droga'; drogaAtual = partes[1] || null; return; }
    if (partes[0] === 'critico') { modo = 'critico'; return; }
    if (partes[0] === 'atb') {
      /* antibióticos moram nas Prescrições */
      if (temFerramentas() && Ferramentas.irAtb) Ferramentas.irAtb(partes[1] || null);
      location.replace('#presc'); return;
    }
    if (ehSecao(partes[0])) {
      modo = 'secao'; secAtual = partes[0]; subSecao = partes[1] || null;
      return;
    }
    if (partes[0] === 'ferramentas') {
      modo = 'ferramentas';
      abaFerr = partes[1] || null;
      return;
    }
    if (existeArea(partes[0])) { areaAtual = partes[0]; areaAberta = areaAtual; }
    subAtual = null;
    /* #area/<sub> ou #area/<conduta> ou #area/<sub>/<conduta>.
       A conduta resolve primeiro, para nao quebrar os links antigos. */
    if (partes[1]) {
      var p = acharConduta(partes[1]);
      if (p) {
        condutaAtual = p.id; areaAtual = p.categoria; areaAberta = p.categoria;
      } else if (acharSub(areaAtual, partes[1])) {
        subAtual = partes[1];
        var p2 = partes[2] && acharConduta(partes[2]);
        if (p2) { condutaAtual = p2.id; areaAtual = p2.categoria; areaAberta = p2.categoria; }
      }
    }
    if (condutaAtual && !subAtual) {
      var d = subDaConduta(acharConduta(condutaAtual));
      if (d) subAtual = d.sub.id;
    }
    subAberta = subAtual;
  }

  /* ---------- init ---------- */
  lerHash();
  render();

  window.addEventListener('hashchange', function () {
    lerHash();
    if (termoBusca) { busca.value = ''; termoBusca = ''; }
    render();
    window.scrollTo(0, 0);
  });

  busca.addEventListener('input', function () {
    if (!termoBusca) escopoBusca = 'tudo';   /* busca nova começa em "Tudo" */
    termoBusca = busca.value;
    render();
  });
  doc.addEventListener('click', function (e) {
    var ab = e.target.closest('[data-escopo]');
    if (!ab) return;
    escopoBusca = ab.dataset.escopo;
    render();
    var c = document.getElementById('heroBusca');
    if (c) c.focus();
  });
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-bz-limpa]')) return;
    e.preventDefault(); busca.value = ''; termoBusca = ''; render();
  });
  doc.addEventListener('keydown', function (e) {
    if (e.target.id === 'heroBusca' && e.key === 'Escape') { busca.value = ''; termoBusca = ''; render(); }
  });
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'heroBusca') return;
    busca.value = e.target.value;
    if (!termoBusca) escopoBusca = 'tudo';
    termoBusca = busca.value;
    render();
    var h = document.getElementById('heroBusca');
    var alvoF = h || busca;
    if (termoBusca || h) {
      alvoF.focus();
      try { alvoF.setSelectionRange(alvoF.value.length, alvoF.value.length); } catch (x) { /* search */ }
    }
  });
  busca.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { busca.value = ''; termoBusca = ''; render(); busca.blur(); }
  });

  /* ---------- tema: claro (padrão), escuro ou automático à noite ---------- */
  var btnTema = document.getElementById('btnTema');
  function temaEscolhido() {
    var t = null;
    try { t = localStorage.getItem('tema'); } catch (e) { /* modo privado */ }
    return t === 'escuro' || t === 'auto' ? t : 'claro';
  }
  function ehNoite() { var hh = new Date().getHours(); return hh >= 19 || hh < 7; }
  function temaEfetivo() {
    return document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro';
  }
  function pintaBotaoTema() {
    var escuro = temaEfetivo() === 'escuro';
    btnTema.innerHTML = ICO(escuro ? 'sol' : 'lua');
    btnTema.title = escuro ? 'Voltar ao modo claro' : 'Modo noturno';
  }
  function aplicaTema() {
    var t = temaEscolhido();
    var ef = (t === 'escuro' || (t === 'auto' && ehNoite())) ? 'escuro' : 'claro';
    document.documentElement.dataset.tema = ef;
    /* a barra do navegador acompanha o tema */
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', ef === 'escuro' ? '#0B1220' : '#F4F6FB');
    pintaBotaoTema();
    return ef;
  }
  function defineTema(t) {
    try { localStorage.setItem('tema', t); } catch (e) { /* modo privado */ }
    var ef = aplicaTema();
    if (window.UI && UI.anuncia) UI.anuncia(ef === 'escuro' ? 'Modo noturno ligado' : 'Modo claro');
  }
  /* o botão rápido escolhe o oposto do que está na tela */
  btnTema.addEventListener('click', function () {
    defineTema(temaEfetivo() === 'escuro' ? 'claro' : 'escuro');
    if (modo === 'ajustes') renderAjustes();
  });
  aplicaTema();
  setInterval(function () { if (temaEscolhido() === 'auto') aplicaTema(); }, 60000);

  /* ---------- sumario: a area abre e fecha no mesmo clique ---------- */
  toc.addEventListener('click', function (e) {
    var a = e.target.closest('a.toplink[data-area]');
    if (!a) return;
    var id = a.dataset.area;
    var h  = decodeURIComponent((location.hash || '').replace(/^#/, ''));

    if (areaAberta === id) {
      /* ja estava aberta: so recolhe, sem sair da pagina */
      e.preventDefault();
      areaAberta = null;
      renderSumario(resultadosBusca());
      return;
    }

    areaAberta = id;
    /* se o hash ja aponta para esta area, nao havera hashchange:
       redesenha o sumario na mao para a lista aparecer */
    if (h === id) {
      e.preventDefault();
      renderSumario(resultadosBusca());
      return;
    }
    /* nos outros casos o link navega e a rota cuida do resto */
  });

  /* ---------- ponte para o ui.js ---------- */
  window.Guia = {
    render: render,
    limpaBusca: function () { busca.value = ''; termoBusca = ''; render(); },
    buscando: function () { return !!termoBusca; },
    prefMudou: function () { render(); },
    presetBlocos: function (essencial) {
      if (essencial) soEssencial(); else tudoVisivel();
      render();
    }
  };

  /* ---------- teclado: "/" cai na busca ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
    e.preventDefault();
    var hero = document.getElementById('heroBusca');
    var alvo = hero || busca;
    alvo.focus();
    alvo.select();
  });

  /* ---------- filtro de blocos da conduta ---------- */
  doc.addEventListener('click', function (e) {
    if (e.target.closest('[data-limpa-recentes]')) {
      grava('recentes', []); render(); return;
    }
    var bp = e.target.closest('[data-presc]');
    if (bp) {
      var alvo = acharConduta(bp.dataset.presc);
      var txt = alvo && textoPrescricao(alvo);
      if (!txt) return;
      if (window.Ferramentas && Ferramentas.copiarClinico) Ferramentas.copiarClinico(txt, alvo.titulo, 'presc');
      return;
    }
    var b = e.target.closest('[data-dobra]');
    if (!b) return;
    /* dentro do bloco ainda tem link e botão de copiar: não roubar o clique */
    if (e.target.closest('a, button, input, textarea, select')) return;
    dobra(b);
  });

  function dobra(b) {
    var fechando = !b.classList.contains('dobrado');
    alternaBloco(b.dataset.dobra);
    var y = window.scrollY;
    render();
    window.scrollTo(0, y);
    if (window.UI && UI.aviso) UI.aviso(fechando ? 'Bloco fechado' : 'Bloco aberto');
  }

  /* mesma dobra pelo teclado */
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var b = e.target.closest && e.target.closest('[data-dobra]');
    if (!b || b !== e.target) return;
    e.preventDefault();
    dobra(b);
  });

  /* ---------- copiar o link da conduta ---------- */
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-link]')) return;
    var url = location.href;
    function ok()  { if (window.UI) UI.aviso('Link copiado'); }
    function nao() { if (window.UI) UI.aviso('Não consegui copiar o link', true); }
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(ok, nao);
    } else {
      try {
        var a = document.createElement('textarea');
        a.value = url; a.style.cssText = 'position:fixed;top:-1000px';
        document.body.appendChild(a); a.select();
        document.execCommand('copy') ? ok() : nao();
        document.body.removeChild(a);
      } catch (err) { nao(); }
    }
  });

  /* ---------- a chamada da home leva o foco ao campo do topo ---------- */
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-foco="busca"]')) return;
    busca.focus();
    busca.scrollIntoView({ block: 'center' });
    /* pisca uma vez, para o olho achar onde o foco caiu */
    busca.classList.add('destacada');
    setTimeout(function () { busca.classList.remove('destacada'); }, 900);
  });

  /* ---------- resultado que abre um item ja expandido nas Ferramentas ---------- */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-abre]');
    if (!a || !temFerramentas()) return;
    var p = a.dataset.abre.split(':');
    Ferramentas.abrirItem(p[0], p.slice(1).join(':'));
  });

  /* ---------- favoritar ---------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fav]');
    if (!b) return;
    var id = b.dataset.fav;
    alternaFavorita(id);
    var on = ehFavorita(id);
    b.classList.toggle('on', on);
    b.innerHTML = ICO('estrela'); b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  /* copiar a prescricao para o prontuario */
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-copiar');
    if (!btn) return;
    var p = acharConduta(condutaAtual);
    if (!p) return;
    var caixas = [].slice.call(doc.querySelectorAll('.presc'));
    var i = caixas.indexOf(btn.closest('.presc'));
    var secs = (p.secoes || []).filter(function (s) { return s.tipo === 'prescricao'; });
    var sec = secs[i] || secs[0];
    if (!sec) return;
    var texto = prescTexto(p, sec);
    var ok = function () {
      btn.innerHTML = ICO('check') + 'Copiado';
      setTimeout(function () { btn.textContent = 'Copiar'; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok, function () { fallback(texto, ok); });
    } else {
      fallback(texto, ok);
    }
  });

  function fallback(texto, ok) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.cssText = 'position:fixed;top:-1000px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); ok(); } catch (err) { /* silencio */ }
    document.body.removeChild(ta);
  }
})();
