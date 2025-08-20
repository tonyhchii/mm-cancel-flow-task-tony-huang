"use client";

import Image from "next/image";

export default function CityImage() {
  return (
    <div className="mb-3 md:mb-0 md:self-stretch md:flex md:flex-col md:flex-shrink-0 md:w-[400px] w-[296px] mx-auto md:mx-0">
      <div className="relative h-[122px] md:flex-1 rounded-xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.32)] ring-1 ring-black/5">
        <Image
          src="/city.jpg"
          alt="City skyline"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
