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
    console.log("[onboarding] userId:", userId, "body keys:", Object.keys(body));

    const {
      motherName,
      status,
      dueDate,
      pregnancyWeek,
      firstPregnancy,
      chosenName,
      babyName,
      birthDate,
      gender,
      firstChild,
      hasPediatrician,
      hasGynecologist,
      preferredName,
      dailyCheckIns,
      weeklyReports,
      alerts,
    } = body;

    if (!motherName || !status) {
      return NextResponse.json(
        { error: "Nombre y estado son requeridos" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO profiles (
        privy_user_id,
        mother_name,
        status,
        due_date,
        pregnancy_week,
        first_pregnancy,
        chosen_name,
        baby_name,
        birth_date,
        gender,
        first_child,
        has_pediatrician,
        has_gynecologist,
        preferred_name,
        daily_check_ins,
        weekly_reports,
        alerts,
        onboarding_completed,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${motherName},
        ${status},
        ${dueDate || null},
        ${pregnancyWeek || null},
        ${firstPregnancy ?? null},
        ${chosenName || null},
        ${babyName || null},
        ${birthDate || null},
        ${gender || null},
        ${firstChild ?? null},
        ${hasPediatrician ?? null},
        ${hasGynecologist ?? null},
        ${preferredName || 'Mamá'},
        ${dailyCheckIns ?? true},
        ${weeklyReports ?? true},
        ${alerts ?? true},
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (privy_user_id) DO UPDATE SET
        mother_name = EXCLUDED.mother_name,
        status = EXCLUDED.status,
        due_date = EXCLUDED.due_date,
        pregnancy_week = EXCLUDED.pregnancy_week,
        first_pregnancy = EXCLUDED.first_pregnancy,
        chosen_name = EXCLUDED.chosen_name,
        baby_name = EXCLUDED.baby_name,
        birth_date = EXCLUDED.birth_date,
        gender = EXCLUDED.gender,
        first_child = EXCLUDED.first_child,
        has_pediatrician = EXCLUDED.has_pediatrician,
        has_gynecologist = EXCLUDED.has_gynecologist,
        preferred_name = EXCLUDED.preferred_name,
        daily_check_ins = EXCLUDED.daily_check_ins,
        weekly_reports = EXCLUDED.weekly_reports,
        alerts = EXCLUDED.alerts,
        onboarding_completed = true,
        updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en onboarding API:", error);
    return NextResponse.json(
      { error: "Error al crear el perfil" },
      { status: 500 }
    );
  }
}
