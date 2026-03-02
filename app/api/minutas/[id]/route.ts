import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const minuta = await prisma.minuta.findUnique({ where: { id } });
  if (!minuta) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(minuta);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { dias, textosPie } = body;

  const minuta = await prisma.minuta.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { dias: dias as any, textosPie: textosPie as any },
  });
  return NextResponse.json(minuta);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.minuta.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
