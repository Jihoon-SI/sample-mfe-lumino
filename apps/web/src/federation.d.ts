declare module 'microapp-a/App' {
  import type { ComponentType } from 'react'
  const App: ComponentType
  export default App
}

declare module 'microapp-b/App' {
  import type { ComponentType } from 'react'
  const App: ComponentType
  export default App
}

declare module 'lumino-shell/Shell' {
  import type { ComponentType } from 'react'
  export interface PanelConfig {
    id: string
    title: string
    component: ComponentType
  }
  export interface ShellProps {
    panels: PanelConfig[]
  }
  const Shell: ComponentType<ShellProps>
  export default Shell
}
