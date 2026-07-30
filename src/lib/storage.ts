import type { Answers } from '@/types/briefing';


const STORAGE_VERSION = 1;

export interface BriefingDraft {
  version: number;
  answers: Answers;
  /** Id do passo (`section:3` ou `question:marca_nome`) para retomar no lugar certo. */
  stepId: string | null;
  startedAt: number;
  updatedAt: number;
}

const isBrowser = () => typeof window !== 'undefined';

export function loadDraft(storageKey: string): BriefingDraft | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<BriefingDraft>;
    if (parsed.version !== STORAGE_VERSION || typeof parsed.answers !== 'object' || !parsed.answers) {
      return null;
    }

    return {
      version: STORAGE_VERSION,
      answers: parsed.answers as Answers,
      stepId: typeof parsed.stepId === 'string' ? parsed.stepId : null,
      startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : Date.now(),
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };
  } catch {
    // Rascunho corrompido não pode impedir o preenchimento.
    return null;
  }
}

export function saveDraft(storageKey: string, draft: Omit<BriefingDraft, 'version' | 'updatedAt'>): void {
  if (!isBrowser()) return;

  try {
    const payload: BriefingDraft = {
      ...draft,
      version: STORAGE_VERSION,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // Cota estourada ou modo privado: seguir sem persistência é melhor que quebrar.
  }
}

export function clearDraft(storageKey: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    /* ignora */
  }
}

/** Quantas respostas o rascunho já contém — usado no diálogo de retomada. */
export function countAnswered(answers: Answers): number {
  return Object.values(answers).filter((value) => {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && 'files' in value) {
      return value.files.length > 0 || value.link.trim() !== '';
    }
    return false;
  }).length;
}
