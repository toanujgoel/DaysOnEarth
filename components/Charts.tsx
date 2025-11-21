
import React from 'react';
import type { ChartDataPoint } from '../types';

interface ChartProps {
  data: ChartDataPoint[];
  title: string;
}

// --- Donut Chart Component ---
export const DonutChart: React.FC<ChartProps> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativeAngle = 0;
    const radius = 70;
    const cx = 100;
    const cy = 100;
    const strokeWidth = 20;

    return (
        <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 flex flex-col items-center h-full min-h-[350px]">
            <h3 className="text-lg font-bold text-brand-accent mb-4 self-start">{title}</h3>
            <div className="relative w-full max-w-[200px] aspect-square">
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                    {data.map((slice, i) => {
                        const sliceAngle = (slice.value / total) * 360;
                        const dashArray = `${(sliceAngle / 360) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`;
                        const rotateTransform = `rotate(${cumulativeAngle - 90} 100 100)`;
                        cumulativeAngle += sliceAngle;

                        return (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill="none"
                                stroke={slice.color || '#ccc'}
                                strokeWidth={strokeWidth}
                                strokeDasharray={dashArray}
                                transform={rotateTransform}
                                className="transition-all duration-1000 ease-out hover:opacity-80"
                            />
                        );
                    })}
                    <text x="100" y="100" textAnchor="middle" dy=".3em" className="text-xl font-bold fill-brand-light-green">
                        100%
                    </text>
                </svg>
            </div>
            <div className="mt-6 w-full space-y-2 flex-grow overflow-y-auto">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="text-brand-stone">{item.label}</span>
                        </div>
                        <span className="font-bold text-brand-light-green">{Math.round((item.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Area Chart Component ---
export const AreaChart: React.FC<ChartProps> = ({ data, title }) => {
    if (data.length === 0) return null;

    const height = 200;
    const width = 500; // SVG viewbox width
    const padding = 20;

    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - (d.value / maxValue) * (height - 2 * padding);
        return `${x},${y}`;
    });

    // Close the path for the area fill
    const areaPath = `M${padding},${height - padding} L${points.join(' L')} L${width - padding},${height - padding} Z`;
    const linePath = `M${points.join(' L')}`;

    return (
        <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 h-full min-h-[350px] flex flex-col">
            <h3 className="text-lg font-bold text-brand-accent mb-4">{title}</h3>
            <div className="w-full flex-grow relative min-h-[200px]">
                 <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#84C69B" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#84C69B" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    
                    {/* Grid lines (horizontal) */}
                    {[0.25, 0.5, 0.75].map((ratio, i) => (
                         <line 
                            key={i}
                            x1={padding} 
                            y1={height - padding - (ratio * (height - 2 * padding))} 
                            x2={width - padding} 
                            y2={height - padding - (ratio * (height - 2 * padding))} 
                            stroke="#2D4F4A" 
                            strokeWidth="1"
                            strokeDasharray="4"
                        />
                    ))}

                    <path d={areaPath} fill="url(#areaGradient)" />
                    <path d={linePath} fill="none" stroke="#84C69B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* X Axis Labels (Simplified) */}
                    <text x={padding} y={height - 5} className="text-xs fill-brand-stone" textAnchor="start">{data[0].label}</text>
                    <text x={width - padding} y={height - 5} className="text-xs fill-brand-stone" textAnchor="end">{data[data.length - 1].label}</text>
                </svg>
            </div>
            <div className="mt-4 text-center">
                <p className="text-brand-light-green text-sm">
                    Cumulative Estimate: <span className="font-bold text-brand-accent">{data[data.length-1].value.toLocaleString()} tonnes CO2e</span>
                </p>
            </div>
        </div>
    );
};

// --- Life Progress Bar ---
export const LifeProgressBar: React.FC<{ age: number }> = ({ age }) => {
    const averageLifeExpectancy = 80; // Simplified global average reference
    const percentage = Math.min((age / averageLifeExpectancy) * 100, 100);
    
    return (
        <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50">
            <div className="flex justify-between items-end mb-2">
                 <h3 className="text-lg font-bold text-brand-accent">Life Progression</h3>
                 <span className="text-sm text-brand-stone">Target: ~80 Years</span>
            </div>
           
            <div className="w-full bg-brand-dark-green rounded-full h-6 border border-brand-moss overflow-hidden relative">
                <div 
                    className="bg-gradient-to-r from-brand-moss to-brand-accent h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${percentage}%` }}
                ></div>
                 {/* Milestones */}
                 <div className="absolute top-0 left-[22.5%] h-full w-0.5 bg-brand-dark-green/50" title="Adulthood (18)"></div>
                 <div className="absolute top-0 left-[37.5%] h-full w-0.5 bg-brand-dark-green/50" title="Middle Age (30)"></div>
                 <div className="absolute top-0 left-[81.25%] h-full w-0.5 bg-brand-dark-green/50" title="Retirement (65)"></div>
            </div>
            <div className="flex justify-between text-xs text-brand-stone mt-2">
                <span>Birth</span>
                <span className="transform -translate-x-1/2" style={{ paddingLeft: '22.5%' }}>18y</span>
                <span className="transform -translate-x-1/2" style={{ paddingLeft: '15%' }}>30y</span>
                <span className="transform -translate-x-1/2" style={{ paddingLeft: '43%' }}>65y</span>
                <span>80y</span>
            </div>
            <p className="text-center mt-4 text-brand-light-green">
                You are <span className="font-bold text-brand-accent">{percentage.toFixed(1)}%</span> through an average 80-year journey.
            </p>
        </div>
    );
};
