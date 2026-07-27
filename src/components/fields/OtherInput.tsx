'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { otherFieldId } from '@/types/briefing';

interface OtherInputProps {
  questionId: string;
  label: string;
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  onAdvance: () => void;
}

/** Campo de texto revelado quando a opção "Outro"/"Outra" é marcada. */
export function OtherInput({
  questionId,
  label,
  visible,
  value,
  onChange,
  onAdvance,
}: OtherInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) ref.current?.focus({ preventScroll: true });
  }, [visible]);

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-5">
            <label htmlFor={otherFieldId(questionId)} className="type-eyebrow text-faint">
              {label}, qual?
            </label>
            <input
              ref={ref}
              id={otherFieldId(questionId)}
              type="text"
              value={value}
              placeholder="Descreva em poucas palavras"
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onAdvance();
                }
              }}
              className="mt-2 w-full border-0 border-b border-line bg-transparent pb-2 text-lg outline-none transition-colors duration-300 placeholder:text-faint focus:border-paper"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
