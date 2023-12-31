export const operatorResolver: any = {
  $eq: (key: string, value: any) => `${key}:${value}`,
  $ne: (key: string, value: any) => `!${key}:${value}`,
  // @ts-ignore: TS6133
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $empty: (key: string, value: any) => `!${key}:*`,
  // @ts-ignore: TS6133
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $nempty: (key: string, value?: any) => `${key}:*`,
  $fuzzy: (key: string, value: any) => `${key}:${value}~`,
  $like: (key: string, value: any) => `${key}:*${value}*`,
  $nlike: (key: string, value: any) => `!${key}:*${value}*`,
  $starts: (key: string, value: any) => `${key}:${value}*`,
  $ends: (key: string, value: any) => `${key}:*${value}`,
  $in: (key: string, value: any) => `${key}:(${value.join(' OR ')})`,
  $nin: (key: string, value: any) => `!${key}:(${value.join(' OR ')})`,
  $lt: (key: string, value: any) => `${key}:[* TO ${value}}`,
  $lte: (key: string, value: any) => `${key}:[* TO ${value}]`,
  $gt: (key: string, value: any) => `${key}:{${value} TO *]`,
  $gte: (key: string, value: any) => `${key}:[${value} TO *]`,
  $or: (value: any) => `(${value.join(' OR ')})`,
  $and: (value: any) => Array.isArray(value) && value.length > 1 ?
    `(${value.join(' AND ')})` :
    Array.isArray(value[0]) ?
      value[0][0] :
      value[0]
}
