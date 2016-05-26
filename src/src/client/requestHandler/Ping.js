export default function(request) {
    return new Promise(function(resolve, reject) {
       if (1===2) {
          resolve('yes');  // fulfilled successfully
       }
       else {
          reject('no');  // error, rejected
       }
   }
}