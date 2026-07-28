import { NextResponse } from 'next/server';

import { buildPayload } from '@/lib/payload';
import { saveSubmission } from '@/lib/submissions';
import { submissionSchema } from '@/lib/validation';
import type { Answers } from '@/types/briefing';

export const runtime = 'nodejs';

const TIMEOUT_MS = 10_000;

/**
 * A URL fica no servidor de propósito. Um `NEXT_PUBLIC_` seria embutido no
 * bundle, expondo o webhook a qualquer visitante — continua sendo aceito para
 * quem já configurou assim, mas `WEBHOOK_URL` tem prioridade.
 */
const webhookUrl = () => process.env.WEBHOOK_URL ?? process.env.NEXT_PUBLIC_WEBHOOK_URL;

async function postToWebhook(url: string, payload: unknown): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  const url = webhookUrl();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Respostas em formato inesperado.' }, { status: 400 });
  }

  // O payload é montado aqui a partir da transcrição oficial do briefing:
  // o cliente envia apenas as respostas cruas.
  const payload = buildPayload(parsed.data.answers as Answers, parsed.data.startedAt);

  // O painel interno é o destino principal: arquivar primeiro.
  let arquivado: string | null = null;
  try {
    arquivado = await saveSubmission(payload);
  } catch (error) {
    console.error('[briefing] falha ao arquivar o briefing:', error);
  }

  // O webhook é uma integração opcional. Quando não há URL configurada, o
  // briefing simplesmente fica no painel.
  let encaminhado = false;
  let erroWebhook: string | null = null;

  if (url) {
    // Uma retentativa cobre instabilidade momentânea do destino.
    for (let attempt = 0; attempt < 2 && !encaminhado; attempt += 1) {
      try {
        const response = await postToWebhook(url, payload);
        if (response.ok) {
          encaminhado = true;
        } else {
          erroWebhook = `O destino respondeu com status ${response.status}.`;
        }
      } catch (error) {
        erroWebhook =
          error instanceof Error && error.name === 'AbortError'
            ? 'O destino demorou demais para responder.'
            : 'Não foi possível alcançar o destino do briefing.';
      }
    }

    if (!encaminhado) console.error('[briefing] envio ao webhook falhou:', erroWebhook);
  }

  // Só falha para o cliente se o briefing não ficou guardado em lugar nenhum —
  // perder 100 respostas por causa de uma integração fora do ar seria pior.
  if (!arquivado && !encaminhado) {
    return NextResponse.json(
      {
        error:
          erroWebhook ??
          'O briefing não pôde ser salvo. Conecte um Blob Store ou configure WEBHOOK_URL.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    respondidas: payload.meta.respondidas,
    arquivado: Boolean(arquivado),
    encaminhado,
  });
}
