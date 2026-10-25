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
- `App.tsx` assina o `EventBus` e alimenta o store (`scene-ready`, `object-hover`, `object-open`).
- Fechar painel: `close()` no store + `EventBus.emit('panel-closed')`.

## Conteúdo e i18n
- Textos da interface: `src/i18n/locales/{pt,en}.json` (react-i18next). Idioma inicial pelo navegador, fallback PT.
- Conteúdo do portfolio: `getContent(locale)` em `src/content/index.ts`. EN usa PT até o M3.

## Estado atual (M0)
`PanelHost` mostra um painel genérico ("em construção") para qualquer id. Esc e botão fecham.

## Planejado
- M1: `PanelHost` carrega `panels/<Id>Panel.tsx` com `React.lazy`; `ComputerPanel` (desktop retrô) lendo `projects.json`; foco preso no diálogo e devolvido ao fechar.
- M3: painéis dos demais objetos.
- M4: overlay da tela de título (menu Iniciar/Idioma/Som).
- M5: painéis em tela cheia abaixo de 768px.

## Estilo
Variáveis em `src/app/global.css` (`--bg`, `--ink`, `--accent`, `--cyan`, `--panel`, `--border`), fonte Pixelify Sans, bordas e sombras em blocos (`.pixel-btn`, `.panel`). A paleta final vem da bíblia de arte no M2.
