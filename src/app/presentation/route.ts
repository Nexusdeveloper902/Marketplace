import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  try {
    const file = await readFile(
      join(process.cwd(), "public", "presentation.html"),
      "utf8"
    );
    return new Response(file, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Presentation not found", { status: 404 });
  }
}
