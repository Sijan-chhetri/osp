import React from "react";

interface PaymentMethod {
  name: string;
  icon: string;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  { name: "eSewa", icon: "e", color: "bg-green-500" },
  { name: "Khalti", icon: "K", color: "bg-purple-600" },
  { name: "Connect IPS", icon: "⊕", color: "bg-red-500" },
];

const PaymentMethodCard: React.FC<PaymentMethod> = ({ name, icon, color }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${color} rounded-full w-24 h-24 flex items-center justify-center shadow-lg`}>
        <span className="text-white font-bold text-3xl">{icon}</span>
      </div>
      <p className="text-white font-semibold text-lg">{name}</p>
    </div>
  );
};

const Payway: React.FC = () => {
  return (
    <section className="relative w-[95%] bg-[#482072] flex flex-col items-center py-20 px-4 rounded-3xl mx-4 my-20">
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Pay the Way You Prefer
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Choose from multiple trusted payment methods for a fast, safe, and hassle-free checkout experience.
        </p>
      </div>

      {/* Payment Methods Grid */}
      <div className="w-[70%] px-4 md:px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.name} {...method} />
          ))}
        </div>
      </div>

      {/* Help Message */}
      <div className="w-[85%] bg-white rounded-2xl px-8 py-4 flex items-center gap-4 shadow-lg">
        <span className="text-2xl">🎧</span>
        <p className="text-gray-700 font-medium">
          Need help choosing a payment method? Our team is available on WhatsApp to assist you!
        </p>
      </div>
    </section>
  );
};

export default Payway;
