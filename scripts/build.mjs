import { mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'src');
const dist = join(root, 'dist');

const pages = [
  {
    file: 'index.html',
    out: 'index.html',
    active: 'home',
    title: 'Ives & Ivory Events | Destination Weddings & Celebrations',
    description:
      'Boutique event planning for destination weddings, private celebrations, and corporate gatherings. Based in NYC, available worldwide.',
  },
  {
    file: 'about.html',
    out: 'about/index.html',
    active: 'about',
    title: 'About | Ives & Ivory Events',
    description:
      'Meet Mackenzie Ives D\'Amato, founder of Ives & Ivory Events — thoughtful planning, curated experiences, meaningful celebrations.',
  },
  {
    file: 'services.html',
    out: 'services/index.html',
    active: 'services',
    title: 'Services | Ives & Ivory Events',
    description:
      'Wedding day and wedding weekend planning, corporate events, and milestone celebrations tailored to your vision.',
  },
  {
    file: 'gallery.html',
    out: 'gallery/index.html',
    active: 'gallery',
    title: 'Gallery | Ives & Ivory Events',
    description: 'A look inside celebrations planned by Ives & Ivory Events.',
  },
  {
    file: 'gallery-cliffside.html',
    out: 'gallery/night-before-cliffside/index.html',
    active: 'gallery',
    title: 'Night Before Cliffside Soirée | Gallery | Ives & Ivory Events',
    description: 'Night Before Cliffside Soirée in Cascais, Portugal — a celebration by Ives & Ivory Events.',
  },
  {
    file: 'contact.html',
    out: 'contact/index.html',
    active: 'contact',
    title: 'Contact | Ives & Ivory Events',
    description: 'Inquire about planning your wedding, milestone, or corporate celebration with Ives & Ivory Events.',
  },
  {
    file: 'testimonials.html',
    out: 'testimonials/index.html',
    active: 'home',
    title: 'Testimonials | Ives & Ivory Events',
    description: 'Kind words from couples and clients who planned with Ives & Ivory Events.',
  },
];

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

function renderHead({ title, description }) {
  return readFileSync(join(src, 'partials/head.html'), 'utf8')
    .replaceAll('{{title}}', title)
    .replaceAll('{{description}}', description);
}

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const footer = readFileSync(join(src, 'partials/footer.html'), 'utf8');
const scripts = readFileSync(join(src, 'partials/scripts.html'), 'utf8');

for (const page of pages) {
  const body = readFileSync(join(src, 'pages', page.file), 'utf8');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${renderHead(page).trimEnd()}
</head>
<body>
<div style="min-height:100vh">
${renderHeader(page.active).trimEnd()}

${body.trim()}

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
console.log('copied styles.css and assets/');
console.log('Build complete → dist/');
