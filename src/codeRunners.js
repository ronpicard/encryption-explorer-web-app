/** Same logic as the sample snippets — safe, local-only. */

function normalizeShift(shift) {
  const n = Number(shift)
  if (!Number.isFinite(n)) return 0
  const mod = Math.trunc(n) % 26
  return mod < 0 ? mod + 26 : mod
}

export function caesarEncrypt(text, shift) {
  const A = 65
  const k = normalizeShift(shift)
  return [...String(text).toUpperCase()]
    .map((c) => {
      if (c < 'A' || c > 'Z') return c
      const x = c.charCodeAt(0) - A
      return String.fromCharCode(A + ((x + k) % 26))
    })
    .join('')
}

const SUBST_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SUBST_SHUFFLED = 'QWERTYUIOPASDFGHJKLZXCVBNM'

export function substEncrypt(text) {
  const map = Object.fromEntries([...SUBST_ALPHABET].map((a, i) => [a, SUBST_SHUFFLED[i]]))
  return [...String(text).toUpperCase()]
    .map((c) => map[c] ?? c)
    .join('')
}

export function vigenereEncrypt(text, key) {
  const A = 65
  const k = String(key)
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
  if (!k) return String(text).toUpperCase()
  let ki = 0
  return [...String(text).toUpperCase()]
    .map((c) => {
      if (c < 'A' || c > 'Z') return c
      const shift = k.charCodeAt(ki % k.length) - A
      ki++
      const x = c.charCodeAt(0) - A
      return String.fromCharCode(A + ((x + shift) % 26))
    })
    .join('')
}

export function xorBytes(msg, pad) {
  if (!(msg instanceof Uint8Array) || !(pad instanceof Uint8Array)) {
    throw new TypeError('xorBytes: msg and pad must be Uint8Array')
  }
  if (msg.length !== pad.length) {
    throw new Error(
      `xorBytes: length mismatch (msg=${msg.length}, pad=${pad.length})`,
    )
  }
  return Uint8Array.from(msg, (b, i) => b ^ pad[i])
}

/** Toy Feistel half: F(R) = (R * 7 + 3) % 16 — not real DES, shows L' = R, R' = L ⊕ F(R). */
export function feistelToyHalf(L, R) {
  const F = (r) => (r * 7 + 3) % 16
  const left = Number(L)
  const right = Number(R)
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error('feistelToyHalf: L and R must be finite numbers')
  }
  const Ln = left & 0xf
  const Rn = right & 0xf
  const f = F(Rn)
  return { Lp: Rn, Rp: Ln ^ f, f }
}

export function modPow(a, exp, m) {
  const mod = typeof m === 'bigint' ? m : BigInt(m)
  if (mod <= 0n) {
    throw new Error('modPow: modulus must be a positive integer')
  }
  let r = 1n
  let b = BigInt(a) % mod
  let e = BigInt(exp)
  if (e < 0n) {
    throw new Error('modPow: exponent must be non-negative')
  }
  while (e > 0n) {
    if (e & 1n) r = (r * b) % mod
    b = (b * b) % mod
    e >>= 1n
  }
  return Number(r)
}
