import { del, get, list, put } from '@vercel/blob';

import type { BriefingPayload } from '@/lib/payload';

const PREFIX = 'briefings/';

/** Blobs privados: só quem tem o token do Blob consegue ler. */
const ACCESS = 'private' as const;

/**
 * Pasta local de fallback, sempre `.briefings` na raiz do projeto — caminho
 * fixo de propósito: um caminho montado dinamicamente faz o Turbopack rastrear
 * o projeto inteiro para dentro da função serverless.
 *
 * Ativa sozinha em desenvolvimento; fora dele exige `BRIEFINGS_LOCAL=1`. Na
 * Vercel o sistema de arquivos é somente leitura, então lá o Blob é obrigatório.
 */
const LOCAL_FOLDER = '.briefings';

const localEnabled = () =>
  process.env.BRIEFINGS_LOCAL === '1' || process.env.NODE_ENV !== 'production';

export interface StoredSubmission extends BriefingPayload {
  id: string;
}

export interface SubmissionSummary {
  id: string;
  /** Slug do formulário; ausente nos briefings anteriores aos vários formulários. */
  formulario?: string;
  empresa: string;
  nome: string;
  email: string;
  enviadoEm: string;
  respondidas: number;
  totalPerguntas: number;
  arquivos: number;
}

/**
 * Duas formas de autenticar no Blob, e a Vercel usa uma ou outra conforme como
 * o store foi conectado:
 *   - token de leitura/escrita (`BLOB_READ_WRITE_TOKEN`), modelo antigo;
 *   - OIDC (`VERCEL_OIDC_TOKEN` + `BLOB_STORE_ID`), o padrão atual — o SDK
 *     resolve sozinho, então basta o store existir.
 * `put`, `get` e `list` funcionam nos dois. Só o upload direto do navegador
 * (`handleUpload`, em /api/upload) exige o token de leitura/escrita.
 */
const hasBlob = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN) || Boolean(process.env.BLOB_STORE_ID);

/** Sem Blob, grava em arquivos locais — permite exercitar o painel sem a Vercel. */
const writesToDisk = () => !hasBlob() && localEnabled();

export const storageEnabled = () => hasBlob() || writesToDisk();

/** Sinaliza na interface que o arquivamento é temporário. */
export const storageIsLocal = () => writesToDisk();

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

/** O id vem da URL: impedir que `../` escape do prefixo. */
const isSafeId = (id: string) => /^[a-z0-9-]+$/i.test(id);

async function localPaths() {
  const { join } = await import('node:path');
  return { dir: join(process.cwd(), LOCAL_FOLDER), join };
}

/**
 * Guarda o briefing antes de chamar o webhook: se o destino estiver fora do ar,
 * as respostas continuam disponíveis no painel.
 */
export async function saveSubmission(payload: BriefingPayload): Promise<string | null> {
  if (!storageEnabled()) return null;

  const id = buildId(payload);
  const stored: StoredSubmission = { ...payload, id };
  const body = JSON.stringify(stored, null, 2);

  if (writesToDisk()) {
    const fs = await import('node:fs/promises');
    const { dir, join } = await localPaths();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(join(dir, `${id}.json`), body, 'utf8');
    return id;
  }

  await put(`${PREFIX}${id}.json`, body, {
    access: ACCESS,
    contentType: 'application/json',
    addRandomSuffix: false,
  });

  return id;
}

export async function listSubmissions(): Promise<SubmissionSummary[]> {
  if (!storageEnabled()) return [];

  const ids = writesToDisk() ? await listLocalIds() : await listBlobIds();

  const entries = await Promise.all(
    ids.map(async (id): Promise<SubmissionSummary | null> => {
      const submission = await readSubmission(id);
      if (!submission) return null;

      return {
        id,
        formulario: submission.formulario,
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
      };
    }),
  );

  return entries
    .filter((entry): entry is SubmissionSummary => entry !== null)
    .sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm));
}

async function listBlobIds(): Promise<string[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 200 });
  return blobs.map((blob) => blob.pathname.slice(PREFIX.length).replace(/\.json$/, ''));
}

async function listLocalIds(): Promise<string[]> {
  try {
    const fs = await import('node:fs/promises');
    const { dir } = await localPaths();
    const files = await fs.readdir(dir);
    return files.filter((file) => file.endsWith('.json')).map((file) => file.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

/** Exclusão definitiva: não há lixeira, o arquivo é removido do store. */
export async function deleteSubmission(id: string): Promise<boolean> {
  if (!storageEnabled() || !isSafeId(id)) return false;

  try {
    if (writesToDisk()) {
      const fs = await import('node:fs/promises');
      const { dir, join } = await localPaths();
      await fs.unlink(join(dir, `${id}.json`));
      return true;
    }

    await del(`${PREFIX}${id}.json`);
    return true;
  } catch (error) {
    console.error('[briefing] falha ao excluir:', error);
    return false;
  }
}

export async function readSubmission(id: string): Promise<StoredSubmission | null> {
  if (!storageEnabled() || !isSafeId(id)) return null;

  try {
    if (writesToDisk()) {
      const fs = await import('node:fs/promises');
      const { dir, join } = await localPaths();
      const raw = await fs.readFile(join(dir, `${id}.json`), 'utf8');
      return JSON.parse(raw) as StoredSubmission;
    }

    const result = await get(`${PREFIX}${id}.json`, { access: ACCESS, useCache: false });
    if (!result) return null;
    return (await new Response(result.stream).json()) as StoredSubmission;
  } catch {
    return null;
  }
}
