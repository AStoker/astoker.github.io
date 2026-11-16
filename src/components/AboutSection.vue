<script setup>
import SectionHead from './SectionHead.vue'
import { about } from '../content.js'
</script>

<template>
	<section id="about" class="section container" aria-labelledby="about-title">
		<SectionHead id="about-title" num="02" :title="about.title" />

		<div class="about-grid">
			<p class="statement">{{ about.statement }}</p>
			<div>
				<p v-for="paragraph in about.body" :key="paragraph" class="body">{{ paragraph }}</p>
				<dl class="facts">
					<div v-for="fact in about.facts" :key="fact.label" class="fact">
						<dt>{{ fact.label }}</dt>
						<dd>{{ fact.value }}</dd>
					</div>
				</dl>
			</div>
		</div>
	</section>
</template>

<style scoped>
.about-grid {
	display: grid;
	grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
	gap: clamp(28px, 6vw, 96px);
	align-items: start;
}

.statement {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(2rem, 4.4vw, 3.4rem);
	font-weight: 420;
	line-height: 1.1;
	letter-spacing: -0.02em;
	font-variation-settings: 'SOFT' 100, 'WONK' 0, 'opsz' 96;
	text-wrap: balance;
}

.body {
	margin: 0 0 1em;
	font-size: 1.1rem;
	color: var(--ink-soft);
}

.body:first-child {
	color: var(--ink);
}

.facts {
	margin: 28px 0 0;
	border-top: 1px solid var(--rule);
}

.fact {
	display: flex;
	justify-content: space-between;
	gap: 16px;
	padding: 14px 0;
	border-bottom: 1px solid var(--rule);
}

.fact dt {
	font-family: var(--font-mono);
	font-size: 0.78rem;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--ink-soft);
}

.fact dd {
	margin: 0;
	font-weight: 600;
	text-align: right;
}

@media (max-width: 760px) {
	.about-grid {
		grid-template-columns: 1fr;
	}
}
</style>
