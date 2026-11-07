# ADR 0006 — Visão de perto renderizada no DOM

- **Status:** aceito (2026-11-01)

## Contexto
Depois do zoom da câmera, cada objeto mostra uma ilustração frontal em pixel art ("visão de perto", ver [game design](../design/game-design.md)) com o painel React dentro de uma área de conteúdo (no computador, a tela do monitor). Dava para desenhar essa ilustração no canvas do Phaser (uma cena ou camada a mais) ou no DOM, junto do painel.

## Decisão
- A ilustração é uma imagem pré-renderizada (`tools/art`, specs em [docs/arte/specs.md](../arte/specs.md) §3) mostrada pelo React como `<img>` em **escala inteira**, com `image-rendering: pixelated`.
- O painel (`ComputerPanel` etc.) é posicionado de forma absoluta sobre o retângulo de conteúdo definido no JSON/spec da ilustração, na mesma escala.
- O Phaser continua dono do quarto e do zoom; o fluxo de eventos não muda: zoom → `object-open` → React mostra a visão de perto → fechar → `panel-closed` → zoom-out.
- Telas estreitas usam os modos da spec (cena inteira, recorte do monitor ou moldura 9-slice).

## Consequências
- Painel e ilustração ficam no mesmo sistema de layout: foco, leitor de tela, rolagem e i18n continuam no DOM, sem sincronizar coordenadas entre canvas e HTML.
- A ilustração não reage à luz do canvas; dia/noite vêm como variantes pré-renderizadas da imagem.
- Cada objeto do M3 que tiver visão de perto precisa de uma ilustração + retângulo de conteúdo.
