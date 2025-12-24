
export type AppView = 'home' | 'recreate' | 'persona' | 'gallery';

export interface PersonaImage {
  id: string;
  url: string;
  base64: string;
  angle: string;
}

export interface PersonaProfile {
  description: string;
  images: PersonaImage[];
}

export interface AnalysisResult {
  prompt: string;
  style: string;
  lighting: string;
  angle: string;
  mood: string;
}

export interface GeneratedMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}
