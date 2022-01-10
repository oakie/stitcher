const types = {
  CELLS: {
    CREATE: 'cells.create',
    UPDATE: 'cells.update',
    REMOVE: 'cells.remove',
    RESET: 'cells.reset'
  },
  LAYERS: {
    CREATE: 'layers.create',
    UPDATE: 'layers.update',
    REMOVE: 'layers.remove',
    SELECT: 'layers.select',
    RESET: 'layers.reset'
  }
};
Object.freeze(types);

export default types;
