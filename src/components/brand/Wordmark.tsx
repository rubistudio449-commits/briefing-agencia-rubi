import Image from 'next/image';

import { brand } from '@/config/brand';
import { cn } from '@/lib/cn';

type WordmarkSize = 'sm' | 'md' | 'lg';

interface WordmarkProps {
  className?: string;
  size?: WordmarkSize;
}

/**
 * A largura é definida por CSS, não por atributo: um valor fixo de 320px
 * estouraria a margem de um celular de 360px.
 */
const widths: Record<WordmarkSize, string> = {
  sm: 'w-24 sm:w-26',
  md: 'w-40 sm:w-48',
  lg: 'w-56 sm:w-72 lg:w-80',
};

const INTRINSIC = { width: 1400, height: 341 };

/** Lockup horizontal oficial, em off-white — a versão para fundo escuro. */
export function Wordmark({ className, size = 'md' }: WordmarkProps) {
  return (
    <Image
      src="/brand/wordmark.png"
      alt={brand.legalName}
      width={INTRINSIC.width}
      height={INTRINSIC.height}
      priority={size === 'lg'}
      sizes="(max-width: 640px) 224px, 320px"
      className={cn('h-auto max-w-full select-none', widths[size], className)}
    />
  );
}

/** Símbolo isolado da marca, usado como elemento gráfico. */
export function BrandSymbol({
  className,
  size = 40,
  tone = 'paper',
}: {
  className?: string;
  size?: number;
  tone?: 'paper' | 'bronze';
}) {
  return (
    <Image
      src={tone === 'bronze' ? '/brand/symbol-bronze.png' : '/brand/symbol.png'}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={cn('max-w-full select-none', className)}
    />
  );
}
