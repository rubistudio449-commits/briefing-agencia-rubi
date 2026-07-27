import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'application/pdf',
];

const uploadsEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * O cliente consulta esta rota ao montar o campo de upload. Sem o token do
 * Blob, o componente exibe apenas o campo de link em vez de quebrar.
 */
export function GET() {
  return NextResponse.json({ enabled: uploadsEnabled() });
}

export async function POST(request: Request) {
  if (!uploadsEnabled()) {
    return NextResponse.json(
      { error: 'Uploads não configurados. Defina BLOB_READ_WRITE_TOKEN.' },
      { status: 501 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_FILE_BYTES,
        // Dois clientes podem enviar "referencia.jpg"; o sufixo evita colisão.
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        // As URLs chegam junto com o briefing; não há nada a persistir aqui.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao autorizar o upload.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
