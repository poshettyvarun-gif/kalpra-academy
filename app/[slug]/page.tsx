/* Native images are pre-sized and served from local optimized assets. */
/* oxlint-disable next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/academy';
import { Footer, FinalCTA } from '@/components/sections';
import { courses, enrollmentUrl } from '@/lib/courses';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Users,
  Award,
  Star,
} from 'lucide-react';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === decodeURIComponent(slug));
  if (!course) return { title: 'Page Not Found' };
  return {
    title: course.name,
    description: course.description,
    openGraph: {
      title: course.name + ' | Kalpra Academy',
      description: course.description,
      type: 'website',
    },
  };
}
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === decodeURIComponent(slug));
  if (!course) notFound();
  const project = course.modules.find((m) =>
    /Projects|Portfolio/.test(m.title),
  );
  return (
    <>
      <Header />
      <main id="main">
        <section className="course-hero">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/courses">Courses</Link>
              <span>/</span>
              <span>{course.name}</span>
            </div>
            <div className="course-hero-grid">
              <div>
                <span className="eyebrow">{course.category}</span>
                <h1>{course.name}</h1>
                <p>{course.description}</p>
                <div className="detail-badges">
                  <span>
                    <Clock3 size={17} />
                    {course.duration}
                  </span>
                  <span>
                    <Users size={17} />
                    {course.mentor}
                  </span>
                  <span>
                    <Star size={17} />
                    {course.rating} course rating
                  </span>
                </div>
                <div className="button-row">
                  <Link className="button" href={enrollmentUrl}>
                    Enroll Now <ArrowUpRight size={17} />
                  </Link>
                  <Link
                    className="button secondary"
                    href={`/contact?interest=${encodeURIComponent(course.name)}`}
                  >
                    Talk to an Expert <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
              <img
                src={`/assets/${course.image}`}
                alt={`${course.name} program`}
                width="600"
                height="400"
              />
            </div>
          </div>
        </section>
        <div className="container detail-layout">
          <article>
            <section id="overview">
              <span className="eyebrow">THE PROGRAM</span>
              <h2>
                Build understanding.
                <br />
                Then put it into practice.
              </h2>
              <p>
                {course.description} Explore the program topics below and speak
                with our team about the next batch, prerequisites and
                enrollment.
              </p>
              <h3>Who should join</h3>
              <p>
                {course.audience}. Our team can help you assess which starting
                point fits your background.
              </p>
              <h3>Skills you’ll gain</h3>
              <div className="skill-tags">
                {course.skills.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </section>
            <section id="curriculum">
              <span className="eyebrow">WHAT YOU’LL LEARN</span>
              <h2>Your curriculum, at a glance.</h2>
              <p>Explore the learning areas in this program.</p>
              <div className="curriculum">
                {course.modules.map((m, i) => (
                  <details key={m.title} open={i === 0}>
                    <summary>
                      <span className="module-number">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {m.title}
                      <span className="expand">+</span>
                    </summary>
                    <p>{m.description}</p>
                  </details>
                ))}
              </div>
            </section>
            <section className="detail-two">
              <article>
                <CodeProject />
                <h3>Projects & practical learning</h3>
                <p>
                  {project?.description ||
                    'Apply your learning through practical exercises and guided work. Contact our team for project details for your selected track.'}
                </p>
              </article>
              <article>
                <Award size={27} />
                <h3>Certification</h3>
                <p>
                  {course.slug === 'sap-courses'
                    ? 'The program includes certification preparation. Ask our team about the certification pathway for your chosen SAP track.'
                    : 'Certification is available upon successful program completion. Ask our team about the requirements for your selected track.'}
                </p>
              </article>
            </section>
            <section>
              <span className="eyebrow">YOUR NEXT STEP</span>
              <h2>Connect skills to possibilities.</h2>
              <p>
                Relevant areas to explore include{' '}
                {course.careers.charAt(0).toLowerCase() +
                  course.careers.slice(1)}
                . Career guidance and placement support help you prepare for
                your next step; employment is not guaranteed.
              </p>
              <div className="mentor-panel">
                <span className="icon-box">
                  <Users size={27} />
                </span>
                <div>
                  <span className="eyebrow">YOUR MENTOR</span>
                  <h3>{course.mentor}</h3>
                  <p>
                    Connect with the Kalpra team for batch-specific mentor and
                    schedule information.
                  </p>
                </div>
              </div>
            </section>
            <section>
              <span className="eyebrow">A LITTLE MORE CLARITY</span>
              <h2>Frequently asked questions</h2>
              {[
                [
                  'How long is the program?',
                  `The published duration is ${course.duration}. Confirm the current schedule and available learning format with our team before enrolling.`,
                ],
                [
                  'Do I need prior experience?',
                  'The right starting point depends on your background and selected program. Talk to our team for prerequisite guidance and a readiness assessment.',
                ],
                [
                  'How do I enroll?',
                  'Use Enroll Now to visit the existing Kalpra enrollment platform, or contact the team to discuss fees, the next batch and your learning goals.',
                ],
                [
                  'Is placement support included?',
                  'Kalpra Academy provides career guidance and placement support. Support is not a guarantee of employment; our team can explain what is included in your selected program.',
                ],
              ].map(([q, a]) => (
                <details className="faq" key={q}>
                  <summary>
                    {q}
                    <span>+</span>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </section>
          </article>
          <aside className="enrollment-card">
            <span className="eyebrow">INVEST IN YOUR NEXT CHAPTER</span>
            <h3>
              Make your next
              <br />
              move count.
            </h3>
            <p>
              Learn with guidance.
              <br />
              Build with confidence.
            </p>
            <ul>
              {[
                course.duration,
                'Mentor-led learning',
                'Practical skill development',
                'Career guidance',
              ].map((s) => (
                <li key={s}>
                  <Check size={16} />
                  {s}
                </li>
              ))}
            </ul>
            <Link href={enrollmentUrl} className="button">
              Enroll Now <ArrowUpRight size={17} />
            </Link>
            <Link className="text-link" href="/contact">
              Have a question? Let’s talk <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
function CodeProject() {
  return (
    <span className="project-symbol" aria-hidden="true">
      &lt;/&gt;
    </span>
  );
}
