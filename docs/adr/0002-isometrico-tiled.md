# ADR 0002 — Quarto isométrico 2:1 montado no Tiled

- **Status:** aceito (2026-10-25)

## Contexto
O quarto deve parecer "3D" em pixel art e aceitar novos objetos sem mexer no código do motor.

## Decisão
- Projeção isométrica 2:1 com tile 32×16 (padrão de packs isométricos e do Tiled).
- Layout do quarto em um mapa isométrico do **Tiled** (`public/maps/room.tmj`): camadas de chão, paredes e móveis + object layer `interactables` com a propriedade `id`.
- O código lê o object layer e cria as zonas clicáveis; ids validados contra `src/game/objects/registry.ts`.
- 3D real (Three.js) descartado: mais custo de modelagem/iluminação e pior nitidez do pixel.

## Consequências
- Mover/adicionar móveis = editar o mapa no Tiled.
- `TilemapGPULayer` do Phaser não suporta isométrico; usamos `TilemapLayer` (suficiente para um quarto pequeno).
- Depth sorting de móveis altos precisa de atenção (ordenar por `y` da base).
