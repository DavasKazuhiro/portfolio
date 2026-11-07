// Stand-in da ilustração do computador enquanto `public/assets/ui/closeup-computer.*` não existe.
// Segue o mesmo contrato do JSON (specs.md §3): 320×180, mesmos retângulos e tags. Desenhado em
// SVG com retângulos da paleta (bíblia de arte), só as massas principais.
import { parseCloseupSheet, type CloseupSheet } from './sheet'

const W = 320, H = 180
const C = {
  outline: '#0f0b17',
  'graphite-0': '#1f1c28', 'graphite-1': '#2f2c3a', 'graphite-2': '#4a4659',
  'teal-0': '#132f3d', 'teal-1': '#1f4a5c', 'teal-2': '#2b5f74', 'teal-3': '#5f97a3',
  'wall-1': '#4b3a5e', 'wall-2': '#5a4870', 'wall-3': '#6e5a86', 'wall-4': '#7f6a98',
  'wood-2': '#6b4630', 'wood-5': '#b07a4c', 'wood-6': '#c99160', 'wood-7': '#ddb07a',
  'cream-0': '#a99a86', 'cream-2': '#e0d3bb', 'cream-3': '#f3e9d2',
  'gold-1': '#d9a441', 'gold-3': '#ffe08a', 'sky-0': '#7ec8e3',
} as const
type Token = keyof typeof C

type Screen = 'off' | 'boot0' | 'boot1' | 'on'
const r = (x: number, y: number, w: number, h: number, c: Token) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C[c]}"/>`

function frame(ox: number, screen: Screen, night: boolean): string {
  const parts = [
    r(0, 0, 30, 158, 'wall-4'),
    r(30, 0, 290, 158, 'wall-2'),
    r(214, 0, 96, 158, 'wall-4'),
    r(310, 0, 10, 150, 'gold-1'),
    r(37, 6, 3, 148, 'wall-1'),
    r(40, 2, 240, 150, 'outline'),
    r(41, 3, 238, 148, 'graphite-1'),
    r(41, 3, 238, 1, 'graphite-2'),
    r(278, 3, 1, 148, 'graphite-0'),
    r(266, 143, 2, 1, 'sky-0'),
    r(150, 152, 20, 8, 'graphite-1'),
    r(132, 160, 56, 4, 'graphite-2'),
    r(0, 158, 320, 14, 'wood-6'),
    r(0, 158, 320, 1, 'wood-2'),
    r(0, 172, 320, 8, 'wood-5'),
    r(0, 172, 320, 1, 'wood-7'),
    r(108, 163, 104, 9, 'cream-2'),
    r(222, 164, 10, 7, 'cream-3'),
    r(64, 146, 20, 25, 'cream-2'),
    r(66, 146, 16, 3, 'graphite-0'),
    r(30, 161, 28, 9, 'graphite-1'),
    r(2, 96, 26, 10, 'teal-2'),
    r(14, 106, 2, 54, 'teal-1'),
    r(6, 106, 18, 2, night ? 'gold-3' : 'cream-2'),
  ]
  // Tela (48, 11, 224, 126).
  if (screen === 'off') parts.push(r(48, 11, 224, 126, 'graphite-0'), r(60, 20, 40, 8, 'teal-1'))
  else if (screen === 'boot0') parts.push(r(48, 11, 224, 126, 'teal-1'))
  else parts.push(r(48, 11, 224, 126, 'teal-0'), r(48, 11, 224, 1, 'teal-1'), r(48, 11, 1, 126, 'teal-1'))
  const body = parts.join('')
  // Noite: escurece tudo menos a tela e a lâmpada (aproximação do tint-night).
  const dim = night
    ? `<path fill="#000" fill-opacity="0.45" fill-rule="evenodd" d="M0 0h${W}v${H}H0z M48 11h224v126H48z"/>`
    : ''
  return `<g transform="translate(${ox} 0)">${body}${dim}</g>`
}

const FRAMES: { screen: Screen; night: boolean; duration: number }[] = [
  { screen: 'off', night: false, duration: 100 },
  { screen: 'boot0', night: false, duration: 60 },
  { screen: 'boot1', night: false, duration: 60 },
  { screen: 'on', night: false, duration: 1000 },
  { screen: 'off', night: true, duration: 100 },
  { screen: 'boot0', night: true, duration: 60 },
  { screen: 'boot1', night: true, duration: 60 },
  { screen: 'on', night: true, duration: 1000 },
]
const TAGS = [
  ['off', 0, 0], ['boot', 1, 2], ['on', 3, 3],
  ['off-night', 4, 4], ['boot-night', 5, 6], ['on-night', 7, 7],
] as const

const svgUrl = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

// Moldura 9-slice 48×48 (fatias 9/8/15/8): contorno, bisel, centro teal-0 e LED no queixo.
const FRAME_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" shape-rendering="crispEdges">` +
  `${r(0, 0, 48, 48, 'outline')}${r(1, 1, 46, 46, 'graphite-1')}${r(1, 1, 46, 1, 'graphite-2')}` +
  `${r(46, 1, 1, 46, 'graphite-0')}${r(8, 9, 32, 24, 'teal-0')}${r(40, 39, 2, 1, 'sky-0')}</svg>`

export function standinCloseupSheet(): CloseupSheet {
  const width = W * FRAMES.length
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${H}" viewBox="0 0 ${width} ${H}" shape-rendering="crispEdges">` +
    FRAMES.map((f, i) => frame(i * W, f.screen, f.night)).join('') +
    `</svg>`
  const json = {
    frames: FRAMES.map((f, i) => ({ frame: { x: i * W, y: 0, w: W, h: H }, sourceSize: { w: W, h: H }, duration: f.duration })),
    meta: {
      image: svgUrl(svg),
      size: { w: width, h: H },
      frameTags: TAGS.map(([name, from, to]) => ({ name, from, to })),
      quartoPixel: {
        contentRect: [48, 11, 224, 126],
        crops: { full: [0, 0, 320, 180], monitor: [36, 0, 248, 180] },
        nineSlice: { image: svgUrl(FRAME_SVG), size: { w: 48, h: 48 }, slice: [9, 8, 15, 8], scale: 2 },
      },
    },
  }
  return parseCloseupSheet(json, 'standin.json', svgUrl(FRAME_SVG))
}
