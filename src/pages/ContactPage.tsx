import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Clock, 
  ShieldCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import type { Profile } from '../types';
import { api } from '../lib/api';

interface ContactPageProps {
  profile: Profile | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      await api.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to deliver message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
          Direct Communication
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Initiate a Project Discussion
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Need targeted B2B contact lists, a custom web scraper, or automated QA testing? Submit your requirements below for a prompt feasibility assessment and sample data proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>Send a Message</span>
            </h2>

            {success ? (
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/30 space-y-3 text-center">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-zinc-100">Message Received!</h3>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out. Your inquiry has been securely stored in my PostgreSQL database. I will review your project requirements and reply to your email within 12-24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                  <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/30 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300 block">
                      Your Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300 block">
                      Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@company.com"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Subject / Project Niche
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Google Maps lead generation for UK electrical contractors"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300 block">
                    Project Details & Target Criteria <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your target audience, required columns (e.g. phone, website, owner email), preferred formats, and volume requirements..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Submitting...' : 'Send Message to Ibrahim'}</span>
                </button>

              </form>
            )}

          </div>
        </div>

        {/* Right Info Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
            <h3 className="text-base font-bold text-zinc-100">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-zinc-300">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[11px] block">Direct Email</span>
                  <a href={`mailto:${profile?.email || 'ibrahimshakeshuvo6@gmail.com'}`} className="text-zinc-100 hover:text-emerald-400 font-semibold break-all">
                    {profile?.email || 'ibrahimshakeshuvo6@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[11px] block">Location & Timezone</span>
                  <span className="text-zinc-100 font-semibold">
                    {profile?.location || 'Remote / Worldwide (UTC+6)'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[11px] block">Response Commitment</span>
                  <span className="text-zinc-100 font-semibold">
                    Replies within 12 to 24 hours
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span>Confidentiality Assured</span>
              </div>
              <p className="leading-relaxed">
                Client criteria and target databases are kept strictly confidential. Non-Disclosure Agreements (NDAs) supported upon request.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
