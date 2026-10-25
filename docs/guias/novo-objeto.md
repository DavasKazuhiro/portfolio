# Como adicionar um objeto interagível

Exemplo: um violão (`guitar`) que mostra hobbies.

1. **Arte** (`art-director`): sprite em `public/assets/objects/guitar.png` (+ `.json` se animado), seguindo a [bíblia de arte](../arte/biblia-de-arte.md). Licença em `public/assets/LICENSES.md` se for de terceiros.
2. **Mapa** (`scene-engineer`): no Tiled, colocar o objeto no object layer `interactables` com a propriedade `id = guitar`.
3. **Registry**: adicionar `{ id: 'guitar', labelKey: 'objects.guitar' }` em `src/game/objects/registry.ts`.
4. **Rótulos** (`ui-engineer`): chave `objects.guitar` em `src/i18n/locales/pt.json` e `en.json`. O teste `tests/registry.test.ts` falha se faltar.
5. **Conteúdo** (`content-curator`): `src/content/{pt,en}/hobbies.json` e exportar em `src/content/index.ts`.
6. **Painel** (`ui-engineer`): `src/ui/panels/GuitarPanel.tsx` e registrá-lo no mapa de painéis do `PanelHost`.
7. **Verificar** (`qa-a11y`): aparece no menu acessível, abre com clique e com Enter, fecha com Esc, PT e EN.

Nenhuma mudança no motor da cena é necessária.
