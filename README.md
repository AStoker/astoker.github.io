# astoker.github.io

My portfolio. Vue 3 + Vite, deployed to GitHub Pages.

```sh
yarn install
yarn dev         # local dev server
yarn build       # production build in dist/
yarn test        # run the tests once
yarn test:watch  # re-run the tests as I edit
yarn coverage    # the tests, plus a report of what they cover (in coverage/)
```

## Where things live

| What | Where |
| --- | --- |
| Every word on the site, the list of sections, and the list of cousins | `src/content.js` |
| My resume | `public/andrew-stoker-resume.pdf` (when I replace it, I update the size in `resume` in `content.js` too) |
| Colours, fonts, buttons | `src/styles/main.css` |
| The mustache shapes | `tools/generate-mustache.mjs` (run it to regenerate `src/assets/mustaches.js`) |
| Test helpers and the fake browser APIs | `src/test/` |
| A face with a mustache (eyes, brows, moods, twirl) | `src/components/StacheCharacter.vue` |
| A numbered section with its heading | `src/components/PageSection.vue` |
| My portrait wall in the hero | `src/components/StacheFamily.vue`, with its caption in `src/composables/frameSelection.js` |
| Which cousins have been found | `src/composables/stacheHunt.js` |
| What a cousin does when it's found | `src/composables/cousin.js` |
| Which section is in the middle of the screen | `src/composables/currentSection.js` |
| Timeouts that clean up after themselves | `src/composables/timers.js` |
| Reduced motion (system setting plus the footer switch) | `src/composables/media.js` |
| My mustache and note in the browser's developer console | `src/devConsole.js` (art) and `devConsole` in `src/content.js` (words) |

## Sections

The page's sections are listed in `sections` at the bottom of `content.js`. Each one has an
`id` (what the menu links to), a `title`, and a `menu` label. Its number (01, 02…) comes
from its place in that list, so to add or reorder a section I only change the list and
wrap the new component in `<PageSection :section="…">`.

## The mustaches

There are six kinds: `chevron` (mine), `handlebar`, `walrus`, `horseshoe`, `pencil`
and `dali`. Each is described in `tools/generate-mustache.mjs` as a centreline plus how
thick the hair is above and below it. I edit an entry (or add one) and run:

```sh
node tools/generate-mustache.mjs
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
saying how (the clues are in `src/content.js`). The caption keeps a clue up while you're
on the wall, then goes back to its intro. The counter in the header links back to the
wall. Progress is remembered in the browser, and once all five are found the wall keeps
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

1. Add it to `cousins` in `src/content.js`, with a `label` for screen readers to hear
   before it's found. (The portrait wall is a 3 × 3 grid with room for exactly five, so a
   sixth needs a new wall layout.)
2. Give it a reaction in `REACTIONS` in `StacheFamily.vue`.
3. Wrap something with an opaque background:

```vue
<HidingStache id="my-new-cousin" from="top" at="70%">
	<div class="card">…</div>
</HidingStache>
```

A hiding spot of a new kind can use `useCousin(id)` from `composables/cousin.js`, which
handles being found, the mood, the twirl and the label. The component only has to decide
how the cousin hides.

## Accessibility

I aim for WCAG 2.2 AA, checked with axe in light and dark mode and at 320px wide.

- Everything works with the keyboard, including the hunt. The Pencil lives inside About in
  the page, so it's next in the tab order while it's up.
- Motion follows the system's reduced-motion setting, and the **Reduce motion** switch in my
  footer stills every blink, breath and wiggle (WCAG 2.2.2). Components hook in with
  `:root.reduce-motion .thing { ... }` in CSS or `reducedMotion` from `composables/media.js`.
- Focus rings use `--focus`. Anything on a dark or inverted surface (the Say hello card, the
  toast) sets its own. Buttons drawn as something else (a mustache, a frame) use the
  `.bare-button` class, which keeps the focus ring.
- Small text needs 4.5:1, large text and UI parts 3:1. `--ink-soft` and `--red-text` are
  safe for small text on both papers; `--red` is for shapes and large type only.
- Below 540px the header links fold into a Menu button so the counter never gets pushed off.

## Testing

The tests use [Vitest](https://vitest.dev) and [Vue Test Utils](https://test-utils.vuejs.org),
in jsdom. Each one sits next to what it tests (`HidingStache.vue` → `HidingStache.test.js`).

- **Composables** are tested on their own; `withSetup()` runs one inside a real component so
  its clean-up on unmount gets tested too.
- **Components** are tested the way a visitor uses them: pointer events, taps, keys and
  time passing. `useFakeClock()` and `wait(ms)` move time on, so the reactions and animations
  can be checked step by step without waiting for real.
- **`content.test.js`** checks my content fits together (every cousin has its words and a
  real mustache, the wall has room for them all).
- **`tools/generate-mustache.test.js`** fails if I change a shape but forget to run the
  generator.
- **`App.test.js`** mounts the whole page and checks every cousin is hidden exactly once.

jsdom has no `IntersectionObserver` or `matchMedia`, so `src/test/browser.js` fakes them, and
a test can drive them: `intersect(el)` scrolls something into view, `setMedia(MEDIA.narrow,
true)` makes the window narrow. `src/test/setup.js` puts everything back after each test.

## Deploying

`.github/workflows/deploy.yml` runs the tests, then builds and publishes on every push to
`main`. A failing test stops the deploy. `.github/workflows/test.yml` runs the tests on every
pull request.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
