import { ref } from 'vue'

// TEMPORARY: three hero designs to choose between.
// Once one is picked, delete the other two (and this file, and OptionSwitcher.vue).
export const HERO_OPTIONS = [
	{ id: 'wall', label: 'Portrait wall' },
	{ id: 'sign', label: 'Sign lockup' },
	{ id: 'sun', label: 'Sunrise' },
]

function initial() {
	const asked = new URLSearchParams(window.location.search).get('hero')
	return HERO_OPTIONS.some((o) => o.id === asked) ? asked : 'wall'
}

export const heroOption = ref(initial())

export function setHeroOption(id) {
	heroOption.value = id
	const url = new URL(window.location.href)
	url.searchParams.set('hero', id)
	window.history.replaceState(null, '', url)
}
