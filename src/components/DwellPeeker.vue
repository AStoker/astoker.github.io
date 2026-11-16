<script setup>
// A shy cousin that comes up from the bottom of the window while you stay in a section.
//
// How it's revealed (always the same, nothing random):
//   - While the watched section is the one in the middle of the screen, it rises
//     slowly and is fully up after `seconds`. You can watch it coming.
//   - Scroll to another section and it ducks straight back down.
//   - Come back and it starts over.
// Clicking it counts as finding it.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { reducedMotion } from '../composables/media.js'

const props = defineProps({
	id: { type: String, required: true }, // a cousin id from content.js
	watch: { type: String, required: true }, // selector for the section it lives in
	seconds: { type: Number, default: 3 },
})

const hunt = useStacheHunt()
const cousin = hunt.cousin(props.id)
const found = computed(() => hunt.isFound(props.id))
const label = computed(() =>
	found.value
		? `${cousin.name}. You already found this one. Click to make it twirl.`
		: 'Someone is coming up for a look. Click to find them.',
)

const up = ref(false)
const mood = ref('idle')
const twirl = ref(0)
let observer
let moodTimer
let upTimer

function onFound() {
	clearTimeout(moodTimer)
	if (hunt.find(props.id)) {
		mood.value = 'surprised'
		moodTimer = setTimeout(() => {
			mood.value = 'happy'
			twirl.value++
			moodTimer = setTimeout(() => (mood.value = 'idle'), 1300)
		}, 550)
	} else {
		mood.value = 'happy'
		twirl.value++
		moodTimer = setTimeout(() => (mood.value = 'idle'), 1100)
	}
}

onMounted(() => {
	const target = document.querySelector(props.watch)
	if (!target) return
	// "In the section" means it covers the middle of the screen.
	observer = new IntersectionObserver(
		([entry]) => {
			clearTimeout(upTimer)
			if (!entry.isIntersecting) {
				up.value = false
				mood.value = 'idle'
			} else if (reducedMotion.value) {
				// No slow rise: it simply appears once the time is up.
				upTimer = setTimeout(() => (up.value = true), props.seconds * 1000)
			} else {
				up.value = true
			}
		},
		{ rootMargin: '-45% 0px -50% 0px' },
	)
	observer.observe(target)
})

onBeforeUnmount(() => {
	observer?.disconnect()
	clearTimeout(moodTimer)
	clearTimeout(upTimer)
})
</script>

<template>
	<div class="dweller" :class="{ up, reduced: reducedMotion }" :style="{ '--rise': `${seconds}s` }">
		<button
			class="peeker"
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
.dweller {
	--w: 112px;
	position: fixed;
	right: clamp(10px, 4vw, 56px);
	bottom: 0;
	z-index: 40;
	width: var(--w);
	height: calc(var(--w) / 2);
	transform: translateY(105%);
	transition: transform 320ms cubic-bezier(0.5, 0, 0.75, 0);
	pointer-events: none;
}

/* Up: eyes over the bottom edge of the window, mustache resting on it */
.dweller.up {
	transform: translateY(7%);
	transition: transform var(--rise) cubic-bezier(0.6, 0, 0.4, 1);
	pointer-events: auto;
}

.dweller.reduced,
.dweller.reduced.up {
	transition: none;
}

.peeker {
	all: unset;
	display: block;
	width: 100%;
	height: 100%;
	cursor: pointer;
	border-radius: 12px;
	-webkit-tap-highlight-color: transparent;
}

.peeker:focus-visible {
	outline: 2px solid var(--red);
	outline-offset: 4px;
}

@media (max-width: 640px) {
	.dweller {
		--w: 92px;
	}
}
</style>
