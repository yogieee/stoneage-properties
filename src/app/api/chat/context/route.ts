import { NextRequest, NextResponse } from "next/server";
import { buildPageContext } from "@/lib/chat/pageContext";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  try {
    const context = await buildPageContext(path);
    return NextResponse.json(context);
  } catch (err) {
    console.error("Failed to build chat page context:", err);
    // Generic fallback so the widget still opens if Sanity is unreachable.
    return NextResponse.json({
      label: "Stoneage Properties",
      systemContext:
        "Help the visitor understand Stoneage Properties' services and work the conversation toward a Spatial Brief submission.",
      greeting:
        "Welcome to Stoneage Properties. Ask me about our services, our process, or a project you have in mind.",
      suggestions: [
        "What services do you offer?",
        "How does the process work?",
        "I'd like to start a project",
      ],
    });
  }
}
