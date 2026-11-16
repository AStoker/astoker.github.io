<script setup>
// TEMPORARY: lets you flip between the three hero designs while deciding.
import { HERO_OPTIONS, heroOption, setHeroOption } from '../composables/heroOption.js'
</script>

<template>
	<div class="switcher" role="group" aria-label="Hero design options (temporary)">
		<span class="label">Hero option</span>
		<button
			v-for="(option, i) in HERO_OPTIONS"
			:key="option.id"
			type="button"
			:aria-pressed="heroOption === option.id"
			@click="setHeroOption(option.id)"
		>
			{{ 'ABC'[i] }}<span class="name"> · {{ option.label }}</span>
		</button>
	</div>
</template>

<style scoped>
.switcher {
	position: fixed;
	left: 12px;
	bottom: 12px;
	z-index: 80;
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 5px;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	color: var(--paper);
	background: var(--ink);
	border-radius: 999px;
	box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.5);
}

.label {
	padding: 0 6px 0 10px;
	opacity: 0.7;
}

button {
	all: unset;
	padding: 5px 10px;
	cursor: pointer;
	border-radius: 999px;
}

button[aria-pressed='true'] {
	color: var(--ink);
	background: var(--paper);
}

button:focus-visible {
	outline: 2px solid var(--red);
	outline-offset: 2px;
}

@media (max-width: 640px) {
	.label,
	.name {
		display: none;
	}
}
</style>
