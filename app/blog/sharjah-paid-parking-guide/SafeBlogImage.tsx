"use client";

import { useState } from "react";
import Image from "next/image";

type SafeBlogImageProps = {
  src: string;
  alt: string;
  label: string;
};

export default function SafeBlogImage({ src, alt, label }: SafeBlogImageProps) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div
        aria-label={alt}
        className="relative flex aspect-[16/10] min-h-[260px] items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6 text-center"
      >
        <div className="absolute inset-x-8 top-8 h-24 rounded-b-[40px] bg-slate-900 shadow-xl" />
        <div className="absolute left-1/2 top-8 h-44 w-4 -translate-x-1/2 bg-slate-800" />
        <div className="absolute left-1/2 top-20 w-[min(78%,520px)] -translate-x-1/2 border-4 border-sky-700 bg-sky-600 p-5 text-white shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em]">Sharjah</p>
          <p className="mt-2 text-2xl font-black">Paid Parking</p>
          <p className="mt-1 text-sm font-semibold">8 AM - 12 Midnight</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-200">
          <div className="mx-auto mt-9 h-2 w-3/4 bg-white" />
        </div>
        <div className="relative mt-40 max-w-xl rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Original Photo Slot
          </p>
          <p className="mt-2 text-lg font-bold text-slate-950">{label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload your real AMJDrive photo at {src}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] bg-slate-100">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 1024px) 100vw, 760px"
        className="object-cover"
        onError={() => setMissing(true)}
      />
    </div>
  );
}
