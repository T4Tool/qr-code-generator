import React from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, Mail } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'privacy' | 'terms' | 'disclaimer' | 'contact' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-indigo-500" />}
            {activeModal === 'terms' && <FileText className="w-5 h-5 text-indigo-500" />}
            {activeModal === 'disclaimer' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {activeModal === 'contact' && <Mail className="w-5 h-5 text-indigo-500" />}

            <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
              {activeModal === 'privacy' && 'Privacy Policy'}
              {activeModal === 'terms' && 'Terms of Service'}
              {activeModal === 'disclaimer' && 'Disclaimer'}
              {activeModal === 'contact' && 'Contact & Support'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {activeModal === 'privacy' && (
            <>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p>
                At <strong>QR Studio</strong>, we prioritize your data privacy above everything else.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-2">1. 100% Client-Side Processing</h4>
              <p>
                All QR codes generated on this website are rendered completely within your browser using client-side JavaScript. No URL, contact info, text, WiFi passwords, images, or PDF files are ever sent to or stored on any external backend server.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-2">2. Local Browser Storage</h4>
              <p>
                If you choose to use the "Save QR" feature, your saved QR code data is saved exclusively inside your own web browser's LocalStorage. You can delete this data at any time.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-2">3. Cookies & Analytics</h4>
              <p>
                We may use standard essential browser storage and anonymized traffic metrics to optimize performance. Google AdSense ads may use cookies to serve relevant advertisements according to Google privacy guidelines.
              </p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Terms of Service
              </p>
              <p>
                By accessing and using QR Studio, you agree to comply with and be bound by the following terms:
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-2">1. Permitted Usage</h4>
              <p>
                QR Studio is free for personal, commercial, educational, and business use. You are welcome to create and distribute generated QR codes without restrictions.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-2">2. Prohibited Uses</h4>
              <p>
                You may not use this tool to generate QR codes leading to phishing links, malware, fraudulent schemes, illegal activities, or explicit harmful content.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-2">3. Disclaimer of Warranty</h4>
              <p>
                This application is provided "as is" without warranty of any kind. Always test your generated QR codes with a physical phone scanner prior to printing.
              </p>
            </>
          )}

          {activeModal === 'disclaimer' && (
            <>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Disclaimer
              </p>
              <p>
                QR Studio provides QR generation tools for informational and organizational convenience.
              </p>
              <p>
                While we make every effort to generate standard compliant matrix codes, users are responsible for verifying code scannability, destination links, and printed contrast ratios prior to mass printing or publishing.
              </p>
              <p>
                QR Studio shall not be liable for printing expenses, lost business, or damages arising from misconfigured or unreadable QR codes.
              </p>
            </>
          )}

          {activeModal === 'contact' && (
            <div className="space-y-4">
              <p>
                Have questions, feature requests, or bug reports? Reach out to our engineering team:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">Email Support:</p>
                <p className="font-mono text-indigo-600 dark:text-indigo-400">support@qr-studio.app</p>
              </div>
              <p className="text-[11px] text-slate-500">
                We respond to user inquiries within 24–48 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
