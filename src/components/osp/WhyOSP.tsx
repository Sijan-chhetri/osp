import React from "react";
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface WhyChooseItem {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const getSuffix = (num: number): string => {
  if (num === 1) return "st";
  if (num === 2) return "nd";
  if (num === 3) return "rd";
  return "ᵗʰ";
};

const WhyOSP: React.FC = () => {
  const whyChoose: WhyChooseItem[] = [
    {
      number: 1,
      title: "100% Genuine Software",
      description:
        "Authentic licenses directly from Microsoft and trusted partners with full functionality and security updates.",
      icon: <ChatBubbleLeftRightIcon className="w-16 h-16 text-[#6E4294]" />,
    },
    {
      number: 2,
      title: "Easy WhatsApp Ordering",
      description:
        "Click 'Buy Now' on any product to message us on WhatsApp. Our team assists you 24/7.",
      icon: <ShieldCheckIcon className="w-16 h-16 text-[#6E4294]" />,
    },
    {
      number: 3,
      title: "Dedicated Support",
      description:
        "Our support team is always available for questions or issues with your purchase or activation.",
      icon: <UserGroupIcon className="w-16 h-16 text-[#6E4294]" />,
    },
  ];

  return (
    <section
      id="why-choose"
      className="relative w-full bg-white flex flex-col items-center py-20 px-4"
    >
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Why <span className="text-[#6E4294]">Choose OSP?</span>
        </h1>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative w-full max-w-5xl">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-20 bottom-20 -translate-x-1/2 w-[3px] bg-[#6E4294]" />

        <div className="space-y-12 sm:space-y-24">
          {whyChoose.map((item, index) => {
            const isIconLeft = index % 2 === 0;

            return (
              <div key={item.number} className="relative flex items-center">
                {/* LEFT SIDE */}
                <div className="w-1/2 flex justify-end pr-8 md:pr-12">
                  {isIconLeft ? (
                    <div className="text-right max-w-xs">
                      <div className="mb-3 flex justify-end">{item.icon}</div>
                    </div>
                  ) : (
                    <div className="text-left max-w-xs">
                      <h4 className="text-[#6E4294] font-bold text-xl mb-2">
                        {item.title}
                      </h4>
                      <p className="text-[#7E6995] text-sm">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* CENTER NUMBER BOX */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-20 h-24 md:w-24 md:h-28 bg-[#6E4294] rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="relative flex items-center justify-center">
                      <span className="text-white font-extrabold text-4xl md:text-5xl relative">
                        {item.number}
                        <span className="absolute -top-2 -right-4 text-sm font-bold">
                          {getSuffix(item.number)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="w-1/2 flex justify-start pl-8 md:pl-12">
                  {isIconLeft ? (
                    <div className="text-left max-w-xs">
                      <h4 className="text-[#6E4294] font-bold text-xl mb-2">
                        {item.title}
                      </h4>
                      <p className="text-[#7E6995] text-sm">
                        {item.description}
                      </p>
                    </div>
                  ) : (
                    <div className="text-left max-w-xs">
                      <div className="mb-3">{item.icon}</div>
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
