/* Native images are pre-sized and served from local optimized assets. */
/* oxlint-disable next/no-img-element */
'use client';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Check,
  Code2,
  Sparkles,
  GraduationCap,
  Users,
  BriefcaseBusiness,
} from 'lucide-react';
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <>
      <Link className="skip-link" href="#main">
        Skip to content
      </Link>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-row">
          <Link href="/" aria-label="Kalpra Academy home">
            <img
              className="logo"
              src="/assets/kalpra-logo.png"
              alt="Kalpra Academy — For Skill Development"
              width="588"
              height="192"
            />
          </Link>
          <nav
            aria-label="Main navigation"
            className={open ? 'nav-links open' : 'nav-links'}
          >
            {[
              ['Home', '/'],
              ['Courses', '/courses'],
              ['Services', '/#services'],
              ['About Us', '/about'],
              ['Why Kalpra', '/#why-kalpra'],
              ['Contact', '/contact'],
            ].map(([name, url]) => (
              <Link key={name} href={url} onClick={() => setOpen(false)}>
                {name}
              </Link>
            ))}
          </nav>
          <Link
            className="button small nav-cta"
            href="https://proximalms.com/Home/Index"
          >
            Enroll Now <ArrowUpRight size={17} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-badge">
            <span /> BUILD SKILLS. BUILD YOUR FUTURE.
          </span>
          <h1>
            Learn future-ready
            <br />
            skills.{' '}
            <span>
              Build your
              <br />
              career.
            </span>
          </h1>
          <p>
            Big ambitions deserve the right skills. Learn from expert mentors,
            build real projects, and take your next step into the world of
            technology.
          </p>
          <div className="button-row">
            <Link className="button" href="/courses">
              Explore Courses <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" href="/contact">
              Talk to an Expert <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="hero-checks">
            <span>
              <Check size={16} /> Practical learning
            </span>
            <span>
              <Check size={16} /> Personal guidance
            </span>
            <span>
              <Check size={16} /> Career support
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-topline">
            <span>
              <span className="status-dot" /> LEARN. BUILD. BECOME.
            </span>
            <Sparkles size={20} />
          </div>
          <div className="hero-photo">
            <img
              src="/assets/hero.jpg"
              alt="Students learning together with a mentor at their laptops"
              width="1080"
              height="628"
              fetchPriority="high"
            />
            <div className="photo-caption">
              <span>FROM CURIOSITY TO CAPABILITY</span>
              <strong>
                Your next chapter
                <br />
                starts here.
              </strong>
            </div>
          </div>
          <div className="floating-note">
            <span className="note-icon">
              <Code2 size={22} />
            </span>
            <div>
              <strong>Real skills. Real possibilities.</strong>
              <span>Build more than a résumé.</span>
            </div>
            <ArrowUpRight size={20} />
          </div>
          <div className="visual-bottom">
            <span>AI & ML</span>
            <i /> <span>DATA SCIENCE</span>
            <i />
            <span>CLOUD</span>
            <i />
            <span>CODE</span>
          </div>
        </div>
      </div>
      <div className="hero-bottom container">
        <span>
          THE SKILLS OF TOMORROW. <strong>WITH YOU, TODAY.</strong>
        </span>
        <span>
          Discover your potential <ArrowRight size={16} />
        </span>
      </div>
    </section>
  );
}
export function Benefits() {
  const items = [
    { icon: GraduationCap, title: 'Industry-focused curriculum' },
    { icon: Users, title: 'Learn from expert mentors' },
    { icon: Code2, title: 'Build real-world projects' },
    { icon: BriefcaseBusiness, title: 'Guidance for your career' },
  ];
  return (
    <div className="benefit-strip">
      <div className="container benefit-grid">
        {items.map(({ icon: Icon, title }) => (
          <div key={title}>
            <Icon size={24} />
            <span>{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
