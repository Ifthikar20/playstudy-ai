import axios, { AxiosError } from "axios";
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";

// Define the chat session type
interface ChatSession {
  sendMessage(prompt: string): Promise<GenerateContentResult>;
}

interface DeepSeekResponse {
  choices: { message: { content: string } }[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

// Function to initialize Gemini chat session
const initializeGeminiChatSession = (apiKey: string): ChatSession => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const geminiConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  return geminiModel.startChat({
    generationConfig: geminiConfig,
    history: [],
  });
};

export async function generateGameContent(gameTitle: string, inputText: string): Promise<string> {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";
  const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

  const prompt = `Transform the following text into a ${gameTitle} game format: ${inputText}`;

  // Try DeepSeek if available
  if (DEEPSEEK_API_KEY) {
    try {
      console.log("Attempting DeepSeek API Call...");
      const response = await axios.post<DeepSeekResponse>(
        DEEPSEEK_API_URL,
        {
          model: "deepseek-r3",
          messages: [
            { role: "system", content: "You are an AI that transforms educational content into interactive game formats." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.9,
        },
        {
          headers: {
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const deepSeekContent = response.data.choices[0].message.content;
      console.log(`DeepSeek API Success: "${deepSeekContent}"`);
      return deepSeekContent;
    } catch (deepSeekError) {
      const isAxiosError = deepSeekError instanceof AxiosError;
      console.error("DeepSeek API Error:", {
        message: deepSeekError instanceof Error ? deepSeekError.message : "Unknown error",
        status: isAxiosError ? deepSeekError.response?.status : undefined,
        data: isAxiosError ? deepSeekError.response?.data : undefined,
      });
    }
  } else {
    console.log("No DEEPSEEK_API_KEY provided, falling back to Gemini");
  }

  // Fallback to Gemini
  if (!GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not set - required for operation");
  }

  try {
    console.log("Initializing Gemini API...");
    const geminiChatSession = initializeGeminiChatSession(GEMINI_API_KEY);
    console.log("Sending request to Gemini...");
    const geminiResult = await geminiChatSession.sendMessage(prompt);
    const geminiResponse = geminiResult.response.text();
    console.log(`Gemini API Success: "${geminiResponse}"`);
    return geminiResponse;
  } catch (geminiError) {
    console.error("Gemini API Error:", {
      message: geminiError instanceof Error ? geminiError.message : "Unknown error",
    });
    throw new Error("Failed to generate content with Gemini API");
  }
}