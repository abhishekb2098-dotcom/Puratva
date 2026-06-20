import { getSiteConfig } from "@/lib/site-config";

// Converts a hex color to the HSL components string "H S% L%"
// needed for shadcn CSS vars like --primary: 148 41% 30%
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const HEADING_FONTS: Record<string, string> = {
  "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
  "Cormorant Garamond": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap",
  "Merriweather": "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  "Libre Baskerville": "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap",
  "Lora": "https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap",
};

const BODY_FONTS: Record<string, string> = {
  "Inter": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  "Lato": "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
  "Nunito": "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600&display=swap",
  "Poppins": "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap",
  "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
};

export default async function SiteConfigStyle() {
  const cfg = await getSiteConfig();

  const primaryHsl = hexToHsl(cfg.colorPrimary);
  const darkHsl = hexToHsl(cfg.colorDark);
  const accentHsl = hexToHsl(cfg.colorAccent);
  const bgHsl = hexToHsl(cfg.colorBg);

  const headingFontFamily = `"${cfg.fontHeading}", serif`;
  const bodyFontFamily = `"${cfg.fontBody}", sans-serif`;

  const needsHeadingFont = cfg.fontHeading !== "Playfair Display";
  const needsBodyFont = cfg.fontBody !== "Inter";

  const css = `
:root {
  --brand-primary: ${cfg.colorPrimary};
  --brand-dark: ${cfg.colorDark};
  --brand-accent: ${cfg.colorAccent};
  --brand-bg: ${cfg.colorBg};
  --primary: ${primaryHsl};
  --ring: ${primaryHsl};
  --secondary: ${accentHsl};
  --accent: ${accentHsl};
  --background: ${bgHsl};
}
/* Color overrides for puratva utility classes */
.bg-puratva-green { background-color: ${cfg.colorPrimary} !important; }
.bg-puratva-green-dark { background-color: ${cfg.colorDark} !important; }
.bg-puratva-green-light { background-color: ${cfg.colorPrimary}cc !important; }
.text-puratva-green { color: ${cfg.colorPrimary} !important; }
.text-puratva-green-dark { color: ${cfg.colorDark} !important; }
.border-puratva-green { border-color: ${cfg.colorPrimary} !important; }
.border-puratva-green-dark { border-color: ${cfg.colorDark} !important; }
.ring-puratva-green { --tw-ring-color: ${cfg.colorPrimary} !important; }
.focus\\:ring-puratva-green:focus { --tw-ring-color: ${cfg.colorPrimary} !important; }
.hover\\:bg-puratva-green-dark:hover { background-color: ${cfg.colorDark} !important; }
.hover\\:text-puratva-green:hover { color: ${cfg.colorPrimary} !important; }
.bg-puratva-gold { background-color: ${cfg.colorAccent} !important; }
.text-puratva-gold { color: ${cfg.colorAccent} !important; }
.bg-puratva-cream { background-color: ${cfg.colorBg} !important; }
.text-puratva-cream { color: ${cfg.colorBg} !important; }
/* Font overrides */
h1, h2, h3, h4, h5, h6, .font-display { font-family: ${headingFontFamily} !important; }
body, .font-sans { font-family: ${bodyFontFamily} !important; }
  `.trim();

  return (
    <>
      {needsHeadingFont && HEADING_FONTS[cfg.fontHeading] && (
        <link rel="stylesheet" href={HEADING_FONTS[cfg.fontHeading]} />
      )}
      {needsBodyFont && BODY_FONTS[cfg.fontBody] && (
        <link rel="stylesheet" href={BODY_FONTS[cfg.fontBody]} />
      )}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
