"use client";

import { useState, useEffect } from "react";
import { MinutaListItem, ColegioId, MESES } from "@/lib/types";
import { COLLEGES } from "@/lib/colleges";
import { MinutaCard } from "@/components/historial/MinutaCard";
import { Loader2, FileText, AlertTriangle } from "lucide-react";

export default function HistorialPage() {
  const [minutas, setMinutas] = useState<MinutaListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [filterColegio, setFilterColegio] = useState<ColegioId | "todos">("todos");
  const [filterAnio, setFilterAnio] = useState<number | "todos">("todos");

  const now = new Date();
  const anios = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setDbError(false);
      const params = new URLSearchParams();
      if (filterColegio !== "todos") params.set("colegio", filterColegio);
      if (filterAnio !== "todos") params.set("anio", String(filterAnio));

      try {
        const res = await fetch(`/api/minutas?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || data.error === "DB_ERROR") {
          setDbError(true);
          setMinutas([]);
        } else {
          setMinutas(Array.isArray(data) ? data : []);
        }
      } catch {
        setDbError(true);
        setMinutas([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filterColegio, filterAnio]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta minuta? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/minutas/${id}`, { method: "DELETE" });
    setMinutas((prev) => prev.filter((m) => m.id !== id));
  };

  const grouped = minutas.reduce<Record<string, MinutaListItem[]>>((acc, m) => {
    const key = `${m.anio}-${m.mes}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <a href="/editor" className="text-[#b8c1d7] hover:text-white transition-colors">
              Editor
            </a>
            <a href="/historial" className="text-white font-semibold border-b-2 border-[#95ccff] pb-0.5">
              Historial
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-[#29385f]">Historial de Minutas</h2>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterColegio}
              onChange={(e) => setFilterColegio(e.target.value as ColegioId | "todos")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#29385f]/30"
            >
              <option value="todos">Todos los colegios</option>
              {COLLEGES.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <select
              value={filterAnio}
              onChange={(e) =>
                setFilterAnio(e.target.value === "todos" ? "todos" : Number(e.target.value))
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#29385f]/30"
            >
              <option value="todos">Todos los años</option>
              {anios.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            Cargando historial...
          </div>
        ) : dbError ? (
          <div className="max-w-lg mx-auto mt-12">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
              <AlertTriangle className="mx-auto mb-4 text-amber-500" size={40} />
              <h3 className="font-bold text-lg text-amber-800 mb-2">
                Base de datos no conectada
              </h3>
              <p className="text-sm text-amber-700 mb-6 leading-relaxed">
                El historial requiere una base de datos Postgres en Vercel.
                Sigue estos pasos para activarla:
              </p>
              <ol className="text-left text-sm text-amber-800 space-y-3 mb-6">
                <li className="flex gap-2">
                  <span className="font-bold shrink-0">1.</span>
                  <span>Ve a tu proyecto en <strong>vercel.com</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold shrink-0">2.</span>
                  <span>Haz clic en <strong>Storage</strong> → <strong>Create Database</strong> → <strong>Postgres</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold shrink-0">3.</span>
                  <span>Vincula la DB al proyecto y espera que se agreguen las variables de entorno automáticamente</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold shrink-0">4.</span>
                  <span>En tu computador, copia las variables al archivo <code className="bg-amber-100 px-1 rounded">.env</code> y corre <code className="bg-amber-100 px-1 rounded">npm run db:push</code></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold shrink-0">5.</span>
                  <span>Vuelve a hacer deploy o espera el redeploy automático</span>
                </li>
              </ol>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#29385f] text-white rounded-lg text-sm font-medium hover:bg-[#1e2a47] transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : minutas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FileText size={48} className="mb-4 text-gray-300" />
            <p className="font-medium text-lg">No hay minutas guardadas</p>
            <p className="text-sm mt-1">
              <a href="/editor" className="text-[#29385f] underline">
                Crea tu primera minuta
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([key, items]) => {
                const [anio, mes] = key.split("-").map(Number);
                return (
                  <div key={key}>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {MESES[mes - 1]} {anio}
                    </h3>
                    <div className="space-y-3">
                      {items.map((m) => (
                        <MinutaCard key={m.id} minuta={m} onDelete={handleDelete} />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
