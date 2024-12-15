export interface DonorFormData {
  // Personal Information
  mrn: string;
  nationalId: string;
  fullName: string;
  age: number;
  bloodType: string;
  mobileNumber: string;

  // HLA Typing
  hlaA: string;
  hlaB: string;
  hlaC: string;
  hlaDR: string;
  hlaDQ: string;
  hlaDP: string;
  highResTyping: string;
  donorAntibodies: string;
  antigenMismatch: number;
  crossmatchResult: string;

  // Medical Tests
  serumCreatinine: number;
  egfr: number;
  bloodPressure: string;
  viralScreening: string;
  cmvStatus: string;

  // Additional Information
  medicalConditions: string;
  notes: string;
}