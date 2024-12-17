import { useLocation, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/utils/report';
import { FileDown, Printer } from 'lucide-react';
import type { Donor, Recipient } from '@/types/matching';
import type { Database } from '@/types/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';

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
  const [selectedDonor, setSelectedDonor] = useState<(Omit<MatchResult, 'recipient'> & { isCompatible: boolean }) | null>(null);

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
      age: recipient.age,
      blood_type: recipient.bloodType,
      mobile_number: recipient.mobileNumber,
      hla_typing: {
        hla_a: recipient.hlaTyping.hlaA,
        hla_b: recipient.hlaTyping.hlaB,
        hla_c: recipient.hlaTyping.hlaC,
        hla_dr: recipient.hlaTyping.hlaDR,
        hla_dq: recipient.hlaTyping.hlaDQ,
        hla_dp: recipient.hlaTyping.hlaDP
      },
      unacceptable_antigens: recipient.unacceptableAntigens || '',
      pra: recipient.pra,
      crossmatch_requirement: recipient.crossmatchRequirement,
      donor_antibodies: recipient.donorAntibodies || '',
      serum_creatinine: recipient.serumCreatinine || 0,
      egfr: recipient.egfr || 0,
      blood_pressure: recipient.bloodPressure || 'N/A',
      viral_screening: recipient.viralScreening || '',
      cmv_status: recipient.cmvStatus,
      medical_history: recipient.medicalHistory || '',
      notes: recipient.notes || '',
      preferred_matches: ''
    };

    try {
      const doc = generatePDF({ 
        recipient: dbRecipient,
        results: results.map(r => {
          const dbDonor: DBDonor = {
            id: r.donor.id,
            created_at: new Date().toISOString(),
            mrn: r.donor.mrn,
            national_id: r.donor.nationalId,
            full_name: r.donor.fullName,
            age: r.donor.age,
            blood_type: r.donor.bloodType,
            mobile_number: r.donor.mobileNumber,
            hla_typing: {
              hla_a: r.donor.hlaTyping.hlaA,
              hla_b: r.donor.hlaTyping.hlaB,
              hla_c: r.donor.hlaTyping.hlaC,
              hla_dr: r.donor.hlaTyping.hlaDR,
              hla_dq: r.donor.hlaTyping.hlaDQ,
              hla_dp: r.donor.hlaTyping.hlaDP,
            },
            crossmatch_result: r.donor.crossmatchResult,
            donor_antibodies: r.donor.donorAntibodies || '',
            serum_creatinine: r.donor.serumCreatinine || 0,
            egfr: r.donor.egfr || 0,
            viral_screening: r.donor.viralScreening || '',
            cmv_status: r.donor.cmvStatus || '',
            medical_conditions: r.donor.medicalConditions || '',
            notes: r.donor.notes || '',
            status: 'Available' as const,
            high_res_typing: r.donor.highResTyping || '',
            antigen_mismatch: r.donor.antigenMismatch || 0,
            blood_pressure: r.donor.bloodPressure || 'N/A'
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
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const compatibleDonors = results.filter(r => !r.matchDetails.hasUnacceptableAntigens && r.compatibilityScore > 0);
  const incompatibleDonors = results.filter(r => r.compatibilityScore === 0 && !r.matchDetails.hasUnacceptableAntigens);
  const excludedDonors = results.filter(r => r.matchDetails.hasUnacceptableAntigens);

  const handleDonorClick = (result: Omit<MatchResult, 'recipient'>, isCompatible: boolean) => {
    setSelectedDonor({ ...result, isCompatible });
  };

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
        
        {/* Personal Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{recipient.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600">MRN</p>
                <p className="font-medium">{recipient.mrn}</p>
              </div>
              <div>
                <p className="text-gray-600">National ID</p>
                <p className="font-medium">{recipient.nationalId}</p>
              </div>
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-medium">{recipient.age || 'N/A'} {recipient.age ? 'years' : ''}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Type</p>
                <p className="font-medium">{recipient.bloodType}</p>
              </div>
              <div>
                <p className="text-gray-600">Mobile Number</p>
                <p className="font-medium">{recipient.mobileNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Medical Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Serum Creatinine</p>
                <p className="font-medium">{recipient.serumCreatinine} mg/dL</p>
              </div>
              <div>
                <p className="text-gray-600">eGFR</p>
                <p className="font-medium">{recipient.egfr} mL/min/1.73m²</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Pressure</p>
                <p className="font-medium">{recipient.bloodPressure}</p>
              </div>
              <div>
                <p className="text-gray-600">PRA</p>
                <p className="font-medium">{recipient.pra}%</p>
              </div>
              <div>
                <p className="text-gray-600">CMV Status</p>
                <p className="font-medium">{recipient.cmvStatus}</p>
              </div>
              <div>
                <p className="text-gray-600">Viral Screening</p>
                <p className="font-medium">{recipient.viralScreening}</p>
              </div>
            </div>
          </div>

          {/* HLA Typing */}
          <div>
            <h3 className="text-lg font-medium mb-3">HLA Typing</h3>
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

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Medical History</p>
                <p className="font-medium whitespace-pre-wrap">{recipient.medicalHistory || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Notes</p>
                <p className="font-medium whitespace-pre-wrap">{recipient.notes || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Unacceptable Antigens</p>
                <p className="font-medium whitespace-pre-wrap">{recipient.unacceptableAntigens || 'None'}</p>
              </div>
              <div>
                <p className="text-gray-600">Donor Antibodies</p>
                <p className="font-medium">{recipient.donorAntibodies || 'None'}</p>
              </div>
              <div>
                <p className="text-gray-600">Crossmatch Requirement</p>
                <p className="font-medium">{recipient.crossmatchRequirement}</p>
              </div>
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
              <div 
                key={result.donor.id} 
                className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                onClick={() => handleDonorClick(result, true)}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{result.donor.fullName}</h3>
                    <p className="text-sm text-muted-foreground">Donor ID: {result.donor.id}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Score: {(result.compatibilityScore * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <tr 
                    key={result.donor.id} 
                    className="border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => handleDonorClick(result, false)}
                  >
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

      {/* Donor Details Modal */}
      <Dialog open={!!selectedDonor} onOpenChange={() => setSelectedDonor(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Donor Details</DialogTitle>
          </DialogHeader>
          
          {selectedDonor && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{selectedDonor.donor.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">MRN</p>
                    <p className="font-medium">{selectedDonor.donor.mrn}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">National ID</p>
                    <p className="font-medium">{selectedDonor.donor.nationalId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Age</p>
                    <p className="font-medium">{selectedDonor.donor.age}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Blood Type</p>
                    <p className="font-medium">{selectedDonor.donor.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mobile Number</p>
                    <p className="font-medium">{selectedDonor.donor.mobileNumber}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Medical Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600">Serum Creatinine</p>
                    <p className="font-medium">{selectedDonor.donor.serumCreatinine} mg/dL</p>
                  </div>
                  <div>
                    <p className="text-gray-600">eGFR</p>
                    <p className="font-medium">{selectedDonor.donor.egfr} mL/min/1.73m²</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Blood Pressure</p>
                    <p className="font-medium">{selectedDonor.donor.bloodPressure}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CMV Status</p>
                    <p className="font-medium">{selectedDonor.donor.cmvStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Viral Screening</p>
                    <p className="font-medium">{selectedDonor.donor.viralScreening}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Crossmatch Result</p>
                    <p className="font-medium">{selectedDonor.donor.crossmatchResult}</p>
                  </div>
                </div>
              </div>

              {/* HLA Typing */}
              <div>
                <h3 className="text-lg font-medium mb-3">HLA Typing</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <p className="text-gray-600">HLA-A</p>
                    <p className="font-medium">{selectedDonor.donor.hlaTyping.hlaA || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">HLA-B</p>
                    <p className="font-medium">{selectedDonor.donor.hlaTyping.hlaB || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">HLA-C</p>
                    <p className="font-medium">{selectedDonor.donor.hlaTyping.hlaC || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">HLA-DR</p>
                    <p className="font-medium">{selectedDonor.donor.hlaTyping.hlaDR || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">HLA-DQ</p>
                    <p className="font-medium">{selectedDonor.donor.hlaTyping.hlaDQ || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">HLA-DP</p>
                    <p className="font-medium">{selectedDonor.donor.hlaTyping.hlaDP || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Medical Conditions</p>
                    <p className="font-medium whitespace-pre-wrap">{selectedDonor.donor.medicalConditions || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Notes</p>
                    <p className="font-medium whitespace-pre-wrap">{selectedDonor.donor.notes || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">High Resolution Typing</p>
                    <p className="font-medium">{selectedDonor.donor.highResTyping || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Antigen Mismatch</p>
                    <p className="font-medium">{selectedDonor.donor.antigenMismatch}</p>
                  </div>
                </div>
              </div>

              {/* Compatibility Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Compatibility Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Compatibility Score</p>
                    <p className="font-medium">{(selectedDonor.compatibilityScore * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">HLA Matches</p>
                    <p className="font-medium">{selectedDonor.matchDetails.hlaMatches}/12</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className={`font-medium ${selectedDonor.isCompatible ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedDonor.isCompatible ? 'Compatible' : 
                        selectedDonor.matchDetails.hasUnacceptableAntigens ? 'Excluded' : 'Incompatible'}
                    </p>
                  </div>
                  {!selectedDonor.isCompatible && (
                    <div>
                      <p className="text-gray-600">Reason</p>
                      <p className="font-medium text-red-600">
                        {selectedDonor.matchDetails.excludedReason || 'Incompatible match'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 