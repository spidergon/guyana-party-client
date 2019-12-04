import Showdown from 'showdown'
import { format } from 'date-fns'
import fr from 'date-fns/locale/fr'

export const gravatar = email =>
  `https://www.gravatar.com/avatar/${require('md5')(email)}?d=mp`

export const purify = async dirty => require('dompurify').sanitize(dirty)

export const markToSafeHTML = markdown => {
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
  })
  return purify(converter.makeHtml(markdown))
}

export const isAuthor = (user, author) => {
  return user && user._id === author
}

export const getBlob = photo => {
  const arrayBufferView = new Uint8Array(photo.data.data)
  return new Blob([arrayBufferView], {
    type: photo.contentType
  })
}

export const dateToStr = (date, formatStr = 'd MMM yyyy à HH:mm') => {
  return format(new Date(date), formatStr, { locale: fr })
}

export const MISSING_TOKEN_ERR = 'Token de connexion requis'
