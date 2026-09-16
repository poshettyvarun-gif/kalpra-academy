import { Header, Hero, Benefits } from '@/components/academy';
import {
  Audience,
  Programs,
  WhyKalpra,
  Approach,
  Services,
  Outcomes,
  Founder,
  Collaborations,
  Testimonials,
  Gallery,
  FinalCTA,
  ContactSection,
  Footer,
} from '@/components/sections';
import { getCmsContent } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await getCmsContent();
  return (
    <>
      <Header />
      <main id="main">
        <Hero content={content.hero} />
        <Benefits />
        <Audience />
        <Programs items={content.courses} />
        <WhyKalpra />
        <Approach />
        <Services items={content.services} />
        <Outcomes items={content.outcomes} />
        <Founder />
        <Collaborations items={content.partners} />
        <Testimonials />
        <Gallery images={content.gallery} />
        <FinalCTA />
        <ContactSection
          details={content.contact}
          courseItems={content.courses}
        />
      </main>
      <Footer
        contactEmail={content.contact.email}
        courseItems={content.courses}
      />
    </>
  );
}
