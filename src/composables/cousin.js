import { ref, computed } from 'vue'
import { hunt } from './stacheHunt.js'
import { useTimers } from './timers.js'
import { huntText } from '../content.js'

// Everything a hidden cousin does once it's clicked. The component it lives in only has
// to decide how it hides; this handles being found, its mood, its twirl and its name.
//
// `restMood` is how it looks while nobody's bothering it ('sleep' for the Walrus).
export function useCousin(id, { restMood = 'idle' } = {}) {
	const cousin = hunt.cousin(id)
	const found = computed(() => hunt.isFound(id))
	const label = computed(() =>
		found.value ? `${cousin.name}. ${cousin.labelFound ?? huntText.labelFound}` : cousin.label,
	)

	const mood = ref(restMood)
	const twirl = ref(0)
	const timers = useTimers()

	function celebrate() {
		mood.value = 'happy'
		twirl.value++
	}

	const settle = () => (mood.value = restMood)

	// A fright, then a happy twirl if it's a new find. Just the twirl if it isn't.
	// Returns how long the reaction lasts, for anything that should wait until it's over.
	function onFound() {
		timers.clear()
		if (hunt.find(id)) {
			mood.value = 'surprised'
			timers.after(550, celebrate)
			timers.after(1800, settle)
			return 1800
		}
		celebrate()
		timers.after(1100, settle)
		return 1100
	}

	return { cousin, found, label, mood, twirl, timers, celebrate, settle, onFound }
}
