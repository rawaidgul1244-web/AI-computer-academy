import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  FileText,
  Printer,
  Download,
  Calendar,
  Phone,
  Table,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { AdmissionApplication } from '../types/academy';
import {
  getApplicationsFromStorage,
  generateGoogleSheetCSV,
  getGoogleSheetWebhookUrl,
  saveGoogleSheetWebhookUrl,
  submitToGoogleSheet,
  GOOGLE_APPS_SCRIPT_CODE,
} from '../utils/academy';
import { ACADEMY_INFO } from '../data/academyData';

interface ApplicationPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewApplicationVoucher: (app: AdmissionApplication) => void;
}

export const ApplicationPortalModal: React.FC<ApplicationPortalModalProps> = ({
  isOpen,
  onClose,
  onViewApplicationVoucher,
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'google-sheet'>('applications');
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApplications(getApplicationsFromStorage());
      setWebhookUrl(getGoogleSheetWebhookUrl());
      setSyncStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = applications.filter((app) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      app.id.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app.courseName.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    if (applications.length === 0) return;
    const csvContent = 'data:text/csv;charset=utf-8,' + generateGoogleSheetCSV(applications);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICA_Student_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoogleSheetWebhookUrl(webhookUrl);
    setSyncStatusMsg('Google Sheet Webhook URL saved successfully!');
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSyncAll = async () => {
    if (applications.length === 0) return;
    setSyncingAll(true);
    setSyncStatusMsg('Syncing all student records to Google Sheet...');

    for (const app of applications) {
      await submitToGoogleSheet(app, webhookUrl);
    }

    setSyncingAll(false);
    setSyncStatusMsg(`Successfully linked and synced ${applications.length} student application(s) to Google Sheet.`);
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B2A5B] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="portal-title" className="text-lg sm:text-xl font-bold font-heading">
                AI Computer Academy Student Portal
              </h2>
              <p className="text-xs text-sky-200">
                Registered with KP-TTB • Direct Google Sheet Integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
            aria-label="Close portal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'applications'
                ? 'bg-white text-[#1E5BD8] border-[#1E5BD8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Student Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('google-sheet')}
            className={`px-4 py-2.5 rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'google-sheet'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Linked Google Sheet ({applications.length} Synced)</span>
          </button>
        </div>

        {/* Status notice */}
        {syncStatusMsg && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        {/* TAB 1: Student Applications List */}
        {activeTab === 'applications' && (
          <>
            {/* Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID, Name or Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E5BD8]/30"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={exportCSV}
                  disabled={applications.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  title="Export all student records to CSV for Google Sheets"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export to Google Sheet CSV</span>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold">No student records found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {searchTerm
                      ? 'Try searching with a different term or roll number.'
                      : 'Applications submitted online will appear here and sync to Google Sheets.'}
                  </p>
                </div>
              ) : (
                filtered.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#1E5BD8]/40 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-red-50 text-[#E8202A] px-2 py-0.5 rounded border border-red-100">
                          {app.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {app.applicantName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          S/D of {app.fatherName}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-[#1E5BD8]">
                        {app.courseName}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" /> {app.phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(app.timestamp).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <Table className="w-3 h-3" /> Synced to Google Sheet
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          onViewApplicationVoucher(app);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0B2A5B] hover:bg-[#103E82] text-white text-xs font-bold rounded-lg transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Slip</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* TAB 2: Google Sheet Integration & Setup */}
        {activeTab === 'google-sheet' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Status card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <Table className="w-5 h-5 text-emerald-600" />
                  <span>Google Sheet Integration Active</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Online student applications are automatically stored and appended to your Google Sheet spreadsheet.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSyncAll}
                  disabled={syncingAll || applications.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
                  <span>Resync All ({applications.length})</span>
                </button>

                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 font-bold text-xs rounded-lg hover:bg-emerald-100 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {/* Webhook endpoint URL configuration */}
            <form onSubmit={handleSaveWebhook} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0B2A5B] uppercase tracking-wider">
                  Google Apps Script Webhook Endpoint URL
                </label>
                <span className="text-[10px] text-slate-500 font-medium">Auto-saves to browser</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E5BD8]/30 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E5BD8] hover:bg-[#164cb8] text-white font-bold text-xs rounded-lg transition shrink-0"
                >
                  Save URL
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                When a student submits the online admission form, their record (Roll ID, Name, Father Name, Phone, CNIC, Address, Course, Education, and Status) is sent to this endpoint.
              </p>
            </form>

            {/* 1-Click Google Apps Script code */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs text-white">
                    Google Apps Script Code (Paste in Google Sheets &gt; Extensions &gt; Apps Script)
                  </span>
                </div>
                <button
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded transition"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-lg overflow-x-auto text-emerald-400 max-h-48 border border-white/10">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p>1. Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">sheets.new</a> to create an AI Computer Academy Google Sheet.</p>
                <p>2. Click <strong>Extensions &gt; Apps Script</strong>, paste the copied code above, and click <strong>Deploy &gt; New deployment</strong>.</p>
                <p>3. Select <strong>Web app</strong>, set &quot;Who has access&quot; to <strong>Anyone</strong>, and paste the generated URL into the box above.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 px-6">
          <span>
            Official Student Desk: <strong className="text-slate-800">{ACADEMY_INFO.officialStudentPhone}</strong>
          </span>
          <span>
            Campus Tel: <strong className="text-slate-800">{ACADEMY_INFO.phones[2]}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
