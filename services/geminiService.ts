
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DayItinerary, ActivityType } from "../types";

// Schema definition for Structured Output
const itinerarySchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      dayId: { type: Type.INTEGER },
      dayTitle: { type: Type.STRING },
      weatherForecast: { type: Type.STRING, description: "Predicted weather for this day (e.g., 'Sunny 24°C')" },
      weatherIcon: { type: Type.STRING, description: "Emoji for weather" },
      accommodation: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          address: { type: Type.STRING },
          phone: { type: Type.STRING }
        },
        description: "Hotel or accommodation information for this night."
      },
      activities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "Time in HH:MM format" },
            title: { type: Type.STRING },
            location: { type: Type.STRING, description: "Precise location name for Google Maps search" },
            description: { type: Type.STRING, description: "A short, engaging story or guide." },
            type: { type: Type.STRING, enum: [
                ActivityType.SIGHTSEEING, 
                ActivityType.FOOD, 
                ActivityType.TRANSPORT, 
                ActivityType.SHOPPING, 
                ActivityType.FLIGHT,
                ActivityType.OTHER
            ] },
            highlights: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Short tags like 'Must Eat', 'Must Buy', 'Photo Spot'"
            },
            transportMode: { type: Type.STRING, enum: ['WALK', 'TRAIN', 'BUS', 'TAXI', 'FLIGHT', 'NONE'], description: "How to get TO this location from previous one" },
            transportLabel: { type: Type.STRING, description: "Short text for transport (e.g. 'JR Train 30min')" }
          },
          required: ["time", "title", "location", "description", "type", "highlights", "transportMode"]
        }
      }
    },
    required: ["dayId", "dayTitle", "activities", "weatherForecast", "weatherIcon"]
  }
};

export const analyzeItinerary = async (userInput: string): Promise<DayItinerary[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Japanese travel guide. 
      Analyze the unstructured travel plan and convert it into a structured JSON itinerary.
      
      Tasks:
      1. Identify days and activities.
      2. Group weather forecasts at the DAY level.
      3. For each activity, determine transport mode used to reach it from the previous location.
      4. Write engaging descriptions.
      5. Infer accommodation if missing.
      6. Use Traditional Chinese (Taiwan).
      
      User Input:
      ${userInput}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const data = JSON.parse(jsonText) as any[];
    
    return data.map((day: any) => ({
      ...day,
      activities: day.activities.map((act: any) => ({
        ...act,
        id: crypto.randomUUID()
      }))
    }));

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
