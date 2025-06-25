import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ images }: { images: string[] }) {
  const imgs = images;
  const [current, setCurrent] = useState(0);

  const prevImage = () => setCurrent((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
  const nextImage = () => setCurrent((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full max-w-md">
      <div className="relative rounded-xl overflow-hidden mb-4">
        <Image src={imgs[current]} alt="Main product" width={400} height={400} className="w-full h-96 object-cover" />
        {/* Favorite button */}
        <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow text-gray-400 hover:text-brand-yellow">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
        </button>
        {/* Carousel arrows */}
        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"><span>&larr;</span></button>
        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"><span>&rarr;</span></button>
      </div>
      <div className="flex gap-2 mt-2">
        {imgs.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-lg overflow-hidden border-2 focus:outline-none ${current === idx ? 'border-yellow-400' : 'border-transparent'}`}
            tabIndex={0}
          >
            <Image src={img} alt={`Thumb ${idx+1}`} width={70} height={70} className="w-16 h-16 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
