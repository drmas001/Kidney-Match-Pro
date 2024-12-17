import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Database } from '@/types/supabase';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
    lastAutoTable: { finalY: number };
  }
}

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
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page dimensions and margins
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  
  let y = margin;
  const headerHeight = 25;
  const footerHeight = 15;
  let pageNumber = 1;

  // Helper functions
  const addHeader = () => {
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Kidney Match Report', pageWidth / 2, 10, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${format(new Date(timestamp), 'PPpp')}`, pageWidth / 2, 18, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  };

  const addFooter = () => {
    const footerY = pageHeight - footerHeight;
    doc.setFillColor(245, 245, 245);
    doc.rect(0, footerY, pageWidth, footerHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This report is for medical professional use only. All matches should be verified by laboratory testing.', pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text(`Page ${pageNumber}`, pageWidth - margin, footerY + 5, { align: 'right' });
    pageNumber++;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin - footerHeight) {
      addFooter();
      doc.addPage();
      addHeader();
      y = margin + headerHeight;
      return true;
    }
    return false;
  };

  const addSection = (title: string) => {
    checkPageBreak(20);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text(title, margin + 2, y + 2);
    const titleWidth = doc.getTextWidth(title);
    doc.setLineWidth(0.5);
    doc.line(margin + 2, y + 4, margin + 2 + titleWidth, y + 4);
    y += 12;
    doc.setTextColor(0, 0, 0);
  };

  const addField = (label: string, value: string | number, color?: string) => {
    checkPageBreak(8);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', margin + 2, y);
    doc.setFont('helvetica', 'normal');
    if (color) {
      const rgb = hexToRgb(color);
      if (rgb) doc.setTextColor(rgb.r, rgb.g, rgb.b);
    }
    doc.text(String(value), margin + 75, y);
    doc.setTextColor(0, 0, 0);
    y += 6;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Start generating the report
  addHeader();
  y = margin + headerHeight + 5;

  // Recipient Information
  addSection('Recipient Information');
  
  // Personal Information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Information', margin + 2, y);
  y += 8;

  const personalInfo = [
    { label: 'Full Name', value: recipient.full_name },
    { label: 'MRN', value: recipient.mrn },
    { label: 'National ID', value: recipient.national_id },
    { label: 'Age', value: recipient.age },
    { label: 'Blood Type', value: recipient.blood_type },
    { label: 'Mobile Number', value: recipient.mobile_number }
  ];

  personalInfo.forEach(info => {
    addField(info.label, info.value || 'N/A');
  });

  // HLA Typing
  addSection('HLA Typing Information');
  
  const hlaInfo = [
    { label: 'HLA-A', value: recipient.hla_typing?.hla_a },
    { label: 'HLA-B', value: recipient.hla_typing?.hla_b },
    { label: 'HLA-C', value: recipient.hla_typing?.hla_c },
    { label: 'HLA-DR', value: recipient.hla_typing?.hla_dr },
    { label: 'HLA-DQ', value: recipient.hla_typing?.hla_dq },
    { label: 'HLA-DP', value: recipient.hla_typing?.hla_dp }
  ];

  hlaInfo.forEach(info => {
    addField(info.label, info.value || 'N/A');
  });

  // Medical Information
  addSection('Medical Information');

  const medicalInfo = [
    { label: 'Medical History', value: recipient.medical_history },
    { label: 'Serum Creatinine', value: recipient.serum_creatinine ? `${recipient.serum_creatinine} mg/dL` : 'N/A' },
    { label: 'eGFR', value: recipient.egfr ? `${recipient.egfr} mL/min/1.73m²` : 'N/A' },
    { label: 'Blood Pressure', value: recipient.blood_pressure },
    { label: 'Viral Screening', value: recipient.viral_screening },
    { label: 'CMV Status', value: recipient.cmv_status }
  ];

  medicalInfo.forEach(info => {
    addField(info.label, info.value || 'N/A');
  });

  // Matching Summary
  addSection('Matching Summary');

  const compatibleDonors = results.filter(r => !r.matchDetails.hasUnacceptableAntigens && r.compatibilityScore > 0);
  const incompatibleDonors = results.filter(r => r.compatibilityScore === 0 && !r.matchDetails.hasUnacceptableAntigens);
  const excludedDonors = results.filter(r => r.matchDetails.hasUnacceptableAntigens);

  // Summary statistics with colored indicators
  addField('Total Donors', results.length.toString());
  addField('Compatible Donors', compatibleDonors.length.toString(), '#22c55e');
  addField('Incompatible Donors', incompatibleDonors.length.toString(), '#eab308');
  addField('Excluded Donors', excludedDonors.length.toString(), '#ef4444');

  if (compatibleDonors.length > 0) {
    const bestScore = Math.max(...compatibleDonors.map(r => r.compatibilityScore));
    addField('Best Match Score', `${(bestScore * 100).toFixed(1)}%`, '#22c55e');
  }

  // Compatible Donors Details
  if (compatibleDonors.length > 0) {
    addSection('Compatible Donors');

    compatibleDonors
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .forEach((result, index) => {
        checkPageBreak(40);
        
        // Donor header with score
        doc.rect(margin, y - 2, contentWidth, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(
          `${index + 1}. ${result.donor.full_name || 'N/A'} - Match Score: ${(result.compatibilityScore * 100).toFixed(1)}%`,
          margin + 2,
          y + 5
        );
        y += 15;

        // Donor details in two columns
        const leftColumn = [
          { label: 'Blood Type', value: `${result.donor.blood_type} (Compatible)`, color: '#22c55e' },
          { label: 'HLA Matches', value: `${result.matchDetails.hlaMatches}/12` },
          { label: 'Crossmatch', value: result.donor.crossmatch_result || 'N/A' },
          { label: 'Age', value: result.donor.age || 'N/A' }
        ];

        const rightColumn = [
          { label: 'MRN', value: result.donor.mrn || 'N/A' },
          { label: 'National ID', value: result.donor.national_id || 'N/A' },
          { label: 'Mobile', value: result.donor.mobile_number || 'N/A' },
          { label: 'CMV Status', value: result.donor.cmv_status || 'N/A' }
        ];

        const startY = y;
        leftColumn.forEach(item => {
          addField(item.label, item.value, item.color);
        });

        y = startY;
        rightColumn.forEach(item => {
          doc.text(item.label + ':', margin + contentWidth/2, y);
          doc.text(String(item.value), margin + contentWidth/2 + 40, y);
          y += 6;
        });

        y += 10;
      });
  }

  // Other Donors Table
  if (incompatibleDonors.length > 0 || excludedDonors.length > 0) {
    addSection('Other Donors');
    
    const tableHeaders = [
      { header: 'Donor Name', width: 40 },
      { header: 'Blood Type', width: 25 },
      { header: 'Status', width: 30 },
      { header: 'Reason', width: 65 }
    ];

    const tableRows = [...incompatibleDonors, ...excludedDonors].map(result => [
      result.donor.full_name || 'N/A',
      result.donor.blood_type || 'N/A',
      result.matchDetails.hasUnacceptableAntigens ? 'Excluded' : 'Incompatible',
      result.matchDetails.excludedReason || 'Incompatible match'
    ]);

    doc.autoTable({
      startY: y,
      head: [tableHeaders.map(h => h.header)],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [75, 85, 99],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: tableHeaders[0].width },
        1: { cellWidth: tableHeaders[1].width },
        2: { cellWidth: tableHeaders[2].width },
        3: { cellWidth: tableHeaders[3].width }
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: margin, right: margin }
    } as UserOptions);

    y = doc.lastAutoTable.finalY + 10;
  }

  // Add final footer
  addFooter();

  return doc;
}

export function printReport() {
  window.print();
}
