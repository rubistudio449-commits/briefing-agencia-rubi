import { identidadeVisual } from '@/data/forms/identidade-visual';
import { onboardingMarketing } from '@/data/forms/onboarding-marketing';
import type { BriefingForm } from '@/types/briefing';

/** Todos os formulários servidos pela aplicação. Adicionar um aqui basta. */
export const forms: readonly BriefingForm[] = [identidadeVisual, onboardingMarketing];

/** O formulário histórico, servido em `/` e `/briefing`. */
export const defaultForm = identidadeVisual;

const bySlug = new Map(forms.map((form) => [form.slug, form]));

export const getForm = (slug: string): BriefingForm | undefined => bySlug.get(slug);

/**
 * Briefings arquivados antes da existência de vários formulários não têm slug;
 * são todos do briefing de identidade visual.
 */
export const resolveForm = (slug: string | undefined): BriefingForm =>
  (slug ? bySlug.get(slug) : undefined) ?? defaultForm;

export const sectionLabel = (form: BriefingForm, sectionId: number) => {
  const section = form.sections.find((item) => item.id === sectionId);
  return section ? `${section.label} | ${section.title.toUpperCase()}` : String(sectionId);
};

export const requiredCount = (form: BriefingForm) =>
  form.questions.filter((question) => question.required).length;

// Os caminhos precisam derivar do slug: a rota dinâmica é `/[form]`, e uma
// divergência aqui geraria um link que leva a 404 sem erro de compilação.
for (const form of forms) {
  if (form === defaultForm) continue;
  if (form.landingPath !== `/${form.slug}` || form.flowPath !== `/${form.slug}/responder`) {
    throw new Error(
      `Formulário "${form.slug}": landingPath e flowPath devem ser /${form.slug} e /${form.slug}/responder.`,
    );
  }
}
