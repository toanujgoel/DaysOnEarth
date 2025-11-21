import React from 'react';
import type { ChartDataPoint } from '../types';

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  title: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = 200;
  const barWidth = 40;
  const barMargin = 20;
  const chartWidth = data.length * (barWidth + barMargin);

  return (
    <div className="bg-brand-forest/50 p-4 sm:p-6 rounded-xl border border-brand-moss/50">
      <h3 className="text-lg sm:text-xl font-bold text-brand-accent mb-4">{title}</h3>
      <div className="overflow-x-auto pb-4">
        <svg width={chartWidth} height={chartHeight + 40} className="font-sans min-w-full">
          <g>
            {data.map((d, i) => {
              const barHeight = Math.max((d.value / maxValue) * chartHeight, 1);
              const x = i * (barWidth + barMargin);
              const y = chartHeight - barHeight;
              return (
                <g key={i} className="group">
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="url(#barGradient)"
                    className="transition-all duration-300 group-hover:opacity-80"
                    rx="3"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="text-xs fill-current text-brand-stone"
                  >
                    {d.label}
                  </text>
                   <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-xs font-bold fill-current text-brand-light-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {d.value.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </g>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84C69B" />
              <stop offset="100%" stopColor="#587E76" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
