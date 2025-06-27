import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that writes simple, creative stories for language learners.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const story = data?.choices?.[0]?.message?.content ?? "No story was generated.";

    return NextResponse.json({ story });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ story: "Error generating story." }, { status: 500 });
  }
}
