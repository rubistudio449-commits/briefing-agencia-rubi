import { readFileSync } from 'node:fs';
import { ImageResponse } from 'next/og';

import { brand, brandColors, brandCopy } from '@/config/brand';

export const alt = `Briefing de Identidade Visual — ${brand.legalName}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Os arquivos ficam ao lado desta rota e são lidos por URL relativa ao módulo.
 * Ler de `/public` com `fs` e `process.cwd()` faz o Next rastrear o projeto
 * inteiro para dentro da função, inchando o bundle.
 */
const asset = (file: string) => readFileSync(new URL(file, import.meta.url));

export default function OpengraphImage() {
  const font = asset('./og-display-font.ttf');
  const wordmarkSrc = `data:image/png;base64,${asset('./og-wordmark.png').toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: brandColors.ink,
          padding: '80px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmarkSrc} alt="" width={340} height={83} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Bodoni Moda',
              fontSize: 82,
              color: brandColors.paper,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {brandCopy.welcomeTitle}
          </span>
          <span style={{ marginTop: 28, fontSize: 26, color: brandColors.muted, maxWidth: 900 }}>
            Uma identidade visual começa pela compreensão da essência da marca.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            borderTop: `1px solid ${brandColors.line}`,
            paddingTop: 28,
            fontSize: 20,
            color: brandColors.accentSoft,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {brand.tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Bodoni Moda', data: font, style: 'normal', weight: 400 }],
    },
  );
}
