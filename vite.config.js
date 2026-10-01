import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';
import {resolveLiveFinancials, scrapeBoxOfficeMojo, scrapeIMDbData} from '.src/services/boxOfficeEngine.js'
import {MOCK_MOVIES} from './src/data/mockMovies.js'

functiion boxOfficeServerPlugin(env = {}) {
    return {
        name: 'box-office-server-plugin',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                try {
                    const url = new URL(req.url, 'http://localhost');
                    if (url.pathname === '/api/box-office') {
                        const imdbId = url.searchParams.get('imdbId') || '';
                        const title = url.searchParams.get('title') || '';
                        
                }
            })