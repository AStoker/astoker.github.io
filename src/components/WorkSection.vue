<script setup lang="ts">
import PageSection from './PageSection.vue'
import CaseStudyCard from './CaseStudyCard.vue'
import CaseStudySlot from './CaseStudySlot.vue'
import HidingStache from './HidingStache.vue'
import { work } from '../content'
import { caseStudies } from '../caseStudies'

// My case studies first, then placeholders until there are at least `work.slots`.
const slots = Array.from({ length: Math.max(work.slots, caseStudies.length) }, (_, i) => ({
	num: String(i + 1).padStart(2, '0'),
	study: caseStudies[i],
}))
// The spot the Handlebar hides behind
const HANDLEBAR_SLOT = '02'
</script>

<template>
	<PageSection :section="work">
		<template #note><p>{{ work.note }}</p></template>

		<ul class="slots">
			<li v-for="{ num, study } in slots" :key="num">
				<HidingStache v-if="num === HANDLEBAR_SLOT" id="handlebar" class="hider" from="top" at="68%" :size="132">
					<CaseStudyCard v-if="study" :study="study" />
					<CaseStudySlot v-else :num="num" />
				</HidingStache>
				<CaseStudyCard v-else-if="study" :study="study" />
				<CaseStudySlot v-else :num="num" />
			</li>
		</ul>
	</PageSection>
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

.hider {
	height: 100%;
}

@media (max-width: 760px) {
	.slots {
		grid-template-columns: 1fr;
		gap: 40px;
	}
}
</style>
