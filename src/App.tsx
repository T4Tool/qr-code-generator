import React, { useState, useEffect, useMemo } from 'react';
import {
  ToolType,
  AllFormData,
  QRStyleConfig,
  SavedQRItem,
} from './types';
import { DEFAULT_QR_CONFIG } from './utils/presets';
import { generateVCardString } from './utils/vcard';
import { generateWiFiString } from './utils/wifi';
import { getSavedQRs, saveQRItem, deleteSavedQR, clearAllSavedQRs } from './utils/storage';
import { updateSEO } from './utils/seo';
import { generateQRDataURL } from './utils/qrGenerator';
import { TOOLS_LIST } from './data/tools';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToolGrid } from './components/dashboard/ToolGrid';
import { ToolForm } from './components/generator/ToolForm';
import { CustomizationPanel } from './components/generator/CustomizationPanel';
import { QRPreview } from './components/generator/QRPreview';
import { SavedQRsModal } from './components/saved/SavedQRsModal';
import { LegalModals } from './components/modals/LegalModals';
import { ShareModal } from './components/modals/ShareModal';

import { ArrowLeft, Sparkles, ChevronRight, Layers } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'tool' | 'all-tools'>('dashboard');
  const [activeTool, setActiveTool] = useState<ToolType>('url');
  const [searchQuery, setSearchQuery] = useState('');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('qr_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('qr_dark_mode', String(darkMode));
  }, [darkMode]);

  // Form Data State for all 10 tools
  const [formData, setFormData] = useState<AllFormData>({
    url: { url: 'https://google.com' },
    text: { text: 'Welcome to QR Studio - Instant Client-Side QR Generator' },
    phone: { phone: '2025550192', countryCode: '+1' },
    contact: {
      firstName: 'Alex',
      lastName: 'Morgan',
      phone: '+1 555 0192',
      email: 'alex@company.com',
      company: 'Acme Innovation',
      jobTitle: 'Product Director',
      website: 'https://company.com',
      street: '100 Tech Blvd',
      city: 'San Francisco',
      zip: '94105',
      country: 'USA',
      notes: 'Met at Tech Summit 2026',
    },
    wifi: {
      ssid: 'Studio_Guest_5G',
      password: 'SecureWiFiPass123',
      encryption: 'WPA',
      hidden: false,
    },
    email: {
      email: 'hello@company.com',
      subject: 'Inquiry regarding services',
      body: 'Hi team,\n\nI would like to request a demo.',
    },
    sms: {
      phone: '+1 555 0192',
      message: 'Hello! I am interested in your QR Studio tools.',
    },
    location: {
      lat: '37.774929',
      lng: '-122.419416',
      locationName: 'San Francisco City Center',
    },
    image: {
      sourceMode: 'upload',
      fileDataUrl: '',
      fileUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600',
      fileName: '',
      fileSize: 0,
    },
    pdf: {
      sourceMode: 'upload',
      fileDataUrl: '',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: '',
      fileSize: 0,
    },
  });

  // Styling Config State
  const [styleConfig, setStyleConfig] = useState<QRStyleConfig>(DEFAULT_QR_CONFIG);

  // Saved QRs State
  const [savedItems, setSavedItems] = useState<SavedQRItem[]>([]);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  // Legal Modals & Share Modal
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'disclaimer' | 'contact' | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareDataUrl, setShareDataUrl] = useState('');

  // Load Saved Items on Mount
  useEffect(() => {
    setSavedItems(getSavedQRs());
  }, []);

  // Update SEO dynamically
  useEffect(() => {
    const currentToolMeta = TOOLS_LIST.find((t) => t.id === activeTool);
    if (currentView === 'tool' && currentToolMeta) {
      updateSEO({
        title: `${currentToolMeta.name} - Free Generator | QR Studio`,
        description: currentToolMeta.shortDesc,
        toolType: activeTool,
      });
    } else {
      updateSEO({
        title: 'Free QR Code Generator | Custom Styles & High Quality Downloads',
        description: 'Generate custom QR codes instantly for URLs, Contacts, WiFi, Text, Phone, Email, SMS, Location, Images, and PDFs.',
      });
    }
  }, [currentView, activeTool]);

  // Derived payload string based on active tool
  const currentPayload = useMemo(() => {
    switch (activeTool) {
      case 'url':
        return formData.url.url || 'https://example.com';
      case 'text':
        return formData.text.text || 'Sample Text';
      case 'phone':
        return `tel:${formData.phone.countryCode}${formData.phone.phone}`;
      case 'contact':
        return generateVCardString(formData.contact);
      case 'wifi':
        return generateWiFiString(formData.wifi);
      case 'email':
        return `mailto:${formData.email.email}?subject=${encodeURIComponent(formData.email.subject)}&body=${encodeURIComponent(formData.email.body)}`;
      case 'sms':
        return `smsto:${formData.sms.phone}:${formData.sms.message}`;
      case 'location':
        return `https://maps.google.com/?q=${formData.location.lat},${formData.location.lng}`;
      case 'image':
        return formData.image.sourceMode === 'upload' && formData.image.fileDataUrl
          ? formData.image.fileDataUrl
          : formData.image.fileUrl || 'https://example.com';
      case 'pdf':
        return formData.pdf.sourceMode === 'upload' && formData.pdf.fileDataUrl
          ? formData.pdf.fileDataUrl
          : formData.pdf.fileUrl || 'https://example.com';
      default:
        return 'https://example.com';
    }
  }, [activeTool, formData]);

  // Action: Change active form data
  const handleFormDataChange = (tool: ToolType, updated: any) => {
    setFormData((prev) => ({
      ...prev,
      [tool]: updated,
    }));
  };

  // Action: Select a tool
  const handleSelectTool = (toolId: ToolType) => {
    setActiveTool(toolId);
    setCurrentView('tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action: Save QR code to local storage
  const handleSaveQR = async () => {
    const previewUrl = await generateQRDataURL(currentPayload, styleConfig, 'image/png', 1);
    const activeToolMeta = TOOLS_LIST.find((t) => t.id === activeTool);
    const newItem = saveQRItem({
      title: activeToolMeta ? activeToolMeta.name : 'Saved QR',
      toolType: activeTool,
      rawPayload: currentPayload.length > 80 ? currentPayload.substring(0, 80) + '...' : currentPayload,
      previewDataUrl: previewUrl,
      styleConfig: styleConfig,
    });
    setSavedItems(getSavedQRs());
  };

  // Action: Delete a saved QR
  const handleDeleteSaved = (id: string) => {
    const updated = deleteSavedQR(id);
    setSavedItems(updated);
  };

  // Action: Clear all saved QRs
  const handleClearAllSaved = () => {
    clearAllSavedQRs();
    setSavedItems([]);
  };

  // Action: Load saved QR into editor
  const handleLoadSavedItem = (item: SavedQRItem) => {
    setActiveTool(item.toolType);
    setStyleConfig(item.styleConfig);
    setCurrentView('tool');
  };

  // Action: Open Share modal
  const handleOpenShareModal = async () => {
    const previewUrl = await generateQRDataURL(currentPayload, styleConfig, 'image/png', 1);
    setShareDataUrl(previewUrl);
    setShareModalOpen(true);
  };

  const currentToolMeta = TOOLS_LIST.find((t) => t.id === activeTool);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <Header
        currentView={currentView}
        activeTool={activeTool}
        savedCount={savedItems.length}
        darkMode={darkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onNavigateHome={() => {
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateAllTools={() => {
          setCurrentView('all-tools');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSavedModal={() => setSavedModalOpen(true)}
        onNewQR={() => {
          handleSelectTool('url');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* VIEW 1: DASHBOARD & ALL TOOLS */}
        {(currentView === 'dashboard' || currentView === 'all-tools') && (
          <div className="relative overflow-hidden bg-[#EDF2F6] dark:bg-slate-950 min-h-[calc(100vh-4.5rem)] pt-6 sm:pt-8 pb-16">
            {/* Background Organic Curved Blobs matching reference image exactly */}
            {/* Top-right large teal blob */}
            <div className="absolute top-0 right-0 w-[280px] sm:w-[380px] h-[340px] sm:h-[440px] bg-[#00BFA5] dark:bg-teal-700/30 rounded-bl-[180px] pointer-events-none" />
            {/* Mid-left teal organic blob */}
            <div className="absolute top-[22%] -left-12 w-[180px] sm:w-[240px] h-[320px] sm:h-[400px] bg-[#00BFA5] dark:bg-teal-700/20 rounded-r-[150px] pointer-events-none" />
            {/* Right-side dark navy organic blob */}
            <div className="absolute top-[28%] -right-8 w-[160px] sm:w-[220px] h-[280px] sm:h-[350px] bg-[#1E2B37] dark:bg-slate-800/80 rounded-l-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6">
              <div className="pt-2 pb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Tools Dashboard
                </h1>
              </div>

              <ToolGrid searchQuery={searchQuery} onSelectTool={handleSelectTool} />
            </div>
          </div>
        )}

        {/* VIEW 2: INDIVIDUAL TOOL GENERATOR LAYOUT */}
        {currentView === 'tool' && (
          <div className="bg-[#EDF2F6] dark:bg-slate-950 min-h-[calc(100vh-4.5rem)] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Breadcrumb Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                    <span>Dashboard</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  <span className="text-slate-900 dark:text-white font-bold">{currentToolMeta?.name}</span>
                </div>

                {/* Tool Switcher Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                  {TOOLS_LIST.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTool(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeTool === t.id
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

            {/* Tool Header Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {currentToolMeta?.name} Generator
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  {currentToolMeta?.shortDesc}
                </p>
              </div>
            </div>

            {/* Two-Column Tool Generator Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Input Form & Customization Panel (8 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Inputs Form */}
                <ToolForm
                  toolType={activeTool}
                  formData={formData}
                  onChangeFormData={handleFormDataChange}
                />

                {/* Customization & Styling Panel */}
                <CustomizationPanel
                  config={styleConfig}
                  onChangeConfig={setStyleConfig}
                />
              </div>

              {/* RIGHT COLUMN: Sticky Live Preview (5 cols) */}
              <div className="lg:col-span-5">
                <QRPreview
                  payload={currentPayload}
                  toolType={activeTool}
                  config={styleConfig}
                  onSaveQR={handleSaveQR}
                  onShareQR={handleOpenShareModal}
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onOpenModal={(type) => setActiveLegalModal(type)}
      />

      {/* Modals & Drawers */}
      <SavedQRsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedItems={savedItems}
        onDelete={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
        onLoadItem={handleLoadSavedItem}
      />

      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        payload={currentPayload}
        previewDataUrl={shareDataUrl}
        onDownload={() => {
          const downloadBtn = document.getElementById('qr-download-btn');
          downloadBtn?.click();
        }}
      />
    </div>
  );
}
