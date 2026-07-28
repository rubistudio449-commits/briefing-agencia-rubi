'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/lib/adminAuth';
import { deleteSubmission } from '@/lib/submissions';

/**
 * A sessão é conferida aqui também, e não só no layout: uma Server Action é um
 * endpoint próprio e pode ser chamada sem passar pela página.
 */
export async function excluirBriefing(formData: FormData) {
  if (!(await isAuthenticated())) redirect('/admin/login');

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await deleteSubmission(id);

  revalidatePath('/admin');
  redirect('/admin');
}
