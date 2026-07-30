import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormLanding } from '@/components/flow/FormLanding';
import { forms, getForm } from '@/data/forms';
import { defaultForm } from '@/data/forms';

/** Só os formulários registrados viram rota; o resto é 404. */
export function generateStaticParams() {
  return forms.filter((form) => form !== defaultForm).map((form) => ({ form: form.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ form: string }>;
}): Promise<Metadata> {
  const form = getForm((await params).form);
  return {
    title: form ? `${form.name} | RUBI Agência` : 'RUBI Agência',
    description: form?.copy.welcomeLead,
    robots: { index: false, follow: false },
  };
}

export default async function FormLandingPage({ params }: { params: Promise<{ form: string }> }) {
  const form = getForm((await params).form);
  if (!form) notFound();
  return <FormLanding form={form} />;
}
