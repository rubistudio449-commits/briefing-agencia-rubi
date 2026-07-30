'use client';

import { motion, useReducedMotion } from 'motion/react';

import { BrandSymbol, Wordmark } from '@/components/brand/Wordmark';
import type { BriefingForm } from '@/types/briefing';

interface SuccessScreenProps {
  form: BriefingForm;
  durationSeconds: number | null;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return 'menos de um minuto';
  return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
};

export function SuccessScreen({ form, durationSeconds }: SuccessScreenProps) {
  const copy = form.copy;
  const reduced = useReducedMotion();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 py-16 text-center sm:px-6 sm:py-20">
      {/* Símbolo da marca, em bronze, abrindo a tela. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.86, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <BrandSymbol size={64} tone="bronze" />
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 max-w-xl"
      >
        <h1 className="type-display text-paper">{copy.successTitle}</h1>

        <div className="mt-8 space-y-4 text-[0.9375rem] leading-relaxed text-muted">
          {copy.successBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {durationSeconds !== null ? (
          <p className="mt-8 text-sm text-faint">
            Briefing concluído em {formatDuration(durationSeconds)}.
          </p>
        ) : null}

        <div className="mt-14 flex justify-center border-t border-line pt-10">
          <Wordmark size="md" />
        </div>
      </motion.div>
    </div>
  );
}
