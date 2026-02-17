import React from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: "Company",
      links: [
        { label: "Home", href: "#" },
        { label: "Products", href: "#" },
        { label: "How It Works", href: "#" },
        { label: "About Us", href: "#" },
        { label: "Contact Us", href: "#" },
      ],
    },
    {
      title: "Payment Methods",
      links: [
        { label: "Esewa", href: "#" },
        { label: "Khalti", href: "#" },
        { label: "Connect IPS", href: "#" },
        { label: "Payoneer", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative w-full bg-[#482072] text-white">
      {/* Main Footer Content */}
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 mb-12">
            {/* Brand Section */}
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#482072] font-bold text-xl">O</span>
                </div>
                <h2 className="text-2xl font-bold">Original Software Product (OSP)</h2>
              </div>
              <p className="text-white/80 text-sm">
                Your trusted source for genuine software products in Nepal.
              </p>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8">
            {/* Copyright */}
            <div className="text-center text-white/80 text-sm">
              <p>© 2028 Original Software Product. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
