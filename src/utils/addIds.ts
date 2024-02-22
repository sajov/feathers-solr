export const addIds = (data: any[], key: string) => data.map((d: any) => ({
  ...d,
  ...(!d[key] && {[key]: globalThis.crypto.randomUUID()})
}));
