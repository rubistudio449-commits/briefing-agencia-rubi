import Link from 'next/link';

import { listSubmissions, storageEnabled } from '@/lib/submissions';

export const dynamic = 'force-dynamic';

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export default async function AdminHomePage() {
  const submissions = storageEnabled() ? await listSubmissions() : [];

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="type-question text-paper">Briefings recebidos</h1>
      <p className="mt-3 text-sm text-muted">
        {submissions.length === 0
          ? 'Nenhum briefing por enquanto.'
          : `${submissions.length} ${submissions.length === 1 ? 'briefing' : 'briefings'} até agora.`}
      </p>

      {!storageEnabled() ? (
        <p className="mt-10 rounded-lg border border-line p-5 text-sm leading-relaxed text-muted">
          O arquivamento não está ativo. Conecte um Blob Store ao projeto na Vercel
          (<span className="text-accent-soft">Storage → Blob → Connect</span>) para que os briefings
          enviados fiquem guardados aqui.
        </p>
      ) : null}

      {submissions.length > 0 ? (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {submissions.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin/${item.id}`}
                className="group flex flex-col gap-2 py-5 transition-colors hover:bg-paper/[0.02] sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-paper">
                    {item.empresa || 'Marca sem nome'}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted">
                    {item.nome}
                    {item.email ? ` · ${item.email}` : ''}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-5 text-xs text-faint">
                  <span className="tabular-nums">
                    {item.respondidas}/{item.totalPerguntas} respostas
                  </span>
                  {item.arquivos > 0 ? (
                    <span className="text-accent-soft">
                      {item.arquivos} {item.arquivos === 1 ? 'arquivo' : 'arquivos'}
                    </span>
                  ) : null}
                  <span className="whitespace-nowrap">{formatDateTime(item.enviadoEm)}</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
