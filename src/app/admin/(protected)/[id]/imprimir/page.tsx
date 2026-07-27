import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PrintButton } from '@/components/admin/PrintButton';
import { SubmissionView } from '@/components/admin/SubmissionView';
import { brand } from '@/config/brand';
import { readSubmission } from '@/lib/submissions';

export const dynamic = 'force-dynamic';

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(iso));

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await readSubmission(id);

  if (!submission) notFound();

  return (
    /* Documento em fundo claro: preto sobre branco imprime melhor e economiza tinta. */
    <div className="min-h-svh bg-white text-black print:min-h-0">
      <div className="mx-auto max-w-3xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
        <div className="print:hidden">
          <Link
            href={`/admin/${id}`}
            className="text-xs uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-black"
          >
            ← Voltar ao briefing
          </Link>
          <div className="mt-6">
            <PrintButton />
          </div>
        </div>

        <header className="border-b border-neutral-300 pb-8">
          <Image
            src="/brand/wordmark-black.png"
            alt={brand.legalName}
            width={1400}
            height={341}
            className="h-auto w-40"
          />

          <h1 className="mt-8 font-display text-3xl">{submission.empresa || 'Marca sem nome'}</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Briefing de Identidade Visual · recebido em {formatDate(submission.enviadoEm)}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">
                Contato
              </dt>
              <dd className="mt-0.5">{submission.nome || '—'}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">
                E-mail
              </dt>
              <dd className="mt-0.5 break-all">{submission.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-neutral-500">
                WhatsApp
              </dt>
              <dd className="mt-0.5">{submission.whatsapp || '—'}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-10">
          <SubmissionView submission={submission} variant="print" />
        </div>

        <footer className="mt-14 border-t border-neutral-300 pt-6 text-xs text-neutral-500">
          {brand.legalName} · {brand.tagline}
        </footer>
      </div>
    </div>
  );
}
