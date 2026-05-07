'use client';

import { useState, useCallback, useRef } from 'react';
import { Platform } from '@/types';
import { toBase64 } from '@/lib/utils';
import { AnalyzeResponse } from '@/types';
import { analyzePost } from '@/lib/api';

interface Props {
  onResult: (result: AnalyzeResponse, caption: string) => void;
}

type ExtendedPlatform = 'instagram' | 'youtube';

const PLATFORMS: { id: ExtendedPlatform; label: string; icon: string; accent: string }[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
    accent: 'from-pink-500 via-rose-500 to-orange-400',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    accent: 'from-red-500 to-red-600',
  },
];

export default function UploadForm({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState<ExtendedPlatform>('instagram');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    const isVideo = f.type.startsWith('video/');
    const isImage = f.type.startsWith('image/');
    if (!isVideo && !isImage) return;
    setFile(f);
    setFileType(isVideo ? 'video' : 'image');
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !caption.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const b64 = fileType === 'image' ? await toBase64(file) : '';
      const apiPlatform: Platform = platform === 'youtube' ? 'instagram' : platform; // map to shared type
      const result = await analyzePost({ image: b64, caption, platform: apiPlatform });
      onResult(result, caption);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlatform = PLATFORMS.find((p) => p.id === platform)!;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-5">

      {/* ─── Platform Selector ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map((p) => {
          const active = platform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium
                transition-all duration-200 overflow-hidden group
                ${active
                  ? 'border-transparent text-white shadow-lg'
                  : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70 bg-white/[0.03]'}
              `}
            >
              {active && (
                <span className={`absolute inset-0 bg-gradient-to-r ${p.accent} opacity-20`} />
              )}
              <span
                className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-white/40'}`}
                dangerouslySetInnerHTML={{ __html: p.icon }}
              />
              <span className="relative z-10">{p.label}</span>
              {active && (
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${p.accent}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Drop Zone / Preview ───────────────────────── */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300
          ${file ? 'border-transparent cursor-default' : 'cursor-pointer'}
          ${dragOver
            ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
            : file
              ? 'border-white/0'
              : 'border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.04]'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {file && preview ? (
          <>
            {/* Preview */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
              {fileType === 'video' ? (
                <video src={preview} className="w-full h-full object-contain" controls />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              )}
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                <button
                  type="button"
                  onClick={clearFile}
                  className="ml-auto px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur text-white text-xs hover:bg-red-500/60 transition-colors"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur text-white text-xs hover:bg-white/20 transition-colors"
                >
                  Replace
                </button>
              </div>
            </div>
            {/* File info bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border-t border-white/5">
              <span className="text-lg">{fileType === 'video' ? '🎬' : '🖼️'}</span>
              <span className="text-white/50 text-xs truncate flex-1">{file.name}</span>
              <span className="text-white/30 text-xs flex-shrink-0">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-3 select-none">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              📁
            </div>
            <div className="text-center space-y-1">
              <p className="text-white/70 text-sm font-medium">
                Drop your file here, or{' '}
                <span className={`bg-gradient-to-r ${selectedPlatform.accent} bg-clip-text text-transparent`}>
                  browse
                </span>
              </p>
              <p className="text-white/25 text-xs">Supports JPG, PNG, GIF, MP4, MOV · Max 100 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── Caption Input ─────────────────────────────── */}
      <div className="relative">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={`Write your ${selectedPlatform.label} caption...`}
          rows={4}
          maxLength={2200}
          className="
            w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 pt-4 pb-8
            text-white/80 placeholder-white/20 text-sm leading-relaxed resize-none
            focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.06]
            transition-all duration-200
          "
        />
        <div className="absolute bottom-3 right-4 flex items-center gap-3">
          <span className={`text-xs transition-colors ${caption.length > 2000 ? 'text-red-400' : 'text-white/20'}`}>
            {caption.length}/2200
          </span>
        </div>
      </div>

      {/* ─── Error ─────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <span className="text-red-400 text-sm">⚠ {error}</span>
        </div>
      )}

      {/* ─── Submit ────────────────────────────────────── */}
      <button
        type="submit"
        disabled={!file || !caption.trim() || loading}
        className={`
          relative w-full py-3.5 rounded-2xl font-semibold text-sm overflow-hidden
          transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
          ${!loading ? 'hover:scale-[1.01] active:scale-[0.99]' : ''}
        `}
      >
        {/* Gradient background */}
        <span className={`absolute inset-0 bg-gradient-to-r ${selectedPlatform.accent} opacity-90`} />
        {/* Shimmer on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing your content...
            </>
          ) : (
            <>
              ⚡ Analyze My Post
            </>
          )}
        </span>
      </button>

    </form>
  );
}
