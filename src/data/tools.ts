import { ToolMeta } from '../types';

export interface ExtendedToolMeta extends ToolMeta {
  colorGradient: string;
  shortDesc: string;
}

export const TOOLS_LIST: ExtendedToolMeta[] = [
  {
    id: 'url',
    name: 'URL to QR',
    shortDesc: 'Generate QR for any Website or Link',
    iconName: 'Link',
    category: 'essential',
    colorGradient: 'bg-[#7B52F6]',
  },
  {
    id: 'text',
    name: 'Text to QR',
    shortDesc: 'Generate QR for plain text or notes',
    iconName: 'Type',
    category: 'essential',
    colorGradient: 'bg-[#2F73F6]',
  },
  {
    id: 'phone',
    name: 'Phone QR',
    shortDesc: 'Generate QR for phone numbers',
    iconName: 'Phone',
    category: 'essential',
    colorGradient: 'bg-[#34B34C]',
  },
  {
    id: 'contact',
    name: 'Contact QR',
    shortDesc: 'Generate QR for contact information',
    iconName: 'User',
    category: 'contact',
    colorGradient: 'bg-[#F78B31]',
  },
  {
    id: 'wifi',
    name: 'WiFi QR',
    shortDesc: 'Generate QR for WiFi network',
    iconName: 'Wifi',
    category: 'contact',
    colorGradient: 'bg-[#18AFA9]',
  },
  {
    id: 'email',
    name: 'Email QR',
    shortDesc: 'Generate QR for email address',
    iconName: 'Mail',
    category: 'contact',
    colorGradient: 'bg-[#FF4D60]',
  },
  {
    id: 'sms',
    name: 'SMS QR',
    shortDesc: 'Generate QR for SMS messages',
    iconName: 'MessageSquare',
    category: 'contact',
    colorGradient: 'bg-[#3B52E3]',
  },
  {
    id: 'location',
    name: 'Location QR',
    shortDesc: 'Generate QR for locations',
    iconName: 'MapPin',
    category: 'advanced',
    colorGradient: 'bg-[#22B89A]',
  },
  {
    id: 'image',
    name: 'Image QR',
    shortDesc: 'Generate QR for images',
    iconName: 'Image',
    category: 'files',
    colorGradient: 'bg-[#9A51E0]',
  },
  {
    id: 'pdf',
    name: 'PDF QR',
    shortDesc: 'Generate QR for PDF files',
    iconName: 'FileText',
    category: 'files',
    colorGradient: 'bg-[#FF4F4F]',
  },
];

