import Link from 'next/link';

import { forms, resolveForm } from '@/data/forms';
import { listSubmissions, storageEnabled, storageIsLocal } from '@/lib/submissions';

export const dynamic = 'force-dynamic';

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

interface AdminHomeProps {
  searchParams: Promise<{ tipo?: string }>;
}

export default async function AdminHomePage({ searchParams }: AdminHomeProps) {
  const { tipo } = await searchParams;
  const all = storageEnabled() ? await listSubmissions() : [];

  const counts = new Map<string, number>();
  for (const item of all) {
    const slug = resolveForm(item.formulario).slug;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  const filtered = tipo ? all.filter((item) => resolveForm(item.formulario).slug === tipo) : all;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="type-question text-paper">Briefings recebidos</h1>
      <p className="mt-3 text-sm text-muted">
        {all.length === 0
          ? 'Nenhum briefing por enquanto.'
          : `${all.length} ${all.length === 1 ? 'briefing' : 'briefings'} até agora.`}
      </p>

      {!storageEnabled() ? (
        <p className="mt-10 rounded-lg border border-line p-5 text-sm leading-relaxed text-muted">
          O arquivamento não está ativo. Conecte um Blob Store ao projeto na Vercel
          (<span className="text-accent-soft">Storage → Blob → Connect</span>) para que os briefings
          enviados fiquem guardados aqui.
        </p>
      ) : null}

      {storageIsLocal() ? (
        <p className="mt-10 rounded-lg border border-line p-5 text-sm leading-relaxed text-muted">
          Ambiente de desenvolvimento: os briefings estão sendo gravados na pasta local{' '}
          <span className="text-accent-soft">.briefings</span>. Em produção é o Vercel Blob que
          guarda tudo.
        </p>
      ) : null}

      {/* Filtro por tipo: cada formulário tem um público e um momento diferente. */}
      {all.length > 0 ? (
        <nav className="mt-10 flex flex-wrap gap-2.5" aria-label="Filtrar por tipo de briefing">
          <FilterChip href="/admin" active={!tipo} label="Todos" count={all.length} />
          {forms.map((form) => (
            <FilterChip
              key={form.slug}
              href={`/admin?tipo=${form.slug}`}
              active={tipo === form.slug}
              label={form.name}
              count={counts.get(form.slug) ?? 0}
            />
          ))}
        </nav>
      ) : null}

      {filtered.length > 0 ? (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {filtered.map((item) => {
            const form = resolveForm(item.formulario);

            return (
              <li key={item.id}>
                <Link
                  href={`/admin/${item.id}`}
                  className="group flex flex-col gap-2 py-5 transition-colors hover:bg-paper/[0.02] sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="type-eyebrow text-accent-soft">{form.name}</p>
                    <p className="mt-1.5 font-display text-xl text-paper">
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
            );
          })}
        </ul>
      ) : null}

      {all.length > 0 && filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nenhum briefing deste tipo ainda.</p>
      ) : null}
    </main>
  );
}

function FilterChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm text-ink'
          : 'flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm text-muted transition-colors hover:border-line-strong hover:text-paper'
      }
    >
      {label}
      <span className={active ? 'text-ink/50 tabular-nums' : 'text-faint tabular-nums'}>{count}</span>
    </Link>
  );
}
