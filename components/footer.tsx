import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Anonymous Messages</h3>
                        <p className="text-sm text-gray-400">
                            Send and receive anonymous messages safely and securely. Connect with others without revealing your identity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-white transition-colors text-sm">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/sign-up" className="hover:text-white transition-colors text-sm">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="/sign-in" className="hover:text-white transition-colors text-sm">
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Anonymous Messages. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
