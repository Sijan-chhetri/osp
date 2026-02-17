import React, { useState } from "react";
import Navbar from "../../components/osp/Navbar";
import WhyOSP from "../../components/osp/WhyOSP";
import StepCard from "../../components/osp/stepcard";
import { useBrands } from "../../hooks/icon"; // Import the icons hook

interface SoftwareItem {
  name: string;
  title: string;
  category: string;
  color: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

interface StepItem {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const SoftwareCard: React.FC<SoftwareItem> = ({ name, title, category, color, bgColor, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:border-[#7B5DE8] transition-all duration-300">
      <div className={`${bgColor} p-4 rounded-lg mb-6 w-24 h-24 flex items-center justify-center`}>
        {icon ? (
          <div className={color}>
            {icon}
          </div>
        ) : (
          <span className={`${color} font-extrabold text-4xl`}>{name.charAt(0)}</span>
        )}
      </div>
      <h3 className={`${color} font-extrabold text-2xl mb-2`}>{title}</h3>
      <p className="text-gray-600 text-sm mb-6">{category}</p>
      <a href="#" className="text-[#7B5DE8] text-sm font-semibold hover:underline">
        See Options →
      </a>
    </div>
  );
};

const Software: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const brandsWithIcons = useBrands(); // Get brands with icons from the hook

  // Map the brands to software products with categories
  const softwareProducts: SoftwareItem[] = brandsWithIcons.map((brand) => {
    // Define categories based on brand names
    const categoryMap: { [key: string]: { category: string; title: string } } = {
      "Windows": { category: "Operating System", title: "Windows Pro" },
      "Bundle Keys": { category: "Software Bundle", title: "Bundle Keys" },
      "Enterprise": { category: "Business", title: "Enterprise Suite" },
      "Office 365": { category: "Productivity", title: "Office 365" },
      "VMware": { category: "Virtualization", title: "VMware Suite" },
      "Power BI": { category: "Analytics", title: "Power BI" },
      "Project": { category: "Project Management", title: "Microsoft Project" },
      "Visio": { category: "Diagramming", title: "Microsoft Visio" },
      "Access": { category: "Database", title: "Microsoft Access" },
      "Server": { category: "Server", title: "Windows Server" },
      "Google Drive": { category: "Cloud Storage", title: "Google Drive" },
      "Lumion": { category: "3D Visualization", title: "Lumion" },
      "Autodesk": { category: "Design", title: "Autodesk Suite" },
      "Parallels Desktop": { category: "Virtualization", title: "Parallels Desktop" },
      "Antivirus": { category: "Security", title: "Antivirus Pro" },
      "ChatGPT": { category: "AI Tool", title: "ChatGPT Plus" },
      "YouTube": { category: "Entertainment", title: "YouTube Premium" },
      "Netflix": { category: "Entertainment", title: "Netflix Premium" },
      "Grammarly": { category: "Writing", title: "Grammarly Premium" },
      "Spotify": { category: "Entertainment", title: "Spotify Premium" },
      "Adobe": { category: "Design", title: "Adobe Creative Cloud" },
      "CorelDRAW": { category: "Design", title: "CorelDRAW" },
      "Design Software": { category: "Design", title: "Design Suite" },
      "LinkedIn": { category: "Professional", title: "LinkedIn Premium" },
      "CCleaner": { category: "Utilities", title: "CCleaner Pro" },
      "Macrorit": { category: "Utilities", title: "Macrorit Partition" },
      "AOMEI": { category: "Backup", title: "AOMEI Backupper" },
      "InVideo": { category: "Video Editing", title: "InVideo" },
      "Canva": { category: "Design", title: "Canva Pro" },
      "Nitro": { category: "PDF", title: "Nitro Pro" },
      "QuickBooks": { category: "Accounting", title: "QuickBooks" },
    };

    const productInfo = categoryMap[brand.name] || { category: "Software", title: brand.name };

    return {
      name: brand.name,
      title: productInfo.title,
      category: productInfo.category,
      color: brand.color,
      icon: brand.icon,
      bgColor: brand.bgColor || `${brand.color.replace('text-', 'bg-')}-100`.replace(/\d+/, '100'),
    };
  });

  const displayedProducts = showAll ? softwareProducts : softwareProducts.slice(0, 6);

  const steps: StepItem[] = [
    {
      number: 1,
      title: "Select Your Software",
      description: "Choose from our wide range of genuine software products and click 'Buy Now'",
      icon: "👆",
    },
    {
      number: 2,
      title: "Message Us on WhatsApp",
      description: "You'll be directed to WhatsApp where our team will assist you with your order",
      icon: "💬",
    },
    {
      number: 3,
      title: "Receive Your License",
      description: "Get your software license instantly after payment confirmation",
      icon: "🔑",
    },
  ];

  return (
    <>
      {/* Software Section */}
      <section id="products" className="relative w-full bg-white flex flex-col items-center py-20 px-4">
        {/* Navbar */}
        <Navbar />

        {/* Header */}
        <div className="text-center mb-16 px-6 pt-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-[#7B5DE8]">Software Products</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Browse our extensive collection of genuine software solutions at the best prices in Nepal.
          </p>
        </div>

        {/* Software Grid */}
        <div className="w-[70%] px-4 md:px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {displayedProducts.map((product, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  showAll && index >= 6 ? "animate-fade-in-up" : ""
                }`}
              >
                <SoftwareCard {...product} />
              </div>
            ))}
          </div>
        </div>

        {/* Show All Button */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-[#7B5DE8] text-white px-12 py-3 rounded-full font-semibold hover:bg-[#6A4BC4] transition-all duration-300 transform hover:scale-105"
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      </section>

      {/* Steps Section */}
      <section
        id="how-it-works"
        className="relative w-full flex flex-col items-center py-20 px-4"
        style={{
          background: "linear-gradient(to bottom, #482072 0%, #482072 30%, #ffffff 100%)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Your Software in 3 Simple Steps
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Browse our extensive collection of genuine software solutions at the best prices in Nepal.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="w-[70%] px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose OSP Section */}
      <WhyOSP />
    </>
  );
};

export default Software;