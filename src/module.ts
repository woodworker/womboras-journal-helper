import { renderJournalSheet } from './hooks/renderJournalSheet'


console.log('Womboras Journal Renderer Loaded');
Hooks.on('renderJournalSheet', renderJournalSheet)