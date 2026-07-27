import { z } from 'zod';

import { isFileAnswer, otherFieldId, type Answers, type Question } from '@/types/briefing';

const emailSchema = z.email();
const urlSchema = z.url();

export const REQUIRED_MESSAGE = 'Esta pergunta é obrigatória.';

/** Dígitos de um telefone brasileiro, com ou sem o nono dígito. */
export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export const isBlank = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (isFileAnswer(value)) return value.files.length === 0 && value.link.trim() === '';
  return false;
};

/**
 * Valida uma única pergunta. Retorna a mensagem de erro ou `null`.
 * Recebe todas as respostas porque campos "Outro" dependem de uma resposta
 * complementar guardada sob `<id>__outro`.
 */
export function validateAnswer(question: Question, answers: Answers): string | null {
  const value = answers[question.id];

  if (isBlank(value)) {
    return question.required ? REQUIRED_MESSAGE : null;
  }

  switch (question.type) {
    case 'email': {
      if (!emailSchema.safeParse(String(value).trim()).success) {
        return 'Informe um e-mail válido.';
      }
      break;
    }

    case 'phone': {
      const digits = digitsOnly(String(value));
      if (digits.length < 10 || digits.length > 11) {
        return 'Informe um número com DDD, no formato (00) 00000-0000.';
      }
      break;
    }

    case 'url': {
      if (!urlSchema.safeParse(String(value).trim()).success) {
        return 'Informe um endereço válido, começando com https://';
      }
      break;
    }

    case 'multiSelect':
    case 'checkboxGrid': {
      const selected = Array.isArray(value) ? value : [];
      if (question.maxSelections && selected.length > question.maxSelections) {
        return `Escolha no máximo ${question.maxSelections} opções.`;
      }
      break;
    }

    case 'file': {
      if (isFileAnswer(value) && value.link.trim() !== '') {
        if (!urlSchema.safeParse(value.link.trim()).success) {
          return 'O link informado não é válido. Cole o endereço completo, com https://';
        }
      }
      break;
    }

    default:
      break;
  }

  // Marcou "Outro" (ou "Outra") sem dizer qual.
  if (question.otherOption && isOtherSelected(question, value)) {
    if (isBlank(answers[otherFieldId(question.id)])) {
      return `Conte-nos qual: o campo "${question.otherOption}" precisa ser preenchido.`;
    }
  }

  return null;
}

export function isOtherSelected(question: Question, value: unknown): boolean {
  if (!question.otherOption) return false;
  if (Array.isArray(value)) return value.includes(question.otherOption);
  return value === question.otherOption;
}

/** Schema do payload recebido pela rota de envio — a entrada vem do cliente. */
export const submissionSchema = z.object({
  answers: z.record(z.string(), z.unknown()),
  startedAt: z.number().int().nonnegative().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
