import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCollege } from "@/lib/colleges";
import { CreateMinutaInput } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const colegio = searchParams.get("colegio");
  const anio = searchParams.get("anio");

  const where: Record<string, unknown> = {};
  if (colegio) where.colegio = colegio;
  if (anio) where.anio = parseInt(anio);

  try {
    const minutas = await prisma.minuta.findMany({
      where,
      orderBy: [{ anio: "desc" }, { mes: "desc" }],
      select: {
        id: true,
        colegio: true,
        mes: true,
        anio: true,
        creadoEn: true,
        editadoEn: true,
      },
    });
    return NextResponse.json(minutas);
  } catch (err) {
    console.error("[GET /api/minutas]", err);
    return NextResponse.json(
      { error: "DB_ERROR", message: "No se pudo conectar a la base de datos." },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body: CreateMinutaInput = await req.json();
  const { colegio, mes, anio, dias, textosPie } = body;

  if (!getCollege(colegio)) {
    return NextResponse.json({ error: "Colegio no válido" }, { status: 400 });
  }

  try {
    const existing = await prisma.minuta.findUnique({
      where: { colegio_mes_anio: { colegio, mes, anio } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una minuta para este colegio y mes" },
        { status: 409 }
      );
    }

    const minuta = await prisma.minuta.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { colegio, mes, anio, dias: dias as any, textosPie: textosPie as any },
    });

    return NextResponse.json(minuta, { status: 201 });
  } catch (err) {
    console.error("[POST /api/minutas]", err);
    return NextResponse.json(
      { error: "DB_ERROR", message: "No se pudo guardar la minuta." },
      { status: 503 }
    );
  }
}
