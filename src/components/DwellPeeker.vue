<script setup>
// A shy cousin that comes up from the bottom of the window while you stay in a section.
//
// How it's revealed (always the same, nothing random):
//   - While its section is the one in the middle of the screen, it rises slowly and is
//     fully up after `seconds`. You can watch it coming.
//   - Scroll to another section and it ducks straight back down.
//   - Come back and it starts over.
// Clicking it counts as finding it.
import { ref, watch } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useCousin } from '../composables/cousin.js'
import { useCurrentSection } from '../composables/currentSection.js'
import { useTimers } from '../composables/timers.js'
import { reducedMotion } from '../composables/media.js'

const props = defineProps({
	id: { type: String, required: true }, // a cousin id from content.js
	section: { type: String, required: true }, // the id of the section it lives in
	seconds: { type: Number, default: 3 },
})

const { cousin, label, mood, twirl, onFound } = useCousin(props.id)
const currentSection = useCurrentSection()
const up = ref(false)
const upTimer = useTimers()

watch(
	() => currentSection.value === props.section,
	(here) => {
		upTimer.clear()
		if (!here) {
			up.value = false
			mood.value = 'idle'
		} else if (reducedMotion.value) {
			// No slow rise: it simply appears once the time is up.
			upTimer.after(props.seconds * 1000, () => (up.value = true))
		} else {
			up.value = true
		}
	},
)
</script>

<template>
	<!-- Lives inside its section, so it comes next in the tab order while you're there. -->
	<div class="dweller" :class="{ up }" :style="{ '--rise': `${seconds}s` }">
		<button
			class="bare-button peeker"
			type="button"
			:aria-label="label"
			:tabindex="up ? 0 : -1"
			:aria-hidden="up ? undefined : 'true'"
			@click="onFound"
		>
			<StacheCharacter :kind="cousin.kind" :mood="mood" :twirl="twirl" />
		</button>
	</div>
</template>

<style scoped>
/* The box sits on the bottom edge of the window and cuts off anything below it.
   iOS Safari draws the page underneath its floating toolbar, so a cousin that was only
   pushed below the edge would still show through there. Clipped and hidden instead. */
.dweller {
	--w: 112px;
	position: fixed;
	right: clamp(10px, 4vw, 56px);
	bottom: 0;
	z-index: 40;
	width: var(--w);
	height: calc(var(--w) / 2);
	clip-path: inset(-24px -24px 0 -24px); /* room above and beside for the focus ring */
	pointer-events: none;
	visibility: hidden;
	transition: visibility 0s linear 320ms; /* once it has ducked down */
}

.dweller.up {
	visibility: visible;
	pointer-events: auto;
	transition: none;
}

.peeker {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 12px;
	transform: translateY(105%);
	transition: transform 320ms cubic-bezier(0.5, 0, 0.75, 0);
}

/* Up: eyes over the bottom edge of the window, mustache resting on it */
.up .peeker {
	transform: translateY(0);
	transition: transform var(--rise) cubic-bezier(0.6, 0, 0.4, 1);
}

.peeker:focus-visible {
	outline-offset: 4px;
}

@media (max-width: 640px) {
	.dweller {
		--w: 92px;
	}
}

:root.reduce-motion .dweller,
:root.reduce-motion .peeker {
	transition: none;
}
</style>
