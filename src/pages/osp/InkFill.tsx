import type { FC } from "react";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";

const InkFill: FC = () => {
  // YouTube video IDs - Replace these with actual ink refill tutorial video IDs
  const videos = [
    { id: "dQw4w9WgXcQ", title: "How to Refill HP Ink Cartridges" },
    { id: "dQw4w9WgXcQ", title: "Canon Ink Refill Tutorial" },
    { id: "dQw4w9WgXcQ", title: "Epson Ink Cartridge Refilling Guide" },
    { id: "dQw4w9WgXcQ", title: "Brother Printer Ink Refill" },
    { id: "dQw4w9WgXcQ", title: "Samsung Toner Refill Instructions" },
    { id: "dQw4w9WgXcQ", title: "Dell Ink Cartridge Refill Tutorial" },
    { id: "dQw4w9WgXcQ", title: "Lexmark Ink Refill Step by Step" },
    { id: "dQw4w9WgXcQ", title: "Xerox Toner Cartridge Refilling" },
    { id: "dQw4w9WgXcQ", title: "Kodak Ink Refill Complete Guide" },
    { id: "dQw4w9WgXcQ", title: "Generic Ink Cartridge Refill Tips" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <EgNavbar />

      {/* Hero Section */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Ink Refill Tutorials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to refill your ink cartridges with our comprehensive video guides
          </p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Video Container */}
              <div className="relative pb-[56.25%] bg-gray-900">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Step-by-step guide to refill your cartridge safely and effectively
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Need Professional Help?
          </h2>
          <p className="text-lg mb-8">
            Our experts are ready to assist you with ink refilling services
          </p>
          <button
            onClick={() => window.open("https://wa.me/9846777701?text=Hello! I need help with ink refilling.", "_blank")}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
          >
            Contact Support
          </button>
        </div>
      </div>

      <EgFooter />
    </div>
  );
};

export default InkFill;
