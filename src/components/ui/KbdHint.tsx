import { cn } from '@/lib/cn';

interface KbdHintProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdHintProps) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-line-strong px-1.5 font-sans text-[0.625rem] tracking-normal text-muted',
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** Dica de teclado exibida ao lado do botão. Oculta em telas de toque. */
export function KbdHint({ children, className }: KbdHintProps) {
  return (
    <span
      className={cn(
        'hidden items-center gap-1.5 text-xs text-faint [@media(hover:hover)_and_(pointer:fine)]:inline-flex',
        className,
      )}
    >
      {children}
    </span>
  );
}
