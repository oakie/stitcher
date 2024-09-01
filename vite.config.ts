import react from '@vitejs/plugin-react-swc';
import { UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsConfigPaths from 'vite-tsconfig-paths';

export default {
  base: '/',
  build: {
    outDir: 'out',
  },
  plugins: [tsConfigPaths(), react(), svgr()],
  server: {
    port: 3000,
    open: true,
  },
} satisfies UserConfig;
