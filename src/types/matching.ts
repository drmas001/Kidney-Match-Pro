export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export interface HLATyping {
  hlaA: string;
  hlaB: string;
  hlaC: string;
  hlaDR: string;
  hlaDQ: string;
  hlaDP: string;
}

export interface DSAResult {
  detected: boolean;
  mfi?: number;
}

export interface Recipient {
  id: string;
  mrn: string;
  nationalId: string;
  fullName: string;
  age: number;
  bloodType: string;
  mobileNumber: string;
  hlaTyping: HLATyping;
  pra: number;
  crossmatchRequirement: string;
  viralScreening: string;
  cmvStatus: string;
  unacceptableAntigens: string;
  donorAntibodies: string;
  medicalHistory: string;
  notes: string;
  serumCreatinine: number;
  egfr: number;
  bloodPressure: string;
}

export interface Donor {
  id: string;
  mrn: string;
  nationalId: string;
  fullName: string;
  age: number;
  bloodType: string;
  mobileNumber: string;
  hlaTyping: HLATyping;
  crossmatchResult: string;
  donorAntibodies: string;
  serumCreatinine: number;
  egfr: number;
  bloodPressure: string;
  viralScreening: string;
  cmvStatus: string;
  medicalConditions: string;
  notes: string;
  highResTyping: string;
  antigenMismatch: number;
  dsaResult: DSAResult;
  status: 'Available' | 'Utilized';
}

export interface MatchingResult {
  donor: Donor;
  compatibilityScore: number;
  matchDetails: {
    bloodTypeMatch: boolean;
    hlaMatches: number;
    crossmatchCompatible: boolean;
  };
}