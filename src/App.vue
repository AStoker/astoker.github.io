<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import WorkSection from './components/WorkSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import HuntToast from './components/HuntToast.vue'
import StacheConfetti from './components/StacheConfetti.vue'
import { nav } from './content'
</script>

<template>
	<a class="skip-link" href="#main">{{ nav.skipLink }}</a>
	<SiteHeader />
	<main id="main">
		<HeroSection />
		<WorkSection />
		<ExperienceSection />
		<AboutSection />
		<ContactSection />
	</main>
	<SiteFooter />

	<HuntToast />
	<StacheConfetti />
</template>
