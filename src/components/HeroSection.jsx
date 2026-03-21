import { MapPin, Star, Users, Clock } from 'lucide-react'
import bus2 from '../assets/image/bus2.png'

export default function HeroSection() {
  return (
    <section className="bg-[#F5EDE3] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

        {/* Left column */}
        <div>
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white text-[#F98C1F] text-sm font-semibold px-4 py-2 rounded-full shadow-sm mb-6">
            <Star size={14} className="fill-[#F98C1F]" />
            Trusted by 5,000+ Parents
          </span>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-extrabold text-[#222222] leading-tight mb-6">
            Safety You Can See{' '}
            <em className="not-italic text-[#F98C1F]">Every Mile</em>
          </h1>

          {/* Subparagraph */}
          <p className="text-lg text-[#666666] mb-8 max-w-lg leading-relaxed">
            Real-time GPS tracking, certified drivers, and door-to-school shuttle service — giving parents peace of mind every single day.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#"
              className="bg-[#F98C1F] hover:bg-[#F57C00] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-colors"
            >
              Book a Ride
            </a>
            <a
              href="#how-it-works"
              className="border-2 border-[#F98C1F] text-[#F98C1F] hover:bg-[#F98C1F] hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Users size={18} className="text-[#F98C1F]" />
              </div>
              <div>
                <p className="font-bold text-[#222222] text-lg leading-tight">500+</p>
                <p className="text-[#666666] text-xs">Schools Served</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <MapPin size={18} className="text-[#F98C1F]" />
              </div>
              <div>
                <p className="font-bold text-[#222222] text-lg leading-tight">50K+</p>
                <p className="text-[#666666] text-xs">Happy Parents</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Clock size={18} className="text-[#F98C1F]" />
              </div>
              <div>
                <p className="font-bold text-[#222222] text-lg leading-tight">99.8%</p>
                <p className="text-[#666666] text-xs">On-Time Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — illustration card */}
        <div className="relative flex justify-center">
          <div className="bg-gradient-to-br from-[#F98C1F] to-[#F57C00] rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
            {/* Card header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-white/40 rounded-full" />
              <div className="w-3 h-3 bg-white/40 rounded-full" />
              <div className="w-3 h-3 bg-white/40 rounded-full" />
              <span className="ml-2 text-white font-semibold text-sm">SmartKids Shuttle</span>
            </div>

            {/* Bus image */}
            <div className="bg-white/10 rounded-2xl overflow-hidden">
              <img
                src={bus2}
                alt="School bus"
                className="w-full object-cover rounded-2xl"
              />
            </div>

            {/* Floating live tracking badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="text-[#222222] font-semibold text-sm">Live Tracking Active</p>
                <p className="text-[#666666] text-xs">Bus #24 — 2 stops away</p>
              </div>
            </div>

            {/* Floating rating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 text-center">
              <p className="text-[#F98C1F] font-extrabold text-xl leading-tight">4.9</p>
              <div className="flex gap-0.5 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="fill-[#F98C1F] text-[#F98C1F]" />
                ))}
              </div>
              <p className="text-[#666666] text-xs mt-0.5">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
