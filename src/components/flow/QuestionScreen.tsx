'use client';

import { FieldRenderer } from '@/components/fields/FieldRenderer';
import { Button } from '@/components/ui/Button';
import { ErrorText } from '@/components/ui/ErrorText';
import { Kbd, KbdHint } from '@/components/ui/KbdHint';
import { otherFieldId, type AnswerValue, type Answers, type Question, type Section } from '@/types/briefing';

interface QuestionScreenProps {
  question: Question;
  section: Section;
  answers: Answers;
  error: string | null;
  onChange: (value: AnswerValue) => void;
  onOtherChange: (value: string) => void;
  onAdvance: () => void;
}

export function QuestionScreen({
  question,
  section,
  answers,
  error,
  onChange,
  onOtherChange,
  onAdvance,
}: QuestionScreenProps) {
  const helperId = `${question.id}-helper`;
  const errorId = `${question.id}-error`;
  const describedBy = [question.helper ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  const otherValue = answers[otherFieldId(question.id)];

  return (
    <div>
      <p className="type-eyebrow text-faint">
        {section.label} · {section.title}
      </p>

      <div className="mt-5 flex items-start gap-3">
        {/* `break-words` sem `hyphens`: a serifada de display fica ruim hifenizada. */}
        <h2 className="type-question break-words text-paper" id={`${question.id}-label`}>
          {question.label}
        </h2>
        {question.required ? (
          <span className="mt-2 text-accent-soft" title="Pergunta obrigatória" aria-hidden>
            *
          </span>
        ) : null}
      </div>

      {question.helper ? (
        <p id={helperId} className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
          {question.helper}
        </p>
      ) : null}

      <div className="mt-9">
        <FieldRenderer
          question={question}
          value={answers[question.id] ?? null}
          onChange={onChange}
          otherValue={typeof otherValue === 'string' ? otherValue : ''}
          onOtherChange={onOtherChange}
          onAdvance={onAdvance}
          invalid={Boolean(error)}
          describedBy={describedBy || undefined}
        />
        <ErrorText id={errorId} message={error} />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button onClick={onAdvance}>Continuar</Button>
        {!question.required ? (
          <button
            type="button"
            onClick={onAdvance}
            className="flex min-h-11 items-center px-2 text-sm text-faint underline-offset-4 transition-colors hover:text-muted hover:underline"
          >
            Pular esta pergunta
          </button>
        ) : null}
        <KbdHint className="ml-auto">
          <Kbd>Enter</Kbd> avança · <Kbd>Esc</Kbd> volta
        </KbdHint>
      </div>
    </div>
  );
}
