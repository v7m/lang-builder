export function buildCssSelector(...parts: string[]): string {
  return parts.join(' > ');
}
