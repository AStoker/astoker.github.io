// Every word on my site lives here, so I can rewrite things without digging through components.
// The facts come from my resume and GitHub profile.
import type { Cousin, Profile, Section } from './types'

export const profile: Profile = {
	firstName: 'Andrew',
	lastName: 'Stoker',
	role: 'Software developer',
	location: 'Columbia, SC',
	// The three ways to get in touch, shown in Say hello. Set one to null to hide its button.
	email: 'Andy.Stoker@iCloud.com',
	linkedin: 'https://www.linkedin.com/in/AndrewStoker',
	github: 'https://github.com/AStoker',
}

// The skip link, the header and its menu
export const nav = {
	skipLink: 'Skip to content',
	label: 'Main', // what screen readers call the menu
	menu: 'Menu', // the button the links fold into on phones
	home: 'back to top', // read after my name on the logo link
	homePage: 'home page', // the same, on a case study's page
}

export const hero = {
	greeting: 'Hi, I’m Andrew.',
	lede: 'I’m a software developer, and the part I’m best at is the part people actually use. I love making things that make life a little easier, or a little more fun, for whoever’s on the other side of the screen. And by the way, this site is still a work in progress.',
	primary: { label: 'Say hello', href: '#contact' },
	secondary: { label: 'About me', href: '#about' },
}

// My resume PDF lives in public/. When I replace that file, I update the size here too.
export const resume = {
	href: '/andrew-stoker-resume.pdf',
	filename: 'Andrew Stoker resume.pdf', // what it's saved as
	label: 'Download my resume',
	format: 'PDF, 64 KB', //   keeps the size on one line
}

// Each section has an `id` (its #link) and a `menu` label for the header.
// They're numbered 01, 02… in the order they're listed in `sections` at the bottom.
// `satisfies Section & Record<string, unknown>` checks each one has what a Section needs,
// while letting it carry its own extra words (which keep their types for autocomplete).

export const work = {
	id: 'work',
	title: 'Work',
	menu: 'Work',
	note: 'The first one’s written up, and more are on the way.',
	slots: 3, // the grid always shows at least this many: my case studies, then placeholders
	slotLabel: 'Case study',
	slotStatus: 'Coming soon',
	read: 'Read the case study', // at the bottom of each case study's card
} satisfies Section & Record<string, unknown>

// The words around each case study's own page. The studies themselves are in src/caseStudies/.
export const caseStudyPage = {
	back: 'All my work',
	tagsLabel: 'Skills', // read out by screen readers, for the list of tags
	glance: 'At a glance',
	// The small label above each part of the story. Decisions are numbered: "Decision 2".
	parts: {
		goal: 'The goal',
		decision: 'Decision',
		challenge: 'The hard part',
		process: 'How I worked',
		setback: 'What went wrong',
		result: 'The result',
		next: 'What’s next',
	},
	tradeoff: 'The trade-off',
	end: {
		title: 'Thanks for reading.',
		body: 'If this is the kind of work you need, I’d love to hear what you’re building.',
		contact: 'Say hello',
		next: 'Next case study', // read before the next study's name
		back: 'Back to my work',
	},
}

export const experience = {
	id: 'experience',
	title: 'Experience',
	menu: 'Experience',
	note: 'The highlights, not the whole list. If you’d rather just have my resume, it’s right here.',

	// The skeleton, newest first. My resume has every bullet point.
	pathTitle: 'The short version',
	path: [
		{ years: '2022–now', role: 'Senior developer', org: 'Swampfox' },
		{ years: '2016–2022', role: 'Core team', org: 'Aurelia, open source' },
		{ years: '2014–2022', role: 'Developer to UI Architect', org: 'Softdocs' },
		{ years: '2013–2014', role: 'Developer', org: 'Elytus' },
		{ years: '2013', role: 'B.S. Computer Science, minor in Graphic Design', org: 'Cedarville University' },
	],

	toolsTitle: 'Tools I reach for',
	tools: [
		'JavaScript',
		'TypeScript',
		'Vue',
		'React',
		'Angular',
		'Web Components',
		'CSS & Sass',
		'Vitest & Jest',
		'Cypress',
		'Azure DevOps',
		'GitHub',
		'Figma',
		'Illustrator',
	],

	// The fun parts, each one a skill people hire for.
	highlightsTitle: 'A few highlights',
	tagsLabel: 'Skills', // what screen readers call each highlight's list of tags
	highlights: [
		{
			title: 'I lead the team, not just the tickets',
			where: 'Swampfox · 2022–now',
			body: 'I lead a cross-functional sprint team. I run our planning and retros, sketch storyboards with other teams before anyone writes code, and keep our test coverage honest. Mostly, my job is clearing the way so good people can do good work.',
			tags: ['Leadership', 'Agile', 'Testing'],
		},
		{
			title: 'I helped build a JavaScript framework',
			where: 'Aurelia core team · 2016–2022',
			body: 'Six years on the core team of an open-source framework, with developers all over the world. A lot of that time went to the community: answering issues, talking problems through, and helping people ship. The rest went into making the framework faster and easier to understand, from quicker builds to clearer docs.',
			tags: ['Open source', 'Community', 'Performance'],
		},
		{
			title: 'I got a whole department onto one UI',
			where: 'Softdocs · 2014–2022',
			body: 'Eight years and three titles, from developer to UI Architect. Along the way I moved us from TFVC to Git, built our pipelines in Azure DevOps, led the work to put every app on one accessible UI framework, and ran training sessions for the whole company.',
			tags: ['Architecture', 'Accessibility', 'CI/CD'],
		},
	],

	// Everything I do that isn't software. `atWork` is what each one brings back to the day job.
	offClock: {
		title: 'Off the clock',
		intro: 'Software isn’t my only craft. I also work in clay, wood, electronics and the garden, and each one has taught me something I couldn’t have learned at a keyboard.',
		atWorkLabel: 'At work:',
		crafts: [
			{
				name: 'Pottery',
				line: 'Every potter has watched a pot collapse on the wheel. It isn’t a disaster, it’s part of the work. You ball the clay back up, start again, and the next one is better for the mistake.',
				atWork: 'iterate, don’t be afraid to fail, and don’t fall in love with the first draft.',
			},
			{
				name: 'Woodworking',
				line: 'There’s no undo on a saw. You plan the cut before you make it, and you learn that the joints nobody sees still matter.',
				atWork: 'plan before you build, and sweat the details nobody sees.',
			},
			{
				name: 'Electronics',
				line: 'Nothing humbles you like a circuit that won’t turn on. There’s no stack trace for a cold solder joint, so you test one thing at a time until you find it.',
				atWork: 'debug calmly, one thing at a time.',
			},
			{
				name: 'Gardening',
				line: 'You can’t rush a tomato. You prune a little, feed a little, water a little, and a season later all those small choices pay you back.',
				atWork: 'be patient. Small, careful changes pay off big over time.',
			},
		],
		closing: 'Each one is a different way of looking at a problem, and they all come to work with me. That’s what I bring to anything I build:',
		closingLight: 'a fresh light.', // lights up when the workbench lamp is on
		// The workbench picture next to it
		lampCord: 'Pull the lamp cord',
		lampTag: 'pull',
	},
} satisfies Section & Record<string, unknown>

export const about = {
	id: 'about',
	title: 'About',
	menu: 'About',
	statement: 'I like making things that make someone’s day easier. Or just more fun.',
	body: [
		'I’m a senior developer at Swampfox in Columbia, South Carolina, and I’ve been building software for more than ten years.',
		'Somehow I always end up on the part people actually use. I studied computer science with a minor in graphic design, spent six years on the core team of Aurelia (an open-source JavaScript framework), and these days I lead a team building web apps.',
		'What I care about most is the person on the other side of the screen. People don’t all think or work the same way, so I like to find out who I’m building for before I build anything. When it goes well, they barely notice the software. They just get their thing done, and maybe smile once along the way.',
	],
	facts: [
		{ label: 'Based in', value: 'Columbia, SC' },
		{ label: 'Day job', value: 'Senior developer, Swampfox' },
		{ label: 'Night job', value: 'Teaching my kids how to fix stuff' },
		{ label: 'Building software since', value: '2013' },
		{ label: 'Mustache', value: 'Yes, it’s real' },
	],
} satisfies Section & Record<string, unknown>

export const contact = {
	id: 'contact',
	title: 'Say hello',
	menu: 'Contact',
	line: 'Got an idea, a question, or just want to say hi? I’d love to hear from you.',
	email: 'Send me an email',
	linkedin: 'LinkedIn',
	github: 'GitHub',
	newTab: '(opens in a new tab)', // read out by screen readers only
} satisfies Section & Record<string, unknown>

/** The sections in the menu, in the order they're on the page. Each one's number comes from here. */
export const sections: readonly Section[] = [work, experience, about, contact]

// The portrait wall in the hero. `me` is the big frame; each cousin gets a small one.
export const family = {
	// In bold, so nobody mistakes the wall for a chart of mustache styles. It's a hunt.
	intro: 'My mustache’s five cousins are hiding on this page. Can you find them?',
	prompt: { hover: 'Hover over a frame for a clue.', touch: 'Tap a frame for a clue.' },
	me: { kind: 'chevron' as const, name: 'Me', label: 'Me: my mustache. Click to make it twirl.' },
	title: 'The mustache family', // read out by screen readers only
	meHello: 'That’s me. Well, my mustache. Go on, give it a click.',
	found: 'Found!',
	hiding: 'Still hiding',
	hidingTag: 'Hiding', // on each empty frame, in place of its name until it's found (short, to fit at 320px)
	done: 'You found all five. Everyone’s home now.', // the caption once the hunt is over
}

/**
 * My hidden cousins, in the order they hang on the portrait wall. Hover `Cousin` for what
 * each field is for. A new one needs its id added to `CousinId` in types.ts too.
 */
export const cousins: readonly Cousin[] = [
	{
		id: 'handlebar',
		kind: 'handlebar',
		name: 'The Handlebar',
		clue: 'A big fan of my work. Always reading over the top of it.',
		found: 'Caught reading over a case study’s shoulder.',
		label: 'Someone is hiding here. Click to find them.',
	},
	{
		id: 'dali',
		kind: 'dali',
		name: 'The Dalí',
		clue: 'Off the clock and sitting in the dark. Could use a fresh light.',
		found: 'Every artist needs good lighting.',
		label: 'Someone was sitting in the dark. Click to find them.',
	},
	{
		id: 'pencil',
		kind: 'pencil',
		name: 'The Pencil',
		clue: 'Shy. Only comes out for people who stick around long enough to get to know me.',
		found: 'All it wanted was a little patience.',
		label: 'Someone is coming up for a look. Click to find them.',
	},
	{
		id: 'horseshoe',
		kind: 'horseshoe',
		name: 'The Horseshoe',
		clue: 'Never far from a hello, but it prefers the dark.',
		found: 'Caught lurking behind the hello.',
		label: 'Someone is hiding here. Click to find them.',
	},
	{
		id: 'walrus',
		kind: 'walrus',
		name: 'The Walrus',
		clue: 'Nodded off waiting for the page to end.',
		found: 'Wide awake now. Sorry, Walrus.',
		label: 'Someone is asleep here. Click to wake them up.',
		labelFound: 'Asleep again. You already found this one, but you can wake it anyway.',
	},
]

export const huntText = {
	counter: 'Cousins found', // read out by screen readers, before the count
	counterWord: 'found', // shown after the count in the header: "0/5 found"
	foundOne: (name: string) => `You found ${name}!`,
	labelFound: 'You already found this one. Click to make it twirl.',
	allTitle: 'You found all five!',
	allBody: 'You’ve got a good eye. We’d probably get along, so',
	allLink: 'say hello',
	reset: 'Hide them again',
	close: 'Close',
}

// My note for anyone who opens the browser's developer console.
export const devConsole = {
	heading: 'Curious one, aren’t you? I like the way you think.',
	body: 'If you’re the kind of person who opens the console on someone’s portfolio, I have a feeling we’d work well together. I’d love to hear what you’re building.',
	email: 'Email',
	linkedin: 'LinkedIn',
	source: 'This site’s source',
	sourceUrl: 'https://github.com/AStoker/astoker.github.io',
}

export const footer = {
	note: 'Built with Vue and a little mustache wax.',
	motion: 'Reduce motion', // the switch that stills every animation on the page
}

// Microsoft Clarity, behind the link in my footer
export const tracking = {
	summary: 'Yes, I’m watching (for bugs)',
	note: [
		'The honest version: I use Microsoft Clarity to see how this site gets used. Where people click, how far they scroll, which bits they linger on, and, mostly, when something breaks.',
		'That last one’s the whole point. If a button stops working or a page falls over on someone’s phone, I’d rather spot it and fix it myself than have you spend your afternoon writing me a bug report. It’s how I like to work on anything: if something’s going wrong for you, I want to be the first to notice.',
		'There are no cookies and no ads. Clarity doesn’t know who you are, and every page you open counts as its own anonymous visit. If it still isn’t your thing, flip the switch below, no hard feelings. Microsoft does keep the data, under',
	],
	privacyLink: 'their privacy statement',
	privacyUrl: 'https://privacy.microsoft.com/privacystatement',
	switch: 'Help me catch bugs', // on means Clarity can run
}
