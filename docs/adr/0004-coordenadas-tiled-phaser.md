# ADR 0004 — Convenções de coordenadas entre Tiled e Phaser no quarto isométrico

- **Status:** aceito (2026-10-31, M1); revisado em 2026-11-01 (M2: tile 64×32, casca como image layer, sprites com pivot)

## Contexto
O Tiled e o Phaser 4 não posicionam as coisas da mesma forma num mapa isométrico:
- o `TilemapLayer` do Phaser desenha cada tile a partir do canto superior esquerdo, sem compensar tiles mais altos que o grid, e o `tileoffset` tem sinais opostos nos dois;
- objetos de um object layer isométrico ficam num espaço "ortogonal" em que 1 tile = `tileheight` unidades nos dois eixos, e o Phaser não converte;
- image layers do Tiled são posicionados em px a partir do canto da caixa do mapa, onde o vértice de cima do tile (0,0) fica em `x = altura do mapa × tilewidth / 2`.

No M2 a arte passou a ser gerada por código (ADR 0005), com tile 64×32 e uma imagem única para piso e paredes (`room-shell`), e cada sprite traz a própria âncora (`pivot`) no JSON.

## Decisão
- **Origem do mundo** = vértice de cima do tile (0,0) = canto do fundo do quarto, no chão. `isoToScreen(col, row)` em `src/game/iso.ts` (tile 64×32) aceita frações e é a única projeção do código; `unitsToScreen` converte unidades do gerador (8 por tile; 2 px por unidade de altura).
- **Sem tile layers.** A casca do quarto é o image layer `room-shell` (para o mapa abrir no Tiled com a arte). No jogo, o sprite da casca vai com o pivot (o canto do fundo) na origem; o deslocamento do image layer (`offsetx −12`, `offsety −156`) só é usado se o PNG não tiver pivot, e divergências geram aviso em dev.
- **Objetos** (layers `interactables` e `decor`) são retângulos da pegada no chão (ou pontos, para objetos de parede na base da parede). `tiledObjectToTileRect` converte para tiles com `tileheight` = 32. A **âncora** é o centro do retângulo; o sprite vai nesse ponto com a origem = `pivot` do frame. Interagíveis usam a propriedade `id` (fallback: nome); decoração usa o nome do arquivo.
- **Profundidade**: casca 0; luzes da casca 1; objetos de parede 5; objetos de chão `10 + col + row` da âncora; camadas do mesmo canvas (ex.: `desk-lamp` no `computer`) = principal + 0,01 cada.
- **Pixel inteiro**: âncoras em múltiplos de meio tile caem em px inteiro; o tamanho do jogo é arredondado (`scale.snap`), e o centro da câmera é escolhido para que pixels inteiros do mundo caiam em pixels inteiros da tela em qualquer zoom inteiro (`snapCenter`).

## Consequências
- O mapa abre e se vê corretamente no Tiled, e aparece igual no jogo.
- Mudar o tamanho do tile ou a projeção exige revisar `iso.ts`, `room.tmj` e o gerador de arte juntos.
- O retângulo no Tiled dá só a âncora e a profundidade; a pegada exata (ex.: o L da mesa) fica em `meta.quartoPixel.footprint`.
- Objetos sobre móvel (caderno, celular, M3) vão no ponto do móvel e precisam de profundidade do móvel + 0,01; a cena ainda não tem esse caso (ver `docs/guias/novo-objeto.md`).
