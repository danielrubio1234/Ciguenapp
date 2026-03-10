"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";

export interface Profile {
  privy_user_id: string;
  mother_name: string | null;
  status: "pregnant" | "born" | null;
  due_date: string | null;
  pregnancy_week: number | null;
  first_pregnancy: boolean | null;
  chosen_name: string | null;
  baby_name: string | null;
  birth_date: string | null;
  gender: string | null;
  first_child: boolean | null;
  has_pediatrician: boolean | null;
  has_gynecologist: boolean | null;
  preferred_name: string;
  daily_check_ins: boolean;
  weekly_reports: boolean;
  alerts: boolean;
  onboarding_completed: boolean;
}

export interface ProfileStats {
  streak: number;
  total_checkins: number;
  checkins_this_week: number;
}

export function useProfile() {
  const { user, getAccessToken } = usePrivy();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await fetch("/api/profile", {
        headers: { "x-privy-user-id": user.id },
      });
      if (!res.ok) throw new Error("Error al cargar perfil");
      const data = await res.json();
      setProfile(data.profile);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const authHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(user?.id ? { "x-privy-user-id": user.id } : {}),
  };

  return { profile, stats, loading, error, refetch: fetchProfile, authHeaders, userId: user?.id };
}
