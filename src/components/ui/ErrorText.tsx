'use client';

import { AnimatePresence, motion } from 'motion/react';

interface ErrorTextProps {
  id: string;
  message: string | null;
}

export function ErrorText({ id, message }: ErrorTextProps) {
  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.p
          key={message}
          id={id}
          role="alert"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 flex items-center gap-2 text-sm text-danger"
        >
          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-danger" />
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
