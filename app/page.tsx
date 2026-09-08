import { Header, Hero, Benefits } from '@/components/academy';
import {
  Audience,
  Programs,
  WhyKalpra,
  Approach,
  Services,
  Founder,
  Collaborations,
  Gallery,
  FinalCTA,
  ContactSection,
  Footer,
} from '@/components/sections';
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Benefits />
        <Audience />
        <Programs />
        <WhyKalpra />
        <Approach />
        <Services />
        <Founder />
        <Collaborations />
        <Gallery />
        <FinalCTA />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
