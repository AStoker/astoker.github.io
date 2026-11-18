<script setup>
// A link that downloads my resume, with a little download arrow in front.
// The slot replaces the words if a spot needs to say more (like the file size).
import { resume } from '../content.js'
</script>

<template>
	<a :href="resume.href" :download="resume.filename">
		<svg class="resume-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
			<path d="M8 2v8m-3.5-3.5L8 10l3.5-3.5M3 13.5h10" />
		</svg>
		<slot>{{ resume.label }}</slot>
	</a>
</template>

<style scoped>
.resume-icon {
	flex: none;
	width: 1em;
	height: 1em;
	fill: none;
	stroke: currentColor;
	stroke-width: 1.8;
	stroke-linecap: round;
	stroke-linejoin: round;
}
</style>
