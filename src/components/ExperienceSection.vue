<script setup lang="ts">
// My experience: a few highlights rather than the whole resume, the short version of the
// path beside them, then everything I do off the clock. My resume is one click from the top.
import { ref } from 'vue'
import PageSection from './PageSection.vue'
import ResumeLink from './ResumeLink.vue'
import WorkshopLamp from './WorkshopLamp.vue'
import { experience, resume } from '../content'

const { offClock } = experience
// The closing line sits across from the workbench, and its last words light up with the lamp.
const lampOn = ref(false)
</script>

<template>
	<PageSection :section="experience">
		<template #note>
			<p>{{ experience.note }}</p>
			<ResumeLink class="btn btn-solid resume">
				<span>
					{{ resume.label }} <span class="format">({{ resume.format }})</span>
				</span>
			</ResumeLink>
		</template>

		<div class="xp">
			<div>
				<h3 class="kicker list-title">{{ experience.highlightsTitle }}</h3>
				<ul class="highlights">
					<li v-for="item in experience.highlights" :key="item.title" class="highlight">
						<h4 class="highlight-title">{{ item.title }}</h4>
						<p class="where">{{ item.where }}</p>
						<p class="highlight-body">{{ item.body }}</p>
						<ul class="chips" :aria-label="experience.tagsLabel">
							<li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
						</ul>
					</li>
				</ul>
			</div>

			<div class="side">
				<h3 class="kicker list-title">{{ experience.pathTitle }}</h3>
				<ol class="path">
					<li v-for="step in experience.path" :key="step.years + step.org">
						<span class="years">{{ step.years }}</span>
						<span class="role">{{ step.role }}</span>
						<span class="org">{{ step.org }}</span>
					</li>
				</ol>

				<h3 class="kicker list-title tools-title">{{ experience.toolsTitle }}</h3>
				<ul class="chips tools">
					<li v-for="tool in experience.tools" :key="tool">{{ tool }}</li>
				</ul>
			</div>
		</div>

		<div class="off">
			<h3 class="off-title">{{ offClock.title }}</h3>
			<p class="off-intro">{{ offClock.intro }}</p>
			<ul class="crafts">
				<li v-for="craft in offClock.crafts" :key="craft.name" class="craft">
					<h4 class="craft-name">{{ craft.name }}</h4>
					<p>{{ craft.line }}</p>
					<p class="at-work">
						<strong>{{ offClock.atWorkLabel }}</strong> {{ craft.atWork }}
					</p>
				</li>
			</ul>

			<div class="finale">
				<p class="closing">
					{{ offClock.closing }} <span class="light" :class="{ on: lampOn }">{{ offClock.closingLight }}</span>
				</p>
				<WorkshopLamp id="dali" v-model:lit="lampOn" class="bench" />
			</div>
		</div>
	</PageSection>
</template>

<style scoped>
.resume {
	margin-top: 20px;
}

.format {
	font-weight: 500;
	opacity: 0.85;
}

.xp {
	display: grid;
	grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
	gap: clamp(36px, 6vw, 96px);
	align-items: start;
}

.list-title {
	margin: 0 0 10px;
}

/* ---------- Highlights ---------- */

.highlights,
.path,
.chips,
.crafts {
	margin: 0;
	padding: 0;
	list-style: none;
}

.highlights {
	border-top: 1px solid var(--rule);
}

.highlight {
	padding: 26px 0 28px;
	border-bottom: 1px solid var(--rule);
}

.highlight-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.45rem, 2.5vw, 1.9rem);
	font-weight: 560;
	line-height: 1.12;
	letter-spacing: -0.015em;
	font-variation-settings: var(--display-axes), 'opsz' 72;
	text-wrap: balance;
}

.where {
	margin: 8px 0 12px;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	font-weight: 500;
	letter-spacing: 0.04em;
	color: var(--red-text);
}

.highlight-body {
	max-width: 62ch;
	margin: 0;
	color: var(--ink-soft);
}

.chips {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 16px;
}

.chips li {
	padding: 3px 10px;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--ink-soft);
	border: 1.5px solid var(--rule-strong);
	border-radius: 999px;
}

/* ---------- The short version ---------- */

.path {
	border-top: 1px solid var(--rule);
}

.path li {
	display: grid;
	grid-template-columns: 6.6em minmax(0, 1fr);
	column-gap: 14px;
	padding: 13px 0;
	border-bottom: 1px solid var(--rule);
}

.years {
	grid-row: span 2;
	padding-top: 3px;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	color: var(--ink-soft);
}

.role {
	font-weight: 600;
	line-height: 1.35;
}

.org {
	font-size: 0.95rem;
	color: var(--ink-soft);
}

.tools-title {
	margin-top: 36px;
}

.tools {
	margin-top: 0;
}

.tools li {
	color: var(--ink);
	border-color: var(--rule);
	background: var(--paper-raised);
}

/* ---------- Off the clock ---------- */

.off {
	margin-top: clamp(64px, 9vw, 120px);
}

.off-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(2rem, 4vw, 2.9rem);
	font-weight: 560;
	line-height: 1.05;
	letter-spacing: -0.025em;
	font-variation-settings: var(--display-axes), 'opsz' 144;
}

.off-intro {
	max-width: 52ch;
	margin: 14px 0 0;
	font-size: 1.1rem;
	color: var(--ink-soft);
}

/* Two by two on wide screens, one column on phones */
.crafts {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	column-gap: clamp(32px, 6vw, 96px);
	margin-top: 26px;
}

.craft {
	padding: 18px 0 20px;
	border-top: 1px solid var(--rule);
}

.craft-name {
	margin: 0 0 4px;
	font-family: var(--font-display);
	font-size: 1.3rem;
	font-weight: 600;
	font-variation-settings: var(--display-axes), 'opsz' 48;
}

.craft p {
	margin: 0;
	color: var(--ink-soft);
}

.craft .at-work {
	margin-top: 8px;
	color: var(--ink);
}

.at-work strong {
	margin-right: 4px;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--red-text);
}

/* The closing line, directly across from the workbench */
.finale {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	gap: clamp(32px, 6vw, 96px);
	align-items: center;
	margin-top: clamp(28px, 4vw, 48px);
	padding-top: clamp(28px, 4vw, 48px);
	border-top: 1px solid var(--rule);
}

.closing {
	max-width: 24ch;
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.5rem, 3vw, 2.25rem);
	font-weight: 450;
	line-height: 1.2;
	letter-spacing: -0.01em;
	font-variation-settings: var(--display-axes-calm), 'opsz' 72;
	text-wrap: balance;
}

/* Lit by the lamp: always dark text on the warm glow, in light mode and dark */
.light {
	padding: 0 0.12em;
	margin: 0 -0.12em;
	border-radius: 6px;
	-webkit-box-decoration-break: clone;
	box-decoration-break: clone;
	transition:
		background-color 220ms ease-out,
		color 220ms ease-out;
}

.light.on {
	color: var(--ink-fixed);
	background-color: #ffe2a2;
}

@media (max-width: 900px) {
	.xp,
	.crafts,
	.finale {
		grid-template-columns: 1fr;
	}

	.bench {
		max-width: 560px;
	}
}
</style>
