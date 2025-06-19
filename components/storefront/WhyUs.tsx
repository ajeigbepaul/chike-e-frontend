import { Lightbulb, Headphones, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: "/icon1.svg",
    title: 'Free & fast delivery',
    desc: 'Sagittis eu volutpat odio facilisis mauris sit amet massa. Urna et pharetra pharetra massa. Viverra accumsan in nisl nisi scelerisque.',
  },
  {
    icon: "/icon2.svg",
    title: '24/7 Customer Service',
    desc: 'Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Nec nam aliquam sem et tortor consequat id porta nibh.',
  },
  {
    icon: "/icon3.svg",
    title: 'Money-back guarantee',
    desc: 'Suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Cras fermentum odio eu feugiat pretium nibh ipsum.',
  },
];

const WhyUs = () => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Should You Choose Us?</h2>
      <p className="text-gray-500 text-lg max-w-2xl mx-auto">
        Volutpat commodo sed egestas egestas fringilla phasellus. Tincidunt eget nullam non nisi. Nisi porta lorem mollis aliquam ut porttitor leo.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {features.map((feature, i) => (
        <div key={i} className="flex flex-col items-center text-center px-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-brand-yellow mb-6">
            {/* <feature.icon className="w-8 h-8 text-brand-yellow" /> */}
            <Image src={feature.icon} className="w-8 h-8 text-brand-yellow" width={8} height={8} alt='icons'/>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-500 text-base">{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyUs; 