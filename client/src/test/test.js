const redondearAMultiplosDe5 = (x: number) => {
  return x % 5 === 0 ? x : x + 5 - (x % 5);
};
