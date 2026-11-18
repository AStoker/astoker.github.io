<script setup lang="ts">
// A placeholder for a case study I haven't written up yet.
import { work } from '../content'

defineProps<{
	/** Its number, already padded: "01", "02"… */
	num: string
}>()
</script>

<template>
	<div class="slot">
		<span class="slot-label">{{ work.slotLabel }} {{ num }}</span>
		<span class="slot-num" aria-hidden="true">{{ num }}</span>
		<span class="slot-status">{{ work.slotStatus }}</span>
	</div>
</template>

<style scoped>
.slot {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	aspect-ratio: 4 / 5;
	padding: 18px 20px;
	border: 1.5px dashed var(--rule-strong);
	border-radius: 16px;
	background:
		repeating-linear-gradient(-45deg, transparent 0 11px, var(--hatch) 11px 12px),
		var(--paper);
}

.slot-label,
.slot-status {
	font-family: var(--font-mono);
	font-size: 0.75rem;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--ink-soft);
}

.slot-status {
	align-self: flex-start;
	padding: 4px 9px;
	border: 1.5px solid currentColor;
	border-radius: 999px;
}

.slot-num {
	font-family: var(--font-display);
	font-size: clamp(4rem, 9vw, 7rem);
	font-weight: 300;
	line-height: 1;
	letter-spacing: -0.04em;
	color: color-mix(in srgb, var(--ink) 58%, transparent); /* over 3:1 even on the hatching, enough for type this big */
	font-variation-settings: var(--display-axes), 'opsz' 144;
}

@media (max-width: 760px) {
	.slot {
		aspect-ratio: 16 / 9;
	}
}
</style>
