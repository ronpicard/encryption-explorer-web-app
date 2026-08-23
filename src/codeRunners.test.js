import { describe, expect, it } from 'vitest'
import {
  caesarEncrypt,
  feistelToyHalf,
  modPow,
  substEncrypt,
  vigenereEncrypt,
  xorBytes,
} from './codeRunners'

describe('caesarEncrypt', () => {
  it('shifts letters with wrap (sample: HELLO, 3 → KHOOR)', () => {
    expect(caesarEncrypt('HELLO', 3)).toBe('KHOOR')
  })

  it('uppercases input and leaves non-letters unchanged', () => {
    expect(caesarEncrypt('Hi 42!', 1)).toBe('IJ 42!')
  })

  it('wraps Z+1 to A', () => {
    expect(caesarEncrypt('Z', 1)).toBe('A')
  })

  it('normalizes negative shifts into the alphabet', () => {
    expect(caesarEncrypt('ABC', -1)).toBe('ZAB')
  })

  it('treats non-finite shift as 0', () => {
    expect(caesarEncrypt('HELLO', Number.NaN)).toBe('HELLO')
  })
})

describe('substEncrypt', () => {
  it('applies the fixed QWERTY-style alphabet from the sample', () => {
    expect(substEncrypt('ATTACK')).toBe('QZZQEA')
  })

  it('passes through non-letters', () => {
    expect(substEncrypt('A-1')).toBe('Q-1')
  })
})

describe('vigenereEncrypt', () => {
  it('applies repeating key shifts', () => {
    expect(vigenereEncrypt('SECRET', 'KEY')).toBe('CIABIR')
  })

  it('returns uppercase plaintext when key has no letters', () => {
    expect(vigenereEncrypt('Hi!', '123')).toBe('HI!')
  })
})

describe('xorBytes', () => {
  it('XORs equal-length byte arrays', () => {
    expect([...xorBytes(new Uint8Array([180]), new Uint8Array([90]))]).toEqual([238])
  })

  it('throws a clear error when lengths differ', () => {
    expect(() => xorBytes(new Uint8Array([1, 2]), new Uint8Array([1]))).toThrow(
      /xorBytes: length mismatch/,
    )
  })
})

describe('feistelToyHalf', () => {
  it('matches the toy F(R)=(R*7+3)%16 round', () => {
    expect(feistelToyHalf(9, 12)).toEqual({ Lp: 12, Rp: 9 ^ ((12 * 7 + 3) % 16), f: (12 * 7 + 3) % 16 })
  })
})

describe('modPow', () => {
  it('matches the toy RSA sample (n=323, e=7, d=247)', () => {
    const c = modPow(10, 7, 323n)
    expect(c).toBe(243)
    expect(modPow(c, 247, 323n)).toBe(10)
  })

  it('throws when modulus is not a positive integer', () => {
    expect(() => modPow(2, 3, 0n)).toThrow(/modPow: modulus must be a positive integer/)
    expect(() => modPow(2, 3, -5n)).toThrow(/modPow: modulus must be a positive integer/)
  })
})
