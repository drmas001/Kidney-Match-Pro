import type { Database } from '@/types/supabase';

type Donor = Database['public']['Tables']['donors']['Row'];
type Recipient = Database['public']['Tables']['recipients']['Row'];

export function calculateHLAMatches(
  donor: Donor,
  recipient: Recipient
): number {
  let matches = 0;
  
  // Compare HLA antigens
  if (donor.hla_typing && recipient.hla_typing) {
    if (donor.hla_typing.hla_a === recipient.hla_typing.hla_a) matches++;
    if (donor.hla_typing.hla_b === recipient.hla_typing.hla_b) matches++;
    if (donor.hla_typing.hla_c === recipient.hla_typing.hla_c) matches++;
    if (donor.hla_typing.hla_dr === recipient.hla_typing.hla_dr) matches++;
    if (donor.hla_typing.hla_dq === recipient.hla_typing.hla_dq) matches++;
    if (donor.hla_typing.hla_dp === recipient.hla_typing.hla_dp) matches++;
  }
  
  return matches;
} 