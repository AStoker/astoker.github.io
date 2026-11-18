// Regenerates src/assets/mustaches.ts, every mustache on my site.
//
//   node tools/generate-mustache.ts
//
// Every mustache is drawn the same way: a centreline for the right half, plus how
// far the hair extends above and below that line along the way. The script turns
// that into one filled outline. The site mirrors it to get the left half.
//
// To reshape one, I edit its entry in STYLES and run the script. To add a new kind,
// add an entry; it becomes available everywhere as <MustacheIcon kind="..."> and
// <StacheCharacter kind="...">, and joins the confetti.
//
// Coordinates: a 120-unit-wide box, centre at x = 60, nose sitting at about y = 12.
// Centrelines start a little left of centre so the two halves overlap and blend.
//
//   centerline  cubic bezier segments [start, control, control, end]
//   top/bottom  [position 0..1 along the line, thickness on that side]
//   fringe      optional scalloped lower edge (bristles)

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

type Point = [x: number, y: number]
/** One cubic bézier: start, two control points, end. */
type Segment = [start: Point, control1: Point, control2: Point, end: Point]
/** How thick the hair is at a point along the centreline: [position 0..1, thickness]. */
type Key = [position: number, thickness: number]

/** How to draw one kind of mustache: its right half, as a line with hair either side. */
interface Style {
	/** The middle of the right half, as one or more joined bézier segments. */
	centerline: Segment[]
	/** How far the hair reaches above the line, along its length. */
	top: Key[]
	/** How far the hair reaches below the line, along its length. */
	bottom: Key[]
	/** A scalloped lower edge (bristles), from `from` to `to` along the line. */
	fringe?: { from: number; to: number; teeth: number; depth: number }
	/** Points along each edge of the outline. More for fiddly shapes. */
	samples?: number
}

const STYLES = {
	// Mine. Neat, full and straight: stops at the corners of the mouth.
	chevron: {
		centerline: [[[56, 16.2], [66, 15.6], [79, 17.2], [91.5, 23.6]]],
		top: [[0, 4.6], [0.28, 6.4], [0.7, 4.7], [1, 1.3]],
		bottom: [[0, 3.2], [0.3, 5.4], [0.72, 4.3], [1, 1.3]],
	},

	// One long sagging sweep from the centre out to a curl.
	handlebar: {
		centerline: [
			[[56, 16.4], [68, 16.4], [84, 18.6], [95, 22.6]],
			[[95, 22.6], [102, 25.2], [111.6, 23.6], [113.6, 17.2]],
			[[113.6, 17.2], [114.5, 12], [109.2, 10.4], [108.2, 13.8]],
		],
		top: [[0, 3.6], [0.12, 6.2], [0.32, 5.4], [0.55, 3.1], [0.78, 1.7], [1, 0.75]],
		bottom: [[0, 3], [0.14, 5.6], [0.34, 5.2], [0.58, 3], [0.78, 1.7], [1, 0.75]],
	},

	// Big, bushy, and drooping well past the lip.
	walrus: {
		centerline: [[[56, 17.4], [68, 16.2], [86, 18.5], [93.5, 33]]],
		top: [[0, 4.6], [0.3, 7.2], [0.7, 6], [1, 1.7]],
		bottom: [[0, 4.6], [0.3, 9.6], [0.72, 7.2], [1, 1.7]],
		fringe: { from: 0.05, to: 0.93, teeth: 6, depth: 0.13 },
		samples: 150,
	},

	// Across the lip, then straight down both sides of the mouth.
	horseshoe: {
		centerline: [
			[[56, 16.8], [70, 16.2], [88, 15.4], [90, 25]],
			[[90, 25], [91.2, 31], [90.8, 40], [90.2, 47]],
		],
		top: [[0, 3.8], [0.22, 4.8], [0.5, 4.5], [1, 3.1]],
		bottom: [[0, 3.4], [0.22, 4.6], [0.5, 4.3], [1, 3.1]],
	},

	// A thin, tidy line.
	pencil: {
		centerline: [[[56, 19.4], [68, 18.4], [81, 18.8], [93, 22.6]]],
		top: [[0, 1.5], [0.4, 2.1], [1, 0.45]],
		bottom: [[0, 1.5], [0.4, 2.1], [1, 0.45]],
	},

	// Thin, with long points swept straight up.
	dali: {
		centerline: [
			[[56, 18.8], [70, 18.8], [88, 23], [99, 17]],
			[[99, 17], [105, 13.6], [108.6, 6], [109, -3]],
		],
		top: [[0, 1.8], [0.25, 2.7], [0.6, 1.6], [1, 0.3]],
		bottom: [[0, 1.8], [0.25, 2.7], [0.6, 1.6], [1, 0.3]],
	},
} satisfies Record<string, Style>

const DENSE = 240 // samples per bezier segment when measuring the centreline
const DEFAULT_SAMPLES = 72 // points along each edge of the finished outline

const bezier = (a: Point, b: Point, c: Point, d: Point, t: number): Point => {
	const u = 1 - t
	const axis = (i: 0 | 1) => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i]
	return [axis(0), axis(1)]
}

/** A smooth curve through [position, value] keys that never overshoots them. */
function curve(keys: Key[]): (x: number) => number {
	const xs = keys.map((k) => k[0])
	const ys = keys.map((k) => k[1])
	const n = keys.length
	const d: number[] = []
	for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))
	const m = [d[0]]
	for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2)
	m.push(d[n - 2])
	for (let i = 0; i < n - 1; i++) {
		if (d[i] === 0) {
			m[i] = m[i + 1] = 0
			continue
		}
		const a = m[i] / d[i]
		const b = m[i + 1] / d[i]
		const h = Math.hypot(a, b)
		if (h > 3) {
			m[i] = (3 / h) * a * d[i]
			m[i + 1] = (3 / h) * b * d[i]
		}
	}
	return (x: number) => {
		let i = 0
		while (i < n - 2 && x > xs[i + 1]) i++
		const h = xs[i + 1] - xs[i]
		const t = Math.min(1, Math.max(0, (x - xs[i]) / h))
		const t2 = t * t
		const t3 = t2 * t
		return (
			(2 * t3 - 3 * t2 + 1) * ys[i] +
			(t3 - 2 * t2 + t) * h * m[i] +
			(-2 * t3 + 3 * t2) * ys[i + 1] +
			(t3 - t2) * h * m[i + 1]
		)
	}
}

/** Turns a style into the outline of its right half, and the bounds of the whole mustache. */
function build(style: Style): { half: string; box: number[] } {
	// Measure the centreline.
	const dense: Point[] = []
	style.centerline.forEach((seg, i) => {
		for (let k = i ? 1 : 0; k <= DENSE; k++) dense.push(bezier(...seg, k / DENSE))
	})
	const lengths = [0]
	for (let i = 1; i < dense.length; i++) {
		lengths.push(lengths[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]))
	}
	const total = lengths[lengths.length - 1]

	// Walk it in equal steps, noting position and direction at each.
	const count = style.samples ?? DEFAULT_SAMPLES
	const at = (dist: number) => {
		let i = 1
		while (i < dense.length - 1 && lengths[i] < dist) i++
		const span = lengths[i] - lengths[i - 1] || 1
		const t = (dist - lengths[i - 1]) / span
		const [x0, y0] = dense[i - 1]
		const [x1, y1] = dense[i]
		const len = Math.hypot(x1 - x0, y1 - y0) || 1
		return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, dx: (x1 - x0) / len, dy: (y1 - y0) / len }
	}

	const top = curve(style.top)
	const bottomBase = curve(style.bottom)
	const bottom = (s: number) => {
		const w = bottomBase(s)
		const f = style.fringe
		if (!f || s < f.from || s > f.to) return w
		const k = (s - f.from) / (f.to - f.from)
		const gap = (1 - Math.cos(k * f.teeth * Math.PI * 2)) / 2 // 0 at a tuft, 1 between tufts
		const fade = Math.min(1, k * 6, (1 - k) * 6)
		return w * (1 - f.depth * fade * gap)
	}

	const upper: Point[] = []
	const lower: Point[] = []
	for (let i = 0; i <= count; i++) {
		const s = i / count
		const p = at(s * total)
		upper.push([p.x + p.dy * top(s), p.y - p.dx * top(s)])
		lower.push([p.x - p.dy * bottom(s), p.y + p.dx * bottom(s)])
	}

	const f = (v: number) => +v.toFixed(2)
	const pt = ([x, y]: Point) => `${f(x)} ${f(y)}`
	const tip = f((top(1) + bottom(1)) / 2)
	const back = lower.slice().reverse()
	const half =
		'M' + upper.map(pt).join('L') +
		`A${tip} ${tip} 0 0 1 ${pt(back[0])}` +
		'L' + back.slice(1).map(pt).join('L') + 'Z'

	// Bounds of the whole mustache (both halves).
	const all = [...upper, ...lower]
	const maxX = Math.max(...all.map((p) => p[0])) + tip
	const minY = Math.min(...all.map((p) => p[1])) - tip
	const maxY = Math.max(...all.map((p) => p[1])) + tip
	const r = (v: number) => +v.toFixed(1)
	const box = [r(120 - maxX), r(minY), r(2 * maxX - 120), r(maxY - minY)]

	return { half, box }
}

/** The contents of src/assets/mustaches.ts. A test checks the committed file still matches. */
export function generate(): string {
	const kinds = Object.keys(STYLES)
	const entries = Object.entries(STYLES).map(([kind, style]) => {
		const { half, box } = build(style)
		return `\t${kind}: {\n\t\tbox: [${box.join(', ')}],\n\t\thalf: '${half}',\n\t},`
	})

	return `// Every kind of mustache on the site.
// Generated by tools/generate-mustache.ts; edit that file rather than this one.

/** A kind of mustache. Any of them can be drawn with <MustacheIcon> or <StacheCharacter>. */
export type MustacheKind = ${kinds.map((k) => `'${k}'`).join(' | ')}

/**
 * One mustache, drawn as its right half in a 120-unit-wide box. The left half is the same
 * path mirrored around x = 60.
 */
export interface Mustache {
	/** The bounds of the whole mustache (both halves). */
	box: [x: number, y: number, width: number, height: number]
	/** An SVG path for the right half. */
	half: string
}

export const MUSTACHES: Record<MustacheKind, Mustache> = {
${entries.join('\n')}
}

/** Every kind, in order: mine first. */
export const KINDS: readonly MustacheKind[] = [${kinds.map((k) => `'${k}'`).join(', ')}]
`
}

const HERE = fileURLToPath(import.meta.url)
/** Where the generated file goes. */
export const TARGET = resolve(dirname(HERE), '../src/assets/mustaches.ts')

// Only write the file when I run this script, not when a test imports it.
if (process.argv[1] && resolve(process.argv[1]) === HERE) {
	const out = generate()
	writeFileSync(TARGET, out)
	console.log(`Wrote ${TARGET}: ${Object.keys(STYLES).join(', ')} (${out.length} chars)`)
}
