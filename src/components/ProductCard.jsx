import { Link } from 'react-router-dom'
import { ArrowIcon } from './Icons.jsx'

const brandColors = {
  Midea: '#0b8fcc',
  LG: '#a50034',
  TCL: '#e01b22',
  Hisense: '#00914f',
  AUX: '#e8622a',
  Daiken: '#00549f',
  OX: '#0d4a8f',
  Carrier: '#123c8c',
  CHIQ: '#d81e2b',
  Panasonic: '#0a3b8c',
}

export function BrandMark({ name, size = 'md' }) {
  return (
    <span className={`brand-mark brand-mark--${size}`} style={{ '--brand': brandColors[name] || '#0d3b86' }}>
      <span className="brand-mark__glyph" aria-hidden="true">
        {name.slice(0, 1)}
      </span>
      <span className="brand-mark__name">{name}</span>
    </span>
  )
}

export function ProductCard({ product, compact = false }) {
  return (
    <article className={`product-card ${compact ? 'product-card--compact' : ''}`}>
      <div className="product-card__media">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__body">
        <p className="product-card__meta">
          {product.brand} <span aria-hidden="true">/</span> {product.type} <span aria-hidden="true">/</span>{' '}
          {product.capacity}
        </p>
        <h3 className="product-card__name">{product.name}</h3>
        {compact ? (
          <p className="product-card__blurb">{product.blurb.split('. ')[0]}.</p>
        ) : (
          <ul className="product-card__specs">
            {product.specs.slice(0, 6).map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        )}
      </div>
      <Link to="/contact" className="product-card__cta">
        Ask about this unit
        <ArrowIcon />
      </Link>
    </article>
  )
}
