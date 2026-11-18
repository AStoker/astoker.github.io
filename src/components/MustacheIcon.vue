<script setup lang="ts">
// Just a mustache, no face. Takes the current text colour.
import { computed } from 'vue'
import { MUSTACHES, type MustacheKind } from '../assets/mustaches'

const { kind = 'chevron' } = defineProps<{
	/** Which mustache to draw. Mine by default. */
	kind?: MustacheKind
}>()

const shape = computed(() => MUSTACHES[kind])
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
