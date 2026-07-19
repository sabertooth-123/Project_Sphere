// Stand-in for next/link outside a Next.js runtime — aliased in at bundle
// time, real app code still uses the genuine next/link.
import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Link({ href, ...props }: Props) {
  return <a href={href} {...props} />;
}
