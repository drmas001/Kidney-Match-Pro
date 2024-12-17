import type { Donor, Recipient } from '@/types/matching';

export function calculateCompatibilityScore(donor: Donor, recipient: Recipient): number {
  // Blood type compatibility check
  if (!isBloodTypeCompatible(donor.bloodType, recipient.bloodType)) {
    return 0;
  }

  // HLA matching score (simplified version)
  const hlaScore = calculateHLAScore(donor.hlaTyping, recipient.hlaTyping);
  
  // Crossmatch compatibility
  if (donor.crossmatchResult !== recipient.crossmatchRequirement) {
    return 0;
  }

  // PRA impact
  const praFactor = (100 - recipient.pra) / 100;

  // Final score calculation
  return Math.round((hlaScore * praFactor) * 100) / 100;
}

function isBloodTypeCompatible(donorType: string, recipientType: string): boolean {
  // Special case for O- donors
  if (donorType === 'O-') {
    return true; // O- can donate to all blood types
  }

  const compatibility: Record<string, string[]> = {
    'O-': ['O-'],
    'O+': ['O-','O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
  };

  return compatibility[donorType]?.includes(recipientType) || false;
}

function calculateHLAScore(
  donorHLA: Recipient['hlaTyping'],
  recipientHLA: Recipient['hlaTyping']
): number {
  let matches = 0;
  const totalAntigens = 12; // 2 alleles each for A, B, C, DR, DQ, DP

  // Compare each HLA type
  matches += compareHLAAlleles(donorHLA.hlaA, recipientHLA.hlaA);
  matches += compareHLAAlleles(donorHLA.hlaB, recipientHLA.hlaB);
  matches += compareHLAAlleles(donorHLA.hlaC, recipientHLA.hlaC);
  matches += compareHLAAlleles(donorHLA.hlaDR, recipientHLA.hlaDR);
  matches += compareHLAAlleles(donorHLA.hlaDQ, recipientHLA.hlaDQ);
  matches += compareHLAAlleles(donorHLA.hlaDP, recipientHLA.hlaDP);

  return matches / totalAntigens;
}

function compareHLAAlleles(donorAlleles: string, recipientAlleles: string): number {
  const donorSet = new Set(donorAlleles.split(',').map(a => a.trim()));
  const recipientSet = new Set(recipientAlleles.split(',').map(a => a.trim()));
  
  let matches = 0;
  for (const allele of donorSet) {
    if (recipientSet.has(allele)) {
      matches++;
    }
  }
  
  return matches;
}