import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './utils/preloadAssets.ts';

// 1. Disable Multi-Touch Pinch Zoom
document.addEventListener(
  'touchstart',
  (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

// 2. Disable iOS Safari / WebKit Gesture Zoom
document.addEventListener('gesturestart', (event) => {
  event.preventDefault();
});
document.addEventListener('gesturechange', (event) => {
  event.preventDefault();
});
document.addEventListener('gestureend', (event) => {
  event.preventDefault();
});

// 3. Disable Double-Tap Zoom
let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  { passive: false }
);

// 4. Disable Ctrl + Wheel / Trackpad Pinch Zoom
document.addEventListener(
  'wheel',
  (event) => {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  },
  { passive: false }
);

// 5. Disable Keyboard Zoom Shortcuts (Ctrl +/-/0)
document.addEventListener('keydown', (event) => {
  if (
    (event.ctrlKey || event.metaKey) &&
    (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
