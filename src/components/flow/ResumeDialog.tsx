'use client';

import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/Button';
import { countAnswered } from '@/lib/storage';
import type { BriefingDraft } from '@/lib/storage';

interface ResumeDialogProps {
  draft: BriefingDraft;
  onResume: () => void;
  onDiscard: () => void;
}

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }).format(
    new Date(timestamp),
  );

export function ResumeDialog({ draft, onResume, onDiscard }: ResumeDialogProps) {
  const resumeRef = useRef<HTMLButtonElement>(null);
  const answered = countAnswered(draft.answers);

  useEffect(() => {
    resumeRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 px-5 backdrop-blur-sm sm:px-6">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-xl border border-line bg-ink-raised p-6 sm:p-8"
      >
        <h2 id="resume-title" className="font-display text-2xl text-paper">
          Você já começou este briefing
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          Encontramos {answered} {answered === 1 ? 'resposta salva' : 'respostas salvas'} neste
          navegador, da última vez em {formatDate(draft.updatedAt)}.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button ref={resumeRef} onClick={onResume}>
            Continuar de onde parei
          </Button>
          <Button variant="ghost" onClick={onDiscard}>
            Começar do zero
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
