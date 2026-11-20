import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { asset } from '../lib/asset.js'

export default function AboutPage() {
  return (
    <Layout>
      <section className="page-shell">
        <div className="about-card">
          <div className="about-card__body">
            <h1>About us</h1>
            <p>
              We are an air conditioning trading business committed to keeping you cool and comfortable,
              even during the hottest summer days. We aim to provide affordable, reliable, and quality air
              conditioning units from trusted brands to suit your needs and budget. With dependable
              installation services and customer satisfaction as our priority, we strive to be your trusted
              partner in creating a cooler, more comfortable space for your home or business.
            </p>
            <Link to="/contact" className="btn btn--solid">
              Talk to us
              <ArrowIcon />
            </Link>
          </div>
          <figure className="about-card__media">
            <img src={asset('/images/hero-split.jpg')} alt="Split air conditioner installed in a bright room" />
          </figure>
        </div>

        <dl className="about-facts">
          <div>
            <dt>What we sell</dt>
            <dd>Window, split and inverter units from ten brands, sized for the room.</dd>
          </div>
          <div>
            <dt>Who installs</dt>
            <dd>Our own crew. No subcontracted installs, no unit handed off after payment.</dd>
          </div>
          <div>
            <dt>What we promise</dt>
            <dd>A working unit, a clean site, and a number that answers after the sale.</dd>
          </div>
        </dl>
      </section>
    </Layout>
  )
}
