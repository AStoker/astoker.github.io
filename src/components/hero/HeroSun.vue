<script setup>
// Hero option C: sunrise. A proper sun this time (rays, a horizon, and a bead of
// sweat), because Columbia is "sunny (read: hot)".
import HeroCopy from './HeroCopy.vue'
import MainStache from '../MainStache.vue'
import { hero } from '../../content.js'

const RAYS = Array.from({ length: 24 }, (_, i) => i * 15)
</script>

<template>
	<section id="top" class="hero container">
		<HeroCopy class="copy" :kicker="hero.sunnyKicker" />

		<div class="sky">
			<svg class="sun" viewBox="0 0 400 236" aria-hidden="true" focusable="false">
				<defs>
					<clipPath id="above-horizon"><rect x="0" y="0" width="400" height="236" /></clipPath>
				</defs>
				<g clip-path="url(#above-horizon)">
					<g class="rays">
						<path
							v-for="(angle, i) in RAYS"
							:key="angle"
							:d="i % 2 ? 'M197.4 74 L202.6 74 L201 46 L199 46 Z' : 'M195.6 74 L204.4 74 L201.6 22 L198.4 22 Z'"
							:transform="`rotate(${angle} 200 212)`"
						/>
					</g>
					<circle class="disc" cx="200" cy="212" r="120" />
				</g>
			</svg>
			<svg class="sweat" viewBox="0 0 10 14" aria-hidden="true" focusable="false">
				<path d="M5 0 C7 4 10 6.5 10 9.2 A5 5 0 0 1 0 9.2 C0 6.5 3 4 5 0 Z" />
			</svg>
			<MainStache class="face" bubble="above" />
		</div>

		<div class="horizon" aria-hidden="true"></div>
	</section>
</template>

<style scoped>
.hero {
	display: grid;
	grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
	grid-template-rows: 1fr auto;
	align-items: center;
	column-gap: clamp(28px, 5vw, 80px);
	/* Shorter than the window, so the horizon line is in view when the page opens */
	min-height: calc(100svh - var(--header-h) - 88px);
	padding-top: clamp(24px, 5vw, 64px);
}

.copy {
	padding-bottom: clamp(32px, 6vw, 72px);
}

.sky {
	position: relative;
	align-self: end;
	justify-self: center;
	width: min(100%, 540px);
}

.sun {
	display: block;
	width: 100%;
	height: auto;
	overflow: hidden;
}

.disc,
.rays {
	fill: var(--red);
}

.rays {
	transform-box: view-box;
	transform-origin: 200px 212px;
	animation: turn 90s linear infinite;
}

/* The face sits on the sun, just above the horizon */
.face {
	position: absolute;
	left: 50%;
	bottom: 3%;
	width: 36%;
	transform: translateX(-50%);
	--stache: var(--on-red);
	--focus: var(--on-red);
}

.sweat {
	position: absolute;
	left: 30%;
	top: 44%;
	width: 2.6%;
	fill: var(--eye-white);
	opacity: 0;
	animation: sweat 6s ease-in infinite;
}

.horizon {
	grid-column: 1 / -1;
	height: 1.5px;
	background: var(--ink);
}

@keyframes turn {
	to {
		transform: rotate(360deg);
	}
}

@keyframes sweat {
	0%,
	55% {
		opacity: 0;
		transform: translateY(0);
	}
	62% {
		opacity: 1;
		transform: translateY(0);
	}
	92% {
		opacity: 1;
		transform: translateY(260%);
	}
	100% {
		opacity: 0;
		transform: translateY(300%);
	}
}

@media (max-width: 900px) {
	.hero {
		grid-template-columns: 1fr;
		min-height: 0;
	}

	.copy {
		padding-bottom: 40px;
	}

	.sky {
		width: min(100%, 420px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.rays,
	.sweat {
		animation: none;
	}

	.sweat {
		opacity: 1;
	}
}
</style>
