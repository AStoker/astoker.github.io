# astoker.github.io

My portfolio. Vue 3 + Vite + TypeScript, deployed to GitHub Pages.

```sh
yarn install
yarn dev         # local dev server
yarn build       # production build in dist/
yarn typecheck   # check the types across the site, tools and tests
yarn test        # run the tests once
yarn test:watch  # re-run the tests as I edit
yarn coverage    # the tests, plus a report of what they cover (in coverage/)
```

## Where things live

| What | Where |
| --- | --- |
| Every word on the site, the list of sections, and the list of cousins | `src/content.ts` |
| What a cousin, a section or a mood is allowed to be | `src/types.ts` |
| My resume | `public/andrew-stoker-resume.pdf` (when I replace it, I update the size in `resume` in `content.ts` too) |
| My case studies | `src/caseStudies/` (one file each), their pictures in `public/work/<slug>/` |
| A case study's page, and its card in Work | `src/components/CaseStudyPage.vue`, `src/components/CaseStudyCard.vue` |
| Colours, fonts, buttons | `src/styles/main.css` |
| The mustache shapes | `tools/generate-mustache.ts` (run it to regenerate `src/assets/mustaches.ts`) |
| Test helpers and the fake browser APIs | `src/test/` |
| A face with a mustache (eyes, brows, moods, twirl) | `src/components/StacheCharacter.vue` |
| A numbered section with its heading | `src/components/PageSection.vue` |
| My portrait wall in the hero | `src/components/StacheFamily.vue`, with its caption in `src/composables/frameSelection.ts` |
| Which cousins have been found | `src/composables/stacheHunt.ts` |
| What a cousin does when it's found | `src/composables/cousin.ts` |
| Which section is in the middle of the screen | `src/composables/currentSection.ts` |
| Timeouts that clean up after themselves | `src/composables/timers.ts` |
| Reduced motion (system setting plus the footer switch) | `src/composables/media.ts` |
| Microsoft Clarity (heatmaps, recordings, errors; no cookies, live site only) | `src/composables/tracking.ts`, with the footer note in `tracking` in `src/content.ts` |
| My mustache and note in the browser's developer console | `src/devConsole.ts` (art) and `devConsole` in `src/content.ts` (words) |

## Sections

The page's sections are listed in `sections` at the bottom of `content.ts`. Each one has an
`id` (what the menu links to), a `title`, and a `menu` label. Its number (01, 02…) comes
from its place in that list, so to add or reorder a section I only change the list and
wrap the new component in `<PageSection :section="…">`.

## Case studies

Each case study is one file in `src/caseStudies/`, listed in order in `src/caseStudies/index.ts`.
It shows up as a card in Work (placeholders fill the rest of the three spots) and gets its own
page at `/work/<slug>/`.

They all follow the same outline, so they read the same way. The shape is in
`src/caseStudies/types.ts`; hover over a field for what it's for. The story goes:

1. **The goal**: what I set out to make, and for whom.
2. **Decisions**: the calls that shaped it, each with what I gave up for it. Numbered on the page.
3. **The hard part** and **How I worked** (both optional): a problem I cracked, and how I knew it worked.
4. **What went wrong**, then **The result** (with a few big numbers) and **What's next**.

To add one:

1. Copy `flyIsland.ts`, rename it, and list it in `index.ts`.
2. Put its pictures in `public/work/<slug>/` as WebP, about 1400 px wide
   (`cwebp -q 80 -resize 1434 0 shot.png -o shot.webp`), plus a 1200 × 630 `og.jpg` for link
   previews.
3. Run `yarn test`. `caseStudies.test.ts` checks the outline's in order, and that every picture
   exists, has a description and is the size the file says.

My site is one app: `main.ts` looks at the address and shows either my home page or a case
study. The dev server answers every address with `index.html`, so nothing else is needed there.
GitHub Pages only serves files that exist, though, so when the site's built,
`tools/caseStudyPages.ts` writes a copy of `index.html` to `work/<slug>/index.html` for each
study, with its own title, description and preview picture. Links straight to a case study work,
and their previews on LinkedIn or Slack show the study, not my home page.

## The mustaches

There are six kinds: `chevron` (mine), `handlebar`, `walrus`, `horseshoe`, `pencil`
and `dali`. Each is described in `tools/generate-mustache.ts` as a centreline plus how
thick the hair is above and below it. I edit an entry (or add one) and run:

```sh
node tools/generate-mustache.ts
```

Any kind can be used as `<MustacheIcon kind="walrus" />` or
`<StacheCharacter kind="walrus" />`, and every kind falls in the confetti.

## The hunt

Five cousins hide on my page, each with a different mustache. Every reveal is the same
each time; nothing is random.

| Cousin | Where | How it's revealed |
| --- | --- | --- |
| The Handlebar | Behind the second case study | Its eyebrows always poke over the top. Hover over the card (or tap it) and it pops up. |
| The Dalí | On my workbench shelf, in Experience | Only its eyes show in the dark. Pull the lamp cord (or click the lamp) and there it is. |
| The Pencil | Bottom corner of the window, in About | Stay in About and it rises slowly, fully up after three seconds. Leave and it ducks down, out of sight (it's clipped, so it can't show through iOS Safari's see-through toolbar). |
| The Horseshoe | Behind the dark card in Say hello | A whisker always pokes out. Hover over the card (or tap it) and it leans out. |
| The Walrus | On the footer line | Always there, asleep. Click to wake it. |

Clicking a cousin finds it, and it moves into its frame on my portrait wall in the
hero. Each empty frame gives a clue: a riddle that hints at where to look without
saying how (the clues are in `src/content.ts`). The caption keeps a clue up while you're
on the wall, then goes back to its intro. The counter in the header ("0/5 found") links
back to the wall.

Someone once took the wall for a chart of mustache styles and never noticed the hunt, so
it says so a little louder: the intro asks, in bold, whether you can find them, and an
empty frame is labelled "Hiding" rather than with its cousin's name, which only
shows up once it's found. Progress is remembered in the browser, and once all five are found the wall keeps
a **Hide them again** button to start over.

That button has my mustache tucked behind it, and it leans out when you hover or focus
the button. Meanwhile each cousin reacts in its own way (wide-eyed, jumping with
excitement, halfway out the door, suspicious, or fast asleep). Press it, or the one in the
celebration toast, and they all get a fright, then bolt out of their frames before the
hunt resets. Each frame is a window, so they vanish past its edge. The reactions and
directions are `REACTIONS` in `src/components/StacheFamily.vue`, one per cousin. The
celebration toast steps aside once the wall's caption is in view (after at least two
seconds), since the wall then says the same thing and the toast would otherwise sit on
top of the button.

To hide a new cousin:

1. Add its id to `CousinId` in `src/types.ts`. The type checker then points at everything
   else it needs.
2. Add it to `cousins` in `src/content.ts`, with a `label` for screen readers to hear
   before it's found. (The portrait wall is a 3 × 3 grid with room for exactly five, so a
   sixth needs a new wall layout.)
3. Give it a reaction in `REACTIONS` in `StacheFamily.vue` (it won't type-check until it has one).
4. Wrap something with an opaque background:

```vue
<HidingStache id="my-new-cousin" from="top" at="70%">
	<div class="card">…</div>
</HidingStache>
```

A hiding spot of a new kind can use `useCousin(id)` from `composables/cousin.ts`, which
handles being found, the mood, the twirl and the label. The component only has to decide
how the cousin hides.

## Accessibility

I aim for WCAG 2.2 AA, checked with axe in light and dark mode and at 320px wide.

- Everything works with the keyboard, including the hunt. The Pencil lives inside About in
  the page, so it's next in the tab order while it's up.
- Motion follows the system's reduced-motion setting, and the **Reduce motion** switch in my
  footer stills every blink, breath and wiggle (WCAG 2.2.2). Components hook in with
  `:root.reduce-motion .thing { ... }` in CSS or `reducedMotion` from `composables/media.ts`.
- Focus rings use `--focus`. Anything on a dark or inverted surface (the Say hello card, the
  toast) sets its own. Buttons drawn as something else (a mustache, a frame) use the
  `.bare-button` class, which keeps the focus ring.
- Small text needs 4.5:1, large text and UI parts 3:1. `--ink-soft` and `--red-text` are
  safe for small text on both papers; `--red` is for shapes and large type only.
- Below 540px the header links fold into a Menu button so the counter never gets pushed off.

## TypeScript

Everything is TypeScript, checked strictly. The shared shapes (`Cousin`, `Section`, `Mood`,
`Direction`…) are in `src/types.ts`, and `MustacheKind` comes from the generated
`src/assets/mustaches.ts`. Everything exported, and every component prop, has a doc comment,
so hovering it in the editor says what it's for.

There are three projects, all checked by `yarn typecheck`:

| Project | Covers | Notes |
| --- | --- | --- |
| `tsconfig.app.json` | the site | browser only, so Node APIs can't sneak in |
| `tsconfig.node.json` | `vite.config.ts` and `tools/` | Node only; the generator runs straight through Node, so it sticks to syntax Node can strip |
| `tsconfig.vitest.json` | the tests | sees both |

It's on TypeScript 6.0, which `vue-tsc` and the editor tooling are built on. TypeScript 7
(the Go compiler) can't run those yet: it has no JavaScript API. Its speed can be had through
[typescript-native-bridge](https://github.com/johnsoncodehk/typescript-native-bridge), a drop-in
`typescript` replacement, if checking ever gets slow.

## Testing

The tests use [Vitest](https://vitest.dev) and [Vue Test Utils](https://test-utils.vuejs.org),
in jsdom. Each one sits next to what it tests (`HidingStache.vue` → `HidingStache.test.ts`).

- **Composables** are tested on their own; `withSetup()` runs one inside a real component so
  its clean-up on unmount gets tested too.
- **Components** are tested the way a visitor uses them: pointer events, taps, keys and
  time passing. `useFakeClock()` and `wait(ms)` move time on, so the reactions and animations
  can be checked step by step without waiting for real.
- **`content.test.ts`** checks my content fits together (every cousin has its words and a
  real mustache, the wall has room for them all).
- **`tools/generate-mustache.test.ts`** fails if I change a shape but forget to run the
  generator.
- **`App.test.ts`** mounts the whole page and checks every cousin is hidden exactly once.
- **`src/caseStudies/caseStudies.test.ts`** holds every case study to the format (see Case studies).

jsdom has no `IntersectionObserver` or `matchMedia`, so `src/test/browser.ts` fakes them, and
a test can drive them: `intersect(el)` scrolls something into view, `setMedia(MEDIA.narrow,
true)` makes the window narrow. `src/test/setup.ts` puts everything back after each test.

## Deploying

`.github/workflows/deploy.yml` checks the types, runs the tests, then builds and publishes on
every push to `main`. A type error or failing test stops the deploy. `.github/workflows/test.yml`
does the same checks on every pull request.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
