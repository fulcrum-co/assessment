import { Font } from '@react-pdf/renderer';

// Register Satoshi font for PDF generation
// Using variable font file for all weights
Font.register({
  family: 'Satoshi',
  fonts: [
    {
      src: process.cwd() + '/public/Satoshi-Variable.ttf',
      fontWeight: 'normal',
    },
    {
      src: process.cwd() + '/public/Satoshi-Variable.ttf',
      fontWeight: 'bold',
    },
    {
      src: process.cwd() + '/public/Satoshi-Variable.ttf',
      fontWeight: 500,
    },
  ],
});

// Disable hyphenation for cleaner text
Font.registerHyphenationCallback((word) => [word]);

export const LOGO_PATH = process.cwd() + '/public/Fulcrum Original Logo.png';
