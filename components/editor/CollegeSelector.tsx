"use client";

import Image from "next/image";
import { COLLEGES } from "@/lib/colleges";
import { ColegioId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  value: ColegioId | null;
  onChange: (id: ColegioId) => void;
}

export function CollegeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {COLLEGES.map((college) => (
        <button
          key={college.id}
          onClick={() => onChange(college.id)}
          className={cn(
            "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer",
            value === college.id
              ? "border-[#29385f] bg-[#29385f]/5 shadow-md"
              : "border-gray-200 hover:border-[#95ccff] hover:shadow-sm bg-white"
          )}
        >
          <div className="h-20 w-full flex items-center justify-center">
            <Image
              src={college.logoFile}
              alt={college.nombre}
              width={80}
              height={80}
              className="max-h-20 max-w-full object-contain"
            />
          </div>
          <span
            className={cn(
              "text-sm font-semibold text-center",
              value === college.id ? "text-[#29385f]" : "text-gray-700"
            )}
          >
            {college.nombre}
          </span>
          {value === college.id && (
            <span className="text-xs text-[#29385f] font-medium">
              ✓ Seleccionado
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
