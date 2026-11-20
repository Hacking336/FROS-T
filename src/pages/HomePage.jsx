import { Link } from 'react-router-dom'
import Layout, { FeatureBar } from '../components/Layout.jsx'
import { ProductCard, BrandMark } from '../components/ProductCard.jsx'
import { ArrowIcon, SnowIcon } from '../components/Icons.jsx'
import { brands, products, services } from '../data/site.js'

const featured = ['midea-airstill-split', 'lg-dual-inverter-split', 'carrier-optima-inverter']

export default function HomePage() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <SnowIcon /> Airconditioning trading &amp; service
          </p>
          <h1 className="hero__title">
            Make every
            <br />
            space feel
            <br />
            <span className="hero__title-accent">better.</span>
          </h1>
          <p className="hero__sub">Making every place cooler, fresh, and more comfortable.</p>
          <div className="hero__actions">
            <Link to="/contact" className="btn btn--light">
              Inquire now
              <ArrowIcon />
            </Link>
            <Link to="/products" className="btn btn--ghost">
              Browse units
            </Link>
          </div>
          <dl className="hero__facts">
            <div>
              <dt>10 brands</dt>
              <dd>Midea to Panasonic, all serviced in-house.</dd>
            </div>
            <div>
              <dt>Same-week install</dt>
              <dd>Surveyed, sized and mounted by our own crew.</dd>
            </div>
          </dl>
        </div>

        <div className="hero__art">
          <div className="hero__frame">
            <img src="/images/hero-split.jpg" alt="Wall-mounted split air conditioner cooling a room" />
            <div className="hero__air" aria-hidden="true" />
          </div>
          <div className="hero__palm">
            <img src="/images/palm.jpg" alt="" aria-hidden="true" />
          </div>
          <div className="hero__badge">
            <span className="hero__badge-num">18&ndash;24&deg;C</span>
            <span className="hero__badge-label">Where we set every room</span>
          </div>
        </div>
      </section>

      <FeatureBar />

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">Brands we carry</h2>
            <p className="section__lead">
              We stock the units we can service. Pick a brand to see the window and split models on hand.
            </p>
          </div>
          <Link to="/products" className="text-link">
            All products <ArrowIcon />
          </Link>
        </div>
        <div className="brand-grid">
          {brands.map((brand) => (
            <Link key={brand} to={`/products/${brand.toLowerCase()}`} className="brand-tile">
              <BrandMark name={brand} />
              <span className="brand-tile__count">
                {products.filter((product) => product.brand === brand).length} units
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">Popular this month</h2>
            <p className="section__lead">
              What our customers in condos, apartments and home offices kept asking for.
            </p>
          </div>
        </div>
        <div className="product-grid product-grid--three">
          {products
            .filter((product) => featured.includes(product.id))
            .map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">What we do after the sale</h2>
            <p className="section__lead">
              Cleaning, repair, relocation and installation, handled by the same crew that sold you the unit.
            </p>
          </div>
          <Link to="/services" className="text-link">
            All services <ArrowIcon />
          </Link>
        </div>
        <div className="service-strip">
          {services.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="service-strip__item">
              <img src={service.image} alt="" loading="lazy" />
              <span className="service-strip__label">
                {service.name}
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <div className="cta-band__copy">
            <h2>Tell us the room. We&rsquo;ll size the unit.</h2>
            <p>
              Send the floor area, the number of windows and how many hours a day the unit runs. We&rsquo;ll
              come back with one honest recommendation, not a catalogue.
            </p>
          </div>
          <Link to="/contact" className="btn btn--solid">
            Message us
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
