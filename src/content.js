// All the words on the site, in one place. Rewrite freely.
// The facts come from your resume and GitHub profile.

export const profile = {
	firstName: 'Andrew',
	lastName: 'Stoker',
	role: 'Software developer',
	location: 'Columbia, SC',
	github: 'https://github.com/AStoker',
	// Left off on purpose until you decide whether to publish it.
	// Set to an address (e.g. 'hi@example.com') and an email button appears in Say hello.
	email: null,
}

export const hero = {
	greeting: 'Hi, I’m Andrew.',
	lede: 'I’m a software developer, and the part I’m best at is the part people actually use. I love making things that make life a little easier, or a little more fun, for whoever’s on the other side of the screen.',
	primary: { label: 'Say hello', href: '#contact' },
	secondary: { label: 'About me', href: '#about' },
}

export const work = {
	title: 'Work',
	note: 'I’m still writing these up. Check back soon.',
	slots: 3,
	slotLabel: 'Case study',
	slotStatus: 'Coming soon',
}

export const about = {
	title: 'About',
	statement: 'I like making things that make someone’s day easier. Or just more fun.',
	body: [
		'I’m a senior developer at Swampfox in Columbia, South Carolina, and I’ve been building software for more than ten years.',
		'Somehow I always end up on the part people actually use. I studied computer science with a minor in graphic design, spent six years on the core team of Aurelia (an open-source JavaScript framework), and these days I lead a team building web apps.',
		'What I care about most is the person on the other side of the screen. People don’t all think or work the same way, so I like to find out who I’m building for before I build anything. When it goes well, they barely notice the software. They just get their thing done, and maybe smile once along the way.',
	],
	facts: [
		{ label: 'Based in', value: 'Columbia, SC' },
		{ label: 'Day job', value: 'Senior developer, Swampfox' },
		{ label: 'Building software since', value: '2013' },
		{ label: 'Mustache', value: 'Yes, it’s real' },
	],
}

// The portrait wall in the hero. `me` is the big frame; each cousin gets a small one.
export const family = {
	intro: 'The big one’s my mustache. Its four cousins are hiding somewhere on this page.',
	prompt: { hover: 'Hover over a frame for a clue.', touch: 'Tap a frame for a clue.' },
	me: { kind: 'chevron', name: 'Me', note: 'Andrew’s mustache' },
	meHello: 'That’s me. Well, my mustache. Go on, give it a click.',
	found: 'Found!',
	hiding: 'Still hiding',
}

// The hidden cousins. `kind` is a mustache from tools/generate-mustache.mjs.
// `clue` is the riddle shown while it's hiding: a nudge, never instructions.
// `found` is what the frame says once it's been caught.
export const cousins = [
	{
		id: 'handlebar',
		kind: 'handlebar',
		name: 'The Handlebar',
		clue: 'Can’t resist a blank canvas. Lately there are a few to choose from.',
		found: 'Caught saving a seat for a case study.',
	},
	{
		id: 'pencil',
		kind: 'pencil',
		name: 'The Pencil',
		clue: 'Shy. Only comes out for people who stick around long enough to get to know me.',
		found: 'All it wanted was a little patience.',
	},
	{
		id: 'horseshoe',
		kind: 'horseshoe',
		name: 'The Horseshoe',
		clue: 'Never far from a hello, but it prefers the dark.',
		found: 'Caught lurking behind the hello.',
	},
	{
		id: 'walrus',
		kind: 'walrus',
		name: 'The Walrus',
		clue: 'Nodded off waiting for the page to end.',
		found: 'Wide awake now. Sorry, Walrus.',
	},
]

export const contact = {
	title: 'Say hello',
	line: 'Got an idea, a question, or just want to say hi? I’d love to hear from you.',
	github: 'Find me on GitHub',
	email: 'Send me an email',
}

export const hunt = {
	counter: 'Cousins found',
	foundOne: (name) => `You found ${name}!`,
	allTitle: 'You found all four!',
	allBody: 'You’ve got a good eye. We’d probably get along, so',
	allLink: 'say hello',
	reset: 'Hide them again',
}

export const footer = {
	note: 'Built with Vue and a little mustache wax.',
}
