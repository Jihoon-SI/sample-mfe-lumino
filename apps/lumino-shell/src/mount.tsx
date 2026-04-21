import { createRoot } from 'react-dom/client'
import Shell, { type PanelConfig } from './Shell'

export function mount(el: HTMLElement, options: { panels: PanelConfig[] }) {
  const root = createRoot(el)
  root.render(<Shell panels={options.panels} />)
}
