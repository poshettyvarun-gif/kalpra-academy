/* oxlint-disable next/no-img-element */
'use client';

import {
  useEffect,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import {
  ArrowLeft,
  Check,
  ImageUp,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CmsContent } from '@/lib/cms-content';

type View = 'loading' | 'login' | 'editor';

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function ImageField({
  value,
  onChange,
  label = 'Image',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setUploading(true);
    setError('');
    const form = new FormData();
    form.set('file', file);
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: form,
    });
    const result = (await response.json()) as { url?: string; error?: string };
    setUploading(false);
    if (!response.ok || !result.url) {
      setError(result.error || 'Upload failed.');
      return;
    }
    onChange(result.url);
  }

  return (
    <div className="cms-image-field">
      <div className="cms-image-preview">
        <img src={value} alt="Current website media" />
      </div>
      <div>
        <strong>{label}</strong>
        <p>JPG, PNG, WebP or AVIF · maximum 6 MB</p>
        <label className="cms-upload-button">
          {uploading ? (
            <LoaderCircle className="cms-spin" size={17} />
          ) : (
            <ImageUp size={17} />
          )}
          {uploading ? 'Uploading…' : 'Replace image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.target.value = '';
            }}
          />
        </label>
        {error && <span className="cms-error">{error}</span>}
      </div>
    </div>
  );
}

export function AdminCms() {
  const [view, setView] = useState<View>('loading');
  const [content, setContent] = useState<CmsContent | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadContent() {
    const response = await fetch('/api/admin/content', { cache: 'no-store' });
    if (response.status === 401) {
      setView('login');
      return;
    }
    if (!response.ok) {
      setMessage('The content manager could not be loaded.');
      setView('login');
      return;
    }
    setContent((await response.json()) as CmsContent);
    setView('editor');
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/content', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          setView('login');
          return;
        }
        if (!response.ok) {
          setMessage('The content manager could not be loaded.');
          setView('login');
          return;
        }
        setContent((await response.json()) as CmsContent);
        setView('editor');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setMessage('The content manager could not be loaded.');
        setView('login');
      });
    return () => controller.abort();
  }, []);

  async function login(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: form.get('username'),
        password: form.get('password'),
      }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(result.error || 'Unable to sign in.');
      return;
    }
    await loadContent();
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMessage('');
    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(content),
    });
    const result = (await response.json()) as {
      error?: string;
      content?: CmsContent;
    };
    setSaving(false);
    if (!response.ok) {
      if (response.status === 401) setView('login');
      setMessage(result.error || 'Changes could not be published.');
      return;
    }
    if (result.content) setContent(result.content);
    setMessage('Published successfully. The website is now updated.');
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setContent(null);
    setView('login');
    setMessage('');
  }

  function update(mutator: (draft: CmsContent) => void) {
    setContent((current) => {
      if (!current) return current;
      const draft = structuredClone(current);
      mutator(draft);
      return draft;
    });
    setMessage('You have unpublished changes.');
  }

  if (view === 'loading') {
    return (
      <main className="cms-loading">
        <LoaderCircle className="cms-spin" /> Loading content manager…
      </main>
    );
  }

  if (view === 'login') {
    return (
      <main className="cms-login-page">
        <section className="cms-login-card">
          <Link href="/" className="cms-back-link">
            <ArrowLeft size={16} /> Back to website
          </Link>
          <img
            src="/assets/kalpra-logo.png"
            alt="Kalpra Academy"
            width="588"
            height="192"
          />
          <span className="eyebrow">SECURE CONTENT MANAGER</span>
          <h1>Welcome back.</h1>
          <p>Sign in to update the Kalpra Academy website.</p>
          <form onSubmit={login}>
            <Field label="Username">
              <input name="username" autoComplete="username" required />
            </Field>
            <Field label="Password">
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
            {message && <div className="cms-alert error">{message}</div>}
            <button className="button" type="submit">
              Sign in
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (!content) return null;

  return (
    <main className="cms-shell">
      <header className="cms-header">
        <div>
          <Link href="/" className="cms-back-link">
            <ArrowLeft size={16} /> View website
          </Link>
          <h1>Kalpra Content Manager</h1>
          <p>Edit content, replace images and publish when you are ready.</p>
        </div>
        <div className="cms-header-actions">
          <button className="cms-logout" onClick={logout} type="button">
            <LogOut size={17} /> Sign out
          </button>
          <button className="button" onClick={save} disabled={saving}>
            {saving ? (
              <LoaderCircle className="cms-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Publishing…' : 'Publish changes'}
          </button>
        </div>
      </header>

      {message && (
        <div
          className={`cms-alert ${message.startsWith('Published') ? 'success' : ''}`}
        >
          {message.startsWith('Published') && <Check size={17} />} {message}
        </div>
      )}

      <Tabs defaultValue="homepage" className="cms-tabs">
        <TabsList className="cms-tab-list">
          {[
            ['homepage', 'Homepage'],
            ['services', 'Services'],
            ['courses', 'Courses'],
            ['stats', 'Statistics'],
            ['partners', 'Partners'],
            ['testimonials', 'Testimonials'],
            ['gallery', 'Gallery'],
            ['contact', 'Contact'],
          ].map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="homepage" className="cms-panel">
          <PanelTitle
            title="Homepage hero"
            text="Update the first message and main photograph visitors see."
          />
          <div className="cms-grid two">
            <Field label="Small heading">
              <input
                value={content.hero.badge}
                onChange={(event) =>
                  update((draft) => (draft.hero.badge = event.target.value))
                }
              />
            </Field>
            <Field label="Main heading">
              <input
                value={content.hero.title}
                onChange={(event) =>
                  update((draft) => (draft.hero.title = event.target.value))
                }
              />
            </Field>
            <Field label="Blue highlighted heading">
              <input
                value={content.hero.accent}
                onChange={(event) =>
                  update((draft) => (draft.hero.accent = event.target.value))
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={4}
                value={content.hero.description}
                onChange={(event) =>
                  update(
                    (draft) => (draft.hero.description = event.target.value),
                  )
                }
              />
            </Field>
          </div>
          <ImageField
            label="Hero photograph"
            value={content.hero.image}
            onChange={(url) => update((draft) => (draft.hero.image = url))}
          />
        </TabsContent>

        <TabsContent value="services" className="cms-panel">
          <PanelTitle
            title="Services"
            text="Edit each service card and its photograph."
          />
          <div className="cms-stack">
            {content.services.map((service, index) => (
              <article className="cms-record" key={`${service.title}-${index}`}>
                <div className="cms-record-head">
                  <h3>Service {index + 1}</h3>
                </div>
                <div className="cms-grid two">
                  <Field label="Title">
                    <input
                      value={service.title}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.services[index].title = event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={service.text}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.services[index].text = event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Benefits" hint="Separate benefits with commas.">
                    <input
                      value={service.benefits.join(', ')}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.services[index].benefits = event.target.value
                              .split(',')
                              .map((item) => item.trim())
                              .filter(Boolean)),
                        )
                      }
                    />
                  </Field>
                </div>
                <ImageField
                  value={service.image}
                  onChange={(url) =>
                    update((draft) => (draft.services[index].image = url))
                  }
                />
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="cms-panel">
          <PanelTitle
            title="Courses"
            text="Update program details, images and curriculum modules."
          />
          <div className="cms-stack">
            {content.courses.map((course, index) => (
              <details className="cms-record cms-course" key={course.slug}>
                <summary>{course.name}</summary>
                <div className="cms-grid two">
                  <Field label="Course name">
                    <input
                      value={course.name}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.courses[index].name = event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Category">
                    <input
                      value={course.category}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.courses[index].category =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Duration">
                    <input
                      value={course.duration}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.courses[index].duration =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Mentor">
                    <input
                      value={course.mentor}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.courses[index].mentor = event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows={4}
                      value={course.description}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.courses[index].description =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Skills" hint="Separate skills with commas.">
                    <textarea
                      rows={4}
                      value={course.skills.join(', ')}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.courses[index].skills = event.target.value
                              .split(',')
                              .map((item) => item.trim())
                              .filter(Boolean)),
                        )
                      }
                    />
                  </Field>
                </div>
                <ImageField
                  value={
                    course.image.startsWith('/')
                      ? course.image
                      : `/assets/${course.image}`
                  }
                  onChange={(url) =>
                    update((draft) => (draft.courses[index].image = url))
                  }
                />
                <h4>Curriculum</h4>
                <div className="cms-stack compact">
                  {course.modules.map((module, moduleIndex) => (
                    <div
                      className="cms-grid two"
                      key={`${module.title}-${moduleIndex}`}
                    >
                      <Field label={`Module ${moduleIndex + 1} title`}>
                        <input
                          value={module.title}
                          onChange={(event) =>
                            update(
                              (draft) =>
                                (draft.courses[index].modules[
                                  moduleIndex
                                ].title = event.target.value),
                            )
                          }
                        />
                      </Field>
                      <Field label="Description">
                        <textarea
                          rows={3}
                          value={module.description}
                          onChange={(event) =>
                            update(
                              (draft) =>
                                (draft.courses[index].modules[
                                  moduleIndex
                                ].description = event.target.value),
                            )
                          }
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="cms-panel">
          <PanelTitle
            title="Progress statistics"
            text="These figures animate when visitors reach the section."
          />
          <div className="cms-grid four">
            {content.outcomes.map((outcome, index) => (
              <article className="cms-record" key={`${outcome.label}-${index}`}>
                <Field label="Number">
                  <input
                    type="number"
                    min="0"
                    value={outcome.target}
                    onChange={(event) =>
                      update(
                        (draft) =>
                          (draft.outcomes[index].target = Number(
                            event.target.value,
                          )),
                      )
                    }
                  />
                </Field>
                <Field label="Suffix">
                  <input
                    value={outcome.suffix}
                    onChange={(event) =>
                      update(
                        (draft) =>
                          (draft.outcomes[index].suffix = event.target.value),
                      )
                    }
                  />
                </Field>
                <Field label="Label">
                  <input
                    value={outcome.label}
                    onChange={(event) =>
                      update(
                        (draft) =>
                          (draft.outcomes[index].label = event.target.value),
                      )
                    }
                  />
                </Field>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="partners" className="cms-panel">
          <PanelTitle
            title="Collaboration partners"
            text="Manage the logos and links in the scrolling partner row."
          />
          <div className="cms-stack">
            {content.partners.map((partner, index) => (
              <article className="cms-record" key={`${partner.name}-${index}`}>
                <div className="cms-record-head">
                  <h3>Partner {index + 1}</h3>
                  <button
                    className="cms-icon-button danger"
                    aria-label={`Remove ${partner.name}`}
                    onClick={() =>
                      update((draft) => draft.partners.splice(index, 1))
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="cms-grid three">
                  <Field label="Name">
                    <input
                      value={partner.name}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.partners[index].name = event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Partner type">
                    <input
                      value={partner.type}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.partners[index].type = event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Website link">
                    <input
                      type="url"
                      value={partner.url}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.partners[index].url = event.target.value),
                        )
                      }
                    />
                  </Field>
                </div>
                <ImageField
                  label="Partner logo"
                  value={partner.image}
                  onChange={(url) =>
                    update((draft) => (draft.partners[index].image = url))
                  }
                />
              </article>
            ))}
          </div>
          <button
            className="cms-add-button"
            onClick={() =>
              update((draft) =>
                draft.partners.push({
                  name: 'New partner',
                  type: 'Academic partner',
                  url: 'https://',
                  image: '/assets/kalpra-logo.png',
                }),
              )
            }
          >
            <Plus size={17} /> Add partner
          </button>
        </TabsContent>

        <TabsContent value="testimonials" className="cms-panel">
          <PanelTitle
            title="Learner testimonials"
            text="Update the testimonial section, learner details and photographs."
          />
          <div className="cms-grid two">
            <Field label="Small heading">
              <input
                value={content.testimonialsSection.label}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.testimonialsSection.label = event.target.value),
                  )
                }
              />
            </Field>
            <Field label="Main heading">
              <input
                value={content.testimonialsSection.title}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.testimonialsSection.title = event.target.value),
                  )
                }
              />
            </Field>
            <Field label="Section description">
              <textarea
                rows={3}
                value={content.testimonialsSection.description}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.testimonialsSection.description =
                        event.target.value),
                  )
                }
              />
            </Field>
          </div>
          <div className="cms-stack">
            {content.testimonials.map((testimonial, index) => (
              <article
                className="cms-record"
                key={`${testimonial.name}-${index}`}
              >
                <div className="cms-record-head">
                  <h3>Testimonial {index + 1}</h3>
                  {content.testimonials.length > 1 && (
                    <button
                      className="cms-icon-button danger"
                      aria-label={`Remove ${testimonial.name}`}
                      onClick={() =>
                        update((draft) => draft.testimonials.splice(index, 1))
                      }
                      type="button"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
                <div className="cms-grid two">
                  <Field label="Learner name">
                    <input
                      value={testimonial.name}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.testimonials[index].name =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Current role or company">
                    <input
                      value={testimonial.role}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.testimonials[index].role =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Course badge">
                    <input
                      value={testimonial.course}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.testimonials[index].course =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field
                    label="Photo position"
                    hint="Examples: center top, center 25%, or 50% 20%."
                  >
                    <input
                      value={testimonial.imagePosition}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.testimonials[index].imagePosition =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                  <Field label="Testimonial quote">
                    <textarea
                      rows={5}
                      value={testimonial.quote}
                      onChange={(event) =>
                        update(
                          (draft) =>
                            (draft.testimonials[index].quote =
                              event.target.value),
                        )
                      }
                    />
                  </Field>
                </div>
                <ImageField
                  label={`${testimonial.name || 'Learner'} photograph`}
                  value={testimonial.image}
                  onChange={(url) =>
                    update(
                      (draft) => (draft.testimonials[index].image = url),
                    )
                  }
                />
              </article>
            ))}
          </div>
          <button
            className="cms-add-button"
            onClick={() =>
              update((draft) =>
                draft.testimonials.push({
                  name: 'New learner',
                  role: 'Job role',
                  course: 'Course Graduate',
                  image: '/assets/hero.jpg',
                  imagePosition: 'center top',
                  quote: 'Add the learner testimonial here.',
                }),
              )
            }
            type="button"
          >
            <Plus size={17} /> Add testimonial
          </button>
        </TabsContent>

        <TabsContent value="gallery" className="cms-panel">
          <PanelTitle
            title="Photo gallery"
            text="Replace or remove photographs shown in Life at Kalpra Academy."
          />
          <div className="cms-gallery-editor">
            {content.gallery.map((image, index) => (
              <article className="cms-record" key={`${image}-${index}`}>
                <ImageField
                  label={`Gallery image ${index + 1}`}
                  value={image}
                  onChange={(url) =>
                    update((draft) => (draft.gallery[index] = url))
                  }
                />
                {content.gallery.length > 1 && (
                  <button
                    className="cms-remove-button"
                    onClick={() =>
                      update((draft) => draft.gallery.splice(index, 1))
                    }
                  >
                    <Trash2 size={16} /> Remove image
                  </button>
                )}
              </article>
            ))}
          </div>
          <button
            className="cms-add-button"
            onClick={() =>
              update((draft) => draft.gallery.push('/assets/hero.jpg'))
            }
          >
            <Plus size={17} /> Add gallery image
          </button>
        </TabsContent>

        <TabsContent value="contact" className="cms-panel">
          <PanelTitle
            title="Contact information"
            text="Update the details shown on the contact section."
          />
          <div className="cms-grid two">
            <Field label="Email address">
              <input
                type="email"
                value={content.contact.email}
                onChange={(event) =>
                  update((draft) => (draft.contact.email = event.target.value))
                }
              />
            </Field>
            <Field label="Phone numbers" hint="One phone number per line.">
              <textarea
                rows={4}
                value={content.contact.phones.join('\n')}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.contact.phones = event.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean)),
                  )
                }
              />
            </Field>
            <Field label="India address">
              <textarea
                rows={4}
                value={content.contact.indiaAddress}
                onChange={(event) =>
                  update(
                    (draft) =>
                      (draft.contact.indiaAddress = event.target.value),
                  )
                }
              />
            </Field>
            <Field label="USA address">
              <textarea
                rows={4}
                value={content.contact.usaAddress}
                onChange={(event) =>
                  update(
                    (draft) => (draft.contact.usaAddress = event.target.value),
                  )
                }
              />
            </Field>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function PanelTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="cms-panel-title">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
