<script setup lang="ts">
// A shy cousin that comes up over the top edge of whatever goes in the slot, but only for
// people who stay a while.
//
// How it's revealed (always the same, nothing random):
//   - While the edge it hides behind is on screen, it rises slowly and is fully up after
//     `seconds`. You can watch it coming.
//   - Scroll that edge out of view and it ducks straight back down.
//   - Come back and it starts over.
// Clicking it counts as finding it.
//
//   <DwellPeeker id="pencil" at="80%">
//     <dl class="facts">…</dl>   ← it rises over this one's top edge
//   </DwellPeeker>
import { ref, watch, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useCousin } from '../composables/cousin'
import { useTimers } from '../composables/timers'
import { reducedMotion } from '../composables/media'
import type { CousinId } from '../types'

const {
	id,
	at = '50%',
	seconds = 3,
} = defineProps<{
	/** Which cousin it is. */
	id: CousinId
	/** Where along the top edge it comes up, as a CSS length: `80%`. */
	at?: string
	/** How long it takes to rise all the way, in seconds. */
	seconds?: number
}>()

const { cousin, label, mood, twirl, onFound } = useCousin(id)
const spot = useTemplateRef<HTMLElement>('spot')
const onScreen = ref(false)
const up = ref(false)
const upTimer = useTimers()

watch(onScreen, (here) => {
	upTimer.clear()
	if (!here) {
		up.value = false
		mood.value = 'idle'
	} else if (reducedMotion.value) {
		// No slow rise: it simply appears once the time is up.
		upTimer.after(seconds * 1000, () => (up.value = true))
	} else {
		up.value = true
	}
})

let observer: IntersectionObserver | undefined

// It counts as on screen once the whole space it rises into is in view, and not tucked
// under my sticky header or right at the bottom of the window where it'd go unnoticed.
onMounted(() => {
	const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72
	observer = new IntersectionObserver(([entry]) => (onScreen.value = (entry?.intersectionRatio ?? 0) > 0.99), {
		rootMargin: `-${header}px 0px -10% 0px`,
		threshold: [0, 1],
	})
	if (spot.value) observer.observe(spot.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
	<div class="ledge" :style="{ '--at': at, '--rise': `${seconds}s` }">
		<!-- Comes before the slot, so it's next in the tab order while it's up. -->
		<div ref="spot" class="dweller" :class="{ up }">
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
		<slot />
	</div>
</template>

<style scoped>
.ledge {
	position: relative;
}

/* The space just above the slot's top edge. It cuts off anything below that edge, so
   while it's down there's nothing to see, even though there's no cover in front of it. */
.dweller {
	--w: 112px;
	position: absolute;
	z-index: 1;
	bottom: 100%;
	left: var(--at);
	width: var(--w);
	height: calc(var(--w) / 2);
	translate: -50% 0;
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

/* Up: eyes over the edge, mustache resting on it */
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
