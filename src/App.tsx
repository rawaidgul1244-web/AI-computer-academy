import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CourseCatalog } from './components/CourseCatalog';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FacultySection } from './components/FacultySection';
import { AdmissionForm } from './components/AdmissionForm';
import { CampusLocation } from './components/CampusLocation';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingActionButtons } from './components/FloatingActionButtons';
import { CourseModal } from './components/CourseModal';
import { ApplicationPortalModal } from './components/ApplicationPortalModal';
import { Course, AdmissionApplication } from './types/academy';

export default function App() {
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [selectedCourseForApply, setSelectedCourseForApply] = useState<string>('');
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  const handleApplyClick = (courseName?: string) => {
    if (courseName) {
      setSelectedCourseForApply(courseName);
    }
    const applyEl = document.getElementById('apply');
    if (applyEl) {
      applyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreCourses = () => {
    const el = document.getElementById('courses');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* Navigation */}
      <Navbar
        onOpenPortal={() => setIsPortalOpen(true)}
        onSelectCourseForApply={handleApplyClick}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCourses={handleExploreCourses}
          onApplyClick={() => handleApplyClick()}
        />

        {/* Course Catalog */}
        <CourseCatalog
          onSelectCourseForApply={handleApplyClick}
          onOpenCourseModal={(course) => setSelectedCourseForModal(course)}
        />

        {/* Why Choose AI Academy */}
        <WhyChooseUs />

        {/* Faculty Mentors */}
        <FacultySection />

        {/* Admissions Form */}
        <AdmissionForm
          initialCourseName={selectedCourseForApply}
        />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Campus Location & Map */}
        <CampusLocation />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp and Admissions pill */}
      <FloatingActionButtons />

      {/* Detailed Course Modal */}
      <CourseModal
        course={selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        onApply={(courseName) => handleApplyClick(courseName)}
      />

      {/* Student Admission Portal Modal */}
      <ApplicationPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onViewApplicationVoucher={(app) => {
          // Scroll to apply form with preselected details
          setSelectedCourseForApply(app.courseName);
          const applyEl = document.getElementById('apply');
          if (applyEl) {
            applyEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}
