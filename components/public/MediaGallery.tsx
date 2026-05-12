'use client';

import { useState } from 'react';
import type { ListingMedia } from '@/types';

interface Props {
  media: ListingMedia[];
}

export default function MediaGallery({ media }: Props) {
  const images = media.filter((m) => m.type === 'image');
  const videos = media.filter((m) => m.type === 'video');
  const all = [...images, ...videos];
  const [activeIndex, setActiveIndex] = useState(0);

  if (all.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        No media
      </div>
    );
  }

  const active = all[activeIndex];

  return (
    <div>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {active.type === 'image' ? (
          <img
            src={active.url}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            src={active.url}
            controls
            className="h-full w-full object-contain"
          />
        )}
      </div>
      {all.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {all.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === activeIndex ? 'border-brand-500' : 'border-transparent'
              }`}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-800 text-white text-xs">
                  Video
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
