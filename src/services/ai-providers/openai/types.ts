export interface ChatCompletionOptions {
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  max_tokens?: number;
  temperature?: number;
  tools?: any[];
  tool_choice?: string;
}

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