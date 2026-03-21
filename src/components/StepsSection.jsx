import { Smartphone, UserPlus, Route, Bell } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: Smartphone,
    title: 'Download App',
    description: 'Get the SmartKids Shuttle app on iOS or Android — it\'s free.',
  },
  {
    number: '2',
    icon: UserPlus,
    title: 'Register Child',
    description: 'Add your child\'s details, school, and emergency contacts in minutes.',
  },
  {
    number: '3',
    icon: Route,
    title: 'Select Route',
    description: 'Choose a pickup point and schedule — morning, afternoon, or both.',
  },
  {
    number: '4',
    icon: Bell,
    title: 'Track & Relax',
    description: 'Get live updates and instant notifications when your child boards and arrives.',
  },
]

export default function StepsSection() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-[#F98C1F] font-semibold text-sm uppercase tracking-widest">How It Works</span>
          <h2 className="text-4xl font-extrabold text-[#222222] mt-2 mb-4">
            Simple. Safe. Seamless.
          </h2>
          <p className="text-[#666666] text-lg max-w-xl mx-auto">
            Getting started takes less than 5 minutes. Your child's safety is just a few taps away.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative text-center">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-0.5 bg-orange-100 z-0" />
                )}

                {/* Step number circle */}
                <div className="relative z-10 w-16 h-16 bg-[#F98C1F] rounded-full flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-[#F98C1F]" />
                </div>

                <h3 className="font-bold text-[#222222] text-lg mb-2">{step.title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
