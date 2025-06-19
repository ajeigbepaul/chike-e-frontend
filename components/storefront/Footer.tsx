import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 pt-8 pb-4 px-4 sm:px-8">
    <div className="max-w-6xl mx-auto">
      {/* Logo and heading */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2">
          <Image src="/logo.svg" alt="DecorBM Logo" width={36} height={36} />
          <span className="text-2xl font-bold">
            <span className="text-brand-yellow">Decor</span><span className="text-gray-900">BM</span>
          </span>
        </div>
        <hr className="border-gray-300 my-2" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-2 leading-tight">
          GET THE LATEST<br />NEWS AND UPDATES
        </h2>
      </div>
      {/* Links grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">About us</h3>
          <ul className="space-y-1 text-gray-700">
            <li><a href="#" className="hover:underline">Our company</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press kits</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Legal</h3>
          <ul className="space-y-1 text-gray-700">
            <li><a href="#" className="hover:underline">Terms of use</a></li>
            <li><a href="#" className="hover:underline">Privacy policy</a></li>
            <li><a href="#" className="hover:underline">About us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
          <ul className="space-y-1 text-gray-700">
            <li><a href="#" className="hover:underline">Contact us</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
      </div>
      {/* Language selector and copyright */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
        <div className="flex items-center gap-2 text-gray-700">
          <span>English (United Kingdom)</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="text-gray-500 text-sm md:text-right w-full md:w-auto flex justify-end">
          <span>&copy; Singularity-net, LLC</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
