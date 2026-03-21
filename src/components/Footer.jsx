import { Bus, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react'

const quickLinks = [
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Safety Standards', href: '#' },
  { label: 'Contact Us', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F98C1F] rounded-lg flex items-center justify-center">
                <Bus size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold">
                SmartKids <span className="text-[#F98C1F]">Shuttle</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Safe, reliable, and trackable school transportation for every family. Giving parents peace of mind, one ride at a time.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-[#F98C1F] rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-[#F98C1F] rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-[#F98C1F] rounded-lg flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links column */}
          <div>
            <h4 className="font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#F98C1F] text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-semibold text-white mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={14} />
                </div>
                <span>hello@sksshuttle.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={14} />
                </div>
                <span>+66 2 XXX XXXX</span>
              </div>
            </div>

            {/* App download prompt */}
            <div className="mt-8 p-4 bg-gray-700/50 rounded-xl">
              <p className="text-sm text-gray-300 font-medium mb-2">Download the App</p>
              <p className="text-xs text-gray-500">Available on iOS & Android</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 SmartKids Shuttle. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with React + Vite
          </p>
        </div>
      </div>
    </footer>
  )
}
