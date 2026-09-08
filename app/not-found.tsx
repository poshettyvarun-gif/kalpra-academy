import Link from 'next/link';
import { Header } from '@/components/academy';
import { Footer } from '@/components/sections';
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="section container">
        <span className="eyebrow">404 · PAGE NOT FOUND</span>
        <h1 className="not-found-title">Let’s get you back on track.</h1>
        <p>
          The page you’re looking for isn’t here. Explore our programs to find
          your next step.
        </p>
        <Link className="button" href="/courses">
          Explore Courses →
        </Link>
      </main>
      <Footer />
    </>
  );
}
