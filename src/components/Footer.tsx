import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Heart, ArrowUp } from 'lucide-react';
import { ACADEMY_INFO, COURSES_DATA } from '../data/academyData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B2A5B] text-slate-300 pt-16 pb-12 border-t-4 border-[#E8202A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-xl shadow-md border border-white/20">
                <img
                  src="/logo.png"
                  alt="AI Computer Academy"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-black text-lg text-white tracking-tight">
                  AI COMPUTER <span className="text-[#E8202A]">ACADEMY</span>
                </span>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Manki, Swabi
                </p>
              </div>
            </div>

            <p className="text-xs text-amber-300 font-semibold italic">
              &ldquo;{ACADEMY_INFO.tagline}&rdquo;
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students and youth of Swabi with practical computing, cyber security, data intelligence, and English communication skills.
            </p>

            {/* Social badges */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#1E5BD8] flex items-center justify-center text-xs font-bold transition text-white"
                aria-label="Facebook Page"
              >
                f
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-pink-600 flex items-center justify-center text-xs font-bold transition text-white"
                aria-label="Instagram Page"
              >
                ig
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-600 flex items-center justify-center text-xs font-bold transition text-white"
                aria-label="YouTube Channel"
              >
                yt
              </a>
              <a
                href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-xs font-bold transition text-white"
                aria-label="WhatsApp Hotline"
              >
                wa
              </a>
            </div>
          </div>

          {/* Col 2: Featured Courses */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Popular Courses
            </h4>
            <ul className="space-y-2 text-xs">
              {COURSES_DATA.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <a
                    href="#courses"
                    className="hover:text-white transition flex items-center gap-1.5"
                  >
                    <span className="text-[#3FA9F5]">›</span>
                    <span>{c.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-white transition">Home</a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition">All Courses &amp; Syllabi</a>
              </li>
              <li>
                <a href="#why" className="hover:text-white transition">Why Choose AI Academy</a>
              </li>
              <li>
                <a href="#teachers" className="hover:text-white transition">Faculty &amp; Mentors</a>
              </li>
              <li>
                <a href="#apply" className="hover:text-white transition text-[#E8202A] font-bold">Online Admission Form</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">Contact &amp; Location</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office Details */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Campus &amp; Admissions
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Near GDC Lahore, Manki, District Swabi, KPK</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-amber-300 block">Official Student Contact:</span>
                  <a href="tel:03151234695" className="hover:underline font-bold text-white font-mono">
                    0315 1234695
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:03421188506" className="hover:underline text-slate-300 font-mono">
                  0342 1188506 (Desk)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${ACADEMY_INFO.email}`} className="hover:underline break-all">
                  {ACADEMY_INFO.email}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="#apply"
                  className="inline-block px-4 py-2 bg-[#E8202A] hover:bg-[#c91821] text-white font-bold text-xs rounded-lg transition shadow"
                >
                  Apply Online (Next Batch in 3 Months)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} AI Computer Academy, Manki Swabi. Registered with KP-TTB.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-semibold">Registered with KP-TTB • Classes: Mon to Thu (Evening)</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
