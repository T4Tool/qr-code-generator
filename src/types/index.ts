export type ToolType =
  | 'url'
  | 'text'
  | 'phone'
  | 'contact'
  | 'wifi'
  | 'email'
  | 'sms'
  | 'location'
  | 'image'
  | 'pdf';

export interface ToolMeta {
  id: ToolType;
  name: string;
  shortDesc: string;
  iconName: string;
  badge?: string;
  category: 'essential' | 'contact' | 'files' | 'advanced';
}

export type PatternStyle = 'square' | 'rounded' | 'dots' | 'diamond' | 'classy';
export type EyeStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'shield';
export type EyeBallStyle = 'square' | 'circle' | 'diamond' | 'heart';
export type FrameStyle = 'none' | 'top-label' | 'bottom-label' | 'card-border' | 'badge-top' | 'phone-frame';
export type GradientType = 'none' | 'linear' | 'radial';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRStyleConfig {
  foregroundColor: string;
  backgroundColor: string;
  transparentBg: boolean;
  gradientType: GradientType;
  gradientColor2: string;
  gradientAngle: number;
  patternStyle: PatternStyle;
  eyeStyle: EyeStyle;
  eyeBallStyle: EyeBallStyle;
  eyeColor: string; // empty string means use foreground color
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  logoUrl: string | null;
  logoScale: number; // 0.10 to 0.35
  logoBgColor: string;
  logoBgShape: 'circle' | 'square' | 'none';
  logoMargin?: number;
  size: number; // preview rendering size in px
  margin: number; // module margin quiet zone (0-8)
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface URLFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface PhoneFormData {
  phone: string;
  countryCode: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  website: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  notes: string;
}

export interface WiFiFormData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EmailFormData {
  email: string;
  subject: string;
  body: string;
}

export interface SMSFormData {
  phone: string;
  message: string;
}

export interface LocationFormData {
  lat: string;
  lng: string;
  locationName: string;
}

export interface ImageFormData {
  sourceMode: 'upload' | 'url';
  fileDataUrl: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export interface PDFFormData {
  sourceMode: 'upload' | 'url';
  fileDataUrl: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export type AllFormData = {
  url: URLFormData;
  text: TextFormData;
  phone: PhoneFormData;
  contact: ContactFormData;
  wifi: WiFiFormData;
  email: EmailFormData;
  sms: SMSFormData;
  location: LocationFormData;
  image: ImageFormData;
  pdf: PDFFormData;
};

export interface SavedQRItem {
  id: string;
  title: string;
  toolType: ToolType;
  rawPayload: string;
  previewDataUrl: string;
  styleConfig: QRStyleConfig;
  createdAt: number;
}

export interface PresetTheme {
  id: string;
  name: string;
  foregroundColor: string;
  backgroundColor: string;
  gradientType: GradientType;
  gradientColor2: string;
  patternStyle: PatternStyle;
  eyeStyle: EyeStyle;
  eyeBallStyle: EyeBallStyle;
  eyeColor: string;
}
