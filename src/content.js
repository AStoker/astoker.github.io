// All the words on the site, in one place. Rewrite freely.
// Facts about you came from your GitHub profile; nothing else is assumed.

export const profile = {
	firstName: 'Andrew',
	lastName: 'Stoker',
	role: 'UI/UX designer & developer',
	location: 'Columbia, SC',
	github: 'https://github.com/AStoker',
	// Left off on purpose until you decide whether to publish it.
	// Set to an address (e.g. 'hi@example.com') and an email button appears in Say hello.
	email: null,
}

export const hero = {
	greeting: 'Hi, I’m Andrew.',
	lede: 'I design user interfaces and write the code behind them. No two people are alike, so I start every project by getting to know who it’s for.',
	primary: { label: 'Say hello', href: '#contact' },
	secondary: { label: 'About me', href: '#about' },
	// Only used by the sunrise hero.
	sunnyKicker: 'Sunny (read: hot) Columbia, SC',

	// What the mustache says when you hover over it (or tap it on a phone).
	hint: { hover: 'Hover over me', touch: 'Tap me' },
	bubble: 'Hi! I’m Andrew’s mustache. Four of my cousins are hiding on this page, and no two look alike. Can you find them all?',
	bubbleDone: 'You found the whole family. Thanks for looking so closely!',
}

export const work = {
	title: 'Work',
	note: 'I’m putting a few case studies together. They’ll be here soon.',
	slots: 3,
	slotLabel: 'Case study',
	slotStatus: 'Coming soon',
}

export const about = {
	title: 'About',
	statement: 'Everyone’s different. Good design starts there.',
	body: [
		'I’m a UI/UX designer and programmer at Swampfox in Columbia, South Carolina.',
		'People don’t all think, work, or see the same way, and the software they use shouldn’t pretend they do. So before I sketch a screen or write any code, I want to know who it’s for and what they need from it.',
	],
	facts: [
		{ label: 'Based in', value: 'Columbia, SC' },
		{ label: 'Works at', value: 'Swampfox' },
		{ label: 'Mustache', value: 'Yes, it’s real' },
	],
}

// The mustache family. `me` is the main character; the cousins are the ones hiding.
// Each cousin's `kind` is a mustache from tools/generate-mustache.mjs, and `section`
// is the id of the part of the page where it hides.
export const family = {
	title: 'Meet the family',
	intro: 'No two mustaches are alike, either. Four of my cousins are hiding around this page. When you spot one, click it and it joins the lineup.',
	wallIntro: 'Four of my cousins are hiding on this page. Spot one, click it, and it takes its place on the wall.',
	prompt: { hover: 'Hover over a frame for a clue.', touch: 'Tap a frame for a clue.' },
	me: { kind: 'chevron', name: 'Me', note: 'Andrew’s mustache' },
	meHello: 'That’s me. Well, my mustache. Give it a click.',
	found: 'Found!',
	hiding: 'Still hiding',
	go: 'Take me there',
}

export const cousins = [
	{
		id: 'handlebar',
		kind: 'handlebar',
		name: 'The Handlebar',
		section: 'work',
		clue: {
			hover: 'Hides behind an empty case study in Work. Hover over the frame and it pops up.',
			touch: 'Hides behind an empty case study in Work. Tap the frame and it pops up.',
		},
	},
	{
		id: 'pencil',
		kind: 'pencil',
		name: 'The Pencil',
		section: 'about',
		clue: {
			hover: 'A little shy. Stay in the About section for three seconds and it comes up for a look.',
			touch: 'A little shy. Stay in the About section for three seconds and it comes up for a look.',
		},
	},
	{
		id: 'horseshoe',
		kind: 'horseshoe',
		name: 'The Horseshoe',
		section: 'contact',
		clue: {
			hover: 'Hides behind the dark card in Say hello. Hover over the card and it leans out.',
			touch: 'Hides behind the dark card in Say hello. Tap the card and it peeks out.',
		},
	},
	{
		id: 'walrus',
		kind: 'walrus',
		name: 'The Walrus',
		section: 'footer',
		clue: {
			hover: 'Fast asleep at the very bottom of the page. Click to wake it up.',
			touch: 'Fast asleep at the very bottom of the page. Tap to wake it up.',
		},
	},
]

export const contact = {
	title: 'Say hello',
	line: 'Have a project in mind, or just want to say hi? I’d love to hear from you.',
	github: 'Find me on GitHub',
	email: 'Send me an email',
}

export const hunt = {
	counter: 'Cousins found',
	foundOne: (name) => `You found ${name}!`,
	allTitle: 'You found all four!',
	allBody: 'Nice eye for detail. If you’d like to work together,',
	allLink: 'say hello',
	reset: 'Hide them again',
}

export const footer = {
	note: 'Built with Vue and a little mustache wax.',
}
