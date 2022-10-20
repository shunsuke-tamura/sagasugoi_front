// a <= n < b
const getRandomIntNum = (a: number, b: number): number => {
  return Math.floor(Math.random() * (b - a + 1)) + a;
};

export default getRandomIntNum;
