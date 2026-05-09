export type OperatorFn = (key: string, value: any) => string;
export type CombinatorFn = (value: any) => string;

export interface OperatorResolver {
  $eq: OperatorFn;
  $ne: OperatorFn;
  $empty: OperatorFn;
  $nempty: OperatorFn;
  $fuzzy: OperatorFn;
  $like: OperatorFn;
  $nlike: OperatorFn;
  $starts: OperatorFn;
  $ends: OperatorFn;
  $in: OperatorFn;
  $nin: OperatorFn;
  $lt: OperatorFn;
  $lte: OperatorFn;
  $gt: OperatorFn;
  $gte: OperatorFn;
  $or: CombinatorFn;
  $and: CombinatorFn;
  [key: string]: OperatorFn | CombinatorFn;
}

export const operatorResolver: OperatorResolver = {
  $eq: (key, value) => `${key}:${value}`,
  $ne: (key, value) => `!${key}:${value}`,
  // @ts-ignore: TS6133
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $empty: (key, value) => `!${key}:*`,
  // @ts-ignore: TS6133
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $nempty: (key, value) => `${key}:*`,
  $fuzzy: (key, value) => `${key}:${value}~`,
  $like: (key, value) => `${key}:*${value}*`,
  $nlike: (key, value) => `!${key}:*${value}*`,
  $starts: (key, value) => `${key}:${value}*`,
  $ends: (key, value) => `${key}:*${value}`,
  $in: (key, value) => `${key}:(${value.join(' OR ')})`,
  $nin: (key, value) => `!${key}:(${value.join(' OR ')})`,
  $lt: (key, value) => `${key}:[* TO ${value}}`,
  $lte: (key, value) => `${key}:[* TO ${value}]`,
  $gt: (key, value) => `${key}:{${value} TO *]`,
  $gte: (key, value) => `${key}:[${value} TO *]`,
  $or: (value) => `(${value.join(' OR ')})`,
  $and: (value) => Array.isArray(value) && value.length > 1 ?
    `(${value.join(' AND ')})` :
    Array.isArray(value[0]) ? value[0][0] : value[0]
}
