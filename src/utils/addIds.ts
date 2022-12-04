import { randomUUID } from 'crypto';

export const addIds = (data: any[], key: string) => {
  return data.map((d: any) => {
    if (!d[key]) d[key] = randomUUID();
    return d;
  })
}
