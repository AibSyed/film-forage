export async function fetchWithTimeout(input: string, init: RequestInit = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal, cache: "no-store" });
    return response;
  } finally {
    clearTimeout(id);
  }
}
