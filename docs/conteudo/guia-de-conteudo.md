# Guia de conteúdo

Mantido pelo agente `content-curator`.

## Onde fica
`src/content/<lang>/<seção>.json`, lido por `getContent(locale)` em `src/content/index.ts`.

| Arquivo | Objeto | Conteúdo |
|---|---|---|
| `profile.json` | HUD / celular | nome, contato, links, cargos, objetivo |
| `about.json` | retrato | quem sou, o que me move, `familia` |
| `projects.json` | computador | projetos |
| `experiences.json` | caderno | trabalho e pesquisa |
| `education.json` | diploma | curso, IRA, disciplinas |
| `skills.json` | estante | técnicas, ferramentas, idiomas, soft skills |
| `awards.json` | quadros | prêmios e certificados |
| `extras.json` | estante / caderno | atividades extras |

## Regras
- PT é a fonte; EN espelha as mesmas chaves.
- Não inventar fatos. Faltou informação → `null`/lista vazia + item em [pendencias.md](pendencias.md).
- Primeira pessoa, frases curtas; cabe numa janela pequena.

## Formato sugerido para `awards.json`
```json
{ "titulo": "", "emissor": "", "data": "AAAA-MM", "tipo": "premio | certificado", "imagem": "assets/awards/<arquivo>.png", "link": null }
```
