import { Brush, Point, Stitch } from '@shared/types';

const getMinMax = (points: Point[]) =>
  points.reduce(
    (prev, curr) => ({
      xmin: curr.x < prev.xmin ? curr.x : prev.xmin,
      xmax: curr.x > prev.xmax ? curr.x : prev.xmax,
      ymin: curr.y < prev.ymin ? curr.y : prev.ymin,
      ymax: curr.y > prev.ymax ? curr.y : prev.ymax,
    }),
    {
      xmin: Infinity,
      xmax: -Infinity,
      ymin: Infinity,
      ymax: -Infinity,
    }
  );

interface RGB {
  r: number;
  g: number;
  b: number;
}

const hex2rgb = (hex: string): RGB => {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  const value = parseInt(hex, 16);
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;
  return { r, g, b };
};

const getColorMap = (brushes: { [key: string]: Brush }): { [key: string]: RGB } => {
  const map = {} as { [key: string]: RGB };
  Object.values(brushes).forEach((brush) => (map[brush.id] = hex2rgb(brush.color)));
  return map;
};

const createBitmap = async (stitches: { [key: string]: Stitch }, brushes: { [key: string]: Brush }) => {
  const stitchlist = Object.values(stitches);
  const colors = getColorMap(brushes);

  const limits = getMinMax(stitchlist);
  const width = limits.xmax - limits.xmin + 1;
  const height = limits.ymax - limits.ymin + 1;

  const pixels = new Uint8ClampedArray(width * height * 4); // 4 bytes for RGBA
  for (const stitch of stitchlist) {
    const x = stitch.x - limits.xmin;
    const y = stitch.y - limits.ymin;
    const offset = 4 * width * y + 4 * x;
    const rgb = colors[stitch.brush];
    pixels[offset + 0] = rgb.r;
    pixels[offset + 1] = rgb.g;
    pixels[offset + 2] = rgb.b;
    pixels[offset + 3] = 255;
  }

  const imageData = new ImageData(pixels, width, height);
  const bitmap = await createImageBitmap(imageData);

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');
  if (!context) {
    return { uri: null, size: { width, height } };
  }

  context.drawImage(bitmap, 0, 0);

  const blob = await canvas.convertToBlob();

  const uri = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        resolve(e.target?.result as string);
      }
      reject('failed to read blob');
    };
    reader.onerror = () => reject('failed to read blob');
    reader.readAsDataURL(blob);
  });

  return { uri, size: { width, height } };
};

const ImgUtils = { createBitmap };
export default ImgUtils;
