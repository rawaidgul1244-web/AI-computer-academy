import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { COURSES_DATA } from '../data/academyData';
import { Course } from '../types/academy';
import { filterCourses } from '../utils/academy';
import { motion, AnimatePresence } from 'motion/react';

interface CourseCatalogProps {
  onSelectCourseForApply: (courseName: string) => void;
  onOpenCourseModal: (course: Course) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Courses' },
  { id: 'diploma', label: '1-Year Diploma' },
  { id: 'cyber', label: 'Cyber & Networking' },
  { id: 'ai-data', label: 'AI & Data Analysis' },
  { id: 'office', label: 'Office Suite' },
  { id: 'english', label: 'Spoken English' },
  { id: 'creative', label: 'Media & YouTube' },
];

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onSelectCourseForApply,
  onOpenCourseModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    return filterCourses(COURSES_DATA, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  return (
    <section id="courses" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#1E5BD8] text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practical Curricula</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#0B2A5B] tracking-tight">
            Our Professional Courses
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Pick a high-demand tech skill or technical diploma and launch your career. All courses include 100% practical lab practice, personalized mentoring, and career preparation.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by keyword (e.g. DIT, Cyber, Excel, AI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Counter display */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-[#0B2A5B]">{filteredCourses.length}</span> of {COURSES_DATA.length} Courses
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1E5BD8] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
            <p className="text-slate-500 text-base">No courses found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-sm font-semibold text-[#1E5BD8] hover:underline"
            >
              Reset filters and show all courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Banner Stripe */}
                  <div className="h-1.5 bg-gradient-to-r from-[#1E5BD8] to-[#3FA9F5]" />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold text-[#1E5BD8] bg-blue-50 px-2.5 py-0.5 rounded-md">
                        {course.categoryLabel}
                      </span>
                      {course.highlightBadge ? (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#E8202A] px-2 py-0.5 rounded-full shadow-xs">
                          {course.highlightBadge}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-slate-400">{course.code}</span>
                      )}
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-3xl p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                        {course.icon}
                      </span>
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#0B2A5B] group-hover:text-[#1E5BD8] transition leading-snug">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{course.duration}</span>
                          <span>•</span>
                          <span>{course.labHours}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tagline & Description */}
                    <p className="text-xs sm:text-sm text-slate-600 font-medium italic mt-2 line-clamp-2">
                      &ldquo;{course.tagline}&rdquo;
                    </p>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Syllabus Preview items */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 flex-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Key Modules Covered:
                      </div>
                      {course.modules.slice(0, 3).map((mod, i) => (
                        <div key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="text-[#1E5BD8] font-bold text-[10px] mt-0.5">▸</span>
                          <span className="line-clamp-1">{mod}</span>
                        </div>
                      ))}
                      {course.modules.length > 3 && (
                        <button
                          onClick={() => onOpenCourseModal(course)}
                          className="text-[11px] font-semibold text-[#1E5BD8] hover:underline pt-0.5"
                        >
                          +{course.modules.length - 3} more modules in syllabus
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenCourseModal(course)}
                      className="text-xs font-semibold text-slate-600 hover:text-[#0B2A5B] transition"
                    >
                      View Syllabus
                    </button>

                    <a
                      href="#apply"
                      onClick={() => onSelectCourseForApply(course.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#E8202A] hover:bg-[#c91821] rounded-lg shadow-sm hover:shadow transition"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
