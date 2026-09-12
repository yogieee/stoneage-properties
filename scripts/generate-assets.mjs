import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve(process.cwd(), 'public');
const dirs = [
  'images/hero',
  'images/services',
  'images/projects',
  'images/journal',
  'images/misc'
];

for (const d of dirs) {
  fs.mkdirSync(path.join(publicDir, d), { recursive: true });
}

function createArchitecturalSvg({ width = 1600, height = 1000, title, palette = ['#1a1918', '#2d2b28', '#4a4640', '#9c8e7e', '#d4cebe', '#f2efe9'], type = 'exterior' }) {
  const [cDark, cMidDark, cMid, cAccent, cLight, cPaper] = palette;

  if (type === 'interior') {
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wall-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${cMidDark}" />
          <stop offset="60%" stop-color="${cMid}" />
          <stop offset="100%" stop-color="${cLight}" />
        </linearGradient>
        <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${cMidDark}" />
          <stop offset="100%" stop-color="${cDark}" />
        </linearGradient>
        <linearGradient id="sun-glow" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff8ed" stop-opacity="0.8" />
          <stop offset="40%" stop-color="${cPaper}" stop-opacity="0.2" />
          <stop offset="100%" stop-color="${cMidDark}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <!-- Background wall -->
      <rect width="${width}" height="${height}" fill="${cDark}" />
      <!-- Left wall in perspective -->
      <polygon points="0,0 450,150 450,750 0,${height}" fill="url(#wall-grad)" />
      <!-- Ceiling -->
      <polygon points="0,0 ${width},0 ${width - 300},150 450,150" fill="${cMidDark}" />
      <!-- Floor with timber planks -->
      <polygon points="0,${height} 450,750 ${width - 300},750 ${width},${height}" fill="url(#floor-grad)" />
      <!-- Floor plank lines -->
      <g stroke="${cDark}" stroke-width="2" opacity="0.6">
        <line x1="100" y1="${height}" x2="480" y2="750" />
        <line x1="300" y1="${height}" x2="520" y2="750" />
        <line x1="600" y1="${height}" x2="600" y2="750" />
        <line x1="900" y1="${height}" x2="720" y2="750" />
        <line x1="1200" y1="${height}" x2="900" y2="750" />
        <line x1="1450" y1="${height}" x2="1150" y2="750" />
      </g>
      <!-- Floor-to-ceiling glass aperture -->
      <rect x="450" y="150" width="${width - 750}" height="600" fill="#121516" />
      <!-- Outside foliage silhouette -->
      <path d="M 450 650 Q 600 500 750 600 T 1100 550 L 1300 750 L 450 750 Z" fill="#0d110f" opacity="0.9" />
      <!-- Window Mullions -->
      <line x1="720" y1="150" x2="720" y2="750" stroke="${cDark}" stroke-width="8" />
      <line x1="1020" y1="150" x2="1020" y2="750" stroke="${cDark}" stroke-width="8" />
      <line x1="450" y1="420" x2="1300" y2="420" stroke="${cDark}" stroke-width="6" />
      <!-- Sunbeam light wash -->
      <polygon points="720,150 1300,150 ${width},${height} 350,${height}" fill="url(#sun-glow)" opacity="0.6" />
      <!-- Minimalist architectural bench/counter -->
      <polygon points="500,600 850,600 950,680 550,680" fill="${cLight}" />
      <polygon points="500,600 550,680 550,780 500,700" fill="${cAccent}" />
      <polygon points="550,680 950,680 950,780 550,780" fill="${cMidDark}" />
      <!-- Title watermark -->
      <text x="60" y="${height - 60}" fill="${cPaper}" opacity="0.3" font-family="monospace" font-size="14" letter-spacing="4">${title.toUpperCase()}</text>
    </svg>`;
  }

  // Default: Exterior contemporary architecture
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${cMidDark}" />
        <stop offset="70%" stop-color="${cMid}" />
        <stop offset="100%" stop-color="${cLight}" />
      </linearGradient>
      <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${cDark}" />
        <stop offset="100%" stop-color="#0a0a09" />
      </linearGradient>
      <linearGradient id="glass-reflection" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.4" />
        <stop offset="50%" stop-color="${cAccent}" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#000" stop-opacity="0.6" />
      </linearGradient>
    </defs>
    <!-- Sky -->
    <rect width="${width}" height="${height * 0.7}" fill="url(#sky-grad)" />
    <!-- Ground / Reflective Terrace -->
    <rect y="${height * 0.68}" width="${width}" height="${height * 0.32}" fill="url(#ground-grad)" />
    <!-- Distant tree line -->
    <path d="M 0 ${height * 0.68} Q 200 ${height * 0.65} 400 ${height * 0.68} T 800 ${height * 0.66} T 1200 ${height * 0.68} L ${width} ${height * 0.68} L ${width} ${height * 0.7} L 0 ${height * 0.7} Z" fill="${cDark}" opacity="0.8" />
    
    <!-- Main architectural cantilevered volume -->
    <polygon points="250,280 1150,220 1250,580 300,640" fill="${cMidDark}" />
    <!-- Timber slatted upper facade -->
    <polygon points="250,280 850,240 850,480 280,510" fill="${cAccent}" opacity="0.9" />
    <!-- Slat lines -->
    <g stroke="${cDark}" stroke-width="2" opacity="0.4">
      ${Array.from({ length: 25 }, (_, i) => `<line x1="${260 + i * 23}" y1="275" x2="${285 + i * 23}" y2="505" />`).join('')}
    </g>
    <!-- Floor-to-ceiling recessed glass lower pavilion -->
    <polygon points="300,510 1200,450 1220,740 320,770" fill="#14181a" />
    <polygon points="300,510 1200,450 1220,740 320,770" fill="url(#glass-reflection)" />
    <!-- Steel framing mullions -->
    <g stroke="#222" stroke-width="5">
      <line x1="500" y1="495" x2="510" y2="760" />
      <line x1="720" y1="480" x2="730" y2="755" />
      <line x1="940" y1="465" x2="950" y2="750" />
    </g>
    <!-- Warm interior glow through glazing -->
    <rect x="520" y="520" width="180" height="200" fill="#ffd8a8" opacity="0.35" filter="blur(20px)" />
    <rect x="740" y="510" width="180" height="210" fill="#ffe3bd" opacity="0.25" filter="blur(25px)" />
    <!-- Concrete base plinth -->
    <polygon points="220,760 1280,730 1340,810 180,840" fill="${cMid}" />
    <!-- Architectural pool / reflecting water -->
    <polygon points="200,840 1300,810 1480,950 40,980" fill="${cDark}" />
    <line x1="200" y1="840" x2="1300" y2="810" stroke="${cPaper}" stroke-width="1.5" opacity="0.4" />
    <!-- Geometric Title Stamp -->
    <text x="60" y="${height - 60}" fill="${cPaper}" opacity="0.3" font-family="monospace" font-size="14" letter-spacing="4">${title.toUpperCase()}</text>
  </svg>`;
}

const assets = [
  // Hero Carousel Slides
  { path: 'images/hero/hero-1.svg', title: 'Stoneage Villa — Contemporary Residential', type: 'exterior', palette: ['#121211', '#262523', '#3d3a36', '#8a7e72', '#c7c2b5', '#faf9f6'] },
  { path: 'images/hero/hero-2.svg', title: 'Solihull Residence — Timber & Steel Pavilion', type: 'exterior', palette: ['#151413', '#2b2926', '#45413c', '#998d7f', '#d1ccc0', '#faf8f5'] },
  { path: 'images/hero/hero-3.svg', title: 'Knowle Remodelling — Double-Height Concrete & Oak', type: 'interior', palette: ['#141312', '#292724', '#423e38', '#94887a', '#cdc7ba', '#faf9f6'] },
  { path: 'images/hero/hero-4.svg', title: 'Nottingham Roof Extension — Zinc & Glazing', type: 'exterior', palette: ['#101010', '#222220', '#3b3a37', '#807d76', '#bcb9b1', '#f5f4ef'] },

  // Services / Expertise
  { path: 'images/services/services-1.svg', title: '01 Interior Atmosphere & Renovation', type: 'interior', palette: ['#181716', '#2e2c29', '#4c4842', '#a19586', '#d6d1c4', '#faf8f5'] },
  { path: 'images/services/services-2.svg', title: '02 Contemporary New Builds', type: 'exterior', palette: ['#141312', '#282725', '#45423d', '#968b7d', '#cfc9bd', '#faf9f6'] },
  { path: 'images/services/services-3.svg', title: '03 Structural Extensions & Conversions', type: 'exterior', palette: ['#161514', '#2b2927', '#48453f', '#9b9082', '#d3cec2', '#faf8f5'] },

  // Featured Projects
  { path: 'images/projects/project-1.svg', title: 'Festal House Remodelling, Knowle', type: 'exterior', palette: ['#131211', '#282624', '#46423d', '#9c9082', '#d5d0c3', '#faf9f6'] },
  { path: 'images/projects/project-2.svg', title: 'Meadow Contemporary New Build, Rugby', type: 'interior', palette: ['#151413', '#2a2825', '#48443e', '#9e9182', '#d7d1c4', '#faf8f5'] },
  { path: 'images/projects/project-3.svg', title: 'Bracken Kitchen & Garden Extension, Solihull', type: 'exterior', palette: ['#141312', '#272624', '#44413c', '#988c7f', '#d0cac0', '#faf9f6'] },
  { path: 'images/projects/project-4.svg', title: 'Grange Change of Use Conversion, Nottingham', type: 'interior', palette: ['#121110', '#252422', '#413e39', '#928679', '#cbc5b8', '#faf9f6'] },

  // Journal / Insights
  { path: 'images/journal/journal-1.svg', title: 'Designing for Long-Term Living Rather Than Trends', type: 'interior', palette: ['#161514', '#2d2b28', '#4b4741', '#9f9384', '#d7d2c6', '#faf9f6'] },
  { path: 'images/journal/journal-2.svg', title: 'The Role of Material Honesty in Residential Architecture', type: 'exterior', palette: ['#141312', '#292725', '#46433e', '#988d7f', '#d1ccc0', '#faf8f5'] },
  { path: 'images/journal/journal-3.svg', title: 'Balancing Openness, Privacy, and Everyday Comfort', type: 'interior', palette: ['#151413', '#2a2825', '#48443e', '#9c9082', '#d5d0c4', '#faf9f6'] },
  { path: 'images/journal/journal-4.svg', title: 'Creating a Stronger Connection Between Home & Landscape', type: 'exterior', palette: ['#131211', '#262523', '#43403b', '#93887b', '#ccc6b9', '#faf9f6'] },

  // Misc
  { path: 'images/misc/statement.svg', title: 'We Shape Space into Purpose — Stoneage Properties', type: 'exterior', palette: ['#0d0d0c', '#1c1b1a', '#302f2c', '#6d6860', '#a8a49c', '#f0eee9'] },
  { path: 'images/misc/footer-photo.svg', title: 'Handover & Craftsmanship — Solihull HQ', type: 'exterior', palette: ['#121211', '#242321', '#3e3c38', '#8c8276', '#c9c4b8', '#faf9f6'] },
];

for (const asset of assets) {
  const fullPath = path.join(publicDir, asset.path);
  const content = createArchitecturalSvg(asset);
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`Generated: ${asset.path}`);
}
