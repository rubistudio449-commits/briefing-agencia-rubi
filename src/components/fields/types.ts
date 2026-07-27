import type { AnswerValue, Question } from '@/types/briefing';

export interface FieldProps {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  /** Texto complementar quando a opção "Outro" está marcada. */
  otherValue: string;
  onOtherChange: (value: string) => void;
  /** Avança para a próxima pergunta. */
  onAdvance: () => void;
  invalid: boolean;
  /** Id do elemento de apoio/erro, para `aria-describedby`. */
  describedBy?: string;
}
