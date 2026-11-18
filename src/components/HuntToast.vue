<script setup lang="ts">
// Two toasts at the bottom of the window: a quick "You found …!" after each find, and a
// bigger celebration once all five are home.
import { ref, watch, watchEffect } from 'vue'
import MustacheIcon from './MustacheIcon.vue'
import { hunt, wallCaptionInView } from '../composables/stacheHunt'
import { useTimers } from '../composables/timers'
import { huntText } from '../content'

// ---------- One found ----------

const showFound = ref(false)
const foundTimer = useTimers()

watch(
	() => hunt.lastFound,
	(cousin) => {
		foundTimer.clear()
		// The last one gets the celebration instead, and nothing's left behind once it closes.
		showFound.value = Boolean(cousin) && !hunt.complete
		if (showFound.value) foundTimer.after(3000, () => (showFound.value = false))
	},
)

// ---------- All found ----------

const celebrating = ref(false)
const settled = ref(false) // it's been up long enough not to be missed
const settleTimer = useTimers()

watch(
	() => hunt.complete,
	(done) => {
		celebrating.value = done
		settled.value = false
		settleTimer.clear()
		if (done) settleTimer.after(2000, () => (settled.value = true))
	},
)

// The wall's caption says the same thing, and at the top of the page this toast sits right
// on the wall's button. So once the caption is fully in view, the toast steps aside.
watchEffect(() => {
	if (settled.value && wallCaptionInView.value) celebrating.value = false
})

// Back up to the portrait wall, where they all run off before the hunt resets.
// The send-off waits until the scroll lands, so it isn't over before you get there.
function hideAgain() {
	celebrating.value = false
	if (window.scrollY < 10) return hunt.requestHide()
	let sent = false
	const send = () => {
		if (sent) return
		sent = true
		hunt.requestHide()
	}
	window.addEventListener('scrollend', send, { once: true })
	setTimeout(send, 1200) // for browsers without scrollend
	window.scrollTo({ top: 0 })
}
</script>

<template>
	<div class="region" aria-live="polite">
		<Transition name="toast">
			<div v-if="celebrating" class="toast big">
				<MustacheIcon class="icon" />
				<div class="text">
					<p class="title">{{ huntText.allTitle }}</p>
					<p>
						{{ huntText.allBody }} <a href="#contact" @click="celebrating = false">{{ huntText.allLink }}</a>.
					</p>
				</div>
				<div class="buttons">
					<button type="button" class="bare-button link" @click="hideAgain">{{ huntText.reset }}</button>
					<button type="button" class="bare-button close" :aria-label="huntText.close" @click="celebrating = false">
						<span aria-hidden="true">×</span>
					</button>
				</div>
			</div>
			<div v-else-if="showFound && hunt.lastFound" class="toast">
				<MustacheIcon class="icon" :kind="hunt.lastFound.kind" />
				<p>
					{{ huntText.foundOne(hunt.lastFound.name) }}
					<span class="count">{{ hunt.count }} of {{ hunt.total }}</span>
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
	font-variation-settings: var(--display-axes);
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
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 32px;
	color: inherit;
	border-radius: 8px;
}

.buttons button:focus-visible {
	outline-offset: 1px;
}

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

/* Phones: the text gets the full width, with Hide them again tucked underneath */
@media (max-width: 540px) {
	.big {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		grid-template-areas:
			'icon text close'
			'icon again again';
		column-gap: 10px;
		row-gap: 2px;
		padding: 14px 10px 10px 14px;
		border-radius: 18px;
	}

	.big .icon {
		grid-area: icon;
		width: 30px;
		margin-top: 2px;
	}

	.big .text {
		grid-area: text;
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.title {
		font-size: 1.15rem;
	}

	.buttons {
		display: contents; /* so the two buttons can sit in the grid on their own */
	}

	.buttons .close {
		grid-area: close;
		align-self: start;
		margin-top: -6px;
	}

	.buttons .link {
		grid-area: again;
		justify-self: start;
		padding: 0;
	}
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
