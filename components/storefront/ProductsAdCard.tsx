import Image from 'next/image';

const ProductsAdCard = () => (
  <div className="relative bg-[#232323] rounded-2xl flex flex-col md:flex-row items-center justify-between px-8 py-8  min-h-[180px] max-w-6xl mx-auto mb-8">
    {/* Decorative SVG swoosh */}
    {/* <svg className="absolute left-0 top-0 w-full h-full z-0" viewBox="0 0 1200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 180 Q 400 60 800 180 T 1200 60" stroke="#E6F16A" strokeWidth="16" fill="none" />
    </svg> */}
    <svg className='absolute md:left-[15%] hidden top-[6%]' width="900" height="205" viewBox="0 0 882 247" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_150_12303)">
<path d="M56.0357 415.291C109.521 153.943 300.678 115.022 407.343 141.955M407.343 141.955C481.6 160.705 514.908 211.373 432.306 241.128C301.442 288.27 198.756 238.036 407.343 141.955ZM407.343 141.955C425.438 133.62 445.876 124.94 468.842 115.948C698.993 25.8369 805.334 119.33 855.184 176.84" stroke="#DDE887" strokeWidth="13" strokeLinecap="round"/>
</g>
<defs>
<clipPath id="clip0_150_12303">
<rect width="881" height="247" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>

    {/* Text and button */}
    <div className="relative z-10 flex-1 flex flex-col items-start justify-center md:pl-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#E6F16A] mb-6 max-w-lg leading-tight">
        Grab up to 50% on Top Selling products now
      </h2>
      <button className="border border-white text-white px-8 py-2 rounded-full font-semibold transition hover:bg-white hover:text-[#232323]">
        Explore now
      </button>
    </div>
    {/* Images */}
    <div className="absolute md:w-32 hidden h-40 md:w-[30rem] md:h-52 right-[1%] top-[5%]">
        <Image src="/prodads.png" alt="Person 2" fill className="object-contain" />
    </div>
    {/* <div className="relative z-10 flex-shrink-0 flex items-end md:items-center mt-8 md:mt-0 md:ml-8">
      <div className="relative w-32 h-40 md:w-40 md:h-52">
        <Image src="/hero.jpg" alt="Person 1" fill className="object-contain" />
      </div>
      <div className="relative w-32 h-40 md:w-40 md:h-52 -ml-8 md:-ml-12">
        <Image src="/prodads.png" alt="Person 2" fill className="object-contain" />
      </div>
    </div> */}
  </div>
);

export default ProductsAdCard; 