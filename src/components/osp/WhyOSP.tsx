import React from "react";

interface WhyChooseItem {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const getSuffix = (num: number): string => {
  if (num === 1) return "ˢᵗ";
  if (num === 2) return "ⁿᵈ";
  if (num === 3) return "ʳᵈ";
  return "ᵗʰ";
};


const WhyOSP: React.FC = () => {
  const whyChoose: WhyChooseItem[] = [
    {
      number: 1,
      title: "100% Genuine Software",
      description:
        "Authentic licenses directly from Microsoft and trusted partners with full functionality and security updates.",
      icon: "💬",
    },
    {
      number: 2,
      title: "Easy WhatsApp Ordering",
      description:
        "Click 'Buy Now' on any product to message us on WhatsApp. Our team assists you 24/7.",
      icon: "✓",
    },
    {
      number: 3,
      title: "Dedicated Support",
      description:
        "Our support team is always available for questions or issues with your purchase or activation.",
      icon: "👥",
    },
  ];

  return (
    <section id="why-choose" className="relative w-full bg-white flex flex-col items-center py-20 px-4">
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Why <span className="text-[#7B5DE8]">Choose OSP?</span>
        </h1>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative w-full max-w-5xl">
        {/* FULL Connected Vertical Line */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-[#7B5DE8]" />

        <div className="space-y-28">
          {whyChoose.map((item, index) => {
            const isIconLeft = index % 2 === 0;

            return (
              <div key={item.number} className="relative flex items-center">
                {/* LEFT SIDE */}
                <div className="w-1/2 flex justify-end pr-12">
                  {isIconLeft ? (
                    <div className="text-right max-w-xs">
                      <div className="text-6xl mb-3">{item.icon}</div>
                    </div>
                  ) : (
                    <div className="text-left max-w-xs">
                      <h4 className="text-[#7B5DE8] font-bold text-xl mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  )}
                </div>

                {/* CENTER NUMBER BOX */}
                <div className="relative z-10 flex items-center justify-center">
                 <div className="w-24 h-24 bg-[#7B5DE8] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-extrabold text-4xl">
                        {item.number}
                        <sup className="text-sm font-bold ml-1">
                        {getSuffix(item.number)}
                        </sup>
                    </span>
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="w-1/2 flex justify-start pl-12">
                  {isIconLeft ? (
                    <div className="text-left max-w-xs">
                      <h4 className="text-[#7B5DE8] font-bold text-xl mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ) : (
                    <div className="text-right max-w-xs">
                      <div className="text-6xl mb-3">{item.icon}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyOSP;
