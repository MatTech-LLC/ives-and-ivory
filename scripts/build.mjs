import { mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'src');
const dist = join(root, 'dist');

const SITE_ORIGIN = 'https://ives-ivory-events.mattech.fyi';
const OG_IMAGE = '/assets/og.png';

const pages = [
  {
    file: 'index.html',
    out: 'index.html',
    path: '/',
    active: 'home',
    title: 'Ives & Ivory Events | Destination Weddings & Celebrations',
    description:
      'Destination weddings, private celebrations, corporate events, and every meaningful moment in between, planned with intention and curated with care. Based in NYC, available worldwide.',
  },
  {
    file: 'about.html',
    out: 'about/index.html',
    path: '/about',
    active: 'about',
    title: 'About | Ives & Ivory Events',
    description:
      'Thoughtful planning. Curated experiences. Meaningful celebrations. Meet Mackenzie Ives D\'Amato, founder of Ives & Ivory Events.',
  },
  {
    file: 'services.html',
    out: 'services/index.html',
    path: '/services',
    active: 'services',
    title: 'Services | Ives & Ivory Events',
    description:
      'Thoughtfully tailored. Entirely bespoke. Wedding day and wedding weekend planning, corporate events, and milestone celebrations as unique as your celebration.',
  },
  {
    file: 'gallery.html',
    out: 'gallery/index.html',
    path: '/gallery',
    active: 'gallery',
    title: 'Gallery | Ives & Ivory Events',
    description: 'A look inside celebrations planned by Ives & Ivory Events.',
  },
  {
    file: 'gallery-cliffside.html',
    out: 'gallery/night-before-cliffside/index.html',
    path: '/gallery/night-before-cliffside',
    active: 'gallery',
    title: 'Night Before Cliffside Soirée | Gallery | Ives & Ivory Events',
    description: 'Night Before Cliffside Soirée in Cascais, Portugal · O\'Forte — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'gallery-welcome-celebration.html',
    out: 'gallery/welcome-celebration/index.html',
    path: '/gallery/welcome-celebration',
    active: 'gallery',
    title: 'Welcome Celebration in the Square | Gallery | Ives & Ivory Events',
    description: 'Welcome Celebration in the Square in Cascais, Portugal · Aqafarina Restaurant — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'gallery-rehearsal-dinner.html',
    out: 'gallery/rehearsal-dinner/index.html',
    path: '/gallery/rehearsal-dinner',
    active: 'gallery',
    title: 'A Rooftop Rehearsal Dinner | Gallery | Ives & Ivory Events',
    description: 'A Rooftop Rehearsal Dinner in Cascais, Portugal · Copo Alto Rooftop — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'gallery-art-of-getting-ready.html',
    out: 'gallery/art-of-getting-ready/index.html',
    path: '/gallery/art-of-getting-ready',
    active: 'gallery',
    title: 'The Art of Getting Ready | Gallery | Ives & Ivory Events',
    description: 'The Art of Getting Ready in Cascais, Portugal · Albatroz Hotel — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'gallery-engagement-gathering.html',
    out: 'gallery/engagement-gathering/index.html',
    path: '/gallery/engagement-gathering',
    active: 'gallery',
    title: 'Intimate Engagement Gathering | Gallery | Ives & Ivory Events',
    description: 'Intimate Engagement Gathering on Seabrook Island, Charleston, South Carolina — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'gallery-ceremony.html',
    out: 'gallery/ceremony/index.html',
    path: '/gallery/ceremony',
    active: 'gallery',
    title: 'A Palace Ceremony | Gallery | Ives & Ivory Events',
    description: 'A Palace Ceremony at Palácio de Queluz, Loures, Portugal — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'gallery-cocktail-hour.html',
    out: 'gallery/cocktail-hour/index.html',
    path: '/gallery/cocktail-hour',
    active: 'gallery',
    title: 'Cocktail Hour in the Gardens | Gallery | Ives & Ivory Events',
    description: 'Cocktail Hour in the Gardens at Palácio de Queluz, Loures, Portugal — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'gallery-reception.html',
    out: 'gallery/reception/index.html',
    path: '/gallery/reception',
    active: 'gallery',
    title: 'A Royal Reception | Gallery | Ives & Ivory Events',
    description: 'A Royal Reception at Palácio de Queluz, Loures, Portugal — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'contact.html',
    out: 'contact/index.html',
    path: '/contact',
    active: 'contact',
    title: 'Contact | Ives & Ivory Events',
    description:
      'Let\'s create something meaningful. Tell me about your celebration and I\'ll be in touch within 1–2 business days.',
  },
  {
    file: 'testimonials.html',
    out: 'testimonials/index.html',
    path: '/testimonials',
    active: 'home',
    title: 'Testimonials | Ives & Ivory Events',
    description: 'Kind words from the couples and clients of The Ives & Ivory Experience.',
  },
];

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function activeClass(pageActive, link) {
  return pageActive === link ? ' is-active' : '';
}

function renderHeader(active) {
  let header = readFileSync(join(src, 'partials/header.html'), 'utf8');
  return header
    .replaceAll('{{aboutActive}}', activeClass(active, 'about'))
    .replaceAll('{{galleryActive}}', activeClass(active, 'gallery'))
    .replaceAll('{{servicesActive}}', activeClass(active, 'services'))
    .replaceAll('{{contactActive}}', activeClass(active, 'contact'));
}

function renderHead(page) {
  const canonical = `${SITE_ORIGIN}${page.path === '/' ? '/' : page.path}`;
  const ogImage = `${SITE_ORIGIN}${OG_IMAGE}`;
  return readFileSync(join(src, 'partials/head.html'), 'utf8')
    .replaceAll('{{title}}', escapeAttr(page.title))
    .replaceAll('{{description}}', escapeAttr(page.description))
    .replaceAll('{{canonical}}', escapeAttr(canonical))
    .replaceAll('{{ogImage}}', escapeAttr(ogImage));
}

function writeRobots() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
  writeFileSync(join(dist, 'robots.txt'), body);
  console.log('wrote robots.txt');
}

function writeSitemap() {
  const urls = pages
    .map((page) => {
      const loc = `${SITE_ORIGIN}${page.path === '/' ? '/' : page.path}`;
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  writeFileSync(join(dist, 'sitemap.xml'), body);
  console.log('wrote sitemap.xml');
}

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const footer = readFileSync(join(src, 'partials/footer.html'), 'utf8');
const scripts = readFileSync(join(src, 'partials/scripts.html'), 'utf8');
const inquiryForm = readFileSync(join(src, 'partials/inquiry-form.html'), 'utf8');

for (const page of pages) {
  const body = readFileSync(join(src, 'pages', page.file), 'utf8').replaceAll(
    '{{inquiryForm}}',
    inquiryForm.trimEnd(),
  );
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${renderHead(page).trimEnd()}
</head>
<body>
<div style="min-height:100vh">
${renderHeader(page.active).trimEnd()}

<main>
${body.trim()}
</main>

${footer.trimEnd()}
</div>
${scripts.trimEnd()}
</body>
</html>
`;
  const outPath = join(dist, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log('wrote', page.out);
}

cpSync(join(src, 'styles.css'), join(dist, 'styles.css'));
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
writeRobots();
writeSitemap();
console.log('copied styles.css and assets/');
console.log('Build complete → dist/');
