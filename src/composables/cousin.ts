import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { hunt } from './stacheHunt'
import { useTimers, type Timers } from './timers'
import { huntText } from '../content'
import type { Cousin, CousinId, Mood } from '../types'

/** Everything a hiding spot needs to show its cousin. See {@link useCousin}. */
export interface CousinState {
	cousin: Cousin
	/** Has it been found? */
	found: ComputedRef<boolean>
	/** Its accessible name: a hint before it's found, its name and a nudge after. */
	label: ComputedRef<string>
	/** How it looks right now. Pass to `<StacheCharacter :mood>`. */
	mood: Ref<Mood>
	/** Goes up each time it should twirl. Pass to `<StacheCharacter :twirl>`. */
	twirl: Ref<number>
	/** True while it's reacting to being clicked, until it settles back to its resting mood. */
	reacting: ComputedRef<boolean>
	/** The timers its reactions run on. Clear them before starting a reaction of your own. */
	timers: Timers
	/** Look happy and twirl. */
	celebrate(): void
	/** Go back to the resting mood. */
	settle(): void
	/** Call when it's clicked: finds it, then reacts. */
	onFound(): void
}

/**
 * Everything a hidden cousin does once it's clicked. The component it lives in only has to
 * decide how it hides; this handles being found, its mood, its twirl and its name.
 *
 * Must be called during a component's setup.
 *
 * @param id Which cousin.
 * @param options.restMood How it looks while nobody's bothering it ('sleep' for the Walrus).
 */
export function useCousin(id: CousinId, { restMood = 'idle' }: { restMood?: Mood } = {}): CousinState {
	const cousin = hunt.cousin(id)
	const found = computed(() => hunt.isFound(id))
	const label = computed(() =>
		found.value ? `${cousin.name}. ${cousin.labelFound ?? huntText.labelFound}` : cousin.label,
	)

	const mood = ref<Mood>(restMood)
	const twirl = ref(0)
	const reacting = computed(() => mood.value !== restMood)
	const timers = useTimers()

	function celebrate() {
		mood.value = 'happy'
		twirl.value++
	}

	function settle() {
		mood.value = restMood
	}

	// A fright, then a happy twirl if it's a new find. Just the twirl if it isn't.
	function onFound() {
		timers.clear()
		if (hunt.find(id)) {
			mood.value = 'surprised'
			timers.after(550, celebrate)
			timers.after(1800, settle)
		} else {
			celebrate()
			timers.after(1100, settle)
		}
	}

	return { cousin, found, label, mood, twirl, reacting, timers, celebrate, settle, onFound }
}
