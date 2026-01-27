import { Font } from '@react-pdf/renderer';

// Flag to track if fonts are registered
let fontsRegistered = false;

// Get base URL lazily at runtime (not module load time)
function getBaseUrl(): string {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://assessment.fulcrumcollective.io';
}

// Logo path - computed lazily
export function getLogoPath(): string {
  return `${getBaseUrl()}/fulcrum-logo.png`;
}

// For backwards compatibility
export const LOGO_PATH = 'https://assessment.fulcrumcollective.io/fulcrum-logo.png';

// Register fonts lazily when needed
export function ensureFontsRegistered() {
  if (fontsRegistered) {
    return;
  }

  const isVercel = process.env.VERCEL === '1';
  const baseUrl = getBaseUrl();

  console.log('[PDF Fonts] Registering fonts...');
  console.log('[PDF Fonts] isVercel:', isVercel);
  console.log('[PDF Fonts] BASE_URL:', baseUrl);

  try {
    if (isVercel) {
      // On Vercel, use the production URL
      const fontUrl = `${baseUrl}/Satoshi-Variable.ttf`;
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

// Don't auto-register - let it happen on first use
