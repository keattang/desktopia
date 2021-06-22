// Coalesces query params into a string
const coalesceQueryParam = (param: string | string[]): string => {
  return Array.isArray(param) ? param[param.length - 1] : param;
};

export default coalesceQueryParam;
