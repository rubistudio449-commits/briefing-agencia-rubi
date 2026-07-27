/** Tipos do briefing. A transcrição das perguntas vive em `src/data/briefing.ts`. */

export type FieldType =
  | 'shortText'
  | 'longText'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  /** Escolha única: cartões grandes com atalho de teclado. */
  | 'radioCards'
  /** Até 8 opções, múltipla escolha: grade de chips. */
  | 'checkboxGrid'
  /** 9+ opções, múltipla escolha: campo com busca, chips e contador. */
  | 'multiSelect'
  /** Upload para o Vercel Blob, com link como alternativa. */
  | 'file';

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  contentType: string;
}

export interface FileAnswer {
  files: UploadedFile[];
  link: string;
}

export type AnswerValue = string | string[] | FileAnswer | null;

export type Answers = Record<string, AnswerValue>;

export interface Question {
  /** Identificador estável — vira a chave em `respostas` no payload do webhook. */
  id: string;
  section: number;
  /** Enunciado exato do documento original. */
  label: string;
  /** Linha de apoio do documento, quando existe. */
  helper?: string;
  placeholder?: string;
  type: FieldType;
  required: boolean;
  options?: readonly string[];
  /**
   * Opção que revela um campo de texto livre. O valor deve constar em `options`
   * — o documento alterna entre "Outro" e "Outra" conforme a concordância.
   */
  otherOption?: string;
  /** Limite de "escolha até N". */
  maxSelections?: number;
  /** Só exibe a pergunta quando a condição é satisfeita. */
  showIf?: (answers: Answers) => boolean;
}

export interface Section {
  id: number;
  /** Numeral exibido: "01", "02", … */
  label: string;
  title: string;
  /** Frase curta exibida na tela de abertura da seção. */
  intro: string;
}

export type Step =
  | { kind: 'section'; id: string; section: Section }
  | { kind: 'question'; id: string; question: Question; section: Section }
  /** Passo final: revisão e envio. */
  | { kind: 'review'; id: 'review' };

/** Sufixo da resposta complementar de uma opção "Outro". */
export const OTHER_SUFFIX = '__outro';

export const otherFieldId = (questionId: string) => `${questionId}${OTHER_SUFFIX}`;

export const emptyFileAnswer = (): FileAnswer => ({ files: [], link: '' });

export const isFileAnswer = (value: unknown): value is FileAnswer =>
  typeof value === 'object' && value !== null && 'files' in value && 'link' in value;
