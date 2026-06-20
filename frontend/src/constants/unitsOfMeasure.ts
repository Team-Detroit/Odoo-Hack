export const UNITS_OF_MEASURE = [
  { value: 'piece', label: 'Per Piece' },
  { value: 'kg', label: 'Per Kg' },
  { value: 'litre', label: 'Per Litre' },
] as const;

export const UNIT_LABELS: Record<string, string> = {
  piece: 'Per Piece',
  kg: 'Per Kg',
  litre: 'Per Litre',
};

export const UNIT_SYMBOLS: Record<string, string> = {
  piece: 'pcs',
  kg: 'kg',
  litre: 'L',
};
