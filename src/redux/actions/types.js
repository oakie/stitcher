const types = {
  CELLS: {
    CREATE: 'cells.create',
    UPDATE: 'cells.update',
    REMOVE: 'cells.remove',
    RESET: 'cells.reset'
  },
  BRUSHES: {
    CREATE: 'brush.create',
    UPDATE: 'brush.update',
    REMOVE: 'brush.remove',
    SELECT: 'brush.select',
    RESET: 'brush.reset'
  }
};
Object.freeze(types);

export default types;
