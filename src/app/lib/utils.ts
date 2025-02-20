/**
 * Date型の日付をYYYY-MM-DD形式の文字列に変換する
 * @param date 
 * @returns 
 */
export function parseYYYYMMDD (date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
}