import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, isPregnant, dueDate, birthDate, babyName } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      );
    }

    if (typeof isPregnant !== "boolean") {
      return NextResponse.json(
        { error: "Debes indicar si estás embarazada" },
        { status: 400 }
      );
    }

    if (isPregnant && !dueDate) {
      return NextResponse.json(
        { error: "La fecha probable de parto es requerida" },
        { status: 400 }
      );
    }

    if (!isPregnant && !birthDate) {
      return NextResponse.json(
        { error: "La fecha de nacimiento del bebé es requerida" },
        { status: 400 }
      );
    }

    // MVP: validate and return success
    // In production, this would save to Supabase profiles and babies tables:
    // const { data: profile, error: profileError } = await supabase
    //   .from('profiles')
    //   .insert({ name, is_pregnant: isPregnant });
    //
    // const { data: baby, error: babyError } = await supabase
    //   .from('babies')
    //   .insert({
    //     name: babyName || null,
    //     due_date: dueDate || null,
    //     birth_date: birthDate || null,
    //   });

    return NextResponse.json({
      success: true,
      message: "Perfil creado correctamente",
    });
  } catch (error) {
    console.error("Error en onboarding API:", error);
    return NextResponse.json(
      { error: "Error al crear el perfil" },
      { status: 500 }
    );
  }
}
