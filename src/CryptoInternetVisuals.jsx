/** Straight left-to-right: who sends what, who can read it. */
export function VisualPublicKeyInternet() {
  return (
    <svg viewBox="0 0 520 252" className="crypto-svg" role="img" aria-label="Public key lets browser lock a message only the server can open">
      <text x="16" y="24" fill="#e2e8f0" fontSize="14" fontWeight="700">
        Public key on the web (idea)
      </text>
      <text x="16" y="44" fill="#94a3b8" fontSize="12">
        Everyone can see the public key.
      </text>
      <text x="16" y="60" fill="#94a3b8" fontSize="12">
        Only the server has the private key to unlock what was locked with it.
      </text>

      <rect x="24" y="84" width="100" height="56" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      <text x="74" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700">
        You
      </text>
      <text x="74" y="128" textAnchor="middle" fill="#64748b" fontSize="10">
        (browser)
      </text>

      <rect x="396" y="84" width="100" height="56" rx="10" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
      <text x="446" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700">
        Server
      </text>
      <text x="446" y="128" textAnchor="middle" fill="#64748b" fontSize="10">
        (has private key)
      </text>

      <line x1="130" y1="112" x2="210" y2="112" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 5">
        <animate attributeName="stroke-dashoffset" from="0" to="22" dur="1.5s" repeatCount="indefinite" />
      </line>
      <polygon points="210,112 200,107 200,117" fill="#22d3ee" />
      <circle r="4" fill="#22d3ee">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M 130 112 L 210 112" />
      </circle>
      <text x="170" y="104" textAnchor="middle" fill="#67e8f9" fontSize="10">
        ① cert + public key
      </text>

      <line x1="310" y1="112" x2="390" y2="112" stroke="#818cf8" strokeWidth="2" strokeDasharray="6 5">
        <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.5s" repeatCount="indefinite" />
      </line>
      <polygon points="310,112 320,107 320,117" fill="#818cf8" />
      <circle r="4" fill="#c4b5fd">
        <animateMotion dur="2.4s" begin="0.4s" repeatCount="indefinite" path="M 310 112 L 390 112" />
      </circle>
      <text x="350" y="104" textAnchor="middle" fill="#c4b5fd" fontSize="10">
        ② session secret (locked)
      </text>

      <text x="260" y="116" textAnchor="middle" fill="#64748b" fontSize="10">
        Internet
      </text>

      <rect x="24" y="158" width="472" height="52" rx="8" fill="rgba(15,23,42,0.6)" stroke="#334155" />
      <text x="36" y="180" fill="#94a3b8" fontSize="11">
        After the handshake, bulk data is usually encrypted with a fast symmetric cipher
      </text>
      <text x="36" y="196" fill="#94a3b8" fontSize="11">
        (e.g. AES), not RSA for every byte.
      </text>
    </svg>
  )
}

/** RSA broken if you can factor n into p and q. */
export function VisualQuantumShor() {
  return (
    <svg viewBox="0 0 480 248" className="crypto-svg" role="img" aria-label="Shor factors large numbers faster than classical methods">
      <text x="16" y="24" fill="#e2e8f0" fontSize="14" fontWeight="700">
        Why Shor matters for RSA
      </text>
      <text x="16" y="44" fill="#94a3b8" fontSize="12">
        RSA public modulus n = p × q. Recovering p and q breaks the key.
      </text>
      <text x="16" y="60" fill="#94a3b8" fontSize="12">
        Shor’s algorithm is built to factor large n on a big enough quantum computer.
      </text>

      <rect x="40" y="84" width="120" height="40" rx="8" fill="#1e293b" stroke="#64748b" />
      <text x="100" y="110" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600">
        n = p·q
      </text>

      <text x="180" y="110" fill="#94a3b8" fontSize="20">
        ?
        <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" repeatCount="indefinite" />
      </text>

      <rect x="220" y="84" width="100" height="40" rx="8" fill="#1e1b4b" stroke="#818cf8" />
      <text x="270" y="110" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="600">
        Classical: slow
      </text>

      <rect x="340" y="84" width="120" height="40" rx="8" fill="#14532d" stroke="#4ade80" strokeWidth="2">
        <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </rect>
      <text x="400" y="110" textAnchor="middle" fill="#bbf7d0" fontSize="11" fontWeight="600">
        Shor (future QC)
      </text>

      <text x="16" y="156" fill="#64748b" fontSize="11">
        AES is different: Grover only speeds up guessing keys (~√),
      </text>
      <text x="16" y="172" fill="#64748b" fontSize="11">
        not “instant break” like factoring in the RSA story.
      </text>
    </svg>
  )
}

/** Compare search space width, not exact times. */
export function VisualGroverAES() {
  return (
    <svg viewBox="0 0 480 218" className="crypto-svg" role="img" aria-label="Grover reduces exponent of brute force search for AES key">
      <text x="16" y="24" fill="#e2e8f0" fontSize="14" fontWeight="700">
        Grover and AES-128 (intuition)
      </text>
      <text x="16" y="44" fill="#94a3b8" fontSize="12">
        Think of the key as a needle in a huge haystack.
      </text>
      <text x="16" y="60" fill="#94a3b8" fontSize="12">
        Grover shrinks the exponent in the search size (rough picture: 2^128 → ~2^64 queries).
      </text>
      <text x="16" y="76" fill="#94a3b8" fontSize="12">
        Still impractical today; planners use longer keys.
      </text>

      <text x="16" y="102" fill="#64748b" fontSize="10">
        Classical brute-force tries (conceptual bar length)
      </text>
      <rect x="16" y="108" width="440" height="14" rx="4" fill="#1e293b" stroke="#475569" />
      <rect x="16" y="108" width="440" height="14" rx="4" fill="rgba(148,163,184,0.35)">
        <animate attributeName="opacity" values="0.45;1;0.45" dur="2.2s" repeatCount="indefinite" />
      </rect>

      <text x="16" y="142" fill="#64748b" fontSize="10">
        After Grover-style speedup (cartoon: much shorter bar)
      </text>
      <rect x="16" y="148" width="440" height="14" rx="4" fill="#1e293b" stroke="#475569" />
      <rect x="16" y="148" height="14" rx="4" fill="rgba(251,146,60,0.55)" width="220">
        <animate attributeName="width" values="200;240;200" dur="2.4s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

/** KEM in three boxes; lattice as “hard math problem” sketch. */
export function VisualPQC() {
  return (
    <svg viewBox="0 0 520 268" className="crypto-svg" role="img" aria-label="Post quantum key exchange produces a shared secret">
      <text x="16" y="24" fill="#e2e8f0" fontSize="14" fontWeight="700">
        Post-quantum key exchange (KEM)
      </text>
      <text x="16" y="44" fill="#94a3b8" fontSize="12">
        Goal: agree on a secret session key over the internet using math
      </text>
      <text x="16" y="60" fill="#94a3b8" fontSize="12">
        problems we hope stay hard even for quantum computers.
      </text>

      <rect x="24" y="78" width="130" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" />
      <text x="89" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700">
        Client
      </text>
      <text x="89" y="116" textAnchor="middle" fill="#64748b" fontSize="9">
        uses public pk
      </text>

      <text x="168" y="108" fill="#94a3b8" fontSize="11">
        Encaps(pk) →
      </text>

      <rect x="248" y="78" width="100" height="52" rx="8" fill="rgba(244,114,182,0.12)" stroke="#f472b6" strokeWidth="1.5">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
      </rect>
      <text x="298" y="108" textAnchor="middle" fill="#fbcfe8" fontSize="11" fontWeight="700">
        ciphertext c
      </text>

      <text x="362" y="108" fill="#94a3b8" fontSize="11">
        → Decaps(sk)
      </text>

      <rect x="432" y="78" width="64" height="52" rx="8" fill="#0f172a" stroke="#a78bfa" />
      <text x="464" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700">
        Server
      </text>

      <text x="16" y="156" fill="#64748b" fontSize="11">
        Both sides end with the same short secret → then derive AES (or similar) for data.
      </text>

      <text x="16" y="184" fill="#67e8f9" fontSize="10" fontWeight="700">
        Many schemes use structured lattices
      </text>
      <text x="16" y="200" fill="#64748b" fontSize="10">
        Cartoon: lots of grid points; a “short” secret vector should be hard
      </text>
      <text x="16" y="214" fill="#64748b" fontSize="10">
        to find without the private key.
      </text>
      {[0, 1, 2, 3].flatMap((i) =>
        [0, 1, 2].map((j) => {
          const idx = i * 3 + j
          return (
            <circle key={`${i}-${j}`} cx={300 + i * 14} cy={196 + j * 12} r="2" fill="rgba(148,163,184,0.5)">
              <animate
                attributeName="opacity"
                values="0.25;0.95;0.25"
                dur="2.6s"
                begin={`${idx * 0.15}s`}
                repeatCount="indefinite"
              />
            </circle>
          )
        }),
      )}
      <circle cx="342" cy="208" r="4" fill="#f472b6" opacity="0.9">
        <animate attributeName="r" values="3.5;5.5;3.5" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle r="3.5" fill="#22d3ee" opacity="0.9">
        <animateMotion
          dur="3.5s"
          repeatCount="indefinite"
          path="M 89 104 L 298 104 L 464 104 L 298 104 L 89 104"
        />
      </circle>
      <text x="356" y="204" fill="#94a3b8" fontSize="9">
        secret
      </text>
      <text x="356" y="216" fill="#94a3b8" fontSize="9">
        point (idea)
      </text>
    </svg>
  )
}
