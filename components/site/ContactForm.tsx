'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agree) {
      setError('Please agree to the Terms and Conditions before sending.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      // No backend yet — fall back to opening the user's email client.
      const subject = encodeURIComponent(`New enquiry from ${data.name || 'website'}`);
      const body = encodeURIComponent(
        [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Portfolio: ${data.portfolio || '—'}`,
          `Resume: ${data.resume || '—'}`,
          `LinkedIn: ${data.linkedin || '—'}`,
          '',
          `Message:`,
          String(data.message ?? ''),
        ].join('\n'),
      );
      window.location.href = `mailto:hello@diux.design?subject=${subject}&body=${body}`;
      setSent(true);
    } catch {
      setError('Something went wrong. Please email hello@diux.design directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="contact-form contact-form-sent" role="status">
        <h2 className="contact-form-sent-title">Thanks — message away.</h2>
        <p>
          We&rsquo;ve opened your email client with the details prefilled. If nothing happened, write
          to us at <a href="mailto:hello@diux.design">hello@diux.design</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-field">
        <label htmlFor="cf-name">
          Name <span className="contact-required">*</span>
        </label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" />
      </div>

      <div className="contact-field">
        <label htmlFor="cf-email">
          Email <span className="contact-required">*</span>
        </label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="contact-field">
        <label htmlFor="cf-message">
          Message <span className="contact-required">*</span>
        </label>
        <textarea id="cf-message" name="message" rows={5} required placeholder="Tell us more!" />
      </div>

      <div className="contact-field">
        <label htmlFor="cf-portfolio">Portfolio</label>
        <input
          id="cf-portfolio"
          name="portfolio"
          type="url"
          placeholder="Give us a link to your portfolio"
        />
      </div>

      <div className="contact-field">
        <label htmlFor="cf-resume">Resume</label>
        <input
          id="cf-resume"
          name="resume"
          type="url"
          placeholder="Give us a link to your resume"
        />
      </div>

      <div className="contact-field">
        <label htmlFor="cf-linkedin">LinkedIn</label>
        <input
          id="cf-linkedin"
          name="linkedin"
          type="url"
          placeholder="Give us a link to your LinkedIn"
        />
      </div>

      <p className="contact-required-note">
        <span className="contact-required">*</span> required
      </p>

      <div className="contact-form-foot">
        <label className="contact-agree">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
          />
          <span>
            I agree to the{' '}
            <a href="/terms" className="contact-agree-link">
              Terms and Conditions
            </a>
          </span>
        </label>
        <button
          type="submit"
          className="btn btn-primary contact-submit"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </div>

      {error && (
        <p className="contact-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
