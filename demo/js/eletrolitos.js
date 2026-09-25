/* ===========================================================
   ELETRÓLITOS — hub hidroeletrolítico
   Sete ferramentas: valor (ou resposta) entra, classificação e
   prescrição de bancada saem, com diluição, vazão e o que vigiar.
   Conteúdo derivado das condutas do guia (dados.js: hipocalemia,
   hipercalemia, hiponatremia, hipernatremia, calcio, acido-base).
   Rota: #eletrolitos e #eletrolitos/<id>. Estado só em memória.
   =========================================================== */
(function () {
  'use strict';

  var E = {};
  var ICO = window.ICO || function () { return ''; };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function num(v) {
    if (v === undefined || v === null || v === '') return null;
    var n = parseFloat(String(v).replace(',', '.'));
    return isFinite(n) ? n : null;
  }
  function f(n, d) {
    var p = Math.pow(10, d === undefined ? 1 : d);
    return String(Math.round(n * p) / p).replace('.', ',');
  }
  function pesoGlobal() {
    var el = document.getElementById('peso');
    var v = el ? num(el.value) : null;
    return (v && v > 0 && v <= 300) ? v : null;
  }

  /* ---------- estado por ferramenta ---------- */
  var val = {};
  function v(id) { return val[id] || (val[id] = {}); }

  /* ---------- peças de tela ---------- */
  function campoNum(id, k, rot, ph, extra) {
    var s = v(id)[k];
    return '<label class="el-campo"><span>' + esc(rot) + '</span>' +
      '<input type="text" inputmode="decimal" autocomplete="off" placeholder="' + esc(ph || '') + '"' +
      ' data-el="' + id + '" data-k="' + k + '" value="' + esc(s === undefined ? '' : s) + '"' +
      (extra || '') + '></label>';
  }
  function grande(id, k, rot, unidade, ph) {
    var s = v(id)[k];
    return '<label class="el-grande"><span class="el-grande-rot">' + esc(rot) + '</span>' +
      '<span class="el-grande-caixa"><input type="text" inputmode="decimal" autocomplete="off" autofocus placeholder="' + esc(ph || '') + '"' +
      ' data-el="' + id + '" data-k="' + k + '" value="' + esc(s === undefined ? '' : s) + '">' +
      '<i>' + esc(unidade) + '</i></span></label>';
  }
  function opcoes(id, k, rot, lista) {
    var s = v(id)[k];
    return '<div class="el-opcoes"><span class="el-opcoes-rot">' + esc(rot) + '</span><div class="el-seg">' +
      lista.map(function (o) {
        return '<button type="button" class="el-op' + (String(s) === String(o[0]) ? ' on' : '') +
          '" data-el-op="' + id + '" data-k="' + k + '" data-v="' + esc(o[0]) + '">' + esc(o[1]) + '</button>';
      }).join('') + '</div></div>';
  }
  function status(cls, titulo, sub) {
    return '<div class="el-status ' + cls + '"><b>' + esc(titulo) + '</b>' +
      (sub ? '<span>' + esc(sub) + '</span>' : '') + '</div>';
  }
  /* uma prescrição de bancada: título, linha copiável, tempo, nota */
  /* prescrição visual: dose grande, receita em blocos, tempo em etiqueta.
     grande: [valor, unidade] · sub: via/ritmo · partes: [[qtd, nome]] · total: [qtd, nome] */
  function rx(o) {
    return '<div class="el-rx el-rx2' + (o.cls ? ' ' + o.cls : '') + '">' +
      '<b class="el-rx2-tit">' + esc(o.titulo) + '</b>' +
      (o.grande ? '<div class="el-inf-vaz"><b>' + esc(o.grande[0]) + '</b><span>' + esc(o.grande[1]) + '</span></div>' : '') +
      (o.sub ? '<div class="el-rx2-sub">' + esc(o.sub) + '</div>' : '') +
      (o.partes ? '<div class="el-receita">' + receitaHtml({ partes:o.partes.map(function (p) { return [p[1], p[0]]; }), total:o.total }) + '</div>' : '') +
      (!o.grande && !o.partes ? '<p class="el-rx2-linha">' + esc(o.linha) + '</p>' : '') +
      (o.tempo ? '<div class="el-rx2-meta"><span>' + ICO('relogio') + esc(o.tempo) + '</span></div>' : '') +
      (o.nota ? '<p class="el-rx2-nota">' + esc(o.nota) + '</p>' : '') +
    '</div>';
  }
  /* resultado de conta: número grande, destaque curto, fórmula num toque */
  function calcCard(cab, big, un, destaque, formula) {
    return '<div class="el-calc el-calc2">' +
      '<h4 class="el-inf-tit">' + esc(cab) + '</h4>' +
      '<div class="el-inf-vaz"><b>' + esc(big) + '</b><span>' + esc(un) + '</span></div>' +
      (destaque ? '<p class="el-calc2-dest">' + destaque + '</p>' : '') +
      (formula ? '<details class="el-inf-mais"><summary>' + ICO('setaDir') + 'Como foi calculado</summary><p>' + formula + '</p></details>' : '') +
    '</div>';
  }
  function textoRx(o) {
    return o.titulo + '\n' + o.linha + (o.tempo ? ' — ' + o.tempo : '') + (o.nota ? '\n' + o.nota : '');
  }
  function lista(titulo, itens, cls) {
    return '<div class="el-lista' + (cls ? ' ' + cls : '') + '"><b>' + esc(titulo) + '</b><ul>' +
      itens.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
  }
  function alerta(titulo, texto) {
    return '<div class="el-alerta">' + ICO('alerta') + '<div><b>' + esc(titulo) + '</b>' + esc(texto) + '</div></div>';
  }
  function linkConduta(href, rotulo) {
    return '<a class="el-conduta" href="' + esc(href) + '">' + ICO('livro') + '<span>' + esc(rotulo) + '</span>' + ICO('setaDir') + '</a>';
  }
  function vazio(msg) {
    return '<div class="el-vazio">' + esc(msg || 'Informe o valor para ver a conduta.') + '</div>';
  }
  function passo(n, titulo, corpo) {
    return '<div class="el-passo"><span class="el-passo-n">' + n + '</span><div class="el-passo-corpo"><b>' + esc(titulo) + '</b>' + corpo + '</div></div>';
  }

  /* =========================================================
     1. POTÁSSIO
     ========================================================= */
  function telaPotassio(id) {
    var s = v(id);
    var html = '<div class="el-entrada">' +
      grande(id, 'k', 'Potássio sérico', 'mEq/L', 'ex.: 2,8') +
      opcoes(id, 'sint', 'Sintoma, ECG alterado ou digoxina', [['n', 'Não'], ['s', 'Sim']]) +
    '</div>';
    var k = num(s.k);
    if (k === null) return html + vazio();
    var sint = s.sint === 's';

    if (k < 2 || k > 9) return html + status('info', 'Valor fora do esperado', 'Confira a unidade (mEq/L) e a amostra — hemólise e garrote prolongado elevam o potássio.');

    /* --- hipercalemia --- */
    if (k > 5.5) {
      var emerg = k >= 6.5 || sint;
      html += status(emerg ? 'grave' : 'atencao',
        emerg ? 'Hipercalemia — urgência' : 'Hipercalemia',
        emerg ? 'ECG alterado ou K ≥ 6,5: estabilizar a membrana agora, depois deslocar e remover.'
              : 'ECG imediato e monitorização. Se o ECG mudar ou o K subir, tratar como urgência.');
      html += lista('Antes de tudo', [
        'ECG de 12 derivações e monitor — é o ECG, não o número, que define a urgência.',
        'Suspender IECA, BRA, espironolactona, AINE, suplementos de potássio e trimetoprima.',
        'Afastar pseudo-hipercalemia (hemólise, garrote, leucocitose/trombocitose): repetir sem garrote se o ECG for normal.'
      ], 'atencao');
      html += passo(1, 'Estabilizar a membrana' + (emerg ? '' : ' — só se o ECG estiver alterado'),
        rx({ titulo:'Gluconato de cálcio 10%', linha:'1 ampola (10 mL) + SG 5% 100 mL — EV', tempo:'EV em 5 minutos',
             partes:[['10 mL', 'Gluconato Ca 10%'], ['100 mL', 'SG 5%']],
             nota:'Efeito em minutos, dura 30–60 min. Se a alteração do ECG persistir, repetir após 5 min. Não baixa o potássio. Em parada cardíaca: 30 mL (3 g) em bolus, sem diluir, + bicarbonato 8,4% 1 mEq/kg em outra via.' }));
      html += passo(2, 'Deslocar para dentro da célula',
        rx({ titulo:'Solução polarizante', linha:'Insulina regular 10 UI + glicose 50% 100 mL — EV', tempo:'EV em 30–60 minutos',
             partes:[['10 UI', 'Insulina regular'], ['100 mL', 'Glicose 50%']],
             nota:'Efeito em 15–30 min, dura ~4 h; pode repetir de 2/2 a 4/4 h. Glicemia capilar de 1/1 h por 6 h. Se glicemia > 250: insulina isolada, sem glicose.' }) +
        rx({ titulo:'Salbutamol (nebulização)', linha:'Salbutamol 5 mg/mL — 2 a 4 mL + SF 0,9% 5 mL — inalatório', tempo:'inalatório · pico em 90 min',
             partes:[['2–4 mL', 'Salbutamol 5 mg/mL'], ['5 mL', 'SF 0,9%']],
             nota:'Efeito aditivo ao da polarizante. Taquicardia é esperada.' }));
      html += passo(3, 'Remover do corpo',
        rx({ titulo:'Furosemida', linha:'40 a 60 mg (2 a 3 ampolas) — EV', tempo:'se houver diurese', grande:['40–60', 'mg'], sub:'2 a 3 ampolas EV',
             nota:'Hipovolêmico: volume com SF antes. Euvolêmico: repor SF para balanço zero.' }) +
        rx({ titulo:'Resina de troca (poliestirenossulfonato de cálcio)', linha:'30 g em 100 mL de manitol 10% ou água — VO', tempo:'VO · até de 4/4 h',
             partes:[['30 g', 'Resina'], ['100 mL', 'Manitol 10% ou água']],
             nota:'Lento e pouco eficaz — não conte com ele na urgência.' }) +
        '<p class="el-nota">Hemodiálise é o tratamento definitivo na hipercalemia refratária, na anúria e na urgência dialítica. Bicarbonato só se houver acidose metabólica associada ou parada cardíaca.</p>');
      html += lista('Depois', ['Repetir potássio e ECG após cada ciclo (1–2 h).', 'Procurar a causa: LRA, DRC agudizada, rabdomiólise, acidose, hemólise, sangramento digestivo.']);
      html += linkConduta('#nefro/hipercalemia', 'Ver a conduta completa de hipercalemia');
      return html;
    }

    /* --- limite superior --- */
    if (k > 5.0) {
      html += status('atencao', 'Potássio no limite superior (5,1–5,5)', 'Sem tratamento específico. Repetir a dosagem sem garrote, revisar medicações que retêm potássio e a função renal.');
      html += linkConduta('#nefro/hipercalemia', 'Ver a conduta de hipercalemia');
      return html;
    }

    /* --- normal --- */
    if (k >= 3.5) {
      html += status('ok', 'Potássio dentro da faixa (3,5–5,0)', 'Sem reposição. Se houver perda em curso (diurético, vômito, diarreia, insulina em infusão), reavaliar em 4–6 h.');
      return html;
    }

    /* --- hipocalemia --- */
    var grave = k < 3.0 || sint;
    html += status(grave ? 'grave' : 'atencao',
      grave ? 'Hipocalemia grave' : 'Hipocalemia leve (3,0–3,4)',
      grave ? (k < 3.0 ? 'K < 3,0: reposição endovenosa, associada à oral, com ECG e monitor.'
                        : 'Com sintoma, ECG alterado ou digoxina, a reposição é endovenosa mesmo com K entre 3,0 e 3,4.')
            : 'Reposição oral. Dosar magnésio e repetir o potássio em 24 h.');

    if (grave) {
      html += opcoes(id, 'via', 'Acesso venoso', [['p', 'Periférico'], ['c', 'Central']]);
      var central = s.via === 'c';
      if (!central) {
        html += '<p class="el-nota">Periférico: até 40–60 mEq/L e no máximo 10 mEq/h — acima disso dói, flebita e exige central.</p>';
        html += rx({ titulo:'Opção A — KCl 19,1%', linha:'KCl 19,1% 2 ampolas (20 mL = 50 mEq) + SF 0,9% 1000 mL — EV em BIC 200 mL/h', tempo:'10 mEq/h — cerca de 5 horas',
                     grande:['200', 'mL/h'], sub:'EV em BIC', partes:[['20 mL', 'KCl 19,1% · 50 mEq'], ['1000 mL', 'SF 0,9%']],
                     nota:'Repetir a bolsa conforme o potássio de controle. Não diluir em soro glicosado.' });
        html += rx({ titulo:'Opção B — KCl 10%', linha:'KCl 10% 4 ampolas (40 mL = 54 mEq) + SF 0,9% 960 mL — EV em BIC 185 mL/h', tempo:'10 mEq/h — cerca de 5 h 30',
                     grande:['185', 'mL/h'], sub:'EV em BIC', partes:[['40 mL', 'KCl 10% · 54 mEq'], ['960 mL', 'SF 0,9%']],
                     nota:'Mesma regra: 1 g de KCl = 13,4 mEq.' });
      } else {
        html += '<p class="el-nota">Central: até 20 mEq/h, com monitor cardíaco contínuo e potássio a cada 2–4 h.</p>';
        html += rx({ titulo:'Opção A — KCl 19,1%', linha:'KCl 19,1% 1 ampola (10 mL = 25 mEq) + SF 0,9% 100 mL — EV em BIC 90 mL/h', tempo:'20 mEq/h — cerca de 1 h 15',
                     grande:['90', 'mL/h'], sub:'EV em BIC · veia central', partes:[['10 mL', 'KCl 19,1% · 25 mEq'], ['100 mL', 'SF 0,9%']],
                     nota:'Repetir conforme o potássio de controle. Somente em veia central.' });
        html += rx({ titulo:'Opção B — KCl 10%', linha:'KCl 10% 2 ampolas (20 mL = 27 mEq) + SF 0,9% 100 mL — EV em BIC 90 mL/h', tempo:'20 mEq/h — cerca de 1 h 20',
                     grande:['90', 'mL/h'], sub:'EV em BIC · veia central', partes:[['20 mL', 'KCl 10% · 27 mEq'], ['100 mL', 'SF 0,9%']] });
      }
      html += rx({ titulo:'Magnésio — sempre que estiver baixo ou a hipocalemia for refratária', linha:'Sulfato de magnésio 10% 2 ampolas (20 mL = 2 g) + SG 5% 100 mL — EV', tempo:'EV em 10–20 minutos',
                   partes:[['20 mL', 'MgSO₄ 10% · 2 g'], ['100 mL', 'SG 5%']],
                   nota:'Sem corrigir o magnésio, o potássio não sobe.' });
      html += rx({ titulo:'Associar a via oral', linha:'Xarope de KCl 6% 20 mL VO de 6/6 h (ou KCl 600 mg 2 comprimidos de 6/6 h)', tempo:'junto com a EV',
                   grande:['20', 'mL'], sub:'Xarope de KCl 6% VO de 6/6 h — ou 2 cp de KCl 600 mg',
                   nota:'Acelera a correção e encurta a infusão. Cada 20 mL de xarope 6% ≈ 16 mEq; cada comprimido de 600 mg = 8 mEq.' });
      html += lista('Não fazer', ['Diluir em soro glicosado — a glicose libera insulina e joga potássio para dentro da célula.', 'KCl em bolus ou em veia periférica acima de 10 mEq/h.', 'Esquecer o ECG em K < 3,0, sintomático ou em uso de digoxina.'], 'grave');
    } else {
      html += rx({ titulo:'Xarope de KCl 6%', linha:'20 mL VO de 6/6 h a 8/8 h (≈ 16 mEq por dose)', tempo:'40 a 100 mEq por dia',
                   grande:['20', 'mL'], sub:'VO de 6/6 h a 8/8 h · ≈ 16 mEq por dose',
                   nota:'Sabor ruim: diluir em suco melhora a adesão.' });
      html += rx({ titulo:'Ou KCl comprimido 600 mg', linha:'2 comprimidos VO de 6/6 h a 8/8 h (8 mEq por comprimido)', tempo:'após as refeições',
                   grande:['2', 'cp'], sub:'VO de 6/6 h a 8/8 h · 8 mEq por comprimido',
                   nota:'Alternativa ao xarope.' });
      html += lista('Junto', ['Dosar magnésio e repor se baixo.', 'Corrigir a causa: diurético, perda digestiva, alcalose, beta-2 agonista.', 'Repetir o potássio em 24 h.']);
    }
    html += linkConduta('#nefro/hipocalemia', 'Ver a conduta completa de hipocalemia');
    return html;
  }

  /* =========================================================
     2. SÓDIO — Adrogué-Madias
     ========================================================= */
  /* partes: o que vai no frasco, para desenhar a receita; dica: o cuidado de uma linha */
  var SOL_HIPO = [
    { id:'nacl3', nome:'NaCl 3%', na:513, preparo:'NaCl 20% 55 mL + SF 0,9% 445 mL = 500 mL de NaCl 3% (pode ir em veia periférica)',
      partes:[['NaCl 20%', '55 mL'], ['SF 0,9%', '445 mL']], total:'500 mL de NaCl 3%', dica:'Pode ir em veia periférica' },
    { id:'sf',    nome:'SF 0,9%', na:154, preparo:'Soro fisiológico 0,9% puro — só sobe o sódio se o paciente estiver hipovolêmico',
      partes:[['SF 0,9%', 'puro']], dica:'Só sobe o sódio se o paciente estiver hipovolêmico' }
  ];
  var SOL_HIPER = [
    { id:'sf045', nome:'SF 0,45%', na:77, preparo:'SF 0,9% 500 mL + SG 5% (ou água destilada) 500 mL = 1000 mL com 77 mEq/L',
      partes:[['SF 0,9%', '500 mL'], ['SG 5% ou AD', '500 mL']], total:'1000 mL de SF 0,45%' },
    { id:'sg5',   nome:'SG 5%',    na:0,  preparo:'Soro glicosado 5% puro — vigiar glicemia e hiperglicemia osmótica',
      partes:[['SG 5%', 'puro']], dica:'Vigiar glicemia e hiperglicemia osmótica' },
    { id:'agua',  nome:'Água livre VO/SNE', na:0, preparo:'Água por boca ou sonda — a via mais segura quando o paciente tolera',
      partes:[['Água', 'VO ou SNE']], dica:'A via mais segura quando o paciente tolera' }
  ];
  function receitaHtml(sol) {
    return sol.partes.map(function (p) {
      return '<span class="el-ing"><b>' + esc(p[1]) + '</b><i>' + esc(p[0]) + '</i></span>';
    }).join('<span class="el-mais">+</span>') +
      (sol.total ? '<span class="el-mais">=</span><span class="el-ing tot"><b>' + esc(Array.isArray(sol.total) ? sol.total[0] : sol.total.split(' de ')[0]) + '</b><i>' +
        esc(Array.isArray(sol.total) ? sol.total[1] : (sol.total.split(' de ')[1] || '')) + '</i></span>' : '');
  }
  /* bolus da hiponatremia sintomática: quanto, em quanto tempo e como montar */
  function bolus(sol) {
    return '<div class="el-inf grave">' +
      '<h4 class="el-inf-tit">Bolus agora</h4>' +
      '<div class="el-inf-vaz"><b>100–150</b><span>mL</span></div>' +
      '<div class="el-inf-sub">NaCl 3% EV em 20 min · repetir até 3×</div>' +
      '<div class="el-inf-prep"><h4>Como montar o NaCl 3%</h4><div class="el-receita">' + receitaHtml(sol) + '</div>' +
        '<ol class="el-passos">' +
          '<li>Pegue uma bolsa de <b>SF 0,9% 500 mL</b> e despreze <b>55 mL</b>.</li>' +
          '<li>Injete na bolsa <b>55 mL de NaCl 20%</b> (5½ ampolas de 10 mL).</li>' +
          '<li>Homogeneíze, rotule "NaCl 3%" e infunda <b>100–150 mL</b> em 20 min.</li>' +
        '</ol>' +
        '<p>' + esc(sol.dica) + '.</p></div>' +
      '<p class="el-inf-alvo">Objetivo: subir 4–6 mEq/L e reverter o sintoma — não normalizar o sódio.</p>' +
    '</div>';
  }
  /* sódio: vazão, receita do frasco e cópia num cartão só */
  function infusao(o) {
    var sol = o.sol;
    var receita = receitaHtml(sol);
    return '<div class="el-inf" data-el-txt="' + esc(o.txt) + '">' +
      '<div class="el-inf-vaz"><b>' + esc(o.vazao) + '</b><span>mL/h</span></div>' +
      '<div class="el-inf-sub">' + esc(sol.nome) + ' em BIC · 24 h · ' + esc(o.litros) + ' L</div>' +
      '<div class="el-inf-na"><span>' + esc(o.de) + '</span>' + ICO('setaDir') + '<span>' + esc(o.para) + '</span><i>mEq/L em 24 h</i></div>' +
      '<div class="el-inf-prep"><h4>Preparo</h4><div class="el-receita">' + receita + '</div>' +
        (sol.dica ? '<p>' + esc(sol.dica) + '</p>' : '') + '</div>' +
      '<details class="el-inf-mais"><summary>' + ICO('setaDir') + 'Como foi calculado</summary>' +
        '<p>Cada litro de ' + esc(sol.nome) + ' altera o sódio em ' + esc(o.porLitro) + ' mEq/L · água corporal ' + esc(o.act) + '.</p>' +
        '<p>A fórmula ignora as perdas urinárias: o sódio real pode subir mais rápido. Dosar a cada 2–4 h e recalcular.</p>' +
      '</details>' +
    '</div>';
  }
  function fatorACT(sexo, idoso) {
    if (sexo === 'm') return idoso ? 0.45 : 0.5;
    return idoso ? 0.5 : 0.6;
  }
  function telaSodio(id) {
    var s = v(id);
    if (s.peso === undefined && pesoGlobal()) s.peso = pesoGlobal();
    var na = num(s.na);
    var hipo = na !== null && na < 135, hiper = na !== null && na > 145;
    var alvoPadrao = hipo ? na + 8 : (hiper ? na - 10 : '');
    var html = '<div class="el-entrada el-grid2">' +
      campoNum(id, 'na', 'Sódio atual (mEq/L)', 'ex.: 118') +
      campoNum(id, 'alvo', 'Sódio alvo em 24 h', alvoPadrao === '' ? 'atual ± 8' : String(alvoPadrao)) +
      campoNum(id, 'peso', 'Peso (kg)', 'ex.: 70') +
      '</div>' +
      opcoes(id, 'sexo', 'Sexo', [['h', 'Homem'], ['m', 'Mulher']]) +
      opcoes(id, 'idade', 'Idade', [['j', '< 65 anos'], ['i', '≥ 65 anos']]);
    if (na === null) return html + vazio('Informe o sódio para ver a conduta.');

    if (!hipo && !hiper) {
      return html + status('ok', 'Sódio dentro da faixa (135–145)', 'Sem correção. Se a glicemia estiver alta, use o sódio corrigido pela glicemia.');
    }

    var sint = s.sint;
    if (hipo) {
      html += opcoes(id, 'sint', 'Sintoma grave (convulsão, rebaixamento, vômito incoercível)?', [['n', 'Não'], ['s', 'Sim']]);
      sint = s.sint === 's';
      html += status(sint || na < 120 ? 'grave' : 'atencao',
        na < 120 ? 'Hiponatremia grave (< 120)' : (na < 130 ? 'Hiponatremia moderada (120–129)' : 'Hiponatremia leve (130–134)'),
        sint ? 'Sintoma grave: bolus de NaCl 3% até reverter o sintoma — depois o cálculo abaixo para o restante das 24 h.'
             : 'Sem sintoma grave, o limite é 8–10 mEq/L em 24 h. Sódio a cada 2–4 h durante a correção.');
      if (sint) {
        html += bolus(SOL_HIPO[0]);
      }
    } else {
      html += status(na > 160 ? 'grave' : 'atencao',
        na > 160 ? 'Hipernatremia grave (> 160)' : 'Hipernatremia',
        'Se houver hipovolemia, expandir com SF primeiro; a correção do sódio vem depois, no máximo 8–10 mEq/L em 24 h.');
    }

    var alvo = num(s.alvo); if (alvo === null) alvo = alvoPadrao;
    var peso = num(s.peso);
    var delta = alvo - na;
    var sentidoOk = hipo ? delta > 0 : delta < 0;
    if (!sentidoOk) html += alerta('Alvo no sentido errado', hipo ? 'Na hiponatremia o alvo precisa ser maior que o atual.' : 'Na hipernatremia o alvo precisa ser menor que o atual.');
    if (Math.abs(delta) > 10) html += alerta('Correção acima do limite seguro', 'Mais de 10 mEq/L em 24 h aumenta o risco de ' + (hipo ? 'mielinólise pontina' : 'edema cerebral') + '. Reduza o alvo.');
    if (!peso || !s.sexo || !s.idade) return html + vazio('Informe peso, sexo e idade para calcular a solução.');

    var act = peso * fatorACT(s.sexo, s.idade === 'i');
    var sols = hipo ? SOL_HIPO : SOL_HIPER;
    html += opcoes(id, 'sol', 'Qual solução você tem?', sols.map(function (x) { return [x.id, x.nome]; }));
    var sol = null;
    sols.forEach(function (x) { if (x.id === s.sol) sol = x; });
    if (!sol) return html;

    var porLitro = (sol.na - na) / (act + 1);
    if ((hipo && porLitro <= 0) || (hiper && porLitro >= 0)) {
      return html + alerta('Essa solução não corrige neste sentido', 'Cada litro alteraria o sódio em ' + f(porLitro, 2) + ' mEq/L. Escolha outra solução.');
    }
    var litros = Math.abs(delta) / Math.abs(porLitro);
    var mlh = litros * 1000 / 24;
    html += infusao({ sol:sol, vazao:f(mlh, 0), litros:f(litros, 2), de:f(na, 0), para:f(alvo, 0),
      porLitro:(porLitro > 0 ? '+' : '') + f(porLitro, 2),
      act:f(act, 1) + ' L (' + f(fatorACT(s.sexo, s.idade === 'i') * 100, 0) + '% de ' + f(peso, 0) + ' kg)',
      txt:'Prescrever\n' + sol.preparo + ' — EV em BIC ' + f(mlh, 0) + ' mL/h — por 24 h, com sódio a cada 2–4 h' });
    html += alerta(hipo ? 'Mielinólise pontina' : 'Edema cerebral',
      hipo ? 'Não exceder 8–10 mEq/L nas primeiras 24 h (6 mEq/L se alto risco: alcoolismo, desnutrição, hipocalemia, Na < 105). Se passou do limite, reinfundir água (SG 5%) e considerar desmopressina.'
           : 'Baixar mais de 10 mEq/L em 24 h na hipernatremia crônica causa edema cerebral. Preferir água por via oral ou sonda quando possível.');
    html += linkConduta(hipo ? '#nefro/hiponatremia' : '#nefro/hipernatremia', 'Ver a conduta completa');
    return html;
  }

  /* =========================================================
     3. BICARBONATO
     ========================================================= */
  function telaBicarbonato(id) {
    var s = v(id);
    if (s.peso === undefined && pesoGlobal()) s.peso = pesoGlobal();
    var html = alerta('Indicação estrita', 'Acidose metabólica grave — pH < 7,1 (ou < 7,0 na cetoacidose) — ou instabilidade refratária, hipercalemia com acidose e intoxicação por tricíclico. Tratar a causa é o tratamento.');
    html += '<div class="el-entrada el-grid2">' +
      campoNum(id, 'peso', 'Peso (kg)', 'ex.: 70') +
      campoNum(id, 'atual', 'HCO₃⁻ atual (mEq/L)', 'ex.: 8') +
      campoNum(id, 'alvo', 'HCO₃⁻ alvo', '12') +
      campoNum(id, 'ph', 'pH (opcional)', 'ex.: 7,05') +
      '</div>';
    var peso = num(s.peso), atual = num(s.atual), alvo = num(s.alvo), ph = num(s.ph);
    if (alvo === null) alvo = 12;
    if (peso === null || atual === null) return html + vazio('Informe peso e bicarbonato atual.');
    if (alvo <= atual) return html + status('ok', 'Bicarbonato já no alvo', 'Sem reposição.');
    if (ph !== null && ph >= 7.1) html += status('atencao', 'pH ' + f(ph, 2) + ' — fora da indicação habitual', 'Acima de 7,1 o bicarbonato raramente ajuda e pode piorar a acidose intracelular. Confirme a indicação antes de prescrever.');

    var fator = atual < 10 ? 0.5 : 0.3;
    var deficit = fator * peso * (alvo - atual);
    var metade = deficit / 2;
    var ml = Math.round(metade);
    html += calcCard('Déficit de bicarbonato', f(deficit, 0), 'mEq', 'Repor <b>metade agora: ' + f(metade, 0) + ' mEq</b> e repetir a gasometria.',
      f(fator, 1) + ' × ' + f(peso, 0) + ' kg × (' + f(alvo, 0) + ' − ' + f(atual, 0) + '). ' +
        (fator === 0.5 ? 'Na acidose grave (HCO₃⁻ < 10) o volume de distribuição sobe para 0,5.' : 'Volume de distribuição de 0,3 L/kg.'));
    html += rx({ titulo:'Bicarbonato de sódio 8,4% (1 mEq/mL)', linha:'Bicarbonato 8,4% ' + ml + ' mL + SG 5% (ou água destilada) ' + ml + ' mL — EV em BIC ' + Math.round(ml) + ' mL/h', tempo:'em 2 horas',
                 grande:[String(Math.round(ml)), 'mL/h'], sub:'EV em BIC', partes:[[ml + ' mL', 'Bicarb. 8,4%'], [ml + ' mL', 'SG 5% ou AD']], total:[(ml * 2) + ' mL', 'total'],
                 nota:'Gasometria 30–60 min após o término. Nunca na mesma via que cálcio (precipita) nem catecolaminas.' });
    html += lista('Vigiar', ['Sódio e volume: cada 100 mL de 8,4% traz 100 mEq de sódio.', 'Potássio cai ao corrigir a acidose — repor antes se estiver baixo.', 'Cálcio iônico cai (tetania).', 'CO₂ gerado precisa ser ventilado: em hipoventilação, o bicarbonato piora a acidose.'], 'atencao');
    html += linkConduta('#nefro/acido-base', 'Ver a leitura da gasometria');
    return html;
  }

  /* =========================================================
     4. MAGNÉSIO
     ========================================================= */
  function telaMagnesio(id) {
    var s = v(id);
    var html = campoNum(id, 'mg', 'Magnésio sérico (mg/dL) — opcional', 'ex.: 1,2') +
      opcoes(id, 'amp', 'Ampola disponível', [['10', 'Sulfato de Mg 10% (1 g/10 mL)'], ['50', 'Sulfato de Mg 50% (5 g/10 mL)']]) +
      opcoes(id, 'tdp', 'Torsades de pointes ou parada cardíaca?', [['n', 'Não'], ['s', 'Sim']]);
    var mg = num(s.mg);
    if (mg !== null && mg > 2.6) {
      html += status('atencao', 'Hipermagnesemia (> 2,6 mg/dL)', 'Suspender magnésio, hidratar; se sintomática (arreflexia, bradicardia, depressão respiratória): gluconato de cálcio 10% 1 ampola EV em 5 min e diálise se renal.');
      return html;
    }
    if (!s.amp || !s.tdp) return html + vazio('Escolha a ampola e responda a pergunta.');
    var c50 = s.amp === '50';
    function volume(g) { return c50 ? (g * 2) + ' mL (50%)' : (g * 10) + ' mL (10%)'; }
    function parteMg(g) { return [(c50 ? g * 2 : g * 10) + ' mL', 'MgSO₄ ' + (c50 ? '50%' : '10%') + ' · ' + g + ' g']; }

    if (s.tdp === 's') {
      html += status('grave', 'Torsades de pointes / PCR', 'Magnésio em bolus, independentemente do nível sérico.');
      html += rx({ titulo:'Dose de ataque — 2 g', linha:'Sulfato de magnésio ' + volume(2) + ' + SG 5% 100 mL — EV', tempo:'EV em 2–15 min · na PCR, bolus em 1–2 min', partes:[parteMg(2), ['100 mL', 'SG 5%']],
                   nota:'Repetir se a arritmia persistir. Depois, manter 1–2 g/h por 4–6 h.', cls:'grave' });
      html += linkConduta('#cardio/taqui-qrs-largo', 'Ver a conduta de taquicardia de QRS largo');
      return html;
    }
    html += opcoes(id, 'grave', 'Sintomas graves (tetania, arritmia, convulsão)?', [['n', 'Não'], ['s', 'Sim']]);
    if (!s.grave) return html + vazio('Responda a segunda pergunta.');
    if (s.grave === 's') {
      html += status('grave', 'Hipomagnesemia sintomática', 'Ataque endovenoso e depois reposição lenta.');
      html += rx({ titulo:'Dose de ataque — 2 g', linha:'Sulfato de magnésio ' + volume(2) + ' + SG 5% 100 mL — EV', tempo:'EV em 10–20 minutos', partes:[parteMg(2), ['100 mL', 'SG 5%']],
                   nota:'Pode repetir após 1 h se persistir.' });
      html += rx({ titulo:'Manutenção — 4 g', linha:'Sulfato de magnésio ' + volume(4) + ' + SG 5% (ou SF 0,9%) ' + (c50 ? 492 : 460) + ' mL — EV em BIC', tempo:'em 12 a 24 horas',
                   grande:['21–42', 'mL/h'], sub:'EV em BIC', partes:[parteMg(4), [(c50 ? 492 : 460) + ' mL', 'SG 5% ou SF']], total:['500 mL', 'total'] });
    } else {
      html += status(mg !== null && mg < 1.2 ? 'atencao' : 'info',
        mg !== null ? (mg < 1.2 ? 'Hipomagnesemia grave (< 1,2), assintomática' : (mg < 1.8 ? 'Hipomagnesemia leve (1,2–1,7)' : 'Magnésio dentro da faixa (1,8–2,6)')) : 'Reposição lenta',
        'Sem sintoma, a reposição é lenta: metade do que se infunde rápido vai embora na urina.');
      html += rx({ titulo:'Reposição lenta — 4 g', linha:'Sulfato de magnésio ' + volume(4) + ' + SG 5% (ou SF 0,9%) ' + (c50 ? 492 : 460) + ' mL — EV em BIC', tempo:'em 12 a 24 horas',
                   grande:['21–42', 'mL/h'], sub:'EV em BIC', partes:[parteMg(4), [(c50 ? 492 : 460) + ' mL', 'SG 5% ou SF']], total:['500 mL', 'total'],
                   nota:'Repetir por 2–3 dias se a causa persistir (diurético, diarreia, álcool, IBP).' });
    }
    html += lista('Cuidados', ['Insuficiência renal: metade da dose e nível a cada 6–12 h.', 'Vigiar reflexos patelares, PA e frequência respiratória — arreflexia é sinal de excesso.', 'Corrigir junto potássio e cálcio: os três costumam cair juntos.'], 'atencao');
    html += linkConduta('#nefro/hipocalemia', 'Ver a conduta de hipocalemia (magnésio associado)');
    return html;
  }

  /* =========================================================
     5. SÓDIO CORRIGIDO PELA GLICEMIA
     ========================================================= */
  function telaNaCorrigido(id) {
    var s = v(id);
    var html = '<div class="el-entrada el-grid2">' + campoNum(id, 'na', 'Sódio medido (mEq/L)', 'ex.: 128') + campoNum(id, 'gli', 'Glicemia (mg/dL)', 'ex.: 450') + '</div>';
    var na = num(s.na), gli = num(s.gli);
    if (na === null || gli === null) return html + vazio('Informe sódio e glicemia.');
    var exc = Math.max(0, gli - 100);
    var c16 = na + 1.6 * exc / 100;
    var c24 = na + 2.4 * exc / 100;
    html += calcCard('Sódio corrigido', f(c16, 1), 'mEq/L', gli > 400 ? 'Com fator 2,4 (glicemia > 400): <b>' + f(c24, 1) + ' mEq/L</b>' : '',
      '+1,6 mEq/L para cada 100 mg/dL de glicose acima de 100.');
    if (na < 135 && c16 >= 135) html += status('ok', 'Hiponatremia translocacional', 'O sódio corrigido é normal: a hiponatremia é só diluição pela glicose. Corrigir a glicemia resolve; não repor sódio.');
    else if (c16 < 135) html += status('atencao', 'Hiponatremia verdadeira', 'Mesmo corrigido o sódio está baixo. Avaliar volemia e seguir a conduta de hiponatremia — a correção da glicemia vai elevar o sódio medido.');
    else if (c16 > 145) html += status('atencao', 'Hipernatremia mascarada', 'O sódio corrigido está alto: ao corrigir a glicemia o sódio medido vai subir. Repor água livre junto com o tratamento da hiperglicemia.');
    else html += status('ok', 'Sódio corrigido dentro da faixa', '');
    html += linkConduta('#endocrino/cetoacidose', 'Ver a conduta de cetoacidose');
    return html;
  }

  /* =========================================================
     6. CÁLCIO — hipocalcemia
     ========================================================= */
  function telaCalcio(id) {
    var s = v(id);
    if (s.peso === undefined && pesoGlobal()) s.peso = pesoGlobal();
    var html = opcoes(id, 'grav', 'Apresentação', [['g', 'Grave / sintomática'], ['l', 'Leve / assintomática']]);
    if (!s.grav) {
      html += lista('Critérios de gravidade', ['Tetania, laringoespasmo, convulsão, arritmia ou QT longo.', 'Cálcio corrigido ≤ 7,5 mg/dL ou cálcio iônico ≤ 3,0 mg/dL (0,75 mmol/L).', 'Hipocalcemia aguda pós-tireoidectomia ou paratireoidectomia.']);
      return html + vazio('Escolha a apresentação.');
    }
    if (s.grav === 'g') {
      html += campoNum(id, 'peso', 'Peso (kg) — para a manutenção', 'ex.: 70');
      var peso = num(s.peso);
      html += status('grave', 'Hipocalcemia grave', 'Cálcio endovenoso com monitor. Repetir até o sintoma cessar, depois manutenção em bomba.');
      html += rx({ titulo:'1 · Dose de ataque', linha:'Gluconato de cálcio 10% 1 a 2 ampolas (10–20 mL) + SG 5% 100 mL — EV', tempo:'EV em 10–20 min, com monitor',
                   partes:[['10–20 mL', 'Gluconato Ca 10%'], ['100 mL', 'SG 5%']],
                   nota:'Repetir após 10–60 min se o sintoma persistir. Cada ampola = 93 mg de cálcio elementar.', cls:'grave' });
      var faixa = peso ? 'BIC ' + f(peso * 0.5 / 0.93, 0) + ' a ' + f(peso * 1.5 / 0.93, 0) + ' mL/h (0,5–1,5 mg/kg/h de cálcio elementar)' : 'BIC 0,5–1,5 mg/kg/h de cálcio elementar (informe o peso para a vazão)';
      html += rx({ titulo:'2 · Manutenção', linha:'Gluconato de cálcio 10% 10 ampolas (100 mL) + SG 5% 900 mL — EV em ' + faixa, tempo:'por 24 h, cálcio a cada 4–6 h',
                   grande: peso ? [f(peso * 0.5 / 0.93, 0) + '–' + f(peso * 1.5 / 0.93, 0), 'mL/h'] : null,
                   sub: peso ? 'EV em BIC · 0,5–1,5 mg/kg/h de cálcio elementar' : 'EV em BIC · informe o peso para ver a vazão',
                   partes:[['100 mL', 'Gluconato Ca 10%'], ['900 mL', 'SG 5%']], total:['1000 mL', 'total'],
                   nota:'Solução ≈ 0,93 mg de cálcio elementar por mL. Não misturar com bicarbonato ou fosfato na mesma via (precipita).' });
      html += rx({ titulo:'Se magnésio baixo', linha:'Sulfato de magnésio 50% 4 mL (2 g) + SF 0,9% 100 mL — EV', tempo:'EV em 15–20 minutos',
                   partes:[['4 mL', 'MgSO₄ 50% · 2 g'], ['100 mL', 'SF 0,9%']],
                   nota:'Sem corrigir o magnésio o cálcio não sobe.' });
      html += lista('Junto', ['Iniciar a via oral (carbonato de cálcio + calcitriol) para poder desmamar a bomba.', 'Cuidado em uso de digoxina: infundir mais devagar.', 'Dosar magnésio, fósforo, PTH e vitamina D antes do tratamento, se possível.'], 'atencao');
    } else {
      html += status('atencao', 'Hipocalcemia leve ou assintomática', 'Parestesia perioral ou de extremidades, Chvostek/Trousseau leves. Reposição oral.');
      html += rx({ titulo:'Carbonato de cálcio 500 mg (200 mg de cálcio elementar)', linha:'1 a 2 comprimidos VO de 8/8 h, junto às refeições', tempo:'1 a 3 g de cálcio elementar por dia',
                   grande:['1–2', 'cp'], sub:'VO de 8/8 h, junto às refeições' });
      html += rx({ titulo:'Calcitriol 0,25 mcg', linha:'1 cápsula VO 1 a 2 vezes ao dia', tempo:'hipoparatireoidismo e doença renal',
                   grande:['1', 'cápsula'], sub:'VO 1 a 2 vezes ao dia',
                   nota:'Necessário quando o PTH está baixo ou o rim não ativa a vitamina D.' });
      html += rx({ titulo:'Se deficiência de vitamina D', linha:'Colecalciferol 50.000 UI VO 1x/semana por 6 a 12 semanas; depois 1.000 a 2.000 UI/dia', tempo:'ataque e manutenção',
                   grande:['50.000', 'UI'], sub:'Colecalciferol VO 1×/semana por 6–12 semanas · depois 1.000–2.000 UI/dia' });
      html += rx({ titulo:'Se ficar sintomático ou falhar a via oral', linha:'Gluconato de cálcio 10% 1 a 2 ampolas + SG 5% 100 mL — EV em 10–20 min', tempo:'EV em 10–20 min · e passar para o esquema grave',
                   partes:[['10–20 mL', 'Gluconato Ca 10%'], ['100 mL', 'SG 5%']] });
      html += lista('Junto', ['Dosar e repor magnésio.', 'Suspender ou revisar bisfosfonato, diurético de alça e inibidor de bomba se forem a causa.']);
    }
    html += linkConduta('#nefro/calcio', 'Ver a conduta completa de cálcio');
    return html;
  }

  /* =========================================================
     7. CÁLCIO CORRIGIDO PELA ALBUMINA
     ========================================================= */
  function telaCaCorrigido(id) {
    var s = v(id);
    var html = '<div class="el-entrada el-grid2">' + campoNum(id, 'ca', 'Cálcio total (mg/dL)', 'ex.: 7,0') + campoNum(id, 'alb', 'Albumina (g/dL)', 'ex.: 2,5') + '</div>' +
      opcoes(id, 'ref', 'Albumina de referência', [['4', '4,0 g/dL'], ['4.4', '4,4 g/dL']]);
    var ca = num(s.ca), alb = num(s.alb), ref = num(s.ref) || 4;
    if (ca === null || alb === null) return html + vazio('Informe cálcio e albumina.');
    var corr = ca + 0.8 * (ref - alb);
    html += calcCard('Cálcio corrigido', f(corr, 2), 'mg/dL', '',
      'Ca + 0,8 × (' + f(ref, 1) + ' − albumina). Cada 1 g/dL de albumina abaixo da referência esconde 0,8 mg/dL de cálcio.');
    if (corr < 7.5) html += status('grave', 'Hipocalcemia grave (≤ 7,5)', 'Mesmo sem sintoma, considerar cálcio endovenoso. Confirmar com cálcio iônico.');
    else if (corr < 8.5) html += status('atencao', 'Hipocalcemia (< 8,5)', 'Reposição oral se assintomático; endovenosa se houver tetania, QT longo ou convulsão.');
    else if (corr > 10.5) html += status('atencao', 'Hipercalcemia (> 10,5)', 'Hidratação com SF 200–300 mL/h é a base; acima de 14 ou sintomático, tratar como emergência.');
    else html += status('ok', 'Cálcio corrigido dentro da faixa (8,5–10,5)', 'A fórmula é estimativa: na dúvida, o cálcio iônico manda.');
    html += lista('Limites', ['Fórmula imprecisa em acidose/alcalose, insuficiência renal e paraproteinemia — preferir o cálcio iônico.', 'Cálcio iônico normal: 4,5–5,3 mg/dL (1,12–1,32 mmol/L).']);
    html += linkConduta('#nefro/calcio', 'Ver a conduta de hipercalcemia e hipocalcemia');
    return html;
  }

  /* =========================================================
     registro
     ========================================================= */
  var ITENS = [
    { id:'potassio',     sim:'K⁺',   cor:'roxo',     nome:'Distúrbios do potássio',  sub:'Hipo e hipercalemia com diluição e vazão', tela:telaPotassio,
      busca:'potassio hipocalemia hipercalemia kcl gluconato polarizante' },
    { id:'sodio',        sim:'Na⁺',  cor:'azul',     nome:'Distúrbios do sódio',     sub:'Adrogué-Madias: solução e mL/h', tela:telaSodio,
      busca:'sodio hiponatremia hipernatremia adrogue salina hipertonica nacl 3%' },
    { id:'bicarbonato',  sim:'HCO₃⁻', cor:'ciano',   nome:'Bicarbonato',             sub:'Déficit e reposição na acidose grave', tela:telaBicarbonato,
      busca:'bicarbonato acidose metabolica deficit gasometria' },
    { id:'magnesio',     sim:'Mg²⁺', cor:'verde',    nome:'Distúrbios do magnésio',  sub:'Torsades, sintomático e reposição lenta', tela:telaMagnesio,
      busca:'magnesio hipomagnesemia sulfato torsades' },
    { id:'na-corrigido', sim:'Na',   cor:'laranja',  sup:'corr', nome:'Sódio corrigido pela glicemia', sub:'Hiponatremia verdadeira ou translocacional', tela:telaNaCorrigido,
      busca:'sodio corrigido glicemia cetoacidose translocacional' },
    { id:'calcio',       sim:'Ca²⁺', cor:'rosa',     nome:'Hipocalcemia',            sub:'Grave x leve, ataque e manutenção', tela:telaCalcio,
      busca:'calcio hipocalcemia gluconato tetania carbonato calcitriol' },
    { id:'ca-corrigido', sim:'Ca',   cor:'vermelho', sup:'corr', nome:'Cálcio corrigido pela albumina', sub:'Ca + 0,8 × (ref − albumina)', tela:telaCaCorrigido,
      busca:'calcio corrigido albumina' }
  ];
  function itemDe(id) {
    for (var i = 0; i < ITENS.length; i++) if (ITENS[i].id === id) return ITENS[i];
    return null;
  }
  /* tile de tamanho fixo: o símbolo encolhe conforme o comprimento e o
     "corrigido" fica só no nome do cartão, que já diz isso */
  function simbolo(it) {
    var n = it.sim.replace(/[^A-Za-z]/g, '').length;
    var cls = n >= 3 ? ' g3' : (n === 2 ? ' g2' : '');
    return '<span class="el-sim' + cls + '">' + esc(it.sim) + '</span>';
  }

  /* a capa: os sete cartões */
  E.capa = function () {
    return '<p class="ferr-lead">Valor entra, conduta sai: classificação, diluição de bancada e vazão.</p>' +
      '<div class="el-hub">' + ITENS.map(function (it) {
        return '<a class="el-card" href="#eletrolitos/' + it.id + '">' + simbolo(it) +
          '<span class="el-card-nome">' + esc(it.nome) + '</span>' +
          '<span class="el-card-sub">' + esc(it.sub) + '</span></a>';
      }).join('') + '</div>';
  };

  /* as filhas, no formato que a seção espera */
  E.filhas = function () {
    return ITENS.map(function (it) {
      return { id:it.id, nome:it.nome, icone:'gota', conta:it.sub, tela:function () { return E.tela(it.id); } };
    });
  };

  /* tudo que é entrada (valores e opções) fica dentro da mesma faixa;
     o que vem depois é resultado */
  function arruma(raiz) {
    if (!raiz) return;
    var faixa = raiz.querySelector('.el-entrada');
    if (!faixa) return;
    while (faixa.nextElementSibling && faixa.nextElementSibling.classList.contains('el-opcoes')) {
      faixa.appendChild(faixa.nextElementSibling);
    }
    var resto = [], n = faixa.nextElementSibling;
    while (n) { resto.push(n); n = n.nextElementSibling; }
    if (!resto.length || raiz.querySelector('.el-saida')) return;
    var caixa = document.createElement('div');
    caixa.className = 'el-saida';
    faixa.parentNode.insertBefore(caixa, faixa.nextSibling);
    resto.forEach(function (x) { caixa.appendChild(x); });
    passos(caixa);
  }
  /* a saída vira um passo a passo numerado: o que é → o que fazer → como seguir */
  function passos(caixa) {
    var ROT = [
      ['el-status', 'Resultado'], ['el-alerta', 'Atenção'], ['el-rx', 'Prescrever'], ['el-conduta', 'Conduzir'],
      ['el-calc', 'Cálculo'], ['el-inf', 'Prescrever'], ['el-lista', 'Conferir'], ['el-opcoes', 'Escolha'], ['el-passo', 'Passo'], ['el-nota', 'Reavaliar'], ['el-vazio', 'Aguardando']
    ];
    [].slice.call(caixa.children).forEach(function (x) {
      if (x.querySelector(':scope > .el-p-rot')) return;
      var rot = 'Seguir';
      for (var i = 0; i < ROT.length; i++) if (x.classList.contains(ROT[i][0])) { rot = ROT[i][1]; break; }
      if (x.tagName === 'P' && rot === 'Seguir') rot = 'Observação';
      x.setAttribute('data-p', rot);
    });
    var kids = [].slice.call(caixa.children);
    caixa.classList.toggle('sem-valor', kids.length > 0 && kids.every(function (x) { return x.classList.contains('el-vazio'); }));
  }

  E.tela = function (id) {
    var it = itemDe(id);
    if (!it) return '';
    setTimeout(function () { arruma(document.querySelector('[data-el-tool="' + id + '"]')); }, 0);
    return '<div class="el-tool" data-el-tool="' + it.id + '">' + it.tela(it.id) + '</div>' +
      '<p class="rodape-aviso">' + ICO('alerta') + '<span>Confira dose, apresentação e diretriz vigente antes de prescrever.</span></p>';
  };

  /* para a busca global */
  E.indice = function () {
    return ITENS.map(function (it) {
      return { tipo:'calculadora', id:'el-' + it.id, titulo:it.nome, sub:'Eletrólitos · ' + it.sub,
        href:'#eletrolitos/' + it.id, texto:[it.nome, it.sub, it.busca].join(' ') };
    });
  };
  E.itens = ITENS;

  /* ---------- eventos: redesenha só o corpo, mantendo o foco ---------- */
  function redesenha(id) {
    var raiz = document.querySelector('[data-el-tool="' + id + '"]');
    if (!raiz) return;
    var ativo = document.activeElement;
    var k = ativo && ativo.dataset ? ativo.dataset.k : null;
    var pos = ativo && ativo.selectionStart;
    var it = itemDe(id);
    raiz.innerHTML = it.tela(id);
    arruma(raiz);
    if (k) {
      var de = raiz.querySelector('[data-el="' + id + '"][data-k="' + k + '"]');
      if (de) { de.focus(); try { de.setSelectionRange(pos, pos); } catch (e) { /* number */ } }
    }
  }
  document.addEventListener('input', function (e) {
    var el = e.target.closest && e.target.closest('[data-el]');
    if (!el) return;
    var limpo = el.value.replace(/[^0-9.,-]/g, '');
    if (limpo !== el.value) { var p = el.selectionStart - 1; el.value = limpo;
      try { el.setSelectionRange(p, p); } catch (err) {} }
    v(el.dataset.el)[el.dataset.k] = limpo;
    redesenha(el.dataset.el);
  });
  document.addEventListener('click', function (e) {
    var op = e.target.closest('[data-el-op]');
    if (op) {
      v(op.dataset.elOp)[op.dataset.k] = op.dataset.v;
      redesenha(op.dataset.elOp);
      return;
    }
    var b = e.target.closest('[data-el-acao]');
    if (!b) return;
    var caixa = b.closest('[data-el-txt]');
    var txt = caixa ? caixa.dataset.elTxt : '';
    if (!txt) return;
    if (b.dataset.elAcao === 'copiar' && window.Ferramentas && Ferramentas.copiarClinico) {
      Ferramentas.copiarClinico(txt, caixa.querySelector('b').textContent, 'presc');
    }
    if (b.dataset.elAcao === 'rascunho' && window.Ferramentas && Ferramentas.pilha) {
      Ferramentas.pilha(txt);
    }
  });

  window.Eletrolitos = E;
})();
