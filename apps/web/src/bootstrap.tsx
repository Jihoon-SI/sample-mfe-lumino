import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

async function bootstrap() {
  const [{ default: Shell }, { default: MicroAppA }, { default: MicroAppB }] =
    await Promise.all([
      import('lumino-shell/Shell'),
      import('microapp-a/App'),
      import('microapp-b/App'),
    ])

  const panels = [
    { id: 'panel-a', title: 'Micro App A', component: MicroAppA },
    { id: 'panel-b', title: 'Micro App B', component: MicroAppB },
  ]

  createRoot(document.getElementById('root')!).render(
    createElement(Shell, { panels })
  )
}

bootstrap().catch(console.error)
