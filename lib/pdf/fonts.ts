import { Font } from '@react-pdf/renderer';

// Flag to track if fonts are registered
let fontsRegistered = false;

// Logo as base64 data URL (embedded directly to avoid network issues)
export const LOGO_DATA_URL = 'data:image/png;base64,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';

// For the logo path, we export the data URL directly
export const LOGO_PATH = LOGO_DATA_URL;

// Register fonts lazily when needed
export function ensureFontsRegistered() {
  if (fontsRegistered) {
    return;
  }

  console.log('[PDF Fonts] Registering fonts...');

  try {
    // Try to use URL-based font loading
    const isVercel = process.env.VERCEL === '1';

    if (isVercel) {
      // On Vercel, use the production URL
      const baseUrl = process.env.BASE_URL || 'https://assessment.fulcrumcollective.io';
      const fontUrl = `${baseUrl}/Satoshi-Variable.ttf`;
      console.log('[PDF Fonts] Using URL font source:', fontUrl);

      Font.register({
        family: 'Satoshi',
        fonts: [
          { src: fontUrl, fontWeight: 'normal' },
          { src: fontUrl, fontWeight: 'bold' },
          { src: fontUrl, fontWeight: 500 },
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
          { src: fontPath, fontWeight: 'normal' },
          { src: fontPath, fontWeight: 'bold' },
          { src: fontPath, fontWeight: 500 },
        ],
      });
    }

    // Disable hyphenation for cleaner text
    Font.registerHyphenationCallback((word) => [word]);

    fontsRegistered = true;
    console.log('[PDF Fonts] Fonts registered successfully');
  } catch (error) {
    console.error('[PDF Fonts] Failed to register fonts:', error);
    // Fall back to Helvetica - don't throw, let PDF generation continue
    fontsRegistered = true; // Mark as registered so we don't retry
  }
}

// Auto-register on import (but with try-catch)
try {
  ensureFontsRegistered();
} catch (e) {
  console.error('[PDF Fonts] Auto-registration failed:', e);
}
