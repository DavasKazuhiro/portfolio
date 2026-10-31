# Arquitetura — cena (Phaser)

Mantido pelo agente `scene-engineer`.

## Estrutura
```
src/game/
  config.ts            # cria o Phaser.Game (pixelArt, Scale.RESIZE, cenas); em dev expõe window.__game
  PhaserGame.tsx       # componente React que monta o jogo uma única vez
  EventBus.ts          # contrato tipado Phaser ⇄ React (GameEvents)
  assets.ts            # chaves/caminhos dos assets e paleta usada no canvas
  iso.ts               # projeção 2:1 (isoToScreen) e conversão de objetos do Tiled (tiledObjectToTileRect)
  objects/
    registry.ts        # ids dos interagíveis
    Interactable.ts    # sprite + outline de hover + clique de um objeto
    placeholders.ts    # sprites placeholder desenhados em CanvasTexture (M1; trocados no M2)
  scenes/              # Boot → Preload → Room (Entrance, a porta do quarto, no M4)
  systems/
    RoomMap.ts         # monta as camadas do .tmj e lê o object layer `interactables`
    FocusCamera.ts     # câmera: visão do quarto, zoom de foco, resize
    cameraMath.ts      # contas puras de zoom (testáveis sem Phaser)
    outline.ts         # gera a textura do outline de 1 px a partir de qualquer textura
    motion.ts          # prefers-reduced-motion
  tools/
    gen-placeholder-tileset.mjs  # gera public/assets/tiles/placeholder-room.png (node, sem deps)
public/maps/room.tmj   # mapa isométrico do Tiled (8×8, tile 32×16)
public/assets/tiles/placeholder-room.png  # tileset placeholder (8 tiles de 32×48)
```

## Estado atual (M1)
- **Boot** só inicia o Preload.
- **Preload** desenha uma barra de progresso em blocos inteiros (Graphics, sem texto) e carrega `maps/room.tmj` + o tileset.
- **Room**:
  - monta as camadas `floor` e `walls` do .tmj e lê `interactables` (id validado com `isInteractableId`; inválidos e repetidos geram `console.warn` e são ignorados);
  - cria um `Interactable` por objeto. Hoje só o `computer` (mesa 2×1 com monitor, teclado e gabinete) está no mapa;
  - hover: outline de 1 px em `--accent` (#f4b860) + `object-hover` (id / `null`). Hit test por pixel (`pixelPerfect`);
  - clique (pointerup com até 8 px de arrasto) ou `focus-object` → zoom → `object-open`.
- **Câmera** (`FocusCamera`), estados `room` → `zooming-in` → `focused` → `zooming-out` → `room`:
  - visão do quarto: maior zoom inteiro em que o quarto (+8 px de margem) cabe na tela; mínimo 1;
  - foco: `pan` + `zoomTo` em 400 ms `Cubic.easeOut`; zoom final inteiro, ≥ zoom do quarto + 1, objeto ocupando ≤ 60% da tela, máximo 8. Ao terminar, o estado final é reaplicado exato;
  - `prefers-reduced-motion`: tudo instantâneo (lido a cada foco);
  - resize (`Scale.RESIZE`): reenquadra na hora; se estiver animando, reenquadra ao fim da animação.
- **Garantias do fluxo** (combinadas com o `ui-engineer`):
  - `object-open` sai **uma vez** por foco, ~400 ms depois do pedido (bem abaixo do fallback de 1,5 s da UI);
  - cliques são ignorados fora do estado `room` (durante zoom ou com painel aberto);
  - `panel-closed` é idempotente em qualquer estado: em `room` não faz nada; durante `zooming-in` cancela o zoom **sem** emitir `object-open`; em `focused` faz o zoom-out;
  - `focus-object` que chega durante o `zooming-out` fica na fila e roda quando a cena ficar livre (só o último vale); em `zooming-in`/`focused` é ignorado;
  - `focus-object` de um id que ainda não está no mapa abre sem zoom (passa por `focused` e emite `object-open` na hora); o `panel-closed` seguinte volta sem animação.
- **Limpeza**: listeners do EventBus e do `scale` saem no `SHUTDOWN`/`DESTROY` da cena.

## Tileset placeholder
Gerado por `node src/game/tools/gen-placeholder-tileset.mjs` (sem dependências, PNG escrito com `zlib`). Um PNG real, e não textura gerada em runtime, para o mapa poder ser aberto e editado no Tiled. Tiles (gid = índice + 1): 1 chão A, 2 chão B, 3 tapete, 4 parede esquerda, 5 parede direita, 6 canto, 7 parede esquerda com janela, 8 parede direita com quadro. Paleta provisória da bíblia de arte. Será substituído pelo pack no M2.

Os sprites dos objetos (por enquanto só o computador) são gerados em runtime (`objects/placeholders.ts`), como pilhas de caixas isométricas rasterizadas pixel a pixel.

## Decisões
- Phaser 4 + `pixelArt: true` → [ADR 0001](../0001-motor-phaser-react.md).
- Isométrico 2:1 via Tiled → [ADR 0002](../0002-isometrico-tiled.md).
- Convenções de coordenadas Tiled × Phaser (origem, tiles altos, pegada dos objetos) → [ADR 0004](../0004-coordenadas-tiled-phaser.md).
- Sem `<StrictMode>` no React: a montagem dupla em dev recriava o `Phaser.Game` e gerava erros de `AudioContext` fechado.

## Pendente / próximos marcos
- M2: trocar tileset e placeholders pela arte do pack; definir âncora dos sprites reais (provável: propriedades no objeto do Tiled).
- M3: colocar os outros 7 objetos no `interactables`.
- M5 (mobile): pan/pinça e destaque pulsante nos interagíveis. Hoje, em 375 px de largura, o quarto cabe só em zoom 1.
