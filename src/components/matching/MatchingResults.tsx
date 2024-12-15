import type { Database } from '@/types/supabase';

type Donor = Database['public']['Tables']['donors']['Row'];
type Recipient = Database['public']['Tables']['recipients']['Row'];

interface MatchingResultsProps {
  donor: Donor;
  recipient: Recipient;
  isMatch: boolean;
  exclusionReason?: string;
}

export function MatchingResult({ donor, isMatch, exclusionReason }: MatchingResultsProps) {
  return (
    <div className={`p-4 border rounded-lg ${isMatch ? 'border-green-500' : 'border-red-500'}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Donor: {donor.full_name}</h3>
        <span className={`px-2 py-1 rounded ${isMatch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isMatch ? 'Compatible' : 'Excluded'}
        </span>
      </div>
      
      {!isMatch && exclusionReason && (
        <div className="mt-2 text-sm text-red-600">
          Exclusion reason: {exclusionReason}
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">HLA-A:</span> {donor.hla_typing.hla_a}
        </div>
        <div>
          <span className="font-medium">HLA-B:</span> {donor.hla_typing.hla_b}
        </div>
        <div>
          <span className="font-medium">HLA-C:</span> {donor.hla_typing.hla_c}
        </div>
        <div>
          <span className="font-medium">HLA-DR:</span> {donor.hla_typing.hla_dr}
        </div>
      </div>
    </div>
  );
}