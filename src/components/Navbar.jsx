import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Bus } from 'lucide-react'

const navLinks = [
  { label: 'How it Works', href: '#how-it-works' },
  
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F98C1F] rounded-lg flex items-center justify-center">
            <Bus size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-[#222222]">
            SmartKids <span className="text-[#F98C1F]">Shuttle</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[#666666] hover:text-[#F98C1F] font-medium transition-colors text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-[#222222] font-medium text-sm hover:text-[#F98C1F] transition-colors"
          >
            Login
          </Link>
          {/* <a
            href="#"
            className="bg-[#F98C1F] hover:bg-[#F57C00] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-sm"
          >
            Book Now
          </a> */}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#222222]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-[#666666] hover:text-[#F98C1F] font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            <Link to="/login" className="text-[#222222] font-medium text-sm">
              Login
            </Link>
           
          </div>
        </div>
      )}
    </nav>
  )
}
