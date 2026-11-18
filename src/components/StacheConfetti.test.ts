import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import StacheConfetti from './StacheConfetti.vue'
import MustacheIcon from './MustacheIcon.vue'
import { hunt } from '../composables/stacheHunt'
import { setReducedMotion } from '../composables/media'
import { KINDS } from '../assets/mustaches'
import { useFakeClock, wait, findAllExcept } from '../test/helpers'

const pieces = (wrapper: VueWrapper) => wrapper.findAllComponents(MustacheIcon)

beforeEach(useFakeClock)

describe('StacheConfetti', () => {
	it('rains every kind of mustache when the last cousin is found, then clears up', async () => {
		const wrapper = mount(StacheConfetti)
		findAllExcept('walrus')
		await wait(0)
		expect(pieces(wrapper)).toHaveLength(0)
		hunt.find('walrus')
		await wait(0)
		expect(pieces(wrapper)).toHaveLength(48)
		expect(new Set(pieces(wrapper).map((p) => p.props('kind')))).toEqual(new Set(KINDS))
		await wait(4800)
		expect(pieces(wrapper)).toHaveLength(0)
	})

	it('stays still with motion reduced', async () => {
		setReducedMotion(true)
		const wrapper = mount(StacheConfetti)
		findAllExcept()
		await wait(0)
		expect(pieces(wrapper)).toHaveLength(0)
	})
})
