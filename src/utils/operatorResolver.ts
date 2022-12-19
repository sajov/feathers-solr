export const operatorResolver: any = {
  $eq: (key: string, value: any) => `${key}:${value}`,
  $ne: (key: string, value: any) => `!${key}:${value}`,
  $like: (key: string, value: any) => `${key}:*${value}*`,
  $nlike: (key: string, value: any) => `!${key}:*${value}*`,
  $in: (key: string, value: any) => `${key}:(${value.join(' OR ')})`,
  $nin: (key: string, value: any) => `!${key}:(${value.join(' OR ')})`,
  $and: (value: any) => Array.isArray(value) && value.length > 1 ? `(${value.join(' AND ')})` : value[0],
  $or: (value: any) => `(${value.join(' OR ')})`,
  $lt: (key: string, value: any) => `${key}:[* TO ${value}}`,
  $lte: (key: string, value: any) => `${key}:[* TO ${value}]`,
  $gt: (key: string, value: any) => `${key}:{${value} TO *]`,
  $gte: (key: string, value: any) => `${key}:[${value} TO *]`
}
