import { describe, expect, it } from 'vitest'
import { DISCLAIMER, GLOSSARY, TOPICS, sortTopics } from './cryptoTopics'

const REQUIRED_FIELDS = [
  'id',
  'title',
  'timeline',
  'sortYear',
  'kind',
  'effectivenessRank',
  'effectivenessLabel',
  'usedFor',
  'replacedBy',
  'summary',
  'flaws',
  'classicalBreak',
  'quantumBreak',
  'codeTitle',
  'code',
]

describe('TOPICS catalog', () => {
  it('has unique ids', () => {
    const ids = TOPICS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes the expected topic set', () => {
    expect(TOPICS.map((t) => t.id).sort()).toEqual(
      ['aes', 'caesar', 'des', 'otp', 'pqc', 'rsa', 'substitution', 'vigenere'].sort(),
    )
  })

  it('requires core fields, kind, and strength rank 1–9', () => {
    for (const topic of TOPICS) {
      for (const field of REQUIRED_FIELDS) {
        expect(topic[field], `${topic.id}.${field}`).toBeTruthy()
      }
      expect(['symmetric', 'asymmetric']).toContain(topic.kind)
      expect(topic.effectivenessRank).toBeGreaterThanOrEqual(1)
      expect(topic.effectivenessRank).toBeLessThanOrEqual(9)
      expect(Number.isFinite(topic.sortYear)).toBe(true)
    }
  })

  it('exposes teaching disclaimer and glossary terms', () => {
    expect(DISCLAIMER.length).toBeGreaterThan(20)
    expect(GLOSSARY.symmetric).toMatch(/key/i)
    expect(GLOSSARY.asymmetric).toMatch(/public/i)
  })
})

describe('sortTopics', () => {
  it('orders by sortYear for timeline mode', () => {
    const ids = sortTopics(TOPICS, 'timeline').map((t) => t.id)
    expect(ids[0]).toBe('caesar')
    expect(ids.at(-1)).toBe('pqc')
    for (let i = 1; i < ids.length; i++) {
      const prev = TOPICS.find((t) => t.id === ids[i - 1])
      const cur = TOPICS.find((t) => t.id === ids[i])
      expect(prev.sortYear).toBeLessThanOrEqual(cur.sortYear)
    }
  })

  it('orders by descending effectivenessRank for strength mode', () => {
    const ranks = sortTopics(TOPICS, 'effectiveness').map((t) => t.effectivenessRank)
    expect(ranks[0]).toBe(9)
    expect(ranks.at(-1)).toBe(1)
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i - 1]).toBeGreaterThanOrEqual(ranks[i])
    }
  })

  it('returns a shallow copy for unknown modes', () => {
    const sorted = sortTopics(TOPICS, 'nope')
    expect(sorted).toEqual(TOPICS)
    expect(sorted).not.toBe(TOPICS)
  })
})
