'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { OtherInput } from './OtherInput';
import type { FieldProps } from './types';

/** Ignora acentos e caixa na busca: "autentica" encontra "Autêntica". */
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export function MultiSelectField({
  question,
  value,
  onChange,
  otherValue,
  onOtherChange,
  onAdvance,
  invalid,
  describedBy,
}: FieldProps) {
  const options = useMemo(() => question.options ?? [], [question.options]);
  const selected = useMemo(() => (Array.isArray(value) ? value : []), [value]);
  const limit = question.maxSelections;
  const limitReached = limit !== undefined && selected.length >= limit;
  const isOther = Boolean(question.otherOption) && selected.includes(question.otherOption!);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const needle = normalize(query);
    return options.filter((option) => normalize(option).includes(needle));
  }, [options, query]);

  // Fecha ao clicar fora, mas mantém as escolhas já feitas.
  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Mantém a opção ativa visível durante a navegação por teclado.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  // No celular a lista abre abaixo do campo, muitas vezes atrás do teclado
  // virtual: rolar o conjunto para cima deixa as opções visíveis.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      return;
    }
    if (limitReached) return;
    onChange([...selected, option]);
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setOpen(true);
        setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (open && filtered[activeIndex]) {
          toggle(filtered[activeIndex]);
        } else {
          onAdvance();
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        break;
      case 'Backspace':
        if (query === '' && selected.length > 0) {
          onChange(selected.slice(0, -1));
        }
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div ref={containerRef} className="relative">
        {/* Chips das opções já escolhidas. */}
        {selected.length > 0 ? (
          <ul className="mb-3 flex flex-wrap gap-2">
            {selected.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => toggle(option)}
                  className="group flex min-h-11 items-center gap-2 rounded-full bg-paper px-4 text-sm text-ink transition-opacity hover:opacity-80"
                >
                  {option}
                  <span aria-hidden className="text-base leading-none text-ink/50">
                    ×
                  </span>
                  <span className="sr-only">Remover</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className={cn(
            'flex min-h-13 items-center gap-3 border-b px-1 transition-colors duration-300',
            invalid ? 'border-danger' : open ? 'border-paper' : 'border-line',
          )}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 text-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>

          <input
            ref={inputRef}
            id={question.id}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            aria-activedescendant={open && filtered[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
            placeholder={selected.length ? 'Buscar mais opções' : 'Clique ou digite para buscar'}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              // A lista filtrada muda: a opção ativa volta para o topo.
              setActiveIndex(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent py-3 text-lg outline-none placeholder:text-faint"
          />

          <button
            type="button"
            aria-label={open ? 'Fechar lista de opções' : 'Abrir lista de opções'}
            onClick={() => {
              setOpen((state) => !state);
              inputRef.current?.focus();
            }}
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-faint transition-colors hover:text-paper"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-line bg-ink-raised shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
            >
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-multiselectable
                aria-label={question.label}
                className="scrollbar-slim max-h-56 overflow-y-auto overscroll-contain py-1.5 sm:max-h-64"
              >
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-faint">Nenhuma opção encontrada.</li>
                ) : (
                  filtered.map((option, index) => {
                    const active = selected.includes(option);
                    const blocked = !active && limitReached;
                    return (
                      <li key={option}>
                        <button
                          type="button"
                          id={`${listboxId}-${index}`}
                          role="option"
                          aria-selected={active}
                          aria-disabled={blocked || undefined}
                          data-active={index === activeIndex}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => toggle(option)}
                          className={cn(
                            'flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left text-[0.9375rem] transition-colors',
                            index === activeIndex && !blocked && 'bg-paper/[0.06]',
                            blocked ? 'cursor-not-allowed text-faint' : 'text-muted',
                            active && 'text-paper',
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors',
                              active ? 'border-paper bg-paper' : 'border-line-strong',
                            )}
                          >
                            {active ? (
                              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-ink" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m2 6 2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : null}
                          </span>
                          {option}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-xs text-faint" aria-live="polite">
        {limit
          ? `${selected.length} de ${limit} selecionada${limit > 1 ? 's' : ''}${
              limitReached ? ' — limite atingido' : ''
            }`
          : `${selected.length} selecionada${selected.length === 1 ? '' : 's'}`}
      </p>

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
