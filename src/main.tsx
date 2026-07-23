import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import './index.css'
import './App.css'
import App from './App.tsx'

const fallback = ({ error }: FallbackProps) =>
    (
        <div role="alert">
            <p>No user provided: </p>
            <pre>{error instanceof Error ? error.message : String(error)}</pre>
        </div>
    );

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={fallback}>
            <App />
        </ErrorBoundary>
    </StrictMode>,
)
