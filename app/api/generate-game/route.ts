import { NextRequest, NextResponse } from "next/server";
import { generateGameContent } from "@/lib/deepseek";
import { getUserSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { gameTitle, inputText } = await req.json();
    if (!gameTitle || !inputText) {
      return NextResponse.json({ error: "Missing gameTitle or inputText" }, { status: 400 });
    }

    const aiResponse = await generateGameContent(gameTitle, inputText);
    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error("Error generating game content:", error);
    return NextResponse.json(
      {
        error: "Failed to generate game content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}