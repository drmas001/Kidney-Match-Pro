import { BloodType } from '@/types/matching';

const BLOOD_TYPE_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-','O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
} as const;

export function isBloodTypeCompatible(
  donorType: BloodType,
  recipientType: BloodType
): boolean {
  // Special case for O- donors
  if (donorType === 'O-') {
    return true; // O- can donate to all blood types
  }
  return BLOOD_TYPE_COMPATIBILITY[donorType]?.includes(recipientType) || false;
}