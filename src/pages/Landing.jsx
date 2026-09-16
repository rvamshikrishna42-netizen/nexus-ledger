import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4'

const POSTER_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp'

function Arrow() {
  return (
    <svg
      className="nexus-arrow"
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0.8 5h10M7.1 1.4 10.9 5l-3.8 3.6"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  const videoA = useRef(null)
  const videoB = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('nexus-landing-anim')

    const timer = setTimeout(() => {
      document.documentElement.classList.add('nexus-landing-go')
    }, 120)

    return () => {
      clearTimeout(timer)
      document.documentElement.classList.remove('nexus-landing-anim')
      document.documentElement.classList.remove('nexus-landing-go')
    }
  }, [])

  useEffect(() => {
    const A = videoA.current
    const B = videoB.current

    if (!A || !B) return

    const reduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduceMotion) {
      A.pause()
      B.pause()
      return
    }

    let current = A
    let next = B
    let swapping = false
    const FADE = 0.9

    const playVideo = (video) => {
      try {
        const promise = video.play()

        if (promise?.catch) {
          promise.catch(() => {})
        }
      } catch {
        // Browser may block autoplay.
      }
    }

    playVideo(A)

    const tick = () => {
      if (swapping || !current.duration) return

      if (current.duration - current.currentTime > FADE) {
        return
      }

      swapping = true

      const outgoing = current

      try {
        next.currentTime = 0
      } catch {
        // Ignore seek errors.
      }

      playVideo(next)

      next.classList.add('is-active')
      outgoing.classList.remove('is-active')

      const temp = current
      current = next
      next = temp

      setTimeout(() => {
        try {
          outgoing.pause()
          outgoing.currentTime = 0
        } catch {
          // Ignore video cleanup errors.
        }

        swapping = false
      }, FADE * 1000 + 100)
    }

    A.addEventListener('timeupdate', tick)
    B.addEventListener('timeupdate', tick)

    return () => {
      A.removeEventListener('timeupdate', tick)
      B.removeEventListener('timeupdate', tick)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    const handleOutsideClick = (event) => {
      if (!event.target.closest('.nexus-mobile-menu') &&
          !event.target.closest('.nexus-burger')) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="nexus-reference-hero">

      {/* =====================================================
          FULL SCREEN BACKGROUND VIDEO
          ===================================================== */}
      <div className="nexus-video-background">
        <video
          ref={videoA}
          className="nexus-bg-video is-active"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER_URL}
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        <video
          ref={videoB}
          className="nexus-bg-video"
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER_URL}
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        <div className="nexus-video-overlay" />
        <div className="nexus-video-vignette" />
      </div>

      {/* =====================================================
          TOP NAVIGATION
          ===================================================== */}
      <header className="nexus-reference-nav">

        <Link
          to="/"
          className="nexus-reference-logo"
          onClick={closeMenu}
        >
          NEXUS<span>LEDGER</span>
        </Link>

        <nav
          className="nexus-reference-links"
          aria-label="Primary navigation"
        >
          <Link to="/architecture">Architecture</Link>
          <Link to="/technologies">Technologies</Link>
          <Link to="/security">Security</Link>
          <Link to="/blockchain">Blockchain</Link>
          <Link to="/audit">Audit</Link>
        </nav>

        <div className="nexus-reference-actions">

          <Link
            to="/login"
            className="nexus-reference-login"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="nexus-reference-start"
          >
            Get Started
            <Arrow />
          </Link>

        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`nexus-burger ${menuOpen ? 'open' : ''}`}
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen((value) => !value)
          }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nexus-mobile-menu"
        >
          <span />
        </button>

      </header>

      {/* =====================================================
          MOBILE MENU
          ===================================================== */}
      <nav
        id="nexus-mobile-menu"
        className={`nexus-mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >

        <Link to="/architecture" onClick={closeMenu}>
          Architecture
        </Link>

        <Link to="/technologies" onClick={closeMenu}>
          Technologies
        </Link>

        <Link to="/security" onClick={closeMenu}>
          Security
        </Link>

        <Link to="/blockchain" onClick={closeMenu}>
          Blockchain
        </Link>

        <Link to="/audit" onClick={closeMenu}>
          Audit
        </Link>

        <div className="nexus-menu-divider" />

        <Link to="/login" onClick={closeMenu}>
          Login
        </Link>

        <Link
          to="/register"
          className="nexus-mobile-start"
          onClick={closeMenu}
        >
          Get Started
          <Arrow />
        </Link>

      </nav>

      {/* =====================================================
          HERO CONTENT
          ===================================================== */}
      <section className="nexus-reference-content">

        <div className="nexus-reference-copy">

          <h1>
            <span className="nexus-line">
              <span className="nexus-line-inner">
                Secure every identity.
              </span>
            </span>

            <span className="nexus-line">
              <span className="nexus-line-inner">
                Verify every asset.
              </span>
            </span>

            <span className="nexus-line nexus-line-accent">
              <span className="nexus-line-inner">
                Detect every anomaly.
              </span>
            </span>
          </h1>

          <p className="nexus-reference-subtitle">
            Decentralized identity, intelligent access control,
            verifiable digital ownership, AI-powered security
            analytics, and immutable blockchain audit trails.
          </p>

          <div className="nexus-reference-ctas">

            <Link
              to="/login"
              className="nexus-reference-btn nexus-primary-btn"
            >
              Launch Secure Platform
              <Arrow />
            </Link>

            <Link
              to="/architecture"
              className="nexus-reference-btn nexus-ghost-btn"
            >
              Explore Architecture
              <Arrow />
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          BOTTOM SYSTEM STATUS
          ===================================================== */}
      <div className="nexus-bottom-status">

        <span className="nexus-status-dot" />

        <span>DECENTRALIZED TRUST NETWORK</span>

        <i />

        <span>IDENTITY VERIFIED</span>

        <i />

        <span>BLOCKCHAIN ACTIVE</span>

        <i />

        <span>AI SECURITY ONLINE</span>

      </div>

    </main>
  )
}