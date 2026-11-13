import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, GraduationCap, MapPin, ClipboardList } from 'lucide-react';
import { ACADEMY_INFO } from '../data/academyData';

interface NavbarProps {
  onOpenPortal: () => void;
  onSelectCourseForApply?: (courseName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPortal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Courses', href: '#courses' },
    { label: 'Why Us', href: '#why' },
    { label: 'Faculty', href: '#teachers' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top emergency / notice ticker bar */}
      <div className="bg-[#0B2A5B] text-white text-xs border-b border-blue-900/50 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Registered with KP-TTB • Next Batch in 3 Months (Mon–Thu Evening)
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              Near GDC Lahore, Manki, Swabi
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${ACADEMY_INFO.officialStudentPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white transition"
              title="Official Students Contact"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span className="text-slate-400 text-[11px] hidden sm:inline">Students Hotline:</span>
              <span className="font-bold text-amber-300">{ACADEMY_INFO.officialStudentPhone}</span>
            </a>
            <span className="text-slate-500">|</span>
            <button
              onClick={onOpenPortal}
              className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 underline font-medium cursor-pointer"
            >
              <ClipboardList className="w-3 h-3" />
              <span>Track / Google Sheet Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main sticky header */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'py-2 shadow-md' : 'py-3.5 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a href="#home" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-1 bg-white shadow-sm transition transform group-hover:scale-102">
              <img
                src="/logo.png"
                alt="AI Computer Academy"
                className={`transition-all duration-300 object-contain ${
                  isScrolled ? 'h-11 w-auto' : 'h-13 w-auto'
                }`}
                onError={(e) => {
                  // Fallback visual if logo fails to render
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl sm:text-2xl text-[#0B2A5B] tracking-tight font-heading">
                  AI COMPUTER <span className="text-[#E8202A]">ACADEMY</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 tracking-wider uppercase">
                Manki, Swabi • KP, Pakistan
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-[#1E5BD8] transition relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#1E5BD8] after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=Assalam-o-Alaikum%20AI%20Computer%20Academy%2C%20I%20want%20to%20enquire%20about%20admissions.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Desk</span>
            </a>

            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#E8202A] hover:bg-[#c91821] rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Apply Online</span>
            </a>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#1E5BD8] rounded-md transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 grid gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                <ClipboardList className="w-4 h-4 text-[#1E5BD8]" />
                <span>Track My Admission Form</span>
              </button>

              <a
                href="#apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#E8202A] hover:bg-[#c91821] rounded-lg shadow"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Apply Online for Admission</span>
              </a>

              <a
                href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp ({ACADEMY_INFO.officialStudentPhone})</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
