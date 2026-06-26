import { FaRegNewspaper, FaUserShield } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdPrivacyTip } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Logo from "./brand/Logo";

const linkClass =
  "inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors";

const Footer = () => {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-ink-950 text-gray-300">
      {/* top hairline glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size={32} />
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              AI-powered civic platform for detecting and reporting unauthorized or
              hazardous billboards — keeping our cities compliant and safe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Quick Links
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/" className={linkClass}>
                  <FaRegNewspaper className="text-brand-300" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  <FaUserShield className="text-brand-300" /> About
                </Link>
              </li>
              <li>
                <Link to="/heatmap" className={linkClass}>
                  <MdLocationOn className="text-brand-300" /> Live Heatmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Contact
            </h2>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@civix.app" className={linkClass}>
                  <MdEmail className="text-brand-300" /> support@civix.app
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className={linkClass}>
                  <MdPhone className="text-brand-300" /> +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MdLocationOn className="text-brand-300" /> 123 Civic Plaza, Smart City
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Privacy & Legal
            </h2>
            <ul className="space-y-3">
              <li>
                <a href="/privacy-policy" className={linkClass}>
                  <MdPrivacyTip className="text-brand-300" /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className={linkClass}>
                  <IoDocumentTextOutline className="text-brand-300" /> Terms of Service
                </a>
              </li>
              <li>
                <a href="/data-usage-policy" className={linkClass}>
                  <IoDocumentTextOutline className="text-brand-300" /> Data Usage Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Civix. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with AI vision & geospatial intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
