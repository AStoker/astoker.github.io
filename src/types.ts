// The shapes shared across my site. Content (words) lives in content.ts; these say what
// that content and my mustache characters are allowed to be.
import type { MustacheKind } from './assets/mustaches'

/**
 * How a mustache character feels. Sets its eyes, its brows and any animation.
 *
 * - `idle`: eyes open, glancing about or following the pointer
 * - `surprised`: eyes wide, brows shot up
 * - `happy`: eyes closed in a smile (^ ^)
 * - `sleep`: eyes shut, brows low
 * - `suspicious`: eyes narrowed, one brow down
 * - `curious`: eyes wide with big pupils, brows up
 * - `excited`: eyes wide, jumping up and down
 * - `nervous`: worried brows, eyes wide
 */
export type Mood = 'idle' | 'surprised' | 'happy' | 'sleep' | 'suspicious' | 'curious' | 'excited' | 'nervous'

/** Who I am and how to reach me. */
export interface Profile {
	firstName: string
	lastName: string
	/** Shown above my name: "Software developer". */
	role: string
	location: string
	/** My email address, or null to hide the email button in Say hello. */
	email: string | null
	/** My LinkedIn URL, or null to hide its button. */
	linkedin: string | null
	/** My GitHub URL, or null to hide its button. */
	github: string | null
}

/** A way to look, lean or run. */
export type Direction = 'left' | 'right' | 'up' | 'down'

/** Every cousin I've hidden on the page. Adding one here makes the compiler ask for the rest. */
export type CousinId = 'handlebar' | 'dali' | 'pencil' | 'horseshoe' | 'walrus'

/** One of my hidden cousins, as described in content.ts. */
export interface Cousin {
	id: CousinId
	/** The mustache it wears. */
	kind: MustacheKind
	/** Its name, as shown on its frame: "The Handlebar". */
	name: string
	/** The riddle on its frame while it's hiding: a nudge, never instructions. */
	clue: string
	/** What its frame says once it's been caught. */
	found: string
	/** What screen readers hear on the cousin itself until it's found. */
	label: string
	/** What screen readers hear on it once found. Defaults to `huntText.labelFound`. */
	labelFound?: string
}

/** The id of a numbered section of my page, which is also its #link. */
export type SectionId = 'work' | 'experience' | 'about' | 'contact'

/** A numbered section of my page, as listed in `sections` in content.ts. */
export interface Section {
	id: SectionId
	/** Its heading. */
	title: string
	/** Its label in the header menu. Usually the same as the title; "Contact" for Say hello. */
	menu: string
}
