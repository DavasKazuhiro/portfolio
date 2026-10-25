# ADR 0001 — Phaser 4 para a cena, React para a UI

- **Status:** aceito (2026-10-25)

## Contexto
O portfolio é um quarto interativo em pixel art, mas continua sendo um site para recrutadores: precisa carregar rápido, funcionar no celular, ter texto selecionável/acessível e não ter backend. Node/Vite são só ferramentas de build; a escolha real é o motor que roda no navegador.

## Opções
1. **Godot/Unity com export web** — editor completo, mas 20–40 MB de WASM, carregamento lento, texto em canvas sem acessibilidade/SEO, mobile pesado.
2. **PixiJS + React** — leve, mas só renderiza; câmera, tweens, áudio, input, cenas e tilemaps teriam de ser montados à mão (GSAP, Howler...).
3. **Phaser 4 + React** — motor 2D completo (~360 KB gzip): câmera com zoom/pan, tweens, áudio, input, sistema de cenas, spritesheets do Aseprite, mapas isométricos do Tiled e modo `pixelArt`. React fica com o conteúdo.

## Decisão
Opção 3. Phaser cuida do canvas; React cuida de painéis, HUD e acessibilidade. As duas camadas só se falam pelo `EventBus` tipado e pelo store Zustand.

## Consequências
- Duas camadas para manter; regra de fronteira documentada em `CLAUDE.md` e nos agentes.
- Phaser 4 tem menos material online que o 3; mitigado pelas skills oficiais em `node_modules/phaser/skills/` e pelo MCP Context7.
- Chunk do Phaser separado no build para cache.
