"use client";

import { WeekDays } from "@/lib/calendar";
import { DiaData, MenuRow, MENU_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  weeks: WeekDays[];
  menuRows: MenuRow[];
  dias: Record<string, DiaData>;
  onChangeDia: (isoDate: string, row: MenuRow, value: string) => void;
}

const FIXED_ROWS = [
  { label: "Salad Bar", value: "Ensaladas" },
];
const FIXED_ROWS_BOTTOM = [
  { label: "Postres", value: "Buffet de postres" },
  { label: "Alternativa", value: "Fruta natural" },
];

export function WeekGrid({ weeks, menuRows, dias, onChangeDia }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {weeks.map((week) => (
        <div key={week.weekIndex} className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[700px]">
            <thead>
              <tr>
                <th className="w-32 bg-[#29385f] text-white text-left px-3 py-2 rounded-tl-lg text-xs font-semibold uppercase tracking-wide">
                  &nbsp;
                </th>
                {week.days.map((day) => (
                  <th
                    key={day.isoDate}
                    className="bg-[#29385f] text-white text-center px-2 py-2 text-xs font-semibold uppercase tracking-wide last:rounded-tr-lg"
                  >
                    {day.label}
                  </th>
                ))}
                {/* Fill empty cols if week has fewer than 5 days */}
                {Array.from({ length: 5 - week.days.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="bg-[#29385f] px-2 py-2" />
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Fixed top rows */}
              {FIXED_ROWS.map((row) => (
                <tr key={row.label} className="bg-[#b8c1d7]/20">
                  <td className="px-3 py-2 font-semibold text-[#29385f] border border-gray-200 bg-[#b8c1d7]/40 text-xs">
                    {row.label}
                  </td>
                  {week.days.map((day) => (
                    <td
                      key={day.isoDate}
                      className="px-2 py-2 border border-gray-200 text-center text-gray-500 text-xs italic"
                    >
                      {row.value}
                    </td>
                  ))}
                  {Array.from({ length: 5 - week.days.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="border border-gray-200" />
                  ))}
                </tr>
              ))}

              {/* Editable menu rows */}
              {menuRows.map((rowKey) => (
                <tr key={rowKey} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold text-[#29385f] border border-gray-200 bg-[#b8c1d7]/40 text-xs">
                    {MENU_LABELS[rowKey]}
                  </td>
                  {week.days.map((day) => (
                    <td key={day.isoDate} className="border border-gray-200 p-1">
                      <textarea
                        value={dias[day.isoDate]?.[rowKey] || ""}
                        onChange={(e) =>
                          onChangeDia(day.isoDate, rowKey, e.target.value)
                        }
                        placeholder="Plato del día..."
                        rows={2}
                        className={cn(
                          "w-full resize-none text-xs p-1.5 rounded border-0 focus:outline-none focus:ring-1 focus:ring-[#29385f]/30",
                          "bg-transparent placeholder:text-gray-300"
                        )}
                      />
                    </td>
                  ))}
                  {Array.from({ length: 5 - week.days.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="border border-gray-200 bg-gray-50" />
                  ))}
                </tr>
              ))}

              {/* Fixed bottom rows */}
              {FIXED_ROWS_BOTTOM.map((row) => (
                <tr key={row.label} className="bg-[#b8c1d7]/20">
                  <td className="px-3 py-2 font-semibold text-[#29385f] border border-gray-200 bg-[#b8c1d7]/40 text-xs">
                    {row.label}
                  </td>
                  {week.days.map((day) => (
                    <td
                      key={day.isoDate}
                      className="px-2 py-2 border border-gray-200 text-center text-gray-500 text-xs italic"
                    >
                      {row.value}
                    </td>
                  ))}
                  {Array.from({ length: 5 - week.days.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="border border-gray-200" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
