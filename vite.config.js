import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages는 repository 이름을 base path로 사용
  // 예: https://username.github.io/calculaton-demo/
  base: process.env.NODE_ENV === 'production' 
    ? '/calculaton-demo/'
    : '/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // 프로덕션 빌드 최적화
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    
    // 청크 분할 전략
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['mathjs']
        }
      }
    },
    
    // 소스맵 생성 (디버깅용)
    sourcemap: false,
    
    // 빌드 성능
    chunkSizeWarningLimit: 500
  },
  
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  preview: {
    port: 4173,
    open: true
  }
});
