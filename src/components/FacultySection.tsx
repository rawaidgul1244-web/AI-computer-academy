import React from 'react';
import { Award, ShieldCheck, Sparkles, BookOpen, UserCheck } from 'lucide-react';
import { ACADEMY_INFO, FACULTY_DATA } from '../data/academyData';
import { motion } from 'motion/react';

export const FacultySection: React.FC = () => {
  return (
    <section id="teachers" className="py-20 bg-[#0B2A5B] text-white relative overflow-hidden">
      {/* Background glow and subtle dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Academic Excellence
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Meet Our Expert Mentors
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Registered with KP-TTB. Learn from qualified educators, MPhil degree holders, and industry certified practitioners dedicated to teaching practical skills in Swabi.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FACULTY_DATA.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 group hover:-translate-y-1 shadow-xl"
            >
              <div>
                {/* Avatar Badge */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${teacher.gradient} flex items-center justify-center text-4xl shadow-lg border-2 border-white/20 group-hover:scale-105 transition`}>
                    {teacher.icon}
                  </div>
                  {teacher.certification && (
                    <span className="text-[11px] font-bold uppercase tracking-wide bg-[#E8202A] text-white px-3 py-1 rounded-full shadow-xs">
                      {teacher.certification}
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold font-heading text-white group-hover:text-sky-300 transition">
                  {teacher.name}
                </h3>
                <div className="text-xs font-semibold text-amber-300 mt-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{teacher.qualification}</span>
                </div>
                <div className="text-xs text-sky-200 font-medium mt-0.5">
                  {teacher.role}
                </div>

                {/* Bio */}
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {teacher.bio}
                </p>

                {/* Specialties Tags */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Domains &amp; Courses:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/10 text-slate-200 border border-white/5"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Instructor Badge */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <UserCheck className="w-3.5 h-3.5" /> Verified Instructor
                </span>
                <span className="font-mono text-[11px]">AI Computer Academy</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admissions quote banner */}
        <div className="mt-14 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 sm:p-8 text-center text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h4 className="text-xl font-extrabold font-heading">
              Want guidance on which course fits your career goals?
            </h4>
            <p className="text-xs sm:text-sm text-red-100">
              Speak directly with our academic counselors and faculty in Manki, Swabi.
            </p>
          </div>
          <a
            href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=Assalam-o-Alaikum%2C%20I%20want%20to%20discuss%20course%20recommendations%20with%20faculty.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-700 font-bold text-sm rounded-xl shadow-lg hover:bg-slate-50 transition shrink-0"
          >
            <span>Ask Faculty on WhatsApp ({ACADEMY_INFO.officialStudentPhone})</span>
          </a>
        </div>
      </div>
    </section>
  );
};
