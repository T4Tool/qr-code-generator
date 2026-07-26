import React, { useRef } from 'react';
import {
  AllFormData,
  ToolType,
} from '../../types';
import {
  Link,
  FileText,
  Phone,
  Contact,
  Wifi,
  Mail,
  MessageSquare,
  MapPin,
  Image as ImageIcon,
  FileCheck,
  Upload,
  Camera,
  Crosshair,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface ToolFormProps {
  toolType: ToolType;
  formData: AllFormData;
  onChangeFormData: (type: ToolType, data: any) => void;
}

export const ToolForm: React.FC<ToolFormProps> = ({
  toolType,
  formData,
  onChangeFormData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Helper for field changes
  const updateField = (field: string, value: any) => {
    onChangeFormData(toolType, {
      ...formData[toolType],
      [field]: value,
    });
  };

  // Image File Handler
  const handleImageUpload = (file: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please upload a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChangeFormData('image', {
        ...formData.image,
        fileDataUrl: dataUrl,
        fileName: file.name,
        fileSize: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  // PDF File Handler
  const handlePdfUpload = (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('PDF file size exceeds 10MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChangeFormData('pdf', {
        ...formData.pdf,
        fileDataUrl: dataUrl,
        fileName: file.name,
        fileSize: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  // GPS Auto-location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateField('lat', pos.coords.latitude.toFixed(6));
        updateField('lng', pos.coords.longitude.toFixed(6));
        if (!formData.location.locationName) {
          updateField('locationName', 'My Current Location');
        }
      },
      (err) => {
        alert(`Geolocation error: ${err.message}`);
      }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
      {/* URL to QR Form */}
      {toolType === 'url' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Link className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Target Website URL</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Enter any web page link to generate QR code</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Website Address (URL)
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.url.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://example.com/your-page"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all font-medium"
                id="url-input"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
              <span>Tip: Include</span>
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[10px]">https://</code>
              <span>for standard browser redirecting when scanned.</span>
            </p>
          </div>
        </div>
      )}

      {/* Text to QR Form */}
      {toolType === 'text' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Plain Text Content</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Convert plain text, notes, or messages into QR</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Text or Note Message
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {formData.text.text.length} / 1000 chars
              </span>
            </div>
            <textarea
              rows={5}
              value={formData.text.text}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="Enter plain text, notes, instructions, passwords, or code snippets..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all font-medium leading-relaxed"
              id="text-input"
            />
          </div>
        </div>
      )}

      {/* Phone QR Form */}
      {toolType === 'phone' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Phone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Phone Dialer Number</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Instantly open phone dialer with pre-filled number</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Country Code
              </label>
              <input
                type="text"
                value={formData.phone.countryCode}
                onChange={(e) => updateField('countryCode', e.target.value)}
                placeholder="+1"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none font-mono font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="202 555 0192"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact QR (vCard) Form */}
      {toolType === 'contact' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Contact className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">vCard Business Card</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Allow users to save your full contact card into phonebook</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                value={formData.contact.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="John"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.contact.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
              <input
                type="text"
                value={formData.contact.company}
                onChange={(e) => updateField('company', e.target.value)}
                placeholder="Acme Inc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                value={formData.contact.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                placeholder="Product Director"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                value={formData.contact.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* WiFi QR Form */}
      {toolType === 'wifi' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Wifi className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">WiFi Network Credentials</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan to automatically connect to WiFi without typing passwords</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Network Name (SSID)
            </label>
            <input
              type="text"
              value={formData.wifi.ssid}
              onChange={(e) => updateField('ssid', e.target.value)}
              placeholder="Guest_WiFi_5G"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none font-medium"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                WiFi Password
              </label>
              <input
                type="text"
                value={formData.wifi.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="SuperSecretPassword123"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none font-mono font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Encryption Type
              </label>
              <select
                value={formData.wifi.encryption}
                onChange={(e) => updateField('encryption', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none font-medium"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.wifi.hidden}
              onChange={(e) => updateField('hidden', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Hidden SSID Network
            </span>
          </label>
        </div>
      )}

      {/* Email QR Form */}
      {toolType === 'email' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Draft Message</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan to launch email app with pre-filled recipient and message</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={formData.email.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="support@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={formData.email.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="Customer Feedback Inquiry"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Body Message
            </label>
            <textarea
              rows={3}
              value={formData.email.body}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Hello team, I would like to inquire about..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* SMS QR Form */}
      {toolType === 'sms' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">SMS Message</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pre-fill phone number and SMS text</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.sms.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+1 555 0192"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              SMS Message Text
            </label>
            <textarea
              rows={3}
              value={formData.sms.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="SUBSCRIBE"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Location QR Form */}
      {toolType === 'location' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Map Location Coordinates</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Open exact pinpoint in Google Maps or Apple Maps</p>
              </div>
            </div>
            <button
              onClick={handleLocateMe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Detect GPS</span>
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Venue Title / Location Label
            </label>
            <input
              type="text"
              value={formData.location.locationName}
              onChange={(e) => updateField('locationName', e.target.value)}
              placeholder="Central Park West Gate"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
              <input
                type="text"
                value={formData.location.lat}
                onChange={(e) => updateField('lat', e.target.value)}
                placeholder="40.785091"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
              <input
                type="text"
                value={formData.location.lng}
                onChange={(e) => updateField('lng', e.target.value)}
                placeholder="-73.968285"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image QR Form */}
      {toolType === 'image' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Image File QR</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Embed local image data or web link into QR</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => updateField('sourceMode', 'upload')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                formData.image.sourceMode === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Upload Image
            </button>
            <button
              onClick={() => updateField('sourceMode', 'url')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                formData.image.sourceMode === 'url'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Image Web Link
            </button>
          </div>

          {formData.image.sourceMode === 'upload' ? (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />

              {formData.image.fileDataUrl ? (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={formData.image.fileDataUrl}
                      alt="Uploaded preview"
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {formData.image.fileName || 'Image File'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(formData.image.fileSize / 1024).toFixed(1)} KB • Ready
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      updateField('fileDataUrl', '');
                      updateField('fileName', '');
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center text-center group transition-all"
                  >
                    <Upload className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Gallery Upload
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WebP</span>
                  </button>

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center text-center group transition-all"
                  >
                    <Camera className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Camera Photo
                    </span>
                    <span className="text-[10px] text-slate-400">Snap directly</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hosted Image Direct URL
              </label>
              <input
                type="url"
                value={formData.image.fileUrl}
                onChange={(e) => updateField('fileUrl', e.target.value)}
                placeholder="https://images.unsplash.com/photo-example.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* PDF QR Form */}
      {toolType === 'pdf' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">PDF Document QR</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Share menus, catalogues, brochures, or ebooks</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => updateField('sourceMode', 'upload')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                formData.pdf.sourceMode === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Upload PDF File
            </button>
            <button
              onClick={() => updateField('sourceMode', 'url')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                formData.pdf.sourceMode === 'url'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              PDF Web Link
            </button>
          </div>

          {formData.pdf.sourceMode === 'upload' ? (
            <div className="space-y-3">
              <input
                type="file"
                ref={pdfInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
              />

              {formData.pdf.fileDataUrl ? (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs shadow-xs">
                      PDF
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {formData.pdf.fileName || 'Document.pdf'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(formData.pdf.fileSize / 1024).toFixed(1)} KB • Ready
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      updateField('fileDataUrl', '');
                      updateField('fileName', '');
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => pdfInputRef.current?.click()}
                  className="w-full p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center text-center group transition-all"
                >
                  <FileCheck className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Select PDF Document
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Menus, Brochures, Catalogues, Ebooks</span>
                </button>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hosted PDF Link
              </label>
              <input
                type="url"
                value={formData.pdf.fileUrl}
                onChange={(e) => updateField('fileUrl', e.target.value)}
                placeholder="https://example.com/menu.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

