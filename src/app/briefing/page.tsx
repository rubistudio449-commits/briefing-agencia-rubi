import type { Metadata } from 'next';

import { BriefingFlow } from '@/components/flow/BriefingFlow';
import { seo } from '@/config/brand';

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
};

export default function BriefingPage() {
  return <BriefingFlow />;
}
