import { Header } from '@/components/academy';
import { Programs, FinalCTA, Footer } from '@/components/sections';
export const metadata = {
  title: 'Our Programs',
  description:
    'Explore all 12 Kalpra Academy programs in AI, Python, data, cloud, security, SAP and career development.',
};
export default function Courses() {
  return (
    <>
      <Header />
      <main id="main">
        <div className="page-banner">
          <div className="container">
            <span className="eyebrow">BUILD WHAT COMES NEXT</span>
            <h1>
              Your ambition.
              <br />
              <span>Your learning path.</span>
            </h1>
            <p>
              Explore programs that connect your curiosity with practical
              skills.
            </p>
          </div>
        </div>
        <Programs full />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
