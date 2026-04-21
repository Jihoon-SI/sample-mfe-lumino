import { createRoot } from 'react-dom/client'
import App from './App'

export function mount(el: HTMLElement) {
  const root = createRoot(el)
  root.render(<App />)
  return () => root.unmount()
}
