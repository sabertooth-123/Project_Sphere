// Stand-in for next/image outside a Next.js runtime (claude.ai/design's
// renderer has no image optimizer) — aliased in at bundle time, real app
// code still uses the genuine next/image.
import type { ImgHTMLAttributes, CSSProperties } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  src: string;
};

export default function Image({ fill, priority, style, ...props }: Props) {
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : undefined;

  return <img {...props} style={{ ...fillStyle, ...style }} />;
}
