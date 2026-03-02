"use client";

import { useState, useEffect, useCallback } from "react";
import { CollegeSelector } from "@/components/editor/CollegeSelector";
import { MonthPicker } from "@/components/editor/MonthPicker";
import { DuplicatePrompt } from "@/components/editor/DuplicatePrompt";
import { WeekGrid } from "@/components/editor/WeekGrid";
import { FooterEditor } from "@/components/editor/FooterEditor";
import { PDFDownloadButton } from "@/components/pdf/PDFDownloadButton";
import { getCollege } from "@/lib/colleges";
import { getBusinessWeeks } from "@/lib/calendar";
import {
  ColegioId,
  DiaData,
  Minuta,
  MenuRow,
  TextosPie,
  MESES,
} from "@/lib/types";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function EditorPage() {
  const now = new Date();
  const [colegio, setColegio] = useState<ColegioId | null>(null);
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [anio, setAnio] = useState(now.getFullYear());
  const [dias, setDias] = useState<Record<string, DiaData>>({});
  const [textosPie, setTextosPie] = useState<TextosPie | null>(null);
  const [currentMinuta, setCurrentMinuta] = useState<Minuta | null>(null);
  const [previoMinuta, setPrevioMinuta] = useState<Minuta | null>(null);
  const [showDuplicatePrompt, setShowDuplicatePrompt] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loadingMinuta, setLoadingMinuta] = useState(false);

  const college = colegio ? getCollege(colegio) : null;

  // When college changes, immediately pre-load its template textos
  // so the PDF button is always available even before the async API call resolves
  const handleCollegeChange = (id: ColegioId) => {
    const tmpl = getCollege(id);
    if (tmpl) setTextosPie(tmpl.textosPie);
    setDias({});
    setCurrentMinuta(null);
    setColegio(id);
  };

  // Load existing minuta and check for previous one when colegio/mes/anio changes
  useEffect(() => {
    if (!colegio) return;

    const loadData = async () => {
      setLoadingMinuta(true);
      setCurrentMinuta(null);
      setPrevioMinuta(null);
      setShowDuplicatePrompt(false);

      try {
        const res = await fetch(`/api/minutas?colegio=${colegio}&anio=${anio}`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const list: Minuta[] = await res.json();
        const existing = list.find((m) => m.mes === mes && m.anio === anio);

        if (existing) {
          setCurrentMinuta(existing);
          setDias(existing.dias as Record<string, DiaData>);
          setTextosPie(existing.textosPie as TextosPie);
        } else {
          // No saved minuta — reset dias but keep template textosPie
          setDias({});

          // Check for a previous minuta to offer duplication
          try {
            const prevRes = await fetch(
              `/api/minutas/previo?colegio=${colegio}&mes=${mes}&anio=${anio}`
            );
            if (prevRes.ok) {
              const prev = await prevRes.json();
              if (prev) {
                setPrevioMinuta(prev);
                setShowDuplicatePrompt(true);
              }
            }
          } catch {
            // previo is optional, ignore errors
          }
        }
      } catch {
        // API unavailable — keep the template textosPie that was set synchronously
        setDias({});
      } finally {
        setLoadingMinuta(false);
      }
    };

    loadData();
  }, [colegio, mes, anio]);

  const handleDuplicar = () => {
    if (!previoMinuta) return;
    setDias(previoMinuta.dias as Record<string, DiaData>);
    setShowDuplicatePrompt(false);
  };

  const handleSkipDuplicate = () => {
    setShowDuplicatePrompt(false);
  };

  const handleChangeDia = useCallback(
    (isoDate: string, row: MenuRow, value: string) => {
      setDias((prev) => ({
        ...prev,
        [isoDate]: { ...prev[isoDate], [row]: value },
      }));
    },
    []
  );

  const handleSave = async () => {
    if (!colegio || !textosPie) return;
    setSaveStatus("saving");

    try {
      if (currentMinuta) {
        // Update existing
        const res = await fetch(`/api/minutas/${currentMinuta.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dias, textosPie }),
        });
        if (!res.ok) throw new Error("Error al guardar");
        const updated = await res.json();
        setCurrentMinuta(updated);
      } else {
        // Create new
        const res = await fetch("/api/minutas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ colegio, mes, anio, dias, textosPie }),
        });
        if (!res.ok) throw new Error("Error al crear");
        const created = await res.json();
        setCurrentMinuta(created);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const weeks = college ? getBusinessWeeks(anio, mes) : [];

  const ministaForPDF: Minuta | null =
    college && textosPie
      ? {
          id: currentMinuta?.id || "preview",
          colegio: colegio!,
          mes,
          anio,
          dias,
          textosPie,
          creadoEn: new Date().toISOString(),
          editadoEn: new Date().toISOString(),
        }
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-[#29385f] text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/johns-food.png" alt="John's Food" className="h-10 object-contain" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Creador de Minutas</h1>
              <p className="text-[#95ccff] text-xs">John&apos;s Food — Gastronomía y Eventos</p>
            </div>
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="/editor" className="text-white font-semibold border-b-2 border-[#95ccff] pb-0.5">
              Editor
            </a>
            <a href="/historial" className="text-[#b8c1d7] hover:text-white transition-colors">
              Historial
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Step 1: College */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            1. Selecciona el colegio
          </h2>
          <CollegeSelector value={colegio} onChange={handleCollegeChange} />
        </section>

        {colegio && (
          <>
            {/* Step 2: Month */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                2. Mes y año
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <MonthPicker
                  mes={mes}
                  anio={anio}
                  onChangeMes={setMes}
                  onChangeAnio={setAnio}
                />
                {currentMinuta && (
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
                    ✓ Minuta guardada — última edición{" "}
                    {new Date(currentMinuta.editadoEn).toLocaleDateString("es-CL")}
                  </span>
                )}
              </div>
            </section>

            {/* Duplicate prompt */}
            {showDuplicatePrompt && previoMinuta && (
              <DuplicatePrompt
                previoMinuta={previoMinuta}
                onDuplicate={handleDuplicar}
                onSkip={handleSkipDuplicate}
              />
            )}

            {/* Step 3: Grid */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  3. Platos del mes — {MESES[mes - 1]} {anio}
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400">
                    {college?.menuRows.length} menús variables · {weeks.reduce((a, w) => a + w.days.length, 0)} días hábiles
                  </p>
                  {ministaForPDF && college && (
                    <PDFDownloadButton minuta={ministaForPDF} college={college} />
                  )}
                </div>
              </div>

              {loadingMinuta ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Cargando...
                </div>
              ) : (
                <WeekGrid
                  weeks={weeks}
                  menuRows={college!.menuRows}
                  dias={dias}
                  onChangeDia={handleChangeDia}
                />
              )}
            </section>

            {/* Step 4: Footer */}
            {textosPie && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  4. Pie de página
                </h2>
                <FooterEditor
                  textosPie={textosPie}
                  hasVegetariano={college!.menuRows.includes("vegetariano")}
                  onChange={setTextosPie}
                />
              </section>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-4 pb-8">
              {/* Save status */}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  Guardado
                </span>
              )}
              {saveStatus === "error" && (
                <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                  <AlertCircle size={16} />
                  Error al guardar
                </span>
              )}

              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#29385f] text-[#29385f] rounded-xl font-medium text-sm hover:bg-[#29385f]/5 disabled:opacity-50 transition-colors"
              >
                {saveStatus === "saving" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saveStatus === "saving" ? "Guardando..." : "Guardar"}
              </button>

              {ministaForPDF && college && (
                <PDFDownloadButton minuta={ministaForPDF} college={college} />
              )}
            </div>
          </>
        )}

        {!colegio && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">Selecciona un colegio para comenzar</p>
            <p className="text-sm mt-1">Luego podrás ingresar los platos del mes y exportar el PDF</p>
          </div>
        )}
      </main>
    </div>
  );
}
