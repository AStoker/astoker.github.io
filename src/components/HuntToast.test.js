import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HuntToast from './HuntToast.vue'
import { hunt, wallCaptionInView } from '../composables/stacheHunt.js'
import { useFakeClock, wait, press, findAllExcept } from '../test/helpers.js'

function mountToast() {
	return mount(HuntToast, { attachTo: document.body })
}

const text = (wrapper) => wrapper.find('.region').text()
const celebrating = (wrapper) => wrapper.find('.toast.big').exists()

async function findTheLastOne() {
	findAllExcept('walrus')
	await wait(3000) // let the earlier toasts go
	hunt.find('walrus')
	await wait(0)
}

beforeEach(useFakeClock)

describe('after each find', () => {
	it('says who was found and how many so far, for three seconds', async () => {
		const wrapper = mountToast()
		hunt.find('dali')
		await wait(0)
		expect(text(wrapper)).toContain('You found The Dalí!')
		expect(text(wrapper)).toContain('1 of 5')
		await wait(3000)
		expect(text(wrapper)).toBe('')
	})

	it('a second find starts the three seconds over', async () => {
		const wrapper = mountToast()
		hunt.find('dali')
		await wait(2000)
		hunt.find('pencil')
		await wait(2000)
		expect(text(wrapper)).toContain('You found The Pencil!')
	})
})

describe('once everyone is found', () => {
	it('celebrates instead', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		expect(celebrating(wrapper)).toBe(true)
		expect(text(wrapper)).toContain('You found all five!')
		expect(text(wrapper)).not.toContain('You found The Walrus!')
	})

	it('steps aside once the wall’s caption is in view, but not before two seconds', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		wallCaptionInView.value = true
		await wait(1900)
		expect(celebrating(wrapper)).toBe(true)
		await wait(100)
		expect(celebrating(wrapper)).toBe(false)
	})

	it('stays as long as the caption is off screen', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		await wait(10000)
		expect(celebrating(wrapper)).toBe(true)
		wallCaptionInView.value = true
		await wait(0)
		expect(celebrating(wrapper)).toBe(false)
	})

	it('closes with the × button', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		await press(wrapper.find('.close'))
		expect(celebrating(wrapper)).toBe(false)
	})

	it('closes when the visitor follows the link to say hello', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		await press(wrapper.find('.big a'))
		expect(celebrating(wrapper)).toBe(false)
	})

	it('Hide them again asks the wall to send everyone off', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		const before = hunt.hideRequests
		await press(wrapper.find('.link'))
		expect(hunt.hideRequests).toBe(before + 1)
		expect(celebrating(wrapper)).toBe(false)
	})

	it('goes away when the hunt resets', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		hunt.reset()
		await wait(0)
		expect(celebrating(wrapper)).toBe(false)
	})
})

describe('Hide them again from further down the page', () => {
	it('scrolls back up to the wall first, and sends everyone off once it lands', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(2000)
		const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
		const before = hunt.hideRequests
		await press(wrapper.find('.link'))
		expect(scrollTo).toHaveBeenCalledWith({ top: 0 })
		expect(hunt.hideRequests).toBe(before)
		window.dispatchEvent(new Event('scrollend'))
		expect(hunt.hideRequests).toBe(before + 1)
		await wait(1200) // the fallback for browsers without scrollend doesn't ask twice
		expect(hunt.hideRequests).toBe(before + 1)
	})

	it('still sends them off in browsers without scrollend', async () => {
		const wrapper = mountToast()
		await findTheLastOne()
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(2000)
		vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
		const before = hunt.hideRequests
		await press(wrapper.find('.link'))
		await wait(1200)
		expect(hunt.hideRequests).toBe(before + 1)
	})
})
