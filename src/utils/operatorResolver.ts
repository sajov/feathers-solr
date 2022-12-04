export const operatorResolver: any = {
  $in: (key: string, value: any) => `${key}:(${value.join(' OR ')})`,
  $or: (value: any) => `(${value.join(' OR ')})`,
  $lt: (key: string, value: any) => `${key}:[* TO ${value}}`,
  $lte: (key: string, value: any) => `${key}:[* TO ${value}]`,
  $gt: (key: string, value: any) => `${key}:{${value} TO *]`,
  $gte: (key: string, value: any) => `${key}:[${value} TO *]`,
  $like: (key: string, value: any) => `${key}:*${value}*`,
  $nlike: (key: string, value: any) => `!${key}:*${value}*`,
  $eq: (key: string, value: any) => `${key}:${value}`,
  $ne: (key: string, value: any) => `!${key}:${value}`,
  $and: (value: any) => `(${value.join(' AND ')})`,
  $nin: (key: string, value: any) => `!${key}:(${value.join(' OR ')})`
}
