import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StacheFamily from './StacheFamily.vue'
import StacheCharacter from './StacheCharacter.vue'
import { hunt, wallCaptionInView } from '../composables/stacheHunt.js'
import { setReducedMotion } from '../composables/media.js'
import { intersect, setMedia, MEDIA } from '../test/browser.js'
import { useFakeClock, wait, pointerEvent, press, findAllExcept } from '../test/helpers.js'

function mountWall() {
	return mount(StacheFamily, { attachTo: document.body })
}

const caption = (wrapper) => wrapper.find('.caption').text()
const cousinFrames = (wrapper) => wrapper.findAll('.frame:not(.me)')
const tile = (wrapper, n) => cousinFrames(wrapper)[n].find('.tile')
const myFace = (wrapper) => wrapper.find('.frame.me').findComponent(StacheCharacter)

// What each cousin on the wall is doing: its classes, mood and where it's looking.
function actors(wrapper) {
	return Object.fromEntries(
		cousinFrames(wrapper).map((frame, i) => {
			const actor = frame.find('.actor')
			const face = actor.findComponent(StacheCharacter)
			const classes = actor.classes().filter((c) => c !== 'actor')
			return [hunt.cousins[i].id, { classes, mood: face.props('mood'), look: face.props('look') }]
		}),
	)
}

beforeEach(useFakeClock)

describe('the portrait wall', () => {
	it('has my big frame, and an empty frame for every cousin', () => {
		const wrapper = mountWall()
		expect(wrapper.find('.frame.me .tile').attributes('aria-label')).toBe('Me: my mustache. Click to make it twirl.')
		expect(cousinFrames(wrapper)).toHaveLength(5)
		expect(wrapper.findAll('.ghost')).toHaveLength(5)
		expect(wrapper.findAll('.actor')).toHaveLength(0)
	})

	it('introduces itself, with a prompt that suits the device', async () => {
		const wrapper = mountWall()
		expect(caption(wrapper)).toContain('Its five cousins are hiding somewhere on this page.')
		expect(caption(wrapper)).toContain('Tap a frame for a clue.')
		setMedia(MEDIA.hover, true)
		await wait(0)
		expect(caption(wrapper)).toContain('Hover over a frame for a clue.')
	})

	it('reads each frame’s clue to screen readers as part of its name', () => {
		const wrapper = mountWall()
		expect(tile(wrapper, 0).attributes('aria-label')).toBe(
			'The Handlebar. Still hiding. A big fan of my work. Always reading over the top of it.',
		)
	})

	it('shows a frame’s clue in the caption when the mouse settles on it', async () => {
		const wrapper = mountWall()
		await pointerEvent(tile(wrapper, 1), 'pointerenter')
		await wait(110)
		expect(caption(wrapper)).toContain('The Dalí')
		expect(caption(wrapper)).toContain('Still hiding')
		expect(caption(wrapper)).toContain('Could use a fresh light.')
	})

	it('a tap shows a clue, and a second tap puts it away', async () => {
		const wrapper = mountWall()
		await press(tile(wrapper, 2), 'touch')
		expect(caption(wrapper)).toContain('The Pencil')
		await press(tile(wrapper, 2), 'touch')
		expect(caption(wrapper)).toContain('Its five cousins')
	})

	it('a found cousin moves into its frame, and its frame says where it was caught', async () => {
		const wrapper = mountWall()
		hunt.find('handlebar')
		await wait(0)
		expect(cousinFrames(wrapper)[0].find('.actor').exists()).toBe(true)
		expect(cousinFrames(wrapper)[0].classes()).toContain('found')
		expect(tile(wrapper, 0).attributes('aria-label')).toBe('The Handlebar. Found! Caught reading over a case study’s shoulder.')
	})

	it('clicking my frame says hello and twirls my mustache', async () => {
		const wrapper = mountWall()
		await press(wrapper.find('.frame.me .tile'))
		expect(caption(wrapper)).toBe('That’s me. Well, my mustache. Go on, give it a click.')
		expect(myFace(wrapper).props('mood')).toBe('happy')
		expect(myFace(wrapper).props('twirl')).toBe(1)
		await wait(1200)
		expect(myFace(wrapper).props('mood')).toBe('idle')
	})

	it('tells the toast when the caption is fully on screen', async () => {
		const wrapper = mountWall()
		intersect(wrapper.find('.caption').element, { intersectionRatio: 1 })
		expect(wallCaptionInView.value).toBe(true)
		intersect(wrapper.find('.caption').element, { intersectionRatio: 0.6 })
		expect(wallCaptionInView.value).toBe(false)
	})
})

describe('once everyone is found', () => {
	beforeEach(() => findAllExcept())

	it('says so, and offers to hide them again', () => {
		const wrapper = mountWall()
		expect(caption(wrapper)).toContain('You found all five. Everyone’s home now.')
		expect(wrapper.find('.again-wrap').classes()).not.toContain('off')
		expect(wrapper.find('.again').text()).toBe('Hide them again')
	})

	it('keeps the button hidden (but holding its place) until then', () => {
		hunt.reset()
		const wrapper = mountWall()
		expect(wrapper.find('.again-wrap').classes()).toContain('off')
	})

	it('hovering the button: each cousin reacts in its own way, and my mustache leans out', async () => {
		const wrapper = mountWall()
		await pointerEvent(wrapper.find('.again'), 'pointerenter')
		expect(actors(wrapper)).toEqual({
			handlebar: { classes: [], mood: 'curious', look: 'down' },
			dali: { classes: [], mood: 'excited', look: null },
			pencil: { classes: ['lean-left'], mood: 'nervous', look: 'left' },
			horseshoe: { classes: [], mood: 'suspicious', look: 'right' },
			walrus: { classes: [], mood: 'sleep', look: null },
		})
		expect(wrapper.find('.again-wrap').classes()).toContain('out')
	})

	it('focusing the button does the same, and leaving it calms everyone down', async () => {
		const wrapper = mountWall()
		await wrapper.find('.again').trigger('focus')
		expect(actors(wrapper).dali.mood).toBe('excited')
		await wrapper.find('.again').trigger('blur')
		expect(actors(wrapper).dali.mood).toBe('idle')
		expect(wrapper.find('.again-wrap').classes()).not.toContain('out')
	})

	it('pressing it: a fright, then everyone bolts their own way, then the hunt resets', async () => {
		const wrapper = mountWall()
		await pointerEvent(wrapper.find('.again'), 'pointerenter')
		await press(wrapper.find('.again'))

		expect(wrapper.find('.frames').classes()).toContain('scattering')
		expect(Object.values(actors(wrapper)).every((a) => a.mood === 'surprised' && a.classes.includes('startled'))).toBe(true)

		await wait(650)
		const running = actors(wrapper)
		expect(running.handlebar.classes).toContain('run-up')
		expect(running.dali.classes).toContain('run-right')
		expect(running.pencil.classes).toEqual(['lean-left', 'run', 'run-left'])
		expect(running.horseshoe.classes).toContain('run-down')
		expect(running.walrus.look).toBe('right')
		expect(myFace(wrapper).props('mood')).toBe('happy') // I find this very funny

		await wait(520 + 80 * 4 + 60)
		expect(hunt.count).toBe(0)
		expect(wrapper.findAll('.ghost')).toHaveLength(5)
		expect(wrapper.find('.frames').classes()).not.toContain('scattering')
		expect(document.activeElement).toBe(wrapper.find('.caption').element)
	})

	it('the run’s duration comes from the same number the timing uses', () => {
		const wrapper = mountWall()
		expect(wrapper.find('.frames').attributes('style')).toContain('--run-ms: 520ms')
	})

	it('moving off the button mid-scatter doesn’t interrupt it', async () => {
		const wrapper = mountWall()
		await press(wrapper.find('.again'))
		await pointerEvent(wrapper.find('.again'), 'pointerleave')
		expect(wrapper.find('.frames').classes()).toContain('scattering')
	})

	it('the toast’s button gets the same send-off', async () => {
		const wrapper = mountWall()
		hunt.requestHide()
		await wait(0)
		expect(wrapper.find('.frames').classes()).toContain('scattering')
	})

	it('with motion reduced, nobody runs: they just go once the fright is over', async () => {
		setReducedMotion(true)
		const wrapper = mountWall()
		await press(wrapper.find('.again'))
		await wait(650 + 150)
		expect(hunt.count).toBe(0)
	})
})
