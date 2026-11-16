<script setup>
// Hero option A: a gallery wall of family portraits. Andrew's mustache gets the
// big frame; each hidden cousin has an empty one waiting for them.
import HeroCopy from './HeroCopy.vue'
import StacheFamily from '../StacheFamily.vue'
</script>

<template>
	<section id="top" class="hero container">
		<HeroCopy />
		<StacheFamily layout="wall" class="wall" />
	</section>
</template>

<style scoped>
.hero {
	display: grid;
	grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
	align-items: center;
	gap: clamp(28px, 5vw, 80px);
	min-height: calc(100svh - var(--header-h));
	padding-block: clamp(24px, 5vw, 64px) clamp(40px, 7vw, 88px);
}

.wall {
	width: min(100%, 470px);
	justify-self: end;
}

@media (max-width: 900px) {
	.hero {
		grid-template-columns: 1fr;
		min-height: 0;
	}

	.wall {
		justify-self: start;
		width: min(100%, 440px);
	}
}
</style>
