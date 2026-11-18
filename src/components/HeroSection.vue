<script setup>
// The hero: who Andrew is on the left, the family portrait wall on the right.
import StacheFamily from './StacheFamily.vue'
import { profile, hero, resume } from '../content.js'
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
			<!-- For anyone who only came for the resume -->
			<p class="resume">
				<a :href="resume.href" :download="resume.filename">
					<svg class="resume-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
						<path d="M8 2v8m-3.5-3.5L8 10l3.5-3.5M3 13.5h10" />
					</svg>
					{{ hero.resume }}</a
				>
				<span class="format">{{ resume.format }}</span>
			</p>
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

.resume {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 4px 10px;
	margin: 18px 0 0;
	padding-left: 4px;
}

.resume a {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	min-height: 28px;
	font-weight: 600;
	text-decoration-color: var(--red);
	text-decoration-thickness: 2px;
	text-underline-offset: 4px;
	border-radius: 4px;
}

.resume-icon {
	width: 1em;
	height: 1em;
	fill: none;
	stroke: currentColor;
	stroke-width: 1.8;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.format {
	font-family: var(--font-mono);
	font-size: 0.78rem;
	color: var(--ink-soft);
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
