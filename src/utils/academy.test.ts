import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePakistanPhone,
  calculateEducationGrade,
  generateApplicationId,
  calculateBatchCountdown,
  filterCourses,
  createWhatsAppSubmissionUrl,
  generateGoogleSheetCSV,
} from './academy';
import { Course } from '../types/academy';

test('validatePakistanPhone accepts valid 11-digit local format', () => {
  const result = validatePakistanPhone('03419847946');
  assert.equal(result.isValid, true);
  assert.equal(result.cleanNumber, '03419847946');
  assert.equal(result.formatted, '0341 9847946');
});

test('validatePakistanPhone validates official student number 03151234695 and corrected 03421188506', () => {
  const studentPhone = validatePakistanPhone('03151234695');
  assert.equal(studentPhone.isValid, true);
  assert.equal(studentPhone.formatted, '0315 1234695');

  const correctedPhone = validatePakistanPhone('0342 1188506');
  assert.equal(correctedPhone.isValid, true);
  assert.equal(correctedPhone.cleanNumber, '03421188506');
  assert.equal(correctedPhone.formatted, '0342 1188506');
});

test('validatePakistanPhone accepts international +92 format', () => {
  const result = validatePakistanPhone('+92 341 9847946');
  assert.equal(result.isValid, true);
  assert.equal(result.cleanNumber, '03419847946');
});

test('validatePakistanPhone rejects invalid numbers', () => {
  assert.equal(validatePakistanPhone('12345').isValid, false);
  assert.equal(validatePakistanPhone('042 1234567').isValid, false);
});

test('calculateEducationGrade accurately computes percentages and letter grades', () => {
  const g1 = calculateEducationGrade(850, 1100);
  assert.equal(g1.isValid, true);
  assert.equal(g1.percentage, 77.27);
  assert.equal(g1.grade, 'A');

  const g2 = calculateEducationGrade(950, 1100);
  assert.equal(g2.grade, 'A-1');

  const gInvalid = calculateEducationGrade(1200, 1100);
  assert.equal(gInvalid.isValid, false);
});

test('generateApplicationId produces valid voucher code format', () => {
  const id = generateApplicationId('AICA', 2026);
  assert.match(id, /^AICA-2026-\d{4}$/);
});

test('calculateBatchCountdown calculates future date components correctly', () => {
  const baseTime = new Date('2026-11-05T09:00:00Z');
  const targetTime = '2026-11-07T12:30:15Z'; // 2 days, 3 hours, 30 min, 15 sec later

  const cd = calculateBatchCountdown(targetTime, baseTime);
  assert.equal(cd.isPassed, false);
  assert.equal(cd.days, 2);
  assert.equal(cd.hours, 3);
  assert.equal(cd.minutes, 30);
  assert.equal(cd.seconds, 15);
});

test('filterCourses correctly filters by keyword and category', () => {
  const sampleCourses: Course[] = [
    {
      id: 'dit',
      name: 'DIT (Diploma in Information Technology)',
      code: 'AICA-DIT',
      duration: '1 Year',
      category: 'diploma',
      categoryLabel: 'Diploma',
      icon: '💻',
      tagline: 'Comprehensive diploma',
      description: 'Computer skills',
      modules: ['Office', 'Web'],
      careerOpportunities: ['Operator'],
      prerequisites: 'Matric',
      labHours: '120h',
      certification: 'Diploma',
    },
    {
      id: 'cyber',
      name: 'Cyber Security',
      code: 'AICA-CYB',
      duration: '3 Months',
      category: 'cyber',
      categoryLabel: 'Cyber',
      icon: '🛡️',
      tagline: 'Ethical hacking',
      description: 'Network defense',
      modules: ['Linux', 'Scanning'],
      careerOpportunities: ['Analyst'],
      prerequisites: 'Basics',
      labHours: '60h',
      certification: 'Cert',
    },
  ];

  const searchDIT = filterCourses(sampleCourses, 'diploma', 'all');
  assert.equal(searchDIT.length, 1);
  assert.equal(searchDIT[0].id, 'dit');

  const searchCyberCategory = filterCourses(sampleCourses, '', 'cyber');
  assert.equal(searchCyberCategory.length, 1);
  assert.equal(searchCyberCategory[0].id, 'cyber');
});

test('createWhatsAppSubmissionUrl generates encoded WhatsApp URL', () => {
  const url = createWhatsAppSubmissionUrl('923419847946', {
    id: 'AICA-2026-1234',
    courseName: 'Cyber Security',
    applicantName: 'AHMAD KHAN',
  });

  assert.ok(url.startsWith('https://wa.me/923419847946?text='));
  assert.ok(url.includes('AICA-2026-1234'));
  assert.ok(url.includes('Cyber%20Security'));
});

test('generateGoogleSheetCSV outputs proper CSV headers and values', () => {
  const csv = generateGoogleSheetCSV([
    {
      id: 'AICA-2026-9999',
      timestamp: '2026-11-05T12:00:00.000Z',
      academicYear: '2026',
      courseId: 'dit',
      courseName: 'DIT (Diploma in Information Technology)',
      applicantName: 'TARIQ KHAN',
      fatherName: 'ABDUL JAMEEL',
      phone: '03151234695',
      presentAddress: 'Manki, Swabi',
      permanentAddress: 'Manki, Swabi',
      gender: 'male',
      dob: '2005-01-01',
      religion: 'Islam',
      education: [{ exam: 'Matric', year: '2022', rollNo: '123', obtainedMarks: '850', totalMarks: '1100', percentage: '77.27%', majorSubject: 'Science', institution: 'GHS Manki' }],
      applicantSignature: 'TARIQ KHAN',
      guardianName: 'ABDUL JAMEEL',
      status: 'pending',
      syncedToGoogleSheet: true,
    },
  ]);

  assert.ok(csv.includes('Application ID'));
  assert.ok(csv.includes('Google Sheet Synced'));
  assert.ok(csv.includes('"AICA-2026-9999"'));
  assert.ok(csv.includes('"03151234695"'));
  assert.ok(csv.includes('"YES"'));
});

