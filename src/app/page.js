import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <FeaturedDoctors />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
