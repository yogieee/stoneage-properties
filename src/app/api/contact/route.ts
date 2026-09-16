import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    projectTypes?: string[];
    location?: string;
    timeline?: string;
    message?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, projectTypes, location, timeline, message } = body;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      project_types: projectTypes ?? [],
      location: location?.trim() || null,
      timeline: timeline || null,
      message: message?.trim() || null,
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    });

    if (error) {
      console.error("Supabase contact insert failed:", error);
      return NextResponse.json(
        { error: "Could not save your submission. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 },
    );
  }
}
