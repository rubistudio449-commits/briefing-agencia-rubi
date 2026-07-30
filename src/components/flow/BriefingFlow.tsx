'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';

import { ProgressBar } from '@/components/flow/ProgressBar';
import { QuestionScreen } from '@/components/flow/QuestionScreen';
import { ResumeDialog } from '@/components/flow/ResumeDialog';
import { ReviewScreen } from '@/components/flow/ReviewScreen';
import { SectionIntro } from '@/components/flow/SectionIntro';
import { SuccessScreen } from '@/components/flow/SuccessScreen';
import { useBriefingFlow } from '@/hooks/useBriefingFlow';
import { countAnswered } from '@/lib/storage';
import { resolveForm } from '@/data/forms';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Recebe o slug, não o formulário: as perguntas carregam funções de condicional
 * (`showIf`), e funções não podem ser serializadas de um Server Component para
 * um Client Component. O registro é resolvido aqui, já no cliente.
 */
export function BriefingFlow({ slug }: { slug: string }) {
  const form = resolveForm(slug);
  const flow = useBriefingFlow(form);
  const reduced = useReducedMotion();

  const {
    answers,
    current,
    direction,
    error,
    progress,
    questionNumber,
    totalQuestions,
    status,
    submitError,
    draftFound,
    startedAt,
    completedAt,
    isFirst,
    setAnswer,
    setOtherAnswer,
    next,
    back,
    goToQuestion,
    submit,
    resumeDraft,
    discardDraft,
  } = flow;

  // Só a tela de revisão precisa da lista de pendências.
  const pendingRequired = current?.kind === 'review' ? flow.pending() : [];

  // Enter avança nas telas sem campo de texto (abertura de seção e revisão).
  useEffect(() => {
    if (!current || current.kind === 'question') return;
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(target.tagName)) return;
      event.preventDefault();
      if (current.kind === 'section') next();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [current, next]);

  if (status === 'success') {
    return (
      <SuccessScreen
        form={form}
        durationSeconds={completedAt ? Math.round((completedAt - startedAt) / 1000) : null}
      />
    );
  }

  const enter = reduced ? { opacity: 0 } : { opacity: 0, y: direction === 1 ? 28 : -28 };
  const exit = reduced ? { opacity: 0 } : { opacity: 0, y: direction === 1 ? -28 : 28 };

  const sectionTitle = current?.kind === 'question' ? current.section.title : null;

  return (
    // `svh` em vez de `dvh`: com `dvh` a altura muda quando o teclado virtual
    // abre e quando a barra de endereço do celular se retrai, e o conteúdo
    // centralizado pula durante a digitação.
    <div className="flex min-h-svh flex-col">
      {draftFound ? (
        <ResumeDialog draft={draftFound} onResume={resumeDraft} onDiscard={discardDraft} />
      ) : null}

      <ProgressBar
        progress={progress}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        sectionTitle={sectionTitle}
      />

      {/* Centralizar é seguro porque a altura vem de `min-h-svh`: o container
          cresce quando a pergunta é longa e a rolagem acontece no body, sem
          cortar o topo. */}
      <main className="flex flex-1 items-center px-5 py-10 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current?.id ?? 'empty'}
              initial={enter}
              animate={{ opacity: 1, y: 0 }}
              exit={exit}
              transition={{ duration: reduced ? 0.15 : 0.42, ease: EASE }}
            >
              {current?.kind === 'section' ? (
                <SectionIntro section={current.section} onContinue={next} />
              ) : null}

              {current?.kind === 'question' ? (
                <QuestionScreen
                  question={current.question}
                  section={current.section}
                  answers={answers}
                  error={error}
                  onChange={(value) => setAnswer(current.question.id, value)}
                  onOtherChange={(value) => setOtherAnswer(current.question.id, value)}
                  onAdvance={next}
                />
              ) : null}

              {current?.kind === 'review' ? (
                <ReviewScreen
                  form={form}
                  answered={countAnswered(answers)}
                  total={totalQuestions}
                  pending={pendingRequired}
                  status={status}
                  submitError={submitError}
                  onSubmit={submit}
                  onGoToQuestion={goToQuestion}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-8">
        <div className="mx-auto flex max-w-2xl justify-start">
          <button
            type="button"
            onClick={back}
            disabled={isFirst}
            className="-ml-2 flex min-h-11 items-center gap-2 px-2 text-sm text-faint transition-colors hover:text-muted disabled:pointer-events-none disabled:opacity-0"
          >
            <span aria-hidden>←</span> Voltar
          </button>
        </div>
      </footer>
    </div>
  );
}
