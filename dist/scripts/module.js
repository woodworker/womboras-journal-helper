import { renderJournalSheet } from './hooks/renderJournalSheet.js';
console.log('Womboras Journal Renderer Loaded');
Hooks.on('renderJournalSheet', renderJournalSheet);
