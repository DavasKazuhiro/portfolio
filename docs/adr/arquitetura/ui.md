# Arquitetura — UI (React)

Mantido pelo agente `ui-engineer`.

## Camadas
```
<main.app>
  <PhaserGame/>  ← canvas, aria-hidden (o conteúdo acessível está no DOM)
  <Hud/>         ← idioma, som, tooltip, menu acessível (sr-only, aparece com foco)
  <PanelHost/>   ← painel do objeto aberto (role="dialog")
```

## Estado e eventos
- `src/store/useGameStore.ts` (Zustand) é a fonte da verdade da UI.
- `App.tsx` assina o `EventBus` e alimenta o store: `scene-ready` → `sceneKey`, `object-hover` → `hoveredId`, `object-open` → `open(id)` (e cancela o fallback do teclado). Também mantém `<html lang>` em sincronia com o idioma.
- **Abrir pelo teclado** (`Hud`, menu `sr-only`): `rememberFocus(botão)` + `requestOpen(id)` (`src/ui/hud/requestOpen.ts`), que emite `focus-object` → a cena faz o zoom → responde `object-open` → painel. Mesmo fluxo do clique.
  - Fallback: se a cena não está pronta (`sceneKey` nulo), abre direto; se `object-open` não chega em 1,5 s, abre direto também (o teclado nunca fica sem resposta).
- **Fechar** (Esc, botão Fechar, clique no fundo): `closePanel()` (`src/ui/panels/closePanel.ts`) = `close()` no store + `EventBus.emit('panel-closed')`. O `PanelHost` devolve o foco a quem abriu quando o diálogo desmonta.

| Evento | Direção | Uso na UI |
|---|---|---|
| `scene-ready` | Phaser → React | `setSceneKey` (habilita o fluxo com zoom) |
| `object-hover` | Phaser → React | tooltip (escondido com painel aberto) |
| `object-open` | Phaser → React | abre o painel |
| `focus-object` | React → Phaser | menu de teclado pede o zoom |
| `panel-closed` | React → Phaser | zoom-out |

## Painéis
- `PanelHost` (`src/ui/panels/PanelHost.tsx`): fundo (`.panel-backdrop`, clique fora fecha) + diálogo (`role="dialog"`, `aria-modal`, `aria-labelledby="panel-title"`, `tabIndex=-1`). Mapa `PANELS` id → `React.lazy(() => import('./<Id>Panel'))`; ids fora do mapa usam `GenericPanel`. `Suspense` mostra "Carregando...".
- Contrato (`src/ui/panels/types.ts`): `PanelProps = { titleId, onClose }`. O painel põe `id={titleId}` no seu título visível e chama `onClose` no seu botão Fechar.
- Esc: listener global no `PanelHost` fecha, **a menos que** o painel tenha chamado `preventDefault()` no seu `onKeyDown` (navegação interna).
- Foco: `useFocusTrap` (`src/ui/a11y/useFocusTrap.ts`) prende Tab/Shift+Tab e puxa de volta foco que escape; foco inicial vai para o item que o painel focar ou para o diálogo. `focusReturn.ts` guarda quem abriu (botão do menu, ou `document.activeElement`).
- Conteúdo: `getContent(toLocale(i18n.language))` (`src/ui/panels/locale.ts`); trocar o idioma com o painel aberto atualiza o conteúdo.

| Id | Painel | Tema |
|---|---|---|
| `computer` | `ComputerPanel.tsx` | desktop retrô: janela com barra de título, barra de endereço, pastas por projeto (destaques primeiro, `sortProjects`), detalhe com descrição, tecnologias e link GitHub (`target=_blank rel="noopener noreferrer"`, aviso de nova aba para leitor de tela). Esc numa pasta volta à lista; foco vai para "Voltar" e retorna à pasta. |
| demais | `GenericPanel.tsx` | "em construção" (M3) |

## Componentes e utilitários
- `src/ui/hud/Hud.tsx`: menu de objetos (primeiro na ordem de Tab, aparece com foco), idioma, som, tooltip.
- `src/ui/a11y/focusable.ts`: `getFocusable`, `wrapFocusIndex` (puro, testado).
- `src/ui/panels/computer/projects.ts`: `sortProjects` (puro, testado). Testes em `tests/ui-logic.test.ts` (inclui paridade de chaves PT/EN).

## Estado atual (M1)
Feito: painéis lazy, `ComputerPanel`, diálogo acessível completo, menu de teclado via `focus-object`, tela cheia abaixo de 768px (testado em 360px sem scroll horizontal), animação de abertura só com `prefers-reduced-motion: no-preference`.

Depende do Phaser: a cena ainda precisa ouvir `focus-object` (zoom + `object-open`) e `panel-closed` (zoom-out). Até lá vale o fallback de 1,5 s.

## Planejado
- M3: painéis dos demais objetos (registrar no mapa `PANELS`).
- M4: HUD da porta do quarto (idioma, som) e menu acessível já disponível antes de entrar.
- M5: revisão mobile completa (toque, pan/zoom) com o `qa-a11y`.

## Estilo
Variáveis em `src/app/global.css` (`--bg`, `--ink`, `--accent`, `--cyan`, `--panel`, `--border`), fonte Pixelify Sans, bordas e sombras em blocos (`.pixel-btn`, `.panel`, `.retro-window`), sem cantos arredondados nem blur. Foco visível: contorno `--cyan`. `.visually-hidden` esconde texto só para leitor de tela. A paleta final vem da bíblia de arte no M2.
