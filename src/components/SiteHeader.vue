<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import MustacheIcon from './MustacheIcon.vue'
import { useStacheHunt } from '../composables/stacheHunt.js'
import { profile, hunt as words } from '../content.js'

const links = [
	{ id: 'work', label: 'Work' },
	{ id: 'about', label: 'About' },
	{ id: 'contact', label: 'Contact' },
]

const hunt = useStacheHunt()

// A little mustache slides under whichever link you're on (or pointing at).
const active = ref(null)
const hovered = ref(null)
const target = computed(() => hovered.value ?? active.value)
const linkEls = {}
const indicator = reactive({ x: 0, show: false })

function placeIndicator() {
	const el = linkEls[target.value]
	if (!el) {
		indicator.show = false
		return
	}
	indicator.x = el.offsetLeft + el.offsetWidth / 2
	indicator.show = true
}

watch(target, placeIndicator)

const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 8)

// Bump the counter when something new is found.
const bump = ref(false)
watch(
	() => hunt.state.findCount,
	async () => {
		bump.value = false
		await nextTick()
		requestAnimationFrame(() => (bump.value = true))
	},
)

let spy
onMounted(() => {
	spy = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) active.value = entry.target.id
				else if (active.value === entry.target.id) active.value = null
			}
		},
		{ rootMargin: '-45% 0px -50% 0px' },
	)
	links.forEach(({ id }) => {
		const section = document.getElementById(id)
		if (section) spy.observe(section)
	})
	window.addEventListener('scroll', onScroll, { passive: true })
	window.addEventListener('resize', placeIndicator)
	onScroll()
})

onBeforeUnmount(() => {
	spy?.disconnect()
	window.removeEventListener('scroll', onScroll)
	window.removeEventListener('resize', placeIndicator)
})
</script>

<template>
	<header class="site-header" :class="{ scrolled }">
		<div class="container inner">
			<a class="brand" href="#top" :aria-label="`${profile.firstName} ${profile.lastName}, back to top`">
				<MustacheIcon class="brand-mark" />
				<span class="brand-name">{{ profile.firstName }} {{ profile.lastName }}</span>
			</a>

			<nav class="nav" aria-label="Main">
				<ul @pointerleave="hovered = null">
					<li v-for="link in links" :key="link.id">
						<a
							:ref="(el) => (linkEls[link.id] = el)"
							:href="`#${link.id}`"
							:aria-current="active === link.id ? 'location' : undefined"
							@pointerenter="hovered = link.id"
							@focus="hovered = link.id"
							@blur="hovered = null"
						>
							{{ link.label }}
						</a>
					</li>
				</ul>
				<span class="indicator" :class="{ show: indicator.show }" :style="{ '--x': `${indicator.x}px` }">
					<MustacheIcon />
				</span>
			</nav>

			<!-- Always visible, so it's clear there's something to find. Jumps to the family lineup. -->
			<a
				class="hunt"
				:class="{ bump, done: hunt.complete.value }"
				href="#family"
				:title="`${words.counter}: ${hunt.count.value} of ${hunt.total}`"
			>
				<MustacheIcon class="hunt-icon" kind="handlebar" />
				<span class="visually-hidden">{{ words.counter }}:</span>
				<span>{{ hunt.count.value }}/{{ hunt.total }}</span>
			</a>
		</div>
	</header>
</template>

<style scoped>
.site-header {
	position: sticky;
	top: 0;
	z-index: 50;
	background: color-mix(in srgb, var(--paper) 94%, transparent);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border-bottom: 1px solid transparent;
	transition: border-color 200ms;
}

.site-header.scrolled {
	border-bottom-color: var(--rule);
}

.inner {
	display: flex;
	align-items: center;
	gap: clamp(12px, 3vw, 32px);
	height: var(--header-h);
}

.brand {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-right: auto;
	color: var(--ink);
	text-decoration: none;
	border-radius: 8px;
}

.brand-mark {
	width: 38px;
}

.brand:hover .brand-mark :deep(.half-l) {
	animation: stache-twirl-l 950ms ease-in-out;
}

.brand:hover .brand-mark :deep(.half-r) {
	animation: stache-twirl-r 950ms ease-in-out;
}

.brand-name {
	font-family: var(--font-display);
	font-size: 1.2rem;
	font-weight: 600;
	letter-spacing: -0.01em;
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 24;
}

.nav {
	position: relative;
}

.nav ul {
	display: flex;
	gap: clamp(14px, 3vw, 32px);
	margin: 0;
	padding: 0;
	list-style: none;
}

.nav a {
	display: block;
	padding: 8px 0;
	font-weight: 550;
	color: var(--ink);
	text-decoration: none;
}

.indicator {
	position: absolute;
	left: 0;
	bottom: -4px;
	width: 26px;
	color: var(--red);
	opacity: 0;
	transform: translateX(calc(var(--x) - 50%)) scale(0.6);
	transition:
		transform 420ms cubic-bezier(0.34, 1.45, 0.64, 1),
		opacity 200ms;
	pointer-events: none;
}

.indicator.show {
	opacity: 1;
	transform: translateX(calc(var(--x) - 50%)) scale(1);
}

.hunt {
	display: flex;
	align-items: center;
	gap: 6px;
	margin: 0;
	padding: 5px 10px;
	color: var(--ink);
	text-decoration: none;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	font-weight: 600;
	border: 1.5px solid var(--ink);
	border-radius: 999px;
}

.hunt.done {
	color: var(--paper);
	background: var(--ink);
}

.hunt-icon {
	width: 22px;
	color: var(--red);
}

.hunt.bump {
	animation: bump 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bump {
	40% {
		transform: scale(1.25) rotate(-4deg);
	}
}

@media (max-width: 640px) {
	.brand-name {
		display: none;
	}
}

/* Small phones: tighten up so the counter still fits */
@media (max-width: 420px) {
	.inner {
		gap: 12px;
	}

	.brand-mark {
		width: 34px;
	}

	.nav ul {
		gap: 14px;
	}

	.nav a {
		font-size: 0.95rem;
	}

	.hunt {
		gap: 4px;
		padding: 0;
		border: 0;
		font-size: 0.72rem;
	}

	.hunt.done {
		padding: 3px 7px;
	}

	.hunt-icon {
		width: 18px;
	}
}

@media (prefers-reduced-motion: reduce) {
	.indicator {
		transition: opacity 200ms;
	}

	.brand:hover .brand-mark :deep(.half),
	.hunt.bump {
		animation: none;
	}
}
</style>
