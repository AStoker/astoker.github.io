<script setup>
// One numbered section of my page: its heading, an optional note beside it, then whatever
// goes in the default slot. `section` is one of `sections` in content.js; its place in that
// list gives it its number, and its id is what the menu links to.
//
//   <PageSection :section="work">
//     <template #note><p>{{ work.note }}</p></template>
//     …
//   </PageSection>
import { sections } from '../content.js'

const props = defineProps({
	section: { type: Object, required: true },
})

const num = String(sections.indexOf(props.section) + 1).padStart(2, '0')
const titleId = `${props.section.id}-title`
</script>

<template>
	<section :id="section.id" class="section container" :aria-labelledby="titleId">
		<header class="section-head">
			<p class="section-num" aria-hidden="true">{{ num }}</p>
			<h2 :id="titleId" class="section-title">{{ section.title }}</h2>
			<div v-if="$slots.note" class="section-note"><slot name="note" /></div>
		</header>
		<slot />
	</section>
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
	font-variation-settings: var(--display-axes), 'opsz' 144;
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
