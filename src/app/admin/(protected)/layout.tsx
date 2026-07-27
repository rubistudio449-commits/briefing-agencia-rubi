import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Wordmark } from '@/components/brand/Wordmark';
import { isAuthenticated } from '@/lib/adminAuth';

export const metadata: Metadata = {
  title: 'Briefings recebidos | RUBI Agência',
  robots: { index: false, follow: false },
};

/** Toda rota sob este layout exige sessão válida. */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect('/admin/login');

  return (
    <div className="min-h-svh">
      <header className="border-b border-line print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/admin" className="flex items-center gap-4">
            <Wordmark size="sm" />
            <span className="type-eyebrow hidden text-faint sm:inline">Painel interno</span>
          </Link>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="flex min-h-11 items-center px-2 text-sm text-faint transition-colors hover:text-paper"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      {children}
    </div>
  );
}
