
export interface RestoredPhoto {
  id: string;
  originalUrl: string;
  restoredUrl: string;
  timestamp: number;
  status: 'processing' | 'completed' | 'failed';
}

export interface RestorationConfig {
  colorize: boolean;
  sharpen: boolean;
  denoise: boolean;
  upscale: boolean;
}
