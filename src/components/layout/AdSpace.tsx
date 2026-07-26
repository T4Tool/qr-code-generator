import React from 'react';

interface AdSpaceProps {
  position: 'below-hero' | 'between-tools' | 'sidebar' | 'below-generator' | 'above-footer';
  className?: string;
}

/**
 * Reserved placeholder container for future Google AdSense integration.
 * Maintains explicit responsive dimensions to prevent layout shifts (CLS).
 */
export const AdSpace: React.FC<AdSpaceProps> = ({ position, className = '' }) => {
  return (
    <aside
      aria-label="Advertisement Space"
      className={`w-full flex flex-col items-center justify-center my-6 transition-all ${className}`}
    >
      <div
        className={`w-full max-w-4xl mx-auto rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 flex flex-col items-center justify-center text-center text-xs text-slate-400 dark:text-slate-500 min-h-[90px] relative overflow-hidden group`}
      >
        <div className="flex items-center gap-2 mb-1 opacity-75">
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse"></span>
          <span className="font-mono text-[10px] uppercase tracking-wider">Ad Space</span>
        </div>
        <p className="text-[11px] max-w-md font-medium text-slate-400 dark:text-slate-500">
          Google AdSense Ready Slot ({position.replace('-', ' ')})
        </p>
      </div>
    </aside>
  );
};
