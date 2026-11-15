<script setup>
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import WorkSection from './components/WorkSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import EdgePeeker from './components/EdgePeeker.vue'
import HuntToast from './components/HuntToast.vue'
import StacheConfetti from './components/StacheConfetti.vue'
</script>

<template>
	<a class="skip-link" href="#main">Skip to content</a>
	<SiteHeader />
	<main id="main">
		<HeroSection />
		<WorkSection />
		<AboutSection />
		<ContactSection />
	</main>
	<SiteFooter />

	<EdgePeeker id="edge-peek" watch="#about" />
	<HuntToast />
	<StacheConfetti />
</template>
