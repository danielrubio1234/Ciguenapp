import { NextRequest, NextResponse } from "next/server";
import { openai, CIGUENA_SYSTEM_PROMPT } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { message, messages, userContext } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 }
      );
    }

    const systemPrompt = userContext
      ? `${CIGUENA_SYSTEM_PROMPT}\n\nContexto de la usuaria:\n${userContext}`
      : CIGUENA_SYSTEM_PROMPT;

    const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        chatMessages.push({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        });
      }
    }

    chatMessages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error en chat API:", msg);
    return NextResponse.json(
      { error: `Error del servidor: ${msg}` },
      { status: 500 }
    );
  }
}
