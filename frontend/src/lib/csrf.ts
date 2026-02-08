export function getCsrfToken(): string | null {
  const meta = document.querySelector(
    'meta[name="csrf-token"]'
  ) as HTMLMetaElement | null

  return meta?.content ?? null
}