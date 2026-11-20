import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { brands, services, contact, features } from '../data/site.js'
import {
  ArrowIcon,
  ChevronIcon,
  CloseIcon,
  FacebookIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  SnowIcon,
  featureIcons,
} from './Icons.jsx'

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Fros't Airconditioning Trading home">
      <span className="logo__word">
        FROS<span className="logo__apostrophe">&rsquo;</span>T
      </span>
      <span className="logo__sub">Airconditioning Trading</span>
    </Link>
  )
}

function SearchBox({ onSubmit, autoFocus = false }) {
  const [value, setValue] = useState('')
  return (
    <form
      className="search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(value.trim())
      }}
    >
      <SearchIcon className="search__icon" />
      <input
        className="search__input"
        type="search"
        name="q"
        placeholder="Search"
        aria-label="Search products"
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => setValue(event.target.value)}
      />
    </form>
  )
}

function DesktopMenu({ label, to, items, isOpen, onToggle, onClose }) {
  return (
    <div className={`menu ${isOpen ? 'menu--open' : ''}`} onMouseLeave={onClose}>
      <div className="menu__row">
        <NavLink to={to} className="menu__link" onClick={onClose}>
          {label}
        </NavLink>
        <button
          type="button"
          className="menu__toggle"
          aria-expanded={isOpen}
          aria-label={`Show ${label.toLowerCase()} menu`}
          onClick={onToggle}
        >
          <ChevronIcon className="menu__chevron" />
        </button>
      </div>
      <div className="menu__panel">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="menu__item" onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const goSearch = (term) => {
    navigate(term ? `/products?q=${encodeURIComponent(term)}` : '/products')
    setMobileOpen(false)
  }

  return (
    <div className="site">
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop__glow backdrop__glow--a" />
        <div className="backdrop__glow backdrop__glow--b" />
        <svg
          className="backdrop__waves"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 262C180 190 320 300 520 286c220-15 300-96 520-58 160 29 260 96 400 70v602H0Z"
            fill="#ffffff"
            opacity="0.07"
          />
          <path
            d="M0 340c190-84 330 26 540 10 210-17 300-100 520-52 150 34 250 96 380 64v538H0Z"
            fill="#bfe4fb"
            opacity="0.16"
          />
          <path
            d="M0 430c190-90 336 30 548 12 212-18 306-104 526-48 140 38 234 92 366 58v448H0Z"
            fill="#ffffff"
            opacity="0.1"
          />
          <path
            d="M0 560c210-84 340 24 560 6 200-16 320-88 530-30 130 35 230 74 350 50v314H0Z"
            fill="#d9effd"
            opacity="0.2"
          />
        </svg>
        <div className="backdrop__dots" />
        <div className="backdrop__beam backdrop__beam--a" />
        <div className="backdrop__beam backdrop__beam--b" />
      </div>

      <header className="header">
        <div className="header__inner">
          <Logo />

          <nav className="nav" aria-label="Main">
            <NavLink to="/" className="nav__link" end>
              Home
            </NavLink>

            <DesktopMenu
              label="Products"
              to="/products"
              isOpen={openMenu === 'products'}
              onToggle={() => setOpenMenu(openMenu === 'products' ? null : 'products')}
              onClose={() => setOpenMenu(null)}
              items={[
                { label: 'All products', to: '/products' },
                ...brands.map((brand) => ({
                  label: brand,
                  to: `/products/${brand.toLowerCase()}`,
                })),
              ]}
            />

            <DesktopMenu
              label="Services"
              to="/services"
              isOpen={openMenu === 'services'}
              onToggle={() => setOpenMenu(openMenu === 'services' ? null : 'services')}
              onClose={() => setOpenMenu(null)}
              items={services.map((service) => ({
                label: service.name,
                to: `/services/${service.slug}`,
              }))}
            />

            <NavLink to="/about" className="nav__link">
              About
            </NavLink>
            <NavLink to="/contact" className="nav__link">
              Contact
            </NavLink>
          </nav>

          <div className="header__tools">
            <SearchBox onSubmit={goSearch} />
            <button
              type="button"
              className="header__burger"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div className={`drawer ${mobileOpen ? 'drawer--open' : ''}`}>
          <div className="drawer__section">
            <div className="drawer__search">
              <SearchBox onSubmit={goSearch} />
            </div>
            <Link to="/" className="drawer__link">
              Home
            </Link>
            <Link to="/products" className="drawer__link">
              All products
            </Link>
            <div className="drawer__brands">
              {brands.map((brand) => (
                <Link key={brand} to={`/products/${brand.toLowerCase()}`} className="drawer__chip">
                  {brand}
                </Link>
              ))}
            </div>
            <Link to="/services" className="drawer__link">
              Services
            </Link>
            <div className="drawer__brands">
              {services.map((service) => (
                <Link key={service.slug} to={`/services/${service.slug}`} className="drawer__chip">
                  {service.name}
                </Link>
              ))}
            </div>
            <Link to="/about" className="drawer__link">
              About
            </Link>
            <Link to="/contact" className="drawer__link">
              Contact
            </Link>
          </div>
          <div className="drawer__foot">
            <a href={contact.phoneHref} className="drawer__contact">
              <PhoneIcon /> {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="drawer__contact">
              <MailIcon /> {contact.email}
            </a>
          </div>
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="footer__bar">
          <a href={contact.phoneHref} className="footer__item">
            <span className="footer__icon">
              <PhoneIcon />
            </span>
            {contact.phone}
          </a>
          <a
            href={contact.facebookHref}
            target="_blank"
            rel="noreferrer"
            className="footer__item"
          >
            <span className="footer__icon">
              <FacebookIcon />
            </span>
            {contact.facebook}
          </a>
          <a href={`mailto:${contact.email}`} className="footer__item">
            <span className="footer__icon">
              <MailIcon />
            </span>
            {contact.email}
          </a>
        </div>
        <div className="footer__meta">
          <span>
            <SnowIcon className="footer__snow" /> Fros&rsquo;t Airconditioning Trading
          </span>
          <span>Units, installation and after-sales service since 2015.</span>
        </div>
      </footer>
    </div>
  )
}

export function FeatureBar({ items = features }) {
  return (
    <ul className="feature-bar">
      {items.map((item) => {
        const Icon = featureIcons[item.icon]
        return (
          <li key={item.title} className="feature-bar__item">
            <Icon className="feature-bar__icon" />
            <div>
              <p className="feature-bar__title">{item.title}</p>
              <p className="feature-bar__copy">{item.copy}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export { ArrowIcon, ChevronIcon, SearchIcon }
