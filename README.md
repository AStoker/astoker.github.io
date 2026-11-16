# astoker.github.io

Andrew Stoker's portfolio. Vue 3 + Vite, deployed to GitHub Pages.

```sh
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Where things live

| What | Where |
| --- | --- |
| All the words on the site, and the list of cousins | `src/content.js` |
| Colours, fonts, buttons | `src/styles/main.css` |
| The mustache shapes | `tools/generate-mustache.mjs` (run it to regenerate `src/assets/mustaches.js`) |
| A face with a mustache (eyes, brows, moods, twirl) | `src/components/StacheCharacter.vue` |
| The portrait wall in the hero | `src/components/StacheFamily.vue` |
| Which cousins have been found | `src/composables/stacheHunt.js` |

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

Four cousins hide on the page, each with a different mustache. Every reveal is the same
each time; nothing is random.

| Cousin | Where | How it's revealed |
| --- | --- | --- |
| The Handlebar | Behind the second empty case study | Its eyebrows always poke over the top. Hover over the frame (or tap it) and it pops up. |
| The Pencil | Bottom corner of the window, in About | Stay in About and it rises slowly, fully up after three seconds. Leave and it ducks down. |
| The Horseshoe | Behind the dark card in Say hello | A whisker always pokes out. Hover over the card (or tap it) and it leans out. |
| The Walrus | On the footer line | Always there, asleep. Click to wake it. |

Clicking a cousin finds it, and it moves into its frame on the portrait wall in the
hero. Each empty frame gives a clue: a riddle that hints at where to look without
saying how (the clues are in `src/content.js`). The counter in the header links back to
the wall. Progress is remembered in the browser. Everything works with the keyboard and
respects `prefers-reduced-motion`.

To hide a new cousin: add it to `cousins` in `src/content.js`, then wrap something with
an opaque background:

```vue
<HidingStache id="my-new-cousin" from="top" at="70%">
	<div class="card">…</div>
</HidingStache>
```

## Deploying

`.github/workflows/deploy.yml` builds and publishes on every push to `master`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
