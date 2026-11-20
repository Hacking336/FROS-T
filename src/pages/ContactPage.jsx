import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import { ArrowIcon, FacebookIcon, MailIcon, PhoneIcon } from '../components/Icons.jsx'
import { contact } from '../data/site.js'

const emptyForm = { name: '', email: '', address: '', message: '', company: '' }

// The form talks to the Java contact service. Set VITE_CONTACT_API_URL to its
// address (e.g. https://frost-contact-api.onrender.com/api/contact) at build time.
const ENDPOINT = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [problems, setProblems] = useState({})
  const [error, setError] = useState('')
  const [sentName, setSentName] = useState('')

  const update = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
    if (problems[field]) setProblems({ ...problems, [field]: undefined })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setError('')
    setProblems({})

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json().catch(() => ({}))

      if (response.ok && result.ok) {
        setSentName(form.name.trim().split(' ')[0])
        setForm(emptyForm)
        setStatus('sent')
        return
      }

      if (result.problems) setProblems(result.problems)
      setError(
        result.error ||
          'Your message did not go through. Please try again, or call or text us directly.',
      )
      setStatus('idle')
    } catch {
      setError('We could not reach the server. Please check your connection and try again.')
      setStatus('idle')
    }
  }

  return (
    <Layout>
      <section className="page-shell">
        <div className="contact-layout">
          <form className="contact-card" onSubmit={handleSubmit} noValidate>
            <h1>Message us</h1>
            <p className="contact-card__lead">
              Tell us the room size and the unit you are eyeing. We reply with availability, price and the
              earliest install date.
            </p>

            {status === 'sent' ? (
              <div className="contact-card__sent" role="status">
                <h2>Message sent{sentName ? `, ${sentName}` : ''}.</h2>
                <p>
                  It&rsquo;s in our inbox now. We answer within one working day, and sooner by phone at{' '}
                  <a href={contact.phoneHref}>{contact.phone}</a>.
                </p>
                <button
                  type="button"
                  className="btn btn--ghost btn--dark"
                  onClick={() => setStatus('idle')}
                >
                  Write another message
                </button>
              </div>
            ) : (
              <>
                {error ? (
                  <p className="form-alert" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    aria-invalid={problems.name ? 'true' : undefined}
                    required
                  />
                  {problems.name ? <span className="field__error">{problems.name}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update('email')}
                    aria-invalid={problems.email ? 'true' : undefined}
                    required
                  />
                  {problems.email ? <span className="field__error">{problems.email}</span> : null}
                </div>
                <div className="field">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={update('address')}
                  />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={form.message}
                    onChange={update('message')}
                    aria-invalid={problems.message ? 'true' : undefined}
                    required
                  />
                  {problems.message ? <span className="field__error">{problems.message}</span> : null}
                </div>

                <div className="field field--trap" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex="-1"
                    autoComplete="off"
                    value={form.company}
                    onChange={update('company')}
                  />
                </div>

                <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  <ArrowIcon />
                </button>
              </>
            )}
          </form>

          <aside className="contact-panel">
            <h2>Reach us directly</h2>
            <p>Faster on the phone or Messenger during working hours.</p>
            <ul className="contact-panel__list">
              <li>
                <a href={contact.phoneHref}>
                  <span className="contact-panel__icon">
                    <PhoneIcon />
                  </span>
                  <span>
                    <span className="contact-panel__label">Call or text</span>
                    {contact.phone}
                  </span>
                </a>
              </li>
              <li>
                <a href={contact.facebookHref} target="_blank" rel="noreferrer">
                  <span className="contact-panel__icon">
                    <FacebookIcon />
                  </span>
                  <span>
                    <span className="contact-panel__label">Facebook</span>
                    {contact.facebook}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`}>
                  <span className="contact-panel__icon">
                    <MailIcon />
                  </span>
                  <span>
                    <span className="contact-panel__label">Email</span>
                    {contact.email}
                  </span>
                </a>
              </li>
            </ul>
            <p className="contact-panel__hours">
              Monday to Saturday, 8:00 am to 6:00 pm. Emergency repairs are scheduled the next working day.
            </p>
          </aside>
        </div>
      </section>
    </Layout>
  )
}
