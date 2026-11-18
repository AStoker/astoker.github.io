<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, useTemplateRef, type ComponentPublicInstance } from 'vue'
import MustacheIcon from './MustacheIcon.vue'
import { hunt } from '../composables/stacheHunt'
import { useCurrentSection } from '../composables/currentSection'
import { useReplay } from '../composables/timers'
import { profile, nav, sections, huntText } from '../content'
import type { SectionId } from '../types'

const { home = '', here } = defineProps<{
	/** Where my home page is, for pages other than it: '/'. Leave out on the home page itself. */
	home?: string
	/** On another page, the section it belongs to, which gets the little mustache. */
	here?: SectionId
}>()

// A little mustache slides under whichever link you're on (or pointing at).
const current = useCurrentSection()
const hovered = ref<string | null>(null)
const target = computed(() => hovered.value ?? here ?? current.value)
const linkEls: Record<string, HTMLElement> = {}
const indicator = reactive({ x: 0, show: false })

function placeIndicator() {
	const el = target.value ? linkEls[target.value] : undefined
	indicator.show = Boolean(el)
	if (el) indicator.x = el.offsetLeft + el.offsetWidth / 2
}

// Remembers each link's element, so the indicator can line up under it.
function linkRef(id: string) {
	return (el: Element | ComponentPublicInstance | null) => {
		if (el instanceof HTMLElement) linkEls[id] = el
	}
}

watch(target, placeIndicator)

const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 8)

// On narrow screens the links fold into a Menu button (CSS decides when).
// It opens and closes like any disclosure: Escape or a click elsewhere closes it.
const menuOpen = ref(false)
const navEl = useTemplateRef<HTMLElement>('navEl')
const menuButton = useTemplateRef<HTMLButtonElement>('menuButton')
const inMenu = (target: EventTarget | null) => target instanceof Node && Boolean(navEl.value?.contains(target))

function closeMenu({ refocus = false }: { refocus?: boolean } = {}) {
	if (!menuOpen.value) return
	menuOpen.value = false
	if (refocus) menuButton.value?.focus()
}

function onNavKey(e: KeyboardEvent) {
	if (e.key === 'Escape' && menuOpen.value) closeMenu({ refocus: true })
}

function onDocPointer(e: PointerEvent) {
	if (menuOpen.value && !inMenu(e.target)) closeMenu()
}

// Tabbing out of the open menu closes it, so it never sits over the page unattended.
function onNavFocusOut(e: FocusEvent) {
	if (menuOpen.value && !inMenu(e.relatedTarget)) closeMenu()
}

// The counter gives a little jump whenever something new is found.
const { playing: bump, play: playBump } = useReplay(500)
watch(
	() => hunt.lastFound,
	(cousin) => cousin && playBump(),
)

onMounted(() => {
	window.addEventListener('scroll', onScroll, { passive: true })
	window.addEventListener('resize', placeIndicator)
	document.addEventListener('pointerdown', onDocPointer)
	onScroll()
	// On another page the mustache starts under its section, so place it now, and again once
	// the fonts have loaded and the links have their real widths.
	if (here) {
		placeIndicator()
		document.fonts?.ready.then(placeIndicator)
	}
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', onScroll)
	window.removeEventListener('resize', placeIndicator)
	document.removeEventListener('pointerdown', onDocPointer)
})
</script>

<template>
	<header class="site-header" :class="{ scrolled }">
		<div class="container inner">
			<a
				class="brand"
				:href="home || '#top'"
				:aria-label="`${profile.firstName} ${profile.lastName}, ${home ? nav.homePage : nav.home}`"
			>
				<MustacheIcon class="brand-mark" />
				<span class="brand-name">{{ profile.firstName }} {{ profile.lastName }}</span>
			</a>

			<nav
				ref="navEl"
				class="nav"
				:class="{ open: menuOpen }"
				:aria-label="nav.label"
				@keydown="onNavKey"
				@focusout="onNavFocusOut"
			>
				<button
					ref="menuButton"
					class="bare-button menu-toggle"
					type="button"
					:aria-expanded="menuOpen ? 'true' : 'false'"
					aria-controls="main-nav-links"
					@click="menuOpen = !menuOpen"
				>
					<span class="menu-lines" aria-hidden="true"><span /><span /><span /></span>
					{{ nav.menu }}
				</button>
				<ul id="main-nav-links" @pointerleave="hovered = null">
					<li v-for="section in sections" :key="section.id">
						<a
							:ref="linkRef(section.id)"
							:href="`${home}#${section.id}`"
							:aria-current="current === section.id ? 'location' : undefined"
							@pointerenter="hovered = section.id"
							@focus="hovered = section.id"
							@blur="hovered = null"
							@click="closeMenu()"
						>
							{{ section.menu }}
						</a>
					</li>
				</ul>
				<span class="indicator" :class="{ show: indicator.show }" :style="{ '--x': `${indicator.x}px` }">
					<MustacheIcon />
				</span>
			</nav>

			<!-- Always visible, so it's clear there's something to find. Jumps to my portrait wall. -->
			<a
				class="hunt"
				:class="{ bump, done: hunt.complete }"
				:href="`${home}#family`"
				:title="`${huntText.counter}: ${hunt.count} of ${hunt.total}`"
			>
				<MustacheIcon class="hunt-icon" kind="handlebar" />
				<span class="visually-hidden">{{ huntText.counter }}:</span>
				<span>{{ hunt.count }}/{{ hunt.total }}</span>
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
	font-variation-settings: var(--display-axes), 'opsz' 24;
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
	min-height: 28px;
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

.menu-toggle {
	display: none;
}

@media (max-width: 640px) {
	.brand-name {
		display: none;
	}
}

/* Phones: the four links fold into a Menu button, and drop down below the header */
@media (max-width: 540px) {
	.inner {
		gap: 12px;
	}

	.brand-mark {
		width: 34px;
	}

	/* Plain text like the links it stands in for, so it never looks like the
	   outlined hunt counter beside it */
	.menu-toggle {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 0 6px;
		font-weight: 550;
		color: var(--ink);
		border-radius: 8px;
	}

	.menu-toggle:focus-visible {
		outline-offset: 2px;
	}

	/* Three lines that fold into an × while the menu's open */
	.menu-lines {
		position: relative;
		width: 18px;
		height: 14px;
	}

	.menu-lines span {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		border-radius: 2px;
		background: currentColor;
		transition:
			transform 220ms ease,
			opacity 150ms;
	}

	.menu-lines span:nth-child(2) {
		top: 6px;
	}

	.menu-lines span:nth-child(3) {
		top: 12px;
	}

	.open .menu-lines span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}

	.open .menu-lines span:nth-child(2) {
		opacity: 0;
	}

	.open .menu-lines span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	.nav ul {
		display: none;
		position: absolute;
		top: calc(100% + 16px);
		right: 0;
		flex-direction: column;
		gap: 2px;
		min-width: 210px;
		padding: 8px;
		background: var(--paper-raised);
		border: 1.5px solid var(--ink);
		border-radius: 16px;
		box-shadow: 0 14px 34px -14px rgb(0 0 0 / 0.4);
	}

	.nav.open ul {
		display: flex;
	}

	.nav a {
		padding: 10px 12px;
		border-radius: 10px;
	}

	.nav a[aria-current] {
		text-decoration: underline;
		text-decoration-color: var(--red);
		text-decoration-thickness: 2px;
		text-underline-offset: 6px;
	}

	.indicator {
		display: none;
	}
}

:root.reduce-motion .indicator {
	transition: opacity 200ms;
}

:root.reduce-motion .menu-lines span {
	transition: none;
}

:root.reduce-motion .brand:hover .brand-mark :deep(.half),
:root.reduce-motion .hunt.bump {
	animation: none;
}
</style>
