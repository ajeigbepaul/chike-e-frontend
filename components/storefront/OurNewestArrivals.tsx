import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from 'react';

const sliderImages = ['/cat1.svg', '/cat3.svg', '/cat2.svg'];

const OurNewestArrivals = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* First column: title + nav, then slider */}
        <div className="flex flex-col h-full">
          {/* Title and arrows */}
          <div className="flex items-center justify-between mb-6 pr-4">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Our newest<br />arrivals
            </h2>
            <div className="flex gap-3 ml-4">
              <button ref={prevRef} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-brand-yellow text-brand-yellow bg-white hover:bg-brand-yellow hover:text-white transition" aria-label="Previous">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button ref={nextRef} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-brand-yellow text-brand-yellow bg-white hover:bg-brand-yellow hover:text-white transition" aria-label="Next">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          {/* Swiper slider */}
          <div className="flex-1 w-full h-80 md:h-[420px] rounded-2xl overflow-hidden">
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={swiper => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              spaceBetween={24}
              slidesPerView={1}
              className="h-full"
            >
              {sliderImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative w-full h-80 md:h-[420px] rounded-2xl overflow-hidden">
                    <Image src={img} alt={`Newest Arrival ${idx + 1}`} fill className="object-cover w-full h-full" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {/* Second column: image, description, button */}
        <div className="flex flex-col h-full justify-between">
          <div className="relative w-full h-40 md:h-[24rem] rounded-2xl overflow-hidden mb-2">
            <Image src="/hero.jpg" alt="Newest Arrival 2" fill className="object-cover w-full h-full" />
          </div>
          <div className="flex flex-col justify-end flex-1">
            <p className="text-gray-700 text-lg mb-6">Discover our new collections now! Experience newest models in outdoor and indoor materials.</p>
            <button className="self-start px-6 py-2 rounded-full border-2 border-brand-yellow text-brand-yellow font-semibold hover:bg-brand-yellow hover:text-white transition text-base">Shop now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurNewestArrivals; 