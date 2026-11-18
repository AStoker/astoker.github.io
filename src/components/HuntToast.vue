<script setup>
import { ref, computed, watch } from 'vue'
import MustacheIcon from './MustacheIcon.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { hunt as words } from '../content.js'

const { state, count, total, complete, cousin, reset } = useStacheHunt()
const show = ref(false)
const latest = computed(() => cousin(state.lastFound))
let timer

watch(
	() => state.findCount,
	() => {
		if (complete.value) return // the celebration takes over
		show.value = true
		clearTimeout(timer)
		timer = setTimeout(() => (show.value = false), 3000)
	},
)

function hideAgain() {
	reset()
	window.scrollTo({ top: 0 })
}
</script>

<template>
	<div class="region" aria-live="polite">
		<Transition name="toast">
			<div v-if="state.celebrating" class="toast big">
				<MustacheIcon class="icon" />
				<div class="text">
					<p class="title">{{ words.allTitle }}</p>
					<p>
						{{ words.allBody }} <a href="#contact" @click="state.celebrating = false">{{ words.allLink }}</a>.
					</p>
				</div>
				<div class="buttons">
					<button type="button" class="link" @click="hideAgain">{{ words.reset }}</button>
					<button type="button" class="close" :aria-label="words.close" @click="state.celebrating = false">
						<span aria-hidden="true">×</span>
					</button>
				</div>
			</div>
			<div v-else-if="show && latest" class="toast">
				<MustacheIcon class="icon" :kind="latest.kind" />
				<p>
					{{ words.foundOne(latest.name) }} <span class="count">{{ count }} of {{ total }}</span>
				</p>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.region {
	position: fixed;
	left: 50%;
	bottom: 20px;
	z-index: 60;
	width: min(calc(100% - 32px), 520px);
	transform: translateX(-50%);
	pointer-events: none;
}

.toast {
	display: flex;
	align-items: center;
	gap: 12px;
	width: fit-content;
	margin-inline: auto;
	padding: 12px 18px;
	font-weight: 550;
	color: var(--paper);
	background: var(--ink);
	border-radius: 999px;
	box-shadow: 0 10px 30px -10px rgb(0 0 0 / 0.4);
	pointer-events: auto;
	--focus: var(--paper);
}

.toast p {
	margin: 0;
}

.icon {
	flex: none;
	width: 30px;
	color: var(--red);
}

.count {
	margin-left: 6px;
	font-family: var(--font-mono);
	font-size: 0.85em;
	opacity: 0.75;
}

.big {
	align-items: flex-start;
	width: 100%;
	padding: 18px 20px;
	border-radius: 20px;
}

.big .icon {
	width: 44px;
	margin-top: 4px;
}

.big .text {
	flex: 1;
	font-weight: 400;
}

.title {
	font-family: var(--font-display);
	font-size: 1.3rem;
	font-weight: 600;
	font-variation-settings: 'SOFT' 100, 'WONK' 1;
}

.big a {
	color: inherit;
	text-decoration-color: var(--red);
	text-decoration-thickness: 2px;
	text-underline-offset: 3px;
}

.buttons {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4px;
	margin: -6px -6px 0 0;
}

.buttons button {
	all: unset;
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 32px;
	cursor: pointer;
	color: inherit;
	border-radius: 8px;
}

.buttons button:focus-visible {
	outline: 2px solid var(--focus);
	outline-offset: 1px;
}

/* .buttons in front so these beat the `all: unset` above */
.buttons .link {
	padding: 0 6px;
	font-size: 0.85rem;
	text-decoration: underline;
	text-underline-offset: 3px;
	white-space: nowrap;
	order: 2;
}

.buttons .close {
	min-width: 32px;
	font-size: 1.4rem;
	line-height: 1;
	order: 1;
}

.toast-enter-active,
.toast-leave-active {
	transition:
		opacity 250ms,
		transform 400ms cubic-bezier(0.34, 1.45, 0.64, 1);
}

.toast-enter-from,
.toast-leave-to {
	opacity: 0;
	transform: translateY(16px);
}

:root.reduce-motion .toast-enter-from,
:root.reduce-motion .toast-leave-to {
	transform: none;
}
</style>
