import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { BrandMark, ProductCard } from '../components/ProductCard.jsx'
import { ArrowIcon } from '../components/Icons.jsx'
import { brands, products } from '../data/site.js'

export default function BrandPage() {
  const { brand } = useParams()
  const match = brands.find((name) => name.toLowerCase() === brand)
  const list = products.filter((product) => product.brand === match)

  if (!match) {
    return (
      <Layout>
        <section className="page-shell">
          <div className="empty-panel">
            <h1>That brand is not on our shelf.</h1>
            <p>We carry Midea, LG, TCL, Hisense, AUX, Daiken, OX, Carrier, CHIQ and Panasonic.</p>
            <Link to="/products" className="btn btn--solid">
              See all products
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="page-shell">
        <div className="page-head page-head--brand">
          <BrandMark name={match} size="lg" />
          <h1 className="page-head__title">Our products</h1>
        </div>

        <p className="brand-intro">
          {match} units we keep in stock. Every one is installed and serviced by our own technicians, with
          parts we can source locally.
        </p>

        <div className="product-grid product-grid--two">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="brand-footer">
          <Link to="/products" className="text-link">
            <ArrowIcon className="icon-flip" /> Back to all products
          </Link>
          <Link to="/contact" className="btn btn--solid">
            Ask about {match}
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
