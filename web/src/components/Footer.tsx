// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#EFFF] text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 justify-items-center text-center">
          {/* Mission & Vision */}
          <div className="max-w-xs">
            <h3 className="text-black text-xl font-bold mb-4">Mission & Vision</h3>
            <p className="text-black text-sm">
              To empower individuals and teams by simplifying automation, enabling anyone to connect APIs, build smart workflows, and eliminate repetitive tasks with just a few clicks. And to become the go-to automation platform for busy professionals, helping the world achieve more with less effort by making advanced automation effortless, accessible, and intuitive.            </p>
          </div>

          {/* Team */}
          <div className="max-w-xs">
            <h3 className="text-black text-xl font-bold mb-4">Team</h3>
            <ul className="space-y-2 text-black text-sm">
              <li>Julien Michel - CEO</li>
              <li>William Sitt - CTO</li>
              <li>Etienne Kretz - Project Manager</li>
              <li>Jonathan Lotz - Marketing Lead</li>
              <li>Naouel Bouhali - Marketing Lead</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="max-w-xs">
            <h3 className="text-black text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-black text-sm">
              <li>Email: <a href="mailto:contact@triggerhub.com" className="hover:text-white">contact@triggerhub.com</a></li>
              <li>Phone: <a href="tel:+1234567890" className="hover:text-white">+1 234 567 890</a></li>
              <li>Twitter: <a href="#" className="hover:text-white">@TriggerHub</a></li>
              <li>LinkedIn: <a href="#" className="hover:text-white">TriggerHub</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-black">
          <span> © {new Date().getFullYear()} TriggerHub. All rights reserved. </span>
          <Link href="/policy/legal" className="ml-4 hover:text-white transition">Legal</Link>
        </div>
      </div>
    </footer>
  );
}
