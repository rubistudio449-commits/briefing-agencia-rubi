import type { Metadata } from 'next';

import { Wordmark } from '@/components/brand/Wordmark';
import { adminEnabled } from '@/lib/adminAuth';

export const metadata: Metadata = {
  title: 'Painel interno | RUBI Agência',
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ erro?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { erro } = await searchParams;

  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-5 py-16">
      <Wordmark size="md" />

      <h1 className="type-question mt-12 text-paper">Painel interno</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Acesso restrito à equipe da RUBI. Aqui ficam os briefings recebidos.
      </p>

      {adminEnabled() ? (
        <form action="/api/admin/login" method="post" className="mt-10">
          <label htmlFor="senha" className="type-eyebrow text-faint">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            className="mt-2 w-full border-0 border-b border-line bg-transparent pb-3 text-lg outline-none transition-colors focus:border-paper"
          />

          {erro ? (
            <p role="alert" className="mt-3 text-sm text-danger">
              Senha incorreta.
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-paper px-8 text-[0.8125rem] uppercase tracking-[0.16em] text-ink transition-transform duration-300 hover:-translate-y-px"
          >
            Entrar
          </button>
        </form>
      ) : (
        <p className="mt-10 rounded-lg border border-line p-5 text-sm leading-relaxed text-muted">
          O painel ainda não foi configurado. Defina a variável de ambiente{' '}
          <code className="text-accent-soft">ADMIN_PASSWORD</code> no projeto da Vercel e faça um
          novo deploy.
        </p>
      )}
    </main>
  );
}
