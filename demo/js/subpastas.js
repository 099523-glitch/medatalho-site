/* ============================================================
   SUBPASTAS — terceiro nível do guia: área > subpasta > conduta

   Não toca em dados.js. Só diz em que gaveta cada conduta mora.
   A conduta continua identificada pelo seu id: `#cardio/sca-com-supra`
   segue funcionando, e a rota canônica passa a ser
   `#cardio/torax/sca-com-supra`.

   Regras que o app confere na carga (ver validaSubpastas):
     - todo id citado aqui existe em PROTOCOLOS
     - toda conduta aparece em exatamente uma subpasta
     - nenhum id de subpasta colide com id de conduta
   ============================================================ */

const SUBPASTAS = {

  cardio: [
    { id:'parada',          nome:'Parada e choque',              ids:['pcr-adulto','choque-abordagem'] },
    { id:'torax',           nome:'Dor torácica',                 ids:['dor-toracica','sca-com-supra','sca-sem-supra','sindrome-aortica','pericardite-miocardite','takotsubo'] },
    { id:'arritmias',       nome:'Arritmias',                    ids:['taquiarritmia-instavel','taqui-qrs-estreito','fa-flutter','taqui-qrs-largo','bradiarritmia'] },
    { id:'congestao',       nome:'Congestão e obstrução',        ids:['eap-ic-descompensada','tamponamento'] },
    { id:'tromboembolismo', nome:'Tromboembolismo venoso',       ids:['tep','tvp'] },
    { id:'pressao',         nome:'Pressão e síncope',            ids:['crise-hipertensiva','sincope'] }
  ],

  resp: [
    { id:'insuf-resp',      nome:'Insuficiência respiratória',   ids:['insuficiencia-respiratoria','vni'] },
    { id:'broncoespasmo',   nome:'Broncoespasmo',                ids:['asma-crise','dpoc-exacerbacao'] },
    { id:'infeccao-resp',   nome:'Infecção respiratória',        ids:['pneumonia-comunidade','sindrome-gripal'] },
    { id:'pleura',          nome:'Pleura e parênquima',          ids:['pneumotorax','derrame-pleural','hemoptise'] },
    { id:'via-aerea-alta',  nome:'Anafilaxia e via aérea alta',  ids:['anafilaxia'] }
  ],

  neuro: [
    { id:'avc',             nome:'Doença cerebrovascular',       ids:['avc-isquemico','avc-hemorragico'] },
    { id:'consciencia',     nome:'Alteração de consciência',     ids:['rebaixamento-consciencia','delirium'] },
    { id:'convulsao',       nome:'Crise convulsiva',             ids:['status-epilepticus'] },
    { id:'cefaleia-hic',    nome:'Cefaleia e pressão intracraniana', ids:['cefaleia','hipertensao-intracraniana'] },
    { id:'medula',          nome:'Déficit focal e medula',       ids:['compressao-medular','fraqueza-aguda'] },
    { id:'tontura',         nome:'Tontura',                      ids:['vertigem'] }
  ],

  gastro: [
    { id:'abdome',          nome:'Abdome agudo',                 ids:['abdome-agudo','apendicite','diverticulite','obstrucao-intestinal','isquemia-mesenterica','ruptura-esofago'] },
    { id:'hemorragia',      nome:'Hemorragia digestiva',         ids:['hda','hdb'] },
    { id:'biliar',          nome:'Pâncreas e via biliar',        ids:['pancreatite','colecistite-colangite'] },
    { id:'figado',          nome:'Fígado',                       ids:['cirrose-descompensada'] },
    { id:'diarreia',        nome:'Diarreia',                     ids:['diarreia-aguda'] }
  ],

  infecto: [
    { id:'sepse-neutro',    nome:'Sepse e neutropenia',          ids:['sepse','neutropenia-febril'] },
    { id:'febril',          nome:'Síndrome febril',              ids:['sindrome-febril','dengue'] },
    { id:'pele',            nome:'Pele e partes moles',          ids:['celulite-erisipela','fasciite-necrotizante'] },
    { id:'snc',             nome:'Sistema nervoso central',      ids:['meningite'] },
    { id:'urinaria',        nome:'Trato urinário',               ids:['itu'] },
    { id:'cardio-resp',     nome:'Coração e pulmão',             ids:['endocardite','tuberculose-ps'] },
    { id:'atb-profilaxia',  nome:'Antibióticos e profilaxias',   ids:['antibioticoterapia-empirica','profilaxia-pos-exposicao'] }
  ],

  endocrino: [
    { id:'hiper',           nome:'Hiperglicemia',                ids:['cetoacidose','estado-hiperosmolar','hiperglicemia-simples'] },
    { id:'hipo',            nome:'Hipoglicemia',                 ids:['hipoglicemia'] },
    { id:'tireoide',        nome:'Tireoide',                     ids:['crise-tireotoxica','coma-mixedematoso'] },
    { id:'adrenal',         nome:'Adrenal',                      ids:['insuficiencia-adrenal'] }
  ],

  nefro: [
    { id:'funcao-renal',    nome:'Função renal',                 ids:['lesao-renal-aguda','indicacao-dialise','rabdomiolise'] },
    { id:'potassio',        nome:'Potássio',                     ids:['hipercalemia','hipocalemia'] },
    { id:'sodio',           nome:'Sódio',                        ids:['hiponatremia','hipernatremia'] },
    { id:'calcio-ab',       nome:'Cálcio e ácido-base',          ids:['calcio','acido-base'] },
    { id:'urologia',        nome:'Trato urinário',               ids:['colica-renal','retencao-urinaria'] }
  ],

  psiq: [
    { id:'agitacao-psicose',nome:'Agitação e psicose',           ids:['agitacao-psicomotora','surto-psicotico'] },
    { id:'suicidio',        nome:'Risco de suicídio',            ids:['risco-suicidio'] },
    { id:'substancias',     nome:'Álcool e substâncias',         ids:['abstinencia-alcool'] },
    { id:'ansiedade',       nome:'Ansiedade',                    ids:['crise-ansiedade'] }
  ],

  trauma: [
    { id:'inicial',         nome:'Atendimento inicial',          ids:['atendimento-trauma'] },
    { id:'segmentos',       nome:'Trauma por segmento',          ids:['tce','trauma-toracico','trauma-abdominal','trauma-raquimedular'] },
    { id:'ortopedia',       nome:'Ortopedia',                    ids:['fratura-exposta','luxacoes','sindrome-compartimental','entorse-tornozelo'] },
    { id:'partes-moles',    nome:'Pele e partes moles',          ids:['queimaduras','ferimentos-sutura','mordeduras'] }
  ],

  pedia: [
    { id:'emerg-pedia',     nome:'Emergência pediátrica',        ids:['pcr-pediatrica','crianca-gravemente-doente','sepse-pediatrica'] },
    { id:'resp-pedia',      nome:'Respiratório',                 ids:['bronquiolite','asma-pedia','laringite','ivas-pedia'] },
    { id:'digestivo-pedia', nome:'Desidratação e digestivo',     ids:['desidratacao-crianca','gastroenterite-pedia'] },
    { id:'febre-convulsao', nome:'Febre e convulsão',            ids:['febre-sem-foco','convulsao-febril'] },
    { id:'protecao',        nome:'Proteção da criança',          ids:['maus-tratos'] }
  ],
  obstetricia: [
    { id:'hipertensao-gestacao',  nome:'Hipertensão na gestação',      ids:['pre-eclampsia'] },
    { id:'hemorragia-obstetrica', nome:'Hemorragia obstétrica',        ids:['sangramento-gestacao','hemorragia-pos-parto'] }
  ],

  toxico: [
    { id:'geral',           nome:'Abordagem geral',              ids:['intoxicado-abordagem'] },
    { id:'medicamentos',    nome:'Medicamentos',                 ids:['paracetamol','triciclicos','benzo-opioide'] },
    { id:'drogas',          nome:'Álcool e drogas',              ids:['alcool-metanol','cocaina-estimulantes'] },
    { id:'gases',           nome:'Agrotóxicos e gases',          ids:['organofosforado','monoxido-carbono'] },
    { id:'sindromes',       nome:'Síndromes por fármaco',        ids:['sindrome-serotoninergica'] },
    { id:'animais',         nome:'Animais peçonhentos',          ids:['acidente-ofidico','acidente-escorpiao-aranha'] }
  ],

  proced: [
    { id:'via-aerea',       nome:'Via aérea e ventilação',       ids:['sequencia-rapida-intubacao','via-aerea-dificil','ventilacao-mecanica-inicial'] },
    { id:'acessos',         nome:'Acessos vasculares',           ids:['acesso-venoso-central','acesso-intraosseo'] },
    { id:'puncoes',         nome:'Punções e drenagens',          ids:['drenagem-torax','toracocentese','paracentese','puncao-lombar'] },
    { id:'analgesia',       nome:'Analgesia e sedação',          ids:['sedacao-analgesia','analgesia-ps','anestesia-local'] },
    { id:'eletrico',        nome:'Cardioversão',                 ids:['cardioversao-desfibrilacao'] },
    { id:'beira-leito',     nome:'Beira do leito',               ids:['ecg-leitura','pocus','sondagens'] }
  ]

};
