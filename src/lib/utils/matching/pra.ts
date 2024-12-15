export function calculatePRAImpact(pra: number): number {
  if (pra < 20) {
    return 10;
  } else if (pra <= 50) {
    return 5;
  }
  return 0;
}