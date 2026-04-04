import { useMemo, useState } from 'react'

export function CaesarDemo() {
  const [shift, setShift] = useState(3)
  const plain = 'HELLO'
  const cipher = useMemo(() => {
    const A = 65
    return [...plain]
      .map((c) => {
        const x = c.charCodeAt(0) - A
        return String.fromCharCode(A + ((x + shift) % 26))
      })
      .join('')
  }, [shift])

  return (
    <div className="demo-panel">
      <label className="demo-label">
        Shift ({shift}):{' '}
        <input
          type="range"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
        />
      </label>
      <div className="demo-row">
        <span className="demo-badge plain">Plain</span>
        <code>{plain}</code>
      </div>
      <div className="demo-row">
        <span className="demo-badge cipher">Cipher</span>
        <code>{cipher}</code>
      </div>
    </div>
  )
}

export function XORByteDemo() {
  const [b1, setB1] = useState(0b10110011)
  const [b2, setB2] = useState(0b01101010)
  const xor = b1 ^ b2
  const fmt = (n) => n.toString(2).padStart(8, '0')

  return (
    <div className="demo-panel">
      <p className="demo-hint">
        XOR rule: output bit is 1 when the two input bits differ. Change message or pad and watch
        the cipher byte change.
      </p>
      <div className="bit-row">
        <span>Message byte</span>
        <input
          type="range"
          min={0}
          max={255}
          value={b1}
          onChange={(e) => setB1(Number(e.target.value))}
        />
        <code>{fmt(b1)}</code>
      </div>
      <div className="bit-row">
        <span>Pad byte</span>
        <input
          type="range"
          min={0}
          max={255}
          value={b2}
          onChange={(e) => setB2(Number(e.target.value))}
        />
        <code>{fmt(b2)}</code>
      </div>
      <div className="bit-row highlight">
        <span>Cipher = msg XOR pad</span>
        <code>{fmt(xor)}</code>
      </div>
    </div>
  )
}

function modPow(a, exp, mod) {
  let r = 1n
  let b = BigInt(a) % mod
  let e = BigInt(exp)
  const m = mod
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m
    b = (b * b) % m
    e >>= 1n
  }
  return Number(r)
}

export function ToyRSADemo() {
  const p = 17
  const q = 19
  const n = p * q
  const phi = (p - 1) * (q - 1)
  const e = 7
  const d = 247
  const [m, setM] = useState(10)
  const c = modPow(m, e, BigInt(n))
  const dec = modPow(c, d, BigInt(n))

  return (
    <div className="demo-panel">
      <p className="demo-hint">
        Toy numbers only. Real RSA uses huge primes and padding (e.g. OAEP). Here: encrypt with
        public (e, n), decrypt with private d.
      </p>
      <label className="demo-label">
        Message m (2–300):{' '}
        <input
          type="range"
          min={2}
          max={300}
          value={m}
          onChange={(ev) => setM(Number(ev.target.value))}
        />
        <strong>{m}</strong>
      </label>
      <div className="demo-row">
        <span className="demo-badge cipher">Encrypt</span>
        <code>
          c = m^{e} mod n = {c}
        </code>
      </div>
      <div className="demo-row">
        <span className="demo-badge plain">Decrypt</span>
        <code>
          m = c^{d} mod n = {dec}
        </code>
      </div>
      <p className="demo-foot">
        φ(n) = (p−1)(q−1) = {phi}; pick e and d so e·d ≡ 1 (mod φ).
      </p>
    </div>
  )
}

/** One idea: every letter moves the same number of steps in the alphabet. */
export function VisualSubstitution() {
  return (
    <svg viewBox="0 0 480 218" className="crypto-svg" role="img" aria-label="Substitution maps each letter to one other letter">
      <text x="16" y="28" fill="#e2e8f0" fontSize="14" fontWeight="700">
        Monoalphabetic substitution
      </text>
      <text x="16" y="50" fill="#94a3b8" fontSize="12">
        Each plaintext letter always becomes the same ciphertext letter.
      </text>
      {[
        ['Plain', 'E', 'T', 'A'],
        ['Cipher', 'X', 'Q', 'M'],
      ].map((row, ri) => (
        <g key={row[0]}>
          <text x="16" y={88 + ri * 44} fill="#64748b" fontSize="11" fontWeight="600">
            {row[0]}
          </text>
          {row.slice(1).map((ch, i) => (
            <g key={`${ri}-${ch}`}>
              <rect
                x={72 + i * 56}
                y={68 + ri * 44}
                width="40"
                height="36"
                rx="6"
                fill={ri === 0 ? 'rgba(52,211,153,0.15)' : 'rgba(129,140,248,0.15)'}
                stroke={row[0] === 'Plain' ? '#34d399' : '#818cf8'}
                strokeWidth="1.5"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0.35;1;0.35"
                  dur="2.4s"
                  begin={`${i * 0.55}s`}
                  repeatCount="indefinite"
                />
              </rect>
              <text
                x={92 + i * 56}
                y={92 + ri * 44}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="16"
                fontWeight="700"
              >
                {ch}
              </text>
            </g>
          ))}
        </g>
      ))}
      <text x="16" y="182" fill="#64748b" fontSize="11">
        Attack: count letters — English E is common, so the most common
      </text>
      <text x="16" y="198" fill="#64748b" fontSize="11">
        cipher letter is often E’s image.
      </text>
    </svg>
  )
}

/** Keyword repeats; each column is Caesar with a different shift. */
export function VisualVigenere() {
  return (
    <svg viewBox="0 0 440 222" className="crypto-svg" role="img" aria-label="Vigenere uses a repeating key">
      <text x="16" y="28" fill="#e2e8f0" fontSize="14" fontWeight="700">
        Vigenère (repeating key)
      </text>
      <text x="16" y="50" fill="#94a3b8" fontSize="12">
        Each key letter picks a shift for the letter below. Pattern repeats every key length.
      </text>
      <text x="16" y="82" fill="#fbbf24" fontSize="11" fontWeight="700">
        Key (repeats)
      </text>
      {['K', 'E', 'Y', 'K'].map((c, i) => (
        <g key={`k${c}${i}`}>
          <rect x={100 + i * 72} y="64" width="36" height="28" rx="5" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5">
            <animate
              attributeName="stroke-width"
              values="1.5;3;1.5"
              dur="2s"
              begin={`${i * 0.45}s`}
              repeatCount="indefinite"
            />
          </rect>
          <text x={118 + i * 72} y="84" textAnchor="middle" fill="#fef3c7" fontSize="13" fontWeight="700">
            {c}
          </text>
        </g>
      ))}
      <text x="16" y="130" fill="#38bdf8" fontSize="11" fontWeight="700">
        Message
      </text>
      {['S', 'E', 'C', 'R'].map((c, i) => (
        <g key={`m${c}${i}`}>
          <rect x={100 + i * 72} y="112" width="36" height="28" rx="5" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" />
          <text x={118 + i * 72} y="132" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700">
            {c}
          </text>
          <path
            d={`M ${118 + i * 72} 92 L ${118 + i * 72} 108`}
            stroke="#64748b"
            strokeWidth="1.2"
            markerEnd="url(#vdown)"
            strokeDasharray="4 3"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="14" dur="1.2s" repeatCount="indefinite" />
          </path>
        </g>
      ))}
      <defs>
        <marker id="vdown" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="90deg">
          <path d="M0 0 L6 3 L0 6 Z" fill="#64748b" />
        </marker>
      </defs>
      <text x="16" y="186" fill="#64748b" fontSize="11">
        If key is short, cryptanalysts guess length, then break each column
      </text>
      <text x="16" y="202" fill="#64748b" fontSize="11">
        like Caesar.
      </text>
    </svg>
  )
}

/** Shift every letter by the same amount (example +3). */
export function VisualCaesar() {
  const letters = ['A', 'B', 'C', 'D']
  const shift = 3
  return (
    <svg viewBox="0 0 480 160" className="crypto-svg" role="img" aria-label="Caesar cipher shifts the alphabet">
      <text x="16" y="28" fill="#e2e8f0" fontSize="14" fontWeight="700">
        Caesar cipher
      </text>
      <text x="16" y="50" fill="#94a3b8" fontSize="12">
        Add the same number to every letter (wrap Z→A). Only {25} useful shifts for English.
      </text>
      <text x="16" y="82" fill="#64748b" fontSize="11">
        Plain
      </text>
      {letters.map((ch, i) => (
        <rect
          key={ch}
          x={72 + i * 52}
          y="66"
          width="44"
          height="36"
          rx="6"
          fill="rgba(59,130,246,0.15)"
          stroke="#3b82f6"
        />
      ))}
      {letters.map((ch, i) => (
        <text key={`t-${ch}`} x={94 + i * 52} y="90" textAnchor="middle" fill="#f1f5f9" fontSize="15" fontWeight="700">
          {ch}
        </text>
      ))}
      <text x="280" y="90" fill="#a78bfa" fontSize="13" fontWeight="700">
        +{shift} →
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
      </text>
      {letters.map((ch, i) => (
        <line
          key={`link-${ch}`}
          x1={94 + i * 52}
          y1="102"
          x2={94 + i * 52}
          y2="116"
          stroke="#a78bfa"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.7"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1.5s" repeatCount="indefinite" />
        </line>
      ))}
      {letters.map((ch, i) => (
        <circle key={`drop-${ch}`} r="3.5" fill="#c4b5fd">
          <animateMotion
            dur="2s"
            begin={`${i * 0.35}s`}
            repeatCount="indefinite"
            path={`M ${94 + i * 52} 102 L ${94 + i * 52} 116`}
          />
        </circle>
      ))}
      <text x="16" y="132" fill="#64748b" fontSize="11">
        Cipher
      </text>
      {letters.map((ch, i) => {
        const out = String.fromCharCode(65 + ((ch.charCodeAt(0) - 65 + shift) % 26))
        return (
          <g key={`o-${ch}`}>
            <rect x={72 + i * 52} y="116" width="44" height="36" rx="6" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" />
            <text x={94 + i * 52} y="140" textAnchor="middle" fill="#ddd6fe" fontSize="15" fontWeight="700">
              {out}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** One Feistel round: swap halves and XOR with keyed function of R. */
export function VisualFeistel() {
  return (
    <svg viewBox="0 0 460 236" className="crypto-svg" role="img" aria-label="Feistel round combines two halves with F and XOR">
      <text x="16" y="28" fill="#e2e8f0" fontSize="14" fontWeight="700">
        DES: one Feistel round
      </text>
      <text x="16" y="50" fill="#94a3b8" fontSize="12">
        Split block into left (L) and right (R). Mix with a key-dependent F,
      </text>
      <text x="16" y="66" fill="#94a3b8" fontSize="12">
        then swap roles next round.
      </text>
      <rect x="32" y="90" width="120" height="44" rx="8" fill="#1e293b" stroke="#64748b" />
      <text x="92" y="118" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">
        L
      </text>
      <rect x="308" y="90" width="120" height="44" rx="8" fill="#1e293b" stroke="#64748b" />
      <text x="368" y="118" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">
        R
      </text>
      <rect x="180" y="162" width="100" height="40" rx="8" fill="rgba(139,92,246,0.2)" stroke="#a78bfa" />
      <text x="230" y="187" textAnchor="middle" fill="#ddd6fe" fontSize="12" fontWeight="600">
        F(R, key)
      </text>
      <path d="M 368 112 L 230 162" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="5 4">
        <animate attributeName="stroke-dashoffset" from="0" to="18" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M 92 112 L 92 182 L 180 182" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="5 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.4s" repeatCount="indefinite" />
      </path>
      <circle r="4" fill="#38bdf8" opacity="0.95">
        <animateMotion
          dur="3.2s"
          repeatCount="indefinite"
          path="M 368 112 L 230 182 L 92 182 L 230 182 L 368 112"
        />
      </circle>
      <text x="16" y="216" fill="#64748b" fontSize="11">
        New left = R. New right = L XOR F(R, key).
      </text>
      <text x="16" y="230" fill="#64748b" fontSize="11">
        DES does this 16 times.
      </text>
    </svg>
  )
}

/** AES: four operations per round, repeated. */
export function VisualAESRound() {
  const steps = [
    ['1', 'SubBytes', 'non-linear mix per byte'],
    ['2', 'ShiftRows', 'spread bytes across columns'],
    ['3', 'MixColumns', 'blend each column'],
    ['4', 'AddRoundKey', 'XOR with round key'],
  ]
  return (
    <svg viewBox="0 0 520 232" className="crypto-svg" role="img" aria-label="AES applies four steps per round">
      <text x="16" y="28" fill="#e2e8f0" fontSize="14" fontWeight="700">
        AES: one round (simplified)
      </text>
      <text x="16" y="50" fill="#94a3b8" fontSize="12">
        Data is a 4×4 grid of bytes. Each round scrambles it; many rounds make patterns unrecognizable.
      </text>
      <rect
        x="20"
        y="74"
        width="108"
        height="52"
        rx="8"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.5"
        opacity="0.85"
      >
        <animate
          attributeName="x"
          values="20;142;264;386;20"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>
      {steps.map(([num, name, hint], i) => (
        <g key={name}>
          <rect x={20 + i * 122} y="72" width="112" height="56" rx="8" fill="rgba(56,189,248,0.1)" stroke="#38bdf8">
            <animate
              attributeName="fill-opacity"
              values="0.06;0.22;0.06"
              dur="4s"
              begin={`${i}s`}
              repeatCount="indefinite"
            />
          </rect>
          <text x={32 + i * 122} y="92" fill="#67e8f9" fontSize="11" fontWeight="800">
            {num}
          </text>
          <text x={76 + i * 122} y="92" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontWeight="700">
            {name}
          </text>
          <text x={76 + i * 122} y="112" textAnchor="middle" fill="#64748b" fontSize="9">
            {hint}
          </text>
          {i < 3 ? (
            <text x={138 + i * 122} y="104" fill="#475569" fontSize="14" fontWeight="700">
              →
            </text>
          ) : null}
        </g>
      ))}
      <text x="16" y="174" fill="#64748b" fontSize="11">
        AES-128 runs 10 rounds; last round skips MixColumns.
      </text>
      <text x="16" y="190" fill="#64748b" fontSize="11">
        Real systems use a mode (e.g. GCM) for multiple blocks.
      </text>
    </svg>
  )
}
