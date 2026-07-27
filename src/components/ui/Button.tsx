import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'quiet';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full px-7 text-[0.8125rem] font-normal tracking-[0.16em] uppercase transition-all duration-300 ease-[var(--ease-brand)] disabled:cursor-not-allowed disabled:opacity-40';

const variants: Record<Variant, string> = {
  primary:
    'bg-paper text-ink enabled:hover:-translate-y-px enabled:hover:shadow-[0_10px_30px_-12px_rgba(239,239,239,0.45)] enabled:active:translate-y-0',
  ghost: 'border border-line text-muted enabled:hover:border-line-strong enabled:hover:text-paper',
  quiet: 'px-3 text-muted underline-offset-4 enabled:hover:text-paper enabled:hover:underline',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={cn(base, variants[variant], className)} {...props} />;
});
