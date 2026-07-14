import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary';
import './index.css'
import './App.css'
import App from './App.tsx'

function fallback({ error }) {
    return (
        <div role="alert">
            <p>No user provided: </p>
            <pre>{error.message}</pre>
        </div>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={fallback}>
            <App />
        </ErrorBoundary>
    </StrictMode>,
)
