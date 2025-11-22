
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'moderate' | 'active';
export type Diet = 'omnivore' | 'vegetarian' | 'vegan';

export type FeatureId = 'galactic' | 'environmental' | 'nearby' | 'life_chart' | 'ai_analysis';

export interface UserData {
  birthdate: string;
  country: string;
  height: number;
  weight: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  diet: Diet;
}

export interface FunFact {
    label: string;
    value: string;
    icon: 'walk' | 'clock' | 'water' | 'growth' | 'moon' | 'star';
}

export interface StatResults {
  daysLived: number;
  breathsTaken: number;
  hoursSlept: number;
  mealsConsumed: number;
  heartbeats: number;
  distanceWalked: number;
  caloriesBurned: number;
  treesForOxygen: number;
  
  // New Stats
  galacticDistance: number;
  moonOrbits: number;
  funFacts: FunFact[] | null;

  earthChanges: EarthChangesType | null;
  environmentalImpact: EnvironmentalImpactType | null;
  cosmicPerspective: CosmicPerspectiveType | null;
  nearbySites: NearbySite[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface EarthChangesType {
  summary: string;
  sources: GroundingChunk[];
}

export interface EnvironmentalImpactType {
  carbonFootprint: string;
  waterConsumption: string;
}

export interface CosmicPerspectiveType {
  text: string;
}

export interface NearbySite {
    title: string;
    description: string;
    uri: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}
