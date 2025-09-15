import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text.trim() });
  } catch (err: any) {
    console.error("PDF parse error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
