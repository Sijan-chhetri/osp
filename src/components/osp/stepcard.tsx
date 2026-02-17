import React from "react";

interface StepItem {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const StepCard: React.FC<StepItem> = ({ number, title, description, icon }) => {
  return (
    <div className="relative group h-full">
      
      {/* BIG Background Number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[140px] md:text-[180px] font-extrabold text-white/10 select-none">
          {number}
        </span>
      </div>

      {/* Purple Glass Card */}
      <div className="relative backdrop-blur-xl bg-[#7B5DE8]/20 border-[7px] border-white rounded-3xl p-10 h-full flex flex-col items-center text-center transition-all duration-300 hover:bg-[#7B5DE8]/30 hover:shadow-[0_0_40px_rgba(123,93,232,0.35)]">

        {/* Icon */}
        <div className="text-5xl mb-6">{icon}</div>

        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-3">{title}</h3>

        {/* Description */}
        <p className="text-white/85 text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
    </div>
  );
};


export default StepCard;
