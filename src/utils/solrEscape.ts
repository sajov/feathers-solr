const SPECIAL_CHARS = /([\\+\-!(){}[\]^"~*?:/])|(&&)|(\|\|)/g;

const escapeString = (value: string): string =>
  value.replace(SPECIAL_CHARS, '\\$&').replace(/\s/g, '\\ ');

export const solrEscape = (key: string, value: any): { key: string; value: any } => {
  if (typeof value === 'string') {
    return { key, value: escapeString(value) };
  }

  if (Array.isArray(value)) {
    return { key, value: value.map((v: any) => (typeof v === 'string' ? escapeString(v) : v)) };
  }

  return { key, value };
};
