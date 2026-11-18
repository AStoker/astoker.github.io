// My case studies, in the order they appear in Work (Case study 01, 02…). Each lives in its
// own file here, and gets its own page at /work/<slug>/. To add one: copy flyIsland.ts,
// put its pictures in public/work/<slug>/, and list it below.
// Full file names (./flyIsland.ts), because vite.config.ts loads this file too.
import { flyIsland } from './flyIsland.ts'
import type { CaseStudy } from './types.ts'

export type { CaseStudy, Figure, StoryPart, StorySection } from './types.ts'

export const caseStudies: readonly CaseStudy[] = [flyIsland]

/** Where a case study's page lives. */
export const studyPath = (study: CaseStudy) => `/work/${study.slug}/`

/** Its number in Work, padded: "01". */
export const studyNumber = (study: CaseStudy) => String(caseStudies.indexOf(study) + 1).padStart(2, '0')

/** The case study whose page this path is, or null for any other page. */
export function studyAt(pathname: string): CaseStudy | null {
	const slug = /^\/work\/([a-z0-9-]+)\/?$/.exec(pathname)?.[1]
	return caseStudies.find((study) => study.slug === slug) ?? null
}
