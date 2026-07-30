'use client';

import { Button } from '@/components/ui/Button';
import { sectionLabel } from '@/data/forms';
import type { BriefingForm, Question } from '@/types/briefing';
import type { SubmitStatus } from '@/hooks/useBriefingFlow';

interface ReviewScreenProps {
  form: BriefingForm;
  answered: number;
  total: number;
  pending: Question[];
  status: SubmitStatus;
  submitError: string | null;
  onSubmit: () => void;
  onGoToQuestion: (questionId: string) => void;
}

export function ReviewScreen({
  form,
  answered,
  total,
  pending,
  status,
  submitError,
  onSubmit,
  onGoToQuestion,
}: ReviewScreenProps) {
  const complete = pending.length === 0;

  return (
    <div>
      <p className="type-eyebrow text-faint">Última etapa</p>

      <h2 className="type-display mt-5 text-paper">
        {complete ? 'Tudo pronto para enviar.' : 'Faltam algumas obrigatórias.'}
      </h2>

      <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
        {complete
          ? 'Você respondeu tudo o que precisávamos. Ao enviar, o briefing segue direto para a nossa equipe e a criação começa.'
          : 'Você pode revisar qualquer resposta antes de enviar, mas estas perguntas obrigatórias ainda estão em branco.'}
      </p>

      <dl className="mt-10 flex gap-10 border-t border-line pt-6">
        <div>
          <dt className="type-eyebrow text-faint">Respondidas</dt>
          <dd className="mt-1.5 font-display text-3xl text-paper tabular-nums">
            {answered}
            <span className="text-faint">/{total}</span>
          </dd>
        </div>
        <div>
          <dt className="type-eyebrow text-faint">Obrigatórias pendentes</dt>
          <dd className="mt-1.5 font-display text-3xl tabular-nums">
            <span className={pending.length ? 'text-danger' : 'text-paper'}>{pending.length}</span>
          </dd>
        </div>
      </dl>

      {pending.length > 0 ? (
        <ul className="mt-8 space-y-2">
          {pending.map((question) => (
            <li key={question.id}>
              <button
                type="button"
                onClick={() => onGoToQuestion(question.id)}
                className="group flex w-full items-center gap-4 rounded-lg border border-line px-4 py-3 text-left transition-colors hover:border-line-strong hover:bg-paper/[0.02]"
              >
                <span className="type-eyebrow shrink-0 text-faint">
                  {sectionLabel(form, question.section).split(' | ')[0]}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-muted group-hover:text-paper">
                  {question.label}
                </span>
                <span aria-hidden className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {submitError ? (
        <p role="alert" className="mt-8 rounded-lg border border-danger/40 px-4 py-3 text-sm text-danger">
          {submitError} Suas respostas continuam salvas neste navegador.
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <Button onClick={onSubmit} disabled={status === 'submitting'}>
          {status === 'submitting'
            ? 'Enviando…'
            : status === 'error'
              ? 'Tentar novamente'
              : 'Enviar briefing'}
        </Button>
        {!complete ? (
          <span className="text-sm text-faint">
            Responda as pendências acima para concluir o envio.
          </span>
        ) : null}
      </div>
    </div>
  );
}
