/**
 * Runtime logo → point-cloud extraction.
 *
 * The uploaded logo PNGs are the single source of truth for every branded
 * shape in the experience. We load the PNG, draw it to an offscreen canvas,
 * and derive a luminance mask (the logos sit on pure black, so brightness IS
 * the alpha mask). Every sufficiently bright pixel becomes a particle that
 * keeps its original color. Nothing is manually recreated.
 */

export type LogoPointCloud = {
  /** World-space xyz per point, centered on origin */
  positions: Float32Array
  /** RGB per point, sampled from the logo pixels */
  colors: Float32Array
  /** Random unit-ish scatter vector per point (for assembly animation) */
  scatter: Float32Array
  count: number
  /** World width / height of the sampled region */
  width: number
  height: number
}

type SampleOptions = {
  /** Sampled sub-region of the image, as fractions 0..1 */
  region?: { x0: number; y0: number; x1: number; y1: number }
  /** Desired world-unit width of the resulting cloud */
  worldWidth: number
  /** Approximate max particle count (controls sampling stride) */
  maxPoints?: number
  /** Luminance threshold 0..255 below which pixels are ignored */
  threshold?: number
}

const cache = new Map<string, Promise<LogoPointCloud>>()

export function loadLogoPoints(
  src: string,
  opts: SampleOptions,
): Promise<LogoPointCloud> {
  const key = `${src}|${JSON.stringify(opts)}`
  const hit = cache.get(key)
  if (hit) return hit

  const promise = new Promise<LogoPointCloud>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        resolve(sample(img, opts))
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error(`Failed to load logo: ${src}`))
    img.src = src
  })
  cache.set(key, promise)
  return promise
}

function sample(img: HTMLImageElement, opts: SampleOptions): LogoPointCloud {
  const { region = { x0: 0, y0: 0, x1: 1, y1: 1 }, worldWidth, maxPoints = 7000, threshold = 40 } = opts

  // Sample close to native resolution (never upscale) so dot placement
  // follows the true letterform edges; cap the long edge for cheap reads.
  const regionW = (region.x1 - region.x0) * img.naturalWidth
  const regionH = (region.y1 - region.y0) * img.naturalHeight
  const maxEdge = 720
  const scale = Math.min(1, maxEdge / Math.max(regionW, regionH))
  const w = Math.max(2, Math.round(regionW * scale))
  const h = Math.max(2, Math.round(regionH * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2D context unavailable')

  ctx.drawImage(
    img,
    region.x0 * img.naturalWidth,
    region.y0 * img.naturalHeight,
    regionW,
    regionH,
    0,
    0,
    w,
    h,
  )
  const data = ctx.getImageData(0, 0, w, h).data

  // First pass: count candidate pixels to pick a stride hitting ~maxPoints
  let candidates = 0
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
    if (lum > threshold) candidates++
  }
  const keepEvery = Math.max(1, Math.ceil(candidates / maxPoints))

  const positions: number[] = []
  const colors: number[] = []
  const scatter: number[] = []
  const unit = worldWidth / w
  const worldHeight = h * unit
  let seen = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const lum = r * 0.299 + g * 0.587 + b * 0.114
      if (lum <= threshold) continue
      if (seen++ % keepEvery !== 0) continue

      // Center the cloud on origin, +y up. Keep jitter minimal so the
      // letterforms stay crisp — heavy jitter reads as a smudged logo.
      positions.push(
        (x - w / 2) * unit + (Math.random() - 0.5) * unit * 0.25,
        (h / 2 - y) * unit + (Math.random() - 0.5) * unit * 0.25,
        (Math.random() - 0.5) * unit * 0.3,
      )
      // Lift color slightly so dim gradient pixels still read
      const cr = r / 255
      const cg = g / 255
      const cb = b / 255
      const boost = 0.35 + 0.65 * Math.min(1, lum / 200)
      colors.push(
        Math.min(1, cr + 0.12) * boost + cr * (1 - boost),
        Math.min(1, cg + 0.12) * boost + cg * (1 - boost),
        Math.min(1, cb + 0.12) * boost + cb * (1 - boost),
      )
      scatter.push(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      )
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    scatter: new Float32Array(scatter),
    count: positions.length / 3,
    width: worldWidth,
    height: worldHeight,
  }
}
