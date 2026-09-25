/* ============================================================
   ESCORES CLÍNICOS — extensão de FERR_CALC

   Arquivo próprio porque ferramentas-dados.js já passa de 280 KB.
   Carregar DEPOIS de ferramentas-dados.js e ANTES de ferramentas.js.

   Não redefine nada: acrescenta `ramo` + ficha (quando / limites /
   fonte) aos 16 itens que já existiam e empurra os novos no fim do
   mesmo array. O motor (telaCalculadoras, calcResultado) é o mesmo.

   Formato, igual ao de FERR_CALC:
     tipo:'escore'  + itens:[{rot, pts}]                  -> caixas
     tipo:'escore'  + seletor:true + itens:[{rot,opcoes}] -> listas
     tipo:'formula' + campos + calc(v)
     faixa(t) -> { valor, classe:'ok'|'atencao'|'grave', detalhe }

   Campos novos, todos opcionais:
     ramo    id do agrupamento na tela de Scores
     quando  quando usar — aparece antes dos campos
     limites o que o escore NÃO resolve — aparece depois do resultado
     fonte   origem
     exige   true = só calcula com todos os itens respondidos
   ============================================================ */
(function () {
  'use strict';
  if (typeof FERR_CALC === 'undefined') return;

  /* ---- ramos, na ordem em que aparecem na tela ---- */
  window.FERR_RAMOS = [
    { id:'cardio',  nome:'Cardiologia',                    icone:'coracao' },
    { id:'resp',    nome:'Pneumologia e tromboembolismo',  icone:'pulmao'  },
    { id:'emerg',   nome:'Emergência e sepse',             icone:'perigo'  },
    { id:'neuro',   nome:'Neurologia',                     icone:'cerebro' },
    { id:'trauma',  nome:'Trauma e queimaduras',           icone:'osso'    },
    { id:'pedia',   nome:'Pediatria',                      icone:'crianca' },
    { id:'gastro',  nome:'Gastro e fígado',                icone:'estomago'},
    { id:'hemato',  nome:'Hematologia',                    icone:'gota'    },
    { id:'psiq',    nome:'Psiquiatria e sedação',          icone:'mente'   },
    { id:'infec',   nome:'Infecção e cirurgia',            icone:'virus'   },
    { id:'global',  nome:'Avaliação global',               icone:'esteto'  },
    { id:'conta',   nome:'Contas do plantão',              icone:'calc'    }
  ];

  /* ---- escalas repetitivas ---- */
  function e07(zero, quatro, sete) {
    return [[0,'0 — '+zero],[1,'1'],[2,'2'],[3,'3'],[4,'4 — '+quatro],[5,'5'],[6,'6'],[7,'7 — '+sete]];
  }

  /* =========================================================
     1. FICHA DOS 16 QUE JÁ EXISTIAM
     Só acrescenta metadado; nenhuma conta foi alterada.
     ========================================================= */
  var FICHA = {
    shockindex:{ ramo:'conta',
      quando:'Triagem rápida de instabilidade quando a PA ainda parece aceitável.',
      limites:'Perde valor em quem usa betabloqueador, no idoso e na gestante. Não substitui a avaliação de perfusão.',
      fonte:'Allgöwer & Burri' },
    pam:{ ramo:'conta',
      quando:'Alvo de perfusão no choque e na sepse.',
      limites:'A fórmula assume FC normal; em taquicardia importante subestima a PAM real.',
      fonte:'Fisiologia clássica' },
    imc:{ ramo:'conta',
      quando:'Classificação de peso e cálculo de dose em obesidade.',
      limites:'Não distingue massa magra de gordura. Não use isolado em atleta, gestante, edemaciado ou amputado.',
      fonte:'OMS' },
    tabagismo:{ ramo:'conta',
      quando:'Elegibilidade para rastreio de câncer de pulmão e estratificação de risco cirúrgico.',
      limites:'Não conta cachimbo, charuto, narguilé nem cigarro eletrônico.',
      fonte:'Critério de rastreio por anos-maço' },
    gotejamento:{ ramo:'conta',
      quando:'Converter volume e tempo em gotas por minuto sem bomba de infusão.',
      limites:'Assume equipo macrogotas de 20 gotas/mL. Confira o equipo do seu serviço.',
      fonte:'Cálculo de infusão' },
    ckdepi:{ ramo:'conta',
      quando:'Estadiar doença renal crônica e ajustar dose de medicamento.',
      limites:'Só vale com creatinina estável — não use na lesão renal aguda. Impreciso em extremos de massa muscular, amputado e gestante. Para ajuste de dose, alguns fármacos ainda exigem Cockcroft-Gault.',
      fonte:'CKD-EPI 2021, sem coeficiente de raça' },
    gestacao:{ ramo:'conta',
      quando:'Idade gestacional e DPP a partir da data da última menstruação.',
      limites:'Só é confiável com ciclo regular e DUM certa. A ultrassonografia do primeiro trimestre prevalece sobre a DUM.',
      fonte:'Regra de Naegele' },
    glasgow:{ ramo:'neuro',
      quando:'Nível de consciência no trauma e em qualquer rebaixamento.',
      limites:'Perde sentido no sedado, intubado, afásico e no álcool. Registre o componente que não pôde ser avaliado em vez de chutar. A resposta pupilar é o acréscimo GCS-P, não faz parte do Glasgow clássico.',
      fonte:'Teasdale & Jennett; GCS-P' },
    qsofa:{ ramo:'emerg',
      quando:'Triagem à beira do leito na suspeita de infecção, fora da terapia intensiva.',
      limites:'Sensibilidade baixa: qSOFA negativo NÃO exclui sepse. Serve para levantar suspeita, nunca para liberar paciente.',
      fonte:'Sepsis-3' },
    curb65:{ ramo:'resp',
      quando:'Decidir tratamento ambulatorial ou internação na pneumonia adquirida na comunidade.',
      limites:'Não considera oxigenação, comorbidade descompensada nem condição social. Não validado em imunossuprimido. Um CURB-65 baixo com SpO2 ruim ainda interna.',
      fonte:'British Thoracic Society' },
    'wells-tep':{ ramo:'resp',
      quando:'Probabilidade pré-teste de embolia pulmonar, antes de pedir D-dímero ou angiotomografia.',
      limites:'Depende do item subjetivo "TEP é o diagnóstico mais provável". Não validado na gestante — use YEARS ou o algoritmo adaptado.',
      fonte:'Wells et al.' },
    'wells-tvp':{ ramo:'resp',
      quando:'Probabilidade pré-teste de trombose venosa profunda de membro inferior.',
      limites:'Só validado para membro inferior. Menos confiável em quem já teve TVP no mesmo membro.',
      fonte:'Wells et al.' },
    sofa:{ ramo:'emerg',
      quando:'Quantificar disfunção orgânica; aumento de 2 pontos define sepse no Sepsis-3.',
      limites:'Precisa de exames que nem sempre estão prontos. Exige um valor basal para julgar a variação — em paciente sem doença prévia conhecida, assume-se basal zero.',
      fonte:'Sepsis-3 / SOFA' },
    nyha:{ ramo:'cardio',
      quando:'Classificar limitação funcional na insuficiência cardíaca.',
      limites:'Totalmente subjetiva e com baixa concordância entre observadores. Não é escore de risco agudo.',
      fonte:'New York Heart Association' },
    stevenson:{ ramo:'cardio',
      quando:'Definir a estratégia inicial na IC descompensada a partir de congestão e perfusão.',
      limites:'Avaliação clínica de perfusão é pouco sensível. O perfil L é o mais difícil de reconhecer e o mais fácil de piorar com diurético.',
      fonte:'Stevenson / Nohria' },
    heart:{ ramo:'cardio',
      quando:'Estratificar dor torácica no pronto-socorro e decidir alta precoce.',
      limites:'Não se aplica a supra de ST nem a paciente instável. Exige troponina; com troponina de alta sensibilidade, siga o protocolo 0/1 h do serviço.',
      fonte:'Six, Backus & Kelder' }
  };
  FERR_CALC.forEach(function (c) {
    var f = FICHA[c.id];
    if (!f) return;
    c.ramo = f.ramo; c.quando = f.quando; c.limites = f.limites; c.fonte = f.fonte;
  });

  /* =========================================================
     2. ESCORES NOVOS
     ========================================================= */
  var NOVOS = [];

  /* ---------------- CARDIOLOGIA ---------------- */
  NOVOS.push(

  { id:'timi-scasst', ramo:'cardio', tipo:'escore',
    nome:'TIMI — SCA sem supra', sub:'Risco em angina instável e IAMSSST',
    quando:'Dor torácica com ECG sem supra, para estimar risco de evento em 14 dias e apoiar a estratégia invasiva.',
    limites:'Não use no supra de ST (existe um TIMI próprio para IAMCSST). Desenvolvido antes da troponina de alta sensibilidade — hoje o HEART discrimina melhor a alta precoce.',
    fonte:'Antman et al., TIMI 11B/ESSENCE',
    itens:[
      { rot:'Idade maior ou igual a 65 anos', pts:1 },
      { rot:'Três ou mais fatores de risco para doença coronariana', pts:1 },
      { rot:'Doença coronariana conhecida (estenose maior ou igual a 50%)', pts:1 },
      { rot:'Uso de AAS nos últimos 7 dias', pts:1 },
      { rot:'Angina grave recente (2 ou mais episódios em 24 h)', pts:1 },
      { rot:'Desvio do segmento ST maior ou igual a 0,5 mm', pts:1 },
      { rot:'Marcador de necrose miocárdica elevado', pts:1 }
    ],
    faixa:function (t) {
      var d = t <= 2 ? 'Baixo risco (cerca de 5 a 8% de evento em 14 dias). Estratégia conservadora costuma ser suficiente.'
            : t <= 4 ? 'Risco intermediário (cerca de 13 a 20%). Considerar estratégia invasiva.'
            : 'Alto risco (cerca de 26 a 41%). Estratégia invasiva precoce.';
      return { valor:'TIMI ' + t + ' de 7', classe: t <= 2 ? 'ok' : (t <= 4 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'grace', ramo:'cardio', tipo:'escore', seletor:true, exige:true,
    nome:'GRACE', sub:'Mortalidade hospitalar na síndrome coronariana aguda',
    quando:'Estratificar SCA com ou sem supra e definir o tempo da estratégia invasiva.',
    limites:'ATENÇÃO: esta é a tabela de pontos do GRACE original. O GRACE 2.0, hoje recomendado, usa modelo não linear que NÃO se reproduz somando pontos — confira na calculadora oficial antes de usar o número para decidir conduta. Killip e creatinina precisam ser do momento da admissão.',
    fonte:'GRACE Registry (versão de pontos)',
    itens:[
      { rot:'Idade', opcoes:[[0,'menor que 30 anos'],[8,'30 a 39'],[25,'40 a 49'],[41,'50 a 59'],[58,'60 a 69'],[75,'70 a 79'],[91,'80 a 89'],[100,'90 anos ou mais']] },
      { rot:'Frequência cardíaca', opcoes:[[0,'menor que 50 bpm'],[3,'50 a 69'],[9,'70 a 89'],[15,'90 a 109'],[24,'110 a 149'],[38,'150 a 199'],[46,'200 bpm ou mais']] },
      { rot:'PA sistólica', opcoes:[[58,'menor que 80 mmHg'],[53,'80 a 99'],[43,'100 a 119'],[34,'120 a 139'],[24,'140 a 159'],[10,'160 a 199'],[0,'200 mmHg ou mais']] },
      { rot:'Creatinina', opcoes:[[1,'menor que 0,4 mg/dL'],[4,'0,4 a 0,79'],[7,'0,8 a 1,19'],[10,'1,2 a 1,59'],[13,'1,6 a 1,99'],[21,'2,0 a 3,99'],[28,'4,0 mg/dL ou mais']] },
      { rot:'Classe de Killip', opcoes:[[0,'I — sem insuficiência cardíaca'],[20,'II — estertores ou B3'],[39,'III — edema agudo de pulmão'],[59,'IV — choque cardiogênico']] },
      { rot:'Parada cardíaca na admissão', opcoes:[[0,'Não'],[39,'Sim']] },
      { rot:'Desvio do segmento ST', opcoes:[[0,'Não'],[28,'Sim']] },
      { rot:'Marcador de necrose elevado', opcoes:[[0,'Não'],[14,'Sim']] }
    ],
    faixa:function (t) {
      var d = t <= 108 ? 'Baixo risco — mortalidade hospitalar menor que 1%. Estratégia invasiva pode ser eletiva.'
            : t <= 140 ? 'Risco intermediário — mortalidade de 1 a 3%. Invasiva em até 72 h.'
            : 'Alto risco — mortalidade acima de 3%. Invasiva precoce, em até 24 h.';
      return { valor:'GRACE ' + t, classe: t <= 108 ? 'ok' : (t <= 140 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'cha2ds2vasc', ramo:'cardio', tipo:'escore',
    nome:'CHA₂DS₂-VASc', sub:'Risco tromboembólico na fibrilação atrial',
    quando:'Decidir anticoagulação na fibrilação atrial ou no flutter não valvar.',
    limites:'Não se aplica à FA valvar (estenose mitral moderada a grave ou prótese mecânica) — essas anticoagulam sempre. O escore estima risco de AVC, não de sangramento: use junto com o HAS-BLED, que orienta corrigir fatores, nunca deixar de anticoagular.',
    fonte:'Lip et al.; diretriz brasileira de fibrilação atrial',
    itens:[
      { rot:'C — insuficiência cardíaca ou disfunção ventricular esquerda', pts:1 },
      { rot:'H — hipertensão arterial', pts:1 },
      { rot:'A₂ — idade maior ou igual a 75 anos', pts:2 },
      { rot:'D — diabetes mellitus', pts:1 },
      { rot:'S₂ — AVC, AIT ou tromboembolismo prévio', pts:2 },
      { rot:'V — doença vascular (IAM prévio, arteriopatia periférica, placa aórtica)', pts:1 },
      { rot:'A — idade de 65 a 74 anos', pts:1 },
      { rot:'Sc — sexo feminino', pts:1 }
    ],
    faixa:function (t) {
      var d = t === 0 ? 'Risco baixo. No homem com 0 ponto, anticoagulação em geral não é indicada.'
            : t === 1 ? 'Risco baixo a intermediário. No homem com 1 ponto, considerar anticoagular. Na mulher, 1 ponto apenas pelo sexo equivale a risco baixo.'
            : 'Anticoagulação indicada (2 ou mais no homem, 3 ou mais na mulher), salvo contraindicação.';
      return { valor:'CHA₂DS₂-VASc ' + t + ' de 9', classe: t <= 1 ? 'ok' : (t <= 3 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'hasbled', ramo:'cardio', tipo:'escore',
    nome:'HAS-BLED', sub:'Risco de sangramento maior sob anticoagulação',
    quando:'Junto com o CHA₂DS₂-VASc, para identificar e corrigir fatores de sangramento modificáveis.',
    limites:'Escore ALTO NÃO É CONTRAINDICAÇÃO a anticoagular — serve para corrigir o que é modificável (PA, álcool, anti-inflamatório, INR instável) e encurtar o intervalo de reavaliação. Vários itens também pontuam no risco de AVC.',
    fonte:'Pisters et al.',
    itens:[
      { rot:'H — hipertensão não controlada (PAS maior que 160 mmHg)', pts:1 },
      { rot:'A — função renal alterada (diálise, transplante ou creatinina maior que 2,26 mg/dL)', pts:1 },
      { rot:'A — função hepática alterada (cirrose, ou bilirrubina e transaminases elevadas)', pts:1 },
      { rot:'S — AVC prévio', pts:1 },
      { rot:'B — sangramento prévio ou predisposição (anemia)', pts:1 },
      { rot:'L — INR instável ou fora da faixa (só para varfarina)', pts:1 },
      { rot:'E — idade maior que 65 anos', pts:1 },
      { rot:'D — medicamento que aumenta sangramento (antiagregante, anti-inflamatório)', pts:1 },
      { rot:'D — uso abusivo de álcool', pts:1 }
    ],
    faixa:function (t) {
      var d = t <= 2 ? 'Risco de sangramento baixo a moderado. Anticoagular conforme o CHA₂DS₂-VASc.'
            : 'Risco alto. Corrija os fatores modificáveis e reavalie com mais frequência — mas o escore alto, sozinho, não impede a anticoagulação.';
      return { valor:'HAS-BLED ' + t + ' de 9', classe: t <= 2 ? 'ok' : 'atencao', detalhe:d };
    } }

  );

  /* ---------------- PNEUMOLOGIA E TROMBOEMBOLISMO ---------------- */
  NOVOS.push(

  { id:'perc', ramo:'resp', tipo:'escore',
    nome:'PERC', sub:'Regra de exclusão de TEP no baixo risco',
    quando:'Só depois de já ter julgado o paciente de BAIXO risco para TEP. Marque o que ESTIVER presente: a regra só afasta TEP se nenhum item marcar.',
    limites:'Não use em risco intermediário ou alto — nesses, PERC negativo não exclui nada. Não validado na gestante. É regra de exclusão, não escore de probabilidade.',
    fonte:'Kline et al.',
    itens:[
      { rot:'Idade maior ou igual a 50 anos', pts:1 },
      { rot:'FC maior ou igual a 100 bpm', pts:1 },
      { rot:'SpO₂ menor que 95% em ar ambiente', pts:1 },
      { rot:'Hemoptise', pts:1 },
      { rot:'Uso de estrogênio', pts:1 },
      { rot:'TVP ou TEP prévios', pts:1 },
      { rot:'Cirurgia ou trauma com internação nas últimas 4 semanas', pts:1 },
      { rot:'Edema unilateral de membro inferior', pts:1 }
    ],
    faixa:function (t) {
      return t === 0
        ? { valor:'PERC negativo', classe:'ok', detalhe:'Nenhum critério presente. Em paciente de baixo risco, TEP está afastado — não peça D-dímero nem angiotomografia.' }
        : { valor:'PERC positivo — ' + t + (t === 1 ? ' critério' : ' critérios'), classe:'atencao',
            detalhe:'A regra não afasta TEP. Siga com D-dímero e, se positivo, angiotomografia.' };
    } },

  { id:'spesi', ramo:'resp', tipo:'escore',
    nome:'sPESI', sub:'Prognóstico simplificado no TEP confirmado',
    quando:'TEP já confirmado, para decidir entre tratamento domiciliar, enfermaria e leito monitorizado.',
    limites:'Só se aplica a TEP CONFIRMADO — não serve para diagnóstico. sPESI zero não libera para casa se houver disfunção de ventrículo direito, troponina elevada, sangramento, dor incontrolável ou falta de suporte domiciliar.',
    fonte:'Jiménez et al.',
    itens:[
      { rot:'Idade maior que 80 anos', pts:1 },
      { rot:'Câncer', pts:1 },
      { rot:'Doença cardiopulmonar crônica', pts:1 },
      { rot:'FC maior ou igual a 110 bpm', pts:1 },
      { rot:'PA sistólica menor que 100 mmHg', pts:1 },
      { rot:'SaO₂ menor que 90%', pts:1 }
    ],
    faixa:function (t) {
      return t === 0
        ? { valor:'sPESI 0 — baixo risco', classe:'ok',
            detalhe:'Mortalidade em 30 dias em torno de 1%. Tratamento ambulatorial pode ser considerado se ventrículo direito normal e suporte social garantido.' }
        : { valor:'sPESI ' + t + ' — alto risco', classe:'grave',
            detalhe:'Mortalidade em 30 dias em torno de 10%. Internar; avaliar leito monitorizado.' };
    } },

  { id:'pesi', ramo:'resp', tipo:'formula', secao:'escore',
    nome:'PESI', sub:'Prognóstico completo no TEP — classes I a V',
    quando:'TEP confirmado, quando se quer a estratificação em cinco classes em vez do sim/não do sPESI.',
    limites:'Só para TEP confirmado. Não incorpora função do ventrículo direito nem troponina, que também mudam a conduta.',
    fonte:'Aujesky et al.',
    campos:[
      { k:'idade', rot:'Idade (anos)', min:18, max:110 },
      { k:'sexo',  rot:'Sexo', opcoes:[['10','Masculino'],['0','Feminino']] },
      { k:'fc',    rot:'FC (bpm)', min:20, max:250 },
      { k:'pas',   rot:'PAS (mmHg)', min:40, max:260 },
      { k:'fr',    rot:'FR (irpm)', min:5, max:60 },
      { k:'temp',  rot:'Temperatura (°C)', min:30, max:43, passo:0.1 },
      { k:'spo2',  rot:'SpO₂ (%)', min:50, max:100 },
      { k:'ca',    rot:'Câncer', opcoes:[['0','Não'],['30','Sim']] },
      { k:'ic',    rot:'Insuficiência cardíaca', opcoes:[['0','Não'],['10','Sim']] },
      { k:'dpoc',  rot:'Doença pulmonar crônica', opcoes:[['0','Não'],['10','Sim']] },
      { k:'mental',rot:'Alteração do estado mental', opcoes:[['0','Não'],['60','Sim']] }
    ],
    calc:function (v) {
      var t = v.idade + Number(v.sexo) + Number(v.ca) + Number(v.ic) + Number(v.dpoc) + Number(v.mental);
      if (v.fc >= 110) t += 20;
      if (v.pas < 100) t += 30;
      if (v.fr >= 30) t += 20;
      if (v.temp < 36) t += 20;
      if (v.spo2 < 90) t += 20;
      var cls, txt, cl;
      if (t <= 65)       { cls = 'I';   txt = 'risco muito baixo (mortalidade em 30 dias de 0 a 1,6%)'; cl = 'ok'; }
      else if (t <= 85)  { cls = 'II';  txt = 'risco baixo (1,7 a 3,5%)'; cl = 'ok'; }
      else if (t <= 105) { cls = 'III'; txt = 'risco intermediário (3,2 a 7,1%)'; cl = 'atencao'; }
      else if (t <= 125) { cls = 'IV';  txt = 'risco alto (4,0 a 11,4%)'; cl = 'grave'; }
      else               { cls = 'V';   txt = 'risco muito alto (10,0 a 24,5%)'; cl = 'grave'; }
      return { valor:'PESI ' + t + ' — classe ' + cls, classe:cl,
               detalhe:'Classe ' + cls + ', ' + txt + '. Classes I e II admitem tratamento ambulatorial se o ventrículo direito estiver normal.' };
    } },

  { id:'psi', ramo:'resp', tipo:'formula', secao:'escore',
    nome:'PSI / PORT', sub:'Estratificação de risco na pneumonia comunitária',
    quando:'Alternativa mais detalhada ao CURB-65, quando se quer identificar com segurança quem pode ir para casa.',
    limites:'ATENÇÃO: tabela longa de pontos — confira o total em calculadora oficial antes de usar para decidir alta. Tende a subestimar risco no jovem sem comorbidade. Não validado em imunossuprimido. Deixe os campos laboratoriais em branco se não houver o exame; o total sai subestimado e o resultado avisa.',
    fonte:'Fine et al., PORT',
    campos:[
      { k:'idade', rot:'Idade (anos)', min:18, max:110 },
      { k:'sexo',  rot:'Sexo', opcoes:[['0','Masculino'],['-10','Feminino']] },
      { k:'asilo', rot:'Reside em instituição de longa permanência', opcoes:[['0','Não'],['10','Sim']] },
      { k:'neo',   rot:'Neoplasia', opcoes:[['0','Não'],['30','Sim']] },
      { k:'hep',   rot:'Doença hepática', opcoes:[['0','Não'],['20','Sim']] },
      { k:'icc',   rot:'Insuficiência cardíaca', opcoes:[['0','Não'],['10','Sim']] },
      { k:'avc',   rot:'Doença cerebrovascular', opcoes:[['0','Não'],['10','Sim']] },
      { k:'renal', rot:'Doença renal', opcoes:[['0','Não'],['10','Sim']] },
      { k:'mental',rot:'Alteração do estado mental', opcoes:[['0','Não'],['20','Sim']] },
      { k:'fr',    rot:'FR (irpm)', min:5, max:60 },
      { k:'pas',   rot:'PAS (mmHg)', min:40, max:260 },
      { k:'temp',  rot:'Temperatura (°C)', min:30, max:43, passo:0.1 },
      { k:'fc',    rot:'FC (bpm)', min:20, max:250 },
      { k:'ph',    rot:'pH arterial (deixe vazio se não houver)', min:6.5, max:7.8, passo:0.01, opcional:true },
      { k:'ureia', rot:'Ureia mg/dL (vazio se não houver)', min:5, max:400, opcional:true },
      { k:'na',    rot:'Sódio mEq/L (vazio se não houver)', min:100, max:180, opcional:true },
      { k:'glic',  rot:'Glicemia mg/dL (vazio se não houver)', min:20, max:1000, opcional:true },
      { k:'ht',    rot:'Hematócrito % (vazio se não houver)', min:10, max:65, opcional:true },
      { k:'pao2',  rot:'PaO₂ mmHg (vazio se não houver)', min:20, max:200, opcional:true },
      { k:'deramme', rot:'Derrame pleural na radiografia', opcoes:[['0','Não'],['10','Sim']] }
    ],
    calc:function (v) {
      var t = v.idade + Number(v.sexo) + Number(v.asilo) + Number(v.neo) + Number(v.hep) +
              Number(v.icc) + Number(v.avc) + Number(v.renal) + Number(v.mental) + Number(v.deramme);
      if (v.fr >= 30) t += 20;
      if (v.pas < 90) t += 20;
      if (v.temp < 35 || v.temp >= 40) t += 15;
      if (v.fc >= 125) t += 10;
      var faltou = 0;
      /* ureia do PSI usa BUN > 30 mg/dL; ureia brasileira equivalente = 64 mg/dL */
      if (v.ph   === undefined) faltou++; else if (v.ph < 7.35) t += 30;
      if (v.ureia=== undefined) faltou++; else if (v.ureia > 64) t += 20;
      if (v.na   === undefined) faltou++; else if (v.na < 130) t += 20;
      if (v.glic === undefined) faltou++; else if (v.glic >= 250) t += 10;
      if (v.ht   === undefined) faltou++; else if (v.ht < 30) t += 10;
      if (v.pao2 === undefined) faltou++; else if (v.pao2 < 60) t += 10;

      var cls, cl, d;
      if (t <= 70)       { cls = 'II';  cl = 'ok';      d = 'Mortalidade em torno de 0,6 a 0,9%. Tratamento ambulatorial.'; }
      else if (t <= 90)  { cls = 'III'; cl = 'atencao'; d = 'Mortalidade em torno de 0,9 a 2,8%. Observação curta ou internação breve.'; }
      else if (t <= 130) { cls = 'IV';  cl = 'grave';   d = 'Mortalidade em torno de 8,2 a 9,3%. Internação.'; }
      else               { cls = 'V';   cl = 'grave';   d = 'Mortalidade em torno de 27 a 31%. Internação; avaliar terapia intensiva.'; }
      if (t <= 70 && v.idade < 50) {
        d = 'Classe I ou II. Em menor de 50 anos sem comorbidade e sem alteração de sinais vitais, o PSI classifica como classe I — tratamento ambulatorial. ' + d;
      }
      return { valor:'PSI ' + t + ' — classe ' + cls, classe:cl,
               detalhe:d + (faltou ? ' ATENÇÃO: ' + faltou + (faltou === 1 ? ' variável laboratorial ficou em branco' : ' variáveis laboratoriais ficaram em branco') + ' — o total está subestimado.' : '') };
    } }

  );

  /* ---------------- EMERGÊNCIA E SEPSE ---------------- */
  NOVOS.push(

  { id:'news2', ramo:'emerg', tipo:'escore', seletor:true, exige:true,
    nome:'NEWS2', sub:'Deterioração clínica à beira do leito',
    quando:'Reavaliação seriada de qualquer paciente internado ou em observação, para detectar piora antes do colapso.',
    limites:'Esta é a escala 1 de SpO₂. No retentor crônico de CO₂ com alvo de 88 a 92% usa-se a escala 2, que não está implementada aqui. Não validado em gestante, criança nem em doença crônica descompensada de base. Um único parâmetro com 3 pontos já pede avaliação urgente, mesmo com total baixo.',
    fonte:'Royal College of Physicians, NEWS2',
    itens:[
      { rot:'Frequência respiratória', opcoes:[[3,'menor ou igual a 8 irpm'],[1,'9 a 11'],[0,'12 a 20'],[2,'21 a 24'],[3,'25 irpm ou mais']] },
      { rot:'SpO₂ (escala 1)', opcoes:[[3,'menor ou igual a 91%'],[2,'92 a 93%'],[1,'94 a 95%'],[0,'96% ou mais']] },
      { rot:'Oxigênio suplementar', opcoes:[[0,'Ar ambiente'],[2,'Em uso de oxigênio']] },
      { rot:'PA sistólica', opcoes:[[3,'menor ou igual a 90 mmHg'],[2,'91 a 100'],[1,'101 a 110'],[0,'111 a 219'],[3,'220 mmHg ou mais']] },
      { rot:'Frequência cardíaca', opcoes:[[3,'menor ou igual a 40 bpm'],[1,'41 a 50'],[0,'51 a 90'],[1,'91 a 110'],[2,'111 a 130'],[3,'131 bpm ou mais']] },
      { rot:'Nível de consciência', opcoes:[[0,'Alerta'],[3,'Confuso, responde a voz ou dor, ou irresponsivo']] },
      { rot:'Temperatura', opcoes:[[3,'menor ou igual a 35,0 °C'],[1,'35,1 a 36,0'],[0,'36,1 a 38,0'],[1,'38,1 a 39,0'],[2,'39,1 °C ou mais']] }
    ],
    faixa:function (t) {
      var d = t === 0 ? 'Risco baixo. Reavaliar a cada 12 h.'
            : t <= 4  ? 'Risco baixo. Reavaliar a cada 4 a 6 h.'
            : t <= 6  ? 'Risco médio. Reavaliar de hora em hora e acionar avaliação médica urgente.'
            : 'Risco alto. Avaliação imediata por equipe com competência em cuidados críticos; monitorização contínua.';
      return { valor:'NEWS2 ' + t, classe: t <= 4 ? 'ok' : (t <= 6 ? 'atencao' : 'grave'),
               detalhe:d + ' Lembre: qualquer parâmetro isolado valendo 3 já exige avaliação urgente.' };
    } }

  );

  /* ---------------- NEUROLOGIA ---------------- */
  NOVOS.push(

  { id:'nihss', ramo:'neuro', tipo:'escore', seletor:true, exige:true,
    nome:'NIHSS', sub:'Gravidade do déficit no AVC',
    quando:'AVC isquêmico agudo: quantifica o déficit, orienta trombólise e trombectomia e serve de referência para as reavaliações.',
    limites:'Pontua desproporcionalmente território de circulação anterior esquerda; AVC de fossa posterior pode ter NIHSS baixo e ser grave. Não é escore de decisão isolado: NIHSS baixo não contraindica trombólise se o déficit for incapacitante. Exige treinamento formal para reprodutibilidade.',
    fonte:'National Institutes of Health Stroke Scale',
    itens:[
      { rot:'1a. Nível de consciência', opcoes:[[0,'0 — alerta'],[1,'1 — desperta com estímulo leve'],[2,'2 — só com estímulo repetido ou doloroso'],[3,'3 — irresponsivo ou reflexo apenas']] },
      { rot:'1b. Perguntas (mês e idade)', opcoes:[[0,'0 — acerta as duas'],[1,'1 — acerta uma'],[2,'2 — não acerta nenhuma']] },
      { rot:'1c. Comandos (abrir/fechar olhos e mão)', opcoes:[[0,'0 — executa os dois'],[1,'1 — executa um'],[2,'2 — não executa nenhum']] },
      { rot:'2. Melhor olhar conjugado', opcoes:[[0,'0 — normal'],[1,'1 — paresia parcial do olhar'],[2,'2 — desvio forçado ou paresia total']] },
      { rot:'3. Campos visuais', opcoes:[[0,'0 — sem perda'],[1,'1 — hemianopsia parcial'],[2,'2 — hemianopsia completa'],[3,'3 — hemianopsia bilateral ou cegueira']] },
      { rot:'4. Paralisia facial', opcoes:[[0,'0 — normal'],[1,'1 — paralisia leve'],[2,'2 — paralisia parcial (face inferior)'],[3,'3 — paralisia completa']] },
      { rot:'5a. Motor — braço esquerdo', opcoes:[[0,'0 — sem queda em 10 s'],[1,'1 — queda parcial'],[2,'2 — algum esforço contra gravidade'],[3,'3 — sem esforço contra gravidade'],[4,'4 — nenhum movimento']] },
      { rot:'5b. Motor — braço direito', opcoes:[[0,'0 — sem queda em 10 s'],[1,'1 — queda parcial'],[2,'2 — algum esforço contra gravidade'],[3,'3 — sem esforço contra gravidade'],[4,'4 — nenhum movimento']] },
      { rot:'6a. Motor — perna esquerda', opcoes:[[0,'0 — sem queda em 5 s'],[1,'1 — queda parcial'],[2,'2 — algum esforço contra gravidade'],[3,'3 — sem esforço contra gravidade'],[4,'4 — nenhum movimento']] },
      { rot:'6b. Motor — perna direita', opcoes:[[0,'0 — sem queda em 5 s'],[1,'1 — queda parcial'],[2,'2 — algum esforço contra gravidade'],[3,'3 — sem esforço contra gravidade'],[4,'4 — nenhum movimento']] },
      { rot:'7. Ataxia de membros', opcoes:[[0,'0 — ausente'],[1,'1 — em um membro'],[2,'2 — em dois membros']] },
      { rot:'8. Sensibilidade', opcoes:[[0,'0 — normal'],[1,'1 — perda leve a moderada'],[2,'2 — perda grave ou total']] },
      { rot:'9. Linguagem', opcoes:[[0,'0 — normal'],[1,'1 — afasia leve a moderada'],[2,'2 — afasia grave'],[3,'3 — mutismo ou afasia global']] },
      { rot:'10. Disartria', opcoes:[[0,'0 — normal'],[1,'1 — leve a moderada'],[2,'2 — grave ou anartria']] },
      { rot:'11. Extinção e desatenção', opcoes:[[0,'0 — ausente'],[1,'1 — em uma modalidade'],[2,'2 — em mais de uma modalidade']] }
    ],
    faixa:function (t) {
      var d = t === 0 ? 'Sem déficit mensurável. Déficit incapacitante mesmo com NIHSS baixo ainda pode indicar trombólise.'
            : t <= 4  ? 'AVC menor. Avaliar trombólise se o déficit for incapacitante.'
            : t <= 15 ? 'AVC moderado.'
            : t <= 20 ? 'AVC moderado a grave.'
            : 'AVC grave. Maior risco de transformação hemorrágica.';
      return { valor:'NIHSS ' + t + ' de 42', classe: t <= 4 ? 'ok' : (t <= 15 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'aspects', ramo:'neuro', tipo:'escore',
    nome:'ASPECTS', sub:'Extensão da isquemia precoce na TC de crânio',
    quando:'AVC isquêmico de circulação anterior: avalia a TC sem contraste e apoia a indicação de trombectomia. Marque as regiões COM alteração isquêmica precoce.',
    limites:'Só vale para território de artéria cerebral média. Baixa concordância entre observadores nas primeiras horas. Não se aplica a circulação posterior, onde existe o pc-ASPECTS.',
    fonte:'Barber et al., Alberta Stroke Program',
    itens:[
      { rot:'Núcleo caudado', pts:-1 },
      { rot:'Núcleo lentiforme', pts:-1 },
      { rot:'Cápsula interna', pts:-1 },
      { rot:'Córtex insular', pts:-1 },
      { rot:'M1 — córtex frontal anterior', pts:-1 },
      { rot:'M2 — córtex temporal anterior lateral à ínsula', pts:-1 },
      { rot:'M3 — córtex temporal posterior', pts:-1 },
      { rot:'M4 — território anterior superior a M1', pts:-1 },
      { rot:'M5 — território lateral superior a M2', pts:-1 },
      { rot:'M6 — território posterior superior a M3', pts:-1 }
    ],
    faixa:function (t) {
      var p = 10 + t;
      var d = p >= 8 ? 'Isquemia precoce pequena. Bom candidato à terapia de reperfusão.'
            : p >= 6 ? 'Isquemia moderada. Trombectomia ainda pode beneficiar; decisão em conjunto com a neurologia.'
            : 'Isquemia extensa. Menor benefício e maior risco de transformação hemorrágica.';
      return { valor:'ASPECTS ' + p + ' de 10', classe: p >= 8 ? 'ok' : (p >= 6 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'abcd2', ramo:'neuro', tipo:'escore', seletor:true,
    nome:'ABCD²', sub:'Risco de AVC após ataque isquêmico transitório',
    quando:'Depois de um AIT, para estimar o risco de AVC nos dias seguintes.',
    limites:'Discrimina mal e NÃO deve ser usado para mandar paciente com AIT para casa. A conduta atual é investigar todo AIT rapidamente — carótidas, ritmo e imagem — independentemente da pontuação.',
    fonte:'Johnston et al.',
    itens:[
      { rot:'A — idade', opcoes:[[0,'menor que 60 anos'],[1,'60 anos ou mais']] },
      { rot:'B — pressão arterial na avaliação', opcoes:[[0,'menor que 140/90 mmHg'],[1,'140/90 mmHg ou mais']] },
      { rot:'C — características clínicas', opcoes:[[0,'Outras'],[1,'Distúrbio de fala sem fraqueza'],[2,'Fraqueza unilateral']] },
      { rot:'D — duração dos sintomas', opcoes:[[0,'menor que 10 minutos'],[1,'10 a 59 minutos'],[2,'60 minutos ou mais']] },
      { rot:'D — diabetes', opcoes:[[0,'Não'],[1,'Sim']] }
    ],
    faixa:function (t) {
      var d = t <= 3 ? 'Risco baixo pelo escore — mas o escore não autoriza alta sem investigação.'
            : t <= 5 ? 'Risco moderado.'
            : 'Risco alto.';
      return { valor:'ABCD² ' + t + ' de 7', classe: t <= 3 ? 'ok' : (t <= 5 ? 'atencao' : 'grave'),
               detalhe:d + ' Todo AIT precisa de investigação urgente de carótida, ritmo cardíaco e imagem.' };
    } }

  );

  /* ---------------- TRAUMA E QUEIMADURAS ---------------- */
  NOVOS.push(

  { id:'cchr', ramo:'trauma', tipo:'escore',
    nome:'Canadian CT Head Rule', sub:'Indicação de TC no trauma craniano leve',
    quando:'Adulto com TCE leve (Glasgow 13 a 15) e perda de consciência, amnésia ou desorientação testemunhadas. Marque o que estiver presente.',
    limites:'NÃO se aplica a: menor de 16 anos, anticoagulado ou com distúrbio de coagulação, crise convulsiva após o trauma, Glasgow abaixo de 13, déficit focal, ou trauma sem perda de consciência. Nesses casos, decida pela clínica — em geral, tomografar.',
    fonte:'Stiell et al.',
    itens:[
      { rot:'Alto risco — Glasgow menor que 15 duas horas após o trauma', pts:1 },
      { rot:'Alto risco — suspeita de fratura aberta ou afundamento de crânio', pts:1 },
      { rot:'Alto risco — sinal de fratura de base de crânio', pts:1 },
      { rot:'Alto risco — dois ou mais episódios de vômito', pts:1 },
      { rot:'Alto risco — idade maior ou igual a 65 anos', pts:1 },
      { rot:'Médio risco — amnésia retrógrada maior que 30 minutos', pts:1 },
      { rot:'Médio risco — mecanismo perigoso (atropelamento, ejeção, queda maior que 1 m ou 5 degraus)', pts:1 }
    ],
    faixa:function (t) {
      return t === 0
        ? { valor:'Nenhum critério', classe:'ok', detalhe:'Tomografia não indicada pela regra. Observação clínica e orientação de retorno por escrito.' }
        : { valor:t + (t === 1 ? ' critério presente' : ' critérios presentes'), classe:'atencao',
            detalhe:'Tomografia de crânio indicada. Confira antes se o paciente não está fora do escopo da regra.' };
    } },

  { id:'nexus', ramo:'trauma', tipo:'escore',
    nome:'NEXUS cervical', sub:'Quando dispensar imagem da coluna cervical',
    quando:'Trauma fechado com suspeita de lesão cervical. Marque o que estiver presente: só dispensa imagem se NENHUM item marcar.',
    limites:'Menos específico que a regra canadense. Cautela no idoso, que fratura com trauma mínimo e pode não ter dor. Um item marcado não significa fratura — significa que a imagem é necessária.',
    fonte:'Hoffman et al., NEXUS',
    itens:[
      { rot:'Dor à palpação da linha média cervical posterior', pts:1 },
      { rot:'Déficit neurológico focal', pts:1 },
      { rot:'Nível de consciência alterado', pts:1 },
      { rot:'Intoxicação', pts:1 },
      { rot:'Lesão dolorosa que distrai a atenção', pts:1 }
    ],
    faixa:function (t) {
      return t === 0
        ? { valor:'NEXUS negativo', classe:'ok', detalhe:'Nenhum critério. Lesão cervical clinicamente significativa é muito improvável — imagem dispensável e colar pode ser retirado.' }
        : { valor:'NEXUS positivo — ' + t + (t === 1 ? ' critério' : ' critérios'), classe:'atencao',
            detalhe:'Mantenha a imobilização e solicite imagem da coluna cervical.' };
    } },

  { id:'ccr', ramo:'trauma', tipo:'escore', seletor:true, exige:true,
    nome:'Canadian C-Spine Rule', sub:'Imagem cervical no trauma alerta e estável',
    quando:'Trauma fechado em paciente alerta (Glasgow 15) e estável. Responda as três perguntas na ordem.',
    limites:'NÃO se aplica a: menor de 16 anos, Glasgow abaixo de 15, instabilidade, paraplegia ou tetraplegia, doença vertebral prévia, ou trauma com mais de 48 h. Mais específica que o NEXUS, mas exige que o paciente colabore com a rotação do pescoço.',
    fonte:'Stiell et al.',
    itens:[
      { rot:'1. Há fator de alto risco? (idade 65 anos ou mais, mecanismo perigoso, ou parestesia em extremidades)',
        opcoes:[[0,'Não'],[100,'Sim — imagem indicada, pare aqui']] },
      { rot:'2. Há fator de baixo risco que permita avaliar a rotação? (colisão traseira simples, sentado no PS, deambulou, dor cervical de início tardio, sem dor à palpação da linha média)',
        opcoes:[[0,'Sim — pode testar a rotação'],[100,'Não — imagem indicada']] },
      { rot:'3. Consegue rodar ativamente o pescoço 45° para os dois lados?',
        opcoes:[[0,'Sim'],[100,'Não — imagem indicada']] }
    ],
    faixa:function (t) {
      return t === 0
        ? { valor:'Imagem dispensável', classe:'ok', detalhe:'Sem fator de alto risco, com fator de baixo risco presente e rotação de 45° preservada. Colar pode ser retirado.' }
        : { valor:'Imagem indicada', classe:'atencao', detalhe:'Ao menos um passo da regra falhou. Mantenha a imobilização e solicite imagem da coluna cervical.' };
    } },

  { id:'baux', ramo:'trauma', tipo:'formula', secao:'escore',
    nome:'Baux revisado', sub:'Prognóstico em queimadura',
    quando:'Estimar mortalidade em grande queimado e apoiar a decisão de transferência para centro de referência.',
    limites:'Estimativa populacional, não sentença individual: os dados de origem são antigos e a sobrevida melhorou muito. Não substitui a avaliação do centro de queimados. A superfície corporal queimada não inclui queimadura de primeiro grau.',
    fonte:'Baux; revisão de Osler et al.',
    campos:[
      { k:'idade', rot:'Idade (anos)', min:0, max:110 },
      { k:'scq',   rot:'Superfície corporal queimada (%) — sem 1º grau', min:1, max:100 },
      { k:'inal',  rot:'Lesão inalatória', opcoes:[['0','Não'],['17','Sim']] }
    ],
    calc:function (v) {
      var t = v.idade + v.scq + Number(v.inal);
      var cl = t >= 110 ? 'grave' : (t >= 80 ? 'atencao' : 'ok');
      var d  = t >= 140 ? 'Mortalidade estimada muito alta. Discutir cuidados de conforto junto com o centro de queimados.'
             : t >= 110 ? 'Mortalidade estimada alta. Centro de queimados e terapia intensiva.'
             : t >= 80  ? 'Risco intermediário. Encaminhar a centro de queimados.'
             : 'Risco menor. Ainda assim, avalie critérios formais de transferência.';
      return { valor:'Baux revisado ' + t, classe:cl, detalhe:d + ' Regra prática: acima de 100, a mortalidade já se aproxima de 50%.' };
    } }

  );

  /* ---------------- PEDIATRIA ---------------- */
  NOVOS.push(

  { id:'pecarn2', ramo:'pedia', tipo:'escore', seletor:true, exige:true,
    nome:'PECARN — 2 anos ou mais', sub:'TC de crânio no trauma craniano pediátrico',
    quando:'Criança de 2 anos ou mais com TCE nas últimas 24 h e Glasgow 14 ou 15.',
    limites:'Não se aplica a trauma trivial sem mecanismo, a Glasgow abaixo de 14, a distúrbio de coagulação, tumor cerebral, derivação ventricular ou suspeita de maus-tratos. Na faixa intermediária, observar por 4 a 6 h é alternativa validada à tomografia.',
    fonte:'Kuppermann et al., PECARN',
    itens:[
      { rot:'Glasgow 14, ou sinais de alteração do estado mental', opcoes:[[0,'Não'],[100,'Sim']] },
      { rot:'Sinal de fratura de base de crânio', opcoes:[[0,'Não'],[100,'Sim']] },
      { rot:'História de perda de consciência', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'História de vômitos', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Mecanismo grave de trauma', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Cefaleia intensa', opcoes:[[0,'Não'],[1,'Sim']] }
    ],
    faixa:function (t) {
      if (t >= 100) return { valor:'TC indicada', classe:'grave',
        detalhe:'Glasgow 14, alteração do estado mental ou sinal de fratura de base: risco de lesão clinicamente importante em torno de 4%. Tomografia de crânio.' };
      if (t === 0) return { valor:'TC não indicada', classe:'ok',
        detalhe:'Nenhum critério. Risco de lesão clinicamente importante abaixo de 0,05% — observação clínica e orientação de retorno.' };
      return { valor:'Zona intermediária — ' + t + (t === 1 ? ' critério' : ' critérios'), classe:'atencao',
        detalhe:'Risco em torno de 0,9%. Observar por 4 a 6 h ou tomografar — decida pela evolução, pela idade, pelo número de critérios e pela possibilidade de retorno.' };
    } },

  { id:'pecarn1', ramo:'pedia', tipo:'escore', seletor:true, exige:true,
    nome:'PECARN — menor de 2 anos', sub:'TC de crânio no lactente e no pré-escolar',
    quando:'Criança com menos de 2 anos, TCE nas últimas 24 h e Glasgow 14 ou 15.',
    limites:'Mesmas exclusões da versão maior. Nesta faixa, hematoma de couro cabeludo não frontal e a percepção dos pais de que a criança "não está ela mesma" pesam muito — leve a sério.',
    fonte:'Kuppermann et al., PECARN',
    itens:[
      { rot:'Glasgow 14, ou sinais de alteração do estado mental', opcoes:[[0,'Não'],[100,'Sim']] },
      { rot:'Fratura de crânio palpável', opcoes:[[0,'Não'],[100,'Sim']] },
      { rot:'Hematoma de couro cabeludo occipital, parietal ou temporal', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Perda de consciência por 5 segundos ou mais', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Mecanismo grave de trauma', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Os pais dizem que a criança não está agindo normalmente', opcoes:[[0,'Não'],[1,'Sim']] }
    ],
    faixa:function (t) {
      if (t >= 100) return { valor:'TC indicada', classe:'grave',
        detalhe:'Alteração do estado mental ou fratura palpável: risco em torno de 4%. Tomografia de crânio.' };
      if (t === 0) return { valor:'TC não indicada', classe:'ok',
        detalhe:'Nenhum critério. Risco abaixo de 0,02% — observação clínica e orientação de retorno aos cuidadores.' };
      return { valor:'Zona intermediária — ' + t + (t === 1 ? ' critério' : ' critérios'), classe:'atencao',
        detalhe:'Risco em torno de 0,9%. Observar por 4 a 6 h ou tomografar. Abaixo de 3 meses o limiar para tomografar é mais baixo.' };
    } }

  );

  /* ---------------- GASTRO E FÍGADO ---------------- */
  NOVOS.push(

  { id:'blatchford', ramo:'gastro', tipo:'formula', secao:'escore',
    nome:'Glasgow-Blatchford', sub:'Necessidade de intervenção na hemorragia digestiva alta',
    quando:'HDA na chegada, ANTES da endoscopia: identifica quem pode ser conduzido sem internação.',
    limites:'A ureia é informada na unidade brasileira (mg/dL) e convertida internamente. Escore zero não libera automaticamente: hepatopata, anticoagulado, idoso frágil e quem não tem como retornar continuam internando.',
    fonte:'Blatchford et al.',
    campos:[
      { k:'ureia', rot:'Ureia (mg/dL)', min:5, max:400 },
      { k:'hb',    rot:'Hemoglobina (g/dL)', min:2, max:20, passo:0.1 },
      { k:'sexo',  rot:'Sexo', opcoes:[['h','Masculino'],['m','Feminino']] },
      { k:'pas',   rot:'PA sistólica (mmHg)', min:40, max:260 },
      { k:'fc',    rot:'FC (bpm)', min:20, max:250 },
      { k:'melena',rot:'Melena', opcoes:[['0','Não'],['1','Sim']] },
      { k:'sinc',  rot:'Síncope', opcoes:[['0','Não'],['2','Sim']] },
      { k:'hepa',  rot:'Hepatopatia', opcoes:[['0','Não'],['2','Sim']] },
      { k:'icc',   rot:'Insuficiência cardíaca', opcoes:[['0','Não'],['2','Sim']] }
    ],
    calc:function (v) {
      var t = Number(v.melena) + Number(v.sinc) + Number(v.hepa) + Number(v.icc);
      /* o escore original usa ureia em mmol/L; 1 mmol/L = 6,006 mg/dL */
      var u = v.ureia / 6.006;
      if (u >= 25)      t += 6;
      else if (u >= 10) t += 4;
      else if (u >= 8)  t += 3;
      else if (u >= 6.5)t += 2;
      var h = v.hb;
      if (h < 10) t += 6;
      else if (v.sexo === 'h') { if (h < 12) t += 3; else if (h < 13) t += 1; }
      else { if (h < 12) t += 1; }
      if (v.pas < 90)       t += 3;
      else if (v.pas < 100) t += 2;
      else if (v.pas < 110) t += 1;
      if (v.fc >= 100) t += 1;

      var d = t === 0 ? 'Risco muito baixo de precisar de transfusão, endoscopia terapêutica ou cirurgia. Manejo ambulatorial com endoscopia precoce é aceitável.'
            : t <= 3  ? 'Risco baixo. Endoscopia precoce; alta só depois dela e com reavaliação garantida.'
            : 'Risco alto de intervenção. Internar, reservar hemocomponentes e programar endoscopia.';
      return { valor:'Blatchford ' + t + ' de 23', classe: t === 0 ? 'ok' : (t <= 3 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'rockall', ramo:'gastro', tipo:'escore', seletor:true,
    nome:'Rockall', sub:'Mortalidade e ressangramento na HDA',
    quando:'Depois da endoscopia. Os três primeiros itens sozinhos formam o Rockall pré-endoscópico.',
    limites:'O escore completo só existe com laudo endoscópico. Não guia reposição volêmica nem decide o momento da endoscopia — para triagem inicial, use o Blatchford.',
    fonte:'Rockall et al.',
    itens:[
      { rot:'Idade', opcoes:[[0,'menor que 60 anos'],[1,'60 a 79'],[2,'80 anos ou mais']] },
      { rot:'Estado circulatório', opcoes:[[0,'Sem choque (PAS 100 ou mais, FC menor que 100)'],[1,'Taquicardia (PAS 100 ou mais, FC 100 ou mais)'],[2,'Hipotensão (PAS menor que 100)']] },
      { rot:'Comorbidade', opcoes:[[0,'Nenhuma importante'],[2,'Cardiopatia isquêmica, insuficiência cardíaca ou outra doença maior'],[3,'Insuficiência renal, hepática ou neoplasia disseminada']] },
      { rot:'Diagnóstico endoscópico', opcoes:[[0,'Mallory-Weiss ou sem lesão identificada'],[1,'Todos os outros diagnósticos'],[2,'Neoplasia do trato digestivo alto']] },
      { rot:'Estigmas de sangramento recente', opcoes:[[0,'Ausentes ou hematina escura'],[2,'Sangue no trato, coágulo aderido, vaso visível ou sangramento ativo']] }
    ],
    faixa:function (t) {
      var d = t <= 2 ? 'Baixo risco de ressangramento e óbito. Alta precoce pode ser considerada.'
            : t <= 5 ? 'Risco intermediário. Internação e observação.'
            : 'Alto risco. Internação com vigilância; mortalidade sobe de forma importante.';
      return { valor:'Rockall ' + t + ' de 11', classe: t <= 2 ? 'ok' : (t <= 5 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'aims65', ramo:'gastro', tipo:'escore',
    nome:'AIMS65', sub:'Mortalidade hospitalar na hemorragia digestiva alta',
    quando:'HDA na chegada, quando se quer uma estimativa rápida de mortalidade com cinco variáveis.',
    limites:'Prediz mortalidade, não necessidade de intervenção — para decidir alta, o Blatchford é melhor. Exige albumina e INR, nem sempre prontos na primeira hora.',
    fonte:'Saltzman et al.',
    itens:[
      { rot:'A — albumina menor que 3,0 g/dL', pts:1 },
      { rot:'I — INR maior que 1,5', pts:1 },
      { rot:'M — alteração do estado mental', pts:1 },
      { rot:'S — PA sistólica menor ou igual a 90 mmHg', pts:1 },
      { rot:'65 — idade maior que 65 anos', pts:1 }
    ],
    faixa:function (t) {
      var d = t === 0 ? 'Mortalidade hospitalar em torno de 0,3%.'
            : t === 1 ? 'Mortalidade em torno de 1%.'
            : t === 2 ? 'Mortalidade em torno de 3%.'
            : t === 3 ? 'Mortalidade em torno de 9%.'
            : 'Mortalidade acima de 15%. Internação com vigilância intensiva.';
      return { valor:'AIMS65 ' + t + ' de 5', classe: t <= 1 ? 'ok' : (t === 2 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'bisap', ramo:'gastro', tipo:'escore',
    nome:'BISAP', sub:'Gravidade da pancreatite nas primeiras 24 h',
    quando:'Pancreatite aguda: estratificação precoce, ainda no primeiro dia.',
    limites:'Ureia aqui em unidade brasileira. Prediz mortalidade, não necrose. O melhor preditor isolado de gravidade continua sendo a evolução clínica e a persistência de disfunção orgânica além de 48 h.',
    fonte:'Wu et al.',
    itens:[
      { rot:'B — ureia maior que 53 mg/dL (BUN maior que 25)', pts:1 },
      { rot:'I — alteração do estado mental', pts:1 },
      { rot:'S — SIRS (2 ou mais critérios)', pts:1 },
      { rot:'A — idade maior que 60 anos', pts:1 },
      { rot:'P — derrame pleural na imagem', pts:1 }
    ],
    faixa:function (t) {
      var d = t <= 2 ? 'Mortalidade abaixo de 2%. Conduta habitual com hidratação e analgesia, reavaliando.'
            : 'Mortalidade em torno de 5 a 20%. Considerar leito monitorizado e reavaliação frequente de disfunção orgânica.';
      return { valor:'BISAP ' + t + ' de 5', classe: t <= 1 ? 'ok' : (t === 2 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'ranson', ramo:'gastro', tipo:'escore',
    nome:'Ranson', sub:'Gravidade da pancreatite — admissão e 48 h',
    quando:'Pancreatite aguda não biliar. Os cinco primeiros itens são da admissão; os seis últimos, das 48 h.',
    limites:'Só fecha em 48 h, o que o torna inútil para a decisão inicial — por isso o BISAP costuma ser preferido. Estes são os critérios da pancreatite NÃO biliar; a versão biliar tem pontos de corte diferentes.',
    fonte:'Ranson et al.',
    itens:[
      { rot:'Admissão — idade maior que 55 anos', pts:1 },
      { rot:'Admissão — leucócitos acima de 16.000/mm³', pts:1 },
      { rot:'Admissão — glicemia acima de 200 mg/dL', pts:1 },
      { rot:'Admissão — LDH acima de 350 U/L', pts:1 },
      { rot:'Admissão — AST acima de 250 U/L', pts:1 },
      { rot:'48 h — queda do hematócrito maior que 10 pontos', pts:1 },
      { rot:'48 h — elevação da ureia maior que 10 mg/dL (BUN maior que 5)', pts:1 },
      { rot:'48 h — cálcio sérico abaixo de 8 mg/dL', pts:1 },
      { rot:'48 h — PaO₂ abaixo de 60 mmHg', pts:1 },
      { rot:'48 h — déficit de base maior que 4 mEq/L', pts:1 },
      { rot:'48 h — sequestro de líquido maior que 6 litros', pts:1 }
    ],
    faixa:function (t) {
      var d = t <= 2 ? 'Mortalidade em torno de 1%. Pancreatite leve.'
            : t <= 4 ? 'Mortalidade em torno de 15%.'
            : t <= 6 ? 'Mortalidade em torno de 40%.'
            : 'Mortalidade acima de 50%. Terapia intensiva.';
      return { valor:'Ranson ' + t + ' de 11', classe: t <= 2 ? 'ok' : (t <= 4 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'childpugh', ramo:'gastro', tipo:'escore', seletor:true, exige:true,
    nome:'Child-Pugh', sub:'Gravidade da cirrose',
    quando:'Cirrose: estimar reserva hepática, risco cirúrgico e sobrevida.',
    limites:'Dois itens são subjetivos (ascite e encefalopatia) e a albumina cai por outras causas. Não use para priorizar transplante — isso é MELD. Também não substitui a avaliação de hipertensão portal.',
    fonte:'Pugh et al.',
    itens:[
      { rot:'Bilirrubina total', opcoes:[[1,'menor que 2 mg/dL'],[2,'2 a 3'],[3,'maior que 3']] },
      { rot:'Albumina', opcoes:[[1,'maior que 3,5 g/dL'],[2,'2,8 a 3,5'],[3,'menor que 2,8']] },
      { rot:'INR', opcoes:[[1,'menor que 1,7'],[2,'1,7 a 2,3'],[3,'maior que 2,3']] },
      { rot:'Ascite', opcoes:[[1,'Ausente'],[2,'Leve, controlada com diurético'],[3,'Tensa ou refratária']] },
      { rot:'Encefalopatia', opcoes:[[1,'Ausente'],[2,'Graus I e II'],[3,'Graus III e IV']] }
    ],
    faixa:function (t) {
      var m = t <= 6 ? ['A', 'ok', 'Doença compensada. Sobrevida em 1 ano em torno de 100%.']
            : t <= 9 ? ['B', 'atencao', 'Comprometimento funcional significativo. Sobrevida em 1 ano em torno de 80%.']
            : ['C', 'grave', 'Doença descompensada. Sobrevida em 1 ano em torno de 45%. Avaliar transplante.'];
      return { valor:'Child-Pugh ' + t + ' — classe ' + m[0], classe:m[1], detalhe:m[2] };
    } },

  { id:'meld', ramo:'gastro', tipo:'formula', secao:'escore',
    nome:'MELD-Na', sub:'Prognóstico e priorização na doença hepática',
    quando:'Cirrose: estimar mortalidade em 3 meses e priorizar transplante.',
    limites:'Não validado abaixo de 12 anos. Perde acurácia na hepatite alcoólica aguda e na insuficiência hepática aguda. Valores abaixo de 1 são elevados a 1 e a creatinina é limitada a 4,0 — regra oficial do cálculo, não erro. Se o paciente dialisou duas vezes ou mais na semana, informe creatinina 4,0.',
    fonte:'UNOS / OPTN, MELD-Na 2016',
    campos:[
      { k:'bili', rot:'Bilirrubina total (mg/dL)', min:0.1, max:60, passo:0.1 },
      { k:'inr',  rot:'INR', min:0.5, max:20, passo:0.1 },
      { k:'cr',   rot:'Creatinina (mg/dL) — use 4,0 se em diálise', min:0.1, max:20, passo:0.01 },
      { k:'na',   rot:'Sódio (mEq/L)', min:100, max:180 }
    ],
    calc:function (v) {
      var b = Math.max(v.bili, 1), i = Math.max(v.inr, 1);
      var c = Math.min(Math.max(v.cr, 1), 4);
      var meld = 10 * (0.957 * Math.log(c) + 0.378 * Math.log(b) + 1.120 * Math.log(i) + 0.643);
      meld = Math.round(meld);
      if (meld > 40) meld = 40;
      var na = Math.min(Math.max(v.na, 125), 137);
      var mna = meld;
      if (meld > 11) mna = Math.round(meld + 1.32 * (137 - na) - (0.033 * meld * (137 - na)));
      if (mna > 40) mna = 40;
      if (mna < 6) mna = 6;
      var d = mna <= 9  ? 'Mortalidade em 3 meses em torno de 2%.'
            : mna <= 19 ? 'Mortalidade em 3 meses em torno de 6%.'
            : mna <= 29 ? 'Mortalidade em 3 meses em torno de 20%.'
            : mna <= 39 ? 'Mortalidade em 3 meses em torno de 50%.'
            : 'Mortalidade em 3 meses acima de 70%.';
      var cl = mna <= 9 ? 'ok' : (mna <= 19 ? 'atencao' : 'grave');
      return { valor:'MELD-Na ' + mna, classe:cl,
               detalhe:'MELD ' + meld + ' · MELD-Na ' + mna + '. ' + d };
    } }

  );

  /* ---------------- HEMATOLOGIA ---------------- */
  NOVOS.push(

  { id:'4ts', ramo:'hemato', tipo:'escore', seletor:true, exige:true,
    nome:'4Ts', sub:'Probabilidade de plaquetopenia induzida por heparina',
    quando:'Queda de plaquetas em paciente exposto a heparina, para decidir se suspende a heparina e pesquisa anticorpo.',
    limites:'Escore de probabilidade, não diagnóstico. Probabilidade intermediária ou alta manda SUSPENDER a heparina e iniciar anticoagulante alternativo enquanto se investiga — nunca simplesmente parar de anticoagular, porque a HIT é protrombótica.',
    fonte:'Lo et al., 4Ts',
    itens:[
      { rot:'Trombocitopenia — magnitude da queda', opcoes:[[2,'Queda maior que 50% e nadir 20.000 ou mais'],[1,'Queda de 30 a 50%, ou nadir de 10.000 a 19.000'],[0,'Queda menor que 30% ou nadir abaixo de 10.000']] },
      { rot:'Tempo do início da queda', opcoes:[[2,'5 a 10 dias, ou até 1 dia se heparina nos últimos 30 dias'],[1,'Compatível mas incerto, ou após 10 dias, ou até 1 dia com heparina de 30 a 100 dias atrás'],[0,'Antes de 4 dias, sem exposição recente']] },
      { rot:'Trombose ou outra sequela', opcoes:[[2,'Trombose nova confirmada, necrose de pele ou reação sistêmica após bolus'],[1,'Trombose progressiva ou recorrente, lesão de pele não necrótica, suspeita não confirmada'],[0,'Nenhuma']] },
      { rot:'Outra causa de trombocitopenia', opcoes:[[2,'Nenhuma aparente'],[1,'Possível'],[0,'Provável']] }
    ],
    faixa:function (t) {
      var d = t <= 3 ? 'Probabilidade baixa (menor que 5%). HIT improvável; procure outra causa e a heparina em geral pode continuar.'
            : t <= 5 ? 'Probabilidade intermediária (em torno de 14%). Suspenda a heparina, inicie anticoagulante alternativo e solicite o anticorpo.'
            : 'Probabilidade alta (em torno de 64%). Suspenda a heparina imediatamente, inicie anticoagulante não heparínico e investigue.';
      return { valor:'4Ts ' + t + ' de 8', classe: t <= 3 ? 'ok' : (t <= 5 ? 'atencao' : 'grave'), detalhe:d };
    } }

  );

  /* ---------------- PSIQUIATRIA E SEDAÇÃO ---------------- */
  NOVOS.push(

  { id:'ciwa', ramo:'psiq', tipo:'escore', seletor:true, exige:true,
    nome:'CIWA-Ar', sub:'Gravidade da abstinência alcoólica',
    quando:'Etilista em abstinência: guiar a dose de benzodiazepínico por sintoma em vez de esquema fixo.',
    limites:'Exige paciente capaz de comunicar sintomas — NÃO use em rebaixado, intubado, afásico ou com barreira de idioma; nesses, use esquema fixo. Não serve para diagnosticar abstinência, só para medir. Tremor e taquicardia têm muitas outras causas: exclua infecção, hipoglicemia e sangramento antes de atribuir tudo à abstinência.',
    fonte:'Sullivan et al., CIWA-Ar',
    itens:[
      { rot:'Náusea e vômito', opcoes:e07('sem náusea', 'náusea intermitente com ânsia', 'náusea constante e vômitos') },
      { rot:'Tremor', opcoes:e07('sem tremor', 'moderado com os braços estendidos', 'grave, mesmo sem estender os braços') },
      { rot:'Sudorese paroxística', opcoes:e07('sem sudorese', 'sudorese na fronte', 'sudorese profusa') },
      { rot:'Ansiedade', opcoes:e07('à vontade', 'moderadamente ansioso', 'pânico agudo') },
      { rot:'Agitação', opcoes:e07('atividade normal', 'inquieto', 'anda ou se debate constantemente') },
      { rot:'Distúrbios táteis', opcoes:e07('nenhum', 'alucinação tátil moderada', 'alucinação tátil contínua') },
      { rot:'Distúrbios auditivos', opcoes:e07('nenhum', 'alucinação auditiva moderada', 'alucinação auditiva contínua') },
      { rot:'Distúrbios visuais', opcoes:e07('nenhum', 'alucinação visual moderada', 'alucinação visual contínua') },
      { rot:'Cefaleia', opcoes:e07('ausente', 'moderada', 'muito intensa') },
      { rot:'Orientação e sensório', opcoes:[[0,'0 — orientado, soma seriada correta'],[1,'1 — não consegue somar, ou incerto sobre a data'],[2,'2 — desorientado na data em até 2 dias'],[3,'3 — desorientado na data em mais de 2 dias'],[4,'4 — desorientado em lugar ou pessoa']] }
    ],
    faixa:function (t) {
      var d = t <= 8  ? 'Abstinência leve. Em geral não requer medicação; reavaliar de 4/4 a 8/8 h.'
            : t <= 15 ? 'Abstinência moderada. Benzodiazepínico guiado por sintoma; reavaliar de 1/1 a 2/2 h.'
            : 'Abstinência grave, com risco de convulsão e delirium tremens. Benzodiazepínico em dose alta, monitorização e leito de maior vigilância.';
      return { valor:'CIWA-Ar ' + t + ' de 67', classe: t <= 8 ? 'ok' : (t <= 15 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'cows', ramo:'psiq', tipo:'escore', seletor:true, exige:true,
    nome:'COWS', sub:'Gravidade da abstinência de opioide',
    quando:'Abstinência de opioide: medir a gravidade e definir o momento seguro de iniciar buprenorfina.',
    limites:'Vários itens são inespecíficos e sobem em ansiedade, infecção e abstinência de outras substâncias. Iniciar buprenorfina com escore baixo pode precipitar abstinência.',
    fonte:'Wesson & Ling, COWS',
    itens:[
      { rot:'Pulso em repouso', opcoes:[[0,'80 bpm ou menos'],[1,'81 a 100'],[2,'101 a 120'],[4,'acima de 120']] },
      { rot:'Sudorese', opcoes:[[0,'nenhuma'],[1,'relato de calafrio ou rubor'],[2,'rubor ou umidade visível'],[3,'gotas na testa'],[4,'sudorese escorrendo']] },
      { rot:'Inquietação', opcoes:[[0,'consegue ficar parado'],[1,'dificuldade em ficar parado'],[3,'muda de posição com frequência'],[5,'não consegue ficar parado']] },
      { rot:'Diâmetro pupilar', opcoes:[[0,'normal'],[1,'possivelmente aumentado'],[2,'moderadamente dilatado'],[5,'só se vê a borda da íris']] },
      { rot:'Dor óssea ou articular', opcoes:[[0,'ausente'],[1,'desconforto leve difuso'],[2,'dor intensa e difusa'],[4,'esfrega as articulações, não consegue ficar parado']] },
      { rot:'Coriza ou lacrimejamento', opcoes:[[0,'ausente'],[1,'congestão ou olhos úmidos'],[2,'coriza ou lacrimejamento'],[4,'coriza constante ou lágrimas escorrendo']] },
      { rot:'Sintomas gastrointestinais', opcoes:[[0,'nenhum'],[1,'cólica'],[2,'náusea ou fezes amolecidas'],[3,'vômito ou diarreia'],[5,'vômitos ou diarreia repetidos']] },
      { rot:'Tremor', opcoes:[[0,'ausente'],[1,'perceptível ao toque'],[2,'tremor leve visível'],[4,'tremor grosseiro ou espasmos']] },
      { rot:'Bocejo', opcoes:[[0,'ausente'],[1,'1 a 2 vezes na avaliação'],[2,'3 ou mais vezes'],[4,'várias vezes por minuto']] },
      { rot:'Ansiedade ou irritabilidade', opcoes:[[0,'ausente'],[1,'relata irritabilidade'],[2,'claramente irritável ou ansioso'],[4,'tão ansioso que a entrevista é difícil']] },
      { rot:'Piloereção', opcoes:[[0,'pele lisa'],[3,'pelos eriçados, piloereção discreta'],[5,'piloereção proeminente']] }
    ],
    faixa:function (t) {
      var d = t <= 4  ? 'Abstinência mínima.'
            : t <= 12 ? 'Abstinência leve.'
            : t <= 24 ? 'Abstinência moderada. Faixa em que o início de buprenorfina costuma ser seguro.'
            : t <= 36 ? 'Abstinência moderadamente grave.'
            : 'Abstinência grave.';
      return { valor:'COWS ' + t + ' de 48', classe: t <= 12 ? 'ok' : (t <= 24 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'rass', ramo:'psiq', tipo:'escore', seletor:true,
    nome:'RASS', sub:'Escala de agitação e sedação de Richmond',
    quando:'Titular sedação no ventilado e quantificar agitação; é o passo obrigatório antes de aplicar o CAM-ICU.',
    limites:'Mede o nível de consciência, não a causa. RASS negativo inesperado exige procurar hipoglicemia, hipóxia, AVC e excesso de sedativo. A meta habitual em ventilação mecânica é de 0 a −2, salvo indicação específica.',
    fonte:'Sessler et al., RASS',
    itens:[
      { rot:'Nível observado', opcoes:[
        [4,'+4 — combativo, violento, risco imediato à equipe'],
        [3,'+3 — muito agitado, puxa ou remove tubos e cateteres'],
        [2,'+2 — agitado, movimentos não intencionais frequentes, briga com o ventilador'],
        [1,'+1 — inquieto, ansioso, sem movimentos agressivos'],
        [0,'0 — alerta e calmo'],
        [-1,'−1 — sonolento, desperta à voz e mantém contato visual por mais de 10 s'],
        [-2,'−2 — sedação leve, desperta à voz por menos de 10 s'],
        [-3,'−3 — sedação moderada, movimento à voz mas sem contato visual'],
        [-4,'−4 — sedação profunda, responde só a estímulo físico'],
        [-5,'−5 — irresponsivo à voz e ao estímulo físico']] }
    ],
    faixa:function (t) {
      var d = t >= 2  ? 'Agitação importante. Procure causa orgânica (dor, hipóxia, retenção urinária, abstinência) antes de aumentar sedativo.'
            : t >= 1  ? 'Inquietação leve. Reavalie conforto, dor e ambiente.'
            : t >= -2 ? 'Faixa-alvo habitual em ventilação mecânica.'
            : t >= -3 ? 'Sedação mais profunda que o alvo usual. Considere reduzir.'
            : 'Sedação profunda. Reavalie a indicação e programe interrupção diária, se aplicável.';
      return { valor:'RASS ' + (t > 0 ? '+' : '') + t, classe: (t >= -2 && t <= 1) ? 'ok' : (t >= -3 && t <= 2 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'4at', ramo:'psiq', tipo:'escore', seletor:true, exige:true,
    nome:'4AT', sub:'Rastreio rápido de delirium',
    quando:'Idoso internado, pós-operatório ou com confusão aguda. Leva cerca de 2 minutos e não exige treinamento.',
    limites:'É rastreio, não diagnóstico. Positivo obriga a procurar a causa orgânica: infecção, medicação, distúrbio metabólico, dor, retenção urinária, fecaloma, AVC. Também pontua em demência isolada — o que diferencia é o item de mudança aguda.',
    fonte:'MacLullich et al., 4AT',
    itens:[
      { rot:'1. Alerta (sonolência ou agitação evidentes)', opcoes:[[0,'0 — normal'],[4,'4 — alterado, sonolento ou agitado']] },
      { rot:'2. AMT4 — idade, data de nascimento, local e ano', opcoes:[[0,'0 — nenhum erro'],[1,'1 — um erro'],[2,'2 — dois ou mais erros, ou não testável']] },
      { rot:'3. Atenção — meses do ano de trás para frente', opcoes:[[0,'0 — sete meses ou mais corretos'],[1,'1 — começa mas erra antes de sete, ou recusa'],[2,'2 — não testável por sonolência ou doença']] },
      { rot:'4. Mudança aguda ou curso flutuante nas últimas 2 semanas', opcoes:[[0,'0 — não'],[4,'4 — sim']] }
    ],
    faixa:function (t) {
      var d = t === 0 ? 'Delirium e comprometimento cognitivo importante improváveis.'
            : t <= 3  ? 'Possível comprometimento cognitivo — delirium menos provável, mas avalie demência e reavalie.'
            : 'Delirium provável, com ou sem comprometimento cognitivo prévio. Procure a causa orgânica agora.';
      return { valor:'4AT ' + t + ' de 12', classe: t === 0 ? 'ok' : (t <= 3 ? 'atencao' : 'grave'), detalhe:d };
    } }

  );

  /* ---------------- INFECÇÃO E CIRURGIA ---------------- */
  NOVOS.push(

  { id:'alvarado', ramo:'infec', tipo:'escore',
    nome:'Alvarado', sub:'Probabilidade de apendicite aguda',
    quando:'Dor em fossa ilíaca direita, para orientar entre alta, observação, imagem e cirurgia.',
    limites:'Menos acurado na mulher em idade fértil (diferencial ginecológico), na criança e no idoso. Escore baixo NÃO exclui apendicite — se a clínica é convincente, peça imagem. Não dispensa beta-HCG.',
    fonte:'Alvarado, MANTRELS',
    itens:[
      { rot:'M — migração da dor para a fossa ilíaca direita', pts:1 },
      { rot:'A — anorexia', pts:1 },
      { rot:'N — náusea ou vômito', pts:1 },
      { rot:'T — dor à palpação da fossa ilíaca direita', pts:2 },
      { rot:'R — descompressão dolorosa', pts:1 },
      { rot:'E — temperatura maior ou igual a 37,3 °C', pts:1 },
      { rot:'L — leucocitose acima de 10.000/mm³', pts:2 },
      { rot:'S — desvio à esquerda (neutrófilos acima de 75%)', pts:1 }
    ],
    faixa:function (t) {
      var d = t <= 3 ? 'Apendicite improvável. Considere alta com reavaliação em 12 a 24 h, se a clínica permitir.'
            : t <= 6 ? 'Possível apendicite. Imagem (ultrassom ou tomografia) e reavaliação seriada do abdome.'
            : 'Apendicite provável. Avaliação cirúrgica; muitos serviços operam sem imagem nesta faixa.';
      return { valor:'Alvarado ' + t + ' de 10', classe: t <= 3 ? 'ok' : (t <= 6 ? 'atencao' : 'grave'), detalhe:d };
    } },

  { id:'centor', ramo:'infec', tipo:'escore', seletor:true, exige:true,
    nome:'Centor / McIsaac', sub:'Probabilidade de faringite estreptocócica',
    quando:'Dor de garganta aguda, para decidir entre não testar, testar ou tratar.',
    limites:'Não se aplica abaixo de 3 anos. Serve para faringite aguda comum — abscesso periamigdaliano, epiglotite e angina de Ludwig são diagnósticos clínicos e não entram neste escore. Em local com teste rápido disponível, prefira testar a tratar empiricamente.',
    fonte:'Centor et al.; modificação de McIsaac',
    itens:[
      { rot:'Exsudato ou edema amigdaliano', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Linfonodos cervicais anteriores dolorosos', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Febre acima de 38 °C (referida ou aferida)', opcoes:[[0,'Não'],[1,'Sim']] },
      { rot:'Ausência de tosse', opcoes:[[0,'Tem tosse'],[1,'Sem tosse']] },
      { rot:'Idade', opcoes:[[1,'3 a 14 anos'],[0,'15 a 44 anos'],[-1,'45 anos ou mais']] }
    ],
    faixa:function (t) {
      var d = t <= 0 ? 'Risco em torno de 1 a 2,5%. Não testar nem tratar; sintomáticos.'
            : t === 1 ? 'Risco em torno de 5 a 10%. Não testar nem tratar de rotina.'
            : t === 2 ? 'Risco em torno de 11 a 17%. Teste rápido; tratar só se positivo.'
            : t === 3 ? 'Risco em torno de 28 a 35%. Teste rápido; tratar se positivo.'
            : 'Risco em torno de 51 a 53%. Teste rápido; em alguns protocolos, tratar empiricamente.';
      return { valor:'Centor / McIsaac ' + t, classe: t <= 1 ? 'ok' : (t <= 3 ? 'atencao' : 'grave'), detalhe:d };
    } }

  );

  /* ---------------- AVALIAÇÃO GLOBAL ---------------- */
  NOVOS.push(

  { id:'nrs2002', ramo:'global', tipo:'escore', seletor:true, exige:true,
    nome:'NRS-2002', sub:'Rastreio de risco nutricional no internado',
    quando:'Nas primeiras 24 a 48 h de internação, para identificar quem precisa de plano nutricional.',
    limites:'É rastreio, não avaliação nutricional completa — positivo encaminha à nutrição, não define a dieta. Perde acurácia no edemaciado, no ascítico e no obeso, em que a perda de peso fica mascarada.',
    fonte:'Kondrup et al., ESPEN',
    itens:[
      { rot:'Estado nutricional', opcoes:[
        [0,'0 — normal'],
        [1,'1 — perda de peso maior que 5% em 3 meses, ou ingestão de 50 a 75% da necessidade na última semana'],
        [2,'2 — perda maior que 5% em 2 meses, IMC de 18,5 a 20,5 com piora do estado geral, ou ingestão de 25 a 50%'],
        [3,'3 — perda maior que 5% em 1 mês, IMC abaixo de 18,5 com piora do estado geral, ou ingestão de 0 a 25%']] },
      { rot:'Gravidade da doença', opcoes:[
        [0,'0 — sem doença aguda'],
        [1,'1 — fratura de quadril, doença crônica agudizada, DPOC, hemodiálise, oncológico'],
        [2,'2 — cirurgia abdominal de grande porte, AVC, pneumonia grave, neoplasia hematológica'],
        [3,'3 — traumatismo craniano, transplante de medula, paciente em terapia intensiva com APACHE acima de 10']] },
      { rot:'Idade', opcoes:[[0,'menor que 70 anos'],[1,'70 anos ou mais']] }
    ],
    faixa:function (t) {
      return t >= 3
        ? { valor:'NRS-2002 ' + t + ' de 7', classe:'atencao',
            detalhe:'Em risco nutricional. Iniciar plano nutricional e acionar a equipe de nutrição.' }
        : { valor:'NRS-2002 ' + t + ' de 7', classe:'ok',
            detalhe:'Sem risco nutricional no momento. Repetir o rastreio semanalmente enquanto internado.' };
    } },

  { id:'cfs', ramo:'global', tipo:'escore', seletor:true,
    nome:'Clinical Frailty Scale', sub:'Grau de fragilidade no idoso',
    quando:'Idoso na emergência: apoia decisões sobre intensidade de cuidado, risco cirúrgico e conversa sobre objetivos de tratamento. Julgue o estado BASAL de 2 semanas antes da doença atual.',
    limites:'Não validada abaixo de 65 anos nem em deficiência estável de início precoce. Deve refletir o basal, não o estado agudo. NUNCA use isoladamente para negar tratamento ou vaga de terapia intensiva — é um dos elementos da decisão, tomada com o paciente e a família.',
    fonte:'Rockwood et al., Clinical Frailty Scale',
    itens:[
      { rot:'Grau de fragilidade basal', opcoes:[
        [1,'1 — muito apto: ativo, enérgico, exercita-se com regularidade'],
        [2,'2 — apto: sem doença ativa, exercita-se ocasionalmente'],
        [3,'3 — controlado: problemas de saúde bem controlados, pouco ativo'],
        [4,'4 — vulnerável: independente, mas os sintomas limitam as atividades'],
        [5,'5 — fragilidade leve: precisa de ajuda em tarefas instrumentais (finanças, transporte, casa)'],
        [6,'6 — fragilidade moderada: precisa de ajuda para banho e tarefas domésticas'],
        [7,'7 — fragilidade grave: dependente para o cuidado pessoal, estável'],
        [8,'8 — fragilidade muito grave: totalmente dependente, sem reserva'],
        [9,'9 — doente terminal: expectativa de vida menor que 6 meses']] }
    ],
    faixa:function (t) {
      var d = t <= 3 ? 'Sem fragilidade. Reserva fisiológica preservada.'
            : t === 4 ? 'Vulnerável. Maior risco de desfecho ruim; considere avaliação geriátrica.'
            : t <= 6 ? 'Fragilidade leve a moderada. Risco elevado de complicação, delirium e declínio funcional na internação.'
            : t <= 8 ? 'Fragilidade grave. Discutir objetivos de cuidado com paciente e família.'
            : 'Fase terminal. Priorizar conforto e cuidados paliativos.';
      return { valor:'CFS ' + t + ' de 9', classe: t <= 3 ? 'ok' : (t <= 6 ? 'atencao' : 'grave'), detalhe:d };
    } }

  );

  /* =========================================================
     3. CONTAS DE GASOMETRIA, ELETRÓLITOS, ECG E QUEIMADO
     Aparecem em Calculadoras (tipo formula, sem `secao`).
     Unidades brasileiras: mEq/L, g/dL, mg/dL (ureia, não BUN).
     ========================================================= */
  function agCorrigido(ag, alb) {
    return (alb === undefined || alb === null) ? ag : ag + 2.5 * (4 - alb);
  }
  var CONTAS = [
  { id:'anion-gap', ramo:'conta', tipo:'formula',
    nome:'Ânion gap', sub:'Na − (Cl + HCO₃), corrigido pela albumina',
    quando:'Toda acidose metabólica: separa a de ânion gap alto (cetoacidose, lactato, insuficiência renal, tóxicos) da hiperclorêmica (diarreia, acidose tubular, excesso de soro fisiológico).',
    limites:'O normal depende do aparelho do laboratório (em geral 8 a 12 sem o potássio). Sem corrigir pela albumina, a hipoalbuminemia esconde um gap alto.',
    fonte:'Figge et al.; Kraut & Madias',
    campos:[ {k:'na', rot:'Sódio (mEq/L)', min:100, max:180},
             {k:'cl', rot:'Cloro (mEq/L)', min:60, max:150},
             {k:'hco3', rot:'Bicarbonato (mEq/L)', min:1, max:50, passo:0.1},
             {k:'alb', rot:'Albumina g/dL (vazio se não houver)', min:0.5, max:6, passo:0.1, opcional:true} ],
    calc:function (v) {
      var ag = v.na - (v.cl + v.hco3), agc = agCorrigido(ag, v.alb);
      var ref = agc;
      var cl = ref > 12 ? (ref >= 20 ? 'grave' : 'atencao') : 'ok';
      var d = ref > 12 ? 'Ânion gap alto: cetoacidose, lactato, insuficiência renal, tóxicos (metanol, etilenoglicol, salicilato). Calcule o delta-delta.'
            : ref < 8 ? 'Ânion gap baixo: pense em hipoalbuminemia não corrigida, erro de laboratório, paraproteína ou intoxicação por lítio/brometo.'
            : 'Ânion gap normal: se há acidose, é hiperclorêmica — diarreia, acidose tubular renal, excesso de soro fisiológico.';
      var val = 'AG ' + ag.toFixed(0) + (v.alb !== undefined ? ' · corrigido ' + agc.toFixed(0) : '') + ' mEq/L';
      return { valor:val, classe:cl, detalhe:d + (v.alb !== undefined ? ' Correção: +2,5 para cada 1 g/dL de albumina abaixo de 4.' : '') };
    } },

  { id:'winter', ramo:'conta', tipo:'formula',
    nome:'Fórmula de Winter', sub:'PaCO₂ esperada na acidose metabólica',
    quando:'Acidose metabólica: confere se a compensação respiratória está adequada ou se há um distúrbio respiratório associado.',
    limites:'Só vale na acidose metabólica (bicarbonato baixo). Leva 12 a 24 h para a compensação completa se estabelecer.',
    fonte:'Albert, Dell & Winters (1967)',
    campos:[ {k:'hco3', rot:'Bicarbonato (mEq/L)', min:1, max:30, passo:0.1},
             {k:'paco2', rot:'PaCO₂ medida mmHg (vazio se não houver)', min:5, max:150, opcional:true} ],
    calc:function (v) {
      var esp = 1.5 * v.hco3 + 8, lo = esp - 2, hi = esp + 2;
      var val = 'PaCO₂ esperada ' + lo.toFixed(0) + ' a ' + hi.toFixed(0) + ' mmHg';
      if (v.hco3 >= 22) return { valor:val, classe:'atencao', detalhe:'Bicarbonato não está baixo: a fórmula de Winter só se aplica à acidose metabólica.' };
      if (v.paco2 === undefined) return { valor:val, classe:'ok', detalhe:'Informe a PaCO₂ medida para saber se a compensação está adequada.' };
      if (v.paco2 > hi) return { valor:val, classe:'grave', detalhe:'PaCO₂ medida ' + v.paco2 + ' acima do esperado: acidose respiratória associada — o paciente não está conseguindo compensar (cansaço, rebaixamento, sedação). Pense em suporte ventilatório.' };
      if (v.paco2 < lo) return { valor:val, classe:'atencao', detalhe:'PaCO₂ medida ' + v.paco2 + ' abaixo do esperado: alcalose respiratória associada (sepse, salicilato, dor, ansiedade, TEP).' };
      return { valor:val, classe:'ok', detalhe:'PaCO₂ medida ' + v.paco2 + ' dentro do esperado: compensação respiratória adequada.' };
    } },

  { id:'delta-delta', ramo:'conta', tipo:'formula',
    nome:'Delta-delta', sub:'(AG − 12) ÷ (24 − HCO₃)',
    quando:'Acidose com ânion gap alto: descobre se há um segundo distúrbio metabólico escondido (acidose hiperclorêmica ou alcalose metabólica).',
    limites:'Aproximação: usa AG normal de 12 e bicarbonato normal de 24. Não se aplica se o ânion gap não está alto ou o bicarbonato não está baixo.',
    fonte:'Wrenn (1990); Rastegar (2007)',
    campos:[ {k:'na', rot:'Sódio (mEq/L)', min:100, max:180},
             {k:'cl', rot:'Cloro (mEq/L)', min:60, max:150},
             {k:'hco3', rot:'Bicarbonato (mEq/L)', min:1, max:50, passo:0.1},
             {k:'alb', rot:'Albumina g/dL (vazio se não houver)', min:0.5, max:6, passo:0.1, opcional:true} ],
    calc:function (v) {
      var agc = agCorrigido(v.na - (v.cl + v.hco3), v.alb);
      if (agc <= 12) return { valor:'AG ' + agc.toFixed(0) + ' — não se aplica', classe:'ok', detalhe:'Ânion gap não está alto: o delta-delta só é usado na acidose de ânion gap alto.' };
      if (v.hco3 >= 24) return { valor:'HCO₃ ' + v.hco3 + ' — não se aplica', classe:'atencao', detalhe:'Ânion gap alto com bicarbonato normal ou alto: acidose de gap alto coexistindo com alcalose metabólica.' };
      var dd = (agc - 12) / (24 - v.hco3);
      var r = dd < 1 ? ['Menor que 1: acidose hiperclorêmica associada (diarreia, soro fisiológico, acidose tubular) além da de gap alto.','atencao']
            : dd <= 2 ? ['Entre 1 e 2: acidose de ânion gap alto pura.','ok']
            : ['Maior que 2: alcalose metabólica associada (vômito, diurético, sonda nasogástrica) escondida pela acidose.','atencao'];
      return { valor:'Delta-delta ' + dd.toFixed(1), classe:r[1], detalhe:r[0] + ' AG usado: ' + agc.toFixed(0) + (v.alb !== undefined ? ' (corrigido pela albumina).' : '.') };
    } },

  { id:'osmolaridade', ramo:'conta', tipo:'formula',
    nome:'Osmolaridade e gap osmolar', sub:'2 × Na + glicose ÷ 18 + ureia ÷ 6',
    quando:'Hiponatremia, estado hiperosmolar e suspeita de álcool tóxico (metanol, etilenoglicol): o gap osmolar aparece antes da acidose.',
    limites:'Usa ureia (não BUN). O etanol também aumenta o gap (cerca de etanol mg/dL ÷ 4,6) — desconte antes de culpar metanol. Gap normal não exclui intoxicação tardia, quando o álcool já foi metabolizado.',
    fonte:'Purssell et al.; Kraut & Kurtz',
    campos:[ {k:'na', rot:'Sódio (mEq/L)', min:100, max:190},
             {k:'glic', rot:'Glicose (mg/dL)', min:10, max:2000},
             {k:'ureia', rot:'Ureia (mg/dL)', min:2, max:500},
             {k:'osm', rot:'Osmolalidade medida mOsm/kg (vazio se não houver)', min:150, max:500, opcional:true} ],
    calc:function (v) {
      var calc = 2 * v.na + v.glic / 18 + v.ureia / 6;
      var ef = 2 * v.na + v.glic / 18;
      var val = 'Calculada ' + calc.toFixed(0) + ' mOsm/L';
      var d = calc > 320 ? 'Muito alta: com hiperglicemia, pense em estado hiperosmolar.'
            : calc > 295 ? 'Alta (normal 275 a 295).' : calc < 275 ? 'Baixa (normal 275 a 295): hiponatremia hipotônica provável.' : 'Normal (275 a 295).';
      d += ' Efetiva (sem ureia): ' + ef.toFixed(0) + '.';
      var cl = (calc > 320 || calc < 265) ? 'grave' : (calc > 295 || calc < 275) ? 'atencao' : 'ok';
      if (v.osm !== undefined) {
        var gap = v.osm - calc;
        val += ' · gap ' + gap.toFixed(0);
        if (gap > 10) { cl = 'grave'; d += ' Gap osmolar acima de 10: sugere álcool tóxico (metanol, etilenoglicol) ou etanol — desconte o etanol e cruze com o ânion gap.'; }
        else d += ' Gap osmolar normal (até 10).';
      }
      return { valor:val, classe:cl, detalhe:d };
    } },

  { id:'qtc', ramo:'cardio', tipo:'formula',
    nome:'QT corrigido (QTc)', sub:'Bazett e Fridericia',
    quando:'Antes e depois de droga que alonga o QT (haloperidol, ondansetrona, macrolídeo, quinolona, antiarrítmico), na síncope, na hipocalemia, na hipomagnesemia e no intoxicado.',
    limites:'Bazett superestima o QTc com FC acima de 90 e subestima abaixo de 60 — nessas faixas vale o Fridericia. Meça o QT em DII ou V5, do início do QRS ao fim da T. Com QRS largo, o QT fica falsamente longo.',
    fonte:'Bazett (1920); Fridericia (1920); AHA/ACCF 2010 — QT prolongado no hospital',
    campos:[ {k:'qt', rot:'QT medido (ms)', min:200, max:800},
             {k:'fc', rot:'FC (bpm)', min:30, max:220},
             {k:'sexo', rot:'Sexo', opcoes:[['m','Masculino'],['f','Feminino']]} ],
    calc:function (v) {
      var rr = 60 / v.fc, baz = v.qt / Math.sqrt(rr), fri = v.qt / Math.cbrt(rr);
      var usa = (v.fc > 90 || v.fc < 60) ? fri : baz, qual = (v.fc > 90 || v.fc < 60) ? 'Fridericia' : 'Bazett';
      var lim = v.sexo === 'f' ? 480 : 470;
      var cl = usa > 500 ? 'grave' : (usa > lim ? 'atencao' : 'ok');
      var d = usa > 500 ? 'Acima de 500 ms: risco de torsades. Suspenda drogas que alongam o QT, corrija potássio e magnésio, monitor contínuo.'
            : usa > lim ? 'Prolongado (acima de ' + lim + ' ms em ' + (v.sexo === 'f' ? 'mulher' : 'homem') + '). Evite associar drogas que alongam o QT; corrija K e Mg.'
            : 'Dentro do normal.';
      return { valor:'Bazett ' + baz.toFixed(0) + ' · Fridericia ' + fri.toFixed(0) + ' ms', classe:cl,
               detalhe:d + ' Classificado pelo ' + qual + (qual === 'Fridericia' ? ' (FC fora de 60 a 90).' : '.') };
    } },

  { id:'parkland', ramo:'trauma', tipo:'formula',
    nome:'Parkland — hidratação do queimado', sub:'4 mL × kg × % SCQ nas primeiras 24 h',
    quando:'Queimadura de 2º e 3º grau com 20% ou mais da superfície corporal no adulto. Conte o tempo a partir da hora da queimadura, não da chegada.',
    limites:'É ponto de partida, não receita fixa: titule pela diurese (0,5 mL/kg/h no adulto). O ATLS 10ª ed. começa com 2 mL × kg × % SCQ na queimadura térmica do adulto (4 mL na elétrica) — excesso de volume causa síndrome compartimental abdominal e de membros. Não conte a queimadura de 1º grau.',
    fonte:'Baxter & Shires (Parkland); ATLS 10ª ed.',
    campos:[ {k:'peso', rot:'Peso (kg)', min:20, max:300},
             {k:'scq', rot:'Superfície queimada de 2º e 3º grau (%)', min:1, max:100},
             {k:'h', rot:'Horas desde a queimadura (vazio se agora)', min:0, max:23, passo:0.5, opcional:true} ],
    calc:function (v) {
      if (v.scq < 20) return { valor:'SCQ ' + v.scq + '% — abaixo de 20%', classe:'ok',
        detalhe:'Abaixo de 20% no adulto, a fórmula não se aplica: hidratação de manutenção e por via oral se possível.' };
      var tot = 4 * v.peso * v.scq, metade = tot / 2, h = v.h || 0;
      var rest8 = Math.max(8 - h, 0);
      var fase1 = rest8 > 0 ? metade / rest8 : 0, fase2 = metade / 16;
      var d = 'Ringer lactato. ' + (rest8 > 0
        ? 'Primeira metade (' + Math.round(metade) + ' mL) até completar 8 h da queimadura: ' + Math.round(fase1) + ' mL/h por ' + rest8 + ' h. '
        : 'Já passaram 8 h: o atraso não se compensa com bolus; siga a segunda fase e titule pela diurese. ')
        + 'Depois, ' + Math.round(metade) + ' mL em 16 h: ' + Math.round(fase2) + ' mL/h. Alvo de diurese: ' + (0.5 * v.peso).toFixed(0) + ' mL/h (0,5 mL/kg/h).';
      return { valor:Math.round(tot) + ' mL em 24 h', classe:v.scq >= 40 ? 'grave' : 'atencao', detalhe:d };
    } }
  ];

  Array.prototype.push.apply(FERR_CALC, NOVOS);
  Array.prototype.push.apply(FERR_CALC, CONTAS);
})();
