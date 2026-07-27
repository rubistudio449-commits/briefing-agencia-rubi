'use client';

import { useEffect } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { cn } from '@/lib/cn';
import { Kbd } from '@/components/ui/KbdHint';
import type { FieldProps } from './types';

const MAX_HEIGHT = 320;

export function LongTextField({
  question,
  value,
  onChange,
  onAdvance,
  invalid,
  describedBy,
}: FieldProps) {
  const ref = useAutoFocus<HTMLTextAreaElement>();
  const text = typeof value === 'string' ? value : '';

  // Cresce com o conteúdo até um teto, depois rola internamente.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT)}px`;
  }, [text, ref]);

  return (
    <div>
      <textarea
        ref={ref}
        id={question.id}
        name={question.id}
        rows={2}
        placeholder={question.placeholder ?? 'Escreva com o máximo de detalhes que puder'}
        value={text}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-required={question.required || undefined}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          // Enter quebra linha aqui; Ctrl/Cmd+Enter avança.
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            onAdvance();
          }
        }}
        className={cn(
          'scrollbar-slim w-full resize-none border-0 border-b bg-transparent pb-3 text-lg leading-relaxed outline-none transition-colors duration-300 sm:text-xl',
          'placeholder:text-faint focus:outline-none',
          invalid ? 'border-danger' : 'border-line focus:border-paper',
        )}
      />
      <p className="mt-3 flex items-center justify-between gap-4 text-xs text-faint">
        <span className="hidden items-center gap-1.5 [@media(hover:hover)_and_(pointer:fine)]:inline-flex">
          <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> para avançar
        </span>
        <span className={cn('ml-auto tabular-nums', text.length === 0 && 'opacity-0')} aria-hidden>
          {text.length} caracteres
        </span>
      </p>
    </div>
  );
}
