'use client'

import { useState } from 'react'

interface AssetImageProps {
  src: string
  alt: string
  label?: string
  className?: string
}

export function AssetImage({ src, alt, label, className = '' }: AssetImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return <AssetPlaceholder filename={src} label={label} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto ${className}`}
      onError={() => setError(true)}
    />
  )
}

interface PlaceholderProps {
  filename: string
  label?: string
  aspectRatio?: string
}

interface AssetVideoProps {
  src: string
  poster?: string
  label?: string
  className?: string
}

export function AssetVideo({ src, poster, label, className = '' }: AssetVideoProps) {
  const [error, setError] = useState(false)

  if (error) {
    return <AssetPlaceholder filename={src} label={label} aspectRatio="aspect-video" />
  }

  return (
    <div className={`w-full max-w-3xl mx-auto rounded-xl overflow-hidden bg-black ${className}`}>
      <video
        controls
        poster={poster}
        className="w-full block"
        onError={() => setError(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

export function AssetPlaceholder({ filename, label, aspectRatio }: PlaceholderProps) {
  return (
    <div
      className={`bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 p-12 text-slate-400 ${aspectRatio ?? ''}`}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      {label && <span className="font-body text-sm font-medium">{label}</span>}
      <span className="font-mono text-xs opacity-60">{filename}</span>
    </div>
  )
}
