"use client";

import { useState } from "react";
import { Minuta } from "@/lib/types";
import { CollegeTemplate } from "@/lib/types";
import { getMesLabel } from "@/lib/calendar";
import { Download, Loader2 } from "lucide-react";

interface Props {
  minuta: Minuta;
  college: CollegeTemplate;
}

export function PDFDownloadButton({ minuta, college }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minuta }),
      });

      if (!res.ok) {
        alert("Error al generar el PDF. Intenta de nuevo.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const mesLabel = getMesLabel(minuta.mes);
      link.href = url;
      link.download = `Minuta_${college.nombre.replace(/\s+/g, "_")}_${mesLabel}_${minuta.anio}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al generar el PDF. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#29385f] text-white rounded-xl font-medium text-sm hover:bg-[#1e2a47] disabled:opacity-50 disabled:cursor-wait transition-colors shadow-sm"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
      {loading ? "Generando PDF..." : "Exportar PDF"}
    </button>
  );
}
