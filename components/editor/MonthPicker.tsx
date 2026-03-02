"use client";

import { MESES } from "@/lib/types";

interface Props {
  mes: number;
  anio: number;
  onChangeMes: (mes: number) => void;
  onChangeAnio: (anio: number) => void;
}

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

export function MonthPicker({ mes, anio, onChangeMes, onChangeAnio }: Props) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mes</label>
        <select
          value={mes}
          onChange={(e) => onChangeMes(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#29385f]/30 focus:border-[#29385f]"
        >
          {MESES.map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Año</label>
        <select
          value={anio}
          onChange={(e) => onChangeAnio(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#29385f]/30 focus:border-[#29385f]"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
