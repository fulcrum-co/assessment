// Font configuration for PDF generation
// Using Helvetica (built-in to react-pdf) for reliability

// Get base URL lazily at runtime
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

// No custom font registration needed - using built-in Helvetica
export function ensureFontsRegistered() {
  // Helvetica is built-in, no registration needed
  console.log('[PDF Fonts] Using built-in Helvetica font');
}
