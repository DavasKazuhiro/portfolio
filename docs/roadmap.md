# Roadmap

Cada marco é executado e aprovado separadamente. Ao fechar um marco, o `qa-a11y` roda o [checklist](qualidade/checklist.md).

| Marco | Escopo | Status |
|---|---|---|
| **M0 – Fundação** | Git + tag `legacy-v1`; base Phaser 4 + React 19 + TS + Vite + pnpm; ponte EventBus com painel de teste; conteúdo migrado para `src/content/pt`; `CLAUDE.md`; 5 agentes; `.mcp.json`; docs e ADRs iniciais | ✅ Concluído (2026-10-25) |
| **M1 – Vertical slice** | Mapa isométrico no Tiled com tiles placeholder; `Boot/Preload` reais; computador como objeto do Tiled; hover com outline, clique com zoom de câmera; painel `ComputerPanel` lendo `projects.json`; Esc volta com zoom-out; foco/teclado | ⏳ Próximo |
| **M2 – Arte** | Escolha do pack (2–3 opções do `art-director`); paleta e bíblia de arte fechadas; sprites customizados (PC, quadros, retrato); iluminação dia/noite | — |
| **M3 – Objetos + conteúdo** | Todos os 8 objetos com painéis temáticos; conteúdo EN; prêmios/certificados e família preenchidos | — |
| **M4 – Jogo** | Tela de título "Press Start"; música e SFX; avatar e pet animados | — |
| **M5 – Lançamento** | Mobile (toque, pan/zoom), acessibilidade completa, performance, Playwright e2e, SEO/meta tags, deploy | — |

## Decisões em aberto
- Plataforma de deploy (GitHub Pages × Vercel) — decidir até o M5.
- Asset pack — decidir no M2.
- Aseprite MCP — avaliar no M2.
