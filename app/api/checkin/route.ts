import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mood, notes, symptoms, weekNumber } = body;

    if (!mood || typeof mood !== "string") {
      return NextResponse.json(
        { error: "El estado de ánimo es requerido" },
        { status: 400 }
      );
    }

    if (symptoms && !Array.isArray(symptoms)) {
      return NextResponse.json(
        { error: "Los síntomas deben ser una lista" },
        { status: 400 }
      );
    }

    if (weekNumber !== undefined && (typeof weekNumber !== "number" || weekNumber < 1)) {
      return NextResponse.json(
        { error: "El número de semana debe ser un número positivo" },
        { status: 400 }
      );
    }

    // MVP: validate and return success
    // In production, this would save to Supabase checkins table:
    // const { data, error } = await supabase.from('checkins').insert({
    //   user_id: userId,
    //   baby_id: babyId,
    //   mood,
    //   notes: notes || null,
    //   symptoms: symptoms || [],
    //   week_number: weekNumber || null,
    // });

    return NextResponse.json({
      success: true,
      message: "Check-in guardado correctamente",
    });
  } catch (error) {
    console.error("Error en check-in API:", error);
    return NextResponse.json(
      { error: "Error al guardar el check-in" },
      { status: 500 }
    );
  }
}
