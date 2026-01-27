import { Font } from '@react-pdf/renderer';

// Flag to track if fonts are registered
let fontsRegistered = false;

// Determine if we're on Vercel
const isVercel = process.env.VERCEL === '1';

// Base URL for assets
const BASE_URL = process.env.BASE_URL || 'https://assessment.fulcrumcollective.io';

// Logo path - use URL (works on Vercel)
export const LOGO_PATH = `${BASE_URL}/fulcrum-logo.png`;

// Register fonts lazily when needed
export function ensureFontsRegistered() {
  if (fontsRegistered) {
    return;
  }

  console.log('[PDF Fonts] Registering fonts...');

  try {
    if (isVercel) {
      // On Vercel, use the production URL
      const fontUrl = `${BASE_URL}/Satoshi-Variable.ttf`;
      console.log('[PDF Fonts] Using URL font source:', fontUrl);

      Font.register({
        family: 'Satoshi',
        fonts: [
          { src: fontUrl, fontWeight: 400 },
          { src: fontUrl, fontWeight: 500 },
          { src: fontUrl, fontWeight: 700 },
        ],
      });
    } else {
      // Local development - use file path
      const path = require('path');
      const fontPath = path.join(process.cwd(), 'public', 'Satoshi-Variable.ttf');
      console.log('[PDF Fonts] Using file font source:', fontPath);

      Font.register({
        family: 'Satoshi',
        fonts: [
          { src: fontPath, fontWeight: 400 },
          { src: fontPath, fontWeight: 500 },
          { src: fontPath, fontWeight: 700 },
        ],
      });
    }

    // Disable hyphenation for cleaner text
    Font.registerHyphenationCallback((word) => [word]);

    fontsRegistered = true;
    console.log('[PDF Fonts] Fonts registered successfully');
  } catch (error) {
    console.error('[PDF Fonts] Failed to register fonts:', error);
    fontsRegistered = true; // Mark as registered so we don't retry
  }
}

// Auto-register on import
try {
  ensureFontsRegistered();
} catch (e) {
  console.error('[PDF Fonts] Auto-registration failed:', e);
}
