# Checklist de qualidade

Rodado pelo `qa-a11y` ao fechar cada marco.

## Build
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` sem erros
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
