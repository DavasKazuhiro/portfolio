// Paleta oficial da arte do quarto (ADR 0005): 48 cores, aprovada pelo Davi em 2026-11-01.
// Fonte da verdade: docs/arte/biblia-de-arte.md (e docs/arte/paleta.gpl). O art-director mantém os três em sincronia.

/** Tokens da bíblia → hex. Sprite só usa estas cores. */
export const P = {
  outline: '#2a1b2a',
  'graphite-0': '#1f1c28', 'graphite-1': '#2f2c3a', 'graphite-2': '#4a4659', 'graphite-3': '#5d5875',
  'wood-0': '#5a2e22', 'wood-1': '#7a472b', 'wood-2': '#97502c', 'wood-3': '#ab693a', 'wood-4': '#b8733e',
  'wood-5': '#c87138', 'wood-lit': '#d39258', 'wood-6': '#e8944a', 'wood-7': '#ffc27a',
  'gold-0': '#c09a45', 'gold-1': '#e9c46a', 'gold-2': '#f4b860', 'gold-3': '#f6dc8f',
  'mauve-0': '#4a3240', 'mauve-1': '#6d5560', 'mauve-2': '#836a75',
  'wall-0': '#93a9ae', 'wall-1': '#9fb7bd', 'wall-2': '#a9c1c6', 'wall-3': '#bfcfd2', 'wall-4': '#c9d8da', 'wall-5': '#dce7e8',
  'cream-0': '#a79f94', 'cream-1': '#c8b89c', 'cream-2': '#e7e1d8', 'cream-3': '#f6f2ec',
  'sky-0': '#5ec4d6', 'sky-1': '#8fd3e8', 'sky-2': '#c6f6fb',
  'teal-0': '#132f3d', 'teal-1': '#1f4a5c', 'teal-2': '#2b5f74', 'teal-3': '#5f97a3',
  'red-0': '#83303a', 'red-1': '#b04049', 'red-2': '#c84f57', 'red-3': '#d9666a', pink: '#e3789a',
  'blue-0': '#3a5f8c', 'blue-1': '#4f7fb8',
  'leaf-0': '#3e7e3a', 'leaf-1': '#5fae4e', 'leaf-2': '#9ad86f',
}

/** Fundo da UI (`--bg`): só nas prévias; nos assets o fundo é transparente. */
export const UI_BG = '#1b1526'

/** Cores de tint (blend MULTIPLY) do entardecer e da noite. Os tons derivados não contam na paleta. */
export const TINT = { dusk: '#f2c3a0', night: '#6a6aa8' }

// Chaves antigas do gerador aprovado (objeto `K`) → tokens, conforme a tabela "Correspondência com o K"
// da bíblia. Só a cena de referência (scenes/reference-desk.mjs) usa `K`; cenas novas usam `P` direto.
const LEGACY = {
  outline: 'outline',
  woodTop: 'wood-6', woodTop2: 'wood-6', woodGrain: 'wood-5', woodHi: 'wood-7', woodFront: 'wood-5', woodFront2: 'wood-4',
  woodSide: 'wood-2', woodSide2: 'wood-1', woodDark: 'wood-0', woodSeam: 'wood-3', brass: 'gold-1', brassDark: 'gold-0',
  floorA: 'wood-4', floorB: 'wood-3', floorGrain: 'wood-3', floorSeam: 'wood-1', floorAO: 'wood-2', floorShadow: 'wood-1',
  floorLitA: 'wood-lit', floorLitB: 'wood-lit',
  wallBack: 'wall-2', wallBack2: 'wall-1', wallLeft: 'wall-4', wallLeft2: 'wall-3', wallLeftHi: 'wall-5', wallAO: 'wall-0',
  wallBase: 'mauve-1', wallBaseHi: 'mauve-2', wallBaseSide: 'mauve-0', wallCap: 'mauve-0', wallCapHi: 'mauve-1',
  winFrame: 'cream-2', winFrameSide: 'cream-1', winFrameDark: 'cream-0', glass: 'sky-1', glass2: 'sky-1', glassHi: 'sky-2',
  sky: 'sky-0', cloud: 'cream-3', sill: 'cream-2', curtain: 'gold-1', curtainDark: 'gold-0', curtainHi: 'gold-3',
  monBody: 'graphite-1', monBezel: 'graphite-1', monSide: 'graphite-0', monTop: 'graphite-2',
  screen: 'teal-0', screenHi: 'teal-1', bar: 'teal-2',
  glow: 'sky-0', glowHi: 'sky-2', accent: 'gold-2', pink: 'pink', green: 'leaf-2', dim: 'teal-3',
  keyTop: 'cream-2', keyKey: 'cream-3', keyGap: 'cream-0', keySide: 'cream-1', keyDark: 'cream-0',
  mugTop: 'cream-3', mugLit: 'cream-3', mugSide: 'cream-2', mugDark: 'cream-0', coffee: 'wood-0', coffeeHi: 'wood-1',
  towerFront: 'graphite-1', towerSide: 'graphite-0', towerTop: 'graphite-2', towerHi: 'graphite-3',
  led: 'sky-0', ledHi: 'sky-2', vent: 'graphite-0',
  leaf: 'leaf-1', leafHi: 'leaf-2', leafDark: 'leaf-0', leafDeep: 'leaf-0',
  // O vaso só existe na cena de referência. A terracota saiu da paleta; ele usa a rampa de madeira.
  pot: 'wood-5', potLit: 'wood-6', potSide: 'wood-2', soil: 'wood-0',
  chair: 'red-1', chairLit: 'red-2', chairSide: 'red-0', chairTop: 'red-3', chairSeam: 'red-0',
  chairBase: 'graphite-1', chairBaseSide: 'graphite-0', chairBaseHi: 'graphite-2',
  book1: 'blue-1', book1s: 'blue-0', book2: 'pink', book2s: 'red-1', book3: 'gold-1', book3s: 'gold-0', page: 'cream-3',
  lampBody: 'teal-2', lampSide: 'teal-1', lampHi: 'teal-3', bulb: 'gold-3',
}

/** Paleta no formato antigo (nomes por material), já remapeada para os 48 tokens. */
export const K = { ...Object.fromEntries(Object.entries(LEGACY).map(([k, t]) => [k, P[t]])), bg: UI_BG }
