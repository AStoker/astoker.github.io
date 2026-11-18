import { ref, onMounted } from 'vue'

// The id of the section in the middle of the screen, or null between sections.
// "In the middle" means it covers a thin band just under halfway down the window.
// The header uses it to underline where you are; the Pencil uses it to know you've stayed.
const current = ref(null)
let observing = false

function observeSections() {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) current.value = entry.target.id
				else if (current.value === entry.target.id) current.value = null
			}
		},
		{ rootMargin: '-45% 0px -50% 0px' },
	)
	document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section))
}

// One observer for the whole page, started by the first component that asks once it's on screen.
export function useCurrentSection() {
	onMounted(() => {
		if (observing) return
		observing = true
		observeSections()
	})
	return current
}
