/** @type {import('next').NextConfig} */
const config = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist', // Changes the build output directory to `./dist/`.
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
    return config;
  },
};

export default config;
