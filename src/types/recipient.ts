export interface RecipientFormData {
  // Personal Information
  mrn: string;
  nationalId: string;
  fullName: string;
  age: number;
  bloodType: string;
  mobileNumber: string;

  // HLA Typing Requirements
  hlaA: string;
  hlaB: string;
  hlaC: string;
  hlaDR: string;
  hlaDQ: string;
  hlaDP: string;
  unacceptableAntigens: string;
  pra: number;
  crossmatchRequirement: string;
  donorAntibodies: string;

  // Medical Information
  serumCreatinine: number;
  egfr: number;
  bloodPressure: string;
  viralScreening: string;
  cmvStatus: string;

  // Additional Details
  medicalHistory: string;
  notes: string;
}