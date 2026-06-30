import React from 'react';
import ProgressRing from '../ui/ProgressRing';

interface ScoreWidgetProps {
  score: number;
}

export default function ScoreWidget({ score }: ScoreWidgetProps) {
  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <ProgressRing progress={score} size={56} strokeWidth={5} showPercent />
      <div>
        <p className="text-2xs text-slate-500 font-medium tracking-wider">TODAY'S SCORE</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
          {score < 40 ? "Getting started" : score < 70 ? "Good progress" : "On fire! 🔥"}
        </p>
      </div>
    </div>
  );
}
