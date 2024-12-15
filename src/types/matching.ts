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
  bloodType: BloodType;
  hlaTyping: HLATyping;
  pra: number;
  crossmatchRequirement: string;
  viralScreening: string;
  cmvStatus: string;
}

export interface Donor {
  id: string;
  fullName: string;
  bloodType: BloodType;
  hlaTyping: HLATyping;
  crossmatchResult: string;
  dsaResult: DSAResult;
  serumCreatinine: number;
  egfr: number;
  viralScreening: string;
  cmvStatus: string;
  compatibilityScore?: number;
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