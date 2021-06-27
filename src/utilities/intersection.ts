// Adapted from here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
const difference = <T>(setA: Set<T>, setB: Set<T>) => {
  const _difference = new Set(setA);
  setB.forEach((elem) => {
    _difference.delete(elem);
  });
  return _difference;
};

export default difference;
