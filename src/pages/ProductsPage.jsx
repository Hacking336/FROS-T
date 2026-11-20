import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { ProductCard } from '../components/ProductCard.jsx'
import { ArrowIcon, SnowIcon } from '../components/Icons.jsx'
import { brands, products } from '../data/site.js'

const PER_PAGE = 6

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const query = (params.get('q') || '').toLowerCase()
  const [brand, setBrand] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [query, brand])

  // A search comes from the site-wide search box, so it should look across every
  // brand instead of silently narrowing to a filter picked earlier on this page.
  useEffect(() => {
    if (query) setBrand('all')
  }, [query])

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesBrand = brand === 'all' || product.brand === brand
        const haystack = `${product.name} ${product.brand} ${product.type} ${product.capacity}`.toLowerCase()
        return matchesBrand && (!query || haystack.includes(query))
      }),
    [brand, query],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <Layout>
      <section className="page-shell">
        <div className="page-head">
          <span className="page-head__mark">
            <SnowIcon />
            Catalogue
          </span>
          <h1 className="page-head__title">Our products</h1>
        </div>

        <div className="catalogue-bar">
          <div className="filter-row" role="group" aria-label="Filter by brand">
            <button
              type="button"
              className={`filter-chip ${brand === 'all' ? 'filter-chip--active' : ''}`}
              onClick={() => setBrand('all')}
            >
              All brands
            </button>
            {brands.map((name) => (
              <button
                key={name}
                type="button"
                className={`filter-chip ${brand === name ? 'filter-chip--active' : ''}`}
                onClick={() => setBrand(name)}
              >
                {name}
              </button>
            ))}
          </div>
          {query ? (
            <p className="catalogue-bar__note">
              {filtered.length} result{filtered.length === 1 ? '' : 's'} for &ldquo;{params.get('q')}&rdquo;
              <button
                type="button"
                className="catalogue-bar__clear"
                onClick={() => setParams({}, { replace: true })}
              >
                Clear
              </button>
            </p>
          ) : null}
        </div>

        {visible.length ? (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-panel">
            <h2>No units match that search.</h2>
            <p>Try a brand name like Midea or LG, or a unit type like window or split.</p>
            <button
              type="button"
              className="btn btn--solid"
              onClick={() => {
                setBrand('all')
                setParams({}, { replace: true })
              }}
            >
              Show all units
            </button>
          </div>
        )}

        {pageCount > 1 ? (
          <nav className="pagination" aria-label="Product pages">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                className={`pagination__page ${number === page ? 'pagination__page--active' : ''}`}
                aria-current={number === page ? 'page' : undefined}
                onClick={() => {
                  setPage(number)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                {number}
              </button>
            ))}
          </nav>
        ) : null}

        <p className="page-foot">
          Looking for a capacity that is not listed?
          <Link to="/contact" className="text-link">
            Ask us what we can order <ArrowIcon />
          </Link>
        </p>
      </section>
    </Layout>
  )
}
