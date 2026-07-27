import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';

import { brand, brandColors, brandCopy } from '@/config/brand';

export const alt = `Briefing de Identidade Visual — ${brand.legalName}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * `ImageResponse` não resolve caminhos de `/public`; o arquivo é lido do disco
 * e embutido como data URI durante a geração.
 */
const dataUri = (relativePath: string) => {
  const file = fs.readFileSync(path.join(process.cwd(), 'public', relativePath));
  return `data:image/png;base64,${file.toString('base64')}`;
};

/** O `ImageResponse` não enxerga as fontes do `next/font`; ela vai embutida. */
const displayFont = () =>
  fs.readFileSync(path.join(process.cwd(), 'src', 'assets', 'BodoniModa-Regular.ttf'));

export default function OpengraphImage() {
  const wordmark = dataUri('brand/wordmark.png');

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
        <img src={wordmark} alt="" width={340} height={83} />

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
      fonts: [{ name: 'Bodoni Moda', data: displayFont(), style: 'normal', weight: 400 }],
    },
  );
}
