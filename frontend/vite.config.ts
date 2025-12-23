import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa'; // 1. Importar o plugin

export default defineConfig({
  base: '/hdcontrol-java/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'public/404.html', dest: '.' },
      ],
    }),
    // 2. Configuração do PWA
    VitePWA({
      registerType: 'autoUpdate', // Atualiza o SW automaticamente
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'HD Control Java',
        short_name: 'HDControl',
        description: 'Sistema de controle HD Control',
        theme_color: '#ffffff',
        start_url: '/hdcontrol-java/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-mobile.png',
            sizes: '1080x1920',
            type: 'image/png',
            form_factor: 'narrow', // Indica que é para celular
            label: 'Tela Inicial do HD Control'
          },
          {
            src: 'screenshot-desktop.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide', // Indica que é para computador
            label: 'Painel de Controle HD Control'
          }
        ]
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
});