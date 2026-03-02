import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import path from "path";
import { MinutaPDF } from "@/components/pdf/MinutaPDF";
import { getCollege } from "@/lib/colleges";
import { getMesLabel } from "@/lib/calendar";
import { Minuta } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body: { minuta: Minuta } = await req.json();
  const { minuta } = body;

  const college = getCollege(minuta.colegio);
  if (!college) {
    return NextResponse.json({ error: "Colegio no válido" }, { status: 400 });
  }

  const publicDir = path.join(process.cwd(), "public");
  const logoJohnsFoodSrc = path.join(publicDir, "logos", "johns-food.png");
  const logoCollegeSrc = path.join(
    publicDir,
    college.logoFile.replace(/^\//, "")
  );

  const element = createElement(MinutaPDF, {
    minuta,
    college,
    logoJohnsFoodSrc,
    logoCollegeSrc,
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any);
    const mesLabel = getMesLabel(minuta.mes);
    const fileName = `Minuta_${college.nombre.replace(/\s+/g, "_")}_${mesLabel}_${minuta.anio}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error("[POST /api/pdf] Error generating PDF:", err);
    return NextResponse.json(
      { error: "PDF_ERROR", message: String(err) },
      { status: 500 }
    );
  }
}
