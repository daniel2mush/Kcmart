import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start' // correct package

export default defineConfig({
  ssr: {
    noExternal: ['gsap', 'GSAP', '@gsap/react'],
  },
  plugins: [
    devtools(),
    tanstackStart(),
    // netlify(), // now this works
    tailwindcss(),
    viteReact(),
  ],
})
