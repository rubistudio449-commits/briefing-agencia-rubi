import type { Metadata } from 'next';

import { BriefingFlow } from '@/components/flow/BriefingFlow';
import { defaultForm } from '@/data/forms';

export const metadata: Metadata = {
  title: `${defaultForm.name} | RUBI Agência`,
  robots: { index: false, follow: false },
};

export default function BriefingPage() {
  return <BriefingFlow slug={defaultForm.slug} />;
}
