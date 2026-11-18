// Gives each case study a real page of its own when the site's built.
//
// My site is one app: main.ts looks at the address and shows either my home page or a case
// study. GitHub Pages only serves files that exist, though, so a link straight to
// /work/fly-island/ would 404. This Vite plugin writes a copy of the built index.html to
// work/<slug>/index.html for every study, with that study's title, summary and picture in
// the <head>, so the link works and its preview on LinkedIn or Slack shows the right thing.
//
// The dev server needs none of this: it already serves index.html for any address.

import type { Plugin } from 'vite'
import type { CaseStudy } from '../src/caseStudies/types.ts'

/** What a page's <head> says about it. */
export interface PageMeta {
	title: string
	description: string
	/** The page's full address, for link previews. */
	url: string
	/** A full address for its preview picture. */
	image?: string
}

const escape = (text: string) =>
	text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/**
 * index.html, rewritten for another page. Throws if a tag it rewrites has gone missing from
 * index.html, so the build fails rather than quietly shipping my home page's title.
 */
export function pageHtml(html: string, page: PageMeta): string {
	const swaps: [RegExp, string][] = [
		[/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`],
		[/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escape(page.description)}"`],
		[/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escape(page.title)}"`],
		[
			/<meta property="og:description" content="[^"]*"/,
			`<meta property="og:description" content="${escape(page.description)}"`,
		],
		[/<meta property="og:type" content="[^"]*"/, '<meta property="og:type" content="article"'],
	]
	for (const [tag, replacement] of swaps) {
		if (!tag.test(html)) throw new Error(`index.html has no ${tag.source} to rewrite`)
		html = html.replace(tag, replacement)
	}

	const extra = [
		`<meta property="og:url" content="${escape(page.url)}" />`,
		`<link rel="canonical" href="${escape(page.url)}" />`,
		...(page.image
			? [
					`<meta property="og:image" content="${escape(page.image)}" />`,
					'<meta name="twitter:card" content="summary_large_image" />',
				]
			: []),
	]
	return html.replace('</head>', `\t${extra.join('\n\t\t')}\n\t</head>`)
}

/** The <head> for a case study's page on my site. */
export function studyMeta(study: CaseStudy, site: string, name: string): PageMeta {
	return {
		title: `${study.title} · ${name}`,
		description: `${study.what}. ${study.summary}`,
		url: `${site}/work/${study.slug}/`,
		image: study.shareImage && `${site}${study.shareImage}`,
	}
}

/** The Vite plugin: one page per case study, next to the built index.html. */
export function caseStudyPages(studies: readonly CaseStudy[], site: string, name: string): Plugin {
	return {
		name: 'case-study-pages',
		apply: 'build',
		enforce: 'post',
		generateBundle(_, bundle) {
			const index = bundle['index.html']
			if (index?.type !== 'asset') throw new Error('No index.html in the build to copy')
			const html = String(index.source)
			for (const study of studies) {
				this.emitFile({
					type: 'asset',
					fileName: `work/${study.slug}/index.html`,
					source: pageHtml(html, studyMeta(study, site, name)),
				})
			}
		},
	}
}
