import React from "react";

interface HeatmapProps {
  data: Record<string, number>; // date -> count
  weeks?: number;
}

const COLORS = [
  "bg-white/5",           // 0
  "bg-brand-900/60",      // 1
  "bg-brand-700/70",      // 2-3
  "bg-brand-600/80",      // 4-5
  "bg-brand-500",         // 6+
];

function getColor(count: number): string {
  if (count === 0) return COLORS[0];
  if (count === 1) return COLORS[1];
  if (count <= 3) return COLORS[2];
  if (count <= 5) return COLORS[3];
  return COLORS[4];
}

function getLast52Weeks() {
  const weeks: string[][] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  for (let w = 51; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() - w * 7 + d);
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }
  return weeks;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Heatmap({ data, weeks = 52 }: HeatmapProps) {
  const allWeeks = getLast52Weeks().slice(-weeks);

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  allWeeks.forEach((week, wi) => {
    const month = new Date(week[0]).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], col: wi });
      lastMonth = month;
    }
  });

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="inline-flex flex-col gap-1 min-w-max">
        {/* Month labels */}
        <div className="flex gap-[3px] pl-7">
          {allWeeks.map((_, wi) => {
            const ml = monthLabels.find((m) => m.col === wi);
            return (
              <div key={wi} className="w-3 text-2xs text-slate-600">
                {ml ? ml.label : ""}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {DAYS.map((d, i) => (
              <div key={i} className="h-3 w-3 text-2xs text-slate-600 flex items-center justify-center">
                {i % 2 === 1 ? d : ""}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {allWeeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((date) => {
                const count = data[date] || 0;
                return (
                  <div
                    key={date}
                    className={`heatmap-cell w-3 h-3 rounded-sm ${getColor(count)}`}
                    title={`${date}: ${count} problem${count !== 1 ? "s" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 pt-1 justify-end">
          <span className="text-2xs text-slate-600">Less</span>
          {COLORS.map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span className="text-2xs text-slate-600">More</span>
        </div>
      </div>
    </div>
  );
}
