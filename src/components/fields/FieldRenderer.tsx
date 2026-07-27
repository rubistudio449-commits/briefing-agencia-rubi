'use client';

import dynamic from 'next/dynamic';

import { CheckboxGrid } from './CheckboxGrid';
import { LongTextField } from './LongTextField';
import { MultiSelectField } from './MultiSelectField';
import { RadioCards } from './RadioCards';
import { TextField } from './TextField';
import type { FieldProps } from './types';

/**
 * O upload carrega o SDK do Vercel Blob; só 3 das 108 perguntas o utilizam,
 * então ele fica fora do bundle inicial.
 */
const FileField = dynamic(() => import('./FileField').then((mod) => mod.FileField), {
  loading: () => <div className="h-40 animate-pulse rounded-xl border border-line" />,
});

export function FieldRenderer(props: FieldProps) {
  switch (props.question.type) {
    case 'longText':
      return <LongTextField {...props} />;
    case 'radioCards':
      return <RadioCards {...props} />;
    case 'checkboxGrid':
      return <CheckboxGrid {...props} />;
    case 'multiSelect':
      return <MultiSelectField {...props} />;
    case 'file':
      return <FileField {...props} />;
    default:
      return <TextField {...props} />;
  }
}
