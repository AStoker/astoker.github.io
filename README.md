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
| All the words on the site | `src/content.js` |
| Colours, fonts, buttons | `src/styles/main.css` |
| The mustache shape | `tools/generate-mustache.mjs` (run it to regenerate `src/assets/mustache.js`) |
| The mustache character (eyes, moods, twirl) | `src/components/StacheCharacter.vue` |
| Hiding a mustache behind something | `src/components/HidingStache.vue` |
| The hunt (which ones are found) | `src/composables/stacheHunt.js` |

## The mustache hunt

Four mustaches hide on the page: behind a work slot, at the edge of the window
when you reach About, behind the contact card, and asleep on the footer.
Finding them all sets off a celebration. Progress is remembered in the browser.

To hide another one, add an id to `SPOTS` in `src/composables/stacheHunt.js` and wrap
something with an opaque background:

```vue
<HidingStache id="my-new-spot" from="top" at="70%">
	<div class="card">…</div>
</HidingStache>
```

`from` is `top`, `left` or `right`. Side peeks switch to `top` on small screens so they
don't poke off the edge. Everything respects `prefers-reduced-motion`, and every hiding
spot can be reached with the keyboard: tabbing to it makes it peek.

## Deploying

`.github/workflows/deploy.yml` builds and publishes on every push to `master`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
