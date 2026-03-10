-- ============================================================
-- Ciguenapp — Neon Database Schema (Privy Auth)
-- Run this in your Neon SQL editor (console.neon.tech)
-- ============================================================

-- User profiles (keyed by Privy user ID)
CREATE TABLE IF NOT EXISTS profiles (
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
);

-- Daily check-ins
CREATE TABLE IF NOT EXISTS checkins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  privy_user_id TEXT NOT NULL,
  mood TEXT NOT NULL,
  notes TEXT,
  symptoms TEXT[],
  week_number INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS checkins_user_idx ON checkins (privy_user_id);
CREATE INDEX IF NOT EXISTS checkins_created_idx ON checkins (privy_user_id, created_at DESC);
