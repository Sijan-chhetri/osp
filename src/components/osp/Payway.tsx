import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset } from "@fortawesome/free-solid-svg-icons";

interface PaymentMethod {
  name: string;
  image: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    name: "eSewa",
    image: "/assets/images/esewaa.png", 
  },
  {
    name: "Khalti",
    image: "/assets/images/khalti.png",
  },
  {
    name: "Connect IPS",
    image: "/assets/images/connect_ips.png",
  },
];

const PaymentMethodCard: React.FC<PaymentMethod> = ({ name, image }) => {
  return (
    <div className="flex flex-col items-center gap-4 group">
      {/* White Circle */}
      <div className="bg-white rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
        <img src={image} alt={name} className="w-12 h-12 md:w-14 md:h-14 object-contain" />
      </div>

      <p className="text-white font-semibold text-sm sm:text-lg">{name}</p>
    </div>
  );
};

const Payway: React.FC = () => {
  return (
    <section className="relative w-[95%] sm:w-[85%] bg-[#6E4294] flex flex-col items-center py-12 px-2 rounded-3xl">
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Pay the Way You Prefer
        </h1>
        <p className="text-white/80 max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg">
          Choose from multiple trusted payment methods for a fast, safe, and
          hassle-free checkout experience.
        </p>
      </div>

      {/* Payment Methods Grid */}
      <div className="w-[90%] md:w-[70%] px-4 md:px-6 mb-12">
        <div className="grid grid-cols-3 gap-12 justify-items-center">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.name} {...method} />
          ))}
        </div>
      </div>

      {/* Help Message */}
      <div className="w-[85%] md:w-[95%] bg-[#E9E9E9] rounded-2xl px-3 sm:px-6 py-2 sm:py-4 items-center gap-1 sm:gap-4 shadow-lg flex justify-center text-center md:text-left">
        <FontAwesomeIcon icon={faHeadset} className="text-[#6E4294] text-lg sm:text-2xl" />

        <p className="text-[#727272] font-medium text-sm">
          Need help choosing a payment method? Our team is available on WhatsApp
          to assist you!
        </p>
      </div>
    </section>
  );
};

export default Payway;
