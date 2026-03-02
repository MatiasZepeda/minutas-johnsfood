import { format, getDaysInMonth, setDate, getDay } from "date-fns";

export interface WeekDays {
  weekIndex: number;
  days: { date: Date; label: string; isoDate: string }[];
}

/**
 * Returns all business days (Mon-Fri) for a given month/year
 * grouped by week (Mon start).
 */
export function getBusinessWeeks(year: number, month: number): WeekDays[] {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
  const weeks: WeekDays[] = [];
  let currentWeek: WeekDays | null = null;
  let weekIndex = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = getDay(date); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat

    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends

    // Start a new week on Monday or first business day
    if (dayOfWeek === 1 || currentWeek === null) {
      if (currentWeek !== null) weeks.push(currentWeek);
      currentWeek = { weekIndex, days: [] };
      weekIndex++;
    }

    const dayNames = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    currentWeek.days.push({
      date,
      label: `${dayNames[dayOfWeek]} ${day}`,
      isoDate: format(date, "yyyy-MM-dd"),
    });
  }

  if (currentWeek && currentWeek.days.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

export function getMesLabel(mes: number): string {
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  return meses[mes - 1] || "";
}

export function countBusinessDays(year: number, month: number): number {
  const weeks = getBusinessWeeks(year, month);
  return weeks.reduce((acc, w) => acc + w.days.length, 0);
}
