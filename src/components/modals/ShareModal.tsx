import React, { useState } from 'react';
import { X, Share2, Copy, Check, Download, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: string;
  previewDataUrl: string;
  onDownload: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  payload,
  previewDataUrl,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: `Scan QR Code for: ${payload}`,
          url: window.location.href,
        });
      } catch (e) {
        console.warn('Native share error or dismissed:', e);
      }
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <Share2 className="w-4 h-4 text-indigo-500" />
            <span>Share QR Code</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Thumbnail */}
        <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <img src={previewDataUrl} alt="QR Code Share Preview" className="w-36 h-36 object-contain rounded-lg shadow-sm bg-white p-1" />
        </div>

        {/* Native Web Share API if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Open System Share Menu</span>
          </button>
        )}

        {/* Copy Payload Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            QR Encoded Content / Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={payload}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono truncate"
            />
            <button
              onClick={handleCopyPayload}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={() => {
            onDownload();
            onClose();
          }}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-indigo-500" />
          <span>Download High Quality File</span>
        </button>
      </div>
    </div>
  );
};
