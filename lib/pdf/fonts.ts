import { Font } from '@react-pdf/renderer';
import path from 'path';

// Determine if we're on Vercel
const isVercel = process.env.VERCEL === '1';

// Get the base URL for assets
// On Vercel, use the deployment URL; locally use file paths
const getAssetPath = (filename: string) => {
  if (isVercel) {
    // Use the deployment URL for Vercel
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BASE_URL || 'https://assessment.fulcrumcollective.io';
    return `${baseUrl}/${filename}`;
  }
  // Local development - use file path
  return path.join(process.cwd(), 'public', filename);
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

export const LOGO_PATH = getAssetPath('Fulcrum Original Logo.png');
