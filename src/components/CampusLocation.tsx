import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { ACADEMY_INFO } from '../data/academyData';

export const CampusLocation: React.FC = () => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactInfo.trim() || !message.trim()) return;

    // Build WhatsApp direct message link
    const text = `Assalam-o-Alaikum! My name is ${name} (${contactInfo}). Inquiry: ${message}`;
    const url = `https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    setIsSent(true);
    setName('');
    setContactInfo('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E5BD8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Reach Out to Us
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-[#0B2A5B] tracking-tight">
            Contact &amp; Campus Location
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Visit our modern computer lab in Manki, Swabi or get in touch through phone and WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Inquiry Form */}
          <div className="lg:col-span-6 space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E5BD8] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-[#0B2A5B]">Campus Address</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Near Government Degree College (GDC) Lahore, Manki, District Swabi, KPK, Pakistan
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-[#0B2A5B]">Classes &amp; Schedule</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Monday to Thursday</strong> (Mon – Thu)<br />
                  <span className="text-[#1E5BD8] font-bold">Evening Time (3:00 PM – 7:00 PM)</span><br />
                  Registered with KP-TTB
                </p>
              </div>
            </div>

            {/* Direct Phone Numbers list */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B2A5B] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#1E5BD8]" />
                  Contact Hotlines &amp; WhatsApp:
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Direct Student Support
                </span>
              </div>

              {/* Highlight Official Number for Students Contact */}
              <div className="p-3 bg-white rounded-xl border-2 border-emerald-500/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                    Official Number for Students Contact &amp; WhatsApp
                  </span>
                  <a
                    href="tel:03151234695"
                    className="text-base font-black font-mono text-[#0B2A5B] hover:text-[#1E5BD8]"
                  >
                    0315 1234695
                  </a>
                </div>
                <a
                  href="https://wa.me/923151234695"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                >
                  WhatsApp
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                <a
                  href="tel:03421188506"
                  className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-slate-700 hover:text-[#1E5BD8] hover:border-[#1E5BD8] flex items-center justify-between transition"
                >
                  <div>
                    <span className="block font-mono">0342 1188506</span>
                    <span className="text-[10px] text-slate-400 font-normal">Academy Desk</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">CALL</span>
                </a>

                <a
                  href="tel:03419847946"
                  className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-slate-700 hover:text-[#1E5BD8] hover:border-[#1E5BD8] flex items-center justify-between transition"
                >
                  <div>
                    <span className="block font-mono">0341 9847946</span>
                    <span className="text-[10px] text-slate-400 font-normal">Admissions Office</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">CALL</span>
                </a>

                <a
                  href="tel:03423471747"
                  className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-slate-700 hover:text-[#1E5BD8] hover:border-[#1E5BD8] flex items-center justify-between transition sm:col-span-2"
                >
                  <div>
                    <span className="block font-mono">0342 3471747</span>
                    <span className="text-[10px] text-slate-400 font-normal">General Information Helpline</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">CALL</span>
                </a>
              </div>
              <div className="pt-1 text-xs text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${ACADEMY_INFO.email}`} className="text-[#1E5BD8] hover:underline font-medium">
                  {ACADEMY_INFO.email}
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold font-heading text-sm text-[#0B2A5B]">
                Send an Instant Inquiry Message
              </h4>

              {isSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Inquiry prepared! We opened WhatsApp with your details.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E5BD8]/30"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone or WhatsApp *"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E5BD8]/30"
                    required
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Ask a question about courses, timing, or fees..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E5BD8]/30"
                  required
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E8202A] hover:bg-[#c91821] text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="lg:col-span-6 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-300 shadow-md h-[460px] relative bg-slate-100">
              <iframe
                title="Google Map - AI Computer Academy near GDC Lahore Manki Swabi"
                src="https://www.google.com/maps?q=GDC+Lahore+Manki+Swabi&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>📍 Landmark: Right next to Government Degree College (GDC) Lahore, Manki.</span>
              <a
                href="https://www.google.com/maps?q=GDC+Lahore+Manki+Swabi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1E5BD8] font-bold hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
