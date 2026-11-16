<script setup>
// Just a mustache, no face. Takes the current text colour.
import { computed } from 'vue'
import { MUSTACHES } from '../assets/mustaches.js'

const props = defineProps({
	kind: { type: String, default: 'chevron' },
})

const shape = computed(() => MUSTACHES[props.kind] ?? MUSTACHES.chevron)
const viewBox = computed(() => {
	const [x, y, w, h] = shape.value.box
	return `${x - 1} ${y - 1} ${w + 2} ${h + 2}`
})
</script>

<template>
	<svg class="mustache-icon" :viewBox="viewBox" aria-hidden="true" focusable="false">
		<g class="half half-l"><path :d="shape.half" transform="translate(120 0) scale(-1 1)" /></g>
		<g class="half half-r"><path :d="shape.half" /></g>
	</svg>
</template>
