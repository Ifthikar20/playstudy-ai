// app/policy/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header with Navigation */}
      <header className="header sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-purple-500">
            Privacy Policy
          </h1>
          <div className="w-20 opacity-0">
            <ArrowLeft className="h-5 w-5" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg border border-purple-500/20 mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Commitment to Privacy</h2>
          <p className="text-gray-300 mb-4">
            At PlayStudy.AI, we prioritize the privacy of our users. Our Privacy and Information Use Policy 
            provides clarity on how we handle personal information. Our goal is to collect only what is 
            necessary to deliver our services effectively while safeguarding your personal details.
          </p>
        </div>

        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg border border-purple-500/20 mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Minimal Information Collection</h2>
          <p className="text-gray-300 mb-4">
            We limit our data collection to the bare minimum. Your private information remains confidential 
            within the PlayStudy.AI ecosystem, shielded from external entities. We avoid third-party cookies 
            altogether and ensure that any first-party cookies used are strictly non-intrusive, without 
            storing personal information.
          </p>
        </div>

        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg border border-purple-500/20 mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">User Information Management</h2>
          <p className="text-gray-300 mb-4">
            The personal information we require is strictly what you provide at enrollment. We recognize the 
            uniqueness of each user's data and maintain it separately. Users are presented with the chance to 
            review their information before utilizing our services and retain the ability to access this data 
            through the service settings at any time.
          </p>
        </div>

        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg border border-purple-500/20 mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">What Constitutes "Personal Information"?</h2>
          <p className="text-gray-300 mb-4">
            Personal Information pertains to details that can lead to your identification, such as:
          </p>
          <ul className="list-disc ml-6 text-gray-300 space-y-2">
            <li>Name</li>
            <li>Address</li>
            <li>Email Address</li>
            <li>Phone Number</li>
          </ul>
        </div>

        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg border border-purple-500/20 mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">What Information Does PlayStudy.AI Collect?</h2>
          
          <h3 className="text-xl font-semibold text-purple-300 mb-3 mt-6">Our Philosophy</h3>
          <p className="text-gray-300 mb-4">
            PlayStudy.AI respects the delicate balance between providing quality service and maintaining your privacy. 
            We aim to gather only the personal information essential for delivering our exceptional services.
          </p>
          
          <h3 className="text-xl font-semibold text-purple-300 mb-3 mt-6">Types of Information We Collect</h3>
          <p className="text-gray-300 mb-4">
            The nature of personal information PlayStudy.AI collects varies based on your interactions with our platform:
          </p>
          <ul className="list-disc ml-6 text-gray-300 space-y-2">
            <li><span className="font-semibold">Account Information:</span> Includes PlayStudy.AI username, email, and account specifics.</li>
            <li><span className="font-semibold">Contact Information:</span> Your name, email, physical address, and phone number.</li>
            <li><span className="font-semibold">Payment and Transaction Information:</span> Details about billing, payment methods, and transaction history.</li>
            <li><span className="font-semibold">Fraud Prevention Information:</span> Used to detect and thwart fraudulent activities.</li>
            <li><span className="font-semibold">Usage Information:</span> Data on how you engage with our services, performance metrics, and diagnostic information.</li>
            <li><span className="font-semibold">Other Provided Information:</span> Any additional details you convey to us, including customer support interactions.</li>
          </ul>
        </div>

        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg border border-purple-500/20">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Cookies and Other Technologies</h2>
          <p className="text-gray-300 mb-4">
            PlayStudy.AI's digital ecosystem—spanning our website, online services, and interactive applications—eschews 
            third-party "cookies" and similar tracking technologies, like web beacons. However, to enhance functionality 
            and user experience, we may employ the following:
          </p>
          <ul className="list-disc ml-6 text-gray-300 space-y-2">
            <li><span className="font-semibold">Communications Cookies:</span> These facilitate the flow of data across PlayStudy.AI's network, aiding in the detection and correction of errors.</li>
            <li><span className="font-semibold">Essential Cookies:</span> Deployed to deliver specific features or services you've requested, they're crucial for the proper presentation and functioning of our sites.</li>
            <li><span className="font-semibold">Analytical Cookies:</span> Implemented to gain insights into how visitors engage with our services, helping us evaluate and refine their effectiveness.</li>
          </ul>
          <p className="text-gray-300 mt-4">
            Opting Out: Should you wish to opt out of cookie usage, PlayStudy.AI provides the option to disable cookies 
            through your browser's privacy settings by selecting "Block all cookies". Be aware that disabling cookies may 
            impact your ability to use certain aspects of the PlayStudy.AI website.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/80 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 PlayStudy.AI. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/terms" className="text-purple-400 hover:text-purple-300 text-sm">Terms of Service</Link>
            <Link href="/refunds" className="text-purple-400 hover:text-purple-300 text-sm">Refund Policy</Link>
            <Link href="/contact" className="text-purple-400 hover:text-purple-300 text-sm">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}