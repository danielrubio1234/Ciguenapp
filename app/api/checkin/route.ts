import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-privy-user-id");
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { mood, notes, symptoms, weekNumber } = body;

    if (!mood || typeof mood !== "string") {
      return NextResponse.json(
        { error: "El estado de ánimo es requerido" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO checkins (id, privy_user_id, mood, notes, symptoms, week_number, created_at)
      VALUES (
        gen_random_uuid()::TEXT,
        ${userId},
        ${mood},
        ${notes || null},
        ${symptoms ? JSON.stringify(symptoms) : null},
        ${weekNumber || null},
        NOW()
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en check-in API:", error);
    return NextResponse.json(
      { error: "Error al guardar el check-in" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-privy-user-id");
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const checkins = await sql`
      SELECT * FROM checkins
      WHERE privy_user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 30
    `;

    return NextResponse.json({ checkins });
  } catch (error) {
    console.error("Error en checkin GET:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
