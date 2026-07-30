/**
 * Transcrição do documento "ONBOARDING E BRIEFING ESTRATÉGICO —
 * Marketing • Social Media • Meta Ads • Google Ads".
 *
 * Duas decisões deliberadas em relação ao documento original:
 *
 * 1. As seções 36 e 37 ficaram de fora. O próprio documento as marca como
 *    "CHECKLIST TÉCNICO INTERNO" e "USO INTERNO" — são o trabalho da equipe
 *    depois de receber o briefing, não perguntas ao cliente.
 * 2. Blocos que são cadastro puro (redes sociais, atributos demográficos)
 *    viraram um campo único com o apoio listando o que preencher. Seis telas
 *    seguidas pedindo um link cada cansam sem acrescentar nada.
 *
 * O documento traz uma ORIENTAÇÃO DE SEGURANÇA que é respeitada aqui:
 * **nenhuma pergunta pede senha**. As de acesso perguntam quem administra a
 * conta, nunca a credencial.
 */

import type { Answers, BriefingForm, Question, Section } from '@/types/briefing';

const answeredAs = (questionId: string, ...values: string[]) => (answers: Answers) => {
  const current = answers[questionId];
  return typeof current === 'string' && values.includes(current);
};

const notAnsweredAs = (questionId: string, ...values: string[]) => (answers: Answers) => {
  const current = answers[questionId];
  return !(typeof current === 'string' && values.includes(current));
};

const sections: readonly Section[] = [
  { id: 1, label: '01', title: 'Dados do responsável', intro: 'Com quem vamos falar no dia a dia.' },
  { id: 2, label: '02', title: 'A empresa', intro: 'O básico e a história por trás dela.' },
  { id: 3, label: '03', title: 'Essência e posicionamento', intro: 'O que a marca é, e como quer ser vista.' },
  { id: 4, label: '04', title: 'Produtos e serviços', intro: 'O que vocês vendem, e o que importa vender.' },
  { id: 5, label: '05', title: 'Público e cliente ideal', intro: 'Para quem falamos.' },
  { id: 6, label: '06', title: 'Diferenciais', intro: 'Por que escolhem vocês.' },
  { id: 7, label: '07', title: 'Concorrência e mercado', intro: 'O entorno.' },
  { id: 8, label: '08', title: 'Histórico de marketing', intro: 'O que já foi tentado antes.' },
  { id: 9, label: '09', title: 'Objetivos de marketing', intro: 'Onde queremos chegar.' },
  { id: 10, label: '10', title: 'Processo comercial e vendas', intro: 'Do primeiro contato até a venda.' },
  { id: 11, label: '11', title: 'Números do negócio', intro: 'Sem número não há estratégia.' },
  { id: 12, label: '12', title: 'Social media', intro: 'As redes e o que já funcionou nelas.' },
  { id: 13, label: '13', title: 'Tom de voz', intro: 'Como a marca fala.' },
  { id: 14, label: '14', title: 'Identidade visual', intro: 'O material que já existe.' },
  { id: 15, label: '15', title: 'Produção de conteúdo', intro: 'Quem aparece, onde gravamos.' },
  { id: 16, label: '16', title: 'Campanhas e datas', intro: 'O calendário do negócio.' },
  { id: 17, label: '17', title: 'Tráfego pago — histórico', intro: 'O que já foi anunciado.' },
  { id: 18, label: '18', title: 'Investimento em mídia', intro: 'Quanto há para investir.' },
  { id: 19, label: '19', title: 'Meta Ads — estrutura', intro: 'O que já está montado na Meta.' },
  { id: 20, label: '20', title: 'Google Ads', intro: 'O que já existe no Google.' },
  { id: 21, label: '21', title: 'Perfil da empresa no Google', intro: 'A vitrine local.' },
  { id: 22, label: '22', title: 'Site e conversão', intro: 'Onde o cliente vira contato.' },
  { id: 23, label: '23', title: 'Analytics e mensuração', intro: 'O que dá para medir hoje.' },
  { id: 24, label: '24', title: 'Leads e atendimento', intro: 'O que acontece depois do clique.' },
  { id: 25, label: '25', title: 'Métricas comerciais', intro: 'Os números que definem o quanto investir.' },
  { id: 26, label: '26', title: 'Segmentação dos anúncios', intro: 'Para quem e onde anunciar.' },
  { id: 27, label: '27', title: 'Oferta e estratégia', intro: 'O que vamos colocar na frente primeiro.' },
  { id: 28, label: '28', title: 'Reputação e prova social', intro: 'O que outros já dizem de vocês.' },
  { id: 29, label: '29', title: 'Fundador e humanização', intro: 'A pessoa por trás da empresa.' },
  { id: 30, label: '30', title: 'Acessos e ativos digitais', intro: 'O que precisamos acessar — nunca senhas.' },
  { id: 31, label: '31', title: 'Materiais', intro: 'O que já existe pronto.' },
  { id: 32, label: '32', title: 'Aprovação e rotina', intro: 'Como vamos trabalhar juntos.' },
  { id: 33, label: '33', title: 'Expectativas', intro: 'O que precisa acontecer para dar certo.' },
  { id: 34, label: '34', title: 'Diagnóstico final', intro: 'Frases curtas, respostas instintivas.' },
  { id: 35, label: '35', title: 'Informações extras', intro: 'O que ficou de fora.' },
];

const questions: readonly Question[] = [
  // 01 | DADOS DO RESPONSÁVEL
  { id: 'resp_nome', section: 1, label: 'Qual é o seu nome completo?', type: 'shortText', required: true },
  { id: 'resp_apelido', section: 1, label: 'Como prefere ser chamado(a)?', type: 'shortText', required: false },
  { id: 'resp_cargo', section: 1, label: 'Qual é o seu cargo ou função na empresa?', type: 'shortText', required: true },
  { id: 'resp_whatsapp', section: 1, label: 'Qual é o seu WhatsApp?', type: 'phone', required: true, placeholder: '(00) 00000-0000' },
  { id: 'resp_email', section: 1, label: 'Qual é o seu e-mail?', type: 'email', required: true },
  { id: 'resp_contato_principal', section: 1, label: 'Quem será o principal contato durante o projeto?', type: 'shortText', required: true },
  { id: 'resp_outros_decisores', section: 1, label: 'Existe outra pessoa que participa das decisões de marketing?', helper: 'Informe nome e função.', type: 'longText', required: false },
  { id: 'resp_aprovador', section: 1, label: 'Quem será responsável por aprovar conteúdos e campanhas?', type: 'shortText', required: true },
  { id: 'resp_historia_fundador', section: 1, label: 'Existe alguma história ou característica do fundador que seja importante para a comunicação da marca?', type: 'longText', required: false },
  {
    id: 'resp_aparece_video', section: 1, label: 'Você se sente confortável aparecendo em vídeos e conteúdos?',
    type: 'radioCards', required: true,
    options: ['Sim', 'Não', 'Às vezes', 'Quero aparecer mais'],
  },

  // 02 | A EMPRESA
  { id: 'empresa_nome', section: 2, label: 'Qual é o nome da empresa?', type: 'shortText', required: true },
  { id: 'empresa_nome_redes', section: 2, label: 'Qual nome é utilizado nas redes sociais?', helper: 'Se for diferente do nome oficial.', type: 'shortText', required: false },
  { id: 'empresa_cnpj', section: 2, label: 'Qual é o CNPJ?', helper: 'Se aplicável. Usamos para verificação de contas de anúncio.', type: 'shortText', required: false },
  { id: 'empresa_cidade_estado', section: 2, label: 'Em qual cidade e estado a empresa está?', type: 'shortText', required: true },
  { id: 'empresa_endereco', section: 2, label: 'Qual é o endereço comercial?', helper: 'Deixe em branco se não houver ponto físico.', type: 'shortText', required: false },
  { id: 'empresa_whatsapp', section: 2, label: 'Qual é o telefone ou WhatsApp comercial?', type: 'phone', required: true },
  { id: 'empresa_site', section: 2, label: 'A empresa tem site? Qual o endereço?', type: 'shortText', required: false, placeholder: 'https://' },
  {
    id: 'empresa_redes', section: 2,
    label: 'Quais são os perfis da empresa nas redes sociais?',
    helper: 'Liste um por linha: Instagram, Facebook, TikTok, YouTube, LinkedIn e outros canais que usarem.',
    type: 'longText', required: true,
  },
  { id: 'empresa_fundacao', section: 2, label: 'Em que ano a empresa foi fundada?', type: 'shortText', required: false },
  { id: 'empresa_historia', section: 2, label: 'Conte a história da empresa. Como tudo começou?', type: 'longText', required: true },
  { id: 'empresa_por_que_criada', section: 2, label: 'Por que a empresa foi criada?', type: 'longText', required: true },
  { id: 'empresa_motivacao_fundador', section: 2, label: 'Qual foi a principal motivação do fundador?', type: 'longText', required: false },
  { id: 'empresa_segmento', section: 2, label: 'Qual é o principal segmento de atuação?', type: 'shortText', required: true },
  { id: 'empresa_explicacao_simples', section: 2, label: 'Como você explicaria o que sua empresa faz para alguém que nunca ouviu falar dela?', type: 'longText', required: true },
  { id: 'empresa_regioes', section: 2, label: 'Em quais cidades ou regiões vocês atendem?', type: 'shortText', required: true },
  { id: 'empresa_unidades', section: 2, label: 'A empresa possui unidade física? Quantas?', type: 'shortText', required: false },
  { id: 'empresa_equipe_tamanho', section: 2, label: 'Quantas pessoas trabalham atualmente na empresa?', type: 'shortText', required: false },
  { id: 'empresa_setores', section: 2, label: 'Quais são os principais setores ou equipes?', type: 'longText', required: false },

  // 03 | ESSÊNCIA E POSICIONAMENTO
  { id: 'essencia_proposito', section: 3, label: 'Qual é o propósito da empresa?', type: 'longText', required: true },
  { id: 'essencia_missao', section: 3, label: 'Qual é a missão da marca?', type: 'longText', required: false },
  { id: 'essencia_visao', section: 3, label: 'Qual é a visão da empresa para os próximos anos?', type: 'longText', required: false },
  { id: 'essencia_valores', section: 3, label: 'Quais valores são inegociáveis?', type: 'longText', required: true },
  { id: 'essencia_lembranca', section: 3, label: 'Como você gostaria que sua marca fosse lembrada?', type: 'longText', required: true },
  { id: 'essencia_marca_pessoa', section: 3, label: 'Se sua marca fosse uma pessoa, como ela seria?', type: 'longText', required: false },
  {
    id: 'essencia_caracteristicas', section: 3, label: 'Quais características representam a marca?',
    type: 'multiSelect', required: true, maxSelections: 5, otherOption: 'Outra',
    options: ['Sofisticada', 'Acessível', 'Moderna', 'Tradicional', 'Divertida', 'Séria', 'Técnica', 'Educativa', 'Próxima', 'Inspiradora', 'Premium', 'Popular', 'Inovadora', 'Exclusiva', 'Acolhedora', 'Outra'],
  },
  { id: 'essencia_caracteristicas_nao', section: 3, label: 'Quais características NÃO combinam com a marca?', type: 'longText', required: true },
  { id: 'essencia_frase', section: 3, label: 'Existe frase, lema ou conceito que represente a empresa?', type: 'shortText', required: false },
  { id: 'essencia_percepcao_atual', section: 3, label: 'Qual percepção você acredita que o público tem da empresa hoje?', type: 'longText', required: true },
  { id: 'essencia_percepcao_desejada', section: 3, label: 'Qual percepção você gostaria que tivesse?', type: 'longText', required: true },

  // 04 | PRODUTOS E SERVIÇOS
  {
    id: 'produtos_lista', section: 4, label: 'Liste os principais produtos ou serviços.',
    helper: 'Para cada um, informe nome, descrição, faixa de preço, público, benefício e diferencial. Um por parágrafo.',
    type: 'longText', required: true,
  },
  { id: 'produtos_mais_vendido', section: 4, label: 'Qual é o produto ou serviço mais vendido?', type: 'shortText', required: true },
  { id: 'produtos_maior_faturamento', section: 4, label: 'Qual gera maior faturamento?', type: 'shortText', required: false },
  { id: 'produtos_maior_margem', section: 4, label: 'Qual possui maior margem?', type: 'shortText', required: false },
  { id: 'produtos_vender_mais', section: 4, label: 'Qual produto ou serviço vocês gostariam de vender mais?', type: 'shortText', required: true },
  { id: 'produtos_nao_divulgar', section: 4, label: 'Existe algo que não é prioridade divulgar?', type: 'longText', required: false },
  { id: 'produtos_lancamentos', section: 4, label: 'Existem lançamentos previstos?', type: 'longText', required: false },
  { id: 'produtos_sazonais', section: 4, label: 'Existem produtos ou serviços sazonais?', type: 'longText', required: false },
  { id: 'produtos_argumentos', section: 4, label: 'Quais são os principais argumentos utilizados para vender?', type: 'longText', required: true },
  { id: 'produtos_duvidas', section: 4, label: 'Quais são as principais dúvidas antes da compra?', type: 'longText', required: true },
  { id: 'produtos_objecoes', section: 4, label: 'Quais são as principais objeções?', type: 'longText', required: true },

  // 05 | PÚBLICO E CLIENTE IDEAL
  { id: 'publico_quem_compra', section: 5, label: 'Quem mais compra de vocês atualmente?', type: 'longText', required: true },
  { id: 'publico_quem_desejado', section: 5, label: 'Quem vocês gostariam que comprasse?', type: 'longText', required: true },
  { id: 'publico_diferenca', section: 5, label: 'Existe diferença entre o público atual e o desejado?', type: 'longText', required: false },
  {
    id: 'publico_perfil', section: 5, label: 'Descreva o perfil desse cliente ideal.',
    helper: 'Faixa etária, localização, profissão, faixa de renda quando relevante, estilo de vida, interesses, hábitos e comportamento de compra.',
    type: 'longText', required: true,
  },
  { id: 'publico_problema', section: 5, label: 'Qual problema normalmente faz essa pessoa procurar sua empresa?', type: 'longText', required: true },
  { id: 'publico_desejo', section: 5, label: 'O que ela deseja conquistar ou resolver?', type: 'longText', required: true },
  { id: 'publico_medos', section: 5, label: 'Quais são seus maiores medos ou inseguranças antes de comprar?', type: 'longText', required: true },
  { id: 'publico_impedimento', section: 5, label: 'O que costuma impedir a compra?', type: 'longText', required: true },
  { id: 'publico_gatilho', section: 5, label: 'O que normalmente faz o cliente decidir comprar?', type: 'longText', required: true },
  {
    id: 'publico_velocidade_decisao', section: 5, label: 'O cliente pesquisa bastante ou decide rapidamente?',
    type: 'radioCards', required: false,
    options: ['Pesquisa bastante antes de decidir', 'Decide rapidamente', 'Depende do produto ou serviço'],
  },
  { id: 'publico_influenciadores_decisao', section: 5, label: 'Quem influencia essa decisão?', type: 'longText', required: false },
  { id: 'publico_onde_busca', section: 5, label: 'Onde esse público busca informações?', type: 'longText', required: false },
  { id: 'publico_redes', section: 5, label: 'Quais redes sociais esse público utiliza?', type: 'longText', required: false },
  {
    id: 'publico_perguntas_frequentes', section: 5, label: 'Liste pelo menos 5 perguntas que os clientes fazem repetidamente.',
    helper: 'Uma por linha. Estas perguntas viram conteúdo direto.',
    type: 'longText', required: true,
  },

  // 06 | DIFERENCIAIS
  { id: 'dif_por_que_voces', section: 6, label: 'Por que alguém deveria escolher sua empresa e não um concorrente?', type: 'longText', required: true },
  { id: 'dif_tres_maiores', section: 6, label: 'Quais são os 3 maiores diferenciais da empresa?', type: 'longText', required: true },
  { id: 'dif_exclusivo', section: 6, label: 'Existe metodologia, processo, tecnologia ou atendimento exclusivo?', type: 'longText', required: false },
  { id: 'dif_melhor_que_todos', section: 6, label: 'Existe algo que vocês fazem melhor que a maioria dos concorrentes?', type: 'longText', required: false },
  { id: 'dif_pouco_comunicado', section: 6, label: 'Existe alguma vantagem valorizada pelos clientes que vocês ainda comunicam pouco?', type: 'longText', required: false },
  { id: 'dif_elogio_frequente', section: 6, label: 'Qual elogio recebem com maior frequência?', type: 'longText', required: true },
  { id: 'dif_pos_compra', section: 6, label: 'O que os clientes normalmente dizem depois de comprar ou contratar?', type: 'longText', required: false },

  // 07 | CONCORRÊNCIA E MERCADO
  { id: 'conc_lista', section: 7, label: 'Informe de 3 a 5 concorrentes diretos.', helper: 'Nome e Instagram ou site, um por linha.', type: 'longText', required: true },
  { id: 'conc_fazem_bem', section: 7, label: 'O que cada concorrente faz bem?', type: 'longText', required: false },
  { id: 'conc_nao_gosta', section: 7, label: 'O que você não gosta na comunicação deles?', type: 'longText', required: true },
  { id: 'conc_por_que_escolhem', section: 7, label: 'Por que você acredita que o público escolhe esses concorrentes?', type: 'longText', required: false },
  { id: 'conc_referencia', section: 7, label: 'Quem você considera referência no segmento?', type: 'longText', required: false },
  { id: 'conc_admira_outros', section: 7, label: 'Quais marcas de outros segmentos têm comunicação que você admira? Por quê?', type: 'longText', required: false },
  { id: 'conc_tendencias', section: 7, label: 'Quais tendências você percebe no seu mercado?', type: 'longText', required: false },
  { id: 'conc_lacuna', section: 7, label: 'O que está faltando na comunicação das empresas do seu segmento?', type: 'longText', required: false },

  // 08 | HISTÓRICO DE MARKETING
  {
    id: 'hist_ja_trabalhou', section: 8, label: 'A empresa já trabalhou com marketing profissional?',
    type: 'radioCards', required: true, otherOption: 'Outros',
    options: ['Nunca', 'Profissional interno', 'Social media', 'Agência', 'Gestor de tráfego', 'Outros'],
  },
  { id: 'hist_experiencia', section: 8, label: 'Como foi essa experiência?', type: 'longText', required: false, showIf: notAnsweredAs('hist_ja_trabalhou', 'Nunca') },
  { id: 'hist_funcionou', section: 8, label: 'O que funcionou bem?', type: 'longText', required: false, showIf: notAnsweredAs('hist_ja_trabalhou', 'Nunca') },
  { id: 'hist_nao_funcionou', section: 8, label: 'O que não funcionou?', type: 'longText', required: false, showIf: notAnsweredAs('hist_ja_trabalhou', 'Nunca') },
  { id: 'hist_por_que_encerrou', section: 8, label: 'Por que o trabalho anterior foi encerrado?', type: 'longText', required: false, showIf: notAnsweredAs('hist_ja_trabalhou', 'Nunca') },
  {
    id: 'hist_estrategias_testadas', section: 8, label: 'Quais estratégias já foram testadas?',
    type: 'multiSelect', required: false, otherOption: 'Outros',
    options: ['Conteúdo orgânico', 'Instagram', 'Facebook', 'TikTok', 'Influenciadores', 'Google Ads', 'Meta Ads', 'Eventos', 'E-mail marketing', 'WhatsApp', 'Promoções', 'Parcerias', 'Outros'],
  },
  { id: 'hist_melhor_resultado', section: 8, label: 'Qual ação de marketing trouxe o melhor resultado?', type: 'longText', required: false },
  { id: 'hist_pior_resultado', section: 8, label: 'Qual ação não funcionou como esperado?', type: 'longText', required: false },

  // 09 | OBJETIVOS DE MARKETING
  {
    id: 'obj_lista', section: 9, label: 'Quais são os objetivos com o marketing?',
    type: 'multiSelect', required: true, otherOption: 'Outros',
    options: ['Reconhecimento', 'Seguidores qualificados', 'Leads', 'Vendas', 'Faturamento', 'Visitas à loja', 'Pedidos no WhatsApp', 'Autoridade', 'Posicionar especialista', 'Lançamentos', 'Fidelização', 'Comunidade', 'Novos mercados', 'Posicionamento digital', 'Outros'],
  },
  { id: 'obj_tres_principais', section: 9, label: 'Quais são os 3 objetivos mais importantes agora?', type: 'longText', required: true },
  { id: 'obj_meta_comercial', section: 9, label: 'Existe meta comercial definida? Qual?', type: 'shortText', required: false },
  { id: 'obj_meta_faturamento', section: 9, label: 'Existe meta de faturamento? Qual?', type: 'shortText', required: false },
  { id: 'obj_meta_clientes', section: 9, label: 'Existe meta de vendas ou número de clientes?', type: 'shortText', required: false },
  { id: 'obj_seis_meses', section: 9, label: 'Onde a empresa gostaria de estar em 6 meses?', type: 'longText', required: true },
  { id: 'obj_doze_meses', section: 9, label: 'E em 12 meses?', type: 'longText', required: false },

  // 10 | PROCESSO COMERCIAL E VENDAS
  { id: 'com_jornada', section: 10, label: 'Descreva o caminho do primeiro contato até a compra.', type: 'longText', required: true },
  { id: 'com_canais_entrada', section: 10, label: 'Quais são os principais canais de entrada de clientes?', type: 'longText', required: true },
  { id: 'com_quem_atende', section: 10, label: 'Quem realiza o atendimento comercial?', type: 'shortText', required: true },
  { id: 'com_equipe_vendas', section: 10, label: 'Existe equipe de vendas?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Só o proprietário atende'] },
  { id: 'com_script', section: 10, label: 'Existe roteiro ou script de atendimento?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Informal, sem estar escrito'] },
  { id: 'com_crm', section: 10, label: 'Existe CRM? Qual?', type: 'shortText', required: false },
  { id: 'com_tempo_resposta', section: 10, label: 'Quanto tempo levam para responder um novo contato?', type: 'shortText', required: true },
  { id: 'com_acompanha_nao_comprou', section: 10, label: 'Como acompanham quem pediu informações e não comprou?', type: 'longText', required: false },
  { id: 'com_pos_venda', section: 10, label: 'Existe pós-venda?', type: 'longText', required: false },
  { id: 'com_recompra', section: 10, label: 'Existe estratégia para recompra?', type: 'longText', required: false },
  { id: 'com_indicacao', section: 10, label: 'Existe programa de indicação?', type: 'longText', required: false },
  { id: 'com_base_clientes', section: 10, label: 'Existe banco ou base de clientes?', type: 'radioCards', required: false, options: ['Sim, organizada', 'Sim, mas desorganizada', 'Não existe'] },
  { id: 'com_tamanho_base', section: 10, label: 'Quantos contatos existem aproximadamente na base?', type: 'shortText', required: false, showIf: notAnsweredAs('com_base_clientes', 'Não existe') },

  // 11 | NÚMEROS DO NEGÓCIO
  { id: 'num_ticket_medio', section: 11, label: 'Qual é o ticket médio aproximado?', helper: 'Em reais. Um valor aproximado já ajuda.', type: 'shortText', required: true, placeholder: 'R$' },
  { id: 'num_faturamento', section: 11, label: 'Qual é o faturamento médio mensal?', helper: 'Se puder compartilhar. Fica restrito à nossa equipe.', type: 'shortText', required: false, placeholder: 'R$' },
  { id: 'num_clientes_mes', section: 11, label: 'Qual a quantidade média de clientes ou vendas por mês?', type: 'shortText', required: true },
  { id: 'num_sazonalidade', section: 11, label: 'Existe sazonalidade?', type: 'radioCards', required: false, options: ['Sim, bastante', 'Um pouco', 'Não'] },
  { id: 'num_melhores_meses', section: 11, label: 'Quais são os melhores meses?', type: 'shortText', required: false, showIf: notAnsweredAs('num_sazonalidade', 'Não') },
  { id: 'num_piores_meses', section: 11, label: 'Quais são os meses mais fracos?', type: 'shortText', required: false, showIf: notAnsweredAs('num_sazonalidade', 'Não') },
  { id: 'num_meta_mensal', section: 11, label: 'Existe meta mensal? Qual?', type: 'shortText', required: false },
  { id: 'num_produto_faturamento', section: 11, label: 'Qual produto ou serviço representa a maior parte do faturamento?', type: 'shortText', required: false },
  { id: 'num_capacidade', section: 11, label: 'A empresa possui capacidade para receber mais clientes?', type: 'radioCards', required: true, options: ['Sim, com folga', 'Sim, um pouco mais', 'Está no limite', 'Não sei'] },
  { id: 'num_operacao_aguenta', section: 11, label: 'Se o marketing aumentar muito a procura, a operação consegue atender?', helper: 'Preferimos saber agora do que gerar demanda que vocês não conseguem absorver.', type: 'longText', required: true },

  // 12 | SOCIAL MEDIA
  { id: 'social_mais_importante', section: 12, label: 'Qual rede social é mais importante atualmente?', type: 'shortText', required: true },
  { id: 'social_melhor_resultado', section: 12, label: 'Qual possui os melhores resultados?', type: 'shortText', required: false },
  { id: 'social_desenvolver', section: 12, label: 'Qual vocês querem desenvolver?', type: 'shortText', required: false },
  { id: 'social_funcao_instagram', section: 12, label: 'Qual é a principal função que o Instagram deveria cumprir?', type: 'longText', required: true },
  { id: 'social_conteudos_bons', section: 12, label: 'Quais conteúdos já deram bons resultados?', type: 'longText', required: false },
  { id: 'social_conteudos_ruins', section: 12, label: 'Quais tiveram baixo desempenho?', type: 'longText', required: false },
  { id: 'social_assuntos_abordar', section: 12, label: 'Quais assuntos vocês querem abordar mais?', type: 'longText', required: true },
  { id: 'social_assuntos_evitar', section: 12, label: 'Quais assuntos NÃO devemos abordar?', type: 'longText', required: true },
  { id: 'social_palavras_evitar', section: 12, label: 'Existem palavras, expressões ou abordagens que devem ser evitadas?', type: 'longText', required: false },
  { id: 'social_exigencia_legal', section: 12, label: 'Existe exigência ética, jurídica ou de conselho de classe?', helper: 'Ex.: CFM, CRO, CRP, OAB. Isso muda o que podemos publicar.', type: 'longText', required: true },
  { id: 'social_info_obrigatoria', section: 12, label: 'Existe informação que obrigatoriamente deve aparecer nas comunicações?', type: 'longText', required: false },

  // 13 | TOM DE VOZ
  {
    id: 'tom_como_fala', section: 13, label: 'Como a marca deve falar?',
    type: 'multiSelect', required: true, maxSelections: 4,
    options: ['Profissional', 'Informal', 'Próxima', 'Técnica', 'Educativa', 'Divertida', 'Inspiradora', 'Sofisticada', 'Direta', 'Acolhedora', 'Autoridade', 'Humanizada'],
  },
  { id: 'tom_palavras_usa', section: 13, label: 'Quais palavras ou expressões a marca costuma utilizar?', type: 'longText', required: false },
  { id: 'tom_palavras_evita', section: 13, label: 'Quais palavras devemos evitar?', type: 'longText', required: false },
  { id: 'tom_humor', section: 13, label: 'Pode utilizar humor?', type: 'radioCards', required: false, options: ['Sim', 'Com moderação', 'Não'] },
  { id: 'tom_memes', section: 13, label: 'Pode utilizar memes e tendências?', type: 'radioCards', required: false, options: ['Sim', 'Com moderação', 'Não'] },
  { id: 'tom_assuntos_momento', section: 13, label: 'Pode abordar assuntos do momento?', type: 'radioCards', required: false, options: ['Sim', 'Só os relacionados ao segmento', 'Não'] },
  { id: 'tom_emojis', section: 13, label: 'Pode utilizar emojis?', type: 'radioCards', required: false, options: ['Sim', 'Com moderação', 'Não'] },

  // 14 | IDENTIDADE VISUAL
  { id: 'iv_possui', section: 14, label: 'A empresa possui identidade visual definida?', type: 'radioCards', required: true, options: ['Sim', 'Parcialmente', 'Não'] },
  {
    id: 'iv_materiais', section: 14, label: 'O que vocês já possuem?',
    type: 'multiSelect', required: false, showIf: notAnsweredAs('iv_possui', 'Não'),
    options: ['Logotipo', 'Manual da marca', 'Paleta de cores', 'Tipografias', 'Elementos gráficos', 'Banco de imagens', 'Fotos profissionais', 'Vídeos', 'Templates', 'Arquivos editáveis'],
  },
  { id: 'iv_onde_arquivos', section: 14, label: 'Onde esses arquivos estão armazenados?', helper: 'Drive, Dropbox, com o designer anterior…', type: 'shortText', required: false, showIf: notAnsweredAs('iv_possui', 'Não') },
  { id: 'iv_nao_gostam', section: 14, label: 'Existe aplicação visual que vocês não gostam?', type: 'longText', required: false },
  { id: 'iv_representa', section: 14, label: 'A identidade atual representa o posicionamento desejado? Por quê?', type: 'longText', required: false, showIf: notAnsweredAs('iv_possui', 'Não') },

  // 15 | PRODUÇÃO DE CONTEÚDO
  { id: 'cont_quem_aparece', section: 15, label: 'Quem poderá aparecer nos conteúdos?', type: 'longText', required: true },
  { id: 'cont_fundador_aparece', section: 15, label: 'O proprietário ou fundador poderá aparecer?', type: 'radioCards', required: true, options: ['Sim', 'Às vezes', 'Não'] },
  { id: 'cont_funcionarios', section: 15, label: 'Funcionários podem aparecer?', type: 'radioCards', required: false, options: ['Sim', 'Alguns', 'Não'] },
  { id: 'cont_clientes', section: 15, label: 'Clientes podem aparecer mediante autorização?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Depende do segmento'] },
  { id: 'cont_disponibilidade', section: 15, label: 'Existe disponibilidade para gravações? Com que frequência?', type: 'shortText', required: true },
  { id: 'cont_espaco', section: 15, label: 'Existe espaço físico adequado para gravação?', type: 'longText', required: false },
  { id: 'cont_ambientes', section: 15, label: 'Quais ambientes podemos utilizar?', type: 'longText', required: false },
  { id: 'cont_bastidores', section: 15, label: 'Quais bastidores interessantes podemos mostrar?', type: 'longText', required: false },
  { id: 'cont_processos', section: 15, label: 'Quais processos podem virar conteúdo?', type: 'longText', required: false },
  { id: 'cont_cases', section: 15, label: 'Existem cases, resultados ou transformações que podem ser apresentados?', helper: 'Respeitando as regras do seu segmento.', type: 'longText', required: false },
  { id: 'cont_depoimentos', section: 15, label: 'Existem depoimentos disponíveis?', type: 'longText', required: false },
  { id: 'cont_banco_midia', section: 15, label: 'Existe banco de fotos e vídeos antigos?', type: 'file', required: false },

  // 16 | CAMPANHAS E DATAS
  { id: 'camp_datas', section: 16, label: 'Quais datas são importantes para a empresa?', helper: 'Aniversário, lançamentos, eventos, datas comemorativas do segmento, feiras, congressos.', type: 'longText', required: true },
  { id: 'camp_recorrentes', section: 16, label: 'Existem campanhas recorrentes durante o ano?', type: 'longText', required: false },
  { id: 'camp_proximos_90', section: 16, label: 'Existe campanha planejada para os próximos 90 dias?', type: 'longText', required: false },
  { id: 'camp_lancamento', section: 16, label: 'Existe lançamento previsto?', type: 'longText', required: false },
  { id: 'camp_parcerias', section: 16, label: 'Existem parcerias ou influenciadores envolvidos?', type: 'longText', required: false },

  // 17 | TRÁFEGO PAGO — HISTÓRICO
  {
    id: 'traf_ja_investiu', section: 17, label: 'A empresa já investiu em anúncios?',
    type: 'radioCards', required: true,
    options: ['Nunca', 'Investe atualmente', 'Já investiu e parou', 'Não sei'],
  },
  {
    id: 'traf_plataformas', section: 17, label: 'Em quais plataformas?',
    type: 'multiSelect', required: false, otherOption: 'Outras',
    options: ['Meta Ads', 'Google Ads', 'YouTube Ads', 'TikTok Ads', 'Outras'],
    showIf: notAnsweredAs('traf_ja_investiu', 'Nunca', 'Não sei'),
  },
  { id: 'traf_tempo', section: 17, label: 'Há quanto tempo anuncia ou anunciou?', type: 'shortText', required: false, showIf: notAnsweredAs('traf_ja_investiu', 'Nunca', 'Não sei') },
  { id: 'traf_quem_gerenciava', section: 17, label: 'Quem gerenciava as campanhas?', type: 'shortText', required: false, showIf: notAnsweredAs('traf_ja_investiu', 'Nunca', 'Não sei') },
  { id: 'traf_por_que_encerrou', section: 17, label: 'Por que campanhas anteriores foram encerradas ou alteradas?', type: 'longText', required: false, showIf: answeredAs('traf_ja_investiu', 'Já investiu e parou') },
  { id: 'traf_avaliacao', section: 17, label: 'Como avalia os resultados anteriores?', type: 'longText', required: false, showIf: notAnsweredAs('traf_ja_investiu', 'Nunca', 'Não sei') },
  { id: 'traf_melhores_campanhas', section: 17, label: 'Quais campanhas ou ofertas tiveram melhores resultados?', type: 'longText', required: false, showIf: notAnsweredAs('traf_ja_investiu', 'Nunca', 'Não sei') },
  { id: 'traf_piores_campanhas', section: 17, label: 'Quais não funcionaram?', type: 'longText', required: false, showIf: notAnsweredAs('traf_ja_investiu', 'Nunca', 'Não sei') },
  { id: 'traf_relatorios', section: 17, label: 'Existem relatórios ou prints das campanhas anteriores?', type: 'file', required: false, showIf: notAnsweredAs('traf_ja_investiu', 'Nunca', 'Não sei') },
  {
    id: 'traf_objetivos', section: 17, label: 'Quais são os objetivos do tráfego pago?',
    type: 'multiSelect', required: true, otherOption: 'Outros',
    options: ['WhatsApp', 'Leads', 'Vendas', 'Agendamentos', 'Loja física', 'Marca', 'Alcance', 'Lançamentos', 'Promoções', 'Site', 'Remarketing', 'Outros'],
  },
  { id: 'traf_prioridade', section: 17, label: 'Qual é a prioridade número 1?', type: 'shortText', required: true },
  { id: 'traf_produto_prioritario', section: 17, label: 'Qual produto ou serviço deve ser priorizado?', type: 'shortText', required: true },
  { id: 'traf_oferta', section: 17, label: 'Existe oferta específica?', type: 'longText', required: false },
  { id: 'traf_meta_mensal', section: 17, label: 'Existe meta mensal de leads, vendas ou agendamentos?', type: 'shortText', required: false },

  // 18 | INVESTIMENTO EM MÍDIA
  { id: 'inv_orcamento_definido', section: 18, label: 'Existe orçamento mensal definido?', type: 'radioCards', required: true, options: ['Sim', 'Não', 'A definir'] },
  { id: 'inv_valor_mensal', section: 18, label: 'Qual valor mensal pretende investir em mídia?', helper: 'Somente a verba de anúncios, sem contar honorários.', type: 'shortText', required: false, placeholder: 'R$', showIf: notAnsweredAs('inv_orcamento_definido', 'Não') },
  { id: 'inv_pode_aumentar', section: 18, label: 'Existe possibilidade de aumentar o investimento mediante resultados?', type: 'radioCards', required: false, options: ['Sim', 'Talvez', 'Não'] },
  { id: 'inv_verba_sazonal', section: 18, label: 'Existe verba adicional para campanhas sazonais ou lançamentos?', type: 'shortText', required: false },
  { id: 'inv_maior_ja_investido', section: 18, label: 'Qual foi o maior valor mensal já investido?', type: 'shortText', required: false, placeholder: 'R$' },

  // 19 | META ADS — ESTRUTURA
  { id: 'meta_pagina_vinculada', section: 19, label: 'Existe Página do Facebook vinculada ao Instagram?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'meta_business', section: 19, label: 'Existe Meta Business Portfolio (Business Manager) configurado?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'meta_conta_anuncios', section: 19, label: 'Existe conta de anúncios? Está ativa?', type: 'radioCards', required: false, options: ['Sim, ativa', 'Sim, mas inativa', 'Não existe', 'Não sei'] },
  { id: 'meta_bloqueio', section: 19, label: 'Já houve bloqueio, restrição ou suspensão? Explique.', type: 'longText', required: false },
  { id: 'meta_pendencia', section: 19, label: 'Existe pendência de pagamento?', type: 'radioCards', required: false, options: ['Não', 'Sim', 'Não sei'] },
  { id: 'meta_forma_pagamento', section: 19, label: 'Qual forma de pagamento está cadastrada?', helper: 'Apenas o tipo — cartão, boleto, Pix. Nunca envie números de cartão.', type: 'shortText', required: false },
  { id: 'meta_pixel', section: 19, label: 'Existe Pixel ou Conjunto de dados configurado?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'meta_capi', section: 19, label: 'Existe API de Conversões configurada?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei', 'Não se aplica'] },
  { id: 'meta_dominio', section: 19, label: 'O domínio está verificado na Meta?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei', 'Não se aplica'] },
  { id: 'meta_publicos', section: 19, label: 'Existem públicos personalizados ou de remarketing?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'meta_campanhas_antigas', section: 19, label: 'Existem campanhas antigas para análise?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },

  // 20 | GOOGLE ADS
  { id: 'gads_possui_conta', section: 20, label: 'A empresa possui conta no Google Ads?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'gads_ja_fez', section: 20, label: 'Já realizou campanhas no Google?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  {
    id: 'gads_tipos', section: 20, label: 'Quais tipos de campanha já usaram?',
    type: 'multiSelect', required: false, showIf: answeredAs('gads_ja_fez', 'Sim'),
    options: ['Pesquisa', 'Display', 'YouTube', 'Performance Max', 'Shopping', 'Remarketing', 'Não sei'],
  },
  { id: 'gads_campanha_ativa', section: 20, label: 'Existe campanha ativa?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'gads_investimento', section: 20, label: 'Qual o investimento médio mensal no Google?', type: 'shortText', required: false, placeholder: 'R$', showIf: answeredAs('gads_ja_fez', 'Sim') },
  { id: 'gads_produtos_anunciados', section: 20, label: 'Quais produtos ou serviços eram anunciados?', type: 'longText', required: false, showIf: answeredAs('gads_ja_fez', 'Sim') },
  { id: 'gads_palavras_chave', section: 20, label: 'Quais pesquisas ou palavras-chave costumam trazer clientes?', type: 'longText', required: false },
  { id: 'gads_conversoes', section: 20, label: 'Existem conversões configuradas no Google Ads?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },

  // 21 | PERFIL DA EMPRESA NO GOOGLE
  { id: 'gmb_possui', section: 21, label: 'A empresa possui Perfil da Empresa no Google?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'gmb_verificado', section: 21, label: 'O perfil está verificado?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'], showIf: answeredAs('gmb_possui', 'Sim') },
  { id: 'gmb_quem_acessa', section: 21, label: 'Quem possui acesso administrativo ao perfil?', type: 'shortText', required: false, showIf: answeredAs('gmb_possui', 'Sim') },
  {
    id: 'gmb_atualizados', section: 21, label: 'O que já está atualizado no perfil?',
    type: 'multiSelect', required: false, showIf: answeredAs('gmb_possui', 'Sim'),
    options: ['Endereço', 'Telefone', 'Site ou WhatsApp', 'Horários', 'Serviços', 'Fotos', 'Descrição', 'Localização'],
  },
  { id: 'gmb_avaliacoes', section: 21, label: 'A empresa recebe avaliações?', type: 'radioCards', required: false, options: ['Sim, com frequência', 'Poucas', 'Não'] },
  { id: 'gmb_estrategia_avaliacoes', section: 21, label: 'Existe estratégia para solicitar avaliações?', type: 'longText', required: false },
  { id: 'gmb_reputacao', section: 21, label: 'Existem avaliações negativas ou situações de reputação que precisamos conhecer?', type: 'longText', required: false },

  // 22 | SITE E CONVERSÃO
  { id: 'site_possui', section: 22, label: 'A empresa possui site? Informe o endereço.', type: 'shortText', required: false, placeholder: 'https://' },
  { id: 'site_quem_administra', section: 22, label: 'Quem administra o site?', type: 'shortText', required: false },
  { id: 'site_acesso_painel', section: 22, label: 'Vocês possuem acesso ao painel administrativo do site?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'site_landing_pages', section: 22, label: 'Possuem landing pages?', type: 'longText', required: false },
  {
    id: 'site_onde_converte', section: 22, label: 'Onde o cliente converte hoje?',
    type: 'multiSelect', required: true, otherOption: 'Outro',
    options: ['WhatsApp', 'Formulário', 'Ligação', 'Compra no site', 'Agendamento', 'Direct', 'Outro'],
  },
  { id: 'site_pagina_campanhas', section: 22, label: 'Existe página específica para campanhas?', type: 'longText', required: false },

  // 23 | ANALYTICS E MENSURAÇÃO
  { id: 'ga_ga4', section: 23, label: 'O site possui Google Analytics 4?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'ga_gtm', section: 23, label: 'Possui Google Tag Manager?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  { id: 'ga_search_console', section: 23, label: 'Possui Google Search Console?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei'] },
  {
    id: 'ga_conversoes', section: 23, label: 'Quais conversões estão configuradas?',
    type: 'multiSelect', required: false, otherOption: 'Outras',
    options: ['WhatsApp', 'Formulários', 'Ligações', 'Compras', 'Agendamentos', 'Leads', 'Outras', 'Não sei'],
  },
  {
    id: 'ga_ferramenta_leads', section: 23, label: 'Existe ferramenta para acompanhar leads e vendas?',
    type: 'radioCards', required: false, otherOption: 'Outro',
    options: ['CRM', 'Planilha', 'Sistema próprio', 'WhatsApp', 'Não existe', 'Outro'],
  },

  // 24 | LEADS E ATENDIMENTO
  {
    id: 'leads_destino', section: 24, label: 'Para onde os leads devem ser direcionados?',
    type: 'multiSelect', required: true, otherOption: 'Outro',
    options: ['WhatsApp', 'Direct', 'Site', 'Landing Page', 'Formulário', 'Ligação', 'Outro'],
  },
  { id: 'leads_whatsapp', section: 24, label: 'Qual WhatsApp será usado nas campanhas?', type: 'phone', required: true },
  { id: 'leads_quem_atende', section: 24, label: 'Quem atenderá os leads?', type: 'shortText', required: true },
  { id: 'leads_horario', section: 24, label: 'Qual é o horário de atendimento?', type: 'shortText', required: true },
  { id: 'leads_tempo_resposta', section: 24, label: 'Qual é o tempo médio de resposta?', type: 'shortText', required: true },
  { id: 'leads_script', section: 24, label: 'Existe script comercial para os leads de anúncio?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Informal'] },
  { id: 'leads_followup', section: 24, label: 'Existe follow-up para quem não compra?', type: 'longText', required: false },
  { id: 'leads_taxa_conversao', section: 24, label: 'Conseguem informar quantos leads viram clientes?', type: 'shortText', required: false },
  { id: 'leads_registro_vendas', section: 24, label: 'Como as vendas originadas dos anúncios são registradas?', type: 'longText', required: false },

  // 25 | MÉTRICAS COMERCIAIS
  { id: 'met_ticket', section: 25, label: 'Qual é o ticket médio?', type: 'shortText', required: true, placeholder: 'R$' },
  { id: 'met_valor_contrato', section: 25, label: 'Qual o valor médio de uma venda ou contrato?', type: 'shortText', required: false, placeholder: 'R$' },
  { id: 'met_margem', section: 25, label: 'Qual a margem aproximada dos produtos prioritários?', helper: 'Se puder compartilhar. É o que define quanto podemos pagar por cliente.', type: 'shortText', required: false },
  { id: 'met_novos_clientes', section: 25, label: 'Qual a quantidade média de novos clientes por mês?', type: 'shortText', required: false },
  { id: 'met_leads_mes', section: 25, label: 'Qual a quantidade média de leads por mês?', type: 'shortText', required: false },
  { id: 'met_fechamento', section: 25, label: 'Qual a taxa aproximada de fechamento?', type: 'shortText', required: false },
  { id: 'met_ltv', section: 25, label: 'Quanto um novo cliente pode representar ao longo do relacionamento?', type: 'shortText', required: false, placeholder: 'R$' },
  { id: 'met_cac_maximo', section: 25, label: 'Existe custo máximo viável para adquirir um novo cliente?', helper: 'Se não souber, responda "não sei" — calculamos junto.', type: 'shortText', required: false },

  // 26 | SEGMENTAÇÃO
  { id: 'seg_regioes', section: 26, label: 'Em quais cidades ou regiões devemos anunciar?', type: 'longText', required: true },
  { id: 'seg_regioes_evitar', section: 26, label: 'Existe região que NÃO deve receber anúncios?', type: 'longText', required: false },
  {
    id: 'seg_abrangencia', section: 26, label: 'Qual é a abrangência do atendimento?',
    type: 'multiSelect', required: true,
    options: ['Local', 'Regional', 'Estadual', 'Nacional', 'Online'],
  },
  { id: 'seg_publico_atual', section: 26, label: 'Quem é o público que mais compra atualmente?', type: 'longText', required: false },
  { id: 'seg_publico_evitar', section: 26, label: 'Existe perfil de cliente que NÃO desejamos atrair?', type: 'longText', required: false },
  { id: 'seg_base_publicos', section: 26, label: 'Existe base de clientes que possa ser usada para criar públicos?', helper: 'Respeitando privacidade e a LGPD. Nunca envie a lista por aqui.', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Preciso verificar'] },

  // 27 | OFERTA E ESTRATÉGIA
  { id: 'oferta_escalar', section: 27, label: 'Qual produto ou serviço queremos escalar primeiro?', type: 'shortText', required: true },
  { id: 'oferta_diferencial', section: 27, label: 'Qual é o diferencial dessa oferta?', type: 'longText', required: true },
  { id: 'oferta_urgencia', section: 27, label: 'Por que o cliente deveria comprar agora?', type: 'longText', required: true },
  {
    id: 'oferta_condicoes', section: 27, label: 'Quais condições podem ser oferecidas?',
    type: 'multiSelect', required: false, otherOption: 'Outra',
    options: ['Desconto', 'Parcelamento', 'Avaliação', 'Consulta inicial', 'Orçamento', 'Frete', 'Brinde', 'Bônus', 'Condição especial', 'Nenhuma', 'Outra'],
  },
  { id: 'oferta_limite', section: 27, label: 'Existe limite de vagas, estoque ou capacidade de atendimento?', type: 'longText', required: false },

  // 28 | REPUTAÇÃO E PROVA SOCIAL
  { id: 'prova_avaliacoes_google', section: 28, label: 'A empresa possui avaliações no Google?', type: 'radioCards', required: false, options: ['Sim, muitas', 'Algumas', 'Não'] },
  { id: 'prova_depoimentos', section: 28, label: 'Possuem depoimentos?', type: 'longText', required: false },
  { id: 'prova_cases', section: 28, label: 'Possuem cases de sucesso?', type: 'longText', required: false },
  { id: 'prova_clientes_relevantes', section: 28, label: 'Existem clientes ou empresas relevantes que possam ser mencionados?', type: 'longText', required: false },
  { id: 'prova_autorizacao', section: 28, label: 'Existe autorização para usar depoimentos e imagens?', type: 'radioCards', required: false, options: ['Sim', 'Parcialmente', 'Não', 'Preciso verificar'] },
  { id: 'prova_numeros', section: 28, label: 'Quais resultados reais merecem ser comunicados?', helper: 'Anos de mercado, número de clientes, unidades, projetos, certificações, premiações.', type: 'longText', required: true },

  // 29 | FUNDADOR E HUMANIZAÇÃO
  { id: 'fund_sobre', section: 29, label: 'Conte um pouco sobre você.', type: 'longText', required: true },
  { id: 'fund_formacao', section: 29, label: 'Qual é a sua formação?', type: 'shortText', required: false },
  { id: 'fund_tempo_area', section: 29, label: 'Há quanto tempo trabalha na área?', type: 'shortText', required: false },
  { id: 'fund_por_que_profissao', section: 29, label: 'Por que escolheu essa profissão ou segmento?', type: 'longText', required: false },
  { id: 'fund_trajetoria', section: 29, label: 'Como começou sua trajetória?', type: 'longText', required: false },
  { id: 'fund_dificuldade', section: 29, label: 'Qual foi uma dificuldade importante no início?', type: 'longText', required: false },
  { id: 'fund_conquista', section: 29, label: 'Qual conquista profissional mais representa sua trajetória?', type: 'longText', required: false },
  { id: 'fund_gosta_trabalho', section: 29, label: 'O que você mais gosta no seu trabalho?', type: 'longText', required: false },
  { id: 'fund_saber_sobre', section: 29, label: 'O que gostaria que as pessoas soubessem sobre você?', type: 'longText', required: false },
  { id: 'fund_domina', section: 29, label: 'Quais assuntos você domina e poderia ensinar?', type: 'longText', required: true },
  { id: 'fund_gosta_falar', section: 29, label: 'Quais assuntos gosta de falar?', type: 'longText', required: false },
  { id: 'fund_fora_redes', section: 29, label: 'Quais assuntos prefere manter fora das redes?', type: 'longText', required: true },
  { id: 'fund_rotina_pessoal', section: 29, label: 'Quanto da rotina pessoal se sente confortável em compartilhar?', type: 'longText', required: false },

  // 30 | ACESSOS E ATIVOS DIGITAIS
  {
    id: 'acesso_ativos', section: 30, label: 'Quais acessos vocês têm para nos conceder?',
    helper: 'Marque o que existe. Vamos solicitar permissão oficial em cada plataforma — nunca peça nem envie senhas.',
    type: 'multiSelect', required: true,
    options: ['Instagram', 'Página Facebook', 'Meta Business Portfolio', 'Conta de anúncios Meta', 'Pixel / Conjunto de dados', 'Catálogo', 'Google Ads', 'Perfil da Empresa no Google', 'GA4', 'GTM', 'Search Console', 'YouTube', 'TikTok', 'Site', 'E-commerce', 'CRM', 'E-mail marketing', 'WhatsApp Business', 'Drive com arquivos da marca'],
  },
  { id: 'acesso_quem_admin', section: 30, label: 'Quem possui acesso administrativo atualmente?', type: 'longText', required: true },
  { id: 'acesso_ex_vinculados', section: 30, label: 'Existem ex-funcionários ou agências ainda vinculados às contas?', type: 'longText', required: true },
  { id: 'acesso_2fa', section: 30, label: 'A autenticação em dois fatores está ativada?', type: 'radioCards', required: false, options: ['Sim', 'Não', 'Não sei', 'Em algumas contas'] },

  // 31 | MATERIAIS
  {
    id: 'mat_disponiveis', section: 31, label: 'Quais materiais vocês já possuem?',
    helper: 'Marque tudo que existir. Depois combinamos como enviar.',
    type: 'multiSelect', required: true,
    options: ['Logotipo em alta qualidade', 'Arquivos vetoriais', 'Manual da marca', 'Paleta e fontes', 'Fotos profissionais', 'Vídeos', 'Fotos da equipe', 'Fotos do espaço', 'Fotos de produtos', 'Catálogo ou cardápio', 'Lista de serviços', 'Tabela de preços', 'Apresentação comercial', 'Portfólio', 'Depoimentos e cases', 'Certificados', 'Materiais de campanhas anteriores', 'Calendário de eventos', 'Relatórios de marketing anteriores'],
  },
  { id: 'mat_envio', section: 31, label: 'Envie os materiais que já tiver em mãos.', helper: 'Pode anexar aqui ou colar o link de uma pasta compartilhada.', type: 'file', required: false },

  // 32 | APROVAÇÃO E ROTINA
  { id: 'rot_quem_aprova', section: 32, label: 'Quem aprova conteúdos?', type: 'shortText', required: true },
  { id: 'rot_outro_aprovador', section: 32, label: 'Existe outra pessoa que precisa aprovar?', type: 'shortText', required: false },
  { id: 'rot_canal', section: 32, label: 'Qual é o melhor canal de comunicação com vocês?', type: 'radioCards', required: true, otherOption: 'Outro', options: ['WhatsApp', 'E-mail', 'Reunião semanal', 'ClickUp ou similar', 'Outro'] },
  { id: 'rot_horario', section: 32, label: 'Qual é o horário de funcionamento?', type: 'shortText', required: true },
  { id: 'rot_antecedencia', section: 32, label: 'Com quanta antecedência conseguem informar promoções, eventos e mudanças?', type: 'shortText', required: true },
  { id: 'rot_rotina_interna', section: 32, label: 'Existe alguma rotina interna importante para organizar gravações e conteúdos?', type: 'longText', required: false },

  // 33 | EXPECTATIVAS
  { id: 'exp_espera', section: 33, label: 'O que você espera do nosso trabalho?', type: 'longText', required: true },
  { id: 'exp_sucesso', section: 33, label: 'O que faria você considerar o projeto um sucesso?', type: 'longText', required: true },
  { id: 'exp_nao_repetir', section: 33, label: 'Existe algo de experiências anteriores que não gostaria que acontecesse novamente?', type: 'longText', required: false },
  { id: 'exp_dificuldade_marketing', section: 33, label: 'Qual é hoje a sua maior dificuldade no marketing?', type: 'longText', required: true },
  { id: 'exp_dificuldade_comercial', section: 33, label: 'Qual é a sua maior dificuldade comercial?', type: 'longText', required: true },
  { id: 'exp_um_problema', section: 33, label: 'Se pudéssemos resolver apenas um problema nos próximos meses, qual deveria ser?', type: 'longText', required: true },

  // 34 | DIAGNÓSTICO FINAL
  { id: 'diag_hoje_e', section: 34, label: 'Hoje, minha empresa é...', type: 'shortText', required: false },
  { id: 'diag_quero_tornar', section: 34, label: 'Quero que minha empresa se torne...', type: 'shortText', required: false },
  { id: 'diag_maior_desafio', section: 34, label: 'Meu maior desafio atualmente é...', type: 'shortText', required: false },
  { id: 'diag_maior_oportunidade', section: 34, label: 'Minha maior oportunidade atualmente é...', type: 'shortText', required: false },
  { id: 'diag_por_que_escolhem', section: 34, label: 'O principal motivo pelo qual os clientes escolhem minha empresa é...', type: 'shortText', required: false },
  { id: 'diag_por_que_nao_compram', section: 34, label: 'O principal motivo pelo qual alguns clientes não compram é...', type: 'shortText', required: false },
  { id: 'diag_marketing_ideal', section: 34, label: 'Se o marketing funcionasse exatamente como eu gostaria, ele deveria...', type: 'longText', required: false },

  // 35 | INFORMAÇÕES EXTRAS
  {
    id: 'extra_observacoes', section: 35,
    label: 'Existe alguma informação importante que não foi perguntada?',
    helper: 'Sobre a empresa, o mercado, os clientes, a equipe, os produtos, o histórico ou os objetivos.',
    type: 'longText', required: false,
  },
];

export const onboardingMarketing: BriefingForm = {
  slug: 'onboarding-marketing',
  name: 'Onboarding de Marketing',
  landingPath: '/onboarding-marketing',
  flowPath: '/onboarding-marketing/responder',
  storageKey: 'rubi_onboarding_marketing_v1',
  estimatedMinutes: 60,
  sections,
  questions,
  copy: {
    eyebrow: 'Marketing · Social Media · Meta Ads · Google Ads',
    welcomeTitle: 'Onboarding e Briefing Estratégico',
    welcomeLead:
      'Antes de produzir qualquer conteúdo ou subir qualquer campanha, precisamos entender o seu negócio por inteiro.',
    welcomeBody: [
      'Este questionário reúne o que usamos para diagnóstico, planejamento estratégico, produção de conteúdo, mídia paga e mensuração. É longo de propósito: cada resposta aqui evita uma reunião depois e reduz o tempo até os primeiros resultados.',
      'Responda com o máximo de sinceridade, inclusive sobre o que não funcionou antes. Saber o que deu errado vale tanto quanto saber o que deu certo.',
      'Se não souber alguma resposta, escreva "não sei" e siga adiante — descobrimos juntos. Suas respostas ficam salvas automaticamente, então você pode parar e continuar depois.',
    ],
    welcomeClosing:
      'Nenhuma pergunta aqui pede senha. Os acessos às plataformas serão solicitados pelos canais oficiais de permissão de cada uma delas.',
    successTitle: 'Recebemos tudo.',
    successBody: [
      'Obrigada pelo tempo dedicado a este questionário.',
      'A partir daqui nossa equipe monta o diagnóstico, define o posicionamento, os pilares de conteúdo e a estratégia de mídia para os primeiros 90 dias.',
      'Se faltar alguma informação ou algum acesso, entramos em contato pelo canal que você indicou.',
    ],
  },
};
