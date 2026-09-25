/* ===========================================================
   FERRAMENTAS DO PLANTAO — base de conteudo
   Tudo que aparece na aba "Ferramentas" nasce daqui.
   O usuario pode adicionar/editar/apagar pela propria tela; o que
   ele mexer fica no aparelho (localStorage) e vence estes padroes.
   Para repor o padrao de uma pasta: botao "Restaurar padrao".
   =========================================================== */

/* ---------------------------------------------------------------
   1. PASTAS DE TEXTO (tocar no cartao = copiar)
   Cada item: { id, label, sub, texto, hora:true }
   `hora:true` troca {HORA} pelo horario do clique.
   `{DATA}` tambem e substituido.
   --------------------------------------------------------------- */
var FERR_CARDS = {

  /* ---------- modelos de anamnese ---------- */
  anamnese: [
    { id:'an-h', label:'Anamnese — Homem', sub:'BEG masculino, sistemas completos', texto:
`Paciente do sexo masculino, comparece ao pronto atendimento com queixa acima descrita, iniciada há [tempo], de caráter [contínuo/intermitente], intensidade [leve/moderada/intensa], sem irradiação evidente.
Nega febre, dispneia, dor torácica, palpitações, síncope, vômitos, diarreia, disúria, hematúria ou alteração do hábito intestinal. Nega trauma recente.
Nega comorbidades prévias, uso contínuo de medicações, alergias medicamentosas e cirurgias prévias. Nega tabagismo, etilismo e uso de drogas ilícitas. Imunização referida em dia.

EXAME FÍSICO
Bom estado geral, lúcido e orientado em tempo e espaço, corado, hidratado, anictérico, acianótico, afebril ao toque, eupneico em ar ambiente.
ACV: ritmo cardíaco regular em 2 tempos, bulhas normofonéticas, sem sopros. Pulsos periféricos cheios e simétricos. Tempo de enchimento capilar menor que 3 segundos.
AR: murmúrio vesicular universalmente audível, sem ruídos adventícios. Expansibilidade preservada e simétrica.
ABD: plano, flácido, ruídos hidroaéreos presentes, indolor à palpação superficial e profunda, sem massas ou visceromegalias, descompressão brusca negativa.
MMII: sem edema, panturrilhas livres e indolores, sem sinais de trombose venosa profunda.
NEURO: Glasgow 15, pupilas isocóricas e fotorreagentes, sem déficit motor ou sensitivo focal, sem sinais meníngeos.` },

    { id:'an-m', label:'Anamnese — Mulher', sub:'BEG feminino, inclui gestação/amamentação', texto:
`Paciente do sexo feminino, comparece ao pronto atendimento com queixa acima descrita, iniciada há [tempo], de caráter [contínuo/intermitente], intensidade [leve/moderada/intensa], sem irradiação evidente.
Nega febre, dispneia, dor torácica, palpitações, síncope, vômitos, diarreia, disúria, hematúria ou alteração do hábito intestinal. Nega trauma recente.
Nega comorbidades prévias, uso contínuo de medicações, alergias medicamentosas e cirurgias prévias. Nega tabagismo, etilismo e uso de drogas ilícitas. Imunização referida em dia.
Antecedentes gineco-obstétricos: G[ ] P[ ] A[ ]. DUM em [data]. Nega atraso menstrual. Nega possibilidade de gestação atual e nega amamentação. Refere método contraceptivo [   ].

EXAME FÍSICO
Bom estado geral, lúcida e orientada em tempo e espaço, corada, hidratada, anictérica, acianótica, afebril ao toque, eupneica em ar ambiente.
ACV: ritmo cardíaco regular em 2 tempos, bulhas normofonéticas, sem sopros. Pulsos periféricos cheios e simétricos. Tempo de enchimento capilar menor que 3 segundos.
AR: murmúrio vesicular universalmente audível, sem ruídos adventícios. Expansibilidade preservada e simétrica.
ABD: plano, flácido, ruídos hidroaéreos presentes, indolor à palpação superficial e profunda, sem massas ou visceromegalias, descompressão brusca negativa.
MMII: sem edema, panturrilhas livres e indolores, sem sinais de trombose venosa profunda.
NEURO: Glasgow 15, pupilas isocóricas e fotorreagentes, sem déficit motor ou sensitivo focal, sem sinais meníngeos.` },

    { id:'an-c', label:'Anamnese + exame completo', sub:'Queixa inespecífica, exame por segmentos', texto:
`QUEIXA PRINCIPAL: [   ] há [tempo].

HISTÓRIA DA DOENÇA ATUAL
Paciente relata início [súbito/insidioso] do quadro há [tempo], caracterizado por [   ]. Refere fatores de melhora com [   ] e piora com [   ]. Sintomas associados: [   ]. Nega sintomas de alarme. Procurou atendimento por [   ]. Já fez uso de [   ] sem melhora significativa.

ANTECEDENTES
Comorbidades: [   ]. Medicações em uso contínuo: [   ]. Alergias: nega. Cirurgias prévias: [   ]. Internações prévias: [   ].
Hábitos: tabagismo [   ], etilismo [   ], drogas ilícitas [   ], atividade física [   ].

EXAME FÍSICO
Sinais vitais: PA [   ] mmHg, FC [   ] bpm, FR [   ] irpm, SatO2 [   ]% em ar ambiente, Tax [   ] °C, HGT [   ] mg/dL, dor [   ]/10.
Geral: bom estado geral, lúcido e orientado, corado, hidratado, anictérico, acianótico, eupneico.
Cabeça e pescoço: sem linfonodomegalias palpáveis, tireoide não palpável, sem turgência jugular.
ACV: ritmo cardíaco regular em 2 tempos, bulhas normofonéticas, sem sopros.
AR: murmúrio vesicular universalmente audível, sem ruídos adventícios.
ABD: plano, flácido, ruídos hidroaéreos presentes, indolor, sem massas ou visceromegalias, Blumberg negativo, Giordano negativo bilateralmente.
MMII: sem edema, perfundidos, panturrilhas livres.
NEURO: Glasgow 15, sem déficits focais, sem sinais meníngeos.
Pele: sem lesões, sem exantemas, sem petéquias.` },

    { id:'an-ped', label:'Anamnese — Pediatria', sub:'Acompanhado do responsável', texto:
`Paciente de [idade], sexo [   ], trazido ao pronto atendimento pela mãe/responsável, que refere [   ] há [tempo].
Refere aceitação alimentar [preservada/reduzida], diurese [presente/reduzida], evacuações [   ], atividade e interação [preservadas/reduzidas], sono [   ]. Nega vômitos, diarreia, dispneia, convulsão ou sonolência excessiva.
Antecedentes: nascido de parto [   ], a termo, sem intercorrências perinatais. Vacinação em dia conforme caderneta apresentada. Desenvolvimento neuropsicomotor adequado para a idade. Nega comorbidades, internações prévias e alergias.
Peso aferido nesta consulta: [   ] kg.

EXAME FÍSICO
Bom estado geral, ativo, reativo, corado, hidratado, anictérico, acianótico, eupneico em ar ambiente, sem sinais de esforço respiratório.
Sinais vitais: FC [   ] bpm, FR [   ] irpm, SatO2 [   ]%, Tax [   ] °C.
ACV: ritmo cardíaco regular, bulhas normofonéticas, sem sopros, pulsos cheios, TEC menor que 3 segundos.
AR: murmúrio vesicular universalmente audível, sem ruídos adventícios, sem tiragem, sem batimento de asa nasal.
ABD: plano, flácido, indolor, sem visceromegalias.
ORL: orofaringe sem hiperemia ou exsudato, otoscopia bilateral com membranas timpânicas translúcidas e sem abaulamento.
NEURO: ativo, reativo, sem sinais meníngeos, fontanela [normotensa/fechada].
Pele: sem exantemas, sem petéquias, turgor preservado.` },

    { id:'an-torax', label:'Anamnese — Dor torácica', sub:'Dirigida às quatro causas que matam',
      texto:'Paciente comparece ao pronto atendimento com dor torácica iniciada há [tempo], de início [súbito/gradual], localizada em [retroesternal/precordial/hemitórax], caráter [aperto/pontada/queimação/lancinante], intensidade [0-10], com irradiação para [ombro/mandíbula/dorso/membro superior esquerdo/ausente].\nFatores de piora: [esforço/repouso/inspiração/decúbito/palpação]. Fatores de melhora: [repouso/nitrato/analgésico/nenhum]. Sintomas associados: [sudorese/náusea/vômito/dispneia/síncope/palpitações].\nNega dor de início explosivo e máxima já no começo, nega assimetria de força ou de sensibilidade, nega hemoptise e nega imobilização prolongada, cirurgia recente ou trombose prévia.\nFatores de risco cardiovascular: [hipertensão/diabetes/dislipidemia/tabagismo/história familiar de doença coronariana precoce/nenhum]. Nega uso de inibidor de fosfodiesterase nas últimas 24 a 48 h. Nega uso de cocaína.\nAntecedentes: [comorbidades], em uso de [medicações]. Nega alergias medicamentosas.\n\nEXAME FÍSICO\n[Bom/regular/mau] estado geral, lúcido e orientado, corado, hidratado, [eupneico/dispneico] em ar ambiente.\nSinais vitais: PA [__/__] mmHg no MSD e [__/__] mmHg no MSE, FC [__] bpm, FR [__] irpm, SpO2 [__]% em ar ambiente, Tax [__] °C.\nACV: ritmo cardíaco regular em 2 tempos, bulhas normofonéticas, sem sopros, sem atrito pericárdico, sem B3 ou B4. Pulsos periféricos cheios e simétricos nos quatro membros, sem déficit de pulso.\nAR: murmúrio vesicular universalmente audível, sem ruídos adventícios, sem atrito pleural. Expansibilidade simétrica.\nJugulares: sem turgência a 45 graus. Sem pulso paradoxal.\nParede torácica: sem dor à palpação, sem lesões de pele.\nMMII: sem edema assimétrico, panturrilhas livres e indolores.\nECG de 12 derivações realizado em [__] minutos do primeiro contato: [ritmo, FC, eixo, supra/infra de ST, ondas T, BRE novo].' },

    { id:'an-abd', label:'Anamnese — Dor abdominal', sub:'Abdome agudo e diferenciais',
      texto:'Paciente comparece ao pronto atendimento com dor abdominal iniciada há [tempo], de início [súbito/gradual], localizada em [epigástrio/hipocôndrio direito/hipocôndrio esquerdo/mesogástrio/flanco/fossa ilíaca direita/fossa ilíaca esquerda/hipogástrio/difusa], caráter [cólica/contínua/queimação], intensidade [0-10], com irradiação para [dorso/ombro/virilha/ausente].\nFatores de piora: [alimentação/jejum/movimento/palpação]. Fatores de melhora: [posição/analgésico/evacuação/nenhum].\nSintomas associados: [náusea/vômito/parada de eliminação de gases e fezes/distensão/diarreia/melena/hematoquezia/febre/icterícia/colúria/acolia/disúria/hematúria].\nÚltima evacuação há [tempo], hábito intestinal [habitual/alterado]. Última refeição há [tempo].\nNega dor desproporcional ao exame, nega sangramento digestivo prévio e nega perda ponderal.\nMulher em idade fértil: DUM em [data], método contraceptivo [__], nega possibilidade de gestação. Beta-HCG [solicitado/resultado].\nAntecedentes: [cirurgias abdominais prévias], [comorbidades], em uso de [medicações, incluindo anti-inflamatório e anticoagulante]. Nega alergias medicamentosas. Etilismo [nega/refere].\n\nEXAME FÍSICO\n[Bom/regular/mau] estado geral, lúcido e orientado, [corado/descorado], hidratado, [anictérico/ictérico +/4], eupneico.\nSinais vitais: PA [__/__] mmHg, FC [__] bpm, FR [__] irpm, SpO2 [__]%, Tax [__] °C.\nABD: [plano/globoso/distendido], [flácido/tenso], ruídos hidroaéreos [presentes/aumentados/ausentes], [doloroso/indolor] à palpação superficial e profunda em [local], [com/sem] defesa involuntária, descompressão brusca [positiva/negativa] em [local], sem massas ou visceromegalias palpáveis, Murphy [positivo/negativo], Blumberg [positivo/negativo], Giordano [positivo/negativo] bilateralmente.\nRegião inguinal e umbilical: sem hérnias, sem abaulamentos.\nACV: ritmo cardíaco regular em 2 tempos, sem sopros. AR: murmúrio vesicular presente bilateralmente, bases livres.\nMMII: sem edema. Perfusão periférica preservada, enchimento capilar menor que 3 segundos.\nToque retal: [realizado/não realizado] — [achados].' },

    { id:'an-disp', label:'Anamnese — Dispneia', sub:'Falta de ar aguda',
      texto:'Paciente comparece ao pronto atendimento com dispneia iniciada há [tempo], de instalação [súbita/progressiva], em [repouso/aos esforços], classe funcional [I-IV], associada a [tosse seca/tosse produtiva com expectoração __/chiado/dor torácica/febre/edema de membros].\nRefere [ortopneia/dispneia paroxística noturna/nega]. Nega hemoptise. Nega engasgo ou aspiração. Nega contato com alérgeno, picada, medicação nova ou alimento suspeito nas últimas horas.\nNega imobilização prolongada, cirurgia recente, viagem longa, neoplasia ativa, trombose prévia ou uso de anticoncepcional.\nAntecedentes: [asma/DPOC/insuficiência cardíaca/tabagismo com __ anos-maço/nenhum], em uso de [medicações]. Internações prévias por quadro semelhante: [__]. Uso domiciliar de oxigênio: [sim/não]. Nega alergias medicamentosas.\n\nEXAME FÍSICO\n[Bom/regular/mau] estado geral, [lúcido e orientado/sonolento/agitado], [corado/descorado], [acianótico/cianótico], [eupneico/dispneico], [com/sem] uso de musculatura acessória, [consegue/não consegue] falar frases completas.\nSinais vitais: PA [__/__] mmHg, FC [__] bpm, FR [__] irpm, SpO2 [__]% em [ar ambiente/O2 __ L/min], Tax [__] °C.\nAR: murmúrio vesicular [universalmente audível/diminuído em __/abolido em __], [sem ruídos adventícios/sibilos difusos/estertores crepitantes em bases/roncos], expansibilidade [simétrica/assimétrica], percussão [timpânica/maciça] em [local], frêmito toracovocal [preservado/aumentado/diminuído].\nACV: ritmo cardíaco regular em 2 tempos, bulhas [normofonéticas/hipofonéticas], [sem sopros/sopro __], B3 [presente/ausente].\nJugulares: [sem turgência/turgência jugular a 45 graus]. Refluxo hepatojugular [presente/ausente].\nABD: sem visceromegalias, [sem/com] hepatomegalia dolorosa.\nMMII: [sem edema/edema __/4 bilateral e simétrico/edema assimétrico em __], panturrilhas [livres/empastadas].\nECG e radiografia de tórax: [achados]. Gasometria arterial: [achados].' },

    { id:'an-neuro', label:'Anamnese — Déficit neurológico', sub:'AVC, cefaleia e alteração de consciência',
      texto:'Paciente comparece ao pronto atendimento com [déficit focal/cefaleia/alteração do nível de consciência/crise convulsiva] iniciado há [tempo].\nÚltimo horário visto bem: [hora] — informado por [paciente/acompanhante/socorrista].\nQuadro de instalação [súbita/gradual], com [hemiparesia à __/disartria/afasia/desvio de rima/hemianopsia/ataxia/parestesia em __/rebaixamento].\nCefaleia: início [súbito em trovoada/gradual], intensidade [0-10], [pior da vida/semelhante às habituais], localização [__], associada a [náusea/vômito em jato/fotofobia/fonofobia/rigidez de nuca/alteração visual].\nCrise convulsiva: [tônico-clônica generalizada/focal], duração de [__] minutos, [com/sem] liberação esfincteriana, [com/sem] mordedura lateral de língua, período pós-ictal de [__] minutos.\nGlicemia capilar na chegada: [__] mg/dL.\nNega trauma craniano recente. Nega febre. Antecedentes: [hipertensão/diabetes/fibrilação atrial/AVC ou AIT prévio/epilepsia/enxaqueca/neoplasia], em uso de [medicações, incluindo anticoagulante e antiagregante]. Adesão ao anticonvulsivante: [__]. Etilismo e uso de drogas: [nega/refere]. Nega alergias medicamentosas.\n\nEXAME FÍSICO\n[Bom/regular/mau] estado geral, [lúcido e orientado em tempo e espaço/desorientado/torporoso/comatoso].\nSinais vitais: PA [__/__] mmHg, FC [__] bpm, FR [__] irpm, SpO2 [__]%, Tax [__] °C, glicemia capilar [__] mg/dL.\nNEURO: Glasgow [__] (AO __ / RV __ / RM __). Pupilas [isocóricas e fotorreagentes/anisocóricas __ > __]. Pares cranianos [sem alterações/__]. Força muscular grau [__] em [membro], tônus [normal/aumentado/diminuído], reflexos [normoativos/exaltados/abolidos], Babinski [presente/ausente]. Sensibilidade [preservada/alterada em __]. Marcha [normal/atáxica/não avaliada]. Sinais meníngeos [ausentes/presentes]. Fundo de olho: [não realizado/papiledema ausente].\nNIHSS: [__].\nACV: ritmo cardíaco [regular/irregularmente irregular] em 2 tempos, sem sopros. Sopro carotídeo [presente/ausente].\nAR: murmúrio vesicular universalmente audível, sem ruídos adventícios.\nTomografia de crânio sem contraste: [achados].' },

    { id:'an-febre', label:'Anamnese — Síndrome febril', sub:'Busca ativa de foco e de gravidade',
      texto:'Paciente comparece ao pronto atendimento com febre iniciada há [tempo], aferida em até [__] °C, [contínua/intermitente], [com/sem] calafrios, [com/sem] resposta a antitérmico.\nSintomas localizatórios: [tosse/expectoração/dor torácica/dispneia/disúria/polaciúria/dor lombar/dor abdominal/diarreia/vômitos/cefaleia/rigidez de nuca/dor de garganta/otalgia/lesão de pele/artralgia/mialgia/exantema].\nNega dor desproporcional em partes moles, nega petéquias e nega sangramento.\nEpidemiologia: viagem recente para [__], contato com pessoa doente [__], contato com água parada, lama ou animais [__], picada de inseto [__], relação sexual desprotegida [__].\nProcedimentos e dispositivos: [cateter/sonda/prótese/cirurgia recente/nenhum]. Antibiótico nas últimas semanas: [__]. Quimioterapia ou imunossupressor: [__]. Vacinação: [em dia/__].\nAntecedentes: [comorbidades, esplenectomia, HIV, transplante], em uso de [medicações]. Nega alergias medicamentosas.\n\nEXAME FÍSICO\n[Bom/regular/mau] estado geral, [lúcido e orientado/confuso], [corado/descorado], hidratado, [anictérico/ictérico], [eupneico/taquipneico], [toxemiado/sem toxemia].\nSinais vitais: PA [__/__] mmHg, FC [__] bpm, FR [__] irpm, SpO2 [__]%, Tax [__] °C. Enchimento capilar [__] segundos. qSOFA: [__].\nORL: orofaringe [sem alterações/hiperemiada/com exsudato], amígdalas [__], otoscopia [__], sem dor à percussão de seios da face.\nCervical: linfonodos [ausentes/palpáveis em __, __ cm, __ dolorosos], rigidez de nuca [ausente/presente].\nAR: murmúrio vesicular [universalmente audível/diminuído em __], [sem ruídos adventícios/estertores em __].\nACV: ritmo cardíaco regular em 2 tempos, [sem sopros/sopro novo __].\nABD: [flácido/doloroso em __], sem visceromegalias, Giordano [positivo/negativo].\nPele: [sem lesões/exantema __/petéquias/púrpura/eritema em __, com __ cm, __ crepitação, __ bolhas], sem sinais de infecção necrotizante.\nMMII: sem edema, panturrilhas livres.\nProva do laço: [realizada/não realizada] — [resultado].' },

    { id:'an-trauma', label:'Anamnese — Trauma', sub:'Atendimento inicial, no formato ABCDE',
      texto:'Paciente vítima de [mecanismo: colisão automobilística, atropelamento, queda de __ metros, agressão, ferimento por arma branca ou de fogo] há [tempo], trazido por [meios próprios/SAMU/bombeiros].\nMecanismo detalhado: [velocidade, uso de cinto ou capacete, ejeção, óbito no local, tempo de encarceramento, superfície da queda].\nEstado no local e durante o transporte: [consciente/inconsciente], Glasgow no local [__], sangramento [__], imobilização [colar cervical/prancha/tala], acessos e volume infundido [__], medicações administradas [__].\nAMPLA: Alergias [__]; Medicações em uso, incluindo anticoagulante [__]; Passado médico e cirúrgico [__]; Líquidos e alimentos, última ingesta há [__]; Ambiente e eventos relacionados [__].\nÚltima dose de vacina antitetânica: [__].\n\nEXAME FÍSICO — ABCDE\nA — Via aérea: [pérvia/comprometida], fala [__], sem corpo estranho, sem sangramento em cavidade oral. Coluna cervical imobilizada com colar.\nB — Ventilação: FR [__] irpm, SpO2 [__]% em [ar ambiente/O2 __], expansibilidade [simétrica/assimétrica], murmúrio vesicular [presente bilateralmente/abolido em __], percussão [__], sem enfisema subcutâneo, sem desvio de traqueia.\nC — Circulação: PA [__/__] mmHg, FC [__] bpm, pulsos [cheios/filiformes], enchimento capilar [__] segundos, pele [corada e quente/pálida e fria]. Sangramentos externos [contidos/__]. FAST: [negativo/positivo em __].\nD — Neurológico: Glasgow [__] (AO __ / RV __ / RM __), pupilas [isocóricas e fotorreagentes/anisocóricas], força e sensibilidade [preservadas/déficit em __].\nE — Exposição: paciente despido e aquecido. Tax [__] °C. Inspeção do dorso em rolamento de 90 graus: [sem lesões/__].\nExame segmentar: crânio [__], face [__], tórax [__], abdome [__], pelve [estável/instável], períneo [__], membros [__, com deformidade em __, pulsos distais presentes], dorso e coluna [sem dor à palpação de processos espinhosos/__].\nRadiografias e tomografias: [achados].' }
  ],

  /* ---------- conduta / orientacoes ---------- */
  conduta: [
    { id:'cd-1', label:'Conduta padrão', sub:'Sintomático + sinais de alarme + UBS', texto:
`Prescrevo terapia sintomática conforme o quadro clínico apresentado, associada a orientações não farmacológicas: repouso relativo, hidratação oral adequada e alimentação leve e fracionada.
Oriento detalhadamente sobre os sinais de alarme que indicam retorno imediato ao pronto atendimento: piora do estado geral, febre persistente ou de difícil controle, dor de forte intensidade, vômitos incoercíveis, falta de ar, alteração do nível de consciência, ou qualquer agravamento do quadro atual.
Esclareço as dúvidas apresentadas durante a consulta quanto ao diagnóstico provável, ao tratamento proposto e ao tempo esperado de melhora.
Paciente declara ter compreendido as orientações e concorda com a conduta adotada.
Oriento acompanhamento na Unidade Básica de Saúde de referência, esclarecendo que o presente atendimento se destina à demanda aguda e não substitui o seguimento na atenção primária nem o acompanhamento especializado.` },

    { id:'cd-2', label:'Alta com retorno programado', sub:'Reavaliação em 24–48 h', texto:
`Paciente em bom estado geral, hemodinamicamente estável, sem sinais de gravidade no momento, com sintomas controlados após a conduta instituída no serviço.
Optado por alta hospitalar com tratamento domiciliar e orientação de reavaliação médica em 24 a 48 horas, ou antes disso na vigência de qualquer sinal de alarme.
Receituário e orientações escritas entregues ao paciente, que verbaliza compreensão.
Oriento retorno imediato ao pronto atendimento em caso de piora clínica.` },

    { id:'cd-3', label:'Observação em unidade', sub:'Permanece em observação', texto:
`Optado por manter o paciente em observação nesta unidade para reavaliação clínica seriada e acompanhamento da resposta terapêutica.
Paciente ciente e de acordo. Mantida monitorização de sinais vitais, acesso venoso periférico pérvio e reavaliação médica programada.
Aguardando resultado de exames complementares para definição de conduta e destino.` },

    { id:'cd-4', label:'Encaminhamento / regulação', sub:'Necessita de serviço de maior complexidade', texto:
`Diante do quadro clínico apresentado e da necessidade de avaliação e/ou recursos não disponíveis nesta unidade, procedo ao encaminhamento do paciente para serviço de referência em [especialidade/serviço].
Caso discutido e regulado junto à central de regulação, sob protocolo nº [   ], às {HORA}.
Paciente mantido estável durante todo o período de permanência nesta unidade, com as medidas de suporte já instituídas mantidas até a transferência.
Familiar/responsável comunicado e ciente da conduta.`, hora:true },

    { id:'cd-5', label:'Recusa de conduta / alta a pedido', sub:'Paciente lúcido recusa a conduta proposta', texto:
`Paciente, lúcido e orientado, com pleno discernimento e capacidade de decisão preservada no momento da avaliação, recusa a conduta médica proposta, a saber: [   ].
Foram explicados de forma clara e em linguagem acessível o diagnóstico provável, a conduta indicada, os riscos decorrentes da recusa — incluindo a possibilidade de agravamento do quadro, complicações e risco de morte — e as alternativas disponíveis.
Paciente reitera a recusa e assina o termo de responsabilidade correspondente, na presença de testemunha.
Orientado quanto ao retorno imediato ao serviço a qualquer momento, sem qualquer restrição, caso mude de decisão ou apresente piora clínica.
Horário do registro: {HORA}.`, hora:true },

    { id:'cd-6', label:'Comunicação a familiar', sub:'Registro de informação prestada', texto:
`Informado o quadro clínico, a hipótese diagnóstica, a conduta adotada e o prognóstico ao familiar/responsável, Sr(a). [nome], [grau de parentesco], às {HORA}.
Esclarecidas as dúvidas apresentadas. Familiar verbaliza compreensão das informações prestadas e concorda com a conduta.`, hora:true }
  ],

  /* ---------- evasao ---------- */
  evasao: [
    { id:'ev-1', label:'Evasão após chamadas', sub:'Padrão, com horário', texto:
`Paciente não compareceu ao consultório após três chamadas consecutivas, sendo duas realizadas por painel eletrônico e uma por chamada verbal na recepção e sala de espera.
Ausência confirmada após tempo de espera razoável, caracterizando evasão do atendimento.
Horário da evasão: {HORA}.`, hora:true },

    { id:'ev-2', label:'Evasão antes da avaliação médica', sub:'Saiu após a triagem', texto:
`Paciente registrado e classificado no acolhimento com classificação de risco, porém evadiu-se da unidade antes da avaliação médica, não sendo localizado nas dependências do serviço após chamadas sucessivas.
Não foi possível realizar anamnese, exame físico ou qualquer conduta terapêutica.
Horário da constatação: {HORA}.`, hora:true },

    { id:'ev-3', label:'Evasão durante a observação', sub:'Deixou a unidade em tratamento', texto:
`Paciente encontrava-se em observação nesta unidade, em uso de [medicação/hidratação endovenosa], quando se evadiu do serviço sem comunicar a equipe e sem receber alta médica.
Constatada a ausência durante a reavaliação programada, com acesso venoso [retirado/deixado no leito] e materiais no leito.
Realizadas buscas nas dependências da unidade, sem sucesso. Equipe de enfermagem e segurança comunicadas.
Horário da constatação: {HORA}.`, hora:true },

    { id:'ev-4', label:'Recusa de atendimento', sub:'Recusou-se a ser avaliado', texto:
`Paciente recusou-se a ser submetido à avaliação médica nesta unidade, apesar das orientações prestadas quanto à importância da avaliação e aos riscos da não realização.
Encontrava-se lúcido, orientado e sem sinais de comprometimento da capacidade de decisão no momento da abordagem.
Orientado quanto ao retorno ao serviço a qualquer momento.
Horário do registro: {HORA}.`, hora:true }
  ],

  /* ---------- laudos ---------- */
  laudos: [
    { id:'ld-rx-n', label:'RX de tórax — normal', sub:'PA e perfil sem alterações', texto:
`RADIOGRAFIA DE TÓRAX — PA E PERFIL

Técnica: incidências em póstero-anterior e perfil, com adequada inspiração, penetração e centralização.

Campos pulmonares com transparência preservada bilateralmente, sem opacidades, consolidações, nódulos ou massas.
Trama broncovascular de aspecto habitual.
Seios costofrênicos livres e bem delimitados. Cúpulas diafragmáticas de contornos regulares e em posição habitual.
Área cardíaca de dimensões normais, com índice cardiotorácico dentro dos limites da normalidade.
Hilos pulmonares de morfologia, densidade e posição habituais.
Mediastino centrado, sem alargamento.
Arcabouço ósseo e partes moles sem alterações significativas.

CONCLUSÃO: exame radiográfico do tórax sem alterações significativas.` },

    { id:'ld-rx-c', label:'RX de tórax — consolidação', sub:'Foco de condensação', texto:
`RADIOGRAFIA DE TÓRAX — PA E PERFIL

Técnica: incidências em póstero-anterior e perfil, com adequada inspiração e penetração.

Opacidade de aspecto alveolar/consolidativo em [terço médio/inferior] do [hemitórax direito/esquerdo], com broncogramas aéreos de permeio, sugerindo processo inflamatório/infeccioso pulmonar.
Demais campos pulmonares com transparência preservada.
Seios costofrênicos [livres / com velamento à direita/esquerda, sugerindo derrame pleural de pequeno volume].
Área cardíaca de dimensões normais. Mediastino centrado.
Arcabouço ósseo sem lesões evidentes.

CONCLUSÃO: consolidação em [localização], compatível com processo pneumônico. Correlacionar com o quadro clínico e laboratorial.` },

    { id:'ld-ecg-n', label:'ECG — normal', sub:'Ritmo sinusal sem alterações', texto:
`ELETROCARDIOGRAMA DE REPOUSO — 12 DERIVAÇÕES

Ritmo sinusal, frequência cardíaca de [   ] bpm.
Onda P de morfologia e duração normais, precedendo cada complexo QRS.
Intervalo PR de [   ] ms, dentro da normalidade.
Complexo QRS estreito, com duração de [   ] ms, eixo elétrico no plano frontal em torno de [   ] graus.
Progressão da onda R nas derivações precordiais preservada.
Segmento ST isoelétrico, sem supra ou infradesnivelamentos.
Onda T de polaridade habitual. Intervalo QT corrigido de [   ] ms.

CONCLUSÃO: eletrocardiograma dentro dos limites da normalidade.` },

    { id:'ld-ecg-fa', label:'ECG — fibrilação atrial', sub:'RR irregular sem onda P', texto:
`ELETROCARDIOGRAMA DE REPOUSO — 12 DERIVAÇÕES

Ritmo irregularmente irregular, com ausência de ondas P identificáveis, substituídas por ondulações da linha de base (ondas f).
Frequência ventricular média de [   ] bpm.
Complexo QRS estreito, com duração de [   ] ms.
Segmento ST sem supradesnivelamentos. Onda T sem alterações primárias evidentes.

CONCLUSÃO: fibrilação atrial com resposta ventricular [controlada / alta]. Correlacionar com o quadro clínico.` },

    { id:'ld-ecg-supra', label:'ECG — supra de ST', sub:'Achado que aciona a rede', texto:
`ELETROCARDIOGRAMA DE REPOUSO — 12 DERIVAÇÕES

Ritmo sinusal, frequência cardíaca de [   ] bpm.
Supradesnivelamento do segmento ST de [   ] mm nas derivações [   ], com imagem em espelho (infradesnivelamento recíproco) em [   ].
Complexo QRS de duração [   ] ms. Ausência de bloqueio de ramo esquerdo novo.

CONCLUSÃO: supradesnivelamento do segmento ST em parede [anterior/inferior/lateral], compatível com infarto agudo do miocárdio com supra de ST. Comunicado imediatamente à equipe assistencial e acionada a rede de reperfusão às {HORA}.`, hora:true },

    { id:'ld-rx-abd', label:'RX de abdome — normal', sub:'Agudo, três incidências', texto:
`RADIOGRAFIA DE ABDOME AGUDO

Técnica: abdome em decúbito dorsal, abdome em ortostase e tórax em PA.

Distribuição gasosa intestinal de aspecto habitual, sem distensão significativa de alças.
Ausência de níveis hidroaéreos patológicos.
Ausência de pneumoperitônio nas incidências em ortostase e em tórax.
Ausência de imagens cálcicas de projeção sobre as vias urinárias.
Contornos das lojas renais e do músculo psoas preservados bilateralmente.
Arcabouço ósseo sem lesões líticas ou blásticas evidentes.

CONCLUSÃO: exame radiográfico do abdome sem alterações significativas.` },

    { id:'ld-rx-frat', label:'RX de extremidade — fratura', sub:'Traço fraturário', texto:
`RADIOGRAFIA DE [SEGMENTO] — [INCIDÊNCIAS]

Traço fraturário [transverso/oblíquo/espiralado/cominutivo] em [terço proximal/médio/distal] do [osso], com desvio [ausente / angular de   graus / lateral de   mm] e encurtamento [ausente/presente].
Superfícies articulares [preservadas / com acometimento].
Partes moles adjacentes com [aumento de volume / sem alterações]. Ausência de corpo estranho radiopaco. Ausência de ar em partes moles.

CONCLUSÃO: fratura de [osso/segmento]. Correlacionar com o exame clínico. Avaliação ortopédica solicitada.` },

    { id:'ld-fast', label:'POCUS / FAST', sub:'À beira do leito', texto:
`ULTRASSONOGRAFIA POINT-OF-CARE (FAST) — À BEIRA DO LEITO

Exame realizado pelo médico assistente, com aparelho portátil, em caráter direcionado e complementar ao exame físico, não substituindo exame de imagem formal.

Janela hepatorrenal (Morison): sem líquido livre.
Janela esplenorrenal: sem líquido livre.
Janela pélvica (suprapúbica): sem líquido livre.
Janela subxifoide/pericárdica: ausência de derrame pericárdico. Sem sinais de tamponamento.
Pleura bilateral: deslizamento pleural presente bilateralmente, afastando pneumotórax nos pontos avaliados.

CONCLUSÃO: FAST negativo no momento do exame. Ressalta-se o caráter dinâmico do método; reavaliar em caso de deterioração clínica.` }
  ]
};

/* ---------------------------------------------------------------
   2. MANOBRAS E SINAIS (exame fisico dirigido)
   Agrupado por sistema; tocar copia a frase pronta.
   --------------------------------------------------------------- */
var FERR_EXAME = [
  /* neurologico */
  { id:'ex-n1', sistema:'Neurológico', nome:'Rigidez de nuca', desc:'Irritação meníngea', texto:'Apresenta rigidez de nuca à mobilização passiva do pescoço, com resistência e dor à flexão cervical, sugerindo irritação meníngea.' },
  { id:'ex-n2', sistema:'Neurológico', nome:'Kernig e Brudzinski', desc:'Sinais meníngeos', texto:'Sinais de Kernig e Brudzinski positivos, associados à rigidez de nuca, compatíveis com síndrome de irritação meníngea.' },
  { id:'ex-n3', sistema:'Neurológico', nome:'Manobra de Barré / pronator drift', desc:'Déficit motor sutil', texto:'À manobra dos braços estendidos (Barré/pronator drift), observa-se queda e pronação do membro superior [direito/esquerdo], sugerindo déficit motor piramidal focal.' },
  { id:'ex-n4', sistema:'Neurológico', nome:'Babinski', desc:'Reflexo cutâneo-plantar', texto:'Reflexo cutâneo-plantar em extensão (sinal de Babinski presente) à [direita/esquerda/bilateralmente], indicando lesão de via piramidal.' },
  { id:'ex-n5', sistema:'Neurológico', nome:'Hiperreflexia e clônus', desc:'Reflexos profundos', texto:'Reflexos osteotendíneos exaltados de forma difusa, com clônus inesgotável de tornozelo à [direita/esquerda].' },
  { id:'ex-n6', sistema:'Neurológico', nome:'Marcha atáxica', desc:'Coordenação', texto:'Marcha instável, com aumento da base de sustentação e desequilíbrio às mudanças de direção, compatível com padrão atáxico. Romberg [positivo/negativo].' },
  { id:'ex-n7', sistema:'Neurológico', nome:'Pupilas mióticas', desc:'Avaliação pupilar', texto:'Pupilas puntiformes bilateralmente, pouco reagentes à luz.' },
  { id:'ex-n8', sistema:'Neurológico', nome:'Pupilas midriáticas', desc:'Avaliação pupilar', texto:'Midríase bilateral, com fotorreação lentificada.' },
  { id:'ex-n9', sistema:'Neurológico', nome:'Anisocoria', desc:'Assimetria pupilar', texto:'Anisocoria, com pupila [direita/esquerda] maior e hiporreagente à luz — achado de alarme, avaliar hipertensão intracraniana e herniação.' },
  { id:'ex-n10',sistema:'Neurológico', nome:'Afasia', desc:'Linguagem', texto:'Apresenta afasia de [expressão/compreensão/mista], com discurso [não fluente/fluente porém incompreensível] e nomeação prejudicada.' },
  { id:'ex-n11',sistema:'Neurológico', nome:'Paralisia facial central', desc:'VII par', texto:'Desvio de rima labial para [direita/esquerda] com preservação da musculatura frontal do lado acometido, caracterizando paralisia facial de padrão central.' },
  { id:'ex-n12',sistema:'Neurológico', nome:'Paralisia facial periférica', desc:'VII par', texto:'Paralisia da hemiface [direita/esquerda] acometendo também a musculatura frontal, com incapacidade de fechamento ocular completo (sinal de Bell), caracterizando padrão periférico.' },

  /* cardiovascular */
  { id:'ex-c1', sistema:'Cardiovascular', nome:'Turgência jugular', desc:'Congestão sistêmica', texto:'Turgência jugular patológica a 45 graus, sugerindo aumento da pressão venosa central.' },
  { id:'ex-c2', sistema:'Cardiovascular', nome:'Refluxo hepatojugular', desc:'Congestão', texto:'Refluxo hepatojugular positivo à compressão do hipocôndrio direito sustentada por 15 segundos.' },
  { id:'ex-c3', sistema:'Cardiovascular', nome:'Pulso paradoxal', desc:'Tamponamento / asma grave', texto:'Presença de pulso paradoxal, com queda da pressão arterial sistólica superior a 10 mmHg durante a inspiração.' },
  { id:'ex-c4', sistema:'Cardiovascular', nome:'Terceira bulha (B3)', desc:'Sobrecarga de volume', texto:'Ausculta de terceira bulha (ritmo de galope), audível em foco mitral com o paciente em decúbito lateral esquerdo.' },
  { id:'ex-c5', sistema:'Cardiovascular', nome:'Sopro sistólico', desc:'Valvopatia', texto:'Sopro sistólico [ /6] em foco [aórtico/mitral], com irradiação para [carótidas/axila].' },
  { id:'ex-c6', sistema:'Cardiovascular', nome:'Assimetria de pulsos / PA', desc:'Síndrome aórtica', texto:'Assimetria de pulsos entre os membros superiores, com diferença de pressão arterial sistólica de [   ] mmHg entre os braços — atenção para síndrome aórtica aguda.' },
  { id:'ex-c7', sistema:'Cardiovascular', nome:'Má perfusão periférica', desc:'Choque', texto:'Extremidades frias e pegajosas, pulsos periféricos finos, tempo de enchimento capilar superior a 3 segundos, com livedo reticular em joelhos.' },

  /* respiratorio */
  { id:'ex-r1', sistema:'Respiratório', nome:'Sibilos difusos', desc:'Broncoespasmo', texto:'Murmúrio vesicular presente bilateralmente, com sibilos difusos inspiratórios e expiratórios e tempo expiratório prolongado.' },
  { id:'ex-r2', sistema:'Respiratório', nome:'Estertores crepitantes', desc:'Consolidação / congestão', texto:'Estertores crepitantes em [bases/terço inferior do hemitórax   ], sem sibilos associados.' },
  { id:'ex-r3', sistema:'Respiratório', nome:'MV abolido', desc:'Derrame / pneumotórax', texto:'Murmúrio vesicular abolido em [base/todo o hemitórax   ], com [macicez à percussão, sugerindo derrame pleural / hipertimpanismo à percussão, sugerindo pneumotórax].' },
  { id:'ex-r4', sistema:'Respiratório', nome:'Esforço respiratório', desc:'Sinais de gravidade', texto:'Taquipneico, com uso de musculatura acessória, tiragem intercostal e de fúrcula, batimento de asa nasal e frases entrecortadas.' },
  { id:'ex-r5', sistema:'Respiratório', nome:'Tórax silencioso', desc:'Asma quase fatal', texto:'Ausculta com murmúrio vesicular globalmente reduzido e ausência de sibilos ("tórax silencioso") em paciente com esforço respiratório importante — sinal de gravidade extrema.' },

  /* abdome */
  { id:'ex-a1', sistema:'Abdome', nome:'Blumberg', desc:'Irritação peritoneal', texto:'Descompressão brusca dolorosa em fossa ilíaca direita (sinal de Blumberg positivo).' },
  { id:'ex-a2', sistema:'Abdome', nome:'Rovsing', desc:'Apendicite', texto:'Sinal de Rovsing positivo: dor referida em fossa ilíaca direita à palpação profunda da fossa ilíaca esquerda.' },
  { id:'ex-a3', sistema:'Abdome', nome:'Psoas e obturador', desc:'Apendicite retrocecal / pélvica', texto:'Sinal do psoas [positivo/negativo] e sinal do obturador [positivo/negativo].' },
  { id:'ex-a4', sistema:'Abdome', nome:'Murphy', desc:'Colecistite', texto:'Sinal de Murphy positivo: interrupção súbita da inspiração à palpação profunda do hipocôndrio direito.' },
  { id:'ex-a5', sistema:'Abdome', nome:'Giordano', desc:'Pielonefrite', texto:'Punho-percussão lombar (Giordano) positiva à [direita/esquerda].' },
  { id:'ex-a6', sistema:'Abdome', nome:'Abdome em tábua', desc:'Peritonite difusa', texto:'Abdome tenso, com defesa involuntária generalizada e descompressão brusca dolorosa difusa ("abdome em tábua"), com ruídos hidroaéreos ausentes.' },
  { id:'ex-a7', sistema:'Abdome', nome:'Macicez móvel / piparote', desc:'Ascite', texto:'Abdome globoso, com macicez móvel de decúbito e sinal do piparote positivo, compatível com ascite.' },
  { id:'ex-a8', sistema:'Abdome', nome:'Toque retal', desc:'Registro do procedimento', texto:'Ao toque retal: tônus esfincteriano preservado, ampola retal [vazia/com fezes], sem massas palpáveis, sem sangue ou melena no dedo de luva. Procedimento explicado ao paciente, que consentiu, realizado na presença de acompanhante/técnico de enfermagem.' },

  /* ortopedia e MMII */
  { id:'ex-o1', sistema:'Ortopedia e MMII', nome:'Sinais de TVP', desc:'Membro inferior', texto:'Membro inferior [direito/esquerdo] com aumento de volume, empastamento de panturrilha, dor à palpação do trajeto venoso profundo e diferença de circunferência de [   ] cm em relação ao contralateral.' },
  { id:'ex-o2', sistema:'Ortopedia e MMII', nome:'Edema de MMII', desc:'Cacifo', texto:'Edema de membros inferiores, [simétrico/assimétrico], depressível, com cacifo [+/4+], até [tornozelos/joelhos/raiz de coxa].' },
  { id:'ex-o3', sistema:'Ortopedia e MMII', nome:'Gaveta anterior / Lachman', desc:'Joelho — LCA', texto:'Testes de gaveta anterior e de Lachman [positivos/negativos] em joelho [direito/esquerdo].' },
  { id:'ex-o4', sistema:'Ortopedia e MMII', nome:'Síndrome compartimental', desc:'Alarme', texto:'Dor desproporcional ao trauma, agravada ao estiramento passivo do compartimento, com tensão à palpação e parestesia distal — suspeita de síndrome compartimental. Avaliação ortopédica de urgência acionada às {HORA}.', hora:true },
  { id:'ex-o5', sistema:'Ortopedia e MMII', nome:'Exame neurovascular distal', desc:'Após trauma/imobilização', texto:'Após [redução/imobilização]: extremidade distal bem perfundida, com pulsos [   ] palpáveis, tempo de enchimento capilar menor que 3 segundos, sensibilidade e mobilidade dos dedos preservadas.' },

  /* geral e pele */
  { id:'ex-g1', sistema:'Geral e pele', nome:'Desidratação', desc:'Turgor e mucosas', texto:'Mucosas hipocoradas e desidratadas, turgor cutâneo diminuído com sinal da prega presente, olhos encovados.' },
  { id:'ex-g2', sistema:'Geral e pele', nome:'Exantema petequial', desc:'Alarme infeccioso', texto:'Lesões petequiais não desaparecendo à digitopressão, distribuídas em [tronco/membros], em paciente febril — atenção para meningococcemia.' },
  { id:'ex-g3', sistema:'Geral e pele', nome:'Icterícia', desc:'Escleras', texto:'Icterícia de escleras [+/4+], com colúria referida e acolia fecal [presente/ausente].' },
  { id:'ex-g4', sistema:'Geral e pele', nome:'Celulite / erisipela', desc:'Pele e partes moles', texto:'Área de eritema, calor e edema em [local], com bordas [bem delimitadas — sugerindo erisipela / mal delimitadas — sugerindo celulite], demarcada a caneta às {HORA} para acompanhamento da progressão. Sem crepitação, sem bolhas, sem necrose.', hora:true },
  { id:'ex-g5', sistema:'Geral e pele', nome:'Prova do laço', desc:'Dengue', texto:'Prova do laço [positiva com   petéquias em polegada / negativa], realizada com manguito na PAM por 5 minutos.' }
];

/* ---------------------------------------------------------------
   3. PRESCRICAO ORAL — categorias e medicamentos
   --------------------------------------------------------------- */
var FERR_PO = [
  { categoria:'Analgésicos e antitérmicos', meds:[
    { nome:'Dipirona 500 mg comprimido',            uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias.' },
    { nome:'Dipirona 500 mg/mL solução oral',       uso:'Tomar 30 gotas VO de 6/6 h, se dor ou febre, por 5 dias.' },
    { nome:'Paracetamol 500 mg comprimido',         uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias. Máximo de 3 g ao dia.' },
    { nome:'Paracetamol 500 mg + codeína 30 mg',    uso:'Tomar 1 comprimido VO de 6/6 h, se dor intensa, por 3 dias.' },
    { nome:'Tramadol 50 mg cápsula',                uso:'Tomar 1 cápsula VO de 8/8 h, se dor intensa, por 3 dias.' }
  ]},
  { categoria:'Anti-inflamatórios (AINEs)', meds:[
    { nome:'Ibuprofeno 600 mg comprimido',          uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 3 dias.' },
    { nome:'Diclofenaco sódico 50 mg comprimido',   uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 3 dias.' },
    { nome:'Cetoprofeno 100 mg comprimido',         uso:'Tomar 1 comprimido VO de 12/12 h, após as refeições, por 3 dias.' },
    { nome:'Naproxeno 500 mg comprimido',           uso:'Tomar 1 comprimido VO de 12/12 h, após as refeições, por 5 dias.' },
    { nome:'Nimesulida 100 mg comprimido',          uso:'Tomar 1 comprimido VO de 12/12 h, após as refeições, por 3 dias.', faltaSus:true }
  ]},
  { categoria:'Antiespasmódicos', meds:[
    { nome:'Escopolamina 10 mg comprimido',         uso:'Tomar 1 comprimido VO de 8/8 h, se cólica, por 3 dias.' },
    { nome:'Escopolamina + dipirona comprimido',    uso:'Tomar 1 comprimido VO de 8/8 h, se cólica, por 3 dias.' }
  ]},
  { categoria:'Antieméticos', meds:[
    { nome:'Metoclopramida 10 mg comprimido',       uso:'Tomar 1 comprimido VO de 8/8 h, se náusea, por 3 dias.' },
    { nome:'Ondansetrona 4 mg comprimido',          uso:'Tomar 1 comprimido VO de 8/8 h, se náusea ou vômito, por 3 dias.' },
    { nome:'Dimenidrinato + piridoxina solução',    uso:'Tomar 40 gotas VO de 8/8 h, se náusea ou tontura, por 3 dias.' },
    { nome:'Bromoprida 10 mg cápsula',              uso:'Tomar 1 cápsula VO de 8/8 h, antes das refeições, por 5 dias.' }
  ]},
  { categoria:'Antialérgicos', meds:[
    { nome:'Loratadina 10 mg comprimido',           uso:'Tomar 1 comprimido VO 1 vez ao dia, por 7 dias.' },
    { nome:'Dexclorfeniramina 2 mg comprimido',     uso:'Tomar 1 comprimido VO de 8/8 h, por 5 dias. Pode causar sonolência.' },
    { nome:'Prednisona 20 mg comprimido',           uso:'Tomar 2 comprimidos VO 1 vez ao dia, pela manhã, após o café, por 5 dias.' },
    { nome:'Prednisolona 3 mg/mL solução oral',     uso:'Tomar [   ] mL VO 1 vez ao dia, pela manhã, por 5 dias.' }
  ]},
  { categoria:'Gastroprotetores e digestivos', meds:[
    { nome:'Omeprazol 20 mg cápsula',               uso:'Tomar 1 cápsula VO 1 vez ao dia, em jejum, 30 minutos antes do café, por 14 dias.' },
    { nome:'Pantoprazol 40 mg comprimido',          uso:'Tomar 1 comprimido VO 1 vez ao dia, em jejum, por 14 dias.' },
    { nome:'Hidróxido de alumínio suspensão',       uso:'Tomar 10 mL VO de 8/8 h, se dispepsia, por 5 dias.' },
    { nome:'Simeticona 75 mg/mL gotas',             uso:'Tomar 20 gotas VO de 8/8 h, se distensão abdominal, por 5 dias.' }
  ]},
  { categoria:'Antibióticos', meds:[
    { nome:'Amoxicilina 500 mg cápsula',            uso:'Tomar 1 cápsula VO de 8/8 h por 7 dias.' },
    { nome:'Amoxicilina + clavulanato 875/125 mg',  uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias.' },
    { nome:'Azitromicina 500 mg comprimido',        uso:'Tomar 1 comprimido VO 1 vez ao dia por 5 dias.' },
    { nome:'Cefalexina 500 mg cápsula',             uso:'Tomar 1 cápsula VO de 6/6 h por 7 dias.' },
    { nome:'Ciprofloxacino 500 mg comprimido',      uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias.' },
    { nome:'Sulfametoxazol + trimetoprima 800/160', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias.' },
    { nome:'Metronidazol 400 mg comprimido',        uso:'Tomar 1 comprimido VO de 8/8 h por 7 dias. Não ingerir álcool durante o tratamento.' },
    { nome:'Nitrofurantoína 100 mg cápsula',        uso:'Tomar 1 cápsula VO de 6/6 h por 5 dias.' },
    { nome:'Doxiciclina 100 mg comprimido',         uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias.' },
    { nome:'Fosfomicina 3 g sachê',                 uso:'Diluir 1 sachê em 1 copo de água e tomar VO em dose única, à noite, após esvaziar a bexiga.' }
  ]},
  { categoria:'Respiratório', meds:[
    { nome:'Salbutamol spray 100 mcg',              uso:'Inalar 2 jatos de 4/4 h, se falta de ar ou chiado, com espaçador, por 5 dias.' },
    { nome:'Budesonida + formoterol inalador',      uso:'Inalar 1 jato de 12/12 h, de uso contínuo. Bochechar após o uso.' },
    { nome:'Prednisona 20 mg comprimido (crise)',   uso:'Tomar 2 comprimidos VO 1 vez ao dia, pela manhã, por 5 dias.' },
    { nome:'Acetilcisteína 600 mg envelope',        uso:'Dissolver 1 envelope em água e tomar VO 1 vez ao dia por 7 dias.' }
  ]},
  { categoria:'Antivertiginosos', meds:[
    { nome:'Betaistina 24 mg comprimido',           uso:'Tomar 1 comprimido VO de 12/12 h por 15 dias.' },
    { nome:'Meclizina 25 mg comprimido',            uso:'Tomar 1 comprimido VO de 12/12 h, se tontura, por 5 dias.' },
    { nome:'Flunarizina 10 mg comprimido',          uso:'Tomar 1 comprimido VO 1 vez ao dia, à noite, por 30 dias.' }
  ]},
  { categoria:'Laxantes e antidiarreicos', meds:[
    { nome:'Sais de reidratação oral (envelope)',   uso:'Diluir 1 envelope em 1 litro de água filtrada e tomar 1 copo após cada evacuação líquida.' },
    { nome:'Lactulose 667 mg/mL xarope',            uso:'Tomar 15 mL VO 1 vez ao dia, à noite, por 7 dias.' },
    { nome:'Bisacodil 5 mg drágea',                 uso:'Tomar 1 a 2 drágeas VO à noite, se constipação.' },
    { nome:'Racecadotrila 100 mg cápsula',          uso:'Tomar 1 cápsula VO de 8/8 h, por até 5 dias.', faltaSus:true }
  ]},
  { categoria:'Tópicos', meds:[
    { nome:'Neomicina + bacitracina pomada',        uso:'Aplicar fina camada no local de 8/8 h, após limpeza com soro fisiológico, por 7 dias.' },
    { nome:'Dexametasona creme 1 mg/g',             uso:'Aplicar fina camada na lesão de 12/12 h, por 7 dias.' },
    { nome:'Cetoconazol creme 20 mg/g',             uso:'Aplicar na lesão e ao redor de 12/12 h, por 21 dias.' },
    { nome:'Permetrina 50 mg/mL loção',             uso:'Aplicar do pescoço aos pés à noite, deixar agir por 8 h e enxaguar. Repetir após 7 dias.' }
  ]},
  { categoria:'Analgesia oftalmo e ORL', meds:[
    { nome:'Tobramicina colírio 3 mg/mL',           uso:'Instilar 1 gota no olho acometido de 4/4 h por 7 dias.' },
    { nome:'Lubrificante ocular colírio',           uso:'Instilar 1 gota no olho acometido de 4/4 h, se desconforto.' },
    { nome:'Ciprofloxacino otológico',              uso:'Instilar 3 gotas no ouvido acometido de 12/12 h por 7 dias.' }
  ]}
];

/* ---------------------------------------------------------------
   4. PRESCRICAO IM
   --------------------------------------------------------------- */
var FERR_IM = [
  { id:'im01', label:'Dipirona',              value:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'im02', label:'Diclofenaco',           value:'DICLOFENACO DE SÓDIO 25 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML' },
  { id:'im03', label:'Cetoprofeno',           value:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA' },
  { id:'im04', label:'Tramadol',              value:'TRAMADOL CLORIDRATO 50 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'im05', label:'Escopolamina simples',  value:'BUTILBROMETO DE ESCOPOLAMINA 20 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML' },
  { id:'im06', label:'Escopolamina composta', value:'BUTILBROMETO DE ESCOPOLAMINA 4 MG/ML + DIPIRONA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 5 ML' },
  { id:'im07', label:'Metoclopramida',        value:'METOCLOPRAMIDA 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'im08', label:'Ondansetrona',          value:'ONDANSETRONA CLORIDRATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'im09', label:'Prometazina',           value:'PROMETAZINA CLORIDRATO 25 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'im10', label:'Dexametasona',          value:'DEXAMETASONA FOSFATO 4 MG/ML SOLUÇÃO INJETÁVEL AMP 2,5 ML' },
  { id:'im11', label:'Hidrocortisona 100 mg', value:'HIDROCORTISONA SUCCINATO 100 MG PÓ PARA SOLUÇÃO INJETÁVEL FA' },
  { id:'im12', label:'Hidrocortisona 500 mg', value:'HIDROCORTISONA SUCCINATO 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA' },
  { id:'im13', label:'Adrenalina',            value:'EPINEFRINA 1 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML' },
  { id:'im14', label:'Morfina 10 mg/mL',      value:'MORFINA SULFATO 10 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML' },
  { id:'im15', label:'Haloperidol',           value:'HALOPERIDOL 5 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML' },
  { id:'im16', label:'Penicilina benzatina',  value:'BENZILPENICILINA BENZATINA 1.200.000 UI PÓ PARA SUSPENSÃO INJETÁVEL FA' },
  { id:'im17', label:'Ceftriaxona 1 g',       value:'CEFTRIAXONA SÓDICA 1 G PÓ PARA SOLUÇÃO INJETÁVEL FA' },
  { id:'im18', label:'Vitamina B12',          value:'CIANOCOBALAMINA 2,5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'im19', label:'Diazepam',              value:'DIAZEPAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'im20', label:'Toxoide tetânico (dT)', value:'VACINA DIFTERIA E TÉTANO ADULTO (dT) SUSPENSÃO INJETÁVEL DOSE 0,5 ML' }
];

/* ---------------------------------------------------------------
   5. PRESCRICAO EV — grupos, ampolas e solucoes
   tipo: 'ampola' (conta ampolas) | 'solucao' (escolhe volume)
   --------------------------------------------------------------- */
var FERR_EV_ORDEM = [
  'Soluções de volume','Glicose','Analgésicos','Antieméticos','Corticosteroides',
  'Protetor gástrico','Antibióticos','Anticonvulsivantes e sedativos','Cardiovascular',
  'Antídotos','Vitaminas e eletrólitos'
];

var FERR_EV = [
  { id:'ev01', grupo:'Soluções de volume', label:'Soro fisiológico 0,9%', value:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', tipo:'solucao', volumes:['100 mL','250 mL','500 mL','1000 mL'] },
  { id:'ev02', grupo:'Soluções de volume', label:'Ringer lactato',        value:'SOLUÇÃO DE RINGER COM LACTATO', tipo:'solucao', volumes:['250 mL','500 mL','1000 mL'] },
  { id:'ev03', grupo:'Soluções de volume', label:'Soro glicosado 5%',     value:'GLICOSE 5% SOLUÇÃO INJETÁVEL', tipo:'solucao', volumes:['250 mL','500 mL'] },
  { id:'ev04', grupo:'Glicose',            label:'Glicose 50%',           value:'GLICOSE 50% SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev05', grupo:'Glicose',            label:'Glicose 25%',           value:'GLICOSE 25% SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev06', grupo:'Analgésicos',        label:'Dipirona',              value:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev07', grupo:'Analgésicos',        label:'Escopolamina + dipirona', value:'BUTILBROMETO DE ESCOPOLAMINA 4 MG/ML + DIPIRONA 500 MG/ML AMP 5 ML', tipo:'ampola' },
  { id:'ev08', grupo:'Analgésicos',        label:'Escopolamina',          value:'BUTILBROMETO DE ESCOPOLAMINA 20 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', tipo:'ampola' },
  { id:'ev09', grupo:'Analgésicos',        label:'Cetoprofeno',           value:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev10', grupo:'Analgésicos',        label:'Tramadol',              value:'TRAMADOL CLORIDRATO 50 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev11', grupo:'Analgésicos',        label:'Morfina 10 mg/mL',      value:'MORFINA SULFATO 10 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev12', grupo:'Analgésicos',        label:'Fentanil',              value:'FENTANILA CITRATO 50 MCG/ML SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev13', grupo:'Antieméticos',       label:'Metoclopramida',        value:'METOCLOPRAMIDA 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev14', grupo:'Antieméticos',       label:'Ondansetrona',          value:'ONDANSETRONA CLORIDRATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev15', grupo:'Antieméticos',       label:'Dimenidrinato + B6',    value:'DIMENIDRINATO 30 MG + PIRIDOXINA 50 MG SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola' },
  { id:'ev16', grupo:'Antieméticos',       label:'Bromoprida',            value:'BROMOPRIDA 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev17', grupo:'Corticosteroides',   label:'Hidrocortisona 500 mg', value:'HIDROCORTISONA SUCCINATO 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev18', grupo:'Corticosteroides',   label:'Hidrocortisona 100 mg', value:'HIDROCORTISONA SUCCINATO 100 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev19', grupo:'Corticosteroides',   label:'Dexametasona',          value:'DEXAMETASONA FOSFATO 4 MG/ML SOLUÇÃO INJETÁVEL AMP 2,5 ML', tipo:'ampola' },
  { id:'ev20', grupo:'Corticosteroides',   label:'Metilprednisolona',     value:'METILPREDNISOLONA SUCCINATO 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev21', grupo:'Protetor gástrico',  label:'Omeprazol',             value:'OMEPRAZOL SÓDICO 40 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev22', grupo:'Protetor gástrico',  label:'Pantoprazol',           value:'PANTOPRAZOL SÓDICO 40 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev23', grupo:'Protetor gástrico',  label:'Ranitidina',            value:'RANITIDINA CLORIDRATO 25 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev24', grupo:'Antibióticos',       label:'Ceftriaxona 1 g',       value:'CEFTRIAXONA SÓDICA 1 G PÓ PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev25', grupo:'Antibióticos',       label:'Cefazolina 1 g',        value:'CEFAZOLINA SÓDICA 1 G PÓ PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev26', grupo:'Antibióticos',       label:'Ampicilina + sulbactam',value:'AMPICILINA 1 G + SULBACTAM 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev27', grupo:'Antibióticos',       label:'Metronidazol',          value:'METRONIDAZOL 5 MG/ML SOLUÇÃO INJETÁVEL BOLSA 100 ML', tipo:'solucao', volumes:['100 mL'] },
  { id:'ev28', grupo:'Antibióticos',       label:'Azitromicina',          value:'AZITROMICINA 500 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev29', grupo:'Antibióticos',       label:'Piperacilina + tazobactam', value:'PIPERACILINA 4 G + TAZOBACTAM 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', tipo:'ampola' },
  { id:'ev30', grupo:'Anticonvulsivantes e sedativos', label:'Diazepam',  value:'DIAZEPAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev31', grupo:'Anticonvulsivantes e sedativos', label:'Midazolam', value:'MIDAZOLAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev32', grupo:'Anticonvulsivantes e sedativos', label:'Fenitoína', value:'FENITOÍNA SÓDICA 50 MG/ML SOLUÇÃO INJETÁVEL AMP 5 ML', tipo:'ampola' },
  { id:'ev33', grupo:'Anticonvulsivantes e sedativos', label:'Fenobarbital', value:'FENOBARBITAL SÓDICO 100 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev34', grupo:'Cardiovascular',     label:'Furosemida',            value:'FUROSEMIDA 10 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev35', grupo:'Cardiovascular',     label:'Amiodarona',            value:'AMIODARONA CLORIDRATO 50 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML', tipo:'ampola' },
  { id:'ev36', grupo:'Cardiovascular',     label:'Metoprolol',            value:'METOPROLOL TARTARATO 1 MG/ML SOLUÇÃO INJETÁVEL AMP 5 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev37', grupo:'Cardiovascular',     label:'Adenosina',             value:'ADENOSINA 3 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola', modo:'Bolus rápido' },
  { id:'ev38', grupo:'Cardiovascular',     label:'Noradrenalina',         value:'NOREPINEFRINA HEMITARTARATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 4 ML', tipo:'ampola', modo:'Bomba de infusão' },
  { id:'ev39', grupo:'Cardiovascular',     label:'Adrenalina',            value:'EPINEFRINA 1 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev40', grupo:'Cardiovascular',     label:'Nitroglicerina',        value:'NITROGLICERINA 5 MG/ML SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola', modo:'Bomba de infusão' },
  { id:'ev41', grupo:'Antídotos',          label:'Naloxona',              value:'NALOXONA CLORIDRATO 0,4 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev42', grupo:'Antídotos',          label:'Flumazenil',            value:'FLUMAZENIL 0,1 MG/ML SOLUÇÃO INJETÁVEL AMP 5 ML', tipo:'ampola', modo:'Bolus' },
  { id:'ev43', grupo:'Antídotos',          label:'N-acetilcisteína',      value:'ACETILCISTEÍNA 100 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML', tipo:'ampola' },
  { id:'ev44', grupo:'Antídotos',          label:'Gluconato de cálcio 10%', value:'GLUCONATO DE CÁLCIO 10% SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola', modo:'Bolus lento' },
  { id:'ev45', grupo:'Vitaminas e eletrólitos', label:'Tiamina (B1)',     value:'TIAMINA CLORIDRATO 100 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', tipo:'ampola' },
  { id:'ev46', grupo:'Vitaminas e eletrólitos', label:'Complexo B',       value:'COMPLEXO B SOLUÇÃO INJETÁVEL AMP 2 ML', tipo:'ampola' },
  { id:'ev47', grupo:'Vitaminas e eletrólitos', label:'Cloreto de potássio 19,1%', value:'CLORETO DE POTÁSSIO 19,1% SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola', modo:'Diluir — nunca em bolus' },
  { id:'ev48', grupo:'Vitaminas e eletrólitos', label:'Sulfato de magnésio 50%', value:'SULFATO DE MAGNÉSIO 50% SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola' },
  { id:'ev49', grupo:'Vitaminas e eletrólitos', label:'Bicarbonato de sódio 8,4%', value:'BICARBONATO DE SÓDIO 8,4% SOLUÇÃO INJETÁVEL AMP 10 ML', tipo:'ampola' }
];

/* ---------------------------------------------------------------
   6. ESPECIAIS — HAS (via oral, crise/ajuste)
   --------------------------------------------------------------- */
var FERR_HAS = [
  { id:'ha01', grupo:'IECA',            label:'Captopril 25 mg',    value:'CAPTOPRIL 25 MG COMPRIMIDO' },
  { id:'ha02', grupo:'IECA',            label:'Enalapril 5 mg',     value:'MALEATO DE ENALAPRIL 5 MG COMPRIMIDO' },
  { id:'ha03', grupo:'IECA',            label:'Enalapril 20 mg',    value:'MALEATO DE ENALAPRIL 20 MG COMPRIMIDO' },
  { id:'ha04', grupo:'BRA',             label:'Losartana 50 mg',    value:'LOSARTANA POTÁSSICA 50 MG COMPRIMIDO' },
  { id:'ha05', grupo:'BRA',             label:'Valsartana 80 mg',   value:'VALSARTANA 80 MG COMPRIMIDO' },
  { id:'ha06', grupo:'Bloq. de cálcio', label:'Anlodipino 5 mg',    value:'BESILATO DE ANLODIPINO 5 MG COMPRIMIDO' },
  { id:'ha07', grupo:'Bloq. de cálcio', label:'Anlodipino 10 mg',   value:'BESILATO DE ANLODIPINO 10 MG COMPRIMIDO' },
  { id:'ha08', grupo:'Bloq. de cálcio', label:'Nifedipino 20 mg LP',value:'NIFEDIPINO 20 MG COMPRIMIDO DE LIBERAÇÃO PROLONGADA' },
  { id:'ha09', grupo:'Betabloqueador',  label:'Atenolol 50 mg',     value:'ATENOLOL 50 MG COMPRIMIDO' },
  { id:'ha10', grupo:'Betabloqueador',  label:'Carvedilol 6,25 mg', value:'CARVEDILOL 6,25 MG COMPRIMIDO' },
  { id:'ha11', grupo:'Betabloqueador',  label:'Carvedilol 12,5 mg', value:'CARVEDILOL 12,5 MG COMPRIMIDO' },
  { id:'ha12', grupo:'Betabloqueador',  label:'Propranolol 40 mg',  value:'CLORIDRATO DE PROPRANOLOL 40 MG COMPRIMIDO' },
  { id:'ha13', grupo:'Betabloqueador',  label:'Metoprolol 50 mg',   value:'SUCCINATO DE METOPROLOL 50 MG COMPRIMIDO' },
  { id:'ha14', grupo:'Diurético',       label:'Hidroclorotiazida 25 mg', value:'HIDROCLOROTIAZIDA 25 MG COMPRIMIDO' },
  { id:'ha15', grupo:'Diurético',       label:'Furosemida 40 mg',   value:'FUROSEMIDA 40 MG COMPRIMIDO' },
  { id:'ha16', grupo:'Diurético',       label:'Espironolactona 25 mg', value:'ESPIRONOLACTONA 25 MG COMPRIMIDO' },
  { id:'ha17', grupo:'Central',         label:'Clonidina 0,150 mg', value:'CLORIDRATO DE CLONIDINA 0,150 MG COMPRIMIDO' },
  { id:'ha18', grupo:'Central',         label:'Metildopa 250 mg',   value:'METILDOPA 250 MG COMPRIMIDO' }
];

/* ---------------------------------------------------------------
   7. ESPECIAIS — Psiquiatria (VO / IM / EV)
   --------------------------------------------------------------- */
var FERR_PSIQ = [
  { id:'ps01', via:'VO', label:'Diazepam 5 mg',       value:'DIAZEPAM 5 MG COMPRIMIDO' },
  { id:'ps02', via:'VO', label:'Diazepam 10 mg',      value:'DIAZEPAM 10 MG COMPRIMIDO' },
  { id:'ps03', via:'VO', label:'Clonazepam 2 mg',     value:'CLONAZEPAM 2 MG COMPRIMIDO' },
  { id:'ps04', via:'VO', label:'Haloperidol 5 mg',    value:'HALOPERIDOL 5 MG COMPRIMIDO' },
  { id:'ps05', via:'VO', label:'Quetiapina 25 mg',    value:'FUMARATO DE QUETIAPINA 25 MG COMPRIMIDO' },
  { id:'ps06', via:'VO', label:'Risperidona 1 mg',    value:'RISPERIDONA 1 MG COMPRIMIDO' },
  { id:'ps07', via:'VO', label:'Prometazina 25 mg',   value:'CLORIDRATO DE PROMETAZINA 25 MG COMPRIMIDO' },
  { id:'ps08', via:'IM', label:'Haloperidol IM',      value:'HALOPERIDOL 5 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML' },
  { id:'ps09', via:'IM', label:'Prometazina IM',      value:'CLORIDRATO DE PROMETAZINA 25 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'ps10', via:'IM', label:'Clorpromazina IM',    value:'CLORIDRATO DE CLORPROMAZINA 5 MG/ML SOLUÇÃO INJETÁVEL AMP 5 ML' },
  { id:'ps11', via:'IM', label:'Midazolam IM',        value:'MIDAZOLAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML' },
  { id:'ps12', via:'IM', label:'Olanzapina IM',       value:'OLANZAPINA 10 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA' },
  { id:'ps13', via:'EV', label:'Diazepam EV',         value:'DIAZEPAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML' },
  { id:'ps14', via:'EV', label:'Midazolam EV',        value:'MIDAZOLAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML' },
  { id:'ps15', via:'EV', label:'Biperideno EV',       value:'LACTATO DE BIPERIDENO 5 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML' },
  { id:'ps16', via:'EV', label:'Haloperidol EV',      value:'HALOPERIDOL 5 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML' }
];

/* ---------------------------------------------------------------
   8. ESPECIAIS — Inalacao
   --------------------------------------------------------------- */
var FERR_INAL = [
  { id:'in1', label:'Brometo de ipratrópio', unidade:'gotas', opcoes:['20 gotas','30 gotas','40 gotas'], padrao:'40 gotas',
    value:'BROMETO DE IPRATRÓPIO 0,25 MG/ML SOLUÇÃO PARA INALAÇÃO' },
  { id:'in2', label:'Fenoterol', unidade:'gotas', opcoes:['5 gotas','10 gotas','15 gotas','20 gotas'], padrao:'10 gotas',
    value:'BROMIDRATO DE FENOTEROL 5 MG/ML SOLUÇÃO PARA INALAÇÃO' },
  { id:'in3', label:'Salbutamol (aerossol)', unidade:'jatos', opcoes:['2 jatos','4 jatos','6 jatos','8 jatos'], padrao:'4 jatos',
    value:'SALBUTAMOL 100 MCG/DOSE AEROSSOL — COM ESPAÇADOR' },
  { id:'in4', label:'Acetilcisteína', unidade:'ampola', opcoes:['1 ampola'], padrao:'1 ampola',
    value:'ACETILCISTEÍNA 100 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML — USO INALATÓRIO' },
  { id:'in5', label:'Budesonida', unidade:'ampola', opcoes:['1 ampola (0,5 mg)','2 ampolas (1 mg)'], padrao:'1 ampola (0,5 mg)',
    value:'BUDESONIDA 0,25 MG/ML SUSPENSÃO PARA INALAÇÃO' }
];

var FERR_INAL_DILUENTES = ['3 mL de SF 0,9%','5 mL de SF 0,9%','10 mL de SF 0,9%'];

/* ---------------------------------------------------------------
   9. ESPECIAIS — DM: escala de insulina regular SC
   --------------------------------------------------------------- */
var FERR_DM_ESCALA = [
  { faixa:'até 180 mg/dL',  ui:0  },
  { faixa:'181 a 200 mg/dL', ui:2  },
  { faixa:'201 a 250 mg/dL', ui:4  },
  { faixa:'251 a 300 mg/dL', ui:6  },
  { faixa:'301 a 350 mg/dL', ui:8  },
  { faixa:'351 a 400 mg/dL', ui:10 },
  { faixa:'acima de 400 mg/dL', ui:12 }
];

/* ---------------------------------------------------------------
   10. CALCULADORAS
   tipo 'formula' -> campos numericos + funcao calc(v)
   tipo 'escore'  -> itens com pontos (checkbox ou select) + faixas
   calc/faixa devolvem { valor, classe, detalhe }
   classe: ok | atencao | grave
   --------------------------------------------------------------- */
var FERR_CALC = [

  { id:'shockindex', nome:'Shock Index', sub:'FC ÷ PAS — triagem de instabilidade', tipo:'formula',
    campos:[ {k:'fc', rot:'FC (bpm)', min:20, max:250}, {k:'pas', rot:'PAS (mmHg)', min:40, max:260} ],
    calc:function(v){
      var si = v.fc / v.pas;
      var cl = si >= 1.0 ? 'grave' : (si >= 0.8 ? 'atencao' : 'ok');
      var d  = si >= 1.0 ? 'Choque provável — instabilidade hemodinâmica.'
             : si >= 0.8 ? 'Zona de alerta — reavaliar e monitorizar.'
             : 'Dentro do esperado (0,5 a 0,7).';
      return { valor:'Shock Index ' + si.toFixed(2), classe:cl, detalhe:d };
    } },

  { id:'pam', nome:'PAM — pressão arterial média', sub:'(PAS + 2 × PAD) ÷ 3', tipo:'formula',
    campos:[ {k:'pas', rot:'PAS (mmHg)', min:40, max:260}, {k:'pad', rot:'PAD (mmHg)', min:20, max:180} ],
    calc:function(v){
      var pam = (v.pas + 2*v.pad) / 3;
      var cl = pam < 65 ? 'grave' : (pam < 70 ? 'atencao' : 'ok');
      var d  = pam < 65 ? 'Abaixo da meta de 65 mmHg — hipoperfusão orgânica provável.'
             : 'Alvo habitual na sepse e no choque: PAM maior ou igual a 65 mmHg.';
      return { valor:'PAM ' + pam.toFixed(0) + ' mmHg', classe:cl, detalhe:d };
    } },

  { id:'imc', nome:'IMC — índice de massa corporal', sub:'Peso ÷ altura²', tipo:'formula',
    campos:[ {k:'peso', rot:'Peso (kg)', min:2, max:400, passo:0.1}, {k:'alt', rot:'Altura (cm)', min:40, max:230} ],
    calc:function(v){
      var m = v.alt/100, imc = v.peso/(m*m);
      var f = imc<18.5?['Baixo peso','atencao']:imc<25?['Eutrófico','ok']:imc<30?['Sobrepeso','atencao']
            :imc<35?['Obesidade grau I','atencao']:imc<40?['Obesidade grau II','grave']:['Obesidade grau III','grave'];
      return { valor:'IMC ' + imc.toFixed(1) + ' kg/m²', classe:f[1], detalhe:f[0] };
    } },

  { id:'tabagismo', nome:'Carga tabágica', sub:'Resultado em anos-maço', tipo:'formula',
    campos:[ {k:'cig', rot:'Cigarros por dia', min:1, max:120}, {k:'anos', rot:'Anos fumando', min:1, max:80} ],
    calc:function(v){
      var am = (v.cig/20) * v.anos;
      var cl = am >= 30 ? 'grave' : (am >= 20 ? 'atencao' : 'ok');
      var d  = am >= 30 ? 'Rastreio de câncer de pulmão indicado (30 anos-maço ou mais, 50 a 80 anos).'
             : am >= 20 ? 'Carga significativa — considerar rastreio conforme protocolo local.'
             : 'Carga tabágica abaixo do ponto de corte de rastreio.';
      return { valor:am.toFixed(1) + ' anos-maço', classe:cl, detalhe:d };
    } },

  { id:'gotejamento', nome:'Gotejamento', sub:'Volume e tempo → gotas por minuto', tipo:'formula',
    campos:[ {k:'vol', rot:'Volume (mL)', min:10, max:5000}, {k:'h', rot:'Tempo (horas)', min:0.25, max:48, passo:0.25} ],
    calc:function(v){
      var mlh = v.vol / v.h, gtt = mlh/3, mgtt = mlh/60*20*3;
      return { valor:Math.round(gtt) + ' gotas/min', classe:'ok',
               detalhe:'Equivale a ' + mlh.toFixed(0) + ' mL/h. Em microgotas: ' + Math.round(mlh) + ' microgotas/min.' };
    } },

  { id:'ckdepi', nome:'CKD-EPI 2021 — TFGe', sub:'Estimativa da filtração glomerular', tipo:'formula',
    campos:[ {k:'cr', rot:'Creatinina (mg/dL)', min:0.1, max:20, passo:0.01},
             {k:'idade', rot:'Idade (anos)', min:18, max:110},
             {k:'sexo', rot:'Sexo', opcoes:[['1','Masculino'],['0','Feminino']]} ],
    calc:function(v){
      var fem = v.sexo === '0';
      var k = fem ? 0.7 : 0.9, a = fem ? -0.241 : -0.302;
      var min = Math.min(v.cr/k, 1), max = Math.max(v.cr/k, 1);
      var tfg = 142 * Math.pow(min, a) * Math.pow(max, -1.200) * Math.pow(0.9938, v.idade) * (fem ? 1.012 : 1);
      var e = tfg>=90?['G1 — normal ou alta','ok']:tfg>=60?['G2 — levemente reduzida','ok']
            :tfg>=45?['G3a — leve a moderada','atencao']:tfg>=30?['G3b — moderada a grave','atencao']
            :tfg>=15?['G4 — grave','grave']:['G5 — falência renal','grave'];
      return { valor:'TFGe ' + tfg.toFixed(0) + ' mL/min/1,73 m²', classe:e[1],
               detalhe:e[0] + '. Ajustar dose de medicações conforme a função renal.' };
    } },

  { id:'gestacao', nome:'Idade gestacional', sub:'Pela DUM — regra de Naegele', tipo:'formula',
    campos:[ {k:'dum', rot:'Data da última menstruação', data:true} ],
    calc:function(v){
      var d = new Date(v.dum + 'T00:00:00');
      if (isNaN(d)) return null;
      var hoje = new Date(); hoje.setHours(0,0,0,0);
      var dias = Math.floor((hoje - d) / 86400000);
      if (dias < 0) return { valor:'Data futura', classe:'atencao', detalhe:'Confira a DUM informada.' };
      var s = Math.floor(dias/7), r = dias % 7;
      var dpp = new Date(d.getTime() + 280*86400000);
      var cl = s >= 42 ? 'grave' : (s >= 37 ? 'ok' : (s >= 22 ? 'atencao' : 'ok'));
      var per = s<14?'1º trimestre':s<28?'2º trimestre':'3º trimestre';
      return { valor:s + ' semanas e ' + r + ' dias', classe:cl,
               detalhe:per + '. DPP em ' + dpp.toLocaleDateString('pt-BR') + '.' };
    } },

  { id:'glasgow', nome:'Escala de coma de Glasgow', sub:'Com resposta pupilar opcional', tipo:'escore',
    seletor:true,
    itens:[
      { rot:'Abertura ocular', opcoes:[[4,'Espontânea'],[3,'Ao chamado'],[2,'À dor'],[1,'Ausente'],[0,'Não avaliável (NT)']] },
      { rot:'Resposta verbal', opcoes:[[5,'Orientado'],[4,'Confuso'],[3,'Palavras inapropriadas'],[2,'Sons incompreensíveis'],[1,'Ausente'],[0,'Não avaliável (NT)']] },
      { rot:'Resposta motora', opcoes:[[6,'Obedece a comandos'],[5,'Localiza a dor'],[4,'Retirada à dor'],[3,'Flexão anormal (decorticação)'],[2,'Extensão anormal (descerebração)'],[1,'Ausente'],[0,'Não avaliável (NT)']] },
      { rot:'Reatividade pupilar', opcoes:[[0,'Ambas reagem'],[-1,'Uma não reage'],[-2,'Nenhuma reage']] }
    ],
    faixa:function(t){
      var cl = t <= 8 ? 'grave' : (t <= 12 ? 'atencao' : 'ok');
      var d  = t <= 8 ? 'Coma — considerar via aérea definitiva.'
             : t <= 12 ? 'Traumatismo cranioencefálico moderado.'
             : 'Traumatismo cranioencefálico leve.';
      return { valor:'Glasgow ' + t, classe:cl, detalhe:d };
    } },

  { id:'qsofa', nome:'qSOFA', sub:'Triagem rápida de sepse fora da UTI', tipo:'escore',
    itens:[
      { rot:'Frequência respiratória maior ou igual a 22 irpm', pts:1 },
      { rot:'Alteração do estado mental (Glasgow menor que 15)', pts:1 },
      { rot:'PAS menor ou igual a 100 mmHg', pts:1 }
    ],
    faixa:function(t){
      return t >= 2
        ? { valor:'qSOFA ' + t, classe:'grave', detalhe:'Risco aumentado de desfecho desfavorável. Abrir protocolo de sepse e coletar lactato.' }
        : { valor:'qSOFA ' + t, classe:'ok', detalhe:'Baixo risco pelo qSOFA — não exclui sepse. Manter vigilância clínica.' };
    } },

  { id:'curb65', nome:'CURB-65', sub:'Gravidade da pneumonia adquirida na comunidade', tipo:'escore',
    itens:[
      { rot:'Confusão mental (nova)', pts:1 },
      { rot:'Ureia maior que 50 mg/dL', pts:1 },
      { rot:'FR maior ou igual a 30 irpm', pts:1 },
      { rot:'PAS menor que 90 ou PAD menor ou igual a 60 mmHg', pts:1 },
      { rot:'Idade maior ou igual a 65 anos', pts:1 }
    ],
    faixa:function(t){
      var d = t<=1 ? 'Baixo risco — tratamento ambulatorial em geral apropriado.'
            : t===2 ? 'Risco intermediário — considerar internação ou observação prolongada.'
            : 'Alto risco — internação; a partir de 4 avaliar leito de terapia intensiva.';
      return { valor:'CURB-65 ' + t, classe: t<=1?'ok':(t===2?'atencao':'grave'), detalhe:d };
    } },

  { id:'wells-tep', nome:'Escore de Wells — TEP', sub:'Probabilidade pré-teste de embolia pulmonar', tipo:'escore',
    itens:[
      { rot:'Sinais clínicos de TVP', pts:3 },
      { rot:'TEP é o diagnóstico mais provável', pts:3 },
      { rot:'FC maior que 100 bpm', pts:1.5 },
      { rot:'Imobilização por 3 dias ou cirurgia nas últimas 4 semanas', pts:1.5 },
      { rot:'TVP ou TEP prévios', pts:1.5 },
      { rot:'Hemoptise', pts:1 },
      { rot:'Neoplasia em tratamento nos últimos 6 meses', pts:1 }
    ],
    faixa:function(t){
      var d = t<=1 ? 'Baixa probabilidade — aplicar PERC ou D-dímero.'
            : t<=6 ? 'Probabilidade intermediária — D-dímero; se positivo, angiotomografia.'
            : 'Alta probabilidade — angiotomografia direta, sem D-dímero.';
      var d2 = t<=4 ? ' Pelo escore dicotômico: TEP improvável.' : ' Pelo escore dicotômico: TEP provável.';
      return { valor:'Wells ' + t, classe: t<=1?'ok':(t<=6?'atencao':'grave'), detalhe:d + d2 };
    } },

  { id:'wells-tvp', nome:'Escore de Wells — TVP', sub:'Probabilidade pré-teste de trombose venosa profunda', tipo:'escore',
    itens:[
      { rot:'Câncer ativo', pts:1 },
      { rot:'Paralisia, paresia ou imobilização de membro inferior', pts:1 },
      { rot:'Acamado por mais de 3 dias ou cirurgia maior nas últimas 12 semanas', pts:1 },
      { rot:'Dor à palpação do trajeto venoso profundo', pts:1 },
      { rot:'Edema de todo o membro inferior', pts:1 },
      { rot:'Panturrilha com mais de 3 cm de diferença em relação à contralateral', pts:1 },
      { rot:'Edema depressível restrito ao membro sintomático', pts:1 },
      { rot:'Veias colaterais superficiais não varicosas', pts:1 },
      { rot:'TVP prévia documentada', pts:1 },
      { rot:'Diagnóstico alternativo pelo menos tão provável quanto TVP', pts:-2 }
    ],
    faixa:function(t){
      var d = t<=0 ? 'Baixa probabilidade — D-dímero negativo praticamente exclui.'
            : t<=2 ? 'Probabilidade moderada — D-dímero e/ou ultrassom com Doppler.'
            : 'Alta probabilidade — ultrassom com Doppler direto.';
      return { valor:'Wells TVP ' + t, classe: t<=0?'ok':(t<=2?'atencao':'grave'), detalhe:d };
    } },

  { id:'sofa', nome:'SOFA', sub:'Sequential Organ Failure Assessment', tipo:'escore', seletor:true,
    itens:[
      { rot:'Respiração — PaO₂/FiO₂', opcoes:[[0,'maior ou igual a 400'],[1,'menor que 400'],[2,'menor que 300'],[3,'menor que 200 com suporte ventilatório'],[4,'menor que 100 com suporte ventilatório']] },
      { rot:'Coagulação — plaquetas (×10³/µL)', opcoes:[[0,'maior ou igual a 150'],[1,'menor que 150'],[2,'menor que 100'],[3,'menor que 50'],[4,'menor que 20']] },
      { rot:'Fígado — bilirrubina (mg/dL)', opcoes:[[0,'menor que 1,2'],[1,'1,2 a 1,9'],[2,'2,0 a 5,9'],[3,'6,0 a 11,9'],[4,'maior que 12,0']] },
      { rot:'Cardiovascular', opcoes:[[0,'PAM maior ou igual a 70 mmHg'],[1,'PAM menor que 70 mmHg'],[2,'Dopamina até 5 ou qualquer dobutamina'],[3,'Dopamina acima de 5, adrenalina ou noradrenalina até 0,1'],[4,'Dopamina acima de 15, adrenalina ou noradrenalina acima de 0,1']] },
      { rot:'Neurológico — Glasgow', opcoes:[[0,'15'],[1,'13 a 14'],[2,'10 a 12'],[3,'6 a 9'],[4,'menor que 6']] },
      { rot:'Renal — creatinina / diurese', opcoes:[[0,'menor que 1,2 mg/dL'],[1,'1,2 a 1,9 mg/dL'],[2,'2,0 a 3,4 mg/dL'],[3,'3,5 a 4,9 mg/dL ou diurese menor que 500 mL/dia'],[4,'maior que 5,0 mg/dL ou diurese menor que 200 mL/dia']] }
    ],
    faixa:function(t){
      var d = t<=1 ? 'Sem disfunção orgânica significativa.'
            : t<=6 ? 'Disfunção orgânica presente — mortalidade estimada abaixo de 10%.'
            : t<=9 ? 'Disfunção importante — mortalidade estimada de 15 a 20%.'
            : t<=12 ? 'Disfunção grave — mortalidade estimada de 40 a 50%.'
            : 'Disfunção muito grave — mortalidade estimada acima de 50%.';
      return { valor:'SOFA ' + t, classe: t<=1?'ok':(t<=6?'atencao':'grave'),
               detalhe:d + ' Aumento de 2 pontos sobre o basal define sepse.' };
    } },

  { id:'nyha', nome:'Classificação NYHA', sub:'Capacidade funcional na insuficiência cardíaca', tipo:'escore', seletor:true,
    itens:[
      { rot:'Limitação por sintomas', opcoes:[
        [1,'I — sem limitação às atividades habituais'],
        [2,'II — leve limitação; sintomas aos esforços habituais'],
        [3,'III — limitação acentuada; sintomas a esforços menores que os habituais'],
        [4,'IV — sintomas em repouso ou a qualquer esforço']] }
    ],
    faixa:function(t){
      var d = t===1?'Prognóstico favorável; manter otimização do tratamento.'
            : t===2?'Otimizar terapia baseada em evidência.'
            : t===3?'Considerar ajuste de diurético e encaminhamento à cardiologia.'
            : 'Classe avançada — avaliar internação e terapias avançadas.';
      return { valor:'NYHA ' + ['','I','II','III','IV'][t], classe: t<=2?'ok':(t===3?'atencao':'grave'), detalhe:d };
    } },

  { id:'stevenson', nome:'Perfil hemodinâmico de Stevenson', sub:'IC descompensada por congestão e perfusão', tipo:'escore', seletor:true,
    itens:[
      { rot:'Congestão', opcoes:[[0,'Seco — sem sinais de congestão'],[1,'Úmido — ortopneia, edema, estertores, turgência']] },
      { rot:'Perfusão', opcoes:[[0,'Quente — perfusão preservada'],[2,'Frio — extremidades frias, pulso filiforme, PA convergente']] }
    ],
    faixa:function(t){
      var m = {
        0:['Perfil A — quente e seco','ok','Compensado. Rever aderência e causas de descompensação.'],
        1:['Perfil B — quente e úmido','atencao','O mais comum. Diurético de alça e vasodilatador.'],
        2:['Perfil L — frio e seco','atencao','Hipovolemia relativa. Cuidado com diurético; considerar prova de volume.'],
        3:['Perfil C — frio e úmido','grave','O mais grave. Inotrópico, diurético e avaliação de terapia intensiva.']
      }[t];
      return { valor:m[0], classe:m[1], detalhe:m[2] };
    } },

  { id:'heart', nome:'Escore HEART', sub:'Risco em dor torácica no pronto atendimento', tipo:'escore', seletor:true,
    itens:[
      { rot:'História', opcoes:[[0,'Pouco suspeita'],[1,'Moderadamente suspeita'],[2,'Altamente suspeita']] },
      { rot:'ECG', opcoes:[[0,'Normal'],[1,'Alteração inespecífica de repolarização'],[2,'Desvio significativo do segmento ST']] },
      { rot:'Idade', opcoes:[[0,'menor que 45 anos'],[1,'45 a 64 anos'],[2,'65 anos ou mais']] },
      { rot:'Fatores de risco', opcoes:[[0,'Nenhum'],[1,'1 ou 2 fatores'],[2,'3 ou mais, ou doença aterosclerótica conhecida']] },
      { rot:'Troponina', opcoes:[[0,'Normal'],[1,'1 a 3 vezes o limite'],[2,'Acima de 3 vezes o limite']] }
    ],
    faixa:function(t){
      var d = t<=3 ? 'Baixo risco — alta com seguimento ambulatorial é geralmente segura.'
            : t<=6 ? 'Risco moderado — observação com curva de troponina e estratificação.'
            : 'Alto risco — conduta invasiva precoce; acionar cardiologia.';
      return { valor:'HEART ' + t, classe: t<=3?'ok':(t<=6?'atencao':'grave'), detalhe:d };
    } }
];

/* ---------------------------------------------------------------
   11. QUADROS — prescricao pronta por apresentacao clinica
   { id, grupo, nome, sub, tags, conduta (id no guia), atencao,
     unidade:[{med,dose,via,obs}], receita:[{med,uso}], orientacoes:[] }
   Doses de adulto. Conferir sempre a padronizacao da unidade.
   --------------------------------------------------------------- */
var FERR_QUADROS = [

/* ====================== DOR ====================== */
{ id:'q-cefaleia', grupo:'Dor', nome:'Cefaleia tensional', sub:'Cefaleia primária, sem sinais de alarme',
  tags:['dor de cabeca','cefaleia','tensional'], conduta:'cefaleia',
  atencao:'Antes de medicar, afastar sinais de alarme: início súbito em trovoada, febre com rigidez de nuca, déficit focal, papiledema, primeira cefaleia após os 50 anos, piora com Valsalva, imunossupressão ou câncer. Qualquer um deles muda a conduta e exige imagem.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9% e correr em 15 minutos.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'Correr em 1 hora.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 3 dias.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 3 dias.' }
  ],
  orientacoes:[
    'Ambiente calmo, hidratação e regularização do sono.',
    'Evitar o uso de analgésico por mais de 10 a 15 dias no mês: o abuso de analgésico é causa de cefaleia crônica diária.',
    'Retorno imediato se a dor mudar de padrão, vier com febre, vômito em jato, déficit ou alteração de consciência.'
  ] },

{ id:'q-enxaqueca', grupo:'Dor', nome:'Crise de enxaqueca', sub:'Dor pulsátil com náusea e fotofobia',
  tags:['migranea','enxaqueca','fotofobia'], conduta:'cefaleia',
  unidade:[
    { med:'METOCLOPRAMIDA 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'Diluir em 100 mL de SF 0,9% e correr em 15 minutos. Antiemético e analgésico na enxaqueca.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'Correr em 1 hora.' },
    { med:'DEXAMETASONA FOSFATO 4 MG/ML SOLUÇÃO INJETÁVEL AMP 2,5 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'SE crise prolongada — reduz recorrência em 72 h.' }
  ],
  receita:[
    { med:'Naproxeno 500 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, no início da crise, por até 3 dias.' },
    { med:'Metoclopramida 10 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se náusea, por 3 dias.' }
  ],
  orientacoes:[
    'Repouso em ambiente escuro e silencioso durante a crise.',
    'Anotar gatilhos: jejum, privação de sono, álcool, período menstrual, estresse.',
    'Encaminhar à atenção primária ou à neurologia para avaliar profilaxia se houver 4 ou mais crises por mês.'
  ] },

{ id:'q-lombalgia', grupo:'Dor', nome:'Lombalgia aguda mecânica', sub:'Sem déficit e sem sinais de alarme',
  tags:['lombalgia','dor nas costas','coluna','ciatica'],
  atencao:'Red flags que tiram o caso daqui: déficit motor progressivo, anestesia em sela, retenção ou incontinência urinária ou fecal (cauda equina), febre, trauma importante, câncer conhecido, uso de corticoide, idade acima de 50 anos com dor nova, perda de peso.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'1 frasco', via:'EV', obs:'Diluir em 100 mL de SF 0,9% e correr em 20 minutos.' },
    { med:'DEXAMETASONA FOSFATO 4 MG/ML SOLUÇÃO INJETÁVEL AMP 2,5 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'SE componente radicular.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 5 dias.' },
    { med:'Ciclobenzaprina 5 mg comprimido', uso:'Tomar 1 comprimido VO à noite, por 5 dias. Pode causar sonolência.' },
    { med:'Omeprazol 20 mg cápsula', uso:'Tomar 1 cápsula VO em jejum, 30 minutos antes do café, enquanto usar o anti-inflamatório.' }
  ],
  orientacoes:[
    'Manter atividade dentro do tolerado — repouso absoluto no leito piora o prognóstico e não é recomendado.',
    'Calor local por 20 minutos, 2 a 3 vezes ao dia.',
    'Retorno imediato se surgir perda de força, dormência entre as pernas ou dificuldade para urinar.',
    'Encaminhar à atenção primária para fisioterapia se não melhorar em 4 a 6 semanas.'
  ] },

{ id:'q-colica-renal', grupo:'Dor', nome:'Cólica renal', sub:'Dor lombar em cólica com irradiação para a virilha',
  tags:['calculo renal','nefrolitiase','colica','pedra no rim'], conduta:'colica-renal',
  unidade:[
    { med:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'1 frasco', via:'EV', obs:'Diluir em 100 mL de SF 0,9%. O anti-inflamatório é a base do tratamento da cólica renal, superior ao opioide.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'BUTILBROMETO DE ESCOPOLAMINA 20 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola', via:'EV', obs:'Diluir e aplicar lentamente.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'Correr em 1 hora. Não hiper-hidratar.' },
    { med:'TRAMADOL CLORIDRATO 50 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'1 ampola (100 mg)', via:'EV', obs:'SE dor refratária ao anti-inflamatório. Diluir em 100 mL de SF 0,9% e correr lentamente.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' },
    { med:'Cetoprofeno 100 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, após as refeições, por 3 dias.' },
    { med:'Escopolamina 10 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se cólica, por 3 dias.' },
    { med:'Tansulosina 0,4 mg cápsula', uso:'Tomar 1 cápsula VO 1 vez ao dia, por 14 dias. Terapia expulsiva para cálculo distal.' },
    { med:'Ondansetrona 4 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se náusea, por 3 dias.' }
  ],
  orientacoes:[
    'Coar a urina para recuperar o cálculo eliminado e levá-lo ao urologista.',
    'Hidratação oral habitual — forçar líquido durante a crise não acelera a eliminação e piora a dor.',
    'Retorno imediato se febre, calafrio, vômito incoercível, dor incontrolável ou parada da diurese: cálculo obstrutivo infectado é emergência urológica.',
    'Encaminhamento ambulatorial à urologia com o exame de imagem.'
  ] },

{ id:'q-colica-biliar', grupo:'Dor', nome:'Cólica biliar', sub:'Dor em hipocôndrio direito após refeição gordurosa',
  tags:['vesicula','colelitiase','biliar','murphy'], conduta:'colecistite-colangite',
  atencao:'Febre, Murphy positivo mantido, leucocitose ou icterícia tiram o caso da cólica simples: é colecistite ou colangite, com internação e antibiótico.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'BUTILBROMETO DE ESCOPOLAMINA 20 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola', via:'EV', obs:'Diluir e aplicar lentamente.' },
    { med:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'1 frasco', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'ONDANSETRONA CLORIDRATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (8 mg)', via:'EV', obs:'SE náusea ou vômito.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' },
    { med:'Escopolamina 10 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se cólica, por 5 dias.' }
  ],
  orientacoes:[
    'Dieta com restrição de gordura até a avaliação cirúrgica.',
    'Encaminhamento à cirurgia geral com o ultrassom de abdome.',
    'Retorno imediato se febre, icterícia, dor contínua por mais de 6 horas ou vômitos persistentes.'
  ] },

{ id:'q-odontalgia', grupo:'Dor', nome:'Odontalgia e abscesso dentário', sub:'Dor dentária com ou sem coleção',
  tags:['dente','odontalgia','abscesso dentario','pulpite'],
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'1 frasco', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' }
  ],
  receita:[
    { med:'Amoxicilina 500 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h por 7 dias. Apenas se houver sinal de infecção (edema, febre, coleção).' },
    { med:'Metronidazol 400 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h por 7 dias. Associar à amoxicilina se abscesso. Não ingerir álcool.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 3 dias.' }
  ],
  orientacoes:[
    'Encaminhamento odontológico é obrigatório — antibiótico não trata a causa, apenas contém a infecção.',
    'Compressa fria na face, higiene oral e bochecho com água morna e sal.',
    'Retorno imediato se o edema progredir para o pescoço ou o assoalho da boca, houver dificuldade para engolir, abrir a boca ou respirar: risco de angina de Ludwig.'
  ] },

/* ====================== CARDIOVASCULAR ====================== */
{ id:'q-urgencia-has', grupo:'Cardiovascular', nome:'Urgência hipertensiva', sub:'PA muito elevada SEM lesão de órgão-alvo',
  tags:['pressao alta','has','crise hipertensiva','captopril'], conduta:'crise-hipertensiva',
  atencao:'Só é urgência se não houver lesão aguda de órgão-alvo. Dor torácica, dispneia com congestão, déficit neurológico, alteração visual, oligúria ou creatinina em ascensão configuram EMERGÊNCIA hipertensiva: droga endovenosa titulável em ambiente monitorizado, não comprimido. Pico hipertensivo assintomático em paciente sem sintomas não precisa de redução aguda — trata-se a ansiedade e a dor e ajusta-se o esquema domiciliar.',
  unidade:[
    { med:'CAPTOPRIL 25 MG COMPRIMIDO', dose:'1 comprimido', via:'VO', obs:'Reavaliar a PA em 30 a 60 minutos. Meta: reduzir 20 a 25% da PA em 24 a 48 horas, não normalizar agora.' },
    { med:'CLONIDINA 0,150 MG COMPRIMIDO', dose:'1 comprimido', via:'VO', obs:'SE resposta insuficiente ao captopril. Atenção à sonolência e à hipotensão.' }
  ],
  receita:[
    { med:'Losartana 50 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, uso contínuo.' },
    { med:'Hidroclorotiazida 25 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, pela manhã, uso contínuo.' },
    { med:'Anlodipino 5 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, uso contínuo.' }
  ],
  orientacoes:[
    'Restrição de sal, redução de peso, atividade física regular e suspensão do álcool e do tabaco.',
    'Aferir a pressão em casa e anotar, levando o registro na consulta de seguimento.',
    'Reforçar a adesão: a causa mais comum de pico hipertensivo é o abandono da medicação.',
    'Encaminhamento à Unidade Básica de Saúde em 7 dias para ajuste e seguimento.'
  ] },

{ id:'q-emergencia-has', grupo:'Cardiovascular', nome:'Emergência hipertensiva', sub:'PA elevada COM lesão aguda de órgão-alvo',
  tags:['emergencia hipertensiva','nitroglicerina','nitroprussiato','lesao de orgao alvo'], conduta:'crise-hipertensiva',
  atencao:'Reduzir a PAM em no máximo 20 a 25% na primeira hora, exceto em dissecção aórtica (PAS 100 a 120 mmHg e FC menor que 60 em 20 minutos) e em AVC isquêmico candidato a trombólise (PA menor que 185/110). Queda abrupta causa isquemia cerebral, coronariana e renal.',
  unidade:[
    { med:'ACESSO VENOSO PERIFÉRICO CALIBROSO E MONITORIZAÇÃO CONTÍNUA', dose:'—', via:'—', obs:'PA não invasiva a cada 5 minutos, oximetria e cardioscopia.' },
    { med:'NITROGLICERINA 50 MG/5 ML — 50 MG + SG 5% 245 ML', dose:'Iniciar a 5 mcg/min e titular', via:'EV', obs:'Bomba de infusão. Escolha no edema agudo de pulmão e na síndrome coronariana.' },
    { med:'NITROPRUSSIATO DE SÓDIO 50 MG/2 ML — 2 ML + SG 5% 248 ML', dose:'Iniciar a 0,3 mcg/kg/min e titular', via:'EV', obs:'Bomba de infusão, frasco e equipo protegidos da luz. Vasodilatador mais potente; cuidado com intoxicação por cianeto em uso prolongado ou nefropata.' },
    { med:'HIDRALAZINA 20 MG/ML', dose:'5 a 10 mg', via:'EV', obs:'Escolha na eclâmpsia e na pré-eclâmpsia grave. Repetir a cada 20 a 30 minutos.' },
    { med:'METOPROLOL TARTARATO 1 MG/ML SOLUÇÃO INJETÁVEL AMP 5 ML', dose:'5 mg', via:'EV', obs:'Em bolus lento, repetir a cada 5 minutos até 15 mg. Escolha na síndrome aórtica, ANTES do vasodilatador.' },
    { med:'FUROSEMIDA 10 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 a 4 ampolas (40 a 80 mg)', via:'EV', obs:'SE congestão pulmonar.' }
  ],
  receita:[],
  orientacoes:[
    'Internação em leito monitorizado. Não é caso de alta.',
    'Investigar o órgão acometido: ECG, troponina, radiografia de tórax, função renal, fundo de olho e tomografia de crânio conforme a apresentação.',
    'Transição para anti-hipertensivo oral assim que estabilizar.'
  ] },

{ id:'q-fa-rva', grupo:'Cardiovascular', nome:'FA com resposta ventricular alta', sub:'Fibrilação atrial estável, FC acima de 110 bpm',
  tags:['fibrilacao atrial','fa','arritmia','metoprolol','anticoagulacao'], conduta:'fa-flutter',
  atencao:'Instabilidade (hipotensão, dor torácica isquêmica, congestão, rebaixamento) muda tudo: cardioversão elétrica sincronizada imediata, não medicação. Se o início foi há mais de 48 horas ou é indeterminado, NÃO cardioverter sem anticoagulação plena por 3 semanas ou ecocardiograma transesofágico.',
  unidade:[
    { med:'METOPROLOL TARTARATO 1 MG/ML SOLUÇÃO INJETÁVEL AMP 5 ML', dose:'5 mg', via:'EV', obs:'Bolus lento em 2 minutos, repetir a cada 5 minutos até 15 mg. Meta de FC menor que 110 bpm.' },
    { med:'AMIODARONA CLORIDRATO 50 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML', dose:'150 mg em 100 mL de SG 5%', via:'EV', obs:'Correr em 10 minutos. Alternativa em disfunção ventricular, onde o betabloqueador é mal tolerado.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'Manter veia. Corrigir gatilhos: hipovolemia, febre, dor, anemia, distúrbio eletrolítico, tireotoxicose.' }
  ],
  receita:[
    { med:'Metoprolol 50 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, uso contínuo, para controle da frequência.' },
    { med:'Rivaroxabana 20 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, com o jantar, se indicada anticoagulação pelo CHA2DS2-VASc.' },
    { med:'Varfarina 5 mg comprimido', uso:'Alternativa ao anticoagulante direto: dose ajustada pelo INR, alvo de 2 a 3. Obrigatória em prótese valvar mecânica e estenose mitral.' }
  ],
  orientacoes:[
    'Calcular CHA2DS2-VASc e HAS-BLED e registrar a indicação de anticoagulação no prontuário.',
    'Solicitar TSH, hemograma, eletrólitos e função renal.',
    'Encaminhamento à cardiologia com o ECG do atendimento.',
    'Retorno imediato se palpitação com desmaio, dor no peito, falta de ar ou fraqueza de um lado do corpo.'
  ] },

{ id:'q-eap', grupo:'Cardiovascular', nome:'Edema agudo de pulmão', sub:'IC descompensada, perfil quente e úmido',
  tags:['eap','edema agudo','insuficiencia cardiaca','furosemida','vni'], conduta:'eap-ic-descompensada',
  atencao:'Morfina não é mais rotina no edema agudo: associa-se a mais intubação e pior desfecho. Se a PAS estiver abaixo de 90 mmHg, o perfil é frio e úmido — inotrópico, não vasodilatador nem diurético agressivo.',
  unidade:[
    { med:'PACIENTE SENTADO, COM PERNAS PENDENTES, E OXIGÊNIO SUPLEMENTAR', dose:'—', via:'—', obs:'Só se SpO2 abaixo de 90%; alvo 92 a 96%. Saturar 100% não ajuda.' },
    { med:'VENTILAÇÃO NÃO INVASIVA — CPAP OU BINÍVEL', dose:'—', via:'—', obs:'Iniciar precocemente: reduz intubação. CPAP 5 a 8 cmH2O, subindo de 2 em 2 até 10 a 15 — ou BiPAP.' },
    { med:'FUROSEMIDA 10 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'Sem uso prévio: 2 a 5 ampolas (40 a 100 mg)', via:'EV', obs:'Em bolus. Se já usa em casa: 2 a 2,5 vezes a dose oral diária, EV. Reavaliar em 2 h: diurese abaixo de 100 a 150 mL/h ou sódio urinário abaixo de 50 a 70 → dobrar a dose.' },
    { med:'NITROGLICERINA 25 MG/5 ML — 1 AMPOLA + SG 5% 245 ML (100 MCG/ML)', dose:'10 a 20 mcg/min (6 a 12 mL/h)', via:'EV', obs:'Bomba de infusão, se PAS maior que 110 mmHg. Subir a cada 3 a 5 minutos, até 200 mcg/min.' },
    { med:'MORFINA 10 MG/ML — 1 AMPOLA + 9 ML DE AD', dose:'3 mL a cada 5 a 30 minutos', via:'EV', obs:'LENTO. NÃO de rotina — só em dor ou ansiedade refratária; associa-se a mais intubação.' }
  ],
  receita:[
    { med:'Furosemida 40 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, pela manhã, uso contínuo.' },
    { med:'Espironolactona 25 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, uso contínuo.' },
    { med:'Losartana 50 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, uso contínuo.' },
    { med:'Carvedilol 6,25 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, uso contínuo. Iniciar apenas com o paciente compensado.' }
  ],
  orientacoes:[
    'Restrição de sal e controle diário do peso: procurar atendimento se ganhar 2 kg em 3 dias.',
    'Investigar o gatilho: má adesão, transgressão alimentar, infecção, arritmia, isquemia ou crise hipertensiva.',
    'Balanço hídrico, ECG, radiografia de tórax, troponina, BNP, eletrólitos e função renal.'
  ] },

{ id:'q-dor-toracica-sca', grupo:'Cardiovascular', nome:'Dor torácica com suspeita de SCA', sub:'Pacote inicial enquanto se estratifica',
  tags:['iam','infarto','dor toracica','aas','clopidogrel','sca'], conduta:'dor-toracica',
  atencao:'ECG em até 10 minutos da chegada. Supra de ST ou equivalente aciona a reperfusão imediatamente — angioplastia em até 120 minutos ou trombólise em até 30 minutos. Antes de antiagregar e anticoagular, meça a PA nos dois braços: dor lancinante com assimetria de pulso é dissecção até prova em contrário. Não dar nitrato com sildenafil ou vardenafil em 24 h (tadalafila em 48 h), nem no infarto de ventrículo direito.',
  unidade:[
    { med:'ECG DE 12 DERIVAÇÕES EM ATÉ 10 MINUTOS, MONITORIZAÇÃO E ACESSO VENOSO', dose:'—', via:'—', obs:'Repetir o ECG a cada 15 a 30 minutos se a dor persistir e o primeiro for não diagnóstico.' },
    { med:'ÁCIDO ACETILSALICÍLICO 100 MG COMPRIMIDO', dose:'3 comprimidos (300 mg)', via:'VO', obs:'Mastigar e engolir. Primeira medida, salvo alergia.' },
    { med:'SEGUNDO ANTIAGREGANTE (P2Y12) — SÓ COM O DIAGNÓSTICO E A ESTRATÉGIA DEFINIDOS', dose:'—', via:'VO', obs:'IAM com supra e angioplastia: ticagrelor 180 mg. Trombólise: clopidogrel 300 mg (75 mg acima de 75 anos). SCA sem supra com cateterismo em menos de 24 h: dar depois da coronariografia.' },
    { med:'DINITRATO DE ISOSSORBIDA 5 MG COMPRIMIDO SUBLINGUAL', dose:'1 comprimido', via:'SL', obs:'Repetir a cada 5 minutos, até 3 doses, se a dor persistir e a PAS for 90 mmHg ou mais.' },
    { med:'MORFINA SULFATO 10 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'2 a 4 mg', via:'EV', obs:'SE dor refratária ao nitrato. Diluir 1 ampola em 9 mL de água destilada e fracionar.' },
    { med:'ENOXAPARINA SÓDICA 40 MG/0,4 ML SERINGA PREENCHIDA', dose:'1 mg/kg', via:'SC', obs:'De 12/12 h — só com SCA provável e dissecção afastada. Sem redução por idade na SCA sem supra; clearance abaixo de 30: 1x/dia.' }
  ],
  receita:[],
  orientacoes:[
    'Coletar troponina na chegada e repetir: 0/1 h ou 0/2 h na alta sensibilidade, 0 e 3 a 6 h na convencional.',
    'Não liberar o paciente com dor torácica sem estratificação: aplicar HEART e a curva de troponina.',
    'Manter monitorizado e com desfibrilador disponível.'
  ] },

/* ====================== RESPIRATÓRIO ====================== */
{ id:'q-asma', grupo:'Respiratório', nome:'Crise de asma', sub:'Exacerbação leve a moderada no pronto atendimento',
  tags:['asma','broncoespasmo','sibilos','salbutamol','fenoterol'], conduta:'asma-crise',
  atencao:'Tórax silencioso, sonolência, confusão, cianose, incapacidade de falar frases ou SatO2 abaixo de 90% são crise grave ou quase fatal: via aérea, sulfato de magnésio e terapia intensiva. Corticoide sistêmico em toda exacerbação que chega ao pronto atendimento.',
  unidade:[
    { med:'BROMIDRATO DE FENOTEROL 5 MG/ML + BROMETO DE IPRATRÓPIO 0,25 MG/ML', dose:'10 gotas de fenoterol + 40 gotas de ipratrópio', via:'INAL', obs:'Diluir em 5 mL de SF 0,9%, nebulizar com oxigênio a 6 a 8 L/min. Repetir a cada 20 minutos na primeira hora (3 ciclos).' },
    { med:'PREDNISONA 20 MG COMPRIMIDO', dose:'2 a 3 comprimidos (40 a 60 mg)', via:'VO', obs:'Preferir a via oral: mesma eficácia da endovenosa. Dar na primeira hora.' },
    { med:'HIDROCORTISONA SUCCINATO 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', dose:'200 mg', via:'EV', obs:'SE não tolerar a via oral.' },
    { med:'SULFATO DE MAGNÉSIO 10% — 20 ML (2 G) + 80 ML DE SF 0,9%', dose:'2 g', via:'EV', obs:'SE crise grave refratária à primeira hora. Correr em 20 a 30 minutos.' },
    { med:'REFRATÁRIO — EPINEFRINA 1 MG/ML', dose:'0,3 a 0,5 mg a cada 20 minutos, até 3 doses', via:'SC ou IM', obs:'0,01 mg/kg por dose. Último recurso antes da via aérea.' },
    { med:'REFRATÁRIO — TERBUTALINA', dose:'0,25 mg a cada 20 minutos, até 3 doses', via:'SC', obs:'Alternativa à adrenalina subcutânea.' },
    { med:'SINTOMAS LEVES — FENOTEROL ISOLADO', dose:'2 a 5 gotas em 5 mL de SF 0,9%', via:'INAL', obs:'Crise leve dispensa o ipratrópio.' },
    { med:'OXIGÊNIO SUPLEMENTAR SOB CATETER NASAL', dose:'—', via:'—', obs:'Alvo de SatO2 entre 93 e 95%.' }
  ],
  receita:[
    { med:'Prednisona 20 mg comprimido', uso:'Tomar 2 comprimidos VO 1 vez ao dia, pela manhã, após o café, por 5 dias. Não precisa desmame.' },
    { med:'Salbutamol spray 100 mcg', uso:'Inalar 2 jatos com espaçador de 4/4 h por 5 dias, e depois se falta de ar ou chiado.' },
    { med:'Budesonida + formoterol inalador', uso:'Inalar 1 jato de 12/12 h, uso contínuo. Bochechar a boca após o uso.' }
  ],
  orientacoes:[
    'Ensinar e conferir a técnica inalatória com espaçador antes da alta — é a causa mais comum de falha do tratamento.',
    'Identificar e afastar o gatilho: infecção viral, poeira, mofo, fumaça, pelo de animal, frio, exercício.',
    'Nunca suspender a medicação de controle porque melhorou.',
    'Retorno imediato se a falta de ar não melhorar com a bombinha, se não conseguir falar frases inteiras ou se os lábios ficarem roxos.',
    'Encaminhamento à atenção primária ou à pneumologia em 7 dias.'
  ] },

{ id:'q-dpoc', grupo:'Respiratório', nome:'Exacerbação de DPOC', sub:'Piora da dispneia, do volume ou da purulência do escarro',
  tags:['dpoc','enfisema','bronquite','exacerbacao'], conduta:'dpoc-exacerbacao',
  atencao:'Alvo de saturação de 88 a 92%: oxigênio em excesso causa hipercapnia e narcose. Acidose respiratória com pH abaixo de 7,35 é indicação de ventilação não invasiva.',
  unidade:[
    { med:'BROMIDRATO DE FENOTEROL 5 MG/ML + BROMETO DE IPRATRÓPIO 0,25 MG/ML', dose:'10 gotas de fenoterol + 40 gotas de ipratrópio', via:'INAL', obs:'Diluir em 5 mL de SF 0,9%. Nebulizar preferencialmente com ar comprimido. Repetir a cada 20 minutos na primeira hora.' },
    { med:'PREDNISONA 20 MG COMPRIMIDO', dose:'2 comprimidos (40 mg)', via:'VO', obs:'Dose única diária por 5 dias.' },
    { med:'OXIGÊNIO SUPLEMENTAR', dose:'—', via:'—', obs:'Titular para SatO2 de 88 a 92%.' },
    { med:'VENTILAÇÃO NÃO INVASIVA — BINÍVEL', dose:'IPAP 10 a 12 · EPAP 4 a 5 cmH2O', via:'—', obs:'SE pH 7,35 ou menos com PaCO2 acima de 45. Subir o IPAP de 2 em 2 até cerca de 20; gasometria em 1 a 2 h. Sem acidose, VNI não está indicada.' }
  ],
  receita:[
    { med:'Prednisona 20 mg comprimido', uso:'Tomar 2 comprimidos VO 1 vez ao dia, pela manhã, por 5 dias.' },
    { med:'Amoxicilina + clavulanato 875/125 mg', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias. Indicado se o escarro estiver purulento.' },
    { med:'Salbutamol spray 100 mcg', uso:'Inalar 2 jatos com espaçador de 4/4 h, se falta de ar.' },
    { med:'Brometo de ipratrópio spray', uso:'Inalar 2 jatos de 6/6 h, uso contínuo.' }
  ],
  orientacoes:[
    'Cessação do tabagismo é a única medida que muda a história da doença — ofertar apoio e encaminhamento.',
    'Verificar vacinação para influenza e pneumococo.',
    'Encaminhamento à pneumologia e avaliação de oxigenoterapia domiciliar se houver hipoxemia crônica.',
    'Retorno imediato se piora da falta de ar, febre, sonolência ou confusão.'
  ] },

{ id:'q-pac-ambulatorial', grupo:'Respiratório', nome:'Pneumonia — tratamento ambulatorial', sub:'CURB-65 de 0 a 1, sem critério de internação',
  tags:['pneumonia','pac','curb65','amoxicilina'], conduta:'pneumonia-comunidade',
  atencao:'Aplicar o CURB-65 antes de decidir o destino. Saturação abaixo de 92% em ar ambiente, instabilidade, descompensação de comorbidade ou impossibilidade de tratamento oral internam, mesmo com escore baixo.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'SE febre ou dor. Diluir em 100 mL de SF 0,9%.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'SE desidratação.' }
  ],
  receita:[
    { med:'Amoxicilina 500 mg cápsula', uso:'Tomar 2 cápsulas VO de 8/8 h por 7 dias. Escolha no paciente previamente hígido.' },
    { med:'Amoxicilina + clavulanato 875/125 mg', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias. Escolha se há comorbidade ou uso recente de antibiótico.' },
    { med:'Azitromicina 500 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia por 5 dias. Associar ao betalactâmico se houver comorbidade, ou usar isolada em suspeita de agente atípico.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias.' }
  ],
  orientacoes:[
    'Hidratação abundante, repouso e retorno para reavaliação em 48 a 72 horas.',
    'Radiografia de controle apenas se não houver melhora clínica ou em fumante acima de 50 anos, em 6 semanas.',
    'Retorno imediato se falta de ar, dor no peito, febre persistente após 72 horas de antibiótico, confusão ou queda do estado geral.'
  ] },

{ id:'q-pac-internacao', grupo:'Respiratório', nome:'Pneumonia — internação', sub:'CURB-65 de 2 ou mais, ou critério clínico',
  tags:['pneumonia grave','ceftriaxona','internacao','pac'], conduta:'pneumonia-comunidade',
  unidade:[
    { med:'CEFTRIAXONA SÓDICA 1 G PÓ PARA SOLUÇÃO INJETÁVEL FA', dose:'1 g', via:'EV', obs:'De 12/12 h, ou 2 g em dose única diária. Primeira dose na primeira hora.' },
    { med:'AZITROMICINA 500 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'500 mg em 250 mL de SF 0,9%', via:'EV', obs:'Uma vez ao dia, correr em 60 minutos. Cobertura de atípicos.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL', via:'EV', obs:'Correr em 8 horas, ajustando à volemia e à função cardíaca.' },
    { med:'OXIGÊNIO SUPLEMENTAR', dose:'—', via:'—', obs:'Alvo de SatO2 acima de 92%, ou 88 a 92% se houver DPOC.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'De 6/6 h, se dor ou febre.' },
    { med:'ENOXAPARINA SÓDICA 40 MG/0,4 ML SERINGA PREENCHIDA', dose:'40 mg', via:'SC', obs:'Uma vez ao dia — profilaxia de tromboembolismo no paciente acamado.' }
  ],
  receita:[],
  orientacoes:[
    'Coletar hemoculturas antes do antibiótico, sem atrasar a primeira dose.',
    'Solicitar hemograma, ureia, creatinina, eletrólitos, gasometria e radiografia de tórax.',
    'Reavaliar em 48 a 72 horas para descalonar e trocar para a via oral.'
  ] },

{ id:'q-ivas', grupo:'Respiratório', nome:'Resfriado comum e síndrome gripal', sub:'Quadro viral de vias aéreas superiores',
  tags:['gripe','resfriado','ivas','sindrome gripal','oseltamivir'], conduta:'sindrome-gripal',
  atencao:'Antibiótico não trata quadro viral. Considerar oseltamivir em até 48 horas do início nos grupos de risco: gestantes e puérperas, menores de 5 anos, maiores de 60 anos, imunossuprimidos, obesos e portadores de doença crônica.',
  unidade:[],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias.' },
    { med:'Loratadina 10 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, por 5 dias, se coriza.' },
    { med:'Solução nasal de cloreto de sódio 0,9%', uso:'Instilar 5 mL em cada narina de 6/6 h, por 7 dias.' },
    { med:'Oseltamivir 75 mg cápsula', uso:'Tomar 1 cápsula VO de 12/12 h por 5 dias. Apenas para grupo de risco, iniciado em até 48 h do início dos sintomas.' }
  ],
  orientacoes:[
    'Hidratação, repouso e alimentação leve.',
    'Etiqueta respiratória e afastamento do trabalho enquanto houver febre.',
    'Retorno imediato se falta de ar, dor no peito, febre por mais de 3 dias, piora após melhora inicial, confusão ou queda importante do estado geral.'
  ] },

{ id:'q-rinossinusite', grupo:'Respiratório', nome:'Rinossinusite aguda', sub:'Congestão e dor facial; bacteriana após 10 dias',
  tags:['sinusite','rinossinusite','dor facial'],
  atencao:'É bacteriana quando os sintomas passam de 10 dias sem melhora, quando são graves desde o início (febre acima de 39 °C com secreção purulenta por 3 a 4 dias) ou quando há piora após melhora inicial. Antes disso, o tratamento é sintomático.',
  unidade:[],
  receita:[
    { med:'Amoxicilina + clavulanato 875/125 mg', uso:'Tomar 1 comprimido VO de 12/12 h por 7 a 10 dias. Apenas se houver critério de infecção bacteriana.' },
    { med:'Solução nasal de cloreto de sódio 0,9%', uso:'Instilar 10 mL em cada narina de 6/6 h, por 10 dias. Lavagem nasal é a medida mais eficaz.' },
    { med:'Budesonida spray nasal 50 mcg', uso:'Aplicar 1 jato em cada narina de 12/12 h, por 14 dias.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' }
  ],
  orientacoes:[
    'Lavagem nasal com soro em volume generoso, várias vezes ao dia.',
    'Evitar descongestionante nasal tópico por mais de 3 dias: causa rinite medicamentosa.',
    'Retorno imediato se edema ou vermelhidão ao redor do olho, alteração da visão, cefaleia intensa, rigidez de nuca ou alteração de consciência: complicação orbitária ou intracraniana.'
  ] },

{ id:'q-faringoamigdalite', grupo:'Respiratório', nome:'Faringoamigdalite bacteriana', sub:'Centor 3 ou mais, exsudato e adenomegalia',
  tags:['amigdalite','dor de garganta','faringite','centor','estreptococo'],
  atencao:'Tosse, coriza, rouquidão e conjuntivite apontam para causa viral e afastam o estreptococo. Tratar viral com antibiótico não ajuda e ainda seleciona resistência.',
  unidade:[
    { med:'DEXAMETASONA FOSFATO 4 MG/ML SOLUÇÃO INJETÁVEL AMP 2,5 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'SE odinofagia intensa ou edema importante — alívio rápido da dor.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'BENZILPENICILINA BENZATINA 1.200.000 UI PÓ PARA SUSPENSÃO INJETÁVEL FA', dose:'1.200.000 UI', via:'IM', obs:'Dose única, profunda em glúteo. Resolve o tratamento em uma aplicação e previne febre reumática.' }
  ],
  receita:[
    { med:'Amoxicilina 500 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h por 10 dias. Alternativa à penicilina benzatina — completar os 10 dias mesmo com melhora.' },
    { med:'Azitromicina 500 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia por 5 dias. Apenas em alergia à penicilina.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 3 dias.' }
  ],
  orientacoes:[
    'Hidratação, alimentos frios e pastosos, gargarejo com água morna e sal.',
    'Completar o antibiótico até o fim para prevenir febre reumática e glomerulonefrite.',
    'Retorno imediato se dificuldade para engolir a própria saliva, para abrir a boca, voz abafada, desvio da úvula ou falta de ar: suspeita de abscesso periamigdaliano.'
  ] },

/* ====================== GASTRO ====================== */
{ id:'q-gastroenterite', grupo:'Gastro', nome:'Gastroenterite aguda', sub:'Diarreia e vômito de provável causa viral',
  tags:['diarreia','vomito','gastroenterite','virose','soro'], conduta:'diarreia-aguda',
  atencao:'Antibiótico só em disenteria (sangue e muco) com febre, em imunossuprimido ou em suspeita de cólera. Antidiarreico inibidor de motilidade é contraindicado na disenteria febril.',
  unidade:[
    { med:'ONDANSETRONA CLORIDRATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (8 mg)', via:'EV', obs:'Correr lentamente. Primeira escolha para permitir a reidratação oral.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL', via:'EV', obs:'Correr em 2 a 4 horas, se houver desidratação ou vômito incoercível.' },
    { med:'BUTILBROMETO DE ESCOPOLAMINA 4 MG/ML + DIPIRONA 500 MG/ML AMP 5 ML', dose:'1 ampola', via:'EV', obs:'SE cólica abdominal. Diluir em 100 mL de SF 0,9%.' }
  ],
  receita:[
    { med:'Sais de reidratação oral (envelope)', uso:'Diluir 1 envelope em 1 litro de água filtrada e tomar 1 copo (200 mL) após cada evacuação líquida.' },
    { med:'Ondansetrona 4 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se náusea ou vômito, por 3 dias.' },
    { med:'Racecadotrila 100 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h, por até 5 dias, enquanto houver diarreia.' },
    { med:'Escopolamina 10 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se cólica, por 3 dias.' },
    { med:'Ciprofloxacino 500 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 3 dias. Apenas em disenteria febril. Reavaliar em 48 h: se mantiver sangue ou melena, ceftriaxona 2 g IM 1x/dia por 2 a 5 dias e considerar internação.' }
  ],
  orientacoes:[
    'Reidratação oral em pequenos volumes e com frequência, mesmo que vomite.',
    'Dieta leve conforme a aceitação; não há indicação de jejum prolongado nem de dieta restritiva rígida.',
    'Lavagem das mãos e cuidado com o preparo dos alimentos para não transmitir aos contatos.',
    'Retorno imediato se sangue nas fezes, febre alta persistente, ausência de urina por mais de 8 horas, tontura ao levantar, boca muito seca ou sonolência.'
  ] },

{ id:'q-nausea-vomito', grupo:'Gastro', nome:'Náusea e vômito', sub:'Sintomático, com a causa ainda em investigação',
  tags:['vomito','nausea','emese','ondansetrona','metoclopramida'],
  atencao:'Vômito é sintoma, não diagnóstico. Afastar abdome agudo, obstrução, gestação, cetoacidose, hipertensão intracraniana, infarto de parede inferior e intoxicação antes de tratar apenas o sintoma.',
  unidade:[
    { med:'ONDANSETRONA CLORIDRATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (8 mg)', via:'EV', obs:'Correr lentamente. Primeira escolha, inclusive na gestação.' },
    { med:'METOCLOPRAMIDA 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%. Atenção a distonia aguda em jovens.' },
    { med:'DIMENIDRINATO 30 MG + PIRIDOXINA 50 MG SOLUÇÃO INJETÁVEL AMP 10 ML', dose:'1 ampola', via:'EV', obs:'Diluir em 100 mL de SF 0,9%. Bom quando há componente labiríntico.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL', via:'EV', obs:'Correr em 4 horas.' },
    { med:'LACTATO DE BIPERIDENO 5 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola', via:'EV', obs:'SE distonia aguda por metoclopramida.' }
  ],
  receita:[
    { med:'Ondansetrona 4 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se náusea, por 3 dias.' },
    { med:'Metoclopramida 10 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, 30 minutos antes das refeições, por 5 dias.' },
    { med:'Sais de reidratação oral (envelope)', uso:'Diluir 1 envelope em 1 litro de água e tomar ao longo do dia.' }
  ],
  orientacoes:[
    'Dieta leve, fracionada e em pequenos volumes; evitar gordura, frituras e alimentos com cheiro forte.',
    'Retorno imediato se vômito com sangue ou em borra de café, dor abdominal intensa, parada de eliminação de gases e fezes, ou sinais de desidratação.'
  ] },

{ id:'q-dispepsia', grupo:'Gastro', nome:'Dispepsia e refluxo', sub:'Epigastralgia e pirose sem sinais de alarme',
  tags:['gastrite','refluxo','drge','epigastralgia','omeprazol','pirose'],
  atencao:'Sinais de alarme que exigem endoscopia e não apenas sintomático: idade acima de 45 a 50 anos com sintoma novo, perda de peso, disfagia, vômito persistente, anemia, sangramento digestivo, massa palpável ou história familiar de câncer gástrico. E lembrar que dor epigástrica pode ser infarto de parede inferior: fazer o ECG.',
  unidade:[
    { med:'OMEPRAZOL SÓDICO 40 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'1 frasco (40 mg)', via:'EV', obs:'Diluir conforme a bula e correr lentamente.' },
    { med:'BUTILBROMETO DE ESCOPOLAMINA 20 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola', via:'EV', obs:'SE cólica associada.' },
    { med:'HIDRÓXIDO DE ALUMÍNIO SUSPENSÃO ORAL', dose:'10 mL', via:'VO', obs:'Alívio imediato do sintoma.' }
  ],
  receita:[
    { med:'Omeprazol 20 mg cápsula', uso:'Tomar 1 cápsula VO 1 vez ao dia, em jejum, 30 minutos antes do café, por 28 dias.' },
    { med:'Hidróxido de alumínio suspensão', uso:'Tomar 10 mL VO de 8/8 h, se azia, por 7 dias.' },
    { med:'Bromoprida 10 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h, 30 minutos antes das refeições, por 7 dias.' }
  ],
  orientacoes:[
    'Refeições menores e mais frequentes; não deitar nas 2 a 3 horas após comer; elevar a cabeceira da cama.',
    'Evitar café, álcool, refrigerante, frituras, alimentos ácidos, chocolate e menta.',
    'Suspender anti-inflamatório se for possível — é causa frequente de gastrite.',
    'Encaminhamento à atenção primária; endoscopia se não melhorar em 4 semanas ou se surgir sinal de alarme.'
  ] },

{ id:'q-constipacao', grupo:'Gastro', nome:'Constipação intestinal', sub:'Sem sinais de obstrução',
  tags:['constipacao','intestino preso','fecaloma','lactulose'],
  atencao:'Distensão importante, parada de eliminação de gases e fezes, vômito fecaloide ou timpanismo com ruídos metálicos são obstrução intestinal: nada de laxante, é radiografia e cirurgia.',
  unidade:[
    { med:'SUPOSITÓRIO DE GLICERINA', dose:'1 supositório', via:'RETAL', obs:'Alívio imediato na ampola cheia.' },
    { med:'ENEMA DE FOSFATO (FLEET) 130 ML', dose:'1 frasco', via:'RETAL', obs:'SE fecaloma. Considerar extração manual sob analgesia se houver impactação.' }
  ],
  receita:[
    { med:'Lactulose 667 mg/mL xarope', uso:'Tomar 15 mL VO 1 vez ao dia, à noite, por 14 dias. Ajustar a dose pela resposta.' },
    { med:'Macrogol (polietilenoglicol) sachê', uso:'Diluir 1 sachê em 1 copo de água e tomar VO 1 vez ao dia.' },
    { med:'Bisacodil 5 mg drágea', uso:'Tomar 1 a 2 drágeas VO à noite, se não evacuar. Uso pontual, não contínuo.' }
  ],
  orientacoes:[
    'Aumentar a ingesta de água para 2 litros por dia e de fibras (frutas, verduras, farelo).',
    'Atividade física regular e horário fixo para evacuar, sem adiar a vontade.',
    'Revisar medicações constipantes: opioide, ferro, anticolinérgico, antidepressivo, bloqueador de cálcio.',
    'Retorno imediato se dor abdominal intensa, distensão, vômito ou parada de eliminação de gases.'
  ] },

{ id:'q-hemorroida', grupo:'Gastro', nome:'Doença hemorroidária', sub:'Dor anal, sangramento ou trombose',
  tags:['hemorroida','sangramento anal','trombose hemorroidaria','fissura'],
  atencao:'Trombose hemorroidária externa com menos de 72 horas de evolução e muita dor tem indicação de trombectomia sob anestesia local — alívio imediato. Sangramento anal em maior de 50 anos ou com alteração do hábito intestinal exige colonoscopia: não atribuir tudo à hemorroida.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'1 frasco', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' }
  ],
  receita:[
    { med:'Pomada de hidrocortisona + lidocaína anorretal', uso:'Aplicar na região anal de 12/12 h, após a higiene, por 7 dias.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 3 dias.' },
    { med:'Lactulose 667 mg/mL xarope', uso:'Tomar 15 mL VO 1 vez ao dia, à noite, para manter as fezes amolecidas.' }
  ],
  orientacoes:[
    'Banho de assento com água morna por 15 minutos, 2 a 3 vezes ao dia e após evacuar.',
    'Dieta rica em fibras e 2 litros de água por dia; evitar esforço e permanência prolongada no vaso.',
    'Encaminhamento à proctologia.',
    'Retorno imediato se sangramento volumoso, febre, dor intensa progressiva ou retenção urinária.'
  ] },

/* ====================== INFECCIOSO ====================== */
{ id:'q-cistite', grupo:'Infeccioso', nome:'ITU não complicada — cistite', sub:'Disúria e polaciúria em mulher sem febre',
  tags:['itu','cistite','disuria','infeccao urinaria','fosfomicina'], conduta:'itu',
  atencao:'Febre, calafrio, dor lombar ou Giordano positivo tiram o caso da cistite: é pielonefrite. Homem, gestante, criança, sonda, imunossupressão ou anomalia urológica são ITU complicada e mudam o tratamento.',
  unidade:[
    { med:'FENAZOPIRIDINA 100 MG COMPRIMIDO', dose:'1 comprimido', via:'VO', obs:'Analgésico urinário, alívio sintomático. Avisar que tinge a urina de laranja.' },
    { med:'BUTILBROMETO DE ESCOPOLAMINA 20 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola', via:'EV', obs:'SE cólica ou tenesmo vesical importante.' }
  ],
  receita:[
    { med:'Fosfomicina 3 g sachê', uso:'Diluir 1 sachê em 1 copo de água e tomar VO em dose única, à noite, após esvaziar a bexiga.' },
    { med:'Nitrofurantoína 100 mg cápsula', uso:'Tomar 1 cápsula VO de 6/6 h por 5 dias. Alternativa; evitar se clearance abaixo de 30 mL/min.' },
    { med:'Sulfametoxazol + trimetoprima 800/160 mg', uso:'Tomar 1 comprimido VO de 12/12 h por 3 dias. Evitar se a resistência local for alta.' },
    { med:'Fenazopiridina 100 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, por até 2 dias, se ardência ao urinar.' }
  ],
  orientacoes:[
    'Aumentar a ingesta de água, não reter urina e urinar após a relação sexual.',
    'Retorno imediato se febre, calafrio, dor lombar, vômito ou piora após 48 a 72 horas de antibiótico.',
    'Urocultura não é obrigatória na cistite não complicada típica; colher se houver recorrência ou falha.'
  ] },

{ id:'q-pielonefrite', grupo:'Infeccioso', nome:'Pielonefrite aguda', sub:'Febre, dor lombar e Giordano positivo',
  tags:['pielonefrite','itu alta','giordano','ceftriaxona'], conduta:'itu',
  atencao:'Sepse, vômito incoercível, gestação, obstrução urinária ou impossibilidade de tratamento oral internam. Cálculo obstrutivo com infecção é emergência urológica: precisa de desobstrução, não só de antibiótico.',
  unidade:[
    { med:'CEFTRIAXONA SÓDICA 1 G PÓ PARA SOLUÇÃO INJETÁVEL FA', dose:'1 g', via:'EV', obs:'Uma vez ao dia. Colher urocultura e hemoculturas antes, sem atrasar a dose.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL', via:'EV', obs:'Correr em 4 horas.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'De 6/6 h, se dor ou febre.' },
    { med:'ONDANSETRONA CLORIDRATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (8 mg)', via:'EV', obs:'SE náusea ou vômito.' }
  ],
  receita:[
    { med:'Ciprofloxacino 500 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias, após a dose endovenosa, se a alta for possível.' },
    { med:'Sulfametoxazol + trimetoprima 800/160 mg', uso:'Tomar 1 comprimido VO de 12/12 h por 14 dias. Alternativa conforme o antibiograma.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias.' }
  ],
  orientacoes:[
    'Colher urocultura antes do antibiótico e ajustar depois pelo resultado.',
    'Ultrassom de vias urinárias se não melhorar em 48 a 72 horas, ou desde já se houver suspeita de obstrução.',
    'Reavaliação obrigatória em 48 horas.',
    'Retorno imediato se febre persistente, vômito, confusão, queda da pressão ou redução da urina.'
  ] },

{ id:'q-celulite', grupo:'Infeccioso', nome:'Celulite e erisipela', sub:'Infecção de pele e partes moles',
  tags:['celulite','erisipela','pele','cefalexina','partes moles'], conduta:'celulite-erisipela',
  atencao:'Dor desproporcional ao achado, bolhas hemorrágicas, necrose, crepitação, anestesia local ou toxemia sugerem fasciite necrosante: é emergência cirúrgica, não caso de antibiótico oral.',
  unidade:[
    { med:'DEMARCAR A BORDA DO ERITEMA A CANETA E ANOTAR O HORÁRIO', dose:'—', via:'—', obs:'Permite avaliar objetivamente a progressão na reavaliação.' },
    { med:'CEFAZOLINA SÓDICA 1 G PÓ PARA SOLUÇÃO INJETÁVEL FA', dose:'1 g', via:'EV', obs:'De 8/8 h, se houver indicação de tratamento endovenoso.' },
    { med:'CEFTRIAXONA SÓDICA 1 G PÓ PARA SOLUÇÃO INJETÁVEL FA', dose:'1 g', via:'EV', obs:'Alternativa em dose única diária, facilita a observação.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Se dor ou febre.' }
  ],
  receita:[
    { med:'Cefalexina 500 mg cápsula', uso:'Tomar 1 cápsula VO de 6/6 h por 7 a 10 dias. Escolha na celulite sem coleção.' },
    { med:'Amoxicilina 500 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h por 10 dias. Escolha na erisipela típica.' },
    { med:'Sulfametoxazol + trimetoprima 800/160 mg', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias. Associar se houver abscesso ou suspeita de estafilococo resistente.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias.' }
  ],
  orientacoes:[
    'Elevar o membro acometido e manter repouso relativo.',
    'Tratar a porta de entrada: micose interdigital, fissura, ferida ou úlcera.',
    'Reavaliação em 48 horas com a marcação da borda para comparar.',
    'Retorno imediato se a vermelhidão ultrapassar a marcação, febre alta, bolhas, área escura na pele ou dor desproporcional.'
  ] },

{ id:'q-sepse', grupo:'Infeccioso', nome:'Sepse — pacote da primeira hora', sub:'Infecção com disfunção orgânica',
  tags:['sepse','choque septico','lactato','pacote 1 hora','qsofa'], conduta:'sepse',
  atencao:'O relógio começa no reconhecimento. Antibiótico na primeira hora reduz mortalidade de forma dose-dependente com o atraso. Não esperar exame, imagem ou vaga para começar.',
  unidade:[
    { med:'COLETAR LACTATO ARTERIAL OU VENOSO', dose:'—', via:'—', obs:'Repetir em 2 a 4 horas se o inicial estiver acima de 2 mmol/L.' },
    { med:'COLETAR DUAS HEMOCULTURAS DE SÍTIOS DIFERENTES', dose:'—', via:'—', obs:'Antes do antibiótico, sem atrasar a primeira dose além de 45 minutos.' },
    { med:'ANTIBIÓTICO DE AMPLO ESPECTRO CONFORME O FOCO', dose:'—', via:'EV', obs:'Na primeira hora. Foco indeterminado: ceftriaxona 2 g EV, ou piperacilina-tazobactam 4,5 g EV se houver risco de germe resistente.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'30 mL/kg', via:'EV', obs:'SE hipotensão ou lactato acima de 4 mmol/L. Correr em até 3 horas, reavaliando a resposta.' },
    { med:'NOREPINEFRINA HEMITARTARATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 4 ML', dose:'4 ampolas (16 mg) em 234 mL de SG 5%', via:'EV', obs:'Bomba de infusão, SE PAM abaixo de 65 mmHg após a reposição volêmica. Pode ser iniciada em veia periférica calibrosa enquanto se obtém acesso central.' },
    { med:'OXIGÊNIO SUPLEMENTAR E MONITORIZAÇÃO CONTÍNUA', dose:'—', via:'—', obs:'Sondagem vesical para controle de diurese.' }
  ],
  receita:[],
  orientacoes:[
    'Identificar e controlar o foco: drenar coleção, retirar cateter, desobstruir via urinária ou biliar.',
    'Solicitar hemograma, função renal, eletrólitos, coagulograma, bilirrubinas, gasometria e imagem do foco.',
    'Reavaliar perfusão após a expansão: pressão, diurese, tempo de enchimento capilar, nível de consciência e lactato.',
    'Acionar vaga de terapia intensiva desde o reconhecimento.'
  ] },

{ id:'q-dengue-a', grupo:'Infeccioso', nome:'Dengue — grupo A', sub:'Sem sinais de alarme e sem comorbidade',
  tags:['dengue','arbovirose','prova do laco','hidratacao'], conduta:'dengue',
  atencao:'Anti-inflamatório e ácido acetilsalicílico são PROIBIDOS: aumentam o risco de sangramento. O período crítico é a defervescência, entre o 3º e o 7º dia — é quando o paciente piora, justamente ao ceder a febre.',
  unidade:[
    { med:'PROVA DO LAÇO E AFERIÇÃO DE SINAIS VITAIS', dose:'—', via:'—', obs:'Registrar no prontuário. Prova do laço positiva não muda o grupo isoladamente, mas obriga atenção.' }
  ],
  receita:[
    { med:'Hidratação oral', uso:'Adulto: 60 mL/kg/dia, sendo 1/3 com sais de reidratação oral e 2/3 com líquidos caseiros (água, suco, chá, água de coco). Para 70 kg: cerca de 4,2 litros por dia.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre, por 5 dias.' },
    { med:'Paracetamol 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre. Máximo de 3 g ao dia.' }
  ],
  orientacoes:[
    'Entregar e explicar o CARTÃO DE ACOMPANHAMENTO DA DENGUE.',
    'Não usar ácido acetilsalicílico, ibuprofeno, diclofenaco, nimesulida nem qualquer anti-inflamatório.',
    'Retorno diário para reavaliação até 48 horas após cessar a febre.',
    'Retorno IMEDIATO ao surgir qualquer sinal de alarme: dor abdominal intensa e contínua, vômito persistente, sangramento de mucosa, tontura ou queda da pressão, sonolência ou irritabilidade, aumento do fígado, acúmulo de líquido, ou queda da urina.',
    'Eliminar criadouros do mosquito no domicílio.'
  ] },

{ id:'q-dengue-b', grupo:'Infeccioso', nome:'Dengue — grupo B', sub:'Sangramento espontâneo, comorbidade ou risco social',
  tags:['dengue','grupo b','hematocrito','plaquetas'], conduta:'dengue',
  atencao:'Grupo B permanece em observação na unidade até o resultado do hemograma. Hemoconcentração ou plaquetopenia importante reclassificam o caso. Gestante, menor de 2 anos, maior de 65 anos e portador de comorbidade entram aqui mesmo sem sangramento.',
  unidade:[
    { med:'COLETAR HEMOGRAMA COMPLETO COM HEMATÓCRITO E PLAQUETAS', dose:'—', via:'—', obs:'Manter o paciente em observação até o resultado.' },
    { med:'HIDRATAÇÃO ORAL SUPERVISIONADA', dose:'60 mL/kg/dia', via:'VO', obs:'Iniciar imediatamente, sem esperar o exame.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'SE não aceitar a via oral ou houver vômitos.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Se dor ou febre. Nunca anti-inflamatório.' }
  ],
  receita:[
    { med:'Hidratação oral', uso:'Manter 60 mL/kg/dia em casa, 1/3 com sais de reidratação oral.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre.' },
    { med:'Paracetamol 500 mg comprimido', uso:'Alternativa à dipirona, 1 comprimido VO de 6/6 h. Máximo de 3 g ao dia.' }
  ],
  orientacoes:[
    'Alta apenas com hematócrito normal e ausência de sinais de alarme, com reavaliação diária.',
    'Entregar o cartão de acompanhamento e revisar os sinais de alarme com o paciente e o acompanhante.',
    'Notificação compulsória.'
  ] },

/* ====================== NEURO E PSIQUIATRIA ====================== */
{ id:'q-convulsao', grupo:'Neuro e Psiquiatria', nome:'Crise convulsiva', sub:'Da crise ao estado de mal epiléptico',
  tags:['convulsao','crise epileptica','status','diazepam','fenitoina'], conduta:'status-epilepticus',
  atencao:'Estado de mal é crise com mais de 5 minutos ou crises repetidas sem recuperação da consciência entre elas. Glicemia capilar em TODA crise. Em gestante acima de 20 semanas ou puérpera, pensar em eclâmpsia: o tratamento é sulfato de magnésio, não benzodiazepínico.',
  unidade:[
    { med:'PROTEGER A VIA AÉREA, DECÚBITO LATERAL, OXIGÊNIO E GLICEMIA CAPILAR', dose:'—', via:'—', obs:'Não conter o paciente à força nem colocar objetos na boca. Cronometrar a crise.' },
    { med:'DIAZEPAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'10 mg', via:'EV', obs:'Em bolus lento (2 mg/min). Pode repetir uma vez após 5 minutos. Vigiar depressão respiratória.' },
    { med:'MIDAZOLAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML', dose:'10 mg', via:'IM', obs:'Alternativa quando não há acesso venoso — tão eficaz quanto o diazepam endovenoso.' },
    { med:'FENITOÍNA 250 MG/5 ML — 4 A 6 AMPOLAS + SF 0,9% 80 A 100 ML', dose:'20 mg/kg (cerca de 1,4 g para 70 kg)', via:'EV', obs:'SOMENTE em SF 0,9% — precipita em soro glicosado. No máximo 50 mg/min, com monitorização cardíaca. Se persistir, repetir metade da dose.' },
    { med:'REFRATÁRIO — FENOBARBITAL 200 MG/2 ML: 10 ML + SF 0,9% 90 ML', dose:'20 mg/kg', via:'EV', obs:'Depois da fenitoína. Prepara-se para intubar: causa depressão respiratória. Alternativas: ácido valproico, levetiracetam.' },
    { med:'REFRATÁRIO — INTUBAÇÃO E ANESTESIA', dose:'—', via:'—', obs:'Midazolam, propofol, pentobarbital ou tiopental em infusão contínua, em terapia intensiva.' },
    { med:'GLICOSE 50% SOLUÇÃO INJETÁVEL AMP 10 ML', dose:'4 ampolas (40 mL)', via:'EV', obs:'SE hipoglicemia. Em etilista, aplicar tiamina 100 mg EV antes ou junto.' },
    { med:'TIAMINA CLORIDRATO 100 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola', via:'EV', obs:'SE etilismo ou desnutrição.' }
  ],
  receita:[
    { med:'Fenitoína 100 mg comprimido', uso:'Manutenção conforme a orientação da neurologia. Não iniciar antiepiléptico de manutenção no pronto atendimento sem avaliação especializada.' },
    { med:'Carbamazepina 200 mg comprimido', uso:'Conforme prescrição prévia do neurologista — reforçar a adesão.' }
  ],
  orientacoes:[
    'Investigar o gatilho: má adesão, privação de sono, álcool, abstinência, infecção, distúrbio metabólico, trauma, lesão estrutural.',
    'Tomografia de crânio em primeira crise, crise focal, trauma, déficit persistente, imunossupressão ou anticoagulação.',
    'Orientar quanto à direção de veículos e a atividades de risco até liberação do neurologista.',
    'Encaminhamento à neurologia. Primeira crise em adulto precisa de investigação.'
  ] },

{ id:'q-agitacao', grupo:'Neuro e Psiquiatria', nome:'Agitação psicomotora', sub:'Contenção verbal, química e, em último caso, física',
  tags:['agitacao','contencao','haloperidol','surto','psiquiatria'], conduta:'agitacao-psicomotora',
  atencao:'Antes de sedar, afastar causa orgânica: glicemia capilar, oximetria, temperatura, intoxicação, abstinência, trauma craniano, infecção e distúrbio eletrolítico. Sedar um delirium sem tratar a causa mata. No idoso e no delirium, evitar benzodiazepínico — haloperidol em dose baixa é preferível.',
  unidade:[
    { med:'ABORDAGEM VERBAL, AMBIENTE SEGURO E RETIRADA DE OBJETOS DE RISCO', dose:'—', via:'—', obs:'Sempre a primeira tentativa. Equipe suficiente e visível reduz a necessidade de contenção.' },
    { med:'HALOPERIDOL 5 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola (5 mg)', via:'IM', obs:'Pode repetir a cada 30 minutos, até 15 a 20 mg/dia. Vigiar distonia e prolongamento do QT.' },
    { med:'CLORIDRATO DE PROMETAZINA 25 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'1 ampola (50 mg)', via:'IM', obs:'Associada ao haloperidol na mesma seringa — combinação clássica, reduz efeito extrapiramidal.' },
    { med:'MIDAZOLAM 5 MG/ML SOLUÇÃO INJETÁVEL AMP 3 ML', dose:'5 a 10 mg', via:'IM', obs:'Escolha na agitação por álcool, abstinência ou estimulante. Vigiar depressão respiratória.' },
    { med:'LACTATO DE BIPERIDENO 5 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola', via:'EV', obs:'SE distonia aguda pelo haloperidol.' }
  ],
  receita:[],
  orientacoes:[
    'Registrar em prontuário a indicação da contenção, o horário de início, a técnica e as reavaliações.',
    'Reavaliar a contenção física a cada 30 minutos: perfusão, sinais vitais, nível de consciência e necessidade de manutenção.',
    'Monitorizar após a sedação: oximetria e nível de consciência.',
    'Acionar a psiquiatria e a rede de saúde mental; avaliar risco de suicídio antes da alta.'
  ] },

{ id:'q-vertigem', grupo:'Neuro e Psiquiatria', nome:'Vertigem periférica aguda', sub:'Tontura rotatória com náusea, sem déficit focal',
  tags:['vertigem','labirintite','tontura','vppb','dimenidrinato'], conduta:'vertigem',
  atencao:'Diferenciar de causa central: déficit focal, diplopia, disartria, disfagia, ataxia desproporcional, cefaleia intensa, nistagmo vertical ou que muda de direção, e HINTS alterado indicam AVC de fossa posterior. Idade avançada com fator de risco vascular aumenta a suspeita.',
  unidade:[
    { med:'DIMENIDRINATO 30 MG + PIRIDOXINA 50 MG SOLUÇÃO INJETÁVEL AMP 10 ML', dose:'1 ampola', via:'EV', obs:'Diluir em 100 mL de SF 0,9% e correr em 20 minutos.' },
    { med:'ONDANSETRONA CLORIDRATO 2 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (8 mg)', via:'EV', obs:'SE náusea ou vômito importante.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'Correr em 1 hora.' },
    { med:'MANOBRA DE DIX-HALLPIKE E, SE POSITIVA, MANOBRA DE EPLEY', dose:'—', via:'—', obs:'Na VPPB, a manobra de reposicionamento resolve o quadro — é mais eficaz que qualquer medicação.' }
  ],
  receita:[
    { med:'Meclizina 25 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, se tontura, por 5 dias. Uso curto: atrapalha a compensação central.' },
    { med:'Betaistina 24 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 30 dias.' },
    { med:'Dimenidrinato + piridoxina gotas', uso:'Tomar 40 gotas VO de 8/8 h, se tontura, por 3 dias.' }
  ],
  orientacoes:[
    'Levantar-se devagar, em duas etapas, e evitar movimentos bruscos da cabeça.',
    'Não dirigir nem operar máquinas enquanto houver tontura ou sob efeito da medicação.',
    'Exercícios de reabilitação vestibular; encaminhamento à otorrinolaringologia.',
    'Retorno imediato se dor de cabeça intensa, visão dupla, dificuldade para falar ou engolir, fraqueza ou dormência de um lado do corpo.'
  ] },

/* ====================== ALÉRGICO ====================== */
{ id:'q-anafilaxia', grupo:'Alérgico', nome:'Anafilaxia', sub:'Adrenalina intramuscular é a primeira e única medida que salva',
  tags:['anafilaxia','choque anafilatico','adrenalina','alergia grave'], conduta:'anafilaxia',
  atencao:'ADRENALINA INTRAMUSCULAR NO VASTO LATERAL DA COXA, IMEDIATAMENTE. Não existe contraindicação absoluta na anafilaxia. Corticoide e anti-histamínico são adjuvantes e não substituem a adrenalina — o atraso na adrenalina é a principal causa de morte. Não colocar o paciente sentado nem em pé bruscamente: a hipovolemia relativa pode causar parada.',
  unidade:[
    { med:'EPINEFRINA 1 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'0,5 mg (0,5 mL da solução 1:1000)', via:'IM', obs:'No vasto lateral da coxa. Repetir a cada 5 a 15 minutos se não houver resposta. Criança: 0,01 mg/kg, máximo de 0,3 mg.' },
    { med:'DECÚBITO DORSAL COM MEMBROS INFERIORES ELEVADOS', dose:'—', via:'—', obs:'Gestante em decúbito lateral esquerdo. Manter deitado até a estabilização.' },
    { med:'OXIGÊNIO SOB MÁSCARA COM RESERVATÓRIO A 10 A 15 L/MIN', dose:'—', via:'—', obs:'Preparar material de via aérea difícil: o edema de glote progride rápido.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 a 2000 mL', via:'EV', obs:'Em acesso calibroso, correr rápido se houver hipotensão.' },
    { med:'HIDROCORTISONA SUCCINATO 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', dose:'200 mg', via:'EV', obs:'Adjuvante — pode reduzir a reação bifásica, mas não age na fase aguda.' },
    { med:'METILPREDNISOLONA 125 MG/2 ML — 1 AMPOLA + SF 0,9% 48 ML', dose:'12,5 mL de 6/6 h', via:'EV', obs:'Alternativa à hidrocortisona. Adjuvante.' },
    { med:'CLORIDRATO DE PROMETAZINA 25 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'1 ampola (50 mg)', via:'IM', obs:'Adjuvante para os sintomas cutâneos. Nunca no lugar da adrenalina.' },
    { med:'BROMIDRATO DE FENOTEROL 5 MG/ML SOLUÇÃO PARA INALAÇÃO', dose:'10 gotas em 5 mL de SF 0,9%', via:'INAL', obs:'SE broncoespasmo associado.' }
  ],
  receita:[
    { med:'Prednisona 20 mg comprimido', uso:'Tomar 2 comprimidos VO 1 vez ao dia, pela manhã, por 5 dias.' },
    { med:'Loratadina 10 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, por 7 dias.' },
    { med:'Adrenalina autoinjetável', uso:'Portar sempre, se disponível. Aplicar na coxa ao primeiro sinal de reação grave e procurar atendimento imediatamente.' }
  ],
  orientacoes:[
    'Observação obrigatória de 6 a 12 horas pelo risco de reação bifásica, mesmo com boa resposta inicial.',
    'Identificar e registrar o agente desencadeante; anotar a alergia no prontuário e orientar o paciente a informá-la sempre.',
    'Encaminhamento à alergologia e prescrição de adrenalina autoinjetável quando disponível.',
    'Retorno imediato ao primeiro sinal de nova reação: coceira difusa, inchaço de lábios ou língua, falta de ar, aperto na garganta ou tontura.'
  ] },

{ id:'q-urticaria', grupo:'Alérgico', nome:'Urticária e angioedema', sub:'Reação alérgica sem comprometimento respiratório',
  tags:['urticaria','alergia','angioedema','coceira','placas'],
  atencao:'Se houver edema de língua, úvula ou laringe, rouquidão, estridor, falta de ar, dor abdominal em cólica ou hipotensão, o quadro é ANAFILAXIA: adrenalina intramuscular imediata, não anti-histamínico.',
  unidade:[
    { med:'CLORIDRATO DE PROMETAZINA 25 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'1 ampola (50 mg)', via:'IM', obs:'Profunda em glúteo. Causa sonolência importante.' },
    { med:'HIDROCORTISONA SUCCINATO 500 MG PÓ PARA SOLUÇÃO INJETÁVEL FA', dose:'200 mg', via:'EV', obs:'Ou dexametasona 10 mg EV.' },
    { med:'DEXAMETASONA FOSFATO 4 MG/ML SOLUÇÃO INJETÁVEL AMP 2,5 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'Alternativa à hidrocortisona.' },
    { med:'METILPREDNISOLONA 125 MG/2 ML', dose:'1 ampola', via:'EV', obs:'Outra alternativa, de ação rápida.' }
  ],
  receita:[
    { med:'Loratadina 10 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, por 7 dias. Pode-se dobrar a dose na urticária persistente.' },
    { med:'Dexclorfeniramina 2 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, por 5 dias, se coceira. Causa sonolência.' },
    { med:'Prednisona 20 mg comprimido', uso:'Tomar 2 comprimidos VO 1 vez ao dia, pela manhã, por 5 dias, nos casos extensos.' }
  ],
  orientacoes:[
    'Identificar e afastar o agente: medicamento, alimento, picada de inseto, látex, calor ou frio.',
    'Banho morno (não quente), roupas leves e compressa fria nas lesões.',
    'Retorno imediato se inchaço de lábios, língua ou garganta, falta de ar, rouquidão, tontura ou vômito.'
  ] },

/* ====================== METABÓLICO ====================== */
{ id:'q-hipoglicemia', grupo:'Metabólico e eletrólitos', nome:'Hipoglicemia', sub:'Glicemia abaixo de 70 mg/dL com sintomas',
  tags:['hipoglicemia','glicose','glicemia baixa','tiamina'], conduta:'hipoglicemia',
  atencao:'Em etilista ou desnutrido, administrar tiamina ANTES ou junto com a glicose — a glicose isolada pode precipitar encefalopatia de Wernicke. Hipoglicemia por sulfonilureia recidiva por muitas horas: esse paciente fica em observação prolongada, com soro glicosado contínuo, e não recebe alta após um único bolus.',
  unidade:[
    { med:'GLICEMIA CAPILAR IMEDIATA', dose:'—', via:'—', obs:'Repetir 15 minutos após cada tratamento até estabilizar acima de 100 mg/dL.' },
    { med:'CARBOIDRATO DE ABSORÇÃO RÁPIDA — 15 G', dose:'1 copo de suco ou 3 colheres de açúcar em água', via:'VO', obs:'Escolha se o paciente estiver consciente e conseguir engolir com segurança.' },
    { med:'GLICOSE 50% SOLUÇÃO INJETÁVEL AMP 10 ML', dose:'4 a 6 ampolas (40 a 60 mL)', via:'EV', obs:'Em bolus, se rebaixamento de consciência. Veia calibrosa: é esclerosante.' },
    { med:'TIAMINA CLORIDRATO 100 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'1 ampola (100 mg)', via:'EV', obs:'SE etilismo ou desnutrição — antes ou junto com a glicose.' },
    { med:'GLICOSE 5% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'Manutenção contínua, se hipoglicemia por sulfonilureia ou insulina de longa duração.' }
  ],
  receita:[],
  orientacoes:[
    'Alimentar com carboidrato complexo assim que recuperar a consciência, para evitar recorrência.',
    'Investigar a causa: dose errada, pular refeição, exercício não planejado, álcool, perda de peso, piora da função renal.',
    'Revisar o esquema de insulina ou hipoglicemiante com o paciente e a família.',
    'Não dar alta a hipoglicemia por sulfonilureia sem observação de pelo menos 12 a 24 horas.',
    'Ensinar a família a reconhecer e tratar a hipoglicemia em casa.'
  ] },

{ id:'q-cad', grupo:'Metabólico e eletrólitos', nome:'Cetoacidose diabética', sub:'Pacote inicial: volume, insulina e potássio',
  tags:['cetoacidose','cad','insulina','diabetes','acidose'], conduta:'cetoacidose',
  atencao:'A ordem importa: volume primeiro, potássio antes da insulina se estiver abaixo de 3,3 mEq/L, e insulina depois. Aplicar insulina com potássio baixo causa arritmia fatal. Não suspender a insulina endovenosa antes de resolver a acidose, mesmo com a glicemia normalizada — troca-se o soro para glicosado.',
  unidade:[
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'15 a 20 mL/kg (cerca de 1000 a 1500 mL)', via:'EV', obs:'Na primeira hora. Depois, 250 a 500 mL/h conforme a volemia e o sódio corrigido.' },
    { med:'DOSAR POTÁSSIO ANTES DE INICIAR A INSULINA', dose:'—', via:'—', obs:'Abaixo de 3,3 mEq/L: repor potássio e ADIAR a insulina. Entre 3,3 e 5,2: repor 20 a 30 mEq por litro de soro. Acima de 5,2: não repor e redosar.' },
    { med:'INSULINA HUMANA REGULAR 100 UI/ML', dose:'0,1 UI/kg/h (cerca de 7 UI/h)', via:'EV', obs:'Bomba de infusão contínua. Meta de queda da glicemia de 50 a 75 mg/dL por hora.' },
    { med:'CLORETO DE POTÁSSIO 19,1% SOLUÇÃO INJETÁVEL AMP 10 ML', dose:'20 a 30 mEq por litro de soro', via:'EV', obs:'Sempre diluído, nunca em bolus. Monitorização cardíaca.' },
    { med:'GLICOSE 5% SOLUÇÃO INJETÁVEL', dose:'500 mL', via:'EV', obs:'Associar quando a glicemia chegar a 200 a 250 mg/dL, mantendo a insulina até resolver a acidose.' }
  ],
  receita:[],
  orientacoes:[
    'Investigar o fator precipitante: infecção, má adesão, infarto, pancreatite, corticoide, primodescompensação.',
    'Glicemia capilar de hora em hora; eletrólitos e gasometria a cada 2 a 4 horas.',
    'Critérios de resolução: glicemia abaixo de 200, bicarbonato acima de 15, pH acima de 7,3 e ânion-gap normalizado.',
    'Transição para insulina subcutânea com sobreposição de 1 a 2 horas antes de desligar a bomba.'
  ] },

{ id:'q-hipercalemia', grupo:'Metabólico e eletrólitos', nome:'Hipercalemia', sub:'Potássio elevado com ou sem alteração no ECG',
  tags:['hipercalemia','potassio','gluconato de calcio','ecg','onda t apiculada'], conduta:'hipercalemia',
  atencao:'ECG imediato em todo potássio acima de 6,0 mEq/L. Onda T apiculada, PR alargado, perda da onda P ou QRS alargado exigem gluconato de cálcio AGORA — ele não baixa o potássio, apenas estabiliza a membrana e compra tempo. Sempre afastar hemólise da amostra antes de tratar um valor isolado sem clínica.',
  unidade:[
    { med:'ECG DE 12 DERIVAÇÕES E MONITORIZAÇÃO CONTÍNUA', dose:'—', via:'—', obs:'Suspender de imediato IECA, BRA, espironolactona, AINE e suplemento de potássio.' },
    { med:'GLUCONATO DE CÁLCIO 10% SOLUÇÃO INJETÁVEL AMP 10 ML', dose:'1 a 2 ampolas (10 a 20 mL)', via:'EV', obs:'Em 2 a 5 minutos, SE houver alteração no ECG. Efeito em minutos, dura de 30 a 60 minutos; pode repetir.' },
    { med:'INSULINA HUMANA REGULAR 100 UI/ML + GLICOSE 50%', dose:'10 UI de insulina + 4 ampolas de glicose 50%', via:'EV', obs:'Desloca o potássio para dentro da célula. Início em 15 minutos, dura de 4 a 6 horas. Monitorar glicemia capilar de 1/1 h por 6 horas.' },
    { med:'BROMIDRATO DE FENOTEROL 5 MG/ML SOLUÇÃO PARA INALAÇÃO', dose:'20 gotas em 5 mL de SF 0,9%', via:'INAL', obs:'Beta-2 em dose alta também desloca o potássio para o intracelular. Efeito aditivo à insulina.' },
    { med:'FUROSEMIDA 10 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 a 4 ampolas (40 a 80 mg)', via:'EV', obs:'Elimina potássio, se houver diurese preservada.' },
    { med:'POLIESTIRENOSSULFONATO DE CÁLCIO (SORCAL) 30 G', dose:'1 envelope', via:'VO', obs:'Eliminação intestinal, ação lenta (horas). Não é medida de urgência.' }
  ],
  receita:[],
  orientacoes:[
    'Acionar a nefrologia: potássio refratário, anúria, acidose grave ou lesão renal avançada são indicação de diálise de urgência.',
    'Redosar o potássio 2 horas após o tratamento — o efeito do deslocamento é transitório e o potássio volta a subir.',
    'Revisar a dieta e todas as medicações que retêm potássio antes da alta.'
  ] },

/* ====================== TRAUMA E PELE ====================== */
{ id:'q-ferimento', grupo:'Trauma e pele', nome:'Ferimento corto-contuso', sub:'Limpeza, sutura e profilaxia antitetânica',
  tags:['ferimento','sutura','laceracao','antitetanica','lidocaina'], conduta:'ferimentos-sutura',
  atencao:'Não suturar primariamente: ferida com mais de 6 a 12 horas em membro (24 horas em face), mordedura (exceto face, com cuidado), ferida muito contaminada ou com corpo estranho, e ferida puntiforme profunda. Sempre avaliar e registrar função tendínea, motora, sensitiva e vascular distal ANTES da anestesia.',
  unidade:[
    { med:'LIMPEZA COM SORO FISIOLÓGICO 0,9% SOB PRESSÃO', dose:'250 a 500 mL', via:'—', obs:'A irrigação abundante é o que previne infecção — mais do que qualquer antibiótico.' },
    { med:'LIDOCAÍNA 2% SEM VASOCONSTRITOR SOLUÇÃO INJETÁVEL FA 20 ML', dose:'Até 4,5 mg/kg (cerca de 15 mL a 2%)', via:'INFILTRAÇÃO', obs:'Com vasoconstritor até 7 mg/kg, evitando extremidades. Aspirar antes de injetar.' },
    { med:'FIO DE SUTURA CONFORME O LOCAL', dose:'—', via:'—', obs:'Face: náilon 5-0 ou 6-0, retirar em 5 dias. Tronco e membros: náilon 3-0 ou 4-0, retirar em 10 a 14 dias. Couro cabeludo: náilon 3-0, retirar em 7 a 10 dias.' },
    { med:'VACINA DIFTERIA E TÉTANO ADULTO (dT) DOSE 0,5 ML', dose:'1 dose', via:'IM', obs:'Ferida limpa: se a última dose foi há mais de 10 anos. Ferida suja: se foi há mais de 5 anos ou o esquema é incompleto ou desconhecido.' },
    { med:'IMUNOGLOBULINA ANTITETÂNICA (IGHAT) 250 UI', dose:'250 UI', via:'IM', obs:'SE ferida de alto risco e esquema vacinal incompleto, desconhecido ou paciente imunossuprimido. Aplicar em local diferente da vacina.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' },
    { med:'Cefalexina 500 mg cápsula', uso:'Tomar 1 cápsula VO de 6/6 h por 7 dias. Apenas em ferida contaminada, mordedura, exposição de estruturas nobres ou imunossupressão.' },
    { med:'Neomicina + bacitracina pomada', uso:'Aplicar fina camada na ferida de 12/12 h, após limpeza com soro fisiológico.' }
  ],
  orientacoes:[
    'Manter o curativo limpo e seco por 24 a 48 horas; depois, lavar com água e sabão e trocar o curativo diariamente.',
    'Informar a data exata de retirada dos pontos e o local onde retirá-los.',
    'Retorno imediato se vermelhidão que se espalha, saída de pus, febre, dor crescente, abertura da ferida ou perda de movimento ou sensibilidade.'
  ] },

{ id:'q-queimadura', grupo:'Trauma e pele', nome:'Queimadura de pequena extensão', sub:'Menos de 10% de superfície corporal, sem critério de centro especializado',
  tags:['queimadura','sc queimada','parkland','curativo'], conduta:'queimaduras',
  atencao:'Critérios de encaminhamento a centro de queimados: mais de 10% de superfície corporal, qualquer queimadura de terceiro grau, acometimento de face, mãos, pés, genitália ou articulações, queimadura elétrica ou química, lesão inalatória, e criança ou idoso. Suspeitar de lesão inalatória se houver queimadura em ambiente fechado, rouquidão, estridor, escarro carbonáceo ou vibrissas chamuscadas — a via aérea fecha rápido.',
  unidade:[
    { med:'RESFRIAMENTO COM ÁGUA CORRENTE EM TEMPERATURA AMBIENTE POR 20 MINUTOS', dose:'—', via:'—', obs:'Nunca gelo: agrava a lesão. Retirar anéis, pulseiras e roupas não aderidas.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'MORFINA SULFATO 10 MG/ML SOLUÇÃO INJETÁVEL AMP 1 ML', dose:'2 a 4 mg', via:'EV', obs:'SE dor intensa. Diluir 1 ampola em 9 mL de água destilada e fracionar.' },
    { med:'SULFADIAZINA DE PRATA 1% CREME', dose:'Camada de 2 a 3 mm', via:'TÓPICO', obs:'Após limpeza com soro. Cobrir com gaze não aderente.' },
    { med:'VACINA DIFTERIA E TÉTANO ADULTO (dT) DOSE 0,5 ML', dose:'1 dose', via:'IM', obs:'Conforme o esquema vacinal — queimadura é ferida tetanogênica.' }
  ],
  receita:[
    { med:'Sulfadiazina de prata 1% creme', uso:'Aplicar camada fina na área queimada 1 vez ao dia, após limpeza com soro fisiológico, e cobrir com gaze.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 7 dias.' },
    { med:'Paracetamol 500 mg + codeína 30 mg', uso:'Tomar 1 comprimido VO de 6/6 h, se dor intensa, por 3 dias.' }
  ],
  orientacoes:[
    'Não estourar bolhas, não passar pasta de dente, manteiga, borra de café nem qualquer produto caseiro.',
    'Curativo diário; reavaliação em 48 horas e depois conforme a evolução.',
    'Proteção solar rigorosa na área por pelo menos 6 meses após a cicatrização.',
    'Retorno imediato se febre, pus, odor, aumento da dor ou vermelhidão ao redor da queimadura.'
  ] },

{ id:'q-mordedura', grupo:'Trauma e pele', nome:'Mordedura de animal', sub:'Ferida, antibiótico e profilaxia da raiva',
  tags:['mordedura','cao','gato','raiva','antirrabica','tetano'], conduta:'mordeduras',
  atencao:'Mordedura de gato infecta muito mais que a de cão — ferida puntiforme e profunda. Como regra, não se sutura mordedura, exceto em face, com limpeza exaustiva. Classificar o acidente para a profilaxia antirrábica conforme o Ministério da Saúde e registrar a decisão.',
  unidade:[
    { med:'LIMPEZA EXAUSTIVA COM ÁGUA E SABÃO E IRRIGAÇÃO COM SORO SOB PRESSÃO', dose:'500 mL ou mais', via:'—', obs:'É a medida mais eficaz contra a raiva e contra a infecção bacteriana.' },
    { med:'VACINA ANTIRRÁBICA HUMANA', dose:'Esquema conforme classificação', via:'IM', obs:'Acidente leve: 2 doses (dias 0 e 3) com observação do animal. Acidente grave: 4 doses (dias 0, 3, 7 e 14).' },
    { med:'SORO ANTIRRÁBICO HUMANO (SAR) 40 UI/KG', dose:'40 UI/kg', via:'INFILTRAÇÃO', obs:'SE acidente grave. Infiltrar o máximo possível ao redor da ferida; o restante por via intramuscular.' },
    { med:'VACINA DIFTERIA E TÉTANO ADULTO (dT) DOSE 0,5 ML', dose:'1 dose', via:'IM', obs:'Conforme o esquema vacinal — mordedura é ferida suja.' }
  ],
  receita:[
    { med:'Amoxicilina + clavulanato 875/125 mg', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias. Primeira escolha: cobre Pasteurella, estafilococo e anaeróbios.' },
    { med:'Doxiciclina 100 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias. Alternativa em alergia à penicilina.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' }
  ],
  orientacoes:[
    'Observar o animal por 10 dias, quando for possível identificá-lo; qualquer alteração de comportamento muda a conduta.',
    'Notificação do acidente e registro da classificação para a profilaxia antirrábica.',
    'Reavaliação em 48 horas — mordedura infecta com frequência.',
    'Retorno imediato se vermelhidão que se espalha, pus, febre, dor crescente ou dificuldade para mover o membro.'
  ] },

{ id:'q-entorse', grupo:'Trauma e pele', nome:'Entorse de tornozelo', sub:'Aplicar Ottawa antes de pedir radiografia',
  tags:['entorse','tornozelo','ottawa','torcao'], conduta:'entorse-tornozelo',
  atencao:'Regras de Ottawa — só radiografar se houver dor na zona maleolar somada a dor óssea na borda posterior ou na ponta de um dos maléolos, ou dor óssea no navicular ou na base do 5º metatarso, ou incapacidade de dar 4 passos tanto na hora do trauma quanto na avaliação.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO INJETÁVEL AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'CETOPROFENO 100 MG PÓ LIÓFILO PARA SOLUÇÃO INJETÁVEL FA', dose:'1 frasco', via:'EV', obs:'Diluir em 100 mL de SF 0,9%.' },
    { med:'IMOBILIZAÇÃO COM TALA GESSADA OU BOTA IMOBILIZADORA', dose:'—', via:'—', obs:'Conferir e registrar a perfusão, a sensibilidade e a mobilidade dos dedos após imobilizar.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 5 dias.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 5 dias.' },
    { med:'Diclofenaco gel 10 mg/g', uso:'Aplicar no local de 8/8 h, por 7 dias.' }
  ],
  orientacoes:[
    'PRICE: proteção, repouso relativo, gelo por 20 minutos a cada 2 a 3 horas nas primeiras 48 horas, compressão elástica e elevação do membro.',
    'Carga conforme a dor, com auxílio de muleta se necessário.',
    'Encaminhamento à ortopedia e à fisioterapia; a reabilitação proprioceptiva previne a recidiva.',
    'Retorno imediato se dor desproporcional, dormência, dedos frios ou roxos, ou se a dor não melhorar em 7 dias.'
  ] }
];

/* ---------------------------------------------------------------
   11b. QUADROS — segunda leva, das diluicoes e protocolos do
   caderno de plantao. Mesma estrutura do bloco acima.
   --------------------------------------------------------------- */
FERR_QUADROS = FERR_QUADROS.concat([

/* ====================== DOR ====================== */
{ id:'q-analgesia-ev', grupo:'Dor', nome:'Analgesia venosa — diluições', sub:'A escada de analgésico do plantão, já diluída',
  tags:['analgesia','dipirona','cetoprofeno','tenoxicam','morfina','tramadol','diluicao'], conduta:'analgesia-ps',
  atencao:'Subir a escada só depois de esgotar o degrau anterior. Anti-inflamatório: cuidado em nefropata, cardiopata, idoso, desidratado e em uso de anticoagulante. Morfina: nunca em bolus sem diluir.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 mL + 8 mL de AD', via:'EV', obs:'Dose habitual. Dose plena: 4 mL (2 g) + 16 mL de AD.' },
    { med:'DICLOFENACO DE SÓDIO 25 MG/ML AMP 3 ML', dose:'3 mL (75 mg)', via:'IM', obs:'Profundo em glúteo. Não fazer endovenoso.' },
    { med:'CETOPROFENO 100 MG FRASCO-AMPOLA', dose:'1 frasco + 100 mL de SF 0,9%', via:'EV', obs:'Correr em 20 minutos. Também pode ser 1 ampola IM.' },
    { med:'TENOXICAM 20 A 40 MG FRASCO-AMPOLA', dose:'1 frasco + 8 mL de AD', via:'EV', obs:'Alternativa ao cetoprofeno.' },
    { med:'DEXAMETASONA FOSFATO 10 MG/2,5 ML', dose:'2,5 mL + 17,5 mL de SF 0,9%', via:'EV', obs:'Componente inflamatório ou radicular.' },
    { med:'TRAMADOL CLORIDRATO 100 MG', dose:'1 ampola + 100 mL de SF 0,9%', via:'EV', obs:'LENTO, em 20 minutos — correr rápido causa náusea e vômito.' },
    { med:'MORFINA SULFATO 10 MG/ML AMP 1 ML', dose:'1 ampola + 9 mL de AD; aplicar 3 mL', via:'EV', obs:'Fica 1 mg/mL. Repetir 2 a 3 mL a cada 5 a 10 minutos até o controle. Vigiar sedação e frequência respiratória.' }
  ],
  receita:[],
  orientacoes:[
    'Registrar a escala de dor antes e depois — é o que mostra se a analgesia funcionou.',
    'Reavaliar em 30 minutos antes de subir o degrau.',
    'Naloxona disponível sempre que se usa opioide.'
  ] },

{ id:'q-gota', grupo:'Dor', nome:'Crise de gota', sub:'Monoartrite aguda, quente e muito dolorosa',
  tags:['gota','artrite','podagra','colchicina','acido urico'],
  atencao:'Não iniciar nem suspender alopurinol durante a crise: mexer no ácido úrico agora prolonga o surto. Se já usava, mantém. Sempre afastar artrite séptica — na dúvida, puncionar.',
  unidade:[
    { med:'CETOPROFENO 100 MG FRASCO-AMPOLA', dose:'1 frasco + 100 mL de SF 0,9%', via:'EV', obs:'Correr em 20 minutos.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g) + 100 mL de SF 0,9%', via:'EV', obs:'Analgesia associada.' }
  ],
  receita:[
    { med:'Cetoprofeno 50 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h, após as refeições, por 5 a 7 dias.' },
    { med:'Naproxeno 500 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 5 a 7 dias. Alternativa ao cetoprofeno.' },
    { med:'Colchicina 0,5 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h até a melhora, por até 7 dias. Reduzir se diarreia.' },
    { med:'Prednisona 20 mg comprimido', uso:'Tomar 1 a 2 comprimidos VO 1 vez ao dia por 7 a 10 dias. Escolha em nefropata, onde o anti-inflamatório é proibido.' },
    { med:'Omeprazol 20 mg cápsula', uso:'Tomar 1 cápsula VO em jejum enquanto usar o anti-inflamatório.' }
  ],
  orientacoes:[
    'Repouso e elevação da articulação; gelo local alivia.',
    'Nada de ácido acetilsalicílico: eleva o ácido úrico.',
    'Reduzir carne vermelha, frutos do mar, vísceras, cerveja e destilados.',
    'Encaminhamento à reumatologia ou à atenção primária para iniciar o alopurinol DEPOIS da crise, já com anti-inflamatório de cobertura.'
  ] },

/* ====================== CARDIOVASCULAR ====================== */
{ id:'q-iam-sem-supra', grupo:'Cardiovascular', nome:'IAM sem supra de ST', sub:'O mnemônico A-B-C-C-C da terapia antitrombótica',
  tags:['iam','sem supra','angina instavel','sca','abccc','clopidogrel'], conduta:'sca-sem-supra',
  atencao:'Betabloqueador NÃO entra se houver sinal de insuficiência cardíaca, bloqueio atrioventricular, broncoespasmo, uso de cocaína, ou alto risco (idade acima de 70 anos, PAS abaixo de 120, FC acima de 110). Enoxaparina não se usa em paciente instável, clearance abaixo de 15 mL/min ou peso acima de 150 kg.',
  unidade:[
    { med:'A — ÁCIDO ACETILSALICÍLICO 100 MG COMPRIMIDO', dose:'3 comprimidos (300 mg)', via:'VO', obs:'Mastigar. No primeiro momento, para quem não é alérgico e não tem sangramento ativo.' },
    { med:'B — ATENOLOL 25, 50 OU 100 MG COMPRIMIDO', dose:'Conforme o peso e a PA', via:'VO', obs:'De 12/12 h. Ver as contraindicações na caixa de atenção.' },
    { med:'C — CAPTOPRIL 25 MG COMPRIMIDO', dose:'1 comprimido', via:'VO', obs:'Iniciar nas primeiras 24 horas se não houver hipotensão.' },
    { med:'C — TICAGRELOR 90 MG COMPRIMIDO (OU CLOPIDOGREL 75 MG)', dose:'2 comprimidos (180 mg) — clopidogrel: 4 comprimidos (300 mg)', via:'VO', obs:'Segurar o ataque se houver cateterismo em menos de 24 horas: dar depois da coronariografia. Clopidogrel se não puder usar ticagrelor.' },
    { med:'C — COLESTEROL: ESTATINA DE ALTA POTÊNCIA', dose:'Atorvastatina 40 a 80 mg', via:'VO', obs:'Perfil lipídico em 24 horas.' },
    { med:'C — CLEXANE (ENOXAPARINA) 1 MG/KG', dose:'1 mg/kg', via:'SC', obs:'De 12/12 h, sem redução por idade; clearance abaixo de 30: 1x/dia. Estratégia invasiva precoce: preferir heparina não fracionada 60 UI/kg (máx. 5.000) + 12 UI/kg/h.' },
    { med:'DINITRATO DE ISOSSORBIDA 5 MG', dose:'1 comprimido', via:'SL', obs:'Repetir a cada 5 minutos se a dor persistir. NÃO usar em infarto de VD, PAS abaixo de 90 mmHg ou uso de sildenafil nas últimas 24 h. Não melhorou: nitroglicerina endovenosa.' },
    { med:'MORFINA SULFATO 10 MG/ML AMP 1 ML', dose:'2 a 4 mg a cada 5 minutos', via:'EV', obs:'NÃO de rotina — só em dor refratária. Proibida se PAS abaixo de 90, IAM inferior ou de VD, e na DPOC.' },
    { med:'OXIGÊNIO SUPLEMENTAR', dose:'—', via:'—', obs:'Só se a saturação estiver abaixo de 90%.' }
  ],
  receita:[],
  orientacoes:[
    'Cateterismo imediato, em menos de 2 horas, se houver insuficiência cardíaca, choque, TV ou FV, ou angina refratária.',
    'Bloqueio de ramo esquerdo novo com clínica de IAM e instabilidade equivale a infarto: trata como supra.',
    'Clínica refratária com ECG normal: ECG seriado, radiografia de tórax e pensar em dissecção de aorta.'
  ] },

{ id:'q-iam-vd', grupo:'Cardiovascular', nome:'IAM de ventrículo direito', sub:'O infarto em que nitrato, morfina e diurético matam',
  tags:['iam vd','ventriculo direito','parede inferior','v3r','v4r'], conduta:'sca-com-supra',
  atencao:'Suspeitar sempre que houver supra de parede inferior (D2, D3, aVF). NÃO FAZER nitrato, morfina nem diurético: o ventrículo direito depende de pré-carga, e reduzi-la causa colapso hemodinâmico. Se hipotensão, a resposta é VOLUME.',
  unidade:[
    { med:'DERIVAÇÕES V3R E V4R', dose:'—', via:'—', obs:'Supra em V4R confirma o acometimento do ventrículo direito. Fazer em todo supra de parede inferior.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'250 a 500 mL', via:'EV', obs:'Em bolus, se hipotensão. Reavaliar a ausculta pulmonar a cada expansão.' },
    { med:'ÁCIDO ACETILSALICÍLICO 100 MG COMPRIMIDO', dose:'3 comprimidos (300 mg)', via:'VO', obs:'Mastigar.' },
    { med:'ACIONAR A REPERFUSÃO IMEDIATAMENTE', dose:'—', via:'—', obs:'Angioplastia primária em até 120 minutos, ou trombólise em até 30 minutos.' }
  ],
  receita:[],
  orientacoes:[
    'Monitorização contínua: o IAM inferior cursa com bradicardia e bloqueio atrioventricular com frequência.',
    'Atropina e marca-passo transcutâneo à mão.'
  ] },

{ id:'q-pericardite', grupo:'Cardiovascular', nome:'Pericardite aguda', sub:'Dor ventilatório-dependente, supra difuso e côncavo',
  tags:['pericardite','dor ventilatorio dependente','colchicina','infra pr'], conduta:'pericardite-miocardite',
  atencao:'O ECG tem supra de ST difuso e côncavo com infra de PR — não segue território coronariano. Afastar tamponamento: turgência jugular, hipotensão e bulhas abafadas. Se houver derrame importante, é ecocardiograma agora.',
  unidade:[
    { med:'ÁCIDO ACETILSALICÍLICO 500 MG COMPRIMIDO', dose:'750 a 1000 mg', via:'VO', obs:'De 8/8 horas. Escolha se houver infarto recente associado.' },
    { med:'IBUPROFENO 600 MG COMPRIMIDO', dose:'600 mg', via:'VO', obs:'De 8/8 horas. Alternativa ao ácido acetilsalicílico. Sempre com colchicina.' }
  ],
  receita:[
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 1 a 2 semanas, com redução gradual.' },
    { med:'Colchicina 0,5 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 3 meses (1 vez ao dia se peso abaixo de 70 kg). Reduz a recorrência pela metade — não esquecer.' },
    { med:'Omeprazol 20 mg cápsula', uso:'Tomar 1 cápsula VO em jejum enquanto usar o anti-inflamatório.' },
    { med:'Prednisona 20 mg comprimido', uso:'0,2 a 0,5 mg/kg/dia VO por 2 a 4 semanas. Só se o anti-inflamatório for contraindicado ou falhar — corticoide aumenta a recorrência.' }
  ],
  orientacoes:[
    'Restrição de exercício físico até a resolução dos sintomas e a normalização dos marcadores.',
    'Retorno imediato se falta de ar, inchaço, desmaio ou piora da dor.'
  ] },

/* ====================== PARADA E ARRITMIAS ====================== */
{ id:'q-pcr-fv', grupo:'Parada e arritmias', nome:'PCR em ritmo chocável', sub:'FV ou TV sem pulso — a sequência dos choques',
  tags:['pcr','fv','tv sem pulso','acls','adrenalina','amiodarona','desfibrilacao'], conduta:'pcr-adulto',
  atencao:'Desfibrilar é a única coisa que reverte FV — cada minuto de atraso custa cerca de 10% de sobrevida. Compressão de qualidade e mínima interrupção valem mais que qualquer droga.',
  unidade:[
    { med:'1º CHOQUE — BIFÁSICO 120 A 200 J OU O MÁXIMO DO APARELHO (MONOFÁSICO 360 J)', dose:'—', via:'—', obs:'Retomar RCP 30:2 imediatamente. Acesso venoso e monitorização. Preparar adrenalina. Checar o ritmo após 2 minutos.' },
    { med:'2º CHOQUE + EPINEFRINA 1 MG/ML AMP 1 ML', dose:'1 mg', via:'EV', obs:'Seguida de flush de 20 mL de SF 0,9% e elevação do membro. Repetir a cada 3 a 5 minutos. Preparar amiodarona. Considerar via aérea avançada.' },
    { med:'3º CHOQUE + AMIODARONA CLORIDRATO 50 MG/ML', dose:'300 mg (2 ampolas) em bolus', via:'EV/IO', obs:'Puro ou em 20 mL de SG 5% — NÃO diluir em soro na parada. Ou lidocaína 1 a 1,5 mg/kg. Considerar os 5H e 5T.' },
    { med:'4º CHOQUE + EPINEFRINA', dose:'1 mg', via:'EV', obs:'Manter o ciclo de 3 a 5 minutos.' },
    { med:'5º CHOQUE + AMIODARONA — SEGUNDA DOSE', dose:'150 mg (1 ampola) em bolus', via:'EV/IO', obs:'Dose única adicional. Ou lidocaína 0,5 a 0,75 mg/kg.' },
    { med:'VIA AÉREA AVANÇADA', dose:'—', via:'—', obs:'Checar o tubo, confirmar por capnografia, fixar. PETCO2 abaixo de 10 mmHg indica compressão ruim.' }
  ],
  receita:[],
  orientacoes:[
    '5H: hipovolemia, hipóxia, hidrogênio (acidose), hipo e hipercalemia, hipotermia.',
    '5T: tensão no tórax (pneumotórax), tamponamento, toxinas, trombose coronariana, trombose pulmonar.',
    'Trocar quem comprime a cada 2 minutos, na checagem de ritmo.'
  ] },

{ id:'q-pcr-aesp', grupo:'Parada e arritmias', nome:'PCR em ritmo não chocável', sub:'AESP e assistolia',
  tags:['pcr','aesp','assistolia','acls','protocolo da linha reta'], conduta:'pcr-adulto',
  atencao:'Assistolia exige o protocolo da linha reta antes de assumir: conferir Cabos, Ganhos e Derivações. Em AESP, a sobrevida está em achar e tratar a causa — os 5H e 5T — não na droga.',
  unidade:[
    { med:'RCP DE ALTA QUALIDADE, 30:2', dose:'—', via:'—', obs:'100 a 120 compressões por minuto, 5 a 6 cm de profundidade, retorno total do tórax. NÃO desfibrilar.' },
    { med:'EPINEFRINA 1 MG/ML AMP 1 ML', dose:'1 mg', via:'EV', obs:'O QUANTO ANTES em ritmo não chocável, e repetir a cada 3 a 5 minutos. Flush de 20 mL.' },
    { med:'VIA AÉREA AVANÇADA E ACESSO', dose:'—', via:'—', obs:'Intraósseo se não houver acesso venoso em 2 tentativas ou 90 segundos.' },
    { med:'BUSCAR E TRATAR OS 5H E 5T', dose:'—', via:'—', obs:'POCUS à beira do leito ajuda: tamponamento, pneumotórax, hipovolemia, TEP.' },
    { med:'PROTOCOLO DA LINHA RETA', dose:'—', via:'—', obs:'Cabos conectados, ganho aumentado, trocar a derivação — antes de declarar assistolia.' }
  ],
  receita:[],
  orientacoes:[
    'Checar ritmo a cada 2 minutos, com pausa mínima.',
    'Considerar o término dos esforços conforme o tempo de parada, o ritmo e a causa.'
  ] },

{ id:'q-pos-parada', grupo:'Parada e arritmias', nome:'Cuidados pós-parada', sub:'O que fazer depois do retorno da circulação',
  tags:['pos parada','rce','hipotermia','controle de temperatura','petco2'], conduta:'pcr-adulto',
  atencao:'Hiperóxia e hipocapnia pioram o desfecho neurológico. Titular o oxigênio para 92 a 98% e a ventilação para PETCO2 de 35 a 45 mmHg — não hiperventilar.',
  unidade:[
    { med:'A — VIA AÉREA: INTUBAÇÃO E CAPNOGRAFIA', dose:'—', via:'—', obs:'Alvo de PETCO2 entre 35 e 45 mmHg.' },
    { med:'B — VENTILAÇÃO', dose:'—', via:'—', obs:'Ausculta para checar o tubo. Alvo de SatO2 entre 92 e 98%.' },
    { med:'C — HEMODINÂMICA', dose:'—', via:'—', obs:'Alvo de PAS acima de 90 mmHg e PAM de 65 ou mais. Bolus de cristaloide conforme a resposta e noradrenalina se necessário.' },
    { med:'D — AVALIAÇÃO NEUROLÓGICA', dose:'—', via:'—', obs:'Se comatoso: controle ativo da temperatura, evitando febre (acima de 37,5 °C) por pelo menos 72 horas.' },
    { med:'E — EXAMES', dose:'—', via:'—', obs:'ECG de 12 derivações, gasometria, eletrólitos, glicemia, troponina, radiografia de tórax. Cateterismo de emergência se houver supra ou choque cardiogênico.' }
  ],
  receita:[],
  orientacoes:[
    'Transferir para terapia intensiva.',
    'Não prognosticar nas primeiras 72 horas, e nunca sob sedação.'
  ] },

{ id:'q-bradicardia', grupo:'Parada e arritmias', nome:'Bradicardia sintomática', sub:'Atropina, marca-passo e drogas de segunda linha',
  tags:['bradicardia','atropina','marca passo','dopamina','bav'], conduta:'bradiarritmia',
  atencao:'O que define a conduta é a instabilidade, não o número: rebaixamento de consciência, hipotensão, má perfusão, dor torácica ou dispneia. Em bloqueio atrioventricular total ou Mobitz II, a atropina costuma não funcionar — ir direto para o marca-passo.',
  unidade:[
    { med:'ATROPINA SULFATO 0,25 MG/ML', dose:'1 mg', via:'EV', obs:'Primeira droga, em bolus rápido, a cada 3 a 5 minutos até 3 mg. Dose menor que 0,5 mg causa bradicardia paradoxal.' },
    { med:'MARCA-PASSO TRANSCUTÂNEO', dose:'—', via:'—', obs:'Sem demora se a atropina falhar. Sedar e analgesiar o paciente — dói muito. Confirmar captura elétrica E mecânica (pulso).' },
    { med:'DOPAMINA', dose:'5 a 20 mcg/kg/min', via:'EV', obs:'Bomba de infusão. Segunda linha.' },
    { med:'EPINEFRINA', dose:'2 a 10 mcg/min', via:'EV', obs:'Bomba de infusão. Segunda linha, alternativa à dopamina.' }
  ],
  receita:[],
  orientacoes:[
    'Procurar a causa: betabloqueador, verapamil, digital, amiodarona, sotalol, hipercalemia, hipotireoidismo, IAM de parede inferior, hipertensão intracraniana.',
    'Bradicardia por vagotonia (dor, medo, micção, passagem de sonda) costuma ser transitória.',
    'Acionar a cardiologia para marca-passo transvenoso ou definitivo.'
  ] },

{ id:'q-taqui-instavel', grupo:'Parada e arritmias', nome:'Taquicardia instável — cardioversão', sub:'Os seis passos e a sedação',
  tags:['cardioversao','cve','taquicardia instavel','sedacao','etomidato'], conduta:'taquiarritmia-instavel',
  atencao:'Instabilidade é hipotensão, dor torácica isquêmica, congestão pulmonar ou rebaixamento. Aí não se discute droga: é choque SINCRONIZADO. Conferir o botão de sincronismo a cada choque — muitos aparelhos o desligam sozinho depois de disparar.',
  unidade:[
    { med:'1 ORIENTAR — 2 SEDOANALGESIAR — 3 AMBUZAR — 4 SINCRONIZAR — 5 CARDIOVERTER — 6 OBSERVAR', dose:'—', via:'—', obs:'A sequência inteira, na ordem. Material de via aérea e desfibrilador prontos.' },
    { med:'ETOMIDATO 2 MG/ML', dose:'0,1 a 0,15 mg/kg', via:'EV', obs:'Lento. Sedativo de escolha por manter a estabilidade hemodinâmica.' },
    { med:'MIDAZOLAM 5 MG/ML AMP 3 ML', dose:'3 a 5 mg + 10 mL de SF 0,9%', via:'EV', obs:'Lento. Alternativa ao etomidato.' },
    { med:'FENTANILA CITRATO 50 MCG/ML', dose:'1 mL, checar resposta e repetir 1 mL', via:'EV', obs:'Analgesia antes do choque.' },
    { med:'CARGA — FIBRILAÇÃO ATRIAL', dose:'Bifásico 120 a 200 J', via:'—', obs:'Monofásico: 200 J.' },
    { med:'CARGA — FLUTTER ATRIAL E TSV', dose:'Bifásico 50 a 100 J', via:'—', obs:'Costumam reverter com carga baixa.' },
    { med:'CARGA — TV MONOMÓRFICA COM PULSO', dose:'Bifásico 100 J', via:'—', obs:'TV polimórfica instável: desfibrilar, não sincronizar.' }
  ],
  receita:[],
  orientacoes:[
    'Se a FA tem mais de 48 horas ou início indeterminado e o paciente está estável, NÃO cardioverter sem anticoagulação plena por 3 semanas ou ecocardiograma transesofágico.',
    'Observar em monitor após a reversão; manter acesso e material de via aérea.'
  ] },

{ id:'q-tsv', grupo:'Parada e arritmias', nome:'TSV paroxística estável', sub:'Manobra vagal e adenosina',
  tags:['tsv','taquicardia supraventricular','adenosina','manobra vagal','qrs estreito'], conduta:'taqui-qrs-estreito',
  atencao:'Avisar o paciente antes da adenosina: ele vai sentir mal-estar intenso, calor e sensação de morte iminente por alguns segundos. A meia-vida é de segundos — por isso o bolus tem que ser rápido, em veia calibrosa e proximal, com flush imediato.',
  unidade:[
    { med:'MANOBRA VAGAL — VALSALVA MODIFICADA', dose:'—', via:'—', obs:'Soprar numa seringa de 10 mL por 15 segundos sentado, e em seguida deitar com as pernas elevadas por 15 segundos. Reverte cerca de 40%.' },
    { med:'ADENOSINA 3 MG/ML AMP 2 ML', dose:'6 mg', via:'EV', obs:'Bolus RÁPIDO em veia proximal, seguido de flush de 20 mL de SF 0,9% e elevação do braço. Registrar ECG contínuo durante.' },
    { med:'ADENOSINA — SEGUNDA DOSE', dose:'12 mg', via:'EV', obs:'Em 1 a 2 minutos, se não reverter. Pode repetir 12 mg mais uma vez.' },
    { med:'METOPROLOL TARTARATO 1 MG/ML AMP 5 ML', dose:'5 mg', via:'EV', obs:'Se não reverter com adenosina. Bolus lento, repetir até 15 mg.' }
  ],
  receita:[],
  orientacoes:[
    'Mesmo revertendo, o ECG durante a manobra tem valor diagnóstico — guardar o traçado.',
    'Ensinar a manobra de Valsalva ao paciente para as próximas crises.',
    'Encaminhamento à cardiologia: a ablação é curativa.'
  ] },

{ id:'q-tv-torsades', grupo:'Parada e arritmias', nome:'TV e Torsades de Pointes', sub:'Monomórfica sustentada e polimórfica com QT longo',
  tags:['tv','taquicardia ventricular','torsades','qt longo','sulfato de magnesio','amiodarona'], conduta:'taqui-qrs-largo',
  atencao:'Taquicardia de QRS largo é TV até prova em contrário, sobretudo em cardiopata — tratar como TV é sempre mais seguro. Na intoxicação por cocaína, o tratamento é bicarbonato de sódio e NÃO betabloqueador.',
  unidade:[
    { med:'TV MONOMÓRFICA ESTÁVEL — AMIODARONA 150 MG', dose:'150 mg + 100 mL de SG 5%', via:'EV', obs:'Correr em mais de 10 minutos. Alternativa brasileira: 300 mg + 250 mL de SG 5% lento.' },
    { med:'TV MONOMÓRFICA INSTÁVEL — CARDIOVERSÃO SINCRONIZADA', dose:'100 J', via:'—', obs:'Sedar antes.' },
    { med:'TORSADES — SULFATO DE MAGNÉSIO 50% AMP 10 ML', dose:'2 g em 100 mL de SF 0,9%', via:'EV', obs:'Correr em 15 minutos. Funciona mesmo com magnésio sérico normal.' },
    { med:'TORSADES — CORREÇÃO DE ELETRÓLITOS', dose:'—', via:'—', obs:'Levar o potássio para 4,5 a 5,5 mEq/L. Corrigir cálcio e magnésio.' },
    { med:'TORSADES INSTÁVEL — DESFIBRILAÇÃO', dose:'Bifásico 200 J', via:'—', obs:'NÃO sincronizada: o aparelho não consegue sincronizar em ritmo polimórfico.' }
  ],
  receita:[],
  orientacoes:[
    'Suspender toda droga que alarga o QT: haloperidol, antidepressivo tricíclico, cloroquina, macrolídeo, ondansetrona em dose alta, antiarrítmico.',
    'QT longo congênito: betabloqueador; adquirido: retirar a causa.',
    'Acionar a cardiologia.'
  ] },

/* ====================== NEURO E PSIQUIATRIA ====================== */
{ id:'q-avei', grupo:'Neuro e Psiquiatria', nome:'AVE isquêmico', sub:'Janela, pressão permissiva e trombólise',
  tags:['avc','ave isquemico','trombolise','alteplase','rtpa','deficit'], conduta:'avc-isquemico',
  atencao:'Hipertensão é PERMISSIVA: só tratar acima de 220 x 120 mmHg. Em candidato a trombólise, o alvo é abaixo de 185 x 110. Baixar a pressão fora disso amplia a área de infarto. NÃO dar antiagregante antes da tomografia.',
  unidade:[
    { med:'TOMOGRAFIA DE CRÂNIO SEM CONTRASTE — IMEDIATA', dose:'—', via:'—', obs:'Antes de qualquer antiagregante ou trombolítico. Definir a hora exata do último momento em que foi visto bem.' },
    { med:'GLICEMIA CAPILAR', dose:'—', via:'—', obs:'Hipoglicemia imita AVE. Obrigatória antes de acionar o protocolo.' },
    { med:'ALTEPLASE (rTPA)', dose:'0,9 mg/kg, máximo de 90 mg', via:'EV', obs:'10% em bolus e o restante em 60 minutos. Janela de até 4,5 horas. Contraindicado se houve AVE hemorrágico prévio, ou AVE ou TCE nos últimos 3 meses.' },
    { med:'ÁCIDO ACETILSALICÍLICO 100 MG COMPRIMIDO', dose:'2 comprimidos (200 mg)', via:'VO', obs:'Nas primeiras 24 a 48 horas, DEPOIS de afastar hemorragia. Se houve trombólise, só após 24 horas.' },
    { med:'ENOXAPARINA SÓDICA 40 MG', dose:'40 mg', via:'SC', obs:'Uma vez ao dia — profilaxia de trombose no acamado.' },
    { med:'ATORVASTATINA 20 A 80 MG', dose:'1 comprimido', via:'VO', obs:'À noite.' }
  ],
  receita:[],
  orientacoes:[
    'Controlar glicemia, temperatura (evitar febre) e sódio — os três pioram a área de penumbra.',
    'Cabeceira a 30 graus, jejum até o teste de deglutição.',
    'Acionar a linha de cuidado do AVC e a vaga em unidade especializada.'
  ] },

{ id:'q-aveh', grupo:'Neuro e Psiquiatria', nome:'AVE hemorrágico', sub:'Controle pressórico agressivo e neuroproteção',
  tags:['ave hemorragico','hemorragia subaracnoide','nimodipina','pas 140'], conduta:'avc-hemorragico',
  atencao:'Aqui a pressão é o inimigo, ao contrário do isquêmico: alvo de PAS entre 130 e 140 mmHg. Reverter anticoagulação imediatamente se houver. Tríade de Cushing (hipertensão, bradicardia e alteração respiratória) indica hipertensão intracraniana e herniação iminente.',
  unidade:[
    { med:'TOMOGRAFIA DE CRÂNIO SEM CONTRASTE', dose:'—', via:'—', obs:'Confirma e define hematoma intraparenquimatoso versus hemorragia subaracnóidea.' },
    { med:'CONTROLE PRESSÓRICO — ALVO DE PAS 130 A 140 MMHG', dose:'—', via:'EV', obs:'Nitroprussiato ou nitroglicerina em bomba, ou metoprolol em bolus. Reduzir de forma controlada.' },
    { med:'NIMODIPINA 60 MG COMPRIMIDO', dose:'60 mg', via:'VO ou SNG', obs:'De 4/4 h por 14 a 21 dias. Neuroproteção na hemorragia subaracnóidea — reduz o vasoespasmo.' },
    { med:'CABECEIRA A 30 GRAUS, CABEÇA NEUTRA, ANALGESIA E CONTROLE DA AGITAÇÃO', dose:'—', via:'—', obs:'Medidas antiedema. Evitar hipotonia e hipertermia.' },
    { med:'REVERTER ANTICOAGULAÇÃO', dose:'—', via:'EV', obs:'Varfarina: complexo protrombínico e vitamina K. Heparina: protamina.' }
  ],
  receita:[],
  orientacoes:[
    'Acionar a neurocirurgia: intervenção precoce até o 3º dia, ou só após o 14º.',
    'Vaga em terapia intensiva.'
  ] },

{ id:'q-abstinencia', grupo:'Neuro e Psiquiatria', nome:'Abstinência alcoólica', sub:'Hidratação, tiamina e benzodiazepínico',
  tags:['abstinencia','alcool','delirium tremens','tiamina','diazepam','wernicke'], conduta:'abstinencia-alcool',
  atencao:'TIAMINA ANTES DA GLICOSE, sempre — glicose isolada no etilista precipita encefalopatia de Wernicke. Delirium tremens (confusão, alucinação, febre, taquicardia, sudorese profusa) tem mortalidade real e é caso de terapia intensiva.',
  unidade:[
    { med:'TIAMINA CLORIDRATO 100 MG/ML AMP 1 ML', dose:'1 a 3 ampolas (100 a 300 mg)', via:'EV', obs:'ANTES de qualquer soro glicosado. Manter por vários dias.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL', via:'EV', obs:'Hidratação venosa. Repor magnésio e potássio, quase sempre baixos.' },
    { med:'DIAZEPAM 5 MG/ML AMP 2 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'LENTO, podendo repetir de 1/1 h até a sedação leve. Titular pelos sintomas, não por dose fixa.' },
    { med:'GLICOSE 50% SOLUÇÃO INJETÁVEL AMP 10 ML', dose:'4 ampolas', via:'EV', obs:'SE hipoglicemia — sempre depois da tiamina.' },
    { med:'SULFATO DE MAGNÉSIO 50% AMP 10 ML', dose:'2 g em 100 mL de SF 0,9%', via:'EV', obs:'SE hipomagnesemia. Correr em 1 hora.' },
    { med:'HALOPERIDOL 5 MG/ML AMP 1 ML', dose:'1 ampola', via:'IM', obs:'SE alucinação importante. Adjuvante — o benzodiazepínico continua sendo a base.' }
  ],
  receita:[
    { med:'Tiamina 300 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, uso contínuo.' },
    { med:'Diazepam 10 mg comprimido', uso:'Esquema de retirada em doses decrescentes, sob supervisão. Não prescrever sem seguimento.' },
    { med:'Ácido fólico 5 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia.' }
  ],
  orientacoes:[
    'Ambiente calmo, bem iluminado e com reorientação frequente.',
    'Encaminhar ao CAPS-AD e à rede de atenção psicossocial — a abstinência tratada sem seguimento recidiva.',
    'Rastrear hepatopatia, desnutrição e pancreatite.'
  ] },

/* ====================== METABÓLICO E ELETRÓLITOS ====================== */
{ id:'q-hiponatremia', grupo:'Metabólico e eletrólitos', nome:'Hiponatremia', sub:'Crônica assintomática e aguda sintomática',
  tags:['hiponatremia','sodio','nacl 3%','mielinolise','hipertonica'], conduta:'hiponatremia',
  atencao:'Corrigir no máximo 8 a 10 mEq/L em 24 horas: subir rápido demais causa mielinólise pontina, que é irreversível. Só a hiponatremia AGUDA e SINTOMÁTICA (convulsão, coma) justifica salina hipertônica, e mesmo assim com dosagens seriadas de sódio.',
  unidade:[
    { med:'SOLUÇÃO HIPERTÔNICA — SF 0,9% 445 ML + NaCl 20% 55 ML', dose:'100 mL em 10 minutos', via:'EV', obs:'Em bomba, na sintomática aguda. Equivale a salina a cerca de 3%. Repetir até cessar o sintoma; redosar o sódio a cada 2 horas.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL em 24 horas', via:'EV', obs:'Manutenção, conforme a volemia.' },
    { med:'FUROSEMIDA 10 MG/ML AMP 2 ML', dose:'40 mg', via:'EV', obs:'SE hipervolemia ou SIADH, associada à restrição hídrica.' },
    { med:'RESTRIÇÃO DE ÁGUA LIVRE', dose:'—', via:'—', obs:'Base do tratamento na SIADH e no hipervolêmico.' }
  ],
  receita:[
    { med:'Furosemida 40 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, na hiponatremia crônica sem hipovolemia, conforme orientação.' }
  ],
  orientacoes:[
    'Classificar pela volemia antes de tratar: hipo, eu ou hipervolêmica — o tratamento é oposto entre elas.',
    'Revisar diurético tiazídico, antidepressivo e carbamazepina.',
    'Dosar sódio, osmolaridade sérica e urinária e sódio urinário.'
  ] },

{ id:'q-hipernatremia', grupo:'Metabólico e eletrólitos', nome:'Hipernatremia', sub:'Reposição de água livre, devagar',
  tags:['hipernatremia','sodio alto','agua livre','desidratacao'], conduta:'hipernatremia',
  atencao:'Reduzir o sódio em no máximo 10 mEq/L nas primeiras 24 horas — queda rápida causa edema cerebral. Corrigir primeiro a instabilidade hemodinâmica com SF 0,9%, e só depois o déficit de água livre.',
  unidade:[
    { med:'GLICOSE 5% SOLUÇÃO INJETÁVEL', dose:'Conforme o déficit de água livre', via:'EV', obs:'Reposição lenta, com dosagem de sódio a cada 4 a 6 horas.' },
    { med:'CLORETO DE SÓDIO 0,45% SOLUÇÃO INJETÁVEL', dose:'Conforme o déficit', via:'EV', obs:'Alternativa ao soro glicosado, sobretudo se houver hiperglicemia.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 a 1000 mL', via:'EV', obs:'PRIMEIRO, se houver instabilidade hemodinâmica: restaurar a perfusão vem antes de corrigir o sódio.' },
    { med:'ÁGUA LIVRE POR SONDA NASOENTÉRICA', dose:'Conforme o déficit', via:'SNE', obs:'Via preferencial quando disponível — mais segura e mais fisiológica.' }
  ],
  receita:[],
  orientacoes:[
    'A causa quase sempre é falta de acesso à água: idoso acamado, demência, criança pequena. Corrigir isso é parte do tratamento.',
    'Investigar diabetes insipidus se houver poliúria com urina diluída.'
  ] },

{ id:'q-hipocalemia', grupo:'Metabólico e eletrólitos', nome:'Hipocalemia', sub:'Reposição oral e venosa de potássio',
  tags:['hipocalemia','potassio baixo','kcl','reposicao'], conduta:'hipocalemia',
  atencao:'Nunca em bolus. Em veia periférica, no máximo 40 mEq por litro e 10 a 20 mEq por hora — mais que isso queima a veia e arrisca arritmia. Se o magnésio estiver baixo, o potássio não sobe: repor magnésio junto. Evitar soro glicosado, que empurra o potássio para dentro da célula.',
  unidade:[
    { med:'CLORETO DE POTÁSSIO 10% — KCL 40 ML + NaCl 0,45% 210 ML', dose:'Correr em 4 horas', via:'EV', obs:'Esquema de reposição mais rápida, para intolerância à via oral ou potássio abaixo de 3,0. Em veia calibrosa e com monitorização.' },
    { med:'CLORETO DE POTÁSSIO 10% — KCL 30 ML + SF 0,9% 470 ML', dose:'Correr em 24 horas', via:'EV', obs:'Esquema de manutenção.' },
    { med:'SULFATO DE MAGNÉSIO 50% AMP 10 ML', dose:'2 g em 100 mL de SF 0,9%', via:'EV', obs:'Repor junto sempre que o magnésio estiver baixo ou não puder ser dosado.' },
    { med:'CLORETO DE POTÁSSIO 600 MG COMPRIMIDO', dose:'1 a 2 comprimidos', via:'VO', obs:'De 6/6 h. Preferir a via oral sempre que possível.' },
    { med:'CLORETO DE POTÁSSIO XAROPE 900 MG/15 ML', dose:'15 mL', via:'VO', obs:'De 6/6 h. Diluir em suco — o gosto é ruim.' }
  ],
  receita:[
    { med:'Cloreto de potássio 600 mg comprimido', uso:'Tomar 1 a 2 comprimidos VO de 6/6 h, conforme orientação e controle laboratorial.' }
  ],
  orientacoes:[
    'ECG se o potássio estiver abaixo de 3,0: onda U, achatamento da T, infra de ST.',
    'Investigar a causa: diurético, vômito, diarreia, hiperaldosteronismo, insulina, beta-2 agonista.',
    'Redosar o potássio após a reposição.'
  ] },

{ id:'q-acidose', grupo:'Metabólico e eletrólitos', nome:'Acidose metabólica grave', sub:'Quando e como usar bicarbonato',
  tags:['acidose','bicarbonato','ph','anion gap','hco3'], conduta:'acido-base',
  atencao:'Bicarbonato só em acidose grave: pH igual ou abaixo de 7,2 (7,0 na cetoacidose diabética) com HCO3 abaixo de 10. Tratar o número sem tratar a causa não resolve. NUNCA infundir sem diluir: causa hipernatremia e hiperosmolaridade.',
  unidade:[
    { med:'BICARBONATO DE SÓDIO 8,4% — 150 ML + SG 5% 850 ML', dose:'1 a 2 mL/kg', via:'EV', obs:'Lentamente. A diluição é obrigatória.' },
    { med:'GASOMETRIA ARTERIAL, ELETRÓLITOS E LACTATO', dose:'—', via:'—', obs:'Calcular o ânion-gap para separar as causas. Redosar após a intervenção.' },
    { med:'TRATAR A CAUSA', dose:'—', via:'—', obs:'Sepse, cetoacidose, insuficiência renal, intoxicação, diarreia. A acidose é consequência.' }
  ],
  receita:[],
  orientacoes:[
    'HCO3 desejado = 0,38 x PaCO2.',
    'Déficit de HCO3 em mEq = (HCO3 desejado − HCO3 atual) x 0,5 x peso.',
    'Acionar a nefrologia se a acidose for refratária: é indicação de diálise.'
  ] }

]);

/* --- 11c. abdome cirurgico, figado, IST e suporte --- */
FERR_QUADROS = FERR_QUADROS.concat([

/* ====================== ABDOME CIRÚRGICO E FÍGADO ====================== */
{ id:'q-apendicite', grupo:'Abdome cirúrgico e fígado', nome:'Apendicite aguda', sub:'Antibiótico e o tempo de evolução decidem',
  tags:['apendicite','blumberg','dunphy','fid','cefoxitina'], conduta:'apendicite',
  atencao:'Menos de 48 horas: apendicectomia com antibiótico. Mais de 48 horas muda a estratégia — tomografia primeiro. Abscesso drena e opera tarde; fleimão trata com antibiótico e opera em 6 a 8 semanas. Peritonite difusa é cirurgia de urgência com reanimação volêmica agressiva.',
  unidade:[
    { med:'JEJUM, ACESSO VENOSO E HIDRATAÇÃO', dose:'SF 0,9% 1000 mL', via:'EV', obs:'Analgesia não atrapalha o diagnóstico — pode e deve ser feita.' },
    { med:'CEFOXITINA 2 G', dose:'2 g de ataque, depois 1 g', via:'EV', obs:'De 6/6 h. Esquema de escolha na apendicite não perfurada.' },
    { med:'CEFTRIAXONA 2 G + METRONIDAZOL 500 MG', dose:'Ceftriaxona 2 g/dia + metronidazol 500 mg', via:'EV', obs:'Metronidazol de 8/8 h. Esquema para apêndice perfurado.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g) + 100 mL de SF 0,9%', via:'EV', obs:'De 6/6 h.' },
    { med:'ONDANSETRONA CLORIDRATO 2 MG/ML AMP 2 ML', dose:'2 ampolas (8 mg)', via:'EV', obs:'SE náusea ou vômito.' }
  ],
  receita:[],
  orientacoes:[
    'Sinais que ajudam: Blumberg (descompressão dolorosa), Dunphy (dor em FID à tosse), obturador (dor hipogástrica à flexão e rotação interna do quadril, achado tardio).',
    'Acionar a cirurgia geral; hemograma, PCR, beta-HCG em mulher em idade fértil.',
    'Após abscesso drenado: colonoscopia em 4 a 6 semanas.'
  ] },

{ id:'q-diverticulite', grupo:'Abdome cirúrgico e fígado', nome:'Diverticulite aguda', sub:'Sem complicação trata em casa; com complicação interna',
  tags:['diverticulite','fie','ciprofloxacino','metronidazol','hinchey'], conduta:'diverticulite',
  atencao:'Abscesso maior que 4 cm drena. Peritonite ou obstrução é cirurgia de urgência (Hartmann). Colonoscopia é obrigatória depois da resolução — para não perder um câncer de cólon que se apresentou assim.',
  unidade:[
    { med:'CEFTRIAXONA 1 G + METRONIDAZOL 500 MG', dose:'Ceftriaxona 1 a 2 g/dia + metronidazol 500 mg', via:'EV', obs:'Metronidazol de 8/8 h. Para sintomas exuberantes: febre, leucocitose com desvio, descompressão dolorosa.' },
    { med:'DIETA ZERO E HIDRATAÇÃO VENOSA', dose:'SF 0,9% 1000 mL', via:'EV', obs:'Nos casos que internam.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'De 6/6 h. Evitar anti-inflamatório e opioide constipante.' }
  ],
  receita:[
    { med:'Ciprofloxacino 500 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 7 a 10 dias. Para o caso não complicado.' },
    { med:'Metronidazol 400 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h por 7 a 10 dias, associado ao ciprofloxacino. Não ingerir álcool.' },
    { med:'Dieta líquida', uso:'Dieta líquida por 2 a 3 dias, com progressão conforme a melhora.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor.' }
  ],
  orientacoes:[
    'Colonoscopia 4 a 6 semanas após a resolução.',
    'Reavaliação em 48 a 72 horas.',
    'Retorno imediato se febre alta, dor difusa, distensão, vômito ou parada de eliminação de gases e fezes.'
  ] },

{ id:'q-colecistite', grupo:'Abdome cirúrgico e fígado', nome:'Colecistite aguda', sub:'Dor acima de 6 h, Murphy positivo, febre e leucocitose',
  tags:['colecistite','murphy','ampicilina sulbactam','vesicula'], conduta:'colecistite-colangite',
  atencao:'Colecistectomia precoce, em até 72 horas, tem melhor desfecho que esperar esfriar. Em paciente grave ou sem condição cirúrgica, a saída é colecistostomia percutânea.',
  unidade:[
    { med:'AMPICILINA 1 G + SULBACTAM 500 MG', dose:'2 frascos + 6,4 mL de AD + 100 mL de SF 0,9%', via:'EV', obs:'De 6/6 h. Esquema de escolha.' },
    { med:'CEFTRIAXONA 1 G + METRONIDAZOL 500 MG', dose:'2 frascos (2 g) 1x/dia + metronidazol 500 mg', via:'EV', obs:'Metronidazol de 8/8 h. Alternativa.' },
    { med:'JEJUM, HIDRATAÇÃO E ANALGESIA', dose:'SF 0,9% 1000 mL', via:'EV', obs:'Dipirona 2 g EV de 6/6 h; cetoprofeno ou opioide se necessário.' }
  ],
  receita:[],
  orientacoes:[
    'Ultrassom de abdome: parede espessada, líquido perivesicular, cálculo impactado, Murphy ultrassonográfico.',
    'Acionar a cirurgia geral para colecistectomia precoce.',
    'Hemograma, PCR, bilirrubinas, transaminases, amilase e lipase — para separar de colangite e pancreatite.'
  ] },

{ id:'q-colangite', grupo:'Abdome cirúrgico e fígado', nome:'Colangite aguda', sub:'Tríade de Charcot: febre, icterícia e dor abdominal',
  tags:['colangite','charcot','reynolds','piperacilina','drenagem biliar'], conduta:'colecistite-colangite',
  atencao:'Antibiótico não resolve colangite: o tratamento é DRENAGEM BILIAR. Se à tríade de Charcot se somarem hipotensão e rebaixamento (pêntade de Reynolds), é colangite grave — terapia intensiva e drenagem de urgência.',
  unidade:[
    { med:'PIPERACILINA 4 G + TAZOBACTAM 500 MG', dose:'1 frasco (4,5 g) + 20 mL de SF 0,9%', via:'EV', obs:'De 6/6 h, por 7 a 14 dias. Esquema para caso grave.' },
    { med:'CEFTRIAXONA 2 G + METRONIDAZOL 500 MG', dose:'Ceftriaxona 2 g 1x/dia + metronidazol 500 mg', via:'EV', obs:'Metronidazol de 8/8 h. Alternativa no caso não grave.' },
    { med:'HEMOCULTURAS ANTES DO ANTIBIÓTICO', dose:'2 amostras', via:'—', obs:'Sem atrasar a primeira dose.' },
    { med:'REANIMAÇÃO VOLÊMICA', dose:'SF 0,9% 30 mL/kg', via:'EV', obs:'SE hipotensão ou lactato elevado — tratar como sepse.' },
    { med:'DRENAGEM BILIAR', dose:'—', via:'—', obs:'CPRE de urgência. É a medida que resolve; acionar já.' }
  ],
  receita:[],
  orientacoes:[
    'Acionar endoscopia e cirurgia desde o reconhecimento.',
    'Vaga em terapia intensiva no caso grave.'
  ] },

{ id:'q-varizes', grupo:'Abdome cirúrgico e fígado', nome:'Hemorragia por varizes de esôfago', sub:'Droga vasoativa, endoscopia e profilaxia de PBE',
  tags:['varizes','hda','terlipressina','octreotide','cirrose','eda'], conduta:'hda',
  atencao:'A endoscopia é o tratamento, mas a droga vasoativa e o antibiótico entram ANTES dela e reduzem mortalidade por conta própria. Antibiótico profilático em toda hemorragia digestiva no cirrótico, sangrando ou não por varizes.',
  unidade:[
    { med:'DOIS ACESSOS CALIBROSOS, TIPAGEM E RESERVA DE HEMOCOMPONENTES', dose:'—', via:'—', obs:'Transfusão restritiva: alvo de hemoglobina em torno de 7 g/dL. Transfundir demais aumenta a pressão portal e o ressangramento.' },
    { med:'TERLIPRESSINA 1 MG', dose:'1 a 2 mg', via:'EV', obs:'De 4/4 h. Ou octreotide 50 mcg em bolus seguido de 50 mcg/h em bomba.' },
    { med:'CEFTRIAXONA 1 G', dose:'1 g', via:'EV', obs:'Uma vez ao dia, por 7 dias — profilaxia de peritonite bacteriana espontânea. Reduz mortalidade.' },
    { med:'OMEPRAZOL 40 MG', dose:'1 frasco', via:'EV', obs:'De 12/12 h.' },
    { med:'ENDOSCOPIA DIGESTIVA ALTA EM ATÉ 12 HORAS', dose:'—', via:'—', obs:'Ligadura elástica ou escleroterapia. Acionar de imediato.' }
  ],
  receita:[
    { med:'Propranolol 40 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h, uso contínuo — profilaxia secundária, associada à ligadura elástica.' },
    { med:'Carvedilol 6,25 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, até no máximo 6,25 mg de 12/12 h. Alternativa ao propranolol.' },
    { med:'Norfloxacino 400 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia — profilaxia de PBE enquanto persistir a ascite.' }
  ],
  orientacoes:[
    'Profilaxia primária (nunca sangrou) se as varizes forem de médio ou grande calibre, houver Child B ou C, ou pontos avermelhados: betabloqueador ou ligadura elástica.',
    'Proteger a via aérea se houver hematêmese volumosa ou rebaixamento.',
    'Rastrear e tratar encefalopatia hepática, frequente após o sangramento.'
  ] },

{ id:'q-pbe', grupo:'Abdome cirúrgico e fígado', nome:'Peritonite bacteriana espontânea', sub:'PMN acima de 250 no líquido ascítico',
  tags:['pbe','ascite','paracentese','cefotaxima','albumina','cirrose'], conduta:'cirrose-descompensada',
  atencao:'Paracentese diagnóstica em TODO cirrótico com ascite que interna — mesmo sem febre e sem dor. PBE se apresenta só como encefalopatia ou piora da função renal com frequência. Albumina junto ao antibiótico reduz a síndrome hepatorrenal e a mortalidade.',
  unidade:[
    { med:'PARACENTESE DIAGNÓSTICA', dose:'—', via:'—', obs:'Contagem de PMN acima de 250/mm³ fecha o diagnóstico. Semear em frasco de hemocultura à beira do leito.' },
    { med:'CEFTRIAXONA 1 G', dose:'1 g', via:'EV', obs:'De 12/12 h por 5 a 7 dias. Ou cefotaxima por 5 dias.' },
    { med:'ALBUMINA HUMANA 20%', dose:'1,5 g/kg no 1º dia e 1 g/kg no 3º dia', via:'EV', obs:'Profilaxia de síndrome hepatorrenal. Não esquecer — é o que muda mortalidade.' },
    { med:'SUSPENDER BETABLOQUEADOR E DIURÉTICO', dose:'—', via:'—', obs:'Durante o episódio agudo, se houver hipotensão ou lesão renal.' }
  ],
  receita:[
    { med:'Norfloxacino 400 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia — profilaxia secundária, enquanto persistir a ascite.' }
  ],
  orientacoes:[
    'GASA maior ou igual a 1,1 indica transudato: cirrose, insuficiência cardíaca, Budd-Chiari. Abaixo de 1,1 é exsudato: neoplasia, tuberculose, pâncreas.',
    'Se houver flora polimicrobiana e proteína alta, pensar em peritonite secundária: associar metronidazol e avaliar cirurgia.',
    'Profilaxia primária também está indicada após hemorragia por varizes e quando a proteína do líquido ascítico é menor que 1,5 g/dL.'
  ] },

{ id:'q-ascite', grupo:'Abdome cirúrgico e fígado', nome:'Ascite descompensada', sub:'Restrição de sódio, diurético e paracentese de alívio',
  tags:['ascite','espironolactona','furosemida','paracentese','gasa'], conduta:'cirrose-descompensada',
  atencao:'A proporção clássica é espironolactona 100 mg para furosemida 40 mg, mantida ao subir a dose. Meta de perda: 0,5 kg/dia sem edema periférico, ou até 1 kg/dia com edema — perder mais rápido causa lesão renal e encefalopatia. Em paracentese de grande volume (acima de 5 L), repor albumina.',
  unidade:[
    { med:'PARACENTESE DE ALÍVIO', dose:'—', via:'—', obs:'Se a ascite for tensa ou houver desconforto respiratório. Acima de 5 L retirados, repor 6 a 8 g de albumina por litro.' },
    { med:'ALBUMINA HUMANA 20%', dose:'6 a 8 g por litro retirado', via:'EV', obs:'Após paracentese de grande volume.' },
    { med:'RESTRIÇÃO DE SÓDIO — 2 G POR DIA', dose:'—', via:'—', obs:'Base do tratamento. Restrição hídrica só se o sódio estiver abaixo de 125.' }
  ],
  receita:[
    { med:'Espironolactona 25 mg comprimido', uso:'Tomar 4 comprimidos (100 mg) VO 1 vez ao dia, pela manhã, uso contínuo.' },
    { med:'Furosemida 40 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, pela manhã, associado à espironolactona.' },
    { med:'Dieta com restrição de sódio', uso:'No máximo 2 g de sódio (cerca de 5 g de sal) por dia.' }
  ],
  orientacoes:[
    'Pesar diariamente, no mesmo horário, e anotar.',
    'Nada de anti-inflamatório: precipita lesão renal e ascite refratária.',
    'Controlar potássio, sódio e creatinina a cada ajuste de diurético.'
  ] },

{ id:'q-rabdomiolise', grupo:'Abdome cirúrgico e fígado', nome:'Rabdomiólise', sub:'Hidratação vigorosa e alcalinização da urina',
  tags:['rabdomiolise','cpk','mioglobinuria','bicarbonato','estatina'], conduta:'rabdomiolise',
  atencao:'Hidratação precoce e abundante é o que previne a lesão renal — não espere a creatinina subir. Alcalinizar a urina só se CPK acima de 5.000, sem hipocalcemia, com pH abaixo de 7,5 e bicarbonato abaixo de 30.',
  unidade:[
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 a 2000 mL na primeira hora', via:'EV', obs:'Depois, manter débito urinário de 200 a 300 mL/h. Hidratação vigorosa é a medida principal.' },
    { med:'BICARBONATO DE SÓDIO 8,4% — 150 ML (15 AMP) + SG 5% 850 ML', dose:'200 mL/h', via:'EV', obs:'Alcalinização, mantendo diurese de 200 mL/h. Só nos critérios da caixa de atenção.' },
    { med:'CONTROLE DE POTÁSSIO, CÁLCIO E FÓSFORO', dose:'—', via:'—', obs:'Hipercalemia é a complicação que mata cedo. Não repor cálcio de rotina — só se sintomático.' },
    { med:'SONDAGEM VESICAL PARA CONTROLE DE DIURESE', dose:'—', via:'—', obs:'Urina cor de coca-cola com dipstick positivo para sangue e sem hemácias ao sedimento é mioglobinúria.' }
  ],
  receita:[],
  orientacoes:[
    'Procurar a causa: exercício extremo, trauma por esmagamento, imobilização prolongada, convulsão, estatina, cocaína, hipocalemia.',
    'Suspender a estatina.',
    'CPK, potássio, cálcio, fósforo, função renal e gasometria seriados; acionar a nefrologia se houver oligúria refratária.'
  ] },

/* ====================== IST E PROFILAXIAS ====================== */
{ id:'q-uretrite', grupo:'IST e profilaxias', nome:'Uretrite / corrimento uretral', sub:'Tratar gonococo e clamídia juntos, sempre',
  tags:['uretrite','corrimento','gonorreia','clamidia','ceftriaxona','azitromicina','ist'],
  atencao:'Trata-se empiricamente os dois agentes na mesma consulta — não se espera exame. Tratar o parceiro é parte do tratamento; sem isso, reinfecta. Oferecer sorologias para HIV, sífilis e hepatites B e C.',
  unidade:[
    { med:'CEFTRIAXONA SÓDICA 500 MG', dose:'500 mg', via:'IM', obs:'Dose única, profunda em glúteo. Cobre o gonococo.' },
    { med:'AZITROMICINA 500 MG COMPRIMIDO', dose:'2 comprimidos (1 g)', via:'VO', obs:'Dose única, na unidade, observada. Cobre a clamídia.' }
  ],
  receita:[
    { med:'Azitromicina 500 mg comprimido', uso:'Tomar 2 comprimidos VO em dose única, se não foi administrada na unidade.' },
    { med:'Tratamento do parceiro', uso:'Ceftriaxona 500 mg IM dose única + azitromicina 1 g VO dose única. Encaminhar o parceiro ao serviço.' }
  ],
  orientacoes:[
    'Abstinência sexual por 7 dias após o tratamento, do paciente e do parceiro.',
    'Oferecer teste rápido para HIV, sífilis e hepatites B e C, e a vacinação para hepatite B.',
    'Notificação conforme o protocolo local.',
    'Retorno se o corrimento persistir após 7 dias.'
  ] },

{ id:'q-dip', grupo:'IST e profilaxias', nome:'Doença inflamatória pélvica', sub:'Dor pélvica com dor à mobilização do colo',
  tags:['dip','doenca inflamatoria pelvica','anexite','ceftriaxona','doxiciclina','metronidazol'],
  atencao:'Na dúvida, trate: o custo de tratar sem DIP é baixo; o de não tratar é infertilidade, gravidez ectópica e dor pélvica crônica. Internar se houver gestação, abscesso tubo-ovariano, quadro grave com vômitos, falha do tratamento oral ou impossibilidade de seguimento.',
  unidade:[
    { med:'CEFTRIAXONA SÓDICA 500 MG', dose:'500 mg', via:'IM', obs:'Dose única.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g) + 100 mL de SF 0,9%', via:'EV', obs:'Analgesia.' }
  ],
  receita:[
    { med:'Doxiciclina 100 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 14 dias.' },
    { med:'Metronidazol 500 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 14 dias. Não ingerir álcool durante o tratamento.' },
    { med:'Tratamento do parceiro', uso:'Ceftriaxona 500 mg IM dose única + azitromicina 1 g VO dose única.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor.' }
  ],
  orientacoes:[
    'Completar os 14 dias mesmo com melhora rápida.',
    'Abstinência sexual durante todo o tratamento.',
    'Reavaliação em 72 horas: sem melhora, internar e reavaliar o diagnóstico.',
    'Ultrassom transvaginal se houver massa anexial ou febre persistente. Sorologias para HIV, sífilis e hepatites.'
  ] },

{ id:'q-sifilis', grupo:'IST e profilaxias', nome:'Sífilis', sub:'Penicilina benzatina conforme o estágio',
  tags:['sifilis','penicilina benzatina','vdrl','cancro','ist'],
  atencao:'Penicilina benzatina é o único tratamento que trata a gestante e o feto — alergia relatada exige teste e, se confirmada, dessensibilização, não substituição. Avisar sobre a reação de Jarisch-Herxheimer (febre e mal-estar nas primeiras 24 horas), que não é alergia.',
  unidade:[
    { med:'BENZILPENICILINA BENZATINA 1.200.000 UI', dose:'1 ampola em cada glúteo (2.400.000 UI)', via:'IM', obs:'Sífilis recente (primária, secundária ou latente com menos de 1 ano): dose única.' },
    { med:'BENZILPENICILINA BENZATINA — ESQUEMA DA SÍFILIS TARDIA', dose:'2.400.000 UI por semana, 3 semanas', via:'IM', obs:'Sífilis latente tardia ou de duração ignorada. Total de 7.200.000 UI.' },
    { med:'OBSERVAÇÃO POR 30 MINUTOS APÓS A APLICAÇÃO', dose:'—', via:'—', obs:'Material de anafilaxia disponível.' }
  ],
  receita:[
    { med:'Doxiciclina 100 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 15 dias (recente) ou 30 dias (tardia). SOMENTE em alergia comprovada e fora da gestação.' },
    { med:'Tratamento do parceiro', uso:'Mesmo esquema, independentemente do resultado do teste do parceiro.' }
  ],
  orientacoes:[
    'Controle de cura com VDRL mensal na gestante e trimestral fora da gestação; espera-se queda de duas diluições.',
    'Notificação compulsória.',
    'Oferecer teste para HIV, hepatites B e C.'
  ] },

{ id:'q-violencia-sexual', grupo:'IST e profilaxias', nome:'Violência sexual', sub:'O pacote completo de profilaxias, em até 72 h',
  tags:['violencia sexual','estupro','pep','levonorgestrel','profilaxia','ist'],
  atencao:'Acolhimento primeiro; o exame e a coleta não podem ser condição para o atendimento. A profilaxia do HIV é ideal em até 2 horas e no máximo 72 horas. Não exigir boletim de ocorrência para atender. Notificação compulsória e imediata.',
  unidade:[
    { med:'SÍFILIS — BENZILPENICILINA BENZATINA 1.200.000 UI', dose:'1 ampola em cada glúteo', via:'IM', obs:'Dose única.' },
    { med:'GONORREIA — CEFTRIAXONA 500 MG', dose:'500 mg', via:'IM', obs:'Dose única.' },
    { med:'CLAMÍDIA — AZITROMICINA 500 MG', dose:'2 comprimidos (1 g)', via:'VO', obs:'Dose única.' },
    { med:'TRICOMONÍASE — METRONIDAZOL 500 MG', dose:'4 comprimidos (2 g)', via:'VO', obs:'Dose única.' },
    { med:'CONTRACEPÇÃO — LEVONORGESTREL 1,5 MG', dose:'1 comprimido', via:'VO', obs:'Dose única, o quanto antes, em até 5 dias.' },
    { med:'HEPATITE B EM NÃO VACINADO — IMUNOGLOBULINA + VACINA', dose:'Imunoglobulina 0,06 mL/kg IM + 1ª dose da vacina', via:'IM', obs:'Em locais diferentes. Completar o esquema vacinal depois.' }
  ],
  receita:[
    { med:'Tenofovir 300 mg + Lamivudina 300 mg', uso:'Tomar 1 comprimido VO 1 vez ao dia por 28 dias.' },
    { med:'Dolutegravir 50 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia por 28 dias.' },
    { med:'Ondansetrona 4 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se náusea — a profilaxia costuma causar.' }
  ],
  orientacoes:[
    'Notificação compulsória imediata e comunicação ao conselho tutelar se a vítima for criança ou adolescente.',
    'Testagem para HIV, sífilis e hepatites na entrada e repetida em 30 a 90 dias.',
    'Encaminhamento ao serviço de referência, à saúde mental e ao serviço social.',
    'Informar sobre o direito ao aborto legal previsto em lei.'
  ] },

{ id:'q-perfurocortante', grupo:'IST e profilaxias', nome:'Acidente perfurocortante', sub:'Exposição ocupacional a material biológico',
  tags:['perfurocortante','acidente ocupacional','pep','hiv','hepatite b','profissional de saude'],
  atencao:'Risco de transmissão: hepatite B maior que hepatite C, maior que HIV. Profilaxia do HIV em até 2 horas, no máximo 72. Não existe profilaxia para hepatite C — apenas seguimento sorológico. Não espremer nem usar substância cáustica no ferimento.',
  unidade:[
    { med:'LAVAR COM ÁGUA E SABÃO OU SORO FISIOLÓGICO', dose:'—', via:'—', obs:'Mucosa: lavar abundantemente com água ou soro. Não espremer, não usar álcool nem hipoclorito.' },
    { med:'TESTE RÁPIDO DO ACIDENTADO E DA PESSOA-FONTE', dose:'—', via:'—', obs:'HIV, hepatite B e hepatite C. Fonte negativa dispensa a profilaxia.' },
    { med:'HEPATITE B — VACINA E/OU IMUNOGLOBULINA', dose:'Conforme o esquema vacinal e o anti-HBs', via:'IM', obs:'Não vacinado ou sem resposta, com fonte positiva ou desconhecida: imunoglobulina 0,06 mL/kg + iniciar a vacinação.' },
    { med:'TÉTANO — VACINA dT', dose:'1 dose', via:'IM', obs:'Conforme o esquema vacinal.' }
  ],
  receita:[
    { med:'Tenofovir 300 mg + Lamivudina 300 mg', uso:'Tomar 1 comprimido VO 1 vez ao dia por 28 dias.' },
    { med:'Dolutegravir 50 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia por 28 dias.' }
  ],
  orientacoes:[
    'Abrir CAT (Comunicação de Acidente de Trabalho).',
    'Testagem de seguimento em 30 e 90 dias após a exposição.',
    'Sexo seguro e não doar sangue durante o seguimento.'
  ] },

/* ====================== INFECCIOSO ====================== */
{ id:'q-meningite', grupo:'Infeccioso', nome:'Meningite bacteriana', sub:'Emergência: antibiótico e corticoide na primeira hora',
  tags:['meningite','rigidez de nuca','punção lombar','dexametasona','ceftriaxona','isolamento'], conduta:'meningite',
  atencao:'Dexametasona 20 minutos ANTES da primeira dose de antibiótico — depois já não adianta. Se a punção lombar vai atrasar (precisa de tomografia antes por déficit focal, papiledema ou rebaixamento), colher hemoculturas e começar o antibiótico assim mesmo. Isolamento respiratório por gotícula nas primeiras 24 horas.',
  unidade:[
    { med:'DEXAMETASONA', dose:'0,15 mg/kg (cerca de 10 mg)', via:'EV', obs:'20 minutos ANTES do antibiótico, de 6/6 h por 4 dias. Reduz sequela, sobretudo no pneumococo.' },
    { med:'CEFTRIAXONA SÓDICA 2 G', dose:'2 g', via:'EV', obs:'De 12/12 h. Esquema para 3 meses a 55 anos.' },
    { med:'CEFTRIAXONA 2 G + AMPICILINA 2 G', dose:'Ceftriaxona 2 g 12/12 h + ampicilina 2 g 4/4 h', via:'EV', obs:'Acima de 55 anos ou doença debilitante — cobertura para Listeria.' },
    { med:'HEMOCULTURAS E PUNÇÃO LOMBAR', dose:'2 amostras', via:'—', obs:'Antes do antibiótico quando não houver atraso. Líquor: celularidade, glicose, proteína, Gram, cultura e látex.' },
    { med:'ACICLOVIR', dose:'10 mg/kg', via:'EV', obs:'De 8/8 h, SE suspeita de encefalite herpética: alteração de comportamento e sinal focal temporal.' }
  ],
  receita:[
    { med:'Rifampicina 600 mg — profilaxia de contatos', uso:'Meningococo: 600 mg VO de 12/12 h por 2 dias (4 doses). Haemophilus: 600 mg VO 1 vez ao dia por 4 dias.' }
  ],
  orientacoes:[
    'Líquor com polimorfonucleares e glicose baixa: bactéria. Mononucleares com glicose baixa: tuberculose ou fungo. Mononucleares com glicose normal: vírus.',
    'Profilaxia de contatos apenas para meningococo (todos os contatos próximos e profissionais que fizeram procedimento sem EPI) e Haemophilus (se houver contactante menor de 4 anos não vacinado).',
    'Se o paciente foi tratado sem cefalosporina, ele também precisa da profilaxia antes da alta, para erradicar a colonização.',
    'Notificação compulsória imediata.'
  ] },

{ id:'q-endocardite', grupo:'Infeccioso', nome:'Endocardite infecciosa', sub:'Febre com sopro — critérios de Duke',
  tags:['endocardite','duke','vancomicina','hemocultura','sopro','osler'], conduta:'endocardite',
  atencao:'Três pares de hemocultura de sítios diferentes ANTES do antibiótico — sem isso o tratamento fica às cegas por semanas. Em quadro subagudo estável, dá para esperar as culturas; no agudo e toxêmico, não.',
  unidade:[
    { med:'TRÊS PARES DE HEMOCULTURA DE SÍTIOS DIFERENTES', dose:'—', via:'—', obs:'Com intervalo, antes do antibiótico.' },
    { med:'VANCOMICINA + CEFTRIAXONA', dose:'Vancomicina 15 a 20 mg/kg 12/12 h + ceftriaxona 2 g/dia', via:'EV', obs:'Valva nativa, apresentação subaguda.' },
    { med:'VANCOMICINA + GENTAMICINA', dose:'Vancomicina 15 a 20 mg/kg 12/12 h + gentamicina', via:'EV', obs:'Apresentação aguda ou usuário de droga injetável.' },
    { med:'ECOCARDIOGRAMA', dose:'—', via:'—', obs:'Transtorácico primeiro; transesofágico se negativo com alta suspeita, ou se houver prótese valvar.' }
  ],
  receita:[
    { med:'Amoxicilina 2 g — profilaxia', uso:'2 g VO 1 hora antes de procedimento odontológico com manipulação gengival ou periapical. Só para prótese valvar, endocardite prévia, cardiopatia cianótica não reparada ou correção incompleta de cardiopatia congênita.' }
  ],
  orientacoes:[
    'Critérios de Duke: 2 maiores, ou 1 maior + 3 menores, ou 5 menores.',
    'Maiores: hemocultura com agente típico em 2 amostras, e ecocardiograma com vegetação, abscesso, deiscência de prótese ou nova regurgitação.',
    'Menores: predisposição ou uso de droga injetável, febre acima de 38 °C, fenômenos vasculares (Janeway, indolor), fenômenos imunológicos (Osler, doloroso; manchas de Roth), e evidência microbiológica que não fecha critério maior.',
    'Acionar cardiologia e infectologia; tratamento por 4 a 6 semanas, e 6 semanas ou mais em prótese.'
  ] },

{ id:'q-leptospirose', grupo:'Infeccioso', nome:'Leptospirose', sub:'Mialgia de panturrilha, sufusão conjuntival e enchente',
  tags:['leptospirose','weil','sufusao conjuntival','penicilina','doxiciclina','enchente','rato'], conduta:'sindrome-febril',
  atencao:'A forma ictero-hemorrágica (Weil) é 10% dos casos e cursa com colestase, insuficiência renal com POTÁSSIO BAIXO (ao contrário da maioria das lesões renais), hemorragia alveolar e vasculite. Hemoptise é sinal de gravidade e pode matar rápido.',
  unidade:[
    { med:'PENICILINA G CRISTALINA', dose:'1,5 milhões UI', via:'EV', obs:'De 6/6 h, por 7 dias. Esquema da forma grave.' },
    { med:'CEFTRIAXONA SÓDICA 1 G', dose:'1 a 2 g', via:'EV', obs:'Uma vez ao dia. Alternativa à penicilina na forma grave.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL', via:'EV', obs:'Hidratação; cuidado com hemorragia alveolar, onde o excesso de volume piora.' },
    { med:'REPOSIÇÃO DE POTÁSSIO', dose:'Conforme a dosagem', via:'EV', obs:'A lesão renal da leptospirose é classicamente hipocalêmica e poliúrica.' }
  ],
  receita:[
    { med:'Doxiciclina 100 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 7 dias. Para a forma leve, anictérica.' },
    { med:'Amoxicilina 500 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h por 7 dias. Alternativa na forma leve, e escolha na gestante.' }
  ],
  orientacoes:[
    'Perguntar sobre contato com enchente, esgoto, lama ou roedores nos últimos 30 dias.',
    'Notificação compulsória.',
    'Retorno imediato se icterícia, redução da urina, falta de ar, tosse com sangue ou sangramento.'
  ] },

{ id:'q-malaria', grupo:'Infeccioso', nome:'Malária', sub:'Febre em crises com anemia hemolítica e viagem à Amazônia',
  tags:['malaria','gota espessa','cloroquina','primaquina','artesunato','amazonia'], conduta:'sindrome-febril',
  atencao:'Malária é emergência: gota espessa em toda febre com história de viagem a área endêmica, e o resultado tem que sair no mesmo plantão. P. falciparum pode matar em horas. Primaquina é proibida na gestação e exige pesquisa de deficiência de G6PD.',
  unidade:[
    { med:'GOTA ESPESSA', dose:'—', via:'—', obs:'Diagnóstico e espécie. Repetir se negativa com alta suspeita. Teste rápido como alternativa.' },
    { med:'ARTESUNATO', dose:'Conforme o peso e o protocolo do Ministério da Saúde', via:'EV', obs:'Malária grave por P. falciparum. Notificar e acionar a referência.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 a 1000 mL', via:'EV', obs:'Hidratação cuidadosa; vigiar hipoglicemia, frequente na malária grave.' }
  ],
  receita:[
    { med:'Cloroquina + primaquina', uso:'P. vivax: esquema de 7 ou 14 dias conforme o protocolo do Ministério da Saúde, dispensado na unidade de referência.' },
    { med:'Artemeter + lumefantrina', uso:'P. falciparum não complicado: esquema de 3 dias conforme o protocolo do Ministério da Saúde.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se febre.' }
  ],
  orientacoes:[
    'Notificação compulsória; tratamento e medicação são fornecidos pelo Ministério da Saúde.',
    'Pesquisar deficiência de G6PD antes da primaquina.',
    'Retorno imediato se sonolência, convulsão, icterícia, redução da urina, falta de ar ou sangramento.'
  ] },

{ id:'q-febre-tifoide', grupo:'Infeccioso', nome:'Febre tifoide', sub:'Febre arrastada, confusão e sinal de Faget',
  tags:['febre tifoide','salmonella','faget','ciprofloxacino','ceftriaxona'], conduta:'sindrome-febril',
  atencao:'Sinal de Faget é a dissociação entre febre alta e pulso baixo — ocorre na febre tifoide e na febre amarela. Complicações da 3ª semana: enterorragia e perfuração intestinal, ambas cirúrgicas.',
  unidade:[
    { med:'CEFTRIAXONA SÓDICA 2 G', dose:'2 g', via:'EV', obs:'Uma vez ao dia, por 10 a 14 dias. Cefalosporina de 3ª geração é a escolha nos casos que internam.' },
    { med:'HEMOCULTURAS E COPROCULTURA', dose:'—', via:'—', obs:'Mielocultura é a mais sensível, quando disponível.' },
    { med:'HIDRATAÇÃO VENOSA', dose:'SF 0,9% 1000 mL', via:'EV', obs:'Conforme o estado geral.' }
  ],
  receita:[
    { med:'Ciprofloxacino 500 mg comprimido', uso:'Tomar 1 comprimido VO de 12/12 h por 7 a 10 dias, nos casos leves.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se febre.' }
  ],
  orientacoes:[
    'Perguntar sobre água e alimentos de procedência duvidosa e viagem a área de saneamento precário.',
    'Notificação compulsória; investigar a fonte e os contatos.',
    'Retorno imediato se dor abdominal intensa, sangramento nas fezes ou queda do estado geral: risco de perfuração.'
  ] },

/* ====================== PROCEDIMENTOS E SUPORTE ====================== */
{ id:'q-iot', grupo:'Procedimentos e suporte', nome:'Intubação — sequência rápida', sub:'Doses e diluições dos três tempos',
  tags:['iot','intubacao','sequencia rapida','etomidato','succinilcolina','rocuronio','cetamina'], conduta:'sequencia-rapida-intubacao',
  atencao:'Ressuscitar ANTES de intubar: PAS abaixo de 100, índice de choque acima de 0,8 ou SpO2 abaixo de 93% na indução causam parada. Succinilcolina é proibida em hipertermia maligna, doença neuromuscular, AVC, queimadura ou lesão medular com mais de 72 horas, rabdomiólise e hipercalemia com alteração no ECG.',
  unidade:[
    { med:'PRÉ-IOT SE HIPOTENSÃO — NORADRENALINA CORRENDO ANTES DO INDUTOR', dose:'Iniciar 5 a 15 mcg/min', via:'EV', obs:'Bomba de infusão. Volume ou sangue antes, conforme a causa.' },
    { med:'ADRENALINA EM BOLUS — EPINEFRINA 1 MG/ML: 1 ML + 99 ML DE SF 0,9%', dose:'1 a 2 mL (10 a 20 mcg) a cada 2 a 5 minutos', via:'EV', obs:'Fica 10 mcg/mL. Ponte enquanto o volume e a noradrenalina agem.' },
    { med:'OPCIONAL — FENTANILA 50 MCG/ML', dose:'3 mcg/kg em 30 a 60 s (70 kg: cerca de 4 mL)', via:'EV', obs:'3 minutos antes, só em PIC alta, SCA ou dissecção. NÃO usar no choque.' },
    { med:'HIPNÓTICO — ETOMIDATO 2 MG/ML', dose:'0,3 mg/kg (cerca de 10 mL)', via:'EV', obs:'O que menos derruba a pressão. Metade da dose no choque cardiogênico e no idoso frágil.' },
    { med:'HIPNÓTICO — MIDAZOLAM (EXCEÇÃO)', dose:'0,2 a 0,3 mg/kg', via:'EV', obs:'Na apresentação 5 mg/mL, 70 kg: 3 a 4 mL. Início lento, hipotensão e costuma ser subdosado. Conferir sempre a concentração.' },
    { med:'HIPNÓTICO — CETAMINA 50 MG/ML', dose:'1 a 2 mg/kg (70 kg: 1,4 a 2,8 mL)', via:'EV', obs:'Broncoespasmo e choque séptico — metade da dose no choque.' },
    { med:'BLOQUEADOR — SUCCINILCOLINA 100 MG', dose:'1,5 mg/kg (2 mg/kg no choque)', via:'EV', obs:'Peso real. Diluir 1 frasco em 10 mL de AD (10 mg/mL). Ver as contraindicações na caixa de atenção.' },
    { med:'BLOQUEADOR — ROCURÔNIO 50 MG/5 ML', dose:'1,5 mg/kg (70 kg: 10,5 mL)', via:'EV', obs:'Puro. Sem as contraindicações da succinilcolina; dura 45 a 70 min — sedação contínua logo depois. Reversão: sugamadex 16 mg/kg.' }
  ],
  receita:[],
  orientacoes:[
    'Checklist antes: aspirador testado, dois laringoscópios, tubo com balonete testado, bougie, dispositivo supraglótico de resgate, capnografia, acesso pérvio e drogas puxadas.',
    'Pré-oxigenar por 3 minutos com o fluxômetro aberto até o fim (15 L/min na máscara dá só cerca de 65% de FiO2) ou VNI no hipoxêmico; cateter nasal a 15 L/min até o tubo passar; cabeceira a 30 graus.',
    'Confirmar por capnografia. Fixar o tubo e pedir a radiografia.',
    'Iniciar sedação contínua logo após — o bloqueador dura mais que o hipnótico.'
  ] },

{ id:'q-sedacao-continua', grupo:'Procedimentos e suporte', nome:'Sedação contínua pós-IOT', sub:'Diluições padrão e vazão para 70 e 80 kg',
  tags:['sedacao','bomba de infusao','fentanil','midazolam','precedex','cisatracurio','rocuronio'], conduta:'ventilacao-mecanica-inicial',
  atencao:'Analgesia primeiro, sedação depois: paciente com dor não sedado parece agitado e recebe mais hipnótico do que precisa. Bloqueador neuromuscular só nas primeiras 24 a 48 horas e sempre com sedação profunda garantida.',
  unidade:[
    { med:'OPIOIDE — FENTANILA 50 MCG/ML: 50 ML + 50 ML DE SF 0,9%', dose:'70 kg: 4,6 mL/h · 80 kg: 5,3 mL/h', via:'EV', obs:'Bomba de infusão. Titular pela dor e pela sincronia com o ventilador.' },
    { med:'HIPNÓTICO — MIDAZOLAM 5 MG/ML: 20 ML + 80 ML DE SF 0,9%', dose:'70 kg: 11 mL/h · 80 kg: 12,6 mL/h', via:'EV', obs:'Bomba de infusão.' },
    { med:'HIPNÓTICO — DEXMEDETOMIDINA 2 MG/ML: 2 ML + 48 ML DE SF 0,9%', dose:'70 kg: 15 mL/h · 80 kg: 17 mL/h', via:'EV', obs:'Bomba. Sedação leve e cooperativa; causa bradicardia e hipotensão.' },
    { med:'HIPNÓTICO — CETAMINA 50 MG/ML: 10 ML + 240 ML DE SF 0,9%', dose:'70 kg: 26 mL/h · 80 kg: 30 mL/h', via:'EV', obs:'Bomba. Poupa opioide e mantém a hemodinâmica.' },
    { med:'BLOQUEADOR — CISATRACÚRIO 2 MG/ML: 50 ML + 50 ML DE SF 0,9%', dose:'70 kg: 8,4 mL/h · 80 kg: 9,6 mL/h', via:'EV', obs:'Bomba. Escolha em nefropata e hepatopata.' },
    { med:'BLOQUEADOR — ROCURÔNIO 10 MG/ML: 10 ML + 90 ML DE SF 0,9%', dose:'70 kg: 31,5 mL/h · 80 kg: 36 mL/h', via:'EV', obs:'Bomba.' }
  ],
  receita:[],
  orientacoes:[
    'Avaliar a sedação por escala (RASS) a cada turno e buscar a sedação mais leve tolerada.',
    'Interrupção diária da sedação quando não houver contraindicação: reduz tempo de ventilação.',
    'Profilaxia de úlcera de estresse, de trombose e cabeceira a 30 graus.'
  ] },

{ id:'q-sedacao-cve', grupo:'Procedimentos e suporte', nome:'Sedação para procedimento', sub:'Cardioversão, redução de luxação e drenagem',
  tags:['sedacao','cardioversao','propofol','midazolam','fentanil','procedimento'], conduta:'sedacao-analgesia',
  atencao:'Titular em pequenas doses, checando a resposta a cada incremento — não dar a dose cheia de uma vez. Evitar etomidato aqui: não pode ser repetido se o procedimento se estender. Monitorização, oxigênio, aspirador e material de via aérea prontos, sempre.',
  unidade:[
    { med:'MONITORIZAÇÃO, OXIGÊNIO, ACESSO E MATERIAL DE VIA AÉREA', dose:'—', via:'—', obs:'Oximetria contínua e, idealmente, capnografia. Jejum quando eletivo.' },
    { med:'ANALGESIA — FENTANILA 50 MCG/ML', dose:'1 mL, checar resposta, repetir 1 mL', via:'EV', obs:'Titular.' },
    { med:'SEDAÇÃO — MIDAZOLAM', dose:'2 mg', via:'EV', obs:'Na apresentação 15 mg/3 mL: diluir 2 mL + 8 mL de SF 0,9% e fazer 2 mL. Na de 1 mg/mL: fazer 2 mL.' },
    { med:'SEDAÇÃO — PROPOFOL 10 MG/ML', dose:'2 mL, checar resposta, repetir 2 mL', via:'EV', obs:'Titular. Causa hipotensão e apneia — ter volume e ambu à mão.' },
    { med:'FLUMAZENIL 0,1 MG/ML AMP 5 ML', dose:'0,2 mg', via:'EV', obs:'Antídoto do benzodiazepínico, se depressão respiratória. Naloxona para o opioide.' }
  ],
  receita:[],
  orientacoes:[
    'Registrar consentimento, drogas, doses, horários e a monitorização no prontuário.',
    'Observar até a recuperação plena do nível de consciência antes da alta.',
    'Orientar acompanhante e proibir direção por 12 horas.'
  ] },

{ id:'q-vasoativas', grupo:'Procedimentos e suporte', nome:'Drogas vasoativas — diluições', sub:'Noradrenalina simples e concentrada',
  tags:['noradrenalina','vasoativa','bomba','choque','desmame','hidrocortisona'], conduta:'choque-abordagem',
  atencao:'Noradrenalina pode ser iniciada em veia periférica calibrosa e proximal enquanto se obtém o acesso central — não atrasar o vasopressor esperando punção. Vigiar extravasamento: causa necrose.',
  unidade:[
    { med:'NORADRENALINA SIMPLES 4 MG/4 ML — 4 ML + 96 ML DE SG 5%', dose:'Titular pela PAM', via:'EV', obs:'Bomba de infusão. Fica 40 mcg/mL. Alvo de PAM acima de 65 mmHg.' },
    { med:'NORADRENALINA CONCENTRADA 4 MG/ML — 20 ML + 80 ML DE SG 5%', dose:'Titular pela PAM', via:'EV', obs:'Bomba. Fica 800 mcg/mL — para restrição de volume ou dose alta. Conferir a apresentação antes de diluir.' },
    { med:'HIDROCORTISONA 100 MG + 2 ML DE DILUENTE + 100 ML DE SG OU SF', dose:'50 mg (metade da ampola)', via:'EV', obs:'De 6/6 h, se houver dificuldade de desmame por insuficiência adrenal relativa.' }
  ],
  receita:[],
  orientacoes:[
    'Causas de difícil desmame da noradrenalina: insuficiência adrenal, hipocalcemia, hipofosfatemia, acidose metabólica e hipovolemia não corrigida. Checar as cinco.',
    'Reavaliar a volemia antes de subir a dose — vasopressor não substitui volume.',
    'Monitorização invasiva de pressão quando disponível.'
  ] },

{ id:'q-hemorragia', grupo:'Procedimentos e suporte', nome:'Hemorragia — controle inicial', sub:'Ácido tranexâmico, volume e reversão',
  tags:['hemorragia','tranexamico','transamin','sangramento','vitamina k','transfusao'],
  atencao:'Ácido tranexâmico tem benefício quando dado em até 3 horas do início do sangramento — depois disso pode até piorar. No trauma, 1 g em 10 minutos seguido de 1 g em 8 horas.',
  unidade:[
    { med:'ÁCIDO TRANEXÂMICO 250 MG/5 ML', dose:'1 ampola + 50 a 100 mL de SF 0,9%', via:'EV', obs:'Ou 2 a 3 ampolas + 250 mL de SF 0,9% de 8/8 h. No trauma: 1 g em 10 minutos e mais 1 g em 8 horas.' },
    { med:'VITAMINA K (FITOMENADIONA) 10 MG', dose:'1 ampola', via:'IM ou EV lento', obs:'Se houver uso de varfarina ou hepatopatia. Endovenoso lento pelo risco de anafilaxia.' },
    { med:'CLORETO DE SÓDIO 0,9% OU RINGER LACTATO', dose:'Bolus pequenos (250 a 500 mL)', via:'EV', obs:'Dois acessos calibrosos. Só até o sangue chegar: no choque hemorrágico, sangue cedo (1:1:1) e protocolo de transfusão maciça.' },
    { med:'TIPAGEM SANGUÍNEA E RESERVA DE HEMOCOMPONENTES', dose:'—', via:'—', obs:'Colher hemograma, coagulograma, fibrinogênio e gasometria com lactato.' }
  ],
  receita:[],
  orientacoes:[
    'Controlar o foco: compressão, torniquete, sutura, endoscopia, embolização ou cirurgia.',
    'Hipotensão permissiva no trauma penetrante até o controle cirúrgico.',
    'Evitar hipotermia — a tríade letal é hipotermia, acidose e coagulopatia.'
  ] },

{ id:'q-transfusao', grupo:'Procedimentos e suporte', nome:'Transfusão de hemocomponentes', sub:'Quanto sobe, quanto pedir e as reações',
  tags:['transfusao','hemacias','plaquetas','trali','reacao transfusional'],
  atencao:'Estratégia restritiva na maioria dos casos: transfundir com hemoglobina abaixo de 7 g/dL, ou abaixo de 8 em coronariopata. Reação febril não hemolítica se previne com hemácias leucodepletadas.',
  unidade:[
    { med:'CONCENTRADO DE HEMÁCIAS', dose:'1 unidade', via:'EV', obs:'Sobe cerca de 1 g/dL de hemoglobina e 3% de hematócrito. Reavaliar entre as unidades.' },
    { med:'CONCENTRADO DE PLAQUETAS', dose:'1 unidade para cada 10 kg de peso', via:'EV', obs:'Sobe cerca de 30.000 se a dose estiver correta. Aumento menor que 5.000 indica refratariedade: pedir sem leucócitos.' },
    { med:'PLASMA FRESCO CONGELADO', dose:'10 a 15 mL/kg', via:'EV', obs:'Para coagulopatia com sangramento ativo, não para corrigir INR isolado.' },
    { med:'ACOMPANHAR OS PRIMEIROS 15 MINUTOS À BEIRA DO LEITO', dose:'—', via:'—', obs:'É quando aparecem as reações graves.' }
  ],
  receita:[],
  orientacoes:[
    'Reação febril não hemolítica: interromper, investigar hemólise; prevenir com hemácias leucodepletadas.',
    'TRALI: anticorpos do doador contra leucócitos do receptor, até 6 horas da transfusão. Tratamento é suporte.',
    'Sobrecarga circulatória (TACO): mais comum no cardiopata e no idoso — transfundir devagar e considerar diurético.'
  ] },

{ id:'q-paliativo', grupo:'Procedimentos e suporte', nome:'Cuidados paliativos — controle de sintomas', sub:'Dor, dispneia, tosse e broncorreia',
  tags:['paliativo','morfina','dispneia','broncorreia','codeina','conforto'],
  atencao:'Morfina bem titulada em paciente com dispneia não acelera a morte: alivia o sintoma. O medo de usar é o que causa sofrimento evitável. Documentar as decisões de limitação terapêutica com a família.',
  unidade:[
    { med:'MORFINA 10 MG/ML — 10 ML + 90 ML DE SF 0,9%', dose:'Titular pela dor e pela dispneia', via:'EV', obs:'Bomba de infusão. Fica 1 mg/mL.' },
    { med:'MORFINA — RESGATE', dose:'2 a 4 mg', via:'EV ou SC', obs:'A cada 4 horas se necessário; a via subcutânea é excelente em domicílio.' },
    { med:'BROMETO DE IPRATRÓPIO — INALAÇÃO', dose:'Até 40 gotas', via:'INAL', obs:'De 4/4 h, para broncorreia e sororoca.' },
    { med:'ESCOPOLAMINA 20 MG/ML', dose:'1 ampola', via:'SC', obs:'De 6/6 h, para secreção de vias aéreas na fase final.' },
    { med:'MIDAZOLAM', dose:'2,5 a 5 mg', via:'SC ou EV', obs:'Para agitação e dispneia refratária, titulado.' }
  ],
  receita:[
    { med:'Codeína 30 mg comprimido', uso:'Tomar 10 a 20 mg VO até de 4/4 h, para tosse.' },
    { med:'Morfina solução oral 10 mg/mL', uso:'Conforme titulação, de 4/4 h, com dose de resgate. Prescrever laxante junto, sempre.' },
    { med:'Lactulose 667 mg/mL xarope', uso:'Tomar 15 mL VO 1 vez ao dia — constipação por opioide é regra, não exceção.' },
    { med:'Ondansetrona 4 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se náusea.' }
  ],
  orientacoes:[
    'Conversa clara com o paciente e a família sobre objetivos de cuidado, registrada em prontuário.',
    'Sempre prescrever laxante junto do opioide e antiemético de resgate.',
    'Cuidado com boca seca, higiene oral e posicionamento — mudam muito o conforto.',
    'Acionar a equipe de cuidados paliativos e o serviço social.'
  ] }

]);

/* ---------------------------------------------------------------
   12. ANTIBIOTICOS — escolha empirica por sitio de infeccao
   { id, sitio, quadro, sub, tags, agentes, escolha:[], alt:[], nota, atencao }
   Linha de esquema: { atb, dose, via, freq, dur }
   Onde a fonte estava desatualizada, vale a diretriz vigente — as
   divergencias estao anotadas no campo `nota`.
   --------------------------------------------------------------- */
var FERR_ATB = [

/* ===================== SISTEMA NERVOSO CENTRAL ===================== */
{ id:'atb-meningite-adulto', sitio:'Sistema nervoso central', quadro:'Meningite bacteriana — adulto até 50 anos',
  sub:'Sem comorbidade e sem fator de risco', tags:['meningite','ceftriaxona','pneumococo','meningococo'],
  agentes:'S. pneumoniae e N. meningitidis.',
  atencao:'Dexametasona 0,15 mg/kg EV 20 minutos ANTES da primeira dose do antibiótico, de 6/6 h por 4 dias. Não atrasar o antibiótico esperando tomografia ou punção — colher hemoculturas e começar.',
  escolha:[ { atb:'Ceftriaxona', dose:'2 g', via:'EV', freq:'12/12 h', dur:'Pneumococo 10 a 14 dias · Meningococo 7 dias' } ],
  alt:[ { atb:'Penicilina G cristalina', dose:'300.000 a 500.000 UI/kg/dia (até 24 milhões UI/dia)', via:'EV', freq:'4/4 h', dur:'conforme o agente' } ],
  nota:'Em serviços com pneumococo resistente à ceftriaxona, associar vancomicina 15 a 20 mg/kg EV de 12/12 h.' },

{ id:'atb-meningite-risco', sitio:'Sistema nervoso central', quadro:'Meningite bacteriana — acima de 50 anos, gestante ou imunodeprimido',
  sub:'Precisa cobrir Listeria', tags:['meningite','listeria','ampicilina','idoso','gestante'],
  agentes:'S. pneumoniae, N. meningitidis e L. monocytogenes.',
  atencao:'A ampicilina é o que cobre Listeria — ceftriaxona sozinha NÃO cobre. Esquecer isso é o erro clássico nesse grupo.',
  escolha:[ { atb:'Ceftriaxona', dose:'2 g', via:'EV', freq:'12/12 h', dur:'14 dias' },
            { atb:'Ampicilina', dose:'2 g', via:'EV', freq:'4/4 h', dur:'21 dias se Listeria confirmada' } ],
  alt:[], nota:'Manter dexametasona conforme o esquema padrão.' },

{ id:'atb-abscesso-cerebral', sitio:'Sistema nervoso central', quadro:'Abscesso cerebral',
  sub:'Primário ou por foco contíguo', tags:['abscesso cerebral','metronidazol','neurocirurgia'],
  agentes:'Streptococcus, anaeróbios, enterobactérias e S. aureus.',
  escolha:[ { atb:'Ceftriaxona', dose:'2 g', via:'EV', freq:'12/12 h', dur:'guiada por imagem' },
            { atb:'Metronidazol', dose:'500 mg', via:'EV', freq:'8/8 h', dur:'guiada por imagem' } ],
  alt:[ { atb:'Oxacilina (se MSSA) ou vancomicina (se MRSA)', dose:'Oxacilina 2 g 4/4 h · Vancomicina 1 g 12/12 h', via:'EV', freq:'—', dur:'no pós-cirúrgico ou pós-traumático, associada à ceftriaxona' } ],
  nota:'A duração é definida pela resposta na tomografia ou ressonância, não por tempo fixo. Acionar a neurocirurgia.' },

{ id:'atb-encefalite', sitio:'Sistema nervoso central', quadro:'Encefalite herpética',
  sub:'Febre, cefaleia e confusão sem sinal meníngeo', tags:['encefalite','herpes','aciclovir','lobo temporal'],
  agentes:'Herpes-simples tipo 1; arboviroses no diagnóstico diferencial.',
  atencao:'Começar o aciclovir na SUSPEITA, sem esperar confirmação. Alteração de comportamento com sinal focal temporal é o quadro típico, e o atraso custa sequela.',
  escolha:[ { atb:'Aciclovir', dose:'10 mg/kg', via:'EV', freq:'8/8 h', dur:'14 a 21 dias' } ],
  alt:[], nota:'Manter até afastar herpes por PCR no líquor. Hidratar bem: o aciclovir é nefrotóxico.' },

/* ===================== VIAS AÉREAS SUPERIORES ===================== */
{ id:'atb-sinusite', sitio:'Vias aéreas superiores', quadro:'Rinossinusite bacteriana aguda',
  sub:'Sintomas além de 10 dias, graves desde o início, ou piora após melhora',
  tags:['sinusite','rinossinusite','amoxicilina','clavulanato'],
  agentes:'S. pneumoniae, H. influenzae e M. catarrhalis.',
  atencao:'Antes de 10 dias sem os critérios de gravidade, o quadro é viral: lavagem nasal e sintomático, sem antibiótico.',
  escolha:[ { atb:'Amoxicilina + clavulanato', dose:'500/125 mg', via:'VO', freq:'8/8 h', dur:'10 dias' } ],
  alt:[ { atb:'Amoxicilina', dose:'500 mg', via:'VO', freq:'8/8 h', dur:'10 dias' },
        { atb:'Axetilcefuroxima', dose:'500 mg', via:'VO', freq:'12/12 h', dur:'10 dias' },
        { atb:'Levofloxacino', dose:'500 mg', via:'VO', freq:'24/24 h', dur:'10 dias — só em alergia a betalactâmico' } ],
  nota:'Crônica (acima de 12 semanas): amoxicilina-clavulanato ou cefuroxima + metronidazol, por cerca de 4 semanas.' },

{ id:'atb-oma', sitio:'Vias aéreas superiores', quadro:'Otite média aguda',
  sub:'Abaulamento e opacidade da membrana timpânica', tags:['otite','oma','amoxicilina','timpano'],
  agentes:'S. pneumoniae, H. influenzae e M. catarrhalis.',
  escolha:[ { atb:'Amoxicilina', dose:'500 mg (adulto) · 45 a 90 mg/kg/dia (criança)', via:'VO', freq:'8/8 h', dur:'10 dias' } ],
  alt:[ { atb:'Amoxicilina + clavulanato', dose:'500/125 mg', via:'VO', freq:'8/8 h', dur:'10 dias — na falha ou uso recente de antibiótico' },
        { atb:'Azitromicina', dose:'500 mg', via:'VO', freq:'24/24 h', dur:'5 dias — em alergia' } ],
  nota:'Falha após 48 a 72 horas indica pneumococo resistente ou Haemophilus produtor de betalactamase: subir para amoxicilina-clavulanato ou cefuroxima.' },

{ id:'atb-otite-externa', sitio:'Vias aéreas superiores', quadro:'Otite externa aguda',
  sub:'Dor à tração do pavilhão, conduto edemaciado', tags:['otite externa','ouvido de piscina','ciprofloxacino otologico'],
  agentes:'P. aeruginosa e S. aureus.',
  atencao:'Otite externa maligna (necrosante) no diabético ou imunodeprimido — dor desproporcional, tecido de granulação no conduto, paralisia de par craniano — é internação com antipseudomonas sistêmico.',
  escolha:[ { atb:'Ciprofloxacino otológico', dose:'3 gotas no ouvido acometido', via:'TÓPICO', freq:'12/12 h', dur:'7 dias' } ],
  alt:[ { atb:'Neomicina + polimixina + hidrocortisona otológica', dose:'3 gotas', via:'TÓPICO', freq:'8/8 h', dur:'7 dias — evitar se houver perfuração timpânica' } ],
  nota:'Antibiótico sistêmico só se houver celulite peri-auricular, febre ou imunossupressão. Manter o ouvido seco.' },

{ id:'atb-faringite', sitio:'Vias aéreas superiores', quadro:'Faringoamigdalite estreptocócica',
  sub:'Centor 3 ou mais: exsudato, adenomegalia dolorosa, febre, sem tosse',
  tags:['faringite','amigdalite','centor','penicilina benzatina','febre reumatica'],
  agentes:'Streptococcus beta-hemolítico do grupo A.',
  atencao:'Tosse, coriza, rouquidão e conjuntivite apontam para vírus e afastam o estreptococo. O objetivo do tratamento é prevenir febre reumática e complicações supurativas — por isso os 10 dias completos.',
  escolha:[ { atb:'Penicilina G benzatina', dose:'1.200.000 UI', via:'IM', freq:'dose única', dur:'—' } ],
  alt:[ { atb:'Amoxicilina', dose:'500 mg', via:'VO', freq:'8/8 h', dur:'10 dias' },
        { atb:'Azitromicina', dose:'500 mg', via:'VO', freq:'24/24 h', dur:'5 dias — só em alergia à penicilina' } ],
  nota:'A dose única intramuscular resolve o problema da adesão aos 10 dias.' },

/* ===================== VIAS AÉREAS INFERIORES ===================== */
{ id:'atb-pac-amb-higido', sitio:'Vias aéreas inferiores', quadro:'PAC ambulatorial — previamente hígido',
  sub:'CURB-65 de 0 a 1, sem comorbidade', tags:['pneumonia','pac','amoxicilina','azitromicina','curb65'],
  agentes:'S. pneumoniae, M. pneumoniae, C. pneumoniae e H. influenzae.',
  escolha:[ { atb:'Amoxicilina', dose:'500 mg a 1 g', via:'VO', freq:'8/8 h', dur:'5 a 7 dias' } ],
  alt:[ { atb:'Azitromicina', dose:'500 mg', via:'VO', freq:'24/24 h', dur:'3 a 5 dias' },
        { atb:'Claritromicina', dose:'500 mg', via:'VO', freq:'12/12 h', dur:'7 dias' },
        { atb:'Doxiciclina', dose:'100 mg', via:'VO', freq:'12/12 h', dur:'7 dias' } ],
  nota:'Reavaliar em 48 a 72 horas. Saturação abaixo de 92% interna, mesmo com escore baixo.' },

{ id:'atb-pac-amb-comorb', sitio:'Vias aéreas inferiores', quadro:'PAC ambulatorial — com comorbidade',
  sub:'Cardiopatia, pneumopatia, nefropatia, diabetes, etilismo, neoplasia, ou antibiótico nos últimos 3 meses',
  tags:['pneumonia','pac','comorbidade','clavulanato','levofloxacino'],
  agentes:'Os mesmos, com maior chance de pneumococo resistente, Gram negativos entéricos e S. aureus.',
  escolha:[ { atb:'Amoxicilina + clavulanato', dose:'875/125 mg', via:'VO', freq:'12/12 h', dur:'7 dias' },
            { atb:'Azitromicina (associada)', dose:'500 mg', via:'VO', freq:'24/24 h', dur:'3 a 5 dias' } ],
  alt:[ { atb:'Levofloxacino', dose:'750 mg', via:'VO', freq:'24/24 h', dur:'5 a 7 dias' },
        { atb:'Moxifloxacino', dose:'400 mg', via:'VO', freq:'24/24 h', dur:'5 a 7 dias' } ],
  nota:'Quinolona respiratória em monoterapia resolve, mas guardar como alternativa: tendinopatia, neuropatia, alteração psíquica e aneurisma de aorta.' },

{ id:'atb-pac-internado', sitio:'Vias aéreas inferiores', quadro:'PAC internado — enfermaria',
  sub:'CURB-65 de 2, ou critério clínico de internação', tags:['pneumonia','internacao','ceftriaxona','azitromicina'],
  agentes:'S. pneumoniae, M. pneumoniae, C. pneumoniae e H. influenzae.',
  escolha:[ { atb:'Ceftriaxona', dose:'1 g 12/12 h ou 2 g 1x/dia', via:'EV', freq:'—', dur:'5 a 7 dias' },
            { atb:'Azitromicina (associada)', dose:'500 mg', via:'EV ou VO', freq:'24/24 h', dur:'3 a 5 dias' } ],
  alt:[ { atb:'Levofloxacino', dose:'750 mg', via:'EV', freq:'24/24 h', dur:'5 a 7 dias' } ],
  nota:'Primeira dose na primeira hora. Hemoculturas antes, sem atrasar. Descalonar para via oral em 48 a 72 horas se houver melhora.' },

{ id:'atb-pac-uti', sitio:'Vias aéreas inferiores', quadro:'PAC grave — terapia intensiva',
  sub:'Um critério maior ou dois menores', tags:['pac grave','uti','pseudomonas','mrsa','cefepima'],
  agentes:'S. pneumoniae, S. aureus, Legionella e Gram negativos.',
  atencao:'Critérios maiores (1 basta): choque séptico com vasopressor, ou insuficiência respiratória com ventilação mecânica. Menores (2 bastam): hipotensão, PaO2/FiO2 abaixo de 250, infiltrado multilobular.',
  escolha:[ { atb:'Ceftriaxona ou ampicilina-sulbactam', dose:'Ceftriaxona 2 g/dia', via:'EV', freq:'—', dur:'7 dias' },
            { atb:'Azitromicina ou levofloxacino (associado)', dose:'Azitromicina 500 mg', via:'EV', freq:'24/24 h', dur:'—' } ],
  alt:[ { atb:'Com risco de Pseudomonas: piperacilina-tazobactam, cefepima ou meropeném', dose:'Pipe-tazo 4,5 g 6/6 h · Cefepima 2 g 8/8 h · Meropeném 1 g 8/8 h', via:'EV', freq:'—', dur:'—' },
        { atb:'Associar levofloxacino ou ciprofloxacino', dose:'Levo 750 mg/dia · Cipro 400 mg 12/12 h', via:'EV', freq:'—', dur:'—' },
        { atb:'Se suspeita de MRSA: acrescentar vancomicina ou linezolida', dose:'Vancomicina 15 a 20 mg/kg 12/12 h', via:'EV', freq:'—', dur:'—' } ],
  nota:'Risco de Pseudomonas: bronquiectasia, DPOC grave, corticoide crônico, antibiótico de amplo espectro recente, internação prolongada.' },

{ id:'atb-aspirativa', sitio:'Vias aéreas inferiores', quadro:'Pneumonia aspirativa e abscesso pulmonar',
  sub:'Broncoaspiração, dentição ruim, rebaixamento de consciência',
  tags:['aspirativa','abscesso pulmonar','anaerobios','clindamicina'],
  agentes:'Anaeróbios orais, S. pneumoniae, H. influenzae e M. catarrhalis.',
  escolha:[ { atb:'Amoxicilina + clavulanato', dose:'875/125 mg VO ou 1,2 g EV', via:'VO ou EV', freq:'8/8 h', dur:'Aspirativa 7 a 14 dias · Abscesso cerca de 4 semanas' } ],
  alt:[ { atb:'Clindamicina', dose:'600 mg', via:'VO ou EV', freq:'6/6 h', dur:'idem' },
        { atb:'Ceftriaxona + metronidazol', dose:'Ceftriaxona 1 g 12/12 h + metronidazol 500 mg 8/8 h', via:'EV', freq:'—', dur:'idem' } ],
  nota:'A duração do abscesso é guiada pela imagem, não pelo calendário.' },

{ id:'atb-dpoc', sitio:'Vias aéreas inferiores', quadro:'Exacerbação infecciosa da DPOC',
  sub:'Piora da dispneia, do volume ou da purulência do escarro',
  tags:['dpoc','exacerbacao','escarro purulento','clavulanato'],
  agentes:'H. influenzae, M. catarrhalis, S. pneumoniae e, na doença avançada, Pseudomonas.',
  atencao:'Antibiótico só se houver aumento da purulência do escarro somado a mais um dos cardinais (dispneia ou volume), ou se houver necessidade de ventilação.',
  escolha:[ { atb:'Amoxicilina + clavulanato', dose:'875/125 mg', via:'VO', freq:'12/12 h', dur:'5 a 7 dias' } ],
  alt:[ { atb:'Azitromicina', dose:'500 mg', via:'VO', freq:'24/24 h', dur:'3 a 5 dias' },
        { atb:'Levofloxacino ou moxifloxacino', dose:'Levo 500 mg · Moxi 400 mg', via:'VO', freq:'24/24 h', dur:'5 a 7 dias — na doença moderada a grave' },
        { atb:'Ciprofloxacino', dose:'500 a 750 mg', via:'VO', freq:'12/12 h', dur:'7 dias — se houver suspeita de Pseudomonas' } ],
  nota:'Fatores de má evolução: idade acima de 65 anos, dispneia grave, cardiopatia, diabetes insulinodependente, insuficiência renal ou hepática, mais de 4 internações no último ano, desnutrição, corticoide nos últimos 3 meses, antibiótico nos últimos 15 dias.' },

{ id:'atb-pah', sitio:'Vias aéreas inferiores', quadro:'Pneumonia hospitalar e associada à ventilação',
  sub:'Início após 48 h de internação', tags:['pah','pav','hospitalar','cefepima','vancomicina','mdr'],
  agentes:'Gram negativos entéricos, P. aeruginosa, Acinetobacter e S. aureus (inclusive MRSA).',
  atencao:'Colher cultura de aspirado traqueal ou lavado antes do antibiótico e descalonar em 48 a 72 horas. Amplo espectro sem descalonamento é o que fabrica resistência.',
  escolha:[ { atb:'Cefepima', dose:'2 g', via:'EV', freq:'8/8 h', dur:'7 dias' } ],
  alt:[ { atb:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', freq:'6/6 h', dur:'7 dias' },
        { atb:'Meropeném', dose:'1 g', via:'EV', freq:'8/8 h', dur:'7 dias — se houver risco de ESBL' },
        { atb:'Associar vancomicina ou linezolida', dose:'Vancomicina 15 a 20 mg/kg 12/12 h', via:'EV', freq:'—', dur:'se houver risco de MRSA' } ],
  nota:'Fatores de risco para germe multirresistente: antibiótico endovenoso nos últimos 90 dias, internação acima de 5 dias, choque séptico, diálise, SDRA prévia.' },

/* ===================== CARDIOVASCULAR ===================== */
{ id:'atb-endocardite', sitio:'Cardiovascular', quadro:'Endocardite infecciosa',
  sub:'Febre com sopro — três pares de hemocultura antes', tags:['endocardite','duke','vancomicina','gentamicina','protese'],
  agentes:'Valva nativa subaguda: S. viridans. Aguda ou usuário de droga injetável: S. aureus. Prótese recente: estafilococo coagulase-negativo.',
  atencao:'Três pares de hemocultura de sítios diferentes ANTES do antibiótico. No quadro subagudo estável dá para esperar as culturas; no agudo e toxêmico, não.',
  escolha:[ { atb:'Valva nativa subaguda: vancomicina + ceftriaxona', dose:'Vancomicina 15 a 20 mg/kg 12/12 h + ceftriaxona 2 g/dia', via:'EV', freq:'—', dur:'4 a 6 semanas' } ],
  alt:[ { atb:'Aguda ou droga injetável: vancomicina + gentamicina', dose:'—', via:'EV', freq:'—', dur:'4 a 6 semanas' },
        { atb:'Prótese com menos de 1 ano: vancomicina + gentamicina + rifampicina', dose:'Rifampicina 300 mg 8/8 h', via:'EV/VO', freq:'—', dur:'6 semanas ou mais' } ],
  nota:'Profilaxia (amoxicilina 2 g VO 1 h antes) só em manipulação gengival ou periapical, e só para prótese valvar, endocardite prévia, cardiopatia cianótica não reparada ou correção incompleta.' },

/* ===================== ABDOME ===================== */
{ id:'atb-intra-abdominal', sitio:'Abdome', quadro:'Infecção intra-abdominal',
  sub:'Apendicite perfurada, abscesso ou peritonite secundária',
  tags:['peritonite','apendicite','abscesso abdominal','metronidazol','cefoxitina'],
  agentes:'Enterobactérias, enterococo e anaeróbios — polimicrobiano.',
  atencao:'Antibiótico não substitui controle de foco: coleção drena, víscera perfurada opera. Antibiótico sozinho em peritonite é tratamento incompleto.',
  escolha:[ { atb:'Ceftriaxona + metronidazol', dose:'Ceftriaxona 2 g/dia + metronidazol 500 mg 8/8 h', via:'EV', freq:'—', dur:'4 a 7 dias após o controle do foco' } ],
  alt:[ { atb:'Cefoxitina', dose:'2 g de ataque, depois 1 g', via:'EV', freq:'6/6 h', dur:'idem' },
        { atb:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', freq:'6/6 h', dur:'idem — no caso grave ou de origem hospitalar' } ],
  nota:'Colecistite leve a moderada: cefazolina, cefuroxima ou ceftriaxona basta. Grave, idoso ou imunodeprimido: subir para pipe-tazo ou carbapenêmico, associando metronidazol.' },

{ id:'atb-colangite', sitio:'Abdome', quadro:'Colangite aguda',
  sub:'Tríade de Charcot; pêntade de Reynolds é grave', tags:['colangite','charcot','cpre','piperacilina'],
  agentes:'Enterobactérias, enterococo e anaeróbios da via biliar.',
  atencao:'O tratamento definitivo é a DRENAGEM BILIAR por CPRE. O antibiótico segura enquanto isso.',
  escolha:[ { atb:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', freq:'6/6 h', dur:'7 a 14 dias' } ],
  alt:[ { atb:'Ceftriaxona + metronidazol', dose:'Ceftriaxona 2 g/dia + metronidazol 500 mg 8/8 h', via:'EV', freq:'—', dur:'7 a 10 dias — no caso não grave' } ],
  nota:'Hemoculturas antes. Tratar como sepse se houver hipotensão ou rebaixamento.' },

{ id:'atb-pbe', sitio:'Abdome', quadro:'Peritonite bacteriana espontânea',
  sub:'PMN acima de 250/mm³ no líquido ascítico', tags:['pbe','ascite','cirrose','cefotaxima','albumina'],
  agentes:'E. coli, Klebsiella e pneumococo — monomicrobiano.',
  atencao:'Albumina 1,5 g/kg no 1º dia e 1 g/kg no 3º, junto do antibiótico: reduz síndrome hepatorrenal e mortalidade. Flora polimicrobiana com proteína alta sugere peritonite SECUNDÁRIA — aí é cirurgia.',
  escolha:[ { atb:'Ceftriaxona', dose:'1 g', via:'EV', freq:'12/12 h', dur:'5 a 7 dias' } ],
  alt:[ { atb:'Cefotaxima', dose:'2 g', via:'EV', freq:'8/8 h', dur:'5 dias' } ],
  nota:'Profilaxia secundária com norfloxacino 400 mg/dia enquanto persistir a ascite. Primária após hemorragia por varizes, ou se a proteína do ascítico for menor que 1,5 g/dL.' },

{ id:'atb-diarreia', sitio:'Abdome', quadro:'Diarreia aguda infecciosa',
  sub:'Quando tratar e com o quê', tags:['diarreia','disenteria','shigella','campylobacter','viajante'],
  agentes:'Salmonella, Shigella, Campylobacter, E. coli e C. difficile.',
  atencao:'Na suspeita de E. coli produtora de toxina Shiga (O157:H7), NÃO usar antibiótico nem antidiarreico de motilidade: aumenta o risco de síndrome hemolítico-urêmica. A maioria das diarreias agudas não precisa de antibiótico — só reidratação.',
  escolha:[ { atb:'Disenteria febril (suspeita de Shigella): ciprofloxacino', dose:'500 mg', via:'VO', freq:'12/12 h', dur:'3 dias' } ],
  alt:[ { atb:'Campylobacter: azitromicina', dose:'500 mg', via:'VO', freq:'24/24 h', dur:'3 dias' },
        { atb:'Giardia ou amebíase: metronidazol', dose:'Giardia 250 mg 8/8 h · Ameba 750 mg 8/8 h', via:'VO', freq:'—', dur:'Giardia 5 a 7 dias · Ameba 7 a 10 dias' },
        { atb:'Cólera: doxiciclina', dose:'300 mg', via:'VO', freq:'dose única', dur:'—' } ],
  nota:'Salmonella não typhi só se tratam casos graves, menores de 6 meses, acima de 50 anos, valvopatia, aterosclerose avançada, neoplasia ou uremia.' },

{ id:'atb-cdiff', sitio:'Abdome', quadro:'Colite por Clostridioides difficile',
  sub:'Diarreia após antibiótico, com toxina positiva', tags:['clostridium','c difficile','vancomicina oral','colite pseudomembranosa'],
  agentes:'C. difficile toxigênico.',
  atencao:'Vancomicina ORAL — a endovenosa não atinge a luz do cólon e não trata. Suspender o antibiótico que desencadeou, se possível. Antidiarreico de motilidade é contraindicado: risco de megacólon tóxico.',
  escolha:[ { atb:'Vancomicina', dose:'125 mg', via:'VO', freq:'6/6 h', dur:'10 dias' } ],
  alt:[ { atb:'Fidaxomicina', dose:'200 mg', via:'VO', freq:'12/12 h', dur:'10 dias' },
        { atb:'Metronidazol', dose:'500 mg', via:'VO', freq:'8/8 h', dur:'10 dias — só se não houver vancomicina oral' } ],
  nota:'Diverge dos manuais mais antigos, que traziam metronidazol como primeira escolha: desde as diretrizes de 2017 a vancomicina oral passou à frente por maior cura e menos recidiva. No caso fulminante, associar metronidazol endovenoso.' },

/* ===================== TRATO URINÁRIO ===================== */
{ id:'atb-cistite', sitio:'Trato urinário', quadro:'Cistite não complicada — mulher',
  sub:'Disúria e polaciúria, sem febre nem dor lombar', tags:['cistite','itu','fosfomicina','nitrofurantoina'],
  agentes:'E. coli em cerca de 80%, seguida de Staphylococcus saprophyticus e Proteus.',
  atencao:'Febre, calafrio ou Giordano positivo tiram o caso da cistite — é pielonefrite. Homem, gestante, sonda, anomalia urológica ou imunossupressão são ITU complicada.',
  escolha:[ { atb:'Fosfomicina trometamol', dose:'3 g diluídos em água, em jejum', via:'VO', freq:'dose única', dur:'—' } ],
  alt:[ { atb:'Nitrofurantoína', dose:'100 mg', via:'VO', freq:'6/6 h', dur:'5 dias — evitar se clearance abaixo de 30' },
        { atb:'Sulfametoxazol + trimetoprima', dose:'800/160 mg', via:'VO', freq:'12/12 h', dur:'3 dias — se a resistência local for menor que 20%' } ],
  nota:'Quinolona deixou de ser primeira linha na cistite simples: ANVISA e FDA restringiram o uso por tendinopatia, neuropatia e efeitos no sistema nervoso central. Guardar para pielonefrite.' },

{ id:'atb-cistite-homem', sitio:'Trato urinário', quadro:'ITU no homem e cistite complicada',
  sub:'Todo homem com ITU é caso complicado', tags:['itu homem','prostatite','complicada','ciprofloxacino'],
  agentes:'E. coli e outras enterobactérias.',
  escolha:[ { atb:'Ciprofloxacino', dose:'500 mg', via:'VO', freq:'12/12 h', dur:'7 dias · 14 a 21 dias se houver prostatite' } ],
  alt:[ { atb:'Sulfametoxazol + trimetoprima', dose:'800/160 mg', via:'VO', freq:'12/12 h', dur:'7 a 14 dias' } ],
  nota:'Colher urocultura sempre. Investigar próstata e trato urinário; ITU de repetição no homem pede avaliação urológica.' },

{ id:'atb-cistite-gestante', sitio:'Trato urinário', quadro:'Cistite e bacteriúria na gestante',
  sub:'Bacteriúria assintomática na gestação TRATA', tags:['gestante','bacteriuria assintomatica','cefalexina','fosfomicina'],
  agentes:'E. coli e Streptococcus do grupo B.',
  atencao:'Quinolona é contraindicada na gestação inteira, e sulfametoxazol-trimetoprima no primeiro trimestre e perto do parto. Bacteriúria assintomática, que fora da gestação não se trata, aqui trata — reduz pielonefrite e parto prematuro.',
  escolha:[ { atb:'Cefalexina', dose:'500 mg', via:'VO', freq:'6/6 h', dur:'7 dias' } ],
  alt:[ { atb:'Fosfomicina trometamol', dose:'3 g', via:'VO', freq:'dose única', dur:'—' },
        { atb:'Amoxicilina + clavulanato', dose:'500/125 mg', via:'VO', freq:'8/8 h', dur:'7 dias' },
        { atb:'Nitrofurantoína', dose:'100 mg', via:'VO', freq:'6/6 h', dur:'7 dias — evitar no 3º trimestre a termo' } ],
  nota:'Urocultura de controle 7 a 14 dias após o tratamento, e rastreio no pré-natal.' },

{ id:'atb-pielonefrite', sitio:'Trato urinário', quadro:'Pielonefrite aguda comunitária',
  sub:'Febre, dor lombar e Giordano positivo', tags:['pielonefrite','giordano','ceftriaxona','itu alta'],
  agentes:'E. coli, Klebsiella, Proteus e Enterococcus.',
  atencao:'Cálculo obstrutivo com infecção é emergência urológica: precisa de desobstrução, e não só de antibiótico. Internar se houver sepse, vômito incoercível, gestação ou impossibilidade de via oral.',
  escolha:[ { atb:'Ceftriaxona', dose:'1 a 2 g', via:'EV', freq:'24/24 h', dur:'7 a 10 dias, com transição para via oral' } ],
  alt:[ { atb:'Ciprofloxacino', dose:'500 mg VO 12/12 h ou 400 mg EV 12/12 h', via:'VO ou EV', freq:'—', dur:'7 dias' },
        { atb:'Levofloxacino', dose:'750 mg', via:'VO ou EV', freq:'24/24 h', dur:'5 a 7 dias' } ],
  nota:'Urocultura antes, e ajustar pelo antibiograma. Ultrassom se não melhorar em 48 a 72 horas ou se houver suspeita de obstrução. Não usar sulfametoxazol-trimetoprima empiricamente.' },

/* ===================== IST ===================== */
{ id:'atb-corrimento-uretral', sitio:'Infecções sexualmente transmissíveis', quadro:'Corrimento uretral',
  sub:'Tratar gonococo e clamídia juntos, na mesma consulta', tags:['uretrite','gonorreia','clamidia','ceftriaxona','azitromicina'],
  agentes:'N. gonorrhoeae e C. trachomatis.',
  atencao:'Toda IST é evento-sentinela: oferecer teste para HIV, sífilis e hepatites B e C, e vacinar para hepatite B.',
  escolha:[ { atb:'Ceftriaxona', dose:'500 mg', via:'IM', freq:'dose única', dur:'—' },
            { atb:'Azitromicina', dose:'1 g', via:'VO', freq:'dose única', dur:'—' } ],
  alt:[ { atb:'Doxiciclina', dose:'100 mg', via:'VO', freq:'12/12 h', dur:'7 dias — alternativa à azitromicina para clamídia' } ],
  nota:'Tratar o parceiro com o mesmo esquema. Abstinência sexual por 7 dias.' },

{ id:'atb-dip', sitio:'Infecções sexualmente transmissíveis', quadro:'Doença inflamatória pélvica',
  sub:'Dor pélvica com dor à mobilização do colo', tags:['dip','anexite','doxiciclina','metronidazol'],
  agentes:'N. gonorrhoeae, C. trachomatis, anaeróbios e flora vaginal.',
  atencao:'Na dúvida, trate: o custo de tratar sem DIP é baixo, o de não tratar é infertilidade, ectópica e dor crônica.',
  escolha:[ { atb:'Ceftriaxona', dose:'500 mg', via:'IM', freq:'dose única', dur:'—' },
            { atb:'Doxiciclina', dose:'100 mg', via:'VO', freq:'12/12 h', dur:'14 dias' },
            { atb:'Metronidazol', dose:'500 mg', via:'VO', freq:'12/12 h', dur:'14 dias' } ],
  alt:[], nota:'Internar se houver gestação, abscesso tubo-ovariano, quadro grave com vômitos, falha do oral ou impossibilidade de seguimento. Reavaliar em 72 horas.' },

{ id:'atb-sifilis', sitio:'Infecções sexualmente transmissíveis', quadro:'Sífilis',
  sub:'Esquema pelo estágio', tags:['sifilis','penicilina benzatina','vdrl','jarisch'],
  agentes:'Treponema pallidum.',
  atencao:'Penicilina benzatina é o único tratamento que trata a gestante e o feto. Alergia relatada exige teste e, se confirmada, dessensibilização — não substituição. Avisar sobre Jarisch-Herxheimer nas primeiras 24 h, que não é alergia.',
  escolha:[ { atb:'Recente (primária, secundária, latente com menos de 1 ano): penicilina G benzatina', dose:'2.400.000 UI (1.200.000 em cada glúteo)', via:'IM', freq:'dose única', dur:'—' },
            { atb:'Tardia ou de duração ignorada: penicilina G benzatina', dose:'2.400.000 UI por semana', via:'IM', freq:'3 semanas', dur:'total de 7.200.000 UI' } ],
  alt:[ { atb:'Doxiciclina', dose:'100 mg', via:'VO', freq:'12/12 h', dur:'Recente 15 dias · Tardia 30 dias — só em alergia comprovada e fora da gestação' } ],
  nota:'Controle com VDRL mensal na gestante e trimestral fora dela; espera-se queda de duas diluições. Notificação compulsória.' },

{ id:'atb-corrimento-vaginal', sitio:'Infecções sexualmente transmissíveis', quadro:'Corrimento vaginal',
  sub:'Vaginose, candidíase e tricomoníase', tags:['corrimento','vaginose','candidiase','tricomoniase','metronidazol','fluconazol'],
  agentes:'Gardnerella (vaginose), Candida albicans, Trichomonas vaginalis.',
  escolha:[ { atb:'Vaginose bacteriana: metronidazol', dose:'500 mg', via:'VO', freq:'12/12 h', dur:'7 dias' },
            { atb:'Candidíase: fluconazol', dose:'150 mg', via:'VO', freq:'dose única', dur:'—' },
            { atb:'Tricomoníase: metronidazol', dose:'2 g', via:'VO', freq:'dose única', dur:'—' } ],
  alt:[ { atb:'Vaginose: metronidazol gel 0,75%', dose:'1 aplicador', via:'VAGINAL', freq:'1x/dia', dur:'5 dias' },
        { atb:'Candidíase: miconazol creme 2%', dose:'1 aplicador', via:'VAGINAL', freq:'à noite', dur:'7 dias' } ],
  nota:'Só a tricomoníase exige tratar o parceiro — vaginose e candidíase não são IST. Não ingerir álcool com metronidazol.' },

/* ===================== PELE E PARTES MOLES ===================== */
{ id:'atb-celulite', sitio:'Pele e partes moles', quadro:'Celulite e erisipela',
  sub:'Erisipela tem borda nítida; celulite é mais profunda e difusa',
  tags:['celulite','erisipela','cefalexina','oxacilina','fasciite'],
  agentes:'Streptococcus beta-hemolítico do grupo A; S. aureus na celulite com porta de entrada.',
  atencao:'Dor desproporcional, bolhas hemorrágicas, necrose, crepitação, anestesia local ou toxemia = fasciite necrosante. É emergência cirúrgica, não caso de antibiótico oral.',
  escolha:[ { atb:'Ambulatorial: cefalexina', dose:'500 mg a 1 g', via:'VO', freq:'6/6 h', dur:'7 a 10 dias' } ],
  alt:[ { atb:'Erisipela ambulatorial: amoxicilina', dose:'500 mg', via:'VO', freq:'8/8 h', dur:'7 a 10 dias' },
        { atb:'Internado: oxacilina', dose:'1 a 2 g', via:'EV', freq:'4/4 h', dur:'7 a 10 dias' },
        { atb:'Alergia à penicilina: clindamicina', dose:'600 mg VO 6/6 h (ou 300 mg 6/6 h)', via:'VO', freq:'—', dur:'7 a 10 dias' } ],
  nota:'Demarcar a borda a caneta com o horário e reavaliar em 48 horas. Tratar a porta de entrada — micose interdigital, fissura, úlcera.' },

{ id:'atb-impetigo-abscesso', sitio:'Pele e partes moles', quadro:'Impetigo e abscesso cutâneo',
  sub:'Crostas melicéricas; coleção flutuante', tags:['impetigo','abscesso','drenagem','mupirocina'],
  agentes:'S. aureus e Streptococcus do grupo A.',
  atencao:'Abscesso se resolve com DRENAGEM. Antibiótico raramente é necessário — só se houver celulite ao redor, febre, imunossupressão, múltiplas lesões ou localização de risco (face, mão).',
  escolha:[ { atb:'Impetigo localizado: mupirocina pomada 2%', dose:'aplicar na lesão', via:'TÓPICO', freq:'8/8 h', dur:'5 a 7 dias' },
            { atb:'Impetigo extenso: cefalexina', dose:'500 mg', via:'VO', freq:'6/6 h', dur:'7 dias' } ],
  alt:[ { atb:'Abscesso com indicação de antibiótico: sulfametoxazol + trimetoprima', dose:'800/160 mg', via:'VO', freq:'12/12 h', dur:'5 a 7 dias — cobre MRSA comunitário' },
        { atb:'Clindamicina', dose:'300 a 600 mg', via:'VO', freq:'6/6 h', dur:'7 dias' } ],
  nota:'Impetigo é muito contagioso: orientar higiene, unhas curtas e afastamento escolar até 24 h de tratamento.' },

{ id:'atb-mordedura', sitio:'Pele e partes moles', quadro:'Mordedura de animal e humana',
  sub:'Cobrir Pasteurella e anaeróbios', tags:['mordedura','pasteurella','eikenella','clavulanato','raiva'],
  agentes:'Pasteurella multocida (cão e gato), Eikenella corrodens (humana), estafilococo, estreptococo e anaeróbios.',
  atencao:'Mordedura de gato infecta muito mais que a de cão — ferida puntiforme e profunda. Como regra não se sutura, exceto face com limpeza exaustiva. Avaliar profilaxia antirrábica e antitetânica sempre.',
  escolha:[ { atb:'Amoxicilina + clavulanato', dose:'875/125 mg', via:'VO', freq:'12/12 h', dur:'Profilaxia 3 a 5 dias · Infectada 7 a 14 dias' } ],
  alt:[ { atb:'Doxiciclina', dose:'100 mg', via:'VO', freq:'12/12 h', dur:'7 dias — em alergia à penicilina' },
        { atb:'Clindamicina + ciprofloxacino', dose:'Clinda 300 mg 6/6 h + cipro 500 mg 12/12 h', via:'VO', freq:'—', dur:'7 dias' } ],
  nota:'Profilaxia antibiótica indicada em: mordedura de gato, mão, face ou genitália, ferida puntiforme profunda, lesão articular ou óssea, imunossuprimido, asplênico e cirrótico.' },

{ id:'atb-pe-diabetico', sitio:'Pele e partes moles', quadro:'Pé diabético infectado',
  sub:'Da celulite leve à infecção com risco de amputação', tags:['pe diabetico','ulcera','osteomielite','amputacao'],
  agentes:'Leve: cocos Gram positivos. Moderada a grave: polimicrobiano, com Gram negativos e anaeróbios.',
  atencao:'Sondar a úlcera: se o osso é palpável com estilete, a chance de osteomielite é alta e o tratamento muda completamente — semanas de antibiótico e avaliação cirúrgica.',
  escolha:[ { atb:'Leve: cefalexina', dose:'500 mg', via:'VO', freq:'6/6 h', dur:'1 a 2 semanas' },
            { atb:'Moderada a grave: piperacilina + tazobactam', dose:'4,5 g', via:'EV', freq:'6/6 h', dur:'2 a 3 semanas' } ],
  alt:[ { atb:'Amoxicilina + clavulanato', dose:'875/125 mg', via:'VO', freq:'12/12 h', dur:'1 a 2 semanas' },
        { atb:'Ceftriaxona + metronidazol', dose:'Ceftriaxona 2 g/dia + metronidazol 500 mg 8/8 h', via:'EV', freq:'—', dur:'2 a 3 semanas' } ],
  nota:'Desbridamento, alívio de pressão e avaliação vascular são parte do tratamento. Radiografia do pé em toda úlcera profunda ou crônica.' },

/* ===================== OSSOS E ARTICULAÇÕES ===================== */
{ id:'atb-artrite-septica', sitio:'Ossos e articulações', quadro:'Artrite séptica',
  sub:'Monoartrite aguda quente — puncionar antes', tags:['artrite septica','pioartrite','oxacilina','puncao articular'],
  agentes:'S. aureus na maioria; gonococo no jovem sexualmente ativo.',
  atencao:'Puncionar a articulação ANTES do antibiótico. Monoartrite aguda é artrite séptica até prova em contrário — a gota é o diagnóstico diferencial, não o diagnóstico presumido.',
  escolha:[ { atb:'Oxacilina', dose:'2 g', via:'EV', freq:'4/4 h', dur:'2 semanas EV, seguidas de 2 semanas VO' } ],
  alt:[ { atb:'Vancomicina', dose:'15 a 20 mg/kg', via:'EV', freq:'12/12 h', dur:'se houver risco de MRSA' },
        { atb:'Transição oral: cefalexina', dose:'1 g', via:'VO', freq:'6/6 h', dur:'2 semanas' } ],
  nota:'Drenagem ou lavagem articular é parte do tratamento. Acionar a ortopedia.' },

{ id:'atb-osteomielite', sitio:'Ossos e articulações', quadro:'Osteomielite',
  sub:'Aguda e crônica', tags:['osteomielite','oxacilina','clindamicina','osso'],
  agentes:'S. aureus na aguda. Na crônica, também Gram negativos e anaeróbios (diabetes, falciforme, desnutrição).',
  escolha:[ { atb:'Aguda: oxacilina', dose:'2 g', via:'EV', freq:'4/4 h', dur:'2 semanas EV, depois cefalexina 1 g VO 6/6 h por 4 semanas' } ],
  alt:[ { atb:'Crônica: ciprofloxacino + clindamicina', dose:'Cipro 400 a 500 mg 12/12 h + clinda 600 mg 6/6 h', via:'EV ou VO', freq:'—', dur:'até 6 meses' } ],
  nota:'Cultura de fragmento ósseo guia o tratamento; swab de fístula não serve. Desbridamento cirúrgico costuma ser necessário na crônica.' },

{ id:'atb-fratura-exposta', sitio:'Ossos e articulações', quadro:'Fratura exposta',
  sub:'Profilaxia por grau de Gustilo', tags:['fratura exposta','gustilo','cefazolina','gentamicina','tetano'],
  agentes:'Estafilococo e bacilos Gram negativos; anaeróbios se houver contaminação por solo ou lesão vascular.',
  atencao:'Antibiótico na primeira hora, junto com lavagem abundante e imobilização. Profilaxia antitetânica sempre.',
  escolha:[ { atb:'Gustilo I e II: cefazolina', dose:'1 a 2 g', via:'EV', freq:'8/8 h', dur:'24 a 48 h após o fechamento' } ],
  alt:[ { atb:'Gustilo III: cefazolina + gentamicina', dose:'Cefazolina 2 g 8/8 h + gentamicina 5 mg/kg/dia', via:'EV', freq:'—', dur:'—' },
        { atb:'Contaminação por solo: acrescentar penicilina ou ampicilina', dose:'—', via:'EV', freq:'—', dur:'cobertura de clostrídio' } ],
  nota:'Acionar a ortopedia para desbridamento em até 6 a 24 horas.' },

/* ===================== OUTROS ===================== */
{ id:'atb-tuberculose', sitio:'Outros', quadro:'Tuberculose — esquema básico',
  sub:'RIPE, dose fixa combinada', tags:['tuberculose','ripe','rifampicina','isoniazida','tb'],
  agentes:'Mycobacterium tuberculosis.',
  atencao:'Notificação compulsória. Testar HIV em todo caso. Tratamento e medicação são fornecidos pelo Ministério da Saúde, com acompanhamento supervisionado.',
  escolha:[ { atb:'Fase intensiva: RIPE (rifampicina, isoniazida, pirazinamida, etambutol)', dose:'Comprimido em dose fixa combinada, ajustado pelo peso', via:'VO', freq:'1x/dia em jejum', dur:'2 meses' },
            { atb:'Fase de manutenção: RI (rifampicina e isoniazida)', dose:'Dose fixa combinada pelo peso', via:'VO', freq:'1x/dia', dur:'4 meses' } ],
  alt:[], nota:'Avisar sobre a urina alaranjada pela rifampicina e sobre a interação com anticoncepcional. Controle mensal de baciloscopia e de função hepática se houver sintomas.' },

{ id:'atb-neutropenia', sitio:'Outros', quadro:'Neutropenia febril',
  sub:'Neutrófilos abaixo de 500 com febre — emergência', tags:['neutropenia febril','cefepima','oncologia','emergencia'],
  agentes:'Gram negativos, inclusive Pseudomonas; Gram positivos de cateter.',
  atencao:'Antibiótico na primeira hora, como na sepse. Não esperar hemograma se a suspeita é forte. Não fazer toque retal nem supositório: risco de bacteremia.',
  escolha:[ { atb:'Cefepima', dose:'2 g', via:'EV', freq:'8/8 h', dur:'até a resolução da neutropenia e da febre' } ],
  alt:[ { atb:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', freq:'6/6 h', dur:'—' },
        { atb:'Meropeném', dose:'1 g', via:'EV', freq:'8/8 h', dur:'—' },
        { atb:'Associar vancomicina', dose:'15 a 20 mg/kg 12/12 h', via:'EV', freq:'—', dur:'se houver infecção de cateter, mucosite grave, instabilidade ou MRSA conhecido' } ],
  nota:'Hemoculturas de veia periférica E de cada lúmen do cateter antes. Aplicar MASCC para estratificar risco.' },

{ id:'atb-sepse-foco', sitio:'Outros', quadro:'Sepse sem foco definido',
  sub:'Cobertura empírica enquanto se procura a origem', tags:['sepse','foco indeterminado','empirico','primeira hora'],
  agentes:'Depende do foco provável — urinário, pulmonar, abdominal e pele são os mais comuns.',
  atencao:'Antibiótico na primeira hora. Hemoculturas antes, sem atrasar além de 45 minutos. Reavaliar e descalonar em 48 a 72 horas com o resultado.',
  escolha:[ { atb:'Comunitário, sem risco de resistência: ceftriaxona', dose:'2 g', via:'EV', freq:'24/24 h', dur:'reavaliar em 48 a 72 h' } ],
  alt:[ { atb:'Suspeita de foco abdominal: acrescentar metronidazol', dose:'500 mg', via:'EV', freq:'8/8 h', dur:'—' },
        { atb:'Risco de germe resistente ou origem hospitalar: piperacilina + tazobactam', dose:'4,5 g', via:'EV', freq:'6/6 h', dur:'—' },
        { atb:'Risco de MRSA: acrescentar vancomicina', dose:'15 a 20 mg/kg', via:'EV', freq:'12/12 h', dur:'—' } ],
  nota:'Junto: lactato, 30 mL/kg de cristaloide se houver hipotensão, e noradrenalina para PAM acima de 65 mmHg.' }

];

/* --- 11d. quadros ambulatoriais (ficha verde/amarela) --- */
FERR_QUADROS = FERR_QUADROS.concat([

/* ====================== OLHOS, OUVIDO E BOCA ====================== */
{ id:'q-conjuntivite', grupo:'Olhos, ouvido e boca', nome:'Conjuntivite', sub:'Olho vermelho com secreção, sem dor nem baixa de visão',
  tags:['conjuntivite','olho vermelho','secrecao','tobramicina'],
  atencao:'Dor ocular importante, baixa de acuidade visual, fotofobia intensa, pupila irregular ou halo pericerático NÃO são conjuntivite: pensar em uveíte, glaucoma agudo ou ceratite, e encaminhar ao oftalmologista no mesmo dia. Nunca prescrever colírio com corticoide sem avaliação especializada — em herpes de córnea, perfura o olho.',
  unidade:[
    { med:'LAVAGEM OCULAR COM SORO FISIOLÓGICO 0,9%', dose:'abundante', via:'TÓPICO', obs:'Remove secreção e alivia. Base do tratamento na viral.' },
    { med:'AVALIAR ACUIDADE VISUAL E TESTAR FLUORESCEÍNA SE HOUVER DOR', dose:'—', via:'—', obs:'Registrar a acuidade de cada olho no prontuário.' }
  ],
  receita:[
    { med:'Soro fisiológico 0,9% para lavagem ocular', uso:'Lavar os olhos de 3/3 h e sempre que houver secreção, por 7 dias.' },
    { med:'Tobramicina colírio 3 mg/mL', uso:'Instilar 1 gota no olho acometido de 4/4 h por 7 dias. Apenas se a secreção for purulenta (bacteriana).' },
    { med:'Lubrificante ocular colírio', uso:'Instilar 1 gota de 4/4 h, se desconforto ou sensação de areia.' },
    { med:'Compressa fria', uso:'Aplicar sobre os olhos fechados por 10 minutos, 3 vezes ao dia.' }
  ],
  orientacoes:[
    'Conjuntivite viral é muito contagiosa: toalha e fronha separadas, lavar as mãos com frequência, não coçar, afastamento do trabalho e da escola por 7 dias.',
    'Não usar lentes de contato até 48 horas após a resolução completa.',
    'Retorno imediato se dor forte, piora da visão, sensibilidade intensa à luz ou secreção que aumenta.'
  ] },

{ id:'q-ceratite-fotoeletrica', grupo:'Olhos, ouvido e boca', nome:'Ceratite fotoelétrica', sub:'Dor intensa horas após solda sem proteção',
  tags:['ceratite','solda','olho de solda','fotoeletrica','oclusao'],
  atencao:'O quadro clássico aparece 6 a 12 horas depois da exposição, quase sempre bilateral e muito doloroso. Nunca entregar colírio anestésico para uso em casa: mascara a dor, impede a cicatrização e leva à úlcera de córnea.',
  unidade:[
    { med:'ANESTÉSICO TÓPICO (PROXIMETACAÍNA OU TETRACAÍNA)', dose:'1 gota', via:'TÓPICO', obs:'SOMENTE para permitir o exame na unidade. Não prescrever para casa.' },
    { med:'TESTE COM FLUORESCEÍNA', dose:'—', via:'—', obs:'Mostra ceratite punctata difusa. Afastar corpo estranho sob a pálpebra evertendo-a.' },
    { med:'POMADA OFTÁLMICA EPITELIZANTE COM ANTIBIÓTICO', dose:'aplicar', via:'TÓPICO', obs:'Oclusão do olho por 24 h se a lesão for extensa e unilateral.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g) + 100 mL de SF 0,9%', via:'EV', obs:'A dor costuma ser intensa.' }
  ],
  receita:[
    { med:'Pomada oftálmica de tobramicina', uso:'Aplicar no fundo de saco conjuntival de 8/8 h por 5 dias.' },
    { med:'Lubrificante ocular colírio', uso:'Instilar 1 gota de 2/2 h nos primeiros dias.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor, por 3 dias.' },
    { med:'Óculos escuros', uso:'Usar enquanto houver fotofobia.' }
  ],
  orientacoes:[
    'A córnea regenera em 24 a 48 horas e a dor cede junto.',
    'Usar máscara de solda com filtro adequado — a recidiva é regra sem proteção.',
    'Retorno em 24 h se não melhorar, ou antes se a visão piorar.'
  ] },

{ id:'q-corpo-estranho-ocular', grupo:'Olhos, ouvido e boca', nome:'Corpo estranho ocular', sub:'Sensação de areia após exposição a poeira ou metal',
  tags:['corpo estranho','olho','everter palpebra','ferrugem'],
  atencao:'História de martelar metal ou de projétil em alta velocidade obriga a afastar corpo estranho INTRAOCULAR — pupila irregular, hipotonia, câmara rasa. Aí é tomografia e oftalmologia de urgência, e nunca tentar remover.',
  unidade:[
    { med:'ANESTÉSICO TÓPICO', dose:'1 gota', via:'TÓPICO', obs:'Para o exame e a remoção.' },
    { med:'EVERSÃO DA PÁLPEBRA SUPERIOR', dose:'—', via:'—', obs:'Passo esquecido com frequência: a maior parte dos corpos estranhos se aloja no sulco subtarsal.' },
    { med:'REMOÇÃO COM COTONETE ÚMIDO OU AGULHA 27G SOB LÂMPADA DE FENDA', dose:'—', via:'—', obs:'Anel de ferrugem residual precisa de oftalmologista.' },
    { med:'FLUORESCEÍNA APÓS A REMOÇÃO', dose:'—', via:'—', obs:'Avalia a extensão da abrasão de córnea que ficou.' }
  ],
  receita:[
    { med:'Pomada oftálmica de tobramicina', uso:'Aplicar no olho acometido de 8/8 h por 5 dias.' },
    { med:'Lubrificante ocular colírio', uso:'Instilar 1 gota de 4/4 h por 7 dias.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor.' }
  ],
  orientacoes:[
    'Reavaliação oftalmológica em 24 a 48 horas, obrigatória se ficou anel de ferrugem.',
    'Óculos de proteção no trabalho.',
    'Retorno imediato se dor crescente, secreção purulenta ou piora da visão.'
  ] },

{ id:'q-hordeolo', grupo:'Olhos, ouvido e boca', nome:'Hordéolo e blefarite', sub:'Terçol e inflamação da margem palpebral',
  tags:['tercol','hordeolo','calazio','blefarite','palpebra'],
  atencao:'Edema difuso da pálpebra com febre, proptose, dor à movimentação do olho ou limitação da motilidade é celulite orbitária: internação com antibiótico endovenoso, não terçol.',
  unidade:[],
  receita:[
    { med:'Compressa morna', uso:'Aplicar por 10 a 15 minutos, 4 vezes ao dia, seguida de massagem suave da pálpebra em direção aos cílios. É o tratamento principal.' },
    { med:'Higiene palpebral', uso:'Limpar a margem dos cílios com xampu neutro infantil diluído, 2 vezes ao dia.' },
    { med:'Pomada oftálmica de tobramicina', uso:'Aplicar na margem palpebral de 8/8 h por 7 dias.' },
    { med:'Cefalexina 500 mg cápsula', uso:'Tomar 1 cápsula VO de 6/6 h por 7 dias. Só se houver celulite peri-palpebral.' }
  ],
  orientacoes:[
    'Não espremer: piora e pode disseminar a infecção.',
    'Lesão que persiste por semanas sem dor é calázio — encaminhar ao oftalmologista para drenagem.',
    'Blefarite é crônica e recidiva: a higiene palpebral é para sempre, não só na crise.'
  ] },

{ id:'q-aftas', grupo:'Olhos, ouvido e boca', nome:'Aftas orais', sub:'Estomatite aftosa recorrente',
  tags:['afta','estomatite','ulcera oral','boca'],
  atencao:'Afta que não cicatriza em 3 semanas, com bordas endurecidas ou fixa a planos profundos, exige biópsia — é câncer de boca até prova em contrário. Aftas grandes e recorrentes com úlceras genitais levantam Behçet.',
  unidade:[],
  receita:[
    { med:'Triancinolona acetonida 1 mg/g em orabase', uso:'Aplicar fina camada na lesão de 8/8 h, após as refeições, por até 7 dias.' },
    { med:'Digluconato de clorexidina 0,12% solução bucal', uso:'Bochechar 15 mL por 1 minuto de 12/12 h, por 7 dias. Não engolir.' },
    { med:'Lidocaína gel 2%', uso:'Aplicar na lesão antes das refeições, se dor impedir a alimentação.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor.' }
  ],
  orientacoes:[
    'Evitar alimentos ácidos, picantes, muito quentes e crocantes enquanto durar.',
    'Investigar deficiência de ferro, ácido fólico e vitamina B12 se for recorrente.',
    'Encaminhar ao dentista ou estomatologista se ultrapassar 3 semanas.'
  ] },

/* ====================== PELE ====================== */
{ id:'q-herpes-zoster', grupo:'Pele', nome:'Herpes-zóster', sub:'Vesículas em faixa, num único dermátomo',
  tags:['zoster','cobreiro','aciclovir','neuralgia pos herpetica','ramsay hunt'],
  atencao:'Antiviral só funciona se iniciado em até 72 horas do surgimento das lesões — depois disso o benefício some. Zóster na ponta do nariz (sinal de Hutchinson) ameaça o olho: oftalmologia no mesmo dia. Acometimento do ouvido com paralisia facial é síndrome de Ramsay Hunt. Zóster disseminado ou em jovem sem causa pede investigação de imunossupressão e HIV.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g) + 100 mL de SF 0,9%', via:'EV', obs:'A dor costuma ser intensa e mal responder a analgésico simples.' },
    { med:'TRAMADOL CLORIDRATO 100 MG', dose:'1 ampola + 100 mL de SF 0,9%', via:'EV', obs:'SE dor refratária. Correr lentamente.' }
  ],
  receita:[
    { med:'Aciclovir 400 mg comprimido', uso:'Tomar 2 comprimidos (800 mg) VO 5 vezes ao dia, por 7 dias. Iniciar em até 72 h do início das lesões.' },
    { med:'Valaciclovir 500 mg comprimido', uso:'Tomar 2 comprimidos (1 g) VO de 8/8 h por 7 dias. Alternativa mais cômoda.' },
    { med:'Amitriptilina 25 mg comprimido', uso:'Tomar 1 comprimido VO à noite. Para a dor neuropática; iniciar cedo reduz a neuralgia pós-herpética.' },
    { med:'Gabapentina 300 mg cápsula', uso:'Tomar 1 cápsula VO à noite na 1ª semana, com aumento gradual conforme orientação.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor.' }
  ],
  orientacoes:[
    'Manter as lesões limpas e secas; compressa com soro fisiológico alivia.',
    'É contagioso para quem nunca teve catapora ou não se vacinou, até as lesões formarem crosta — evitar gestantes, recém-nascidos e imunossuprimidos.',
    'A neuralgia pós-herpética é a complicação mais comum acima dos 60 anos; avisar o paciente e tratar a dor desde o início.'
  ] },

{ id:'q-escabiose', grupo:'Pele', nome:'Escabiose', sub:'Prurido intenso à noite, com lesões nos espaços interdigitais',
  tags:['sarna','escabiose','permetrina','ivermectina','prurido'],
  atencao:'Tratar TODOS os contatos domiciliares ao mesmo tempo, tenham sintomas ou não — sem isso, reinfesta. Avisar que o prurido persiste por 2 a 4 semanas após a cura, e que isso não é falha do tratamento.',
  unidade:[],
  receita:[
    { med:'Permetrina 50 mg/mL loção', uso:'Aplicar do pescoço aos pés à noite, incluindo entre os dedos e sob as unhas. Deixar 8 a 14 h e enxaguar. Repetir após 7 dias.' },
    { med:'Ivermectina 6 mg comprimido', uso:'200 mcg/kg VO em dose única, repetida após 7 a 14 dias. Cerca de 2 comprimidos para 60 a 80 kg. Não usar em gestantes nem abaixo de 15 kg.' },
    { med:'Loratadina 10 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, para o prurido, por 14 dias.' },
    { med:'Dexclorfenirmina 2 mg comprimido', uso:'Tomar 1 comprimido VO à noite, se o prurido atrapalhar o sono.' }
  ],
  orientacoes:[
    'Lavar roupas de cama, toalhas e roupas usadas nos últimos 3 dias em água quente, e passar a ferro. O que não puder ser lavado, guardar em saco fechado por 7 dias.',
    'Tratar todos os moradores da casa e parceiros no mesmo dia.',
    'Retorno se surgirem lesões novas após 2 semanas do segundo tratamento.'
  ] },

{ id:'q-tinha', grupo:'Pele', nome:'Micoses superficiais', sub:'Tinha do corpo, do couro cabeludo e pitiríase versicolor',
  tags:['tinha','micose','pitiriase versicolor','cetoconazol','griseofulvina','pano branco'],
  atencao:'Tinha do couro cabeludo NÃO responde a tratamento tópico — precisa de antifúngico oral, sempre. Nunca usar creme com corticoide na micose: some o aspecto típico, a lesão se espalha e vira tinha incógnita.',
  unidade:[],
  receita:[
    { med:'Cetoconazol creme 20 mg/g', uso:'Aplicar na lesão e 2 cm além da borda, de 12/12 h, por 21 dias — mantendo por 1 semana após o desaparecimento.' },
    { med:'Terbinafina 250 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia. Corpo: 2 a 4 semanas. Unha da mão: 6 semanas. Unha do pé: 12 semanas.' },
    { med:'Griseofulvina 500 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, com alimento gorduroso, por 6 a 8 semanas. Escolha na tinha do couro cabeludo.' },
    { med:'Cetoconazol xampu 20 mg/g', uso:'Aplicar no couro cabeludo ou no corpo, deixar agir 5 minutos e enxaguar, 3 vezes por semana por 4 semanas. Para pitiríase versicolor.' },
    { med:'Fluconazol 150 mg comprimido', uso:'Tomar 1 comprimido VO por semana, por 4 semanas. Alternativa na pitiríase versicolor extensa.' }
  ],
  orientacoes:[
    'A mancha branca da pitiríase versicolor demora meses para repigmentar mesmo com o fungo curado — avisar, ou o paciente acha que falhou.',
    'Secar bem as dobras, não compartilhar toalhas, pentes ou bonés, e tratar animais domésticos com lesão.',
    'Solicitar transaminases antes e durante o uso prolongado de terbinafina ou griseofulvina.'
  ] },

{ id:'q-eczema-contato', grupo:'Pele', nome:'Eczema de contato', sub:'Placas eritematosas e pruriginosas na área exposta',
  tags:['eczema','dermatite de contato','alergia de pele','corticoide topico'],
  atencao:'Corticoide de alta potência não vai na face, nas dobras nem na genitália: atrofia a pele. Nessas áreas, hidrocortisona.',
  unidade:[
    { med:'CLORIDRATO DE PROMETAZINA 25 MG/ML AMP 2 ML', dose:'1 ampola (50 mg)', via:'IM', obs:'SE prurido incapacitante.' },
    { med:'DEXAMETASONA FOSFATO 4 MG/ML AMP 2,5 ML', dose:'1 ampola (10 mg)', via:'EV', obs:'SE quadro extenso e agudo.' }
  ],
  receita:[
    { med:'Dexametasona creme 1 mg/g', uso:'Aplicar fina camada na lesão de 12/12 h, por 7 dias. Não usar na face por mais de 5 dias.' },
    { med:'Hidrocortisona creme 10 mg/g', uso:'Para face, dobras e genitália: aplicar de 12/12 h por 7 dias.' },
    { med:'Loratadina 10 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, por 7 dias.' },
    { med:'Prednisona 20 mg comprimido', uso:'Tomar 2 comprimidos VO pela manhã por 5 dias, nos casos extensos.' },
    { med:'Emoliente / hidratante sem perfume', uso:'Aplicar 2 a 3 vezes ao dia, de uso contínuo.' }
  ],
  orientacoes:[
    'Identificar e afastar o agente: níquel (bijuteria), cosmético, produto de limpeza, látex, planta, esparadrapo.',
    'Banho morno e curto, sabonete neutro, hidratante logo após.',
    'Retorno se houver pus, febre ou piora apesar do tratamento.'
  ] },

/* ====================== GINECOLOGIA ====================== */
{ id:'q-dismenorreia', grupo:'Ginecologia', nome:'Dismenorreia', sub:'Cólica menstrual intensa',
  tags:['colica menstrual','dismenorreia','endometriose','aine'],
  atencao:'Dismenorreia que começa anos após a menarca, que piora progressivamente, com dor à relação ou dor fora do período, sugere endometriose — encaminhar, não só medicar. E toda dor pélvica em mulher em idade fértil pede beta-HCG.',
  unidade:[
    { med:'BUTILBROMETO DE ESCOPOLAMINA 4 MG/ML + DIPIRONA 500 MG/ML AMP 5 ML', dose:'1 ampola + 100 mL de SF 0,9%', via:'EV', obs:'Analgesia e antiespasmódico juntos.' },
    { med:'CETOPROFENO 100 MG FRASCO-AMPOLA', dose:'1 frasco + 100 mL de SF 0,9%', via:'EV', obs:'O anti-inflamatório é a base: age no prostaglandínico que causa a cólica.' }
  ],
  receita:[
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, começando 1 a 2 dias ANTES da menstruação e mantendo nos primeiros dias.' },
    { med:'Ácido mefenâmico 500 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h durante o período menstrual.' },
    { med:'Escopolamina 10 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se cólica.' },
    { med:'Anticoncepcional hormonal combinado', uso:'Avaliação ginecológica para uso contínuo — reduz muito a dismenorreia primária.' }
  ],
  orientacoes:[
    'Começar o anti-inflamatório antes da dor instalar funciona muito melhor que esperar doer.',
    'Calor local, atividade física regular e redução de cafeína ajudam.',
    'Encaminhamento à ginecologia se não melhorar ou se houver sinal de endometriose.'
  ] },

{ id:'q-sangramento-uterino', grupo:'Ginecologia', nome:'Sangramento uterino anormal', sub:'Fora do período ou muito volumoso',
  tags:['sangramento uterino','menorragia','sua','acido tranexamico','beta hcg'],
  atencao:'Beta-HCG em TODA mulher em idade fértil com sangramento: gestação ectópica e abortamento se apresentam assim e matam. Instabilidade hemodinâmica, sangramento volumoso ou hemoglobina baixa é caso de internação.',
  unidade:[
    { med:'BETA-HCG E HEMOGRAMA', dose:'—', via:'—', obs:'Antes de qualquer conduta. Tipagem sanguínea se o sangramento for volumoso.' },
    { med:'ÁCIDO TRANEXÂMICO 250 MG/5 ML', dose:'1 ampola + 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h. Reduz o volume do sangramento.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'1000 mL', via:'EV', obs:'SE repercussão hemodinâmica.' }
  ],
  receita:[
    { med:'Ácido tranexâmico 250 mg comprimido', uso:'Tomar 2 comprimidos VO de 8/8 h durante os dias de sangramento intenso, por até 5 dias.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h durante o sangramento — reduz o volume e a cólica.' },
    { med:'Sulfato ferroso 40 mg de ferro elementar', uso:'Tomar 1 comprimido VO 1 vez ao dia, em jejum com suco cítrico, por 3 meses, se houver anemia.' },
    { med:'Anticoncepcional hormonal', uso:'Esquema de controle conforme avaliação ginecológica.' }
  ],
  orientacoes:[
    'Encaminhamento à ginecologia com hemograma, beta-HCG e ultrassom transvaginal.',
    'Registrar um calendário menstrual com dias e número de absorventes.',
    'Retorno imediato se tontura ao levantar, palidez, palpitação, ou se encharcar mais de um absorvente por hora.'
  ] },

/* ====================== ARBOVIROSES ====================== */
{ id:'q-chikungunya', grupo:'Infeccioso', nome:'Chikungunya', sub:'Febre com poliartralgia incapacitante',
  tags:['chikungunya','artralgia','arbovirose','poliartrite'],
  atencao:'Enquanto não afastar dengue, NÃO usar anti-inflamatório nem ácido acetilsalicílico. Na fase aguda, tratar como dengue: só dipirona ou paracetamol. O anti-inflamatório só entra depois de afastada a dengue e passada a viremia.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g) + 100 mL de SF 0,9%', via:'EV', obs:'De 6/6 h.' },
    { med:'CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL', dose:'500 a 1000 mL', via:'EV', obs:'SE desidratação ou aceitação oral ruim.' },
    { med:'TRAMADOL CLORIDRATO 100 MG', dose:'1 ampola + 100 mL de SF 0,9%', via:'EV', obs:'SE dor articular refratária. Correr lentamente.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre.' },
    { med:'Paracetamol 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h. Máximo de 3 g ao dia.' },
    { med:'Hidratação oral', uso:'60 mL/kg/dia enquanto não estiver afastada a dengue.' },
    { med:'Prednisona 20 mg comprimido', uso:'Na fase subaguda, com artrite persistente e dengue afastada: conforme avaliação, com desmame.' }
  ],
  orientacoes:[
    'Avisar que a dor articular pode durar semanas a meses — é a marca da doença e não significa que algo deu errado.',
    'Repouso relativo, compressa fria nas articulações e fisioterapia na fase subaguda.',
    'Notificação compulsória. Eliminar criadouros do mosquito.',
    'Retorno imediato se sinais de alarme de dengue, sangramento, ou dor abdominal intensa.'
  ] },

{ id:'q-zika', grupo:'Infeccioso', nome:'Zika', sub:'Exantema pruriginoso com febre baixa ou ausente',
  tags:['zika','exantema','conjuntivite','gestante','microcefalia','guillain barre'],
  atencao:'Gestante com suspeita de zika é prioridade absoluta: notificar, encaminhar ao pré-natal de alto risco e acompanhar com ultrassom seriado. Fraqueza ascendente após o quadro levanta síndrome de Guillain-Barré.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'SE dor ou febre. Nunca anti-inflamatório enquanto não afastar dengue.' },
    { med:'CLORIDRATO DE PROMETAZINA 25 MG/ML AMP 2 ML', dose:'1 ampola', via:'IM', obs:'SE prurido intenso.' }
  ],
  receita:[
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor ou febre.' },
    { med:'Loratadina 10 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia, para o prurido, por 7 dias.' },
    { med:'Hidratação oral', uso:'Abundante, enquanto durarem os sintomas.' }
  ],
  orientacoes:[
    'Notificação compulsória, com atenção especial à gestante.',
    'Orientar contracepção e sexo com preservativo por pelo menos 3 meses em quem planeja gestar.',
    'Retorno imediato se fraqueza nas pernas, formigamento ascendente ou dificuldade para andar.'
  ] },

{ id:'q-parasitoses', grupo:'Infeccioso', nome:'Parasitoses intestinais', sub:'Tratamento empírico e por agente',
  tags:['verminose','albendazol','ivermectina','oxiurus','giardia','amebiase'],
  atencao:'Estrongiloidíase em quem vai receber corticoide ou imunossupressor pode virar hiperinfecção e matar — tratar antes. Ivermectina é contraindicada na gestação e abaixo de 15 kg.',
  unidade:[],
  receita:[
    { med:'Albendazol 400 mg comprimido', uso:'Tomar 1 comprimido VO em dose única. Cobre ascaris, ancilostoma e tricocéfalo. Para oxiúrus, repetir após 14 dias.' },
    { med:'Ivermectina 6 mg comprimido', uso:'200 mcg/kg VO em dose única (cerca de 2 comprimidos para 60 a 80 kg). Escolha para estrongiloidíase, repetindo após 14 dias.' },
    { med:'Metronidazol 250 mg comprimido', uso:'Giardíase: tomar 1 comprimido VO de 8/8 h por 5 a 7 dias.' },
    { med:'Metronidazol 500 mg comprimido', uso:'Amebíase: tomar 1 a 2 comprimidos VO de 8/8 h por 7 a 10 dias.' },
    { med:'Praziquantel 600 mg comprimido', uso:'Esquistossomose: 40 a 60 mg/kg VO em dose única, após alimentação.' }
  ],
  orientacoes:[
    'No oxiúrus, tratar toda a família no mesmo dia e trocar roupa de cama e íntima; o prurido anal noturno é a pista.',
    'Lavar bem frutas e verduras, ferver ou filtrar a água, e usar calçado — a maioria entra pela pele ou pela boca.',
    'Não ingerir álcool durante e por 3 dias após o metronidazol.'
  ] },

/* ====================== RESPIRATÓRIO E ORL ====================== */
{ id:'q-rinite', grupo:'Respiratório', nome:'Rinite alérgica', sub:'Espirros em salva, coriza clara e prurido nasal',
  tags:['rinite','alergia','corticoide nasal','loratadina','espirros'],
  atencao:'Descongestionante nasal tópico por mais de 3 a 5 dias causa rinite medicamentosa, que é pior que a doença original. Avisar sempre.',
  unidade:[],
  receita:[
    { med:'Budesonida spray nasal 50 mcg', uso:'Aplicar 1 a 2 jatos em cada narina 1 vez ao dia, de uso contínuo. É o tratamento mais eficaz — leva 1 a 2 semanas para o efeito pleno.' },
    { med:'Loratadina 10 mg comprimido', uso:'Tomar 1 comprimido VO 1 vez ao dia. Não causa sonolência.' },
    { med:'Dexclorfeniramina 2 mg comprimido', uso:'Tomar 1 comprimido VO à noite, se o sintoma atrapalhar o sono. Causa sonolência.' },
    { med:'Solução nasal de cloreto de sódio 0,9%', uso:'Lavar cada narina de 8/8 h e antes do corticoide nasal.' }
  ],
  orientacoes:[
    'Ensinar a técnica do spray: apontar para o canto externo do olho, não para o septo — apontar para o septo causa sangramento.',
    'Controle ambiental: capa antiácaro, lavar roupa de cama em água quente semanalmente, retirar tapete, cortina pesada e bicho de pelúcia do quarto.',
    'Encaminhamento à alergologia se não controlar, para investigação e imunoterapia.'
  ] },

{ id:'q-tosse', grupo:'Respiratório', nome:'Tosse', sub:'Seca e produtiva, sem sinal de alarme',
  tags:['tosse','antitussigeno','levodropropizina','tosse cronica'],
  atencao:'Tosse acima de 3 semanas, com sangue, perda de peso, sudorese noturna ou febre vespertina exige investigar tuberculose e neoplasia — não é caso de xarope. E lembrar que IECA (captopril, enalapril) causa tosse seca crônica: revisar a medicação antes de investigar.',
  unidade:[],
  receita:[
    { med:'Levodropropizina 60 mg/10 mL xarope', uso:'Tomar 10 mL VO de 8/8 h, se tosse seca, por até 7 dias.' },
    { med:'Dropropizina 1,5 mg/mL xarope', uso:'Tomar 10 mL VO de 8/8 h, se tosse seca.' },
    { med:'Acetilcisteína 600 mg envelope', uso:'Dissolver 1 envelope em água e tomar VO 1 vez ao dia, por 7 dias, se secreção espessa.' },
    { med:'Codeína 30 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, para tosse seca refratária e incapacitante, por até 3 dias.' },
    { med:'Solução nasal de cloreto de sódio 0,9%', uso:'Lavagem nasal de 6/6 h — muita tosse é gotejamento pós-nasal.' }
  ],
  orientacoes:[
    'Hidratação abundante, umidificação do ambiente e afastamento de fumaça.',
    'Não usar antitussígeno em tosse produtiva com muita secreção: reter secreção piora a infecção.',
    'Solicitar radiografia de tórax e pesquisa de BAAR se a tosse passar de 3 semanas.'
  ] },

/* ====================== MUSCULOESQUELÉTICO ====================== */
{ id:'q-torcicolo', grupo:'Dor', nome:'Torcicolo espasmódico agudo', sub:'Contratura cervical dolorosa, sem trauma',
  tags:['torcicolo','cervicalgia','contratura','ciclobenzaprina','distonia'],
  atencao:'Torcicolo com febre e rigidez de nuca é meningite. Após trauma, é lesão cervical até prova em contrário: imobilizar e radiografar. Torcicolo agudo em quem tomou metoclopramida ou haloperidol é distonia aguda — o tratamento é biperideno, não relaxante.',
  unidade:[
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g) + 100 mL de SF 0,9%', via:'EV', obs:'—' },
    { med:'CETOPROFENO 100 MG FRASCO-AMPOLA', dose:'1 frasco + 100 mL de SF 0,9%', via:'EV', obs:'Correr em 20 minutos.' },
    { med:'DIAZEPAM 5 MG/ML AMP 2 ML', dose:'5 mg', via:'EV', obs:'SE contratura importante. Lento. Avisar sobre sonolência e não dirigir.' },
    { med:'LACTATO DE BIPERIDENO 5 MG/ML AMP 1 ML', dose:'1 ampola', via:'EV', obs:'SE for distonia aguda por medicação.' }
  ],
  receita:[
    { med:'Ciclobenzaprina 5 mg comprimido', uso:'Tomar 1 comprimido VO à noite, por 5 dias. Causa sonolência.' },
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 5 dias.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor.' },
    { med:'Diclofenaco gel 10 mg/g', uso:'Aplicar na região cervical de 8/8 h, por 7 dias.' }
  ],
  orientacoes:[
    'Calor local por 20 minutos, 3 vezes ao dia, e alongamento suave dentro do tolerado.',
    'Rever o travesseiro e a postura no trabalho — costuma ser a causa.',
    'Não dirigir sob efeito do relaxante muscular.',
    'Retorno se houver dormência ou fraqueza no braço, febre, ou se não melhorar em 7 dias.'
  ] },

{ id:'q-bursite', grupo:'Dor', nome:'Bursite e tendinite', sub:'Dor localizada em ombro, cotovelo, quadril ou joelho',
  tags:['bursite','tendinite','ombro','infiltracao','manguito'],
  atencao:'Bursa quente, vermelha, com febre ou porta de entrada é bursite SÉPTICA: puncionar e tratar com antibiótico, não infiltrar corticoide.',
  unidade:[
    { med:'CETOPROFENO 100 MG FRASCO-AMPOLA', dose:'1 frasco + 100 mL de SF 0,9%', via:'EV', obs:'Correr em 20 minutos.' },
    { med:'DIPIRONA SÓDICA 500 MG/ML AMP 2 ML', dose:'2 ampolas (2 g)', via:'EV', obs:'—' }
  ],
  receita:[
    { med:'Ibuprofeno 600 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, após as refeições, por 7 dias.' },
    { med:'Dipirona 500 mg comprimido', uso:'Tomar 1 comprimido VO de 6/6 h, se dor.' },
    { med:'Diclofenaco gel 10 mg/g', uso:'Aplicar no local de 8/8 h, por 10 dias.' },
    { med:'Omeprazol 20 mg cápsula', uso:'Tomar 1 cápsula VO em jejum enquanto usar o anti-inflamatório.' }
  ],
  orientacoes:[
    'Repouso relativo do membro, gelo por 15 minutos 3 vezes ao dia na fase aguda.',
    'Evitar o movimento que desencadeia, mas não imobilizar: ombro imobilizado congela.',
    'Encaminhamento à fisioterapia — é o que resolve de verdade — e à ortopedia se não melhorar em 4 semanas.'
  ] },

/* ====================== GASTRO ====================== */
{ id:'q-meteorismo', grupo:'Gastro', nome:'Meteorismo e distensão gasosa', sub:'Empachamento e flatulência, sem sinal de obstrução',
  tags:['gases','meteorismo','distensao','simeticona','flatulencia'],
  atencao:'Distensão com parada de eliminação de gases e fezes, vômito ou timpanismo com ruídos metálicos é obstrução intestinal — radiografia, não simeticona.',
  unidade:[
    { med:'BUTILBROMETO DE ESCOPOLAMINA 20 MG/ML AMP 1 ML', dose:'1 ampola', via:'EV', obs:'SE cólica associada. Diluir e aplicar lentamente.' },
    { med:'DIMETICONA GOTAS', dose:'20 gotas', via:'VO', obs:'Alívio sintomático na unidade.' }
  ],
  receita:[
    { med:'Simeticona 75 mg/mL gotas', uso:'Tomar 20 gotas VO de 8/8 h, após as refeições, por 7 dias.' },
    { med:'Bromoprida 10 mg cápsula', uso:'Tomar 1 cápsula VO de 8/8 h, 30 minutos antes das refeições, por 7 dias.' },
    { med:'Escopolamina 10 mg comprimido', uso:'Tomar 1 comprimido VO de 8/8 h, se cólica.' }
  ],
  orientacoes:[
    'Comer devagar, sem falar durante a refeição, e evitar canudo, chiclete e bebida com gás — a maior parte do gás é ar engolido.',
    'Reduzir feijão, repolho, brócolis, cebola, leite e adoçante com sorbitol por 2 semanas e reintroduzir um a um.',
    'Investigar intolerância à lactose e doença celíaca se for persistente.'
  ] }

]);

/* ===========================================================
   INTERNADOS — prescrição de enfermaria, pronta para copiar.
   Adulto, enfermaria (não UTI). Cada item: med | dose | via | obs.
   Sempre conferir alergia, função renal, peso e gestação.
   =========================================================== */
var FERR_INTERNADOS = [

{ id:'i-pac', grupo:'Respiratório', nome:'Pneumonia adquirida na comunidade', sub:'Enfermaria, sem critério de UTI', conduta:'resp/pneumonia-comunidade',
  itens:[
    { med:'Dieta', dose:'geral ou conforme aceitação', via:'VO', obs:'Jejum só se rebaixado ou com risco de broncoaspiração.' },
    { med:'SF 0,9%', dose:'1000 mL', via:'EV', obs:'Correr em 12 h. Suspender quando aceitar líquidos bem.' },
    { med:'Ceftriaxona 1 g', dose:'1 g', via:'EV', obs:'1x/dia, diluído em 100 mL de SF 0,9%, em 30 min. 7 dias.' },
    { med:'Azitromicina 500 mg', dose:'500 mg', via:'VO', obs:'1x/dia, por 5 dias. Se não tolerar VO: claritromicina 500 mg EV 12/12 h.' },
    { med:'Oxigênio', dose:'cateter nasal 1–3 L/min', via:'INAL', obs:'Se SpO2 < 92%. Alvo 92–96% (88–92% se DPOC).' },
    { med:'Dipirona 1 g', dose:'1 g (2 mL)', via:'EV', obs:'De 6/6 h, se dor ou temperatura ≥ 37,8 °C.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia, profilaxia de TEV. Ajustar se ClCr < 30 (20 mg). Contraindicada se sangramento ativo ou plaquetas < 50.000.' },
    { med:'Controles', dose:'SSVV e SpO2 de 6/6 h', via:'—', obs:'Balanço hídrico. Glicemia capilar de 12/12 h se diabético.' }
  ],
  cuidados:['Cabeceira elevada a 30°.', 'Deambular assim que possível.', 'Reavaliar em 48–72 h: sem melhora, rever o ATB e pedir imagem.', 'Hemocultura 2 amostras e escarro antes da 1ª dose se ainda não colhidos.'] },

{ id:'i-dpoc', grupo:'Respiratório', nome:'Exacerbação de DPOC', sub:'Internado por dispneia e hipoxemia', conduta:'resp/dpoc-exacerbacao',
  itens:[
    { med:'Dieta', dose:'geral, hipercalórica fracionada', via:'VO', obs:'' },
    { med:'Oxigênio', dose:'cateter nasal 1–2 L/min ou Venturi 24–28%', via:'INAL', obs:'Alvo de SpO2 88–92%. Não hiperoxigenar.' },
    { med:'Salbutamol 100 mcg/jato', dose:'4 jatos com espaçador ou 10 gotas em NBZ', via:'INAL', obs:'De 4/4 h nas primeiras 24 h, depois 6/6 h. Nebulizar com SF 3 mL, ar comprimido se retentor.' },
    { med:'Ipratrópio 0,25 mg/mL', dose:'40 gotas', via:'INAL', obs:'Junto com o salbutamol, de 6/6 h.' },
    { med:'Prednisona 20 mg', dose:'40 mg (2 comprimidos)', via:'VO', obs:'1x/dia pela manhã, por 5 dias. Se não tolerar VO: hidrocortisona 100 mg EV 8/8 h.' },
    { med:'Amoxicilina + clavulanato 875/125 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h, por 5–7 dias. Indicada se escarro purulento ou VNI. Alternativa: azitromicina 500 mg 1x/dia 5 dias.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia, profilaxia de TEV.' },
    { med:'Omeprazol 40 mg', dose:'40 mg', via:'VO', obs:'1x/dia enquanto usar corticoide, se história de úlcera ou uso de AINE/anticoagulante.' },
    { med:'Controles', dose:'SSVV e SpO2 de 4/4 h', via:'—', obs:'Gasometria arterial se sonolência ou SpO2 caindo. Glicemia capilar de 6/6 h (corticoide).' }
  ],
  cuidados:['Cabeceira elevada.', 'VNI (BiPAP) se pH < 7,35 com pCO2 > 45 ou fadiga — chamar a equipe.', 'Manter os inalatórios de uso contínuo do paciente.', 'Fisioterapia respiratória.'] },

{ id:'i-asma', grupo:'Respiratório', nome:'Crise de asma internada', sub:'Sem resposta completa na sala de emergência', conduta:'resp/asma-crise',
  itens:[
    { med:'Dieta', dose:'geral', via:'VO', obs:'' },
    { med:'Oxigênio', dose:'cateter nasal 1–3 L/min', via:'INAL', obs:'Alvo de SpO2 93–95%.' },
    { med:'Salbutamol 100 mcg/jato', dose:'4–8 jatos com espaçador', via:'INAL', obs:'De 4/4 h; espaçar conforme melhora. Ou 10–20 gotas em NBZ.' },
    { med:'Ipratrópio 0,25 mg/mL', dose:'40 gotas', via:'INAL', obs:'De 6/6 h nas primeiras 24 h.' },
    { med:'Prednisona 20 mg', dose:'40–60 mg', via:'VO', obs:'1x/dia pela manhã, por 5–7 dias. Sem desmame.' },
    { med:'Sulfato de magnésio 10%', dose:'20 mL (2 g) + SF 0,9% 100 mL', via:'EV', obs:'Dose única em 20 min, se crise grave sem resposta na 1ª hora.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia se restrito ao leito.' },
    { med:'Controles', dose:'SSVV, SpO2 e pico de fluxo de 4/4 h', via:'—', obs:'Glicemia capilar de 12/12 h.' }
  ],
  cuidados:['Iniciar ou retomar o corticoide inalatório antes da alta.', 'Sem sedativo.', 'Reavaliar a técnica inalatória e o plano de ação escrito.'] },

{ id:'i-ic', grupo:'Cardiovascular', nome:'IC descompensada — perfil quente e úmido', sub:'Congestão sem hipoperfusão', conduta:'cardio/eap-ic-descompensada',
  itens:[
    { med:'Dieta', dose:'hipossódica, sem excesso de sal', via:'VO', obs:'Restrição hídrica só se houver hiponatremia.' },
    { med:'Furosemida 10 mg/mL', dose:'20–40 mg (2–4 mL) sem uso prévio', via:'EV', obs:'De 12/12 h. Se já usa: 1,5–2x a dose oral diária, EV. Reavaliar em 2–4 h: diurese < 100–150 mL/h ou Na urinário < 50–70 → dobrar.' },
    { med:'Cloreto de potássio 6% xarope', dose:'10 mL', via:'VO', obs:'De 8/8 h se K < 4,0. Dosar K e Mg diariamente.' },
    { med:'Oxigênio', dose:'cateter nasal 2 L/min', via:'INAL', obs:'Se SpO2 < 90%.' },
    { med:'Manter', dose:'IECA/BRA, betabloqueador e espironolactona da casa', via:'VO', obs:'Não suspender o betabloqueador se não houver hipotensão ou choque. Reduzir a dose se PAS < 90.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia, profilaxia de TEV.' },
    { med:'Controles', dose:'SSVV de 6/6 h, balanço hídrico rigoroso', via:'—', obs:'Peso em jejum diariamente. Ureia, creatinina, Na e K diários.' }
  ],
  cuidados:['Cabeceira elevada a 45°.', 'Meta: perda de 0,5–1 kg/dia.', 'Procurar o gatilho: infecção, isquemia, arritmia, adesão, AINE.', 'Não usar AINE.'] },

{ id:'i-tev', grupo:'Cardiovascular', nome:'TEP ou TVP — anticoagulação plena', sub:'Estável, sem indicação de trombólise', conduta:'cardio/tep',
  itens:[
    { med:'Dieta', dose:'geral', via:'VO', obs:'' },
    { med:'Enoxaparina 1 mg/kg', dose:'___ mg (1 mg/kg)', via:'SC', obs:'De 12/12 h. ClCr < 30: 1 mg/kg 1x/dia. Peso > 120 kg ou gestante: discutir.' },
    { med:'Rivaroxabana 15 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 21 dias, depois 20 mg 1x/dia — alternativa à enoxaparina se não houver contraindicação (ClCr < 15, gestação, câncer ativo).' },
    { med:'Oxigênio', dose:'cateter nasal 1–3 L/min', via:'INAL', obs:'Se SpO2 < 92%.' },
    { med:'Dipirona 1 g', dose:'1 g', via:'EV', obs:'De 6/6 h se dor.' },
    { med:'Controles', dose:'SSVV de 6/6 h', via:'—', obs:'Hemoglobina e plaquetas em 48 h e a cada 3 dias (trombocitopenia por heparina). Creatinina.' }
  ],
  cuidados:['Deambulação livre assim que anticoagulado.', 'Não fazer punção arterial ou IM sem necessidade.', 'Vigiar sangramento: gengiva, urina, fezes, queda de Hb.', 'Definir a duração (3 meses no mínimo) antes da alta.'] },

{ id:'i-avc', grupo:'Neurológico', nome:'AVC isquêmico — fora da janela de trombólise', sub:'Enfermaria ou unidade de AVC', conduta:'neuro/avc-isquemico',
  itens:[
    { med:'Dieta', dose:'jejum até teste de deglutição', via:'VO', obs:'Liberar consistência conforme a fonoaudiologia. SNE se disfagia após 24–48 h.' },
    { med:'SF 0,9%', dose:'1000 mL', via:'EV', obs:'Em 24 h (~40 mL/h). Sem soro glicosado.' },
    { med:'AAS 100 mg', dose:'300 mg no 1º dia, depois 100 mg', via:'VO/SNE', obs:'1x/dia. Só após TC sem sangramento. Se trombolisado, iniciar após 24 h.' },
    { med:'Atorvastatina 40 mg', dose:'80 mg', via:'VO/SNE', obs:'1x/dia à noite.' },
    { med:'Anti-hipertensivo', dose:'só se PA > 220/120', via:'—', obs:'Sem trombólise, tolerar hipertensão nas primeiras 24 h. Retomar os anti-hipertensivos da casa após 24–48 h se estável.' },
    { med:'Insulina regular', dose:'esquema conforme glicemia capilar', via:'SC', obs:'Alvo 140–180 mg/dL. Glicemia capilar de 6/6 h.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia, profilaxia de TEV, a partir do 2º dia (24 h após trombólise).' },
    { med:'Controles', dose:'SSVV e escala neurológica (NIHSS/Glasgow) de 4/4 h nas primeiras 24 h', via:'—', obs:'Temperatura: tratar febre com dipirona. SpO2 alvo > 94%.' }
  ],
  cuidados:['Cabeceira a 30°.', 'Mudança de decúbito de 2/2 h.', 'Sem sonda vesical de rotina.', 'Fisioterapia e fonoaudiologia desde o 1º dia.', 'Investigar a causa: ECG, ecocardiograma, doppler de carótidas.'] },

{ id:'i-abstinencia', grupo:'Neurológico', nome:'Síndrome de abstinência alcoólica', sub:'Tremor, sudorese e agitação — sem delirium tremens', conduta:'psiq/abstinencia-alcool',
  itens:[
    { med:'Dieta', dose:'geral', via:'VO', obs:'' },
    { med:'Tiamina 100 mg/mL', dose:'300 mg (3 mL)', via:'IM ou EV', obs:'1x/dia por 3–5 dias. SEMPRE antes de qualquer glicose.' },
    { med:'SF 0,9%', dose:'1000 mL', via:'EV', obs:'Em 12 h se desidratado. Repor K e Mg conforme exames.' },
    { med:'Diazepam 10 mg', dose:'10 mg', via:'VO', obs:'De 6/6 h nas primeiras 24 h, depois reduzir 25%/dia. Resgate: 10 mg VO de 1/1 h se CIWA-Ar ≥ 10.' },
    { med:'Ácido fólico 5 mg', dose:'5 mg', via:'VO', obs:'1x/dia.' },
    { med:'Haloperidol 5 mg/mL', dose:'5 mg (1 mL)', via:'IM', obs:'Só se agitação com alucinação apesar do benzodiazepínico. Não substitui o diazepam.' },
    { med:'Controles', dose:'SSVV e CIWA-Ar de 4/4 h', via:'—', obs:'Glicemia capilar de 6/6 h.' }
  ],
  cuidados:['Ambiente calmo e iluminado, sem contenção se possível.', 'Convulsão ou alucinação = delirium tremens iminente: avisar a equipe.', 'Sem glicose antes da tiamina.'] },

{ id:'i-pielo', grupo:'Infeccioso', nome:'Pielonefrite aguda', sub:'Internada por vômito, febre alta ou sepse leve', conduta:'infecto/itu',
  itens:[
    { med:'Dieta', dose:'geral', via:'VO', obs:'' },
    { med:'SF 0,9%', dose:'1000 mL', via:'EV', obs:'Em 8 h, depois manutenção conforme aceitação oral.' },
    { med:'Ceftriaxona 1 g', dose:'1 g', via:'EV', obs:'1x/dia (2 g se sepse). 7–10 dias, trocando para VO conforme cultura após 48 h afebril.' },
    { med:'Dipirona 1 g', dose:'1 g', via:'EV', obs:'De 6/6 h se dor ou febre.' },
    { med:'Ondansetrona 4 mg', dose:'4–8 mg', via:'EV', obs:'De 8/8 h se náusea.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia se restrito ao leito.' },
    { med:'Controles', dose:'SSVV de 6/6 h', via:'—', obs:'Diurese. Creatinina em 48 h.' }
  ],
  cuidados:['Urocultura e hemocultura antes da 1ª dose.', 'Febre após 72 h de ATB: USG ou TC para afastar abscesso ou obstrução.', 'Sonda vesical só se retenção.'] },

{ id:'i-celulite', grupo:'Infeccioso', nome:'Celulite ou erisipela', sub:'Internada por extensão, febre ou falha da VO', conduta:'infecto/celulite-erisipela',
  itens:[
    { med:'Dieta', dose:'geral', via:'VO', obs:'' },
    { med:'Cefazolina 1 g', dose:'2 g', via:'EV', obs:'De 8/8 h, diluído em 100 mL de SF. Alternativa: oxacilina 2 g EV 4/4 h. 7–10 dias, VO após melhora (cefalexina 500 mg 6/6 h).' },
    { med:'Dipirona 1 g', dose:'1 g', via:'EV', obs:'De 6/6 h se dor ou febre.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia.' },
    { med:'Controles', dose:'SSVV de 6/6 h', via:'—', obs:'Marcar a borda do eritema com caneta e a data.' }
  ],
  cuidados:['Membro elevado.', 'Tratar a porta de entrada (micose interdigital, ferida).', 'Dor desproporcional, bolha violácea ou crepitação = fasciíte: cirurgia agora.'] },

{ id:'i-aspirativa', grupo:'Infeccioso', nome:'Pneumonia aspirativa', sub:'Idoso, disfagia ou rebaixamento', conduta:'resp/pneumonia-comunidade',
  itens:[
    { med:'Dieta', dose:'jejum até avaliação da deglutição', via:'—', obs:'SNE se disfagia; dieta pastosa e espessada se liberado.' },
    { med:'SF 0,9%', dose:'1000 mL', via:'EV', obs:'Em 12 h.' },
    { med:'Ceftriaxona 1 g', dose:'1 g', via:'EV', obs:'1x/dia, 7 dias.' },
    { med:'Clindamicina 600 mg', dose:'600 mg', via:'EV', obs:'De 8/8 h. Alternativa única: amoxicilina + clavulanato 1 g EV 8/8 h (ou ampicilina-sulbactam 3 g 6/6 h).' },
    { med:'Oxigênio', dose:'cateter nasal 1–3 L/min', via:'INAL', obs:'Se SpO2 < 92%.' },
    { med:'Dipirona 1 g', dose:'1 g', via:'EV', obs:'De 6/6 h se dor ou febre.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia.' },
    { med:'Controles', dose:'SSVV e SpO2 de 6/6 h', via:'—', obs:'' }
  ],
  cuidados:['Cabeceira a 30–45° permanente.', 'Higiene oral 3x/dia.', 'Fonoaudiologia.', 'Aspirar vias aéreas se necessário.'] },

{ id:'i-gastro', grupo:'Gastro', nome:'Gastroenterite com desidratação', sub:'Vômito incoercível ou desidratação moderada', conduta:'gastro/diarreia-aguda',
  itens:[
    { med:'Dieta', dose:'líquida a leve, conforme aceitação', via:'VO', obs:'Reintroduzir cedo. Sem restrição de lactose se tolerar.' },
    { med:'Ringer lactato', dose:'1000 mL', via:'EV', obs:'Em 1 h (bolus de 20–30 mL/kg se hipotenso), depois SF 0,9% 1000 mL de 8/8 h.' },
    { med:'Ondansetrona 4 mg', dose:'8 mg', via:'EV', obs:'De 8/8 h se náusea ou vômito.' },
    { med:'Dipirona 1 g', dose:'1 g', via:'EV', obs:'De 6/6 h se dor ou febre.' },
    { med:'Cloreto de potássio 19,1%', dose:'10 mL em SF 0,9% 500 mL', via:'EV', obs:'Em 4 h, se K < 3,5. Ou xarope de KCl 6% 10 mL VO 8/8 h se tolerar.' },
    { med:'Controles', dose:'SSVV de 6/6 h', via:'—', obs:'Balanço hídrico, diurese. Na, K e creatinina em 24 h.' }
  ],
  cuidados:['Sem antidiarreico se febre ou sangue nas fezes.', 'Antibiótico só se disenteria, imunossuprimido ou sepse (ciprofloxacino 500 mg 12/12 h 3 dias).', 'Isolamento de contato.', 'Coprocultura se sangue ou febre alta.'] },

{ id:'i-pancreatite', grupo:'Gastro', nome:'Pancreatite aguda leve', sub:'Sem falência orgânica', conduta:'gastro/pancreatite',
  itens:[
    { med:'Dieta', dose:'jejum nas primeiras 24 h', via:'—', obs:'Liberar dieta leve com pouca gordura assim que a dor e a náusea permitirem, em geral em 24–48 h.' },
    { med:'Ringer lactato', dose:'1000 mL', via:'EV', obs:'Em 2 h (5–10 mL/kg/h nas primeiras 4 h), depois 1000 mL de 8/8 h. Reavaliar volemia de 6/6 h — não hiper-hidratar.' },
    { med:'Dipirona 1 g', dose:'1 g', via:'EV', obs:'De 6/6 h.' },
    { med:'Tramadol 100 mg', dose:'100 mg + SF 100 mL', via:'EV', obs:'De 8/8 h se dor. Morfina 2–4 mg EV se refratária.' },
    { med:'Ondansetrona 4 mg', dose:'8 mg', via:'EV', obs:'De 8/8 h.' },
    { med:'Enoxaparina 40 mg', dose:'40 mg', via:'SC', obs:'1x/dia.' },
    { med:'Controles', dose:'SSVV de 6/6 h, balanço hídrico', via:'—', obs:'Hematócrito, ureia e cálcio em 24 h. Glicemia capilar de 6/6 h.' }
  ],
  cuidados:['Sem antibiótico profilático.', 'USG de abdome para litíase: se biliar, colecistectomia na mesma internação.', 'Sem álcool.', 'Piora, febre ou falência de órgão após 48 h: TC com contraste.'] },

{ id:'i-hda', grupo:'Gastro', nome:'Hemorragia digestiva alta — estável', sub:'Não varicosa, sem instabilidade', conduta:'gastro/hda',
  itens:[
    { med:'Dieta', dose:'jejum até a endoscopia', via:'—', obs:'Liberar dieta líquida 6 h após EDA sem sangramento ativo.' },
    { med:'SF 0,9%', dose:'1000 mL', via:'EV', obs:'Em 8 h. Dois acessos calibrosos.' },
    { med:'Omeprazol 40 mg', dose:'80 mg em bolus, depois 40 mg', via:'EV', obs:'De 12/12 h até a endoscopia. Se úlcera de alto risco: 8 mg/h em BIC por 72 h.' },
    { med:'Ondansetrona 4 mg', dose:'8 mg', via:'EV', obs:'De 8/8 h se náusea.' },
    { med:'Concentrado de hemácias', dose:'1 unidade', via:'EV', obs:'Se Hb < 7 g/dL (< 8 se coronariopata). Tipagem e reserva de 2 unidades.' },
    { med:'Controles', dose:'SSVV de 4/4 h', via:'—', obs:'Hemoglobina de 6/6 h nas primeiras 24 h. Observar hematêmese, melena, síncope.' }
  ],
  cuidados:['Suspender AINE, AAS e anticoagulante — discutir a retomada do AAS após a EDA.', 'Cirrótico: ceftriaxona 1 g EV 1x/dia e terlipressina — fluxo de varizes.', 'EDA nas primeiras 24 h.', 'Sem sonda nasogástrica de rotina.'] },

{ id:'i-colica', grupo:'Nefro e urológico', nome:'Cólica renal com dor refratária', sub:'Internada por dor persistente ou vômito', conduta:'nefro/colica-renal',
  itens:[
    { med:'Dieta', dose:'geral', via:'VO', obs:'Sem hiper-hidratação forçada.' },
    { med:'SF 0,9%', dose:'500 mL', via:'EV', obs:'Em 4 h, só para manter a via e repor perdas.' },
    { med:'Cetorolaco 30 mg/mL', dose:'30 mg (1 mL)', via:'EV', obs:'De 8/8 h por no máximo 3 dias, se creatinina normal e sem úlcera.' },
    { med:'Dipirona 1 g', dose:'1 g', via:'EV', obs:'De 6/6 h.' },
    { med:'Tramadol 100 mg', dose:'100 mg + SF 100 mL', via:'EV', obs:'De 8/8 h se dor refratária. Morfina 2–4 mg EV como resgate.' },
    { med:'Tansulosina 0,4 mg', dose:'0,4 mg', via:'VO', obs:'1x/dia à noite, por até 4 semanas (cálculo distal 5–10 mm).' },
    { med:'Ondansetrona 4 mg', dose:'8 mg', via:'EV', obs:'De 8/8 h se náusea.' },
    { med:'Controles', dose:'SSVV de 6/6 h, diurese', via:'—', obs:'Filtrar toda a urina. Creatinina em 24 h.' }
  ],
  cuidados:['Febre + obstrução = urgência urológica (nefrostomia/duplo J).', 'Cálculo > 10 mm, rim único ou dor refratária após 24 h: urologia.', 'Deambulação livre.'] },

{ id:'i-dm', grupo:'Metabólico', nome:'Diabetes descompensado — sem cetoacidose', sub:'Hiperglicemia em enfermaria', conduta:'endocrino/cetoacidose',
  itens:[
    { med:'Dieta', dose:'para diabético, fracionada em 6 refeições', via:'VO', obs:'' },
    { med:'Insulina NPH', dose:'0,2–0,3 UI/kg/dia (___ UI)', via:'SC', obs:'2/3 pela manhã e 1/3 ao deitar. Se já usava, manter 80% da dose habitual.' },
    { med:'Insulina regular — correção', dose:'conforme glicemia capilar pré-refeição', via:'SC', obs:'150–200: 2 UI · 201–250: 4 UI · 251–300: 6 UI · 301–350: 8 UI · > 350: 10 UI e avisar. Não corrigir ao deitar.' },
    { med:'Glicemia capilar', dose:'antes das refeições e às 22 h', via:'—', obs:'Alvo 140–180 mg/dL. Hipoglicemia < 70: 20 mL de glicose 50% EV ou 15 g de açúcar VO e avisar.' },
    { med:'Metformina', dose:'suspender', via:'—', obs:'Enquanto internado, com contraste ou creatinina alterada.' },
    { med:'SF 0,9%', dose:'1000 mL', via:'EV', obs:'Em 12 h se desidratado.' },
    { med:'Controles', dose:'SSVV de 6/6 h', via:'—', obs:'Na, K, creatinina e gasometria venosa se glicemia > 300 ou cetonúria.' }
  ],
  cuidados:['Cetonúria ou pH < 7,3 = cetoacidose: protocolo próprio.', 'Procurar o gatilho: infecção, corticoide, abandono.', 'Ajustar a NPH em 10–20% por dia conforme o perfil glicêmico.'] },

{ id:'i-has', grupo:'Cardiovascular', nome:'Urgência hipertensiva internada', sub:'PA muito elevada sem lesão de órgão-alvo', conduta:'cardio/crise-hipertensiva',
  itens:[
    { med:'Dieta', dose:'hipossódica', via:'VO', obs:'' },
    { med:'Captopril 25 mg', dose:'25 mg', via:'VO', obs:'Se PA > 180/110, pode repetir em 1 h. Meta: reduzir 20–25% em 24 h, não normalizar.' },
    { med:'Anti-hipertensivos da casa', dose:'retomar todos', via:'VO', obs:'Ajustar as doses conforme a resposta.' },
    { med:'Clonidina 0,1 mg', dose:'0,1 mg', via:'VO', obs:'De 8/8 h se refratário. Não suspender abruptamente.' },
    { med:'Dipirona 1 g', dose:'1 g', via:'VO', obs:'De 6/6 h se cefaleia.' },
    { med:'Controles', dose:'PA de 4/4 h', via:'—', obs:'Avisar se PAS > 200, PAD > 120 ou sintoma novo (dor torácica, dispneia, déficit).' }
  ],
  cuidados:['Sem nifedipino sublingual.', 'Dor torácica, dispneia, déficit ou creatinina subindo = emergência hipertensiva: nitroprussiato em UTI.', 'Investigar adesão e uso de AINE, descongestionante, cocaína.'] },

{ id:'i-delirium', grupo:'Neurológico', nome:'Delirium em idoso internado', sub:'Agitação ou confusão aguda', conduta:'psiq/agitacao-psicomotora',
  itens:[
    { med:'Dieta', dose:'geral, assistida', via:'VO', obs:'Hidratação oral estimulada.' },
    { med:'Haloperidol 2 mg/mL gotas', dose:'0,5–1 mg (5–10 gotas)', via:'VO', obs:'Até 2x/dia se agitação que ponha em risco. Máximo 3 mg/dia no idoso. Sem benzodiazepínico, exceto abstinência.' },
    { med:'Haloperidol 5 mg/mL', dose:'2,5 mg (0,5 mL)', via:'IM', obs:'Só se risco imediato e recusa VO. ECG antes: QT longo contraindica.' },
    { med:'Suspender', dose:'anticolinérgicos, benzodiazepínicos, opioides em excesso', via:'—', obs:'Revisar toda a prescrição.' },
    { med:'Controles', dose:'SSVV de 6/6 h, CAM de 12/12 h', via:'—', obs:'Glicemia capilar. Diurese e evacuação diárias.' }
  ],
  cuidados:['Procurar a causa: infecção, dor, retenção urinária, fecaloma, hiponatremia, hipóxia, medicação.', 'Óculos, aparelho auditivo, relógio e luz do dia; família presente.', 'Sem contenção física de rotina; sem sonda vesical.', 'Mobilizar no dia.'] }
];

/* ===========================================================
   DOCUMENTAL — Prontuário: passagem de plantão, regulação,
   declaração de óbito e notificação compulsória.
   Só conteúdo; o motor está em ferramentas.js.
   =========================================================== */

/* I-PASS: gravidade do paciente na passagem */
const FERR_DOC_GRAV = [
  ['instavel', 'Instável', 'Precisa de reavaliação ativa e plano imediato'],
  ['observar', 'Observar de perto', 'Pode piorar; tem gatilho definido para agir'],
  ['estavel',  'Estável', 'Sem previsão de intercorrência']
];

/* recurso pedido à central de regulação */
const FERR_DOC_RECURSO = ['Leito de UTI', 'Hemodinâmica', 'Neurocirurgia', 'Cirurgia geral / trauma', 'Cirurgia vascular ou cardíaca',
  'Obstetrícia de alto risco', 'UTI pediátrica / neonatal', 'Exame de imagem (TC/RM)', 'Enfermaria clínica', 'Outro'];

/* checklist de transporte seguro */
const FERR_DOC_TRANSPORTE = [
  'Estabilizado para o transporte (via aérea, ventilação, pressão) — ou o risco está documentado',
  'Dois acessos venosos pérvios e bem fixados',
  'Via aérea definitiva se há risco de perdê-la no caminho',
  'Monitor, oxímetro, desfibrilador e oxigênio para o trajeto, com sobra',
  'Drogas em bomba com volume para o trajeto; sedação e analgesia garantidas',
  'Tubo, sondas, drenos e cateteres fixados; drenos abertos ou em selo',
  'Contato médico a médico feito e vaga confirmada pela regulação',
  'Relatório, exames e imagens acompanham o paciente',
  'Família informada; consentimento registrado',
  'Equipe e ambulância adequadas ao risco (suporte avançado com médico se instável)'
];

/* declaração de óbito: termos que descrevem o modo de morrer, não a causa */
const FERR_DOC_MODOS = [
  ['parada cardiorrespiratoria', 'Parada cardiorrespiratória'], ['parada cardiaca', 'Parada cardíaca'], ['pcr', 'PCR'],
  ['falencia de multiplos orgaos', 'Falência de múltiplos órgãos'], ['falencia multipla', 'Falência múltipla de órgãos'],
  ['insuficiencia respiratoria', 'Insuficiência respiratória (sem a causa)'], ['insuficiencia cardiaca', 'Insuficiência cardíaca (sem a causa)'],
  ['choque', 'Choque (sem o tipo e a causa)'], ['assistolia', 'Assistolia'], ['fibrilacao ventricular', 'Fibrilação ventricular'],
  ['morte natural', 'Morte natural'], ['senilidade', 'Senilidade'], ['velhice', 'Velhice'], ['causa desconhecida', 'Causa desconhecida'],
  ['falencia', 'Falência de órgão (sem a causa)']
];

const FERR_DOC_OBITO = {
  quem: [
    { t:'Morte natural *com* assistência médica', c:'ok',
      x:'Quem preenche é o médico que vinha assistindo. No hospital, o assistente — ou, na falta dele, o plantonista que constatou o óbito.' },
    { t:'Morte natural *sem* assistência médica', c:'atencao',
      x:'Onde houver Serviço de Verificação de Óbito (SVO), encaminhar ao SVO. Sem SVO: o médico do serviço público de saúde mais próximo, ou, na falta, qualquer médico da localidade — com a causa provável pela história; se não houver como definir, registrar que foi morte sem assistência médica.' },
    { t:'Morte violenta ou suspeita', c:'grave',
      x:'Acidente, agressão, suicídio, intoxicação, queda, afogamento — ou qualquer suspeita: *IML, sempre*, mesmo que a morte venha dias depois por uma complicação (a fratura do idoso que morre de pneumonia continua sendo morte por causa externa). O plantonista *não* preenche a DO; registra o atendimento e aciona a autoridade policial.' },
    { t:'Óbito fetal', c:'info',
      x:'DO obrigatória quando a gestação tem *20 semanas ou mais*, ou o feto pesa *500 g ou mais*, ou mede *25 cm ou mais*. Quem preenche é o médico que assistiu a mãe. Abaixo disso a DO não é obrigatória.' },
    { t:'Nascido vivo que morreu', c:'info',
      x:'Qualquer idade gestacional ou peso: se houve qualquer sinal de vida ao nascer, faz-se a Declaração de Nascido Vivo *e* a DO.' }
  ],
  parte1: [
    'Uma causa por linha. De cima para baixo, cada linha é *consequência* da linha de baixo ("devido a ou como consequência de").',
    'Linha a: a causa que levou diretamente à morte. A *última linha preenchida é a causa básica* — a doença ou lesão que iniciou a cadeia. É ela que entra na estatística.',
    'Nem sempre é preciso usar as quatro linhas: se a causa básica explica tudo sozinha, ela fica na linha a.',
    'Ao lado de cada causa, o *intervalo aproximado* entre o início da condição e a morte (minutos, horas, dias, anos).',
    'Escreva por extenso e sem siglas: "infarto agudo do miocárdio", não "IAM"; "acidente vascular cerebral isquêmico", não "AVC".',
    'Seja específico: tipo e local do câncer, agente da pneumonia se conhecido, tipo do choque e a causa dele.'
  ],
  parte2: [
    'Outras condições significativas que *contribuíram* para a morte, mas não fazem parte da cadeia da Parte I (ex.: diabetes, DPOC, obesidade).',
    'Não repetir aqui o que já está na Parte I.'
  ],
  exemplo: [
    ['a', 'Edema agudo de pulmão', 'horas'],
    ['b', 'Infarto agudo do miocárdio', '2 dias'],
    ['c', 'Hipertensão arterial sistêmica', '15 anos'],
    ['II', 'Diabetes mellitus tipo 2', '10 anos']
  ],
  regras: [
    'Constatar o óbito pessoalmente antes de preencher. Nunca assinar DO em branco nem cobrar por ela.',
    'Hora do óbito e local exatos; letra legível e todos os campos — "ignorado" só quando de fato não se sabe.',
    'Mulher em idade fértil: responder se o óbito ocorreu na gravidez, no parto, no aborto, até 42 dias ou até 1 ano após — é o que permite achar a morte materna.',
    'Causa externa (só quando for o médico legista ou o perito que preenche): tipo, acidente de trabalho, local e descrição.',
    'Vias: 1ª (branca) para a Secretaria de Saúde; 2ª (amarela) para a família levar ao cartório; 3ª (rosa) fica no serviço. Confira o fluxo local.'
  ],
  fonte: 'Resolução CFM nº 1.779/2005 · Ministério da Saúde — Declaração de Óbito: manual de instruções para preenchimento'
};

/* Lista Nacional de Notificação Compulsória — Anexo 1 do Anexo V da
   Portaria de Consolidação GM/MS nº 4/2017, na redação da Portaria GM/MS
   nº 11.211, de 13/05/2026 (DOU 14/05/2026).
   per: 'ms' imediata MS+SES+SMS · 'ses' imediata SES+SMS · 'sms' imediata SMS · 'sem' semanal */
const FERR_DOC_NOTIF = {
  portaria: 'Portaria GM/MS nº 11.211, de 13 de maio de 2026 (DOU de 14/05/2026), que dá a redação atual do Anexo 1 do Anexo V da Portaria de Consolidação GM/MS nº 4/2017',
  itens: [
    ['Acidente de trabalho', 'sms'],
    ['Acidente de trabalho com exposição a material biológico', 'sem'],
    ['Acidente por animal peçonhento', 'sms'],
    ['Acidente por animal potencialmente transmissor da raiva (atendimento antirrábico)', 'sms'],
    ['Anomalias congênitas', 'sem'],
    ['Botulismo', 'ms'],
    ['Câncer relacionado ao trabalho', 'sem'],
    ['Cólera', 'ms'],
    ['Coqueluche', 'ses'],
    ['Dengue — casos', 'sem'],
    ['Dengue — óbitos', 'ms'],
    ['Dermatoses ocupacionais', 'sem'],
    ['Difteria', 'ms'],
    ['Distúrbio de voz relacionado ao trabalho', 'sem'],
    ['Doença de Chagas aguda', 'ses'],
    ['Doença de Chagas crônica', 'sem'],
    ['Doença de Creutzfeldt-Jakob', 'sem'],
    ['Doença falciforme', 'sem'],
    ['Doença invasiva por Haemophilus influenzae', 'ses'],
    ['Doença meningocócica e outras meningites', 'ses'],
    ['Doenças com suspeita de disseminação intencional (antraz pneumônico, tularemia, varíola)', 'ms'],
    ['Doenças febris hemorrágicas emergentes (arenavírus, Ebola, Marburg, Lassa, febre purpúrica brasileira)', 'ms'],
    ['Zika — doença aguda', 'sem'],
    ['Zika — doença aguda em gestante', 'ses'],
    ['Zika — óbito com suspeita', 'ms'],
    ['Síndrome congênita associada ao vírus Zika', 'sem'],
    ['Esporotricose humana', 'sem'],
    ['Esquistossomose', 'sem'],
    ['Evento de saúde pública que se constitua ameaça à saúde pública', 'ms'],
    ['Evento supostamente atribuível à vacinação ou imunização (ESAVI)', 'ms'],
    ['Febre amarela', 'ms'],
    ['Chikungunya — casos', 'sem'],
    ['Chikungunya em área sem transmissão', 'ms'],
    ['Chikungunya — óbito com suspeita', 'ms'],
    ['Febre do Nilo Ocidental e outras arboviroses de importância em saúde pública', 'ms'],
    ['Febre do Oropouche — casos', 'sem'],
    ['Febre do Oropouche — óbitos e óbitos fetais', 'ms'],
    ['Febre do Oropouche em gestante', 'ms'],
    ['Febre do Oropouche — anomalias congênitas', 'ms'],
    ['Febre maculosa e outras riquetsioses', 'ms'],
    ['Febre tifoide', 'ses'],
    ['Hanseníase', 'sem'],
    ['Hantavirose', 'ms'],
    ['Hepatites virais', 'sem'],
    ['Hepatite B em gestante, parturiente ou puérpera e criança exposta', 'sem'],
    ['HIV/aids', 'sem'],
    ['HIV em gestante, parturiente ou puérpera e criança exposta', 'sem'],
    ['Infecção pelo HIV', 'sem'],
    ['Infecção pelo HTLV (e em gestante, parturiente, puérpera e criança exposta)', 'sem'],
    ['Influenza humana por novo subtipo viral', 'ms'],
    ['Intoxicação exógena (substâncias químicas, agrotóxicos, gases tóxicos, metais pesados)', 'sem'],
    ['Leishmaniose tegumentar americana', 'sem'],
    ['Leishmaniose visceral', 'sem'],
    ['Leptospirose', 'sms'],
    ['LER/DORT', 'sem'],
    ['Malária na região amazônica', 'sem'],
    ['Malária fora da região amazônica', 'ms'],
    ['Mpox (monkeypox)', 'ms'],
    ['Óbito infantil e óbito materno', 'sem'],
    ['Parotidite (caxumba)', 'sem', 'O art. 2º da portaria diz imediata e o anexo diz semanal; o Ministério da Saúde confirmou semanal.'],
    ['Perda auditiva relacionada ao trabalho', 'sem'],
    ['Pneumoconioses relacionadas ao trabalho', 'sem'],
    ['Peste', 'ms'],
    ['Poliomielite / paralisia flácida aguda', 'ms'],
    ['Raiva humana', 'ms'],
    ['Síndrome da rubéola congênita', 'ms'],
    ['Sarampo e rubéola', 'ms'],
    ['Sífilis adquirida, congênita e em gestante', 'sem'],
    ['Síndrome inflamatória multissistêmica (SIM-A e SIM-P) associada à covid-19', 'ms'],
    ['SRAG hospitalizado ou óbito por SRAG (e SARS-CoV, MERS-CoV)', 'ms'],
    ['Síndrome gripal por covid-19 confirmada', 'ms'],
    ['Tétano acidental', 'ses'],
    ['Tétano neonatal', 'ms'],
    ['Toxoplasmose gestacional e congênita', 'sem'],
    ['Transtornos mentais relacionados ao trabalho', 'sem'],
    ['Tuberculose', 'sem'],
    ['Varicela', 'ses'],
    ['Violência doméstica e/ou outras violências', 'sem'],
    ['Violência sexual e tentativa de suicídio', 'sms']
  ],
  regras: [
    '*Suspeita já notifica* — não espere a confirmação laboratorial.',
    '*Imediata* (até 24 h): avise a vigilância epidemiológica pelo meio mais rápido (telefone, e-mail, CIEVS) e depois preencha a ficha.',
    '*Semanal*: ficha de notificação no sistema indicado (Sinan na maioria; SRAG no SIVEP-Gripe; síndrome gripal no e-SUS Notifica) — a vigilância do serviço orienta.',
    'É dever de todo profissional de saúde, em serviço público ou privado, e não depende da concordância do paciente.',
    '*Violência:* ficha de violência interpessoal/autoprovocada. Criança ou adolescente: comunicar também o Conselho Tutelar. Idoso: Conselho do Idoso ou Ministério Público. Mulher: a Lei nº 13.931/2019 manda comunicar a autoridade policial em até 24 h.',
    'Tentativa de suicídio e violência sexual são de notificação imediata ao município — junto com o acolhimento e a profilaxia.'
  ]
};
