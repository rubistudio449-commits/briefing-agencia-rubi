import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DeleteBriefing } from '@/components/admin/DeleteBriefing';
import { SubmissionView } from '@/components/admin/SubmissionView';
import { readSubmission } from '@/lib/submissions';

export const dynamic = 'force-dynamic';

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(iso));

const formatDuration = (seconds: number | null) => {
  if (seconds === null) return null;
  const minutes = Math.round(seconds / 60);
  return minutes < 1 ? 'menos de um minuto' : `${minutes} min`;
};

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await readSubmission(id);

  if (!submission) notFound();

  const duration = formatDuration(submission.meta.duracaoSegundos);
  const totalArquivos = Object.values(submission.arquivos).reduce(
    (total, entry) => total + entry.urls.length,
    0,
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href="/admin"
        className="type-eyebrow inline-flex items-center gap-2 text-faint transition-colors hover:text-paper"
      >
        <span aria-hidden>←</span> Todos os briefings
      </Link>

      <header className="mt-8 border-b border-line pb-8">
        <h1 className="type-question text-paper">{submission.empresa || 'Marca sem nome'}</h1>

        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="type-eyebrow text-faint">Contato</dt>
            <dd className="mt-1 text-paper">{submission.nome || '—'}</dd>
          </div>
          <div className="min-w-0">
            <dt className="type-eyebrow text-faint">E-mail</dt>
            <dd className="mt-1 truncate text-paper">{submission.email || '—'}</dd>
          </div>
          <div>
            <dt className="type-eyebrow text-faint">WhatsApp</dt>
            <dd className="mt-1 text-paper">{submission.whatsapp || '—'}</dd>
          </div>
          <div>
            <dt className="type-eyebrow text-faint">Respostas</dt>
            <dd className="mt-1 text-paper tabular-nums">
              {submission.meta.respondidas}/{submission.meta.totalPerguntas}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-xs text-faint">
          Recebido em {formatDateTime(submission.enviadoEm)}
          {duration ? ` · preenchido em ${duration}` : ''}
          {totalArquivos > 0 ? ` · ${totalArquivos} arquivo${totalArquivos === 1 ? '' : 's'}` : ''}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/admin/${id}/imprimir`}
            className="inline-flex min-h-11 items-center rounded-full bg-paper px-6 text-[0.75rem] uppercase tracking-[0.16em] text-ink transition-transform duration-300 hover:-translate-y-px"
          >
            Baixar PDF
          </Link>
          {totalArquivos > 0 ? (
            <a
              href={`/admin/${id}/imprimir#referencias`}
              className="inline-flex min-h-11 items-center rounded-full border border-line px-6 text-[0.75rem] uppercase tracking-[0.16em] text-muted transition-colors hover:border-line-strong hover:text-paper"
            >
              Ver referências
            </a>
          ) : null}
        </div>
      </header>

      <div className="mt-12">
        <SubmissionView submission={submission} />
      </div>

      {/* Longe dos botões do topo: exclusão não pode ficar ao alcance de um clique distraído. */}
      <div className="mt-16 border-t border-line pt-8">
        <DeleteBriefing id={id} empresa={submission.empresa} />
      </div>
    </main>
  );
}
