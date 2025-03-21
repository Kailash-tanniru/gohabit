// components/Footer.tsx

import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" bg-[#EEF7FF] p-2 border-t border-[#EEF7FF] ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:justify-between">
          {/* Logo and Tagline */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold ">
              GoHabit
            </h2>
            <p className="text-xs  mt-1">
              Building better habits, one day at a time.
            </p>
          </div>

          {/* Footer Links */}
          {/* <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              href="/about"
              className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
            >
              Contact
            </Link>
          </div> */}

          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a
              href="https://github.com/Kailash-tanniru"
              target="_blank"
              rel="noopener noreferrer"
              className="   transition duration-300"
            >
              <FaGithub className="w-4 h-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/venkata-kailash-083684328/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition duration-300"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:your-email@example.com"
              className=" transition duration-300"
            >
              <FaEnvelope className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t  dark:border-gray-400 my-2" />

        {/* Copyright Notice */}
        <div className="mt-2 text-center">
          <p className="text-sm ">
            &copy; {new Date().getFullYear()} GoHabit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}