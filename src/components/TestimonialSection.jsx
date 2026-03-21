import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "SmartKids Shuttle has completely transformed our morning routine. My daughter loves it and I can track her bus every single day. I finally feel at ease during my commute to work.",
    name: 'Sarah Johnson',
    subtitle: 'WORKING MOM OF TWO',
    initials: 'SJ',
  },
]

export default function TestimonialSection() {
  const { quote, name, subtitle, initials } = testimonials[0]

  return (
    <section id="testimonials" className="bg-[#F5EDE3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-[#F98C1F] font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-4xl font-extrabold text-[#222222] mt-2">
            What Parents Say
          </h2>
        </div>

        {/* Testimonial card */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-10">
          {/* Quote icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
              <Quote size={24} className="text-[#F98C1F]" />
            </div>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-[#F98C1F] text-[#F98C1F]" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl text-[#222222] font-medium leading-relaxed mb-8 italic text-center">
            &ldquo;{quote}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-[#F98C1F] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#222222]">{name}</p>
              <p className="text-sm text-[#666666] uppercase tracking-wider">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-[#F98C1F] rounded-full" />
          <div className="w-3 h-3 bg-orange-200 rounded-full" />
          <div className="w-3 h-3 bg-orange-200 rounded-full" />
        </div>
      </div>
    </section>
  )
}
