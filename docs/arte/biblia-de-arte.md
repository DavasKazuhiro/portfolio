# Bíblia de arte

Mantida pelo agente `art-director`. **Rascunho do M0** — paleta e pack são fechados no M2, com aprovação do Davi.

## Projeção e grid
- Isométrico 2:1. Tile de chão **32×16 px**. Paredes com 2 tiles de altura visível.
- Quarto de referência: 8×8 tiles.
- Render sempre em escala inteira (2×, 3×, 4×) com `pixelArt: true`. Nada de rotação ou escala fracionária em sprites.

## Paleta provisória (UI e placeholders)
| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#1b1526` | fundo fora do quarto |
| `--panel` | `#2b2140` | fundo de painéis |
| `--border` | `#0f0b17` | contornos |
| `--ink` | `#f3e9d2` | texto |
| `--accent` | `#f4b860` | destaque, títulos, hover |
| `--cyan` | `#5ec4d6` | telas, brilho de interagíveis |

No M2 a paleta do pack escolhido substitui/ajusta esta (preferência por uma paleta pública, ex.: Lospec, com 24–32 cores).

## Regras de desenho
- Contorno de 1 px na cor mais escura do material, não preto puro.
- Luz vinda da janela (esquerda/cima). Sombras de contato em 1 cor.
- Interagíveis têm estado **hover**: outline de 1 px em `--accent`.

## Arquivos
- `public/assets/{tiles,objects,characters,ui,fonts,audio}/`
- Nome = `id` do objeto em kebab-case (`computer.png` + `computer.json` do Aseprite).
- Fonte de trabalho (`.aseprite`) em `art-src/` (fora do build).
- Licenças em `public/assets/LICENSES.md`.

## Specs a escrever (M2)
PC, quadros, retrato, estante, caderno, celular, diploma, pet, avatar: tamanho, âncora, frames, estados.
