<script setup lang="ts">
// A case study's own page, at /work/<slug>/. Every study follows the same outline (see
// src/caseStudies/types.ts): the story on the right, a small label on the left saying
// which part of it you're reading.
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import { caseStudies, studyNumber, studyPath, type CaseStudy, type StorySection } from '../caseStudies'
import { caseStudyPage as words, contact, nav, profile, work } from '../content'

const { study } = defineProps<{ study: CaseStudy }>()

const next = caseStudies[caseStudies.indexOf(study) + 1]

// "The goal", "Decision 1", "Decision 2"…
let decisions = 0
const label = (section: StorySection) =>
	section.part === 'decision' ? `${words.parts.decision} ${++decisions}` : words.parts[section.part]
const labels = study.story.map(label)

document.title = `${study.title} · ${profile.firstName} ${profile.lastName}`
</script>

<template>
	<a class="skip-link" href="#main">{{ nav.skipLink }}</a>
	<SiteHeader home="/" here="work" />
	<main id="main">
		<article class="study" aria-labelledby="study-title">
			<header class="container intro">
				<a class="back" href="/#work"><span class="back-arrow" aria-hidden="true">←</span> {{ words.back }}</a>
				<p class="eyebrow">{{ work.slotLabel }} {{ studyNumber(study) }}</p>
				<h1 id="study-title" class="title">{{ study.title }}</h1>
				<p class="what">{{ study.what }}</p>
				<p class="lede">{{ study.summary }}</p>
				<ul class="tags" :aria-label="words.tagsLabel">
					<li v-for="tag in study.tags" :key="tag">{{ tag }}</li>
				</ul>
			</header>

			<div class="container">
				<figure class="cover frame">
					<img
						:src="study.cover.src"
						:alt="study.cover.alt"
						:width="study.cover.width"
						:height="study.cover.height"
						fetchpriority="high"
					/>
				</figure>

				<section class="glance" aria-labelledby="glance-title">
					<h2 id="glance-title" class="glance-title">{{ words.glance }}</h2>
					<dl>
						<div v-for="fact in study.facts" :key="fact.label" class="fact">
							<dt>{{ fact.label }}</dt>
							<dd>{{ fact.value }}</dd>
						</div>
					</dl>
					<ul v-if="study.links?.length" class="links">
						<li v-for="link in study.links" :key="link.href">
							<a :href="link.href" target="_blank" rel="noopener">
								{{ link.label }}<span class="visually-hidden"> {{ contact.newTab }}</span>
								<span class="out" aria-hidden="true">↗</span>
							</a>
						</li>
					</ul>
				</section>
			</div>

			<div class="container story">
				<section
					v-for="(section, i) in study.story"
					:key="section.heading"
					class="part"
					:aria-labelledby="`part-${i}`"
				>
					<p class="part-label">{{ labels[i] }}</p>
					<div class="part-body">
						<h2 :id="`part-${i}`" class="part-title">{{ section.heading }}</h2>
						<p v-for="(paragraph, j) in section.paragraphs" :key="j" class="paragraph">{{ paragraph }}</p>

						<ul v-if="section.points" class="points">
							<li v-for="point in section.points" :key="point.title">
								<h3>{{ point.title }}</h3>
								<p>{{ point.body }}</p>
							</li>
						</ul>

						<div v-if="section.tradeoff" class="tradeoff">
							<p class="tradeoff-label">{{ words.tradeoff }}</p>
							<p>{{ section.tradeoff }}</p>
						</div>

						<ul v-if="section.numbers" class="numbers">
							<li v-for="number in section.numbers" :key="number.label">
								<span class="number">{{ number.value }}</span>
								<span class="number-label">{{ number.label }}</span>
							</li>
						</ul>

						<div v-if="section.figures" class="figures" :class="{ pair: section.figures.length > 1 }">
							<figure v-for="figure in section.figures" :key="figure.src">
								<div class="frame">
									<img
										:src="figure.src"
										:alt="figure.alt"
										:width="figure.width"
										:height="figure.height"
										loading="lazy"
										decoding="async"
									/>
								</div>
								<figcaption v-if="figure.caption">{{ figure.caption }}</figcaption>
							</figure>
						</div>
					</div>
				</section>
			</div>

			<section class="container end" aria-labelledby="end-title">
				<h2 id="end-title" class="end-title">{{ words.end.title }}</h2>
				<p class="end-body">{{ words.end.body }}</p>
				<div class="actions">
					<a class="btn btn-solid" href="/#contact">{{ words.end.contact }}</a>
					<a v-if="next" class="btn btn-ghost" :href="studyPath(next)">{{ words.end.next }}: {{ next.title }}</a>
					<a class="btn btn-ghost" href="/#work">{{ words.end.back }}</a>
				</div>
			</section>
		</article>
	</main>
	<SiteFooter :walrus="false" />
</template>

<style scoped>
/* ---------- The top: what it is ---------- */

.intro {
	padding-block: clamp(28px, 5vw, 56px) clamp(28px, 4vw, 44px);
}

.back {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-height: 44px;
	margin-bottom: clamp(16px, 3vw, 32px);
	font-weight: 600;
	text-decoration: none;
	border-radius: 8px;
}

.back:hover {
	text-decoration: underline;
	text-decoration-color: var(--red);
	text-decoration-thickness: 2px;
	text-underline-offset: 5px;
}

.back-arrow {
	color: var(--red);
	transition: translate 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.back:hover .back-arrow {
	translate: -4px 0;
}

.eyebrow,
.part-label,
.glance-title,
.tradeoff-label {
	margin: 0;
	font-family: var(--font-mono);
	font-size: 0.8rem;
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--red-text);
}

.title {
	margin: 10px 0 0;
	font-family: var(--font-display);
	font-size: clamp(3rem, 9vw, 6.5rem);
	font-weight: 560;
	line-height: 0.95;
	letter-spacing: -0.035em;
	font-variation-settings: var(--display-axes), 'opsz' 144;
}

.what {
	margin: 12px 0 0;
	font-family: var(--font-display);
	font-size: clamp(1.25rem, 2.4vw, 1.6rem);
	font-style: italic;
	color: var(--ink-soft);
	font-variation-settings: var(--display-axes-calm), 'opsz' 36;
}

.lede {
	max-width: 40ch;
	margin: clamp(20px, 3vw, 28px) 0 0;
	font-size: clamp(1.2rem, 2.1vw, 1.45rem);
	line-height: 1.45;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin: 22px 0 0;
	padding: 0;
	list-style: none;
}

.tags li {
	padding: 3px 10px;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--ink-soft);
	border: 1.5px solid var(--rule-strong);
	border-radius: 999px;
}

/* ---------- Pictures ---------- */

.frame {
	overflow: hidden;
	background: var(--paper-raised);
	border: 1.5px solid var(--ink);
	border-radius: 16px;
}

.frame img {
	display: block;
	width: 100%;
	height: auto;
}

.cover {
	margin: 0;
}

figure {
	margin: 0;
}

figcaption {
	margin-top: 10px;
	font-size: 0.92rem;
	line-height: 1.5;
	color: var(--ink-soft);
}

/* ---------- At a glance ---------- */

.glance {
	margin-top: clamp(24px, 4vw, 40px);
	padding: clamp(20px, 3vw, 28px);
	background: var(--paper-raised);
	border: 1.5px solid var(--ink);
	border-radius: 16px;
}

.glance dl {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 176px), 1fr));
	gap: 18px 28px;
	margin: 16px 0 0;
}

.fact dt {
	font-weight: 650;
}

.fact dd {
	margin: 2px 0 0;
	color: var(--ink-soft);
	line-height: 1.45;
}

.links {
	display: flex;
	flex-wrap: wrap;
	gap: 8px 24px;
	margin: 20px 0 0;
	padding: 16px 0 0;
	list-style: none;
	border-top: 1px solid var(--rule);
}

.links a {
	font-weight: 600;
	text-decoration-color: var(--red);
	text-decoration-thickness: 2px;
	text-underline-offset: 4px;
}

.out {
	margin-left: 4px;
	color: var(--red);
}

/* ---------- The story ---------- */

.story {
	margin-top: clamp(40px, 6vw, 72px);
}

.part {
	padding-block: clamp(28px, 4vw, 44px);
	border-top: 1.5px solid var(--rule);
}

.part-title {
	margin: 8px 0 0;
	font-family: var(--font-display);
	font-size: clamp(1.75rem, 3.6vw, 2.6rem);
	font-weight: 560;
	line-height: 1.08;
	letter-spacing: -0.02em;
	font-variation-settings: var(--display-axes), 'opsz' 96;
	text-wrap: balance;
}

.paragraph {
	max-width: 64ch;
	margin: 16px 0 0;
}

.part-title + .paragraph {
	margin-top: 20px;
}

/* Wide screens: the label sits in a column of its own, beside the story, and stays in
   view while you read that part */
@media (min-width: 900px) {
	.part {
		display: grid;
		grid-template-columns: 200px minmax(0, 1fr);
		column-gap: 40px;
	}

	.part-label {
		position: sticky;
		top: calc(var(--header-h) + 28px);
		align-self: start;
		padding-top: 0.9em;
	}

	.part-title {
		margin-top: 0;
	}
}

.points {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
	gap: 0 32px;
	max-width: 900px;
	margin: 24px 0 0;
	padding: 0;
	list-style: none;
}

.points li {
	padding: 16px 0 18px;
	border-top: 1px solid var(--rule);
}

.points h3 {
	margin: 0;
	font-size: 1.05rem;
	font-weight: 650;
}

.points p {
	margin: 6px 0 0;
	color: var(--ink-soft);
}

.tradeoff {
	max-width: 64ch;
	margin-top: 24px;
	padding: 16px 20px 18px;
	border-left: 4px solid var(--red);
	background: var(--paper-raised);
	border-radius: 0 12px 12px 0;
}

.tradeoff p {
	margin: 0;
}

.tradeoff-label {
	margin-bottom: 6px !important;
}

.numbers {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
	gap: 24px 28px;
	margin: 28px 0 0;
	padding: 0;
	list-style: none;
}

.numbers li {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding-top: 12px;
	border-top: 1.5px solid var(--ink);
}

.number {
	font-family: var(--font-display);
	font-size: clamp(2.2rem, 4.4vw, 3.2rem);
	font-weight: 560;
	line-height: 1;
	letter-spacing: -0.03em;
	font-variation-settings: var(--display-axes), 'opsz' 144;
}

.number-label {
	font-size: 0.95rem;
	line-height: 1.4;
	color: var(--ink-soft);
}

.figures {
	display: grid;
	gap: 24px;
	margin-top: 28px;
}

@media (min-width: 760px) {
	.figures.pair {
		grid-template-columns: 1fr 1fr;
	}
}

/* ---------- The end ---------- */

.end {
	padding-top: clamp(40px, 6vw, 72px);
}

.end-title {
	margin: 0;
	padding-top: 20px;
	font-family: var(--font-display);
	font-size: clamp(2rem, 4.5vw, 3.2rem);
	font-weight: 560;
	line-height: 1;
	letter-spacing: -0.025em;
	font-variation-settings: var(--display-axes), 'opsz' 144;
	border-top: 1.5px solid var(--ink);
}

.end-body {
	max-width: 48ch;
	margin: 16px 0 0;
	color: var(--ink-soft);
}

.actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 24px;
}

:root.reduce-motion .back-arrow {
	transition: none;
}
</style>
