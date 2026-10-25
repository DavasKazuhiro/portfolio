import { create } from 'zustand'
import type { InteractableId } from '@/game/objects/registry'

interface GameState {
  sceneKey: string | null
  hoveredId: InteractableId | null
  openId: InteractableId | null
  muted: boolean
  setSceneKey: (key: string) => void
  setHovered: (id: InteractableId | null) => void
  open: (id: InteractableId) => void
  close: () => void
  toggleMuted: () => void
}

export const useGameStore = create<GameState>((set) => ({
  sceneKey: null,
  hoveredId: null,
  openId: null,
  muted: true,
  setSceneKey: (sceneKey) => set({ sceneKey }),
  setHovered: (hoveredId) => set({ hoveredId }),
  open: (openId) => set({ openId }),
  close: () => set({ openId: null }),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
}))
