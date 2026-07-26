import React, { useState, useRef } from 'react';
import { QRStyleConfig, PatternStyle, EyeStyle, EyeBallStyle, FrameStyle, GradientType, ErrorCorrectionLevel } from '../../types';
import { PRESET_THEMES } from '../../utils/presets';
import {
  Palette,
  LayoutGrid,
  Square,
  Upload,
  Sliders,
  Trash2,
  Sparkles,
  ChevronDown,
  Wifi,
  Phone,
  Mail,
  Link as LinkIcon,
  Globe,
  Heart,
  Star,
  Shield,
  Layers,
} from 'lucide-react';

interface CustomizationPanelProps {
  config: QRStyleConfig;
  onChangeConfig: (updated: QRStyleConfig) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  config,
  onChangeConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'shapes' | 'frame' | 'logo' | 'quality'>('presets');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof QRStyleConfig, val: any) => {
    onChangeConfig({
      ...config,
      [key]: val,
    });
  };

  // Logo uploader
  const handleLogoUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChangeConfig({
        ...config,
        logoUrl: dataUrl,
        errorCorrectionLevel: 'H', // auto boost ECC for scannability
      });
    };
    reader.readAsDataURL(file);
  };

  // Preset logo helper SVGs
  const applyPresetLogo = (type: string) => {
    let svgStr = '';
    if (type === 'wifi') svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0f172a"><path d="M12 3a16.971 16.971 0 0 0-9.192 2.684.75.75 0 0 0 .832 1.248A15.471 15.471 0 0 1 12 4.5c3.55 0 6.84 1.196 9.36 3.432a.75.75 0 0 0 .832-1.248A16.971 16.971 0 0 0 12 3zm0 4.5a12.478 12.478 0 0 0-6.83 2.052.75.75 0 0 0 .822 1.254A10.978 10.978 0 0 1 12 6a10.978 10.978 0 0 1 6.008 1.806.75.75 0 0 0 .822-1.254A12.478 12.478 0 0 0 12 7.5zm0 4.5a7.985 7.985 0 0 0-4.469 1.362.75.75 0 1 0 .838 1.244A6.485 6.485 0 0 1 12 13.5a6.485 6.485 0 0 1 3.631 1.106.75.75 0 1 0 .838-1.244A7.985 7.985 0 0 0 12 12zm0 4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5z"/></svg>`;
    else if (type === 'link') svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0f172a"><path d="M13.293 6.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414l8-8z"/></svg>`;
    else if (type === 'heart') svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e11d48"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    else if (type === 'star') svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d97706"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;

    if (svgStr) {
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      onChangeConfig({
        ...config,
        logoUrl: url,
        errorCorrectionLevel: 'H',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Palette className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span>QR Customization & Styling</span>
        </h3>
        <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-200/80 dark:border-teal-900/50">
          Real-time Preview
        </span>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'presets'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Presets
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'colors'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Colors
        </button>

        <button
          onClick={() => setActiveTab('shapes')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'shapes'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Pattern & Eyes
        </button>

        <button
          onClick={() => setActiveTab('frame')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'frame'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          Frame & Text
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'logo'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Logo / Icon
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
            activeTab === 'quality'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Size & Quality
        </button>
      </div>

      {/* Tab 1: PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a professionally designed theme to instantly transform your QR code appearance.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onChangeConfig({
                    ...config,
                    foregroundColor: theme.foregroundColor,
                    backgroundColor: theme.backgroundColor,
                    gradientType: theme.gradientType,
                    gradientColor2: theme.gradientColor2,
                    patternStyle: theme.patternStyle,
                    eyeStyle: theme.eyeStyle,
                    eyeBallStyle: theme.eyeBallStyle,
                    eyeColor: theme.eyeColor,
                  });
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-950 flex flex-col items-center gap-2 group transition-all text-center"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border shadow-xs"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.foregroundColor + '40',
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-sm"
                    style={{ backgroundColor: theme.foregroundColor }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: COLORS */}
      {activeTab === 'colors' && (
        <div className="space-y-5">
          {/* Foreground & Background picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Foreground / Module Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.foregroundColor}
                  onChange={(e) => update('foregroundColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={config.foregroundColor}
                  onChange={(e) => update('foregroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.backgroundColor}
                  disabled={config.transparentBg}
                  onChange={(e) => update('backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 disabled:opacity-40"
                />
                <input
                  type="text"
                  value={config.backgroundColor}
                  disabled={config.transparentBg}
                  onChange={(e) => update('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono disabled:opacity-40"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={config.transparentBg}
                  onChange={(e) => update('transparentBg', e.target.checked)}
                  className="w-3.5 h-3.5 text-indigo-600 rounded"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Transparent Background</span>
              </label>
            </div>
          </div>

          {/* Gradient Controls */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Gradient Option</label>
              <select
                value={config.gradientType}
                onChange={(e) => update('gradientType', e.target.value as GradientType)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="none">Solid Color</option>
                <option value="linear">Linear Gradient</option>
                <option value="radial">Radial Gradient</option>
              </select>
            </div>

            {config.gradientType !== 'none' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Secondary Gradient Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.gradientColor2}
                      onChange={(e) => update('gradientColor2', e.target.value)}
                      className="w-8 h-8 rounded-md cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={config.gradientColor2}
                      onChange={(e) => update('gradientColor2', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                {config.gradientType === 'linear' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Gradient Angle ({config.gradientAngle || 45}°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={config.gradientAngle || 45}
                      onChange={(e) => update('gradientAngle', Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Eye Outer Frame Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Custom Corner Eye Color (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.eyeColor || config.foregroundColor}
                onChange={(e) => update('eyeColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={config.eyeColor}
                placeholder="Same as Foreground"
                onChange={(e) => update('eyeColor', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
              />
              {config.eyeColor && (
                <button
                  onClick={() => update('eyeColor', '')}
                  className="px-2.5 py-2 text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950 rounded-xl"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SHAPES (Patterns, Eyes, Balls) */}
      {activeTab === 'shapes' && (
        <div className="space-y-5">
          {/* Module Pattern */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Module Pattern Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'square', label: 'Classic' },
                { id: 'rounded', label: 'Rounded' },
                { id: 'dots', label: 'Dots' },
                { id: 'diamond', label: 'Diamond' },
                { id: 'classy', label: 'Classy' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => update('patternStyle', item.id as PatternStyle)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    config.patternStyle === item.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eye Frame Style */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Corner Eye Outer Frame
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'square', label: 'Square' },
                { id: 'rounded', label: 'Rounded' },
                { id: 'circle', label: 'Circle' },
                { id: 'leaf', label: 'Leaf' },
                { id: 'shield', label: 'Shield' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => update('eyeStyle', item.id as EyeStyle)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    config.eyeStyle === item.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eye Ball Style */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Corner Eye Center Ball
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'square', label: 'Square' },
                { id: 'circle', label: 'Circle' },
                { id: 'diamond', label: 'Diamond' },
                { id: 'heart', label: 'Heart' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => update('eyeBallStyle', item.id as EyeBallStyle)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    config.eyeBallStyle === item.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: FRAME & TEXT */}
      {activeTab === 'frame' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Frame Container Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'No Frame' },
                { id: 'top-label', label: 'Top Banner' },
                { id: 'bottom-label', label: 'Bottom Banner' },
                { id: 'card-border', label: 'Card Container' },
                { id: 'badge-top', label: 'Top Badge' },
                { id: 'phone-frame', label: 'Phone Frame' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => update('frameStyle', item.id as FrameStyle)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    config.frameStyle === item.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {config.frameStyle !== 'none' && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Frame Banner Text
                </label>
                <input
                  type="text"
                  value={config.frameText}
                  onChange={(e) => update('frameText', e.target.value)}
                  placeholder="SCAN ME"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Frame Color
                  </label>
                  <input
                    type="color"
                    value={config.frameColor}
                    onChange={(e) => update('frameColor', e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border-0"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={config.frameTextColor}
                    onChange={(e) => update('frameTextColor', e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: LOGO / ICON */}
      {activeTab === 'logo' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={logoInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
          />

          {config.logoUrl ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={config.logoUrl}
                  alt="Custom QR Logo"
                  className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Custom Logo Active</p>
                  <p className="text-[11px] text-slate-500">Error correction auto-boosted to 30% (H)</p>
                </div>
              </div>
              <button
                onClick={() => update('logoUrl', null)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center group"
              >
                <Upload className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Upload Custom Logo Image
                </span>
                <span className="text-[10px] text-slate-400">PNG, SVG, or JPG (Square format recommended)</span>
              </button>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Or Pick a Standard Icon Preset
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyPresetLogo('wifi')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-950"
                    title="WiFi Icon"
                  >
                    <Wifi className="w-5 h-5 text-indigo-500" />
                  </button>
                  <button
                    onClick={() => applyPresetLogo('link')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-950"
                    title="Link Icon"
                  >
                    <LinkIcon className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => applyPresetLogo('heart')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-950"
                    title="Heart Icon"
                  >
                    <Heart className="w-5 h-5 text-rose-500" />
                  </button>
                  <button
                    onClick={() => applyPresetLogo('star')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-950"
                    title="Star Icon"
                  >
                    <Star className="w-5 h-5 text-amber-500" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {config.logoUrl && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logo Size Scale ({Math.round((config.logoScale || 0.22) * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.12"
                  max="0.32"
                  step="0.02"
                  value={config.logoScale || 0.22}
                  onChange={(e) => update('logoScale', Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Logo Background Shape
                  </label>
                  <select
                    value={config.logoBgShape}
                    onChange={(e) => update('logoBgShape', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="circle">Circle</option>
                    <option value="square">Rounded Box</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Logo Backing Color
                  </label>
                  <input
                    type="color"
                    value={config.logoBgColor || '#ffffff'}
                    onChange={(e) => update('logoBgColor', e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: SIZE & QUALITY */}
      {activeTab === 'quality' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Preview Box Dimension ({config.size || 320}px)
            </label>
            <input
              type="range"
              min="200"
              max="500"
              step="20"
              value={config.size || 320}
              onChange={(e) => update('size', Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Quiet Zone Margin ({config.margin ?? 2} modules)
            </label>
            <input
              type="range"
              min="0"
              max="8"
              value={config.margin ?? 2}
              onChange={(e) => update('margin', Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Error Correction Recovery Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'L', label: 'Low (7%)' },
                { id: 'M', label: 'Medium (15%)' },
                { id: 'Q', label: 'Quartile (25%)' },
                { id: 'H', label: 'High (30%)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => update('errorCorrectionLevel', item.id as ErrorCorrectionLevel)}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center ${
                    config.errorCorrectionLevel === item.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
