<script setup>
import NappingStache from './NappingStache.vue'
import { profile, footer } from '../content.js'
import { reducedMotion, setReducedMotion } from '../composables/media.js'

const year = new Date().getFullYear()
</script>

<template>
	<footer id="footer" class="site-footer">
		<div class="container">
			<div class="inner">
				<NappingStache id="walrus" class="nap" />
				<p>© {{ year }} {{ profile.firstName }} {{ profile.lastName }}</p>
				<p class="small">{{ footer.note }}</p>
				<!-- Stills every blink, breath and wiggle on the page. Starts from the system setting. -->
				<button
					type="button"
					class="bare-button motion"
					:aria-pressed="reducedMotion ? 'true' : 'false'"
					@click="setReducedMotion(!reducedMotion)"
				>
					<span class="switch" aria-hidden="true"><span class="knob" /></span>
					{{ footer.motion }}
				</button>
			</div>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	margin-top: clamp(96px, 13vw, 170px);
}

.inner {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 8px 24px;
	padding-block: 28px 44px;
	border-top: 1.5px solid var(--ink);
	font-size: 0.95rem;
}

.inner p {
	margin: 0;
}

.small {
	color: var(--ink-soft);
}

/* Asleep on the line, mustache drooping over it */
.nap {
	position: absolute;
	top: 0;
	right: clamp(8px, 10vw, 140px);
	transform: translateY(calc(-100% + 6px));
}

.motion {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	min-height: 32px;
	padding: 4px 2px;
	font-size: 0.95rem;
	color: var(--ink);
	border-radius: 8px;
}

/* A little switch: outlined when off, filled with the knob across when on */
.switch {
	position: relative;
	flex: none;
	width: 36px;
	height: 20px;
	border: 1.5px solid var(--ink);
	border-radius: 999px;
	transition: background-color 160ms;
}

.knob {
	position: absolute;
	top: 2.5px;
	left: 3px;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: var(--ink);
	transition: transform 160ms;
}

.motion[aria-pressed='true'] .switch {
	background: var(--ink);
}

.motion[aria-pressed='true'] .knob {
	background: var(--paper);
	transform: translateX(15px);
}

:root.reduce-motion .switch,
:root.reduce-motion .knob {
	transition: none;
}
</style>
