# ADR 0005 — Arte própria gerada por código, tile 64×32

- **Status:** aceito (2026-10-31)
- **Substitui em parte:** [ADR 0002](0002-isometrico-tiled.md) (tamanho do tile 32×16)

## Contexto
No M2 o `art-director` comparou três asset packs ([opções](../arte/opcoes-de-pack.md)). O Davi não gostou do estilo dos dois com licença compatível (A, B) e preferiu o C, cuja licença proíbe commitar os arquivos num repositório público. Um teste de arte gerada por código no estilo geral do C (sem copiar nada) foi aprovado, primeiro em 32×16 e depois em resolução maior.

## Decisão
- A arte do quarto é **própria**, gerada por scripts Node sem dependências em `tools/art/` (`lib.mjs` = motor de desenho, `palette.mjs` = paleta, `scenes/` = composições, `build.mjs` = saída). Peças podem ser retocadas à mão (Piskel/LibreSprite) seguindo a [bíblia de arte](../arte/biblia-de-arte.md).
- Tile de chão **64×32** (isométrico 2:1), em vez de 32×16: o dobro de pixels por lado para mais detalhe. Escala sempre inteira no canvas.
- A cena de referência aprovada (`tools/art/scenes/reference-desk.mjs`) é o guia de estilo e o teste de regressão do motor: `node tools/art/build.mjs --reference` gera `art-src/previews/reference-desk.png`.
- Os PNGs gerados ficam versionados em `public/assets/` (são nossos, licença do projeto) e os scripts são a fonte.

## Consequências
- Sem custo nem restrição de licença; o estilo é consistente porque tudo nasce das mesmas regras (contorno, três tons por material, filete de luz, oclusão).
- Peças orgânicas (pet, avatar, plantas) ficam mais simples que arte desenhada à mão; podem receber retoque manual.
- Mapa, tileset e câmera mudam de escala: o zoom inteiro do quarto cai pela metade (1× ou 2× em telas comuns).
- Mudar a arte = editar o script e rodar o build; não editar o PNG gerado direto (o próximo build sobrescreve). Retoques manuais viram arquivos separados em `art-src/`.
