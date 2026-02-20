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
    <footer className="relative w-full bg-[#6E4294] text-white">
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Top content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 mb-4 text-center sm:text-left">
                <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="/assets/images/OSP_Logo.png"
                    alt="OSP Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  Original Software Product{" "}
                  <span className="opacity-90">(OSP)</span>
                </h2>
              </div>

              <p className="text-white/80 text-sm sm:text-base text-center sm:text-left max-w-md mx-auto sm:mx-0">
                Your trusted source for genuine software products in Nepal.
              </p>
            </div>

            {/* Links */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
              {footerSections.map((section, index) => (
                <div key={index} className="text-center sm:text-left">
                  <h3 className="text-lg font-bold mb-4">{section.title}</h3>

                  {/* Mobile friendly list */}
                  <ul className="space-y-2 sm:space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="inline-block text-white/80 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/80 text-sm text-center sm:text-left">
                © 2026 Original Software Product. All rights reserved.
              </p>

              {/* Optional: small footer notes / social links placeholder */}
              <p className="text-white/70 text-xs sm:text-sm text-center sm:text-right">
                Secure payments • Genuine licenses
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
