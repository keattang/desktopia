import { ActionMiddleware } from "../Dispatcher";

const logActionMiddleware: ActionMiddleware = async (action, next) => {
  console.log(action);
  const result = await next(action);
  console.log(action.type, result);
  return result;
};

export default logActionMiddleware;
