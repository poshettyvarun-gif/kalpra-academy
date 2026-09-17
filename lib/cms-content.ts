import { courses } from './courses';

export type CmsService = {
  title: string;
  text: string;
  benefits: string[];
  image: string;
  icon: 'building' | 'idea' | 'trophy' | 'layers';
};

export type CmsOutcome = {
  target: number;
  suffix: string;
  label: string;
};

export type CmsPartner = {
  image: string;
  name: string;
  url: string;
  type: string;
};

export type CmsTestimonial = {
  name: string;
  role: string;
  course: string;
  image: string;
  imagePosition: string;
  quote: string;
};

export type CmsContent = {
  hero: {
    badge: string;
    title: string;
    accent: string;
    description: string;
    image: string;
  };
  outcomes: CmsOutcome[];
  services: CmsService[];
  partners: CmsPartner[];
  testimonialsSection: {
    label: string;
    title: string;
    description: string;
  };
  testimonials: CmsTestimonial[];
  gallery: string[];
  contact: {
    email: string;
    phones: string[];
    indiaAddress: string;
    usaAddress: string;
  };
  courses: typeof courses;
};

export const defaultCmsContent: CmsContent = {
  hero: {
    badge: 'BUILD SKILLS. BUILD YOUR FUTURE.',
    title: 'Learn future-ready skills.',
    accent: 'Build your career.',
    description:
      'Big ambitions deserve the right skills. Learn from expert mentors, build real projects, and take your next step into the world of technology.',
    image: '/assets/hero.jpg',
  },
  outcomes: [
    { target: 5000, suffix: '+', label: 'Students' },
    { target: 20, suffix: '+', label: 'Courses' },
    { target: 98, suffix: '%', label: 'Success rate' },
    { target: 10, suffix: '+', label: 'Mentors' },
  ],
  services: [
    {
      icon: 'building',
      title: 'Academic Collaborations',
      text: 'Connect classroom education with practical, industry-aligned programs.',
      benefits: ['Curriculum enhancement', 'Industry-focused learning'],
      image: '/assets/2.jpg',
    },
    {
      icon: 'idea',
      title: 'Hands-On Workshops',
      text: 'Focused learning sessions that turn technical concepts into practical skills.',
      benefits: ['Prompt engineering', 'Cloud integration labs'],
      image: '/assets/3.jpg',
    },
    {
      icon: 'trophy',
      title: 'AI Hackathons',
      text: 'Bring ideas to life with collaborative challenges and functional AI prototypes.',
      benefits: ['Real-world problem statements', 'Industry expert judging'],
      image: '/assets/5.jpg',
    },
    {
      icon: 'layers',
      title: 'Industrial Training',
      text: 'Get practical industry exposure and prepare for corporate environments.',
      benefits: ['Applied technical training', 'Career-focused guidance'],
      image: '/assets/7.jpg',
    },
  ],
  partners: [
    {
      image: '/assets/KalpraTech_logo.jpeg',
      name: 'KalpraTech',
      url: 'https://www.kalpratech.com/',
      type: 'Technical partner',
    },
    {
      image: '/assets/bytelink_logo .jpeg',
      name: 'Bytelink',
      url: 'https://www.bytelinksys.com/',
      type: 'Technical partner',
    },
    {
      image: '/assets/PraiseTech_logo.jpeg',
      name: 'PraiseTech',
      url: 'https://www.praisetechsol.com/',
      type: 'Technical partner',
    },
    {
      image: '/assets/Sivani_logo.jpeg',
      name: 'Sri Sivani College of Engineering',
      url: 'https://srisivani.com/',
      type: 'Academic partner',
    },
    {
      image: '/assets/vishwa_logo.jpeg',
      name: 'Vishwa Vishwani',
      url: 'https://www.vishwavishwani.ac.in/',
      type: 'Academic partner',
    },
  ],
  testimonialsSection: {
    label: 'LEARNER STORIES',
    title: 'Skills that create real careers.',
    description:
      'Hear from learners who turned practical training into confidence, capability and meaningful career progress.',
  },
  testimonials: [
    {
      name: 'Kavya',
      role: 'AI Engineer at Drake AI',
      course: 'AI Course Graduate',
      image: '/assets/testimonial-kavya.png',
      imagePosition: 'center 12%',
      quote:
        'Kalpra Academy’s practical AI training strengthened my skills and confidence, helping me begin my career as an AI Engineer at Drake AI.',
    },
    {
      name: 'Sravan',
      role: 'Cloud Engineer',
      course: 'Cloud Course Graduate',
      image: '/assets/testimonial-srawan.png',
      imagePosition: 'center 28%',
      quote:
        'Kalpra Academy’s hands-on cloud training gave me practical skills, stronger confidence and the foundation to grow my career as a Cloud Engineer.',
    },
    {
      name: 'Rajasekhar',
      role: 'AI Engineer at Drake AI',
      course: 'AI Course Graduate',
      image: '/assets/testimonial-rajashekar.jpg',
      imagePosition: 'center top',
      quote:
        'The practical AI projects and expert guidance at Kalpra Academy helped me sharpen my skills and grow as an AI Engineer at Drake AI.',
    },
  ],
  gallery: [1, 2, 3, 4, 5].map((number) => `/assets/${number}.jpg`),
  contact: {
    email: 'registration@kalpraacademy.com',
    phones: ['+91 8341345668', '+91 9704761116', '+1 281-942-5455'],
    indiaAddress:
      'H No: 3-2-25/A Chaithnyapuri Enclave Colony, Manikonda, Hyderabad, Telangana, 500089.',
    usaAddress: '13111 Westheimer Rd., Suite 311, Houston, TX, 77077',
  },
  courses,
};

export function normalizeCmsContent(value: unknown): CmsContent {
  if (!value || typeof value !== 'object') return defaultCmsContent;
  const partial = value as Partial<CmsContent>;
  return {
    ...defaultCmsContent,
    ...partial,
    hero: { ...defaultCmsContent.hero, ...partial.hero },
    contact: { ...defaultCmsContent.contact, ...partial.contact },
    testimonialsSection: {
      ...defaultCmsContent.testimonialsSection,
      ...partial.testimonialsSection,
    },
    outcomes:
      Array.isArray(partial.outcomes) && partial.outcomes.length
        ? partial.outcomes
        : defaultCmsContent.outcomes,
    services:
      Array.isArray(partial.services) && partial.services.length
        ? partial.services
        : defaultCmsContent.services,
    partners:
      Array.isArray(partial.partners) && partial.partners.length
        ? partial.partners
        : defaultCmsContent.partners,
    testimonials:
      Array.isArray(partial.testimonials) && partial.testimonials.length
        ? partial.testimonials
        : defaultCmsContent.testimonials,
    gallery:
      Array.isArray(partial.gallery) && partial.gallery.length
        ? partial.gallery
        : defaultCmsContent.gallery,
    courses:
      Array.isArray(partial.courses) && partial.courses.length
        ? partial.courses
        : defaultCmsContent.courses,
  };
}
