import fetch from 'node-fetch';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = "gpt-4o";

async function chatCompletionRequest({
  model = OPENAI_MODEL,
  systemPrompt,
  userPrompt,
  max_tokens = 3000,
  temperature = 0.7,
  tools = undefined,
  tool_choice = undefined
}) {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature,
      max_tokens,
      tools,
      tool_choice
    })
  });

  const data = await response.json();

  if (data.error) {
    console.error("OpenAI API error:", data.error);
    throw new Error(`OpenAI API Error: ${data.error.message}`);
  }

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No choices returned from OpenAI API");
  }

  const choice = data.choices[0];
  const message = choice.message;

  // Case 1: function call (tool_calls)
  if (choice.finish_reason === "tool_calls" && message.tool_calls?.length) {
    try {
      const rawArgs = message.tool_calls[0].function.arguments;
      const parsed = JSON.parse(rawArgs);

      return parsed;
    } catch (err) {
      console.error("Failed to parse tool call arguments:", message.tool_calls[0].function.arguments);

      throw err;
    }
  }

  // Case 2: regular text response
  const content = message.content;

  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }

  if (typeof content === "object") {
    return content;
  }

  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}

export const openaiClient = {
  chatCompletionRequest
};
