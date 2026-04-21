import { useEffect, useRef } from 'react'
import { DockPanel, Widget } from '@lumino/widgets'
import type { Message } from '@lumino/messaging'
import '@lumino/default-theme/style/index.css'

export interface PanelConfig {
  id: string
  title: string
  mount: (el: HTMLElement) => (() => void) | void
}

export interface ShellProps {
  panels: PanelConfig[]
}

class MountWidget extends Widget {
  private _mountFn: (el: HTMLElement) => (() => void) | void
  private _cleanup: (() => void) | null = null
  private _mounted = false

  constructor(config: PanelConfig) {
    super()
    this._mountFn = config.mount
    this.id = config.id
    this.title.label = config.title
    this.title.closable = true
  }

  // onAfterAttach와 rAF 폴백 양쪽에서 호출되므로 중복 방지 플래그 사용
  ensureMounted(): void {
    if (this._mounted) return
    this._mounted = true
    try {
      const cleanup = this._mountFn(this.node)
      this._cleanup = typeof cleanup === 'function' ? cleanup : null
    } catch (e) {
      console.error('[MountWidget] mount failed:', e)
    }
  }

  protected onAfterAttach(_msg: Message): void {
    this.ensureMounted()
  }

  protected onBeforeDetach(_msg: Message): void {
    const cleanup = this._cleanup
    this._cleanup = null
    this._mounted = false
    queueMicrotask(() => cleanup?.())
  }
}

export default function Shell({ panels }: ShellProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const dock = new DockPanel()

    // Lumino DockPanel 내부 children이 모두 position:absolute 이므로
    // 부모의 intrinsic height에 기여하지 않음 → content area 높이 0 방지
    // containerRef(position:relative)를 꽉 채우도록 absolute 설정
    dock.node.style.position = 'absolute'
    dock.node.style.inset = '0'

    Widget.attach(dock, containerRef.current)

    const widgets: MountWidget[] = []
    let first: MountWidget | null = null
    for (const cfg of panels) {
      const w = new MountWidget(cfg)
      dock.addWidget(w, first ? { mode: 'tab-after', ref: first } : undefined)
      widgets.push(w)
      if (!first) first = w
    }

    // onAfterAttach가 호출되지 않는 엣지케이스 대비 rAF 폴백
    requestAnimationFrame(() => {
      for (const w of widgets) w.ensureMounted()
    })

    const onResize = () => dock.update()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      Widget.detach(dock)
      dock.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    />
  )
}
