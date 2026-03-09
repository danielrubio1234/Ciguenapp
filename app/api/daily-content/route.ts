import { NextRequest, NextResponse } from "next/server";
import weeklyContent from "@/data/weekly-content.json";

interface WeeklyContentItem {
  week: number;
  type: string;
  title: string;
  body: string;
  normal_symptoms: string[];
  alert_signs: string[];
  tip: string;
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
        body: "Contenido no disponible para este tipo. Consulta con tu profesional de salud para información personalizada.",
        normal_symptoms: [],
        alert_signs: [],
        tip: "Recuerda asistir a tus controles prenatales regularmente.",
      });
    }

    // Find exact match
    let match = filteredContent.find((item) => item.week === week);

    // If no exact match, find the closest available week
    if (!match) {
      const sorted = [...filteredContent].sort(
        (a, b) => Math.abs(a.week - week) - Math.abs(b.week - week)
      );
      match = sorted[0];
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error en daily-content API:", error);
    return NextResponse.json(
      { error: "Error al obtener el contenido" },
      { status: 500 }
    );
  }
}
