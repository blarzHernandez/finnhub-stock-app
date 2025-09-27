export const formatCurrency = (
  priceValue: number | null | undefined
): string => {
  if (priceValue == null || !isFinite(priceValue)) {
    return "$--";
  }
  return `$${priceValue.toFixed(2)}`;
};

export const formatPercentage = (
  percentageValue: number | null | undefined
): string => {
  if (percentageValue == null || !isFinite(percentageValue)) {
    return "--";
  }
  return `${percentageValue.toFixed(2)}%`;
};
