export const getRandomPrice = (basePrice: number): number => {
  const fluctuation = Math.random() * 0.1 - 0.05;
  return Math.round(basePrice * (1 + fluctuation) * 100) / 100;
};
