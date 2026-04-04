/** Same logic as the sample snippets — safe, local-only. */

export function caesarEncrypt(text, shift) {
  const A = 65
  return [...String(text).toUpperCase()]
    .map((c) => {
      if (c < 'A' || c > 'Z') return c
      const x = c.charCodeAt(0) - A
      return String.fromCharCode(A + ((x + Number(shift)) % 26))
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
  if (msg.length !== pad.length) throw new Error('length mismatch')
  return Uint8Array.from(msg, (b, i) => b ^ pad[i])
}

/** Toy Feistel half: F(R) = (R * 7 + 3) % 16 — not real DES, shows L' = R, R' = L ⊕ F(R). */
export function feistelToyHalf(L, R) {
  const F = (r) => (r * 7 + 3) % 16
  const f = F(Number(R) & 0xf)
  return { Lp: R & 0xf, Rp: (L & 0xf) ^ f, f }
}

export function modPow(a, exp, m) {
  let r = 1n
  let b = BigInt(a) % m
  let e = BigInt(exp)
  const mod = m
  while (e > 0n) {
    if (e & 1n) r = (r * b) % mod
    b = (b * b) % mod
    e >>= 1n
  }
  return Number(r)
}
