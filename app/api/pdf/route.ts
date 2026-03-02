import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
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

  // Use absolute filesystem paths for server-side image loading
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

  // renderToStream returns a Node.js ReadableStream
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await renderToStream(element as any);

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    (stream as unknown as NodeJS.ReadableStream).on("data", (chunk: Buffer) =>
      chunks.push(Buffer.from(chunk))
    );
    (stream as unknown as NodeJS.ReadableStream).on("end", resolve);
    (stream as unknown as NodeJS.ReadableStream).on("error", reject);
  });

  const buffer = Buffer.concat(chunks);
  const mesLabel = getMesLabel(minuta.mes);
  const fileName = `Minuta_${college.nombre.replace(/\s+/g, "_")}_${mesLabel}_${minuta.anio}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
