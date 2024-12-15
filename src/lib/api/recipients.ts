import { supabase } from '@/lib/supabase';
import type { RecipientFormData } from '@/types/recipient';
import type { Recipient } from '@/types/matching';

export async function createRecipient(data: RecipientFormData) {
  try {
    // Transform the data to match database schema
    const recipientData = {
      mrn: data.mrn.trim(),
      national_id: data.nationalId.trim(),
      full_name: data.fullName.trim(),
      age: data.age,
      blood_type: data.bloodType,
      mobile_number: data.mobileNumber.trim(),
      hla_typing: {
        hla_a: data.hlaA.trim(),
        hla_b: data.hlaB.trim(),
        hla_c: data.hlaC.trim(),
        hla_dr: data.hlaDR.trim(),
        hla_dq: data.hlaDQ.trim(),
        hla_dp: data.hlaDP.trim(),
      },
      unacceptable_antigens: data.unacceptableAntigens?.trim() || '',
      pra: data.pra,
      crossmatch_requirement: data.crossmatchRequirement,
      donor_antibodies: data.donorAntibodies?.trim() || '',
      serum_creatinine: data.serumCreatinine,
      egfr: data.egfr,
      blood_pressure: data.bloodPressure.trim(),
      viral_screening: data.viralScreening.trim(),
      cmv_status: data.cmvStatus,
      medical_history: data.medicalHistory?.trim() || '',
      notes: data.notes?.trim() || '',
    };

    // Insert into database
    const { data: recipient, error } = await supabase
      .from('recipients')
      .insert([recipientData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    if (!recipient) {
      throw new Error('No data returned from insert operation');
    }

    return transformRecipientData(recipient);
  } catch (error) {
    console.error('Error in createRecipient:', error);
    throw error;
  }
}

export async function getRecipients() {
  const { data: recipients, error } = await supabase
    .from('recipients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return recipients.map(transformRecipientData);
}

export async function getRecipient(id: string) {
  const { data: recipient, error } = await supabase
    .from('recipients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return transformRecipientData(recipient);
}

export async function updateRecipient(id: string, data: Partial<RecipientFormData>) {
  const { data: recipient, error } = await supabase
    .from('recipients')
    .update({
      mrn: data.mrn,
      national_id: data.nationalId,
      full_name: data.fullName,
      age: data.age,
      blood_type: data.bloodType,
      mobile_number: data.mobileNumber,
      hla_typing: data.hlaA && data.hlaB && data.hlaC && data.hlaDR && data.hlaDQ && data.hlaDP ? {
        hla_a: data.hlaA,
        hla_b: data.hlaB,
        hla_c: data.hlaC,
        hla_dr: data.hlaDR,
        hla_dq: data.hlaDQ,
        hla_dp: data.hlaDP,
      } : undefined,
      unacceptable_antigens: data.unacceptableAntigens,
      pra: data.pra,
      crossmatch_requirement: data.crossmatchRequirement,
      donor_antibodies: data.donorAntibodies,
      serum_creatinine: data.serumCreatinine,
      egfr: data.egfr,
      blood_pressure: data.bloodPressure,
      viral_screening: data.viralScreening,
      cmv_status: data.cmvStatus,
      medical_history: data.medicalHistory,
      notes: data.notes,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return transformRecipientData(recipient);
}

export async function deleteRecipient(id: string) {
  const { error } = await supabase
    .from('recipients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Helper function to transform database recipient data to match the Recipient type
function transformRecipientData(data: any): Recipient {
  return {
    id: data.id,
    mrn: data.mrn,
    nationalId: data.national_id,
    fullName: data.full_name,
    bloodType: data.blood_type,
    hlaTyping: {
      hlaA: data.hla_typing?.hla_a || '',
      hlaB: data.hla_typing?.hla_b || '',
      hlaC: data.hla_typing?.hla_c || '',
      hlaDR: data.hla_typing?.hla_dr || '',
      hlaDQ: data.hla_typing?.hla_dq || '',
      hlaDP: data.hla_typing?.hla_dp || '',
    },
    pra: data.pra,
    crossmatchRequirement: data.crossmatch_requirement,
    viralScreening: data.viral_screening,
    cmvStatus: data.cmv_status,
  };
}