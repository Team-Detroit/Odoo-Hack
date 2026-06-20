export const UNITS_OF_MEASURE = {
  PIECE: 'piece',
  KG: 'kg',
  LITRE: 'litre',
} as const;

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
