import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="absolute inset-0 pattern-dots opacity-30" />

            {/* Content */}
            <div className="relative z-10">
                {/* Main Footer */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-1">
                            <h3 className="text-2xl font-bold text-white mb-6">LEQAXA</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs break-words">
                                Premium laundry concierge service for Northwest Ohio.
                                From your doorstep to done—expertly cleaned, carefully folded.
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, href: "#", label: "Facebook" },
                                    { icon: Instagram, href: "#", label: "Instagram" },
                                    { icon: Twitter, href: "#", label: "Twitter" },
                                ].map((social) => (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Services Column */}
                        <div>
                            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                                <div className="w-1 h-4 rounded-full gradient-primary" />
                                Services
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { label: "Wash & Fold", href: "/services" },
                                    { label: "Dry Cleaning", href: "/services" },
                                    { label: "Commercial Linens", href: "/services" },
                                    { label: "Student Specials", href: "/services" },
                                    { label: "Stain Concierge", href: "/stain-concierge" },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 text-sm hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-px bg-primary group-hover:w-3 transition-all duration-300" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                                <div className="w-1 h-4 rounded-full gradient-primary" />
                                Company
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { label: "About Us", href: "#" },
                                    { label: "Service Area", href: "#service-area" },
                                    { label: "Careers", href: "#" },
                                    { label: "Contact", href: "#" },
                                    { label: "Care Menu", href: "/preferences" },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 text-sm hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-px bg-primary group-hover:w-3 transition-all duration-300" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                                <div className="w-1 h-4 rounded-full gradient-primary" />
                                Get In Touch
                            </h4>
                            <ul className="space-y-4">
                                <li>
                                    <a
                                        href="mailto:hello@leqaxa.com"
                                        className="text-gray-400 text-sm hover:text-white transition-colors duration-300 flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        hello@leqaxa.com
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="tel:4195550123"
                                        className="text-gray-400 text-sm hover:text-white transition-colors duration-300 flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        (419) 555-0123
                                    </a>
                                </li>
                                <li className="flex items-start gap-3 text-gray-400 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <span>Toledo, Bowling Green & Northwest Ohio</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                            <p>
                                © {new Date().getFullYear()} LEQAXA Laundry Northwest Ohio. All rights reserved.
                            </p>
                            <div className="flex gap-6">
                                <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                                <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
