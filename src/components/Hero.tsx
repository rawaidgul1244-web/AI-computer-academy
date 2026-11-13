import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Award, Clock, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { ACADEMY_INFO } from '../data/academyData';
import { calculateBatchCountdown } from '../utils/academy';

interface HeroProps {
  onExploreCourses: () => void;
  onApplyClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onApplyClick }) => {
  const [countdown, setCountdown] = useState(() =>
    calculateBatchCountdown(ACADEMY_INFO.nextBatchDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateBatchCountdown(ACADEMY_INFO.nextBatchDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#0B2A5B] via-[#103E82] to-[#1E5BD8] text-white">
      {/* Decorative background grid and soft radial lights */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines, Slogan, and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>&ldquo;A degree without skill is just a piece of paper&rdquo;</span>
            </div>

            {/* Main Punchy Angled Title */}
            <div>
              <div className="inline-block bg-[#E8202A] text-white font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-5xl px-5 py-2.5 transform -skew-x-6 shadow-xl rounded-sm tracking-wide">
                <span className="transform skew-x-6 inline-block">LEARN, BUILD &amp; GROW</span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Practical Computer &amp; Digital Skills in <span className="text-sky-300 underline decoration-red-500 underline-offset-8">Manki, Swabi</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Empowering youth with job-ready tech skills. Practical, hands-on training in{' '}
              <strong className="text-white font-semibold">DIT, Cyber Security, Data Analysis, Generative AI</strong>, and{' '}
              <strong className="text-white font-semibold">Spoken English</strong> in an air-conditioned modern computer lab.
            </p>

            {/* Key feature pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-200">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Registered with KP-TTB
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Calendar className="w-4 h-4 text-amber-300" /> Mon to Thu (Evening Time)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1:1 Student Computer Ratio
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Award className="w-4 h-4 text-amber-400" /> Certified MPhil Faculty
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#apply"
                onClick={onApplyClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-[#E8202A] hover:bg-[#c91821] rounded-xl shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#courses"
                onClick={onExploreCourses}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl backdrop-blur-sm transition"
              >
                <span>Explore 10+ Courses</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card + Next Batch Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Visual Logo Card */}
            <div className="relative mx-auto max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-white/20 transform transition hover:scale-101">
              <div className="absolute -top-3.5 right-6 bg-[#E8202A] text-white text-xs font-black uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md">
                Registered with KP-TTB
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-full flex items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    src="/logo.png"
                    alt="AI Computer Academy Emblem"
                    className="max-h-44 sm:max-h-52 w-auto object-contain"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
                  <h3 className="text-[#0B2A5B] font-extrabold text-lg sm:text-xl font-heading">
                    AI COMPUTER ACADEMY
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    Registered with KP-TTB • Manki, Swabi
                  </p>
                  <p className="text-xs italic text-[#E8202A] font-medium mt-1">
                    &ldquo;{ACADEMY_INFO.tagline}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Live Next Batch Countdown Widget (Starts 3 Months After) */}
            <div className="bg-slate-900/70 backdrop-blur-md border border-white/15 rounded-xl p-4 sm:p-5 shadow-xl text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Next Admission Batch Starts In (3 Months After)</span>
              </div>
              <p className="text-[11px] text-sky-200 mb-2.5 font-medium">
                Evening Batch • Classes from Monday to Thursday (3:00 PM – 7:00 PM)
              </p>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-slate-900">
                <div className="bg-white rounded-lg py-2 px-1 shadow">
                  <span className="block font-black text-xl sm:text-2xl font-heading text-[#0B2A5B]">
                    {countdown.days}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Days</span>
                </div>
                <div className="bg-white rounded-lg py-2 px-1 shadow">
                  <span className="block font-black text-xl sm:text-2xl font-heading text-[#0B2A5B]">
                    {countdown.hours}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Hours</span>
                </div>
                <div className="bg-white rounded-lg py-2 px-1 shadow">
                  <span className="block font-black text-xl sm:text-2xl font-heading text-[#0B2A5B]">
                    {countdown.minutes}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Min</span>
                </div>
                <div className="bg-white rounded-lg py-2 px-1 shadow">
                  <span className="block font-black text-xl sm:text-2xl font-heading text-[#E8202A]">
                    {countdown.seconds}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Sec</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mt-2.5">
                Limited seats per batch to guarantee 1:1 computer access.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Row (Students trained: 50+) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 pt-10 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {ACADEMY_INFO.stats.map((stat) => (
            <div key={stat.label} className="p-3 bg-white/5 rounded-xl backdrop-blur-xs border border-white/5 hover:bg-white/10 transition">
              <div className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                {stat.value}
                <span className="text-amber-400">{stat.suffix}</span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
