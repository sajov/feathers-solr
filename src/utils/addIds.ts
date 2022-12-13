import { randomUUID } from 'crypto';
export const addIds = (data: any[], key: string) => data.map((d: any) => ({
  ...d,
  ...(!d[key] && {[key]: randomUUID()})
}));
