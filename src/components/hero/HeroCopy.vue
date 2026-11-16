<script setup>
// The words in the hero: who, what, and where to go next. Shared by every hero design.
import { profile, hero } from '../../content.js'

defineProps({
	centered: { type: Boolean, default: false },
	// Replaces the "role — location" line above the name.
	kicker: { type: String, default: undefined },
})
</script>

<template>
	<div class="copy" :class="{ centered }">
		<p class="kicker">
			<template v-if="kicker">{{ kicker }}</template>
			<template v-else>{{ profile.role }} <span aria-hidden="true">·</span> {{ profile.location }}</template>
		</p>
		<h1 class="name">
			<span>{{ profile.firstName }}</span>
			<span>{{ profile.lastName }}</span>
		</h1>
		<!-- Room for something between the name and the text (the sign lockup uses it) -->
		<slot />
		<p class="lede">
			<strong>{{ hero.greeting }}</strong>
			{{ hero.lede }}
		</p>
		<div class="actions">
			<a class="btn btn-solid" :href="hero.primary.href">{{ hero.primary.label }}</a>
			<a class="btn btn-ghost" :href="hero.secondary.href">{{ hero.secondary.label }}</a>
		</div>
	</div>
</template>

<style scoped>
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
	max-width: 36ch;
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

/* Centred: the name on one line when there's room */
.centered {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.centered .name {
	font-size: clamp(3.2rem, 12vw, 10rem);
}

.centered .name span {
	display: inline;
}

.centered .name span + span::before {
	content: ' ';
}

.centered .lede {
	max-width: 46ch;
	margin-top: 8px;
}

.centered .actions {
	justify-content: center;
}

@media (max-width: 640px) {
	.centered .name span {
		display: block;
	}

	.centered .name span + span::before {
		content: none;
	}
}
</style>
