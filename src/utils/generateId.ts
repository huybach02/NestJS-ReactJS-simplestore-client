export const generateRandomId = (length: number = 24): string => {
  return (
    Math.random()
      .toString(36)
      .substring(2, length + 2) +
    Math.random()
      .toString(36)
      .substring(2, length + 2)
  );
};
