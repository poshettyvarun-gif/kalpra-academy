import { Header, Benefits } from '@/components/academy';
import {
  Founder,
  WhyKalpra,
  Approach,
  Collaborations,
  FinalCTA,
  Footer,
  SectionHeading,
} from '@/components/sections';
export const metadata = {
  title: 'About Us',
  description:
    'Get to know Kalpra Academy, founder Dr. Malleswar Yenugu, and our practical approach to technology education.',
};
export default function About() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">THIS IS KALPRA ACADEMY</span>
            <h1>
              Potential is everywhere.
              <br />
              <span>Let’s put it to work.</span>
            </h1>
            <p>
              Technical education built around curiosity, practical experience
              and the possibilities ahead.
            </p>
          </div>
        </section>
        <Benefits />
        <section className="section">
          <div className="container story-grid">
            <SectionHeading
              label="OUR STORY"
              title="Bringing learning closer to the real world."
            />
            <div>
              <p>
                Kalpra Academy brings industry-driven learning, research and
                innovation into technical education. Our programs connect
                essential foundations with emerging technologies, including AI,
                cloud and data science.
              </p>
              <p>
                From a student’s first programming experience to faculty
                development and institutional partnerships, we create
                opportunities to learn by doing.
              </p>
              <div className="mission-grid">
                <article>
                  <h3>Our mission</h3>
                  <p>
                    Empower learners through practical technology education,
                    expert guidance and projects that turn understanding into
                    capability.
                  </p>
                </article>
                <article>
                  <h3>Our vision</h3>
                  <p>
                    Help learners grow as intelligent problem-solvers and
                    innovators, ready to participate in an evolving digital
                    world.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
        <Founder />
        <WhyKalpra />
        <Approach />
        <Collaborations />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
