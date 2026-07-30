import Link from 'next/link';

import { forms, requiredCount } from '@/data/forms';
import { siteUrl } from '@/config/brand';

export const dynamic = 'force-dynamic';

const typeLabels: Record<string, string> = {
  shortText: 'Texto curto',
  longText: 'Texto longo',
  email: 'E-mail',
  phone: 'Telefone',
  url: 'Endereço de site',
  number: 'Número',
  radioCards: 'Escolha única',
  checkboxGrid: 'Múltipla escolha',
  multiSelect: 'Múltipla com busca',
  file: 'Arquivo ou link',
};

export default function FormulariosPage() {
  const base = siteUrl().origin;

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="type-question text-paper">Formulários ativos</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Os questionários publicados hoje, com todas as perguntas que o cliente vê. Use esta página
        para conferir o conteúdo antes de enviar o link.
      </p>

      <div className="mt-12 space-y-16">
        {forms.map((form) => {
          const link = `${base}${form.landingPath}`;

          return (
            <section key={form.slug}>
              <header className="border-b border-line pb-6">
                <h2 className="font-display text-2xl text-paper">{form.name}</h2>
                <p className="type-eyebrow mt-2 text-accent-soft">{form.copy.eyebrow}</p>

                <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-sm">
                  <div>
                    <dt className="type-eyebrow text-faint">Seções</dt>
                    <dd className="mt-1 text-paper tabular-nums">{form.sections.length}</dd>
                  </div>
                  <div>
                    <dt className="type-eyebrow text-faint">Perguntas</dt>
                    <dd className="mt-1 text-paper tabular-nums">{form.questions.length}</dd>
                  </div>
                  <div>
                    <dt className="type-eyebrow text-faint">Obrigatórias</dt>
                    <dd className="mt-1 text-paper tabular-nums">{requiredCount(form)}</dd>
                  </div>
                  <div>
                    <dt className="type-eyebrow text-faint">Tempo médio</dt>
                    <dd className="mt-1 text-paper tabular-nums">{form.estimatedMinutes} min</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <p className="type-eyebrow text-faint">Link para o cliente</p>
                  <Link
                    href={form.landingPath}
                    className="mt-1 inline-block break-all text-sm text-accent-soft underline underline-offset-4 hover:text-paper"
                  >
                    {link}
                  </Link>
                </div>
              </header>

              <ol className="mt-8 space-y-10">
                {form.sections.map((section) => {
                  const list = form.questions.filter((question) => question.section === section.id);
                  if (list.length === 0) return null;

                  return (
                    <li key={section.id}>
                      <h3 className="font-display text-lg text-paper">
                        <span className="text-accent">{section.label}</span> {section.title}
                      </h3>

                      <ul className="mt-4 space-y-3 border-l border-line pl-5">
                        {list.map((question) => (
                          <li key={question.id}>
                            <p className="text-[0.9375rem] leading-snug text-paper">
                              {question.label}
                              {question.required ? (
                                <span className="ml-1.5 text-accent-soft" title="Obrigatória">
                                  *
                                </span>
                              ) : null}
                            </p>

                            {question.helper ? (
                              <p className="mt-1 text-sm text-muted">{question.helper}</p>
                            ) : null}

                            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-faint">
                              <span>{typeLabels[question.type] ?? question.type}</span>
                              {question.options ? <span>{question.options.length} opções</span> : null}
                              {question.maxSelections ? (
                                <span>até {question.maxSelections}</span>
                              ) : null}
                              {question.showIf ? (
                                <span className="text-accent-soft">condicional</span>
                              ) : null}
                              <span className="font-mono opacity-60">{question.id}</span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </main>
  );
}
