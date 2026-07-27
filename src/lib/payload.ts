import { questions, sectionLabel } from '@/data/briefing';
import { isBlank } from '@/lib/validation';
import { isFileAnswer, otherFieldId, type Answers, type Question } from '@/types/briefing';

export interface AnswerEntry {
  pergunta: string;
  secao: string;
  resposta: string | string[];
}

export interface FileEntry {
  pergunta: string;
  urls: string[];
  link: string;
}

export interface BriefingPayload {
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string;
  respostas: Record<string, AnswerEntry>;
  arquivos: Record<string, FileEntry>;
  resumoMarkdown: string;
  meta: {
    totalPerguntas: number;
    respondidas: number;
    duracaoSegundos: number | null;
  };
  enviadoEm: string;
  origem: string;
}

export const ORIGIN = 'Briefing Identidade Visual';

const asText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/**
 * Aplica a resposta complementar de "Outro": a opção crua vira "Outro: <texto>",
 * tanto em escolha única quanto dentro da lista de múltipla escolha.
 */
function withOtherText(question: Question, answers: Answers): string | string[] {
  const value = answers[question.id];
  const otherText = asText(answers[otherFieldId(question.id)]);
  const label = question.otherOption;

  const expand = (option: string) =>
    label && option === label && otherText ? `${label}: ${otherText}` : option;

  if (Array.isArray(value)) return value.map(expand);
  if (typeof value === 'string') return expand(value.trim());
  return '';
}

export function buildPayload(answers: Answers, startedAt?: number): BriefingPayload {
  const respostas: Record<string, AnswerEntry> = {};
  const arquivos: Record<string, FileEntry> = {};

  for (const question of questions) {
    // Perguntas ocultas por condicional não entram no envio.
    if (question.showIf && !question.showIf(answers)) continue;

    const value = answers[question.id];
    if (isBlank(value)) continue;

    if (question.type === 'file' && isFileAnswer(value)) {
      arquivos[question.id] = {
        pergunta: question.label,
        urls: value.files.map((file) => file.url),
        link: value.link.trim(),
      };
      respostas[question.id] = {
        pergunta: question.label,
        secao: sectionLabel(question.section),
        resposta: [...value.files.map((file) => file.url), value.link.trim()].filter(Boolean),
      };
      continue;
    }

    respostas[question.id] = {
      pergunta: question.label,
      secao: sectionLabel(question.section),
      resposta: withOtherText(question, answers),
    };
  }

  const duracaoSegundos =
    typeof startedAt === 'number' && startedAt > 0 && startedAt <= Date.now()
      ? Math.round((Date.now() - startedAt) / 1000)
      : null;

  return {
    nome: asText(answers.contato_nome),
    email: asText(answers.contato_email),
    whatsapp: asText(answers.contato_whatsapp),
    empresa: asText(answers.marca_nome),
    respostas,
    arquivos,
    resumoMarkdown: buildMarkdown(answers),
    meta: {
      totalPerguntas: questions.length,
      respondidas: Object.keys(respostas).length,
      duracaoSegundos,
    },
    enviadoEm: new Date().toISOString(),
    origem: ORIGIN,
  };
}

/**
 * Versão legível do briefing. Permite que o destino do webhook encaminhe o
 * conteúdo por e-mail ou WhatsApp sem precisar percorrer o JSON.
 */
export function buildMarkdown(answers: Answers): string {
  const lines: string[] = [`# Briefing de Identidade Visual`];
  const brandName = asText(answers.marca_nome);
  if (brandName) lines.push(`**Marca:** ${brandName}`);

  let currentSection: number | null = null;

  for (const question of questions) {
    if (question.showIf && !question.showIf(answers)) continue;

    const value = answers[question.id];
    if (isBlank(value)) continue;

    if (question.section !== currentSection) {
      currentSection = question.section;
      lines.push('', `## ${sectionLabel(question.section)}`);
    }

    let rendered: string;

    if (question.type === 'file' && isFileAnswer(value)) {
      const items = [...value.files.map((file) => `- ${file.name}: ${file.url}`)];
      if (value.link.trim()) items.push(`- Link: ${value.link.trim()}`);
      rendered = items.join('\n');
    } else {
      const resolved = withOtherText(question, answers);
      rendered = Array.isArray(resolved) ? resolved.map((item) => `- ${item}`).join('\n') : resolved;
    }

    lines.push('', `**${question.label}**`, rendered);
  }

  return lines.join('\n');
}
