<script setup>
// TEMPORARY: picks between the three hero designs. Once you've chosen,
// use that one directly in App.vue and delete the others.
import { computed } from 'vue'
import HeroWall from './hero/HeroWall.vue'
import HeroSign from './hero/HeroSign.vue'
import HeroSun from './hero/HeroSun.vue'
import { heroOption } from '../composables/heroOption.js'

const HEROES = { wall: HeroWall, sign: HeroSign, sun: HeroSun }
const hero = computed(() => HEROES[heroOption.value])
</script>

<template>
	<component :is="hero" />
</template>
