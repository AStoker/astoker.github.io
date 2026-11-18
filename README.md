# astoker.github.io

Andrew Stoker's portfolio. Vue 3 + Vite, deployed to GitHub Pages.

```sh
yarn install
yarn dev         # local dev server
yarn build       # production build in dist/
```

## Where things live

| What | Where |
| --- | --- |
| All the words on the site, and the list of cousins | `src/content.js` |
| The resume people download | `public/andrew-stoker-resume.pdf` (update the size in `resume` in `content.js` too) |
| Colours, fonts, buttons | `src/styles/main.css` |
| The mustache shapes | `tools/generate-mustache.mjs` (run it to regenerate `src/assets/mustaches.js`) |
| A face with a mustache (eyes, brows, moods, twirl) | `src/components/StacheCharacter.vue` |
| The portrait wall in the hero | `src/components/StacheFamily.vue` |
| Which cousins have been found | `src/composables/stacheHunt.js` |
| Reduced motion (system setting plus the footer switch) | `src/composables/media.js` |

## The mustaches

There are six kinds: `chevron` (Andrew's), `handlebar`, `walrus`, `horseshoe`, `pencil`
and `dali`. Each is described in `tools/generate-mustache.mjs` as a centreline plus how
thick the hair is above and below it. Edit an entry (or add one) and run:

```sh
node tools/generate-mustache.mjs
```

Any kind can be used as `<MustacheIcon kind="walrus" />` or
`<StacheCharacter kind="walrus" />`, and every kind falls in the confetti.

## The hunt

Five cousins hide on the page, each with a different mustache. Every reveal is the same
each time; nothing is random.

| Cousin | Where | How it's revealed |
| --- | --- | --- |
| The Handlebar | Behind the second case study | Its eyebrows always poke over the top. Hover over the card (or tap it) and it pops up. |
| The Dalí | On the workbench shelf, in Experience | Only its eyes show in the dark. Pull the lamp cord (or click the lamp) and there it is. |
| The Pencil | Bottom corner of the window, in About | Stay in About and it rises slowly, fully up after three seconds. Leave and it ducks down, out of sight (it's clipped, so it can't show through iOS Safari's see-through toolbar). |
| The Horseshoe | Behind the dark card in Say hello | A whisker always pokes out. Hover over the card (or tap it) and it leans out. |
| The Walrus | On the footer line | Always there, asleep. Click to wake it. |

Clicking a cousin finds it, and it moves into its frame on the portrait wall in the
hero. Each empty frame gives a clue: a riddle that hints at where to look without
saying how (the clues are in `src/content.js`). The counter in the header links back to
the wall. Progress is remembered in the browser.

## Accessibility

The site aims for WCAG 2.2 AA, checked with axe in light and dark mode and at 320px wide.

- Everything works with the keyboard, including the hunt. The Pencil lives inside About in
  the page, so it's next in the tab order while it's up.
- Motion follows the system's reduced-motion setting, and the **Reduce motion** switch in the
  footer stills every blink, breath and wiggle (WCAG 2.2.2). Components hook in with
  `:root.reduce-motion .thing { ... }` in CSS or `reducedMotion` from `composables/media.js`.
- Focus rings use `--focus`. Anything on a dark or inverted surface (the Say hello card, the
  toast) sets its own.
- Small text needs 4.5:1, large text and UI parts 3:1. `--ink-soft` and `--red-text` are
  safe for small text on both papers; `--red` is for shapes and large type only.
- Below 540px the header links fold into a Menu button so the counter never gets pushed off.

To hide a new cousin: add it to `cousins` in `src/content.js` (the portrait wall is a 3 × 3
grid with room for exactly five, so a sixth needs a new wall layout), then wrap something
with an opaque background:

```vue
<HidingStache id="my-new-cousin" from="top" at="70%">
	<div class="card">…</div>
</HidingStache>
```

## Deploying

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
