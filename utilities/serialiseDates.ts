export type MappedDateToIso<T, K extends keyof T> = {
  [J in keyof T]: J extends K ? (T[J] extends Date ? string : T[J]) : T[J];
};

const serialiseDates = <T, K extends keyof T>(
  obj: T,
  dateKeys: K[]
): MappedDateToIso<T, K> => {
  return dateKeys.reduce(
    (agg, key) => {
      const value = obj[key];
      if (value instanceof Date) {
        agg[key] = value.toISOString();
      }
      return agg;
    },
    { ...obj } as MappedDateToIso<T, K>
  );
};

export default serialiseDates;
