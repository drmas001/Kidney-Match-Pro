export interface DSAResult {
  detected: boolean;
  mfi?: number;
}

export function calculateDSAImpact(dsa: DSAResult): number {
  if (!dsa.detected) {
    return 20;
  }

  if (dsa.mfi && dsa.mfi < 1000) {
    return 10;
  }

  return 0;
}