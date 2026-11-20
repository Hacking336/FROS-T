import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { ArrowIcon, SnowIcon } from '../components/Icons.jsx'
import { services } from '../data/site.js'

export default function ServicesPage() {
  return (
    <Layout>
      <section className="page-shell">
        <div className="page-head">
          <span className="page-head__mark">
            <SnowIcon />
            After-sales
          </span>
          <h1 className="page-head__title">Our services</h1>
        </div>

        <p className="page-lead">
          Four things we do on units we sold and units we did not. Prices are quoted after we look at the
          unit, not before.
        </p>

        <div className="service-list">
          {services.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="service-card">
              <div className="service-card__media">
                <img src={service.image} alt="" loading="lazy" />
              </div>
              <div className="service-card__body">
                <p className="service-card__kicker">{service.kicker}</p>
                <h2>{service.name}</h2>
                <p>{service.summary.split('. ')[0]}.</p>
                <ul>
                  {service.points.slice(0, 2).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <span className="service-card__more">
                  What&rsquo;s included
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  )
}
