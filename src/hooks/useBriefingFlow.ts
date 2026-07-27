'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buildSteps, pendingRequired } from '@/lib/steps';
import { clearDraft, loadDraft, saveDraft, type BriefingDraft } from '@/lib/storage';
import { validateAnswer } from '@/lib/validation';
import { otherFieldId, type AnswerValue, type Answers } from '@/types/briefing';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const AUTOSAVE_DELAY = 400;


export function useBriefingFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [stepId, setStepId] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);

  /** Rascunho aguardando decisão do usuário; `null` quando não há o que retomar. */
  const [draftFound, setDraftFound] = useState<BriefingDraft | null>(null);
  const [draftChecked, setDraftChecked] = useState(false);

  // O localStorage só existe no navegador: ler durante a renderização faria o
  // HTML hidratado divergir do prerender. É uma leitura única, na montagem.
  /* eslint-disable react-hooks/set-state-in-effect -- leitura única do localStorage na montagem; não há fonte síncrona equivalente durante a renderização */
  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft.answers).length > 0) setDraftFound(draft);
    setDraftChecked(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  /**
   * Só persiste depois de verificar se havia rascunho — salvar antes disso
   * sobrescreveria o progresso anterior com um formulário vazio.
   */
  const hydrated = draftChecked && draftFound === null;

  const steps = useMemo(() => buildSteps(answers), [answers]);

  const stepIndex = useMemo(() => {
    if (!stepId) return 0;
    const index = steps.findIndex((step) => step.id === stepId);
    return index === -1 ? 0 : index;
  }, [steps, stepId]);

  const current = steps[stepIndex] ?? steps[0];

  const questionSteps = useMemo(() => steps.filter((step) => step.kind === 'question'), [steps]);

  const questionNumber = useMemo(() => {
    const answered = steps.slice(0, stepIndex).filter((step) => step.kind === 'question').length;
    return current?.kind === 'question' ? answered + 1 : answered;
  }, [steps, stepIndex, current]);

  const progress = questionSteps.length === 0 ? 0 : questionNumber / questionSteps.length;

  const resumeDraft = useCallback(() => {
    if (!draftFound) return;
    setAnswers(draftFound.answers);
    setStepId(draftFound.stepId);
    setStartedAt(draftFound.startedAt);
    setDraftFound(null);
  }, [draftFound]);

  const discardDraft = useCallback(() => {
    clearDraft();
    setDraftFound(null);
  }, []);

  // Salvamento automático, só depois de resolvida a retomada.
  useEffect(() => {
    if (!hydrated || status === 'success') return;
    const timer = window.setTimeout(() => {
      saveDraft({ answers, stepId, startedAt });
    }, AUTOSAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [answers, stepId, startedAt, hydrated, status]);

  const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setError(null);
  }, []);

  const setOtherAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [otherFieldId(questionId)]: value }));
    setError(null);
  }, []);

  /**
   * A navegação lê o estado por referência, e não pelo closure da renderização.
   * O avanço automático das escolhas únicas dispara 380 ms depois do clique: até
   * lá a resposta já entrou e condicionais podem ter revelado novos passos —
   * validar contra o closure antigo acusaria "obrigatória" numa pergunta
   * respondida e pularia as telas recém-abertas.
   */
  const answersRef = useRef(answers);
  const stepsRef = useRef(steps);
  const stepIdRef = useRef(stepId);

  useEffect(() => {
    answersRef.current = answers;
    stepsRef.current = steps;
    stepIdRef.current = stepId;
  }, [answers, steps, stepId]);

  const currentIndex = useCallback(() => {
    const id = stepIdRef.current;
    if (!id) return 0;
    const index = stepsRef.current.findIndex((step) => step.id === id);
    return index === -1 ? 0 : index;
  }, []);

  const goTo = useCallback((index: number, nextDirection: 1 | -1) => {
    const list = stepsRef.current;
    const target = list[Math.min(Math.max(index, 0), list.length - 1)];
    if (!target) return;
    setDirection(nextDirection);
    setStepId(target.id);
    stepIdRef.current = target.id;
    setError(null);
  }, []);

  const goToQuestion = useCallback(
    (questionId: string) => {
      const index = stepsRef.current.findIndex((step) => step.id === `question:${questionId}`);
      if (index >= 0) goTo(index, -1);
    },
    [goTo],
  );

  const next = useCallback(() => {
    const index = currentIndex();
    const step = stepsRef.current[index];

    if (step?.kind === 'question') {
      const message = validateAnswer(step.question, answersRef.current);
      if (message) {
        setError(message);
        return;
      }
    }

    goTo(index + 1, 1);
  }, [currentIndex, goTo]);

  const back = useCallback(() => goTo(currentIndex() - 1, -1), [currentIndex, goTo]);

  const submit = useCallback(async () => {
    // Uma obrigatória pode ter ficado para trás; leva o usuário até ela.
    const pending = pendingRequired(answers, validateAnswer);
    if (pending.length > 0) {
      goToQuestion(pending[0].id);
      setError(validateAnswer(pending[0], answers));
      return;
    }

    setStatus('submitting');
    setSubmitError(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, startedAt }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Não foi possível enviar o briefing.');
      }

      setStatus('success');
      setCompletedAt(Date.now());
      clearDraft();
    } catch (caught) {
      setStatus('error');
      setSubmitError(
        caught instanceof Error
          ? caught.message
          : 'Não foi possível enviar o briefing. Tente novamente.',
      );
    }
  }, [answers, startedAt, goToQuestion]);

  // Esc volta uma tela, de qualquer lugar do fluxo.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      back();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [back]);

  return {
    answers,
    steps,
    current,
    stepIndex,
    direction,
    error,
    progress,
    questionNumber,
    totalQuestions: questionSteps.length,
    status,
    submitError,
    draftFound,
    hydrated,
    startedAt,
    completedAt,
    isFirst: stepIndex === 0,
    setAnswer,
    setOtherAnswer,
    next,
    back,
    goToQuestion,
    submit,
    resumeDraft,
    discardDraft,
    pending: () => pendingRequired(answers, validateAnswer),
  };
}
