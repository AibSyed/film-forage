import { pickRequestSchema } from "@/features/picker/contracts";
import { pickMovies } from "@/lib/tmdb/picker";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = pickRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "invalid_payload", message: "Expected a valid picker request body." }, { status: 400 });
  }

  const payload = await pickMovies(parsed.data);
  return Response.json(payload, { status: 200 });
}
