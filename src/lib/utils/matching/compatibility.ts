export function calculateCompatibilityScore(
  bloodTypeMatch: boolean,
  hlaMatches: number,
  crossmatchCompatible: boolean
): number {
  let score = 0;

  // Blood type compatibility (20% of total score)
  if (bloodTypeMatch) {
    score += 20;
  }

  // HLA matches (50% of total score)
  score += (hlaMatches / 6) * 50;

  // Crossmatch compatibility (30% of total score)
  if (crossmatchCompatible) {
    score += 30;
  }

  return score / 100;
}

export function getExclusionReason(
  bloodTypeMatch: boolean,
  crossmatchCompatible: boolean
): string | undefined {
  if (!bloodTypeMatch) {
    return "Blood type not compatible";
  }
  if (!crossmatchCompatible) {
    return "Crossmatch not compatible";
  }
  return undefined;
}