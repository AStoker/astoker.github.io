<script setup>
import SectionHead from './SectionHead.vue'
import HidingStache from './HidingStache.vue'
import { profile, contact } from '../content.js'
</script>

<template>
	<section id="contact" class="section container" aria-labelledby="contact-title">
		<SectionHead id="contact-title" num="03" :title="contact.title" />

		<HidingStache id="contact-card" from="left" at="38%" :size="120">
			<div class="card">
				<p class="line">{{ contact.line }}</p>
				<div class="links">
					<a v-if="profile.email" class="btn btn-inverse" :href="`mailto:${profile.email}`">Email me</a>
					<a class="btn btn-inverse" :href="profile.github" target="_blank" rel="noopener">
						GitHub <span aria-hidden="true">↗</span>
					</a>
				</div>
			</div>
		</HidingStache>
	</section>
</template>

<style scoped>
.card {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: end;
	gap: 32px;
	padding: clamp(28px, 5vw, 56px);
	border-radius: 24px;
	background: var(--ink);
	color: var(--paper);
}

.line {
	max-width: 22ch;
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.9rem, 4.4vw, 3.4rem);
	font-weight: 500;
	line-height: 1.05;
	letter-spacing: -0.025em;
	font-variation-settings: 'SOFT' 100, 'WONK' 1, 'opsz' 144;
	text-wrap: balance;
}

.links {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

@media (max-width: 760px) {
	.card {
		grid-template-columns: 1fr;
	}
}
</style>
