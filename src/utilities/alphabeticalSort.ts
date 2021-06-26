const alphabeticalSort = (a: string, b: string) =>
  a.localeCompare(b, "en", { sensitivity: "base" });

export default alphabeticalSort;
