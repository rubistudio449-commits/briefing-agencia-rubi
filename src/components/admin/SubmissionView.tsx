import { questions, sections } from '@/data/briefing';
import type { StoredSubmission } from '@/lib/submissions';

interface SubmissionViewProps {
  submission: StoredSubmission;
  /** Na versão de impressão as cores invertem e as imagens ficam menores. */
  variant?: 'screen' | 'print';
}

const renderAnswer = (value: string | string[]) =>
  Array.isArray(value) ? value.join(' · ') : value;

export function SubmissionView({ submission, variant = 'screen' }: SubmissionViewProps) {
  const isPrint = variant === 'print';

  return (
    <div className="space-y-12">
      {sections.map((section) => {
        const answered = questions.filter(
          (question) => question.section === section.id && submission.respostas[question.id],
        );

        if (answered.length === 0) return null;

        return (
          <section key={section.id} className={isPrint ? 'break-inside-avoid' : undefined}>
            <h2
              className={
                isPrint
                  ? 'border-b border-neutral-300 pb-2 font-display text-lg text-black'
                  : 'border-b border-line pb-2 font-display text-xl text-paper'
              }
            >
              <span className={isPrint ? 'text-neutral-500' : 'text-accent'}>{section.label}</span>{' '}
              {section.title}
            </h2>

            <dl className="mt-6 space-y-6">
              {answered.map((question) => {
                const entry = submission.respostas[question.id];
                const files = submission.arquivos[question.id];

                return (
                  <div key={question.id} className={isPrint ? 'break-inside-avoid' : undefined}>
                    <dt
                      className={
                        isPrint
                          ? 'text-[0.7rem] font-medium uppercase tracking-[0.12em] text-neutral-500'
                          : 'type-eyebrow text-faint'
                      }
                    >
                      {question.label}
                    </dt>

                    {files ? (
                      <dd className="mt-2">
                        {files.urls.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {files.urls.map((url) => (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                key={url}
                                src={url}
                                alt=""
                                className={
                                  isPrint
                                    ? 'h-32 w-32 rounded border border-neutral-300 object-cover'
                                    : 'h-28 w-28 rounded-lg border border-line object-cover'
                                }
                              />
                            ))}
                          </div>
                        ) : null}

                        {files.link ? (
                          <p className={isPrint ? 'mt-2 text-sm break-all text-black' : 'mt-2 text-sm break-all text-paper'}>
                            {files.link}
                          </p>
                        ) : null}
                      </dd>
                    ) : (
                      <dd
                        className={
                          isPrint
                            ? 'mt-1.5 text-[0.9rem] leading-relaxed whitespace-pre-wrap text-black'
                            : 'mt-1.5 leading-relaxed whitespace-pre-wrap text-paper'
                        }
                      >
                        {renderAnswer(entry.resposta)}
                      </dd>
                    )}
                  </div>
                );
              })}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
