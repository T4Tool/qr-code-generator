import React from 'react';
import { SavedQRItem } from '../../types';
import { X, Bookmark, Trash2, Download, ExternalLink, Calendar } from 'lucide-react';

interface SavedQRsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedQRItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onLoadItem: (item: SavedQRItem) => void;
}

export const SavedQRsModal: React.FC<SavedQRsModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onDelete,
  onClearAll,
  onLoadItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved QR Codes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {savedItems.length} items saved locally on your device
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedItems.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all saved QR codes?')) {
                    onClearAll();
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.previewDataUrl}
                      alt={item.title}
                      className="w-16 h-16 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white p-1"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {item.toolType}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title || 'Untitled QR'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                        {item.rawPayload}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <button
                      onClick={() => {
                        onLoadItem(item);
                        onClose();
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Edit & Export</span>
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete saved QR"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Saved QR Codes Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Generate any QR code and click "Save QR" to store it here for future re-editing and exports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
