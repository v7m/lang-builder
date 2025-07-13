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
export interface GenerationRegistry {
  counter: {
    test: number;
    main: number;
  };
  lastGenerated: {
    test: Nullable<string>;
    main: Nullable<string>;
  };
}

export interface DialogLine {
  id: number;
  speaker: "Speaker 1" | "Speaker 2";
  text: string;
}

export interface DialogData {
  dialog: DialogLine[];
  wordFormsUsage: Record<string, number>;
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

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
