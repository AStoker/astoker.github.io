<script setup>
// Just the mustache, no face. Takes the current text colour.
import { MUSTACHE_HALF, MUSTACHE_VIEWBOX } from '../assets/mustache.js'
</script>

<template>
	<svg class="mustache-icon" :viewBox="MUSTACHE_VIEWBOX" aria-hidden="true" focusable="false">
		<g class="half half-l"><path :d="MUSTACHE_HALF" transform="translate(120 0) scale(-1 1)" /></g>
		<g class="half half-r"><path :d="MUSTACHE_HALF" /></g>
	</svg>
</template>
