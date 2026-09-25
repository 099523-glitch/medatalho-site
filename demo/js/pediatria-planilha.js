/* ============================================================
   PEDIATRIA — medicações da planilha "MEDICAÇÕES PEDIATRIA"
   (designer, 25/09/2026) que ainda não existiam em pediatria-dados.js.
   As que já existem (dipirona, paracetamol, ibuprofeno, amoxicilina,
   dexametasona, fentanila, adrenalina, ipratrópio…) mantêm a dose do app.

   Formatos de dose (além de mgkg/conc do pediatria-dados.js):
     porKg     quantidade por kg na unidade de saída (mL ou gotas)
     saida     'mL' | 'gotas'
     maxSaida  teto por dose na mesma unidade
     porIdade / porPeso  faixas fixas { min, max, txt, rot } em meses / kg
     fixa      texto fixo (colírio, gota otológica, antiparasitário)

   CORRIGIDO NA ENTRADA (ainda sem revisão médica formal):
     - tetos: atropina 0,5 mg, flumazenil 0,2 mg, naloxona 2 mg,
       clorpromazina 25 mg, meperidina 100 mg, fenobarbital 1 g por dose;
     - carbocisteína e acebrofilina (ambroxol) só a partir de 2 anos —
       mucolítico é contraindicado abaixo de 2 anos.
   FORA ATÉ A REVISÃO: manitol 20% (planilha: 10 mL/kg = 2 g/kg, o dobro
   do máximo), ranitidina (suspensa pela Anvisa em 2020), soro de manutenção
   (receita hipotônica; a recomendação atual é isotônica), leite de magnésia
   (2 mL/kg, acima da bula) e Koide D (0,25 mL/kg, acima da bula).
   ============================================================ */

var PED_PLANILHA = [

/* ---------- ALERGIA ---------- */
{ id:'pl-prometazina', grupo:'alergia', nome:'Prometazina injetável', apres:'Ampola 50 mg/2 mL (Fenergan®)', via:'IM',
  idade:'A partir de 2 anos', veto:{ meses:24, txt:'Depressão respiratória fatal descrita abaixo de 2 anos.' },
  doses:[{ rot:'Dose', porKg:0.02, saida:'mL', conc:25, maxSaida:2, freq:'' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- ANTIBIÓTICOS ---------- */
{ id:'pl-metronidazol', grupo:'atb-oral', nome:'Metronidazol', apres:'Suspensão oral 4% — 40 mg/mL (Flagyl®)', via:'VO', veto:null,
  doses:[{ rot:'Dose', porKg:0.5, saida:'mL', conc:40, maxSaida:10, freq:'dividido de 12/12 ou 8/8 h',
           nota:'Na planilha: 0,5 mL/kg por dia, em 2 ou 3 tomadas.' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-benzatina', grupo:'atb-ev', nome:'Penicilina benzatina', apres:'Frasco 600.000 UI e 1.200.000 UI', via:'IM', veto:null,
  doses:[{ rot:'Dose única', porPeso:[{ min:11, max:25, txt:'600.000 UI', rot:'11 a 25 kg' }, { min:25.01, max:999, txt:'1.200.000 UI', rot:'acima de 25 kg' }],
           regra:'11 a 25 kg: 600.000 UI · acima de 25 kg: 1.200.000 UI', fora:'Abaixo de 11 kg a planilha não traz dose', freq:'dose única' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- CÓLICA E ANTIESPASMÓDICO ---------- */
{ id:'pl-escopolamina', grupo:'antiespasmodico', nome:'Escopolamina + dipirona', apres:'Solução oral em gotas', via:'VO',
  idade:'A partir de 3 meses ou 5 kg (dipirona)', veto:{ meses:3, txt:'Contém dipirona: abaixo de 3 meses ou 5 kg está fora da faixa da bula.' },
  doses:[{ rot:'Cólica', porKg:1, saida:'gotas', maxSaida:40, freq:'6/6 h se cólica' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-buscopan-ev', grupo:'antiespasmodico', nome:'Buscopan Composto® EV', apres:'Ampola (escopolamina + dipirona)', via:'EV',
  idade:'A partir de 3 meses ou 5 kg (dipirona)', veto:{ meses:3, txt:'Contém dipirona: abaixo de 3 meses ou 5 kg está fora da faixa da bula.' },
  doses:[{ rot:'Cólica', porKg:0.05, saida:'mL', freq:'', nota:'Infundir diluído no soro, lentamente.' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- ANTI-INFLAMATÓRIOS ---------- */
{ id:'pl-cetoprofeno', grupo:'antiinflamatorio', nome:'Cetoprofeno', apres:'Gotas 20 mg/mL (Profenid®)', via:'VO',
  idade:'A partir de 6 meses', veto:{ meses:6, txt:'Anti-inflamatório: não usar abaixo de 6 meses.' },
  doses:[{ rot:'Dose', porKg:1, saida:'gotas', maxSaida:50, freq:'8/8 h por 2 a 5 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-diclofenaco', grupo:'antiinflamatorio', nome:'Diclofenaco', apres:'Gotas 15 mg/mL (Cataflan®)', via:'VO',
  idade:'A partir de 6 meses', veto:{ meses:6, txt:'Anti-inflamatório: não usar abaixo de 6 meses.' },
  doses:[{ rot:'Dose', porKg:1, saida:'gotas', maxSaida:40, freq:'8/8 h por 2 a 5 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-nimesulida', grupo:'antiinflamatorio', nome:'Nimesulida', apres:'Gotas (Scaflam®)', via:'VO',
  idade:'A partir de 6 meses', veto:{ meses:6, txt:'Anti-inflamatório: não usar abaixo de 6 meses.' },
  doses:[{ rot:'Dose', porKg:1, saida:'gotas', maxSaida:40, freq:'12/12 h por 2 a 5 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- ANTIPARASITÁRIOS ---------- */
{ id:'pl-nitazoxanida', grupo:'antiparasitario', nome:'Nitazoxanida', apres:'Suspensão oral 20 mg/mL (Annita®)', via:'VO', veto:null,
  doses:[{ rot:'Dose', porKg:0.375, saida:'mL', conc:20, maxSaida:15, freq:'12/12 h por 3 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-albendazol', grupo:'antiparasitario', nome:'Albendazol', apres:'Suspensão oral 400 mg/10 mL', via:'VO',
  idade:'Evitar abaixo de 2 anos', veto:{ meses:24, txt:'A planilha orienta evitar abaixo de 2 anos.' },
  doses:[{ rot:'Dose habitual', fixa:'10 mL', freq:'dose única' },
         { rot:'Giardíase', fixa:'10 mL', freq:'1× ao dia por 5 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-mebendazol', grupo:'antiparasitario', nome:'Mebendazol', apres:'Suspensão oral 100 mg/5 mL', via:'VO',
  idade:'Evitar abaixo de 2 anos', veto:{ meses:24, txt:'A planilha orienta evitar abaixo de 2 anos.' },
  doses:[{ rot:'Dose', fixa:'5 mL', freq:'12/12 h por 3 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- TOSSE E XAROPES ---------- */
{ id:'pl-acebrofilina', grupo:'tosse', nome:'Acebrofilina', apres:'Xarope 25 mg/5 mL (Filinar®)', via:'VO',
  idade:'A partir de 2 anos', veto:{ meses:24, txt:'Contém ambroxol: mucolítico é contraindicado abaixo de 2 anos.' },
  doses:[{ rot:'Dose', porKg:0.2, saida:'mL', conc:5, maxSaida:10, freq:'12/12 h por 5 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-carbocisteina', grupo:'tosse', nome:'Carbocisteína', apres:'Xarope infantil 20 mg/mL', via:'VO',
  idade:'A partir de 2 anos', veto:{ meses:24, txt:'Mucolítico: contraindicado abaixo de 2 anos.' },
  doses:[{ rot:'Dose por idade', porIdade:[{ min:24, max:59, txt:'2,5 mL', rot:'2 a 4 anos' }, { min:60, max:131, txt:'5 mL', rot:'5 a 10 anos' }, { min:132, max:216, txt:'10 mL', rot:'acima de 10 anos' }],
           regra:'2 a 4 anos: 2,5 mL · 5 a 10 anos: 5 mL · acima de 10 anos: 10 mL', fora:'Abaixo de 2 anos: contraindicado', freq:'8/8 h por 5 dias' }],
  obs:['Fonte: planilha Medicações Pediatria (a planilha começava em 1 ano; corrigido para 2 anos).'] },

{ id:'pl-terbutalina', grupo:'tosse', nome:'Terbutalina', apres:'Xarope (Bricanyl®)', via:'VO', veto:null,
  doses:[{ rot:'Dose', porKg:0.25, saida:'mL', maxSaida:5, freq:'8/8 h por 5 dias' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- LAXANTES ---------- */
{ id:'pl-oleo-mineral', grupo:'laxante', nome:'Óleo mineral', apres:'Nujol®', via:'VO',
  idade:'Evitar abaixo de 1 ano', veto:{ meses:12, txt:'A planilha orienta evitar abaixo de 1 ano.' },
  doses:[{ rot:'Dose', porKg:1.5, saida:'mL', maxSaida:15, freq:'1 a 2× ao dia' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

{ id:'pl-lactulose', grupo:'laxante', nome:'Lactulose', apres:'Xarope (Lactulona®)', via:'VO', veto:null,
  doses:[{ rot:'Dose por idade', porIdade:[{ min:0, max:11, txt:'5 mL por dia', rot:'menor de 1 ano' }, { min:12, max:71, txt:'7,5 mL por dia', rot:'1 a 5 anos' }, { min:72, max:155, txt:'12 mL por dia', rot:'6 a 12 anos' }],
           regra:'Menor de 1 ano: 5 mL/dia · 1 a 5 anos: 7,5 mL/dia · 6 a 12 anos: 12 mL/dia', fora:'Acima de 12 anos a planilha não traz dose', freq:'' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- COLÍRIOS ---------- */
{ id:'pl-cromoglicato', grupo:'olhos', nome:'Cromoglicato dissódico 2%', apres:'Colírio (Cromolerg®)', via:'Ocular', veto:null,
  doses:[{ rot:'Dose', fixa:'1 gota', freq:'6/6 h por 5 dias' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-genta-colirio', grupo:'olhos', nome:'Gentamicina colírio', apres:'Colírio', via:'Ocular', veto:null,
  doses:[{ rot:'Dose', fixa:'1 gota', freq:'6/6 h por 5 dias' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-maxitrol', grupo:'olhos', nome:'Maxitrol® colírio', apres:'Dexametasona + neomicina + polimixina B', via:'Ocular', veto:null,
  doses:[{ rot:'Dose', fixa:'1 gota', freq:'6/6 h por 5 dias' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-tobra-colirio', grupo:'olhos', nome:'Tobramicina colírio', apres:'Colírio (Tobrex®)', via:'Ocular', veto:null,
  doses:[{ rot:'Dose', fixa:'1 gota', freq:'6/6 h por 5 dias' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-tobra-pomada', grupo:'olhos', nome:'Tobramicina pomada oftálmica', apres:'Pomada (Tobrex®)', via:'Ocular', veto:null,
  doses:[{ rot:'Dose', fixa:'1 aplicação', freq:'8/8 h por 5 dias', nota:'A planilha registra "1 gota".' }], obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- GOTAS OTOLÓGICAS ---------- */
{ id:'pl-biamotil', grupo:'ouvido', nome:'Biamotil® otológico', apres:'Ciprofloxacino', via:'Otológica', veto:null,
  doses:[{ rot:'Dose', fixa:'3 gotas', freq:'6/6 h por 5 dias' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-otobetnovate', grupo:'ouvido', nome:'Oto-Betnovate®', apres:'Betametasona + clorfenesina…', via:'Otológica', veto:null,
  doses:[{ rot:'Dose', fixa:'3 gotas', freq:'6/6 h por 5 dias' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-otosporin', grupo:'ouvido', nome:'Otosporin®', apres:'Hidrocortisona + neomicina + polimixina B', via:'Otológica', veto:null,
  doses:[{ rot:'Dose', fixa:'3 gotas', freq:'6/6 h por 5 dias' }], obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- INALAÇÃO ---------- */
{ id:'pl-fenoterol', grupo:'inalacao', nome:'Fenoterol (Berotec®)', apres:'Gotas para nebulização', via:'Nebulização', veto:null,
  doses:[{ rot:'Asma', porKg:1 / 3, saida:'gotas', maxSaida:10, regra:'1 gota a cada 3 kg', freq:'a cada 20 min, até 3 vezes',
           nota:'Nebulizar com 3 a 5 mL de SF 0,9%.' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },

/* ---------- EMERGÊNCIA ---------- */
{ id:'pl-atropina', grupo:'emergencia', nome:'Atropina', apres:'Ampola 0,25 mg/mL ou 0,5 mg/mL', via:'EV', veto:null,
  alt:[[0.25, '0,25 mg/mL'], [0.5, '0,5 mg/mL']],
  doses:[{ rot:'Dose', mgkg:0.02, mgkgMax:0.02, maxMg:0.5, freq:'', conc:0.25, unid:'mL',
           nota:'Planilha: 0,08 mL/kg da ampola de 0,25 mg/mL ou 0,04 mL/kg da de 0,5 mg/mL. Teto de 0,5 mg por dose.' }],
  obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-cetamina', grupo:'emergencia', nome:'Cetamina', apres:'500 mg/10 mL (Ketalar®)', via:'IM ou EV', veto:null,
  doses:[{ rot:'Dose', porKg:0.04, saida:'mL', conc:50, freq:'' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-clorpromazina', grupo:'emergencia', nome:'Clorpromazina', apres:'25 mg/5 mL (Amplictil®)', via:'IM ou EV', veto:null,
  doses:[{ rot:'Dose', porKg:0.2, saida:'mL', conc:5, maxSaida:5, freq:'' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-fenobarbital', grupo:'emergencia', nome:'Fenobarbital', apres:'200 mg/2 mL', via:'IM ou EV', veto:null,
  doses:[{ rot:'Dose', porKg:0.2, saida:'mL', conc:100, maxSaida:10, freq:'', nota:'Infundir em 10 min, diluído 1:9 em SF.' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-flumazenil', grupo:'emergencia', nome:'Flumazenil', apres:'0,5 mg/5 mL (Lanexat®)', via:'EV', veto:null,
  doses:[{ rot:'Dose', porKg:0.1, saida:'mL', conc:0.1, maxSaida:2, freq:'' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-meperidina', grupo:'emergencia', nome:'Meperidina', apres:'100 mg/2 mL (Dolantina®) — diluir 2 mL + 8 mL de AD = 10 mg/mL', via:'IM ou EV', veto:null,
  doses:[{ rot:'Dose', porKg:0.2, saida:'mL', conc:10, maxSaida:10, freq:'', nota:'Volume da solução já diluída.' }], obs:['Fonte: planilha Medicações Pediatria.'] },
{ id:'pl-naloxona', grupo:'emergencia', nome:'Naloxona', apres:'0,4 mg/mL (Narcan®)', via:'EV', veto:null,
  doses:[{ rot:'Dose', porKg:0.25, saida:'mL', conc:0.4, maxSaida:5, freq:'' }], obs:['Fonte: planilha Medicações Pediatria.'] }
];
