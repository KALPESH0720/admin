

import { GoogleGenAI, Type } from "@google/genai";
import { SymptomLog, Pharmacy, PredictedDemand } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeSymptomData = async (symptoms: SymptomLog[], query: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a public health data analyst AI. Your role is to identify potential health outbreaks from community-reported symptom data.
      Analyze the provided data to answer the user's query. Be concise and clear in your analysis.
      
      User Query: "${query}"
      
      Symptom Data (first 50 reports): 
      ${JSON.stringify(symptoms.slice(0, 50), null, 2)}
      
      Provide your analysis as a text summary. Focus on actionable insights.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing symptom data:", error);
    return "An error occurred while analyzing the data. Please check the console for more details.";
  }
};

export const predictMedicineDemand = async (symptoms: SymptomLog[], pharmacies: Pharmacy[]): Promise<PredictedDemand[] | string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Based on the current medicine inventory levels and recent symptom trends, predict the demand for Paracetamol, Ibuprofen, and Oseltamivir for the next 7 days.
      
      Symptom Data (first 50 reports):
      ${JSON.stringify(symptoms.slice(0, 50), null, 2)}
      
      Pharmacy Inventory Data:
      ${JSON.stringify(pharmacies.map(p => ({
        name: p.name,
        address: p.address,
        inventory: p.inventory.map(i => ({
          name: i.medicine?.name,
          stock: i.quantity,
        }))
      })), null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              medicineName: {
                type: Type.STRING,
                description: 'The name of the medicine.',
              },
              predictedDemandChange: {
                type: Type.STRING,
                description: 'A percentage increase/decrease or qualitative change (e.g., "High Increase", "Stable").',
              },
              reasoning: {
                type: Type.STRING,
                description: 'A brief explanation for the prediction based on the data.',
              },
            },
            required: ["medicineName", "predictedDemandChange", "reasoning"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as PredictedDemand[];
  } catch (error) {
    console.error("Error predicting medicine demand:", error);
    return "Failed to predict medicine demand. The model may have returned an invalid response.";
  }
};