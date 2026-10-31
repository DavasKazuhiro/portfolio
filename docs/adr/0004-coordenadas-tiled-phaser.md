# ADR 0004 — Convenções de coordenadas entre Tiled e Phaser no quarto isométrico

- **Status:** aceito (2026-10-31, M1)

## Contexto
O Tiled e o `TilemapLayer` do Phaser 4 não posicionam tiles isométricos da mesma forma:
- o Tiled alinha tiles mais altos que o grid (ex.: 32×48 num mapa 32×16) **pelo pé**; o Phaser desenha cada tile a partir do canto superior esquerdo `(pixelX, pixelY)`, sem compensar a altura;
- o `tileoffset` do tileset tem sinais opostos nos dois (o Phaser subtrai), então não serve para corrigir;
- objetos de um object layer isométrico ficam num espaço "ortogonal" em que 1 tile = `tileheight` unidades nos dois eixos, e o Phaser não converte.

## Decisão
- **Origem do mundo** = vértice de cima do tile (0,0). `isoToScreen(col, row)` em `src/game/iso.ts` aceita coordenadas fracionárias e é a única projeção usada no código.
- **Camadas de tiles** são criadas em `x = -TILE_W/2` e `y = -(alturaDoTile - 16)` (`systems/RoomMap.ts`). Por isso cada camada usa um tileset de uma única altura; hoje todos os tiles têm 32×48 (chão nas 16 linhas de baixo, paredes de 32 px acima).
- **Interagíveis** são retângulos no object layer `interactables`, com a propriedade `id` (fallback: nome do objeto). O retângulo é a **pegada** do objeto no chão; `tiledObjectToTileRect` converte para coordenadas de tile.
- **Sprite do objeto** é posicionado a partir do vértice de cima da pegada e ordenado por `depth = 100 + y` do vértice da frente da pegada.
- **Culling desligado** nas camadas (`setSkipCull`): o quarto tem 64 tiles e tiles altos sumiam na borda com zoom.

## Consequências
- O mapa abre e se vê corretamente no Tiled, e aparece igual no jogo.
- Tilesets novos de alturas diferentes exigem camadas separadas (ou estender `buildRoomMap`).
- Mudar o tamanho do tile ou a projeção exige revisar `iso.ts` e `RoomMap.ts` juntos.
