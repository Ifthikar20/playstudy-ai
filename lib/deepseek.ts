import axios, { AxiosError } from "axios";
import OpenAI from "openai";

export async function generateGameContent(gameTitle: string, inputText: string): Promise<string> {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const GROK_API_KEY = process.env.GROK_API_KEY;
  const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

  const prompt = `
You are an AI that transforms educational content into interactive game formats. Transform the following text into a set of quiz questions for the game "${gameTitle}". Return the result as a JSON array in this exact format:

[
  {
    "question": "string",
    "answers": ["A. string", "B. string", "C. string", "D. string"],
    "correct_answer": "Letter. string",
    "difficulty": "Easy" | "Medium"
  }
]

Each question should:
- Be derived directly from the input text.
- Have four answer options (A, B, C, D).
- Specify the correct answer with its option letter (e.g., "B. Answer").
- Assign a difficulty of "Easy" or "Medium" based on complexity.

Input text:
${inputText}
`;

  // Try DeepSeek first with OpenAI SDK approach
  if (DEEPSEEK_API_KEY) {
    try {
      console.log("Attempting DeepSeek API Call with OpenAI SDK approach...");
      
      // Initialize the OpenAI client with DeepSeek base URL
      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: DEEPSEEK_API_KEY,
      });
      
      // Use the OpenAI SDK to make the request
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are an AI that transforms educational content into interactive game formats." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      const deepSeekContent = completion.choices[0].message.content || "";
      console.log(`DeepSeek API Success: "${deepSeekContent.substring(0, 50)}..."`);
      return deepSeekContent;
    } catch (deepSeekError) {
      console.error("DeepSeek API Error:", {
        message: deepSeekError instanceof Error ? deepSeekError.message : "Unknown error",
        details: deepSeekError
      });
      console.log("DeepSeek call failed, falling back to Grok");
    }
  } else {
    console.log("No DEEPSEEK_API_KEY provided, falling back to Grok");
  }

  // Fallback to Grok with grok-2-vision-1212
  if (!GROK_API_KEY) {
    throw new Error("GROK_API_KEY is not set - required for operation");
  }

  try {
    console.log("Attempting Grok API Call with grok-2-vision-1212...");
    const response = await axios.post(
      GROK_API_URL,
      {
        model: "grok-2-vision-1212",
        messages: [
          { role: "system", content: "You are an AI that transforms educational content into interactive game formats." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      },
      {
        headers: {
          "Authorization": `Bearer ${GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000
      }
    );
    const grokContent = response.data.choices[0].message.content;
    console.log(`Grok API Success: "${grokContent.substring(0, 50)}..."`);
    return grokContent;
  } catch (grokError) {
    const isAxiosError = grokError instanceof AxiosError;
    console.error("Grok API Error:", {
      message: grokError instanceof Error ? grokError.message : "Unknown error",
      status: isAxiosError ? grokError.response?.status : undefined,
      data: isAxiosError ? grokError.response?.data : undefined,
    });
    throw new Error("Failed to generate content with Grok API (grok-2-vision-1212)");
  }
}