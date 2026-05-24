export function parseCustomProducts(
  ingredients: string | undefined | null
): string[] {
  if (!ingredients?.trim()) return [];

  return ingredients
    .trim()
    .split(/\s+/)
    .filter((item) => item.length > 0);
}
