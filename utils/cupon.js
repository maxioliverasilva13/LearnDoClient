export const defaultDisccount = 10;

export const handleGeetDisccount = (price) => {
  if (!price) return 0;
  const discount = (price * defaultDisccount) / 100;
  const newPrice = price - discount;
  return newPrice;
};
