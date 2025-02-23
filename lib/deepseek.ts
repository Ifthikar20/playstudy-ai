import axios, { AxiosError } from "axios";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Define the chat session type based on usage
interface ChatSession {
  sendMessage(prompt: string): Promise<any>;
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY is not set in environment variables");
}
if (!GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables");
}

console.log("DeepSeek API Key Loaded:", !!DEEPSEEK_API_KEY);
console.log("Gemini API Key Loaded:", !!GEMINI_API_KEY);

// DeepSeek Response Interface
interface DeepSeekResponse {
  choices: { message: { content: string } }[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

// Gemini Setup
let geminiChatSession: ChatSession;
try {
  console.log("Initializing Gemini API...");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const geminiConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  geminiChatSession = geminiModel.startChat({
    generationConfig: geminiConfig,
    history: [],
  });
  console.log("Gemini API Initialized Successfully");
} catch (initError) {
  console.error("Failed to initialize Gemini API:", initError);
  throw initError;
}

export async function generateGameContent(gameTitle: string, inputText: string): Promise<string> {
  const prompt = `Transform the following text into a ${gameTitle} game format: ${inputText}`;

  // Primary: DeepSeek API Call
  try {
    console.log("Attempting DeepSeek API Call...");
    const response = await axios.post<DeepSeekResponse>(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-r3", // Replace with actual model name if different
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
    console.log(`DeepSeek API Success (Source: DeepSeek): "${deepSeekContent}"`);
    return deepSeekContent;
  } catch (deepSeekError) {
    const isAxiosError = deepSeekError instanceof AxiosError;
    console.error("DeepSeek API Error:", {
      message: deepSeekError instanceof Error ? deepSeekError.message : "Unknown error",
      status: isAxiosError ? deepSeekError.response?.status : undefined,
      data: isAxiosError ? deepSeekError.response?.data : undefined,
    });

    // Fallback: Gemini API Call
    console.log("Falling back to Gemini API...");
    try {
      console.log("Sending request to Gemini...");
      const geminiResult = await geminiChatSession.sendMessage(prompt);
      const geminiResponse = await geminiResult.response.text();
      console.log(`Gemini API Success (Source: Gemini): "${geminiResponse}"`);
      return geminiResponse;
    } catch (geminiError) {
      console.error("Gemini API Error:", {
        message: geminiError instanceof Error ? geminiError.message : "Unknown error",
      });
      throw new Error("Both DeepSeek and Gemini API calls failed");
    }
  }
}