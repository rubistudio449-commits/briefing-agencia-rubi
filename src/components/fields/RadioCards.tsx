'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/cn';
import { OtherInput } from './OtherInput';
import type { FieldProps } from './types';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function RadioCards({
  question,
  value,
  onChange,
  otherValue,
  onOtherChange,
  onAdvance,
  invalid,
  describedBy,
}: FieldProps) {
  const options = question.options ?? [];
  const selected = typeof value === 'string' ? value : '';
  const isOther = Boolean(question.otherOption) && selected === question.otherOption;

  // Cancela o avanço pendente se o usuário sair da pergunta antes dos 380 ms.
  const advanceTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  const select = (option: string) => {
    onChange(option);
    // Escolha única avança sozinha, exceto quando ainda falta descrever "Outro".
    if (option !== question.otherOption) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(onAdvance, 380);
    }
  };

  // Atalhos A, B, C… enquanto o foco não estiver em um campo de texto.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const index = LETTERS.indexOf(event.key.toUpperCase());
      if (index >= 0 && index < options.length) {
        event.preventDefault();
        select(options[index]);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, question.id]);

  return (
    <div>
      <fieldset aria-describedby={describedBy} aria-invalid={invalid || undefined}>
        <legend className="sr-only">{question.label}</legend>
        <div className="grid gap-2.5">
          {options.map((option, index) => {
            const active = selected === option;
            return (
              <label
                key={option}
                className={cn(
                  'group flex min-h-13 cursor-pointer items-center gap-4 rounded-lg border px-4 py-3.5 transition-all duration-250 ease-[var(--ease-brand)]',
                  active
                    ? 'border-paper bg-paper/[0.06]'
                    : 'border-line hover:border-line-strong hover:bg-paper/[0.02]',
                  invalid && !active && 'border-danger/40',
                )}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={active}
                  onChange={() => select(option)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[0.625rem] tracking-widest transition-colors duration-250',
                    active
                      ? 'border-paper bg-paper text-ink'
                      : 'border-line-strong text-faint group-hover:text-muted',
                  )}
                >
                  {LETTERS[index] ?? ''}
                </span>
                <span className={cn('text-base transition-colors', active ? 'text-paper' : 'text-muted')}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {question.otherOption ? (
        <OtherInput
          questionId={question.id}
          label={question.otherOption}
          visible={isOther}
          value={otherValue}
          onChange={onOtherChange}
          onAdvance={onAdvance}
        />
      ) : null}
    </div>
  );
}
