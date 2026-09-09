/* Native images are pre-sized and served from local optimized assets. */
/* oxlint-disable next/no-img-element */
'use client';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  BriefcaseBusiness,
  Building2,
  Users,
  Video,
  Award,
  Compass,
  Code2,
  Handshake,
  Check,
  Clock3,
  Star,
  Sparkles,
  Lightbulb,
  Trophy,
  Layers,
  Plus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  courses,
  categories,
  type Course,
  email,
  enrollmentUrl,
} from '@/lib/courses';
import {
  defaultCmsContent,
  type CmsContent,
  type CmsService,
} from '@/lib/cms-content';

export function SectionHeading({
  label,
  title,
  description,
  center = false,
}: {
  label: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`section-heading ${center ? 'center' : ''}`}>
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Audience() {
  const groups = [
    {
      title: 'Students & Graduates',
      icon: GraduationCap,
      tag: 'START STRONG',
      text: 'Turn your curiosity into capability. Build technical foundations and prepare for your first career opportunity.',
      link: 'Explore your path',
      value: 'Development',
    },
    {
      title: 'Working Professionals',
      icon: BriefcaseBusiness,
      tag: 'TAKE THE NEXT STEP',
      text: 'Build on your experience with practical skills in AI, data and cloud for an evolving technology industry.',
      link: 'Upgrade your skills',
      value: 'AI & Machine Learning',
    },
    {
      title: 'Colleges, Faculty & Institutions',
      icon: Building2,
      tag: 'GROW TOGETHER',
      text: 'Bring industry learning to your campus through academic collaborations, workshops and faculty development.',
      link: 'Partner with Kalpra',
      value: 'Career & Faculty',
    },
  ];
  return (
    <section className="section" id="who-we-help">
      <div className="container">
        <SectionHeading
          label="A PATH FOR EVERY AMBITION"
          title="Wherever you are, go further."
          description="Your goals are personal. Your learning journey should be, too."
          center
        />
        <div className="audience-grid">
          {groups.map(({ title, icon: Icon, tag, text, link, value }) => (
            <article className="audience-card" key={title}>
              <div className="card-top">
                <span className="icon-box">
                  <Icon size={26} />
                </span>
                <span className="micro-label">{tag}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link
                className="text-link"
                href={
                  value === 'Career & Faculty'
                    ? '/contact?interest=Academic%20Collaboration'
                    : `/courses?category=${encodeURIComponent(value)}`
                }
              >
                {link}
                <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
        </div>
        <p className="section-footnote">
          Not sure where to begin?{' '}
          <Link href="/contact">
            Find the right program <ArrowRight size={14} />
          </Link>
        </p>
      </div>
    </section>
  );
}
export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <Link
        className="course-image"
        href={`/${course.slug}`}
        aria-label={`View ${course.name}`}
      >
        <img
          src={
            course.image.startsWith('/')
              ? course.image
              : `/assets/${course.image}`
          }
          alt={`${course.name} program`}
          loading="lazy"
          width="600"
          height="330"
        />
        <span className="image-tag">{course.category}</span>
      </Link>
      <div className="course-body">
        <div className="course-rating">
          <span>
            <span className="status-dot" /> MENTOR-LED LEARNING
          </span>
          <span>
            <Star size={13} fill="currentColor" />
            {course.rating}
          </span>
        </div>
        <h3>
          <Link href={`/${course.slug}`}>{course.name}</Link>
        </h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span>
            <Clock3 size={14} />
            {course.duration}
          </span>
          <span>
            <Users size={14} />
            {course.mentor}
          </span>
        </div>
        <Link className="course-link" href={`/${course.slug}`}>
          View Course <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
export function Programs({
  full = false,
  items = courses,
}: {
  full?: boolean;
  items?: typeof courses;
}) {
  const searchParams = useSearchParams();
  const requested = searchParams.get('category');
  const [chosen, setCategory] = useState<string | null>(null);
  const category =
    chosen ||
    (requested && categories.includes(requested) ? requested : 'All Programs');
  return (
    <section className="section programs-section" id="courses">
      <div className="container">
        <div className="section-header-row">
          <SectionHeading
            label="LEARN WHAT'S NEXT"
            title={full ? 'Find your next chapter.' : 'Explore our programs.'}
            description="Practical skills. Expert guidance. A future full of possibilities."
          />
          {!full && (
            <Link className="text-link" href="/courses">
              View all courses <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
        <Tabs value={category} onValueChange={(v) => setCategory(String(v))}>
          <div className="tabs-scroll">
            <TabsList className="program-tabs" aria-label="Program categories">
              {categories.map((c) => (
                <TabsTrigger key={c} value={c}>
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {categories.map((c) => (
            <TabsContent key={c} value={c}>
              <div className="courses-grid">
                {items
                  .filter((x) => c === 'All Programs' || x.category === c)
                  .slice(0, full ? 12 : c === 'All Programs' ? 6 : 12)
                  .map((course) => (
                    <CourseCard key={course.slug} course={course} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        {!full && (
          <div className="section-bottom">
            <Link className="button secondary" href="/courses">
              View All Courses <ArrowRight size={16} />
            </Link>
            <span>Find the skills that fit your ambition.</span>
          </div>
        )}
      </div>
    </section>
  );
}
const reasons = [
  {
    icon: Video,
    title: 'Live classes',
    text: 'Ask questions, exchange ideas and learn through interactive sessions.',
  },
  {
    icon: Users,
    title: 'Expert mentors',
    text: 'Get guidance from professionals who bring industry experience to your learning.',
  },
  {
    icon: Award,
    title: 'Certifications',
    text: 'Celebrate your progress with certification on successful course completion.',
  },
  {
    icon: Compass,
    title: 'Career guidance',
    text: 'Connect your learning to your goals with personalized career advice.',
  },
  {
    icon: Code2,
    title: 'Real projects',
    text: 'Put theory into practice and build work you can add to your portfolio.',
  },
  {
    icon: Handshake,
    title: 'Placement support',
    text: 'Get dedicated support as you prepare for placements and internships.',
  },
];
export function WhyKalpra() {
  return (
    <section className="section why-section" id="why-kalpra">
      <div className="container why-layout">
        <div>
          <span className="eyebrow">THE KALPRA ADVANTAGE</span>
          <h2>
            Why choose
            <br />
            <span>Kalpra Academy?</span>
          </h2>
          <p>
            Why choose Kalpra Academy? Because the right support makes all the
            difference between knowing and doing.
          </p>
          <Link className="text-link" href="/about">
            Get to know Kalpra <ArrowUpRight size={17} />
          </Link>
          <div className="why-note">
            <Sparkles size={24} />
            <span>
              Built around your growth.
              <br />
              <strong>Focused on your future.</strong>
            </span>
          </div>
        </div>
        <div className="reasons-grid">
          {reasons.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={25} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Approach() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          label="A CLEAR PATH FORWARD"
          title="From your first step to your next big move."
          description="A practical learning journey, with guidance at every stage."
          center
        />
        <div className="timeline">
          {[
            [
              'Assessment',
              'Understand your strengths through a comprehensive pre-training assessment.',
              'Know your starting point',
            ],
            [
              'Curriculum Enhancement',
              'Follow an industry-aligned curriculum, shaped by expert guidance.',
              'Build the right foundation',
            ],
            [
              'Training Sessions',
              'Develop practical skills through interactive, tailored learning sessions.',
              'Learn by doing',
            ],
            [
              'Projects & Certification',
              'Apply your skills to real projects, earn certification and access placement support.',
              'Show what you can do',
            ],
          ].map(([title, text, tag], i) => (
            <article key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="step-tag">{tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
const serviceIcons: Record<CmsService['icon'], typeof Building2> = {
  building: Building2,
  idea: Lightbulb,
  trophy: Trophy,
  layers: Layers,
};

export function Services({
  items = defaultCmsContent.services,
}: {
  items?: CmsContent['services'];
}) {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-header-row">
          <SectionHeading
            label="LEARNING BEYOND THE CLASSROOM"
            title="Big ideas. Hands-on experiences."
            description="Programs for people and partnerships that move education forward."
          />
          <Link
            href="/contact?interest=Academic%20Collaboration"
            className="text-link"
          >
            Let’s collaborate <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="services-grid">
          {items.map(({ icon, title, text, benefits, image }) => {
            const Icon = serviceIcons[icon] || Building2;
            return (
              <article className="service-card" key={title}>
                <div className="service-image">
                  <img
                    src={image}
                    alt={`Kalpra Academy learning and collaboration event`}
                    loading="lazy"
                    width="600"
                    height="330"
                  />
                  <span className="icon-box">
                    <Icon size={22} />
                  </span>
                </div>
                <div className="service-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <ul>
                    {benefits.map((b) => (
                      <li key={b}>
                        <Check size={14} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="text-link"
                    href={`/contact?interest=${encodeURIComponent(title)}`}
                  >
                    Let’s talk <ArrowUpRight size={17} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const [value, setValue] = useState(0);
  const counterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) {
      const reducedMotionFrame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(reducedMotionFrame);
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startedAt = performance.now();
        const duration = 1700;
        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setValue(Math.round(target * eased));
          if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        observer.unobserve(element);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <strong ref={counterRef} aria-label={`${target}${suffix} ${label}`}>
      <span aria-hidden="true">
        {value}
        {suffix}
      </span>
    </strong>
  );
}

export function Outcomes({
  items = defaultCmsContent.outcomes,
}: {
  items?: CmsContent['outcomes'];
}) {
  return (
    <section
      className="outcomes-section"
      id="outcomes"
      aria-labelledby="outcomes-title"
    >
      <div className="container outcomes-layout">
        <div className="outcomes-copy">
          <span className="eyebrow">PROGRESS YOU CAN SEE</span>
          <h2 id="outcomes-title">
            Learning that creates
            <br />
            <span>real momentum.</span>
          </h2>
          <p>
            A growing community of learners, mentors and programs focused on
            practical technology skills.
          </p>
        </div>
        <div className="outcomes-grid">
          {items.map(({ target, suffix, label }, index) => (
            <article key={label}>
              <span className="outcome-index">0{index + 1}</span>
              <AnimatedCounter target={target} suffix={suffix} label={label} />
              <span className="outcome-label">{label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Founder() {
  return (
    <section className="section" id="founder">
      <div className="container founder-grid">
        <div className="founder-portrait">
          <img
            src="/assets/about.jpeg"
            alt="Dr. Malleswar Yenugu, founder of Kalpra Academy"
            loading="lazy"
            width="500"
            height="500"
          />
          <div className="founder-label">
            <strong>Dr. Malleswar Yenugu</strong>
            <span>FOUNDER, KALPRA ACADEMY</span>
          </div>
        </div>
        <div>
          <span className="eyebrow">MEET OUR FOUNDER</span>
          <h2>
            Education with a vision.
            <br />
            <span>A future with purpose.</span>
          </h2>
          <p>
            Under the leadership of Dr. Malleswar Yenugu, Kalpra Academy brings
            together innovation, research and industry-driven learning to
            advance technical education.
          </p>
          <p>
            With a focus on Agentic AI and emerging technologies, the academy
            helps students develop as problem-solvers, innovators and technology
            professionals.
          </p>
          <div className="founder-mission">
            <span>OUR MISSION</span>
            <p>
              Empower learners with practical technology skills and the guidance
              to take their next step with confidence.
            </p>
          </div>
          <Link className="text-link" href={enrollmentUrl}>
            Join Our Mission <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
export function Collaborations({
  items = defaultCmsContent.partners,
}: {
  items?: CmsContent['partners'];
}) {
  return (
    <section className="collaboration-section" id="collaborations">
      <div className="container">
        <SectionHeading
          label="LEARNING, CONNECTED"
          title="Growing through collaboration."
          center
        />
        <div className="partner-marquee">
          <div className="partner-track">
            <div className="partner-track-group">
              {items.map(({ image, name, url, type }) => (
                <Link
                  className="partner-card"
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={image}
                    alt={name}
                    width="180"
                    height="75"
                    loading="lazy"
                  />
                  <span>{type}</span>
                </Link>
              ))}
            </div>
            <div className="partner-track-group" aria-hidden="true">
              {items.map(({ image, name, type }) => (
                <div className="partner-card" key={`duplicate-${name}`}>
                  <img
                    src={image}
                    alt=""
                    width="180"
                    height="75"
                    loading="lazy"
                  />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export function Gallery({
  images = defaultCmsContent.gallery,
}: {
  images?: CmsContent['gallery'];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section className="section">
      <div className="container">
        <div className="section-header-row">
          <SectionHeading
            label="REAL PEOPLE. SHARED POSSIBILITIES."
            title="Life at Kalpra Academy"
            description="Moments of learning, collaboration, innovation and growth."
          />
          <span className="gallery-note">
            A glimpse into our community <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="gallery-grid">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              className={`gallery-photo gallery-${i}`}
              onClick={() => setSelected(i)}
              aria-label={`Enlarge campus moment ${i + 1}`}
            >
              <img
                src={image}
                alt={`Kalpra Academy campus learning event ${i + 1}`}
                loading="lazy"
                width="800"
                height="500"
              />
              <span>
                <Plus size={22} />
              </span>
            </button>
          ))}
        </div>
        <Dialog
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <DialogContent className="gallery-dialog">
            <DialogTitle>Life at Kalpra Academy</DialogTitle>
            <DialogDescription>
              Learning and collaboration in our community.
            </DialogDescription>
            {selected !== null && (
              <img
                src={images[selected]}
                alt={`Kalpra Academy campus moment ${selected + 1}`}
              />
            )}
            <div className="gallery-controls">
              <button
                className="button secondary small"
                aria-label="Previous photo"
                onClick={() =>
                  setSelected((index) =>
                    index === null || index === 0
                      ? images.length - 1
                      : index - 1,
                  )
                }
              >
                <ChevronLeft size={20} />
              </button>
              <span>
                {(selected ?? 0) + 1} / {images.length}
              </span>
              <button
                className="button secondary small"
                aria-label="Next photo"
                onClick={() =>
                  setSelected((index) =>
                    index === null || index === images.length - 1
                      ? 0
                      : index + 1,
                  )
                }
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="cta-wrap">
      <div className="container final-cta">
        <div>
          <span className="eyebrow">YOUR NEXT CHAPTER IS WAITING</span>
          <h2>
            Your future starts
            <br />
            with the right skills.
          </h2>
          <p>
            Learn from experts. Build real projects.
            <br />
            Get ready for the opportunities of tomorrow.
          </p>
        </div>
        <div>
          <Link className="button white" href="/courses">
            Explore Courses <ArrowRight size={18} />
          </Link>
          <Link className="cta-secondary" href="/contact">
            Talk to Our Team <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
function fieldText(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
}
export function ContactForm({
  contactEmail = email,
  courseItems = courses,
}: {
  contactEmail?: string;
  courseItems?: typeof courses;
}) {
  const searchParams = useSearchParams();
  const requested = searchParams.get('interest');
  const interest =
    requested === 'Academic Collaborations'
      ? 'Academic Collaboration'
      : requested;
  const [chosen, setCourse] = useState<string | null>(null);
  const course =
    chosen ||
    (interest &&
    [
      ...courseItems.map((c) => c.name),
      'Academic Collaboration',
      'Hands-On Workshops',
      'AI Hackathons',
      'Industrial Training',
      'Help me choose',
    ].includes(interest)
      ? interest
      : null);
  const [status, setStatus] = useState('');
  const [draft, setDraft] = useState('');
  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setDraft('');
    if (fieldText(data, 'name').trim().length < 2) {
      setStatus('Please enter your full name.');
      return;
    }
    const phone = fieldText(data, 'phone');
    if (
      phone.replace(/\D/g, '').length < 7 ||
      phone.replace(/\D/g, '').length > 15
    ) {
      setStatus('Please enter a valid phone number with 7–15 digits.');
      return;
    }
    if (!course) {
      setStatus('Please select the program or service you are interested in.');
      return;
    }
    const body = `Full name: ${fieldText(data, 'name')}\nEmail: ${fieldText(data, 'email')}\nPhone: ${phone}\nInterested in: ${course}\n\n${fieldText(data, 'message')}`;
    setDraft(
      `mailto:${contactEmail}?subject=${encodeURIComponent('Program enquiry: ' + course)}&body=${encodeURIComponent(body)}`,
    );
    setStatus(
      'Your enquiry is ready. Open your email app below and send it to our team.',
    );
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <h3>Let’s find your next step.</h3>
      <p>Tell us what you have in mind. Our team is here to help.</p>
      <div className="form-grid">
        <label>
          Full Name <span>*</span>
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your full name"
          />
        </label>
        <label>
          Email Address <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Phone Number <span>*</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={24}
            placeholder="+91"
            pattern="[+0-9 ()\-]{7,24}"
          />
        </label>
        <div className="field">
          <label id="course-label" htmlFor="course-interest">
            Course Interested In <span>*</span>
          </label>
          <Select value={course} onValueChange={(value) => setCourse(value)}>
            <SelectTrigger
              id="course-interest"
              className="course-select"
              aria-labelledby="course-label"
            >
              <SelectValue placeholder="Choose a program" />
            </SelectTrigger>
            <SelectContent>
              {[
                ...courseItems.map((c) => c.name),
                'Academic Collaboration',
                'Hands-On Workshops',
                'AI Hackathons',
                'Industrial Training',
                'Help me choose',
              ].map((name) => (
                <SelectItem value={name} key={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="wide">
          Message
          <textarea
            name="message"
            rows={3}
            maxLength={3000}
            placeholder="Tell us about your goals or questions…"
          />
        </label>
      </div>
      <p className="form-note">
        Your details will be prepared in an email for you to review and send.
      </p>
      <button className="button" type="submit">
        Submit Details <ArrowRight size={18} />
      </button>
      {status && (
        <output className="form-status">
          {status}
          {draft && (
            <Link className="text-link" href={draft}>
              Open Email App <ArrowUpRight size={17} />
            </Link>
          )}
        </output>
      )}
    </form>
  );
}
export function ContactSection({
  details = defaultCmsContent.contact,
  courseItems = courses,
}: {
  details?: CmsContent['contact'];
  courseItems?: typeof courses;
}) {
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-grid">
        <div>
          <SectionHeading
            label="LET'S TALK ABOUT YOUR FUTURE"
            title="A small conversation. A big first step."
            description="Have a question about a course, your learning path or a collaboration? Get in touch."
          />
          <div className="contact-details">
            <div>
              <Mail size={21} />
              <div>
                <span>EMAIL US</span>
                <Link href={`mailto:${details.email}`}>{details.email}</Link>
              </div>
            </div>
            <div>
              <Phone size={21} />
              <div>
                <span>CALL US</span>
                {details.phones.map((phone) => (
                  <Link
                    key={phone}
                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                  >
                    {phone}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <MapPin size={21} />
              <div>
                <span>INDIA</span>
                <p>{details.indiaAddress}</p>
              </div>
            </div>
            <div>
              <MapPin size={21} />
              <div>
                <span>USA</span>
                <p>{details.usaAddress}</p>
              </div>
            </div>
          </div>
        </div>
        <ContactForm contactEmail={details.email} courseItems={courseItems} />
      </div>
    </section>
  );
}
export function Footer({
  contactEmail = defaultCmsContent.contact.email,
  courseItems = courses,
}: {
  contactEmail?: string;
  courseItems?: typeof courses;
}) {
  const [newsletter, setNewsletter] = useState('');
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/">
              <img
                src="/assets/kalpra-logo.png"
                alt="Kalpra Academy — For Skill Development"
                width="588"
                height="192"
              />
            </Link>
            <p>
              Empowering learners with technology skills for a world of
              possibilities.
            </p>
            <div className="social-links">
              <Link
                href="https://www.facebook.com/people/Kalpra-Academy/61550049816154/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook ↗
              </Link>
              <Link
                href="https://www.youtube.com/@KalpraAcademy"
                target="_blank"
                rel="noreferrer"
              >
                YouTube ↗
              </Link>
              <Link
                href="https://www.instagram.com/kalpracademy"
                target="_blank"
                rel="noreferrer"
              >
                Instagram ↗
              </Link>
            </div>
          </div>
          <div>
            <h3>Programs</h3>
            {courseItems.slice(0, 4).map((c) => (
              <Link key={c.slug} href={`/${c.slug}`}>
                {c.name}
              </Link>
            ))}
            <Link href="/courses">
              All Programs <ArrowUpRight size={14} />
            </Link>
          </div>
          <div>
            <h3>Explore Kalpra</h3>
            <Link href="/about">About Us</Link>
            <Link href="/#why-kalpra">Why Kalpra</Link>
            <Link href="/#services">Our Services</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href={enrollmentUrl}>Enroll Now</Link>
          </div>
          <div>
            <h3>Stay curious. Stay connected.</h3>
            <p>Subscribe to Newsletter</p>
            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                setNewsletter(
                  `mailto:${contactEmail}?subject=Newsletter%20subscription&body=${encodeURIComponent('Please subscribe ' + fieldText(d, 'newsletter') + ' to the Kalpra Academy newsletter.')}`,
                );
              }}
            >
              <label className="sr-only" htmlFor="newsletter">
                Email for newsletter
              </label>
              <input
                type="email"
                id="newsletter"
                name="newsletter"
                required
                placeholder="Enter your email"
              />
              <button type="submit" aria-label="Subscribe">
                <ArrowRight size={19} />
              </button>
            </form>
            {newsletter && (
              <output className="newsletter-status">
                <Link href={newsletter}>Send subscription request ↗</Link>
              </output>
            )}
            <Link className="footer-email" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Kalpra Academy. All rights reserved.
          </span>
          <span>BUILD SKILLS. BUILD YOUR FUTURE.</span>
        </div>
      </div>
    </footer>
  );
}
