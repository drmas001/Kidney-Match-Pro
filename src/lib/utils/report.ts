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

  // Enhanced helper functions
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
    doc.setFontSize(12);
    doc.text(title, margin, y);
    // Add an underline for section headers
    const titleWidth = doc.getTextWidth(title);
    doc.setLineWidth(0.5);
    y += 1;
    doc.line(margin, y, margin + titleWidth, y);
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

  // New helper functions for enhanced tables
  const drawTableHeader = (headers: string[], colWidths: number[], rowHeight: number = 10) => {
    let xPos = margin;
    
    // Draw header background
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 5, contentWidth, rowHeight, 'F');
    
    // Draw header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    headers.forEach((header, i) => {
      doc.text(header, xPos + 2, y, { maxWidth: colWidths[i] - 4 });
      xPos += colWidths[i];
    });
    
    // Draw header border
    doc.setLineWidth(0.2);
    doc.line(margin, y - 5, margin + contentWidth, y - 5); // Top
    doc.line(margin, y + 5, margin + contentWidth, y + 5); // Bottom
    
    // Draw vertical lines
    xPos = margin;
    headers.forEach((_, i) => {
      doc.line(xPos, y - 5, xPos, y + 5);
      xPos += colWidths[i];
    });
    doc.line(xPos, y - 5, xPos, y + 5); // Last vertical line
    
    y += rowHeight;
  };

  const drawTableRow = (rowData: (string | number)[], colWidths: number[], rowHeight: number = 8) => {
    let xPos = margin;
    
    // Draw row background (alternating colors)
    if ((y / rowHeight) % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y - 4, contentWidth, rowHeight, 'F');
    }
    
    // Draw cell content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    rowData.forEach((text, i) => {
      doc.text(String(text), xPos + 2, y, {
        maxWidth: colWidths[i] - 4
      });
      xPos += colWidths[i];
    });
    
    // Draw cell borders
    doc.setLineWidth(0.1);
    xPos = margin;
    rowData.forEach((_, i) => {
      doc.line(xPos, y - 4, xPos, y + 4);
      xPos += colWidths[i];
    });
    doc.line(xPos, y - 4, xPos, y + 4); // Last vertical line
    doc.line(margin, y + 4, margin + contentWidth, y + 4); // Bottom line
    
    y += rowHeight;
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
  
  // Personal Information
  addSection('Personal Information');
  addField('Medical Record Number (MRN)', recipient.mrn || 'N/A');
  addField('National ID Number', recipient.national_id || 'N/A');
  addField('Full Name', recipient.full_name || 'N/A');
  addField('Age', recipient.age || 'N/A');
  addField('Blood Type', recipient.blood_type || 'N/A');
  addField('Mobile Number', recipient.mobile_number || 'N/A');

  // HLA Typing Requirements
  addSection('HLA Typing Requirements');
  addField('HLA-A Typing', recipient.hla_typing?.hla_a || 'N/A');
  addField('HLA-B Typing', recipient.hla_typing?.hla_b || 'N/A');
  addField('HLA-C Typing', recipient.hla_typing?.hla_c || 'N/A');
  addField('HLA-DR Typing', recipient.hla_typing?.hla_dr || 'N/A');
  addField('HLA-DQ Typing', recipient.hla_typing?.hla_dq || 'N/A');
  addField('HLA-DP Typing', recipient.hla_typing?.hla_dp || 'N/A');
  addField('Unacceptable Antigens', recipient.donor_antibodies || 'None');
  addField('Panel Reactive Antibody (PRA) %', recipient.pra ? `${recipient.pra}%` : 'N/A');
  addField('Crossmatch Requirement', recipient.crossmatch_requirement || 'N/A');
  addField('Donor-Specific Antibodies', recipient.donor_antibodies || 'None');

  // Medical Information
  addSection('Medical Information');
  addField('Medical History', recipient.medical_history || 'N/A');
  addField('Serum Creatinine (mg/dL)', recipient.serum_creatinine || 'N/A');
  addField('eGFR', recipient.egfr || 'N/A');
  addField('Blood Pressure', recipient.blood_pressure || 'N/A');
  addField('Viral Screening Results', recipient.viral_screening || 'N/A');
  addField('CMV Status', recipient.cmv_status || 'N/A');
  addField('Recipient Notes', recipient.notes || 'N/A');

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
        if (index === 0) { // Only for the highest compatible donor
          checkPageSpace(60);
          
          addSection('Highest Compatible Donor');
          
          // Personal Information
          addSection('Personal Information');
          addField('Medical Record Number (MRN)', result.donor.mrn || 'N/A');
          addField('National ID Number', result.donor.national_id || 'N/A');
          addField('Full Name', result.donor.full_name || 'N/A');
          addField('Age', result.donor.age || 'N/A');
          addField('Blood Type', result.donor.blood_type || 'N/A');
          addField('Mobile Number', result.donor.mobile_number || 'N/A');

          // HLA Typing Information
          addSection('HLA Typing Information');
          addField('HLA-A Typing', result.donor.hla_typing?.hla_a || 'N/A');
          addField('HLA-B Typing', result.donor.hla_typing?.hla_b || 'N/A');
          addField('HLA-C Typing', result.donor.hla_typing?.hla_c || 'N/A');
          addField('HLA-DR Typing', result.donor.hla_typing?.hla_dr || 'N/A');
          addField('HLA-DQ Typing', result.donor.hla_typing?.hla_dq || 'N/A');
          addField('HLA-DP Typing', result.donor.hla_typing?.hla_dp || 'N/A');

          // Medical Information
          addSection('Medical Information');
          addField('Medical History', result.donor.medical_conditions || 'N/A');
          addField('Serum Creatinine (mg/dL)', result.donor.serum_creatinine || 'N/A');
          addField('eGFR', result.donor.egfr || 'N/A');
          addField('Blood Pressure', result.donor.blood_pressure || 'N/A');
          addField('Viral Screening Results', result.donor.viral_screening || 'N/A');
          addField('CMV Status', result.donor.cmv_status || 'N/A');

          // Compatibility Information
          addSection('Compatibility Information');
          addField('Compatibility Score', `${(result.compatibilityScore * 100).toFixed(1)}%`);
          addField('HLA Matches', `${result.matchDetails.hlaMatches}/12`);
          addField('Crossmatch Result', result.donor.crossmatch_result || 'N/A');
          addField('DSA Status', result.donor.donor_antibodies ? 'Detected' : 'Not Detected');

          y += 10; // Extra space after highest compatible donor
        }

        // Basic donor information for all compatible donors
        checkPageSpace(60);
        
        // Donor header with score
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const donorHeader = `${index + 1}. ${result.donor.full_name || 'N/A'} - Score: ${(result.compatibilityScore * 100).toFixed(1)}%`;
        doc.text(donorHeader, margin, y);
        y += 10;

        // Basic Information
        addDetailField('Blood Type', `${result.donor.blood_type || 'N/A'} (Compatible)`, '#22c55e');
        addDetailField('HLA Matches', `${result.matchDetails.hlaMatches}/12 matches`);
        addDetailField('Crossmatch', result.donor.crossmatch_result || 'N/A', 
          result.matchDetails.crossmatchCompatible ? '#22c55e' : '#ef4444');
        addDetailField('National ID', result.donor.national_id || 'N/A');
        addDetailField('MRN', result.donor.mrn || 'N/A');
        addDetailField('Mobile Number', result.donor.mobile_number || 'N/A');
        
        // DSA Information
        const dsaText = result.donor.donor_antibodies
          ? 'Detected'
          : 'Not Detected';
        addDetailField('DSA Status', dsaText, 
          result.donor.donor_antibodies ? '#eab308' : '#22c55e');
        
        // Medical Information
        addDetailField('CMV Status', `${result.donor.cmv_status || 'N/A'} (Recipient: ${recipient.cmv_status || 'N/A'})`);
        addDetailField('Serum Creatinine', `${result.donor.serum_creatinine || 'N/A'} mg/dL`);
        addDetailField('eGFR', `${result.donor.egfr || 'N/A'} mL/min/1.73m²`);
        addDetailField('Blood Pressure', result.donor.blood_pressure || 'N/A');
        addDetailField('Medical History', result.donor.medical_conditions || 'N/A');
        
        // HLA Typing Comparison
        y += 3;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('HLA Typing Comparison:', margin + 5, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
        
        const hlaComparison = [
          { locus: 'A', donor: result.donor.hla_typing?.hla_a, recipient: recipient.hla_typing?.hla_a },
          { locus: 'B', donor: result.donor.hla_typing?.hla_b, recipient: recipient.hla_typing?.hla_b },
          { locus: 'C', donor: result.donor.hla_typing?.hla_c, recipient: recipient.hla_typing?.hla_c },
          { locus: 'DR', donor: result.donor.hla_typing?.hla_dr, recipient: recipient.hla_typing?.hla_dr },
          { locus: 'DQ', donor: result.donor.hla_typing?.hla_dq, recipient: recipient.hla_typing?.hla_dq },
          { locus: 'DP', donor: result.donor.hla_typing?.hla_dp, recipient: recipient.hla_typing?.hla_dp }
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

  // Other Donors Summary with enhanced table
  if (incompatibleDonors.length > 0 || excludedDonors.length > 0) {
    checkPageSpace(50);
    addSection('Other Donors Summary');
    
    const headers = ['Donor Name', 'MRN', 'National ID', 'Blood Type', 'Status', 'Reason'];
    const colWidths = [40, 30, 30, 25, 30, 45];
    
    drawTableHeader(headers, colWidths);

    [...incompatibleDonors, ...excludedDonors].forEach((result) => {
      checkPageSpace(10);
      
      const rowData = [
        result.donor.full_name || 'N/A',
        result.donor.mrn || 'N/A',
        result.donor.national_id || 'N/A',
        result.donor.blood_type || 'N/A',
        result.matchDetails.hasUnacceptableAntigens ? 'Excluded' : 'Incompatible',
        result.matchDetails.excludedReason || 'Incompatible match'
      ];

      drawTableRow(rowData, colWidths);
    });
    
    y += 5; // Add some space after the table
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