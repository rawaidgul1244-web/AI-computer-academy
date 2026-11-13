import React from 'react';
import { Check, Monitor, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { WHY_CHOOSE_US } from '../data/academyData';

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E5BD8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Our Edge &amp; Standards
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-[#0B2A5B] tracking-tight">
            Why Choose AI Computer Academy?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Registered with KP-TTB. Skills first. Every single course ends with a practical project portfolio you can show an employer, freelancing client, or interview panel.
          </p>
        </div>

        {/* 8 Feature Cards Grid with motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-[#1E5BD8]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-[#1E5BD8] transition duration-300">
                {item.icon}
              </div>
              <h3 className="mt-4 font-heading font-bold text-base text-[#0B2A5B] group-hover:text-[#1E5BD8] transition">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Lab Facilities Feature Strip */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#0B2A5B] to-[#1E5BD8] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <Monitor className="w-72 h-72" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-sky-200 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              State-of-the-Art Learning Environment
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading">
              A Modern Computer Lab Designed for Practical Work
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              We never crowd three students around a single computer. At AI Computer Academy, each student is assigned an individual workstation equipped with high-speed SSDs, dual operating systems (Windows &amp; Kali Linux), high-speed fiber internet, and continuous solar/UPS power backup to ensure zero downtime.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-sky-100">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Check className="w-4 h-4 text-emerald-400" /> 100% Uninterrupted UPS Backup
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Check className="w-4 h-4 text-emerald-400" /> High-Speed Dedicated Internet
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Check className="w-4 h-4 text-emerald-400" /> Monday to Thursday (Evening Time: 3:00 PM – 7:00 PM)
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Check className="w-4 h-4 text-emerald-400" /> Separate Female Timing Slots
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
