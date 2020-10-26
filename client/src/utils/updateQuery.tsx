import { QueryInput, Cache } from '@urql/exchange-graphcache';

export function updateQuery<R, Q>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: R, q: Q) => Q) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
