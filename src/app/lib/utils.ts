export function parseYYYYMMDD (date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
}