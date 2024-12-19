import { supabase } from '@/lib/supabase';

export async function createMatchingResult(data: {
  recipient_id: string;
  donor_id: string;
  compatibility_score: number;
  match_details: {
    blood_type_match: boolean;
    hla_matches: number;
    crossmatch_compatible: boolean;
  };
}) {
  const { data: result, error } = await supabase.from('matching_results').insert([{
    recipient_id: data.recipient_id,
    donor_id: data.donor_id,
    compatibility_score: data.compatibility_score,
    match_details: {
      blood_type_match: data.match_details.blood_type_match,
      hla_matches: data.match_details.hla_matches,
      crossmatch_compatible: data.match_details.crossmatch_compatible,
    },
    status: 'Pending',
  }]).select().single();

  if (error) throw error;
  return result;
}

export async function getMatchingResults(recipientId: string) {
  const { data: results, error } = await supabase
    .from('matching_results')
    .select(`
      *,
      donor:donors(*),
      recipient:recipients(*)
    `)
    .eq('recipient_id', recipientId)
    .order('compatibility_score', { ascending: false });

  if (error) throw error;
  return results;
}

export async function updateMatchingResultStatus(
  id: string,
  status: 'Approved' | 'Rejected'
) {
  const { error } = await supabase
    .from('matching_results')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

function transformRecipientData(recipientData: any) {
  return {
    id: recipientData.id,
    mrn: recipientData.mrn,
    nationalId: recipientData.national_id,
    fullName: recipientData.full_name,
    age: recipientData.age,
    bloodType: recipientData.blood_type,
    mobileNumber: recipientData.mobile_number,
    hlaTyping: {
      hlaA: recipientData.hla_typing?.hla_a || '',
      hlaB: recipientData.hla_typing?.hla_b || '',
      hlaC: recipientData.hla_typing?.hla_c || '',
      hlaDR: recipientData.hla_typing?.hla_dr || '',
      hlaDQ: recipientData.hla_typing?.hla_dq || '',
      hlaDP: recipientData.hla_typing?.hla_dp || ''
    },
    pra: recipientData.pra || 0,
    crossmatchRequirement: recipientData.crossmatch_requirement,
    viralScreening: recipientData.viral_screening,
    cmvStatus: recipientData.cmv_status,
    unacceptableAntigens: recipientData.unacceptable_antigens || '',
    donorAntibodies: recipientData.donor_antibodies || '',
    medicalHistory: recipientData.medical_history || '',
    notes: recipientData.notes || '',
    serumCreatinine: recipientData.serum_creatinine || 0,
    egfr: recipientData.egfr || 0,
    bloodPressure: recipientData.blood_pressure || 'N/A'
  };
}

function transformDonorData(donorData: any) {
  return {
    id: donorData.id,
    mrn: donorData.mrn,
    nationalId: donorData.national_id,
    fullName: donorData.full_name,
    age: donorData.age,
    bloodType: donorData.blood_type,
    mobileNumber: donorData.mobile_number,
    hlaTyping: {
      hlaA: donorData.hla_typing?.hla_a || '',
      hlaB: donorData.hla_typing?.hla_b || '',
      hlaC: donorData.hla_typing?.hla_c || '',
      hlaDR: donorData.hla_typing?.hla_dr || '',
      hlaDQ: donorData.hla_typing?.hla_dq || '',
      hlaDP: donorData.hla_typing?.hla_dp || ''
    },
    crossmatchResult: donorData.crossmatch_result,
    donorAntibodies: donorData.donor_antibodies || '',
    serumCreatinine: donorData.serum_creatinine || 0,
    egfr: donorData.egfr || 0,
    bloodPressure: donorData.blood_pressure || 'N/A',
    viralScreening: donorData.viral_screening || '',
    cmvStatus: donorData.cmv_status || '',
    medicalConditions: donorData.medical_conditions || '',
    notes: donorData.notes || '',
    highResTyping: donorData.high_res_typing || '',
    antigenMismatch: donorData.antigen_mismatch || 0,
    dsaResult: {
      detected: false, // Add proper DSA handling if needed
    },
    status: donorData.status
  };
}

export async function findCompatibleDonors(recipientId: string) {
  // First get the recipient details
  const { data: recipientData, error: recipientError } = await supabase
    .from('recipients')
    .select('*')
    .eq('id', recipientId)
    .single();

  if (recipientError) throw recipientError;

  const recipient = transformRecipientData(recipientData);

  // Get all available donors
  const { data: donors, error: donorsError } = await supabase
    .from('donors')
    .select('*')
    .eq('status', 'Available');

  if (donorsError) throw donorsError;

  // Process each donor
  const processedDonors = donors.map(donorData => {
    const donor = transformDonorData(donorData);

    // STEP 1: Check for unacceptable antigens first - this is the primary exclusion check
    const unacceptableAntigensCheck = checkUnacceptableAntigens(donor.hlaTyping, recipient.unacceptableAntigens);
    
    if (unacceptableAntigensCheck.hasUnacceptableAntigens) {
      // If donor has unacceptable antigens, immediately return with score 0 and skip all other checks
      return {
        donor,
        compatibilityScore: 0,
        matchDetails: {
          bloodTypeMatch: false, // Not checked since donor is already excluded
          hlaMatches: 0, // Not calculated since donor is already excluded
          crossmatchCompatible: false, // Not checked since donor is already excluded
          hasUnacceptableAntigens: true,
          excludedReason: `Excluded: Unacceptable antigens present (${unacceptableAntigensCheck.matchedAntigens.join(', ')})`
        }
      };
    }

    // STEP 2: Only proceed with other compatibility checks if no unacceptable antigens
    const bloodTypeMatch = isBloodTypeCompatible(donor.bloodType, recipient.bloodType);
    if (!bloodTypeMatch) {
      return {
        donor,
        compatibilityScore: 0,
        matchDetails: {
          bloodTypeMatch: false,
          hlaMatches: 0, // Not calculated since blood type is incompatible
          crossmatchCompatible: false, // Not checked since blood type is incompatible
          hasUnacceptableAntigens: false,
          excludedReason: 'Excluded: Blood type incompatible'
        }
      };
    }

    const crossmatchCompatible = donor.crossmatchResult === recipient.crossmatchRequirement;
    if (!crossmatchCompatible) {
      return {
        donor,
        compatibilityScore: 0,
        matchDetails: {
          bloodTypeMatch: true,
          hlaMatches: 0, // Not calculated since crossmatch is incompatible
          crossmatchCompatible: false,
          hasUnacceptableAntigens: false,
          excludedReason: 'Excluded: Crossmatch incompatible'
        }
      };
    }

    // STEP 3: Calculate HLA matches only for donors that passed all previous checks
    const hlaMatches = calculateHLAMatches(donor.hlaTyping, recipient.hlaTyping);
    
    // STEP 4: Calculate final compatibility score
    const compatibilityScore = calculateCompatibilityScore({
      bloodTypeMatch: true, // We know it's true if we got here
      hlaMatches,
      crossmatchCompatible: true, // We know it's true if we got here
      recipient,
      donor
    });

    // Return complete match details
    return {
      donor,
      compatibilityScore,
      matchDetails: {
        bloodTypeMatch: true,
        hlaMatches,
        crossmatchCompatible: true,
        hasUnacceptableAntigens: false,
        excludedReason: compatibilityScore === 0 ? 'Excluded: Insufficient HLA matches' : undefined
      }
    };
  });

  // Sort donors: excluded donors (unacceptable antigens) last, then by compatibility score
  const sortedDonors = processedDonors.sort((a, b) => {
    // First sort criterion: unacceptable antigens (these go last)
    if (a.matchDetails.hasUnacceptableAntigens && !b.matchDetails.hasUnacceptableAntigens) return 1;
    if (!a.matchDetails.hasUnacceptableAntigens && b.matchDetails.hasUnacceptableAntigens) return -1;
    
    // Second sort criterion: compatibility score (higher scores first)
    return b.compatibilityScore - a.compatibilityScore;
  });

  return sortedDonors;
}

function checkUnacceptableAntigens(donorHLA: any, unacceptableAntigens: string): {
  hasUnacceptableAntigens: boolean;
  matchedAntigens: string[];
} {
  if (!unacceptableAntigens?.trim()) {
    return { hasUnacceptableAntigens: false, matchedAntigens: [] };
  }

  // Parse unacceptable antigens list, handling multiple delimiter types
  const unacceptableList = unacceptableAntigens
    .split(/[,;\s]+/) // Handle multiple delimiter types
    .map(a => a.trim().toUpperCase())
    .filter(Boolean);

  if (unacceptableList.length === 0) {
    return { hasUnacceptableAntigens: false, matchedAntigens: [] };
  }

  // Get all donor antigens from all HLA loci
  const donorAntigens = Object.values(donorHLA)
    .flatMap(value => {
      if (!value) return [];
      const antigens = String(value)
        .split(/[,;\s]+/)
        .map(a => a.trim().toUpperCase())
        .filter(Boolean);
      return antigens;
    });

  // Find any matching unacceptable antigens
  const matchedAntigens = unacceptableList.filter(unacceptable => 
    donorAntigens.includes(unacceptable)
  );

  return {
    hasUnacceptableAntigens: matchedAntigens.length > 0,
    matchedAntigens
  };
}

function calculateHLAMatches(donorHLA: any, recipientHLA: any): number {
  if (!donorHLA || !recipientHLA) return 0;
  
  let matches = 0;
  const loci = ['hlaA', 'hlaB', 'hlaC', 'hlaDR', 'hlaDQ', 'hlaDP'];
  
  for (const locus of loci) {
    const donorValue = donorHLA[locus]?.trim() || '';
    const recipientValue = recipientHLA[locus]?.trim() || '';
    
    if (donorValue && recipientValue) {
      // Split multiple antigens and check for matches
      const donorAntigens = donorValue.split(/[,\s]+/).map((a: string) => a.trim().toUpperCase());
      const recipientAntigens = recipientValue.split(/[,\s]+/).map((a: string) => a.trim().toUpperCase());
      
      // Count matching antigens for this locus
      for (const dAntigen of donorAntigens) {
        if (dAntigen && recipientAntigens.includes(dAntigen)) {
          // Each locus can have up to 2 matches
          matches++;
          if (matches % 2 === 0) break; // Move to next locus after 2 matches
        }
      }
    }
  }

  return matches;
}

interface CompatibilityParams {
  bloodTypeMatch: boolean;
  hlaMatches: number;
  crossmatchCompatible: boolean;
  recipient: any;
  donor: any;
}

function calculateCompatibilityScore(params: CompatibilityParams): number {
  const { bloodTypeMatch, hlaMatches, crossmatchCompatible } = params;

  // If any critical criteria fail, return 0
  if (!bloodTypeMatch || !crossmatchCompatible) {
    return 0;
  }

  // Check for minimum HLA matches requirement (3/12)
  if (hlaMatches < 3) {
    return 0;
  }

  // Base score starts at 0
  let score = 0;

  // HLA matching (50% of total score)
  // Maximum 12 matches possible (2 per locus × 6 loci)
  const maxPossibleHLAMatches = 12;
  const hlaScore = (Math.min(hlaMatches, maxPossibleHLAMatches) / maxPossibleHLAMatches) * 50;
  score += hlaScore;

  // Blood type compatibility (30% of total score)
  score += bloodTypeMatch ? 30 : 0;

  // Crossmatch compatibility (20% of total score)
  score += crossmatchCompatible ? 20 : 0;

  // Normalize score to 0-1 range
  return score / 100;
}

function isBloodTypeCompatible(donorType: string, recipientType: string): boolean {
  // Special case for O- donors
  if (donorType === 'O-') {
    return true; // O- can donate to all blood types
  }

  const compatibility: Record<string, string[]> = {
    'O-': ['O-'],
    'O+': ['O-','O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
  };

  return compatibility[donorType]?.includes(recipientType) || false;
}