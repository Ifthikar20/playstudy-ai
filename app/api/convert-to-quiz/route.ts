import { NextRequest, NextResponse } from "next/server";
import { generateGameContent } from "@/lib/deepseek"; // Adjust path as needed

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
    // Call generateGameContent with the game title and input text
    const aiResponse = await generateGameContent(game, content);

    // Strip markdown if present (e.g., ```json ... ```)
    const jsonString = aiResponse.replace(/```json\n|\n```/g, "").trim();
    const quizQuestions: QuizQuestion[] = JSON.parse(jsonString);

    // Validate the response matches the expected format
    for (const q of quizQuestions) {
      if (!q.question || !Array.isArray(q.answers) || q.answers.length !== 4 || !q.correct_answer || !["Easy", "Medium"].includes(q.difficulty)) {
        throw new Error("Invalid quiz question format from AI");
      }
    }

    return NextResponse.json(quizQuestions);
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return NextResponse.json({ error: "Failed to generate quiz questions" }, { status: 500 });
  }
}