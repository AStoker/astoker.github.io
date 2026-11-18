// Fly Island: the drone game I built for my kids (and for grown-ups who want to practice).
// Pictures are screenshots from the game, in public/work/fly-island/.
import type { CaseStudy, Figure } from './types.ts'

const picture = (file: string, alt: string, caption?: string, width = 1434, height = 660): Figure => ({
	src: `/work/fly-island/${file}`,
	alt,
	caption,
	width,
	height,
})

export const flyIsland: CaseStudy = {
	slug: 'fly-island',
	title: 'Fly Island',
	what: 'A drone flying game for iPhone',
	summary: 'Fun enough for my kids, and true enough to the real controls that grown-ups can practice on it.',
	tags: ['Unity and C#', 'Testing', 'Building with AI'],
	cover: picture(
		'cover.webp',
		'A small drone flying down a toy airfield’s runway toward a giant yellow ring, with rainbow-striped arches further on.',
	),
	shareImage: '/work/fly-island/og.jpg',

	facts: [
		{ label: 'My role', value: 'The idea, the design, every decision and every test flight. Claude wrote most of the code.' },
		{ label: 'When', value: 'Fall 2026: five weeks from the first line of code to the first beta build.' },
		{ label: 'Built with', value: 'Unity 6, C#, Swift and Claude' },
		{ label: 'Plays on', value: 'iPhone, flown by touch, a game controller or a real DJI RC-N3 remote' },
		{ label: 'Where it is', value: 'In beta on TestFlight' },
	],
	links: [{ label: 'My RC-N3 input lab on GitHub', href: 'https://github.com/AStoker/ios-dji-rc-n3-inputs' }],

	story: [
		{
			part: 'goal',
			heading: 'Fun for kids, real enough for grown-ups',
			paragraphs: [
				'I fly a DJI Flip, and I wanted my kids to be able to learn too. A real drone is an expensive place to learn, though: one wrong stick and it’s in a tree.',
				'The drone simulators I found didn’t help much. Most of them cost money. Very few worked with a DJI remote, let alone an ordinary game controller like a Backbone. And almost all of them are racing trainers for people who already fly, with plain worlds and nothing for a kid to do.',
				'I wanted a free way for anyone to learn, with whatever controller they had. So I set out to make one, with two goals that pull against each other. It had to be fun enough that my kids would choose to play it, and true enough to the real controls that an adult could practice on it. Every decision after that came back to those two.',
			],
			figures: [
				picture(
					'duck.webp',
					'A drone shaped like a yellow rubber duck, hovering over an orange landing pad on a grassy field.',
					'You can fly a classic drone, or one shaped like a brick, a bee, a duck or a flying saucer. They only change how it looks: every one flies like the real thing.',
				),
			],
		},
		{
			part: 'decision',
			heading: 'Prove it, don’t debate it',
			paragraphs: [
				'I started where you’d expect for an iPhone app: Swift, with Apple’s RealityKit drawing the 3D world. The phone got hot, and I couldn’t control enough of how things were drawn, so that same day I swapped in a renderer of my own, built on Metal, the iPhone’s graphics layer. It drew a real canyon from real elevation data, and it looked good.',
				'It also raised a bigger question: was I building a drone game, or a game engine? I had Claude lay the options out side by side (my own renderer, Unity, Unreal and Godot) by cost, track record on iPhone, tools and licensing. Then, instead of choosing on paper, we tried it: a quick Unity prototype with the same canyon. By the next day it was flying in the iPhone Simulator, and that prototype became the app.',
				'One earlier choice made the switch cheap. The flight physics were plain code with nothing tying them to the screen, so they moved over to C# in a day, tests and all.',
			],
			tradeoff:
				'I gave up owning every line of the renderer, and got a real editor, years of mobile tuning and a huge library of ready-made models. For a game that’s all about places to fly, the tools to build places mattered more.',
			figures: [
				picture(
					'metal.webp',
					'A small drone flying over the green river at the bottom of Horseshoe Bend, between tall sandstone canyon walls.',
					'Day one: Horseshoe Bend in Arizona, drawn by my own Metal renderer from government elevation data and aerial photos.',
					1300,
					598,
				),
			],
		},
		{
			part: 'decision',
			heading: 'Toys on top, the real thing underneath',
			paragraphs: [
				'Nine days in, I had a real canyon and a granite valley full of waterfalls. They were beautiful, and they were empty. Kids don’t want scenery. They want things to fly through and things to find.',
				'So I changed direction. I saved the realistic version and started over on a toy island: round hills, beaches, an airfield, bouncy castles and a giant inflatable duck. Block Island came next, a castle built from giant toy bricks, with a dragon and a king to find. The waterfall valley was cut, the app got a new name, and Horseshoe Bend stayed on as the one real place.',
				'What didn’t change is underneath. The camera drone flies like my Flip, using DJI’s published numbers: it holds its height, stops and hovers when you let go, and has the same Cine, Normal and Sport speeds. The toys get kids to pick it up. The controls are what they learn.',
			],
			tradeoff:
				'I threw away work that looked great. But a beautiful game nobody wants to play doesn’t meet either goal.',
			figures: [
				picture(
					'home-before.webp',
					'The Drone Sim home screen, with four map cards: a practice field, a toy island, Horseshoe Bend and a valley of waterfalls.',
					'Before the cut: still called Drone Sim, with a realistic waterfall valley next to the toy island.',
					1300,
					598,
				),
				picture(
					'home-after.webp',
					'The Fly Island home screen: a bright logo, ways to fly (free flight, rings and race gates), three maps and a choice of drone looks.',
					'After: Fly Island. Three maps, games on the home screen, and toy drones to choose from.',
				),
			],
		},
		{
			part: 'decision',
			heading: 'One game, two kinds of player',
			paragraphs: ['Every way to play had to work for a kid and for an adult at the same time.'],
			points: [
				{
					title: 'Rings',
					body: 'A path to follow for a kid, a score to beat for an adult. Finishing earns bronze; a fast, clean run earns silver or gold. The first course is wide and low around the airfield, for someone who’s never flown.',
				},
				{
					title: 'Photo safari',
					body: 'When I compared other drone apps, almost every one was about racing. None was about the camera, which is why most people buy a drone. So this has no clock and nothing to lose: a kid can wander and snap the giant duck, and an adult can chase three stars on every shot.',
				},
				{
					title: 'A racing drone',
					body: 'For grown-ups learning to fly a racing (FPV) drone, there’s a second aircraft that flies like one, with Angle, Horizon and Acro modes and a gate race to time yourself on.',
				},
				{
					title: 'Any controller',
					body: 'The phone alone is always enough: touch sticks are the default. A game controller or a real DJI RC-N3 remote takes over the moment you use it, so practicing here is practicing on the real thing.',
				},
			],
			figures: [
				picture(
					'safari.webp',
					'A drone hovering in Block Island’s brick courtyard in front of the king, with a count of photos and stars along the top.',
					'Photo safari on Block Island: get the king in frame and press the shutter.',
				),
				picture(
					'race.webp',
					'A racing drone crossing the toy island toward an arch, with the lap time and gate count at the top.',
					'The gate race, on the racing drone in Angle mode.',
				),
			],
		},
		{
			part: 'challenge',
			heading: 'Reading a remote nobody documents',
			paragraphs: [
				'DJI doesn’t publish how its RC-N3 remote talks to a phone, so I built a small diagnostics app to find out: plug the remote in over USB-C, move one control at a time, and compare the bytes that come back.',
				'It took two days of careful experiments, each finding marked as confirmed or still a guess. Now it reads every stick, the gimbal dial, the mode switch and the buttons 50 to 60 times a second, about 10 milliseconds behind your thumbs. That code is its own package, which the game builds in, and it’s public on GitHub.',
			],
		},
		{
			part: 'process',
			heading: 'Building with Claude, and checking everything',
			paragraphs: [
				'I came into this knowing the web, not Unity, C# or how an iPhone talks to accessories. I built it with Claude as my pair programmer. I decided what to build and how it should feel, made the calls and flew every test, and Claude wrote most of the code.',
				'That made checking the real job. AI writes code fast, but it’s only as good as the way you check it, so the project is built around ways to know it works.',
			],
			points: [
				{
					title: 'Tests that run in seconds',
					body: 'The flight physics, the games and the controls are plain C# with nothing tying them to the engine, so 188 automated tests run from the command line without even opening Unity.',
				},
				{
					title: 'An autopilot',
					body: 'A robot pilot flies every rings course and race. If it can’t finish, the course is broken, and its best times set where silver and gold begin.',
				},
				{
					title: 'Recorded flights',
					body: 'Every input can be recorded and played back exactly, including a recording from the real remote, so a problem can be replayed instead of described.',
				},
				{
					title: 'A checklist on a real phone',
					body: 'Every build went to my iPhone with a list: do this, expect that, tell me what you see. What I saw went into the notes, marked confirmed or still a guess.',
				},
				{
					title: 'Pictures in seconds',
					body: 'A script renders views of a map straight to images in about ten seconds, so a change to the look can be judged without building the app.',
				},
			],
			figures: [
				picture(
					'capture.webp',
					'Block Island from high above: a castle of giant toy bricks with towers and flags, ringed by blue water on a patchwork of green.',
					'Block Island, rendered straight from its map builder. No app build needed.',
				),
			],
		},
		{
			part: 'setback',
			heading: 'What went wrong',
			paragraphs: [
				'The phone got hot. The first builds warmed it up fast, and nobody wants to hand a kid a hot phone. There was no single fix: now the game checks the phone’s temperature once a second and steps down the detail, shadows and frame rate as it warms, then climbs back as it cools.',
				'Some bugs only show up on screen. One left the ground painted in a single texture, because the paint went onto a copy that was never saved. No test caught that one. Looking did.',
				'And I threw work away. The waterfall valley was built, rebuilt and then cut, along with a practice field. It stung a little, but it’s the lesson from the potter’s wheel: a pot that collapses makes the next one better, and the game is better without them.',
			],
		},
		{
			part: 'result',
			heading: 'Where it landed',
			paragraphs: [
				'Fly Island is in beta on TestFlight, Apple’s way of sharing an app before it’s in the App Store. My kids fly it for fun, and they’ve learned real drone controls along the way. For grown-ups it’s real practice: the same stick layouts, the same speed modes, even the same remote.',
			],
			numbers: [
				{ value: '5 weeks', label: 'from the first line of code to the first beta' },
				{ value: '188', label: 'automated tests' },
				{ value: '3', label: 'ways to fly it: touch, a game controller or a real remote' },
				{ value: '~10 ms', label: 'from the remote’s sticks to the game' },
			],
			figures: [
				picture(
					'gate.webp',
					'A drone flying toward a yellow gate on Block Island, past trees and walls made of giant toy bricks.',
					'Threading the race gates through Block Island.',
				),
			],
		},
		{
			part: 'next',
			heading: 'What I’d do next',
			paragraphs: [
				'Hand it to more kids and watch where they get stuck. Add a flight school, with short lessons from first takeoff to a full course, and a ghost of your best run to race against. Then decide whether it belongs on the App Store.',
			],
		},
	],
}
