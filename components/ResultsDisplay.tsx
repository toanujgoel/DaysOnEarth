
import React from 'react';
import type { StatResults, GroundingChunk, ChartDataPoint } from '../types';
import { StatCard, LoadingCard, IconStatCard } from './StatCard';
import { DonutChart, AreaChart, LifeProgressBar } from './Charts';

interface ResultsDisplayProps {
  results: StatResults;
  lifeDistributionData: ChartDataPoint[] | null;
  carbonTrendData: ChartDataPoint[] | null;
  isLoading: boolean;
  onFindNearbySites: () => void;
}

const Sources: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => {
    if (!sources || sources.length === 0) return null;
    const webSources = sources.filter(s => s.web);

    return (
        <div className="mt-4">
            <h4 className="text-sm font-semibold text-brand-stone">Sources:</h4>
            <ul className="flex flex-wrap gap-2 mt-2">
                {webSources.map((source, index) => (
                    <li key={index}>
                        <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-brand-moss/50 hover:bg-brand-moss text-brand-light-green py-1 px-2 rounded-full transition-colors">
                            {source.web!.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const FunFactCard: React.FC<{ fact: { label: string; value: string; icon: string } }> = ({ fact }) => {
    const icons: Record<string, React.ReactNode> = {
        walk: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>,
        clock: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        water: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
        growth: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
        moon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
        star: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    };

    return (
        <div className="bg-brand-forest/30 p-4 rounded-lg border border-brand-moss/30 flex items-start gap-3">
            <div className="text-brand-accent mt-1">
                {icons[fact.icon] || icons['star']}
            </div>
            <div>
                <h5 className="font-bold text-brand-light-green text-sm">{fact.label}</h5>
                <p className="text-brand-stone text-sm mt-1">{fact.value}</p>
            </div>
        </div>
    )
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, lifeDistributionData, carbonTrendData, isLoading, onFindNearbySites }) => {
  const ageInYears = results.daysLived / 365.25;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Key Metrics Section - Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <IconStatCard title="Days Lived" value={results.daysLived.toLocaleString()} unit="Days" icon="calendar" />
        <IconStatCard title="Heartbeats" value={`~${(results.heartbeats / 1_000_000_000).toFixed(2)}B`} unit="Beats" icon="heart" />
        <IconStatCard title="Energy Used" value={`~${(results.caloriesBurned / 1_000_000).toFixed(1)}M`} unit="Calories" icon="fire" />
        <IconStatCard title="Distance Walked" value={`~${results.distanceWalked.toLocaleString()}`} unit="Kilometers" icon="footsteps" />
        <IconStatCard title="Hours Slept" value={`~${results.hoursSlept.toLocaleString()}`} unit="Hours" icon="moon" />
        <IconStatCard title="Meals Consumed" value={`~${results.mealsConsumed.toLocaleString()}`} unit="Meals" icon="utensils" />
      </div>
      
      {/* Cosmic Context - New Graphic Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-2xl font-bold text-brand-light-green mb-4 mt-8 border-b border-brand-moss/30 pb-2">Cosmic Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor" className="text-brand-accent">
                        <circle cx="50" cy="50" r="40" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-brand-accent mb-2">Galactic Traveler</h3>
                <p className="text-brand-stone mb-4">Distance traveled around the Milky Way center (at ~220km/s):</p>
                <p className="text-3xl md:text-4xl font-bold text-brand-light-green">{(results.galacticDistance / 1_000_000_000).toFixed(2)} Billion km</p>
                <p className="text-xs text-brand-stone mt-2">That's roughly {(results.galacticDistance / 149600000).toFixed(0)} AU!</p>
            </div>
            <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor" className="text-brand-stone">
                         <path d="M50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-brand-accent mb-2">Lunar Witness</h3>
                <p className="text-brand-stone mb-4">While you were busy living, the Moon orbited Earth:</p>
                <p className="text-3xl md:text-4xl font-bold text-brand-light-green">{results.moonOrbits.toFixed(1)} Times</p>
                 <p className="text-xs text-brand-stone mt-2">A silent companion for {results.daysLived} days.</p>
            </div>
        </div>
      </div>

      {/* Analytics Dashboard Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-bold text-brand-light-green mb-4 mt-8 border-b border-brand-moss/30 pb-2">Analytics Dashboard</h2>
          
          {/* Life Progress Bar */}
          <div className="mb-6">
            <LifeProgressBar age={ageInYears} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-auto w-full">
                {lifeDistributionData ? (
                    <DonutChart data={lifeDistributionData} title="The Time of Your Life" />
                ) : <LoadingCard height="h-96" />}
              </div>
              <div className="h-auto w-full">
                {carbonTrendData ? (
                    <AreaChart data={carbonTrendData} title="Your Carbon Legacy" />
                ) : <LoadingCard height="h-96" />}
              </div>
          </div>
      </div>
      
      {/* AI Fun Facts Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
         <h2 className="text-2xl font-bold text-brand-light-green mb-4 mt-8 border-b border-brand-moss/30 pb-2">Curious Insights</h2>
         {results.funFacts && results.funFacts.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {results.funFacts.map((fact, idx) => (
                     <FunFactCard key={idx} fact={fact} />
                 ))}
             </div>
         ) : (
             !isLoading && <p className="text-brand-stone italic">Generating fun facts...</p>
         )}
      </div>


      {/* Environmental Impact Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
         <h2 className="text-2xl font-bold text-brand-light-green mb-4 mt-8 border-b border-brand-moss/30 pb-2">Impact & Environment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.environmentalImpact ? (
                <>
                    <StatCard title="Carbon Footprint Assessment" value={results.environmentalImpact.carbonFootprint} isLongText={true}/>
                    <StatCard title="Water Consumption Insight" value={results.environmentalImpact.waterConsumption} isLongText={true}/>
                </>
            ) : (
                <>
                    <LoadingCard />
                    <LoadingCard />
                </>
            )}
        </div>
      </div>

       <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
         {results.cosmicPerspective ? (
            <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 mt-6">
                <h3 className="text-xl font-bold text-brand-accent mb-2">Your Cosmic Perspective</h3>
                <p className="text-brand-stone leading-relaxed">{results.cosmicPerspective.text}</p>
            </div>
         ) : <LoadingCard height="h-32" />}
       </div>

       <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
         {results.earthChanges ? (
             <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 mt-6">
                 <h3 className="text-xl font-bold text-brand-accent mb-2">The World Since You Were Born</h3>
                 <p className="text-brand-stone leading-relaxed whitespace-pre-wrap">{results.earthChanges.summary}</p>
                 <Sources sources={results.earthChanges.sources} />
             </div>
         ) : <LoadingCard height="h-48" />}
       </div>
       
       <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="bg-brand-forest/50 p-6 rounded-xl border border-brand-moss/50 mt-6">
              <h3 className="text-xl font-bold text-brand-accent mb-2">Explore Your Local Environment</h3>
              <p className="text-brand-stone mb-4">Discover significant environmental sites and conservation projects near you.</p>
              <button onClick={onFindNearbySites} disabled={isLoading} className="bg-brand-stone hover:bg-brand-light-green disabled:bg-brand-moss text-brand-dark-green font-bold py-2 px-4 rounded-lg transition duration-300">
                {isLoading ? "Searching..." : "Find Nearby Sites"}
              </button>
              {results.nearbySites.length > 0 && (
                  <div className="mt-4 space-y-3">
                      {results.nearbySites.map((site, index) => (
                          <div key={index} className="border-t border-brand-moss/50 pt-3">
                              <a href={site.uri} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-accent hover:underline">{site.title}</a>
                              <p className="text-sm text-brand-stone mt-1">{site.description}</p>
                          </div>
                      ))}
                  </div>
              )}
          </div>
       </div>
    </div>
  );
};
