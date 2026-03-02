"use client";

import { MinutaListItem, MESES } from "@/lib/types";
import { getCollege } from "@/lib/colleges";
import { Eye, Download, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  minuta: MinutaListItem;
  onDelete: (id: string) => void;
}

export function MinutaCard({ minuta, onDelete }: Props) {
  const college = getCollege(minuta.colegio);
  if (!college) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <Image
          src={college.logoFile}
          alt={college.nombre}
          width={48}
          height={48}
          className="max-h-12 max-w-12 object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#29385f] text-sm truncate">{college.nombre}</p>
        <p className="text-gray-500 text-xs mt-0.5">
          {MESES[minuta.mes - 1]} {minuta.anio}
        </p>
        <p className="text-gray-400 text-xs">
          Editado el {new Date(minuta.editadoEn).toLocaleDateString("es-CL")}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/editor?id=${minuta.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#29385f] text-[#29385f] rounded-lg text-xs font-medium hover:bg-[#29385f]/5 transition-colors"
        >
          <Eye size={12} />
          Abrir
        </Link>
        <button
          onClick={() => onDelete(minuta.id)}
          className="flex items-center gap-1 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
