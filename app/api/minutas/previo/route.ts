import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/minutas/previo?colegio=tantauco&mes=3&anio=2026
// Returns the most recent previous minuta for the same college
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const colegio = searchParams.get("colegio");
  const mes = parseInt(searchParams.get("mes") || "0");
  const anio = parseInt(searchParams.get("anio") || "0");

  if (!colegio || !mes || !anio) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  // Find the most recent minuta before this month
  const previo = await prisma.minuta.findFirst({
    where: {
      colegio,
      OR: [
        { anio: { lt: anio } },
        { anio, mes: { lt: mes } },
      ],
    },
    orderBy: [{ anio: "desc" }, { mes: "desc" }],
  });

  if (!previo) return NextResponse.json(null);
  return NextResponse.json(previo);
}
