
import React, { useState, useCallback } from 'react';
import { UserInputForm } from './components/UserInputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Chatbot } from './components/Chatbot';
import { getEarthChanges, getEnvironmentalImpact, getCosmicPerspective, getNearbyEnvironmentalSites, getFunStats } from './services/geminiService';
import type { UserData, StatResults, ChartDataPoint } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<StatResults | null>(null);
  
  // Specific chart data states
  const [lifeDistributionData, setLifeDistributionData] = useState<ChartDataPoint[] | null>(null);
  const [carbonTrendData, setCarbonTrendData] = useState<ChartDataPoint[] | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSimpleMetrics = (data: UserData): Omit<StatResults, 'earthChanges' | 'environmentalImpact' | 'cosmicPerspective' | 'nearbySites' | 'funFacts'> => {
    const birthdate = new Date(data.birthdate);
    const now = new Date();
    const ageInMs = now.getTime() - birthdate.getTime();
    const daysLived = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    const ageInYears = daysLived / 365.25;
    
    // Multipliers based on activity
    let activityMultiplier = 1.2; // Sedentary
    if (data.activityLevel === 'moderate') activityMultiplier = 1.55;
    if (data.activityLevel === 'active') activityMultiplier = 1.9;

    // BMR Calculation (Mifflin-St Jeor)
    let bmr = (10 * data.weight) + (6.25 * data.height) - (5 * ageInYears);
    if (data.gender === 'male') bmr += 5;
    else bmr -= 161;
    
    const dailyCalories = bmr * activityMultiplier;

    // Heartbeat averages (bpm)
    let avgHeartRate = 75;
    if (data.activityLevel === 'active') avgHeartRate = 60; // Athletes have lower resting HR
    if (data.activityLevel === 'sedentary') avgHeartRate = 80;

    // Walking distance estimate (km/day)
    let dailyDistance = 3;
    if (data.activityLevel === 'moderate') dailyDistance = 6;
    if (data.activityLevel === 'active') dailyDistance = 10;
    
    // Cosmic Stats
    const galacticSpeedKmPerSec = 220; // Approx speed of solar system around galactic center
    const secondsLived = daysLived * 24 * 60 * 60;
    const galacticDistance = secondsLived * galacticSpeedKmPerSec;
    
    const moonOrbitalPeriodDays = 27.32;
    const moonOrbits = daysLived / moonOrbitalPeriodDays;

    return {
      daysLived: daysLived,
      breathsTaken: Math.floor(daysLived * 23040), // Avg 16 breaths/min
      hoursSlept: Math.floor(daysLived * 7.5), // Avg 7.5 hours
      mealsConsumed: daysLived * 3,
      heartbeats: Math.floor(daysLived * 24 * 60 * avgHeartRate),
      distanceWalked: Math.floor(daysLived * dailyDistance),
      caloriesBurned: Math.floor(daysLived * dailyCalories),
      treesForOxygen: parseFloat((ageInYears * 0.4).toFixed(2)),
      galacticDistance: galacticDistance,
      moonOrbits: moonOrbits
    };
  };

  const generateChartData = (daysLived: number, diet: string) => {
      // 1. Life Distribution (Donut)
      const hoursLived = daysLived * 24;
      // Estimations
      const sleepHours = Math.floor(hoursLived * 0.33);
      const workSchoolHours = Math.floor(hoursLived * 0.25); // Rough avg over lifetime
      const screenTimeHours = Math.floor(hoursLived * 0.20);
      const eatingHours = Math.floor(hoursLived * 0.08);
      const otherHours = hoursLived - (sleepHours + workSchoolHours + screenTimeHours + eatingHours);

      setLifeDistributionData([
        { label: 'Sleeping', value: sleepHours, color: '#587E76' }, // Moss
        { label: 'Work/School', value: workSchoolHours, color: '#2D4F4A' }, // Forest
        { label: 'Digital/Screens', value: screenTimeHours, color: '#84C69B' }, // Accent
        { label: 'Eating', value: eatingHours, color: '#A9B4B2' }, // Stone
        { label: 'Other', value: otherHours, color: '#DCE5E3' }, // Light Green
      ]);

      // 2. Carbon Trend (Area)
      // Baseline ~4.5 tons/year. 
      let annualCarbon = 4.5;
      if (diet === 'vegan') annualCarbon *= 0.5;
      else if (diet === 'vegetarian') annualCarbon *= 0.7;
      else if (diet === 'omnivore') annualCarbon *= 1.2; // Meat heavy assumption for contrast

      const age = Math.floor(daysLived / 365.25);
      const trendData: ChartDataPoint[] = [];
      let cumulativeCarbon = 0;
      
      // Generate 5 points roughly distributed
      const steps = 5;
      const stepSize = Math.max(1, Math.floor(age / steps));
      
      for (let i = 0; i <= age; i += stepSize) {
          // Add a slight curve for increasing consumption in adulthood
          const lifeStageMultiplier = i < 18 ? 0.6 : 1.0;
          cumulativeCarbon += (annualCarbon * stepSize * lifeStageMultiplier);
          trendData.push({
              label: `Age ${i}`,
              value: Math.round(cumulativeCarbon)
          });
      }
      // Ensure final point matches current age
      if (trendData[trendData.length-1].label !== `Age ${age}`) {
          trendData.push({ label: `Age ${age}`, value: Math.round(daysLived / 365.25 * annualCarbon) });
      }

      setCarbonTrendData(trendData);
  };

  const handleCalculate = useCallback(async (data: UserData) => {
    setIsLoading(true);
    setError(null);
    setUserData(data);
    setResults(null);
    
    // Clear charts
    setLifeDistributionData(null);
    setCarbonTrendData(null);

    try {
      const birthDateObj = new Date(data.birthdate);
      const simpleMetrics = calculateSimpleMetrics(data);
      
      generateChartData(simpleMetrics.daysLived, data.diet);
      
      const initialResults: StatResults = {
        ...simpleMetrics,
        earthChanges: null,
        environmentalImpact: null,
        cosmicPerspective: null,
        funFacts: null,
        nearbySites: [],
      };
      setResults(initialResults);

      const ageInYears = simpleMetrics.daysLived / 365.25;

      const [earthChanges, environmentalImpact, cosmicPerspective, funFacts] = await Promise.all([
        getEarthChanges(birthDateObj.getFullYear()),
        getEnvironmentalImpact(data.country, ageInYears, data.diet),
        getCosmicPerspective(birthDateObj),
        getFunStats(ageInYears, data.country)
      ]);

      setResults(prev => prev ? { ...prev, earthChanges, environmentalImpact, cosmicPerspective, funFacts } : null);

    } catch (e) {
      console.error("Calculation failed:", e);
      setError("An error occurred while generating your life statistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleFindNearbySites = useCallback(async () => {
      if (!("geolocation" in navigator)) {
        setError("Geolocation is not supported by your browser.");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      navigator.geolocation.getCurrentPosition(async (position) => {
          try {
              const { latitude, longitude } = position.coords;
              const sites = await getNearbyEnvironmentalSites(latitude, longitude);
              setResults(prev => prev ? { ...prev, nearbySites: sites } : null);
          } catch(e) {
              console.error("Failed to get nearby sites:", e);
              setError("Could not retrieve nearby environmental sites. Please ensure location services are enabled and try again.");
          } finally {
              setIsLoading(false);
          }
      }, (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to retrieve your location. Please grant permission to access your location.");
          setIsLoading(false);
      });
  }, []);


  return (
    <div className="min-h-screen bg-brand-dark-green text-brand-light-green font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <UserInputForm onCalculate={handleCalculate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8">
            {isLoading && !results && <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-accent"></div></div>}
            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
            {results && (
                <ResultsDisplay 
                    results={results} 
                    lifeDistributionData={lifeDistributionData}
                    carbonTrendData={carbonTrendData}
                    isLoading={isLoading} 
                    onFindNearbySites={handleFindNearbySites} 
                />
            )}
          </div>
        </div>
      </main>
      <Footer />
      {userData && results && <Chatbot initialContext={{ ...userData, ...results }} />}
    </div>
  );
};

export default App;
