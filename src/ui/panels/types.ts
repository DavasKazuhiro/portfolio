// Contrato de todo painel em src/ui/panels/<Id>Panel.tsx.
export interface PanelProps {
  /** id que o painel deve pôr no seu título visível (aria-labelledby do diálogo). */
  titleId: string
  /** Fecha o painel: store + EventBus('panel-closed') + devolução de foco. */
  onClose: () => void
}
