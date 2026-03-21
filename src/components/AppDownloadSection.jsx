import { Smartphone, Download, MapPin, Bell } from 'lucide-react'
import schoolBus from '../assets/image/school-bus.png'

export default function AppDownloadSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#F98C1F] to-[#F57C00] rounded-3xl px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: text + store buttons */}
          <div>
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Mobile App
            </span>
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              Track on the Go<br />with Ease
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Get real-time bus location, instant alerts, and full trip history — all from your smartphone.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="flex items-center gap-1.5 bg-white/20 text-white text-sm px-3 py-1.5 rounded-full">
                <MapPin size={14} /> Live Tracking
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 text-white text-sm px-3 py-1.5 rounded-full">
                <Bell size={14} /> Instant Alerts
              </span>
            </div>

            {/* Store buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-black/30 hover:bg-black/50 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-colors border border-white/20">
                <Smartphone size={24} />
                <div className="text-left">
                  <p className="text-xs text-white/70">Download on the</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </button>
              <button className="bg-black/30 hover:bg-black/50 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-colors border border-white/20">
                <Download size={24} />
                <div className="text-left">
                  <p className="text-xs text-white/70">Get it on</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right: phone mockup card */}
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5 max-w-xs w-full shadow-xl">
              {/* Phone frame */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                {/* App top bar */}
                <div className="bg-[#F98C1F] px-4 py-3 flex items-center justify-between">
                  <span className="text-white font-semibold text-sm">SmartKids</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full" />
                    <div className="w-2 h-2 bg-white/60 rounded-full" />
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                {/* App content */}
                <div className="p-3">
                  <img
                    src={schoolBus}
                    alt="App preview"
                    className="w-full rounded-xl object-cover"
                  />
                  <div className="mt-3 p-3 bg-[#F5EDE3] rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#222222]">Bus #24</span>
                      <span className="text-xs text-green-600 font-medium">● On Route</span>
                    </div>
                    <div className="w-full bg-orange-100 rounded-full h-1.5">
                      <div className="bg-[#F98C1F] h-1.5 rounded-full w-2/3" />
                    </div>
                    <p className="text-xs text-[#666666] mt-1">Arrives in ~8 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
