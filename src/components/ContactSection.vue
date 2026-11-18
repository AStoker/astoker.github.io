<script setup lang="ts">
import PageSection from './PageSection.vue'
import HidingStache from './HidingStache.vue'
import { profile, contact } from '../content'
</script>

<template>
	<PageSection :section="contact">

		<HidingStache id="horseshoe" from="left" at="34%" :size="124">
			<div class="card">
				<p class="line">{{ contact.line }}</p>
				<div class="links">
					<a v-if="profile.email" class="btn btn-inverse" :href="`mailto:${profile.email}`">{{ contact.email }}</a>
					<a
						v-if="profile.linkedin"
						class="btn btn-inverse-ghost"
						:href="profile.linkedin"
						target="_blank"
						rel="noopener"
					>
						{{ contact.linkedin }} <span aria-hidden="true">↗</span>
						<span class="visually-hidden">{{ contact.newTab }}</span>
					</a>
					<a v-if="profile.github" class="btn btn-inverse-ghost" :href="profile.github" target="_blank" rel="noopener">
						{{ contact.github }} <span aria-hidden="true">↗</span>
						<span class="visually-hidden">{{ contact.newTab }}</span>
					</a>
				</div>
			</div>
		</HidingStache>
	</PageSection>
</template>

<style scoped>
.card {
	display: grid;
	gap: clamp(28px, 4vw, 44px);
	padding: clamp(28px, 5vw, 56px);
	border-radius: 24px;
	background: var(--card);
	color: var(--on-card);
	--focus: var(--on-card);
}

.line {
	max-width: 24ch;
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.8rem, 4vw, 3.1rem);
	font-weight: 500;
	line-height: 1.08;
	letter-spacing: -0.025em;
	font-variation-settings: var(--display-axes), 'opsz' 144;
	text-wrap: balance;
}

.links {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}
</style>
