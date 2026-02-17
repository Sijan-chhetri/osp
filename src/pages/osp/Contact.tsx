import React, { useState } from "react";
import Payway from "../../components/osp/Payway";

interface ContactInfo {
  icon: string;
  title: string;
  details: string[];
}

const contactInfo: ContactInfo[] = [
  {
    icon: "📞",
    title: "Call Us",
    details: ["9822777101 / 9822777102"],
  },
  {
    icon: "✉️",
    title: "Email Us",
    details: ["originalsoftwareproduct@gmail.com"],
  },
  {
    icon: "🕐",
    title: "Business Hours",
    details: ["Sunday - Friday: 9:00 AM - 6:00 PM"],
  },
];

const ContactInfoCard: React.FC<ContactInfo> = ({ icon, title, details }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-purple-300 rounded-lg p-4 flex-shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-[#482072] font-bold text-lg mb-1">{title}</h3>
        {details.map((detail, index) => (
          <p key={index} className="text-gray-700 text-sm">
            {detail}
          </p>
        ))}
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ fullName: "", email: "", message: "" });
  };

  return (
    <>

    {/* Payway Section */}
      <section className="relative w-full bg-gray-50 flex flex-col items-center py-20 px-4">
        <Payway />
      </section>

      
      {/* Contact Section */}
      <section id="contact" className="relative w-full bg-white flex flex-col items-center py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#482072] mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you need product guidance, activation support, or bulk purchase assistance, our experts are just a message away.
          </p>
        </div>

        {/* Contact Container */}
        <div className="w-[90%] px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Contact Info - Left Side */}
            <div className="flex flex-col gap-6 justify-center mr-12">
              {contactInfo.map((info, index) => (
                <ContactInfoCard key={index} {...info} />
              ))}
            </div>

            {/* Contact Form - Right Side */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-[#482072] mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-6">Have questions? Reach out to us. We're here to help!</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-[#482072] font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7B5DE8]"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#482072] font-bold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7B5DE8]"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[#482072] font-bold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-[#7B5DE8] rounded-lg focus:outline-none focus:border-[#6A4BC4] resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#7B5DE8] text-white py-3 rounded-full font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default Contact;
