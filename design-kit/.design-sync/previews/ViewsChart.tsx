import { ViewsChart } from "project-sphere-design-kit";

const data = Array.from({ length: 14 }, (_, i) => {
  const d = new Date("2026-07-06T00:00:00Z");
  d.setDate(d.getDate() + i);
  return { date: d.toISOString().slice(0, 10), count: Math.round(Math.abs(Math.sin(i * 0.6)) * 12) };
});

export function Default() {
  return <ViewsChart data={data} />;
}
