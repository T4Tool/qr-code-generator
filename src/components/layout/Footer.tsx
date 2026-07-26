import React from 'react';
import { QrCode, ShieldCheck, Zap, Lock, Heart } from 'lucide-react';
import { ToolType } from '../../types';

interface FooterProps {
  onSelectTool: (tool: ToolType) => void;
  onOpenModal: (modalType: 'privacy' | 'terms' | 'disclaimer' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, onOpenModal }) => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">QR Code Generator</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Fast, modern, client-side QR Code generator. Create custom scannable QR codes for web, contacts, WiFi, images, and documents.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Essential QR Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Popular QR Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onSelectTool('url')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  URL to QR Code
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  vCard Contact QR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('wifi')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  WiFi Password QR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('phone')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Phone Dial QR
                </button>
              </li>
            </ul>
          </div>

          {/* Media & Advanced Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Media & Documents
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onSelectTool('image')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Image Gallery QR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('pdf')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  PDF Document QR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('location')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Google Maps Location QR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTool('email')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Email Message QR
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Legal & Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('disclaimer')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <p>© 2024 QR Generator. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenModal('privacy')} className="hover:underline">Privacy</button>
            <button onClick={() => onOpenModal('terms')} className="hover:underline">Terms</button>
            <button onClick={() => onOpenModal('contact')} className="hover:underline">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
