import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { Database } from '@/types/supabase';

type Donor = Database['public']['Tables']['donors']['Row'];
type Recipient = Database['public']['Tables']['recipients']['Row'];

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

interface ReportData {
  recipient: Recipient;
  results: MatchResult[];
  timestamp: string;
}

export function generatePDF(data: ReportData) {
  const { recipient, results, timestamp } = data;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Helper functions
  const addText = (text: string, size = 12, yIncrement = 10, align: 'left' | 'center' = 'left') => {
    doc.setFontSize(size);
    if (align === 'center') {
      doc.text(text, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.text(text, margin, y);
    }
    y += yIncrement;
  };

  const addSection = (title: string) => {
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
    doc.setFont('helvetica', 'normal');
    y += 10;
  };

  const addField = (label: string, value: string | number) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), margin + 60, y);
    y += 7;
  };

  const addDetailField = (label: string, value: string | number, color?: string) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('• ' + label + ':', margin + 5, y);
    doc.setFont('helvetica', 'normal');
    if (color) {
      doc.setTextColor(color);
    }
    doc.text(String(value), margin + 45, y);
    doc.setTextColor(0, 0, 0); // Reset to black
    y += 6;
  };

  const checkPageSpace = (neededSpace: number) => {
    if (y + neededSpace > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Title and Header
  doc.setFont('helvetica', 'bold');
  addText('Kidney Match Report', 24, 15, 'center');
  doc.setFont('helvetica', 'normal');
  addText(`Generated on ${format(new Date(timestamp), 'PPpp')}`, 12, 15, 'center');

  // Recipient Information
  addSection('Recipient Information');
  addField('Name', recipient.full_name);
  addField('MRN', recipient.mrn);
  addField('National ID', recipient.national_id);
  addField('Blood Type', recipient.blood_type);
  addField('PRA', `${recipient.pra}%`);
  addField('Crossmatch Requirement', recipient.crossmatch_requirement);
  addField('CMV Status', recipient.cmv_status);

  // HLA Typing
  addSection('HLA Typing');
  addField('HLA-A', recipient.hla_typing.hla_a || 'N/A');
  addField('HLA-B', recipient.hla_typing.hla_b || 'N/A');
  addField('HLA-C', recipient.hla_typing.hla_c || 'N/A');
  addField('HLA-DR', recipient.hla_typing.hla_dr || 'N/A');
  addField('HLA-DQ', recipient.hla_typing.hla_dq || 'N/A');
  addField('HLA-DP', recipient.hla_typing.hla_dp || 'N/A');

  // Matching Summary
  checkPageSpace(50);
  addSection('Matching Summary');
  const compatibleDonors = results.filter(r => !r.matchDetails.hasUnacceptableAntigens && r.compatibilityScore > 0);
  const incompatibleDonors = results.filter(r => r.compatibilityScore === 0 && !r.matchDetails.hasUnacceptableAntigens);
  const excludedDonors = results.filter(r => r.matchDetails.hasUnacceptableAntigens);
  
  addField('Total Donors Analyzed', results.length);
  addField('Compatible Donors', compatibleDonors.length);
  addField('Incompatible Donors', incompatibleDonors.length);
  addField('Excluded Donors', excludedDonors.length);
  
  if (compatibleDonors.length > 0) {
    const bestScore = Math.max(...compatibleDonors.map(r => r.compatibilityScore));
    addField('Best Match Score', `${(bestScore * 100).toFixed(1)}%`);
  }

  // Compatible Donors Section
  if (compatibleDonors.length > 0) {
    checkPageSpace(100);
    addSection('Compatible Donors');
    
    compatibleDonors
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .forEach((result, index) => {
        checkPageSpace(60);
        
        // Donor header with score
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const donorHeader = `${index + 1}. ${result.donor.full_name} - Score: ${(result.compatibilityScore * 100).toFixed(1)}%`;
        doc.text(donorHeader, margin, y);
        y += 10;

        // Basic Information
        addDetailField('Blood Type', `${result.donor.blood_type} (Compatible)`, '#22c55e');
        addDetailField('HLA Matches', `${result.matchDetails.hlaMatches}/12 matches`);
        addDetailField('Crossmatch', result.donor.crossmatch_result, 
          result.matchDetails.crossmatchCompatible ? '#22c55e' : '#ef4444');
        
        // DSA Information
        const dsaText = result.donor.donor_antibodies
          ? 'Detected'
          : 'Not Detected';
        addDetailField('DSA Status', dsaText, 
          result.donor.donor_antibodies ? '#eab308' : '#22c55e');
        
        // Medical Information
        addDetailField('CMV Status', `${result.donor.cmv_status} (Recipient: ${recipient.cmv_status})`);
        addDetailField('Serum Creatinine', `${result.donor.serum_creatinine} mg/dL`);
        addDetailField('eGFR', `${result.donor.egfr} mL/min/1.73m²`);
        
        // HLA Typing Comparison
        y += 3;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('HLA Typing Comparison:', margin + 5, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
        
        const hlaComparison = [
          { locus: 'A', donor: result.donor.hla_typing.hla_a, recipient: recipient.hla_typing.hla_a },
          { locus: 'B', donor: result.donor.hla_typing.hla_b, recipient: recipient.hla_typing.hla_b },
          { locus: 'C', donor: result.donor.hla_typing.hla_c, recipient: recipient.hla_typing.hla_c },
          { locus: 'DR', donor: result.donor.hla_typing.hla_dr, recipient: recipient.hla_typing.hla_dr },
          { locus: 'DQ', donor: result.donor.hla_typing.hla_dq, recipient: recipient.hla_typing.hla_dq },
          { locus: 'DP', donor: result.donor.hla_typing.hla_dp, recipient: recipient.hla_typing.hla_dp }
        ];

        hlaComparison.forEach(({ locus, donor, recipient: recipientHLA }) => {
          doc.text(`HLA-${locus}:`, margin + 10, y);
          doc.text(`D: ${donor || 'N/A'}`, margin + 35, y);
          doc.text(`R: ${recipientHLA || 'N/A'}`, margin + 85, y);
          y += 5;
        });

        y += 10; // Space between donors
      });
  }

  // Other Donors Summary
  if (incompatibleDonors.length > 0 || excludedDonors.length > 0) {
    checkPageSpace(50);
    addSection('Other Donors Summary');
    
    // Table headers
    const headers = ['Donor Name', 'Blood Type', 'Status', 'Reason'];
    const colWidths = [50, 25, 30, 75];
    let xPos = margin;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
      doc.text(header, xPos, y);
      xPos += colWidths[i];
    });
    y += 7;
    doc.line(margin, y - 3, pageWidth - margin, y - 3);

    // List incompatible and excluded donors
    [...incompatibleDonors, ...excludedDonors].forEach(result => {
      checkPageSpace(10);
      xPos = margin;
      
      const rowData = [
        result.donor.full_name,
        result.donor.blood_type,
        result.matchDetails.hasUnacceptableAntigens ? 'Excluded' : 'Incompatible',
        result.matchDetails.excludedReason || 'Incompatible match'
      ];

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      rowData.forEach((text, i) => {
        doc.text(text.toString(), xPos, y, {
          maxWidth: colWidths[i] - 5
        });
        xPos += colWidths[i];
      });
      y += 7;
    });
  }

  // Footer
  checkPageSpace(30);
  y = doc.internal.pageSize.height - 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const footerText = 'This report is for medical professional use only. All matches should be verified by laboratory testing.';
  doc.text(footerText, margin, y, {
    maxWidth: contentWidth,
    align: 'center'
  });
  y += 7;
  doc.text(`Report ID: ${crypto.randomUUID().split('-')[0].toUpperCase()}`, margin, y);
  doc.text('Generated by: Kidney Match Pro v1.0', pageWidth - margin, y, { align: 'right' });

  return doc;
}

export function printReport() {
  window.print();
}