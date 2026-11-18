<script setup>
// A shower of mustaches, every kind there is, when the last cousin is found.
import { ref, watch } from 'vue'
import MustacheIcon from './MustacheIcon.vue'
import { hunt } from '../composables/stacheHunt.js'
import { useTimers } from '../composables/timers.js'
import { reducedMotion } from '../composables/media.js'
import { KINDS } from '../assets/mustaches.js'

const pieces = ref([])
const timers = useTimers()

watch(
	() => hunt.complete,
	(done) => {
		if (!done || reducedMotion.value) return
		const batch = Date.now()
		pieces.value = Array.from({ length: 48 }, (_, i) => ({
			id: `${batch}-${i}`,
			kind: KINDS[i % KINDS.length], // an even mix of every kind
			left: Math.random() * 100,
			size: 26 + Math.random() * 34,
			delay: Math.random() * 700,
			duration: 2200 + Math.random() * 1600,
			spin: (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 540),
			drift: (Math.random() - 0.5) * 160,
			red: Math.random() < 0.4,
		}))
		timers.clear()
		timers.after(4800, () => (pieces.value = []))
	},
)
</script>

<template>
	<div v-if="pieces.length" class="confetti" aria-hidden="true">
		<MustacheIcon
			v-for="p in pieces"
			:key="p.id"
			class="piece"
			:class="{ red: p.red }"
			:kind="p.kind"
			:style="{
				left: `${p.left}%`,
				width: `${p.size}px`,
				animationDelay: `${p.delay}ms`,
				animationDuration: `${p.duration}ms`,
				'--spin': `${p.spin}deg`,
				'--drift': `${p.drift}px`,
			}"
		/>
	</div>
</template>

<style scoped>
.confetti {
	position: fixed;
	inset: 0;
	z-index: 70;
	overflow: hidden;
	pointer-events: none;
}

.piece {
	position: absolute;
	top: -40px;
	color: var(--ink);
	animation: fall linear forwards;
}

.piece.red {
	color: var(--red);
}

@keyframes fall {
	to {
		transform: translate(var(--drift), 110vh) rotate(var(--spin));
	}
}
</style>
