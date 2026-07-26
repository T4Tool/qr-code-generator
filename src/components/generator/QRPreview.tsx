import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { QRStyleConfig, ToolType } from '../../types';
import { renderQRToCanvas, generateQRSVG } from '../../utils/qrGenerator';
import { Download, Bookmark, Share2, Check, Sparkles, Image, FileCode } from 'lucide-react';

interface QRPreviewProps {
  payload: string;
  toolType: ToolType;
  config: QRStyleConfig;
  onSaveQR: () => void;
  onShareQR: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  toolType,
  config,
  onSaveQR,
  onShareQR,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'jpg'>('png');
  const [exportQuality, setExportQuality] = useState<number>(2); // 1x, 2x HD, 4x Ultra
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Render canvas whenever payload or config changes
  useEffect(() => {
    if (!canvasRef.current) return;
    renderQRToCanvas(canvasRef.current, payload, config, 1);
  }, [payload, config]);

  // Handle Download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (downloadFormat === 'svg') {
        const svgContent = await generateQRSVG(payload, config);
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        triggerFileDownload(url, `qr-${toolType}-${Date.now()}.svg`);
      } else {
        const exportCanvas = document.createElement('canvas');
        await renderQRToCanvas(exportCanvas, payload, config, exportQuality);
        const mime = downloadFormat === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = exportCanvas.toDataURL(mime, 0.95);
        triggerFileDownload(dataUrl, `qr-${toolType}-${Date.now()}.${downloadFormat}`);
      }

      // Celebrate with confetti!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to generate download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  const triggerFileDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSave = () => {
    onSaveQR();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="sticky top-20 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span>Live QR Code Preview</span>
        </h3>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-200/60 dark:border-emerald-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Ready to Scan
        </span>
      </div>

      {/* QR Canvas Display */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50/60 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[290px] relative overflow-hidden group">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto object-contain shadow-md rounded-xl transition-transform duration-300 group-hover:scale-102"
        />
      </div>

      {/* Export Format & Resolution Selector */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Export Format</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setDownloadFormat('png')}
              className={`px-3 py-1 rounded-lg transition-all text-xs ${
                downloadFormat === 'png'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setDownloadFormat('svg')}
              className={`px-3 py-1 rounded-lg transition-all text-xs ${
                downloadFormat === 'svg'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              SVG
            </button>
            <button
              onClick={() => setDownloadFormat('jpg')}
              className={`px-3 py-1 rounded-lg transition-all text-xs ${
                downloadFormat === 'jpg'
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              JPG
            </button>
          </div>
        </div>

        {downloadFormat !== 'svg' && (
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Resolution</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setExportQuality(1)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  exportQuality === 1
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                    : 'text-slate-500'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setExportQuality(2)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  exportQuality === 2
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                    : 'text-slate-500'
                }`}
              >
                2x (HD)
              </button>
              <button
                onClick={() => setExportQuality(4)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  exportQuality === 4
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs font-bold'
                    : 'text-slate-500'
                }`}
              >
                4x (Ultra HD)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: Download, Save, Share */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          id="qr-download-btn"
          className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.2]" />
          <span>Download {downloadFormat.toUpperCase()}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            id="qr-save-btn"
            className="py-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-500" /> : <Bookmark className="w-4 h-4 text-teal-500" />}
            <span>{isSaved ? 'Saved!' : 'Save QR'}</span>
          </button>
          <button
            onClick={onShareQR}
            id="qr-share-btn"
            className="py-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-teal-500" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
