import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { generate, TARGET } from './generate-mustache.mjs'
import { MUSTACHES, KINDS } from '../src/assets/mustaches.js'

describe('the mustache generator', () => {
	// If this fails, I changed a shape in the generator but forgot to run it:
	//   node tools/generate-mustache.mjs
	it('matches the committed src/assets/mustaches.js', () => {
		expect(readFileSync(TARGET, 'utf8')).toBe(generate())
	})

	it('makes every kind as a closed half-outline inside its box', () => {
		expect(KINDS).toEqual(['chevron', 'handlebar', 'walrus', 'horseshoe', 'pencil', 'dali'])
		for (const kind of KINDS) {
			const { half, box } = MUSTACHES[kind]
			expect(half, kind).toMatch(/^M[\d.\s-]+L.*Z$/)
			const [x, , w] = box
			// Mirrored around x = 60, so the box is centred on it.
			expect(x + w / 2, kind).toBeCloseTo(60, 0)
		}
	})
})
