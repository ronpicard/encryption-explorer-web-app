/**
 * Educational order-of-magnitude notes (not formal security proofs).
 * "Classical PC" assumes a strong desktop; quantum rows describe known
 * asymptotic attacks (Grover / Shor) on idealized large machines.
 *
 * Historical attributions are simplified for teaching; several ideas were
 * discovered independently or refined over centuries.
 */

/** @param {ReadonlyArray<{ sortYear?: number, effectivenessRank?: number }>} topics
 *  @param {string} sortMode */
export function sortTopics(topics, sortMode) {
  const base = [...topics]
  if (sortMode === 'timeline') {
    base.sort((a, b) => (a.sortYear ?? 0) - (b.sortYear ?? 0))
  } else if (sortMode === 'effectiveness') {
    base.sort((a, b) => (b.effectivenessRank ?? 0) - (a.effectivenessRank ?? 0))
  }
  return base
}

export const DISCLAIMER =
  'Times are rough teaching estimates for key recovery or equivalent effort. Real attacks use side channels, implementation bugs, and leaked keys—often far faster than brute force.'

export const GLOSSARY = {
  symmetric:
    'Same secret key is used to encrypt and decrypt. Great for bulk data (fast), but you must already share the secret key safely.',
  asymmetric:
    'Two keys: a public key (shareable) and a private key (secret). Enables key exchange and signatures over the open internet; slower and uses larger math than symmetric crypto.',
}

export const TOPICS = [
  {
    id: 'caesar',
    title: 'Caesar cipher',
    timeline: '~50 BC',
    sortYear: -50,
    kind: 'symmetric',
    effectivenessRank: 1,
    effectivenessLabel: 'Very weak',
    usedFor:
      'Military and political messages in the Roman world; puzzles and simple obfuscation today.',
    replacedBy:
      'Any serious need for secrecy moved on to more complex ciphers; today it is mainly educational.',
    summary:
      'Each letter moves forward in the alphabet by the same fixed number—like a secret “offset” everyone in your army agrees on. It is the simplest idea of encryption: fine if nobody is seriously analyzing the text, useless once someone counts how often letters appear.',
    origin: { lat: 41.9028, lng: 12.4964, label: 'Roman Italy (Rome area — traditional use)' },
    invention: {
      who: 'Named for Julius Caesar; Suetonius describes him using a letter shift for military messages.',
      where: 'Roman Italy (Rome area — traditional use)',
      when: 'c. 50 BCE (use); described in later Roman literature',
      narrative:
        'A substitution cipher with a **cyclic alphabet**: every letter moves by the same offset *k* modulo the alphabet size. It is one of the oldest “algorithmic” ciphers students still implement on day one.',
    },
    math: {
      summary:
        'Number the letters 0…25. Encryption adds a fixed key *k*; decryption subtracts *k*, always modulo 26 (wrap so Z+1 → A).',
      formulas: [
        'If Pᵢ is plaintext letter index and Cᵢ ciphertext: Cᵢ ≡ Pᵢ + k (mod 26)',
        'Decrypt: Pᵢ ≡ Cᵢ − k (mod 26)',
      ],
    },
    implementationSteps: [
      'Choose alphabet (often A–Z) and integer shift *k* ∈ {0,…,25}.',
      'Normalize text: uppercase, strip or pass through non-letters unchanged.',
      'For each letter, map to index 0–25, add *k* mod 26, map back to a letter.',
      'Decrypt by subtracting *k* mod 26 (or encrypt with 26−*k*).',
      'Test vectors: empty string, all A’s, Z with k=1 wraps to A.',
    ],
    flaws:
      'Only 25 non-trivial shifts for English. Letter frequencies stay the same shape—E stays the “spikiest” letter, only relabeled—so frequency analysis or even eyeballing repeated pattern lengths finds *k* quickly. No key schedule, no diffusion: changing one plaintext letter changes only one ciphertext letter.',
    classicalBreak:
      'Brute force: at most 25 tries. Automated: score each candidate decryption with English letter-frequency chi-squared or simple “looks like words” heuristic; usually the correct *k* wins in one pass. Runtime is effectively instant on any phone.',
    quantumBreak:
      'There is no interesting quantum speedup here: the keyspace is ~5 bits. Grover’s √ speedup on unstructured search is irrelevant when classical search already finishes in microseconds. Quantum computers do not turn a 25-key cipher into a research problem.',
    codeTitle: 'Shift each letter (wrap A–Z)',
    code: `function caesarEncrypt(text, shift) {
  const A = 65, Z = 90
  return [...text.toUpperCase()]
    .map((c) => {
      if (c < 'A' || c > 'Z') return c
      const x = c.charCodeAt(0) - A
      return String.fromCharCode(A + ((x + shift) % 26))
    })
    .join('')
}

caesarEncrypt('HELLO', 3) // 'KHOOR'`,
  },
  {
    id: 'substitution',
    title: 'Monoalphabetic substitution',
    timeline: '~1400s–1700s',
    sortYear: 1400,
    kind: 'symmetric',
    effectivenessRank: 2,
    effectivenessLabel: 'Weak',
    usedFor:
      'Handwritten secret correspondence and early diplomacy where tools were limited.',
    replacedBy:
      'Polyalphabetic ciphers, mechanical cipher machines, and eventually modern symmetric cryptography.',
    summary:
      'Every A–Z letter is swapped for exactly one other letter, using one secret scrambled alphabet for the whole message—think of a decoder ring that never changes mid-message. It looks more random than Caesar, but the same statistical habits of English (common letters, pairs like TH) still leak through.',
    origin: { lat: 33.3152, lng: 44.3661, label: 'Baghdad — Al-Kindi’s frequency analysis (9th c.)' },
    invention: {
      who:
        'Substitution itself is ancient; **Al-Kindi** (c. 801–873 CE) described frequency-analysis attacks—foundational cryptanalysis.',
      where: 'Baghdad — Al-Kindi’s frequency analysis (9th c.)',
      when: 'Heavy European diplomatic use ~1400s–1700s; theory of breaking matured with statistical ideas',
      narrative:
        'You permute the alphabet: a **bijection** from plaintext letters to ciphertext letters. Same as Caesar but with an arbitrary permutation instead of a single rotation.',
    },
    math: {
      summary:
        'Let π be a permutation on *n* letters. Encrypt: C = π(P). Decrypt: P = π⁻¹(C). Keyspace size is *n*! (for English, 26! ≈ 2^88 permutations)—huge as a count, but language statistics collapse it.',
      formulas: [
        'Key: permutation π on {A,…,Z}; ciphertext letter c = π(p).',
        'Decryption uses the inverse permutation π⁻¹.',
      ],
    },
    implementationSteps: [
      'Choose a random or keyed permutation of your alphabet (each letter appears exactly once on the “cipher” side).',
      'Build lookup maps encryptMap[plain] and decryptMap[cipher] for O(1) per character.',
      'Encrypt by replacing each letter; pass digits/punctuation through or define a policy.',
      'Validate: permutation must be one-to-one (no duplicate ciphertext symbols).',
      'For analysis homework: count ciphertext letter frequencies and align to English ETAOIN….',
    ],
    flaws:
      'Patterns of language remain: single-letter frequencies, digrams (TH, HE), trigrams, double letters, and word lengths all leak. Short keys are not the issue—the permutation is huge—but **redundancy in human language** is. Homophonic substitution (multiple symbols for E) helps a little but still leaks structure.',
    classicalBreak:
      'For typical English messages of a few hundred letters, automated frequency and n-gram scoring recovers π in minutes to hours. Interactive solvers combine statistics with dictionary checks. Short messages are harder but often still breakable with crib dragging if you guess a word like THE or ATTACK.',
    quantumBreak:
      'Grover searches unstructured keys in ~√N time, but the effective attack is **not** enumerating 26! keys—it is hill-climbing on statistical plausibility. Quantum oracles for “is this full permutation correct?” are not the practical path. Quantum computers do not remove linguistic structure.',
    codeTitle: 'Map letters through a permutation table',
    code: `const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const shuffled  = 'QWERTYUIOPASDFGHJKLZXCVBNM' // example key

function substEncrypt(text) {
  const map = Object.fromEntries(
    [...alphabet].map((a, i) => [a, shuffled[i]])
  )
  return [...text.toUpperCase()]
    .map((c) => map[c] ?? c)
    .join('')
}`,
  },
  {
    id: 'vigenere',
    title: 'Vigenère cipher',
    timeline: '~1553–1860s',
    sortYear: 1553,
    kind: 'symmetric',
    effectivenessRank: 3,
    effectivenessLabel: 'So-so (depends on key)',
    usedFor:
      'Diplomatic and military messages when a repeating keyword was practical and frequency analysis was less widespread.',
    replacedBy:
      'Longer, non-repeating keys (conceptually OTP), then mechanical/electronic systems and modern ciphers.',
    summary:
      'You pick a short password and repeat it under the message; each password letter picks a different Caesar shift for that position—so the cipher keeps changing instead of one fixed shift. It was once thought unbreakable until people learned to detect the length of the repeating pattern and break each column like a simple Caesar.',
    origin: { lat: 48.8566, lng: 2.3522, label: 'France — Blaise de Vigenère (published 1586, Paris)' },
    invention: {
      who:
        '**Blaise de Vigenère** published the tabular form in *Traicté des Chiffres* (1586). Earlier related ideas (Bellaso) exist—history is messy.',
      where: 'France — Blaise de Vigenère (published 1586, Paris)',
      when: 'European peak reputation ~16th–19th century; broken in practice once periodicity analysis matured',
      narrative:
        'Think of *m* parallel Caesar ciphers: key letter Kᵢ sets shift for plaintext letter i; key repeats every |key| positions.',
    },
    math: {
      summary:
        'If key letter has index *k* and plaintext index *p*, ciphertext index *c* ≡ *p* + *k* (mod 26). Each key letter selects one of 26 Caesar streams.',
      formulas: [
        'cᵢ ≡ pᵢ + k_{i mod |key|} (mod 26)',
        'Period equals keyword length if keyword is not self-overlapping in a shortening way',
      ],
    },
    implementationSteps: [
      'Strip key to letters only; expand mentally as infinite repetition KEYKEYKEY….',
      'Walk plaintext left-to-right; for each letter, take next key letter (skip key chars for non-letters if you want alignment, or only advance on letters—pick a convention and document it).',
      'Add indices mod 26; subtract mod 26 to decrypt.',
      'To attack: estimate period with Kasiski or index of coincidence; split ciphertext into *m* columns; each column is Caesar.',
      'If key length ≈ message length and key is random: approaches OTP strength (see one-time pad).',
    ],
    flaws:
      'If the keyword is short or repeats, ciphertext is **periodic**. Kasiski examination (repeated fragments) and the **index of coincidence** estimate the period *m*, then each column is simple monoalphabetic/Caesar. Long repeating keys still leak periodic structure unless length matches message and randomness is high.',
    classicalBreak:
      'Short keys: seconds to minutes after period recovery. Key length 6 with a long message: automated solvers try periods 1…40, score columns as Caesar, then refine. Random key as long as the message: not breakable by this route (that is essentially OTP).',
    quantumBreak:
      'The weakness is **periodicity and key reuse**, not unstructured search over key strings. Shor/Grover do not replace Kasiski-style reasoning. If the key is truly random and never repeats, quantum adversaries still face one-time-pad assumptions (not ciphertext-only break).',
    codeTitle: 'Repeat keyword to pick shifts',
    code: `function vigenere(text, key) {
  const A = 65
  const k = key.toUpperCase().replace(/[^A-Z]/g, '')
  let ki = 0
  return [...text.toUpperCase()]
    .map((c) => {
      if (c < 'A' || c > 'Z') return c
      const shift = k.charCodeAt(ki % k.length) - A
      ki++
      const x = c.charCodeAt(0) - A
      return String.fromCharCode(A + ((x + shift) % 26))
    })
    .join('')
}`,
  },
  {
    id: 'otp',
    title: 'One-time pad',
    timeline: '~1917–present',
    sortYear: 1917,
    kind: 'symmetric',
    effectivenessRank: 8,
    effectivenessLabel: 'Perfect (if used correctly)',
    usedFor:
      'High-security channels where pre-shared key material is feasible (some military/intelligence use-cases).',
    replacedBy:
      'For most internet use, OTP is replaced by key exchange + symmetric encryption (e.g. PQC/ECDHE + AES) because distributing pad material is impractical.',
    summary:
      'You XOR each bit of the message with a bit from a pad that is as long as the message, truly random, and never used again—like covering a picture with noise where only someone with the identical noise sheet can subtract it off. Done right, no amount of computing power can recover the message from ciphertext alone; the hard part is safely delivering pads as long as all your secrets.',
    origin: { lat: 40.7128, lng: -74.006, label: 'USA — Gilbert Vernam (AT&T, 1917); Mauborgne (never reuse)' },
    invention: {
      who:
        '**Gilbert Vernam** (1917, AT&T) for the XOR teletype idea; **Joseph Mauborgne** argued pads must be random and **never reused**. Shannon later proved perfect secrecy.',
      where: 'USA — Gilbert Vernam (AT&T, 1917); Mauborgne (never reuse)',
      when: '1917 onward; Shannon’s proof ~1949',
      narrative:
        'Ciphertext is plaintext XOR’d with a pad of the same length. If the pad is uniform random, independent, and one-time, every plaintext of that length is equally likely given ciphertext—no information leaks.',
    },
    math: {
      summary:
        'For bits: cᵢ = pᵢ ⊕ kᵢ with kᵢ i.i.d. fair coin flips. XOR is involutory: pᵢ = cᵢ ⊕ kᵢ. For mod-26 letters, use addition mod 26 with uniform key letters—same idea.',
      formulas: ['c = p ⊕ k (bitwise XOR)', 'Decryption: p = c ⊕ k'],
    },
    implementationSteps: [
      'Generate pad from a **cryptographically secure** RNG (not rand()).',
      'Pad length ≥ plaintext length; if shorter, you must not repeat—generate more pad.',
      'Encrypt: XOR (bytes) or add mod alphabet size (letters).',
      'Destroy pad material after use; never reuse pad on a second message (two-time pad is breakable with crib dragging).',
      'Distribution problem: you must deliver as much secret key as you have secret data—impractical for the open web.',
    ],
    flaws:
      'Pad must be as long as **all** traffic you protect, never reused, and drawn from true randomness. Storage and physical transfer of pad material dominate cost. Any reuse (VENONA-style) or pseudo-random pad collapses security. Operational mistakes dominate real-world failure.',
    classicalBreak:
      'With correct use: **no** ciphertext-only information-theoretic break exists. If pad repeats, XORing two ciphertexts removes the key and exposes p₁ ⊕ p₂—often trivially broken with language. Bad RNG: pad may be predictable.',
    quantumBreak:
      'Still no ciphertext-only break against a proper OTP. Quantum key distribution (QKD) is a different topic—it secures **key transport**, not OTP math itself. If you reuse pads or leak key bits, quantum adversaries exploit the same human errors.',
    codeTitle: 'XOR bytes with secret pad (concept)',
    code: `function xorBytes(msg, pad) {
  if (msg.length !== pad.length) throw new Error('length mismatch')
  return Uint8Array.from(msg, (b, i) => b ^ pad[i])
}

// msg and pad must be same length; pad never reused.`,
  },
  {
    id: 'des',
    title: 'DES',
    timeline: '~1973–1999',
    sortYear: 1973,
    kind: 'symmetric',
    effectivenessRank: 4,
    effectivenessLabel: 'Obsolete',
    usedFor:
      'Banking, ATMs, and early commercial cryptography; historical influence on later standards.',
    replacedBy:
      '3DES as a stopgap, then AES as the modern symmetric standard (plus safer modes and authenticated encryption).',
    summary:
      'DES splits each 64-bit chunk into two halves and, for sixteen rounds, mixes one half with keyed scrambling and XORs into the other—ping-pong style—so influence spreads across the block. It was the first widely standardized modern block cipher, but its 56-bit key is far too small for today’s hardware; we keep it in lessons because the Feistel pattern influenced everything that followed.',
    origin: { lat: 41.2707, lng: -73.7776, label: 'IBM Yorktown Heights, NY — Feistel / DES design lineage' },
    invention: {
      who:
        'IBM team (including **Horst Feistel**); NSA influenced S-boxes; standardized as FIPS **DES** (NBS, 1977).',
      where: 'IBM Yorktown Heights, NY — Feistel / DES design lineage',
      when: 'Standard published 1977; practical brute-force demos by late 1990s',
      narrative:
        'The big idea is to keep the structure symmetric so encrypt and decrypt look alike: each round you run one half through a keyed scramble F, XOR the result into the other half, then swap roles. **Feistel** means decryption reuses the same F with round keys in reverse order—no special inverse function required.',
    },
    math: {
      summary:
        'Block size 64 bits, 56-bit key (+8 parity bits). Each round: (L,R) → (R, L ⊕ F(R, Kᵢ)). F uses expansion, XOR with subkey, S-boxes (nonlinear), permutation.',
      formulas: [
        "L' = R",
        "R' = L ⊕ F(R, Kᵢ)  — then swap roles next round",
      ],
    },
    implementationSteps: [
      'Implement PC-1/PC-2 permutations and subkey schedule from the standard (16 round keys).',
      'Build F(): expand 32→48, XOR with Ki, 8 S-boxes → 32 bits, P permutation.',
      'Run 16 Feistel rounds; apply initial/final permutations (IP/FP) per spec.',
      'Never roll your own DES for production—use AES—but implement once to learn Feistel vs SPN.',
      'Compare 3DES (EDE, larger effective key) and why birthday bounds on 64-bit blocks hurt huge volumes (Sweet32 class issues in legacy TLS).',
    ],
    flaws:
      '56-bit key invites brute force. 64-bit block size implies birthday bound ~2³² blocks for collision-style attacks in some modes when encrypting enormous traffic under one key. Design secrecy around S-boxes historically worried people, but differential/linear cryptanalysis research showed margins were tightened deliberately.',
    classicalBreak:
      'EFF’s Deep Crack (~1998) and COPACOBANA-class FPGAs showed DES keys fall within days given budget. Modern GPUs clusters can exhaust 2⁵⁶ keys for targeted jobs in reasonable wall-clock time. Hence AES and larger keys.',
    quantumBreak:
      '**Grover** search: unstructured key search in ~√(2⁵⁶) ≈ 2²⁸ “oracle queries” in a simplified model—still enormous in practice without a huge fault-tolerant QC. Quantum does **not** polynomially break DES like Shor breaks RSA; it just shifts symmetric security margins (~halve effective bits in rough threat planning).',
    codeTitle: 'Conceptual Feistel round (simplified)',
    code: `// One Feistel half-round: L' = R; R' = L XOR F(R, subkey)
function feistelHalf(L, R, F) {
  return { L: R, R: L ^ F }
}
// DES runs 16 rounds with a carefully designed F using S-boxes.`,
  },
  {
    id: 'aes',
    title: 'AES (Rijndael)',
    timeline: '~1997–2001 (selected → standardized)',
    sortYear: 1997,
    kind: 'symmetric',
    effectivenessRank: 7,
    effectivenessLabel: 'Modern standard',
    usedFor:
      'Bulk encryption everywhere: HTTPS/TLS record encryption, VPNs, disk encryption, messaging, and stored data.',
    replacedBy:
      'Not replaced in general—still current. When it changes, it’s usually the mode/protocol around AES (e.g., AEAD choices) or migration to other modern symmetric designs.',
    summary:
      'AES is the symmetric workhorse behind TLS, disk encryption, and most “encrypt this file with a password” flows: two parties share a secret key, then AES scrambles data in 128-bit chunks. Picture repeatedly stirring dye into dough—each “round” substitutes bytes, shuffles them around the block, mixes columns so one byte’s change spreads, then folds in key bits—so patterns from the plaintext are smeared out. Keys are 128, 192, or 256 bits; the famous step names are SubBytes, ShiftRows, MixColumns, and AddRoundKey, repeated about ten to fourteen times.',
    origin: { lat: 50.8798, lng: 4.7009, label: 'Belgium — Daemen & Rijmen (Rijndael), NIST AES selection' },
    invention: {
      who: '**Joan Daemen** and **Vincent Rijmen** (Rijndael).',
      where:
        'NIST AES competition (1997–2001); standardized as **FIPS-197** (Rijndael submission from Belgium).',
      when: 'Published as AES in 2001',
      narrative:
        'AES treats a 16-byte block as a 4×4 grid of bytes and, round after round, both confuses values (nonlinear S-box) and spreads them across the whole grid so local changes become global—like stirring until one drop of ink tints the whole bucket. **SPN** (substitution–permutation network) names that pattern: SubBytes, ShiftRows, MixColumns, then XOR with round key material.',
    },
    math: {
      summary:
        'State is 4×4 bytes in GF(2⁸). SubBytes is an affine transform over the field; MixColumns multiplies columns by a fixed MDS matrix; AddRoundKey XORs expanded key material.',
      formulas: [
        'Round (except last): SubBytes → ShiftRows → MixColumns → AddRoundKey',
        'Last round drops MixColumns',
      ],
    },
    implementationSteps: [
      'Implement SubBytes with the AES S-box and inverse for decryption.',
      'ShiftRows: row r rotates left by r positions.',
      'MixColumns as matrix multiply in GF(2⁸) with fixed polynomial; inverse for decrypt.',
      'Key expansion: generate round words; handle 10/12/14 rounds for 128/192/256-bit keys.',
      'Use a **mode** (CTR, GCM) for multi-block messages; prefer **AEAD** (e.g. AES-GCM) for confidentiality + integrity.',
    ],
    flaws:
      'No practical break of full AES with standard key sizes. Risks are almost always **usage**: ECB mode leaks patterns, nonce reuse in GCM is catastrophic, weak passwords → keys, side-channel leaks in software (timing in table lookups—mitigated by bitslicing or hardware), and **Grover** margin planning for quantum threat models.',
    classicalBreak:
      'Best public attacks shave off a few rounds in academic models; full AES-128 at 10 rounds is not broken. Energy/cost to brute-force 2¹²⁸ keys is absurdly beyond planetary scale. AES-256 is even larger.',
    quantumBreak:
      '**Grover** suggests ~√ speedup for unstructured key search: planners sometimes **halve** symmetric bit-strength in rough comparisons (AES-128 ~ “64-bit classical feel” for worst-case planning—not literal seconds). No known polynomial quantum break of AES itself, unlike Shor vs RSA.',
    codeTitle: 'High-level round structure (pseudocode)',
    code: `// Each round (simplified naming):
function aesRound(state, roundKey) {
  state = subBytes(state)      // non-linear S-box per byte
  state = shiftRows(state)     // permute rows
  state = mixColumns(state)    // linear mix (omitted last round)
  state = addRoundKey(state, roundKey) // XOR with expanded key
  return state
}`,
  },
  {
    id: 'rsa',
    title: 'RSA & public-key idea',
    timeline: '~1977–present',
    sortYear: 1977,
    kind: 'asymmetric',
    effectivenessRank: 6,
    effectivenessLabel: 'Strong today (not PQ-safe)',
    usedFor:
      'Certificates, signatures, key exchange (historically), and public-key encryption in systems like HTTPS, PGP, and SSH.',
    replacedBy:
      'ECC (elliptic-curve crypto) is common today for efficiency; post-quantum KEMs/signatures are being adopted for future quantum resistance.',
    summary:
      'You publish a public key like an open padlock anyone can snap shut, but only your private key opens it—so strangers can encrypt mail to you or check your signature without ever learning your secret. Under the hood it uses clever math with huge numbers (multiplying two primes is easy; factoring the product is believed hard for classical computers). Real systems wrap short messages in padding and usually use RSA only to set up a fast symmetric key.',
    origin: { lat: 42.3601, lng: -71.0923, label: 'MIT — Rivest, Shamir, Adleman (1977 public)' },
    invention: {
      who:
        '**Ron Rivest, Adi Shamir, Leonard Adleman** (1978 paper). **Clifford Cocks** (GCHQ, 1973) independently discovered equivalent math; declassified later.',
      where: 'MIT — Rivest, Shamir, Adleman (1977 public)',
      when: 'Public description 1977–1978',
      narrative:
        'RSA’s trapdoor is grade-school arithmetic pushed to astronomical sizes: multiplying two huge primes to get N is quick, but splitting N back into those primes is believed infeasible for classical computers at modern sizes. Keys pick exponents e and d tied to φ(N) so raising a message to e and then to d (mod N) lands you back where you started—encrypt with the public e, decrypt with the private d.',
    },
    math: {
      summary:
        'Pick primes p,q; n=pq; φ(n)=(p−1)(q−1). Choose e coprime to φ(n); compute d ≡ e⁻¹ (mod φ(n)). Public (e,n), private d (and factors).',
      formulas: [
        'Encrypt: c ≡ mᵉ (mod n)',
        'Decrypt: m ≡ cᵈ (mod n)',
        'RSA works for m coprime to n; padding (OAEP) and large n are mandatory in practice',
      ],
    },
    implementationSteps: [
      'Generate two large random primes (use library—never naive prime search for prod).',
      'Compute n and φ(n); pick standard e (65537) if gcd(e,φ)=1.',
      'Compute d with extended Euclidean algorithm.',
      'For real encryption: encode message with **OAEP**, use modular exponentiation (square-and-multiply), constant-time code.',
      'For signatures: hash message, sign hash with private key; verify with public key (PSS padding).',
    ],
    flaws:
      'Security reduces to factoring n (and related problems). Tiny keys, bad padding (no OAEP), small e with no padding (broadcast attacks), partial key leak, or flawed RNG for primes are catastrophic. Pure textbook RSA on integers is not secure—**padding and hybrid encryption** (RSA → AES key) dominate TLS.',
    classicalBreak:
      '2048-bit RSA is not publicly factored today; GNFS complexity grows sub-exponentially but still far beyond casual effort. Nation-scale resources could target specific keys with huge clusters—still wildly expensive if parameters are modern. ECC often replaces RSA for performance at similar classical strength.',
    quantumBreak:
      '**Shor’s algorithm** factors integers in polynomial time on a large **fault-tolerant** quantum computer, breaking RSA and (separately) discrete log ECC. Calendar-year timelines are uncertain; **PQC migration** is about captured ciphertext today decrypted tomorrow (“harvest now, decrypt later”).',
    codeTitle: 'Toy RSA with tiny primes (education only)',
    code: `const p = 17, q = 19
const n = p * q          // 323 — real RSA uses 2048+ bit n
const phi = (p - 1) * (q - 1)
const e = 7              // public exponent (coprime to phi)
// Find d with e*d ≡ 1 (mod phi)  →  d = 247 for this toy

function modPow(a, exp, m) {
  let r = 1n
  let b = BigInt(a) % m
  let e = BigInt(exp)
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m
    b = (b * b) % m
    e >>= 1n
  }
  return Number(r)
}

// encrypt m: c = m^e mod n   decrypt: m = c^d mod n`,
  },
  {
    id: 'pqc',
    title: 'Post-quantum cryptography',
    timeline: '~2016–2024+ (standardization → rollout)',
    sortYear: 2016,
    kind: 'asymmetric',
    effectivenessRank: 9,
    effectivenessLabel: 'Future-facing',
    usedFor:
      'Replacing or augmenting RSA/ECC in key exchange and signatures so captured traffic stays safe even against future quantum computers.',
    replacedBy:
      'This is the replacement path for RSA/ECC in many protocols; early deployments are often hybrid (classical + PQ).',
    summary:
      'Post-quantum crypto is a new generation of public-key math (lattices, big hashes, error-correcting codes, and similar structures) chosen so today’s best quantum algorithms do not get the easy wins they get against RSA and ECC. Think of retiring a lock design because someone invented a master key—PQC is the new lock. Browsers and VPNs often run classical and PQ key exchange together (“hybrid”) during the transition.',
    origin: { lat: 39.1357, lng: -77.2203, label: 'NIST (Gaithersburg, MD) — PQC standardization process' },
    invention: {
      who:
        '**NIST PQC process** (2016–2024+) selected modules-lattice KEM (**ML-KEM**/Kyber) and signatures (**ML-DSA**, **SLH-DSA**). Many international researchers contributed schemes and analysis.',
      where: 'NIST (Gaithersburg, MD) — PQC standardization process',
      when: 'Standards published in 2024; industry rollout ongoing',
      narrative:
        'Where RSA leans on “hard factoring,” PQ schemes lean on other problems—finding short vectors in noisy lattices, big hash trees, decoding random codes—that today’s quantum shortcuts do not obviously crack. **Kyber-style** KEMs wrap a small shared secret inside structured linear algebra with noise; **SPHINCS+** leans almost entirely on hash functions. The field is younger than RSA, so standards and libraries matter more than ever.',
    },
    math: {
      summary:
        'Example lattice idea (cartoon): public key hides a structured lattice with a trapdoor; encapsulation adds noise so only the holder of the trapdoor recovers the shared secret. Real Kyber uses module-LWE over polynomial rings—implementations are subtle.',
      formulas: [
        'KEM API: (c, ss) = Encaps(pk); ss = Decaps(sk, c)',
        'TLS often: ECDHE shared secret ⊕ KDF(PQ shared secret) for hybrid secrecy',
      ],
    },
    implementationSteps: [
      'Do **not** invent parameters—use **standardized** ML-KEM / ML-DSA byte formats.',
      'Integrate a vetted library (e.g. liboqs bindings, BoringSSL/OpenSSL PQ builds) in your language.',
      'Prefer **hybrid** key agreement (classical + PQ) during transition.',
      'Plan for larger keys/ciphertexts: measure handshake RTT and certificate sizes.',
      'Follow NIST / IETF guidance on algorithm suites and deprecation timelines.',
    ],
    flaws:
      'Younger deployed history than RSA; implementations must resist side channels. Keys and messages are bigger than ECC. Protocol ecosystem complexity—every TLS client/server must agree. Some schemes (stateful hashes) need careful state management if used.',
    classicalBreak:
      'Security targets are aligned with best known **classical** attacks on each family (lattice reduction, Gröbner bases where relevant, etc.). Parameters chosen with margins; cryptanalysis continues openly.',
    quantumBreak:
      'Goal is resistance to **Shor** and related hidden-subgroup attacks that break RSA/ECC. No polynomial quantum break is known for the standardized lattice KEM problem at chosen parameters, but research is active—crypto agility (algorithm negotiation) matters.',
    codeTitle: 'Concept: Kyber-style encapsulation (not real params)',
    code: `// Real Kyber uses structured lattices; conceptually:
// 1) Server publishes public key pk
// 2) Client samples random shared secret ss
// 3) Client sends ciphertext c = Encaps(pk, ss)
// 4) Server decapsulates: ss = Decaps(sk, c)
// TLS may combine ECDHE with a PQ KEM for defense in depth.`,
  },
]
