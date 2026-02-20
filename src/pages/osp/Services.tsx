import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBagIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";

const Services: FC = () => {
  const navigate = useNavigate();

  // WhatsApp configuration
  const WHATSAPP_NUMBER = "9846777701"; // Replace with actual number (format: country code + number, no + or spaces)
  const WHATSAPP_MESSAGE = "Hello! I need support with my order.";

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank");
  };

  const openWhatsAppVideoCall = () => {
    // WhatsApp call protocol - opens WhatsApp to initiate a call
    // On mobile: Opens WhatsApp app with call option
    // On desktop: Opens WhatsApp Web/Desktop with the contact
    const phoneNumber = "9779846777701"; // Full number with country code
    
    // Try WhatsApp call protocol (works on mobile)
    window.location.href = `whatsapp://send?phone=${phoneNumber}`;
    
    // Fallback to WhatsApp web after a short delay if app doesn't open
    setTimeout(() => {
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    }, 1000);
  };

  const services = [
    {
      id: 1,
      title: "Next Order",
      description: "Place your next order quickly and easily. Browse our products and get what you need.",
      icon: ShoppingBagIcon,
      color: "from-purple-600 to-purple-800",
      hoverColor: "hover:from-purple-700 hover:to-purple-900",
      action: () => navigate("/"),
    },
    {
      id: 2,
      title: "Ink Fill",
      description: "Request ink refill service for your cartridges. Professional and reliable service.",
      icon: BeakerIcon,
      color: "from-blue-600 to-blue-800",
      hoverColor: "hover:from-blue-700 hover:to-blue-900",
      action: () => navigate("/ink-fill"),
    },
    {
      id: 3,
      title: "Live Support",
      description: "Chat with our support team in real-time. Get instant help and answers to your questions.",
      icon: ChatBubbleLeftRightIcon,
      color: "from-green-600 to-green-800",
      hoverColor: "hover:from-green-700 hover:to-green-900",
      action: openWhatsApp,
    },
    {
      id: 4,
      title: "Video Call",
      description: "Connect via WhatsApp call. Start with voice and switch to video anytime during the call.",
      icon: VideoCameraIcon,
      color: "from-red-600 to-red-800",
      hoverColor: "hover:from-red-700 hover:to-red-900",
      action: openWhatsAppVideoCall,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-white">
      <EgNavbar />
      
      {/* Hero Section */}
      <div className="pt-40 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Choose from our range of services designed to make your experience seamless and efficient
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={service.action}
                className={`
                  bg-gradient-to-br ${service.color} ${service.hoverColor}
                  rounded-2xl p-8 cursor-pointer
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-2xl
                  group
                `}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-white/30 transition-all duration-300">
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Button */}
                  <button className="px-8 py-3 bg-white text-purple-900 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-300 transform group-hover:scale-110">
                    Get Started
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Our team is here to assist you. Contact us anytime for guidance on which service best fits your needs.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>

      <EgFooter />
    </div>
  );
};

export default Services;
