import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { ArrowIcon, CheckIcon } from '../components/Icons.jsx'
import { services } from '../data/site.js'

export default function ServicePage() {
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)

  if (!service) {
    return (
      <Layout>
        <section className="page-shell">
          <div className="empty-panel">
            <h1>We do not offer that service.</h1>
            <p>Cleaning, repairing, relocation and installation are what we run.</p>
            <Link to="/services" className="btn btn--solid">
              See our services
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="page-shell">
        <div className="service-head">
          <span className="service-pill">{service.name}</span>
          <h1 className="page-head__title">Our services</h1>
        </div>

        <p className="page-lead">{service.summary}</p>

        <div className="service-gallery">
          <figure className="service-gallery__main">
            <img src={service.image} alt={`${service.name} work in progress`} />
          </figure>
          <figure className="service-gallery__side">
            <img src={service.photo} alt="" />
          </figure>
        </div>

        <div className="service-detail">
          <div className="service-detail__panel">
            <h2>What&rsquo;s included</h2>
            <ul className="check-list">
              {service.points.map((point) => (
                <li key={point}>
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="service-detail__aside">
            <h2>Book a {service.name.toLowerCase()} visit</h2>
            <p>
              Message us the unit type, how many units, and the address. We confirm a schedule within the
              day and bring the tools in one trip.
            </p>
            <Link to="/contact" className="btn btn--solid">
              Message us
              <ArrowIcon />
            </Link>
            <div className="service-detail__links">
              {services
                .filter((item) => item.slug !== service.slug)
                .map((item) => (
                  <Link key={item.slug} to={`/services/${item.slug}`} className="text-link">
                    {item.name} <ArrowIcon />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
