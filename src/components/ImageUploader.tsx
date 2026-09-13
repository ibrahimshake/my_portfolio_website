import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, X, Check, Camera, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  aspectRatio?: 'square' | 'video' | 'auto';
  helperText?: string;
  maxDimension?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'auto',
  helperText = 'Upload JPEG, PNG, or WebP from your device (auto-optimized).',
  maxDimension = 1200
}) => {
  const [mode, setMode] = useState<'device' | 'url'>(value && value.startsWith('http') ? 'url' : 'device');
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compress and convert image file to Data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setError(null);
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate new dimensions respecting aspect ratio
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to raw data URL
            onChange(e.target?.result as string);
            setProcessing(false);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed WebP or JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
          setProcessing(false);
        } catch (err) {
          console.error('Image processing error:', err);
          // Fallback to original
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
          setProcessing(false);
        }
      };
      img.onerror = () => {
        setError('Failed to load image file.');
        setProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
          <span>{label}</span>
        </label>
        
        {/* Toggle between Device Upload and URL */}
        <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('device')}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              mode === 'device' 
                ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>Device</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              mode === 'url' 
                ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Preview Section if Image exists */}
      {value ? (
        <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 flex items-center gap-3">
          <div className={`relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shrink-0 ${
            aspectRatio === 'square' ? 'w-16 h-16' : 'w-24 h-16'
          }`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs text-zinc-200 font-medium truncate">
              {value.startsWith('data:') ? 'Custom Photo (Uploaded from Device)' : value}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <Check className="h-3 w-3" />
                <span>Ready to save</span>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {/* Input Area based on Mode */}
      {mode === 'device' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-950/20'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 hover:bg-zinc-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {processing ? (
            <div className="flex flex-col items-center justify-center py-2 text-xs text-emerald-400 gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Optimizing photo...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 py-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
                <Camera className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-zinc-200">
                Tap to choose from Phone / Computer
              </p>
              <p className="text-[11px] text-zinc-500">
                {helperText}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none font-mono"
          />
          <p className="text-[11px] text-zinc-500">
            Paste a public direct link to an image file.
          </p>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-400">{error}</p>
      )}
    </div>
  );
};
