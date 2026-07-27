'use client';

import { useEffect, useRef } from 'react';

/**
 * Foca o campo ao entrar na pergunta — mas só em dispositivos com ponteiro
 * fino. No celular, abrir o teclado virtual automaticamente esconde metade da
 * tela e atrapalha a leitura do enunciado.
 */
export function useAutoFocus<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    // Espera a transição de entrada começar para não competir com o scroll.
    const timer = window.setTimeout(() => {
      ref.current?.focus({ preventScroll: true });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [enabled]);

  return ref;
}
