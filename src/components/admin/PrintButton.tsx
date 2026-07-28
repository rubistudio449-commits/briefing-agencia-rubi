'use client';

export function PrintButton() {
  return (
    <div className="mb-10 flex flex-wrap items-center gap-4 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-11 items-center rounded-full bg-black px-6 text-[0.75rem] uppercase tracking-[0.16em] text-white transition-transform duration-300 hover:-translate-y-px"
      >
        Baixar PDF
      </button>
      <p className="text-sm text-neutral-500">
        Na janela que abrir, escolha <strong className="text-black">Salvar como PDF</strong>{' '}
        em &ldquo;Destino&rdquo;.
      </p>
    </div>
  );
}
