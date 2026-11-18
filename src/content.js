// All the words on the site, in one place. Rewrite freely.
// The facts come from your resume and GitHub profile.

export const profile = {
	firstName: 'Andrew',
	lastName: 'Stoker',
	role: 'Software developer',
	location: 'Columbia, SC',
	// The three ways to get in touch, shown in Say hello. Set one to null to hide its button.
	email: 'Andy.Stoker@iCloud.com',
	linkedin: 'https://www.linkedin.com/in/AndrewStoker',
	github: 'https://github.com/AStoker',
}

export const hero = {
	greeting: 'Hi, I’m Andrew.',
	lede: 'I’m a software developer, and the part I’m best at is the part people actually use. I love making things that make life a little easier, or a little more fun, for whoever’s on the other side of the screen. And by the way, this site is still a work in progress.',
	primary: { label: 'Say hello', href: '#contact' },
	secondary: { label: 'About me', href: '#about' },
	resume: 'Download my resume', // the file is set in `resume` below
}

export const work = {
	title: 'Work',
	note: 'I’m still writing these up. Check back soon.',
	slots: 3,
	slotLabel: 'Case study',
	slotStatus: 'Coming soon',
}

// The resume PDF lives in public/. Replace that file to update it; the size is shown next to the link.
export const resume = {
	href: '/andrew-stoker-resume.pdf',
	filename: 'Andrew Stoker resume.pdf', // what it's saved as
	format: 'PDF, 64\u00a0KB', // \u00a0 keeps the size on one line
}

export const experience = {
	title: 'Experience',
	note: 'The highlights, not the whole list. If you’d rather just have the resume, it’s right here.',
	download: 'Download my resume',

	// The skeleton, newest first. The resume has every bullet point.
	pathTitle: 'The short version',
	path: [
		{ years: '2022–now', role: 'Senior developer', org: 'Swampfox' },
		{ years: '2016–2022', role: 'Core team', org: 'Aurelia, open source' },
		{ years: '2014–2022', role: 'Developer to UI architect', org: 'Softdocs' },
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
			body: 'Eight years and three titles, from developer to UI architect. Along the way I moved us from TFVC to Git, built our pipelines in Azure DevOps, led the work to put every app on one accessible UI framework, and ran training sessions for the whole company.',
			tags: ['Architecture', 'Accessibility', 'CI/CD'],
		},
		{
			title: 'I design it, then I build it',
			where: 'Computer science, with a minor in graphic design',
			body: 'I’m as happy in Figma or Illustrator as I am in the code. I talk with the people who’ll use the thing, make the mockups and prototypes, then build what we drew. Fewer handoffs, fewer surprises.',
			tags: ['Design', 'Prototyping', 'User research'],
		},
	],

	// Everything that isn't software. `atWork` is what it brings back to the day job.
	offClock: {
		title: 'Off the clock',
		intro: 'Software isn’t my only craft. I also work in clay, wood, electronics and the garden, and each one has taught me something I couldn’t have learned at a keyboard.',
		atWorkLabel: 'At work:',
		crafts: [
			{
				name: 'Pottery',
				line: 'Every potter has watched a pot collapse on the wheel. It isn’t a disaster, it’s part of the work. You ball the clay back up, start again, and the next one is better for the mistake.',
				atWork: 'make mistakes early, and don’t fall in love with the first draft.',
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
		closing: 'Each one is a different way of looking at a problem, and they all come to work with me. That’s what I bring to anything I build: a fresh light.',
		// The workbench picture next to it
		lampCord: 'Pull the lamp cord',
		lampTag: 'pull',
	},
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
		{ label: 'Night job', value: 'Teaching my kids how to fix stuff' },
		{ label: 'Building software since', value: '2013' },
		{ label: 'Mustache', value: 'Yes, it’s real' },
	],
}

// The portrait wall in the hero. `me` is the big frame; each cousin gets a small one.
export const family = {
	intro: 'The big one’s my mustache. Its five cousins are hiding somewhere on this page.',
	prompt: { hover: 'Hover over a frame for a clue.', touch: 'Tap a frame for a clue.' },
	me: { kind: 'chevron', name: 'Me', note: 'Andrew’s mustache' },
	title: 'The mustache family', // read out by screen readers only
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
		clue: 'A big fan of my work. Always reading over the top of it.',
		found: 'Caught reading over a case study’s shoulder.',
	},
	{
		id: 'dali',
		kind: 'dali',
		name: 'The Dalí',
		clue: 'Off the clock and sitting in the dark. Could use a fresh light.',
		found: 'Every artist needs good lighting.',
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
	email: 'Send me an email',
	linkedin: 'LinkedIn',
	github: 'GitHub',
	newTab: '(opens in a new tab)', // read out by screen readers only
}

export const hunt = {
	counter: 'Cousins found',
	foundOne: (name) => `You found ${name}!`,
	allTitle: 'You found all five!',
	allBody: 'You’ve got a good eye. We’d probably get along, so',
	allLink: 'say hello',
	reset: 'Hide them again',
	close: 'Close',
}

export const footer = {
	note: 'Built with Vue and a little mustache wax.',
	motion: 'Reduce motion', // the switch that stills every animation on the page
}
