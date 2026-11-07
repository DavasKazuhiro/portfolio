# Checklist de qualidade

Rodado pelo `qa-a11y` ao fechar cada marco.

## Build
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` sem erros
- [ ] CI do GitHub Actions (`.github/workflows/ci.yml`) verde no último commit do `main`
- [ ] Console do navegador sem erros ao carregar, abrir e fechar painéis

## Funcional
- [ ] Todo interagível do registry: hover mostra tooltip, clique abre o painel certo
- [ ] Esc, botão e clique fora fecham o painel; câmera volta
- [ ] Troca PT ↔ EN atualiza HUD, tooltip e painel aberto

## Acessibilidade
- [ ] Tab alcança o menu de objetos e todos os botões; foco visível
- [ ] Enter abre; foco vai para o diálogo e volta ao fechar
- [ ] `prefers-reduced-motion`: sem zoom animado nem animações decorativas
- [ ] Contraste AA em textos de painel e HUD
- [ ] `lang` do `<html>` acompanha o idioma

## Mobile (375×812)
- [ ] Quarto visível sem scroll da página; pan/zoom por toque
- [ ] Interagíveis indicam que são tocáveis
- [ ] Painéis legíveis e fecháveis

## Performance
- [ ] JS total < 500 KB gzip; assets < 5 MB
- [ ] Primeira tela interativa < 3 s em 4G simulado
- [ ] FPS estável no quarto

## Registro por marco
| Marco | Data | Resultado | Observações |
|---|---|---|---|
| M0 | 2026-10-25 | Build ok; clique → painel → Esc verificado no navegador; console limpo | Checklist completo começa no M1 |
| M1 | 2026-10-31 | Aprovado com ressalvas (nenhum bloqueador) | Ver "Resultado M1" abaixo |
| M2 | 2026-11-01 | Aprovado com ressalvas (nenhum bloqueador) | Ver "Resultado M2" abaixo |

## Resultado M1 (vertical slice)

Ambiente: `pnpm dev` no navegador embutido (1280×800, 593×566 e 360×740). Com a aba oculta o rAF
do Phaser fica lento; os fluxos foram medidos avançando o loop com `__game.step()` em passos de 16 ms.

| Item | Resultado |
|---|---|
| typecheck / lint / test (31 testes) / build | ok |
| Console limpo após reload, abrir e fechar | ok |
| Hover → outline + tooltip; clique → zoom (zoom final inteiro) → painel | ok (só `computer` está no mapa) |
| Esc / botão X / clique fora fecham; câmera volta | ok |
| Esc dentro da pasta volta à lista, segundo Esc fecha | ok |
| Troca PT ↔ EN com painel aberto (título, X, status, menu, pasta continua aberta) | ok, testado via `i18n.changeLanguage`: o HUD fica atrás do backdrop |
| Tab chega ao menu de objetos e ao HUD; foco visível | ok |
| Enter abre; foco vai ao diálogo e volta ao item do menu | ok |
| Foco depois de fechar painel aberto com o mouse | vai para `body`; o próximo Tab cai no 1º item do menu (aceitável) |
| Foco preso no diálogo (Tab/Shift+Tab circulam) | ok |
| `prefers-reduced-motion`: zoom instantâneo (1 quadro) e sem `panel-pop` | ok |
| Contraste AA (texto) | ok: ink/panel 12.5, accent/panel 8.5, cyan/panel 7.4, border/accent 11.0, ink/#3d3058 9.9 |
| Contraste do indicador de foco do X (ink sobre a barra accent) | 1.47:1, abaixo de 3:1 (ressalva) |
| `lang` do `<html>` acompanha o idioma | ok |
| Mobile 360: quarto sem scroll, painel em tela cheia legível e fechável | ok (quarto fica em zoom 1, pequeno) |
| Pan/zoom por toque; indicação de tocável | não se aplica (M5) |
| JS total gzip < 500 KB | ok: 449 KB (phaser 354 + index 91 + ComputerPanel 4) |
| Assets < 5 MB | ok: `dist/` inteiro 1.7 MB |
| FPS estável | ok: ~60 fps no quarto |
| Primeira tela < 3 s em 4G | não medido |
| Casos de borda: menu → fechar → abrir `frames` durante o zoom-out (fila); duplo clique; resize com painel aberto; fallback de 1,5 s com o loop parado | ok |

## Resultado M2 (arte)

Ambiente: `pnpm dev`. Navegador embutido (aba oculta: loop avançado com `__game.step()`) e Playwright
(contextos novos por tamanho, `deviceScaleFactor` 1 e 1,25, `reducedMotion: 'reduce'`). Capturas em
`.playwright-mcp/m2/` (fora do git).

Testes novos: `tests/camera-room.test.ts` (`roomView`, `snapCenter`, `rectUnion`), `tests/period.test.ts`
(`periodAt`, `parsePeriod`, `pickTag` e `ui/closeup/period`), `tests/closeup.test.ts` (`pickCloseupLayout`,
`screenFontSize`, `parseCloseupSheet`, `parseOverlay`, `bootSequence`), `tests/assets.test.ts`
(`meta.quartoPixel` em todo JSON de `public/assets`, PNG do tamanho de `meta.size`, frames e tags
válidos, camadas com mesma âncora e canvas, todo sprite do `room.tmj` com PNG + JSON).
`tests/camera-iso.test.ts` atualizado para tile 64×32, mapa 7×7, image layer e sem tilesets.

| Item | Resultado |
|---|---|
| typecheck / lint / test (140 testes + 1 falha esperada) / build | ok |
| `?period=` day, dusk e night: tint MULTIPLY no quarto, luzes (`light-window`, `light-computer`, janela) fora do tint, luminária `off`/`on` | ok |
| Hover no computador: outline, cursor `pointer`, tooltip | ok |
| Clique: zoom animado (~320 ms) até zoom inteiro, centro alinhado ao pixel | ok (1920×1080: 3 → 4; 1366×768: 2 → 3) |
| Visão de perto 1920×1080 | modo A 6×, tela 1344×756, fonte 24 px |
| 1366×768 | modo A 4×, tela 896×504, fonte 16 px |
| 768×1024 | modo B 3×, tela 672×378, fonte 14 px |
| 375×812 e 360×740 | modo C, moldura 9-slice (bordas 2×), tela cheia, sem scroll horizontal |
| Painel cabe na tela do monitor sem transbordar (A/B/C) | ok |
| Boot `boot` → `on` (2 × 60 ms); variante noturna `boot-night`/`on-night` no período noite; entardecer usa a arte de dia | ok |
| Vapor da caneca (só sem reduced motion) | ok |
| Resize com a visão de perto aberta (A → C → A) | ok |
| Esc / X / clique fora fecham; câmera volta ao enquadramento do quarto | ok |
| Teclado: Tab → item do menu → Enter → foco na 1ª pasta → Enter → foco em "Voltar" → Esc → foco na pasta → Esc → foco volta ao item do menu | ok |
| Foco preso no diálogo | ok |
| Foco depois de fechar aberto com o mouse | vai para `body` (igual ao M1, aceitável) |
| Leitor de tela: `role=dialog`, `aria-modal`, `aria-labelledby` → "Meus Projetos"; ilustração e vapor com `alt=""`; links externos com "(abre em nova aba)" | ok |
| Fundo (canvas, menu, HUD) continua na árvore de acessibilidade com o diálogo aberto | ressalva (só `aria-modal`, sem `inert`; igual ao M1) |
| `prefers-reduced-motion`: zoom instantâneo, sem boot, sem `closeup-in`, sem vapor, sem animações do quarto, troca de período instantânea | ok |
| Contraste AA no fundo teal | ok: ink/teal-0 11.6, ink/teal-1 (hover) 7.9, ink/teal-2 (título) 5.8, accent/teal-0 7.9, cyan/teal-0 6.9, cyan/border 9.6, border/accent 11.0 |
| Indicador de foco do X (contorno `border` sobre a barra `teal-2`) | 2.77:1, abaixo de 3:1 (ressalva; era 1.47 no M1) |
| Troca PT ↔ EN com a visão de perto aberta (título, X, `lang`) | ok |
| Console limpo após reload, abrir e fechar | ok |
| Console ao destruir o jogo (`game.destroy`, acontece no HMR) | erro `removeInteractive` (bug baixo, ver relatório) |
| Pixel nítido em DPR 1: escala inteira, posições inteiras, `image-rendering: pixelated`, tamanho do jogo inteiro | ok |
| DPR 1,25 (1536×730, 951×601): tamanho do jogo inteiro e centro alinhado em px CSS (pendência do M1 resolvida) | ok |
| DPR 1,25: 1 px da arte = 2,5 px do aparelho (canvas em px CSS, ampliado pelo navegador) | ressalva: pixels alternam 2/3 px do aparelho; sem borrão |
| JS total gzip < 500 KB | ok: 456 KB (phaser 354 + index 99 + ComputerPanel 3,5) |
| Assets < 5 MB | ok: `dist/` inteiro 1,9 MB; maior PNG 15 KB |
| FPS estável | ok: 60 fps no quarto |
| Primeira tela < 3 s em 4G | não medido |
