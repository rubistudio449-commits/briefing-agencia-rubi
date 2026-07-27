'use client';

import { motion } from 'motion/react';

import { Wordmark } from '@/components/brand/Wordmark';

interface ProgressBarProps {
  progress: number;
  questionNumber: number;
  totalQuestions: number;
  sectionTitle: string | null;
}

export function ProgressBar({
  progress,
  questionNumber,
  totalQuestions,
  sectionTitle,
}: ProgressBarProps) {
  const percent = Math.round(progress * 100);

  return (
    <header className="sticky top-0 z-30 bg-ink/85 backdrop-blur-md">
      <div
        className="h-px w-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Progresso do briefing"
      >
        <motion.div
          className="h-px bg-bronze"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6 sm:py-4">
        <Wordmark size="sm" />

        <p className="type-eyebrow flex items-center gap-2 text-faint">
          {sectionTitle ? (
            <span className="hidden max-w-45 truncate sm:inline">{sectionTitle}</span>
          ) : null}
          {sectionTitle ? <span aria-hidden>·</span> : null}
          <span className="tabular-nums whitespace-nowrap">
            {questionNumber}/{totalQuestions}
          </span>
        </p>
      </div>
    </header>
  );
}
