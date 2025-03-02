import { NextRequest, NextResponse } from "next/server";
import { generateGameContent } from "@/lib/deepseek";

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

export async function POST(request: NextRequest) {
  const { content, game } = await request.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    const aiResponse = await generateGameContent(game, content);

    // Extract JSON from between ```json and ``` markers
    const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("No valid JSON found in AI response");
    }
    const jsonString = jsonMatch[1].trim();
    const quizQuestions: QuizQuestion[] = JSON.parse(jsonString);

    // Validate the response matches the expected format
    for (const q of quizQuestions) {
      if (
        !q.question ||
        !Array.isArray(q.answers) ||
        q.answers.length !== 4 ||
        !q.correct_answer ||
        !["Easy", "Medium"].includes(q.difficulty)
      ) {
        throw new Error("Invalid quiz question format from AI");
      }
    }

    return NextResponse.json(quizQuestions);
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return NextResponse.json(
      {
        error: "Failed to generate quiz questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}