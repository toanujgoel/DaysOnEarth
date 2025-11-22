
import React, { useState, useRef, useMemo } from 'react';
import type { ChartDataPoint } from '../types';

interface ChartProps {
  data: ChartDataPoint[];
  title: string;
}

// --- Donut Chart Component ---
export const DonutChart: React.FC<ChartProps> = ({ data, title }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
    
    // Determine which slice is active (hover takes precedence for display, select for persistence)
    const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
    
    let cumulativeAngle = 0;
    const radius = 70;
    const cx = 100;
    const cy = 100;
    const baseStrokeWidth = 20;

    // Helper to calculate percentage
    const getPercentage = (value: number) => Math.round((value / total) * 100);

    return (
        <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 flex flex-col items-center h-full min-h-[350px] relative">
            <h3 className="text-lg font-bold text-brand-accent mb-4 self-start">{title}</h3>
            
            <div className="relative w-full max-w-[240px] aspect-square">
                <svg width="100%" height="100%" viewBox="0 0 200 200" className="overflow-visible">
                    {data.map((slice, i) => {
                        const sliceAngle = (slice.value / total) * 360;
                        // Calculate dash array for the partial circle
                        const dashLength = (sliceAngle / 360) * (2 * Math.PI * radius);
                        const gapLength = 2 * Math.PI * radius - dashLength;
                        const dashArray = `${dashLength} ${gapLength}`;
                        
                        // Rotate to position
                        // -90 starts at top.
                        const rotateTransform = `rotate(${cumulativeAngle - 90} 100 100)`;
                        cumulativeAngle += sliceAngle;

                        const isActive = activeIndex === i;
                        const isFaded = activeIndex !== null && !isActive;

                        return (
                            <g key={i}>
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={radius}
                                    fill="none"
                                    stroke={slice.color || '#ccc'}
                                    strokeWidth={isActive ? baseStrokeWidth + 6 : baseStrokeWidth}
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={0}
                                    transform={rotateTransform}
                                    className={`transition-all duration-300 ease-out cursor-pointer ${isFaded ? 'opacity-40' : 'opacity-100'}`}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex(i === selectedIndex ? null : i);
                                    }}
                                />
                            </g>
                        );
                    })}
                    
                    {/* Center Text - Acts as the tooltip info */}
                    <text x="100" y="90" textAnchor="middle" className="text-xs fill-brand-stone pointer-events-none">
                        {activeIndex !== null ? data[activeIndex].label : "Total"}
                    </text>
                    <text x="100" y="115" textAnchor="middle" className="text-2xl font-bold fill-brand-light-green pointer-events-none">
                         {activeIndex !== null ? `${getPercentage(data[activeIndex].value)}%` : "100%"}
                    </text>
                    {activeIndex !== null && (
                        <text x="100" y="135" textAnchor="middle" className="text-xs fill-brand-stone pointer-events-none">
                            {data[activeIndex].value.toLocaleString()} hrs
                        </text>
                    )}
                </svg>
            </div>

            {/* Legend */}
            <div className="mt-6 w-full space-y-2 flex-grow overflow-y-auto max-h-40 custom-scrollbar">
                {data.map((item, i) => (
                    <div 
                        key={i} 
                        className={`flex items-center justify-between text-sm p-2 rounded transition-colors cursor-pointer ${activeIndex === i ? 'bg-brand-moss/20' : 'hover:bg-brand-moss/10'}`}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => setSelectedIndex(i === selectedIndex ? null : i)}
                    >
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className={`${activeIndex === i ? 'text-brand-light-green font-medium' : 'text-brand-stone'}`}>{item.label}</span>
                        </div>
                        <span className="font-bold text-brand-light-green">{getPercentage(item.value)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Area Chart Component ---
export const AreaChart: React.FC<ChartProps> = ({ data, title }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    if (data.length === 0) return null;

    const height = 200;
    const width = 500; 
    const padding = 20;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    const maxValue = useMemo(() => Math.max(...data.map(d => d.value)) * 1.1, [data]); // Add 10% headroom for tooltip space

    const points = useMemo(() => data.map((d, i) => {
        const x = (i / (data.length - 1)) * graphWidth + padding;
        const y = height - padding - (d.value / maxValue) * graphHeight;
        return { x, y, ...d };
    }), [data, maxValue, graphWidth, graphHeight]);

    const areaPath = `M${padding},${height - padding} L${points.map(p => `${p.x},${p.y}`).join(' L')} L${width - padding},${height - padding} Z`;
    const linePath = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        // Scale x from client coordinates to viewBox coordinates
        const viewBoxX = x * (width / rect.width);
        
        // Find closest point index
        let index = Math.round(((viewBoxX - padding) / graphWidth) * (data.length - 1));
        index = Math.max(0, Math.min(data.length - 1, index));
        
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

    return (
        <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 h-full min-h-[350px] flex flex-col">
            <h3 className="text-lg font-bold text-brand-accent mb-4">{title}</h3>
            <div className="w-full flex-grow relative min-h-[200px]">
                 <svg 
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`} 
                    className="w-full h-full absolute inset-0 cursor-crosshair" 
                    preserveAspectRatio="none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#84C69B" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#84C69B" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                           <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3"/>
                        </filter>
                    </defs>
                    
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((ratio, i) => (
                         <line 
                            key={i}
                            x1={padding} 
                            y1={height - padding - (ratio * graphHeight)} 
                            x2={width - padding} 
                            y2={height - padding - (ratio * graphHeight)} 
                            stroke="#2D4F4A" 
                            strokeWidth="1"
                            strokeDasharray="4"
                        />
                    ))}

                    <path d={areaPath} fill="url(#areaGradient)" className="transition-all duration-300"/>
                    <path d={linePath} fill="none" stroke="#84C69B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Interaction Elements */}
                    {activePoint && (
                        <g>
                            {/* Vertical Line */}
                            <line 
                                x1={activePoint.x} 
                                y1={padding} 
                                x2={activePoint.x} 
                                y2={height - padding} 
                                stroke="#DCE5E3" 
                                strokeWidth="1" 
                                strokeDasharray="4"
                            />
                            {/* Highlight Circle */}
                            <circle 
                                cx={activePoint.x} 
                                cy={activePoint.y} 
                                r="5" 
                                fill="#84C69B" 
                                stroke="#1A2E2C" 
                                strokeWidth="2" 
                            />
                             {/* Tooltip Box */}
                            <g transform={`translate(${
                                // Adjust tooltip position to stay within bounds
                                activePoint.x < width / 2 ? activePoint.x + 10 : activePoint.x - 130
                            }, ${
                                activePoint.y < height / 2 ? activePoint.y : activePoint.y - 60
                            })`}>
                                <rect 
                                    x="0" 
                                    y="0" 
                                    width="120" 
                                    height="55" 
                                    rx="4" 
                                    fill="#1A2E2C" 
                                    fillOpacity="0.95" 
                                    stroke="#587E76" 
                                    strokeWidth="1"
                                    filter="url(#shadow)"
                                />
                                <text x="10" y="20" className="text-xs fill-brand-stone font-medium">
                                    {activePoint.label}
                                </text>
                                <text x="10" y="40" className="text-sm fill-brand-light-green font-bold">
                                    {activePoint.value.toLocaleString()} tonnes
                                </text>
                            </g>
                        </g>
                    )}

                    {/* X Axis Labels */}
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
