"use client";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            src="/img/Logo.png"
            alt="Job Portal Logo"
            className="w-16 h-auto md:w-24"
          />
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-bold mb-4 text-purple-600">About Us</h3>
            <p className="text-sm text-neutral-300 text-center sm:text-left">
              We connect talented individuals with great opportunities. Find your dream job with us today!
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-bold mb-4 text-purple-600">Quick Links</h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <a href="/about" className="text-sm text-neutral-300 hover:text-purple-600 hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/jobs" className="text-sm text-neutral-300 hover:text-purple-600 hover:underline">
                  Find Jobs
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-neutral-300 hover:text-purple-600 hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-neutral-300 hover:text-purple-600 hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-bold mb-4 text-purple-600">Follow Us</h3>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                className="text-neutral-300 hover:text-purple-600"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                className="text-neutral-300 hover:text-purple-600"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
                className="text-neutral-300 hover:text-purple-600"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-neutral-700"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Job Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
