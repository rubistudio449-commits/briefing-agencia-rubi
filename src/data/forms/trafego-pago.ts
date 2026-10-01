/**
 * Transcrição do documento "BRIEFING ESTRATÉGICO — TRÁFEGO PAGO | AGÊNCIA RUBI".
 *
 * As perguntas de histórico (plataformas, investimento, resultados) só aparecem
 * para quem já anunciou: para quem nunca anunciou elas não têm resposta possível.
 *
 * O "Alinhamento importante" que fecha o documento virou o fechamento da tela de
 * abertura — lido antes de responder, ajusta a expectativa desde o início.
 */

import type { Answers, BriefingForm, Question, Section } from '@/types/briefing';

const answeredAs = (questionId: string, ...values: string[]) => (answers: Answers) => {
  const current = answers[questionId];
  return typeof current === 'string' && values.includes(current);
};

const sections: readonly Section[] = [
  { id: 1, label: '01', title: 'Sobre o negócio', intro: 'O básico, e o que torna vocês diferentes.' },
  { id: 2, label: '02', title: 'Objetivo da campanha', intro: 'O que o investimento precisa trazer.' },
  { id: 3, label: '03', title: 'Produto, serviço e oferta', intro: 'O que vamos colocar na frente.' },
  { id: 4, label: '04', title: 'Público-alvo', intro: 'Para quem os anúncios falam.' },
  { id: 5, label: '05', title: 'Estrutura comercial', intro: 'O que acontece depois do clique.' },
  { id: 6, label: '06', title: 'Histórico e investimento', intro: 'O que já foi feito, e quanto há para investir.' },
  { id: 7, label: '07', title: 'Fechamento estratégico', intro: 'Desafios, expectativas e próximos meses.' },
  { id: 8, label: '08', title: 'Observações', intro: 'O espaço livre para a Agência RUBI.' },
];

const questions: readonly Question[] = [
  // 01 | SOBRE O NEGÓCIO
  { id: 'neg_empresa', section: 1, label: 'Qual é o nome da empresa?', type: 'shortText', required: true },
  { id: 'neg_responsavel', section: 1, label: 'Qual é o nome do responsável?', type: 'shortText', required: true },
  { id: 'neg_segmento', section: 1, label: 'Qual é o segmento da empresa?', type: 'shortText', required: true },
  { id: 'neg_regiao', section: 1, label: 'Em qual cidade ou região vocês atuam?', type: 'shortText', required: true },
  { id: 'neg_instagram', section: 1, label: 'Qual é o Instagram da empresa?', type: 'shortText', required: false, placeholder: '@' },
  { id: 'neg_site', section: 1, label: 'Qual é o site ou a landing page?', helper: 'Deixe em branco se ainda não houver.', type: 'shortText', required: false, placeholder: 'https://' },
  { id: 'neg_whatsapp', section: 1, label: 'Qual é o WhatsApp comercial?', type: 'phone', required: true, placeholder: '(00) 00000-0000' },
  { id: 'neg_tempo_mercado', section: 1, label: 'Há quanto tempo a empresa está no mercado?', type: 'shortText', required: true },
  { id: 'neg_diferencial', section: 1, label: 'O que diferencia sua empresa dos concorrentes?', type: 'longText', required: true },

  // 02 | OBJETIVO DA CAMPANHA
  {
    id: 'obj_principal', section: 2, label: 'Qual é o principal objetivo do investimento em tráfego?',
    helper: 'Marque todos que se aplicam.',
    type: 'checkboxGrid', required: true, otherOption: 'Outro',
    options: [
      'Gerar vendas', 'Gerar leads', 'Gerar mensagens no WhatsApp', 'Agendamentos',
      'Atrair clientes para loja física', 'Divulgar produto/serviço', 'Reconhecimento de marca', 'Outro',
    ],
  },
  { id: 'obj_resultado_esperado', section: 2, label: 'Qual resultado você espera alcançar?', type: 'longText', required: true },
  { id: 'obj_meta', section: 2, label: 'Existe alguma meta específica de vendas, leads ou agendamentos?', type: 'longText', required: false },

  // 03 | PRODUTO / SERVIÇO / OFERTA
  { id: 'oferta_produto', section: 3, label: 'Qual produto ou serviço será anunciado?', type: 'longText', required: true },
  { id: 'oferta_valor_medio', section: 3, label: 'Qual é o valor médio?', type: 'shortText', required: true, placeholder: 'R$' },
  { id: 'oferta_condicao', section: 3, label: 'Existe alguma oferta, condição especial ou promoção?', type: 'longText', required: false },
  { id: 'oferta_prioridade', section: 3, label: 'Qual produto ou serviço tem maior margem ou prioridade para a empresa?', type: 'longText', required: true },
  { id: 'oferta_nao_anunciar', section: 3, label: 'Existe algum produto ou serviço que NÃO deve ser anunciado?', type: 'longText', required: false },
  {
    id: 'oferta_jornada', section: 3, label: 'Como funciona a jornada até a compra?',
    helper: 'Do primeiro contato até o pagamento: por onde o cliente chega, com quem fala, o que acontece em cada etapa.',
    type: 'longText', required: true,
  },

  // 04 | PÚBLICO-ALVO
  { id: 'pub_cliente_ideal', section: 4, label: 'Quem é o cliente ideal?', type: 'longText', required: true },
  { id: 'pub_faixa_etaria', section: 4, label: 'Qual é a faixa etária desse cliente?', type: 'shortText', required: true, placeholder: 'Ex.: 25 a 45 anos' },
  { id: 'pub_genero', section: 4, label: 'Qual é o gênero predominante?', type: 'shortText', required: false },
  { id: 'pub_regiao', section: 4, label: 'Em qual cidade ou região esse cliente está?', type: 'shortText', required: true },
  { id: 'pub_perfil_economico', section: 4, label: 'Qual é o perfil econômico desse cliente?', type: 'shortText', required: false },
  { id: 'pub_dores', section: 4, label: 'Quais são as principais dores ou necessidades desse público?', type: 'longText', required: true },
  { id: 'pub_gatilho', section: 4, label: 'O que normalmente faz esse cliente procurar sua empresa?', type: 'longText', required: true },
  { id: 'pub_excluir', section: 4, label: 'Existem públicos que você NÃO deseja atingir?', type: 'longText', required: false },

  // 05 | ESTRUTURA COMERCIAL
  { id: 'com_responsavel_leads', section: 5, label: 'Quem será responsável pelo atendimento dos leads?', type: 'shortText', required: true },
  {
    id: 'com_canais', section: 5, label: 'Onde os leads serão atendidos?',
    helper: 'Marque todos que se aplicam.',
    type: 'checkboxGrid', required: true, otherOption: 'Outro',
    options: ['WhatsApp', 'Direct', 'Site', 'Ligação', 'Outro'],
  },
  { id: 'com_horario', section: 5, label: 'Qual é o horário de atendimento?', type: 'shortText', required: true },
  { id: 'com_equipe', section: 5, label: 'Existe equipe comercial?', type: 'radioCards', required: true, options: ['Sim', 'Não'] },
  { id: 'com_acompanhamento', section: 5, label: 'Como é feito o acompanhamento dos interessados?', type: 'longText', required: true },
  { id: 'com_taxa_conversao', section: 5, label: 'Qual é a taxa aproximada de conversão de lead em venda?', helper: 'Se não souber, deixe em branco.', type: 'shortText', required: false },

  // 06 | HISTÓRICO E INVESTIMENTO
  { id: 'hist_ja_anunciou', section: 6, label: 'Você já anunciou anteriormente?', type: 'radioCards', required: true, options: ['Sim', 'Não'] },
  {
    id: 'hist_plataformas', section: 6, label: 'Em quais plataformas?',
    type: 'checkboxGrid', required: true, otherOption: 'Outras',
    options: ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Outras'],
    showIf: answeredAs('hist_ja_anunciou', 'Sim'),
  },
  {
    id: 'hist_investimento_mensal', section: 6, label: 'Quanto costuma investir mensalmente?',
    type: 'shortText', required: false, placeholder: 'R$',
    showIf: answeredAs('hist_ja_anunciou', 'Sim'),
  },
  { id: 'hist_orcamento_nova', section: 6, label: 'Qual é o orçamento disponível para a nova campanha?', type: 'shortText', required: true, placeholder: 'R$' },
  {
    id: 'hist_bons_resultados', section: 6, label: 'Já teve algum anúncio ou campanha que trouxe bons resultados?',
    type: 'longText', required: false,
    showIf: answeredAs('hist_ja_anunciou', 'Sim'),
  },
  {
    id: 'hist_experiencia_negativa', section: 6, label: 'Já teve alguma experiência negativa com tráfego pago?',
    type: 'longText', required: false,
    showIf: answeredAs('hist_ja_anunciou', 'Sim'),
  },
  {
    id: 'hist_ferramentas', section: 6, label: 'Quais destes vocês já possuem?',
    helper: 'Marque todos que se aplicam. Se não tiver nenhum, pode seguir sem marcar.',
    type: 'checkboxGrid', required: false,
    options: ['Gerenciador de anúncios', 'Pixel/Meta Pixel', 'Google Analytics', 'Google Tag Manager', 'Site/landing page', 'WhatsApp Business'],
  },

  // 07 | FECHAMENTO ESTRATÉGICO
  { id: 'fech_maior_desafio', section: 7, label: 'Qual é hoje o maior desafio para conseguir novos clientes?', type: 'longText', required: true },
  { id: 'fech_expectativa', section: 7, label: 'O que você espera que a Agência RUBI resolva através do tráfego pago?', type: 'longText', required: true },
  { id: 'fech_periodo_importante', section: 7, label: 'Existe alguma campanha, produto ou período importante nos próximos meses?', type: 'longText', required: false },
  { id: 'fech_nao_perguntado', section: 7, label: 'Existe alguma informação importante para nossa estratégia que não foi perguntada?', type: 'longText', required: false },

  // 08 | OBSERVAÇÕES PARA AGÊNCIA RUBI
  { id: 'obs_agencia', section: 8, label: 'Quer deixar alguma observação para a Agência RUBI?', type: 'longText', required: false },
];

export const trafegoPago: BriefingForm = {
  slug: 'trafego-pago',
  name: 'Briefing de Tráfego Pago',
  landingPath: '/trafego-pago',
  flowPath: '/trafego-pago/responder',
  storageKey: 'rubi_trafego_pago_v1',
  estimatedMinutes: 15,
  sections,
  questions,
  copy: {
    eyebrow: 'Tráfego pago · Agência RUBI',
    welcomeTitle: 'Briefing Estratégico de Tráfego Pago',
    welcomeLead:
      'Antes de definir a estratégia de tráfego pago, precisamos entender o momento, os objetivos e a estrutura do seu negócio.',
    welcomeBody: [
      'Quanto mais completas forem as informações, mais assertiva será a definição de público, oferta, campanhas, criativos e indicadores.',
      'Se não souber alguma resposta, escreva "não sei" e siga adiante. Suas respostas ficam salvas automaticamente, então você pode parar e continuar depois.',
    ],
    welcomeClosing:
      'Alinhamento importante: os resultados do tráfego pago também são influenciados pela oferta, posicionamento, criativos, atendimento, preço, processo comercial e velocidade de resposta aos leads.',
    successTitle: 'Recebemos tudo.',
    successBody: [
      'Obrigada pelo tempo dedicado a este briefing.',
      'A partir daqui nossa equipe define público, oferta, estrutura de campanhas, criativos e os indicadores que vamos acompanhar.',
      'Se faltar alguma informação, entramos em contato pelo WhatsApp comercial que você informou.',
    ],
  },
};
