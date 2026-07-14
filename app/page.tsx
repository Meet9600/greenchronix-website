import { OrbitSite } from '@/components/orbit/OrbitSite'
import {
  HERO,
  CORE,
  SERVICES,
  PIPELINE,
  PROJECTS,
  ARCHITECTURE,
  PARTNERSHIP,
  CONTACT,
} from '@/components/orbit/copy'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'GreenChronix',
  description:
    'A lean engineering studio shipping web platforms, AI agents, blockchain systems and cloud infrastructure.',
  url: 'https://greenchronix.com',
  email: CONTACT.email,
  telephone: '+917623079600',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gandhinagar',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  areaServed: 'Worldwide',
  knowsAbout: SERVICES.items.map((s) => s.name),
}

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Semantic, crawlable content mirror — visually replaced by the 3D journey */}
      <div className="sr-only">
        <h1>{HERO.title}</h1>
        <p>{HERO.sub}</p>

        <section aria-label="How we operate">
          <h2>{CORE.title}</h2>
          <p>{CORE.body}</p>
        </section>

        <section aria-label="Services">
          <h2>{SERVICES.title}</h2>
          <ul>
            {SERVICES.items.map((s) => (
              <li key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Process">
          <h2>{PIPELINE.title}</h2>
          <ol>
            {PIPELINE.steps.map((s) => (
              <li key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Projects">
          <h2>{PROJECTS.title}</h2>
          <ul>
            {PROJECTS.items.map((p) => (
              <li key={p.name}>
                <h3>{p.name}</h3>
                <p>
                  {p.outcome} ({p.stack})
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="About">
          <h2>{ARCHITECTURE.title}</h2>
          <p>{ARCHITECTURE.body}</p>
        </section>

        <section aria-label="Partnership">
          <h2>{PARTNERSHIP.title}</h2>
          <p>{PARTNERSHIP.body}</p>
        </section>

        <section aria-label="Contact">
          <h2>{CONTACT.title}</h2>
          <p>{CONTACT.body}</p>
          <address>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.whatsapp}>{CONTACT.phoneDisplay}</a>
            <span>{CONTACT.location}</span>
          </address>
        </section>
      </div>

      <OrbitSite />
    </main>
  )
}
