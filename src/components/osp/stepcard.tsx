import React from "react";

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StepCard: React.FC<StepItem> = ({ number, title, description, icon }) => {
  return (
    <div className="h-full">
      {/* Outer white frame */}
      <div className="h-full rounded-[28px] sm:rounded-[34px] bg-white/80 p-[5px] sm:p-[6px] shadow-[0_18px_45px_rgba(0,0,0,0.15)]">
        {/* Inner card */}
        <div className="relative h-full rounded-[22px] sm:rounded-[28px] bg-[#482072]/55 backdrop-blur-md border border-white/55 px-6 sm:px-8 py-8 sm:py-10 overflow-hidden flex flex-col">
          {/* Big faint number */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[90px] sm:text-[110px] md:text-[130px] font-extrabold text-white/20 leading-none select-none">
              {number}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center flex-1">
            {/* Icon */}
            <div className="mb-5 sm:mb-6 rounded-2xl bg-[#482072]/25 p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
              <div className="w-6 h-6 sm:w-7 sm:h-7 text-[#482072]">{icon}</div>
            </div>

            {/* Title (fixed height so all cards match) */}
            <h3 className="text-[#5a2d86] font-extrabold text-xl sm:text-2xl mb-3 min-h-[56px] sm:min-h-[64px] flex items-center justify-center">
              {title}
            </h3>

            {/* Description grows evenly */}
            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-md flex-1">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
