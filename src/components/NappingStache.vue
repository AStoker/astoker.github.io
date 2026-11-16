<script setup>
// A cousin asleep on the footer. It's always there, in plain sight:
// waking it up (a click or tap) counts as finding it.
import { ref, computed } from 'vue'
import StacheCharacter from './StacheCharacter.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'

const props = defineProps({
	id: { type: String, required: true },
})

const hunt = useStacheHunt()
const cousin = hunt.cousin(props.id)
const found = computed(() => hunt.isFound(props.id))
const label = computed(() =>
	found.value
		? `${cousin.name}, asleep. You already found this one. Click to wake it anyway.`
		: 'Someone is asleep here. Click to wake them up.',
)

const mood = ref('sleep')
const twirl = ref(0)
let timers = []

function after(ms, fn) {
	timers.push(setTimeout(fn, ms))
}

function wake() {
	timers.forEach(clearTimeout)
	timers = []
	const isNew = hunt.find(props.id)
	mood.value = 'surprised'
	if (isNew) {
		after(600, () => {
			mood.value = 'happy'
			twirl.value++
		})
		after(2200, () => (mood.value = 'sleep'))
	} else {
		// Already found: grumpy, straight back to sleep.
		after(900, () => (mood.value = 'sleep'))
	}
}
</script>

<template>
	<button class="napper" :class="{ asleep: mood === 'sleep' }" type="button" :aria-label="label" @click="wake">
		<span class="zzz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></span>
		<StacheCharacter :kind="cousin.kind" :mood="mood" :twirl="twirl" />
	</button>
</template>

<style scoped>
.napper {
	all: unset;
	position: relative;
	display: block;
	width: 112px;
	cursor: pointer;
	border-radius: 10px;
	-webkit-tap-highlight-color: transparent;
}

.napper:focus-visible {
	outline: 2px solid var(--red);
	outline-offset: 4px;
}

.asleep :deep(.stache) {
	animation: breathe 3.6s ease-in-out infinite;
	transform-origin: 50% 100%;
}

.zzz {
	position: absolute;
	left: 78%;
	top: -6px;
	font-family: var(--font-display);
	font-weight: 600;
	font-size: 15px;
	color: var(--ink-soft);
	pointer-events: none;
	opacity: 0;
	transition: opacity 200ms;
}

.asleep .zzz {
	opacity: 1;
}

.zzz span {
	position: absolute;
	opacity: 0;
	animation: drift 3.6s ease-out infinite;
}

.zzz span:nth-child(2) {
	animation-delay: 1.2s;
	font-size: 0.85em;
}

.zzz span:nth-child(3) {
	animation-delay: 2.4s;
	font-size: 0.7em;
}

.napper:hover .zzz span {
	animation-duration: 1.8s;
}

@keyframes breathe {
	0%,
	100% {
		transform: scale(1, 1);
	}
	50% {
		transform: scale(1.03, 0.96);
	}
}

@keyframes drift {
	0% {
		opacity: 0;
		transform: translate(0, 6px);
	}
	20% {
		opacity: 1;
	}
	100% {
		opacity: 0;
		transform: translate(14px, -26px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.asleep :deep(.stache),
	.zzz span {
		animation: none;
	}

	.zzz span {
		opacity: 1;
	}

	.zzz span:nth-child(2) {
		transform: translate(8px, -10px);
	}

	.zzz span:nth-child(3) {
		transform: translate(16px, -20px);
	}
}
</style>
