import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

// One-time migration endpoint — DELETE THIS FILE after running
// Protected by a secret token
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-migrate-secret");
  if (secret !== process.env.MIGRATE_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Drop old tables
    await sql`DROP TABLE IF EXISTS checkins CASCADE`;
    await sql`DROP TABLE IF EXISTS profiles CASCADE`;
    await sql`DROP TABLE IF EXISTS sessions CASCADE`;
    await sql`DROP TABLE IF EXISTS accounts CASCADE`;
    await sql`DROP TABLE IF EXISTS verification_tokens CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    // Create profiles table
    await sql`
      CREATE TABLE profiles (
        privy_user_id TEXT PRIMARY KEY,
        mother_name TEXT,
        status TEXT CHECK (status IN ('pregnant', 'born')),
        due_date DATE,
        pregnancy_week INTEGER,
        first_pregnancy BOOLEAN,
        chosen_name TEXT,
        baby_name TEXT,
        birth_date DATE,
        gender TEXT,
        first_child BOOLEAN,
        has_pediatrician BOOLEAN,
        has_gynecologist BOOLEAN,
        preferred_name TEXT DEFAULT 'Mamá',
        daily_check_ins BOOLEAN DEFAULT TRUE,
        weekly_reports BOOLEAN DEFAULT TRUE,
        alerts BOOLEAN DEFAULT TRUE,
        onboarding_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Create checkins table
    await sql`
      CREATE TABLE checkins (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        privy_user_id TEXT NOT NULL,
        mood TEXT NOT NULL,
        notes TEXT,
        symptoms TEXT[],
        week_number INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`CREATE INDEX checkins_user_idx ON checkins (privy_user_id)`;
    await sql`CREATE INDEX checkins_created_idx ON checkins (privy_user_id, created_at DESC)`;

    return NextResponse.json({ success: true, message: "Migración completada ✅" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Migration error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
