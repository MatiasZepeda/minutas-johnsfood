"use client";

import { useState } from "react";
import { TextosPie } from "@/lib/types";
import { Pencil, Check } from "lucide-react";

interface Props {
  textosPie: TextosPie;
  hasVegetariano: boolean;
  onChange: (textosPie: TextosPie) => void;
}

type FieldKey = keyof TextosPie;

const FIELD_LABELS: Partial<Record<FieldKey, string>> = {
  observacionesGenerales: "Encabezado observaciones",
  menuPrincipal: "Menú Principal",
  menuHipocalorico: "Menú Hipocalórico",
  menuVegetariano: "Menú Vegetariano",
  valores: "Valores",
  pagos: "Pagos",
  contacto: "Contacto",
  inasistencias: "Inasistencias",
  cambios: "Cambios / Nota final",
};

export function FooterEditor({ textosPie, hasVegetariano, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TextosPie>(textosPie);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(textosPie);
    setEditing(false);
  };

  const keys = (Object.keys(FIELD_LABELS) as FieldKey[]).filter(
    (k) => k !== "menuVegetariano" || hasVegetariano
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#29385f]">
        <span className="text-white font-semibold text-sm">
          Observaciones y pie de página
        </span>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Pencil size={12} />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-400 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Check size={12} />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 space-y-3">
        {keys.map((key) => (
          <div key={key}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              {FIELD_LABELS[key]}
            </label>
            {editing ? (
              <textarea
                value={draft[key] || ""}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, [key]: e.target.value }))
                }
                rows={2}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#29385f]/30 focus:border-[#29385f] resize-none"
              />
            ) : (
              <p className="text-xs text-gray-600 leading-relaxed">
                {textosPie[key] || "—"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
