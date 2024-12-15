import { useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/utils/report';
import { FileDown, Printer } from 'lucide-react';
import type { Donor, Recipient } from '@/types/matching';
import type { Database } from '@/types/supabase';

type DBRecipient = Database['public']['Tables']['recipients']['Row'];
type DBDonor = Database['public']['Tables']['donors']['Row'];

interface MatchDetails {
  bloodTypeMatch: boolean;
  hlaMatches: number;
  crossmatchCompatible: boolean;
  hasUnacceptableAntigens?: boolean;
  excludedReason?: string;
}

interface MatchResult {
  donor: Donor;
  recipient: Recipient;
  compatibilityScore: number;
  matchDetails: MatchDetails;
}

interface ReportState {
  recipient: Recipient;
  results: Omit<MatchResult, 'recipient'>[];
  timestamp: string;
}

export function Reports() {
  const location = useLocation();
  const state = location.state as ReportState;

  // If no state is present, redirect to matching system
  if (!state) {
    return <Navigate to="/matching" replace />;
  }

  const { recipient, results, timestamp } = state;

  const handleDownloadPDF = () => {
    const dbRecipient: DBRecipient = {
      id: recipient.id,
      created_at: new Date().toISOString(),
      mrn: recipient.mrn,
      national_id: recipient.nationalId,
      full_name: recipient.fullName,
      age: 0, // Default value since we don't have this in our frontend type
      blood_type: recipient.bloodType,
      mobile_number: '', // Default value since we don't have this in our frontend type
      hla_typing: {
        hla_a: recipient.hlaTyping.hlaA,
        hla_b: recipient.hlaTyping.hlaB,
        hla_c: recipient.hlaTyping.hlaC,
        hla_dr: recipient.hlaTyping.hlaDR,
        hla_dq: recipient.hlaTyping.hlaDQ,
        hla_dp: recipient.hlaTyping.hlaDP,
      },
      pra: recipient.pra,
      crossmatch_requirement: recipient.crossmatchRequirement,
      viral_screening: recipient.viralScreening,
      cmv_status: recipient.cmvStatus,
      donor_antibodies: '',
      medical_history: '',
      notes: '',
      preferred_matches: '',
      serum_creatinine: 0,
      egfr: 0,
      blood_pressure: 'N/A'
    };

    const doc = generatePDF({ 
      recipient: dbRecipient,
      results: results.map(r => {
        const dbDonor: DBDonor = {
          id: r.donor.id,
          created_at: new Date().toISOString(),
          mrn: '',
          national_id: '',
          full_name: r.donor.fullName,
          age: 0,
          blood_type: r.donor.bloodType,
          mobile_number: '',
          hla_typing: {
            hla_a: r.donor.hlaTyping.hlaA,
            hla_b: r.donor.hlaTyping.hlaB,
            hla_c: r.donor.hlaTyping.hlaC,
            hla_dr: r.donor.hlaTyping.hlaDR,
            hla_dq: r.donor.hlaTyping.hlaDQ,
            hla_dp: r.donor.hlaTyping.hlaDP,
          },
          crossmatch_result: r.donor.crossmatchResult,
          donor_antibodies: '',
          serum_creatinine: r.donor.serumCreatinine,
          egfr: r.donor.egfr,
          viral_screening: r.donor.viralScreening,
          cmv_status: r.donor.cmvStatus,
          medical_conditions: '',
          notes: '',
          status: 'Available' as const,
          high_res_typing: '',
          antigen_mismatch: 0,
          blood_pressure: 'N/A'
        };

        return {
          donor: dbDonor,
          recipient: dbRecipient,
          compatibilityScore: r.compatibilityScore,
          matchDetails: r.matchDetails
        };
      }),
      timestamp 
    });
    doc.save(`matching-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const compatibleDonors = results.filter(r => !r.matchDetails.hasUnacceptableAntigens && r.compatibilityScore > 0);
  const incompatibleDonors = results.filter(r => r.compatibilityScore === 0 && !r.matchDetails.hasUnacceptableAntigens);
  const excludedDonors = results.filter(r => r.matchDetails.hasUnacceptableAntigens);

  return (
    <div className="container mx-auto py-8 print:px-6">
      <div className="flex justify-between items-center mb-8 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold">Matching Report</h1>
          <p className="text-sm text-muted-foreground">Generated on {new Date(timestamp).toLocaleString()}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Recipient Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 print:mb-4 print:shadow-none print:border">
        <h2 className="text-xl font-semibold mb-4">Recipient Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{recipient.fullName}</p>
          </div>
          <div>
            <p className="text-gray-600">Blood Type</p>
            <p className="font-medium">{recipient.bloodType}</p>
          </div>
          <div>
            <p className="text-gray-600">MRN</p>
            <p className="font-medium">{recipient.mrn}</p>
          </div>
          <div>
            <p className="text-gray-600">PRA</p>
            <p className="font-medium">{recipient.pra}%</p>
          </div>
          <div>
            <p className="text-gray-600">Crossmatch Requirement</p>
            <p className="font-medium">{recipient.crossmatchRequirement}</p>
          </div>
          <div>
            <p className="text-gray-600">CMV Status</p>
            <p className="font-medium">{recipient.cmvStatus}</p>
          </div>
        </div>

        {/* HLA Typing */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">HLA Typing</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-gray-600">HLA-A</p>
              <p className="font-medium">{recipient.hlaTyping.hlaA || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">HLA-B</p>
              <p className="font-medium">{recipient.hlaTyping.hlaB || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">HLA-C</p>
              <p className="font-medium">{recipient.hlaTyping.hlaC || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">HLA-DR</p>
              <p className="font-medium">{recipient.hlaTyping.hlaDR || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">HLA-DQ</p>
              <p className="font-medium">{recipient.hlaTyping.hlaDQ || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">HLA-DP</p>
              <p className="font-medium">{recipient.hlaTyping.hlaDP || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Matching Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 print:mb-4 print:shadow-none print:border">
        <h2 className="text-xl font-semibold mb-4">Matching Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Total Donors</p>
            <p className="text-2xl font-bold">{results.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600">Compatible</p>
            <p className="text-2xl font-bold text-green-600">{compatibleDonors.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-gray-600">Incompatible</p>
            <p className="text-2xl font-bold text-yellow-600">{incompatibleDonors.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-gray-600">Excluded</p>
            <p className="text-2xl font-bold text-red-600">{excludedDonors.length}</p>
          </div>
        </div>
      </div>

      {/* Compatible Donors */}
      {compatibleDonors.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8 print:mb-4 print:shadow-none print:border">
          <h2 className="text-xl font-semibold mb-4">Compatible Donors</h2>
          <div className="space-y-6">
            {compatibleDonors.map((result) => (
              <div key={result.donor.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{result.donor.fullName}</h3>
                    <p className="text-sm text-muted-foreground">Donor ID: {result.donor.id}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Score: {(result.compatibilityScore * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">Blood Type</p>
                    <p className="font-medium">{result.donor.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">HLA Matches</p>
                    <p className="font-medium">{result.matchDetails.hlaMatches}/12</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Crossmatch</p>
                    <p className="font-medium">{result.donor.crossmatchResult}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CMV Status</p>
                    <p className="font-medium">{result.donor.cmvStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Serum Creatinine</p>
                    <p className="font-medium">{result.donor.serumCreatinine} mg/dL</p>
                  </div>
                  <div>
                    <p className="text-gray-600">eGFR</p>
                    <p className="font-medium">{result.donor.egfr} mL/min/1.73m²</p>
                  </div>
                </div>

                {/* HLA Comparison */}
                <div className="mt-4">
                  <h4 className="font-medium mb-2">HLA Typing Comparison</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                    {[
                      { label: 'A', donor: result.donor.hlaTyping.hlaA, recipient: recipient.hlaTyping.hlaA },
                      { label: 'B', donor: result.donor.hlaTyping.hlaB, recipient: recipient.hlaTyping.hlaB },
                      { label: 'C', donor: result.donor.hlaTyping.hlaC, recipient: recipient.hlaTyping.hlaC },
                      { label: 'DR', donor: result.donor.hlaTyping.hlaDR, recipient: recipient.hlaTyping.hlaDR },
                      { label: 'DQ', donor: result.donor.hlaTyping.hlaDQ, recipient: recipient.hlaTyping.hlaDQ },
                      { label: 'DP', donor: result.donor.hlaTyping.hlaDP, recipient: recipient.hlaTyping.hlaDP }
                    ].map(({ label, donor, recipient: recipientHLA }) => (
                      <div key={label} className="bg-gray-50 p-2 rounded">
                        <p className="font-medium">HLA-{label}</p>
                        <p className="text-xs">D: {donor || 'N/A'}</p>
                        <p className="text-xs">R: {recipientHLA || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Donors */}
      {(incompatibleDonors.length > 0 || excludedDonors.length > 0) && (
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none print:border">
          <h2 className="text-xl font-semibold mb-4">Other Donors</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Donor Name</th>
                  <th className="pb-2">Blood Type</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">HLA Matches</th>
                  <th className="pb-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {[...incompatibleDonors, ...excludedDonors].map((result) => (
                  <tr key={result.donor.id} className="border-b">
                    <td className="py-2">
                      <div>
                        <p className="font-medium">{result.donor.fullName}</p>
                        <p className="text-sm text-muted-foreground">ID: {result.donor.id}</p>
                      </div>
                    </td>
                    <td>{result.donor.bloodType}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        result.matchDetails.hasUnacceptableAntigens 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.matchDetails.hasUnacceptableAntigens ? 'Excluded' : 'Incompatible'}
                      </span>
                    </td>
                    <td>{result.matchDetails.hlaMatches}/12</td>
                    <td>{result.matchDetails.excludedReason || 'Incompatible match'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>This report is for medical professional use only. All matches should be verified by laboratory testing.</p>
        <p className="mt-1">Report ID: {crypto.randomUUID().split('-')[0].toUpperCase()} | Generated by: Kidney Match Pro v1.0</p>
      </div>
    </div>
  );
} 