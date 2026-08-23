import { useMemo, useState } from 'react'
import {
  caesarEncrypt,
  feistelToyHalf,
  modPow,
  substEncrypt,
  vigenereEncrypt,
  xorBytes,
} from './codeRunners'

export function LiveCodeRunner({ topicId }) {
  switch (topicId) {
    case 'caesar':
      return <RunCaesar />
    case 'substitution':
      return <RunSubst />
    case 'vigenere':
      return <RunVigenere />
    case 'otp':
      return <RunXor />
    case 'des':
      return <RunFeistel />
    case 'aes':
      return <RunAesNote />
    case 'rsa':
      return <RunRsa />
    case 'pqc':
      return <RunPqc />
    default:
      return null
  }
}

function Out({ children }) {
  return (
    <div className="live-out">
      <span className="live-out__label">Result</span>
      <output className="live-out__value">{children}</output>
    </div>
  )
}

function RunCaesar() {
  const [text, setText] = useState('HELLO')
  const [shift, setShift] = useState(3)
  const result = useMemo(() => caesarEncrypt(text, shift), [text, shift])
  const displayText = text.toUpperCase()
  const hasLetter = /[A-Z]/.test(displayText)
  return (
    <div className="live-panel">
      <p className="live-hint">Same function as in the sample code above.</p>
      <label className="live-field">
        Letters (A–Z)
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={32} />
      </label>
      <label className="live-field">
        Shift (0–25)
        <input
          type="number"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value) || 0)}
        />
      </label>
      <Out>
        {hasLetter ? (
          <code>
            caesarEncrypt(&quot;{displayText}&quot;, {shift}) → &quot;{result}&quot;
          </code>
        ) : (
          <>
            Add at least one A–Z letter to see the formula; spaces and digits pass through unchanged:{' '}
            <code>&quot;{result}&quot;</code>
          </>
        )}
      </Out>
    </div>
  )
}

function RunSubst() {
  const [text, setText] = useState('ATTACK')
  const result = useMemo(() => substEncrypt(text), [text])
  return (
    <div className="live-panel">
      <p className="live-hint">Uses the fixed QWERTY… substitution alphabet from the sample.</p>
      <label className="live-field">
        Plaintext
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={40} />
      </label>
      <Out>
        <code>substEncrypt(&quot;{text.toUpperCase()}&quot;) → &quot;{result}&quot;</code>
      </Out>
    </div>
  )
}

function RunVigenere() {
  const [text, setText] = useState('SECRET')
  const [key, setKey] = useState('KEY')
  const result = useMemo(() => vigenereEncrypt(text, key), [text, key])
  return (
    <div className="live-panel">
      <label className="live-field">
        Message
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={40} />
      </label>
      <label className="live-field">
        Key (letters only)
        <input value={key} onChange={(e) => setKey(e.target.value)} maxLength={16} />
      </label>
      <Out>
        <code>vigenere(&quot;{text.toUpperCase()}&quot;, &quot;{key.toUpperCase()}&quot;) → &quot;{result}&quot;</code>
      </Out>
    </div>
  )
}

function RunXor() {
  const [a, setA] = useState(180)
  const [b, setB] = useState(90)
  const result = useMemo(() => {
    const msg = new Uint8Array([a & 0xff])
    const pad = new Uint8Array([b & 0xff])
    return xorBytes(msg, pad)[0]
  }, [a, b])
  return (
    <div className="live-panel">
      <p className="live-hint">One byte each: cipher = message XOR pad (same rule as xorBytes in the sample).</p>
      <label className="live-field">
        Message byte (0–255)
        <input type="range" min={0} max={255} value={a} onChange={(e) => setA(Number(e.target.value))} />
        <span className="live-num">{a}</span>
      </label>
      <label className="live-field">
        Pad byte (0–255)
        <input type="range" min={0} max={255} value={b} onChange={(e) => setB(Number(e.target.value))} />
        <span className="live-num">{b}</span>
      </label>
      <Out>
        <code>
          {a} XOR {b} = {result} (0x{result.toString(16).padStart(2, '0')})
        </code>
      </Out>
    </div>
  )
}

function RunFeistel() {
  const [L, setL] = useState(9)
  const [R, setR] = useState(12)
  const { Lp, Rp, f } = useMemo(() => feistelToyHalf(L, R), [L, R])
  return (
    <div className="live-panel">
      <p className="live-hint">
        Toy F(R) = (R×7+3) mod 16. New L = R, New R = L XOR F(R). Not DES—just shows the Feistel pattern.
      </p>
      <label className="live-field">
        L (0–15)
        <input type="range" min={0} max={15} value={L} onChange={(e) => setL(Number(e.target.value))} />
        <span className="live-num">{L}</span>
      </label>
      <label className="live-field">
        R (0–15)
        <input type="range" min={0} max={15} value={R} onChange={(e) => setR(Number(e.target.value))} />
        <span className="live-num">{R}</span>
      </label>
      <Out>
        <code>
          F(R)={f} → L&apos;={Lp}, R&apos;={Rp}
        </code>
      </Out>
    </div>
  )
}

function RunAesNote() {
  return (
    <div className="live-panel live-panel--static">
      <p className="live-hint">
        Full AES in the browser needs the Web Crypto API and binary buffers. The sample above is pseudocode for one round.
      </p>
      <Out>
        <span>
          In real code you&apos;d call <code>crypto.subtle.encrypt</code> with AES-GCM and a random IV—not a 10-line demo.
        </span>
      </Out>
    </div>
  )
}

function RunRsa() {
  const n = 323
  const e = 7
  const d = 247
  const [m, setM] = useState(10)
  const c = useMemo(() => modPow(m, e, BigInt(n)), [m])
  const back = useMemo(() => modPow(c, d, BigInt(n)), [c])
  return (
    <div className="live-panel">
      <p className="live-hint">Same toy n=323, e=7, d=247 as in the sample. modPow matches the sample algorithm.</p>
      <label className="live-field">
        m (2–322)
        <input type="range" min={2} max={322} value={m} onChange={(ev) => setM(Number(ev.target.value))} />
        <span className="live-num">{m}</span>
      </label>
      <Out>
        <code>
          c = modPow(m, e, n) = {c} → modPow(c, d, n) = {back}
        </code>
      </Out>
    </div>
  )
}

function RunPqc() {
  return (
    <div className="live-panel live-panel--static">
      <p className="live-hint">Real Kyber/Dilithium use large polynomials and keys—no safe one-screen runner.</p>
      <Out>
        <span>Flow: Encaps(pk) → (c, ss); Decaps(sk, c) → ss. Your browser may already use hybrid PQ in TLS behind the scenes.</span>
      </Out>
    </div>
  )
}
