"use client";

import { useRef, useState } from "react";

interface Props {
  onUpload: (base64: string, mimeType: string) => void;
  loading: boolean;
}

export default function ImageUploader({ onUpload, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64 = result.split(",")[1];
      onUpload(base64, file.type);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-colors cursor-pointer
        ${dragging ? "border-orange-400 bg-orange-50" : "border-gray-300 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {preview ? (
        <div className="relative">
          <img src={preview} alt="냉장고" className="w-full h-64 object-cover rounded-2xl" />
          {loading && (
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-3xl mb-2 animate-spin">🔍</div>
                <p className="text-sm font-medium">재료 인식 중...</p>
              </div>
            </div>
          )}
          {!loading && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              탭해서 다시 촬영
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-5xl">📷</span>
          <p className="text-gray-600 font-medium">냉장고 사진 업로드</p>
          <p className="text-gray-400 text-sm">탭하거나 드래그하세요</p>
        </div>
      )}
    </div>
  );
}
