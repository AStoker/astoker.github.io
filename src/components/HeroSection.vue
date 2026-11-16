<script setup>
// The hero: who Andrew is on the left, the family portrait wall on the right.
import StacheFamily from './StacheFamily.vue'
import { profile, hero } from '../content.js'
</script>

<template>
	<section id="top" class="hero container">
		<div class="copy">
			<p class="kicker">{{ profile.role }} <span aria-hidden="true">·</span> {{ profile.location }}</p>
			<h1 class="name">
				<span>{{ profile.firstName }}</span>
				<span>{{ profile.lastName }}</span>
			</h1>
			<p class="lede">
				<strong>{{ hero.greeting }}</strong>
				{{ hero.lede }}
			</p>
			<div class="actions">
				<a class="btn btn-solid" :href="hero.primary.href">{{ hero.primary.label }}</a>
				<a class="btn btn-ghost" :href="hero.secondary.href">{{ hero.secondary.label }}</a>
			</div>
		</div>

		<StacheFamily class="wall" />
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

.kicker {
	margin: 0 0 20px;
}

.name {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(3.6rem, 10.5vw, 8.5rem);
	font-weight: 620;
	line-height: 0.88;
	letter-spacing: -0.035em;
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 144;
}

.name span {
	display: block;
}

.lede {
	max-width: 40ch;
	margin: 28px 0 0;
	font-size: clamp(1.1rem, 1.5vw, 1.25rem);
	line-height: 1.55;
	color: var(--ink-soft);
}

.lede strong {
	font-weight: 600;
	color: var(--ink);
}

.actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 32px;
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
