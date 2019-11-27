export const gravatar = email =>
  `https://www.gravatar.com/avatar/${require('md5')(email)}?d=mp`

export default gravatar
