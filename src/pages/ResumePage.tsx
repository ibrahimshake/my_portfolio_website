import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Award, 
  Briefcase, 
  CheckCircle,
  ExternalLink,
  Terminal,
  Check,
  FileDown
} from 'lucide-react';
import type { Profile, ResumeData, Experience, Project } from '../types';
import { generateResumePDF } from '../lib/pdfGenerator';

interface ResumePageProps {
  profile: Profile | null;
  resume: ResumeData | null;
  experience: Experience[];
  projects: Project[];
  navigate: (path: string) => void;
}

export const ResumePage: React.FC<ResumePageProps> = ({
  profile,
  resume,
  experience,
  projects,
  navigate
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      generateResumePDF(profile, resume, experience);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback to window print
      try {
        window.print();
      } catch (e) {
        console.error('Print fallback failed:', e);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Browser print blocked or unsupported in frame, generating PDF instead:', err);
      handleDownloadPDF();
    }
  };

  const defaultName = profile?.fullName || 'Ibrahim Shake Shuvo';
  const defaultTitle = profile?.title || 'B2B Lead Generation & Data Scraping Specialist';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 no-print">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Curriculum Vitae
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mt-1">
            Professional Resume
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Verified qualifications, technical proficiencies, and career history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Direct PDF Download */}
          <button
            id="download-resume-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-lg transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-4 w-4 text-zinc-950 stroke-[3]" />
                <span>PDF Downloaded!</span>
              </>
            ) : downloading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF (.pdf)</span>
              </>
            )}
          </button>

          {/* Browser Print / Save Dialog */}
          <button
            id="print-resume-btn"
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4 text-zinc-400" />
            <span>Print View</span>
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-300 bg-zinc-900/60 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <Mail className="h-4 w-4 text-emerald-400" />
            <span>Hire Specialist</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2.5 no-print animate-fade-in">
          <FileDown className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Your resume PDF has been generated and saved to your device.</span>
        </div>
      )}

      {/* Resume Document Canvas (Styled like a modern technical resume) */}
      <div className="resume-paper rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 sm:p-12 space-y-10 shadow-2xl backdrop-blur-sm">
        
        {/* Header Strip */}
        <div className="border-b border-zinc-800 pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              {defaultName}
            </h2>
            <p className="text-sm font-mono text-emerald-400 mt-1">
              {defaultTitle}
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-400 sm:text-right font-mono">
            <div>{profile?.email || 'ibrahimshakeshuvo6@gmail.com'}</div>
            <div>{profile?.location || 'Remote / Worldwide'}</div>
            <div className="text-emerald-400 font-semibold">{profile?.availabilityStatus || 'Available for Projects'}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            <span>Executive Summary</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            {resume?.summary || profile?.shortBio || 
              'Detail-oriented B2B Lead Generation & Web Scraping Specialist with expertise in Python, Playwright, Selenium, and data cleaning. Proven track record of architecting scalable scraping workflows and delivering verified, high-converting B2B prospect lists.'}
          </p>
        </section>

        {/* Core Competencies */}
        <section className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Core Competencies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300">
            {[
              'Python 3 & Concurrency',
              'Playwright Browser Automation',
              'Selenium & SeleniumBase',
              'Google Maps Scraping',
              'B2B Email & MX Verification',
              'Pandas Data Normalization',
              'Excel / CSV Hygiene',
              'Anti-Bot & Proxy Rotation',
              'QA Test Automation'
            ].map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Professional Experience</span>
          </h3>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-2 pb-6 border-b border-zinc-800/60 last:border-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">{exp.position}</h4>
                    <span className="text-xs text-emerald-400">{exp.company}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{exp.description}</p>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="space-y-1.5 pt-2">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Education</span>
            </h3>
            {resume?.education && resume.education.length > 0 ? (
              resume.education.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <h4 className="text-xs font-bold text-zinc-200">{edu.degree}</h4>
                  <p className="text-[11px] text-zinc-400">{edu.institution} ({edu.year})</p>
                  {edu.details && <p className="text-[11px] text-zinc-500">{edu.details}</p>}
                </div>
              ))
            ) : (
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                Bachelor of Science in Computer Science / IT
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Certifications</span>
            </h3>
            <div className="space-y-2">
              {(resume?.certifications && resume.certifications.length > 0 
                ? resume.certifications 
                : [
                    'Python for Data Science & Automation',
                    'Playwright End-to-End Automation Specialist',
                    'Advanced Web Scraping & Anti-Bot Navigation'
                  ]
              ).map((cert, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

    </div>
  );
};
