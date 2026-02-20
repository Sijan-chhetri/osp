// CartridgeContact.tsx
import React, { useState } from "react";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";

import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const CartridgeContact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const subject = encodeURIComponent(form.subject || "Cartridge Inquiry");
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
        );

        window.location.href = `mailto:elevatetch@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#092D5A] via-[#0b3a73] to-[#D32721]">
            {/* Navbar */}
            <EgNavbar />

            {/* Main Content */}
            <main className="flex-1 pt-28">
                <div className="px-6 md:px-10 py-14">
                    {/* Header */}
                    <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        Get In Touch
                    </h1>
                    <p className="mt-4 text-white/80 max-w-2xl mx-auto">
                        Need help choosing the right cartridge? Send us your printer
                        model and we’ll guide you with the best match.
                    </p>
                    </div>

                    {/* Main Card */}
                    <div className="relative max-w-6xl mx-auto mt-12">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Left Panel */}
                        <div className="lg:col-span-4 bg-[#092D5A] text-white p-6 md:p-8 relative overflow-hidden">
                            <h2 className="text-xl font-bold">Contact Information</h2>
                            <p className="mt-2 text-white/80 text-sm leading-relaxed">
                            Reach us for cartridge availability, pricing, bulk orders,
                            and delivery support.
                            </p>

                            <div className="mt-8 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-[#D32721]/20 flex items-center justify-center">
                                <PhoneIcon className="h-5 w-5" />
                                </div>
                                <div>
                                <p className="text-sm font-semibold">Phone</p>
                                <p className="text-sm text-white/85">
                                    +977 061565002
                                </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-[#D32721]/20 flex items-center justify-center">
                                <EnvelopeIcon className="h-5 w-5" />
                                </div>
                                <div>
                                <p className="text-sm font-semibold">Email</p>
                                <p className="text-sm text-white/85">
                                    egcartridge@gmail.com
                                </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-[#D32721]/20 flex items-center justify-center">
                                <MapPinIcon className="h-5 w-5" />
                                </div>
                                <div>
                                <p className="text-sm font-semibold">Location</p>
                                <p className="text-sm text-white/85">
                                    Pokhara 27, Sisuwa, Kaski Nepal
                                </p>
                                </div>
                            </div>
                            </div>

                            {/* Decorative circle like the reference UI */}
                            <div className="absolute -bottom-14 -right-14 h-40 w-40 rounded-full bg-white/20" />
                            <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-white/10" />
                        </div>

                        {/* Right Form */}
                        <div className="lg:col-span-8 p-6 md:p-8">
                            <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                <label className="text-xs font-semibold text-slate-500">
                                    Your Name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={onChange}
                                    placeholder="John Doe"
                                    className="mt-2 w-full border-b border-gray-200 focus:border-[#092D5A] outline-none py-2 text-slate-800 placeholder:text-slate-400"
                                    required
                                />
                                </div>

                                <div>
                                <label className="text-xs font-semibold text-slate-500">
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    placeholder="hello@example.com"
                                    className="mt-2 w-full border-b border-gray-200 focus:border-[#092D5A] outline-none py-2 text-slate-800 placeholder:text-slate-400"
                                    required
                                />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500">
                                Your Subject
                                </label>
                                <input
                                name="subject"
                                value={form.subject}
                                onChange={onChange}
                                placeholder="I want to buy a cartridge"
                                className="mt-2 w-full border-b border-gray-200 focus:border-[#092D5A] outline-none py-2 text-slate-800 placeholder:text-slate-400"
                                required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500">
                                Message
                                </label>
                                <textarea
                                name="message"
                                value={form.message}
                                onChange={onChange}
                                placeholder="Write your message..."
                                rows={5}
                                className="mt-2 w-full border-b border-gray-200 focus:border-[#092D5A] outline-none py-2 text-slate-800 placeholder:text-slate-400 resize-none"
                                required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                type="submit"
                                className="inline-flex items-center justify-center h-11 px-8 rounded-xl bg-[#1e3a8a] text-white font-semibold shadow-md hover:shadow-lg hover:bg-[#1e3a8a]/90 transition"
                                >
                                Send Message
                                </button>
                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main>

            <EgFooter />
        </div>
    );

};

export default CartridgeContact;
