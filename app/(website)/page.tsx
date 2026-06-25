import Hero from '@/components/website/home/Hero'
import TrustBar from '@/components/website/home/TrustBar'
import Categories from '@/components/website/home/Categories'
import HowItWorksPreview from '@/components/website/home/HowItWorksPreview'
import FeaturedListings from '@/components/website/home/FeaturedListings'
import BuyingRoutes from '@/components/website/home/BuyingRoutes'
import Testimonials from '@/components/website/home/Testimonials'
import SellCTABanner from '@/components/website/home/SellCTABanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Categories />
      <HowItWorksPreview />
      <FeaturedListings />
      <BuyingRoutes />
      <Testimonials />
      <SellCTABanner />
    </>
  )
}
