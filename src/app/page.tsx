import Link from 'next/link';

import { Wordmark } from '@/components/brand/Wordmark';
import { brand, brandCopy } from '@/config/brand';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center px-5 py-16 sm:px-6 sm:py-20">
      <Wordmark size="lg" />

      <p className="type-eyebrow mt-16 text-accent-soft">{brand.tagline}</p>

      <h1 className="type-display mt-5 text-paper">{brandCopy.welcomeTitle}</h1>

      <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
        {brandCopy.welcomeLead}
      </p>

      <div className="mt-8 max-w-xl space-y-5 text-[0.9375rem] leading-relaxed text-muted">
        {brandCopy.welcomeBody.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-[0.9375rem] leading-relaxed text-paper">
        {brandCopy.welcomeClosing}
      </p>

      <div className="mt-12 border-t border-line pt-10 sm:mt-14 sm:pt-12" />

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        {/* Ocupa a largura toda no celular: alvo de toque generoso. */}
        <Link
          href="/briefing"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-paper px-9 text-center text-[0.8125rem] uppercase tracking-[0.16em] text-ink transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-px hover:shadow-[0_10px_30px_-12px_rgba(239,239,239,0.45)] sm:w-auto"
        >
          Começar o briefing
        </Link>
        <p className="text-sm text-faint">
          Uma pergunta por vez. Suas respostas ficam salvas automaticamente.
        </p>
      </div>
    </main>
  );
}
