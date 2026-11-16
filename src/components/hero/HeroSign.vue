<script setup>
// Hero option B: a sign-painter's lockup. Everything centred, with the mustache
// as the ornament between two rules. No character here; the cousins show up further down.
import HeroCopy from './HeroCopy.vue'
import MainStache from '../MainStache.vue'
</script>

<template>
	<section id="top" class="hero container">
		<HeroCopy centered>
			<div class="ornament">
				<span class="rule" aria-hidden="true"></span>
				<MainStache class="mark" :eyes="false" bubble="beside" />
				<span class="rule" aria-hidden="true"></span>
			</div>
		</HeroCopy>
	</section>
</template>

<style scoped>
.hero {
	display: grid;
	align-content: center;
	min-height: calc(100svh - var(--header-h));
	padding-block: clamp(24px, 5vw, 64px) clamp(56px, 8vw, 96px);
}

.ornament {
	display: flex;
	align-items: center;
	gap: clamp(14px, 3vw, 32px);
	width: min(100%, 880px);
	margin: clamp(18px, 3vw, 32px) 0 clamp(40px, 5vw, 56px);
}

.rule {
	flex: 1;
	height: 1.5px;
	background: var(--ink);
}

.mark {
	width: clamp(120px, 18vw, 220px);
}

@media (max-width: 640px) {
	.hero {
		min-height: 0;
		padding-top: 40px;
	}
}
</style>
