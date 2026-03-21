import { MapPin, UserCheck, Shield, Calendar } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Know exactly where your child\'s bus is at all times with live GPS updates every 30 seconds.',
    highlighted: false,
  },
  {
    icon: UserCheck,
    title: 'Certified Drivers',
    description: 'All drivers are fully vetted, background-checked, and trained in child safety protocols.',
    highlighted: false,
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Seatbelts, safety cameras, and emergency protocols on every vehicle in our fleet.',
    highlighted: false,
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book, reschedule, and manage trips in seconds — right from your phone.',
    highlighted: true,
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#F7F7F7] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-[#F98C1F] font-semibold text-sm uppercase tracking-widest">Why Us</span>
          <h2 className="text-4xl font-extrabold text-[#222222] mt-2 mb-4">
            Why Parents Choose Us
          </h2>
          <p className="text-[#666666] text-lg max-w-xl mx-auto">
            Everything you need to feel confident about your child's daily commute.
          </p>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${
                  feature.highlighted
                    ? 'bg-[#F98C1F]'
                    : 'bg-white'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.highlighted ? 'bg-white/20' : 'bg-orange-50'
                  }`}
                >
                  <Icon
                    size={24}
                    className={feature.highlighted ? 'text-white' : 'text-[#F98C1F]'}
                  />
                </div>
                <h3
                  className={`font-bold text-lg mb-2 ${
                    feature.highlighted ? 'text-white' : 'text-[#222222]'
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    feature.highlighted ? 'text-white/80' : 'text-[#666666]'
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
