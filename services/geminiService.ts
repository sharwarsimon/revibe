
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const restoreImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string = "Act as a professional photo restoration expert. Your task is to take this old, damaged photo and return a completely restored, high-quality version. 1. Remove all scratches, dust, and physical artifacts. 2. Sharpen blurry details, especially around faces and eyes. 3. If the image is black and white, colorize it with realistic, historically accurate, and vibrant colors. 4. Balance the exposure and contrast to make it look like a modern digital photograph while preserving the original character. Output ONLY the restored image."
): Promise<string> => {
  // Use a fresh instance with the current API_KEY from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("The AI didn't return an image part. The photo might be too damaged or violate safety guidelines.");
  } catch (error: any) {
    console.error("Restoration Error:", error);
    if (error?.message?.includes("Requested entity was not found")) {
      throw new Error("Invalid API Key. Please click 'Connect Key' to refresh your credentials.");
    }
    throw new Error(error.message || "Something went wrong during restoration. Please try again.");
  }
};
