import React from 'react';
import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            FMS Vision Pro
          </span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
            YOLO26 + Kalman + Transformer
          </span>
        </div>
      </div>
    </header>
  );
}
