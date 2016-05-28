// const _ = {
//   values(obj) {
//     return Object.keys(obj).map(key => obj[key]);
//   },
//   isEmpty(obj) {
//     return Object.keys(obj).length === 0;
//   },
//   extend(... args) {
//     return Object.assign(... args);
//   },
//   omit(obj, ...keys) {
//     const result = Object.assign({}, obj);
//     for(let key of keys) {
//       delete result[key];
//     }
//     return result;
//   },
//   pick(source, ...keys) {
//     const result = {};
//     for(let key of keys) {
//       result[key] = source[key];
//     }
//     return result;
//   }
// };