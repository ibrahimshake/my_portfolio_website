import { jsPDF } from 'jspdf';
import type { Profile, ResumeData, Experience } from '../types';

export function generateResumePDF(
  profile: Profile | null,
  resume: ResumeData | null,
  experience: Experience[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // 1. HEADER
  const fullName = profile?.fullName || 'Ibrahim Shake Shuvo';
  const title = profile?.title || 'B2B Lead Generation & Data Scraping Specialist';
  const email = profile?.email || 'ibrahimshakeshuvo6@gmail.com';
  const location = profile?.location || 'Remote / Global (UTC+6)';
  const status = profile?.availabilityStatus || 'Available for Projects';
  const linkedin = profile?.linkedin || 'linkedin.com/in/ibrahimshakeshuvo';

  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39); // Zinc 900
  doc.text(fullName, margin, y + 18);
  y += 26;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text(title.toUpperCase(), margin, y + 10);
  y += 18;

  // Contact Info Strip
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99); // Zinc 600
  const contactText = `${email}   |   ${location}   |   ${status}   |   ${linkedin}`;
  const splitContact = doc.splitTextToSize(contactText, contentWidth);
  doc.text(splitContact, margin, y + 9);
  y += splitContact.length * 12 + 8;

  // Horizontal Rule
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.75);
  doc.line(margin, y, margin + contentWidth, y);
  y += 14;

  // Helper Section Header
  const renderSectionHeader = (headerText: string) => {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(5, 150, 105); // Emerald
    doc.text(headerText.toUpperCase(), margin, y + 10);
    y += 14;

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 10;
  };

  // 2. EXECUTIVE SUMMARY
  renderSectionHeader('Executive Summary');
  const summaryText =
    resume?.summary ||
    profile?.shortBio ||
    'Dedicated B2B Lead Generation & Web Data Scraping specialist with deep experience in building automated extraction workflows, browser automation routines with Playwright and Selenium, and delivering high-accuracy, verified B2B prospect lists.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(31, 41, 55); // Zinc 800
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, margin, y + 10);
  y += summaryLines.length * 13 + 12;

  // 3. CORE COMPETENCIES
  renderSectionHeader('Core Competencies & Technical Skills');
  const skillsList = [
    'Python 3 & Concurrency (asyncio)',
    'Playwright Browser Automation',
    'Selenium & SeleniumBase Stealth',
    'Google Maps Lead Extraction',
    'B2B Email & MX Record Verification',
    'Pandas Data Cleaning & Deduplication',
    'Excel / CSV Standardization',
    'Proxy Rotation & Anti-Bot Navigation',
    'E-Commerce & Directory Scraping'
  ];

  const colWidth = contentWidth / 3;
  let skillRowHeight = 15;
  for (let i = 0; i < skillsList.length; i += 3) {
    checkPageBreak(skillRowHeight);
    for (let c = 0; c < 3; c++) {
      const idx = i + c;
      if (idx < skillsList.length) {
        const xPos = margin + c * colWidth;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(5, 150, 105);
        doc.text('•', xPos, y + 10);
        doc.setTextColor(31, 41, 55);
        doc.text(skillsList[idx], xPos + 10, y + 10);
      }
    }
    y += skillRowHeight;
  }
  y += 8;

  // 4. PROFESSIONAL EXPERIENCE
  if (experience && experience.length > 0) {
    renderSectionHeader('Professional Experience');

    for (const exp of experience) {
      checkPageBreak(50);
      // Position and Company
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(exp.position, margin, y + 10);

      // Date right-aligned
      const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128);
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, margin + contentWidth - dateWidth, y + 10);
      y += 13;

      // Company
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(5, 150, 105);
      doc.text(exp.company, margin, y + 8);
      y += 13;

      // Description
      if (exp.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        const descLines = doc.splitTextToSize(exp.description, contentWidth);
        checkPageBreak(descLines.length * 12);
        doc.text(descLines, margin, y + 8);
        y += descLines.length * 12 + 4;
      }

      // Responsibilities
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        for (const resp of exp.responsibilities) {
          const bulletLines = doc.splitTextToSize(resp, contentWidth - 14);
          checkPageBreak(bulletLines.length * 12);
          doc.setTextColor(5, 150, 105);
          doc.text('•', margin + 2, y + 8);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(55, 65, 81);
          doc.text(bulletLines, margin + 14, y + 8);
          y += bulletLines.length * 12 + 2;
        }
      }

      y += 10;
    }
  }

  // 5. EDUCATION & CERTIFICATIONS
  const educationList = resume?.education && resume.education.length > 0
    ? resume.education
    : [{ degree: 'Bachelor of Science in Computer Science / IT', institution: 'University Program', year: '2022' }];

  const certList = resume?.certifications && resume.certifications.length > 0
    ? resume.certifications
    : [
        'Python for Data Science & Automation',
        'Playwright End-to-End Automation Specialist',
        'Advanced Web Scraping & Anti-Bot Navigation'
      ];

  checkPageBreak(80);
  renderSectionHeader('Education & Certifications');

  const halfWidth = (contentWidth - 20) / 2;

  // Education column (Left)
  let eduY = y;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  doc.text('Education', margin, eduY + 8);
  eduY += 14;

  for (const edu of educationList) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(31, 41, 55);
    doc.text(edu.degree, margin, eduY + 8);
    eduY += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`${edu.institution} (${edu.year})`, margin, eduY + 8);
    eduY += 13;
  }

  // Certifications column (Right)
  let certY = y;
  const certX = margin + halfWidth + 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  doc.text('Certifications', certX, certY + 8);
  certY += 14;

  for (const cert of certList) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 150, 105);
    doc.text('✓', certX, certY + 8);
    doc.setTextColor(31, 41, 55);
    doc.text(cert, certX + 12, certY + 8);
    certY += 13;
  }

  y = Math.max(eduY, certY) + 16;

  // Footer Note on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    const footerText = `${fullName} — Professional Resume | Page ${i} of ${totalPages}`;
    doc.text(footerText, margin, pageHeight - 20);
  }

  // Sanitize filename
  const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanName}_Resume.pdf`);
}
