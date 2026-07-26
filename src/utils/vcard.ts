import { ContactFormData } from '../types';

export function generateVCardString(data: ContactFormData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const fullName = `${data.firstName} ${data.lastName}`.trim();
  if (fullName) {
    lines.push(`FN:${fullName}`);
    lines.push(`N:${data.lastName};${data.firstName};;;`);
  }

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  if (data.jobTitle) {
    lines.push(`TITLE:${data.jobTitle}`);
  }

  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }

  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  }

  if (data.website) {
    let url = data.website.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    lines.push(`URL:${url}`);
  }

  const addressParts = [
    '', // P.O. Box
    '', // Extended Address
    data.street || '',
    data.city || '',
    '', // State/Province
    data.zip || '',
    data.country || '',
  ];

  if (data.street || data.city || data.zip || data.country) {
    lines.push(`ADR;TYPE=WORK:;;${addressParts.slice(2).join(';')}`);
  }

  if (data.notes) {
    lines.push(`NOTE:${data.notes.replace(/\n/g, '\\n')}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}
