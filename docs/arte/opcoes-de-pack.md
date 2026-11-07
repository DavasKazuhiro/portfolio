# Opções de asset pack (M2) — histórico

> **Documento histórico. Nenhum pack foi adotado.** Em 2026-10-31 o Davi decidiu que a arte do quarto é própria e gerada por código. O estilo se inspira no visual geral do pack C (pixel_Salvaje, tipo Habbo), mas nada dele é usado nem copiado. Motivos: os packs bonitos proíbem redistribuição num repositório público (C, Thurraya e outros); o pack CC0 (A) tinha origem duvidosa e cerca de 240 cores; o GPL (B) exigia cuidados de licença e não tinha pet nem celular; e nenhum cobria a porta, as visões de perto, o celular e o caderno, que teriam de ser desenhados de qualquer jeito. A arte gerada dá paleta fechada, grid exato e variantes (dia/noite, hover) sem custo. Regras atuais: [biblia-de-arte.md](biblia-de-arte.md). O texto abaixo foi mantido como registro da pesquisa.

Mantido pelo agente `art-director`. Pesquisa de 2026-10-31. **Nada foi baixado para `public/assets/`**: a escolha é do Davi. Só as imagens de prévia públicas das páginas foram olhadas (fora do repositório) para conferir estilo, escala e número de cores.

## O que o pack precisa ter
- Isométrico 2:1 compatível com chão de **32×16 px**, pixel art nítida em escala inteira.
- Quarto: chão, paredes, janela, escrivaninha, computador, estante, quadros, cama, mesinha, celular, plantas e decoração, de preferência um gato ou cachorro.
- Licença que permita **portfolio público e commit dos arquivos num repositório público** (`DavasKazuhiro/portfolio`). Isso é o que derruba a maioria dos packs do itch.io: quase todos proíbem "redistribuir" os arquivos, e um repositório público no GitHub é redistribuição dos arquivos crus para qualquer pessoa.

## Resumo
| | A. Riclmbr – Pixel Isometric Interiors & City | B. hooded crow – Isometric pixel house furniture | C. pixel_Salvaje – Isometric Interiors (Tiny House) |
|---|---|---|---|
| Licença | **CC0 1.0** | **GPL 3.0** | Licença própria do autor |
| Commit em repo público | **Sim** | **Sim**, com o texto da GPL e o crédito | **Não** (só com autorização por escrito) |
| Crédito | não exigido | exigido (aviso de copyright/licença) | não informado |
| Preço | US$ 5,19 em promoção até 06/11/2026 (normal US$ 7,99) | grátis | US$ 10,80 em promoção (normal US$ 18) |
| Grid | 32×16 nativo (declarado e conferido na prévia) | 32×16 (conferido na prévia, que está em 2×) | vários tamanhos (8 a 128 px); 32×16 não confirmado |
| Cobertura dos 8 objetos + quarto | 6 de 9 prontos, 2 adaptáveis (falta celular) | 4 de 9 prontos, 3 adaptáveis (faltam celular e pet) | 4 de 9 prontos, 3 adaptáveis (faltam celular e pet) |
| Pet | 4 cães e 4 gatos animados | não tem | não tem |
| Autoria | autor novo e muito prolífico, origem a confirmar | artista do OpenGameArt, desenho à mão | artista consolidado, desenho à mão |

**Recomendação: A (Riclmbr)**, com uma condição, explicada no fim. B é a alternativa gratuita e "segura" quanto à autoria. C só vale se o autor autorizar o commit por escrito.

---

## A. Pixel Isometric – Interiors & City (509 Isometric Pixel Art Assets)
- **Autor:** Riclmbr — https://riclmbr.itch.io/pixel-isometric-interiors-city-509-isometric-pixel-art-assets
- **Licença:** CC0 1.0. Trecho da página: *"CC0 1.0 – use it in personal and commercial projects, no credit required."*
  - **Veredito de redistribuição: permitido.** CC0 é renúncia de direitos; não há cláusula contra redistribuir, então dá para commitar os PNGs no repositório público. Crédito não exigido (vamos registrar mesmo assim em `LICENSES.md`).
- **Preço:** US$ 7,99; em promoção por US$ 5,19 até 06/11/2026.
- **Tile e sprites:** tiles isométricos 2:1 de 32×16 px ("32x16 isometric tiles"), um PNG por direção, tiras de animação horizontais, versões ×2 e ×4, e `items.json` com origem (âncora) e footprint de cada sprite. As prévias estão em 2× (conferido pela contagem de pixels), e o quarto de demonstração tem cerca de 6×4 tiles, na mesma escala do nosso quarto de 8×8.
- **Paleta:** não é uma paleta pública do Lospec nem uma paleta limitada. A cena do quarto de demonstração tem cerca de 240 cores (muitas variações de cor por móvel). Estilo limpo, tons pastel, contorno escuro de 1 px, sombreado simples, parecido com Habbo.
- **Conteúdo relevante:** 31 pisos, 26 paredes (esquerda/direita/canto), 19 portas e janelas (cortinas, persiana, veneziana), 11 decorações de parede, 38 itens de quarto, 56 de sala, 25 de escritório, 28 personagens (andar, parado, sentado, acenar, 4 direções) e 8 pets.

| Item | Cobertura | Sprite do pack |
|---|---|---|
| Quarto (chão, paredes, janela) | pronto | 31 pisos, 26 paredes, 9 janelas, portas que abrem |
| `computer` | pronto (provisório) | Gaming Desk PC, Office Desk PC, Office Desk Dual Monitor |
| `frames` | pronto (provisório) | Picture Landscape / Abstract / Sunset / Flower |
| `portrait` | pronto (provisório) | Picture Family |
| `bookshelf` | pronto | Bookshelf Tall, Bookshelf Low Wide, Cube Shelf, Ladder Shelf |
| `journal` | adaptável | Desk Study (caderno ainda é um detalhe custom de poucos pixels) |
| `phone` | **falta** | não há celular |
| `diploma` | adaptável | recolorir um Picture (moldura escura + papel creme) |
| `pet` | pronto | Dog Golden/Black/Dalmatian/Corgi, Cat Orange/Gray/Black/White (andar, parado, sentado) |
| Extras | — | cama, mesinha de cabeceira, plantas (7 + suspensa), tapetes, abajur, personagens para o avatar |

- **Ainda precisa de custom:** PC, quadros e retrato definitivos (já previstos na bíblia), celular, caderno, diploma, as ilustrações frontais da "visão de perto" e a porta do quarto. Pets e avatar podem ganhar animações extras (dormir, espreguiçar), porque o pack só tem andar/parado/sentado.
- **Combina com os custom?** Sim, é o estilo mais fácil de imitar: formas simples, contorno de 1 px, poucos tons por material. A porta e as ilustrações frontais dá para desenhar no mesmo traço sem esforço.
- **Prévias:**
  - Quarto + banheiro de demonstração: https://img.itch.zone/aW1hZ2UvNTIzNzA1OS8zMTQ1OTQ3OS5naWY=/original/hZ7x0a.gif
  - Pets: https://img.itch.zone/aW1hZ2UvNTIzNzA1OS8zMTM5NTIwOS5naWY=/original/3tZXTm.gif
  - Cena de rua (escala e estilo geral): https://img.itch.zone/aW1hZ2UvNTIzNzA1OS8zMTM5NTE5Mi5naWY=/original/%2F3JRsj.gif
  - Galeria completa (21 GIFs) na página do pack.
- **Prós:** única opção com CC0 + 32×16 nativo + pets; cobertura quase completa; `items.json` com âncoras já facilita o `scene-engineer`; barato.
- **Contras:**
  - **Origem a confirmar.** Pack publicado há 5 dias, e o autor tem 105 packs no itch.io, quase todos com 300 a 1000 sprites (pixel art, low poly PSX, fontes, UI). Esse volume é típico de arte gerada por código ou com IA. A página marca *"No generative AI was used"*, mas não diz como a arte foi feita. Se Davi não quiser arte possivelmente gerada por código no portfolio, fique com B.
  - Estilo genérico e paleta grande: vamos ter que reduzir e harmonizar as cores para fechar a paleta da bíblia (24–32 cores).
  - Pets pequenos e simples (poucos pixels, leitura fraca de perto).
  - Pago; como é CC0, depois de comprado não há restrição de uso.

## B. Isometric pixel house furniture (+ "Isometric pixel room", do mesmo autor)
- **Autor:** hooded crow (OpenGameArt)
  - Pack principal: https://opengameart.org/content/isometric-pixel-house-furniture (publicado em 17/05/2024)
  - Complemento CC0: https://opengameart.org/content/isometric-pixel-room (quarto pronto com escrivaninha, estante, quadro, planta, janela e porta; 01/10/2022)
  - Complemento CC-BY 4.0: https://opengameart.org/content/pixel-house-furniture (estilo vitoriano, camas, criados-mudos, armários, tapetes)
- **Licença:** pack principal em **GPL 3.0** (campo "License(s)" da página; aviso de atribuição: *"Free license"*). O quarto complementar é **CC0**, e o pack vitoriano é **CC-BY 4.0**.
  - **Veredito de redistribuição: permitido.** A GPL 3.0 garante explicitamente o direito de copiar e distribuir, inclusive com modificações, desde que se mantenham o aviso de copyright e o texto da licença, e que as versões modificadas continuem GPL. Para nós isso significa: guardar os PNGs em pasta própria (`public/assets/tiles/hooded-crow/`, por exemplo), incluir `COPYING` (texto da GPL 3.0) nessa pasta, dar crédito a "hooded crow" com link e marcar como GPL qualquer sprite derivado. O código do site não fica "contaminado" porque a arte é um arquivo de dados separado, mas a GPL **não está na lista de licenças pré-aprovadas do projeto** (CC0, CC-BY ou licença explícita do autor): é livre e explícita, mas precisa do "ok" do Davi.
- **Preço:** grátis.
- **Tile e sprites:** grid de 32×16 (conferido: a grade da prévia repete a cada 64 px com linhas de 2 px, ou seja, prévia em 2× de um losango de 32×16). Página: *"size of the assets is from 5×7 to 148 px"*.
- **Paleta:** não é paleta pública nem limitada (~200–260 cores nas prévias). Estilo moderno, tons de cinza e madeira, sem contorno preto, sombreado suave. Mais "adulto" e escuro que A e C.
- **Conteúdo:** 2 quartos montados, 16 criados-mudos, 6 escrivaninhas, 2 cadeiras de escritório, 7 armários, 4 tapetes, 18 camas, cozinha, sala (TV, sofás, plantas, relógio) e banheiro.

| Item | Cobertura | Sprite do pack |
|---|---|---|
| Quarto (chão, paredes, janela) | pronto | quartos montados com janela e cortina; quarto CC0 com janela e porta |
| `computer` | pronto (provisório) | escrivaninha com monitor, teclado e gabinete |
| `frames` | pronto (provisório) | trio de quadros na parede |
| `portrait` | adaptável | quadro pequeno ou porta-retrato a recolorir |
| `bookshelf` | pronto | estantes com livros (várias) |
| `journal` | adaptável | livros soltos/itens de mesa |
| `phone` | **falta** | — |
| `diploma` | adaptável | quadro emoldurado |
| `pet` | **falta** | — |
| Extras | — | camas, criados-mudos com abajur, plantas, tapetes, frigobar |

- **Ainda precisa de custom:** os mesmos de A, **mais o pet** (gato ou cachorro com idle, dormir, espreguiçar) e o avatar.
- **Combina com os custom?** Razoável. O estilo é mais detalhado e sem contorno, então a regra da bíblia "contorno de 1 px" teria de mudar para "sem contorno, separação por tom". As ilustrações frontais pedem mais trabalho de textura (madeira, tecido) para não destoarem.
- **Prévias:**
  - Casa completa: https://opengameart.org/sites/default/files/full_house_furniture_picture_.png
  - Quartos e escrivaninhas: https://opengameart.org/sites/default/files/2_bedrooms_-_16_nightstand_-_6_desks_-2_desk_chairs_-picture_.png
  - Quarto CC0: https://opengameart.org/sites/default/files/screenshot_20220928-011059.png
- **Prós:** grátis; autoria humana sem dúvida aparente; grid 32×16; tem exatamente a cena "quarto de dev" (mesa com PC ao lado da cama); redistribuição garantida pela licença.
- **Contras:** GPL exige cuidado (texto da licença, derivados GPL) e não está na lista pré-aprovada; sem pet e sem celular; paleta escura que vai exigir ajuste para o modo dia; menos variedade e sem `items.json`/âncoras.

## C. Isometric Interiors – Tileset ("Tiny House")
- **Autor:** @pixel_Salvaje — https://pixel-salvaje.itch.io/isometric-interiors
- **Licença:** própria, na página. Permitido: *"Edit and use the asset in any commercial or non-commercial project."* Proibido: *"Resell or distribute the asset to others."*
  - **Veredito de redistribuição: NÃO permitido.** Commitar os PNGs num repositório público é distribuir o asset para terceiros. Só serviria com (a) autorização por escrito do autor para o repositório público, guardada em `LICENSES.md`, ou (b) manter os assets fora do Git (repositório privado ou download no build), o que complica o deploy estático e o CI. Crédito não informado na página.
- **Preço:** US$ 18; em promoção por US$ 10,80.
- **Tile e sprites:** mais de 800 sprites; o autor diz que tudo está em potências de 2 (8, 16, 32, 64, 128 px). **Não confirmei que exista a versão de chão 32×16**: um comprador comentou que não encontrou a versão 32×32. As prévias parecem estar em escala maior que a nossa.
- **Paleta:** não informada; cores saturadas, contorno escuro grosso, estilo Habbo muito polido.
- **Conteúdo:** paredes, pisos (~350), camas, computadores e monitores com animação liga/desliga, consoles, livros (10 modelos × 16 rotações), portas e gavetas animadas, escritório, quarto japonês, banheiro, escadas.

| Item | Cobertura | Sprite do pack |
|---|---|---|
| Quarto (chão, paredes, janela) | pronto | paredes, pisos, janelas, portas animadas |
| `computer` | pronto (provisório) | vários PCs/monitores animados (cuidado: um deles imita um iMac; evitar por ser design de marca) |
| `frames` | pronto (provisório) | quadros na parede |
| `portrait` | pronto (provisório) | retrato emoldurado |
| `bookshelf` | adaptável | livros soltos em 16 rotações; estante não listada |
| `journal` | adaptável | livros |
| `phone` | **falta** | — |
| `diploma` | adaptável | quadro |
| `pet` | **falta** | o autor disse que personagens não vêm tão cedo |

- **Ainda precisa de custom:** os mesmos de A, mais pet e avatar.
- **Combina com os custom?** É o mais difícil: o acabamento é alto e o contorno grosso é marcante; ilustrações frontais e a porta precisariam do mesmo nível para não parecerem de outro jogo.
- **Prévias:**
  - Escritório com computadores: https://img.itch.zone/aW1hZ2UvMTg0NDkxNC8xMTM3MDM3NC5wbmc=/original/kalDf1.png
  - Escadas, quadros e planta: https://img.itch.zone/aW1hZ2UvMTg0NDkxNC8zMTQzMjc4Ni5wbmc=/original/tfHzEj.png
  - Sala montada: https://img.itch.zone/aW1hZ2UvMTg0NDkxNC8xMDgyNzUyOC5wbmc=/original/J5L4t7.png
- **Prós:** a arte mais bonita e "de jogo" das três; computadores animados; autor ativo (atualizado esta semana).
- **Contras:** licença impede o commit em repositório público; pago; tamanho de tile não confirmado; sem pet.

---

## Descartados (e por quê)
| Pack | Motivo |
|---|---|
| [Thurraya – Isometric Bedroom Assets Pack](https://thurraya.itch.io/isometric-bedroom-assets-pack) | Bonito, feito à mão, paleta de 22 cores, grátis. Mas *"You cannot resell the product or redistribute it"* e cobre pouco (cama, mesa, cadeira, guarda-roupa, janela, quadros, planta). Bom candidato se o autor autorizar. |
| [Cryovex – Pixel Isometric Modern Interior](https://cryovex.itch.io/pixel-isometric-modern-interior) | *"You cannot resell or redistribute the asset to others, even if modified."* Em desenvolvimento. |
| [Gridwright – Isometric Interiors](https://v3su.itch.io/isometric-interiors-pixel-art-32x32-furniture-walls), [riekahq – Isometric Home Interiors](https://riekahq.itch.io/isometric-interiors-tileset), [mmorwynn – Cozy Interiors](https://mmorwynn.itch.io/cozy-interiors-pack) | Proíbem redistribuição e são marcados "AI Assisted". |
| [Kabukidanshi – Isometric Pixel Art Home Interior Pack](https://kabukidanshi.itch.io/isometric-pixel-art-home-interior-pack) | *"Redistribution or resale of the assets is not allowed"*; conteúdo pequeno. |
| [Zephilie – Isometric pixel art assets](https://zephilie.itch.io/isometric-pixel-art-assets) | CC BY 4.0 (licença ótima), mas arte em alta resolução semi-realista, fora da escala 32×16. |
| [Kenney – Furniture Kit](https://kenney.nl/assets/furniture-kit) | CC0, mas é kit 3D; não é pixel art. |

## Recomendação
**A (Riclmbr)**, porque é a única opção que junta tudo o que o projeto pede: licença CC0 (commit no repositório público sem ressalvas), grid 32×16 nativo, quase todos os objetos (inclusive gato/cachorro e personagens para o avatar) e âncoras prontas em `items.json`. O estilo simples também facilita desenhar os sprites custom, a porta e as ilustrações frontais no mesmo traço.

Condição: Davi olhar as prévias e aceitar o risco de origem (autor com produção em massa, possivelmente arte gerada por código). Se preferir autoria humana sem dúvida, a escolha passa a ser **B (hooded crow)**, que é grátis e redistribuível, aceitando a GPL 3.0 e desenhando o pet do zero.

Depois da escolha, o `art-director`: baixa o pack para a pasta própria em `public/assets/`, registra em `LICENSES.md`, extrai a paleta e propõe a paleta final da bíblia (reduzida para 24–32 cores, se possível baseada numa paleta do Lospec), e escreve as specs dos sprites custom.
