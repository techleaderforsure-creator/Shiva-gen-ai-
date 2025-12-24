
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Ensure process.env.API_KEY is available globally as per instructions
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReference = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: "Analyze this image/video screenshot. Describe its artistic style, lighting, camera angle, mood, and editing techniques. Then, generate an optimized, highly detailed prompt that would recreate this exact visual look. Use Thinking Mode for maximum detail." }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "";
};

export const createPersonaDescription = async (images: {base64: string, mimeType: string}[]): Promise<string> => {
  const ai = getAI();
  const parts = images.map(img => ({ inlineData: { data: img.base64, mimeType: img.mimeType } }));
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...parts,
        { text: "Analyze these multi-angle photos of the same person. Create a comprehensive physical profile focusing on facial structure, eye shape, nose, mouth, hair texture, and unique identifiers. This profile will be used to maintain identity in AI generations. Be precise and objective." }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "";
};

export const generateImageWithPersona = async (
  basePrompt: string, 
  personaProfile: string, 
  size: '1K' | '2K' | '4K' = '1K',
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '1:1'
): Promise<string> => {
  const ai = getAI();
  const finalPrompt = personaProfile 
    ? `Create an image featuring a person with these characteristics: ${personaProfile}. The scene should follow this style and setting: ${basePrompt}`
    : basePrompt;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: finalPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio,
        imageSize: size
      }
    }
  });

  // Iterating through parts to find image data as recommended
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from Gemini");
};

export const editImage = async (base64Image: string, mimeType: string, editPrompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: editPrompt }
      ]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image data returned from Gemini");
};

export const generateVideoWithPersona = async (
  basePrompt: string, 
  personaProfile: string, 
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  const ai = getAI();
  const finalPrompt = personaProfile 
    ? `A video featuring a person with these characteristics: ${personaProfile}. ${basePrompt}`
    : basePrompt;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: finalPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  // Polling logic following recommended 10s delay
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  // Fetching final video bytes using the API key as required
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const analyzeVideo = async (file: File): Promise<string> => {
  const ai = getAI();
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve) => {
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64, mimeType: file.type } },
        { text: "Analyze this video for key information, including camera movement, lighting changes, narrative flow, and overall aesthetic style. Provide an optimized prompt for recreating this video's essence." }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  return response.text || "";
};
