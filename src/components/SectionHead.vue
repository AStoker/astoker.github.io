<script setup>
defineProps({
	num: { type: String, required: true },
	title: { type: String, required: true },
	id: { type: String, default: undefined },
})
</script>

<template>
	<header class="section-head">
		<p class="section-num" aria-hidden="true">{{ num }}</p>
		<h2 :id="id" class="section-title">{{ title }}</h2>
		<div v-if="$slots.default" class="section-note"><slot /></div>
	</header>
</template>

<style scoped>
.section-head {
	display: grid;
	grid-template-columns: auto 1fr;
	column-gap: 20px;
	align-items: baseline;
	padding-top: 20px;
	margin-bottom: clamp(32px, 5vw, 56px);
	border-top: 1.5px solid var(--ink);
}

.section-num {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--red-text);
}

.section-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(2.2rem, 5vw, 3.6rem);
	font-weight: 560;
	line-height: 1;
	letter-spacing: -0.025em;
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 144;
}

.section-note {
	grid-column: 2;
	max-width: 48ch;
	margin-top: 14px;
	color: var(--ink-soft);
}

.section-note :deep(p) {
	margin: 0;
}
</style>
