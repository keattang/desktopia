import { Paginator } from "@aws-sdk/types";

type UnPaginate<T> = T extends Paginator<infer U> ? U : T;
type UnArray<T> = T extends Array<infer U> ? U : T;

const _getPaginatedObjects = <
  P extends (...args: any) => Paginator<any>,
  T extends keyof UnPaginate<ReturnType<P>>
>(
  ClientClass: new (...args: any) => Parameters<P>[0]["client"],
  paginatorFunction: P,
  key: T
) => {
  return async (
    region: string,
    options: Parameters<P>[1]
  ): Promise<UnArray<NonNullable<UnPaginate<ReturnType<P>>[T]>>[]> => {
    const client = new ClientClass({ region: region });

    const paginator = paginatorFunction({ client }, options);

    const objects = [];

    for await (const page of paginator) {
      // page contains a single paginated output.
      if (!page[key]) {
        continue;
      }

      objects.push(...page[key]);
    }

    return objects;
  };
};

export default _getPaginatedObjects;
