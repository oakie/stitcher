/** @type {import('next').NextConfig} */
const config = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  webpack: (config) => ({
    ...config,
    externals: [...config.externals, { canvas: 'canvas' }], // required to make Konva & react-konva work
  }),
};

export default config;
