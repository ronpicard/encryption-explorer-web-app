import { GLOBE_LABELS } from './globeLabels'

/** NASA-style equirectangular map (three.js examples mirror). */
const EARTH_MAP_URL =
  'https://raw.githubusercontent.com/mrdoob/three.js/r182/examples/textures/planets/earth_atmos_2048.jpg'

/** Equirectangular: x = lng, y = lat in SVG viewBox 0..360 × 0..180 (x = lng+180, y = 90−lat). */
function latLngToPercent(lat, lng) {
  return {
    left: ((Number(lng) + 180) / 360) * 100,
    top: ((90 - Number(lat)) / 180) * 100,
  }
}

/** Prime meridian (x=180) and equator (y=90) meet at geographic center of full equirectangular map. */
function FlatGraticule({ stepDeg = 15 }) {
  const meridians = []
  for (let lng = -180; lng < 180; lng += stepDeg) {
    if (Math.abs(lng) < 0.001) continue
    const x = lng + 180
    meridians.push(
      <line
        key={`m-${lng}`}
        x1={x}
        y1={0}
        x2={x}
        y2={180}
        stroke="rgba(148, 163, 184, 0.35)"
        strokeWidth={0.2}
        opacity={0.55}
      />,
    )
  }

  const parallels = []
  for (let lat = -90; lat <= 90; lat += stepDeg) {
    if (Math.abs(Math.abs(lat) - 90) < 0.01) continue
    if (Math.abs(lat) < 0.001) continue
    const y = 90 - lat
    parallels.push(
      <line
        key={`p-${lat}`}
        x1={0}
        y1={y}
        x2={360}
        y2={y}
        stroke="rgba(148, 163, 184, 0.35)"
        strokeWidth={0.2}
        opacity={0.55}
      />,
    )
  }

  return (
    <svg
      className="globe-flat__graticule"
      viewBox="0 0 360 180"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="cyberMeridianGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="cyberEquatorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e879f9" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#e879f9" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e879f9" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {meridians}
      {parallels}
      {/* Prime meridian (0°) + equator (0°): cross at geographic center of full map */}
      <line x1={180} y1={0} x2={180} y2={180} stroke="url(#cyberMeridianGlow)" strokeWidth={0.85} />
      <line x1={0} y1={90} x2={360} y2={90} stroke="url(#cyberEquatorGlow)" strokeWidth={0.85} />
    </svg>
  )
}

/** Soft blobs ~ by continent — colorizes grayscale land via mix-blend-mode (approximate positions). */
function CyberRegionTints() {
  return (
    <div className="globe-flat__region-tints" aria-hidden>
      <span className="globe-flat__region globe-flat__region--americas" />
      <span className="globe-flat__region globe-flat__region--eurasia" />
      <span className="globe-flat__region globe-flat__region--africa" />
      <span className="globe-flat__region globe-flat__region--oceania" />
      <span className="globe-flat__region globe-flat__region--polar" />
    </div>
  )
}

function CompassRose() {
  return (
    <div className="globe-flat__compass" aria-hidden="true">
      <svg className="globe-flat__compass-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="rgba(0, 0, 0, 0.88)" stroke="rgba(34, 211, 238, 0.35)" strokeWidth="1.25" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="0.75" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(232, 121, 249, 0.25)" strokeWidth="0.75" />
        <polygon points="50,10 44,42 56,42" fill="#22d3ee" stroke="#a5f3fc" strokeWidth="0.5" />
        <polygon points="50,90 56,58 44,58" fill="#525252" />
        <polygon points="90,50 58,56 58,44" fill="#525252" />
        <polygon points="10,50 42,44 42,56" fill="#525252" />
        <text x="50" y="30" textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">
          N
        </text>
        <text x="50" y="88" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">
          S
        </text>
        <text x="78" y="54" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">
          E
        </text>
        <text x="22" y="54" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">
          W
        </text>
      </svg>
    </div>
  )
}

function LocationMarker({ lat, lng }) {
  const p = latLngToPercent(lat, lng)
  return (
    <div className="globe-flat__marker" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
      <span className="globe-flat__marker-ring globe-flat__marker-ring--delay" />
      <span className="globe-flat__marker-ring" />
      <span className="globe-flat__marker-core" />
    </div>
  )
}

export default function InventionGlobe({ lat, lng, placeLabel, embedded = false }) {
  const showPin = Number.isFinite(lat) && Number.isFinite(lng)

  return (
    <div
      className={`globe-panel ${embedded ? 'globe-panel--embedded' : 'globe-panel--hero'} globe-panel--cyber-map`}
      role="img"
      aria-label={
        placeLabel
          ? `Stylized world map: ${placeLabel}. Equator and prime meridian cross at the map center; marker shows the topic location.`
          : 'Stylized black-and-white world map with neon accents. North at top.'
      }
    >
      <div
        className={`globe-panel__canvas globe-flat__frame ${
          embedded ? 'globe-panel__canvas--embedded' : 'globe-panel__canvas--hero'
        }`}
      >
        <div className="globe-flat__surface">
          <div className="globe-flat__map-wrap">
            <img className="globe-flat__img" src={EARTH_MAP_URL} alt="" draggable={false} />
            <CyberRegionTints />
            <div className="globe-flat__scanlines" aria-hidden />
          </div>
          <div className="globe-flat__overlay">
            <FlatGraticule />
            {!embedded
              ? GLOBE_LABELS.map((L) => {
                  const p = latLngToPercent(L.lat, L.lng)
                  return (
                    <div
                      key={`${L.name}-${L.country}`}
                      className="globe-label globe-flat__label"
                      style={{ left: `${p.left}%`, top: `${p.top}%` }}
                    >
                      <span className="globe-label__city">{L.name}</span>
                      <span className="globe-label__country">{L.country}</span>
                    </div>
                  )
                })
              : null}
            {showPin ? <LocationMarker lat={lat} lng={lng} /> : null}
            <CompassRose />
          </div>
        </div>
      </div>
      {placeLabel ? <p className="globe-panel__caption">{placeLabel}</p> : null}
    </div>
  )
}
