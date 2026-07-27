import { NextResponse } from 'next/server';

import { buildPayload } from '@/lib/payload';
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

  if (!url) {
    return NextResponse.json(
      { error: 'Webhook não configurado. Defina WEBHOOK_URL no ambiente.' },
      { status: 500 },
    );
  }

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

  let lastError = 'Falha ao entregar o briefing.';

  // Uma retentativa cobre instabilidade momentânea do destino.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await postToWebhook(url, payload);
      if (response.ok) {
        return NextResponse.json({ ok: true, respondidas: payload.meta.respondidas });
      }
      lastError = `O destino respondeu com status ${response.status}.`;
    } catch (error) {
      lastError =
        error instanceof Error && error.name === 'AbortError'
          ? 'O destino demorou demais para responder.'
          : 'Não foi possível alcançar o destino do briefing.';
    }
  }

  console.error('[briefing] envio ao webhook falhou:', lastError);
  return NextResponse.json({ error: lastError }, { status: 502 });
}
