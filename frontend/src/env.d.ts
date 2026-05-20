// src/env.d.ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PUBLIC_API: string
  // add other variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
