import weeklyContentData from "@/data/weekly-content.json";

export type WeeklyContent = {
  week: number;
  type: "pregnancy" | "baby";
  title: string;
  body: string;
  normal_symptoms: string[];
  alert_signs: string[];
  tip: string;
};

export function getWeeklyContent(
  week: number,
  type: "pregnancy" | "baby"
): WeeklyContent | undefined {
  return (weeklyContentData as WeeklyContent[]).find(
    (item) => item.week === week && item.type === type
  );
}

export function calculateWeek(date: Date, isPregnancy: boolean): number {
  const now = new Date();
  if (isPregnancy) {
    // Calculate weeks until due date, then convert to current pregnancy week
    const diffMs = date.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(40, 40 - diffWeeks));
  } else {
    // Calculate baby age in weeks
    const diffMs = now.getTime() - date.getTime();
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(52, diffWeeks));
  }
}

export function formatAge(date: Date, isPregnancy: boolean): string {
  if (isPregnancy) {
    const week = calculateWeek(date, true);
    return `Semana ${week} de embarazo`;
  } else {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    if (months === 0) return `${days} días`;
    return `${months} ${months === 1 ? "mes" : "meses"} y ${days} días`;
  }
}
