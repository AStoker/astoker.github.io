import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { pageHtml, studyMeta } from './caseStudyPages'
import { caseStudies } from '../src/caseStudies'

const INDEX = readFileSync('index.html', 'utf8') // tests run from the root of the repo
const page = { title: 'Fly Island · Andrew', description: 'A “game” <for> kids & grown-ups', url: 'https://x.test/work/a/' }

describe('a case study’s copy of index.html', () => {
	it('swaps in its own title and description, for the tab and for link previews', () => {
		const html = pageHtml(INDEX, page)
		expect(html).toContain('<title>Fly Island · Andrew</title>')
		expect(html).toContain('<meta name="description" content="A “game” &lt;for&gt; kids &amp; grown-ups"')
		expect(html).toContain('<meta property="og:title" content="Fly Island · Andrew"')
		expect(html).toContain('<meta property="og:type" content="article"')
		expect(html).not.toContain('Software developer</title>')
	})

	it('says where it lives, and adds a preview picture only when there is one', () => {
		expect(pageHtml(INDEX, page)).toContain('<link rel="canonical" href="https://x.test/work/a/" />')
		expect(pageHtml(INDEX, page)).not.toContain('og:image')
		const withImage = pageHtml(INDEX, { ...page, image: 'https://x.test/a.jpg' })
		expect(withImage).toContain('<meta property="og:image" content="https://x.test/a.jpg" />')
		expect(withImage).toContain('summary_large_image')
	})

	it('keeps everything else, the app’s script included', () => {
		expect(pageHtml(INDEX, page)).toContain('<script type="module" src="/src/main.ts"></script>')
	})

	it('fails the build if index.html loses a tag it rewrites', () => {
		expect(() => pageHtml(INDEX.replace(/<title>.*<\/title>/, ''), page)).toThrow(/title/)
	})

	it('describes each study with what it is and its summary', () => {
		const [study] = caseStudies
		const meta = studyMeta(study, 'https://astoker.github.io', 'Andrew Stoker')
		expect(meta.title).toBe(`${study.title} · Andrew Stoker`)
		expect(meta.description).toBe(`${study.what}. ${study.summary}`)
		expect(meta.url).toBe(`https://astoker.github.io/work/${study.slug}/`)
	})
})
