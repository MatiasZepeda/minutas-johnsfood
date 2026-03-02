"use client";

import { MESES } from "@/lib/types";
import { Minuta } from "@/lib/types";

interface Props {
  previoMinuta: Minuta;
  onDuplicate: () => void;
  onSkip: () => void;
}

export function DuplicatePrompt({ previoMinuta, onDuplicate, onSkip }: Props) {
  return (
    <div className="bg-[#95ccff]/20 border border-[#95ccff] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-semibold text-[#29385f]">
          Existe una minuta anterior
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {MESES[previoMinuta.mes - 1]} {previoMinuta.anio} — ¿Quieres usarla como base para este mes?
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onDuplicate}
          className="px-4 py-2 bg-[#29385f] text-white rounded-lg text-sm font-medium hover:bg-[#1e2a47] transition-colors"
        >
          Duplicar como base
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Empezar desde cero
        </button>
      </div>
    </div>
  );
}
