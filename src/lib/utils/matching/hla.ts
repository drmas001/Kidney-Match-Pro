import { HLATyping } from '@/types/matching';

const HLA_WEIGHTS = {
  exact: 10,
  partial: 5,
};

export function calculateHLACompatibility(
  recipientHLA: HLATyping,
  donorHLA: HLATyping
): number {
  let totalScore = 0;
  let totalPossibleScore = 0;

  // Compare each HLA type
  for (const type of ['A', 'B', 'C', 'DR', 'DQ', 'DP'] as const) {
    const key = `hla${type}` as keyof HLATyping;
    const recipientAlleles = parseHLAAlleles(recipientHLA[key]);
    const donorAlleles = parseHLAAlleles(donorHLA[key]);

    // Each HLA type can have two alleles
    totalPossibleScore += 2 * HLA_WEIGHTS.exact;

    // Check for exact matches
    for (const recipientAllele of recipientAlleles) {
      if (donorAlleles.includes(recipientAllele)) {
        totalScore += HLA_WEIGHTS.exact;
      }
    }
  }

  // Return normalized score (0-1)
  return totalScore / totalPossibleScore;
}

function parseHLAAlleles(hlaString: string): string[] {
  return hlaString.split(',').map(allele => allele.trim());
}