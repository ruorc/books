import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import babel from '@rolldown/plugin-babel';

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: [
        ['babel-plugin-react-compiler', {}], // Наш React Compiler
      ],
    }),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
