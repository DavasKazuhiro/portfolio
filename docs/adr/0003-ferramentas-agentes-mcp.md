# ADR 0003 — Agentes por área, MCPs mínimos e pnpm

- **Status:** aceito (2026-10-25)

## Decisão
- **Agentes** em `.claude/agents/`: `art-director`, `scene-engineer`, `ui-engineer`, `content-curator`, `qa-a11y`. A sessão principal orquestra. Cada agente tem área de arquivos própria e um doc que mantém atualizado. Agentes que não precisam de shell/MCP têm `tools` restrito.
- **MCPs** em `.mcp.json`, com versão fixada:
  - `context7` — documentação atualizada de libs (Phaser 4, i18next, React 19).
  - `playwright` — verificação no navegador pelo `qa-a11y`.
  - Aseprite MCP: avaliar no M2, só se o pipeline de sprites justificar.
  - GitHub: `gh` CLI, sem MCP.
- **pnpm** como gerenciador (instalação rápida e menos arquivos duplicados na pasta sincronizada pelo OneDrive).

## Consequências
- `.mcp.json` usa `cmd /c npx` (Windows). Em macOS/Linux, trocar por `npx` direto.
- Ao abrir o projeto, o Claude Code pede aprovação dos MCPs do projeto uma vez.
