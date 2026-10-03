import { StrictMode } from "react";
import { createRoot } from "canvas-confetti";
import './indec.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { RegionProvider } from './context/RegionContent.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <RegionProvider>
                <App />
            </RegionProvider>
        </ErrorBoundary>
    </StrictMode>
)