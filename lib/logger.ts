export function logInfo(message: string, details?: unknown) {
  console.info(`[film-forage] ${message}`, details ?? "");
}

export function logError(message: string, details?: unknown) {
  console.error(`[film-forage] ${message}`, details ?? "");
}
