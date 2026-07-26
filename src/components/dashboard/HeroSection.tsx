import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-10 sm:pt-12 pb-8 text-center space-y-3">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Generate <span className="text-indigo-600 dark:text-indigo-400">QR</span> Codes
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed">
        Create, Customize, Download and Share
        <br />
        QR codes for any content in seconds.
      </p>
    </section>
  );
};



