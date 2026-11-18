<script setup lang="ts">
// A case study's card in Work. The whole card opens it, but only its title is the link, so
// screen readers hear "Fly Island, link" rather than every word on the card.
import { studyPath, studyNumber, type CaseStudy } from '../caseStudies'
import { work, caseStudyPage } from '../content'

const { study } = defineProps<{ study: CaseStudy }>()
</script>

<template>
	<article class="card">
		<div class="shot">
			<!-- The same picture opens the case study, described there; here it's decoration. -->
			<img :src="study.cover.src" alt="" :width="study.cover.width" :height="study.cover.height" loading="lazy" decoding="async" />
		</div>
		<div class="body">
			<p class="label">{{ work.slotLabel }} {{ studyNumber(study) }}</p>
			<h3 class="title">
				<a class="link" :href="studyPath(study)">{{ study.title }}</a>
			</h3>
			<p class="what">{{ study.what }}</p>
			<ul class="tags" :aria-label="caseStudyPage.tagsLabel">
				<li v-for="tag in study.tags" :key="tag">{{ tag }}</li>
			</ul>
			<p class="more" aria-hidden="true">{{ work.read }} <span class="arrow">→</span></p>
		</div>
	</article>
</template>

<style scoped>
.card {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	background: var(--paper-raised);
	border: 1.5px solid var(--ink);
	border-radius: 16px;
	transition:
		transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
		box-shadow 220ms;
}

.card:hover {
	transform: translateY(-3px);
	box-shadow: 0 5px 0 var(--red);
}

/* The title's link covers the whole card */
.link {
	color: inherit;
	text-decoration: none;
}

.link::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
}

.link:focus-visible {
	outline: none;
}

.card:has(.link:focus-visible) {
	outline: 2px solid var(--focus);
	outline-offset: 3px;
}

.shot {
	flex: none;
	aspect-ratio: 1434 / 660;
	overflow: hidden;
	border-bottom: 1.5px solid var(--ink);
}

.shot img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: scale 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.card:hover .shot img {
	scale: 1.04;
}

.body {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 10px;
	padding: 16px 20px 18px;
}

.body p {
	margin: 0;
}

.label {
	font-family: var(--font-mono);
	font-size: 0.75rem;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--red-text);
}

.title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.6rem, 2.6vw, 2.1rem);
	font-weight: 560;
	line-height: 1.05;
	letter-spacing: -0.02em;
	font-variation-settings: var(--display-axes), 'opsz' 72;
}

.what {
	color: var(--ink-soft);
	line-height: 1.4;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin: 0;
	padding: 0;
	list-style: none;
}

.tags li {
	padding: 2px 9px;
	font-family: var(--font-mono);
	font-size: 0.68rem;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--ink-soft);
	border: 1.5px solid var(--rule-strong);
	border-radius: 999px;
}

/* Sits at the bottom, however tall the card is */
.more {
	margin-top: auto !important;
	padding-top: 4px;
	font-weight: 600;
}

.arrow {
	display: inline-block;
	color: var(--red);
	transition: translate 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card:hover .arrow {
	translate: 4px 0;
}

:root.reduce-motion .card,
:root.reduce-motion .shot img,
:root.reduce-motion .arrow {
	transition: none;
}

:root.reduce-motion .card:hover {
	transform: none;
}
</style>
