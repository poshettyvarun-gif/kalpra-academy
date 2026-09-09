import { Header } from '@/components/academy';
import { ContactSection, Footer } from '@/components/sections';
import { getCmsContent } from '@/lib/cms-server';
export const metadata = {
  title: 'Contact Us',
  description:
    'Contact Kalpra Academy in Hyderabad and Houston for programs, enrollment and academic collaboration.',
};
export const dynamic = 'force-dynamic';

export default async function Contact() {
  const content = await getCmsContent();
  return (
    <>
      <Header />
      <main id="main">
        <div className="page-banner compact">
          <div className="container">
            <span className="eyebrow">WE’RE HERE TO HELP</span>
            <h1>
              Let’s build your <span>next chapter.</span>
            </h1>
          </div>
        </div>
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
