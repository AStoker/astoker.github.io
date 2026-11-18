import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTimers, useReplay } from './timers'
import { useFakeClock, wait, withSetup } from '../test/helpers'

beforeEach(useFakeClock)

describe('useTimers', () => {
	it('runs a callback after its delay', async () => {
		const fn = vi.fn()
		const { result: timers } = withSetup(useTimers)
		timers.after(100, fn)
		await wait(99)
		expect(fn).not.toHaveBeenCalled()
		await wait(1)
		expect(fn).toHaveBeenCalledOnce()
	})

	it('runs a callback on the next animation frame', async () => {
		const fn = vi.fn()
		const { result: timers } = withSetup(useTimers)
		timers.nextFrame(fn)
		await wait(20)
		expect(fn).toHaveBeenCalledOnce()
	})

	it('clear() cancels everything still waiting', async () => {
		const fn = vi.fn()
		const { result: timers } = withSetup(useTimers)
		timers.after(100, fn)
		timers.nextFrame(fn)
		timers.clear()
		await wait(500)
		expect(fn).not.toHaveBeenCalled()
	})

	it('cancels everything when the component goes away', async () => {
		const fn = vi.fn()
		const { result: timers, wrapper } = withSetup(useTimers)
		timers.after(100, fn)
		timers.nextFrame(fn)
		wrapper.unmount()
		await wait(500)
		expect(fn).not.toHaveBeenCalled()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('keeps separate sets of timers apart', async () => {
		const a = vi.fn()
		const b = vi.fn()
		const { result } = withSetup(() => [useTimers(), useTimers()])
		result[0].after(100, a)
		result[1].after(100, b)
		result[0].clear()
		await wait(100)
		expect(a).not.toHaveBeenCalled()
		expect(b).toHaveBeenCalledOnce()
	})
})

describe('useReplay', () => {
	it('switches on a frame later, then off once the animation is over', async () => {
		const { result } = withSetup(() => useReplay(450))
		result.play()
		expect(result.playing.value).toBe(false)
		await wait(20)
		expect(result.playing.value).toBe(true)
		await wait(450)
		expect(result.playing.value).toBe(false)
	})

	it('restarts from the beginning when played again halfway through', async () => {
		const { result } = withSetup(() => useReplay(450))
		result.play()
		await wait(300)
		result.play()
		// Off for a frame, so the CSS animation starts over…
		expect(result.playing.value).toBe(false)
		await wait(20)
		expect(result.playing.value).toBe(true)
		// …and the first play's timer doesn't cut the second one short.
		await wait(300)
		expect(result.playing.value).toBe(true)
		await wait(150)
		expect(result.playing.value).toBe(false)
	})
})
