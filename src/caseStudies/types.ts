// The shape every case study follows, so they all read the same way: what I set out to do,
// the decisions that shaped it, what went wrong, how it turned out and what's next.
// Plain data only (no images imported, no Vue): vite.config.ts reads these too, to give
// each study its own page.

/** A picture in a case study. Its file lives in public/work/<slug>/. */
export interface Figure {
	/** Its path from the root of the site: '/work/fly-island/cover.webp'. */
	src: string
	/** What it shows, for anyone who can't see it. Describe the picture, not the caption. */
	alt: string
	/** Shown under it. Every figure in the story has one; the cover doesn't need one. */
	caption?: string
	/** Its size in pixels, so the page doesn't jump about while it loads. */
	width: number
	height: number
}

/**
 * Which part of the story a section tells. Each one gets a small label above its heading
 * ("The goal", "Decision 2"…), and they go in this order:
 *
 * - `goal`: what I set out to make, and for whom. Always first.
 * - `decision`: a call that shaped it, and what it cost. At least one; they're numbered.
 * - `challenge`: a hard problem I had to crack along the way.
 * - `process`: how I worked and how I knew it was right.
 * - `setback`: what went wrong, and what I did about it.
 * - `result`: how it turned out. Always there, near the end.
 * - `next`: what I'd do next. Always last.
 */
export type StoryPart = 'goal' | 'decision' | 'challenge' | 'process' | 'setback' | 'result' | 'next'

/** One section of a case study's story. */
export interface StorySection {
	part: StoryPart
	/** Its heading. Says what happened, not which part it is: "Prove it, don’t debate it". */
	heading: string
	/** The story itself. Keep them short: two to four sentences each. */
	paragraphs: string[]
	/** A short list of titled points under the paragraphs, two side by side on wide screens. */
	points?: { title: string; body: string }[]
	/** For a decision: what I gave up for it. Shown in a box after the paragraphs. */
	tradeoff?: string
	/** A few big numbers, for the result. */
	numbers?: { value: string; label: string }[]
	/** One picture, or two side by side. */
	figures?: Figure[]
}

export interface CaseStudy {
	/** Its address: /work/<slug>/. Lowercase letters, numbers and dashes. */
	slug: string
	/** The project's name. */
	title: string
	/** What it is, in a few words: "A drone flying game for iPhone". */
	what: string
	/**
	 * The whole story in one sentence, read straight after `what`. It opens the page, and link
	 * previews show the two together: "A drone flying game for iPhone. Fun enough for…".
	 */
	summary: string
	/** Two or three skills it shows. On the card and at the top of the page. */
	tags: string[]
	/** The big picture at the top, also on its card on my home page. */
	cover: Figure
	/** A 1200 × 630 JPEG for link previews (LinkedIn, Slack, iMessage). */
	shareImage?: string
	/** "At a glance": my role, when, what it's built with, where it stands. */
	facts: { label: string; value: string }[]
	/** Somewhere to see more of it. Each opens in a new tab. */
	links?: { label: string; href: string }[]
	story: StorySection[]
}
