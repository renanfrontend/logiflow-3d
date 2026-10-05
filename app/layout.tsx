import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'LogiFlow 3D | Renan Augusto',
  description:
    'Um centro logístico interativo em 3D. Explore setores, simule gargalos e compare decisões operacionais. Projeto de Renan Augusto.',
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#0b131c',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
