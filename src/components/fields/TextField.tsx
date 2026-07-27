'use client';

import type { InputHTMLAttributes } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { cn } from '@/lib/cn';
import type { FieldProps } from './types';

type InputType = InputHTMLAttributes<HTMLInputElement>['type'];

const inputTypeByField: Record<string, InputType> = {
  email: 'email',
  phone: 'tel',
  url: 'url',
  number: 'text',
  shortText: 'text',
};

const inputModeByField: Record<string, InputHTMLAttributes<HTMLInputElement>['inputMode']> = {
  email: 'email',
  phone: 'tel',
  url: 'url',
  number: 'numeric',
  shortText: 'text',
};

const autoCompleteById: Record<string, string> = {
  contato_nome: 'name',
  contato_email: 'email',
  contato_whatsapp: 'tel-national',
  contato_cidade_estado: 'address-level2',
};

/** Formata progressivamente como (00) 00000-0000 enquanto o usuário digita. */
export function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function TextField({ question, value, onChange, onAdvance, invalid, describedBy }: FieldProps) {
  const ref = useAutoFocus<HTMLInputElement>();
  const text = typeof value === 'string' ? value : '';

  return (
    <input
      ref={ref}
      id={question.id}
      name={question.id}
      type={inputTypeByField[question.type] ?? 'text'}
      inputMode={inputModeByField[question.type]}
      autoComplete={autoCompleteById[question.id] ?? 'off'}
      placeholder={question.placeholder ?? 'Digite sua resposta'}
      value={text}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      aria-required={question.required || undefined}
      onChange={(event) => {
        const next = event.target.value;
        onChange(question.type === 'phone' ? maskPhone(next) : next);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onAdvance();
        }
      }}
      className={cn(
        'w-full border-0 border-b bg-transparent pb-3 text-xl outline-none transition-colors duration-300 sm:text-2xl',
        'placeholder:text-faint focus:outline-none',
        invalid ? 'border-danger' : 'border-line focus:border-paper',
      )}
    />
  );
}
