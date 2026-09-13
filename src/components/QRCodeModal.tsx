import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, ShieldCheck, QrCode as QrIcon } from 'lucide-react';

interface QRCodeModalProps {
  tokenId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ tokenId, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState('');

  useEffect(() => {
    if (!isOpen || !tokenId) return;

    const url = `${window.location.origin}/verify-token?token=${encodeURIComponent(tokenId)}`;
    setVerificationUrl(url);

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 260,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        error => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [isOpen, tokenId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${tokenId}-QR.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <QrIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 id="qr-modal-title" className="font-bold text-lg leading-tight">
                Wheelchair Access QR Pass
              </h3>
              <p className="text-xs text-slate-400">Official Facility Verification Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Canvas container */}
          <div className="inline-block p-3 bg-white border-2 border-slate-200 rounded-xl shadow-inner mb-4">
            <canvas ref={canvasRef} className="mx-auto" />
          </div>

          <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Active Token Identifier
            </span>
            <code className="text-lg font-mono font-bold text-blue-800 tracking-wider select-all">
              {tokenId}
            </code>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 bg-emerald-50 text-emerald-900 text-xs p-3 rounded-lg border border-emerald-200 text-left mb-5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              <strong>Zero-PII Privacy Protection:</strong> This QR code encodes only an anonymous cryptographic token string.
              It contains no name, email, medical history, or personal identifiers.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg border border-slate-300 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Token'}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
