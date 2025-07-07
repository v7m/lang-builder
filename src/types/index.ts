// AI Provider Types
export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      tool_calls?: Array<{
        function: {
          arguments: string;
        };
      }>;
    };
    finish_reason: string;
  }>;
  error?: {
    message: string;
  };
}

export interface ChatCompletionOptions {
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  max_tokens?: number;
  temperature?: number;
  tools?: unknown[];
  tool_choice?: string;
}

// Generation Types
export interface GenerationMeta {
  counter: number;
  lastGenerated: string | null;
}

export interface WordData {
  id: number;
  word: string;
  part_of_speech: string;
  regularity: string;
  forms: string;
  translation: string[];
  example: string;
}

export interface DialogLine {
  id: number;
  speaker: "Speaker 1" | "Speaker 2";
  text: string;
}

export interface DialogData {
  dialog: DialogLine[];
  word_forms_usage: Record<string, number>;
}

// Configuration Types
export interface AudioConfig {
  outputPath: string;
  channels?: number;
  sampleRate?: number;
  bitDepth?: number;
}

export interface MultiSpeakerConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
} 
