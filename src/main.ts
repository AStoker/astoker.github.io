import { createApp } from 'vue'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/jetbrains-mono'
import './styles/main.css'
import App from './App.vue'
import CaseStudyPage from './components/CaseStudyPage.vue'
import { studyAt } from './caseStudies'
import './devConsole'

// One app, two kinds of page: my home page, or a case study's own page at /work/<slug>/.
// (The build writes a copy of index.html at each of those addresses; see vite.config.ts.)
const study = studyAt(location.pathname)
const app = study ? createApp(CaseStudyPage, { study }) : createApp(App)
app.mount('#app')
