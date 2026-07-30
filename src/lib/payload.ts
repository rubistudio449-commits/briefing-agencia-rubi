import { sectionLabel } from '@/data/forms';
import { isBlank } from '@/lib/validation';
import {
  isFileAnswer,
  otherFieldId,
  type Answers,
  type BriefingForm,
  type Question,
} from '@/types/briefing';

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
  /** Qual formulário originou o briefing. */
  formulario: string;
  formularioNome: string;
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

const asText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** Primeiro campo preenchido entre vários candidatos — os ids mudam por formulário. */
const firstOf = (answers: Answers, ...ids: string[]): string => {
  for (const id of ids) {
    const value = asText(answers[id]);
    if (value) return value;
  }
  return '';
};

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

export function buildPayload(
  form: BriefingForm,
  answers: Answers,
  startedAt?: number,
): BriefingPayload {
  const respostas: Record<string, AnswerEntry> = {};
  const arquivos: Record<string, FileEntry> = {};

  for (const question of form.questions) {
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
        secao: sectionLabel(form, question.section),
        resposta: [...value.files.map((file) => file.url), value.link.trim()].filter(Boolean),
      };
      continue;
    }

    respostas[question.id] = {
      pergunta: question.label,
      secao: sectionLabel(form, question.section),
      resposta: withOtherText(question, answers),
    };
  }

  const duracaoSegundos =
    typeof startedAt === 'number' && startedAt > 0 && startedAt <= Date.now()
      ? Math.round((Date.now() - startedAt) / 1000)
      : null;

  return {
    formulario: form.slug,
    formularioNome: form.name,
    nome: firstOf(answers, 'contato_nome', 'resp_nome'),
    email: firstOf(answers, 'contato_email', 'resp_email'),
    whatsapp: firstOf(answers, 'contato_whatsapp', 'resp_whatsapp'),
    empresa: firstOf(answers, 'marca_nome', 'empresa_nome'),
    respostas,
    arquivos,
    resumoMarkdown: buildMarkdown(form, answers),
    meta: {
      totalPerguntas: form.questions.length,
      respondidas: Object.keys(respostas).length,
      duracaoSegundos,
    },
    enviadoEm: new Date().toISOString(),
    origem: form.name,
  };
}

/**
 * Versão legível do briefing. Permite que o destino do webhook encaminhe o
 * conteúdo por e-mail ou WhatsApp sem precisar percorrer o JSON.
 */
export function buildMarkdown(form: BriefingForm, answers: Answers): string {
  const lines: string[] = [`# ${form.name}`];
  const brandName = firstOf(answers, 'marca_nome', 'empresa_nome');
  if (brandName) lines.push(`**Marca:** ${brandName}`);

  let currentSection: number | null = null;

  for (const question of form.questions) {
    if (question.showIf && !question.showIf(answers)) continue;

    const value = answers[question.id];
    if (isBlank(value)) continue;

    if (question.section !== currentSection) {
      currentSection = question.section;
      lines.push('', `## ${sectionLabel(form, question.section)}`);
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
