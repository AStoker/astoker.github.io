import { describe, it, expect, vi } from 'vitest'
import { devConsole, profile } from './content.js'

async function logged() {
	const log = vi.spyOn(console, 'log').mockImplementation(() => {})
	vi.resetModules()
	await import('./devConsole.js')
	return log.mock.calls[0][0]
}

describe('the note in the developer console', () => {
	it('draws my mustache with matching halves', async () => {
		const art = (await logged()).split('\n\n')[0].replace('%c', '')
		for (const line of art.split('\n').filter(Boolean)) {
			const padded = line.padEnd(38)
			expect(padded, line).toBe([...padded].reverse().join(''))
		}
	})

	it('says hello and how to reach me', async () => {
		const text = await logged()
		expect(text).toContain(devConsole.heading)
		expect(text).toContain(`${devConsole.email}: ${profile.email}`)
		expect(text).toContain(devConsole.sourceUrl)
	})
})
