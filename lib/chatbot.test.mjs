import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion } from './chatbot.ts';

const content = {
  hero: { title: 'Learn.', accent: 'Grow.', description: 'Practical skills.' },
  contact: { email: 'team@example.com', phones: ['123'], indiaAddress: 'Hyderabad', usaAddress: 'Houston' },
  partners: [], services: [],
  courses: [
    { slug: 'python', name: 'Python', description: 'Learn programming.', duration: '12 weeks', skills: ['Python'], audience: 'Beginners', careers: 'Development' },
    { slug: 'data', name: 'Data Science with Python', description: 'Learn data.', duration: '14 weeks', skills: ['Python'], audience: 'Graduates', careers: 'Data science' },
  ],
};
test('exact course and follow-up use published course information', () => {
  const first = answerQuestion('Tell me about Python', content);
  assert.equal(first.courseSlug, 'python');
  assert.match(first.text, /12 weeks/);
  assert.match(answerQuestion('What is its duration?', content, first.courseSlug).text, /12 weeks/);
});
test('specific longer course name beats embedded Python match', () => {
  assert.equal(answerQuestion('Data Science with Python', content).courseSlug, 'data');
});
test('unknown terms never invent fees or guarantees', () => {
  assert.match(answerQuestion('What are Python fees?', content).text, /don’t have verified/);
  assert.match(answerQuestion('Is placement guaranteed?', content).text, /don’t have verified/);
  assert.match(answerQuestion('Who won the football match?', content).text, /couldn’t find/);
});
test('CMS updates are reflected without stale embedded answers', () => {
  const updated = { ...content, courses: [{ ...content.courses[0], duration: '8 weeks' }] };
  assert.match(answerQuestion('Python duration', updated).text, /8 weeks/);
  assert.match(answerQuestion('Where are you located?', content).text, /Hyderabad/);
});
