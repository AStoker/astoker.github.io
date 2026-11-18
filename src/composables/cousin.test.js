import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCousin } from './cousin.js'
import { hunt } from './stacheHunt.js'
import { useFakeClock, wait, withSetup } from '../test/helpers.js'

beforeEach(useFakeClock)

describe('useCousin', () => {
	it('names itself for screen readers, before and after it’s found', () => {
		const { result } = withSetup(() => useCousin('handlebar'))
		expect(result.label.value).toBe('Someone is hiding here. Click to find them.')
		hunt.find('handlebar')
		expect(result.label.value).toBe('The Handlebar. You already found this one. Click to make it twirl.')
	})

	it('can have its own words once found', () => {
		const { result } = withSetup(() => useCousin('walrus'))
		hunt.find('walrus')
		expect(result.label.value).toBe('The Walrus. Asleep again. You already found this one, but you can wake it anyway.')
	})

	it('a new find: a fright, then a happy twirl, then back to rest', async () => {
		const { result } = withSetup(() => useCousin('dali'))
		expect(result.onFound()).toBe(1800)
		expect(hunt.isFound('dali')).toBe(true)
		expect(result.mood.value).toBe('surprised')
		await wait(550)
		expect(result.mood.value).toBe('happy')
		expect(result.twirl.value).toBe(1)
		await wait(1250)
		expect(result.mood.value).toBe('idle')
	})

	it('found again: just the twirl', async () => {
		hunt.find('dali')
		const { result } = withSetup(() => useCousin('dali'))
		expect(result.onFound()).toBe(1100)
		expect(result.mood.value).toBe('happy')
		expect(result.twirl.value).toBe(1)
		await wait(1100)
		expect(result.mood.value).toBe('idle')
	})

	it('settles into its own resting mood', async () => {
		const { result } = withSetup(() => useCousin('walrus', { restMood: 'sleep' }))
		expect(result.mood.value).toBe('sleep')
		result.onFound()
		await wait(1800)
		expect(result.mood.value).toBe('sleep')
	})

	it('a second click starts over instead of twirling twice', async () => {
		const { result } = withSetup(() => useCousin('pencil'))
		result.onFound()
		await wait(100)
		result.onFound() // already found now
		expect(result.twirl.value).toBe(1)
		await wait(600) // past when the first click would have twirled
		expect(result.twirl.value).toBe(1)
		await wait(1100)
		expect(result.mood.value).toBe('idle')
	})

	it('leaves nothing running once its component is gone', () => {
		const { result, wrapper } = withSetup(() => useCousin('pencil'))
		result.onFound()
		wrapper.unmount()
		expect(vi.getTimerCount()).toBe(0)
	})
})
