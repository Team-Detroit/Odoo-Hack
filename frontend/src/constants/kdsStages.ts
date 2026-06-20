export const KDS_STAGES = {
  TO_COOK: 'to_cook',
  PREPARING: 'preparing',
  COMPLETED: 'completed',
} as const;

export const KDS_STAGE_LABELS: Record<string, string> = {
  to_cook: 'To Cook',
  preparing: 'Preparing',
  completed: 'Completed',
};

export const KDS_STAGE_COLORS: Record<string, string> = {
  to_cook: 'bg-red-100 text-red-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

export const KDS_STAGE_ORDER = [
  KDS_STAGES.TO_COOK,
  KDS_STAGES.PREPARING,
  KDS_STAGES.COMPLETED,
];

export const getNextKdsStage = (current: string): string => {
  const currentIndex = KDS_STAGE_ORDER.indexOf(current);
  if (currentIndex === -1 || currentIndex === KDS_STAGE_ORDER.length - 1) {
    return current;
  }
  return KDS_STAGE_ORDER[currentIndex + 1];
};
