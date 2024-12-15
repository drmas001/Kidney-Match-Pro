import * as z from 'zod';

export const recipientSchema = z.object({
  // Personal Information
  mrn: z.string().min(1, 'MRN is required'),
  nationalId: z.string().min(1, 'National ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  age: z.number().min(0, 'Age is required'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    required_error: 'Blood type is required',
  }),
  mobileNumber: z.string().min(1, 'Mobile number is required'),

  // HLA Typing Requirements
  hlaA: z.string().min(1, 'HLA-A typing is required'),
  hlaB: z.string().min(1, 'HLA-B typing is required'),
  hlaC: z.string().min(1, 'HLA-C typing is required'),
  hlaDR: z.string().min(1, 'HLA-DR typing is required'),
  hlaDQ: z.string().min(1, 'HLA-DQ typing is required'),
  hlaDP: z.string().min(1, 'HLA-DP typing is required'),
  unacceptableAntigens: z.string().optional().default(''),
  pra: z.number().min(0).max(100, 'PRA must be between 0 and 100'),
  crossmatchRequirement: z.enum(['Positive', 'Negative'], {
    required_error: 'Crossmatch requirement is required',
  }),
  donorAntibodies: z.string().optional().default(''),

  // Medical Information
  serumCreatinine: z.number().positive('Must be a positive number'),
  egfr: z.number().positive('Must be a positive number'),
  bloodPressure: z.string().min(1, 'Blood pressure is required'),
  viralScreening: z.string().min(1, 'Viral screening results are required'),
  cmvStatus: z.enum(['Positive', 'Negative'], {
    required_error: 'CMV status is required',
  }),

  // Additional Details
  medicalHistory: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});