import React, { useState } from 'react';
import { QrCode, Bookmark, Moon, Sun, Menu, X, Link, Search, Plus } from 'lucide-react';
import { ToolType } from '../../types';

interface HeaderProps {
  currentView: 'dashboard' | 'tool' | 'all-tools';
  activeTool?: ToolType;
  savedCount: number;
  darkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleDarkMode: () => void;
  onNavigateHome: () => void;
  onNavigateAllTools: () => void;
  onOpenSavedModal: () => void;
  onNewQR: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  savedCount,
  darkMode,
  searchQuery,
  onSearchChange,
  onToggleDarkMode,
  onNavigateHome,
  onNavigateAllTools,
  onOpenSavedModal,
  onNewQR,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 focus:outline-none text-left shrink-0 cursor-pointer"
          id="header-logo-btn"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm shadow-teal-500/20">
            <QrCode className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            QR Code <span className="text-teal-600 dark:text-teal-400">Generator</span>
          </span>
        </button>

        {/* Center/Right Search Bar & Actions */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md ml-auto">
          {/* Header Search Input matching reference */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium border border-transparent focus:border-teal-500/30"
              id="header-search-input"
            />
          </div>

          {/* New QR Action Button matching reference */}
          <button
            onClick={onNewQR}
            id="nav-new-qr-btn"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New QR</span>
          </button>
        </div>

        {/* Desktop Navigation & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            id="nav-home-btn"
            className={`hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={onNavigateAllTools}
            id="nav-tools-btn"
            className={`hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              currentView === 'all-tools'
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Tools
          </button>

          <button
            onClick={onOpenSavedModal}
            id="nav-saved-btn"
            className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-teal-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleDarkMode}
            id="dark-mode-toggle-btn"
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            aria-label="Open Mobile Navigation"
            className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-3 shadow-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </button>

            <button
              onClick={() => {
                onNavigateAllTools();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              All Tools
            </button>

            <button
              onClick={() => {
                onOpenSavedModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Saved QR Codes</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-600 text-white">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onNewQR();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New QR Code</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

