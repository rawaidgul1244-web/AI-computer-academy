import React from 'react';
import { X, Clock, Award, CheckCircle, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { Course } from '../types/academy';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onApply: (courseName: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onApply }) => {
  if (!course) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0B2A5B] to-[#1E5BD8] text-white p-6 sm:p-7 rounded-t-2xl flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{course.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-sky-200">
                {course.categoryLabel}
              </span>
              {course.highlightBadge && (
                <span className="text-xs font-bold uppercase bg-[#E8202A] px-2.5 py-0.5 rounded-full text-white">
                  {course.highlightBadge}
                </span>
              )}
            </div>
            <h2 id="course-modal-title" className="text-xl sm:text-2xl font-bold font-heading text-white">
              {course.name}
            </h2>
            <p className="text-xs text-sky-200 font-mono">Course Code: {course.code}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
            aria-label="Close course details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-7 space-y-6 text-slate-700">
          {/* Overview Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock className="w-4 h-4 text-[#1E5BD8]" />
              <span className="font-semibold">Duration:</span>
              <span className="font-bold text-[#E8202A]">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">Practical:</span>
              <span>{course.labHours}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Eligibility:</span>
              <span>{course.prerequisites}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Course Overview
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              {course.description}
            </p>
          </div>

          {/* Syllabus Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B2A5B] mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1E5BD8]" />
              Course Syllabus &amp; Lab Modules
            </h4>
            <div className="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              {course.modules.map((mod, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-[#1E5BD8] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Opportunities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-500" />
              Career &amp; Freelancing Pathways
            </h4>
            <div className="flex flex-wrap gap-2">
              {course.careerOpportunities.map((career, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {career}
                </span>
              ))}
            </div>
          </div>

          {/* Certification */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Credential Awarded: </span>
              {course.certification}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onApply(course.name);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E8202A] hover:bg-[#c91821] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <span>Apply for this Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
