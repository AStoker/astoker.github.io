<script setup lang="ts">
import { ref } from 'vue'
import NappingStache from './NappingStache.vue'
import { profile, footer, tracking as words } from '../content'
import { reducedMotion, setReducedMotion } from '../composables/media'
import { tracking, setTracking } from '../composables/tracking'

const { walrus = true } = defineProps<{
	/** The Walrus naps on the footer line. Off on case study pages: the cousins live on my home page. */
	walrus?: boolean
}>()

const year = new Date().getFullYear()
const trackingNoteOpen = ref(false)
</script>

<template>
	<footer id="footer" class="site-footer">
		<div class="container">
			<div class="inner">
				<NappingStache v-if="walrus" id="walrus" class="nap" />
				<p>© {{ year }} {{ profile.firstName }} {{ profile.lastName }}</p>
				<p class="small">{{ footer.note }}</p>
				<button
					type="button"
					class="bare-button tracking-note-button"
					aria-controls="tracking-note"
					:aria-expanded="trackingNoteOpen ? 'true' : 'false'"
					@click="trackingNoteOpen = !trackingNoteOpen"
				>
					{{ words.summary }}
				</button>
				<!-- Stills every blink, breath and wiggle on the page. Starts from the system setting. -->
				<button
					type="button"
					class="bare-button toggle motion"
					:aria-pressed="reducedMotion ? 'true' : 'false'"
					@click="setReducedMotion(!reducedMotion)"
				>
					<span class="switch" aria-hidden="true"><span class="knob" /></span>
					{{ footer.motion }}
				</button>
				<!-- What Clarity is for, and the switch for it -->
				<div v-show="trackingNoteOpen" id="tracking-note" class="tracking-note">
					<p v-for="(paragraph, i) in words.note.slice(0, -1)" :key="i">{{ paragraph }}</p>
					<p>
						{{ words.note.at(-1) }} <a :href="words.privacyUrl" rel="noopener">{{ words.privacyLink }}</a>.
					</p>
					<button
						type="button"
						class="bare-button toggle tracking-switch"
						:aria-pressed="tracking ? 'true' : 'false'"
						@click="setTracking(!tracking)"
					>
						<span class="switch" aria-hidden="true"><span class="knob" /></span>
						{{ words.switch }}
					</button>
				</div>
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

.tracking-note-button {
	min-height: 32px;
	padding: 4px 2px;
	color: var(--ink-soft);
	text-decoration: underline;
	text-underline-offset: 3px;
	border-radius: 8px;
}

.tracking-note-button:hover {
	color: var(--ink);
}

.tracking-note {
	flex-basis: 100%;
	max-width: 62ch;
	padding-top: 8px;
	color: var(--ink-soft);
}

.inner .tracking-note p {
	margin: 0 0 0.8em;
}

.tracking-note a {
	color: inherit;
	text-decoration-color: var(--red);
	text-underline-offset: 3px;
}

.toggle {
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

.toggle[aria-pressed='true'] .switch {
	background: var(--ink);
}

.toggle[aria-pressed='true'] .knob {
	background: var(--paper);
	transform: translateX(15px);
}

:root.reduce-motion .switch,
:root.reduce-motion .knob {
	transition: none;
}
</style>
