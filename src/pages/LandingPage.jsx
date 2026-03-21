import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import StepsSection from '../components/StepsSection'
import TestimonialSection from '../components/TestimonialSection'
import AppDownloadSection from '../components/AppDownloadSection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StepsSection />
        <TestimonialSection />
        <AppDownloadSection />
      </main>
      <Footer />
    </>
  )
}
