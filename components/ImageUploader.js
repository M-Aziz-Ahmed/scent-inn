'use client'
import { useState, useRef } from 'react'

/**
 * ImageUploader — drag-and-drop / click-to-upload component that posts to /api/upload
 * and returns Cloudinary URLs back to the parent via onChange(urls[]).
 */
export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  async function uploadFile(file) {
    const token = localStorage.getItem('admin_token')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Upload failed')
    }
    const data = await res.json()
    return data.url
  }

  async function handleFiles(files) {
    if (!files?.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile))
      onChange([...images, ...urls])
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  function removeImage(index) {
    const next = images.filter((_, i) => i !== index)
    onChange(next)
  }

  function moveImage(from, to) {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    ;[next[from], next[to]] = [next[to], next[from]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-[#c9a84c] bg-[#c9a84c]/5' : 'border-[#c9a84c]/30 hover:border-[#c9a84c]/60'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-[#c9a84c]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-gray-400">
              Drag & drop images here or <span className="text-[#c9a84c]">click to browse</span>
            </p>
            <p className="text-xs text-gray-600">JPG, PNG, WEBP — auto-optimized via Cloudinary</p>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-lg overflow-hidden border border-[#c9a84c]/20">
              <img src={url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
              {/* Badge for main image */}
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-[#c9a84c] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
              {/* Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    title="Move left"
                    className="p-1.5 bg-[#1a1a1a] rounded text-white hover:text-[#c9a84c]"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  title="Remove"
                  className="p-1.5 bg-red-900/80 rounded text-white hover:bg-red-700"
                >
                  ✕
                </button>
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    title="Move right"
                    className="p-1.5 bg-[#1a1a1a] rounded text-white hover:text-[#c9a84c]"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
