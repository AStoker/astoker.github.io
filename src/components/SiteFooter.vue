<script setup>
import NappingStache from './NappingStache.vue'
import { profile, footer } from '../content.js'

const year = new Date().getFullYear()
</script>

<template>
	<footer id="footer" class="site-footer">
		<div class="container">
			<div class="inner">
				<NappingStache id="walrus" class="nap" />
				<p>© {{ year }} {{ profile.firstName }} {{ profile.lastName }}</p>
				<p class="small">{{ footer.note }}</p>
			</div>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	margin-top: clamp(96px, 13vw, 170px);
}

.inner {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 8px 24px;
	padding-block: 28px 44px;
	border-top: 1.5px solid var(--ink);
	font-size: 0.95rem;
}

.inner p {
	margin: 0;
}

.small {
	color: var(--ink-soft);
}

/* Asleep on the line, mustache drooping over it */
.nap {
	position: absolute;
	top: 0;
	right: clamp(8px, 10vw, 140px);
	transform: translateY(calc(-100% + 6px));
}
</style>
