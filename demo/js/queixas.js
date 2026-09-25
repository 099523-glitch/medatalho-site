/* ============================================================
   QUEIXAS — a porta de entrada de quem ainda nao tem diagnostico.
   Camada POR CIMA do guia por especialidade, nao substituta dela.

   Cada queixa usa o MESMO formato de `secoes` dos PROTOCOLOS
   (alerta / fluxo / lista / doses / naofazer / texto / dica),
   para reaproveitar bloco() e no() do app.js sem componente novo.

   Campos proprios da queixa:
     agora    -> bloco "Fazer agora", os primeiros minutos
     naopode  -> diagnosticos que nao podem passar, com a pista e o link
     condutas -> ids de PROTOCOLOS que aprofundam
     atalhos  -> ferramentas (calc / score / presc / atb) ja existentes
   ============================================================ */

const QUEIXAS = [

/* ---------------------------------------------------------- 01 */
{ id:'dispneia', nome:'Falta de ar', sub:'Dispneia aguda no adulto', icone:'pulmao',
  tags:['dispneia','falta de ar','cansaco','sufoco','respiratorio','hipoxemia','saturando mal'],
  fonte:'Suporte avançado de vida e diretrizes brasileiras de asma, DPOC, IC e TEP', revisao:'09/2026',
  agora:['Sentar o paciente, monitorizar (SpO2, PA, FC, FR) e pegar acesso venoso.',
    'Oxigênio se SpO2 < 90%, alvo 92–96% — ou 88–92% se DPOC/retentor conhecido. Saturar 100% não ajuda e no retentor piora o CO2.',
    'ECG de 12 derivações e glicemia capilar.',
    'Ausculta em 30 segundos: sibilo, estertor, murmúrio abolido ou tórax silencioso.',
    'Gasometria arterial se SpO2 < 92%, FR > 30 ou rebaixamento.',
    'Radiografia de tórax — e POCUS de pulmão à beira do leito se disponível.'],
  naopode:[
    {dx:'Pneumotórax hipertensivo', pista:'Murmúrio abolido unilateral + hipotensão + desvio de traqueia. É diagnóstico clínico: não espere o raio-X.', conduta:'pneumotorax'},
    {dx:'Tromboembolismo pulmonar', pista:'Dispneia súbita com pulmão limpo, taquicardia sem causa, dor pleurítica ou hipoxemia desproporcional.', conduta:'tep'},
    {dx:'Edema agudo de pulmão', pista:'Estertores em ambos os campos, ortopneia, hipertensão e piora deitado.', conduta:'eap-ic-descompensada'},
    {dx:'Anafilaxia', pista:'Início em minutos, urticária, angioedema, estridor ou hipotensão após exposição.', conduta:'anafilaxia'},
    {dx:'SCA que se apresenta como dispneia', pista:'Diabético, idoso e mulher podem não ter dor. ECG em todo mundo.', conduta:'sca-com-supra'},
    {dx:'Tamponamento cardíaco', pista:'Turgência jugular com pulmão limpo, hipofonese, pulso paradoxal.', conduta:'tamponamento'},
    {dx:'Asma grave ou quase fatal', pista:'Fala em palavras soltas, tórax silencioso, SpO2 < 92%, PaCO2 normal ou alta numa crise (sinal de cansaço).', conduta:'asma-crise'},
    {dx:'Acidose metabólica compensada', pista:'Taquipneia sem sofrimento respiratório — cetoacidose, sepse, intoxicação. É respiração de Kussmaul, não broncoespasmo.', conduta:'acido-base'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Fala em monossílabos, uso de musculatura acessória ou tórax silencioso.',
      'SpO2 < 90% em ar ambiente ou que não sobe com O2.',
      'FR > 30 ou < 8 · rebaixamento do nível de consciência · cianose.',
      'Hipotensão junto com a dispneia — pense em obstrutivo (TEP, pneumotórax, tamponamento).',
      'Estridor, sialorreia ou voz abafada — via aérea alta, chame ajuda antes de deitar o paciente.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Adulto com dispneia aguda', nota:'Sentado, monitor, O2 se SpO2 < 90%, acesso, ECG e glicemia antes de qualquer raciocínio'},
      {tipo:'decisao', rotulo:'Primeiro filtro', texto:'Está instável? Rebaixado, hipotenso, SpO2 < 90% apesar do O2 ou exaustão respiratória?', ramos:[
        {rotulo:'Rebaixado, vomitando, em choque ou exausto', cor:'perigo', texto:'*Intubar* — VNI aqui atrasa e aspira', nota:'Ressuscite antes da indução: volume, noradrenalina, pré-oxigenação', ir:'sequencia-rapida-intubacao'},
        {rotulo:'Instável mas acordado e colaborativo', cor:'perigo', texto:'*Chamar ajuda e preparar a via aérea*; VNI se houver indicação (ver adiante)', ir:'insuficiencia-respiratoria'},
        {rotulo:'Estável', cor:'ok', texto:'Seguir para a ausculta'}]},
      {tipo:'decisao', rotulo:'Ausculta', texto:'Qual é o padrão?', ramos:[
        {rotulo:'Sibilos', texto:'Asma · DPOC · IC ("asma cardíaca")', nota:'Broncodilatador + corticoide; no idoso com IC, pense em congestão antes de assumir broncoespasmo', ir:'asma-crise'},
        {rotulo:'Estertores', texto:'EAP · pneumonia', nota:'Bilateral e simétrico com ortopneia fala EAP; focal com febre fala pneumonia', ir:'eap-ic-descompensada'},
        {rotulo:'Abolido', cor:'perigo', texto:'Pneumotórax · derrame', nota:'Com hipotensão é hipertensivo: descompressão imediata no 4º–5º EIC na axilar média, sem raio-X', ir:'pneumotorax'},
        {rotulo:'Limpo', texto:'TEP · anemia · acidose · SCA · ansiedade', nota:'Pulmão limpo com hipoxemia é TEP até prova em contrário', ir:'tep'}]},
      {tipo:'passo', rotulo:'Sempre', texto:'Gasometria, raio-X de tórax e ECG fecham o triângulo', nota:'POCUS encurta o caminho: linhas B difusas no EAP, deslizamento ausente no pneumotórax, VD dilatado no TEP'},
      {tipo:'decisao', rotulo:'Suporte ventilatório', texto:'Precisa de VNI?', ramos:[
        {rotulo:'DPOC com pH ≤ 7,35 e PaCO2 > 45', texto:'*BiPAP* — indicação forte', nota:'Alvo de SpO2 88–92%', ir:'vni'},
        {rotulo:'Edema agudo de pulmão', texto:'*CPAP ou BiPAP* — indicação forte, junto com diurético e nitrato', ir:'vni'},
        {rotulo:'Hipoxemia sem CO2 alto (pneumonia, SDRA)', texto:'O2 ou cateter nasal de alto fluxo; VNI só como teste curto e vigiado', nota:'Sem benefício comprovado: não deixe a VNI atrasar a intubação'},
        {rotulo:'DPOC sem acidose ou asma leve', cor:'ok', texto:'Não precisa de VNI'}]},
      {tipo:'decisao', rotulo:'Reavaliação', texto:'Melhorou? (em 1–2 h na VNI; em 30–60 min no resto)', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Observação e plano de alta', nota:'Alta só com SpO2 estável em ar ambiente, deambulando e com causa esclarecida'},
        {rotulo:'NÃO', cor:'perigo', texto:'Escalone: intube quem falhou na VNI e interne', nota:'Reveja o diagnóstico: dispneia que não responde geralmente foi classificada errado', ir:'sequencia-rapida-intubacao'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'Alta · observação · enfermaria · UTI', nota:'Necessidade de O2 contínuo, VNI ou instabilidade define leito monitorizado'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* ECG, glicemia, gasometria arterial, raio-X de tórax.',
      '*Conforme a suspeita:* troponina e BNP/NT-proBNP, D-dímero (só se probabilidade não-alta), hemograma, função renal e eletrólitos, lactato.',
      'Gasometria não diagnostica nem exclui TEP: serve para ver pH, CO2 e acidose.',
      '*POCUS:* pulmão (linhas B, deslizamento), coração (função, VD, derrame), veia cava.',
      '*Angio-TC de tórax* se TEP é a hipótese principal e o paciente tolera o transporte.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não dar oxigênio em alto fluxo indiscriminadamente ao retentor de CO2 — a meta é 88–92%, não 100%.',
      'Não esperar o raio-X para descomprimir um pneumotórax hipertensivo.',
      'Não tratar como asma todo sibilo do idoso: IC descompensada sibila.',
      'Não usar VNI em rebaixamento, vômito, instabilidade hemodinâmica ou trauma de face — nem no DPOC sem acidose.',
      'Não insistir na VNI que não melhorou em 1–2 h: atrasar a intubação aumenta a mortalidade.',
      'Não pedir D-dímero em paciente de alta probabilidade para TEP — resultado negativo não exclui e atrasa a angio-TC.',
      'Não rotular como ansiedade antes de ter SpO2, ECG, glicemia e gasometria na mão.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'A cada 15 min enquanto instável; a cada 30–60 min depois.',
      'O que se olha: SpO2, FR, nível de consciência, esforço respiratório e resposta ao que foi feito.',
      'Na VNI: gasometria em 1–2 h — pH e PaCO2 têm de estar melhorando, e a FR caindo.',
      'Gasometria de controle também se houve hipercapnia ou piora clínica.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* necessidade de intubação ou VNI prolongada, instabilidade, acidose respiratória progressiva.',
      '*Enfermaria:* necessidade de O2 suplementar, causa que exige tratamento venoso, comorbidade descompensada.',
      '*Observação:* resposta parcial, precisa de reavaliação seriada.',
      '*Alta:* SpO2 estável em ar ambiente, deambula sem dessaturar, causa definida, retorno orientado por escrito.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Dispneia isolada em diabético, idoso ou mulher é equivalente anginoso — peça ECG.',
      'Saturação normal não exclui doença grave: TEP e acidose podem saturar bem.',
      'Taquipneia sem esforço é acidose metabólica compensando, não doença pulmonar.',
      'Obesidade e ansiedade são diagnósticos de exclusão no pronto-socorro, nunca de entrada.']}],
  condutas:['insuficiencia-respiratoria','asma-crise','dpoc-exacerbacao','eap-ic-descompensada','tep','pneumonia-comunidade','pneumotorax','anafilaxia','vni','derrame-pleural'],
  atalhos:[{tipo:'score',id:'curb65',rotulo:'CURB-65'},{tipo:'score',id:'wells-tep',rotulo:'Wells — TEP'},{tipo:'calc',id:'shock-index',rotulo:'Shock index'},{tipo:'atb',id:'respiratorio',rotulo:'ATB respiratório'}] },

/* ---------------------------------------------------------- 02 */
{ id:'dor-toracica-q', nome:'Dor no peito', sub:'Dor torácica aguda', icone:'coracao',
  tags:['dor toracica','dor no peito','precordialgia','aperto no peito','angina'],
  fonte:'Diretrizes brasileiras de SCA e de dor torácica na emergência', revisao:'09/2026',
  agora:['*ECG de 12 derivações em até 10 minutos* do primeiro contato — não da chegada.',
    'Monitorização, acesso venoso e desfibrilador ao alcance.',
    'PA nos dois braços.',
    'Troponina na chegada, com repetição conforme o algoritmo do serviço.',
    'AAS 300 mg mastigado se a suspeita é isquêmica e não há contraindicação.',
    'Se supra de ST: acione a reperfusão agora, sem esperar a troponina.'],
  naopode:[
    {dx:'Síndrome coronariana aguda', pista:'Aperto retroesternal, irradiação, sudorese, náusea. Repita o ECG se a dor persiste e o primeiro foi normal.', conduta:'sca-com-supra'},
    {dx:'Dissecção de aorta', pista:'Dor lancinante de início súbito e máxima já no começo, migratória, diferença de PA entre os braços, déficit de pulso.', conduta:'sindrome-aortica'},
    {dx:'Tromboembolismo pulmonar', pista:'Dor pleurítica, dispneia, taquicardia, fator de risco para trombose.', conduta:'tep'},
    {dx:'Pneumotórax hipertensivo', pista:'Dor súbita, murmúrio abolido, hipotensão, jugular túrgida.', conduta:'pneumotorax'},
    {dx:'Tamponamento cardíaco', pista:'Hipotensão, jugular túrgida, bulhas abafadas, pulso paradoxal.', conduta:'tamponamento'},
    {dx:'Ruptura de esôfago', pista:'Vômito intenso seguido de dor torácica e enfisema subcutâneo.', conduta:'ruptura-esofago'},
    {dx:'Miocardite', pista:'Jovem com virose recente, troponina alta e coronárias improváveis; arritmia ou IC sem explicação.', conduta:'pericardite-miocardite'},
    {dx:'Síndrome de Takotsubo', pista:'Mulher na pós-menopausa após estresse intenso, quadro de infarto e troponina modesta para a área acinética.', conduta:'takotsubo'},
    {dx:'Úlcera perfurada', pista:'Dor súbita no tórax e no abdome, abdome em tábua (pode faltar se retroperitoneal), ar sob a cúpula.', conduta:'abdome-agudo'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Supra de ST, BRE novo ou ritmo de marca-passo com clínica compatível.',
      'Hipotensão, síncope ou sudorese fria acompanhando a dor.',
      'Assimetria de pulso ou de PA entre os membros.',
      'Dor que começa no máximo de intensidade — pensa em aorta.',
      'Dor com hipoxemia e pulmão limpo — pensa em TEP.',
      'Idoso, diabético, renal crônico e mulher podem ter apresentação atípica ou silenciosa.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:FLUXO_DOR_TORACICA},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* ECG (repetir se a dor persiste ou muda), troponina seriada, raio-X de tórax.',
      '*Conforme a suspeita:* D-dímero (ADD-RS de 1 ponto ou Wells até 6), angio-TC de aorta ou de artérias pulmonares, ecocardiograma, BNP.',
      '*POCUS* em todo paciente instável: pericárdio, VD, deslizamento pleural, raiz da aorta.',
      'Gasometria arterial não ajuda a diagnosticar nem a excluir TEP.',
      '*ECG com V7–V9* se a dor é típica e o ECG padrão é normal — infarto de parede posterior se esconde ali.',
      '*V3R–V4R* em todo supra de parede inferior, antes de qualquer nitrato.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não dar nitrato antes de excluir infarto de ventrículo direito, e nunca com uso recente de inibidor de fosfodiesterase.',
      'Não dar alta com uma única troponina negativa em dor de início recente.',
      'Não usar a resposta ao antiácido ou ao nitrato como teste diagnóstico — não discrimina.',
      'Não anticoagular antes de considerar dissecção de aorta em dor lancinante de início súbito.',
      'Não atrasar a reperfusão do IAMCSST esperando resultado de exame.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'ECG a cada 15–30 min enquanto a dor persiste, e sempre que a dor mudar de padrão.',
      'Troponina no intervalo do protocolo: 0/1 h ou 0/2 h na alta sensibilidade; 0 e 3–6 h na convencional.',
      'Reavalie o diagnóstico se a dor não cede com o tratamento proposto.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*Hemodinâmica agora:* IAMCSST, SCA de muito alto risco, instabilidade elétrica ou hemodinâmica.',
      '*Unidade coronariana:* SCA sem supra de alto risco, arritmia, IC associada.',
      '*Observação:* HEART 4 a 6, para completar a curva e fazer teste funcional ou angio-TC de coronárias.',
      '*Alta:* HEART 0 a 3 com troponinas negativas, causa grave afastada, consulta em até 72 h e retorno escrito com sinais de alarme.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'ECG normal não exclui SCA: um ECG isolado perde mais da metade dos infartos — repita.',
      'Dor que melhora não é dor benigna — dissecção clássica alivia depois do pico.',
      'Dor reprodutível à palpação não exclui isquemia; a costocondrite é diagnóstico de exclusão.',
      'Peça sempre PA nos dois braços na primeira avaliação: é barato e muda a conduta.']}],
  condutas:['dor-toracica','sca-com-supra','sca-sem-supra','sindrome-aortica','tep','pneumotorax','tamponamento','pericardite-miocardite','ruptura-esofago','takotsubo','ecg-leitura'],
  atalhos:[{tipo:'score',id:'heart',rotulo:'Escore HEART'},{tipo:'score',id:'wells-tep',rotulo:'Wells — TEP'},{tipo:'conduta',id:'ecg-leitura',rotulo:'Leitura do ECG'}] },

/* ---------------------------------------------------------- 03 */
{ id:'hipotensao', nome:'Pressão baixa', sub:'Hipotensão e choque', icone:'gota',
  tags:['hipotensao','choque','pressao baixa','pa baixa','colapso','hipoperfusao','vasopressor'],
  fonte:'Surviving Sepsis Campaign e diretrizes brasileiras de choque', revisao:'09/2026',
  agora:['Dois acessos calibrosos — ou intraósseo se não conseguir em 90 segundos.',
    'Monitor, oxigênio, glicemia, ECG e lactato.',
    'Elevar as pernas enquanto prepara o volume.',
    'Cristaloide balanceado em alíquotas de 250–500 mL, reavaliando entre cada uma.',
    'POCUS: coração, veia cava, pulmão e FAST — separa os quatro tipos de choque em minutos.',
    'Se não responde ao volume, comece noradrenalina — não espere o acesso central.'],
  naopode:[
    {dx:'Choque séptico', pista:'Febre ou hipotermia, foco infeccioso, lactato alto. Antibiótico na primeira hora.', conduta:'sepse'},
    {dx:'Choque hemorrágico', pista:'Trauma, hemorragia digestiva, gestante, aneurisma. Volume não substitui hemostasia.', conduta:'hda'},
    {dx:'Tamponamento cardíaco', pista:'Jugular túrgida com pulmão limpo e bulhas abafadas.', conduta:'tamponamento'},
    {dx:'Pneumotórax hipertensivo', pista:'Murmúrio abolido unilateral + hipotensão. Punção antes do raio-X.', conduta:'pneumotorax'},
    {dx:'TEP maciço', pista:'Hipotensão, VD dilatado no POCUS, hipoxemia com pulmão limpo.', conduta:'tep'},
    {dx:'Anafilaxia', pista:'Início em minutos após exposição, com pele ou via aérea envolvidas. Adrenalina IM na coxa, agora.', conduta:'anafilaxia'},
    {dx:'Insuficiência adrenal aguda', pista:'Hipotensão refratária a volume e vasopressor, hiponatremia, hipercalemia, corticoide em uso crônico.', conduta:'insuficiencia-adrenal'},
    {dx:'IAM de ventrículo direito', pista:'Supra inferior + hipotensão. É pré-carga-dependente: volume sim, nitrato não.', conduta:'sca-com-supra'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Lactato ≥ 4 mmol/L ou que não cai com o tratamento.',
      'Rebaixamento, oligúria, pele fria e moteada, enchimento capilar > 3 s.',
      'Hipotensão que precisa de vasopressor para manter PAM ≥ 65 mmHg.',
      'Hipotensão junto com jugular túrgida — pensa em obstrutivo, e volume pode piorar.',
      'Bradicardia com hipotensão — considere intoxicação, hipercalemia e bloqueio.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'PAS < 90 mmHg ou PAM < 65 mmHg, ou sinais de hipoperfusão com PA normal', nota:'Hipotensão é um número; choque é perfusão. O hipertenso crônico choca com PA "normal"'},
      {tipo:'passo', rotulo:'Primeiros 5 minutos', texto:'Dois acessos, volume em alíquotas, monitor, lactato e glicemia', nota:'Reavalie perfusão, ausculta e jugular depois de cada 250–500 mL'},
      {tipo:'decisao', rotulo:'POCUS + exame', texto:'Que tipo de choque é?', ramos:[
        {rotulo:'Distributivo', texto:'Sepse · anafilaxia · neurogênico', nota:'Veia cava colabada, coração hiperdinâmico, extremidades quentes no início'},
        {rotulo:'Hipovolêmico', texto:'Hemorragia · desidratação · queimadura', nota:'Veia cava colabada, câmaras vazias. Procure o sangramento'},
        {rotulo:'Cardiogênico', cor:'perigo', texto:'IAM · arritmia · miocardite', nota:'Veia cava cheia, contratilidade ruim, congestão. Volume aqui piora'},
        {rotulo:'Obstrutivo', cor:'perigo', texto:'TEP · tamponamento · pneumotórax', nota:'Veia cava cheia com pulmão limpo. Trate a obstrução, não o número'}]},
      {tipo:'decisao', rotulo:'Após 30 mL/kg (ou antes, se congestão)', texto:'A PAM subiu para ≥ 65 mmHg?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Mantenha, procure e trate a causa', nota:'Lactato de controle em 2–4 h'},
        {rotulo:'NÃO', cor:'perigo', texto:'Noradrenalina — pode iniciar em veia periférica calibrosa enquanto o central é passado', nota:'Choque refratário: reveja tamponamento, pneumotórax, adrenal, acidose grave e intoxicação'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'UTI', nota:'Todo choque que precisou de vasopressor é leito de terapia intensiva'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* lactato (e repetir), gasometria com eletrólitos, hemograma, função renal, glicemia, ECG.',
      '*Se infecção:* duas hemoculturas antes do antibiótico — desde que não atrasem a primeira dose.',
      '*Se sangramento:* tipagem, coagulograma, e acione o protocolo de transfusão maciça se aplicável.',
      '*POCUS* como extensão do exame físico, não como exame de imagem opcional.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não dar volume em bloco no choque cardiogênico ou obstrutivo — reavalie a cada alíquota.',
      'Não atrasar a noradrenalina esperando o acesso central: periférica calibrosa serve na largada.',
      'Não atrasar o antibiótico da sepse esperando cultura, tomografia ou transporte.',
      'Não usar dopamina como primeira escolha de vasopressor.',
      'Não confiar em PA normal para excluir choque no hipertenso crônico e no jovem, que compensam bem até desabar.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'A cada 250–500 mL: PA, FC, perfusão, ausculta, jugular e nível de consciência.',
      'Lactato em 2–4 h. Clareamento é o alvo, não apenas o número inicial.',
      'Débito urinário — meta prática ≥ 0,5 mL/kg/h.',
      'Se não melhora, reveja a categoria de choque: a classificação inicial errada é a causa mais comum de refratariedade.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* qualquer choque que exigiu vasopressor, lactato persistente ou disfunção orgânica.',
      '*Enfermaria monitorizada:* hipotensão que resolveu com volume e causa identificada e tratada.',
      '*Alta:* praticamente nunca no mesmo atendimento, salvo hipotensão claramente medicamentosa ou vasovagal já revertida e reavaliada.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Jugular túrgida com pulmão limpo muda tudo: o volume passa a ser o inimigo.',
      'Pele quente não exclui choque — o distributivo começa quente.',
      'Choque que não sobe com noradrenalina em dose crescente pede corticoide, gasometria e revisão da hipótese.',
      'Bradicardia + hipotensão + hipercalemia: pense em intoxicação por betabloqueador, bloqueador de canal de cálcio ou digital.']}],
  condutas:['choque-abordagem','sepse','anafilaxia','tamponamento','tep','hda','pneumotorax','insuficiencia-adrenal','acesso-venoso-central','acesso-intraosseo','pocus'],
  atalhos:[{tipo:'calc',id:'shock-index',rotulo:'Shock index'},{tipo:'calc',id:'pam',rotulo:'PAM'},{tipo:'score',id:'qsofa',rotulo:'qSOFA'},{tipo:'score',id:'sofa',rotulo:'SOFA'}] },

/* ---------------------------------------------------------- 04 */
{ id:'alteracao-consciencia', nome:'Alteração de consciência', sub:'Confusão, torpor e coma', icone:'cerebro',
  tags:['confusao','coma','torpor','rebaixamento','sonolencia','desorientado','nao acorda','glasgow'],
  fonte:'Diretrizes brasileiras de AVC, protocolos de coma e delirium', revisao:'09/2026',
  agora:['*Glicemia capilar antes de qualquer outra coisa.*',
    'ABC: proteger via aérea se Glasgow ≤ 8 ou reflexos protetores ausentes.',
    'Monitor, oxigênio se hipoxemia, acesso venoso.',
    'Glasgow, pupilas e sinais de lateralização em 60 segundos.',
    'Se hipoglicemia: glicose 50% 40–60 mL EV — com tiamina antes em etilista ou desnutrido.',
    'Se opioide provável: naloxona. Se pupilas puntiformes com bradipneia, não espere confirmação.',
    'Temperatura — hipertermia e hipotermia são causas tratáveis.'],
  naopode:[
    {dx:'Hipoglicemia', pista:'A causa mais reversível de todas. Sempre a primeira medida.', conduta:'hipoglicemia'},
    {dx:'AVC', pista:'Déficit focal súbito. Cronometre o último horário visto bem — é isso que define a trombólise.', conduta:'avc-isquemico'},
    {dx:'Meningite / encefalite', pista:'Febre + rebaixamento + rigidez de nuca. Antibiótico não espera a punção lombar.', conduta:'meningite'},
    {dx:'Hemorragia subaracnóidea', pista:'Cefaleia súbita e explosiva antes do rebaixamento.', conduta:'avc-hemorragico'},
    {dx:'Intoxicação', pista:'Padrão de toxíndrome: pupilas, pele, ruídos hidroaéreos e temperatura contam a história.', conduta:'intoxicado-abordagem'},
    {dx:'Hipertensão intracraniana', pista:'Cefaleia, vômito, bradicardia com hipertensão, anisocoria.', conduta:'hipertensao-intracraniana'},
    {dx:'Estado de mal não convulsivo', pista:'Rebaixamento inexplicado e prolongado após crise. Precisa de EEG.', conduta:'status-epilepticus'},
    {dx:'Encefalopatia hepática ou urêmica', pista:'Cirrótico ou renal crônico com flapping.', conduta:'cirrose-descompensada'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Glasgow ≤ 8 — via aérea definitiva.',
      'Anisocoria, postura de decorticação ou descerebração, tríade de Cushing.',
      'Déficit focal novo — o relógio do AVC já está correndo.',
      'Febre com rebaixamento — trate como meningite até prova em contrário.',
      'Rebaixamento com hipoventilação — hipercapnia, opioide ou fadiga.',
      'Trauma craniano com anticoagulante em uso: tomografia mesmo com exame normal.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Alteração aguda do nível ou do conteúdo da consciência', nota:'Glicemia capilar imediata · ABC · Glasgow · pupilas'},
      {tipo:'decisao', rotulo:'Glicemia', texto:'Está baixa?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Corrija e reavalie em 15 min', nota:'Tiamina antes da glicose em etilista ou desnutrido. Se não melhora depois de corrigir, procure outra causa'},
        {rotulo:'NÃO', texto:'Siga a investigação estruturada'}]},
      {tipo:'decisao', rotulo:'Exame neurológico', texto:'Há déficit focal ou sinal de lateralização?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Tomografia de crânio agora — protocolo de AVC', nota:'Estabeleça o horário do último momento visto bem antes de sair da sala'},
        {rotulo:'NÃO', texto:'Pense em causa difusa: metabólica, tóxica, infecciosa, hipóxica'}]},
      {tipo:'decisao', rotulo:'Febre ou sinal meníngeo?', texto:'Suspeita de infecção do sistema nervoso central?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Antibiótico empírico imediato, depois punção lombar', nota:'Tomografia antes da punção se há foco, rebaixamento importante, papiledema ou imunossupressão — mas o antibiótico não espera nada disso'},
        {rotulo:'NÃO', texto:'Rastreio metabólico e toxicológico'}]},
      {tipo:'passo', rotulo:'Rastreio amplo', texto:'Sódio, cálcio, função renal e hepática, amônia, gasometria, TSH, hemograma, tóxicos', nota:'Reveja a lista de medicações — polifarmácia no idoso é a causa mais subestimada'},
      {tipo:'fim', rotulo:'Disposição', texto:'UTI · enfermaria · observação', nota:'Alta só depois de retorno completo ao basal, causa esclarecida e acompanhante presente'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* glicemia, sódio, potássio, cálcio, ureia, creatinina, gasometria, hemograma, ECG.',
      '*Conforme a suspeita:* amônia, função hepática, TSH, cortisol, screening toxicológico, hemoculturas, tomografia de crânio, punção lombar, EEG.',
      '*Sempre pergunte:* lista de medicações, uso de álcool e drogas, trauma recente, febre, e qual é o basal cognitivo do paciente.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não administrar glicose ao etilista ou desnutrido sem tiamina antes.',
      'Não atrasar o antibiótico da meningite esperando tomografia ou punção lombar.',
      'Não sedar o agitado antes de excluir hipoglicemia, hipóxia, dor, retenção urinária e abstinência.',
      'Não atribuir ao "delirium do idoso" antes de excluir infecção, medicação, distúrbio metabólico e AVC.',
      'Não usar flumazenil às cegas — pode precipitar convulsão em usuário crônico ou coingestão de tricíclico.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Glasgow e pupilas a cada 15–30 min enquanto instável.',
      'Glicemia de controle 15 min após a correção.',
      'Se não melhora depois de corrigir a causa aparente, a hipótese está incompleta — considere EEG.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* Glasgow ≤ 8, necessidade de via aérea, status epilepticus, hipertensão intracraniana.',
      '*Enfermaria:* causa identificada que exige tratamento venoso ou monitorização.',
      '*Alta:* apenas com retorno completo ao basal, causa reversível esclarecida (hipoglicemia corrigida, por exemplo), acompanhante e orientação escrita.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Hipoglicemia imita AVC com déficit focal — e resolve com glicose.',
      'Idoso com infecção urinária ou pneumonia pode se apresentar só com confusão, sem febre.',
      'Rebaixamento pós-crise que dura mais de 30–60 min não é apenas período pós-ictal.',
      'Sempre revise a prescrição: benzodiazepínico, opioide e anticolinérgico são causa frequente e reversível.']}],
  condutas:['rebaixamento-consciencia','hipoglicemia','avc-isquemico','avc-hemorragico','meningite','status-epilepticus','delirium','intoxicado-abordagem','hiponatremia','cirrose-descompensada','hipertensao-intracraniana'],
  atalhos:[{tipo:'score',id:'glasgow',rotulo:'Escala de Glasgow'},{tipo:'conduta',id:'sequencia-rapida-intubacao',rotulo:'Intubação em sequência rápida'},{tipo:'calc',id:'ckd-epi',rotulo:'TFGe'}] },

/* ---------------------------------------------------------- 05 */
{ id:'febre', nome:'Febre', sub:'Síndrome febril aguda', icone:'virus',
  tags:['febre','febril','hipertermia','calafrio','temperatura','infeccao'],
  fonte:'Protocolos brasileiros de sepse, dengue e síndrome febril', revisao:'09/2026',
  agora:['Sinais vitais completos, incluindo *frequência respiratória* — é o que mais se esquece e o que mais prediz gravidade.',
    'Rastreie sepse: qSOFA, perfusão, nível de consciência, lactato.',
    'Procure o foco em 3 minutos: pulmão, urina, pele, abdome, meninges, cateteres e próteses.',
    'Se há sinal de gravidade: acesso, culturas e *antibiótico na primeira hora*.',
    'Pergunte sobre viagem, contato, exposição animal, imunossupressão e quimioterapia recente.'],
  naopode:[
    {dx:'Sepse e choque séptico', pista:'Febre com disfunção orgânica. O antibiótico da primeira hora é o que salva.', conduta:'sepse'},
    {dx:'Meningite bacteriana', pista:'Febre + cefaleia + rigidez de nuca ou rebaixamento.', conduta:'meningite'},
    {dx:'Neutropenia febril', pista:'Quimioterapia nas últimas semanas. É emergência mesmo com paciente bem.', conduta:'neutropenia-febril'},
    {dx:'Infecção necrotizante de partes moles', pista:'Dor desproporcional ao exame, crepitação, bolhas, evolução em horas.', conduta:'fasciite-necrotizante'},
    {dx:'Dengue com sinais de alarme', pista:'Dor abdominal intensa, vômito persistente, sangramento, letargia, hematócrito subindo com plaquetas caindo.', conduta:'dengue'},
    {dx:'Endocardite', pista:'Febre prolongada com sopro novo, usuário de droga injetável, prótese valvar.', conduta:'endocardite'},
    {dx:'Malária', pista:'Febre após viagem a área endêmica. Pesquisa de plasmódio na urgência.', conduta:'sindrome-febril'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'qSOFA ≥ 2, hipotensão, lactato elevado ou rebaixamento.',
      'Febre no neutropênico, esplenectomizado, transplantado ou em imunossupressor.',
      'Febre com petéquias ou púrpura — meningococcemia até prova em contrário.',
      'Febre com dor desproporcional em partes moles.',
      'Febre com prótese, cateter de longa permanência ou dispositivo cardíaco.',
      'Febre em gestante, e febre no lactante abaixo de 3 meses.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Adulto com febre aguda', nota:'Sinais vitais completos com FR · rastreio de sepse · busca ativa de foco'},
      {tipo:'decisao', rotulo:'Triagem de gravidade', texto:'Há disfunção orgânica ou hipoperfusão?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Pacote da sepse: culturas, lactato, volume e antibiótico na 1ª hora', nota:'A coleta de cultura não pode atrasar a primeira dose'},
        {rotulo:'NÃO', texto:'Investigue o foco com calma, mas com método'}]},
      {tipo:'decisao', rotulo:'Hospedeiro', texto:'É imunossuprimido, neutropênico, esplenectomizado ou tem prótese?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Tratar como grave mesmo parecendo bem', nota:'Neutropenia febril: antibiótico de amplo espectro imediato'},
        {rotulo:'NÃO', texto:'Estratifique pelo foco encontrado'}]},
      {tipo:'decisao', rotulo:'Encontrou o foco?', texto:'Pulmão, urina, pele, abdome, sistema nervoso central?', ramos:[
        {rotulo:'SIM', texto:'Trate o foco pelo protocolo específico', nota:'A escolha empírica está na seção de antibióticos, por sítio'},
        {rotulo:'NÃO', texto:'Febre sem foco: reavalie em 24–48 h', nota:'Considere viagem, arboviroses, drogas, trombose, neoplasia e doença reumatológica'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'UTI · enfermaria · observação · alta com retorno em 24–48 h'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre que houver gravidade:* hemograma, lactato, função renal, eletrólitos, PCR, gasometria, duas hemoculturas, urina tipo I e urocultura.',
      '*Conforme a suspeita:* raio-X de tórax, punção lombar, ultrassom de abdome, sorologias e testes para arbovírus, pesquisa de plasmódio.',
      '*Sempre pergunte:* viagens, contato com água parada ou animais, procedimentos recentes, uso de antibiótico nas últimas semanas.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não dar antibiótico para toda febre — mas nunca atrase o antibiótico quando há sepse.',
      'Não medir só a temperatura: sem frequência respiratória e perfusão você não estratificou nada.',
      'Não dar alta para o neutropênico febril.',
      'Não usar anti-inflamatório na suspeita de dengue.',
      'Não descartar infecção grave porque o paciente está afebril: idoso e imunossuprimido podem chocar sem febre, ou com hipotermia.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Reavaliação em 1 h após a primeira dose de antibiótico se havia sepse.',
      'Lactato de controle em 2–4 h.',
      'Febre sem foco liberada para casa: retorno programado em 24–48 h, com sinais de alarme por escrito.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* choque séptico, disfunção orgânica progressiva.',
      '*Enfermaria:* foco que exige antibiótico venoso, imunossupressão, comorbidade descompensada, incapacidade de hidratação oral.',
      '*Observação:* dengue com sinal de alarme, resposta parcial, dúvida diagnóstica.',
      '*Alta:* hospedeiro hígido, sem sinal de gravidade, hidratado, com retorno marcado e orientação escrita.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'A febre que cede com antitérmico não diz nada sobre a gravidade da infecção.',
      'Idoso séptico frequentemente chega hipotérmico e confuso, sem febre.',
      'Antibiótico prévio mascara cultura e muda o espectro — pergunte sempre.',
      'Em área endêmica, dengue e a infecção bacteriana podem coexistir; um diagnóstico não exclui o outro.']}],
  condutas:['sindrome-febril','sepse','meningite','pneumonia-comunidade','itu','celulite-erisipela','dengue','neutropenia-febril','endocardite','fasciite-necrotizante','antibioticoterapia-empirica'],
  atalhos:[{tipo:'score',id:'qsofa',rotulo:'qSOFA'},{tipo:'score',id:'curb65',rotulo:'CURB-65'},{tipo:'atb',id:'',rotulo:'Antibióticos por sítio'}] },

/* ---------------------------------------------------------- 06 */
{ id:'dor-abdominal', nome:'Dor abdominal', sub:'Abdome agudo e diferenciais', icone:'estomago',
  tags:['dor abdominal','abdome','barriga','colica','abdome agudo','epigastralgia'],
  fonte:'Diretrizes brasileiras de abdome agudo, pancreatite e doença biliar', revisao:'09/2026',
  agora:['Sinais vitais e perfusão — abdome agudo com hipotensão é cirúrgico até prova em contrário.',
    'Acesso venoso, analgesia adequada e antiemético.',
    '*ECG em toda dor epigástrica* acima dos 40 anos ou com fator de risco.',
    'Beta-HCG em toda mulher em idade fértil, sem exceção.',
    'Exame do abdome completo, incluindo hérnias e a região inguinal.',
    'Lactato se há suspeita de isquemia ou o paciente parece grave demais para o exame que você vê.'],
  naopode:[
    {dx:'Aneurisma de aorta roto', pista:'Idoso, dor lombar ou abdominal súbita, hipotensão, massa pulsátil. POCUS na hora.', conduta:'sindrome-aortica'},
    {dx:'Isquemia mesentérica', pista:'Dor desproporcional ao exame físico, fibrilação atrial, lactato alto, acidose.', conduta:'isquemia-mesenterica'},
    {dx:'Gravidez ectópica rota', pista:'Mulher em idade fértil com dor e instabilidade. Beta-HCG sempre.', conduta:'sangramento-gestacao'},
    {dx:'Perfuração de víscera oca', pista:'Dor súbita, abdome em tábua, pneumoperitônio.', conduta:'abdome-agudo'},
    {dx:'Infarto de parede inferior', pista:'Dor epigástrica com náusea e sudorese. O ECG resolve a dúvida.', conduta:'sca-com-supra'},
    {dx:'Colangite', pista:'Febre + icterícia + dor em hipocôndrio direito. Precisa de drenagem, não só de antibiótico.', conduta:'colecistite-colangite'},
    {dx:'Obstrução com estrangulamento', pista:'Parada de eliminação, distensão, vômito, e dor que muda de cólica para contínua.', conduta:'obstrucao-intestinal'},
    {dx:'Cetoacidose diabética', pista:'Dor abdominal com hiperglicemia e taquipneia. Abdome agudo metabólico, não cirúrgico.', conduta:'cetoacidose'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Hipotensão, taquicardia ou lactato elevado com dor abdominal.',
      'Dor desproporcional ao exame físico.',
      'Abdome em tábua, descompressão dolorosa, ausência de ruídos.',
      'Idoso, imunossuprimido, diabético e usuário crônico de corticoide: exame físico pobre não exclui catástrofe.',
      'Dor com sangramento digestivo, icterícia ou massa pulsátil.',
      'Primeira dor abdominal intensa depois dos 50 anos.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Dor abdominal aguda', nota:'Sinais vitais · analgesia · beta-HCG na mulher em idade fértil · ECG se dor alta'},
      {tipo:'decisao', rotulo:'Primeiro filtro', texto:'Está instável ou tem abdome em tábua?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Ressuscitação + cirurgia agora', nota:'POCUS/FAST à beira do leito. Não mande o instável para a tomografia sem estabilizar'},
        {rotulo:'NÃO', texto:'Localize a dor e construa o diferencial'}]},
      {tipo:'decisao', rotulo:'Topografia', texto:'Onde dói?', ramos:[
        {rotulo:'Epigástrio', texto:'IAM · pancreatite · úlcera · esôfago', nota:'ECG e lipase antes de assumir gastrite'},
        {rotulo:'HD / HE', texto:'Biliar · hepático · pielonefrite · pneumonia de base'},
        {rotulo:'FID / FIE', texto:'Apendicite · diverticulite · anexial · ureter'},
        {rotulo:'Difusa', cor:'perigo', texto:'Isquemia · obstrução · perfuração · peritonite', nota:'Dor difusa desproporcional em idoso com FA é isquemia mesentérica'}]},
      {tipo:'passo', rotulo:'Exames dirigidos', texto:'Hemograma, função renal, eletrólitos, lipase, hepatograma, urina, lactato e imagem conforme a hipótese', nota:'Ultrassom para via biliar, rim e pelve; tomografia para o resto'},
      {tipo:'decisao', rotulo:'Reavaliação em 2–4 h', texto:'A dor melhorou e o exame ficou tranquilo?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Alta com retorno orientado', nota:'Dor abdominal indeterminada tem alta com retorno em 12–24 h, não com "tome dipirona"'},
        {rotulo:'NÃO', cor:'perigo', texto:'Interne para observação seriada', nota:'O exame abdominal seriado é mais sensível que qualquer exame único'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'Centro cirúrgico · internação · observação · alta com retorno'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* hemograma, função renal, eletrólitos, urina tipo I, beta-HCG na mulher em idade fértil.',
      '*Conforme a topografia:* lipase, hepatograma, bilirrubinas, lactato, gasometria, coagulograma.',
      '*Imagem:* ultrassom para via biliar, rins e pelve; tomografia com contraste para isquemia, obstrução, perfuração e aorta.',
      '*ECG* em toda dor epigástrica com fator de risco cardiovascular.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não deixar de analgesiar com medo de "mascarar o abdome" — analgesia adequada não atrasa nem esconde o diagnóstico cirúrgico.',
      'Não dispensar mulher em idade fértil sem beta-HCG.',
      'Não confiar em exame abdominal normal em idoso, diabético ou usuário de corticoide.',
      'Não pedir tomografia com contraste sem checar função renal e alergia — mas não deixe de pedir quando a suspeita é grave.',
      'Não chamar de "gastrite" a primeira dor epigástrica intensa do paciente com fator de risco antes do ECG.',
      'Não usar anti-inflamatório em suspeita de sangramento digestivo ou lesão renal.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Exame abdominal seriado a cada 2–4 h enquanto o paciente estiver em observação.',
      'Reavalie após a analgesia: dor que não cede com opioide é sinal de gravidade.',
      'Repita o hemograma e o lactato se a evolução não é a esperada.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*Cirurgia:* peritonite, perfuração, obstrução com sofrimento, isquemia, aneurisma.',
      '*Internação clínica:* pancreatite, colangite, diverticulite complicada, incapacidade de hidratação oral.',
      '*Observação:* dor indeterminada com exames iniciais normais.',
      '*Alta:* dor resolvida, deambulando, tolerando via oral, com retorno em 12–24 h e sinais de alarme escritos.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Dor desproporcional ao exame é isquemia mesentérica até que se prove o contrário.',
      'Idoso com abdome "inocente" e lactato alto está grave.',
      'Pneumonia de base e infarto inferior entram no diferencial de dor abdominal alta.',
      'Hérnia encarcerada só é encontrada se você examinar a região inguinal — inclusive na mulher e no obeso.']}],
  condutas:['abdome-agudo','apendicite','colecistite-colangite','pancreatite','obstrucao-intestinal','diverticulite','isquemia-mesenterica','hda','colica-renal','cirrose-descompensada','sindrome-aortica'],
  atalhos:[{tipo:'conduta',id:'analgesia-ps',rotulo:'Analgesia no PS'},{tipo:'conduta',id:'pocus',rotulo:'POCUS / FAST'},{tipo:'atb',id:'abdominal',rotulo:'ATB abdominal'}] },

/* ---------------------------------------------------------- 07 */
{ id:'cefaleia-q', nome:'Dor de cabeça', sub:'Cefaleia na emergência', icone:'cabeca',
  tags:['cefaleia','dor de cabeca','enxaqueca','migranea','thunderclap'],
  fonte:'Diretrizes brasileiras de cefaleia e de hemorragia subaracnóidea', revisao:'09/2026',
  agora:['Sinais vitais com PA e temperatura, e exame neurológico completo com fundo de olho quando possível.',
    'Estabeleça o padrão: *início súbito ou gradual?* É a pergunta que mais muda a conduta.',
    'Analgesia adequada — não deixe o paciente esperando exame com dor.',
    'Se cefaleia explosiva ou déficit focal: tomografia de crânio sem contraste, agora.',
    'Se febre com rigidez de nuca: antibiótico empírico antes da punção lombar.'],
  naopode:[
    {dx:'Hemorragia subaracnóidea', pista:'Cefaleia explosiva que atinge o pico em segundos ("a pior da vida"). Tomografia normal precoce não exclui — punção lombar.', conduta:'avc-hemorragico'},
    {dx:'Meningite', pista:'Febre, rigidez de nuca, rebaixamento, petéquias.', conduta:'meningite'},
    {dx:'Trombose venosa cerebral', pista:'Cefaleia progressiva, gestante ou puérpera, uso de anticoncepcional, trombofilia, papiledema.', conduta:'hipertensao-intracraniana'},
    {dx:'Hipertensão intracraniana / massa', pista:'Piora ao deitar, ao acordar ou com manobra de Valsalva; vômito; papiledema.', conduta:'hipertensao-intracraniana'},
    {dx:'Dissecção de carótida ou vertebral', pista:'Cefaleia ou cervicalgia após trauma ou manipulação cervical, com Horner ou déficit.', conduta:'avc-isquemico'},
    {dx:'Arterite temporal', pista:'Acima de 50 anos, dor temporal, claudicação de mandíbula, alteração visual, VHS alto. Corticoide não espera a biópsia.', conduta:'cefaleia'},
    {dx:'Glaucoma agudo', pista:'Dor ocular, olho vermelho, visão embaçada com halos, pupila média fixa.', conduta:'cefaleia'},
    {dx:'Intoxicação por monóxido de carbono', pista:'Cefaleia coletiva em várias pessoas da mesma casa, exposição a fogão, aquecedor ou motor.', conduta:'monoxido-carbono'},
    {dx:'Pré-eclâmpsia grave', pista:'Gestante ≥ 20 semanas ou puérpera até 6 semanas com cefaleia, escotomas ou PA ≥ 160/110.', conduta:'pre-eclampsia'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      '*Início súbito* atingindo o pico em menos de 1 minuto.',
      'Primeira cefaleia intensa depois dos 50 anos.',
      'Febre, rigidez de nuca ou rash.',
      'Déficit neurológico focal, crise convulsiva ou rebaixamento.',
      'Papiledema, alteração visual ou dor ocular.',
      'Piora progressiva, ou piora ao deitar, ao acordar e à Valsalva.',
      'Imunossupressão, câncer, HIV, anticoagulação, gestação ou puerpério.',
      'Trauma craniano recente, mesmo leve, em quem usa anticoagulante.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Cefaleia no pronto-socorro', nota:'Padrão temporal · exame neurológico · PA · temperatura · analgesia'},
      {tipo:'decisao', rotulo:'Pergunta que separa tudo', texto:'A dor foi súbita, atingindo o máximo em segundos?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Tomografia sem contraste imediata', nota:'Se a tomografia for normal e a história for típica, a punção lombar é obrigatória para excluir hemorragia subaracnóidea'},
        {rotulo:'NÃO', texto:'Procure os outros sinais de alarme'}]},
      {tipo:'decisao', rotulo:'Tem algum red flag?', texto:'Febre, déficit, papiledema, idade, imunossupressão, gestação?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Investigue: imagem, punção lombar, VHS/PCR conforme a hipótese'},
        {rotulo:'NÃO', cor:'ok', texto:'Cefaleia primária provável', nota:'Trate a dor e reavalie; imagem não é rotina na cefaleia primária típica com exame normal'}]},
      {tipo:'passo', rotulo:'Tratamento da crise primária', texto:'Analgésico ou anti-inflamatório + antiemético; hidratação; ambiente calmo', nota:'Evite opioide como primeira escolha na enxaqueca — piora a cefaleia por rebote'},
      {tipo:'decisao', rotulo:'Reavaliação em 1–2 h', texto:'A dor cedeu e o exame neurológico continua normal?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Alta com orientação e seguimento'},
        {rotulo:'NÃO', cor:'perigo', texto:'Reveja a hipótese e investigue com imagem', nota:'Cefaleia que não responde ao tratamento habitual do próprio paciente é red flag'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'Neurocirurgia · internação · observação · alta com seguimento'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Cefaleia primária típica, exame normal, sem red flag:* nenhum exame de rotina.',
      '*Com red flag:* tomografia de crânio sem contraste; punção lombar se a tomografia for normal e a suspeita for hemorragia subaracnóidea ou infecção.',
      '*Acima de 50 anos com dor temporal:* VHS e PCR.',
      '*Suspeita de trombose venosa cerebral:* angio-RM ou angio-TC venosa.',
      '*Sempre:* PA, temperatura e glicemia.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não excluir hemorragia subaracnóidea só com tomografia normal quando a história é de cefaleia explosiva.',
      'Não usar opioide como primeira linha na enxaqueca.',
      'Não fazer punção lombar antes da tomografia quando há déficit focal, rebaixamento, papiledema ou imunossupressão.',
      'Não atrasar o corticoide da arterite temporal esperando a biópsia — o risco é cegueira irreversível.',
      'Não atribuir cefaleia à hipertensão arterial: a maioria das crises hipertensivas não dói, e a dor costuma ser a causa da PA alta, não o contrário.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Exame neurológico repetido antes da alta, sempre.',
      'Reavalie em 1–2 h após a analgesia.',
      'Oriente retorno imediato se a dor voltar mais forte, surgir febre, déficit, vômito ou alteração visual.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*Neurocirurgia / UTI:* hemorragia, hipertensão intracraniana, rebaixamento.',
      '*Internação:* meningite, trombose venosa cerebral, arterite temporal com alteração visual, status migranoso refratário.',
      '*Observação:* dor intensa que não cedeu ao tratamento inicial.',
      '*Alta:* cefaleia primária com exame neurológico normal, dor controlada e sinais de alarme escritos.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'O que importa na hemorragia subaracnóidea é a *velocidade de instalação*, não a intensidade final.',
      'A sensibilidade da tomografia para hemorragia subaracnóidea cai rápido depois das primeiras 6 horas.',
      'Cefaleia diferente do padrão habitual do próprio paciente é sinal de alarme, mesmo em enxaquecoso conhecido.',
      'Pergunte se mais alguém em casa tem dor de cabeça — monóxido de carbono se apresenta em grupo.']}],
  condutas:['cefaleia','avc-hemorragico','meningite','hipertensao-intracraniana','avc-isquemico','crise-hipertensiva','monoxido-carbono','puncao-lombar'],
  atalhos:[{tipo:'conduta',id:'puncao-lombar',rotulo:'Punção lombar'},{tipo:'conduta',id:'analgesia-ps',rotulo:'Analgesia no PS'}] },

/* ---------------------------------------------------------- 08 */
{ id:'sincope-q', nome:'Desmaio', sub:'Síncope e pré-síncope', icone:'mente',
  tags:['sincope','desmaio','perda de consciencia','apagou','caiu','lipotimia'],
  fonte:'Diretrizes brasileiras de síncope', revisao:'09/2026',
  agora:['*ECG de 12 derivações em todo paciente com síncope* — sem exceção.',
    'Sinais vitais com PA deitado e em pé, glicemia e SpO2.',
    'Beta-HCG na mulher em idade fértil.',
    'Procure trauma decorrente da queda, especialmente crânio e coluna cervical.',
    'Pergunte: fazia esforço? estava deitado? teve palpitação antes? houve pródromo?'],
  naopode:[
    {dx:'Arritmia maligna', pista:'Síncope sem pródromo, durante esforço ou deitado; palpitação antes; cardiopatia estrutural; morte súbita na família.', conduta:'taqui-qrs-largo'},
    {dx:'Tromboembolismo pulmonar', pista:'Síncope com dispneia, taquicardia ou hipoxemia.', conduta:'tep'},
    {dx:'Dissecção de aorta', pista:'Síncope com dor torácica ou dorsal e assimetria de pulsos.', conduta:'sindrome-aortica'},
    {dx:'Hemorragia oculta', pista:'Síncope com anemia, melena, ou dor abdominal. Ectópica rota na mulher em idade fértil.', conduta:'hda'},
    {dx:'Estenose aórtica grave', pista:'Síncope ao esforço com sopro sistólico rude.', conduta:'sincope'},
    {dx:'Bloqueio atrioventricular avançado', pista:'Bradicardia, pausas, bloqueio de ramo alternante no ECG.', conduta:'bradiarritmia'},
    {dx:'Síndromes elétricas', pista:'QT longo, Brugada, WPW, displasia arritmogênica — procure ativamente no ECG.', conduta:'ecg-leitura'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Síncope *durante o esforço* ou em decúbito.',
      'Ausência de pródromo, ou palpitação imediatamente antes.',
      'ECG anormal: bloqueio, pré-excitação, QT longo, Brugada, sobrecarga, isquemia.',
      'Cardiopatia estrutural conhecida ou insuficiência cardíaca.',
      'História familiar de morte súbita antes dos 50 anos.',
      'Síncope com dor torácica, dispneia, cefaleia ou sangramento.',
      'Idade avançada, anemia, hipotensão persistente ou trauma grave pela queda.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Perda transitória da consciência com recuperação espontânea e completa', nota:'ECG · sinais vitais deitado e em pé · glicemia · exame de trauma'},
      {tipo:'decisao', rotulo:'Foi mesmo síncope?', texto:'Recuperação foi rápida e completa, sem confusão prolongada?', ramos:[
        {rotulo:'SIM', texto:'Siga a estratificação de risco da síncope'},
        {rotulo:'NÃO', cor:'perigo', texto:'Pense em crise convulsiva, hipoglicemia, AVC ou intoxicação', nota:'Confusão pós-evento prolongada, mordedura lateral de língua e liberação esfincteriana falam a favor de crise'}]},
      {tipo:'decisao', rotulo:'Estratificação', texto:'Há algum red flag cardíaco?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Monitorização e internação', nota:'Síncope cardíaca tem mortalidade relevante em 30 dias. Não dê alta'},
        {rotulo:'NÃO', cor:'ok', texto:'Provável reflexa ou ortostática', nota:'Pródromo típico, gatilho identificável, situação postural, ambiente quente ou dor'}]},
      {tipo:'passo', rotulo:'Sempre antes da alta', texto:'Revise a prescrição do paciente', nota:'Anti-hipertensivo, diurético, alfabloqueador, nitrato e psicotrópico causam síncope ortostática no idoso'},
      {tipo:'fim', rotulo:'Disposição', texto:'Monitorização/internação · observação · alta com investigação ambulatorial'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* ECG, glicemia, hemograma, eletrólitos, beta-HCG na mulher em idade fértil.',
      '*Conforme a suspeita:* troponina, D-dímero, gasometria, ecocardiograma, monitorização prolongada, tomografia de crânio se houve trauma ou déficit.',
      '*Não é rotina:* tomografia de crânio na síncope típica sem trauma e com exame neurológico normal.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não dar alta sem ECG.',
      'Não rotular como vasovagal a síncope de esforço, sem pródromo ou em decúbito.',
      'Não pedir tomografia de crânio de rotina em síncope típica com exame neurológico normal e sem trauma.',
      'Não esquecer da medida de PA ortostática — é barata e explica boa parte dos casos no idoso.',
      'Não deixar de examinar a coluna cervical e o crânio de quem caiu sem proteção.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'PA em decúbito e após 1 e 3 minutos em pé.',
      'ECG repetido se houve novo episódio ou sintoma.',
      'Se ficou em observação: monitorização contínua e reavaliação antes da alta.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*Internação monitorizada:* qualquer red flag cardíaco, ECG anormal, cardiopatia estrutural, síncope de esforço.',
      '*Observação:* dúvida diagnóstica, idoso com múltiplas comorbidades, trauma significativo.',
      '*Alta:* síncope reflexa típica, ECG normal, exame normal, sem cardiopatia — com orientação sobre gatilhos, hidratação e retorno.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Síncope durante o esforço é cardíaca até prova em contrário; síncope após o esforço costuma ser reflexa.',
      'Abalos musculares breves durante a síncope são comuns e não fazem diagnóstico de epilepsia.',
      'Revise a lista de medicamentos: no idoso, a causa mais frequente e mais tratável está na receita.',
      'A síncope pode ser a única manifestação de TEP e de hemorragia oculta — procure ativamente.']}],
  condutas:['sincope','bradiarritmia','taqui-qrs-largo','tep','sindrome-aortica','hda','ecg-leitura','status-epilepticus'],
  atalhos:[{tipo:'conduta',id:'ecg-leitura',rotulo:'Leitura do ECG'},{tipo:'score',id:'wells-tep',rotulo:'Wells — TEP'}] },

/* ---------------------------------------------------------- 09 */
{ id:'palpitacoes', nome:'Palpitações', sub:'Taquicardia e bradicardia', icone:'coracao',
  tags:['palpitacao','taquicardia','bradicardia','coracao acelerado','arritmia','fc alta','fc baixa'],
  fonte:'Diretrizes brasileiras de arritmias e suporte avançado de vida', revisao:'09/2026',
  agora:['Monitor, oxigênio se hipoxemia, acesso venoso, desfibrilador ao lado.',
    '*ECG de 12 derivações com o paciente sintomático* — o ritmo pode sumir.',
    'A primeira pergunta é sempre: *está estável?*',
    'Glicemia, eletrólitos com magnésio, função tireoidiana quando cabível.',
    'Se instável com taquiarritmia: cardioversão sincronizada, com sedação se houver tempo.',
    'Se instável com bradiarritmia: atropina, e prepare marca-passo transcutâneo.'],
  naopode:[
    {dx:'Taquicardia ventricular', pista:'QRS largo. Toda taquicardia de QRS largo é TV até prova em contrário, principalmente no cardiopata.', conduta:'taqui-qrs-largo'},
    {dx:'FA pré-excitada (WPW)', pista:'FA irregular, QRS largo e muito rápida. Bloqueador de nó AV é contraindicado.', conduta:'fa-flutter'},
    {dx:'Bloqueio AV total', pista:'Bradicardia com dissociação atrioventricular, síncope, instabilidade.', conduta:'bradiarritmia'},
    {dx:'Hipercalemia', pista:'Bradicardia com QRS alargado e onda T apiculada. Renal crônico. Trate antes do potássio voltar.', conduta:'hipercalemia'},
    {dx:'SCA com arritmia', pista:'A arritmia pode ser a apresentação do infarto — sempre olhe o segmento ST.', conduta:'sca-com-supra'},
    {dx:'Intoxicação', pista:'Digital, betabloqueador, bloqueador de canal de cálcio, tricíclico, cocaína.', conduta:'intoxicado-abordagem'},
    {dx:'TEP', pista:'Taquicardia sinusal persistente sem causa aparente, com hipoxemia.', conduta:'tep'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Hipotensão, dor torácica isquêmica, congestão pulmonar ou rebaixamento junto com a arritmia — isso define *instabilidade*.',
      'Taquicardia de QRS largo.',
      'FC > 150 ou < 40 com sintomas.',
      'Síncope associada à palpitação.',
      'Cardiopatia estrutural conhecida ou morte súbita na família.',
      'QT longo, pré-excitação ou padrão de Brugada no ECG.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Palpitação, taquicardia ou bradicardia', nota:'Monitor · ECG de 12 derivações · acesso · desfibrilador ao lado'},
      {tipo:'decisao', rotulo:'A pergunta que define tudo', texto:'Está instável? Hipotensão, dor isquêmica, congestão ou rebaixamento *causados pela arritmia*?', ramos:[
        {rotulo:'SIM — taqui', cor:'perigo', texto:'Cardioversão elétrica sincronizada', nota:'Sedação e analgesia se houver tempo. Não espere exame'},
        {rotulo:'SIM — bradi', cor:'perigo', texto:'Atropina; se falhar, marca-passo transcutâneo ou droga cronotrópica'},
        {rotulo:'NÃO', texto:'Analise o ECG com calma'}]},
      {tipo:'decisao', rotulo:'Largura do QRS', texto:'O QRS é estreito ou largo?', ramos:[
        {rotulo:'Estreito', texto:'Regular: TSV · flutter. Irregular: FA', nota:'Regular estreito: manobra vagal, depois adenosina'},
        {rotulo:'Largo', cor:'perigo', texto:'Trate como TV', nota:'Nunca use verapamil ou diltiazem em taquicardia de QRS largo de origem indeterminada'}]},
      {tipo:'decisao', rotulo:'Se é bradicardia', texto:'Há causa reversível?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Trate: hipercalemia, hipóxia, droga, hipotireoidismo, infarto inferior'},
        {rotulo:'NÃO', texto:'Avalie indicação de marca-passo definitivo'}]},
      {tipo:'passo', rotulo:'Sempre procure a causa', texto:'Eletrólitos com magnésio, tireoide, isquemia, febre, anemia, dor, álcool, droga, medicação nova, hipovolemia', nota:'Taquicardia sinusal é sintoma, não diagnóstico: procure o que a está causando'},
      {tipo:'fim', rotulo:'Disposição', texto:'UTI/monitorizado · observação · alta com seguimento em arritmia'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* ECG de 12 derivações (guarde uma cópia com o ritmo alterado), eletrólitos com magnésio e cálcio, glicemia, hemograma.',
      '*Conforme a suspeita:* troponina, TSH, gasometria, D-dímero, dosagem de digoxina, screening toxicológico.',
      '*Ecocardiograma* se há suspeita de cardiopatia estrutural.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não usar bloqueador de nó AV (adenosina, verapamil, diltiazem, digoxina) em FA pré-excitada — pode degenerar em fibrilação ventricular.',
      'Não usar verapamil ou diltiazem em taquicardia de QRS largo de origem indeterminada.',
      'Não cardioverter taquicardia sinusal: trate a causa.',
      'Não dar alta a paciente com síncope associada à palpitação sem investigação.',
      'Não corrigir a bradicardia da hipercalemia só com atropina — trate o potássio.',
      'Não usar atropina em bloqueio AV de segundo grau Mobitz II ou total com QRS largo: pode piorar; prepare marca-passo.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'ECG após cada intervenção e ao final do atendimento.',
      'Monitorização contínua até estabilizar o ritmo e corrigir a causa.',
      'Reveja eletrólitos após correção e antes da alta.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI / monitorizado:* instabilidade, TV, bloqueio avançado, arritmia por isquemia ou intoxicação.',
      '*Observação:* FA de início recente em controle, TSV revertida com sintomas residuais.',
      '*Alta:* arritmia revertida, causa identificada e tratada, ECG de base sem sinal de alarme, com seguimento cardiológico marcado.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Instabilidade é a arritmia causando o sintoma — não é apenas o número da PA.',
      'Taquicardia sinusal a 130 no adulto quase sempre tem uma causa que você ainda não encontrou.',
      'Registre o ECG durante o sintoma: sem ele, a investigação começa do zero.',
      'Bradicardia + hipotensão + confusão no renal crônico: pense em hipercalemia antes de qualquer outra coisa.']}],
  condutas:['taquiarritmia-instavel','taqui-qrs-estreito','fa-flutter','taqui-qrs-largo','bradiarritmia','cardioversao-desfibrilacao','hipercalemia','ecg-leitura','sca-sem-supra'],
  atalhos:[{tipo:'conduta',id:'ecg-leitura',rotulo:'Leitura do ECG'},{tipo:'conduta',id:'cardioversao-desfibrilacao',rotulo:'Cardioversão'},{tipo:'calc',id:'shock-index',rotulo:'Shock index'}] },

/* ---------------------------------------------------------- 10 */
{ id:'convulsao-q', nome:'Convulsão', sub:'Crise epiléptica no pronto-socorro', icone:'cerebro',
  tags:['convulsao','crise','epilepsia','tremor','abalos','status'],
  fonte:'Diretrizes brasileiras de estado de mal epiléptico', revisao:'09/2026',
  agora:['Proteger a cabeça, lateralizar, aspirar se necessário. *Não coloque nada na boca.*',
    '*Glicemia capilar imediata.*',
    'Monitor, oxigênio, acesso venoso, cronômetro ligado.',
    'Se a crise passa de 5 minutos: benzodiazepínico agora — é estado de mal.',
    'Tiamina antes da glicose em etilista ou desnutrido.',
    'Em gestante ou puérpera até 6 semanas: pense em eclâmpsia e use sulfato de magnésio.'],
  naopode:[
    {dx:'Estado de mal epiléptico', pista:'Crise além de 5 minutos ou crises repetidas sem recuperação entre elas. É emergência com tempo definido.', conduta:'status-epilepticus'},
    {dx:'Hipoglicemia', pista:'Sempre a primeira medida, antes de qualquer anticonvulsivante.', conduta:'hipoglicemia'},
    {dx:'Eclâmpsia', pista:'Gestante ≥ 20 semanas ou puérpera até 6 semanas. O tratamento é sulfato de magnésio, não benzodiazepínico isolado.', conduta:'pre-eclampsia'},
    {dx:'Meningite / encefalite', pista:'Febre com crise, principalmente primeira crise no adulto.', conduta:'meningite'},
    {dx:'Hemorragia intracraniana', pista:'Cefaleia súbita, déficit focal, uso de anticoagulante, trauma.', conduta:'avc-hemorragico'},
    {dx:'Hiponatremia', pista:'Crise sem causa aparente, sódio baixo. Corrigir devagar, exceto na crise ativa.', conduta:'hiponatremia'},
    {dx:'Intoxicação e abstinência', pista:'Tricíclico, cocaína, tramadol, isoniazida, abstinência alcoólica ou de benzodiazepínico.', conduta:'abstinencia-alcool'},
    {dx:'Estado de mal não convulsivo', pista:'Rebaixamento prolongado após a crise, sem retorno ao basal. Precisa de EEG.', conduta:'status-epilepticus'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Crise com mais de 5 minutos, ou crises repetidas sem recuperar a consciência entre elas.',
      '*Primeira crise no adulto* — sempre investiga.',
      'Febre, cefaleia, déficit focal ou rigidez de nuca junto com a crise.',
      'Gestante ou puérpera.',
      'Trauma craniano, uso de anticoagulante, câncer, HIV ou imunossupressão.',
      'Rebaixamento que persiste além de 30–60 minutos após a crise.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Crise convulsiva', nota:'Proteger · lateralizar · glicemia · monitor · acesso · *cronômetro*'},
      {tipo:'decisao', rotulo:'Tempo de crise', texto:'Passou de 5 minutos?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Estado de mal — benzodiazepínico em dose plena agora', nota:'Dose insuficiente é o erro mais comum. Repita uma vez se necessário'},
        {rotulo:'NÃO', cor:'ok', texto:'Observe, proteja e prepare o material'}]},
      {tipo:'decisao', rotulo:'Após o benzodiazepínico', texto:'A crise cedeu?', ramos:[
        {rotulo:'SIM', texto:'Investigue a causa e defina a manutenção'},
        {rotulo:'NÃO', cor:'perigo', texto:'Segunda linha: anticonvulsivante endovenoso', nota:'Se falhar, é estado de mal refratário: via aérea definitiva, anestésico contínuo e UTI'}]},
      {tipo:'passo', rotulo:'Investigação', texto:'Glicemia, sódio, cálcio, magnésio, função renal e hepática, hemograma, nível sérico do anticonvulsivante, tóxicos, beta-HCG', nota:'Tomografia de crânio em toda primeira crise, crise focal, trauma, febre, imunossupressão ou déficit persistente'},
      {tipo:'decisao', rotulo:'Recuperação', texto:'Voltou ao basal em 30–60 min?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Siga a investigação e defina a disposição'},
        {rotulo:'NÃO', cor:'perigo', texto:'Suspeite de estado de mal não convulsivo — peça EEG'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'UTI · internação · observação · alta com neurologia marcada'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* glicemia, sódio, potássio, cálcio, magnésio, função renal, hemograma, beta-HCG na mulher em idade fértil.',
      '*Se epiléptico conhecido:* nível sérico do anticonvulsivante — a causa mais comum de crise é a má adesão.',
      '*Tomografia de crânio:* primeira crise, crise focal, trauma, febre, anticoagulação, imunossupressão, déficit persistente.',
      '*Punção lombar:* se há febre ou suspeita de infecção do sistema nervoso central, depois da imagem quando indicada.',
      '*EEG:* se o paciente não retorna ao basal.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não colocar objeto na boca do paciente nem tentar conter os movimentos à força.',
      'Não subdosar o benzodiazepínico — a subdose é a principal causa de estado de mal refratário.',
      'Não dar glicose ao etilista sem tiamina.',
      'Não tratar eclâmpsia apenas com benzodiazepínico: o fármaco é o sulfato de magnésio.',
      'Não dar alta ao paciente que não retornou completamente ao basal.',
      'Não deixar de perguntar sobre adesão ao anticonvulsivante e mudanças recentes de dose.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Nível de consciência a cada 15 min na primeira hora após a crise.',
      'Glicemia de controle após a correção.',
      'Reavalie a via aérea depois de cada dose de benzodiazepínico — depressão respiratória é o efeito adverso esperado.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* estado de mal refratário, necessidade de via aérea, anestésico contínuo.',
      '*Internação:* primeira crise com alteração de imagem ou laboratório, crise sintomática aguda, estado de mal revertido.',
      '*Observação:* crise em epiléptico conhecido com recuperação completa e causa clara.',
      '*Alta:* retorno completo ao basal, causa identificada, ajuste de tratamento feito, acompanhante presente, orientação de direção e atividades de risco por escrito, neurologia marcada.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'O relógio começa na primeira crise, não na chegada ao hospital.',
      'Rebaixamento prolongado depois da crise não é sempre período pós-ictal — pense em estado de mal não convulsivo.',
      'Toda mulher em idade fértil com crise precisa de beta-HCG; toda gestante com crise é eclâmpsia até prova em contrário.',
      'Síncope com abalos é confundida com crise: o que diferencia é a duração da confusão pós-evento.']}],
  condutas:['status-epilepticus','hipoglicemia','avc-hemorragico','meningite','hiponatremia','abstinencia-alcool','crise-hipertensiva','convulsao-febril','intoxicado-abordagem'],
  atalhos:[{tipo:'score',id:'glasgow',rotulo:'Escala de Glasgow'},{tipo:'conduta',id:'sequencia-rapida-intubacao',rotulo:'Intubação em sequência rápida'}] },

/* ---------------------------------------------------------- 11 */
{ id:'glicemia', nome:'Glicemia alterada', sub:'Hipoglicemia e hiperglicemia', icone:'seringa',
  tags:['glicemia','hipoglicemia','hiperglicemia','diabetes','acucar','insulina','cetoacidose'],
  fonte:'Diretrizes da Sociedade Brasileira de Diabetes', revisao:'09/2026',
  agora:['Glicemia capilar confirmada, e glicemia laboratorial se houver dúvida.',
    'Se *baixa*: consciente e engolindo, carboidrato oral; rebaixado, glicose 50% EV — com tiamina antes em etilista ou desnutrido.',
    'Se *muito alta*: gasometria com pH, cetonemia ou cetonúria, sódio, potássio e função renal.',
    'Não comece insulina na cetoacidose antes de saber o potássio.',
    'Procure o gatilho: infecção, infarto, má adesão, corticoide, pancreatite, gestação.'],
  naopode:[
    {dx:'Cetoacidose diabética', pista:'Hiperglicemia com acidose e cetose. Pode ocorrer com glicemia quase normal em uso de inibidor de SGLT2.', conduta:'cetoacidose'},
    {dx:'Estado hiperglicêmico hiperosmolar', pista:'Glicemia muito alta, osmolaridade elevada, rebaixamento, idoso, desidratação profunda.', conduta:'estado-hiperosmolar'},
    {dx:'Hipoglicemia por sulfonilureia', pista:'Recorre por muitas horas. Não dê alta após a correção inicial.', conduta:'hipoglicemia'},
    {dx:'Sepse como gatilho', pista:'Descompensação glicêmica sem explicação é infecção até prova em contrário.', conduta:'sepse'},
    {dx:'Infarto silencioso', pista:'Diabético descompensado pode estar infartando sem dor. ECG sempre.', conduta:'sca-com-supra'},
    {dx:'Insuficiência adrenal', pista:'Hipoglicemia recorrente com hipotensão, hiponatremia e hipercalemia.', conduta:'insuficiencia-adrenal'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Rebaixamento de consciência com qualquer valor de glicemia.',
      'Acidose (pH baixo, bicarbonato baixo, ânion gap elevado) ou cetose.',
      'Potássio abaixo de 3,3 mEq/L — *corrija antes de iniciar a insulina*.',
      'Hipoglicemia por sulfonilureia ou insulina de longa ação: risco alto de recorrência.',
      'Hiperglicemia com hipotensão, febre ou dor torácica — procure o gatilho grave.',
      'Hipoglicemia que não corrige com glicose: pense em adrenal, hepatopatia e sepse.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Glicemia capilar alterada', nota:'Confirme o valor · avalie consciência · procure o gatilho'},
      {tipo:'decisao', rotulo:'Para que lado?', texto:'Hipoglicemia ou hiperglicemia?', ramos:[
        {rotulo:'Baixa', cor:'perigo', texto:'Corrija agora e reavalie em 15 min', nota:'Tiamina antes da glicose em etilista. Sulfonilureia e insulina lenta exigem observação prolongada'},
        {rotulo:'Alta', texto:'Gasometria, cetonemia, potássio e função renal'}]},
      {tipo:'decisao', rotulo:'Se alta: tem acidose ou cetose?', texto:'pH baixo, bicarbonato baixo, ânion gap alto, cetona positiva?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Cetoacidose — volume, potássio e depois insulina', nota:'Insulina só depois de K ≥ 3,3. Cetoacidose euglicêmica existe com inibidor de SGLT2'},
        {rotulo:'NÃO', texto:'Osmolaridade muito alta com rebaixamento? Pense em estado hiperosmolar'}]},
      {tipo:'passo', rotulo:'Sempre', texto:'Procure o fator precipitante: infecção, infarto, má adesão, corticoide, gestação, pancreatite', nota:'Tratar o número sem tratar o gatilho garante o retorno do paciente'},
      {tipo:'decisao', rotulo:'Reavaliação', texto:'Glicemia estável e paciente tolerando via oral?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Ajuste o esquema e programe a alta'},
        {rotulo:'NÃO', cor:'perigo', texto:'Mantenha internado e reveja o gatilho'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'UTI · enfermaria · observação prolongada · alta com ajuste e retorno'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Hipoglicemia:* glicemia laboratorial, função renal, hepatograma; considere cortisol se recorrente e sem causa.',
      '*Hiperglicemia:* gasometria, cetonemia ou cetonúria, sódio, potássio, cloro, função renal, osmolaridade, hemograma, ECG.',
      '*Sempre:* procure o foco infeccioso — urina, tórax, pele e pés.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não iniciar insulina na cetoacidose com potássio abaixo de 3,3 mEq/L.',
      'Não dar glicose ao etilista ou desnutrido sem tiamina.',
      'Não dar alta ao paciente que teve hipoglicemia por sulfonilureia ou insulina de longa ação após uma única correção.',
      'Não corrigir a hiperglicemia com insulina rápida isolada e mandar embora sem revisar o esquema de casa.',
      'Não descartar cetoacidose porque a glicemia está pouco elevada em quem usa inibidor de SGLT2.',
      'Não usar bicarbonato de rotina na cetoacidose.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Hipoglicemia: glicemia a cada 15 min até estabilizar, depois a cada hora enquanto em observação.',
      'Cetoacidose: glicemia horária; eletrólitos e gasometria a cada 2–4 h.',
      'Reavalie o potássio antes e durante a insulinoterapia.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* cetoacidose grave, estado hiperosmolar com rebaixamento, instabilidade.',
      '*Enfermaria:* cetoacidose leve a moderada, gatilho que exige tratamento venoso.',
      '*Observação prolongada:* hipoglicemia por sulfonilureia ou insulina de longa ação — no mínimo várias horas de vigilância.',
      '*Alta:* glicemia estável, tolerando via oral, gatilho tratado, esquema revisado e retorno marcado.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Hipoglicemia por sulfonilureia recorre por muitas horas: a alta precoce é armadilha clássica.',
      'Cetoacidose euglicêmica existe — o inibidor de SGLT2 esconde o número.',
      'Toda descompensação glicêmica sem explicação tem um gatilho: procure infecção e infarto.',
      'Hipoglicemia pode se apresentar como déficit focal e simular AVC.']}],
  condutas:['hipoglicemia','cetoacidose','estado-hiperosmolar','hiperglicemia-simples','sepse','insuficiencia-adrenal','hipercalemia'],
  atalhos:[{tipo:'calc',id:'ckd-epi',rotulo:'TFGe'},{tipo:'presc',id:'',rotulo:'Prescrições por quadro'}] },

/* ---------------------------------------------------------- 12 */
{ id:'sangramento', nome:'Sangramento', sub:'Hemorragia aguda', icone:'gota',
  tags:['sangramento','hemorragia','sangue','melena','hematemese','anticoagulado','epistaxe'],
  fonte:'Diretrizes brasileiras de hemorragia digestiva e de manejo de anticoagulantes', revisao:'09/2026',
  agora:['Dois acessos calibrosos, monitor, tipagem sanguínea e reserva de hemocomponentes.',
    'Avalie perfusão, não só a PA: o jovem compensa até desabar.',
    'Comprima o que der para comprimir.',
    '*Pergunte por anticoagulante e antiagregante* — e qual foi a última dose.',
    'Hemograma, coagulograma, função renal, lactato e gasometria.',
    'Se choque hemorrágico: acione o protocolo de transfusão maciça do serviço.'],
  naopode:[
    {dx:'Choque hemorrágico', pista:'Taquicardia e má perfusão antes da hipotensão. Volume não substitui hemostasia.', conduta:'hda'},
    {dx:'Varizes esofágicas', pista:'Cirrótico com hematêmese. Precisa de droga vasoativa esplâncnica, antibiótico profilático e endoscopia precoce.', conduta:'cirrose-descompensada'},
    {dx:'Sangramento em anticoagulado', pista:'Identifique a droga: a reversão é diferente para cada uma.', conduta:'hda'},
    {dx:'Gravidez ectópica rota', pista:'Mulher em idade fértil com dor e instabilidade — beta-HCG.', conduta:'sangramento-gestacao'},
    {dx:'Hemorragia pós-parto', pista:'Puérpera sangrando: índice de choque ≥ 0,9 já prevê transfusão. Ocitocina, massagem e ácido tranexâmico juntos.', conduta:'hemorragia-pos-parto'},
    {dx:'Aneurisma de aorta roto', pista:'Idoso, dor lombar ou abdominal, hipotensão, massa pulsátil.', conduta:'sindrome-aortica'},
    {dx:'Hemorragia intracraniana', pista:'Cefaleia, déficit ou rebaixamento em quem usa anticoagulante, mesmo após trauma leve.', conduta:'avc-hemorragico'},
    {dx:'Hemoptise maciça', pista:'Risco é asfixia, não anemia. Decúbito lateral com o pulmão sangrante para baixo.', conduta:'hemoptise'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Taquicardia, palidez, sudorese ou enchimento capilar lento — mesmo com PA normal.',
      'Hematêmese volumosa, melena com instabilidade, ou hematoquezia com repercussão.',
      'Uso de anticoagulante, antiagregante duplo ou hepatopatia.',
      'Sangramento com rebaixamento — hemorragia intracraniana ou choque.',
      'Hemoglobina em queda rápida, ou lactato elevado.',
      'Sangramento em múltiplos sítios — pense em coagulopatia.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Sangramento agudo', nota:'Dois acessos · tipagem e reserva · comprimir · perguntar por anticoagulante'},
      {tipo:'decisao', rotulo:'Primeiro filtro', texto:'Está instável ou tem sinal de hipoperfusão?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Ressuscitação com hemocomponentes e hemostasia urgente', nota:'Cristaloide em excesso dilui a coagulação — o tratamento do choque hemorrágico é sangue e controle do foco'},
        {rotulo:'NÃO', texto:'Localize a fonte e estratifique'}]},
      {tipo:'decisao', rotulo:'Está anticoagulado?', texto:'Qual droga e quando foi a última dose?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Reversão específica conforme o agente', nota:'Cada anticoagulante tem antídoto e estratégia própria — confirme na conduta antes de prescrever'},
        {rotulo:'NÃO', texto:'Avalie coagulopatia adquirida: hepatopatia, plaquetopenia, sepse'}]},
      {tipo:'decisao', rotulo:'Onde é a fonte?', texto:'Digestiva alta, baixa, respiratória, ginecológica, urinária, externa?', ramos:[
        {rotulo:'Digestiva alta', texto:'Endoscopia; inibidor de bomba; se cirrótico, vasoativo esplâncnico e antibiótico'},
        {rotulo:'Digestiva baixa', texto:'Estabilizar, colonoscopia ou angio-TC conforme o volume'},
        {rotulo:'Respiratória', cor:'perigo', texto:'Proteger a via aérea; decúbito lateral do lado sangrante'},
        {rotulo:'Outra', texto:'Compressão, especialidade, imagem dirigida'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'Centro cirúrgico/endoscopia · UTI · enfermaria · observação'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* hemograma, coagulograma, tipagem e prova cruzada, função renal, eletrólitos, lactato, gasometria.',
      '*Se hepatopata:* hepatograma, albumina, plaquetas, amônia se houver encefalopatia.',
      '*Beta-HCG* em mulher em idade fértil.',
      '*Imagem:* endoscopia, colonoscopia, angio-TC ou arteriografia conforme o sítio e a estabilidade.',
      'Atenção: a hemoglobina inicial pode estar falsamente normal no sangramento agudo, antes da hemodiluição.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não usar a hemoglobina inicial para excluir sangramento importante.',
      'Não inundar de cristaloide o paciente em choque hemorrágico — dilui fatores e piora a coagulopatia.',
      'Não deixar de perguntar o nome exato e o horário da última dose do anticoagulante.',
      'Não usar anti-inflamatório em quem sangra do trato digestivo.',
      'Não postergar a endoscopia no cirrótico com hematêmese.',
      'Não esquecer o antibiótico profilático no cirrótico com hemorragia digestiva.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Perfusão, FC, PA e nível de consciência a cada 15 min enquanto instável.',
      'Hemograma seriado, e lactato de controle.',
      'Reavalie após cada unidade transfundida e após a hemostasia.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* instabilidade, transfusão maciça, sangramento ativo não controlado, rebaixamento.',
      '*Internação:* sangramento digestivo com repercussão, anticoagulado que precisou de reversão, anemia sintomática.',
      '*Observação:* sangramento controlado com hemoglobina estável e sem repercussão.',
      '*Alta:* apenas em sangramento menor, autolimitado, sem anticoagulação de risco, com hemoglobina estável e retorno programado.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'O jovem mantém PA normal até perder muito volume — confie na frequência cardíaca e na perfusão.',
      'Melena pode aparecer horas depois; a ausência dela não exclui sangramento alto.',
      'Anticoagulado com trauma craniano leve e exame normal ainda precisa de tomografia e de observação.',
      'Sangramento em vários sítios ao mesmo tempo raramente é local: pense em coagulopatia sistêmica.']}],
  condutas:['hda','hdb','cirrose-descompensada','hemoptise','avc-hemorragico','sindrome-aortica','choque-abordagem','trauma-abdominal'],
  atalhos:[{tipo:'calc',id:'shock-index',rotulo:'Shock index'},{tipo:'calc',id:'ckd-epi',rotulo:'TFGe'}] },

/* ---------------------------------------------------------- 13 */
{ id:'vomito-diarreia', nome:'Vômitos e diarreia', sub:'Gastroenterite e desidratação', icone:'estomago',
  tags:['vomito','nausea','diarreia','gastroenterite','desidratacao','enjoo','virose'],
  fonte:'Diretrizes brasileiras de diarreia aguda e reidratação', revisao:'09/2026',
  agora:['Avalie o grau de desidratação: mucosas, turgor, enchimento capilar, débito urinário e nível de consciência.',
    'Antiemético e reidratação — oral se tolera, venosa se não tolera ou está desidratado.',
    'Glicemia, eletrólitos e função renal se há vômito prolongado, idoso, diabético ou renal.',
    'Pergunte: há quanto tempo, há sangue, há febre, quem mais está doente em casa, viagem, antibiótico recente.',
    'Em toda mulher em idade fértil: beta-HCG.'],
  naopode:[
    {dx:'Abdome cirúrgico', pista:'Vômito com dor intensa, distensão, parada de eliminação. Vômito não é sempre gastroenterite.', conduta:'obstrucao-intestinal'},
    {dx:'Cetoacidose diabética', pista:'Vômito com hiperglicemia e taquipneia.', conduta:'cetoacidose'},
    {dx:'Infarto de parede inferior', pista:'Náusea e vômito com sudorese em paciente com fator de risco. ECG.', conduta:'sca-com-supra'},
    {dx:'Hipertensão intracraniana', pista:'Vômito em jato, sem náusea prévia, com cefaleia.', conduta:'hipertensao-intracraniana'},
    {dx:'Colite por C. difficile', pista:'Diarreia após antibiótico, com febre e leucocitose.', conduta:'diarreia-aguda'},
    {dx:'Insuficiência adrenal', pista:'Vômito com hipotensão, hiponatremia e hipercalemia.', conduta:'insuficiencia-adrenal'},
    {dx:'Intoxicação', pista:'Vômito precoce após ingestão; sempre pergunte sobre medicamentos e substâncias.', conduta:'intoxicado-abordagem'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Desidratação grave: hipotensão, taquicardia, oligúria, rebaixamento.',
      'Diarreia com sangue, febre alta ou dor abdominal intensa.',
      'Vômito em jato com cefaleia — pense em causa neurológica.',
      'Vômito persistente com incapacidade de hidratação oral.',
      'Idoso, gestante, imunossuprimido, renal crônico ou diabético.',
      'Antibiótico nas últimas semanas — pense em C. difficile.',
      'Sinais de abdome cirúrgico: distensão, parada de eliminação, defesa.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Vômitos e/ou diarreia aguda', nota:'Grau de desidratação · sinais vitais · beta-HCG na mulher em idade fértil'},
      {tipo:'decisao', rotulo:'Primeiro filtro', texto:'Há desidratação grave, instabilidade ou abdome cirúrgico?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Reidratação venosa, exames e avaliação cirúrgica se indicado'},
        {rotulo:'NÃO', texto:'Reidratação e antiemético, com reavaliação'}]},
      {tipo:'decisao', rotulo:'A diarreia é inflamatória?', texto:'Sangue, muco, febre alta, dor intensa?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Coproscopia, hemograma, e antibiótico apenas se houver indicação clara', nota:'Considere C. difficile se houve antibiótico recente'},
        {rotulo:'NÃO', cor:'ok', texto:'Provável diarreia aquosa autolimitada', nota:'Reidratação é o tratamento. Antibiótico não é rotina'}]},
      {tipo:'decisao', rotulo:'Reavaliação em 1–2 h', texto:'Tolerou a via oral e melhorou?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Alta com sal de reidratação oral e orientação escrita'},
        {rotulo:'NÃO', cor:'perigo', texto:'Mantenha em observação, reveja o diagnóstico e considere internação'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'Internação · observação · alta com reidratação oral e retorno'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Quadro leve em adulto hígido:* nenhum exame de rotina.',
      '*Com red flag:* hemograma, função renal, sódio, potássio, glicemia, gasometria, PCR.',
      '*Diarreia inflamatória:* coproscopia, coprocultura, pesquisa de toxina de C. difficile se houve antibiótico recente.',
      '*Suspeita de causa não gastrointestinal:* ECG, beta-HCG, tomografia de crânio, cetonemia.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não usar antibiótico de rotina na diarreia aquosa aguda.',
      'Não usar antidiarreico que reduz a motilidade na diarreia com sangue, febre alta ou suspeita de C. difficile.',
      'Não tratar como virose o vômito com dor abdominal intensa, distensão ou cefaleia.',
      'Não dispensar sem tentar reidratação oral supervisionada no serviço.',
      'Não esquecer de checar eletrólitos no idoso com vômito prolongado e no paciente em uso de diurético.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Após 1–2 h: tolerância à via oral, débito urinário, sinais vitais.',
      'Reavalie o abdome antes da alta.',
      'Se em reidratação venosa: eletrólitos de controle conforme o volume infundido.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*Internação:* desidratação grave, incapacidade de via oral, distúrbio eletrolítico importante, comorbidade descompensada, suspeita cirúrgica.',
      '*Observação:* resposta parcial, idoso, necessidade de hidratação venosa curta.',
      '*Alta:* tolerando líquidos, hidratado, sem red flag, com sal de reidratação oral e sinais de alarme escritos.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      '"Virose" é diagnóstico de exclusão em idoso, diabético e gestante.',
      'Vômito sem diarreia levanta muito mais suspeita de causa não gastrointestinal.',
      'Diarreia após antibiótico é C. difficile até que se prove o contrário quando há febre e leucocitose.',
      'Reidratação oral supervisionada resolve a maioria dos casos e evita internação desnecessária.']}],
  condutas:['diarreia-aguda','gastroenterite-pedia','desidratacao-crianca','obstrucao-intestinal','cetoacidose','abdome-agudo','hiponatremia','hipocalemia'],
  atalhos:[{tipo:'presc',id:'',rotulo:'Prescrições por quadro'},{tipo:'atb',id:'gastrointestinal',rotulo:'ATB gastrointestinal'}] },

/* ---------------------------------------------------------- 14 */
{ id:'tontura', nome:'Tontura e vertigem', sub:'Central x periférica', icone:'mente',
  tags:['tontura','vertigem','labirintite','desequilibrio','zonzo','rodando'],
  fonte:'Diretrizes de vertigem aguda e protocolos de AVC de fossa posterior', revisao:'09/2026',
  agora:['Sinais vitais com PA deitado e em pé, glicemia e ECG.',
    'Separe: *é vertigem (rodando), pré-síncope, desequilíbrio ou inespecífica?*',
    'Exame neurológico completo, incluindo marcha, dismetria e nistagmo.',
    'Se vertigem contínua e aguda: aplique o exame oculomotor de três passos à beira do leito.',
    'Pesquise déficit focal, disartria, disfagia, diplopia e ataxia — os sinais de fossa posterior.'],
  naopode:[
    {dx:'AVC de fossa posterior', pista:'Vertigem com ataxia de tronco, nistagmo que muda de direção, ou incapacidade de andar sem apoio.', conduta:'avc-isquemico'},
    {dx:'Dissecção vertebral', pista:'Vertigem com cervicalgia ou cefaleia occipital, após trauma ou manipulação cervical.', conduta:'avc-isquemico'},
    {dx:'Arritmia / pré-síncope', pista:'Tontura como escurecimento visual, não como rotação. ECG.', conduta:'sincope'},
    {dx:'Anemia ou sangramento', pista:'Tontura postural com palidez ou melena.', conduta:'hda'},
    {dx:'Hipoglicemia', pista:'Sempre a glicemia primeiro.', conduta:'hipoglicemia'},
    {dx:'Intoxicação medicamentosa', pista:'Anticonvulsivante, sedativo, aminoglicosídeo, lítio. Revise a receita.', conduta:'intoxicado-abordagem'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Incapacidade de andar sem apoio.',
      'Nistagmo vertical, ou que muda de direção com o olhar.',
      'Qualquer déficit neurológico associado: disartria, diplopia, disfagia, ataxia de membros, dormência facial.',
      'Cefaleia ou cervicalgia intensa junto com a vertigem.',
      'Início súbito em paciente com fator de risco vascular.',
      'Surdez súbita associada.',
      'Tontura como escurecimento visual, sugerindo pré-síncope.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Paciente com tontura', nota:'PA deitado e em pé · glicemia · ECG · exame neurológico com marcha'},
      {tipo:'decisao', rotulo:'Que tipo de tontura?', texto:'Como o paciente descreve?', ramos:[
        {rotulo:'Rodando', texto:'Vertigem — siga o exame oculomotor'},
        {rotulo:'Escurecendo', cor:'perigo', texto:'Pré-síncope — investigue como síncope', nota:'ECG, anemia, volemia, medicação, arritmia'},
        {rotulo:'Desequilíbrio', texto:'Marcha, polineuropatia, medicação, causa central'}]},
      {tipo:'decisao', rotulo:'Se vertigem: qual o padrão?', texto:'É desencadeada por movimento e dura segundos, ou é contínua há horas?', ramos:[
        {rotulo:'Episódica ao movimento', cor:'ok', texto:'Provável VPPB — manobra diagnóstica e terapêutica'},
        {rotulo:'Contínua e aguda', cor:'perigo', texto:'Exame oculomotor de três passos — separa periférico de central', nota:'Achado central em qualquer um dos três passos exige imagem e protocolo de AVC'}]},
      {tipo:'decisao', rotulo:'Consegue andar sem apoio?', texto:'Teste a marcha antes de decidir a alta', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Periférico é mais provável'},
        {rotulo:'NÃO', cor:'perigo', texto:'Trate como central até prova em contrário', nota:'Ataxia de tronco é o sinal mais útil à beira do leito'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'Protocolo de AVC · internação · alta com manobra e sintomático'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* glicemia, ECG, PA ortostática.',
      '*Se suspeita central:* ressonância com difusão é o exame de escolha; a tomografia tem baixa sensibilidade para fossa posterior nas primeiras horas.',
      '*Se pré-síncope:* hemograma, eletrólitos, troponina conforme o caso.',
      '*Revise a prescrição* em todo idoso com tontura.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não usar tomografia de crânio normal para excluir AVC de fossa posterior.',
      'Não rotular como labirintite sem examinar a marcha e o nistagmo.',
      'Não manter sedativo vestibular por muitos dias — atrasa a compensação central.',
      'Não dar alta a quem não consegue deambular com segurança.',
      'Não esquecer a PA ortostática e a revisão da receita no idoso.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Teste a marcha antes de qualquer decisão de alta.',
      'Reavalie o nistagmo após o tratamento sintomático.',
      'Retorno imediato se surgir déficit, cefaleia intensa, vômito incoercível ou piora da marcha.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*Protocolo de AVC / internação:* qualquer sinal central, incapacidade de deambular, surdez súbita associada, cefaleia ou cervicalgia importante.',
      '*Observação:* vertigem intensa com vômitos, sem sinal central mas sem tolerância à via oral.',
      '*Alta:* padrão periférico claro, deambula com segurança, sintomático prescrito, manobra realizada quando indicada, retorno orientado.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'A pergunta útil não é "como é a tontura", é "quando começou, o que desencadeia e quanto dura".',
      'AVC de fossa posterior pode se apresentar apenas com vertigem isolada — o exame da marcha é o filtro mais barato.',
      'Nistagmo que muda de direção com a mudança do olhar é central.',
      'Idoso com tontura: a causa está na receita com muito mais frequência do que no labirinto.']}],
  condutas:['vertigem','avc-isquemico','sincope','hipoglicemia','bradiarritmia','delirium'],
  atalhos:[{tipo:'conduta',id:'ecg-leitura',rotulo:'Leitura do ECG'}] },

/* ---------------------------------------------------------- 15 */
{ id:'edema', nome:'Inchaço', sub:'Edema agudo de membro e edema generalizado', icone:'osso',
  tags:['edema','inchaco','perna inchada','anasarca','panturrilha','tvp'],
  fonte:'Diretrizes brasileiras de tromboembolismo venoso e de insuficiência cardíaca', revisao:'09/2026',
  agora:['Determine se é *unilateral ou bilateral* — é o que separa os dois mundos.',
    'Sinais vitais com SpO2: edema de membro com dispneia ou taquicardia levanta TEP.',
    'Meça as panturrilhas e procure sinais inflamatórios.',
    'Se bilateral: avalie congestão, jugular, ausculta, peso e função renal.',
    'Pergunte por imobilização, cirurgia recente, câncer, gestação, hormônio e trombose prévia.'],
  naopode:[
    {dx:'Trombose venosa profunda', pista:'Edema unilateral com dor e empastamento. Aplique Wells e peça ultrassom com doppler.', conduta:'tvp'},
    {dx:'Tromboembolismo pulmonar', pista:'Edema de membro com dispneia, taquicardia ou dor pleurítica.', conduta:'tep'},
    {dx:'Infecção necrotizante', pista:'Dor desproporcional, bolhas, crepitação, evolução em horas, toxemia.', conduta:'fasciite-necrotizante'},
    {dx:'Síndrome compartimental', pista:'Dor desproporcional, dor ao estiramento passivo, parestesia, após trauma ou reperfusão.', conduta:'sindrome-compartimental'},
    {dx:'Insuficiência cardíaca descompensada', pista:'Edema bilateral com ortopneia, estertores e jugular túrgida.', conduta:'eap-ic-descompensada'},
    {dx:'Angioedema', pista:'Edema de face, lábios ou língua; uso de inibidor da ECA. Risco de via aérea.', conduta:'anafilaxia'},
    {dx:'Síndrome nefrótica / hepatopatia', pista:'Anasarca com proteinúria maciça ou com ascite e estigmas hepáticos.', conduta:'cirrose-descompensada'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Edema unilateral agudo com dor — trombose até prova em contrário.',
      'Dor desproporcional ao exame, bolhas ou crepitação — infecção necrotizante ou síndrome compartimental.',
      'Edema com dispneia, dor torácica ou hipoxemia — TEP.',
      'Edema de face, lábios ou língua, ou estridor — risco de via aérea.',
      'Anasarca com oligúria — pense em lesão renal aguda e síndrome nefrótica.',
      'Edema com febre e toxemia.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Paciente com edema', nota:'Unilateral ou bilateral? · sinais vitais com SpO2 · procurar sinais inflamatórios'},
      {tipo:'decisao', rotulo:'Distribuição', texto:'É de um lado só ou dos dois?', ramos:[
        {rotulo:'Unilateral', cor:'perigo', texto:'TVP · celulite · necrotizante · compartimental · linfedema', nota:'Aplique Wells para TVP e peça doppler'},
        {rotulo:'Bilateral', texto:'IC · renal · hepático · medicamentoso · venoso crônico'},
        {rotulo:'Face / lábios', cor:'perigo', texto:'Angioedema — cheque via aérea agora', nota:'Inibidor da ECA é causa frequente e pode aparecer anos após o início'}]},
      {tipo:'decisao', rotulo:'Se unilateral com dor intensa', texto:'A dor é desproporcional ao exame?', ramos:[
        {rotulo:'SIM', cor:'perigo', texto:'Cirurgia agora: necrotizante ou síndrome compartimental', nota:'Não espere imagem para chamar o cirurgião'},
        {rotulo:'NÃO', texto:'Siga a investigação de TVP e celulite'}]},
      {tipo:'passo', rotulo:'Sempre procure repercussão', texto:'SpO2, dispneia, taquicardia — TEP acompanha TVP', nota:'Edema de membro com hipoxemia inexplicada é angio-TC'},
      {tipo:'fim', rotulo:'Disposição', texto:'Centro cirúrgico · internação · anticoagulação ambulatorial · alta com seguimento'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Unilateral:* Wells para TVP, D-dímero se probabilidade baixa/intermediária, ultrassom com doppler venoso.',
      '*Bilateral:* função renal, sódio, albumina, urina tipo I com proteinúria, hepatograma, BNP/NT-proBNP, raio-X de tórax, ECG.',
      '*Se suspeita de necrotizante:* hemograma, PCR, lactato, função renal — e avaliação cirúrgica imediata, sem esperar exame.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não usar D-dímero para excluir TVP em paciente de alta probabilidade.',
      'Não diagnosticar celulite bilateral simétrica sem antes considerar dermatite de estase e insuficiência venosa.',
      'Não esperar imagem para acionar a cirurgia na suspeita de infecção necrotizante.',
      'Não usar diurético como resposta automática a todo edema — no nefrótico e no hipovolêmico pode piorar.',
      'Não deixar de checar a via aérea no angioedema de face e língua.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'Perímetro do membro e a dor, após o tratamento inicial.',
      'SpO2 e frequência respiratória, procurando TEP.',
      'Função renal e eletrólitos após diurético.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*Centro cirúrgico:* infecção necrotizante, síndrome compartimental.',
      '*Internação:* TVP proximal com repercussão ou com risco de sangramento, IC descompensada, anasarca com lesão renal, angioedema com risco de via aérea.',
      '*Alta com anticoagulação:* TVP distal ou proximal selecionada, paciente estável, com seguimento garantido.',
      '*Alta:* edema crônico sem sinal agudo, com orientação e retorno.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Celulite verdadeiramente bilateral é rara: pense em dermatite de estase.',
      'TVP e TEP são a mesma doença — sempre procure a repercussão pulmonar.',
      'Angioedema por inibidor da ECA pode surgir anos depois do início do medicamento.',
      'Cisto de Baker roto imita TVP e é diagnóstico do ultrassom, não do exame físico.']}],
  condutas:['tvp','tep','celulite-erisipela','fasciite-necrotizante','eap-ic-descompensada','sindrome-compartimental','lesao-renal-aguda','cirrose-descompensada','anafilaxia'],
  atalhos:[{tipo:'score',id:'wells-tvp',rotulo:'Wells — TVP'},{tipo:'score',id:'wells-tep',rotulo:'Wells — TEP'},{tipo:'atb',id:'pele',rotulo:'ATB pele e partes moles'}] },

/* ---------------------------------------------------------- 16 */
{ id:'agitacao', nome:'Agitação', sub:'Paciente agitado ou agressivo', icone:'mente',
  tags:['agitacao','agressivo','delirium','contencao','psicomotora','surto','confuso agitado'],
  fonte:'Diretrizes brasileiras de agitação psicomotora e de delirium', revisao:'09/2026',
  agora:['*Segurança primeiro:* ambiente, equipe suficiente, rota de saída livre, retirar objetos de risco.',
    '*Glicemia capilar* — hipoglicemia agita.',
    'Sinais vitais, SpO2 e temperatura assim que for seguro obtê-los.',
    'Tente a abordagem verbal antes da contenção física ou química.',
    'Procure causa orgânica antes de assumir causa psiquiátrica: hipóxia, dor, retenção urinária, infecção, abstinência, droga, trauma craniano.',
    'Se contenção física for necessária, ela é temporária, com registro, monitorização e reavaliação frequente.'],
  naopode:[
    {dx:'Hipoglicemia', pista:'Reversível em minutos. Sempre a primeira medida.', conduta:'hipoglicemia'},
    {dx:'Hipóxia', pista:'Agitação é sinal precoce de hipóxia, antes da cianose.', conduta:'insuficiencia-respiratoria'},
    {dx:'Delirium por causa orgânica', pista:'Início agudo, flutuante, com desatenção. Infecção, medicação e distúrbio metabólico lideram.', conduta:'delirium'},
    {dx:'Abstinência alcoólica / delirium tremens', pista:'Tremor, sudorese, taquicardia, alucinação, 48–96 h após a última dose. Alta mortalidade sem tratamento.', conduta:'abstinencia-alcool'},
    {dx:'Intoxicação por estimulante', pista:'Midríase, taquicardia, hipertensão, hipertermia. Cuidado com neuroléptico aqui.', conduta:'cocaina-estimulantes'},
    {dx:'Trauma craniano', pista:'Agitação após queda ou trauma, principalmente em anticoagulado ou etilista.', conduta:'tce'},
    {dx:'Encefalopatia hepática ou urêmica', pista:'Cirrótico ou renal crônico agitado, com flapping.', conduta:'cirrose-descompensada'},
    {dx:'Síndrome serotoninérgica / neuroléptica maligna', pista:'Agitação com hipertermia e rigidez. O neuroléptico piora.', conduta:'sindrome-serotoninergica'}],
  secoes:[
    {tipo:'alerta', titulo:'Red flags', itens:[
      'Início agudo em paciente sem história psiquiátrica prévia — é orgânico até prova em contrário.',
      'Idade acima de 65 anos, ou abaixo de 12.',
      'Alteração de sinais vitais, febre ou hipoxemia.',
      'Desorientação, flutuação do nível de consciência ou alucinação visual — fala a favor de delirium orgânico.',
      'Sinal neurológico focal, ou trauma craniano recente.',
      'Hipertermia com rigidez muscular.',
      'Risco imediato de agressão a si ou a terceiros.']},
    {tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
      {tipo:'inicio', rotulo:'Entrada', texto:'Paciente agitado ou agressivo', nota:'Segurança da equipe · glicemia · sinais vitais · abordagem verbal'},
      {tipo:'decisao', rotulo:'Primeiro filtro', texto:'Há causa orgânica evidente e reversível?', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Trate a causa: glicose, oxigênio, analgesia, esvaziamento vesical, tiamina', nota:'A agitação costuma ceder junto com a causa'},
        {rotulo:'NÃO', texto:'Continue a abordagem enquanto investiga'}]},
      {tipo:'decisao', rotulo:'A abordagem verbal funcionou?', texto:'Tom calmo, ambiente reservado, oferta de conforto e de escolhas', ramos:[
        {rotulo:'SIM', cor:'ok', texto:'Mantenha a supervisão e investigue a causa'},
        {rotulo:'NÃO', cor:'perigo', texto:'Contenção química, e física apenas se indispensável', nota:'A escolha do fármaco depende da causa suspeita — confira na conduta específica'}]},
      {tipo:'passo', rotulo:'Investigação mínima', texto:'Glicemia, eletrólitos, função renal, hemograma, urina, gasometria, ECG', nota:'Tomografia de crânio se há trauma, déficit focal, anticoagulação ou primeira apresentação no idoso'},
      {tipo:'decisao', rotulo:'Após a sedação', texto:'Reavaliação em 15–30 min', ramos:[
        {rotulo:'Calmo e estável', cor:'ok', texto:'Retire a contenção física assim que possível'},
        {rotulo:'Ainda agitado', cor:'perigo', texto:'Reveja a causa antes de simplesmente aumentar a dose', nota:'Agitação refratária costuma ser causa orgânica não tratada'}]},
      {tipo:'fim', rotulo:'Disposição', texto:'UTI · internação clínica · internação psiquiátrica · alta com acompanhante e seguimento'}]},
    {tipo:'lista', titulo:'O que pedir', itens:[
      '*Sempre:* glicemia, sinais vitais completos, SpO2, temperatura.',
      '*Na maioria:* hemograma, sódio, potássio, cálcio, função renal, hepatograma, urina tipo I, ECG.',
      '*Conforme a suspeita:* gasometria, amônia, TSH, screening toxicológico, alcoolemia, tomografia de crânio, punção lombar.',
      '*Sempre pergunte:* medicações, álcool, drogas, última dose, mudanças recentes de prescrição.']},
    {tipo:'naofazer', titulo:'Não fazer', itens:[
      'Não sedar antes de checar glicemia, oxigenação, dor e retenção urinária.',
      'Não assumir causa psiquiátrica em primeira apresentação no idoso.',
      'Não usar contenção física sem monitorização, sem registro e sem prazo de reavaliação.',
      'Não usar neuroléptico como primeira escolha na abstinência alcoólica — abaixa o limiar convulsivo.',
      'Não usar neuroléptico na síndrome neuroléptica maligna nem na hipertermia com rigidez.',
      'Não deixar o paciente contido sozinho, nem em decúbito ventral.']},
    {tipo:'lista', titulo:'Reavaliar', itens:[
      'A cada 15 min após a sedação: nível de consciência, via aérea, SpO2, PA e FC.',
      'Reavalie a necessidade da contenção física a cada reavaliação — o objetivo é retirá-la o quanto antes.',
      'Reveja o diagnóstico se a agitação não cede com a dose habitual.']},
    {tipo:'lista', titulo:'Internação x alta', itens:[
      '*UTI:* necessidade de sedação profunda, depressão respiratória, hipertermia grave, delirium tremens grave.',
      '*Internação clínica:* delirium com causa orgânica que exige tratamento hospitalar.',
      '*Internação psiquiátrica:* risco a si ou a terceiros com causa orgânica afastada, conforme a avaliação da especialidade.',
      '*Alta:* causa reversível tratada, paciente orientado, sem risco imediato, com acompanhante e seguimento marcado.']},
    {tipo:'dica', titulo:'Armadilhas do plantão', itens:[
      'Primeira "crise psiquiátrica" depois dos 65 anos é doença orgânica até prova em contrário.',
      'Alucinação visual sugere causa orgânica; auditiva pura sugere causa psiquiátrica.',
      'Retenção urinária e fecaloma são causas frequentes e completamente reversíveis de agitação no idoso.',
      'A dose que acalma o etilista em abstinência é maior do que a habitual — e o fármaco de escolha é diferente.']}],
  condutas:['agitacao-psicomotora','delirium','abstinencia-alcool','surto-psicotico','risco-suicidio','hipoglicemia','cocaina-estimulantes','sindrome-serotoninergica','tce','sedacao-analgesia'],
  atalhos:[{tipo:'score',id:'glasgow',rotulo:'Escala de Glasgow'},{tipo:'conduta',id:'sedacao-analgesia',rotulo:'Sedação e analgesia'}] }

];
