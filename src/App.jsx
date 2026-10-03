import React, { useState, useEffect, useCallback, Suspense } from "react";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { Loader2, CheckCircle, Film } from 'lucide-react';

export default function App() {
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname.toLowerCase();
            if (path === '/watchlist') return 'watchlist';
            if (path === '/boxoffice') return 'boxoffice';
            if (path === '/discovery' || path === '/ai-discovery') return 'ai-discovery';
        }
        return 'home';
    };

    const [activeTab, setActiveTabState] = useState(getInitialTab);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const setActiveTab = (tab, updateHistory = true) => {
        setActiveTabState(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (updateHistory && typeof window !== 'undefined') {
            const targetPath = tab === 'home' ? '/' : tab === 'details' ? window.location.pathname : '/${tab}';
            if (window.location.pathname !== targetPath) {
                window.history.pushState({ tab }, '', targetPath);
            }
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname.toLowerCase();
            if (path === '/watchlist') setActiveTabState('watchlist');
            else if (path === '/boxoffice') setActiveTabState('boxoffice');
            else if (path === '/discovery' || path === '/ai-discovery') setActiveTabState('ai-discovery');
            else setActiveTabState('home');
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [currentCountry, setCurrentCountry] = useState('US');
    const [user, setUser] = useState(null);
    const [isLoadingMovie, setIsLoadingMovie] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((msg, type = 'info') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    }, []);

    const apiKeys = {
        gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
        tmdb: import.meta.env.VITE_TMDB_API_KEY || '',
    };

    return (
        <div className="min-h-screen bg-[#0A0A09] text-[#F4F0EA] flex flex-col font-sans selection:bg-[#E03C31] selection:text-white antialiased relative overflow-x-hidden">
            <Navbar
            activeTab={activeTab}
            setActiveTab={ (tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectMovie={(movie) => setSelectedMovie(movie)}
            movies={movies}
            watchlistCount={watchlist.length}
            currentCountry={currentCountry}
            onCountryChange={(code) => setCurrentCountry(code)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            apiKeys={apiKeys}
            user={user}
            onOpenAuth={() => {}}
            />

            {notification && (
                <div className="fixed top-20 right-6 z-[70] animate-fade-in">
                    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[4px] bg-[#181816] border border-[#262522] shadow-2xl text-xs font-mono text-[#F4F0EA]">
                        {notification.type === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                            <Film className="w-3.5 h-3.5 text-[#E03C31]" />
                        )}
                        <span>{notification}</span>
                    </div>
                </div>
            )}

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative">
                <ErrorBoundary onReset={() => setActiveTab('home')}>
                    <Suspense fallback={
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-[#D9C39A] animate-spin" />
                                <span className="text-xs text-[#8C877E] font-mono tracking-widest uppercase">Loading Ledger</span>
                            </div>
                        </div>
                    }>
                        <div className="py-20 text-center font-mono text-xs text-[#8C877E] uppercase tracking-widest">
                            Kinova Archive Initialized - Current Tab: {activeTab}
                        </div>
                    </Suspense>
                </ErrorBoundary>
            </main>

            <Footer
            onNavigateToAi={() => {
                setActiveTab('ai-discovery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            />
        </div>
    );
}