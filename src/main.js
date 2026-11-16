import { createApp } from 'vue'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/jetbrains-mono'
import './styles/main.css'
import App from './App.vue'
import { cousins } from './content.js'

createApp(App).mount('#app')

// For anyone who opens the dev tools.
console.log(
	'%c' +
		[
			'      ▄▄▄▄▄▄   ▄▄▄▄▄▄',
			'   ▄██████████████████▄',
			'  ▀▀▀              ▀▀▀',
		].join('\n') +
		`\n\nCurious one, aren’t you?\n${cousins.length} mustaches are hiding on this page: ${cousins.map((c) => c.name).join(', ')}.\nhttps://github.com/AStoker/astoker.github.io`,
	'font-family: monospace; color: #D7301F; font-size: 12px; line-height: 1.3',
)
