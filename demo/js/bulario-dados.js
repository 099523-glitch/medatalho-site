/* ===========================================================
   BULÁRIO DE EMERGÊNCIA — verbetes curados, adulto.
   Apresentações do mercado brasileiro, diluição de bancada,
   dose por indicação, ajuste renal e o que conferir.
   Entra no índice A–Z de Doses (junto dos usos derivados das
   condutas) e no verbete #droga/<slug>.
   Campos: slug (chave do índice) · nome · classe · apres[] ·
   dil (diluição padrão) · ind[] {sit, dose, via, prep, obs} ·
   renal · hep · contra · cuidado[] · gest · max · antidoto.
   Sem revisão clínica formal: conferir na diretriz e na bula.
   =========================================================== */
var FERR_BULARIO = [

/* ===================== VASOATIVOS E INOTRÓPICOS ===================== */
{ slug:'noradrenalina', nome:'Noradrenalina', classe:'Vasopressor — agonista alfa-1 (e beta-1 leve)',
  apres:['Ampola 4 mg/4 mL (1 mg/mL) — hemitartarato', 'Ampola 8 mg/4 mL (2 mg/mL)'],
  dil:'4 ampolas de 4 mg (16 mg) + SG 5% 234 mL = 250 mL a 64 mcg/mL. Ou 2 ampolas (8 mg) + SG 5% 242 mL = 32 mcg/mL. Em veia periférica calibrosa por até 24–48 h se central indisponível; ideal em cateter central.',
  ind:[
    { sit:'Choque séptico', dose:'0,05–0,5 mcg/kg/min (até 1–2 em refratário)', via:'EV BIC', prep:'Solução 64 mcg/mL: paciente de 70 kg a 0,1 mcg/kg/min = 6,6 mL/h. Titular a cada 5–10 min para PAM ≥ 65.', obs:'Primeira escolha. Associar vasopressina 0,03 UI/min se dose > 0,25–0,5 mcg/kg/min.' },
    { sit:'Choque cardiogênico com hipotensão', dose:'0,05–0,3 mcg/kg/min', via:'EV BIC', prep:'', obs:'Junto com dobutamina se baixo débito; preferida à dopamina (menos arritmia).' },
    { sit:'Choque hemorrágico / trauma (ponte)', dose:'0,05–0,2 mcg/kg/min', via:'EV BIC', prep:'', obs:'Só enquanto o volume e o sangue chegam. Não substitui hemoderivado.' },
    { sit:'Antes da intubação no hipotenso ou com índice de choque > 0,8', dose:'Iniciar 5–15 mcg/min (≈ 0,05–0,2 mcg/kg/min)', via:'EV BIC', prep:'64 mcg/mL: 5–15 mcg/min = 5–14 mL/h.', obs:'Correndo ANTES do indutor. Alvo PAM ≥ 65.' },
    { sit:'Pós-parada com hipotensão', dose:'0,1–0,5 mcg/kg/min', via:'EV BIC', prep:'', obs:'Alvo PAS > 90 e PAM > 65.' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma absoluta no choque. Hipovolemia não corrigida (repor volume junto).',
  cuidado:['Extravasamento: infiltrar fentolamina 5–10 mg em 10 mL de SF ao redor.', 'Não diluir em bicarbonato (inativa).', 'Bradicardia reflexa e isquemia de extremidades em dose alta.', 'Nunca em bolus.'],
  gest:'Usar se necessário — a hipotensão materna é pior para o feto.', max:'Sem teto definido; acima de 1 mcg/kg/min, associar vasopressina e corticoide.' },

{ slug:'adrenalina', nome:'Adrenalina', classe:'Agonista alfa e beta (epinefrina)',
  apres:['Ampola 1 mg/mL (1:1.000) — 1 mL'],
  dil:'Bolus na PCR: puro (1 mL). Infusão: 5 ampolas (5 mg) + SG 5% 245 mL = 20 mcg/mL. Anafilaxia: IM puro. Nebulização: 3–5 mL puro (crupe/estridor).',
  ind:[
    { sit:'Parada cardiorrespiratória', dose:'1 mg a cada 3–5 min', via:'EV/IO', prep:'Seguir de flush de 20 mL de SF e elevar o membro.', obs:'Em ritmo não chocável, o mais cedo possível; em FV/TV, após o 2º choque.' },
    { sit:'Anafilaxia', dose:'0,3–0,5 mg (0,3–0,5 mL)', via:'IM', prep:'Vasto lateral da coxa. Repetir a cada 5–15 min se necessário.', obs:'Primeira e única droga que salva. Sem resposta a 2–3 doses IM: infusão EV 0,05–0,1 mcg/kg/min.' },
    { sit:'Choque anafilático refratário', dose:'0,05–0,5 mcg/kg/min', via:'EV BIC', prep:'20 mcg/mL: 70 kg a 0,1 mcg/kg/min = 21 mL/h.', obs:'' },
    { sit:'Bradicardia instável (após atropina)', dose:'2–10 mcg/min', via:'EV BIC', prep:'20 mcg/mL: 6–30 mL/h.', obs:'Alternativa à dopamina enquanto prepara o marca-passo.' },
    { sit:'Hipotensão peri-intubação (bolus "push-dose")', dose:'10–20 mcg (5–30) a cada 2–5 min', via:'EV', prep:'1 ampola (1 mg) + SF 0,9% 99 mL = 10 mcg/mL: 1–2 mL por vez.', obs:'Ponte enquanto volume e noradrenalina agem. Rotule a seringa: 10 mcg/mL.' },
    { sit:'Choque séptico refratário (2ª/3ª linha)', dose:'0,05–0,5 mcg/kg/min', via:'EV BIC', prep:'', obs:'Aumenta lactato (efeito beta), o que confunde a meta.' },
    { sit:'Crupe / estridor pós-extubação', dose:'3–5 mL (3–5 mg) puros', via:'INAL', prep:'Nebulizar com O2 5 L/min. Pode repetir em 30 min.', obs:'Observar 2–3 h após (efeito rebote).' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma na PCR e na anafilaxia.',
  cuidado:['Nunca 1 mg EV em bolus fora da parada — arritmia, hipertensão grave, IAM.', 'Extravasamento: fentolamina local.', 'Hiperglicemia e hipocalemia transitórias.'],
  gest:'Usar na anafilaxia e na PCR sem restrição.' },

{ slug:'vasopressina', nome:'Vasopressina', classe:'Vasopressor — agonista V1 (não catecolaminérgico)',
  apres:['Ampola 20 UI/mL — 1 mL'],
  dil:'1 ampola (20 UI) + SF 0,9% 100 mL = 0,2 UI/mL. Ou 2 ampolas (40 UI) + SF 200 mL.',
  ind:[
    { sit:'Choque séptico (associada à noradrenalina)', dose:'0,03 UI/min — fixa', via:'EV BIC', prep:'0,2 UI/mL: 9 mL/h. Não titular; é dose fixa.', obs:'Entra quando a nora passa de 0,25–0,5 mcg/kg/min. Não é droga de resgate isolada.' },
    { sit:'Choque vasoplégico pós-CEC / refratário', dose:'0,03–0,04 UI/min', via:'EV BIC', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Doença coronariana grave e isquemia mesentérica (relativas).',
  cuidado:['Isquemia digital, mesentérica e coronariana em dose > 0,04 UI/min.', 'Hiponatremia com uso prolongado.', 'Retirar por último? Não — retirar a vasopressina antes da nora causa mais hipotensão; desmamar devagar.'] },

{ slug:'dobutamina', nome:'Dobutamina', classe:'Inotrópico — agonista beta-1',
  apres:['Ampola 250 mg/20 mL (12,5 mg/mL)'],
  dil:'1 ampola (250 mg) + SG 5% 230 mL = 250 mL a 1.000 mcg/mL (1 mg/mL). Pode ser periférica.',
  ind:[
    { sit:'Choque cardiogênico / IC com baixo débito', dose:'2,5–20 mcg/kg/min', via:'EV BIC', prep:'1 mg/mL: 70 kg a 5 mcg/kg/min = 21 mL/h.', obs:'Vasodilata — se PAS < 90, associar noradrenalina.' },
    { sit:'Choque séptico com disfunção miocárdica', dose:'2,5–10 mcg/kg/min', via:'EV BIC', prep:'', obs:'Só após volume e nora, se ainda houver hipoperfusão com débito baixo.' }
  ],
  renal:'Sem ajuste.', contra:'Estenose aórtica grave, cardiomiopatia hipertrófica obstrutiva, taquiarritmia não controlada.',
  cuidado:['Taquicardia e arritmia ventricular acima de 10 mcg/kg/min.', 'Tolerância após 48–72 h.', 'Betabloqueador em uso reduz o efeito — considerar milrinona.'] },

{ slug:'dopamina', nome:'Dopamina', classe:'Catecolamina dose-dependente (dopa / beta / alfa)',
  apres:['Ampola 50 mg/10 mL (5 mg/mL)'],
  dil:'5 ampolas (250 mg) + SG 5% 200 mL = 250 mL a 1.000 mcg/mL.',
  ind:[
    { sit:'Bradicardia instável (após atropina)', dose:'5–20 mcg/kg/min', via:'EV BIC', prep:'1 mg/mL: 70 kg a 5 mcg/kg/min = 21 mL/h.', obs:'Ponte até o marca-passo.' },
    { sit:'Choque (quando não há noradrenalina)', dose:'5–20 mcg/kg/min', via:'EV BIC', prep:'', obs:'Mais arritmia e mais mortalidade que a nora no choque séptico e cardiogênico — segunda opção.' }
  ],
  renal:'Sem ajuste. "Dose renal" (1–3 mcg/kg/min) não protege o rim — não usar com esse fim.', contra:'Feocromocitoma, taquiarritmia.',
  cuidado:['Extravasamento: fentolamina.', 'Não misturar com bicarbonato.'] },

{ slug:'milrinona', nome:'Milrinona', classe:'Inodilatador — inibidor da fosfodiesterase 3',
  apres:['Ampola 20 mg/20 mL (1 mg/mL)'],
  dil:'1 ampola (20 mg) + SG 5% 80 mL = 100 mL a 200 mcg/mL.',
  ind:[
    { sit:'IC descompensada em uso de betabloqueador / baixo débito', dose:'0,25–0,75 mcg/kg/min (sem ataque)', via:'EV BIC', prep:'200 mcg/mL: 70 kg a 0,375 mcg/kg/min = 7,9 mL/h.', obs:'Age mesmo com betabloqueio. Hipotensão — evitar o bolus de ataque.' }
  ],
  renal:'ClCr 50: 0,43 · 30: 0,33 · 20: 0,28 · 10: 0,23 mcg/kg/min (máximo). Acumula.', contra:'Estenose aórtica grave, hipotensão.',
  cuidado:['Meia-vida longa (2–4 h): a hipotensão demora a passar.', 'Arritmia ventricular.'] },

{ slug:'levosimendana', nome:'Levosimendana', classe:'Sensibilizador de cálcio (inodilatador)',
  apres:['Frasco 12,5 mg/5 mL (2,5 mg/mL)'],
  dil:'1 frasco (12,5 mg) + SG 5% 500 mL = 25 mcg/mL.',
  ind:[
    { sit:'IC aguda com baixo débito (PAS > 90)', dose:'0,05–0,2 mcg/kg/min por 24 h, sem bolus', via:'EV BIC', prep:'25 mcg/mL: 70 kg a 0,1 mcg/kg/min = 16,8 mL/h.', obs:'Efeito dura ~1 semana (metabólito ativo). Alto custo — uso restrito.' }
  ],
  renal:'ClCr < 30: evitar (metabólito acumula).', contra:'Hipotensão, taquiarritmia, ClCr < 30, hepatopatia grave.',
  cuidado:['Hipotensão e taquicardia nas primeiras horas.', 'Hipocalemia — repor antes.'] },

{ slug:'fenilefrina', nome:'Fenilefrina', classe:'Vasopressor — agonista alfa-1 puro',
  apres:['Ampola 10 mg/mL — 1 mL'],
  dil:'1 ampola (10 mg) + SF 0,9% 100 mL = 100 mcg/mL. Bolus: 1 mL dessa solução = 100 mcg.',
  ind:[
    { sit:'Hipotensão na raquianestesia, na sedação ou na intubação', dose:'100 mcg em bolus (50–200), repetir a cada 1–2 min', via:'EV', prep:'', obs:'Só vasoconstrição, com bradicardia reflexa: se o coração é fraco, prefira adrenalina em bolus.' },
    { sit:'Hipotensão com taquiarritmia (quando a nora não convém)', dose:'0,5–2 mcg/kg/min', via:'EV BIC', prep:'100 mcg/mL: 70 kg a 1 mcg/kg/min = 42 mL/h.', obs:'Reduz o débito — não usar no choque cardiogênico por falha de bomba (a exceção é a obstrução da via de saída, abaixo).' },
    { sit:'Choque com obstrução dinâmica da via de saída do VE (Takotsubo, cardiomiopatia hipertrófica)', dose:'0,5–2 mcg/kg/min, titular', via:'EV BIC', prep:'', obs:'Junto com volume e betabloqueador cauteloso. Inotrópico e nitrato pioram a obstrução.' }
  ],
  renal:'Sem ajuste.', contra:'Choque cardiogênico, bradicardia grave.', cuidado:['Bradicardia reflexa.', 'Extravasamento: fentolamina.'] },

{ slug:'metaraminol', nome:'Metaraminol', classe:'Vasopressor — agonista alfa (bolus)',
  apres:['Ampola 10 mg/mL — 1 mL'],
  dil:'1 ampola (10 mg) + SF 0,9% 19 mL = 20 mL a 0,5 mg/mL. Bolus de 1 mL = 0,5 mg.',
  ind:[
    { sit:'Hipotensão transitória (sedação, raqui, ponte para a nora)', dose:'0,5–1 mg em bolus, repetir a cada 3–5 min', via:'EV', prep:'', obs:'Efeito dura 20 min. Não é droga de manutenção do choque.' }
  ],
  renal:'Sem ajuste.', contra:'Uso prolongado no choque (taquifilaxia).', cuidado:['Bradicardia reflexa.'] },

/* ===================== ANTI-HIPERTENSIVOS E ANTIANGINOSOS ===================== */
{ slug:'nitroprussiato-de-sodio', nome:'Nitroprussiato de sódio', classe:'Vasodilatador arterial e venoso (doador de NO)',
  apres:['Frasco-ampola 50 mg (pó) + diluente 2 mL'],
  dil:'1 frasco (50 mg) + SG 5% 248 mL = 250 mL a 200 mcg/mL. Proteger da luz (equipo opaco). Trocar a cada 24 h.',
  ind:[
    { sit:'Emergência hipertensiva (dissecção, encefalopatia, EAP hipertensivo)', dose:'0,25–10 mcg/kg/min', via:'EV BIC', prep:'200 mcg/mL: 70 kg a 0,5 mcg/kg/min = 10,5 mL/h. Titular a cada 5 min.', obs:'Reduzir PAM 20–25% na 1ª hora; dissecção: PAS 100–120 em 20 min com betabloqueador ANTES.' }
  ],
  renal:'ClCr < 30: evitar > 2 mcg/kg/min por mais de 24–48 h (tiocianato acumula). Monitorar lactato.', hep:'Insuficiência hepática: risco de cianeto — preferir outra droga.',
  contra:'Coarctação, AVC isquêmico agudo (queda brusca), hipertensão intracraniana (relativa), gestação (preferir hidralazina).',
  cuidado:['Acima de 2 mcg/kg/min por > 48 h: intoxicação por cianeto (acidose lática, confusão) — hidroxocobalamina.', 'Hipotensão rebote ao suspender: desmamar.', 'Roubo coronariano no IAM — preferir nitroglicerina.'] },

{ slug:'nitroglicerina', nome:'Nitroglicerina', classe:'Vasodilatador venoso (e coronariano)',
  apres:['Ampola 25 mg/5 mL (5 mg/mL)', 'Ampola 50 mg/10 mL'],
  dil:'1 ampola de 25 mg + SG 5% 245 mL = 250 mL a 100 mcg/mL. Frasco de vidro ou PVC-free (adsorve no PVC).',
  ind:[
    { sit:'Edema agudo de pulmão hipertensivo', dose:'10–200 mcg/min (começar 10–20, dobrar a cada 3–5 min)', via:'EV BIC', prep:'100 mcg/mL: 10 mcg/min = 6 mL/h; 100 mcg/min = 60 mL/h.', obs:'Suspender se PAS < 90–100. Alívio rápido da congestão.' },
    { sit:'Síndrome coronariana aguda com dor ou hipertensão', dose:'5–100 mcg/min', via:'EV BIC', prep:'', obs:'Não reduz mortalidade; alívio sintomático.' },
    { sit:'Angina (sublingual)', dose:'Isossorbida 5 mg SL a cada 5 min, até 3 doses', via:'SL', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'PAS < 90, IAM de VD, sildenafil/tadalafil nas últimas 24–48 h, estenose aórtica grave, hipertensão intracraniana.',
  cuidado:['Cefaleia e taquifilaxia após 24–48 h.', 'Metemoglobinemia em dose alta prolongada.'] },

{ slug:'hidralazina', nome:'Hidralazina', classe:'Vasodilatador arterial direto',
  apres:['Ampola 20 mg/mL — 1 mL', 'Comprimido 25 e 50 mg'],
  dil:'1 ampola (20 mg) + SF 0,9% 19 mL = 1 mg/mL.',
  ind:[
    { sit:'Pré-eclâmpsia grave / eclâmpsia (PA ≥ 160/110)', dose:'5 mg EV lento; repetir 5–10 mg a cada 20 min (máx. 30 mg)', via:'EV', prep:'Em 1–2 min.', obs:'Meta PAS 140–150 / PAD 90–100. Alternativa: nifedipino 10 mg VO.' },
    { sit:'Urgência hipertensiva sem outra opção', dose:'10–20 mg', via:'EV ou IM', prep:'', obs:'Início em 10–20 min, dura 2–4 h — imprevisível; não é primeira escolha fora da gestação.' }
  ],
  renal:'Sem ajuste agudo.', contra:'Dissecção de aorta, coronariopatia grave (taquicardia reflexa), lúpus.',
  cuidado:['Hipotensão tardia e prolongada.', 'Taquicardia reflexa — associar betabloqueador fora da gestação.'] },

{ slug:'esmolol', nome:'Esmolol', classe:'Betabloqueador beta-1 de ação ultracurta',
  apres:['Ampola 100 mg/10 mL (10 mg/mL)', 'Frasco 2,5 g/10 mL (250 mg/mL — precisa diluir)'],
  dil:'Ampola 10 mg/mL usa-se pura para bolus. Infusão: 2,5 g + SF 0,9% 240 mL = 10 mg/mL.',
  ind:[
    { sit:'Dissecção de aorta (controle de FC < 60 antes do vasodilatador)', dose:'Ataque 500 mcg/kg em 1 min; manutenção 50–300 mcg/kg/min', via:'EV', prep:'10 mg/mL: 70 kg ataque = 3,5 mL; 100 mcg/kg/min = 42 mL/h.', obs:'' },
    { sit:'Taquiarritmia supraventricular / FA com RVR no perioperatório', dose:'500 mcg/kg em 1 min, depois 50–200 mcg/kg/min', via:'EV', prep:'', obs:'Reavaliar a cada 5 min; repetir o ataque antes de cada aumento.' },
    { sit:'Tempestade tireoidiana / hipertensão com taquicardia', dose:'50–100 mcg/kg/min', via:'EV BIC', prep:'', obs:'' }
  ],
  renal:'Sem ajuste (metabolismo por esterases).', contra:'Bradicardia, BAV 2º/3º, choque cardiogênico, asma grave (relativa).',
  cuidado:['Hipotensão — dura 10–20 min após parar.', 'Flebite se > 10 mg/mL em periférica.'] },

{ slug:'metoprolol', nome:'Metoprolol', classe:'Betabloqueador beta-1 seletivo',
  apres:['Ampola 5 mg/5 mL (1 mg/mL)', 'Comprimido tartarato 25/50/100 mg; succinato 25/50/100 mg'],
  dil:'Puro, lento.',
  ind:[
    { sit:'FA / flutter com resposta rápida (estável)', dose:'5 mg EV em 2–5 min; repetir a cada 5 min até 15 mg', via:'EV', prep:'', obs:'Depois 25–50 mg VO 12/12 h (tartarato).' },
    { sit:'SCA sem contraindicação (IC, hipotensão, bradicardia)', dose:'25–50 mg VO 12/12 h nas primeiras 24 h', via:'VO', prep:'', obs:'EV só se hipertensão/taquicardia persistentes e sem sinais de IC.' },
    { sit:'Dissecção de aorta (anti-impulso)', dose:'5 mg EV lento a cada 5 min, até 15 mg', via:'EV', prep:'', obs:'Alvo FC < 60 ANTES do vasodilatador. Esmolol é mais titulável. Não usar na dor por cocaína.' },
    { sit:'TSV refratária à adenosina', dose:'5 mg EV lento', via:'EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir dose na cirrose.', contra:'BAV 2º/3º, FC < 50, PAS < 90, IC descompensada, asma em crise.',
  cuidado:['Não usar com verapamil/diltiazem EV (BAV, assistolia).', 'Broncoespasmo no asmático.'] },

{ slug:'diltiazem', nome:'Diltiazem', classe:'Bloqueador de canal de cálcio não di-hidropiridínico',
  apres:['Ampola 25 mg/5 mL (5 mg/mL)', 'Frasco 50 mg', 'Comprimido 30/60 mg; cápsula 90/120/180/240 mg'],
  dil:'Bolus: puro. Infusão: 125 mg (5 ampolas) + SF 0,9% 100 mL = 1 mg/mL.',
  ind:[
    { sit:'FA / flutter com resposta ventricular rápida (FE preservada)', dose:'0,25 mg/kg (≈ 15–20 mg) EV em 2 min; se não controlar em 15 min, 0,35 mg/kg (≈ 25 mg)', via:'EV', prep:'Manutenção 5–15 mg/h em BIC (1 mg/mL: 5–15 mL/h).', obs:'Depois 30–60 mg VO 6/6 h ou 120–360 mg/dia de liberação lenta.' },
    { sit:'TSV refratária à adenosina', dose:'15–20 mg EV em 2 min', via:'EV', prep:'', obs:'' },
    { sit:'Dissecção de aorta com betabloqueador contraindicado', dose:'0,25 mg/kg EV em 2 min; depois 5–15 mg/h', via:'EV', prep:'', obs:'Alvo FC < 60. Evitar na IC descompensada.' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir na cirrose.', contra:'IC com FE reduzida, hipotensão, BAV, WPW com FA (acelera a via acessória), uso de betabloqueador EV.',
  cuidado:['Hipotensão — pré-tratar com cálcio 1 g EV se limítrofe.', 'Interação com digoxina, ciclosporina, estatinas.'] },

{ slug:'amiodarona', nome:'Amiodarona', classe:'Antiarrítmico classe III',
  apres:['Ampola 150 mg/3 mL (50 mg/mL)', 'Comprimido 100 e 200 mg'],
  dil:'Bolus: 150 mg + SG 5% 100 mL em 10 min. Manutenção: 900 mg (6 ampolas) + SG 5% 482 mL = 500 mL a 1,8 mg/mL. SEMPRE em glicosado; em veia central se > 24 h (flebite).',
  ind:[
    { sit:'PCR em FV/TV sem pulso refratária', dose:'300 mg em bolus; 2ª dose 150 mg', via:'EV/IO', prep:'Puro ou em 20 mL de SG, após o 3º choque.', obs:'' },
    { sit:'TV com pulso estável / FA com RVR (IC ou pré-excitação)', dose:'150 mg em 10 min; repetir se recorrer; depois 1 mg/min por 6 h e 0,5 mg/min por 18 h', via:'EV', prep:'1,8 mg/mL: 1 mg/min = 33 mL/h; 0,5 mg/min = 17 mL/h.', obs:'Máximo 2,2 g em 24 h.' },
    { sit:'Cardioversão química de FA (< 48 h)', dose:'5–7 mg/kg em 1–2 h, depois 1,2–1,8 g/dia', via:'EV', prep:'', obs:'Anticoagular como na cardioversão elétrica.' },
    { sit:'Manutenção oral', dose:'200 mg/dia (após impregnação 600–800 mg/dia por 1–2 semanas)', via:'VO', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', hep:'Hepatotoxicidade — dosar transaminases.', contra:'Bradicardia sinusal grave, BAV 2º/3º sem marca-passo, QT longo, hipertireoidismo não controlado, alergia a iodo (relativa).',
  cuidado:['Hipotensão e bradicardia na infusão rápida.', 'QT longo — monitorar; evitar outros prolongadores de QT.', 'Interação: aumenta digoxina e varfarina (reduzir 30–50%).', 'Tireoide, pulmão e fígado no uso crônico.'] },

{ slug:'adenosina', nome:'Adenosina', classe:'Antiarrítmico — bloqueio transitório do nó AV',
  apres:['Ampola 6 mg/2 mL (3 mg/mL)'],
  dil:'Puro, em bolus RÁPIDO (1–2 s) na veia mais proximal possível (antecubital), seguido de flush de 20 mL de SF e braço elevado. Usar torneira de 3 vias.',
  ind:[
    { sit:'TSV por reentrada nodal / AV (QRS estreito regular)', dose:'6 mg; se não reverter em 1–2 min, 12 mg; pode repetir 12 mg', via:'EV', prep:'Em veia central ou em uso de dipiridamol/carbamazepina: começar com 3 mg. Transplantado cardíaco: 3 mg.', obs:'Avisar o paciente: sensação de morte iminente por 10–20 s. ECG contínuo rodando.' },
    { sit:'Taquicardia de QRS largo regular, monomórfica, estável (diagnóstica)', dose:'6 mg → 12 mg', via:'EV', prep:'', obs:'Nunca em QRS largo irregular (FA pré-excitada) — pode degenerar em FV.' }
  ],
  renal:'Sem ajuste.', contra:'BAV 2º/3º, doença do nó sinusal, asma grave (broncoespasmo), FA/flutter pré-excitado, QRS largo irregular.',
  cuidado:['Assistolia transitória de poucos segundos é esperada.', 'Teofilina e cafeína reduzem o efeito (aumentar dose).', 'Desfibrilador ao lado.'] },

{ slug:'atropina', nome:'Atropina', classe:'Anticolinérgico (antimuscarínico)',
  apres:['Ampola 0,25 mg/mL — 1 mL', 'Ampola 0,5 mg/mL — 1 mL', 'Ampola 1 mg/mL — 1 mL'],
  dil:'Puro.',
  ind:[
    { sit:'Bradicardia sintomática / instável', dose:'1 mg a cada 3–5 min, máximo 3 mg', via:'EV', prep:'', obs:'Ineficaz em BAV infra-hissiano (Mobitz II, BAVT com QRS largo) e no coração transplantado — ir direto ao marca-passo/dopamina/adrenalina. Dose < 0,5 mg pode causar bradicardia paradoxal.' },
    { sit:'Intoxicação por organofosforado / carbamato', dose:'1–3 mg; dobrar a cada 3–5 min até secar as secreções (atropinização)', via:'EV', prep:'Pode chegar a dezenas de mg. Manutenção: 10–20% da dose total de atropinização por hora em BIC.', obs:'Meta é secreção brônquica seca e FC > 80 — não a midríase. Associar pralidoxima.' },
    { sit:'Pré-medicação (sialorreia com cetamina, bradicardia por succinilcolina em criança)', dose:'0,01–0,02 mg/kg (mín. 0,1 mg)', via:'EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Glaucoma de ângulo fechado (relativa), taquiarritmia, isquemia miocárdica (a taquicardia piora).',
  cuidado:['Retenção urinária, íleo, delirium no idoso.', 'Na PCR: não faz parte do protocolo.'] },

{ slug:'lidocaina', nome:'Lidocaína', classe:'Antiarrítmico classe IB / anestésico local',
  apres:['Ampola 2% sem vasoconstritor 20 mL (20 mg/mL)', 'Ampola 1% 20 mL (10 mg/mL)', 'Frasco 2% com epinefrina 1:200.000', 'Geleia 2%; spray 10%'],
  dil:'Antiarrítmico: bolus puro (2%). Infusão: 1 g (50 mL de 2%) + SG 5% 200 mL = 4 mg/mL.',
  ind:[
    { sit:'FV/TV sem pulso refratária (alternativa à amiodarona)', dose:'1–1,5 mg/kg; repetir 0,5–0,75 mg/kg a cada 5–10 min, máximo 3 mg/kg', via:'EV/IO', prep:'70 kg: 5 mL de 2% (100 mg).', obs:'' },
    { sit:'TV monomórfica estável (2ª linha)', dose:'1–1,5 mg/kg em bolus; manutenção 1–4 mg/min', via:'EV', prep:'4 mg/mL: 1 mg/min = 15 mL/h; 4 mg/min = 60 mL/h.', obs:'' },
    { sit:'Anestesia local (infiltração, sutura, bloqueio)', dose:'Sem vasoconstritor: máx. 4,5 mg/kg (≈ 300 mg = 15 mL de 2%); com vasoconstritor: máx. 7 mg/kg (500 mg)', via:'SC/infiltração', prep:'Alcalinizar 9 mL de lidocaína + 1 mL de bicarbonato 8,4% para doer menos.', obs:'Com vasoconstritor: evitar em extremidades com circulação terminal comprometida e em uso de IMAO.' },
    { sit:'Pré-tratamento da IOT (hipertensão intracraniana, broncoespasmo)', dose:'1,5 mg/kg 3 min antes', via:'EV', prep:'', obs:'Benefício incerto.' },
    { sit:'Intraóssea (dor da infusão IO em paciente acordado)', dose:'20–40 mg (1–2 mL de 2%) lento, aguardar 1 min', via:'IO', prep:'', obs:'' }
  ],
  renal:'Sem ajuste; reduzir infusão em ICC, choque e idoso.', hep:'Reduzir 50% na hepatopatia (metabolismo hepático).', contra:'BAV avançado sem marca-passo, alergia a amida (rara), síndrome de Wolff-Parkinson-White (relativa).',
  cuidado:['Intoxicação: parestesia perioral, zumbido, convulsão, arritmia → parar, benzodiazepínico, emulsão lipídica 20% 1,5 mL/kg.', 'Infusão > 24 h acumula — reduzir.'] },

/* ===================== SEDAÇÃO, ANALGESIA E BLOQUEIO ===================== */
{ slug:'fentanil', nome:'Fentanil', classe:'Opioide sintético potente (100× a morfina)',
  apres:['Ampola 50 mcg/mL — 2, 5 e 10 mL'],
  dil:'Bolus: puro (1 mL = 50 mcg). Infusão: 1.000 mcg (20 mL) + SF 0,9% 80 mL = 10 mcg/mL. Ou 50 mL puros em seringa (50 mcg/mL).',
  ind:[
    { sit:'Sequência rápida de intubação (pré-tratamento opcional: PIC alta, SCA, dissecção)', dose:'3 mcg/kg em 30–60 s, 3 min antes', via:'EV', prep:'70 kg: 4,2 mL.', obs:'Não usar no choque. Rigidez torácica em bolus rápido de dose alta.' },
    { sit:'Analgesia no PS (dor intensa, trauma)', dose:'0,5–1 mcg/kg (25–50 mcg) a cada 5–10 min até controle', via:'EV lento', prep:'', obs:'Início em 2–3 min, dura 30–60 min. Titular.' },
    { sit:'Sedação contínua em VM', dose:'0,5–3 mcg/kg/h (25–200 mcg/h)', via:'EV BIC', prep:'10 mcg/mL: 50 mcg/h = 5 mL/h.', obs:'Associar midazolam/propofol; acumula após 24–48 h.' },
    { sit:'Sedação para procedimento', dose:'0,5–1 mcg/kg', via:'EV', prep:'', obs:'Com midazolam ou cetamina.' }
  ],
  renal:'Sem ajuste relevante (preferido ao invés da morfina na IRA).', hep:'Reduzir na hepatopatia grave.', contra:'Depressão respiratória sem suporte, IMAO nos últimos 14 dias.',
  cuidado:['Antídoto: naloxona.', 'Rigidez de tórax: bloqueador neuromuscular + ventilar.', 'Bradicardia.'] },

{ slug:'morfina', nome:'Morfina', classe:'Opioide agonista mu',
  apres:['Ampola 10 mg/mL — 1 mL', 'Ampola 1 mg/mL — 2 mL (uso pediátrico/raqui)', 'Comprimido 10 e 30 mg; solução oral 10 mg/mL'],
  dil:'1 ampola (10 mg) + SF 0,9% 9 mL = 1 mg/mL. Bolus de 2–3 mL.',
  ind:[
    { sit:'Dor intensa (trauma, cólica refratária, oncológica)', dose:'2–4 mg a cada 5–15 min até alívio (0,05–0,1 mg/kg)', via:'EV', prep:'', obs:'Idoso: começar com 1–2 mg. Pico em 15–30 min.' },
    { sit:'SCA com dor refratária a nitrato', dose:'2–4 mg; repetir 2 mg a cada 5–15 min', via:'EV', prep:'', obs:'Reduz absorção de antiplaquetário oral; usar o mínimo.' },
    { sit:'Edema agudo de pulmão (ansiedade e dispneia)', dose:'2–4 mg', via:'EV', prep:'', obs:'Uso restrito — associação com mortalidade; preferir VNI e nitrato.' },
    { sit:'Dispneia terminal / cuidados paliativos', dose:'2–5 mg SC ou VO a cada 4 h, + resgates', via:'SC/VO', prep:'', obs:'Titular pela dispneia, não pela SpO2.' }
  ],
  renal:'ClCr < 30: metabólito ativo (M6G) acumula → sedação prolongada; reduzir 50% e espaçar; preferir fentanil ou metadona.', hep:'Reduzir na cirrose.',
  contra:'Depressão respiratória, hipotensão grave, íleo, pancreatite/cólica biliar (relativa — espasmo do esfíncter de Oddi).',
  cuidado:['Antídoto: naloxona 0,04–0,4 mg EV.', 'Náusea (associar antiemético), prurido, retenção urinária, hipotensão por histamina.', 'Não associar com benzodiazepínico sem monitorização.'] },

{ slug:'cetamina', nome:'Cetamina', classe:'Anestésico dissociativo (antagonista NMDA)',
  apres:['Frasco 50 mg/mL — 10 mL (500 mg)', 'Frasco 10 mg/mL — 20 mL (esketamina/S-cetamina em algumas marcas)'],
  dil:'Indução: puro (50 mg/mL) ou 1 mL + 9 mL de SF = 5 mg/mL. Analgesia/infusão: 500 mg + SF 0,9% 490 mL = 1 mg/mL.',
  ind:[
    { sit:'Sequência rápida de intubação (broncoespasmo, choque séptico)', dose:'1–2 mg/kg (metade no choque)', via:'EV', prep:'Em bolus. 70 kg: 1,4–2,8 mL do frasco de 50 mg/mL.', obs:'Mantém a PA e broncodilata. No choque cardiogênico, prefira etomidato.' },
    { sit:'Sequência atrasada (agitado que não tolera a pré-oxigenação)', dose:'1 mg/kg, ou 10–25 mg repetidos até dissociar', via:'EV', prep:'Diluir 1 mL + 9 mL de SF (5 mg/mL) para as alíquotas.', obs:'Pode causar apneia, obstrução ou hipotensão: pronto para assumir a via aérea.' },
    { sit:'Sedação para procedimento (redução de fratura, curativo grande)', dose:'0,5–1 mg/kg EV, ou 4–5 mg/kg IM', via:'EV / IM', prep:'Efeito EV em 1 min, dura 10–15 min. IM em 3–5 min, dura 20–30 min.', obs:'Associar midazolam 0,03 mg/kg ou propofol (ketofol) para reduzir emergência dissociativa.' },
    { sit:'Analgesia subdissociativa (dor intensa, opioide-poupador)', dose:'0,1–0,3 mg/kg em 10–15 min (não em bolus), depois 0,1–0,3 mg/kg/h', via:'EV', prep:'1 mg/mL: 70 kg a 0,2 mg/kg/h = 14 mL/h.', obs:'Bolus rápido dá disforia e nistagmo.' },
    { sit:'Estado de mal refratário / agitação extrema (com contenção e via aérea garantida)', dose:'1–2 mg/kg, depois 1–5 mg/kg/h', via:'EV', prep:'', obs:'Agitação: 4–5 mg/kg IM — monitorizar; laringoespasmo e hipersalivação.' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir na hepatopatia.', contra:'Psicose ativa, hipertensão grave não controlada, dissecção/aneurisma, isquemia miocárdica aguda (relativas). Hipertensão intracraniana NÃO é mais contraindicação absoluta.',
  cuidado:['Hipersalivação: atropina 0,5 mg ou glicopirrolato.', 'Laringoespasmo (raro): ventilar com pressão positiva, succinilcolina se persistir.', 'Emergência dissociativa: ambiente calmo, benzodiazepínico.', 'Nistagmo e taquicardia são esperados.'] },

{ slug:'etomidato', nome:'Etomidato', classe:'Hipnótico não barbitúrico (indução)',
  apres:['Ampola 20 mg/10 mL (2 mg/mL)'],
  dil:'Puro.',
  ind:[
    { sit:'Sequência rápida de intubação (choque, cardiopata, idoso, PIC alta, SCA, dissecção)', dose:'0,3 mg/kg (metade no choque cardiogênico e no idoso frágil)', via:'EV', prep:'70 kg: 10 mL (20 mg) em bolus.', obs:'O indutor que menos derruba a pressão. Efeito em 30–60 s, dura 5–10 min. Dose única suprime o cortisol: na sepse, considerar corticoide.' }
  ],
  renal:'Sem ajuste.', contra:'Sepse/choque séptico (relativa — supressão adrenal por 24–48 h com dose única; preferir cetamina).',
  cuidado:['Mioclonias na indução (não é convulsão).', 'Dor à injeção.', 'Sem analgesia — associar opioide.', 'Não usar em infusão contínua (insuficiência adrenal).'] },

{ slug:'propofol', nome:'Propofol', classe:'Hipnótico (GABA-A) — indução e sedação contínua',
  apres:['Frasco/ampola 1% (10 mg/mL) — 20 mL, 50 mL, 100 mL', 'Frasco 2% (20 mg/mL) — 50 mL'],
  dil:'Puro (1%). Trocar equipo e frasco a cada 12 h (meio de cultura).',
  ind:[
    { sit:'Sequência rápida de intubação (estável, broncoespasmo, estado de mal)', dose:'1,5–3 mg/kg (0,5–1 mg/kg no idoso)', via:'EV', prep:'70 kg: 10–21 mL de 1%.', obs:'Hipotensão dose-dependente — evitar no instável.' },
    { sit:'Sedação contínua em VM', dose:'5–50 mcg/kg/min (0,3–3 mg/kg/h)', via:'EV BIC', prep:'1%: 70 kg a 1 mg/kg/h = 7 mL/h. Máximo 4 mg/kg/h.', obs:'Síndrome de infusão do propofol: > 4 mg/kg/h por > 48 h → acidose, rabdomiólise, bradicardia.' },
    { sit:'Sedação para procedimento (cardioversão, endoscopia)', dose:'0,5–1 mg/kg, depois 0,25–0,5 mg/kg a cada 1–2 min', via:'EV', prep:'', obs:'Apneia frequente: material de via aérea pronto.' },
    { sit:'Estado de mal refratário', dose:'1–2 mg/kg bolus, depois 2–5 mg/kg/h', via:'EV', prep:'', obs:'Paciente intubado.' }
  ],
  renal:'Sem ajuste.', contra:'Alergia a ovo/soja (controverso), hipotensão não corrigida, hipertrigliceridemia grave.',
  cuidado:['Hipotensão dose-dependente — reduzir no idoso e hipovolêmico.', 'Dor à injeção: lidocaína 20–40 mg antes.', 'Triglicerídeos a cada 48–72 h em infusão.', 'Sem analgesia própria.'] },

{ slug:'midazolam', nome:'Midazolam', classe:'Benzodiazepínico de ação curta',
  apres:['Ampola 15 mg/3 mL (5 mg/mL)', 'Ampola 5 mg/5 mL (1 mg/mL)', 'Ampola 50 mg/10 mL (5 mg/mL)', 'Solução oral 2 mg/mL'],
  dil:'Bolus: 1 ampola de 15 mg + SF 12 mL = 1 mg/mL. Infusão: 150 mg (30 mL de 5 mg/mL) + SF 0,9% 120 mL = 1 mg/mL.',
  ind:[
    { sit:'Crise convulsiva / estado de mal (1ª linha)', dose:'10 mg IM (> 40 kg) ou 5 mg IM (13–40 kg); EV 0,1–0,2 mg/kg (5–10 mg)', via:'IM / EV', prep:'IM é tão eficaz quanto EV e mais rápido de conseguir. Intranasal/bucal 0,2 mg/kg (máx. 10 mg).', obs:'Repetir uma vez em 5 min. Depois fenitoína/valproato/levetiracetam.' },
    { sit:'Sequência rápida de intubação (indutor de exceção)', dose:'0,2–0,3 mg/kg', via:'EV', prep:'', obs:'Início lento (2–3 min), hipotensão e costuma ser subdosado — etomidato ou cetamina são melhores.' },
    { sit:'Sedação para procedimento', dose:'0,5–2 mg a cada 2–3 min (0,02–0,05 mg/kg), máx. 5 mg', via:'EV', prep:'Idoso: 0,5 mg por vez.', obs:'Com fentanil: reduzir ambos.' },
    { sit:'Sedação contínua em VM', dose:'0,02–0,1 mg/kg/h (1–7 mg/h)', via:'EV BIC', prep:'1 mg/mL: 3 mg/h = 3 mL/h.', obs:'Acumula (delirium, VM prolongada) — preferir propofol/dexmedetomidina quando possível.' },
    { sit:'Agitação psicomotora (com haloperidol)', dose:'5 mg IM (2,5 mg no idoso)', via:'IM', prep:'', obs:'' }
  ],
  renal:'ClCr < 10: metabólito ativo acumula → reduzir 50%.', hep:'Reduzir na cirrose.', contra:'Miastenia gravis, glaucoma agudo, depressão respiratória sem suporte.',
  cuidado:['Antídoto: flumazenil 0,2 mg EV (não usar em usuário crônico ou intoxicação mista com tricíclico — convulsão).', 'Depressão respiratória potencializada por opioide e álcool.', 'Idoso: metade da dose.'] },

{ slug:'dexmedetomidina', nome:'Dexmedetomidina', classe:'Agonista alfa-2 central (sedação cooperativa)',
  apres:['Ampola 100 mcg/mL — 2 mL (200 mcg)'],
  dil:'1 ampola (200 mcg) + SF 0,9% 48 mL = 50 mL a 4 mcg/mL.',
  ind:[
    { sit:'Sedação leve em VM / desmame / delirium hiperativo em UTI', dose:'0,2–1,4 mcg/kg/h, sem bolus', via:'EV BIC', prep:'4 mcg/mL: 70 kg a 0,5 mcg/kg/h = 8,75 mL/h.', obs:'Não deprime a respiração. Paciente despertável. Ataque de 1 mcg/kg em 10 min é opcional e causa bradicardia/hipotensão — evitar.' },
    { sit:'Ansiedade que impede a VNI', dose:'0,2–0,7 mcg/kg/h, sem bolus', via:'EV BIC', prep:'4 mcg/mL: 70 kg a 0,4 mcg/kg/h = 7 mL/h.', obs:'Só depois de explicar, ajustar a máscara e os parâmetros. Não deprime a respiração; vigiar bradicardia e hipotensão. Evitar benzodiazepínico + opioide.' },
    { sit:'Abstinência alcoólica refratária (adjuvante ao benzodiazepínico)', dose:'0,2–0,7 mcg/kg/h', via:'EV BIC', prep:'', obs:'Controla a hiperatividade autonômica; não previne convulsão.' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir na hepatopatia.', contra:'BAV avançado, bradicardia < 50, hipovolemia.',
  cuidado:['Bradicardia e hipotensão (principalmente com bolus).', 'Hipertensão transitória no início.', 'Não serve para sedação profunda nem para intubar.'] },

{ slug:'succinilcolina', nome:'Succinilcolina', classe:'Bloqueador neuromuscular despolarizante',
  apres:['Frasco 100 mg (pó) — diluir em 10 mL (10 mg/mL)', 'Frasco 500 mg'],
  dil:'100 mg + AD ou SF 10 mL = 10 mg/mL. Geladeira.',
  ind:[
    { sit:'Sequência rápida de intubação', dose:'1,5 mg/kg (2 mg/kg no choque), peso real', via:'EV', prep:'70 kg: 10,5 mL (105 mg). Início em 45 s, dura 6–10 min.', obs:'Contraindicada: hipertermia maligna, doença neuromuscular, AVC/queimadura/lesão medular > 72 h, rabdomiólise, hipercalemia com alteração no ECG. IM 3–4 mg/kg se sem acesso.' }
  ],
  renal:'Sem ajuste, mas hipercalemia é o risco: evitar se K > 5,5.', contra:'Hipercalemia ou risco (queimadura > 24–72 h, lesão medular/AVC > 72 h até 6 meses, doença neuromuscular, imobilização prolongada, rabdomiólise, miopatia), hipertermia maligna (pessoal/familiar), glaucoma de ângulo aberto agudo (relativa).',
  cuidado:['Hipertermia maligna: dantroleno.', 'Bradicardia em 2ª dose e em criança: atropina.', 'Fasciculações e mialgia.', 'Aumenta pressão intraocular e intragástrica.'] },

{ slug:'rocuronio', nome:'Rocurônio', classe:'Bloqueador neuromuscular não despolarizante (aminoesteroide)',
  apres:['Frasco 50 mg/5 mL (10 mg/mL)'],
  dil:'Puro. Geladeira (ou até 60 dias em temperatura ambiente).',
  ind:[
    { sit:'Sequência rápida de intubação', dose:'1,5 mg/kg', via:'EV', prep:'70 kg: 10,5 mL. Início 45–60 s, dura 45–70 min.', obs:'Sem as contraindicações da succinilcolina. Sedação contínua logo depois do tubo. Reversão com sugamadex 16 mg/kg.' },
    { sit:'Bloqueio de manutenção em VM (SDRA grave, PIC)', dose:'0,6 mg/kg bolus; 0,3–0,6 mg/kg/h', via:'EV', prep:'', obs:'Sempre com sedação profunda comprovada.' }
  ],
  renal:'Duração prolongada na IRA; usar TOF.', hep:'Prolonga na cirrose.', contra:'Alergia prévia (anafilaxia mais comum entre os bloqueadores).',
  cuidado:['Paciente paralisado e acordado é o pior desfecho: sedar antes.', 'Reversão: sugamadex 2 mg/kg (bloqueio moderado) a 16 mg/kg (imediata).'] },

{ slug:'sugamadex', nome:'Sugamadex', classe:'Reversor seletivo de rocurônio/vecurônio',
  apres:['Frasco 200 mg/2 mL (100 mg/mL)', 'Frasco 500 mg/5 mL'],
  dil:'Puro.',
  ind:[
    { sit:'Reversão imediata (não intubo, não oxigeno após rocurônio 1,5 mg/kg)', dose:'16 mg/kg', via:'EV', prep:'70 kg: 1.120 mg = 11,2 mL (5–6 frascos de 200 mg).', obs:'Reverte em 1,5–3 min — não atrase a cricotireoidostomia esperando. Custo alto: confirmar disponibilidade antes de escolher rocurônio.' },
    { sit:'Reversão de bloqueio moderado (TOF 2)', dose:'2 mg/kg', via:'EV', prep:'', obs:'Profundo (TOF 0, PTC 1–2): 4 mg/kg.' }
  ],
  renal:'ClCr < 30: não recomendado (o complexo é excretado pelo rim).', contra:'Nenhuma absoluta.',
  cuidado:['Anafilaxia (rara).', 'Reduz eficácia de anticoncepcional hormonal por 7 dias.', 'Não reverte succinilcolina, cisatracúrio ou atracúrio.'] },

{ slug:'neostigmina', nome:'Neostigmina', classe:'Anticolinesterásico (reversor de bloqueio não despolarizante)',
  apres:['Ampola 0,5 mg/mL — 1 mL'],
  dil:'Puro. Sempre com atropina na mesma seringa ou antes.',
  ind:[
    { sit:'Reversão de bloqueio neuromuscular não despolarizante (TOF ≥ 2)', dose:'0,04–0,07 mg/kg (máx. 5 mg) + atropina 0,01–0,02 mg/kg', via:'EV', prep:'70 kg: 3–5 mg neostigmina + 1 mg atropina.', obs:'Não reverte bloqueio profundo. Pico em 7–10 min.' },
    { sit:'Pseudo-obstrução colônica aguda (Ogilvie)', dose:'2 mg EV em 3–5 min, com monitor', via:'EV', prep:'', obs:'Atropina à mão; contraindicada se obstrução mecânica.' },
    { sit:'Crise miastênica (diagnóstico/ponte)', dose:'0,5–1 mg', via:'EV/IM/SC', prep:'', obs:'' }
  ],
  renal:'ClCr < 50: reduzir 50%.', contra:'Obstrução mecânica intestinal ou urinária, peritonite, asma grave (relativa), bradicardia.',
  cuidado:['Bradicardia, broncoespasmo, sialorreia — atropina antes.', 'Recurarização se o bloqueio era profundo.'] },

{ slug:'cetorolaco', nome:'Cetorolaco', classe:'AINE parenteral',
  apres:['Ampola 30 mg/mL — 1 mL', 'Comprimido sublingual 10 mg'],
  dil:'Puro ou em 100 mL de SF em 15 min.',
  ind:[
    { sit:'Cólica renal / dor musculoesquelética aguda', dose:'30 mg EV ou IM (15 mg se > 65 anos ou < 50 kg)', via:'EV / IM', prep:'De 6/6 h se necessário, máximo 5 dias.', obs:'Analgesia comparável ao opioide na cólica renal. 10 mg SL de 6/6 h como alternativa.' },
    { sit:'Enxaqueca (com antiemético)', dose:'30 mg', via:'EV/IM', prep:'', obs:'' }
  ],
  renal:'ClCr < 30: contraindicado. ClCr 30–60 ou idoso: 15 mg. Desidratado ou em uso de IECA/diurético: evitar (IRA).', contra:'Insuficiência renal, úlcera ativa/sangramento, insuficiência cardíaca descompensada, cirurgia com sangramento, gestação (3º trimestre), asma sensível a AINE.',
  cuidado:['Nunca mais de 5 dias.', 'Não associar com outro AINE.', 'Sangramento digestivo — associar IBP se risco.'] },

{ slug:'dipirona', nome:'Dipirona', classe:'Analgésico e antitérmico (pirazolona)',
  apres:['Ampola 500 mg/mL — 2 mL (1 g)', 'Ampola 1 g/2 mL', 'Comprimido 500 mg e 1 g; gotas 500 mg/mL; solução 50 mg/mL'],
  dil:'EV: diluir em 100 mL de SF ou SG e correr em 15 min — em bolus causa hipotensão.',
  ind:[
    { sit:'Dor aguda / febre', dose:'1 g (até 2 g) a cada 6 h, máximo 4–5 g/dia', via:'EV / IM / VO', prep:'', obs:'VO: 500 mg–1 g de 6/6 h. Gotas: 20–40 gotas.' },
    { sit:'Cólica renal (associada a AINE)', dose:'2 g EV em 100 mL de SF', via:'EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste em curto prazo.', contra:'Alergia a pirazolonas, agranulocitose prévia, porfiria, deficiência de G6PD, 3º trimestre e último mês da gestação.',
  cuidado:['Hipotensão na infusão rápida.', 'Agranulocitose (rara) — febre com odinofagia em uso prolongado: hemograma.', 'Reação anafilactoide.'] },

/* ===================== NEUROLOGIA ===================== */
{ slug:'fenitoina', nome:'Fenitoína', classe:'Anticonvulsivante (bloqueador de sódio)',
  apres:['Ampola 250 mg/5 mL (50 mg/mL)', 'Comprimido 100 mg; suspensão 20 mg/mL'],
  dil:'SÓ em SF 0,9% (precipita em glicosado): 1.000 mg (4 ampolas) + SF 80 mL = 100 mL a 10 mg/mL, com filtro de linha se disponível, em acesso calibroso exclusivo. Velocidade máxima 50 mg/min (idoso/cardiopata: 20 mg/min).',
  ind:[
    { sit:'Estado de mal epiléptico (2ª linha, após benzodiazepínico)', dose:'20 mg/kg (máx. 1.500 mg)', via:'EV', prep:'70 kg: 1.400 mg em 30 min (≈ 47 mg/min). Monitor e PA a cada 5 min.', obs:'Se persistir: mais 5–10 mg/kg. Alternativas: valproato 40 mg/kg, levetiracetam 60 mg/kg.' },
    { sit:'Manutenção', dose:'100 mg de 8/8 h (5–7 mg/kg/dia)', via:'EV/VO', prep:'', obs:'Nível 10–20 mcg/mL; corrigir pela albumina.' }
  ],
  renal:'Hipoalbuminemia/IRC: fração livre sobe — nível corrigido. Sem ajuste de dose de ataque.', hep:'Reduzir manutenção na hepatopatia.', contra:'BAV 2º/3º, bradicardia sinusal, síndrome de Stokes-Adams, hipersensibilidade (SJS).',
  cuidado:['Hipotensão e arritmia se infundida rápido (propilenoglicol).', 'Extravasamento: síndrome da luva roxa — nunca em veia de mão ou pé.', 'Não trata crise por abstinência alcoólica nem por tricíclico.', 'Indutor enzimático: reduz varfarina, contraceptivo, anticoagulante direto.'] },

{ slug:'levetiracetam', nome:'Levetiracetam', classe:'Anticonvulsivante (SV2A)',
  apres:['Frasco 500 mg/5 mL (100 mg/mL)', 'Comprimido 250/500/750/1.000 mg; solução oral 100 mg/mL'],
  dil:'Diluir em 100 mL de SF ou SG, correr em 15 min.',
  ind:[
    { sit:'Estado de mal epiléptico (2ª linha — alternativa à fenitoína)', dose:'60 mg/kg (máx. 4.500 mg) em 10–15 min', via:'EV', prep:'70 kg: 4.200 mg (42 mL) + SF 100 mL.', obs:'Sem interação, sem hipotensão, sem arritmia — preferível em cardiopata, gestante e paciente polimedicado.' },
    { sit:'Manutenção / profilaxia (TCE, neurocirurgia)', dose:'500–1.500 mg de 12/12 h', via:'EV/VO', prep:'Mesma dose EV e VO.', obs:'' }
  ],
  renal:'ClCr 50–80: 500–1.000 mg 12/12 h · 30–50: 250–750 mg 12/12 h · < 30: 250–500 mg 12/12 h · diálise: 500–1.000 mg 1x/dia + 250–500 mg após a sessão. Dose de ataque sem ajuste.', contra:'Hipersensibilidade.',
  cuidado:['Irritabilidade, agressividade, sonolência.', 'Seguro na gestação (relativamente).'] },

{ slug:'acido-valproico', nome:'Ácido valproico', classe:'Anticonvulsivante de amplo espectro',
  apres:['Frasco 500 mg/5 mL (100 mg/mL) — valproato de sódio EV', 'Comprimido 250/500 mg; xarope 50 mg/mL'],
  dil:'Diluir em 50–100 mL de SF ou SG.',
  ind:[
    { sit:'Estado de mal epiléptico (2ª linha)', dose:'40 mg/kg (máx. 3.000 mg) em 10 min', via:'EV', prep:'70 kg: 2.800 mg (28 mL).', obs:'Boa opção em epilepsia generalizada conhecida. Depois 10–15 mg/kg/dia divididos.' }
  ],
  renal:'Sem ajuste; nível livre sobe na hipoalbuminemia.', hep:'Contraindicado em hepatopatia; hepatotoxicidade.',
  contra:'Hepatopatia, distúrbio do ciclo da ureia, pancreatite, gestação (teratogênico — evitar se houver alternativa), mitocondriopatia.',
  cuidado:['Hiperamonemia com encefalopatia (mesmo com fígado normal).', 'Trombocitopenia.', 'Interação: aumenta fenobarbital e lamotrigina; meropeném derruba o nível de valproato em 24 h.'] },

{ slug:'fenobarbital', nome:'Fenobarbital', classe:'Barbitúrico anticonvulsivante',
  apres:['Ampola 100 mg/mL — 2 mL (200 mg)', 'Comprimido 50 e 100 mg; gotas 40 mg/mL'],
  dil:'Diluir em 10–20 mL de SF; velocidade máxima 50–100 mg/min.',
  ind:[
    { sit:'Estado de mal refratário / 3ª linha (ou 1ª em neonato)', dose:'15–20 mg/kg', via:'EV', prep:'70 kg: 1.000–1.400 mg em 15–20 min.', obs:'Depressão respiratória e hipotensão — via aérea preparada.' },
    { sit:'Manutenção', dose:'1–3 mg/kg/dia (100–200 mg à noite)', via:'VO/IM', prep:'', obs:'Nível 15–40 mcg/mL.' }
  ],
  renal:'Reduzir 25–50% na IRC avançada.', hep:'Reduzir na cirrose.', contra:'Porfiria, depressão respiratória sem suporte.',
  cuidado:['Sedação prolongada (meia-vida 3–5 dias).', 'Indutor enzimático potente.'] },

{ slug:'manitol', nome:'Manitol', classe:'Diurético osmótico',
  apres:['Frasco 20% — 250 mL (50 g)'],
  dil:'Puro, em bolus por acesso calibroso, com filtro se cristalizado (aquecer para dissolver).',
  ind:[
    { sit:'Hipertensão intracraniana / herniação iminente (TCE, tumor, AVC extenso)', dose:'0,5–1 g/kg (175–350 mL de 20%) em 15–20 min; repetir 0,25–0,5 g/kg a cada 4–6 h se osmolaridade < 320', via:'EV', prep:'70 kg × 1 g/kg = 70 g = 350 mL.', obs:'Ponte para a neurocirurgia. Alternativa: salina hipertônica 3% 250 mL ou 20% 20–30 mL (preferível se hipotenso).' }
  ],
  renal:'Contraindicado em anúria/IRA estabelecida; monitorar osmolaridade (< 320) e função renal — nefrotoxicidade osmótica.', contra:'Anúria, EAP/IC descompensada, hipovolemia grave, sangramento intracraniano ativo (relativa), osmolaridade > 320.',
  cuidado:['Diurese osmótica → hipovolemia e hipernatremia: repor volume e controlar Na.', 'Rebote de PIC ao suspender.', 'Sonda vesical.'] },

{ slug:'nimodipina', nome:'Nimodipina', classe:'Bloqueador de canal de cálcio (neuroproteção no vasoespasmo)',
  apres:['Comprimido 30 mg', 'Frasco EV 10 mg/50 mL (0,2 mg/mL) — pouco disponível'],
  dil:'VO ou por sonda.',
  ind:[
    { sit:'Hemorragia subaracnóidea aneurismática (prevenção de isquemia tardia)', dose:'60 mg de 4/4 h por 21 dias', via:'VO/SNE', prep:'Se hipotensão: 30 mg de 2/2 h.', obs:'Começar em até 96 h. Não é para baixar PA.' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir 50% na cirrose.', contra:'Hipotensão grave.', cuidado:['Hipotensão — manter PAS conforme meta neurocirúrgica.'] },

/* ===================== ANTÍDOTOS E INTOXICAÇÕES ===================== */
{ slug:'naloxona', nome:'Naloxona', classe:'Antagonista opioide',
  apres:['Ampola 0,4 mg/mL — 1 mL'],
  dil:'1 ampola (0,4 mg) + SF 9 mL = 0,04 mg/mL para titular. Infusão: 2 mg (5 ampolas) + SF 0,9% 500 mL = 4 mcg/mL.',
  ind:[
    { sit:'Depressão respiratória por opioide (FR < 10, miose)', dose:'0,04–0,4 mg EV a cada 2–3 min até FR > 12 (máx. 2 mg; até 10 mg se suspeita forte)', via:'EV / IM / IN', prep:'Sem acesso: 0,4–2 mg IM ou intranasal.', obs:'Objetivo é ventilar, não acordar — dose alta em dependente precipita abstinência violenta.' },
    { sit:'PCR associada a opioide', dose:'0,4–2 mg', via:'EV/IO/IM/IN', prep:'', obs:'Não atrasa compressão, desfibrilação nem via aérea.' },
    { sit:'Recorrência (opioide de ação longa: metadona, fentanil transdérmico)', dose:'2/3 da dose que reverteu, por hora, em BIC', via:'EV BIC', prep:'4 mcg/mL: para 0,4 mg/h = 100 mL/h.', obs:'Meia-vida da naloxona (30–60 min) é menor que a da maioria dos opioides — observar 4–6 h após.' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma na depressão respiratória.',
  cuidado:['Abstinência aguda: agitação, vômito, EAP não cardiogênico (raro).', 'Não reverte clonidina, benzodiazepínico ou tramadol de forma confiável.'] },

{ slug:'flumazenil', nome:'Flumazenil', classe:'Antagonista de benzodiazepínico',
  apres:['Ampola 0,5 mg/5 mL (0,1 mg/mL)'],
  dil:'Puro.',
  ind:[
    { sit:'Sedação excessiva por benzodiazepínico (procedimento, dose única conhecida)', dose:'0,2 mg em 30 s; repetir 0,1–0,2 mg a cada 1 min até 1 mg (máx. 3 mg/h)', via:'EV', prep:'', obs:'Dura 30–60 min — ressedação; observar.' }
  ],
  renal:'Sem ajuste.', contra:'Usuário crônico de benzodiazepínico (convulsão por abstinência), intoxicação mista com tricíclico/pró-convulsivante, epilepsia em tratamento, hipertensão intracraniana.',
  cuidado:['Na intoxicação exógena indeterminada é mais seguro ventilar e esperar do que reverter.', 'Convulsão → benzodiazepínico (paradoxal, mas necessário).'] },

{ slug:'n-acetilcisteina', nome:'N-acetilcisteína', classe:'Antídoto do paracetamol (precursor de glutationa)',
  apres:['Ampola 300 mg/3 mL (100 mg/mL) — EV', 'Sachê/comprimido efervescente 200 e 600 mg — VO'],
  dil:'Protocolo EV de 21 h (3 bolsas): 150 mg/kg + SG 5% 200 mL em 1 h → 50 mg/kg + SG 500 mL em 4 h → 100 mg/kg + SG 1.000 mL em 16 h.',
  ind:[
    { sit:'Intoxicação por paracetamol (nível acima da linha de Rumack-Matthew, ou > 150 mg/kg ingeridos com nível indisponível, ou apresentação tardia com lesão hepática)', dose:'150 mg/kg em 1 h, 50 mg/kg em 4 h, 100 mg/kg em 16 h (total 300 mg/kg)', via:'EV', prep:'70 kg: 10,5 g (35 ampolas) → 3,5 g → 7 g.', obs:'Iniciar até 8 h da ingestão sem esperar o nível se o tempo estiver passando. Prolongar a 3ª bolsa se transaminases subindo ou INR > 2.' },
    { sit:'Alternativa oral', dose:'140 mg/kg, depois 70 mg/kg a cada 4 h por 17 doses', via:'VO', prep:'Diluir em suco (gosto ruim); antiemético.', obs:'' },
    { sit:'Hepatite fulminante não-paracetamol (adjuvante)', dose:'Mesmo protocolo EV', via:'EV', prep:'', obs:'Benefício em graus baixos de encefalopatia.' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma absoluta.',
  cuidado:['Reação anafilactoide na 1ª bolsa (rubor, urticária, broncoespasmo): pausar 30–60 min, anti-histamínico, retomar mais lento.', 'Hiponatremia por volume de SG em criança/baixo peso: ajustar diluente.'] },

{ slug:'carvao-ativado', nome:'Carvão ativado', classe:'Adsorvente gastrointestinal',
  apres:['Pó 25 g e 50 g; suspensão pronta'],
  dil:'1 g/kg (50 g) em 200–300 mL de água ou SF, por boca ou SNG. Sorbitol não é rotina.',
  ind:[
    { sit:'Ingestão de tóxico adsorvível há < 1–2 h (via aérea protegida)', dose:'1 g/kg (adulto 50 g), dose única', via:'VO/SNG', prep:'', obs:'Não adsorve: álcool, metanol, etilenoglicol, lítio, ferro, hidrocarboneto, corrosivo, potássio.' },
    { sit:'Doses múltiplas (carbamazepina, fenobarbital, teofilina, dapsona, quinina)', dose:'25 g a cada 2–4 h', via:'VO/SNG', prep:'', obs:'Enquanto houver íleo? Não — suspender se ausência de ruídos.' }
  ],
  renal:'Sem ajuste.', contra:'Rebaixamento sem via aérea protegida (aspiração é a complicação que mata), corrosivo, hidrocarboneto, obstrução/íleo.',
  cuidado:['Aspiração de carvão = pneumonite grave.', 'Vômito: antiemético antes.'] },

{ slug:'pralidoxima', nome:'Pralidoxima', classe:'Reativador de colinesterase',
  apres:['Frasco 200 mg (pó) ou 500 mg/20 mL (Contrathion)'],
  dil:'1–2 g + SF 0,9% 100 mL em 15–30 min.',
  ind:[
    { sit:'Intoxicação por organofosforado (junto com atropina, nas primeiras 24–48 h)', dose:'1–2 g (30 mg/kg) em 30 min; depois 8–10 mg/kg/h ou repetir 1 g em 1 h e a cada 8–12 h', via:'EV', prep:'', obs:'Reverte fraqueza muscular e fasciculação (nicotínico). Inútil no carbamato após 24 h e possivelmente prejudicial no carbamato (controverso).' }
  ],
  renal:'ClCr < 30: reduzir 50% (excreção renal).', contra:'Nenhuma absoluta no organofosforado.',
  cuidado:['Infusão rápida: laringoespasmo, rigidez, taquicardia, hipertensão.', 'Sempre com atropina — sozinha não trata o quadro muscarínico.'] },

{ slug:'hidroxocobalamina', nome:'Hidroxocobalamina', classe:'Antídoto do cianeto (vitamina B12a)',
  apres:['Kit 5 g (2 frascos de 2,5 g) — Cyanokit'],
  dil:'5 g + SF 0,9% 200 mL, em 15 min.',
  ind:[
    { sit:'Intoxicação por cianeto (incêndio em ambiente fechado com rebaixamento/acidose lática > 8, nitroprussiato prolongado)', dose:'5 g em 15 min; repetir 5 g se PCR ou instabilidade persistente', via:'EV', prep:'', obs:'Não esperar confirmação — tratar pela suspeita. Compatível com o CO concomitante.' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma.',
  cuidado:['Urina, pele e plasma ficam vermelhos por dias — interfere em colorimetria (creatinina, lactato de alguns aparelhos, oximetria de pulso, hemodiálise: alarme falso de sangue).', 'Hipertensão transitória.'] },

{ slug:'azul-de-metileno', nome:'Azul de metileno', classe:'Antídoto da metemoglobinemia / vasoplegia refratária',
  apres:['Ampola 1% (10 mg/mL) — 5 mL (50 mg)', 'Ampola 2% 5 mL'],
  dil:'1–2 mg/kg + SF 0,9% 50–100 mL em 5–10 min.',
  ind:[
    { sit:'Metemoglobinemia sintomática (MetHb > 20–30%, ou > 10% com sintoma: dapsona, benzocaína, nitrito, sulfa)', dose:'1–2 mg/kg em 5 min; repetir em 1 h se MetHb > 20%', via:'EV', prep:'70 kg: 7–14 mL de 1%.', obs:'Cianose que não melhora com O2 e sangue cor de chocolate. Oxímetro marca ~85% independentemente.' },
    { sit:'Choque vasoplégico refratário (séptico, pós-CEC, anafilático)', dose:'1–2 mg/kg em 20 min; opcional 0,5 mg/kg/h por 6 h', via:'EV', prep:'', obs:'Uso de resgate, evidência limitada.' }
  ],
  renal:'ClCr < 30: reduzir/evitar dose repetida.', contra:'Deficiência de G6PD (hemólise e não funciona), uso de ISRS/IMAO/linezolida (síndrome serotoninérgica), gestação (relativa).',
  cuidado:['Dose > 7 mg/kg causa metemoglobinemia paradoxal e hemólise.', 'Síndrome serotoninérgica com serotoninérgicos.', 'Urina azul-esverdeada.'] },

{ slug:'fomepizol', nome:'Fomepizol', classe:'Inibidor da álcool-desidrogenase',
  apres:['Frasco 1 g/mL — 1,5 mL (1,5 g) — importado, raro no Brasil'],
  dil:'Diluir em 100 mL de SF, em 30 min.',
  ind:[
    { sit:'Intoxicação por metanol ou etilenoglicol', dose:'15 mg/kg de ataque; 10 mg/kg de 12/12 h por 4 doses; depois 15 mg/kg 12/12 h', via:'EV', prep:'Durante hemodiálise: a cada 4 h.', obs:'Se indisponível: etanol 10% EV (0,6–0,8 g/kg ataque, 0,1 g/kg/h) mirando etanolemia 100–150 mg/dL, ou VO (destilado 40%: 1,8 mL/kg ataque).' }
  ],
  renal:'Sem ajuste; hemodiálise remove — redosar.', contra:'Alergia a pirazol.', cuidado:['Cefaleia, náusea, flebite.', 'Associar folato (metanol) ou tiamina + piridoxina (etilenoglicol).'] },

{ slug:'dantroleno', nome:'Dantroleno', classe:'Relaxante muscular de ação direta (RyR1)',
  apres:['Frasco 20 mg (pó) — reconstituir em 60 mL de água estéril (não SF)'],
  dil:'Cada frasco 20 mg + 60 mL de AD (agitar bem — dissolve mal). 70 kg × 2,5 mg/kg = 175 mg = 9 frascos.',
  ind:[
    { sit:'Hipertermia maligna (rigidez, hipercapnia, taquicardia após succinilcolina/halogenado)', dose:'2,5 mg/kg em bolus; repetir a cada 5–10 min até controle (até 10 mg/kg); depois 1 mg/kg 6/6 h por 24–48 h', via:'EV', prep:'', obs:'Parar o gatilho, hiperventilar com O2 100%, resfriar, tratar hipercalemia. Mortalidade cai de 80% para < 5% com dantroleno precoce.' },
    { sit:'Síndrome neuroléptica maligna grave (adjuvante)', dose:'1–2,5 mg/kg EV; até 10 mg/kg/dia', via:'EV', prep:'', obs:'Com bromocriptina 2,5–5 mg VO 8/8 h.' }
  ],
  renal:'Sem ajuste.', hep:'Hepatotoxicidade com uso prolongado.', contra:'Nenhuma na hipertermia maligna.',
  cuidado:['Fraqueza muscular, flebite (alta osmolaridade) — veia calibrosa.', 'Precipita com bloqueador de canal de cálcio (hipercalemia, colapso) — não usar verapamil junto.'] },

{ slug:'biperideno', nome:'Biperideno', classe:'Anticolinérgico central',
  apres:['Ampola 5 mg/mL — 1 mL', 'Comprimido 2 mg'],
  dil:'Puro, lento.',
  ind:[
    { sit:'Distonia aguda por antipsicótico/metoclopramida (torcicolo, crise oculógira, trismo)', dose:'5 mg IM ou EV lento; repetir em 30 min se necessário', via:'IM / EV', prep:'', obs:'Melhora em 10–30 min. Depois 2 mg VO 12/12 h por 2–3 dias (a droga que causou ainda circula).' },
    { sit:'Parkinsonismo por antipsicótico', dose:'2 mg VO 1–3x/dia', via:'VO', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Glaucoma de ângulo fechado, íleo, hipertrofia prostática com retenção, miastenia.',
  cuidado:['Delirium anticolinérgico no idoso.', 'Alternativa: prometazina 25–50 mg IM.'] },

{ slug:'glucagon', nome:'Glucagon', classe:'Hormônio hiperglicemiante / inotrópico independente de beta',
  apres:['Kit 1 mg (pó + diluente)'],
  dil:'Reconstituir com o diluente do kit. Para infusão: 10 mg (10 kits) em SG 5% 100 mL.',
  ind:[
    { sit:'Hipoglicemia grave sem acesso venoso', dose:'1 mg IM ou SC (0,5 mg se < 25 kg)', via:'IM / SC', prep:'', obs:'Efeito em 10–15 min; inútil se glicogênio depletado (etilista, desnutrido, jejum prolongado). Dar carboidrato ao acordar.' },
    { sit:'Intoxicação por betabloqueador ou bloqueador de canal de cálcio com bradicardia/hipotensão', dose:'3–5 mg EV em 1–2 min (até 10 mg); depois 3–5 mg/h em BIC', via:'EV', prep:'', obs:'Vômito quase certo — antiemético e proteger via aérea. Associar cálcio, insulina em alta dose (1 UI/kg bolus + 0,5–1 UI/kg/h com glicose) e vasopressor.' },
    { sit:'Impactação alimentar esofágica', dose:'1 mg EV', via:'EV', prep:'', obs:'Evidência fraca; não atrasar a endoscopia.' }
  ],
  renal:'Sem ajuste.', contra:'Feocromocitoma, insulinoma.', cuidado:['Vômito, hiperglicemia, hipocalemia.'] },

/* ===================== ANTICOAGULANTES, HEMOSTASIA E TROMBÓLISE ===================== */
{ slug:'heparina-nao-fracionada', nome:'Heparina não fracionada', classe:'Anticoagulante parenteral (antitrombina)',
  apres:['Frasco 5.000 UI/mL — 5 mL (25.000 UI)', 'Ampola 5.000 UI/0,25 mL (SC)'],
  dil:'25.000 UI (5 mL) + SF 0,9% 245 mL = 250 mL a 100 UI/mL.',
  ind:[
    { sit:'TEP / TVP (instável, IRC, obeso, provável trombólise/cirurgia)', dose:'Bolus 80 UI/kg (máx. 10.000); 18 UI/kg/h', via:'EV', prep:'100 UI/mL: 70 kg → bolus 5.600 UI, infusão 1.260 UI/h = 12,6 mL/h. TTPa em 6 h: alvo 1,5–2,5× (ou anti-Xa 0,3–0,7).', obs:'Ajuste por nomograma da unidade.' },
    { sit:'SCA sem supra', dose:'Bolus 60 UI/kg (máx. 5.000); 12 UI/kg/h (máx. 1.000 UI/h)', via:'EV', prep:'100 UI/mL: 70 kg → bolus 4.200 UI, infusão 840 UI/h = 8,4 mL/h.', obs:'Alvo TTPa 1,5–2×. Preferida na estratégia invasiva e no ClCr < 30.' },
    { sit:'IAM com supra + fibrinolítico', dose:'Bolus 60 UI/kg (máx. 4.000); 12 UI/kg/h (máx. 1.000 UI/h) por 48 h', via:'EV', prep:'', obs:'Alvo TTPa 1,5–2× (50–70 s).' },
    { sit:'IAM com supra — angioplastia primária', dose:'70–100 UI/kg em bolus (máx. 10.000); com inibidor IIb/IIIa: 50–70 UI/kg (máx. 7.000)', via:'EV', prep:'', obs:'Sem infusão no PS: a sala de hemodinâmica ajusta pelo TCA.' },
    { sit:'IAM com supra sem reperfusão', dose:'Bolus 50–70 UI/kg (máx. 5.000); 12 UI/kg/h', via:'EV', prep:'', obs:'Alvo TTPa 1,5–2×. Enoxaparina é alternativa.' },
    { sit:'Profilaxia de TEV (quando enoxaparina contraindicada — ClCr < 30)', dose:'5.000 UI de 8/8 h ou 12/12 h', via:'SC', prep:'', obs:'' },
    { sit:'FA com indicação de anticoagulação e via oral impossível', dose:'Como no TEP', via:'EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste — é a anticoagulação de escolha em ClCr < 30 e diálise.', contra:'Sangramento ativo, trombocitopenia induzida por heparina prévia, plaquetas < 50.000, cirurgia de SNC recente, hipertensão grave não controlada.',
  cuidado:['Antídoto: protamina 1 mg para cada 100 UI de heparina das últimas 2–3 h (máx. 50 mg).', 'Plaquetas a cada 2–3 dias: queda > 50% → suspeitar HIT, trocar por argatroban/fondaparinux.', 'Osteoporose e hipercalemia no uso prolongado.'] },

{ slug:'enoxaparina', nome:'Enoxaparina', classe:'Heparina de baixo peso molecular',
  apres:['Seringa 20, 40, 60, 80, 100 mg (10.000 UI = 100 mg)'],
  dil:'Puro, SC profundo no abdome; não expelir a bolha; não massagear.',
  ind:[
    { sit:'TEP / TVP — tratamento', dose:'1 mg/kg de 12/12 h (ou 1,5 mg/kg 1x/dia)', via:'SC', prep:'Peso real. > 150 kg ou < 40 kg: anti-Xa.', obs:'Gestante: 1 mg/kg 12/12 h; câncer: preferir HBPM a DOAC em alguns cenários.' },
    { sit:'SCA sem supra', dose:'1 mg/kg de 12/12 h', via:'SC', prep:'', obs:'Sem redução por idade (a de 0,75 mg/kg a partir dos 75 anos é do IAM com supra trombolisado). Até a angioplastia ou por 8 dias.' },
    { sit:'IAM com supra + fibrinolítico', dose:'< 75 anos: 30 mg EV bolus + 1 mg/kg SC 12/12 h · ≥ 75 anos: sem bolus, 0,75 mg/kg SC 12/12 h', via:'EV + SC', prep:'', obs:'Duas primeiras doses SC com teto: 100 mg (< 75 anos) ou 75 mg (≥ 75). ClCr < 30: 1 mg/kg 1x/dia.' },
    { sit:'Profilaxia de TEV (clínico, cirúrgico)', dose:'40 mg 1x/dia (20 mg se ClCr < 30; 40 mg 12/12 h se IMC > 40)', via:'SC', prep:'', obs:'' }
  ],
  renal:'ClCr < 30: tratamento 1 mg/kg 1x/dia; profilaxia 20 mg/dia. Diálise: preferir HNF.', contra:'Sangramento ativo, HIT, plaquetas < 50.000, raquianestesia/punção lombar (respeitar 12 h dose profilática / 24 h dose plena antes, 4 h depois), cirurgia de SNC.',
  cuidado:['Reversão parcial com protamina 1 mg/1 mg de enoxaparina das últimas 8 h (máx. 50 mg) — reverte ~60%.', 'Acúmulo silencioso na IRA: recalcular a cada piora da creatinina.', 'Hematoma de parede abdominal/retroperitoneal no idoso.'] },

{ slug:'fitomenadiona', nome:'Vitamina K (fitomenadiona)', classe:'Reversor de antagonista da vitamina K',
  apres:['Ampola 10 mg/mL — 1 mL (Kanakion)', 'Ampola 2 mg/0,2 mL (neonatal)'],
  dil:'EV: diluir em 50 mL de SF e correr em 20–30 min (anafilactoide se rápido). Pode ser dada VO (a mesma ampola, em suco).',
  ind:[
    { sit:'Varfarina com INR > 10 sem sangramento', dose:'2,5–5 mg VO', via:'VO', prep:'', obs:'INR 4,5–10 sem sangramento: apenas suspender.' },
    { sit:'Sangramento maior por varfarina', dose:'10 mg EV lento + complexo protrombínico 25–50 UI/kg (ou plasma 15 mL/kg se indisponível)', via:'EV', prep:'', obs:'Vitamina K sozinha demora 6–24 h. Sem CCP: plasma.' },
    { sit:'Pré-operatório em uso de varfarina (cirurgia em 24 h)', dose:'2,5–5 mg VO ou EV', via:'VO/EV', prep:'', obs:'' },
    { sit:'Coagulopatia da hepatopatia/colestase/desnutrição (teste)', dose:'10 mg EV ou SC 1x/dia por 3 dias', via:'EV/SC', prep:'', obs:'Se INR não cai, a causa é hepática, não deficiência.' },
    { sit:'Profilaxia da doença hemorrágica do RN', dose:'1 mg IM ao nascer', via:'IM', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma absoluta; evitar dose alta em portador de válvula mecânica (resistência à varfarina por semanas).',
  cuidado:['Reação anafilactoide EV — infundir lento.', 'IM em anticoagulado: hematoma — preferir SC ou EV.'] },

{ slug:'protamina', nome:'Protamina', classe:'Antagonista da heparina',
  apres:['Ampola 10 mg/mL — 5 mL (50 mg) — 1 mg neutraliza ~100 UI de HNF'],
  dil:'Puro, lento (máx. 5 mg/min).',
  ind:[
    { sit:'Sangramento por heparina não fracionada', dose:'1 mg por 100 UI de heparina dada nas últimas 2–3 h (máx. 50 mg)', via:'EV lento', prep:'Infusão de 1.250 UI/h nas últimas 2 h ≈ 2.500 UI → 25 mg. Após 30 min da dose de heparina: metade; após 2 h: 1/4.', obs:'' },
    { sit:'Sangramento por enoxaparina', dose:'1 mg por 1 mg de enoxaparina (dose < 8 h); 0,5 mg/mg se 8–12 h', via:'EV lento', prep:'', obs:'Reverte só 60–75% da atividade anti-Xa.' }
  ],
  renal:'Sem ajuste.', contra:'Alergia a peixe, uso prévio de insulina NPH/protamina e vasectomizado: risco maior de anafilaxia (relativa).',
  cuidado:['Hipotensão, bradicardia, anafilaxia, hipertensão pulmonar em bolus rápido.', 'Excesso tem efeito anticoagulante próprio.'] },

{ slug:'acido-tranexamico', nome:'Ácido tranexâmico', classe:'Antifibrinolítico',
  apres:['Ampola 250 mg/5 mL (50 mg/mL)', 'Comprimido 250 e 500 mg'],
  dil:'1 g (4 ampolas) + SF 0,9% 100 mL em 10 min.',
  ind:[
    { sit:'Trauma com sangramento ou risco (até 3 h do trauma)', dose:'1 g em 10 min, depois 1 g em 8 h', via:'EV', prep:'', obs:'Após 3 h: não dar (mais mortalidade).' },
    { sit:'Hemorragia pós-parto', dose:'1 g em 10 min; repetir 1 g após 30 min se persistir', via:'EV', prep:'', obs:'Junto com ocitocina e as manobras.' },
    { sit:'Hemoptise', dose:'500 mg–1 g EV 8/8 h; nebulização 500 mg 8/8 h', via:'EV / INAL', prep:'', obs:'' },
    { sit:'Epistaxe / sangramento oral em anticoagulado', dose:'Tópico: embeber gaze com a ampola; bochecho 5% 10 mL 6/6 h', via:'Tópico', prep:'', obs:'' },
    { sit:'TCE (CRASH-3, até 3 h, Glasgow 9–15)', dose:'1 g em 10 min + 1 g em 8 h', via:'EV', prep:'', obs:'Benefício em TCE leve-moderado.' }
  ],
  renal:'ClCr 30–60: 10 mg/kg 12/12 h · < 30: 10 mg/kg 24/24 h (acumula — convulsão).', contra:'Trombose ativa, CIVD com fibrinólise não predominante, hematúria macroscópica de trato superior (coágulo obstrutivo), hemorragia subaracnóidea (não é rotina).',
  cuidado:['Convulsão em dose alta / IRC.', 'Injeção intratecal acidental é fatal — rotular a seringa.'] },

{ slug:'alteplase', nome:'Alteplase (rtPA)', classe:'Fibrinolítico (ativador do plasminogênio)',
  apres:['Frasco 50 mg + diluente 50 mL (1 mg/mL)', 'Frasco 10 e 20 mg'],
  dil:'Reconstituir com o diluente (1 mg/mL), sem agitar. Via exclusiva; sem outra droga na mesma linha.',
  ind:[
    { sit:'AVC isquêmico (até 4,5 h do início, sem contraindicação)', dose:'0,9 mg/kg (máx. 90 mg): 10% em bolus em 1 min, 90% em 60 min', via:'EV', prep:'70 kg: 63 mg → 6,3 mg bolus + 56,7 mg em 1 h.', obs:'PA < 185/110 antes e < 180/105 por 24 h. Sem antitrombótico por 24 h. Angioedema orolingual em uso de IECA.' },
    { sit:'TEP de alto risco (instável)', dose:'100 mg em 2 h', via:'EV', prep:'Heparina em pausa durante a infusão, retomar sem bolus quando TTPa < 2×.', obs:'Na PCR por TEP provável: 50 mg em bolus, repetir 50 mg em 15 min se preciso, e manter a RCP por 60–90 min.' },
    { sit:'IAM com supra sem angioplastia em 120 min', dose:'Acelerado: 15 mg bolus, 0,75 mg/kg (máx. 50) em 30 min, 0,5 mg/kg (máx. 35) em 60 min', via:'EV', prep:'Com AAS, clopidogrel e enoxaparina.', obs:'Tenecteplase em bolus único é mais prática.' },
    { sit:'Cateter venoso central obstruído', dose:'2 mg em 2 mL no lúmen por 30–120 min', via:'Intraluminal', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Sangramento ativo, AVC hemorrágico prévio, AVC isquêmico < 3 meses, neoplasia/MAV intracraniana, cirurgia/trauma maior < 14 dias (< 3 meses em SNC), PA > 185/110 refratária, plaquetas < 100.000, INR > 1,7, DOAC nas últimas 48 h (sem dosagem), glicemia < 50, dissecção de aorta.',
  cuidado:['Sangramento intracraniano (~6% no AVC): piora neurológica → parar, TC, crioprecipitado 10 U + ácido tranexâmico.', 'Angioedema: parar, anti-histamínico, corticoide, adrenalina se via aérea.'] },

{ slug:'tenecteplase', nome:'Tenecteplase (TNK)', classe:'Fibrinolítico em bolus único',
  apres:['Frasco 50 mg (10.000 UI) + diluente 10 mL (5 mg/mL)'],
  dil:'Reconstituir com AD 10 mL (5 mg/mL). Bolus em 5–10 s. Não agitar.',
  ind:[
    { sit:'IAM com supra sem acesso a angioplastia em 120 min (até 12 h de dor)', dose:'< 60 kg: 30 mg · 60–69: 35 mg · 70–79: 40 mg · 80–89: 45 mg · ≥ 90: 50 mg (≥ 75 anos: metade)', via:'EV bolus', prep:'6–10 mL conforme peso.', obs:'Com AAS 300 mg, clopidogrel 300 mg (75 se ≥ 75 anos), enoxaparina. Transferir para cateterismo em 2–24 h.' },
    { sit:'TEP de alto risco (instável)', dose:'Mesma tabela por peso: 30 a 50 mg em bolus', via:'EV bolus', prep:'', obs:'Uso fora de bula no Brasil; alteplase 100 mg em 2 h é o padrão.' },
    { sit:'AVC isquêmico (alternativa ao alteplase em centros habilitados)', dose:'0,25 mg/kg (máx. 25 mg) em bolus', via:'EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'As mesmas do alteplase.', cuidado:['Reperfusão: arritmia de reperfusão, hipotensão.', 'Sangramento — mesmas medidas do alteplase.'] },

{ slug:'complexo-protrombinico', nome:'Complexo protrombínico (CCP)', classe:'Concentrado de fatores II, VII, IX e X',
  apres:['Frasco 500 UI (Octaplex, Beriplex/Kcentra) — 4 fatores'],
  dil:'Reconstituir conforme o kit; infundir 3–5 mL/min.',
  ind:[
    { sit:'Sangramento grave ou neurocirurgia urgente em uso de varfarina', dose:'INR 2–4: 25 UI/kg · 4–6: 35 UI/kg · > 6: 50 UI/kg (máx. 5.000 UI) — ou dose fixa 1.500–2.000 UI em 10 min sem INR/peso · + vitamina K 10 mg EV', via:'EV', prep:'', obs:'Corrige o INR em 10–30 min. INR 15 min após o fim da infusão; se > 1,5, dose adicional.' },
    { sit:'Sangramento grave por anti-Xa (rivaroxabana, apixabana, edoxabana)', dose:'2.000 UI fixas ou 25–50 UI/kg', via:'EV', prep:'', obs:'Com antifibrinolítico. Dabigatrana: idarucizumabe 5 g EV (se indisponível, hemodiálise).' }
  ],
  renal:'Sem ajuste.', contra:'CIVD, HIT (contém heparina em algumas marcas), trombose recente (relativa).',
  cuidado:['Trombose arterial/venosa em 1–2%.', 'Não repetir sem novo INR.'] },

/* ===================== ENDÓCRINO E ELETRÓLITOS ===================== */
{ slug:'insulina-regular', nome:'Insulina regular', classe:'Insulina de ação rápida',
  apres:['Frasco 100 UI/mL — 10 mL', 'Caneta 100 UI/mL — 3 mL'],
  dil:'Infusão: 100 UI (1 mL) + SF 0,9% 99 mL = 1 UI/mL, em bomba; desprezar os primeiros 20 mL pelo equipo (adsorção).',
  ind:[
    { sit:'Cetoacidose / estado hiperglicêmico hiperosmolar', dose:'0,1 UI/kg/h em BIC (bolus 0,1 UI/kg opcional); meta: queda de 50–75 mg/dL/h', via:'EV BIC', prep:'1 UI/mL: 70 kg = 7 mL/h. Só iniciar com K ≥ 3,3. Glicemia < 250 (CAD) ou < 300 (EHH): reduzir para 0,05 UI/kg/h e adicionar SG 5–10%.', obs:'Manter até fechar o ânion gap; sobrepor 1–2 h com a NPH/basal SC antes de desligar.' },
    { sit:'Hipercalemia (deslocamento)', dose:'10 UI EV + glicose 50% 100 mL (50 g) em 30–60 min', via:'EV', prep:'Glicemia > 250: só a insulina. Glicemia capilar de 1/1 h por 6 h.', obs:'Cai 0,5–1,2 mEq/L em 15–30 min, dura 4–6 h.' },
    { sit:'Hiperglicemia hospitalar (correção)', dose:'Escala: 150–200: 2 UI · 201–250: 4 · 251–300: 6 · 301–350: 8 · > 350: 10 UI', via:'SC', prep:'Antes das refeições; não ao deitar sem basal.', obs:'Correção isolada (sliding scale) sem basal é inferior — associar NPH.' },
    { sit:'Intoxicação por betabloqueador/bloqueador de cálcio (insulina em alta dose)', dose:'1 UI/kg bolus + 0,5–1 UI/kg/h (até 10 UI/kg/h) com glicose 25 g/h e K', via:'EV BIC', prep:'Glicemia de 30/30 min, K de 1/1 h.', obs:'' }
  ],
  renal:'IRC: meia-vida maior — reduzir doses SC 25–50%; risco de hipoglicemia prolongada.', contra:'Hipoglicemia, hipocalemia < 3,3 (na CAD).',
  cuidado:['Hipocalemia: repor 20–30 mEq/L de KCl no soro quando K < 5,0.', 'Hipoglicemia: 20–30 mL de glicose 50% EV.', 'Queda de glicemia > 100 mg/dL/h na CAD: reduzir (edema cerebral, sobretudo em jovens).'] },

{ slug:'glicose', nome:'Glicose hipertônica (50% / 25%)', classe:'Carboidrato EV',
  apres:['Ampola glicose 50% 10 mL (5 g)', 'Ampola 25% 10 mL (2,5 g)', 'Frasco 50% 500 mL'],
  dil:'Puro em veia calibrosa (esclerosante). Em criança: diluir para 10% (1 mL de 50% + 4 mL de AD).',
  ind:[
    { sit:'Hipoglicemia sintomática / < 70 com rebaixamento', dose:'20–30 mL de 50% (10–15 g) EV; repetir em 10 min se glicemia < 70', via:'EV', prep:'Etilista/desnutrido: tiamina 300 mg antes ou junto.', obs:'Sulfonilureia: hipoglicemia recorrente por 24–48 h → internar, SG 10% contínuo, octreotide 50–100 mcg SC 8/8 h.' },
    { sit:'Criança', dose:'2–5 mL/kg de glicose 10% (0,2–0,5 g/kg)', via:'EV', prep:'', obs:'Não usar 50% em criança (esclerose, hiperosmolaridade).' },
    { sit:'Hipercalemia (com insulina)', dose:'100 mL de 50% (50 g) com 10 UI de insulina regular', via:'EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Hiperglicemia; cautela em hiponatremia (osmolaridade).',
  cuidado:['Flebite e necrose se extravasar.', 'Encefalopatia de Wernicke se dar glicose antes da tiamina no etilista.'] },

{ slug:'cloreto-de-potassio', nome:'Cloreto de potássio', classe:'Eletrólito',
  apres:['Ampola 19,1% 10 mL (25 mEq)', 'Ampola 10% 10 mL (13,4 mEq)', 'Xarope 6% (0,8 mEq/mL — 10 mL = 8 mEq)', 'Comprimido 600 mg (8 mEq)'],
  dil:'Periférico: máximo 40–60 mEq/L (1 ampola de 19,1% em 500 mL de SF) e 10 mEq/h. Central: até 20 mEq/h (1 ampola em 100 mL) com monitor. NUNCA em bolus; nunca em soro glicosado.',
  ind:[
    { sit:'Hipocalemia leve (3,0–3,4)', dose:'Xarope 6% 10–20 mL de 8/8 h ou KCl 600 mg 2 cp 8/8 h (40–100 mEq/dia)', via:'VO', prep:'', obs:'Dosar magnésio.' },
    { sit:'Hipocalemia grave (< 3,0), arritmia ou digitálico', dose:'10 mEq/h periférico (20 mEq/h central) — cada 10 mEq sobe ~0,1 mEq/L', via:'EV BIC', prep:'1 ampola 19,1% (25 mEq) + SF 250 mL em central em 1h15; 2 ampolas + SF 1.000 mL periférico a 200 mL/h.', obs:'K de controle a cada 2–4 h. Repor Mg.' },
    { sit:'Cetoacidose', dose:'20–30 mEq por litro de soro quando K < 5,0; adiar insulina se K < 3,3', via:'EV', prep:'', obs:'' }
  ],
  renal:'IRC/oligúria: reduzir e monitorar de perto — hipercalemia iatrogênica.', contra:'Hipercalemia, anúria, insuficiência adrenal não tratada.',
  cuidado:['Dor e flebite na periférica — diluir mais ou lentificar.', 'Bolus de KCl = parada em assistolia.'] },

{ slug:'gluconato-de-calcio', nome:'Gluconato de cálcio 10%', classe:'Eletrólito — estabilizador de membrana',
  apres:['Ampola 10% 10 mL (1 g = 93 mg de cálcio elementar = 4,6 mEq)'],
  dil:'1 ampola + SG 5% ou SF 100 mL em 5–10 min (hipercalemia) ou 10–20 min (hipocalcemia). Não misturar com bicarbonato ou fosfato na mesma via.',
  ind:[
    { sit:'Hipercalemia com ECG alterado ou K ≥ 6,5', dose:'1–2 g (1–2 ampolas) em 5 min; repetir em 5 min se o ECG não melhorar', via:'EV', prep:'', obs:'Não baixa o K; protege o coração por 30–60 min.' },
    { sit:'PCR por hipercalemia ou por bloqueador de canal de cálcio', dose:'30 mL (3 g) em bolus', via:'EV/IO', prep:'Puro. Cloreto de cálcio 10% 10 mL (1 g) equivale, de preferência em veia central.', obs:'Via separada do bicarbonato (precipita).' },
    { sit:'Hipocalcemia sintomática (tetania, QT longo, convulsão)', dose:'1–2 g em 10–20 min; depois 10 ampolas + SG 5% 900 mL a 50–100 mL/h', via:'EV', prep:'0,5–1,5 mg/kg/h de cálcio elementar.', obs:'Corrigir magnésio.' },
    { sit:'Transfusão maciça no trauma (hipocalcemia pelo citrato)', dose:'1–3 g (10–30 mL) em 10 min, guiado pelo cálcio iônico', via:'EV', prep:'Cloreto de cálcio 10% 10 mL (1 g) equivale a ~3 g de gluconato — de preferência em veia central.', obs:'Manter o cálcio iônico normal. Sem dosagem rápida: empírico após algumas unidades de hemoderivado.' },
    { sit:'Intoxicação por bloqueador de canal de cálcio', dose:'3 g (30 mL) em 10 min; repetir a cada 10–20 min até 3–4 doses, ou infusão 0,2–0,4 mL/kg/h', via:'EV', prep:'Cloreto de cálcio 10% é 3× mais potente (1 g = 273 mg elementar) — só em central.', obs:'' },
    { sit:'Hipermagnesemia sintomática', dose:'1 g em 5 min', via:'EV', prep:'', obs:'' },
    { sit:'Intoxicação pelo sulfato de magnésio (pré-eclâmpsia/eclâmpsia)', dose:'10 mL (1 g) EV lento, em 3–10 min', via:'EV', prep:'Puro ou diluído em 10 mL de SF.', obs:'Arreflexia, depressão respiratória ou parada: suspender o magnésio, suporte ventilatório e cálcio.' },
    { sit:'Queimadura por ácido fluorídrico', dose:'Gel de gluconato 2,5% tópico; 10 mL de 10% intra-arterial/infiltração em casos graves', via:'Tópico/infiltração', prep:'', obs:'' }
  ],
  renal:'Sem ajuste agudo; cautela na IRC com hiperfosfatemia (calcificação).', contra:'Hipercalcemia, intoxicação digitálica (relativa — arritmia; infundir lento em 20–30 min se imprescindível).',
  cuidado:['Extravasamento: necrose — veia calibrosa.', 'Bradicardia e hipotensão se rápido.', 'Precipita com bicarbonato e ceftriaxona (neonato).'] },

{ slug:'sulfato-de-magnesio', nome:'Sulfato de magnésio', classe:'Eletrólito / anticonvulsivante obstétrico / broncodilatador',
  apres:['Ampola 50% 10 mL (5 g = 40 mEq)', 'Ampola 10% 10 mL (1 g = 8 mEq)', 'Ampola 20% 10 mL (2 g)'],
  dil:'Bolus: 2 g = 4 mL de 50% ou 20 mL de 10% + SG 5% 100 mL. Manutenção obstétrica: 10 g (20 mL de 50%) + SF 0,9% 480 mL = 20 mg/mL → 1 g/h = 50 mL/h.',
  ind:[
    { sit:'Torsades de pointes / PCR por torsades', dose:'2 g em 1–2 min (PCR) ou em 5–15 min (com pulso); depois 1–2 g/h', via:'EV', prep:'', obs:'Mesmo com Mg normal.' },
    { sit:'Eclâmpsia / pré-eclâmpsia grave (Zuspan)', dose:'4 g em 15–20 min; manutenção 1–2 g/h por 24 h após o parto ou a última convulsão', via:'EV', prep:'Pritchard (sem bomba): 4 g EV + 10 g IM (5 g em cada nádega), depois 5 g IM 4/4 h.', obs:'Manter só com reflexo patelar presente, FR ≥ 16 (MS; o ACOG usa 12) e diurese ≥ 25 mL/h. Antídoto: gluconato de cálcio 1 g EV lento.' },
    { sit:'Crise de asma grave sem resposta na 1ª hora', dose:'2 g em 20 min', via:'EV', prep:'', obs:'Dose única.' },
    { sit:'Hipomagnesemia sintomática (arritmia, tetania, hipocalemia refratária)', dose:'2 g em 10–20 min; depois 4–8 g em 12–24 h', via:'EV', prep:'', obs:'IRC: metade da dose.' },
    { sit:'FA com resposta rápida (adjuvante)', dose:'2 g em 20 min', via:'EV', prep:'', obs:'Facilita controle de FC.' }
  ],
  renal:'ClCr < 30: reduzir 50% e dosar Mg a cada 6 h (hipermagnesemia → arreflexia, parada respiratória).', contra:'Miastenia gravis, BAV, hipermagnesemia.',
  cuidado:['Toxicidade: perda do reflexo patelar (Mg > 8–10), depressão respiratória (> 12), parada (> 15) → gluconato de cálcio 1 g EV.', 'Rubor e calor na infusão rápida.', 'Potencializa bloqueador neuromuscular.'] },

{ slug:'bicarbonato-de-sodio', nome:'Bicarbonato de sódio 8,4%', classe:'Alcalinizante (1 mEq/mL)',
  apres:['Ampola 8,4% 10 mL (10 mEq)', 'Frasco 8,4% 250 mL', 'Ampola 3% 10 mL'],
  dil:'Diluir 1:1 em SG 5% ou AD para infusão (osmolaridade); bolus puro só em PCR/hipercalemia grave. Via exclusiva — precipita cálcio e inativa catecolaminas.',
  ind:[
    { sit:'Acidose metabólica grave (pH < 7,1; < 7,0 na CAD) ou hipercalemia com acidose', dose:'Déficit = 0,3 × peso × (HCO3 alvo − atual); repor metade em 2 h e regasometrar', via:'EV', prep:'70 kg, HCO3 8 → 12: 84 mEq → 42 mL de 8,4% + 42 mL de SG em 2 h.', obs:'Não corrige a causa. Gera CO2 — ventilar.' },
    { sit:'Intoxicação por tricíclico (QRS > 100 ms, arritmia, hipotensão)', dose:'1–2 mEq/kg em bolus; repetir até QRS < 100; depois 150 mEq em SG 5% 1.000 mL a 150–250 mL/h', via:'EV', prep:'Alvo pH 7,50–7,55.', obs:'Também em cocaína com QRS largo e em salicilato (alcalinização urinária, pH urinário > 7,5).' },
    { sit:'PCR', dose:'1 mEq/kg', via:'EV', prep:'', obs:'Só em hipercalemia, acidose prévia grave ou tricíclico (1–2 mEq/kg) — sem benefício de rotina em ensaio randomizado.' },
    { sit:'Rabdomiólise / prevenção de nefropatia por contraste (uso controverso)', dose:'150 mEq em SG 1.000 mL a 100–200 mL/h', via:'EV', prep:'', obs:'' }
  ],
  renal:'Na IRC a carga de sódio e volume é o limite; na acidose da IRC crônica, VO 500–1.000 mg 8/8 h.', contra:'Alcalose, hipocalcemia (agrava tetania), hipernatremia/hipervolemia, hipoventilação sem suporte.',
  cuidado:['Hipocalemia e hipocalcemia (repor antes).', 'Hipernatremia: cada 100 mL de 8,4% = 100 mEq de Na.', 'Extravasamento: necrose.'] },

{ slug:'hidrocortisona', nome:'Hidrocortisona', classe:'Glicocorticoide com efeito mineralocorticoide',
  apres:['Frasco 100 mg e 500 mg (pó) + diluente'],
  dil:'100 mg + AD 2 mL (bolus) ou + SF 100 mL (infusão em 15 min).',
  ind:[
    { sit:'Insuficiência adrenal aguda (crise addisoniana)', dose:'100 mg EV bolus; depois 50 mg 6/6 h (ou 200 mg/24 h em BIC)', via:'EV', prep:'Com SF 0,9% 1–2 L na 1ª hora e glicose. Colher cortisol/ACTH ANTES se possível — mas não atrasar.', obs:'Suspeitar: hipotensão refratária + hiponatremia + hipercalemia + hipoglicemia, ou corticoide crônico suspenso.' },
    { sit:'Choque séptico refratário (nora ≥ 0,25 mcg/kg/min por > 4 h)', dose:'50 mg 6/6 h (ou 200 mg/dia em BIC) por 5–7 dias', via:'EV', prep:'Retirar sem desmame se o choque resolver rápido.', obs:'Associar fludrocortisona 50 mcg VO 1x/dia (opcional).' },
    { sit:'Anafilaxia (adjuvante, após adrenalina)', dose:'200–500 mg EV', via:'EV', prep:'', obs:'Previne bifásica; não é droga de resgate.' },
    { sit:'Asma/DPOC grave sem via oral', dose:'100–200 mg EV 6/6 h ou 8/8 h', via:'EV', prep:'Equivale a prednisona 40–50 mg/dia.', obs:'' },
    { sit:'Cobertura de estresse em usuário crônico de corticoide (cirurgia, sepse)', dose:'50–100 mg EV 8/8 h', via:'EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma na urgência com risco de vida. Infecção fúngica sistêmica não tratada (relativa).',
  cuidado:['Hiperglicemia, hipocalemia, retenção de sódio.', 'Equivalência: hidrocortisona 20 mg = prednisona 5 mg = metilprednisolona 4 mg = dexametasona 0,75 mg.'] },

{ slug:'metilprednisolona', nome:'Metilprednisolona', classe:'Glicocorticoide de potência intermediária, sem efeito mineralocorticoide',
  apres:['Frasco 40, 125, 500 mg e 1 g (succinato) + diluente'],
  dil:'Pulso: 1 g + SF 0,9% 250 mL em 1–2 h. Doses menores: + SF 100 mL em 30 min.',
  ind:[
    { sit:'Asma/DPOC grave', dose:'40–60 mg EV 12/12 h a 24/24 h (1–2 mg/kg/dia)', via:'EV', prep:'', obs:'VO tem eficácia igual se aceitar.' },
    { sit:'Pulsoterapia (lúpus grave, vasculite, mielite, neurite óptica, esclerose múltipla em surto, rejeição)', dose:'500–1.000 mg 1x/dia por 3–5 dias', via:'EV', prep:'Em 1–2 h. Glicemia e PA de 6/6 h; K.', obs:'Profilaxia: IBP, estrongiloidíase (ivermectina) se endêmica.' },
    { sit:'Anafilaxia (adjuvante)', dose:'125 mg EV', via:'EV', prep:'', obs:'' },
    { sit:'Pneumocistose com PaO2 < 70 (junto com o ATB)', dose:'40 mg 12/12 h por 5 dias, 40 mg/dia por 5, 20 mg/dia por 11 (equivalente à prednisona)', via:'EV/VO', prep:'', obs:'' },
    { sit:'Trauma raquimedular', dose:'NÃO recomendada (sem benefício, mais infecção)', via:'—', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Infecção sistêmica não tratada, psicose ativa por corticoide (relativa).',
  cuidado:['Pulso rápido: arritmia, morte súbita (infundir em ≥ 30–60 min).', 'Hiperglicemia, insônia, psicose, miopatia.'] },

{ slug:'dexametasona', nome:'Dexametasona', classe:'Glicocorticoide de longa ação, sem efeito mineralocorticoide',
  apres:['Ampola 4 mg/mL — 2,5 mL (10 mg)', 'Ampola 2 mg/mL — 1 mL', 'Comprimido 0,5, 0,75 e 4 mg; elixir 0,1 mg/mL'],
  dil:'Puro ou em 50–100 mL de SF.',
  ind:[
    { sit:'COVID-19 com necessidade de O2', dose:'6 mg 1x/dia por 10 dias', via:'EV/VO', prep:'', obs:'' },
    { sit:'Meningite bacteriana (antes ou junto da 1ª dose de ATB)', dose:'10 mg (0,15 mg/kg) 6/6 h por 4 dias', via:'EV', prep:'', obs:'Benefício em pneumococo; suspender se outro agente.' },
    { sit:'Edema cerebral vasogênico (tumor, metástase)', dose:'10 mg EV, depois 4 mg 6/6 h', via:'EV/VO', prep:'', obs:'Não em TCE nem AVC (piora).' },
    { sit:'Crupe (laringite viral)', dose:'0,6 mg/kg (máx. 16 mg) dose única', via:'VO/IM', prep:'', obs:'Adrenalina nebulizada se estridor em repouso.' },
    { sit:'Náusea e vômito (quimioterapia, pós-operatório, enxaqueca — prevenção de recorrência)', dose:'4–10 mg', via:'EV', prep:'', obs:'' },
    { sit:'Compressão medular metastática', dose:'10–16 mg EV, depois 4 mg 6/6 h', via:'EV', prep:'Radioterapia/cirurgia urgentes.', obs:'' },
    { sit:'Crise tireotóxica', dose:'2 mg 6/6 h', via:'EV', prep:'Bloqueia conversão T4→T3.', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Infecção fúngica sistêmica, hipersensibilidade.',
  cuidado:['Supressão adrenal após > 2 semanas: desmame.', 'Hiperglicemia, insônia.'] },

{ slug:'tiamina', nome:'Tiamina (vitamina B1)', classe:'Vitamina',
  apres:['Ampola 100 mg/mL — 1 mL', 'Comprimido 300 mg'],
  dil:'IM puro; EV em 100 mL de SF em 30 min (anafilaxia rara em bolus).',
  ind:[
    { sit:'Suspeita de encefalopatia de Wernicke (confusão + ataxia + oftalmoplegia — qualquer um)', dose:'500 mg EV 8/8 h por 3–5 dias; depois 250–300 mg/dia', via:'EV', prep:'', obs:'ANTES de qualquer glicose. Não esperar confirmação.' },
    { sit:'Etilista, desnutrido, hiperêmese, síndrome de realimentação (profilaxia)', dose:'300 mg IM/EV 1x/dia por 3–5 dias, depois 100 mg VO', via:'IM/EV/VO', prep:'', obs:'' },
    { sit:'Beribéri cardíaco (IC de alto débito, acidose lática inexplicada)', dose:'100–300 mg EV', via:'EV', prep:'', obs:'Melhora em horas.' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma.', cuidado:['Anafilaxia (rara) com EV rápido.'] },

/* ===================== ANTIMICROBIANOS DE EMERGÊNCIA (adulto, função renal normal) ===================== */
{ slug:'piperacilina-tazobactam', nome:'Piperacilina-tazobactam', classe:'Penicilina antipseudomonas + inibidor de betalactamase',
  apres:['Frasco 4,5 g (4 g + 0,5 g)', 'Frasco 2,25 g'],
  dil:'4,5 g + SF 0,9% 100 mL, em 30 min (ou infusão estendida em 4 h — melhor PK/PD em sepse).',
  ind:[
    { sit:'Sepse de foco abdominal, pulmonar hospitalar, pé diabético grave, neutropenia febril', dose:'4,5 g 6/6 h (infusão estendida de 4 h)', via:'EV', prep:'', obs:'Cobre Pseudomonas, anaeróbio, enterobactéria; não cobre MRSA nem ESBL confiável.' },
    { sit:'Peritonite / colangite grave', dose:'4,5 g 6/6 h ou 8/8 h', via:'EV', prep:'', obs:'' }
  ],
  renal:'ClCr 20–40: 3,375 g 6/6 h (ou 2,25 g 6/6 h) · < 20: 2,25 g 6/6 h · HD: 2,25 g 8/8 h + 0,75 g após.', contra:'Alergia grave a penicilina (anafilaxia).',
  cuidado:['Hipocalemia, plaquetopenia, lesão renal quando associada a vancomicina.', 'Na alergia leve a penicilina, cefepima é alternativa.'] },

{ slug:'meropenem', nome:'Meropeném', classe:'Carbapenêmico',
  apres:['Frasco 500 mg e 1 g'],
  dil:'1 g + SF 0,9% 100 mL em 30 min, ou infusão estendida de 3 h.',
  ind:[
    { sit:'Sepse grave com risco de ESBL, meningite pós-neurocirúrgica, neutropenia febril grave', dose:'1 g 8/8 h (2 g 8/8 h em meningite e infusão estendida)', via:'EV', prep:'', obs:'Não cobre MRSA, enterococo faecium, Stenotrophomonas.' }
  ],
  renal:'ClCr 26–50: 1 g 12/12 h · 10–25: 500 mg 12/12 h · < 10: 500 mg 24/24 h · HD: 500 mg/dia após.', contra:'Alergia a carbapenêmico; reação cruzada com penicilina ~1%.',
  cuidado:['Convulsão (menos que imipeném).', 'Derruba o nível de ácido valproico em 24 h — interação grave.'] },

{ slug:'vancomicina', nome:'Vancomicina', classe:'Glicopeptídeo (gram-positivo, MRSA)',
  apres:['Frasco 500 mg e 1 g'],
  dil:'1 g + SF 0,9% 250 mL em ≥ 60 min (máx. 10 mg/min — síndrome do homem vermelho se rápido). Concentração ≤ 5 mg/mL.',
  ind:[
    { sit:'Sepse com risco de MRSA, infecção de cateter, endocardite, meningite (com ceftriaxona), pneumonia hospitalar', dose:'Ataque 25–30 mg/kg (peso real, máx. 3 g); manutenção 15–20 mg/kg 8/8 h a 12/12 h', via:'EV', prep:'70 kg: ataque 2 g; 1 g 12/12 h. Ajustar pelo nível: vale 15–20 mcg/mL (ou AUC/MIC 400–600) antes da 4ª dose.', obs:'' },
    { sit:'Colite por C. difficile', dose:'125 mg VO 6/6 h por 10 dias (500 mg 6/6 h se fulminante, + metronidazol EV)', via:'VO', prep:'A apresentação EV pode ser dada VO.', obs:'EV não funciona para colite.' }
  ],
  renal:'Ajuste por nível e ClCr: 50–80: 1 g 24/24 h · 10–50: 1 g 24–96 h · < 10 / HD: 1 g a cada 4–7 dias ou após HD conforme nível. Nefrotoxicidade sobe com piperacilina-tazobactam e aminoglicosídeo.', contra:'Alergia.',
  cuidado:['Síndrome do homem vermelho (rubor, prurido, hipotensão): lentificar, anti-histamínico — não é alergia.', 'Ototoxicidade e nefrotoxicidade: nível sérico e creatinina 2x/semana.'] },

{ slug:'ceftriaxona', nome:'Ceftriaxona', classe:'Cefalosporina de 3ª geração',
  apres:['Frasco 1 g (EV) e 1 g (IM, com lidocaína)', 'Frasco 500 mg e 250 mg'],
  dil:'EV: 1 g + SF 0,9% 100 mL em 30 min (ou 10 mL de AD em bolus lento). IM: 1 g + lidocaína 1% 3,5 mL. Nunca com soluções com cálcio na mesma via (precipita) — contraindicada em neonato < 28 dias com cálcio.',
  ind:[
    { sit:'Meningite bacteriana', dose:'2 g 12/12 h (+ vancomicina; + ampicilina se > 50 anos/imunossuprimido)', via:'EV', prep:'Dexametasona antes.', obs:'' },
    { sit:'PAC internada / pielonefrite / sepse comunitária', dose:'1–2 g 1x/dia', via:'EV/IM', prep:'', obs:'PAC: + azitromicina/claritromicina.' },
    { sit:'Gonorreia', dose:'500 mg IM dose única (1 g se ≥ 150 kg)', via:'IM', prep:'+ azitromicina 1 g VO se clamídia não excluída.', obs:'' },
    { sit:'Profilaxia de PBE / HDA no cirrótico', dose:'1 g 1x/dia por 7 dias', via:'EV', prep:'', obs:'' },
    { sit:'Neurossífilis (alternativa)', dose:'2 g 1x/dia por 10–14 dias', via:'EV', prep:'', obs:'Penicilina cristalina é a escolha.' }
  ],
  renal:'Sem ajuste (eliminação biliar 40%); máx. 2 g/dia se ClCr < 10 com hepatopatia.', contra:'Anafilaxia a betalactâmico; neonato com hiperbilirrubinemia ou cálcio EV.',
  cuidado:['Pseudolitíase biliar e barro biliar (dose alta, criança).', 'Colite por C. difficile.'] },

{ slug:'gentamicina', nome:'Gentamicina', classe:'Aminoglicosídeo',
  apres:['Ampola 80 mg/2 mL', 'Ampola 40 mg/mL; 20 mg/2 mL (pediátrica)'],
  dil:'Dose única diária + SF 0,9% 100 mL em 30 min.',
  ind:[
    { sit:'Sepse de foco urinário/abdominal (sinergia com betalactâmico), pielonefrite complicada', dose:'5–7 mg/kg 1x/dia (peso ideal ou ajustado no obeso)', via:'EV', prep:'70 kg: 350–490 mg. Nível de vale < 1 mcg/mL antes da 2ª dose.', obs:'Dose única diária: menos nefrotoxicidade, mais eficácia.' },
    { sit:'Endocardite por enterococo (sinergia)', dose:'1 mg/kg 8/8 h (3 mg/kg/dia divididos)', via:'EV', prep:'', obs:'Vale < 1.' }
  ],
  renal:'ClCr 40–60: 1x a cada 36 h · 20–40: a cada 48 h · < 20: por nível. Evitar se possível na IRA. HD: 2 mg/kg após a sessão.', contra:'Miastenia gravis, gestação (ototoxicidade fetal), alergia.',
  cuidado:['Nefrotoxicidade (reversível) e ototoxicidade (irreversível): limitar a 5–7 dias, creatinina diária.', 'Bloqueio neuromuscular com relaxantes.', 'Não misturar na mesma seringa com penicilina (inativa).'] },

{ slug:'amicacina', nome:'Amicacina', classe:'Aminoglicosídeo (gram-negativo resistente)',
  apres:['Ampola 500 mg/2 mL', 'Ampola 100 mg/2 mL'],
  dil:'+ SF 0,9% 100 mL em 30–60 min.',
  ind:[
    { sit:'Sepse por gram-negativo multirresistente (com carbapenêmico/polimixina), ITU complicada por ESBL', dose:'15–20 mg/kg 1x/dia', via:'EV', prep:'70 kg: 1–1,4 g. Vale < 5 mcg/mL.', obs:'' }
  ],
  renal:'ClCr 40–60: a cada 36 h · 20–40: 48 h · < 20: por nível. HD: 7,5 mg/kg após.', contra:'Miastenia, gestação.',
  cuidado:['Nefro e ototoxicidade — máximo 5–7 dias, creatinina diária.'] },

{ slug:'polimixina-b', nome:'Polimixina B', classe:'Polipeptídeo (gram-negativo multirresistente)',
  apres:['Frasco 500.000 UI (50 mg)'],
  dil:'Ataque + SF 0,9% 250 mL em 1–2 h; manutenção em 100–250 mL em 1 h.',
  ind:[
    { sit:'Infecção por Pseudomonas, Acinetobacter ou KPC resistentes a carbapenêmico', dose:'Ataque 2–2,5 mg/kg (20.000–25.000 UI/kg); depois 1,25–1,5 mg/kg 12/12 h (peso real)', via:'EV', prep:'70 kg: ataque 150 mg (1.500.000 UI = 3 frascos); manutenção 100 mg 12/12 h.', obs:'Sempre em combinação (meropeném, amicacina, tigeciclina). Mal penetra pulmão e SNC — inalatória/intratecal em casos selecionados.' }
  ],
  renal:'NÃO ajustar a dose (evidência atual: ajuste reduz eficácia; monitorar e aceitar nefrotoxicidade tratável). HD: sem ajuste.', contra:'Miastenia gravis.',
  cuidado:['Nefrotoxicidade em 30–60% (reversível na maioria).', 'Neurotoxicidade: parestesia perioral, bloqueio neuromuscular.', 'Hiperpigmentação.'] },

{ slug:'oxacilina', nome:'Oxacilina', classe:'Penicilina antiestafilocócica (MSSA)',
  apres:['Frasco 500 mg'],
  dil:'2 g + SF 0,9% 100 mL em 30 min.',
  ind:[
    { sit:'Celulite/erisipela grave, abscesso, osteomielite, endocardite por MSSA, bacteremia por S. aureus sensível', dose:'2 g 4/4 h (12 g/dia); infecção leve: 1 g 6/6 h', via:'EV', prep:'', obs:'Superior à vancomicina para MSSA — descalonar assim que sair a sensibilidade.' }
  ],
  renal:'Sem ajuste (eliminação hepática).', contra:'Alergia a penicilina.',
  cuidado:['Hepatite colestática, neutropenia com uso prolongado, nefrite intersticial.', 'Flebite — veia calibrosa ou central.'] },

{ slug:'clindamicina', nome:'Clindamicina', classe:'Lincosamida (anaeróbio, gram-positivo, antitoxina)',
  apres:['Ampola 600 mg/4 mL (150 mg/mL)', 'Cápsula 300 mg'],
  dil:'600 mg + SF 0,9% 100 mL em 30 min (máx. 30 mg/min; concentração ≤ 18 mg/mL).',
  ind:[
    { sit:'Fasciíte necrosante / síndrome do choque tóxico (com betalactâmico — efeito antitoxina)', dose:'900 mg 8/8 h', via:'EV', prep:'', obs:'Junto com penicilina/piperacilina-tazobactam e cirurgia.' },
    { sit:'Pneumonia aspirativa / abscesso pulmonar', dose:'600 mg 8/8 h', via:'EV', prep:'', obs:'' },
    { sit:'Celulite com suspeita de MRSA comunitário (VO)', dose:'300–450 mg 6/6 h a 8/8 h', via:'VO', prep:'', obs:'' },
    { sit:'Toxoplasmose cerebral (alergia a sulfa)', dose:'600 mg 6/6 h + pirimetamina + ácido folínico', via:'VO/EV', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir na hepatopatia grave.', contra:'Colite por C. difficile prévia (relativa).',
  cuidado:['Maior risco de C. difficile entre os ATB.', 'Bloqueio neuromuscular com relaxantes (infusão rápida).'] },

{ slug:'metronidazol', nome:'Metronidazol', classe:'Nitroimidazol (anaeróbio e protozoário)',
  apres:['Bolsa 500 mg/100 mL (EV)', 'Comprimido 250 e 400 mg; suspensão 40 mg/mL'],
  dil:'Pronto para uso; correr em 30–60 min.',
  ind:[
    { sit:'Infecção intra-abdominal (com ceftriaxona/cipro), abscesso, pé diabético', dose:'500 mg 8/8 h', via:'EV/VO', prep:'VO tem a mesma biodisponibilidade.', obs:'' },
    { sit:'Colite por C. difficile leve (quando vancomicina VO indisponível)', dose:'500 mg 8/8 h por 10 dias', via:'VO', prep:'Fulminante: 500 mg EV 8/8 h + vancomicina VO.', obs:'' },
    { sit:'Abscesso hepático amebiano / amebíase', dose:'500–750 mg 8/8 h por 10 dias', via:'VO/EV', prep:'', obs:'' },
    { sit:'Vaginose bacteriana / tricomoníase', dose:'500 mg 12/12 h por 7 dias (ou 2 g dose única)', via:'VO', prep:'', obs:'Tratar o parceiro na tricomoníase.' }
  ],
  renal:'Sem ajuste; HD: dar após a sessão.', hep:'Reduzir 50% na cirrose grave.', contra:'1º trimestre (relativa), uso de álcool (efeito dissulfiram).',
  cuidado:['Gosto metálico, neuropatia periférica com uso prolongado.', 'Potencializa varfarina.', 'Sem álcool até 48 h após.'] },

{ slug:'fluconazol', nome:'Fluconazol', classe:'Azólico (Candida, Cryptococcus)',
  apres:['Bolsa 200 mg/100 mL (EV)', 'Cápsula 150 mg; comprimido 100 mg'],
  dil:'Pronto para uso; ≤ 200 mg/h.',
  ind:[
    { sit:'Candidemia (paciente estável, sem exposição prévia a azol)', dose:'Ataque 800 mg (12 mg/kg); depois 400 mg (6 mg/kg) 1x/dia', via:'EV/VO', prep:'', obs:'Instável ou neutropênico: equinocandina (micafungina/anidulafungina). Retirar o cateter.' },
    { sit:'Meningite criptocócica — consolidação/manutenção', dose:'400–800 mg/dia por 8 semanas, depois 200 mg/dia', via:'VO/EV', prep:'Indução: anfotericina + flucitosina (ou + fluconazol 800).', obs:'' },
    { sit:'Candidíase esofágica', dose:'200–400 mg/dia por 14–21 dias', via:'VO/EV', prep:'', obs:'' },
    { sit:'Perfuração de esôfago / mediastinite (empírico, grave ou imunossuprimido)', dose:'Ataque 800 mg; depois 400 mg 1x/dia', via:'EV', prep:'', obs:'Junto com antibiótico de amplo espectro. Ajustar pela cultura.' },
    { sit:'Candidíase vaginal', dose:'150 mg dose única', via:'VO', prep:'', obs:'' }
  ],
  renal:'ClCr < 50: metade da dose de manutenção (ataque igual). HD: dose plena após a sessão.', contra:'QT longo, uso de drogas que prolongam QT (relativa).',
  cuidado:['Prolonga QT; interação forte com varfarina, fenitoína, tacrolimus, estatinas (CYP3A4/2C9).', 'Hepatotoxicidade.'] },

{ slug:'anfotericina-b', nome:'Anfotericina B', classe:'Antifúngico poliênico',
  apres:['Desoxicolato 50 mg (frasco)', 'Lipossomal 50 mg (frasco) — AmBisome'],
  dil:'SÓ em SG 5% (precipita em SF). Desoxicolato: 0,1 mg/mL em 4–6 h. Lipossomal: 1–2 mg/mL em 2 h.',
  ind:[
    { sit:'Meningite criptocócica (indução), candidemia refratária, mucormicose, histoplasmose/paracoco graves, leishmaniose visceral', dose:'Desoxicolato 0,7–1 mg/kg/dia · Lipossomal 3–5 mg/kg/dia (10 mg/kg na mucormicose)', via:'EV', prep:'Pré-medicação: dipirona/paracetamol + anti-histamínico; hidratar com SF 500–1.000 mL antes (reduz nefrotoxicidade).', obs:'Lipossomal: muito menos nefro e infusional — preferir se disponível.' }
  ],
  renal:'Desoxicolato: nefrotoxicidade quase universal — creatinina, K e Mg diários; trocar por lipossomal se creatinina dobrar. Lipossomal: sem ajuste.', contra:'Hipersensibilidade.',
  cuidado:['Reação infusional: febre, calafrio, hipotensão (hidrocortisona 25 mg no soro se grave).', 'Hipocalemia e hipomagnesemia intensas — repor de rotina.', 'Anemia, flebite (desoxicolato).'] },

{ slug:'artesunato', nome:'Artesunato', classe:'Antimalárico (derivado da artemisinina)',
  apres:['Frasco 60 mg (pó) + bicarbonato 1 mL + SF 5 mL (kit)'],
  dil:'Reconstituir com o bicarbonato do kit, depois SF 5 mL (10 mg/mL); bolus em 1–2 min.',
  ind:[
    { sit:'Malária grave (P. falciparum ou qualquer espécie com critério de gravidade)', dose:'2,4 mg/kg nas horas 0, 12 e 24; depois 1x/dia até tolerar VO (mín. 3 doses); completar com artemeter-lumefantrina 3 dias', via:'EV', prep:'70 kg: 168 mg (3 frascos) por dose. < 20 kg: 3 mg/kg.', obs:'Disponível pelo MS/notificação. Não atrasar: cada hora conta.' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma na malária grave.',
  cuidado:['Hemólise tardia (1–3 semanas): hemograma semanal por 4 semanas.', 'Se indisponível: quinina EV 20 mg/kg ataque + clindamicina.'] },

/* ===================== GASTRO, ANTIEMÉTICOS, RESPIRATÓRIO ===================== */
{ slug:'omeprazol', nome:'Omeprazol / pantoprazol EV', classe:'Inibidor de bomba de prótons',
  apres:['Omeprazol frasco 40 mg + diluente 10 mL', 'Pantoprazol frasco 40 mg', 'Cápsula 20 e 40 mg'],
  dil:'Bolus: 40 mg + diluente 10 mL em 2–5 min (ou em 100 mL de SF em 20 min). Infusão: 80 mg (2 frascos) + SF 0,9% 100 mL a 10 mL/h (8 mg/h).',
  ind:[
    { sit:'Hemorragia digestiva alta (antes da EDA)', dose:'80 mg em bolus, depois 8 mg/h por 72 h (ou 40 mg 12/12 h)', via:'EV', prep:'', obs:'Após EDA sem lesão de alto risco: VO 40 mg/dia.' },
    { sit:'Úlcera com sangramento de alto risco (Forrest Ia–IIb após terapia endoscópica)', dose:'8 mg/h por 72 h, depois 40 mg 12/12 h VO por 2 semanas', via:'EV → VO', prep:'', obs:'' },
    { sit:'Profilaxia de úlcera de estresse (VM > 48 h, coagulopatia, choque)', dose:'40 mg 1x/dia', via:'EV/VO', prep:'', obs:'Suspender ao sair a indicação.' },
    { sit:'Perfuração de esôfago ou úlcera perfurada', dose:'40 mg 12/12 h', via:'EV', prep:'', obs:'Até a cirurgia; junto com jejum e antibiótico.' },
    { sit:'Gastroproteção com AINE ou AAS em dose alta (pericardite)', dose:'20 mg 1x/dia', via:'VO', prep:'', obs:'Enquanto durar o anti-inflamatório.' }
  ],
  renal:'Sem ajuste.', hep:'Máx. 20 mg/dia na cirrose grave.', contra:'Hipersensibilidade.',
  cuidado:['Hipomagnesemia, C. difficile, pneumonia em uso prolongado.', 'Interação com clopidogrel (omeprazol) — preferir pantoprazol.'] },

{ slug:'ondansetrona', nome:'Ondansetrona', classe:'Antiemético antagonista 5-HT3',
  apres:['Ampola 4 mg/2 mL e 8 mg/4 mL', 'Comprimido 4 e 8 mg (orodispersível)'],
  dil:'Puro lento (2–5 min) ou em 50 mL de SF em 15 min.',
  ind:[
    { sit:'Náusea e vômito (gastroenterite, pós-operatório, enxaqueca, opioide)', dose:'4–8 mg 8/8 h (0,15 mg/kg, máx. 16 mg/dose)', via:'EV/IM/VO', prep:'', obs:'Criança: 0,15 mg/kg (máx. 4 mg) dose única facilita a reidratação oral.' },
    { sit:'Quimioterapia', dose:'8–16 mg antes; 8 mg 8/8 h', via:'EV/VO', prep:'', obs:'Com dexametasona.' }
  ],
  renal:'Sem ajuste.', hep:'Máx. 8 mg/dia na cirrose grave.', contra:'QT longo, uso de apomorfina; cautela com outros prolongadores de QT.',
  cuidado:['Prolonga QT (dose ≥ 16 mg EV).', 'Constipação, cefaleia.', 'Serotoninérgico com ISRS/tramadol.'] },

{ slug:'metoclopramida', nome:'Metoclopramida', classe:'Antiemético procinético (antagonista D2)',
  apres:['Ampola 10 mg/2 mL', 'Comprimido 10 mg; gotas 4 mg/mL'],
  dil:'Diluir em 50 mL de SF e correr em 15 min — bolus rápido causa acatisia.',
  ind:[
    { sit:'Náusea/vômito, gastroparesia, enxaqueca (efeito analgésico próprio)', dose:'10 mg 8/8 h (máx. 30 mg/dia); enxaqueca: 10–20 mg', via:'EV/IM/VO', prep:'', obs:'Uso ≤ 5 dias.' }
  ],
  renal:'ClCr < 60: reduzir 50%.', contra:'Obstrução intestinal, feocromocitoma, epilepsia, parkinsonismo, < 1 ano, uso de antipsicótico.',
  cuidado:['Distonia aguda (jovem, dose alta): biperideno 5 mg IM.', 'Acatisia: diazepam/difenidramina.', 'Discinesia tardia com uso prolongado — nunca > 12 semanas.'] },

{ slug:'bromoprida', nome:'Bromoprida', classe:'Antiemético procinético (antagonista D2)',
  apres:['Ampola 10 mg/2 mL', 'Comprimido 10 mg; gotas 4 mg/mL; solução 1 mg/mL'],
  dil:'Puro lento ou em 50 mL de SF.',
  ind:[
    { sit:'Náusea e vômito, dispepsia funcional', dose:'10 mg 8/8 h', via:'EV/IM/VO', prep:'', obs:'Muito usada no Brasil; perfil igual à metoclopramida (extrapiramidais).' }
  ],
  renal:'Reduzir na IRC.', contra:'As mesmas da metoclopramida.', cuidado:['Distonia aguda: biperideno.'] },

{ slug:'salbutamol', nome:'Salbutamol', classe:'Beta-2 agonista de curta ação',
  apres:['Spray 100 mcg/jato', 'Solução para nebulização 5 mg/mL (gotas)', 'Ampola 0,5 mg/mL — 1 mL (EV)', 'Comprimido 2 e 4 mg; xarope 0,4 mg/mL'],
  dil:'Nebulização: 10–20 gotas (2,5–5 mg) + SF 3–4 mL, com O2 6–8 L/min. Spray com espaçador tem eficácia igual à nebulização na crise leve-moderada.',
  ind:[
    { sit:'Crise de asma / DPOC', dose:'4–8 jatos com espaçador ou 2,5–5 mg NBZ a cada 20 min por 3 doses; depois de 1/1 h a 4/4 h', via:'INAL', prep:'Crise grave: nebulização contínua 10–15 mg/h.', obs:'Associar ipratrópio na crise moderada/grave.' },
    { sit:'Hipercalemia (adjuvante)', dose:'10–20 mg (2–4 mL) NBZ', via:'INAL', prep:'', obs:'Cai 0,5–1 mEq/L em 30 min; taquicardia.' },
    { sit:'Asma quase fatal sem resposta inalatória', dose:'EV: 15 mcg/kg em 10 min (ou terbutalina 0,25 mg SC)', via:'EV/SC', prep:'Uso excepcional; monitor.', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Nenhuma na crise; cautela em taquiarritmia e isquemia.',
  cuidado:['Taquicardia, tremor, hipocalemia, hiperglicemia, acidose lática (dose alta).', 'Sem resposta: pensar em pneumotórax, tampão mucoso, obstrução alta.'] },

{ slug:'brometo-de-ipratropio', nome:'Ipratrópio (brometo)', classe:'Anticolinérgico inalatório',
  apres:['Solução para nebulização 0,25 mg/mL (0,025%) — 20 gotas = 0,25 mg', 'Spray 20 mcg/jato'],
  dil:'20–40 gotas (0,25–0,5 mg) na mesma nebulização do salbutamol.',
  ind:[
    { sit:'Crise de asma moderada/grave (com salbutamol, nas primeiras 3 doses)', dose:'0,5 mg (40 gotas) a cada 20 min × 3; depois 6/6 h', via:'INAL', prep:'', obs:'Reduz internação na asma grave; pouco benefício após a 1ª hora.' },
    { sit:'Exacerbação de DPOC', dose:'0,5 mg 6/6 h (ou 4–8 jatos)', via:'INAL', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Alergia à soja/amendoim (spray antigo), glaucoma de ângulo fechado (proteger os olhos na nebulização).',
  cuidado:['Boca seca, retenção urinária em prostático.', 'Máscara: não deixar vazar para os olhos (midríase, glaucoma).'] },

{ slug:'aminofilina', nome:'Aminofilina', classe:'Metilxantina (broncodilatador — 3ª linha)',
  apres:['Ampola 240 mg/10 mL (24 mg/mL)'],
  dil:'Ataque: 5–6 mg/kg + SF 0,9% 100 mL em 30 min. Manutenção: 480 mg (2 ampolas) + SF 0,9% 480 mL = ~1 mg/mL.',
  ind:[
    { sit:'Asma/DPOC quase fatal, refratária a beta-2, ipratrópio, corticoide e magnésio', dose:'Ataque 5–6 mg/kg (omitir se já usa teofilina); manutenção 0,3–0,6 mg/kg/h', via:'EV', prep:'70 kg: 350–420 mg em 30 min; 0,5 mg/kg/h = 35 mL/h.', obs:'Janela terapêutica estreita: nível 10–15 mcg/mL. Reduzir em idoso, IC, hepatopatia, macrolídeo/quinolona.' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir 50% na cirrose e IC.', contra:'Arritmia não controlada, epilepsia não controlada (relativas).',
  cuidado:['Intoxicação: náusea, taquicardia, arritmia, convulsão (nível > 20) — carvão ativado em múltiplas doses, hemodiálise se grave.', 'Interações: cipro, claritro, cimetidina sobem o nível; tabaco baixa.'] },

{ slug:'furosemida', nome:'Furosemida', classe:'Diurético de alça',
  apres:['Ampola 20 mg/2 mL (10 mg/mL)', 'Comprimido 40 mg'],
  dil:'Bolus puro (≤ 4 mg/min em dose > 120 mg — ototoxicidade). Infusão: 200 mg (10 ampolas) + SF 0,9% 80 mL = 2 mg/mL.',
  ind:[
    { sit:'Edema agudo de pulmão / IC com desconforto respiratório', dose:'Sem uso prévio: 40–100 mg · em uso: 2–2,5× a dose oral diária', via:'EV', prep:'Reavaliar em 2 h: diurese < 100–150 mL/h (ou Na urinário < 50–70 mEq/L) → dobrar.', obs:'Ex.: 40 mg VO 12/12 h → 80–100 mg EV. VO 40 mg ≈ EV 20 mg.' },
    { sit:'IC descompensada sem desconforto respiratório', dose:'Sem uso prévio: 20–40 mg · em uso: 1,5–2× a dose oral diária', via:'EV', prep:'Reavaliar em 4 h; sem resposta, dobrar.', obs:'DRC ou congestão grave: começar no topo da faixa.' },
    { sit:'IC — infusão contínua (congestão grave ou resposta prévia melhor)', dose:'Bolus + 5 mg/h, subir até 40 mg/h', via:'EV BIC', prep:'2 mg/mL: 5 mg/h = 2,5 mL/h.', obs:'Pausa > 4 h: novo bolus antes de retomar. Resistência (sem resposta a ≥ 150 mg EV): associar tiazídico.' },
    { sit:'Hipercalemia (com diurese preservada)', dose:'40–80 mg', via:'EV', prep:'Repor volume se hipovolêmico.', obs:'' },
    { sit:'Hipercalcemia (após hidratação vigorosa)', dose:'20–40 mg 6/6 h a 12/12 h', via:'EV', prep:'', obs:'Só se hipervolêmico; não é rotina.' },
    { sit:'IRA oligúrica (teste de resposta)', dose:'1–1,5 mg/kg (até 200 mg)', via:'EV', prep:'', obs:'Não converte IRA nem melhora prognóstico; só maneja volume.' }
  ],
  renal:'IRC: doses maiores (80–200 mg) são necessárias; ineficaz se ClCr < 10–15. Ototoxicidade em bolus rápido de dose alta.', contra:'Anúria estabelecida, hipovolemia, hipocalemia/hiponatremia graves não corrigidas, alergia a sulfa (rara reação cruzada).',
  cuidado:['Hipocalemia, hipomagnesemia, alcalose, hiperuricemia.', 'Ototoxicidade com aminoglicosídeo.', 'Resistência: associar hidroclorotiazida 25–50 mg 1 h antes.'] },

{ slug:'haloperidol', nome:'Haloperidol', classe:'Antipsicótico típico (butirofenona)',
  apres:['Ampola 5 mg/mL — 1 mL', 'Comprimido 1 e 5 mg; gotas 2 mg/mL (10 gotas = 1 mg)', 'Decanoato 50 mg/mL (depósito — nunca na agitação aguda)'],
  dil:'IM puro. EV (off-label): puro lento com monitor (QT).',
  ind:[
    { sit:'Agitação psicomotora / psicose aguda', dose:'5 mg IM (2,5 mg no idoso); repetir em 30–60 min; máx. 20 mg/dia', via:'IM', prep:'Associar midazolam 5 mg IM (ou prometazina 25–50 mg) para sedação mais rápida.', obs:'Preferir VO se aceitar: 5 mg (gotas).' },
    { sit:'Delirium hiperativo (idoso internado)', dose:'0,5–1 mg VO/IM, repetir em 1 h; máx. 3–5 mg/dia', via:'VO/IM', prep:'', obs:'Não previne delirium; tratar a causa.' },
    { sit:'Náusea refratária / cuidados paliativos', dose:'0,5–2 mg 8/8 h', via:'VO/SC', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', hep:'Reduzir na cirrose.', contra:'Parkinson, demência por corpos de Lewy, QT longo, síndrome neuroléptica maligna prévia, coma/depressão do SNC por outra causa.',
  cuidado:['Distonia aguda (biperideno 5 mg IM), acatisia, parkinsonismo.', 'QT: ECG antes de EV; evitar com outros prolongadores.', 'Síndrome neuroléptica maligna: febre, rigidez, CPK alta → parar, dantroleno/bromocriptina.', 'Reduz limiar convulsivo.'] },

{ slug:'diazepam', nome:'Diazepam', classe:'Benzodiazepínico de ação longa',
  apres:['Ampola 10 mg/2 mL', 'Comprimido 5 e 10 mg'],
  dil:'Puro, lento (≤ 5 mg/min), em veia calibrosa (flebite). NÃO diluir em soro (precipita). NÃO IM (absorção errática).',
  ind:[
    { sit:'Crise convulsiva / estado de mal (quando midazolam indisponível)', dose:'10 mg EV (0,15 mg/kg), repetir em 5 min; retal 0,5 mg/kg se sem acesso', via:'EV / retal', prep:'', obs:'Efeito anticonvulsivante curto (redistribui em 20–30 min) — seguir com fenitoína.' },
    { sit:'Abstinência alcoólica', dose:'10 mg VO 6/6 h (ou 10 mg EV a cada 5–10 min até calmo — sintoma-guiado por CIWA)', via:'VO/EV', prep:'', obs:'Delirium tremens pode exigir > 100 mg/dia — sem teto, com monitor.' },
    { sit:'Espasmo muscular / tétano / intoxicação por estimulante (cocaína) / síndrome serotoninérgica', dose:'5–10 mg EV, repetir', via:'EV', prep:'', obs:'Cocaína: benzodiazepínico é a droga de escolha para dor torácica, hipertensão e agitação.' },
    { sit:'Ansiedade aguda / crise de pânico', dose:'5–10 mg VO', via:'VO', prep:'', obs:'' }
  ],
  renal:'Sem ajuste agudo; metabólitos ativos acumulam.', hep:'Cirrose: preferir lorazepam (glucuronidação) — diazepam acumula muito.', contra:'Miastenia, glaucoma agudo, insuficiência respiratória sem suporte, apneia do sono grave.',
  cuidado:['Depressão respiratória com opioide/álcool.', 'Meia-vida 20–100 h: sedação prolongada no idoso e hepatopata.', 'Antídoto: flumazenil (cautela).'] },

{ slug:'ocitocina', nome:'Ocitocina', classe:'Uterotônico',
  apres:['Ampola 5 UI/mL — 1 mL'],
  dil:'Hemorragia pós-parto: 20 UI (4 ampolas) + SF 0,9% 500 mL. Indução: 5 UI + SF 500 mL (10 mUI/mL).',
  ind:[
    { sit:'Prevenção da hemorragia pós-parto (3º período)', dose:'10 UI IM (ou 5 UI EV lento) após a saída do ombro anterior', via:'IM/EV', prep:'', obs:'' },
    { sit:'Hemorragia pós-parto por atonia', dose:'5 UI EV lento (3 min) + 20 UI em 500 mL de SF a 250 mL/h; manutenção 20 UI em 500 mL a 125 mL/h por 4 h', via:'EV', prep:'Junto com massagem uterina bimanual e ácido tranexâmico 1 g. Sem resposta: metilergometrina 0,2 mg IM (não em hipertensa), depois misoprostol 800 mcg retal.', obs:'Bolus rápido de dose alta: hipotensão, arritmia.' },
    { sit:'Indução/condução do trabalho de parto', dose:'2 mUI/min, dobrar a cada 30–40 min até 3–5 contrações/10 min (máx. 20–32 mUI/min)', via:'EV BIC', prep:'', obs:'Hiperestimulação: parar, DLE, O2, terbutalina 0,25 mg SC.' }
  ],
  renal:'Sem ajuste.', contra:'Desproporção, sofrimento fetal, placenta prévia, > 1 cesárea prévia (relativa), hipersensibilidade.',
  cuidado:['Intoxicação hídrica (efeito ADH) em dose alta prolongada — hiponatremia, convulsão.', 'Hipotensão e taquicardia em bolus EV.'] },

{ slug:'misoprostol', nome:'Misoprostol', classe:'Análogo de prostaglandina E1 (uterotônico)',
  apres:['Comprimido 25 e 200 mcg (uso hospitalar controlado)'],
  dil:'Vaginal, retal, sublingual ou oral.',
  ind:[
    { sit:'Hemorragia pós-parto (quando ocitocina falha ou indisponível)', dose:'800 mcg SL ou retal, dose única', via:'SL / retal', prep:'', obs:'Início em 10–20 min; febre e tremor são comuns.' },
    { sit:'Abortamento retido (1º trimestre)', dose:'800 mcg vaginal (ou 600 mcg SL), repetir a cada 3 h se necessário', via:'Vaginal/SL', prep:'', obs:'Com o obstetra (FIGO 2017).' },
    { sit:'Abortamento incompleto (1º trimestre)', dose:'400 mcg SL ou 600 mcg VO, dose única', via:'SL/VO', prep:'', obs:'Com o obstetra (FIGO 2017). Alternativa: aspiração manual intrauterina.' },
    { sit:'Indução do parto com colo desfavorável (feto vivo)', dose:'25 mcg vaginal 6/6 h (máx. 6 doses)', via:'Vaginal', prep:'', obs:'Não com cesárea prévia (rotura uterina).' },
    { sit:'Óbito fetal / indução no 2º–3º trimestre', dose:'Conforme idade gestacional (protocolo FIGO): 13–26 sem 200 mcg 4–6/6 h; > 27 sem 25–50 mcg 4/4 h', via:'Vaginal', prep:'', obs:'' }
  ],
  renal:'Sem ajuste.', contra:'Cesárea prévia com feto vivo (indução), gestação desejada, alergia.',
  cuidado:['Hipertermia, calafrio, diarreia.', 'Taquissistolia e rotura uterina.'] }
];
