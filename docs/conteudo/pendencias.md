# Pendências de conteúdo

O que ainda precisa vir do Davi. Mantido pelo `content-curator`.

| # | Item | Para | Marco | Status |
|---|---|---|---|---|
| 1 | Lista de prêmios e certificados (título, emissor, data) + imagem/PDF de cada | quadros (`awards.json`) | M3 | ⏳ |
| 2 | Texto sobre a família e o que pode aparecer (nomes? fotos? só descrição?) | retrato (`about.familia`) | M3 | ⏳ |
| 3 | Descrição do avatar (cabelo, roupa, óculos...) | sprite do avatar | M2 | ⏳ |
| 4 | Existe um pet real? Espécie, cor, nome | sprite e frases do pet | M2 | ⏳ |
| 5 | Currículo em PDF (PT e EN) | celular | M3 | ⏳ |
| 6 | Prints ou GIFs dos projetos | computador | M3 | ⏳ |
| 7 | Aprovar tradução EN | todos | M3 | ⏳ |
| 8 | Escolher asset pack entre as opções do `art-director` | arte | M2 | ⏳ |
| 11 | Sistema de Chamadas: avisar quando houver demo ou repositório público para o campo `link` (hoje `null`) | computador | M3 | ⏳ aguardando |
| 13 | Contexto e ano de cada projeto (disciplina, extensão, pessoal) e o que foi responsabilidade sua dentro da equipe, se quiser mostrar no painel | computador | M3 | ⏳ |
| 14 | Criar `src/content/en/*.json` espelhando o PT (hoje `index.ts` usa PT como fallback para EN). Em EN, explicar "projeto de extensão" (university outreach project) | todos | M3 | ⏳ |

Observação: `profile.json` contém o telefone pessoal (veio do site antigo). Confirmar se deve continuar público.

## Resolvido
- M1: revisão de `projects.json` (ortografia, clareza, frases curtas; "microPython" → "MicroPython"; operações de conjuntos em minúsculas; título "Controle de Estoque da ONG"). Tecnologias preenchidas a partir do próprio texto: Beat Learning (Processing), Bebedouro (MicroPython, ESP32, Wokwi, SolidWorks), Organizador de Arquivos e Calculadora de Conjuntos (Python). Formato e nomes de campos inalterados.
- 2026-10-31, respostas do Davi: Controle de Estoque da ONG usa HTML, CSS, JavaScript e MySQL (#9); todos os projetos foram feitos em equipe, agora dito em cada descrição (#10); Sistema de Chamadas ainda sem demo (#11 segue aguardando); Bebedouro Inteligente removido da lista de projetos (#12 descartada).
