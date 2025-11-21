
import React, { useState } from 'react';

// A simple card for long text content, non-flippable
export const StatCard: React.FC<{ title: string; value: string; isLongText?: boolean }> = ({ title, value, isLongText = false }) => {
  return (
    <div className="bg-brand-forest/50 p-4 rounded-xl border border-brand-moss/50 flex flex-col justify-between animate-fade-in-up h-full">
      <div>
        <h3 className="text-sm font-medium text-brand-stone">{title}</h3>
        <p className={`text-brand-light-green mt-2 ${isLongText ? 'text-base' : 'text-3xl font-bold'}`}>{value}</p>
      </div>
    </div>
  );
};

// Icons as React components
const ICONS: { [key: string]: React.ReactNode } = {
  calendar: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  heart: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  wind: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-8 4h4m12 0h-4m-4 8v-4m0-12v4" /></svg>,
  footsteps: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h1.5a1.5 1.5 0 001.5-1.5V13a1.5 1.5 0 00-1.5-1.5H9m6 8v-5a2 2 0 00-2-2h-1a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2z" /></svg>,
  moon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  utensils: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-6h6m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  fire: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
};


// New flippable card for icon-based stats
export const IconStatCard: React.FC<{ title: string; value: string; unit: string; icon: keyof typeof ICONS }> = ({ title, value, unit, icon }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="[perspective:1000px] w-full h-36 sm:h-40 group"
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyPress={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
    >
      <div
        className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-brand-forest p-4 rounded-xl border border-brand-moss/50 flex flex-col items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow">
          <div className="text-brand-accent">{ICONS[icon]}</div>
          <h3 className="mt-2 text-sm font-medium text-brand-stone">{title}</h3>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-brand-forest p-4 rounded-xl border border-brand-moss/50 flex flex-col items-center justify-center cursor-pointer shadow-md">
          <p className="text-xl sm:text-3xl font-bold text-brand-light-green truncate w-full">{value}</p>
          <p className="text-sm text-brand-stone">{unit}</p>
        </div>
      </div>
    </div>
  );
};


// Loading placeholder card
export const LoadingCard: React.FC<{ height?: string }> = ({ height = 'h-24' }) => {
    return (
        <div className={`bg-brand-forest/50 p-4 rounded-xl border border-brand-moss/50 flex flex-col justify-between ${height} animate-pulse-slow`}>
            <div className="h-4 bg-brand-moss/50 rounded w-3/4"></div>
            <div className="h-8 bg-brand-moss/50 rounded w-1/2 mt-2"></div>
        </div>
    );
};
