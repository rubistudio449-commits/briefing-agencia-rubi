import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BriefingFlow } from '@/components/flow/BriefingFlow';
import { defaultForm, forms, getForm } from '@/data/forms';

export function generateStaticParams() {
  return forms.filter((form) => form !== defaultForm).map((form) => ({ form: form.slug }));
}

export const dynamicParams = false;

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function FormFlowPage({ params }: { params: Promise<{ form: string }> }) {
  const form = getForm((await params).form);
  if (!form) notFound();
  return <BriefingFlow slug={form.slug} />;
}
