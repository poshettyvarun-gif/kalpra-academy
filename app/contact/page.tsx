import { Header } from '@/components/academy';
import { ContactSection, Footer } from '@/components/sections';
export const metadata = {
  title: 'Contact Us',
  description:
    'Contact Kalpra Academy in Hyderabad and Houston for programs, enrollment and academic collaboration.',
};
export default function Contact() {
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
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
