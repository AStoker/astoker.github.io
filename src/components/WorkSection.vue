<script setup>
import SectionHead from './SectionHead.vue'
import HidingStache from './HidingStache.vue'
import { work } from '../content.js'

const slots = Array.from({ length: work.slots }, (_, i) => String(i + 1).padStart(2, '0'))
// Which empty frame the mustache hides behind.
const HIDING_IN = '02'
</script>

<template>
	<section id="work" class="section container" aria-labelledby="work-title">
		<SectionHead id="work-title" num="01" :title="work.title">
			<p>{{ work.emptyNote }}</p>
		</SectionHead>

		<ul class="slots">
			<li v-for="n in slots" :key="n">
				<component
					:is="n === HIDING_IN ? HidingStache : 'div'"
					v-bind="n === HIDING_IN ? { id: 'work-slot', from: 'top', at: '68%', size: 132 } : {}"
					class="slot-wrap"
				>
					<div class="slot">
						<span class="slot-label">Case study {{ n }}</span>
						<span class="slot-num" aria-hidden="true">{{ n }}</span>
						<span class="slot-status">Coming soon</span>
					</div>
				</component>
			</li>
		</ul>
	</section>
</template>

<style scoped>
.slots {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: clamp(16px, 2.4vw, 28px);
	margin: 0;
	padding: 0;
	list-style: none;
}

.slot-wrap {
	height: 100%;
}

.slot {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	aspect-ratio: 4 / 5;
	padding: 18px 20px;
	border: 1.5px dashed var(--rule-strong);
	border-radius: 16px;
	background:
		repeating-linear-gradient(-45deg, transparent 0 11px, var(--hatch) 11px 12px),
		var(--paper);
}

.slot-label,
.slot-status {
	font-family: var(--font-mono);
	font-size: 0.75rem;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--ink-soft);
}

.slot-status {
	align-self: flex-start;
	padding: 4px 9px;
	border: 1.5px solid currentColor;
	border-radius: 999px;
}

.slot-num {
	font-family: var(--font-display);
	font-size: clamp(4rem, 9vw, 7rem);
	font-weight: 300;
	line-height: 1;
	letter-spacing: -0.04em;
	color: var(--rule-strong);
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 144;
}

@media (max-width: 760px) {
	.slots {
		grid-template-columns: 1fr;
	}

	.slot {
		aspect-ratio: 16 / 9;
	}
}
</style>
