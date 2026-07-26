import { WiFiFormData } from '../types';

export function generateWiFiString(data: WiFiFormData): string {
  // Escapes special characters: \, ;, ,, :
  const escapeString = (str: string) => {
    return str.replace(/([\\;,:"])/g, '\\$1');
  };

  const ssid = escapeString(data.ssid || '');
  const password = escapeString(data.password || '');
  const type = data.encryption || 'WPA';
  const hidden = data.hidden ? 'true' : 'false';

  return `WIFI:S:${ssid};T:${type};P:${password};H:${hidden};;`;
}
