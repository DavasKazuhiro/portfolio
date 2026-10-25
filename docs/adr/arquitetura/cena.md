# Arquitetura — cena (Phaser)

Mantido pelo agente `scene-engineer`.

## Estrutura
```
src/game/
  config.ts          # cria o Phaser.Game (pixelArt, Scale.RESIZE, lista de cenas)
  PhaserGame.tsx     # componente React que monta o jogo uma única vez
  EventBus.ts        # contrato tipado Phaser ⇄ React (GameEvents)
  iso.ts             # projeção isométrica 2:1 (TILE_W 32, TILE_H 16)
  objects/registry.ts# ids dos interagíveis
  scenes/            # Boot, Room (M0); Preload, Title (M1/M4)
  systems/           # (M1+) câmera/foco, interação, dia/noite, pet
public/maps/room.tmj # (M1) mapa isométrico do Tiled
```

## Estado atual (M0)
- `Boot` inicia direto `Room`.
- `Room` desenha um chão 8×8 com `Graphics` e um retângulo "computador" clicável que emite `object-hover` e `object-open`. É placeholder e será substituído pelo mapa do Tiled no M1.
- Zoom fixo 3×, câmera centralizada no chão.

## Decisões
- Phaser 4 + `pixelArt: true` → [ADR 0001](../adr/0001-motor-phaser-react.md).
- Isométrico 2:1 via Tiled → [ADR 0002](../adr/0002-isometrico-tiled.md).
- Sem `<StrictMode>` no React: a montagem dupla em dev recriava o `Phaser.Game` e gerava erros de `AudioContext` fechado.

## Planejado para o M1
- `Preload` com barra de progresso; carregar `room.tmj` + tilesets.
- Ler o object layer `interactables` e criar zonas clicáveis a partir de `id` (validado por `isInteractableId`).
- Sistema de foco: tween de câmera (`pan` + `zoomTo`) até o objeto; ouvir `panel-closed` para voltar.
