import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Jost } from 'next/font/google';

import { brand, brandColors, seo, siteUrl } from '@/config/brand';
import './globals.css';

/** Didone de alto contraste — a serifada mais próxima do wordmark da marca. */
const bodoni = Bodoni_Moda({
  variable: '--font-bodoni',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  weight: ['400', '500'],
});

/** Geométrica fina, para a assinatura em caixa alta e toda a interface. */
const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: seo.title,
  description: seo.description,
  applicationName: `Briefing ${brand.legalName}`,
  authors: [{ name: brand.legalName }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: brand.legalName,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  // Formulário de cliente: fora das buscas, mas o link precisa gerar uma
  // prévia decente quando enviado por WhatsApp.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: brandColors.ink,
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${jost.variable} antialiased`}>
      <body className="bg-ink text-paper">{children}</body>
    </html>
  );
}
