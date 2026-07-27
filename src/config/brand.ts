/**
 * PONTO ÚNICO DE TROCA DA IDENTIDADE VISUAL.
 *
 * Nenhum componente da aplicação referencia cor, fonte ou texto institucional
 * diretamente — tudo passa por aqui ou pelos tokens de `src/styles/theme.css`.
 * Quando o manual da marca chegar, ajustar estes dois arquivos é suficiente.
 *
 * Identidade interina extraída do logotipo: serifada didone de alto contraste
 * em branco/prata sobre preto, com assinatura em sans geométrica fina e
 * tracking largo. Monocromática — sem cor de acento inventada.
 */

export const brand = {
  name: 'RUBI',
  signature: 'AGÊNCIA.',
  legalName: 'RUBI Agência',
  tagline: 'Branding & Identidade Visual',
  site: 'https://rubiagencia.com.br',
} as const;

/**
 * Cores extraídas dos arquivos oficiais em `public/brand` — a identidade usa
 * exatamente estas três. Espelha os tokens de `src/styles/theme.css`; duplicado
 * aqui porque a geração de imagens Open Graph (`ImageResponse`) roda fora do
 * pipeline do Tailwind e não enxerga variáveis CSS.
 */
export const brandColors = {
  ink: '#000000',
  inkRaised: '#0D0D0D',
  paper: '#EFEFEF',
  /** Bronze da marca. */
  accent: '#A66F3A',
  /** Clareado do bronze, para texto pequeno sobre preto (7.6:1). */
  accentSoft: '#C89055',
  muted: '#8A8A8A',
  line: '#232323',
} as const;

/** Textos institucionais transcritos do documento original do briefing. */
export const brandCopy = {
  welcomeTitle: 'Briefing de Identidade Visual',
  welcomeLead:
    'Uma identidade visual não começa pela escolha de uma cor, fonte ou símbolo. Ela começa pela compreensão da essência da marca.',
  welcomeBody: [
    'Este briefing é uma das etapas mais importantes do nosso processo criativo. Através dele, iremos conhecer a história do seu negócio, seu propósito, público, diferenciais, personalidade, posicionamento e a percepção que você deseja construir.',
    'Todas essas informações serão utilizadas como base para desenvolver um universo visual que não seja apenas bonito, mas que tenha significado, coerência e personalidade.',
    'Por isso, responda cada pergunta com atenção e compartilhe o máximo de detalhes possível. Não existem respostas certas ou erradas — queremos conhecer a sua visão.',
  ],
  welcomeClosing:
    'Ao final deste processo, nosso objetivo é transformar a essência da sua marca em uma identidade visual autêntica, consistente e reconhecível.',
  successTitle: 'Agora, a criação começa.',
  successBody: [
    'Obrigada por dedicar seu tempo a esta etapa.',
    'Cada resposta será analisada cuidadosamente pela nossa equipe e servirá como base para o desenvolvimento do conceito e da identidade visual da sua marca.',
    'A partir daqui, começamos a transformar histórias, ideias, sentimentos e significados em uma identidade capaz de representar visualmente tudo aquilo que torna a sua marca única.',
  ],
} as const;

export const seo = {
  title: `Briefing de Identidade Visual | ${brand.legalName}`,
  description:
    'Conte a história, o propósito e a personalidade da sua marca. Este briefing é a base para o desenvolvimento da sua identidade visual pela RUBI Agência.',
} as const;

/**
 * Base absoluta das URLs de Open Graph. Na Vercel, `VERCEL_PROJECT_PRODUCTION_URL`
 * já vem preenchida; defina `NEXT_PUBLIC_SITE_URL` para usar o domínio próprio.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL('http://localhost:3000');
}
