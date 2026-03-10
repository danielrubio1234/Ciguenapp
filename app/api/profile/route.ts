import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-privy-user-id");
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const [profile] = await sql`
      SELECT * FROM profiles WHERE privy_user_id = ${userId} LIMIT 1
    `;

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    // Calculate current pregnancy week from due_date if status is pregnant
    let currentWeek = profile.pregnancy_week as number | null;
    if (profile.status === "pregnant" && profile.due_date) {
      const due = new Date(profile.due_date as string);
      const conceptionDate = new Date(due);
      conceptionDate.setDate(conceptionDate.getDate() - 280);
      const diffMs = Date.now() - conceptionDate.getTime();
      currentWeek = Math.max(1, Math.min(42, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))));
    }

    // Get check-in stats
    const [stats] = await sql`
      SELECT
        COUNT(*)::int AS total_checkins,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::int AS checkins_this_week
      FROM checkins
      WHERE privy_user_id = ${userId}
    `;

    // Calculate streak (consecutive days with check-ins)
    const recentCheckins = await sql`
      SELECT DATE(created_at) as day
      FROM checkins
      WHERE privy_user_id = ${userId}
        AND created_at >= NOW() - INTERVAL '60 days'
      GROUP BY DATE(created_at)
      ORDER BY day DESC
    `;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < recentCheckins.length; i++) {
      const day = new Date(recentCheckins[i].day as string);
      day.setHours(0, 0, 0, 0);
      const expectedDay = new Date(today);
      expectedDay.setDate(today.getDate() - i);
      if (day.getTime() === expectedDay.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      profile: {
        ...profile,
        pregnancy_week: currentWeek,
      },
      stats: {
        streak,
        total_checkins: stats?.total_checkins ?? 0,
        checkins_this_week: stats?.checkins_this_week ?? 0,
      },
    });
  } catch (error) {
    console.error("Error en /api/profile GET:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-privy-user-id");
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();

    await sql`
      UPDATE profiles
      SET
        mother_name = COALESCE(${body.mother_name ?? null}, mother_name),
        preferred_name = COALESCE(${body.preferred_name ?? null}, preferred_name),
        daily_check_ins = COALESCE(${body.daily_check_ins ?? null}, daily_check_ins),
        weekly_reports = COALESCE(${body.weekly_reports ?? null}, weekly_reports),
        alerts = COALESCE(${body.alerts ?? null}, alerts),
        updated_at = NOW()
      WHERE privy_user_id = ${userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en /api/profile PUT:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
