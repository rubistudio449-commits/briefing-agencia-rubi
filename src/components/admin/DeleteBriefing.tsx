'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

import { excluirBriefing } from '@/app/admin/(protected)/actions';

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-11 items-center rounded-full bg-danger px-6 text-[0.75rem] uppercase tracking-[0.16em] text-ink transition-opacity hover:opacity-85 disabled:opacity-50"
    >
      {pending ? 'Excluindo…' : 'Excluir definitivamente'}
    </button>
  );
}

/**
 * Confirmação em dois passos em vez de `window.confirm`: a exclusão é
 * definitiva e o diálogo nativo é fácil demais de aceitar sem ler.
 */
export function DeleteBriefing({ id, empresa }: { id: string; empresa: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex min-h-11 items-center px-2 text-sm text-faint transition-colors hover:text-danger"
      >
        Excluir briefing
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-danger/40 p-4">
      <p className="text-sm text-paper">
        Excluir o briefing de <strong>{empresa || 'marca sem nome'}</strong>? As respostas e os
        links das referências serão perdidos e não há como desfazer.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <form action={excluirBriefing}>
          <input type="hidden" name="id" value={id} />
          <ConfirmButton />
        </form>

        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex min-h-11 items-center px-3 text-sm text-muted transition-colors hover:text-paper"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
