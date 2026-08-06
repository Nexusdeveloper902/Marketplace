import { LandingHero } from "@/components/landing/landing-hero"
import { FeaturedVehicles } from "@/components/landing/featured-vehicles"
import { CinematicShowcase } from "@/components/landing/cinematic-showcase"
import { WhyChooseUs } from "@/components/landing/why-choose-us"
import { BrandsSection } from "@/components/landing/brands-section"
import { SiteShell } from "@/components/layout/site-shell"

export default function HomePage() {
  return (
    <SiteShell>
      <LandingHero />
      <FeaturedVehicles />
      <CinematicShowcase />
      <WhyChooseUs />
      <BrandsSection />
    </SiteShell>
  )
}
