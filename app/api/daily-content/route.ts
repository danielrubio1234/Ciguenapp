import { NextRequest, NextResponse } from "next/server";
import weeklyContent from "@/data/weekly-content.json";

export const dynamic = "force-dynamic";

interface WeeklyContentItem {
  week: number;
  type: string;
  title: string;
  body: string;
  normal_symptoms: string[];
  alert_signs: string[];
  tip: string;
  milestone?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekParam = searchParams.get("week");
    const type = searchParams.get("type") || "pregnancy";

    if (!weekParam) {
      return NextResponse.json(
        { error: "El parámetro 'week' es requerido" },
        { status: 400 }
      );
    }

    const week = parseInt(weekParam, 10);

    if (isNaN(week) || week < 1) {
      return NextResponse.json(
        { error: "El parámetro 'week' debe ser un número positivo" },
        { status: 400 }
      );
    }

    const content = weeklyContent as WeeklyContentItem[];

    // Filter by type
    const filteredContent = content.filter((item) => item.type === type);

    if (filteredContent.length === 0) {
      return NextResponse.json({
        week,
        type,
        title: `Semana ${week}`,
        body: "Contenido no disponible. Consulta con tu profesional de salud para información personalizada.",
        normal_symptoms: [],
        alert_signs: [],
        tip: "Recuerda asistir a tus controles regularmente.",
        milestone: false,
      });
    }

    // Find exact match first
    const exactMatch = filteredContent.find((item) => item.week === week);
    if (exactMatch) {
      return NextResponse.json(exactMatch);
    }

    // Find the closest week BELOW (don't jump ahead to a future week)
    const pastWeeks = filteredContent
      .filter((item) => item.week < week)
      .sort((a, b) => b.week - a.week);

    if (pastWeeks.length > 0) {
      // Return closest past week with adjusted title
      const closest = pastWeeks[0];
      return NextResponse.json({
        ...closest,
        title: closest.title,
        weekDisplayed: closest.week,
        weekRequested: week,
      });
    }

    // If no past week exists, return the first available
    const sorted = [...filteredContent].sort((a, b) => a.week - b.week);
    return NextResponse.json({
      ...sorted[0],
      weekDisplayed: sorted[0].week,
      weekRequested: week,
    });

  } catch (error) {
    console.error("Error en daily-content API:", error);
    return NextResponse.json(
      { error: "Error al obtener el contenido" },
      { status: 500 }
    );
  }
}
