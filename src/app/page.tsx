import { FormLanding } from '@/components/flow/FormLanding';
import { defaultForm } from '@/data/forms';

/** O briefing de identidade visual segue em `/`: o link já foi enviado a clientes. */
export default function HomePage() {
  return <FormLanding form={defaultForm} />;
}
