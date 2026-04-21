// ── Remote URLs (로컬 preview 기준, 배포 시 상대경로 또는 실제 URL로 교체) ──
const LUMINO_SHELL_REMOTE = 'http://localhost:5003/assets/remoteEntry.js'
const MICROAPP_A_REMOTE   = 'http://localhost:5001/assets/remoteEntry.js'
const MICROAPP_B_REMOTE   = 'http://localhost:5002/assets/remoteEntry.js'

// ── 유틸 ────────────────────────────────────────────────────────────────
async function loadRemote(remoteUrl, remoteName, exposedModule) {
  const remoteEntry = await import(remoteUrl)

  // @originjs/vite-plugin-federation ESM 빌드: named exports { init, get }
  // UMD 빌드 fallback: window[remoteName]
  const container =
    typeof remoteEntry.init === 'function' && typeof remoteEntry.get === 'function'
      ? remoteEntry
      : window[remoteName]

  if (!container) {
    throw new Error(
      `Remote '${remoteName}' not found. remoteEntry keys: ${Object.keys(remoteEntry).join(', ')}`
    )
  }

  await container.init({})
  const factory = await container.get(exposedModule)
  return factory()
}

// ── Bootstrap ────────────────────────────────────────────────────────────
async function main() {
  const [shellMod, appAMod, appBMod] = await Promise.all([
    loadRemote(LUMINO_SHELL_REMOTE, 'lumino-shell', './Shell'),
    loadRemote(MICROAPP_A_REMOTE,   'microapp-a',   './App'),
    loadRemote(MICROAPP_B_REMOTE,   'microapp-b',   './App'),
  ])

  shellMod.mount(document.getElementById('root'), {
    panels: [
      { id: 'panel-a', title: 'Micro App A', mount: appAMod.mount },
      { id: 'panel-b', title: 'Micro App B', mount: appBMod.mount },
    ],
  })
}

main().catch(console.error)
