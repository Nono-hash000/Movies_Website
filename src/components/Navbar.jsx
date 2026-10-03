import React, { useState, useEffect, useRef} from "react";
import {
    Film, Search, Bookmark, X, Loader2, User, SlidersHorizontal, Check, Globe 
} from 'lucide-react'
import { COUNTRY_OPTIONS } from '../data/mockMovies';
import { searchMovies } from '../services/movieApi';
import { useRegion } from '../context/RegionContent'
import { EXCHANGE_RATES } from '../utils/currencyFormatter';

export default function Navbar({
    activeTab,
    setActiveTab,
    onSelectedMovie,
    movies,
    watchlistCount,
    cunnertCountry,
    onCountryChange,
    onOpenSidebar,
    user,
    onOpenAuth,
    apiKeys
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSeraching] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const regionMenuRef = useRef(null);

    const { setSelectedRegion } = useRegion();

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSeraching(true);
            try {
                const results = await searchMovies(searchQuery, apiKeys?.tmdb);
                setSearchResults(results);
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setIsSeraching(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [searchQuery. movies, apiKeys?.tmdb]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
            if (regionMenuRef.current && !regionMenuRef.current.contains(e.target)) {
                setIsRegionMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeCountryObj = COUNTRY_OPTIONS.find(c => c.code === cunnertCountry) || COUNTRY_OPTIONS[0];

    return (
        <header className="sticky top-0 z-40 w-full bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#262522] transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
                    <div
                    onClick={() => setActiveTab('home')}
                    className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
                    >
                        <div className="w-9 h-9 rounded-[4px] bg-[#121210] border border-[#262522] flex items-center justify-center group-hover:border-[#E03C31]/60 transition-colors shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#F4F0EA]">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="3" y1="3" x2="21" y2="7.5" stroke="#262522" strokeWidth="1" />
                            <line x1="3" y1="16.5" x2="21" y2="16.5" stroke="#262522" strokeWidth="1" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.25" />
                            <circle cx="15.5" cy="8.5" r="1.1" fill="#E03C31" />
                        </svg>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="tracking-[0.22em] font-semibold text-[#F4F0EA] text-base sm:text-lg">
                                KINOVA
                            </span>
                            <div className="h-3.5 w-px bg-[#262522] hidden sm:block" />
                            <span className="font-mono text-[10px] text-[#8C877E] tracking-widest hidden sm:block uppercase">
                                ARCHIVE & BOX OFFICE
                            </span>
                        </div>
                    </div>

                    <div className="relative flex-1 max-w-lg hidden md:block" ref={searchRef}>
                        <div className="relative">
                            {isSearching ? (
                                <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9C39A] animate-spin" />
                            ) : (
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C877E]" />
                            )}
                            <input
                                type="text"
                                placeholder={apiKeys?.tmdb ? "Search global TMDB catalog or film title..." : "Sezrch films, directors, or box office records..."}
                                value={searchQuery}
                                onFocus={() => setIsSearchOpen(true)}
                                onChange={() => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-9 py-2 rounded-[4px] bg-[#121210] border border-[#262522] text-xs text-[#F4F0EA] placeholder-[#8C877E] focus:outline-none focus:border-[#E03C31]/70 focus:ring-1 focus:ring-[#E03C31]/40 transition-all font-sans"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C877E] hover:text-[#F4F0EA]"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {isSearchOpen && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121210] border border-[#262522] rounded-[4px] shadow-2xl overflow-hidden z-50 animate-fade-in">
                                <div className="p-2.5 border-b border-[#262522] text-[10px] font-mono uppercase tracking-wider text-[#8C877E] flex items-center justify-between">
                                    <span>Results ({searchResults.length})</span>
                                    {apiKeys?.tmdb && <span className="text-[#D9C39A]">Live TMDB Catalog</span>}
                                </div>
                                <div className="max-h-80 overflow-y-auto divide-y divide-[#262522]">
                                    {searchResults.map(movie => (
                                        <div
                                            key={movie.id || movie.tmdbId}
                                            onClick={() => {
                                                onSelectedMovie(movie);
                                                setIsSearchOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className="p-3 flex items-center gap-3 hover:bg-[#181816] cursor-pointer transition-colors"
                                        >
                                            <img
                                                src={movie.posterUrl}
                                                alt={movie.title}
                                                className="w-10 h-14 object-cover rounded-[2px] border border-white/10 shadow-sm flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80";
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <h4 className="text-sm font-medium text-[#F4F0EA] truncate">{movie.title}</h4>
                                                    {movie.isUpcoming && (
                                                        <span className="px-1.5 py-0.5 rounded-[2px] font-mono text-[9px] uppercase tracking-wider bg-[#181816] text-[#709CA8] border border-[#709CA8]/30 flex-shrink-0">
                                                            Upcoming
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[#8C877E] mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                    {movie.releaseYear && (
                                                        <span className="font-mono text-[#F4F0EA]">{movie.releaseYear}</span>
                                                    )}
                                                    {movie.languageLabel && movie.languageLabel !== 'EN' && (
                                                        <span className="px-1.5 py-0.2 rounded-[2px] font-mono text-[9px] bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/20">
                                                            {movie.languageLabel}
                                                        </span>
                                                    )}
                                                    {movie.director ? `• ${movie.director}` : ''}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {movie.ratings?.imdb?.score && movie.ratings.imdb.score !== 'N/A' ? (
                                                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/25">
                                                            {movie.ratings.imdb.score} IMDb
                                                        </span>
                                                    ) : movie.ratings?.tmdb?.score ? (
                                                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] bg-[#181816] text-[#709CA8] border border-[#709CA8]/25">
                                                            {movie.ratings.tmdb.score} TMDB
                                                        </span>
                                                    ) : null}
                                                    {movie.genres?.length > 0 && (
                                                        <span className="text-[10px] text-[#8C877E] truncate font-sans">
                                                            {movie.genres.slice(0, 2).join(', ')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5">
                        <div className="relative" ref={regionMenuRef}>
                            <button
                                onClick={() => setIsRegionMenuOpen(prev => !prev)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#121210] hover:bg-[#1A1917] border border-[#262522] hover:border-[#D9C39A]/40 text-xs font-mono text-[#F4F0EA] transition-all cursor-pointer shadow-sm"
                                title={`Active region & currency: ${activeCountryObj.name}. Click to switch`}
                                >
                                    <Globe className="w-3.5 h-3.5 text-[#8C877E] flex-shrink-0" />
                                    <span className="text-[11px] font-mono text-[#D9C39A]">
                                        {activeCountryObj} ({(EXCHANGE_RATES[activeCountryObj.code] || EXCHANGE_RATES.US).symbol})
                                    </span>
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}