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
| `object-open` | Phaser → React | id |
| `panel-closed` | React → Phaser | — (dispara zoom-out) |

Novos eventos previstos: `focus-object` (React → Phaser, para abrir pelo menu de teclado com zoom), `time-of-day`, `audio-toggle`.

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
