import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Enhanced global error handlers
window.addEventListener('unhandledrejection', (event) => {
  console.error('GLOBAL CATCH: Unhandled Promise Rejection!', {
    reason: event.reason,
    promise: event.promise,
    stack: event.reason?.stack
  });
  
  // Show user-friendly error if it's a critical error
  if (event.reason?.message?.includes('ChunkLoadError') || 
      event.reason?.message?.includes('Loading chunk')) {
    alert('Application failed to load. Please refresh the page.');
  }
  
  // Prevent the default handling (which might cause the blank screen)
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('GLOBAL CATCH: JavaScript Error!', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    stack: event.error?.stack
  });
});

// Add console.log to track rendering
console.log('index.js: Starting React app render...');

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found! Make sure you have <div id="root"></div> in your HTML');
  }
  
  console.log('index.js: Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('index.js: Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('index.js: App render completed successfully');
  
} catch (error) {
  console.error('CRITICAL ERROR: Failed to render React app:', error);
  
  // Fallback error display
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
        <h2>Application Failed to Load</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Please check the browser console for more details and refresh the page.</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
