import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = "gpt-4o";

export async function generateOpenAIResponse({
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

  const content = data.choices[0].message.content;

  if (typeof content === 'object') {
    return content;
  }

  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}
