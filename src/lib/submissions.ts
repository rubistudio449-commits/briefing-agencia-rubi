import { get, list, put } from '@vercel/blob';

import type { BriefingPayload } from '@/lib/payload';

const PREFIX = 'briefings/';

/** Blobs privados: só quem tem o token do Blob consegue ler. */
const ACCESS = 'private' as const;

export interface StoredSubmission extends BriefingPayload {
  id: string;
}

export interface SubmissionSummary {
  id: string;
  empresa: string;
  nome: string;
  email: string;
  enviadoEm: string;
  respondidas: number;
  totalPerguntas: number;
  arquivos: number;
}

export const storageEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'sem-nome';

/** Id legível e ordenável: data + marca + sufixo aleatório. */
function buildId(payload: BriefingPayload): string {
  const date = payload.enviadoEm.slice(0, 10);
  const random = Math.random().toString(36).slice(2, 8);
  return `${date}-${slugify(payload.empresa || payload.nome)}-${random}`;
}

/**
 * Guarda o briefing antes de chamar o webhook: se o destino estiver fora do ar,
 * as respostas continuam disponíveis no painel.
 */
export async function saveSubmission(payload: BriefingPayload): Promise<string | null> {
  if (!storageEnabled()) return null;

  const id = buildId(payload);
  const stored: StoredSubmission = { ...payload, id };

  await put(`${PREFIX}${id}.json`, JSON.stringify(stored, null, 2), {
    access: ACCESS,
    contentType: 'application/json',
    addRandomSuffix: false,
  });

  return id;
}

export async function listSubmissions(): Promise<SubmissionSummary[]> {
  if (!storageEnabled()) return [];

  const { blobs } = await list({ prefix: PREFIX, limit: 200 });

  const entries = await Promise.all(
    blobs.map(async (blob) => {
      const id = blob.pathname.slice(PREFIX.length).replace(/\.json$/, '');
      const submission = await readSubmission(id);
      if (!submission) return null;

      return {
        id,
        empresa: submission.empresa,
        nome: submission.nome,
        email: submission.email,
        enviadoEm: submission.enviadoEm,
        respondidas: submission.meta.respondidas,
        totalPerguntas: submission.meta.totalPerguntas,
        arquivos: Object.values(submission.arquivos).reduce(
          (total, entry) => total + entry.urls.length,
          0,
        ),
      } satisfies SubmissionSummary;
    }),
  );

  return entries
    .filter((entry): entry is SubmissionSummary => entry !== null)
    .sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm));
}

export async function readSubmission(id: string): Promise<StoredSubmission | null> {
  if (!storageEnabled()) return null;
  // O id vem da URL: impedir que `../` escape do prefixo.
  if (!/^[a-z0-9-]+$/i.test(id)) return null;

  try {
    const result = await get(`${PREFIX}${id}.json`, { access: ACCESS, useCache: false });
    if (!result) return null;
    return (await new Response(result.stream).json()) as StoredSubmission;
  } catch {
    return null;
  }
}
