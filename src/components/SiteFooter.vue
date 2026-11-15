<script setup>
import NappingStache from './NappingStache.vue'
import { profile } from '../content.js'

const year = new Date().getFullYear()
</script>

<template>
	<footer class="site-footer">
		<div class="container">
			<div class="inner">
				<NappingStache id="footer-nap" class="nap" />
				<p>© {{ year }} {{ profile.firstName }} {{ profile.lastName }}</p>
				<p class="small">Built with Vue. No mustaches were harmed.</p>
			</div>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	margin-top: clamp(80px, 12vw, 160px);
}

.inner {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 8px 24px;
	padding-block: 24px 40px;
	border-top: 1.5px solid var(--ink);
	font-size: 0.95rem;
}

.inner p {
	margin: 0;
}

.small {
	color: var(--ink-soft);
}

/* Asleep on the line, right where the rule is */
.nap {
	position: absolute;
	top: 0;
	right: clamp(8px, 10vw, 140px);
	transform: translateY(calc(-100% + 9px));
}
</style>
