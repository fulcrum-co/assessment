import { Font } from '@react-pdf/renderer';
import path from 'path';

// Determine if we're on Vercel
const isVercel = process.env.VERCEL === '1';

// Get the base URL for assets
// On Vercel, use BASE_URL (stable) over VERCEL_URL (changes per deployment)
const getAssetPath = (filename: string) => {
  if (isVercel) {
    // Prefer BASE_URL (user-configured, stable) over VERCEL_URL (dynamic per deployment)
    const baseUrl = process.env.BASE_URL || 'https://assessment.fulcrumcollective.io';
    const assetUrl = `${baseUrl}/${filename}`;
    console.log(`[PDF Fonts] Loading asset from URL: ${assetUrl}`);
    return assetUrl;
  }
  // Local development - use file path
  const localPath = path.join(process.cwd(), 'public', filename);
  console.log(`[PDF Fonts] Loading asset from file: ${localPath}`);
  return localPath;
};

const fontPath = getAssetPath('Satoshi-Variable.ttf');

// Register Satoshi font for PDF generation
// Using variable font file for all weights
Font.register({
  family: 'Satoshi',
  fonts: [
    {
      src: fontPath,
      fontWeight: 'normal',
    },
    {
      src: fontPath,
      fontWeight: 'bold',
    },
    {
      src: fontPath,
      fontWeight: 500,
    },
  ],
});

// Disable hyphenation for cleaner text
Font.registerHyphenationCallback((word) => [word]);

export const LOGO_PATH = getAssetPath('fulcrum-logo.png');
