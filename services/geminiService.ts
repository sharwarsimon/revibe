
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const restoreImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string = "Please restore this photo. Remove scratches, enhance details, improve clarity, and colorize if it's black and white. Make it look like a high-quality modern photograph while keeping the original faces and composition intact."
): Promise<string> => {
  const ai = getAIClient();
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove prefix if present
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through candidates to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image was returned from the restoration process.");
  } catch (error) {
    console.error("Restoration Error:", error);
    throw error;
  }
};
