import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // The 3D bundle (three + R3F) is lazy-loaded, so it is intentionally large but off the critical path.
    chunkSizeWarningLimit: 1100,
  },
});
