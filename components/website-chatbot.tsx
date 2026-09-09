'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Send, X, RotateCcw } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription } from '@/components/ui/popover';
import { answerQuestion, type ChatAnswer } from '@/lib/chatbot';
import type { CmsContent } from '@/lib/cms-content';

type Message = ChatAnswer & { role: 'assistant' | 'user' };
const welcome: Message = { role: 'assistant', text: 'Hi! Welcome to Kalpra Academy. Ask me about our courses, services or how to enroll.', links: [] };
const prompts = ['What courses do you offer?', 'Tell me about Python', 'How can I enroll?', 'Where are you located?'];

export function WebsiteChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const course = useRef<string | undefined>(undefined);
  const sending = useRef(false);
  const log = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, open]);
  useEffect(() => () => controller.current?.abort(), []);
  if (pathname?.startsWith('/admin')) return null;

  async function send(question: string) {
    const value = question.trim();
    if (!value || value.length > 500 || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError('');
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current?.abort(), 12000);
    try {
      const response = await fetch('/api/content', { signal: controller.current.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Content unavailable');
      const content: CmsContent = await response.json();
      const answer = answerQuestion(value, content, course.current);
      course.current = answer.courseSlug ?? course.current;
      setMessages(current => [...current.slice(-38), { role: 'user', text: value, links: [] }, { role: 'assistant', ...answer }]);
      setDraft('');
    } catch {
      setDraft(value);
      setError('I couldn’t load the website information. Please try again, or contact our team.');
    } finally {
      clearTimeout(timeout);
      sending.current = false;
      setBusy(false);
    }
  }

  return <div className="kalpra-chat-anchor">
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="kalpra-chat-launcher" aria-label={open ? 'Close Kalpra assistant' : 'Chat with Kalpra assistant'}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}<span>Ask Kalpra</span>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" sideOffset={12} className="kalpra-chat-panel">
        <div className="kalpra-chat-header">
          <div><PopoverTitle className="kalpra-chat-title">Kalpra assistant</PopoverTitle><PopoverDescription className="kalpra-chat-subtitle">Answers from our website</PopoverDescription></div>
          <button type="button" disabled={busy} aria-label="Start a new conversation" onClick={() => { setMessages([welcome]); course.current = undefined; setError(''); setDraft(''); }}><RotateCcw size={18} /></button>
          <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>
        <div ref={log} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" className="kalpra-chat-log">
          {messages.map((message, index) => <div key={index} className={`kalpra-chat-message ${message.role}`}>
            <span className="sr-only">{message.role === 'user' ? 'You' : 'Kalpra assistant'}: </span>
            <p>{message.text}</p>
            {message.links.length > 0 && <div className="kalpra-chat-links">{message.links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label} ↗</Link>)}</div>}
          </div>)}
          {busy && <output className="kalpra-chat-status">Checking website information…</output>}
        </div>
        <div className="kalpra-chat-prompts">{prompts.map(prompt => <button type="button" disabled={busy} key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div>
        {error && <p role="alert" className="kalpra-chat-error">{error} <Link href="/contact" onClick={() => setOpen(false)}>Contact us</Link></p>}
        <form className="kalpra-chat-form" onSubmit={event => { event.preventDefault(); void send(draft); }}>
          <label htmlFor="kalpra-chat-input" className="sr-only">Your question</label>
          <input id="kalpra-chat-input" value={draft} onChange={event => setDraft(event.target.value)} maxLength={500} placeholder="Ask about Kalpra Academy…" autoComplete="off" />
          <button type="submit" disabled={busy || !draft.trim()} aria-label="Send question"><Send size={20} /></button>
        </form>
        <p className="kalpra-chat-note">Website guide · Please don’t share passwords or payment details.</p>
      </PopoverContent>
    </Popover>
  </div>;
}
