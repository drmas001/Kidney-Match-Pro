import * as z from 'zod';

export const donorSchema = z.object({
  // Personal Information
  mrn: z.string()
    .min(1, 'MRN is required')
    .regex(/^[A-Z0-9-]+$/, 'MRN must contain only uppercase letters, numbers, and hyphens'),
  nationalId: z.string()
    .min(1, 'National ID is required')
    .regex(/^[A-Z0-9-]+$/, 'National ID must contain only uppercase letters, numbers, and hyphens'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  age: z.number()
    .min(18, 'Must be at least 18 years old')
    .max(90, 'Age must be less than 80'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    required_error: 'Blood type is required',
  }),
  mobileNumber: z.string()
    .min(1, 'Mobile number is required')
    .regex(/^\+?[0-9\s-]+$/, 'Invalid mobile number format'),

  // HLA Typing
  hlaA: z.string().min(1, 'HLA-A typing is required'),
  hlaB: z.string().min(1, 'HLA-B typing is required'),
  hlaC: z.string().min(1, 'HLA-C typing is required'),
  hlaDR: z.string().min(1, 'HLA-DR typing is required'),
  hlaDQ: z.string().min(1, 'HLA-DQ typing is required'),
  hlaDP: z.string().min(1, 'HLA-DP typing is required'),
  highResTyping: z.string().optional(),
  donorAntibodies: z.string().optional(),
  antigenMismatch: z.number().min(0),
  crossmatchResult: z.enum(['Positive', 'Negative'], {
    required_error: 'Crossmatch result is required',
  }),

  // Medical Tests
  serumCreatinine: z.number()
    .positive('Must be a positive number')
    .max(15, 'Value seems too high'),
  egfr: z.number()
    .positive('Must be a positive number')
    .max(200, 'Value seems too high'),
  bloodPressure: z.string()
    .min(1, 'Blood pressure is required')
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Must be in format 120/80'),
  viralScreening: z.string().min(1, 'Viral screening results are required'),
  cmvStatus: z.enum(['Positive', 'Negative'], {
    required_error: 'CMV status is required',
  }),

  // Additional Information
  medicalConditions: z.string().optional(),
  notes: z.string().optional(),
});