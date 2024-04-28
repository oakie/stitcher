const lerp = (vmin: number, vmax: number, step: number) => {
  const first = Math.floor(vmin / step) * step;
  const last = Math.floor(vmax / step) * step;
  const tmp: number[] = [];
  for (let v = first; v <= last; v += step) {
    tmp.push(v);
  }
  return tmp;
};

const MathUtils = { lerp };
export default MathUtils;
