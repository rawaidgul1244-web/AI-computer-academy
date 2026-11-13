import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Printer,
  MessageCircle,
  FileText,
  User,
  Phone,
  BookOpen,
  Camera,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Download,
  Clock,
} from 'lucide-react';
import { COURSES_DATA, ACADEMY_INFO } from '../data/academyData';
import { EducationRecord, AdmissionApplication } from '../types/academy';
import {
  validatePakistanPhone,
  calculateEducationGrade,
  generateApplicationId,
  createWhatsAppSubmissionUrl,
  saveApplicationToStorage,
  submitToGoogleSheet,
} from '../utils/academy';

interface AdmissionFormProps {
  initialCourseName?: string;
  onApplicationSubmitted?: (app: AdmissionApplication) => void;
}

const INITIAL_EDUCATION: EducationRecord = {
  exam: 'Matriculation (SSC)',
  year: '2024',
  rollNo: '',
  obtainedMarks: '',
  totalMarks: '1100',
  percentage: '',
  majorSubject: 'Science',
  institution: '',
};

export const AdmissionForm: React.FC<AdmissionFormProps> = ({
  initialCourseName = '',
  onApplicationSubmitted,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields State
  const [academicYear, setAcademicYear] = useState('2026');
  const [courseName, setCourseName] = useState(initialCourseName || COURSES_DATA[0].name);
  const [applicantName, setApplicantName] = useState('');
  const [applicantNameUrdu, setApplicantNameUrdu] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherNameUrdu, setFatherNameUrdu] = useState('');
  const [cnicOrBForm, setCnicOrBForm] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [religion, setReligion] = useState('Islam');

  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const [educationList, setEducationList] = useState<EducationRecord[]>([{ ...INITIAL_EDUCATION }]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [applicantSignature, setApplicantSignature] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [affidavitAgreed, setAffidavitAgreed] = useState(false);

  // Sync initialCourseName if updated externally
  useEffect(() => {
    if (initialCourseName) {
      setCourseName(initialCourseName);
    }
  }, [initialCourseName]);

  // Education row handler
  const handleAddEduRow = () => {
    setEducationList((prev) => [
      ...prev,
      {
        exam: '',
        year: '',
        rollNo: '',
        obtainedMarks: '',
        totalMarks: '1100',
        percentage: '',
        majorSubject: '',
        institution: '',
      },
    ]);
  };

  const handleRemoveEduRow = (index: number) => {
    if (educationList.length <= 1) return;
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEduChange = (index: number, field: keyof EducationRecord, val: string) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };

      // Auto compute percentage if marks change
      if (field === 'obtainedMarks' || field === 'totalMarks') {
        const obt = field === 'obtainedMarks' ? val : updated[index].obtainedMarks;
        const tot = field === 'totalMarks' ? val : updated[index].totalMarks;
        const calc = calculateEducationGrade(obt, tot);
        if (calc.isValid) {
          updated[index].percentage = `${calc.percentage}% (${calc.grade})`;
        }
      }
      return updated;
    });
  };

  // Photo change preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!applicantName.trim()) {
      setFormError('Please enter the applicant full name in English.');
      return false;
    }
    if (!fatherName.trim()) {
      setFormError("Please enter father's name.");
      return false;
    }
    if (!dob) {
      setFormError('Please select date of birth.');
      return false;
    }
    setFormError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!presentAddress.trim()) {
      setFormError('Please enter present address.');
      return false;
    }
    const phoneCheck = validatePakistanPhone(phone);
    if (!phoneCheck.isValid) {
      setFormError('Please enter a valid Pakistani phone number (e.g. 0341 9847946 or 03XX XXXXXXX).');
      return false;
    }
    setFormError(null);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (educationList.length === 0 || !educationList[0].exam.trim()) {
      setFormError('Please enter at least one educational qualification.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'local'>('idle');

  // Final Submission Validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    if (!applicantSignature.trim()) {
      setFormError('Please type applicant full name as digital signature.');
      return;
    }
    if (!guardianName.trim()) {
      setFormError('Please specify parent or guardian name.');
      return;
    }
    if (!affidavitAgreed) {
      setFormError('You must check the affidavit confirmation box to proceed.');
      return;
    }

    setIsSubmitting(true);
    setSyncStatus('syncing');

    const matchingCourse = COURSES_DATA.find((c) => c.name === courseName);
    const applicationId = generateApplicationId('AICA', parseInt(academicYear) || 2026);

    const newApp: AdmissionApplication = {
      id: applicationId,
      timestamp: new Date().toISOString(),
      academicYear,
      courseId: matchingCourse?.id || 'gen',
      courseName,
      applicantName: applicantName.toUpperCase().trim(),
      applicantNameUrdu: applicantNameUrdu.trim(),
      fatherName: fatherName.toUpperCase().trim(),
      fatherNameUrdu: fatherNameUrdu.trim(),
      cnicOrBForm: cnicOrBForm.trim(),
      dob,
      gender,
      religion: religion.trim(),
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim() || presentAddress.trim(),
      phone: phone.trim(),
      email: email.trim(),
      guardianPhone: guardianPhone.trim(),
      education: educationList,
      applicantSignature: applicantSignature.toUpperCase().trim(),
      guardianName: guardianName.toUpperCase().trim(),
      status: 'pending',
      photoUploaded: !!photoPreview,
    };

    try {
      const syncResult = await submitToGoogleSheet(newApp);
      newApp.syncedToGoogleSheet = syncResult.synced;
      newApp.googleSheetSyncTimestamp = new Date().toISOString();
      setSyncStatus(syncResult.synced ? 'synced' : 'local');
    } catch {
      newApp.syncedToGoogleSheet = false;
      setSyncStatus('local');
    }

    saveApplicationToStorage(newApp);
    setSubmittedApp(newApp);
    setIsSubmitting(false);
    setFormError(null);

    if (onApplicationSubmitted) {
      onApplicationSubmitted(newApp);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // SUCCESS / ADMISSION VOUCHER SLIP VIEW
  if (submittedApp) {
    const waUrl = createWhatsAppSubmissionUrl(ACADEMY_INFO.whatsappNumber, submittedApp);

    return (
      <section id="apply" className="py-16 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Printable Voucher Card */}
          <div
            id="printable-voucher"
            className="bg-white rounded-2xl shadow-xl border border-slate-300 p-6 sm:p-10 relative overflow-hidden text-slate-800"
          >
            {/* Header Stamp */}
            <div className="border-b-2 border-[#0B2A5B] pb-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="AICA Logo" className="h-16 w-auto object-contain" />
                <div>
                  <h2 className="text-2xl font-black font-heading text-[#0B2A5B]">
                    AI COMPUTER ACADEMY
                  </h2>
                  <p className="text-xs font-semibold text-slate-700">
                    Registered with KP-TTB • Near GDC Lahore, Manki, Swabi
                  </p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Official Student Contact: <strong className="text-[#0B2A5B]">0315 1234695</strong> | Tel: 0342 1188506
                  </p>
                  <p className="text-[11px] text-[#E8202A] italic">
                    &ldquo;A degree without skill is just a piece of paper&rdquo;
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[200px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  ADMISSION APPLICATION VOUCHER
                </span>
                <span className="text-lg font-black font-mono text-[#E8202A] block">
                  {submittedApp.id}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Date: {new Date(submittedApp.timestamp).toLocaleDateString()}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Recorded in Google Sheet
                </span>
              </div>
            </div>

            {/* Alert message */}
            <div className="my-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3 print:hidden">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm">Application Registered &amp; Synced to Google Sheet!</span>
                <p>
                  Your admission form for <strong>{submittedApp.courseName}</strong> has been saved and linked to the official academy Google Sheet. Application ID: <strong>{submittedApp.id}</strong>.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Google Sheet Integration: Student record linked for admission verification</span>
                </div>
              </div>
            </div>

            {/* Student & Course Summary Details Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm my-6">
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-[#0B2A5B] border-b pb-1 text-xs uppercase tracking-wider">
                  Applicant Information
                </h4>
                <div>
                  <span className="text-slate-500">Student Name: </span>
                  <strong className="text-slate-900">{submittedApp.applicantName}</strong>
                  {submittedApp.applicantNameUrdu && (
                    <span className="ml-2 font-urdu text-sm font-semibold">({submittedApp.applicantNameUrdu})</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">Father&apos;s Name: </span>
                  <strong className="text-slate-900">{submittedApp.fatherName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">CNIC / B-Form: </span>
                  <span>{submittedApp.cnicOrBForm || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date of Birth: </span>
                  <span>{submittedApp.dob}</span>
                </div>
                <div>
                  <span className="text-slate-500">Gender / Religion: </span>
                  <span className="capitalize">{submittedApp.gender}</span> / {submittedApp.religion}
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-[#0B2A5B] border-b pb-1 text-xs uppercase tracking-wider">
                  Course &amp; Contact Details
                </h4>
                <div>
                  <span className="text-slate-500">Selected Course: </span>
                  <strong className="text-[#1E5BD8]">{submittedApp.courseName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Academic Batch: </span>
                  <span>{submittedApp.academicYear}</span>
                </div>
                <div>
                  <span className="text-slate-500">Contact Number: </span>
                  <strong className="text-slate-900">{submittedApp.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Email: </span>
                  <span>{submittedApp.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Present Address: </span>
                  <span className="line-clamp-2">{submittedApp.presentAddress}</span>
                </div>
              </div>
            </div>

            {/* Qualifications Summary */}
            <div className="my-4">
              <h4 className="font-bold text-[#0B2A5B] text-xs uppercase tracking-wider mb-2">
                Educational Qualifications Recorded
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-[#0B2A5B] text-white">
                    <tr>
                      <th className="p-2 font-semibold">Exam</th>
                      <th className="p-2 font-semibold">Year</th>
                      <th className="p-2 font-semibold">Roll No</th>
                      <th className="p-2 font-semibold">Marks</th>
                      <th className="p-2 font-semibold">% / Grade</th>
                      <th className="p-2 font-semibold">Institution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {submittedApp.education.map((edu, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-medium">{edu.exam || '-'}</td>
                        <td className="p-2">{edu.year || '-'}</td>
                        <td className="p-2">{edu.rollNo || '-'}</td>
                        <td className="p-2">{edu.obtainedMarks}/{edu.totalMarks}</td>
                        <td className="p-2 font-semibold text-[#1E5BD8]">{edu.percentage || '-'}</td>
                        <td className="p-2">{edu.institution || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Office instructions & Signatures */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-3">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900">
                <p className="font-bold">Important Next Steps for Final Admission:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Please send two recent passport-size photographs to WhatsApp <strong>0315 1234695</strong> (Official Student Desk), or hand them in at the office.</li>
                  <li>Registration and monthly course fees are confirmed upon verification of original academic documents.</li>
                  <li>Class schedule: <strong>Monday to Thursday (Evening Time: 3:00 PM – 7:00 PM)</strong>.</li>
                  <li>Campus address: Near Government Degree College (GDC) Lahore, Manki, Swabi.</li>
                </ul>
              </div>

              <div className="pt-8 flex items-center justify-between text-xs">
                <div className="text-center">
                  <div className="w-48 border-b border-slate-400 pb-1 font-mono font-bold text-slate-800">
                    {submittedApp.applicantSignature}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">Applicant Digital Signature</span>
                </div>
                <div className="text-center">
                  <div className="w-48 border-b border-slate-400 pb-1 font-semibold text-slate-800">
                    Admission Desk
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">Authorized Official Stamp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs outside printable voucher */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B2A5B] hover:bg-[#103E82] text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Admission Slip</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Submit to Student Desk WhatsApp (0315 1234695)</span>
            </a>

            <button
              onClick={() => {
                setSubmittedApp(null);
                setCurrentStep(1);
                setApplicantName('');
                setFatherName('');
                setPhone('');
              }}
              className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
            >
              <span>Submit Another Admission Form</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // WIZARD FORM VIEW
  return (
    <section id="apply" className="py-20 bg-slate-100 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8202A] bg-red-50 px-3 py-1 rounded-full border border-red-100">
              Registered with KP-TTB
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Linked with Google Sheet
            </span>
          </div>

          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold font-heading text-[#0B2A5B] tracking-tight">
            Online Admission Application
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Classes: <strong className="text-slate-800">Monday to Thursday (Evening Time: 3:00 PM – 7:00 PM)</strong> • Next batch starts in 3 months. Applications submitted here are linked directly to our official academy Google Sheet.
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 cursor-pointer ${
                currentStep === 1 ? 'text-[#1E5BD8] font-bold' : currentStep > 1 ? 'text-emerald-600' : ''
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep === 1 ? 'bg-[#1E5BD8] text-white' : currentStep > 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="hidden sm:inline">Applicant Info</span>
            </button>

            <span className="h-0.5 flex-1 mx-3 bg-slate-200" />

            <button
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`flex items-center gap-1.5 cursor-pointer ${
                currentStep === 2 ? 'text-[#1E5BD8] font-bold' : currentStep > 2 ? 'text-emerald-600' : ''
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep === 2 ? 'bg-[#1E5BD8] text-white' : currentStep > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className="hidden sm:inline">Contact Details</span>
            </button>

            <span className="h-0.5 flex-1 mx-3 bg-slate-200" />

            <button
              onClick={() => {
                if (validateStep1() && validateStep2()) setCurrentStep(3);
              }}
              className={`flex items-center gap-1.5 cursor-pointer ${
                currentStep === 3 ? 'text-[#1E5BD8] font-bold' : ''
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                currentStep === 3 ? 'bg-[#1E5BD8] text-white' : 'bg-slate-100'
              }`}>
                3
              </span>
              <span className="hidden sm:inline">Education &amp; Affidavit</span>
            </button>
          </div>
        </div>

        {/* Error notification */}
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="font-medium">{formError}</div>
          </div>
        )}

        {/* Main Admission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: APPLICANT DETAILS */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#0B2A5B] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1E5BD8]" />
                    Applicant Information
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please provide basic bio-data. All information will appear on your registration slip.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                  Step 1 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                    required
                  />
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Desired Course *
                  </label>
                  <select
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8] font-medium"
                    required
                  >
                    {COURSES_DATA.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Name (English) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name (in Block Letters) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AHMAD KHAN"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                    required
                  />
                </div>

                {/* Name in Urdu */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Name in Urdu (Optional)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثلاً: احمد خان"
                    value={applicantNameUrdu}
                    onChange={(e) => setApplicantNameUrdu(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                  />
                </div>

                {/* Father's Name (English) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Father&apos;s Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MUHAMMAD TARIQ"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                    required
                  />
                </div>

                {/* Father's Name in Urdu */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Father&apos;s Name in Urdu (Optional)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثلاً: محمد طارق"
                    value={fatherNameUrdu}
                    onChange={(e) => setFatherNameUrdu(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                  />
                </div>

                {/* CNIC or B-Form */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CNIC or B-Form Number
                  </label>
                  <input
                    type="text"
                    placeholder="16202-XXXXXXX-X"
                    value={cnicOrBForm}
                    onChange={(e) => setCnicOrBForm(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender *
                  </label>
                  <div className="flex gap-4 pt-1">
                    <label className="inline-flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                      />
                      <span>Male</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                      />
                      <span>Female (Separate shift available)</span>
                    </label>
                  </div>
                </div>

                {/* Religion */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                  />
                </div>
              </div>

              {/* Navigation button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E5BD8] hover:bg-[#164cb8] text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
                >
                  <span>Continue to Contact Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT DETAILS */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#0B2A5B] flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#1E5BD8]" />
                    Contact &amp; Residence Information
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We use your WhatsApp number to confirm registration and class schedules.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                  Step 2 of 3
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Present Address (Village / Town / Mohallah) *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Mohallah Quresh, Village Manki, Tehsil Lahore, Distt Swabi"
                    value={presentAddress}
                    onChange={(e) => setPresentAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Permanent Address (if different from present)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Same as present address if unchanged"
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Number (Active WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      placeholder="0315 1234695"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                      required
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Must be reachable on WhatsApp for admission notifications.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="applicant@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Parent / Guardian Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="03XX XXXXXXX"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30 focus:border-[#1E5BD8]"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Bio-Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setCurrentStep(3);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E5BD8] hover:bg-[#164cb8] text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
                >
                  <span>Continue to Education</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EDUCATIONAL QUALIFICATIONS, PHOTOS & AFFIDAVIT */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Education Table Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-[#0B2A5B] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#1E5BD8]" />
                      Educational Qualifications
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      List your latest degrees or certificates (Matric, F.A/F.Sc, DAE, BA/BSc, BS).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEduRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1E5BD8] font-bold text-xs rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Qualification</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[640px]">
                    <thead>
                      <tr className="bg-[#0B2A5B] text-white">
                        <th className="p-2.5 rounded-l-lg">Exam Passed *</th>
                        <th className="p-2.5">Year</th>
                        <th className="p-2.5">Roll No.</th>
                        <th className="p-2.5">Obtained</th>
                        <th className="p-2.5">Total</th>
                        <th className="p-2.5">% / Grade</th>
                        <th className="p-2.5">Major</th>
                        <th className="p-2.5">Institution</th>
                        <th className="p-2.5 rounded-r-lg w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {educationList.map((edu, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.exam}
                              onChange={(e) => handleEduChange(idx, 'exam', e.target.value)}
                              placeholder="e.g. Matric / FSc"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                              required
                            />
                          </td>
                          <td className="p-2 w-20">
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                              placeholder="2024"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                            />
                          </td>
                          <td className="p-2 w-24">
                            <input
                              type="text"
                              value={edu.rollNo}
                              onChange={(e) => handleEduChange(idx, 'rollNo', e.target.value)}
                              placeholder="12345"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                            />
                          </td>
                          <td className="p-2 w-20">
                            <input
                              type="number"
                              value={edu.obtainedMarks}
                              onChange={(e) => handleEduChange(idx, 'obtainedMarks', e.target.value)}
                              placeholder="850"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                            />
                          </td>
                          <td className="p-2 w-20">
                            <input
                              type="number"
                              value={edu.totalMarks}
                              onChange={(e) => handleEduChange(idx, 'totalMarks', e.target.value)}
                              placeholder="1100"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                            />
                          </td>
                          <td className="p-2 w-24">
                            <span className="text-xs font-semibold text-[#1E5BD8]">
                              {edu.percentage || '-'}
                            </span>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.majorSubject}
                              onChange={(e) => handleEduChange(idx, 'majorSubject', e.target.value)}
                              placeholder="Science / CS"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleEduChange(idx, 'institution', e.target.value)}
                              placeholder="BISE Mardan / School"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                            />
                          </td>
                          <td className="p-2 text-center">
                            {educationList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEduRow(idx)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Photographs Box */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-[#0B2A5B] font-bold text-base font-heading">
                  <Camera className="w-5 h-5 text-[#1E5BD8]" />
                  <span>Passport-size Photographs</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {photoPreview && (
                    <div className="w-20 h-24 rounded-lg overflow-hidden border border-slate-300 shadow-xs shrink-0">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Attach recent passport photo (JPG/PNG under 2 MB for preview)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1E5BD8] hover:file:bg-blue-100"
                    />
                    <p className="text-[11px] text-slate-500">
                      Note: Photos can also be sent via WhatsApp to <strong>0341 9847946</strong>, or submitted physically at the academy office.
                    </p>
                  </div>
                </div>
              </div>

              {/* Affidavit & Legal Declaration */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-2 text-[#0B2A5B] font-bold text-base font-heading">
                  <ShieldCheck className="w-5 h-5 text-[#E8202A]" />
                  <span>Student Undertaking &amp; Affidavit</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                  <p>
                    I undertake that the information stated in this application form is correct to the best of my knowledge. I will abide by all academy rules, computer lab discipline, and schedule timings. If found violating discipline or taking part in disruptive/political activities, my admission may be cancelled.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Applicant Digital Signature (Type Full Name) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AHMAD KHAN"
                      value={applicantSignature}
                      onChange={(e) => setApplicantSignature(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm uppercase font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MUHAMMAD TARIQ"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E5BD8]/30"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={affidavitAgreed}
                    onChange={(e) => setAffidavitAgreed(e.target.checked)}
                    className="w-4 h-4 text-[#1E5BD8] rounded mt-0.5"
                    required
                  />
                  <span>
                    I confirm the affidavit statement above and verify that all information provided is genuine and correct.
                  </span>
                </label>
              </div>

              {/* Form Navigation and Final Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Contact Info</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E8202A] hover:bg-[#c91821] disabled:bg-slate-400 text-white font-extrabold text-base rounded-xl shadow-lg hover:shadow-red-500/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Syncing with Google Sheet...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit &amp; Sync to Google Sheet</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
