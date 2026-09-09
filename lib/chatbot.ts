import type { CmsContent } from './cms-content';

export type ChatAnswer = { text: string; links: { label: string; href: string }[]; courseSlug?: string };
const contactLink = { label: 'Talk to our team', href: '/contact' };
const catalogLink = { label: 'Explore all courses', href: '/courses' };

/** Extractive answers only: no invented fees, schedules, or admission promises. */
export function answerQuestion(question: string, content: CmsContent, previousCourse?: string): ChatAnswer {
  const q = question.toLowerCase().replace(/[^a-z0-9\s&]/g, ' ').replace(/\s+/g, ' ').trim();
  const reply = (text: string, links = [contactLink]): ChatAnswer => ({ text, links });
  if (/^(hi|hello|hey|good morning|good evening)[!\s]*$/.test(q)) return reply('Hello! I can help you explore Kalpra Academy courses, services, enrollment and contact details. What would you like to know?', [catalogLink, contactLink]);
  if (/^(thanks|thank you|thankyou)/.test(q)) return reply('You’re welcome! Feel free to ask another question about Kalpra Academy.', [catalogLink]);
  if (/\b(fee|fees|price|pricing|cost|payment|refund|discount|scholarship|batch|schedule|timing|weekend|start date|online|offline|certificate|certification|guarantee|guaranteed|visa|accreditation)\b/.test(q)) return reply('I don’t have verified details about that in the website information available to me. Please contact the academy to confirm fees, upcoming batches, learning format, certification or other admission terms.');
  if (/\b(contact|phone|call|email|address|location|located|where|whatsapp|human|expert)\b/.test(q)) return reply(`You can reach Kalpra Academy at ${content.contact.email}.\n\nPhone: ${content.contact.phones.join(' / ')}\n\nIndia: ${content.contact.indiaAddress}\n\nUSA: ${content.contact.usaAddress}`);
  if (/\b(enroll|enrol|join|admission|register|registration|apply)\b/.test(q)) return reply('Choose a program from our course catalog, then use Enroll Now on the website. If you need help choosing a course or confirming admission details, contact our team.', [catalogLink, contactLink]);
  if (/\b(partner|partners|collaboration|collaborations)\b/.test(q)) return reply(`Our listed collaborations include:\n\n${content.partners.map(p => `${p.name} — ${p.type}`).join('\n')}\n\nContact our team to discuss a collaboration.`, [{ label: 'Our services', href: '/#services' }, contactLink]);
  if (/\b(service|services|workshop|workshops|hackathon|hackathons|industrial)\b/.test(q)) return reply(content.services.map(s => `${s.title}\n${s.text}\n${s.benefits.join(' · ')}`).join('\n\n'), [{ label: 'Explore services', href: '/#services' }, contactLink]);
  if (/\b(about|academy|mission)\b/.test(q) && !/\b(course|courses|python|data|ai)\b/.test(q)) return reply(`${content.hero.title} ${content.hero.accent}\n\n${content.hero.description}`, [{ label: 'About Kalpra', href: '/about' }, contactLink]);

  const ignored = new Set('what which tell me about the a an is are do you i want learn course courses program programs with and for in of can how long duration skills syllabus curriculum mentor beginner beginners'.split(' '));
  const tokens = q.split(' ').filter(t => !ignored.has(t) && t.length > 1);
  const ranked = content.courses.map(course => {
    const name = course.name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const words = new Set(name.split(/\s+/));
    const skillWords = new Set(course.skills.join(' ').toLowerCase().split(/[^a-z0-9]+/));
    const exactName = course.name.toLowerCase().replace(/[^a-z0-9\s&]/g, ' ').replace(/\s+/g, ' ').trim();
    const score = tokens.reduce((sum, t) => sum + (words.has(t) ? 4 : skillWords.has(t) ? 1 : 0), 0) + (q.includes(exactName) ? exactName.length + 10 : 0);
    return { course, score };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
  const contextual = /\b(it|this|that|duration|mentor|syllabus|skills)\b/.test(q) ? content.courses.find(c => c.slug === previousCourse) : undefined;
  const best = ranked[0];
  const course = best && (ranked.length === 1 || best.score > ranked[1].score) ? best.course : !best ? contextual : undefined;
  if (course) return {
    text: `${course.name}\n${course.description}\n\nDuration: ${course.duration}\nSkills: ${course.skills.join(', ')}\nDesigned for: ${course.audience}\nCareer areas: ${course.careers}\n\nSee the course page for the full curriculum.`,
    links: [{ label: `View ${course.name}`, href: `/${encodeURIComponent(course.slug)}` }, contactLink],
    courseSlug: course.slug,
  };
  if (ranked.length) return reply('These programs match your question. Choose a course below, or type its full name to see more details.', ranked.slice(0, 5).map(({ course }) => ({ label: `${course.name} · ${course.duration}`, href: `/${encodeURIComponent(course.slug)}` })));
  if (/\b(course|courses|program|programs|study|learn|learning|offer)\b/.test(q)) return reply(`Our current programs include:\n\n${content.courses.map(c => `• ${c.name} — ${c.duration}`).join('\n')}\n\nAsk about a specific course to see its skills and who it is designed for.`, [catalogLink, contactLink]);
  return reply('I couldn’t find a reliable answer to that question in the website content. Try asking about a course by name, our services, enrollment or contact details. Our team can help with anything else.', [catalogLink, contactLink]);
}
