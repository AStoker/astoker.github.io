import { createApp } from 'vue'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/jetbrains-mono'
import './styles/main.css'
import App from './App.vue'
import { profile, devConsole as words } from './content.js'

createApp(App).mount('#app')

// For anyone who opens the dev tools: Andrew's mustache, eyes and all, then a note.
//
// The art is drawn in half-block characters from the real chevron shape. Only the left
// half is written out; each line is mirrored to make the right half, so the two sides
// always line up. (Every block character used here looks the same flipped.) Keep every
// half the same width. Line height 1 lets the blocks meet with no gaps between rows.
const LEFT_HALF = [
	'     ▄▄████████▄   ',
	'    ▀█▀▀      ▀▀   ',
	'       ▄█████▄     ',
	'     ▄█▀▀   ▀▀█▄   ',
	'    ▄█▀  ▄▄▄  ▀█▄  ',
	'    ██  █████  ██  ',
	'    ▀█▄  ▀▀▀  ▄█▀  ',
	'     ▀█▄▄   ▄▄█▀   ',
	'       ▀█████▀     ',
	'',
	'           ▄▄▄▄▄▄▄▄',
	'       ▄▄██████████',
	'    ▄██████████████',
	'  ▄████████████████',
	'▄█████████▀▀▀▀▀▀   ',
	' ▀                 ',
]
const art = LEFT_HALF.map((half) => (half + [...half].reverse().join('')).trimEnd()).join('\n')

const STYLE = {
	art: 'font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12px; line-height: 1; color: #D7301F',
	heading: 'font-family: Georgia, serif; font-size: 15px; font-weight: bold; line-height: 1.6',
	body: 'font-size: 12px; line-height: 1.6',
}

const links = [
	profile.email && `${words.email}: ${profile.email}`,
	profile.linkedin && `${words.linkedin}: ${profile.linkedin}`,
	`${words.source}: ${words.sourceUrl}`,
]
	.filter(Boolean)
	.join('\n')

console.log(
	`%c${art}\n\n%c${words.heading}\n%c${words.body}\n\n${links}`,
	STYLE.art,
	STYLE.heading,
	STYLE.body,
)
