// export async function asyncLoop (array, callback) {
//   for (let index = 0, len = array.length; index < len; index++) {
//     await callback(array[index], index)
//   }
// }

export const gravatar = email =>
  `https://www.gravatar.com/avatar/${require('md5')(email)}?d=mp`

export const purify = async dirty => require('dompurify').sanitize(dirty)
