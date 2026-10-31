# Game design

## Fluxo de telas
```
[Loading] → [Título "Press Start"] → [Quarto] ⇄ [Objeto em foco + painel]
                 │                       │
                 └── Opções: idioma, som └── HUD: idioma, som, menu acessível
```
- **Loading** (`Boot`/`Preload`): barra em pixel; carrega mapa, sprites e fonte.
- **Título** (`Title`): quarto desfocado ao fundo, logo, "Press Start" piscando. Enter/clique/toque entra. Menu: Iniciar, Idioma, Som.
- **Quarto** (`Room`): câmera mostra o quarto inteiro. Hover/foco em um objeto → outline + tooltip com nome e o que contém.
- **Objeto em foco**: clique → câmera faz zoom no objeto (≈400 ms, ease-out) → painel temático abre. Esc / botão "Voltar" / clique fora → painel fecha → zoom-out.
- **Visão de perto (decidido em 2026-10-31, entra no M2)**: depois do zoom, o objeto aparece como se o visitante estivesse diante dele, em vez de o painel ocupar a tela inteira. Ex.: no computador vemos mesa, monitor, teclado e caneca, e o conteúdo (pastas de projetos) fica **dentro da tela do monitor**. Cada objeto ganha uma ilustração frontal em pixel art (spec do `art-director`) com um retângulo de "área de conteúdo", onde o painel React é posicionado. Os painéis (`ComputerPanel` etc.) continuam iguais, só mudam de lugar. Em telas estreitas a ilustração é recortada para focar na área de conteúdo. Substitui a pendência do M1 "painel cobre o objeto em foco".

## Estados (store `useGameStore`)
| Campo | Significado |
|---|---|
| `sceneKey` | cena Phaser ativa |
| `hoveredId` | objeto sob o mouse/foco (tooltip) |
| `openId` | objeto com painel aberto (`null` = quarto livre) |
| `muted` | som desligado (padrão `true`) |

## Eventos (EventBus)
| Evento | Origem → destino | Payload |
|---|---|---|
| `scene-ready` | Phaser → React | chave da cena |
| `object-hover` | Phaser → React | id ou `null` |
| `object-open` | Phaser → React | id (emitido **depois** do zoom terminar) |
| `panel-closed` | React → Phaser | — (dispara zoom-out) |
| `focus-object` | React → Phaser | id (menu de teclado pede o zoom; a cena responde com `object-open`) |

Fluxo único de abertura: clique no canvas **ou** `focus-object` → zoom da câmera → `object-open` → painel. Se `prefers-reduced-motion`, o zoom é instantâneo.

Novos eventos previstos: `time-of-day`, `audio-toggle`.

## Interação por dispositivo
| Ação | Desktop | Teclado | Mobile |
|---|---|---|---|
| Descobrir objetos | hover + outline | Tab no menu acessível | brilho pulsante periódico |
| Abrir | clique | Enter | toque |
| Fechar | Esc / botão / clique fora | Esc | botão Voltar / toque fora |
| Navegar no quarto | — | — | arrastar (pan), pinça (zoom) |

## Dia/noite
Horário local do visitante: dia (7h–17h), entardecer (17h–19h), noite (19h–7h). Muda a luz da janela, a cor ambiente e acende o abajur. Sem animação se `prefers-reduced-motion`.

## Áudio
Desligado por padrão (política de autoplay e respeito ao visitante). Música lo-fi/chiptune em loop baixo; SFX de hover, abrir e fechar. Estado lembrado em `localStorage`.

## Pet e avatar
Pet com animação idle (dormir, espreguiçar); clique mostra frases curtas (easter egg). Avatar opcional sentado à mesa, definido no M2/M4 conforme a arte.
