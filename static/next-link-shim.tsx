import type { AnchorHTMLAttributes, ReactNode } from 'react';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  readonly href: string;
  readonly children?: ReactNode;
};

/**
 * Substitui `next/link` no build estático (GitHub Pages).
 * Rotas internas absolutas recebem o base path do deploy.
 */
export default function Link({ href, children, ...rest }: LinkProps) {
  const resolved = href.startsWith('/') ? `${import.meta.env.BASE_URL}${href.slice(1)}` : href;
  return (
    <a href={resolved} {...rest}>
      {children}
    </a>
  );
}
