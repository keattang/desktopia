type DispatchHandler = <P>(action: Action<P>) => any;

export type ActionMiddleware = <P>(
  action: Action<P>,
  next: DispatchHandler
) => any;

type ActionHandler = (payload: any) => any;

interface Action<P> {
  type: string;
  payload: P;
}

export class Dispatcher {
  registeredActions: { [type: string]: ActionHandler } = {};
  registeredMiddleware: ActionMiddleware[] = [];

  registerAction = <P extends ActionHandler>(type: string, handler: P) => {
    this.registeredActions[type] = handler;
  };

  registerMiddleware = (handler: ActionMiddleware) => {
    this.registeredMiddleware.push(handler);
  };

  private _dispatch: DispatchHandler = ({ type, payload }) => {
    return this.registeredActions[type](payload);
  };

  private _runNextHandler = <P>(
    action: Action<P>,
    middleware: ActionMiddleware[]
  ) => {
    const [currentMiddleware, ...remainingMiddleware] = middleware;

    // When there are no more middleware, run the actual action function
    if (!currentMiddleware) {
      return this._dispatch(action);
    }

    const next = <R>(a: Action<R>): ReturnType<typeof remainingMiddleware[0]> =>
      this._runNextHandler(a, remainingMiddleware);

    return currentMiddleware(action, next);
  };

  dispatch = <P>(action: Action<P>) =>
    this._runNextHandler(action, this.registeredMiddleware);
}
