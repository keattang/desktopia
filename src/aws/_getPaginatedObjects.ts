import { Paginator } from "@aws-sdk/types";

type UnPaginate<T> = T extends Paginator<infer U> ? U : T;
type UnArray<T> = T extends Array<infer U> ? U : T;

const _getPaginatedObjects = <
  C extends { new (...args: any): any },
  P extends (...args: any) => any,
  T extends keyof UnPaginate<ReturnType<P>>
>(
  ClientClass: C,
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
