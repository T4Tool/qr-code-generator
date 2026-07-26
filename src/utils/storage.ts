import { SavedQRItem } from '../types';

const STORAGE_KEY = 'qr_generator_saved_items_v1';

export function getSavedQRs(): SavedQRItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved QRs from storage:', err);
    return [];
  }
}

export function saveQRItem(item: Omit<SavedQRItem, 'id' | 'createdAt'>): SavedQRItem {
  const existing = getSavedQRs();
  const newItem: SavedQRItem = {
    ...item,
    id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: Date.now(),
  };

  const updated = [newItem, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50))); // limit to 50
  } catch (err) {
    console.warn('Storage limit reached, saving trimmed list:', err);
  }
  return newItem;
}

export function deleteSavedQR(id: string): SavedQRItem[] {
  const existing = getSavedQRs();
  const filtered = existing.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to update storage after deletion:', err);
  }
  return filtered;
}

export function clearAllSavedQRs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
