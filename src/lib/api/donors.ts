import { supabase } from '@/lib/supabase';
import type { DonorFormData } from '@/types/donor';
import type { Donor } from '@/types/matching';

export async function createDonor(data: DonorFormData) {
  try {
    const { data: donor, error } = await supabase.from('donors').insert([{
      mrn: data.mrn.toUpperCase(),
      national_id: data.nationalId.toUpperCase(),
      full_name: data.fullName,
      age: data.age,
      blood_type: data.bloodType,
      mobile_number: data.mobileNumber,
      hla_typing: {
        hla_a: data.hlaA,
        hla_b: data.hlaB,
        hla_c: data.hlaC,
        hla_dr: data.hlaDR,
        hla_dq: data.hlaDQ,
        hla_dp: data.hlaDP,
      },
      high_res_typing: data.highResTyping,
      donor_antibodies: data.donorAntibodies,
      antigen_mismatch: data.antigenMismatch,
      crossmatch_result: data.crossmatchResult,
      serum_creatinine: data.serumCreatinine,
      egfr: data.egfr,
      blood_pressure: data.bloodPressure,
      viral_screening: data.viralScreening,
      cmv_status: data.cmvStatus,
      medical_conditions: data.medicalConditions,
      notes: data.notes,
      status: 'Available',
    }]).select().single();

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('national_id')) {
          throw new Error('A donor with this National ID already exists');
        } else if (error.message.includes('mrn')) {
          throw new Error('A donor with this MRN already exists');
        }
      }
      throw error;
    }

    return transformDonorData(donor);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create donor');
  }
}

export async function getDonors() {
  const { data: donors, error } = await supabase
    .from('donors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return donors.map(transformDonorData);
}

export async function getDonor(id: string) {
  const { data: donor, error } = await supabase
    .from('donors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return transformDonorData(donor);
}

export async function updateDonor(id: string, data: Partial<DonorFormData>) {
  try {
    // Transform the data to match database schema
    const donorData = {
      mrn: data.mrn?.trim().toUpperCase(),
      national_id: data.nationalId?.trim().toUpperCase(),
      full_name: data.fullName?.trim(),
      age: data.age || 0,
      blood_type: data.bloodType,
      mobile_number: data.mobileNumber?.trim(),
      hla_typing: {
        hla_a: data.hlaA?.trim() || '',
        hla_b: data.hlaB?.trim() || '',
        hla_c: data.hlaC?.trim() || '',
        hla_dr: data.hlaDR?.trim() || '',
        hla_dq: data.hlaDQ?.trim() || '',
        hla_dp: data.hlaDP?.trim() || '',
      },
      high_res_typing: data.highResTyping?.trim() || '',
      donor_antibodies: data.donorAntibodies?.trim() || '',
      antigen_mismatch: data.antigenMismatch || 0,
      crossmatch_result: data.crossmatchResult,
      serum_creatinine: data.serumCreatinine || 0,
      egfr: data.egfr || 0,
      blood_pressure: data.bloodPressure?.trim() || '',
      viral_screening: data.viralScreening?.trim() || '',
      cmv_status: data.cmvStatus,
      medical_conditions: data.medicalConditions?.trim() || '',
      notes: data.notes?.trim() || '',
    };

    const { data: donor, error } = await supabase
      .from('donors')
      .update(donorData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('national_id')) {
          throw new Error('A donor with this National ID already exists');
        } else if (error.message.includes('mrn')) {
          throw new Error('A donor with this MRN already exists');
        }
      }
      throw error;
    }

    if (!donor) {
      throw new Error('Failed to update donor');
    }

    return transformDonorData(donor);
  } catch (error) {
    console.error('Error updating donor:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update donor');
  }
}

export async function deleteDonor(id: string) {
  const { error } = await supabase
    .from('donors')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateDonorStatus(id: string, status: 'Available' | 'Utilized') {
  const { error } = await supabase
    .from('donors')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

// Helper function to transform database donor data to match the Donor type
function transformDonorData(data: any): Donor & { status: 'Available' | 'Utilized' } {
  return {
    id: data.id,
    mrn: data.mrn,
    nationalId: data.national_id,
    fullName: data.full_name,
    age: data.age,
    bloodType: data.blood_type,
    mobileNumber: data.mobile_number,
    hlaTyping: {
      hlaA: data.hla_typing?.hla_a || '',
      hlaB: data.hla_typing?.hla_b || '',
      hlaC: data.hla_typing?.hla_c || '',
      hlaDR: data.hla_typing?.hla_dr || '',
      hlaDQ: data.hla_typing?.hla_dq || '',
      hlaDP: data.hla_typing?.hla_dp || '',
    },
    crossmatchResult: data.crossmatch_result,
    donorAntibodies: data.donor_antibodies || '',
    serumCreatinine: data.serum_creatinine || 0,
    egfr: data.egfr || 0,
    bloodPressure: data.blood_pressure || 'N/A',
    viralScreening: data.viral_screening || '',
    cmvStatus: data.cmv_status || '',
    medicalConditions: data.medical_conditions || '',
    notes: data.notes || '',
    highResTyping: data.high_res_typing || '',
    antigenMismatch: data.antigen_mismatch || 0,
    dsaResult: {
      detected: false,
    },
    status: data.status
  };
}