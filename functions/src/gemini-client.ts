import { GoogleGenerativeAI } from '@google/generative-ai';

import { DEFAULT_GEMINI_MODEL, SUPPORT_SYSTEM_PROMPT } from './support-system-prompt';

export interface GeminiChatTurn {
  role: 'user' | 'model';
  content: string;
}

/**
 * Reads the Gemini API key from Cloud Functions environment variables.
 *
 * @returns API key string.
 */
export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY?.trim() ?? '';
}

/**
 * Reads the configured Gemini model id.
 *
 * @returns Model name, defaulting to gemini-2.5-flash.
 */
export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

/**
 * Generates a supportive assistant reply using the Gemini Developer API.
 *
 * @param history - Prior turns in the active conversation.
 * @param userMessage - Latest user message.
 * @returns Assistant response text.
 */
export async function generateSupportReply(
  history: GeminiChatTurn[],
  userMessage: string,
): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in functions/.env');
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: getGeminiModelName(),
    systemInstruction: SUPPORT_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  });

  const chat = model.startChat({
    history: history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.content }],
    })),
  });

  const result = await chat.sendMessage(userMessage);
  const text = result.response.text().trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}
