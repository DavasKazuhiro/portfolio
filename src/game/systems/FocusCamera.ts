import * as Phaser from 'phaser'
import { fitZoom, focusZoom, padRect, rectCenter, type Rect } from './cameraMath'
import { prefersReducedMotion } from './motion'

export const FOCUS_DURATION = 400
const FOCUS_EASE = 'Cubic.easeOut'
// Margem em volta do quarto na visão geral (px do mundo).
const ROOM_PADDING = 8

export type FocusState = 'room' | 'zooming-in' | 'focused' | 'zooming-out'

// Controla a câmera principal do quarto:
// - 'room': quarto inteiro, maior zoom inteiro que cabe na tela;
// - 'zooming-in' → 'focused': pan + zoomTo até o objeto (instantâneo com reduced-motion);
// - 'zooming-out' → 'room': volta à visão geral.
// O zoom final é sempre inteiro; só os quadros intermediários da animação são fracionários.
// Em resize a câmera é reenquadrada na hora (ou ao fim da animação em curso).
export class FocusCamera {
  private _state: FocusState = 'room'
  private target: Rect | null = null
  private pendingResize = false
  private afterRelease: Array<() => void> = []
  // Incrementa a cada animação; callbacks de animações canceladas são descartados.
  private generation = 0
  private readonly cam: Phaser.Cameras.Scene2D.Camera
  private readonly roomRect: Rect

  constructor(
    private readonly scene: Phaser.Scene,
    roomBounds: Rect,
  ) {
    this.cam = scene.cameras.main
    this.roomRect = padRect(roomBounds, ROOM_PADDING)
    scene.scale.on(Phaser.Scale.Events.RESIZE, this.onResize, this)
    this.snapToRoom()
  }

  get state(): FocusState {
    return this._state
  }

  get roomZoom(): number {
    return fitZoom(this.cam.width, this.cam.height, this.roomRect)
  }

  // Zoom até `rect` e chama `onDone` ao terminar. `rect = null` (objeto fora do mapa) não move a
  // câmera, mas passa pelo mesmo fluxo de estados. Retorna false se não estava livre.
  focus(rect: Rect | null, onDone: () => void): boolean {
    if (this._state !== 'room') return false
    this.target = rect
    this._state = 'zooming-in'
    const done = () => {
      this._state = 'focused'
      this.flushResize()
      onDone()
    }
    if (!rect) {
      done()
      return true
    }
    const center = rectCenter(rect)
    this.animate(center.x, center.y, this.focusZoomFor(rect), done)
    return true
  }

  // Volta para o quarto inteiro e chama `onDone` quando a cena estiver livre.
  // Idempotente: em 'room' chama `onDone` na hora; em 'zooming-out' só segue a animação em curso;
  // durante 'zooming-in' cancela o zoom (o `onDone` do foco não é chamado).
  release(onDone?: () => void) {
    if (this._state === 'room') {
      onDone?.()
      return
    }
    if (this._state === 'zooming-out') {
      if (onDone) this.afterRelease.push(onDone)
      return
    }
    if (onDone) this.afterRelease.push(onDone)
    const moved = this.target !== null
    this.target = null
    this._state = 'zooming-out'
    const finish = () => {
      this._state = 'room'
      this.flushResize()
      const callbacks = this.afterRelease
      this.afterRelease = []
      for (const fn of callbacks) fn()
    }
    if (!moved) {
      // Foco sem zoom (objeto fora do mapa): a câmera não saiu do lugar.
      this.generation++
      finish()
      return
    }
    const center = rectCenter(this.roomRect)
    this.animate(center.x, center.y, this.roomZoom, finish)
  }

  destroy() {
    this.generation++
    this.afterRelease = []
    this.scene.scale.off(Phaser.Scale.Events.RESIZE, this.onResize, this)
  }

  private focusZoomFor(rect: Rect) {
    return focusZoom(this.cam.width, this.cam.height, rect, this.roomZoom)
  }

  private animate(x: number, y: number, zoom: number, onDone: () => void) {
    const gen = ++this.generation
    if (prefersReducedMotion()) {
      // Interrompe uma animação em curso (resetFX não cobre o zoom).
      this.cam.resetFX()
      this.cam.zoomEffect.reset()
      this.cam.setZoom(zoom).centerOn(x, y)
      onDone()
      return
    }
    let pending = 2
    const step = () => {
      if (gen !== this.generation) return
      pending--
      if (pending === 0) {
        // Garante o estado final exato (zoom inteiro, centro em pixel inteiro).
        this.cam.setZoom(zoom).centerOn(x, y)
        onDone()
      }
    }
    this.cam.pan(x, y, FOCUS_DURATION, FOCUS_EASE, true, (_cam, progress) => {
      if (progress >= 1) step()
    })
    this.cam.zoomTo(zoom, FOCUS_DURATION, FOCUS_EASE, true, (_cam, progress) => {
      if (progress >= 1) step()
    })
  }

  private snapToRoom() {
    const center = rectCenter(this.roomRect)
    this.cam.setZoom(this.roomZoom).centerOn(center.x, center.y)
  }

  private snapToTarget() {
    if (!this.target) return this.snapToRoom()
    const center = rectCenter(this.target)
    this.cam.setZoom(this.focusZoomFor(this.target)).centerOn(center.x, center.y)
  }

  private onResize(gameSize: Phaser.Structs.Size) {
    this.cam.setSize(gameSize.width, gameSize.height)
    if (this._state === 'zooming-in' || this._state === 'zooming-out') {
      this.pendingResize = true
      return
    }
    if (this._state === 'room') this.snapToRoom()
    else this.snapToTarget()
  }

  private flushResize() {
    if (!this.pendingResize) return
    this.pendingResize = false
    if (this._state === 'room') this.snapToRoom()
    else this.snapToTarget()
  }
}
