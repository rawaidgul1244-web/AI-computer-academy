export interface Course {
  id: string;
  name: string;
  code: string;
  duration: string;
  category: 'diploma' | 'cyber' | 'ai-data' | 'office' | 'english' | 'creative';
  categoryLabel: string;
  icon: string;
  highlightBadge?: string;
  tagline: string;
  description: string;
  modules: string[];
  careerOpportunities: string[];
  prerequisites: string;
  labHours: string;
  certification: string;
  featured?: boolean;
}

export interface EducationRecord {
  exam: string;
  year: string;
  rollNo: string;
  obtainedMarks: string;
  totalMarks: string;
  percentage?: string;
  majorSubject: string;
  institution: string;
}

export interface AdmissionApplication {
  id: string;
  timestamp: string;
  academicYear: string;
  courseId: string;
  courseName: string;
  applicantName: string;
  applicantNameUrdu?: string;
  fatherName: string;
  fatherNameUrdu?: string;
  cnicOrBForm?: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  religion: string;
  presentAddress: string;
  permanentAddress: string;
  phone: string;
  email?: string;
  guardianPhone?: string;
  education: EducationRecord[];
  applicantSignature: string;
  guardianName: string;
  status: 'pending' | 'reviewed' | 'approved';
  photoUploaded?: boolean;
  syncedToGoogleSheet?: boolean;
  googleSheetSyncTimestamp?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  certification?: string;
  bio: string;
  specialties: string[];
  icon: string;
  gradient: string;
}
