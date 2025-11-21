export function formatDate(date?: Date | string): string {
  if (!date) return '—'

  const newDate = date instanceof Date ? date : new Date(date)
  return newDate.toLocaleString()
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
