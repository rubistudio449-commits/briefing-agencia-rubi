'use client';

import { cn } from '@/lib/cn';
import { OtherInput } from './OtherInput';
import type { FieldProps } from './types';

export function CheckboxGrid({
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
  const selected = Array.isArray(value) ? value : [];
  const isOther = Boolean(question.otherOption) && selected.includes(question.otherOption!);

  const toggle = (option: string) => {
    onChange(
      selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option],
    );
  };

  return (
    <div>
      <fieldset aria-describedby={describedBy} aria-invalid={invalid || undefined}>
        <legend className="sr-only">{question.label}</legend>
        <div className="flex flex-wrap gap-2.5">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <label
                key={option}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm transition-all duration-250 ease-[var(--ease-brand)]',
                  active
                    ? 'border-paper bg-paper text-ink'
                    : 'border-line text-muted hover:border-line-strong hover:text-paper',
                )}
              >
                <input
                  type="checkbox"
                  name={question.id}
                  value={option}
                  checked={active}
                  onChange={() => toggle(option)}
                  className="sr-only"
                />
                {option}
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
