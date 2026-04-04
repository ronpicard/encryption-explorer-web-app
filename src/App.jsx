import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { DISCLAIMER, GLOSSARY, TOPICS } from './cryptoTopics'
import {
  VisualAESRound,
  VisualCaesar,
  VisualFeistel,
  VisualSubstitution,
  VisualVigenere,
} from './CryptoDemos'
import {
  VisualGroverAES,
  VisualPQC,
  VisualPublicKeyInternet,
  VisualQuantumShor,
} from './CryptoInternetVisuals'
import { LiveCodeRunner } from './LiveCodeRunner'

const InventionGlobe = lazy(() => import('./InventionGlobe'))
import './App.css'

function RichText({ text }) {
  if (!text) return null
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i}>{part.slice(2, -2)}</strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function CodeSample({ title, code }) {
  return (
    <figure className="code-figure">
      <figcaption>{title}</figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  )
}

function TopicVisual({ id }) {
  switch (id) {
    case 'caesar':
      return <VisualCaesar />
    case 'substitution':
      return <VisualSubstitution />
    case 'vigenere':
      return <VisualVigenere />
    case 'otp':
      return <VisualOtpMini />
    case 'des':
      return <VisualFeistel />
    case 'aes':
      return (
        <>
          <VisualAESRound />
          <VisualGroverAES />
        </>
      )
    case 'rsa':
      return (
        <>
          <VisualPublicKeyInternet />
          <VisualQuantumShor />
        </>
      )
    case 'pqc':
      return <VisualPQC />
    default:
      return null
  }
}

function VisualOtpMini() {
  return (
    <div className="visual-fallback" role="img" aria-label="One-time pad XOR">
      <strong>One-time pad</strong>
      <p>Each ciphertext byte = message byte XOR pad byte. Pad must be random, as long as the message, and never reused.</p>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState(TOPICS[0].id)
  const [sortMode, setSortMode] = useState('timeline')
  const tabRefs = useRef({})

  const topics = useMemo(() => {
    const base = [...TOPICS]
    if (sortMode === 'timeline') {
      base.sort((a, b) => (a.sortYear ?? 0) - (b.sortYear ?? 0))
    } else if (sortMode === 'effectiveness') {
      base.sort((a, b) => (b.effectivenessRank ?? 0) - (a.effectivenessRank ?? 0))
    }
    return base
  }, [sortMode])

  const topic = topics.find((t) => t.id === active) ?? TOPICS[0]

  useEffect(() => {
    const el = tabRefs.current[active]
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [active])

  function selectTopic(id) {
    setActive(id)
  }

  const origin = topic.origin

  return (
    <div className="crypto-app">
      <header className="crypto-header">
        <h1>Encryption Explorer</h1>
        <p className="lead">
          Interactive tour of classical and modern ciphers — timelines, maps, rough break estimates, and runnable demos from
          ancient shifts through AES and post‑quantum standards.
        </p>
      </header>

      <section className="controls controls--simple">
        <div className="seg" role="group" aria-label="Sort tabs">
          <button
            type="button"
            className={sortMode === 'timeline' ? 'active' : ''}
            onClick={() => setSortMode('timeline')}
          >
            By time
          </button>
          <button
            type="button"
            className={sortMode === 'effectiveness' ? 'active' : ''}
            onClick={() => setSortMode('effectiveness')}
          >
            By strength
          </button>
        </div>
      </section>

      <aside className="glossary-inline" aria-label="Terms">
        <strong>Symmetric</strong> — {GLOSSARY.symmetric}{' '}
        <strong className="glossary-inline__gap">Asymmetric</strong> — {GLOSSARY.asymmetric}
      </aside>

      <nav className="timeline-nav" aria-label="Topics">
        <div className="timeline-track">
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              ref={(el) => {
                tabRefs.current[t.id] = el
              }}
              className={`timeline-tab ${active === t.id ? 'is-active' : ''}`}
              onClick={() => selectTopic(t.id)}
            >
              <span className="timeline-tab__title">{t.title}</span>
              <span className="timeline-tab__era">{t.timeline}</span>
              <span className={`timeline-tab__kind timeline-tab__kind--${t.kind}`}>{t.kind}</span>
            </button>
          ))}
        </div>
      </nav>

      <section
        className="timeline-strength"
        aria-labelledby="timeline-strength-heading"
      >
        <div className="timeline-strength__row">
          <span id="timeline-strength-heading" className="timeline-strength__title">
            Encryption strength
          </span>
          <span className="timeline-strength__meta" aria-live="polite" aria-atomic="true">
            <span className="timeline-strength__rank">{topic.effectivenessRank}</span>
            <span className="timeline-strength__of">/9</span>
            <span className="timeline-strength__dash"> — </span>
            <span className="timeline-strength__label">{topic.effectivenessLabel}</span>
          </span>
        </div>
        <div
          className="timeline-strength__track"
          role="meter"
          aria-valuemin={1}
          aria-valuemax={9}
          aria-valuenow={topic.effectivenessRank}
          aria-valuetext={`${topic.effectivenessRank} of 9 — ${topic.effectivenessLabel}`}
          aria-label={`Encryption strength for ${topic.title}`}
        >
          <div
            className="timeline-strength__fill meter__fill"
            style={{ width: `${(topic.effectivenessRank / 9) * 100}%` }}
          />
        </div>
      </section>

      <article className="topic-panel" key={topic.id}>
        <header className="topic-head">
          <h2>{topic.title}</h2>
          <p className="topic-era">{topic.timeline}</p>
          <p className="topic-kind">
            {topic.kind === 'asymmetric' ? 'Asymmetric' : 'Symmetric'} · strength {topic.effectivenessRank}/9 (
            {topic.effectivenessLabel})
          </p>
        </header>

        <p className="topic-summary">{topic.summary}</p>

        <p className="topic-one-liner">
          <strong>Used for:</strong> {topic.usedFor} <strong>Mostly replaced by:</strong> {topic.replacedBy}
        </p>

        {topic.invention ? (
          <section className="topic-section topic-section--history">
            <h3>Who invented it, where was it invented, when was it invented</h3>
            <ul className="topic-invention-facts">
              <li className="topic-invention-facts__item">
                <strong className="topic-invention-facts__label">Who invented it:</strong>{' '}
                <span className="topic-invention-facts__body">
                  <RichText text={topic.invention.who} />
                </span>
              </li>
              <li className="topic-invention-facts__item">
                <strong className="topic-invention-facts__label">Where was it invented:</strong>{' '}
                <span className="topic-invention-facts__body">
                  <RichText text={topic.invention.where} />
                </span>
              </li>
              <li className="topic-invention-facts__item">
                <strong className="topic-invention-facts__label">When was it invented:</strong>{' '}
                <span className="topic-invention-facts__body">{topic.invention.when}</span>
              </li>
            </ul>
            <div className="topic-history-map">
              <Suspense
                fallback={
                  <div className="globe-panel globe-panel--embedded globe-panel--loading">
                    <div className="globe-panel__placeholder globe-panel__placeholder--embedded">Loading map…</div>
                  </div>
                }
              >
                <InventionGlobe
                  embedded
                  lat={origin?.lat}
                  lng={origin?.lng}
                  placeLabel={origin?.label}
                />
              </Suspense>
            </div>
            <p className="topic-invention-narrative">
              <RichText text={topic.invention.narrative} />
            </p>
          </section>
        ) : null}

        {topic.math ? (
          <section className="topic-section topic-section--math">
            <h3>Math & idea</h3>
            <p>{topic.math.summary}</p>
            {topic.math.formulas?.length ? (
              <ul className="formula-list">
                {topic.math.formulas.map((f) => (
                  <li key={f}>
                    <code>{f}</code>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {topic.implementationSteps?.length ? (
          <section className="topic-section topic-section--steps">
            <h3>Steps to implement an algorithm</h3>
            <ol className="impl-steps">
              {topic.implementationSteps.map((step) => (
                <li key={step}>
                  <RichText text={step} />
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="topic-section topic-section--visual">
          <h3>Picture</h3>
          <div className="visual-stack">
            <TopicVisual id={topic.id} />
          </div>
        </section>

        <section className="topic-section">
          <h3>Run the sample code</h3>
          <p className="section-lead">Change values — the output uses the same logic as the snippet below.</p>
          <LiveCodeRunner topicId={topic.id} />
        </section>

        <section className="topic-section">
          <h3>Sample code</h3>
          <CodeSample title={topic.codeTitle} code={topic.code} />
        </section>

        <section className="topic-section topic-section--security" aria-labelledby="security-heading">
          <h3 id="security-heading">Flaws, break times & quantum</h3>
          <p className="disclaimer">{DISCLAIMER}</p>
          <div className="security-block">
            <h4 className="security-block__title">Structural & practical flaws</h4>
            <p>{topic.flaws}</p>
          </div>
          <div className="break-grid break-grid--simple">
            <div className="break-card break-card--classical">
              <h4>Classical computers (expanded)</h4>
              <p>{topic.classicalBreak}</p>
            </div>
            <div className="break-card break-card--quantum">
              <h4>Quantum algorithms (expanded)</h4>
              <p>{topic.quantumBreak}</p>
            </div>
          </div>
        </section>
      </article>

      <footer className="crypto-footer">
        <p>For learning only. Use Web Crypto / vetted libraries in real apps.</p>
      </footer>
    </div>
  )
}
