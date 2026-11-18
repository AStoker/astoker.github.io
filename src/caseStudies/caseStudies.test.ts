// The rules every case study follows, so a new one can't quietly break the format: the
// outline's in order, every picture exists, is described, and is the size it says it is.
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { caseStudies, studyAt, studyNumber, studyPath } from '.'
import type { Figure, StoryPart } from './types'

const ORDER: StoryPart[] = ['goal', 'decision', 'challenge', 'process', 'setback', 'result', 'next']
// Tests run from the root of the repo
const publicFile = (src: string) => resolve('public', `.${src}`)

/** A WebP's width and height, read from its header. */
function webpSize(file: string): [number, number] {
	const data = readFileSync(file)
	const chunk = data.toString('ascii', 12, 16)
	if (chunk === 'VP8 ') return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff]
	if (chunk === 'VP8L') {
		const bits = data.readUInt32LE(21)
		return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]
	}
	if (chunk === 'VP8X') return [data.readUIntLE(24, 3) + 1, data.readUIntLE(27, 3) + 1]
	throw new Error(`${file} isn't a WebP I can read`)
}

describe.each(caseStudies.map((study) => [study.title, study] as const))('%s', (_, study) => {
	const figures: Figure[] = [study.cover, ...study.story.flatMap((section) => section.figures ?? [])]

	it('has a slug that works as an address, and no other study has it', () => {
		expect(study.slug).toMatch(/^[a-z0-9-]+$/)
		expect(caseStudies.filter((other) => other.slug === study.slug)).toHaveLength(1)
	})

	it('tells its story in order: a goal first, at least one decision, a result, then what’s next', () => {
		const parts = study.story.map((section) => section.part)
		expect(parts[0]).toBe('goal')
		expect(parts).toContain('decision')
		expect(parts).toContain('result')
		expect(parts.at(-1)).toBe('next')
		const ranks = parts.map((part) => ORDER.indexOf(part))
		expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
	})

	it('describes every picture, and captions every one in the story', () => {
		for (const figure of figures) expect(figure.alt.length, figure.src).toBeGreaterThan(20)
		for (const figure of figures.slice(1)) expect(figure.caption, figure.src).toBeTruthy()
	})

	it('has every picture in its own folder, at the size it says', () => {
		for (const figure of figures) {
			expect(figure.src.startsWith(`/work/${study.slug}/`), figure.src).toBe(true)
			expect(existsSync(publicFile(figure.src)), figure.src).toBe(true)
			if (figure.src.endsWith('.webp')) {
				expect(webpSize(publicFile(figure.src)), figure.src).toEqual([figure.width, figure.height])
			}
		}
	})

	it('has its link-preview picture, if it names one', () => {
		if (study.shareImage) expect(existsSync(publicFile(study.shareImage))).toBe(true)
	})

	it('only links out over https', () => {
		for (const link of study.links ?? []) expect(link.href).toMatch(/^https:\/\//)
	})
})

describe('finding a case study from its address', () => {
	const [first] = caseStudies

	it('knows each study’s page and number', () => {
		expect(studyPath(first)).toBe(`/work/${first.slug}/`)
		expect(studyNumber(first)).toBe('01')
	})

	it('matches its page with or without the last slash', () => {
		expect(studyAt(`/work/${first.slug}/`)).toBe(first)
		expect(studyAt(`/work/${first.slug}`)).toBe(first)
	})

	it('is null on my home page and on addresses that aren’t a study', () => {
		expect(studyAt('/')).toBeNull()
		expect(studyAt('/work/')).toBeNull()
		expect(studyAt('/work/no-such-thing/')).toBeNull()
		expect(studyAt(`/elsewhere/work/${first.slug}/`)).toBeNull()
	})
})
