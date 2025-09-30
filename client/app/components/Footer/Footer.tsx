"use client";

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="text-gray-700 bg-[#f5f7fa] dark:bg-[#0d0f1a] dark:text-gray-300 pt-12 pb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* About */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About Us</h2>
          <p className="text-sm leading-relaxed">
            We are committed to providing quality learning resources that help
            students and professionals upskill in the most effective way.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
            <li><a href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
            <li><a href="/courses" className="hover:text-blue-600 dark:hover:text-blue-400">Courses</a></li>
            <li><a href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400">FAQ</a></li>
            <li><a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <FaFacebookF size={16} />
              <a href="https://facebook.com/studybuddy" target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400">
                /studybuddy
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaTwitter size={16} />
              <a href="https://twitter.com/studybuddy" target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400">
                @studybuddy
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaInstagram size={16} />
              <a href="https://instagram.com/studybuddy" target="_blank" className="hover:text-pink-600 dark:hover:text-pink-400">
                @studybuddy
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaLinkedinIn size={16} />
              <a href="https://linkedin.com/company/studybuddy" target="_blank" className="hover:text-blue-700 dark:hover:text-blue-500">
                /studybuddy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <HiOutlineLocationMarker size={18} />
              <span>123 Learning St, New Delhi, India</span>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlineMail size={18} />
              <a href="mailto:support@yourwebsite.com" className="hover:text-blue-600 dark:hover:text-blue-400">
                support@yourwebsite.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <HiOutlinePhone size={18} />
              <a href="tel:+919876543210" className="hover:text-blue-600 dark:hover:text-blue-400">
                +91 98765 43210
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} StudyBuddy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
