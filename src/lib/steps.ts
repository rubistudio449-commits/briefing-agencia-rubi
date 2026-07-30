import type { Answers, BriefingForm, Question, Step } from '@/types/briefing';

export const isVisible = (question: Question, answers: Answers) =>
  !question.showIf || question.showIf(answers);

/**
 * Monta a sequência de telas a partir das respostas atuais. Seções cujas
 * perguntas foram todas ocultadas por condicional não geram tela de abertura.
 */
export function buildSteps(form: BriefingForm, answers: Answers): Step[] {
  const steps: Step[] = [];

  for (const section of form.sections) {
    const visible = form.questions.filter(
      (question) => question.section === section.id && isVisible(question, answers),
    );

    if (visible.length === 0) continue;

    steps.push({ kind: 'section', id: `section:${section.id}`, section });
    for (const question of visible) {
      steps.push({ kind: 'question', id: `question:${question.id}`, question, section });
    }
  }

  steps.push({ kind: 'review', id: 'review' });
  return steps;
}

export const visibleQuestions = (form: BriefingForm, answers: Answers) =>
  form.questions.filter((question) => isVisible(question, answers));

/** Obrigatórias visíveis ainda sem resposta válida — usado antes do envio. */
export function pendingRequired(
  form: BriefingForm,
  answers: Answers,
  validate: (question: Question, answers: Answers) => string | null,
): Question[] {
  return visibleQuestions(form, answers).filter(
    (question) => question.required && validate(question, answers) !== null,
  );
}
