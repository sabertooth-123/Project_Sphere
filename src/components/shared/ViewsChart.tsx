"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import type { DailyViewCount } from "@/services/analytics";

const WIDTH = 640;
const HEIGHT = 160;
const BAR_GAP = 6;

export function ViewsChart({ data }: { data: DailyViewCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const barWidth = (WIDTH - BAR_GAP * (data.length - 1)) / data.length;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT + 22}`}
      className="w-full"
      role="img"
      aria-label="Views over the last 14 days"
    >
      <line x1={0} y1={HEIGHT} x2={WIDTH} y2={HEIGHT} stroke="var(--border)" strokeWidth={1} />
      {data.map((d, i) => {
        const barHeight = (d.count / max) * (HEIGHT - 4);
        const x = i * (barWidth + BAR_GAP);
        const showLabel = i === 0 || i === data.length - 1 || i % 3 === 0;
        const label = new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        return (
          <g key={d.date}>
            <motion.rect
              x={x}
              width={barWidth}
              rx={3}
              fill="var(--accent2)"
              initial={{ height: 0, y: HEIGHT }}
              whileInView={{ height: barHeight, y: HEIGHT - barHeight }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.025 }}
            >
              <title>{`${label}: ${d.count} view${d.count === 1 ? "" : "s"}`}</title>
            </motion.rect>
            {showLabel && (
              <text
                x={x + barWidth / 2}
                y={HEIGHT + 16}
                textAnchor="middle"
                fontSize={9}
                fill="var(--muted-foreground)"
                fontFamily="var(--font-mono)"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
