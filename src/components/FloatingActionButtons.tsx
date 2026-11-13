import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ACADEMY_INFO } from '../data/academyData';

export const FloatingActionButtons: React.FC = () => {
  return (
    <>
      {/* Bottom-left Admissions Open Floating Pill */}
      <a
        href="#apply"
        className="fixed left-4 bottom-5 z-40 hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E8202A] text-white font-extrabold text-xs shadow-xl hover:bg-[#c91821] hover:scale-105 transition-all duration-300 border-2 border-white/50 group"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Admissions Open 2026</span>
      </a>

      {/* Bottom-right Floating WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enquire%20about%20admissions%20at%20AI%20Computer%20Academy.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-4 sm:right-6 bottom-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 hover:bg-[#20bd5a] transition-all duration-300 border-2 border-white/80 group"
        title={`Chat with Student Desk on WhatsApp (${ACADEMY_INFO.officialStudentPhone})`}
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
        <MessageCircle className="w-7 h-7 fill-white stroke-[#25D366]" />
      </a>
    </>
  );
};
