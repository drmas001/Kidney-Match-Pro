import { BloodType } from '@/types/matching';

const BLOOD_TYPE_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
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
  return BLOOD_TYPE_COMPATIBILITY[donorType]?.includes(recipientType) || false;
}