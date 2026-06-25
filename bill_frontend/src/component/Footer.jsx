import React from "react";
import { FaRegNewspaper, FaMapMarkedAlt, FaUserShield } from "react-icons/fa";
import {
  MdDashboard,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPrivacyTip,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiBillLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-[#FAFAFA] py-10 px-6 font-sans">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h1 className="text-2xl font-bold flex items-center mb-3">
            <RiBillLine className="mr-2 text-white-400" />
            BillboardWatch
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            AI-powered platform for detecting and reporting unauthorized
            billboards to keep our cities compliant and safe.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaRegNewspaper className="text-white-400" />
              <a href="/" className="hover:text-white-400 transition-colors">
                Home
              </a>
            </li>

            <li className="flex items-center gap-2">
              <FaUserShield className="text-white-400" />
              <a
                href="/about"
                className="hover:text-white-400 transition-colors"
              >
                About
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Contact</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MdEmail className="text-white-400" />
              <a
                href="mailto:support@billboardwatch.com"
                className="hover:text-white-400 transition-colors"
              >
                support@billboardwatch.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-white-400" />
              <a
                href="tel:+15551234567"
                className="hover:text-white-400 transition-colors"
              >
                +1 (555) 123-4567
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MdLocationOn className="text-white-400" />
              123 Tech Street, City, ST 12345
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Privacy & Legal</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MdPrivacyTip className="text-white-400" />
              <a
                href="/privacy-policy"
                className="hover:text-white-400 transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoDocumentTextOutline className="text-white-400" />
              <a
                href="/terms-of-service"
                className="hover:text-white-400 transition-colors"
              >
                Terms of Service
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoDocumentTextOutline className="text-white-400" />
              <a
                href="/data-usage-policy"
                className="hover:text-white-400 transition-colors"
              >
                Data Usage Policy
              </a>
            </li>
          </ul>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            We use AI and computer vision to analyze uploaded images. Location
            data is used for mapping violations. All data is handled according
            to our privacy policy.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-xs text-gray-400">
        © 2025 BillboardWatch. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
