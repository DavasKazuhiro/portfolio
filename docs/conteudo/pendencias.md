# Pendências de conteúdo

O que ainda precisa vir do Davi. Mantido pelo `content-curator`.

| # | Item | Para | Marco | Status |
|---|---|---|---|---|
| 1 | Lista de prêmios e certificados (título, emissor, data) + imagem/PDF de cada | quadros (`awards.json`) | M3 | ⏳ |
| 2 | Texto sobre a família e o que pode aparecer (nomes? fotos? só descrição?) | retrato (`about.familia`) | M3 | ⏳ |
| 3 | Descrição do avatar (cabelo, roupa, óculos...) | sprite do avatar | M2 | ⏳ |
| 4 | Existe um pet real? Espécie, cor, nome | sprite e frases do pet | M2 | ⏳ |
| 5 | Currículo em PDF (PT e EN) | celular | M3 | ⏳ |
| 6 | Prints ou GIFs dos projetos; tecnologias dos projetos que hoje estão sem (só falta o Controle de Estoque da ONG, ver #9) | computador | M3 | ⏳ parcial |
| 7 | Aprovar tradução EN | todos | M3 | ⏳ |
| 8 | Escolher asset pack entre as opções do `art-director` | arte | M2 | ⏳ |
| 9 | Controle de Estoque da ONG: quais tecnologias foram usadas (linguagem, framework, banco)? | computador (`projects.json`) | M1 | ⏳ |
| 10 | Qual foi o seu papel em cada projeto? Fez sozinho ou em equipe (quantas pessoas)? O que foi responsabilidade sua? Hoje as descrições não dizem, para não afirmar autoria sem confirmação | computador | M1 | ⏳ |
| 11 | Sistema de Chamadas: tem repositório ou demo para o campo `link` (hoje `null`)? Foi projeto de disciplina, estágio ou pessoal? | computador | M1 | ⏳ |
| 12 | Bebedouro Inteligente: como o bebedouro ajuda a reduzir dengue (evita água parada? troca/escoa a água?) e o que é "inteligente" nele (sensor de nível, bomba, timer)? Uma frase deixa a descrição mais clara para recrutador | computador | M1 | ⏳ |
| 13 | Contexto e ano de cada projeto (disciplina, extensão, pessoal), se quiser mostrar no painel | computador | M3 | ⏳ |
| 14 | Criar `src/content/en/*.json` espelhando o PT (hoje `index.ts` usa PT como fallback para EN). Em EN, explicar "projeto de extensão" (university outreach project) | todos | M3 | ⏳ |

Observação: `profile.json` contém o telefone pessoal (veio do site antigo). Confirmar se deve continuar público.

## Resolvido
- M1: revisão de `projects.json` (ortografia, clareza, frases curtas; "microPython" → "MicroPython"; operações de conjuntos em minúsculas; título "Controle de Estoque da ONG"). Tecnologias preenchidas a partir do próprio texto: Beat Learning (Processing), Bebedouro (MicroPython, ESP32, Wokwi, SolidWorks), Organizador de Arquivos e Calculadora de Conjuntos (Python). Formato e nomes de campos inalterados.
