"use client"
import Image from 'next/image';
import { useState } from 'react';

export default function AboutPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full flex overflow-hidden relative">
            {/* Left image */}
            <div className="hidden md:block w-1/2 bg-gray-100 relative">
              <Image src="/contact.svg" alt="Contact" fill className="object-cover" />
              <div className="absolute bottom-0 left-0 p-6 text-white text-sm bg-black/40 w-full">
                We're committed to responding promptly and ensuring you receive the support or information you need.
              </div>
            </div>
            {/* Right form */}
            <div className="w-full md:w-1/2 p-8 bg-white">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
              <h2 className="text-2xl font-bold mb-1">Let's Get In Touch.<span className="text-brand-yellow">.</span></h2>
              <p className="mb-4 text-gray-600 text-sm">Or just reach out manually to <a href="mailto:hello@gieniushub.vet.com" className="text-brand-yellow font-semibold">hello@gieniushub.vet.com</a>.</p>
              <form className="space-y-4">
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter your first name" className="flex-1 border rounded px-3 py-2 text-sm" />
                  <input type="text" placeholder="Enter your last name" className="flex-1 border rounded px-3 py-2 text-sm" />
                </div>
                <input type="email" placeholder="Enter your email address" className="w-full border rounded px-3 py-2 text-sm" />
                <input type="tel" placeholder="+44 (000)000-000" className="w-full border rounded px-3 py-2 text-sm" />
                <textarea placeholder="Enter your main text here" maxLength={300} className="w-full border rounded px-3 py-2 text-sm min-h-[100px]" />
                <div className="flex justify-end text-xs text-gray-400">Max wordcount: 300</div>
                <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-full font-semibold hover:bg-gray-700 transition">Submit</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-white">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          We have been empowering the<br />
          learning community since the '80s
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 mb-8">
          — Inspiring growth, innovation, and lifelong learning for generations to come, by fostering inclusive education, nurturing curiosity, and equipping learners with the tools to shape a better future.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-gray-900 text-white px-8 py-2 rounded-full font-semibold hover:bg-gray-700 transition">Explore</button>
          <button onClick={() => setShowModal(true)} className="border border-gray-900 text-gray-900 px-8 py-2 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition">Contact us</button>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Vision Card */}
        <div className="bg-[#232323] rounded-2xl p-6 text-white flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Our Vision</h2>
          <p className="mb-4 text-gray-200">Gravida in fermentum et sollicitudin ac orci phasellus egestas. Molestie a iaculis et erat pellentesque adipiscing commodo.</p>
          <div className="rounded-xl overflow-hidden">
            <Image src="/vision.svg" alt="Vision" width={400} height={220} className="w-full h-48 object-cover" />
          </div>
        </div>
        {/* Mission Card */}
        <div className="bg-[#232323] rounded-2xl p-6 text-white flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Our Mission</h2>
          <p className="mb-4 text-gray-200">Gravida in fermentum et sollicitudin ac orci phasellus egestas. Molestie a iaculis et erat pellentesque adipiscing commodo.</p>
          <div className="rounded-xl overflow-hidden">
            <Image src="/mission.svg" alt="Mission" width={400} height={220} className="w-full h-48 object-cover" />
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2  inline-block px-8 py-2">Our Services</h2>
            <p className="max-w-2xl mx-auto text-gray-500 mt-4">
              We're redefining construction material procurement with an extensive selection spanning structural materials, interior finishes, and exterior solutions—built to meet every project requirement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Indoor products */}
            <div className="bg-white rounded-2xl  p-4 flex flex-col items-start">
              <div className="rounded-xl overflow-hidden w-full mb-4">
                <Image src="/cat1.svg" alt="Indoor products" width={400} height={220} className="w-full h-40 object-cover" />
              </div>
              <h3 className="font-bold text-lg mb-2">Indoor products</h3>
              <p className="text-gray-600 mb-4">Enhance your interiors with premium flooring, wall finishes, ceilings, doors, and fittings—designed for comfort, durability, and style.</p>
              <button className="mt-auto border border-[#F7B50E] text-[#F7B50E] px-6 py-2 rounded-full font-semibold hover:bg-[#F7B50E] hover:text-white transition flex items-center gap-2">
                Explore construction materials
                <span>&rarr;</span>
              </button>
            </div>
            {/* Construction materials */}
            <div className="bg-white rounded-2xl  p-4 flex flex-col items-start">
              <div className="rounded-xl overflow-hidden w-full mb-4">
                <Image src="/cat2.svg" alt="Construction materials" width={400} height={220} className="w-full h-40 object-cover" />
              </div>
              <h3 className="font-bold text-lg mb-2">Construction materials</h3>
              <p className="text-gray-600 mb-4">High-quality structural essentials like cement, steel, blocks, aggregates, and more—engineered to support every stage of your build.</p>
              <button className="mt-auto border border-[#F7B50E] text-[#F7B50E] px-6 py-2 rounded-full font-semibold hover:bg-[#F7B50E] hover:text-white transition flex items-center gap-2">
                Explore indoor products
                <span>&rarr;</span>
              </button>
            </div>
            {/* Outdoor products */}
            <div className="bg-white rounded-2xl  p-4 flex flex-col items-start">
              <div className="rounded-xl overflow-hidden w-full mb-4">
                <Image src="/cat3.svg" alt="Outdoor products" width={400} height={220} className="w-full h-40 object-cover" />
              </div>
              <h3 className="font-bold text-lg mb-2">Outdoor products</h3>
              <p className="text-gray-600 mb-4">Weather-resistant roofing, cladding, pavements, landscaping elements, and more—crafted for performance and curb appeal.</p>
              <button className="mt-auto border border-[#F7B50E] text-[#F7B50E] px-6 py-2 rounded-full font-semibold hover:bg-[#F7B50E] hover:text-white transition flex items-center gap-2">
                Explore outdoor products
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="text-center py-16 px-4 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 max-w-3xl mx-auto">
          We believe in the transformative power of collaboration to create a more inclusive, decentralized, and efficient learning ecosystem.
        </h2>
        <p className="max-w-2xl mx-auto text-gray-500 mb-8">
          Lorem ipsum dolor sit amet consectetur. Condimentum mauris eget justo massa orci nec ultrices amet dui. Vel feugiat ultricies nulla integer. Pellentesque pulvinar tristique sit quam ornare id diam ornare est. Facilisis ultricies arcu eu placerat elit faucibus nisi. Quam proin eget massa suspendisse ultricies et a ultricies risus.
        </p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl rounded-xl overflow-hidden">
            <Image src="/about1.svg" alt="Collaboration" width={700} height={400} className="w-full h-64 md:h-80 object-cover" />
            <button className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white bg-opacity-80 rounded-full p-4 shadow-lg">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#F7B50E"/>
                  <polygon points="20,16 34,24 20,32" fill="white" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-[#F7B50E] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">We only deliver results.</h2>
              <p className="text-white/80">We don't use excuses or something. Okay maybe sometimes.</p>
            </div>
            <button className="self-start md:self-center px-8 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-white hover:text-gray-900 transition text-lg" onClick={() => setShowModal(true)}>Contact us</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">420%</div>
              <div className="font-semibold mb-1 text-white/90">More Speed</div>
              <div className="text-white/80 text-sm">Ut porttitor leo a diam sollicitudin. Integer enim neque volutpat ac.</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">21.2K</div>
              <div className="font-semibold mb-1 text-white/90">Total Ratings</div>
              <div className="text-white/80 text-sm">Maecenas pharetra convallis posuere morbi. Scelerisque felis.</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">110X</div>
              <div className="font-semibold mb-1 text-white/90">Efficiency Level</div>
              <div className="text-white/80 text-sm">Lacinia at quis risus sed vulputate. Lectus mauris ultrices eros.</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">16M</div>
              <div className="font-semibold mb-1 text-white/90">Total Users</div>
              <div className="text-white/80 text-sm">Fames ac turpis egestas sed tempus. Tellus mauris a diam maecenas.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
