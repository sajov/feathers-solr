const OPERATORS = {
  $lt: (key, value) => {
    return `${key}:[* TO ${value}]`;
  },
  $lte: (key, value) => {
    return `${key}:[* TO ${value}}`;
  },
  $gt: (key, value) => {
    return `${key}:[${value} TO *]`;
  },
  $gte: (key, value) => {
    return `${key}:{${value} TO *]`;
  },
  $like: (key, value) => {
    return `${key}:{${value}`;
  },
  $notlike: (key, value) => {
    return `!${key}:{${value}`;
  }
};

module.exports = OPERATORS;
