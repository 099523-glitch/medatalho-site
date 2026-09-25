/* ============================================================
   PEDIATRIA — medicações com dose por quilo e faixa etária

   Cada item traz:
     apres      apresentação de referência (o que muda o volume)
     via
     idade      texto curto de quando pode
     minMeses   idade mínima em meses (null = qualquer idade); usada no filtro
     veto       { meses, txt } — abaixo dessa idade é CONTRAINDICADO, não
                apenas "sem dados". É o que pinta o cartão de vermelho.
     doses[]    { rot, mgkg, mgkgMax, freq, maxMg, conc, unid, nota }
                conc = mg por mL da apresentação; o app faz
                  mg/dose = peso × mgkg  (limitado a maxMg)
                  mL/dose = mg/dose ÷ conc
                conc null = comprimido ou dose fixa, só mostra mg.

   Doses de referência para pronto-socorro pediátrico. A apresentação
   varia por fabricante: confira a concentração do frasco antes de
   prescrever o volume.
   ============================================================ */

const FERR_PEDIA_GRUPOS = [
  { id:'analgesia', nome:'Analgesia e antitérmico', icone:'comprim' },
  { id:'antiemetico',nome:'Antieméticos',           icone:'estomago' },
  { id:'cortico',   nome:'Corticoides',             icone:'frasco' },
  { id:'inalacao',  nome:'Broncodilatador e inalação', icone:'pulmao' },
  { id:'atb-oral',  nome:'Antibiótico oral',        icone:'micro' },
  { id:'atb-ev',    nome:'Antibiótico parenteral',  icone:'soro' },
  { id:'alergia',   nome:'Anti-histamínico',        icone:'curativo' },
  { id:'emergencia',nome:'Emergência',              icone:'perigo' },
  { id:'digestivo', nome:'Hidratação e digestivo',  icone:'gota' }
];

/* medicações que NÃO se usa abaixo de certa idade — painel próprio */
const FERR_PEDIA_VETOS = [
  { nome:'Codeína e tramadol', faixa:'Menores de 12 anos',
    txt:'Metabolização imprevisível: risco de depressão respiratória fatal. Também contraindicados até os 18 anos após amigdalectomia ou adenoidectomia, e na criança obesa ou com apneia do sono.' },
  { nome:'Prometazina', faixa:'Menores de 2 anos',
    txt:'Depressão respiratória fatal descrita nessa faixa. Acima de 2 anos, usar a menor dose eficaz.' },
  { nome:'Ácido acetilsalicílico', faixa:'Qualquer idade em quadro viral',
    txt:'Síndrome de Reye. Não usar em suspeita de influenza, varicela ou virose febril. Exceção: doença de Kawasaki e indicação cardiológica formal.' },
  { nome:'Antitussígeno e descongestionante', faixa:'Menores de 6 anos',
    txt:'Sem benefício demonstrado e com relatos de evento grave. Especialmente proibido abaixo de 2 anos.' },
  { nome:'Sulfametoxazol-trimetoprima', faixa:'Menores de 2 meses',
    txt:'Risco de kernicterus por deslocamento da bilirrubina.' },
  { nome:'Ceftriaxona', faixa:'Recém-nascido ictérico, ou recebendo cálcio EV',
    txt:'Desloca bilirrubina e precipita com cálcio. No neonato, prefira cefotaxima.' },
  { nome:'Nitrofurantoína', faixa:'Menores de 1 mês',
    txt:'Risco de anemia hemolítica pela imaturidade enzimática.' },
  { nome:'Metoclopramida', faixa:'Menores de 1 ano',
    txt:'Alto risco de reação extrapiramidal. Entre 1 e 18 anos, só como segunda linha e por tempo curto.' },
  { nome:'Doxiciclina e tetraciclina', faixa:'Menores de 8 anos, em uso prolongado',
    txt:'Manchamento dentário permanente. Curso curto de doxiciclina é aceito em riquetsiose, onde o risco da doença supera o estético.' },
  { nome:'Quinolonas', faixa:'Menores de 18 anos, como rotina',
    txt:'Toxicidade em cartilagem e tendão. Reservadas a situações sem alternativa, com indicação formal.' },
  { nome:'Loperamida', faixa:'Menores de 6 anos',
    txt:'Risco de íleo paralítico, distensão e depressão do sistema nervoso central. Não usar em diarreia com sangue ou febre em nenhuma idade.' },
  { nome:'Ibuprofeno e demais anti-inflamatórios', faixa:'Menores de 6 meses',
    txt:'Também evitar em qualquer idade se houver desidratação, sangramento, varicela ou suspeita de dengue.' },
  { nome:'Dipirona', faixa:'Menores de 3 meses ou abaixo de 5 kg',
    txt:'Fora da faixa da bula. Abaixo disso, use paracetamol.' },
  { nome:'Benzocaína tópica', faixa:'Menores de 2 anos',
    txt:'Risco de metemoglobinemia. Não use gel de dentição com benzocaína.' },
  { nome:'Mel', faixa:'Menores de 1 ano',
    txt:'Botulismo do lactente. Vale para xarope caseiro e chupeta com mel.' }
];

const FERR_PEDIA = [

/* ---------------- ANALGESIA E ANTITÉRMICO ---------------- */
{ id:'p-paracetamol', grupo:'analgesia', nome:'Paracetamol', apres:'Gotas 200 mg/mL', via:'VO',
  idade:'Qualquer idade, inclusive recém-nascido', minMeses:0, veto:null,
  doses:[{ rot:'Dor e febre', mgkg:10, mgkgMax:15, freq:'6/6 h', maxMg:750, conc:200, unid:'mL',
           nota:'Máximo de 75 mg/kg/dia e de 4 g/dia. 1 gota ≈ 10 mg na maioria dos frascos — confira o rótulo.' }],
  atencao:'O antitérmico mais seguro no lactente pequeno. Some as doses de outras apresentações antes de repetir.',
  obs:['Início em 30 a 60 min, pico em 1 a 2 h.','Hepatotoxicidade é dose-dependente: cheque se a família já deu em casa.'] },

{ id:'p-dipirona', grupo:'analgesia', nome:'Dipirona', apres:'Gotas 500 mg/mL', via:'VO',
  idade:'A partir de 3 meses ou 5 kg', minMeses:3,
  veto:{ meses:3, txt:'Abaixo de 3 meses ou 5 kg está fora da faixa da bula — use paracetamol.' },
  doses:[{ rot:'Dor e febre', mgkg:10, mgkgMax:25, freq:'6/6 h', maxMg:1000, conc:500, unid:'mL',
           nota:'1 gota = 25 mg. Regra de bolso comum: 1 gota por 2 kg.' }],
  atencao:'Antitérmico de escolha quando o paracetamol não bastou. Agranulocitose é rara mas existe.',
  obs:['Apresentação EV 500 mg/mL: mesma dose por quilo, diluída e infundida lentamente.'] },

{ id:'p-ibuprofeno', grupo:'analgesia', nome:'Ibuprofeno', apres:'Gotas 50 mg/mL ou 100 mg/mL', via:'VO',
  idade:'A partir de 6 meses', minMeses:6,
  veto:{ meses:6, txt:'Não usar abaixo de 6 meses. Em qualquer idade, evite se houver desidratação, sangramento, varicela ou suspeita de dengue.' },
  alt:[[50,'Gotas 50 mg/mL'],[100,'Gotas 100 mg/mL']],
  doses:[{ rot:'Dor e febre', mgkg:5, mgkgMax:10, freq:'6/6 a 8/8 h', maxMg:600, conc:50, unid:'mL',
           nota:'Cálculo pela apresentação de 50 mg/mL. Se o frasco for 100 mg/mL, o volume é a metade. Máximo de 40 mg/kg/dia.' }],
  atencao:'Confira sempre a concentração do frasco: existem duas, e a troca dobra ou reduz pela metade a dose.',
  obs:['Melhor que o paracetamol para dor com inflamação.','Sempre com alimento; nunca no desidratado.'] },

{ id:'p-morfina', grupo:'analgesia', nome:'Morfina', apres:'Ampola 10 mg/mL', via:'EV',
  idade:'Qualquer idade, com monitorização', minMeses:0, veto:null,
  alt:[[1,'Diluída 1 mg/mL'],[10,'Ampola pura 10 mg/mL']],
  doses:[{ rot:'Dor intensa', mgkg:0.05, mgkgMax:0.1, freq:'4/4 h ou conforme dor', maxMg:5, conc:1, unid:'mL',
           nota:'Diluir 1 mL da ampola (10 mg) em 9 mL de água destilada = 1 mg/mL. O volume calculado usa essa diluição.' }],
  atencao:'Monitorize saturação e frequência respiratória. Tenha naloxona ao alcance.',
  obs:['Titule: comece na dose menor e repita conforme a resposta.'] },

{ id:'p-fentanil', grupo:'analgesia', nome:'Fentanila', apres:'Ampola 50 mcg/mL', via:'EV ou intranasal',
  idade:'Qualquer idade, com monitorização', minMeses:0, veto:null,
  doses:[{ rot:'Dor intensa — EV', mgkg:0.001, mgkgMax:0.002, freq:'conforme dor', maxMg:0.1, conc:0.05, unid:'mL',
           nota:'1 mcg/kg = 0,001 mg/kg. Infundir lentamente: em bolus rápido causa rigidez torácica.' },
         { rot:'Intranasal', mgkg:0.0015, mgkgMax:0.002, freq:'dose única', maxMg:0.1, conc:0.05, unid:'mL',
           nota:'Metade do volume em cada narina. Útil quando ainda não há acesso venoso.' }],
  atencao:'Rigidez torácica em bolus rápido. Depressão respiratória dose-dependente.',
  obs:[] },

/* ---------------- ANTIEMÉTICOS ---------------- */
{ id:'p-ondansetrona', grupo:'antiemetico', nome:'Ondansetrona', apres:'Ampola 2 mg/mL · comprimido 4 mg', via:'EV ou VO',
  idade:'A partir de 6 meses ou 8 kg', minMeses:6,
  veto:{ meses:6, txt:'Abaixo de 6 meses não há dados de segurança suficientes.' },
  doses:[{ rot:'Vômito na gastroenterite', mgkg:0.15, mgkgMax:0.15, freq:'8/8 h se necessário', maxMg:4, conc:2, unid:'mL',
           nota:'Dose única costuma bastar para permitir a reidratação oral. Máximo de 4 mg por dose na criança.' }],
  atencao:'Prolonga o intervalo QT. Cuidado se houver cardiopatia, distúrbio eletrolítico ou outra droga que alargue o QT.',
  obs:['O antiemético de escolha em pediatria: permite reidratação oral e evita internação.'] },

{ id:'p-dimenidrinato', grupo:'antiemetico', nome:'Dimenidrinato + B6', apres:'Gotas 25 mg/mL', via:'VO',
  idade:'A partir de 2 anos', minMeses:24,
  veto:{ meses:24, txt:'Não recomendado abaixo de 2 anos — sedação e risco de reação paradoxal.' },
  doses:[{ rot:'Náusea e cinetose', mgkg:1.25, mgkgMax:1.25, freq:'6/6 a 8/8 h', maxMg:25, conc:25, unid:'mL',
           nota:'Máximo de 75 mg/dia dos 2 aos 6 anos, e de 150 mg/dia dos 6 aos 12.' }],
  atencao:'Seda. Não é a primeira escolha para vômito de gastroenterite — a ondansetrona é melhor.',
  obs:[] },

{ id:'p-metoclopramida', grupo:'antiemetico', nome:'Metoclopramida', apres:'Ampola 5 mg/mL · gotas 4 mg/mL', via:'EV ou VO',
  idade:'A partir de 1 ano, e só como segunda linha', minMeses:12,
  veto:{ meses:12, txt:'CONTRAINDICADA abaixo de 1 ano — alto risco de reação extrapiramidal. De 1 a 18 anos, apenas segunda linha e por até 5 dias.' },
  alt:[[5,'Ampola 5 mg/mL'],[4,'Gotas 4 mg/mL']],
  doses:[{ rot:'Náusea refratária', mgkg:0.1, mgkgMax:0.15, freq:'8/8 h', maxMg:10, conc:5, unid:'mL',
           nota:'Máximo de 0,5 mg/kg/dia e de 5 dias de uso.' }],
  atencao:'Distonia aguda é frequente na criança. Se ocorrer, o tratamento é biperideno ou difenidramina.',
  obs:['Prefira ondansetrona sempre que disponível.'] },

/* ---------------- CORTICOIDES ---------------- */
{ id:'p-prednisolona', grupo:'cortico', nome:'Prednisolona', apres:'Solução 3 mg/mL', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  alt:[[3,'Solução 3 mg/mL'],[1,'Solução 1 mg/mL']],
  doses:[{ rot:'Asma e alergia', mgkg:1, mgkgMax:2, freq:'1× ao dia, 3 a 5 dias', maxMg:40, conc:3, unid:'mL',
           nota:'Curso curto não precisa de desmame. Dar pela manhã.' }],
  atencao:'Existe também solução de 1 mg/mL: confira o frasco antes de converter em volume.',
  obs:['Na crise de asma, o corticoide precoce reduz internação.'] },

{ id:'p-dexametasona', grupo:'cortico', nome:'Dexametasona', apres:'Ampola 4 mg/mL · elixir 0,5 mg/5 mL', via:'VO, IM ou EV',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Crupe (laringite)', mgkg:0.15, mgkgMax:0.6, freq:'dose única', maxMg:10, conc:4, unid:'mL',
           nota:'Dose única resolve a maioria dos casos leves e moderados. A via oral funciona tão bem quanto a IM.' },
         { rot:'Asma — alternativa ao corticoide oral', mgkg:0.6, mgkgMax:0.6, freq:'1 a 2 doses', maxMg:16, conc:4, unid:'mL',
           nota:'Uma ou duas doses substituem 5 dias de prednisolona, com adesão melhor.' }],
  atencao:'No crupe, dê o corticoide mesmo no caso leve — muda a evolução.',
  obs:[] },

{ id:'p-hidrocortisona', grupo:'cortico', nome:'Hidrocortisona', apres:'Frasco-ampola 100 e 500 mg', via:'EV',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Asma grave e anafilaxia', mgkg:4, mgkgMax:8, freq:'6/6 h', maxMg:200, conc:null, unid:'mg',
           nota:'Reconstituir conforme o frasco. Adjuvante: na anafilaxia, não substitui a adrenalina.' }],
  atencao:'Na anafilaxia o corticoide não trata a fase aguda — a adrenalina IM é que trata.',
  obs:[] },

/* ---------------- BRONCODILATADOR E INALAÇÃO ---------------- */
{ id:'p-salbutamol-spray', grupo:'inalacao', nome:'Salbutamol spray', apres:'100 mcg por jato', via:'Inalatória com espaçador',
  idade:'Qualquer idade, sempre com espaçador', minMeses:0, veto:null,
  doses:[{ rot:'Crise leve a moderada', mgkg:null, fixa:'2 a 6 jatos', freq:'a cada 20 min na 1ª hora', conc:null, unid:'jatos',
           nota:'Regra prática: 1 jato para cada 2 a 3 kg, mínimo 2 e máximo 10 jatos. Um jato de cada vez, com 4 a 6 respirações entre eles.' },
         { rot:'Crise grave', mgkg:null, fixa:'6 a 10 jatos', freq:'a cada 20 min na 1ª hora', conc:null, unid:'jatos',
           nota:'Espaçador com máscara abaixo de 4 anos; com bocal acima disso.' }],
  atencao:'Spray com espaçador é tão eficaz quanto nebulização e causa menos taquicardia. Prefira.',
  obs:['Sem espaçador, quase nada do jato chega ao pulmão da criança.'] },

{ id:'p-salbutamol-neb', grupo:'inalacao', nome:'Salbutamol gotas', apres:'Solução 5 mg/mL (1 gota = 0,25 mg)', via:'Nebulização',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Nebulização', mgkg:0.1, mgkgMax:0.15, freq:'a cada 20 min na 1ª hora', maxMg:5, conc:5, unid:'mL',
           nota:'Diluir em 3 a 5 mL de soro fisiológico. Mínimo de 5 gotas (1,25 mg) e máximo de 20 gotas (5 mg). 1 gota = 0,25 mg.' }],
  atencao:'Causa tremor, taquicardia e hipocalemia. Em uso repetido, cheque o potássio.',
  obs:[] },

{ id:'p-ipratropio', grupo:'inalacao', nome:'Ipratrópio gotas', apres:'Solução 0,25 mg/mL', via:'Nebulização',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Até 10 kg', mgkg:null, fixa:'10 gotas', freq:'a cada 20 min na 1ª hora', conc:null, unid:'gotas',
           nota:'Associado ao salbutamol na mesma nebulização.' },
         { rot:'Acima de 10 kg', mgkg:null, fixa:'20 gotas', freq:'a cada 20 min na 1ª hora', conc:null, unid:'gotas',
           nota:'O benefício é maior nas primeiras horas da crise moderada a grave.' }],
  atencao:'Proteja os olhos com a máscara bem ajustada: o contato causa midríase e visão borrada.',
  obs:[] },

{ id:'p-adrenalina-neb', grupo:'inalacao', nome:'Adrenalina para nebulização', apres:'Ampola 1 mg/mL (1:1000)', via:'Nebulização',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Crupe moderado a grave', mgkg:0.5, mgkgMax:0.5, freq:'repetir conforme resposta', maxMg:5, conc:1, unid:'mL',
           nota:'Completar com soro fisiológico até 5 mL. Efeito em 10 a 30 min e dura cerca de 2 h.' }],
  atencao:'Observe por pelo menos 2 h após a nebulização: o estridor pode voltar quando o efeito passa.',
  obs:['Sempre associada ao corticoide, nunca sozinha.'] },

/* ---------------- ANTIBIÓTICO ORAL ---------------- */
{ id:'p-amoxicilina', grupo:'atb-oral', nome:'Amoxicilina', apres:'Suspensão 250 mg/5 mL (50 mg/mL)', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  alt:[[50,'250 mg/5 mL'],[80,'400 mg/5 mL']],
  doses:[{ rot:'Dose habitual', mgkg:50, mgkgMax:50, freq:'dividido de 8/8 h', maxMg:1500, conc:50, unid:'mL',
           nota:'O valor mostrado é a dose do DIA — divida em 3 tomadas.' },
         { rot:'Dose alta (otite, pneumonia)', mgkg:80, mgkgMax:90, freq:'dividido de 12/12 h', maxMg:3000, conc:50, unid:'mL',
           nota:'Dose do dia, dividida em 2 tomadas. Indicada onde há pneumococo com resistência intermediária.' }],
  atencao:'Existe suspensão de 400 mg/5 mL (80 mg/mL): nesse frasco o volume é bem menor.',
  obs:['Primeira escolha em otite média aguda, sinusite e pneumonia típica.'] },

{ id:'p-amoxclav', grupo:'atb-oral', nome:'Amoxicilina + clavulanato', apres:'Suspensão 400/57 mg por 5 mL (80 mg/mL de amoxicilina)', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Dose por amoxicilina', mgkg:45, mgkgMax:90, freq:'dividido de 12/12 h', maxMg:2800, conc:80, unid:'mL',
           nota:'Dose do dia. Calcule sempre pelo componente amoxicilina, nunca pela soma dos dois.' }],
  atencao:'Diarreia é o efeito adverso mais comum e faz a família abandonar o tratamento — avise antes.',
  obs:['Reservada a falha da amoxicilina, otite recorrente, sinusite complicada e mordedura.'] },

{ id:'p-azitromicina', grupo:'atb-oral', nome:'Azitromicina', apres:'Suspensão 200 mg/5 mL (40 mg/mL)', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Dose diária', mgkg:10, mgkgMax:10, freq:'1× ao dia, 3 a 5 dias', maxMg:500, conc:40, unid:'mL',
           nota:'Alguns esquemas usam 10 mg/kg no primeiro dia e 5 mg/kg do 2º ao 5º.' }],
  atencao:'Prolonga o QT. Não é primeira escolha para otite nem para pneumonia típica.',
  obs:['Escolha em coqueluche e em pneumonia atípica do escolar.'] },

{ id:'p-cefalexina', grupo:'atb-oral', nome:'Cefalexina', apres:'Suspensão 250 mg/5 mL (50 mg/mL)', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Dose diária', mgkg:50, mgkgMax:100, freq:'dividido de 6/6 h', maxMg:4000, conc:50, unid:'mL',
           nota:'Dose do dia, em 4 tomadas. A dose maior fica para infecção de pele mais extensa.' }],
  atencao:'Não cobre pneumococo resistente nem Haemophilus — não sirva para otite.',
  obs:['Boa escolha em impetigo, celulite simples e ITU baixa.'] },

{ id:'p-smztmp', grupo:'atb-oral', nome:'Sulfametoxazol + trimetoprima', apres:'Suspensão 200/40 mg por 5 mL (8 mg/mL de trimetoprima)', via:'VO',
  idade:'A partir de 2 meses', minMeses:2,
  veto:{ meses:2, txt:'CONTRAINDICADO abaixo de 2 meses — desloca a bilirrubina e pode causar kernicterus.' },
  doses:[{ rot:'Dose por trimetoprima', mgkg:8, mgkgMax:10, freq:'dividido de 12/12 h', maxMg:320, conc:8, unid:'mL',
           nota:'Dose do dia, calculada pelo trimetoprima. Divida em 2 tomadas.' }],
  atencao:'Resistência alta de E. coli em muitas regiões — confira o perfil local antes de usar em ITU.',
  obs:[] },

/* ---------------- ANTIBIÓTICO PARENTERAL ---------------- */
{ id:'p-ceftriaxona', grupo:'atb-ev', nome:'Ceftriaxona', apres:'Frasco 1 g', via:'EV ou IM',
  idade:'Evitar no recém-nascido', minMeses:1,
  veto:{ meses:1, txt:'Não usar no recém-nascido ictérico nem em quem recebe cálcio endovenoso — desloca bilirrubina e precipita com cálcio. No neonato, prefira cefotaxima.' },
  doses:[{ rot:'Dose habitual', mgkg:50, mgkgMax:75, freq:'1× ao dia', maxMg:2000, conc:null, unid:'mg',
           nota:'Dose do dia. Pode ser dose única diária.' },
         { rot:'Meningite', mgkg:100, mgkgMax:100, freq:'dividido de 12/12 h', maxMg:4000, conc:null, unid:'mg',
           nota:'Dose do dia. Nunca atrase a primeira dose esperando punção lombar ou tomografia.' }],
  atencao:'Não infundir junto com solução contendo cálcio, incluindo Ringer lactato.',
  obs:[] },

{ id:'p-penicilina-crist', grupo:'atb-ev', nome:'Penicilina cristalina', apres:'Frasco 5.000.000 UI', via:'EV',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Pneumonia', mgkg:150000, mgkgMax:200000, freq:'dividido de 6/6 h', maxMg:24000000, conc:null, unid:'UI',
           nota:'Dose do dia em UNIDADES, não em mg. Divida em 4 tomadas.' }],
  atencao:'Continua sendo a escolha na pneumonia pneumocócica internada.',
  obs:[] },

{ id:'p-oxacilina', grupo:'atb-ev', nome:'Oxacilina', apres:'Frasco 500 mg', via:'EV',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Dose diária', mgkg:100, mgkgMax:200, freq:'dividido de 6/6 h', maxMg:12000, conc:null, unid:'mg',
           nota:'Dose do dia. A dose maior fica para infecção grave e osteoarticular.' }],
  atencao:'Não cobre MRSA. Se houver suspeita, use vancomicina ou clindamicina.',
  obs:[] },

{ id:'p-gentamicina', grupo:'atb-ev', nome:'Gentamicina', apres:'Ampola 40 mg/mL', via:'EV ou IM',
  idade:'Qualquer idade, com ajuste no neonato', minMeses:0, veto:null,
  doses:[{ rot:'Dose diária única', mgkg:5, mgkgMax:7.5, freq:'1× ao dia', maxMg:400, conc:40, unid:'mL',
           nota:'Dose única diária é tão eficaz e menos nefrotóxica que a fracionada. No neonato o intervalo é maior.' }],
  atencao:'Nefrotóxica e ototóxica. Cheque a função renal e evite associar a outros nefrotóxicos.',
  obs:[] },

{ id:'p-clindamicina', grupo:'atb-ev', nome:'Clindamicina', apres:'Ampola 150 mg/mL', via:'EV',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Dose diária', mgkg:30, mgkgMax:40, freq:'dividido de 6/6 ou 8/8 h', maxMg:2700, conc:150, unid:'mL',
           nota:'Dose do dia. Cobre MRSA comunitário e anaeróbio.' }],
  atencao:'Risco de colite por C. difficile.',
  obs:[] },

/* ---------------- ANTI-HISTAMÍNICO ---------------- */
{ id:'p-dexclorfeniramina', grupo:'alergia', nome:'Dexclorfeniramina', apres:'Solução 0,4 mg/mL', via:'VO',
  idade:'A partir de 2 anos', minMeses:24,
  veto:{ meses:24, txt:'Não usar abaixo de 2 anos — sedação importante e risco de reação paradoxal.' },
  doses:[{ rot:'Prurido e urticária', mgkg:0.15, mgkgMax:0.15, freq:'dividido de 8/8 h', maxMg:6, conc:0.4, unid:'mL',
           nota:'Dose do dia, em 3 tomadas.' }],
  atencao:'Seda bastante. Na anafilaxia é apenas adjuvante: nunca substitui a adrenalina.',
  obs:[] },

{ id:'p-loratadina', grupo:'alergia', nome:'Loratadina', apres:'Xarope 1 mg/mL', via:'VO',
  idade:'A partir de 2 anos', minMeses:24,
  veto:{ meses:24, txt:'Não recomendada abaixo de 2 anos.' },
  doses:[{ rot:'2 a 5 anos, ou abaixo de 30 kg', mgkg:null, fixa:'5 mg (5 mL)', freq:'1× ao dia', conc:null, unid:'mL',
           nota:'Dose fixa por faixa, não por quilo.' },
         { rot:'Acima de 30 kg', mgkg:null, fixa:'10 mg (10 mL)', freq:'1× ao dia', conc:null, unid:'mL',
           nota:'Não seda, ao contrário da dexclorfeniramina.' }],
  atencao:'Preferível à dexclorfeniramina para uso diurno: não prejudica escola nem atenção.',
  obs:[] },

/* ---------------- EMERGÊNCIA ---------------- */
{ id:'p-adrenalina-im', grupo:'emergencia', nome:'Adrenalina IM — anafilaxia', apres:'Ampola 1 mg/mL (1:1000)', via:'IM na coxa',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Anafilaxia', mgkg:0.01, mgkgMax:0.01, freq:'repetir a cada 5 a 15 min', maxMg:0.5, conc:1, unid:'mL',
           nota:'Ampola pura, sem diluir. Vasto lateral da coxa. Não há contraindicação absoluta na anafilaxia.' }],
  atencao:'É o único tratamento que muda o desfecho. Corticoide e anti-histamínico são adjuvantes.',
  obs:['Repita se não houver melhora em 5 a 15 min.','Observe por 4 a 8 h pelo risco de reação bifásica.'] },

{ id:'p-adrenalina-pcr', grupo:'emergencia', nome:'Adrenalina EV/IO — parada', apres:'Diluir 1 mL de 1:1000 em 9 mL de água destilada = 1:10.000 (0,1 mg/mL)', via:'EV ou intraóssea',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Parada cardiorrespiratória', mgkg:0.01, mgkgMax:0.01, freq:'a cada 3 a 5 min', maxMg:1, conc:0.1, unid:'mL',
           nota:'O volume mostrado já considera a diluição 1:10.000 — equivale a 0,1 mL/kg. Flush de 5 mL depois.' }],
  atencao:'Confira a diluição antes de aspirar: a concentração errada aqui é fatal.',
  obs:[] },

{ id:'p-diazepam', grupo:'emergencia', nome:'Diazepam', apres:'Ampola 5 mg/mL', via:'EV ou retal',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Crise convulsiva — EV', mgkg:0.3, mgkgMax:0.3, freq:'repetir 1× após 5 min', maxMg:10, conc:5, unid:'mL',
           nota:'Infundir lentamente. Prepare a via aérea antes.' },
         { rot:'Via retal (sem acesso)', mgkg:0.5, mgkgMax:0.5, freq:'dose única', maxMg:10, conc:5, unid:'mL',
           nota:'Aspirar a ampola e administrar com sonda curta no reto.' }],
  atencao:'Depressão respiratória é o efeito esperado, não a surpresa. Tenha bolsa-válvula-máscara pronta.',
  obs:[] },

{ id:'p-midazolam', grupo:'emergencia', nome:'Midazolam', apres:'Ampola 5 mg/mL', via:'IM, intranasal ou EV',
  idade:'Qualquer idade', minMeses:0, veto:null,
  alt:[[5,'Ampola 5 mg/mL'],[1,'Ampola 1 mg/mL']],
  doses:[{ rot:'Crise — IM ou intranasal', mgkg:0.2, mgkgMax:0.2, freq:'dose única', maxMg:10, conc:5, unid:'mL',
           nota:'Tão eficaz quanto o diazepam endovenoso e não exige acesso. Metade em cada narina, se intranasal.' },
         { rot:'Crise — EV', mgkg:0.1, mgkgMax:0.15, freq:'repetir 1× após 5 min', maxMg:10, conc:5, unid:'mL',
           nota:'Confira a concentração: existem apresentações de 1 mg/mL e de 5 mg/mL.' }],
  atencao:'Primeira escolha quando ainda não há acesso venoso.',
  obs:[] },

{ id:'p-fenitoina', grupo:'emergencia', nome:'Fenitoína', apres:'Ampola 50 mg/mL', via:'EV',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Estado de mal — ataque', mgkg:20, mgkgMax:20, freq:'dose de ataque', maxMg:1000, conc:50, unid:'mL',
           nota:'Diluir SOMENTE em soro fisiológico — precipita em glicose. Velocidade máxima de 1 mg/kg/min.' }],
  atencao:'Monitorize ritmo e pressão durante a infusão: causa hipotensão e arritmia se correr rápido.',
  obs:[] },

{ id:'p-glicose', grupo:'emergencia', nome:'Glicose 10%', apres:'Solução 100 mg/mL', via:'EV ou intraóssea',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Hipoglicemia', mgkg:200, mgkgMax:500, freq:'repetir conforme glicemia', maxMg:25000, conc:100, unid:'mL',
           nota:'Equivale a 2 a 5 mL/kg de glicose a 10%. Reavaliar a glicemia em 15 min.' }],
  atencao:'No lactente use glicose a 10%, nunca a 50% — a hipertônica lesa a veia e o cérebro.',
  obs:['Para obter 10% a partir da 50%: 1 volume de glicose 50% + 4 volumes de água destilada.'] },

{ id:'p-sf-bolus', grupo:'emergencia', nome:'Soro fisiológico em bolus', apres:'SF 0,9%', via:'EV ou intraóssea',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Choque e desidratação grave', mgkg:null, fixa:'20 mL/kg', freq:'reavaliar entre cada bolus', conc:null, unid:'mL',
           nota:'Use o cálculo de volume abaixo. Reavalie ausculta, fígado e perfusão entre as alíquotas.' },
         { rot:'Cardiopata ou desnutrido grave', mgkg:null, fixa:'5 a 10 mL/kg', freq:'reavaliar entre cada bolus', conc:null, unid:'mL',
           nota:'Nesses, 20 mL/kg pode precipitar congestão.' }],
  atencao:'Hepatomegalia e estertores que surgem durante a expansão significam parar o volume.',
  obs:[] },

/* ---------------- HIDRATAÇÃO E DIGESTIVO ---------------- */
{ id:'p-sro', grupo:'digestivo', nome:'Sais de reidratação oral', apres:'Sachê da OMS de osmolaridade reduzida', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Plano A — sem desidratação', mgkg:null, fixa:'Até 2 anos: 50 a 100 mL após cada evacuação · acima de 2 anos: 100 a 200 mL',
           freq:'após cada perda', conc:null, unid:'mL', nota:'Manter alimentação e aleitamento.' },
         { rot:'Plano B — desidratação leve a moderada', mgkg:75, mgkgMax:75, freq:'em 4 h, no serviço', maxMg:null, conc:1000, unid:'mL',
           nota:'75 mL/kg em 4 horas, em copo ou colher, sob supervisão. Reavaliar ao fim.' }],
  atencao:'A reidratação oral supervisionada resolve a maioria dos casos e evita punção venosa.',
  obs:['Vômito não contraindica: ofereça em pequenos volumes, e considere ondansetrona.'] },

{ id:'p-zinco', grupo:'digestivo', nome:'Zinco', apres:'Solução 4 mg/mL', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Menores de 6 meses', mgkg:null, fixa:'10 mg/dia', freq:'1× ao dia por 10 a 14 dias', conc:null, unid:'mg',
           nota:'Reduz duração e gravidade da diarreia, e a recorrência nos meses seguintes.' },
         { rot:'6 meses ou mais', mgkg:null, fixa:'20 mg/dia', freq:'1× ao dia por 10 a 14 dias', conc:null, unid:'mg',
           nota:'Recomendação da OMS e do Ministério da Saúde em toda diarreia aguda.' }],
  atencao:'Prescreva junto com o soro de reidratação: é a dupla recomendada, e costuma ser esquecida.',
  obs:[] },

{ id:'p-simeticona', grupo:'digestivo', nome:'Simeticona', apres:'Gotas 75 mg/mL', via:'VO',
  idade:'Qualquer idade', minMeses:0, veto:null,
  doses:[{ rot:'Cólica do lactente', mgkg:null, fixa:'3 a 5 gotas', freq:'até 4× ao dia', conc:null, unid:'gotas',
           nota:'Não é absorvida. O benefício é modesto e boa parte é efeito do acolhimento.' }],
  atencao:'Cólica do lactente não tem tratamento medicamentoso eficaz. Oriente a família sobre o curso natural.',
  obs:[] }

];
