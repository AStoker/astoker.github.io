<script setup lang="ts">
// A cousin asleep on my footer. It's always there, in plain sight:
// waking it up (a click or tap) counts as finding it.
import StacheCharacter from './StacheCharacter.vue'
import { useCousin } from '../composables/cousin'
import { hunt } from '../composables/stacheHunt'
import type { CousinId } from '../types'

const { id } = defineProps<{
	/** Which cousin is asleep here. */
	id: CousinId
}>()

const { cousin, label, mood, twirl, timers, celebrate, settle } = useCousin(id, { restMood: 'sleep' })

// Unlike the others, it always wakes with a start.
function wake() {
	timers.clear()
	mood.value = 'surprised'
	if (hunt.find(id)) {
		timers.after(600, celebrate)
		timers.after(2200, settle)
	} else {
		// Already found, so it's grumpy and goes straight back to sleep.
		timers.after(900, settle)
	}
}
</script>

<template>
	<button class="bare-button napper" :class="{ asleep: mood === 'sleep' }" type="button" :aria-label="label" @click="wake">
		<span class="zzz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></span>
		<StacheCharacter :kind="cousin.kind" :mood="mood" :twirl="twirl" />
	</button>
</template>

<style scoped>
.napper {
	position: relative;
	display: block;
	width: 112px;
	border-radius: 10px;
}

.napper:focus-visible {
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

:root.reduce-motion .asleep :deep(.stache),
:root.reduce-motion .zzz span {
	animation: none;
}

:root.reduce-motion .zzz span {
	opacity: 1;
}

:root.reduce-motion .zzz span:nth-child(2) {
	transform: translate(8px, -10px);
}

:root.reduce-motion .zzz span:nth-child(3) {
	transform: translate(16px, -20px);
}
</style>
