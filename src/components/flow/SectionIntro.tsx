'use client';

import { Button } from '@/components/ui/Button';
import { Kbd, KbdHint } from '@/components/ui/KbdHint';
import type { Section } from '@/types/briefing';

interface SectionIntroProps {
  section: Section;
  onContinue: () => void;
}

export function SectionIntro({ section, onContinue }: SectionIntroProps) {
  return (
    <div className="text-center">
      <p className="font-display text-5xl text-accent sm:text-6xl">{section.label}</p>

      <h2 className="type-display mt-6 text-paper">{section.title}</h2>

      <p className="mx-auto mt-5 max-w-md text-base text-muted sm:text-lg">{section.intro}</p>

      <div className="mt-12 flex flex-col items-center gap-4">
        <Button onClick={onContinue} autoFocus>
          Continuar
        </Button>
        <KbdHint>
          pressione <Kbd>Enter</Kbd>
        </KbdHint>
      </div>
    </div>
  );
}
