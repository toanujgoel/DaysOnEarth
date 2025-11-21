
import { GoogleGenAI, Type } from "@google/genai";
import type { EarthChangesType, EnvironmentalImpactType, CosmicPerspectiveType, GroundingChunk, NearbySite, FunFact } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEarthChanges = async (birthYear: number): Promise<EarthChangesType> => {
    const prompt = `Provide a concise summary of the most significant global environmental, technological, and cultural changes that have occurred since the year ${birthYear}. Focus on events that have reshaped the world.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

        return { summary, sources };
    } catch (error) {
        console.error("Error fetching earth changes:", error);
        return { summary: "Could not retrieve information about world changes. The AI model may be temporarily unavailable.", sources: [] };
    }
};

export const getEnvironmentalImpact = async (country: string, age: number, diet: string): Promise<EnvironmentalImpactType> => {
    const prompt = `Based on an average person living in ${country} who identifies as ${diet}, provide some thought-provoking estimated statistics for someone who is ${Math.floor(age)} years old. Return a JSON object with two keys: "carbonFootprint" and "waterConsumption". For "carbonFootprint", provide a string estimating their cumulative carbon footprint in tonnes of CO2 equivalent, factoring in their ${diet} diet compared to the average. For "waterConsumption", provide a string estimating their total water consumption in liters. Present these as interesting, self-contained facts. For example: "Over your lifetime, your estimated water consumption is X liters, equivalent to filling Y Olympic swimming pools."`;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        carbonFootprint: { type: Type.STRING },
                        waterConsumption: { type: Type.STRING },
                    },
                    required: ["carbonFootprint", "waterConsumption"],
                }
            }
        });
        
        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error fetching environmental impact:", error);
        return {
            carbonFootprint: "Could not calculate carbon footprint.",
            waterConsumption: "Could not calculate water consumption."
        };
    }
};

export const getFunStats = async (ageYears: number, country: string): Promise<FunFact[]> => {
    const prompt = `Generate 3 fun, quirky, and surprising personalized statistics for a ${Math.floor(ageYears)} year old living in ${country}. 
    Think about things like: skin shed, hair grown, time spent blinking, time spent waiting in line, or gallons of sweat produced.
    Return ONLY a JSON array of objects with keys: 
    - "label" (short title, max 4 words), 
    - "value" (the statistic text), 
    - "icon" (strictly one of these strings: 'walk', 'clock', 'water', 'growth', 'moon', 'star').`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING },
                            value: { type: Type.STRING },
                            icon: { type: Type.STRING, enum: ['walk', 'clock', 'water', 'growth', 'moon', 'star'] }
                        },
                        required: ['label', 'value', 'icon']
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error fetching fun stats:", error);
        return [];
    }
};

export const getCosmicPerspective = async (birthDate: Date): Promise<CosmicPerspectiveType> => {
    const birthDateString = birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const prompt = `Write a short, inspiring, and cosmic perspective for someone born on ${birthDateString}. Mention the distance they have traveled through space on Earth orbiting the sun (assume Earth's orbital speed is about 67,000 mph or 107,000 km/h), and offer a reflection on their unique journey in the universe. The tone should be awe-inspiring and reflective. Do not format with markdown. Just return the text.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return { text: response.text };
    } catch (error) {
        console.error("Error fetching cosmic perspective:", error);
        return { text: "Could not retrieve your cosmic perspective. The universe is vast, and so is your potential." };
    }
};

export const getNearbyEnvironmentalSites = async (latitude: number, longitude: number): Promise<NearbySite[]> => {
    const prompt = `Show me some significant environmental conservation projects, national parks, or renewable energy installations near my current location that a person could potentially visit or see. Provide a brief, engaging description for each.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: { latitude, longitude }
                    }
                }
            },
        });

        const textResponse = response.text;
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
        const mapsSites = chunks.filter(c => c.maps).map(c => ({ title: c.maps!.title, uri: c.maps!.uri }));

        if (mapsSites.length === 0) {
            return [{ title: "No Specific Sites Found", description: textResponse, uri: "#" }];
        }

        const sites: NearbySite[] = mapsSites.map(site => {
            return {
                title: site.title,
                description: `Learn more about ${site.title} and plan your visit.`, // Placeholder description
                uri: site.uri,
            };
        });

        return sites;

    } catch (error) {
        console.error("Error fetching nearby sites:", error);
        return [{ title: "Error", description: "Could not retrieve information about nearby sites.", uri: "#" }];
    }
};
