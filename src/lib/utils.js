import Showdown from 'showdown'
import { format } from 'date-fns'
import fr from 'date-fns/locale/fr'
import axios from 'axios'
// import qs from 'qs'
import Cookies from 'js-cookie'

export const reload = () => {
  if (typeof window !== 'undefined') window.location.reload()
}

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

export const axiosGet = (url, next, fallback) => {
  return axios
    .get(url)
    .then(payload => next(payload))
    .catch(fallback)
}

export const axiosPost = (url, data, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  if (!jwt) return fallback(MISSING_TOKEN_ERR)

  const options = { headers: { authorization: `bearer ${jwt}` } }

  return axios
    .post(url, data, options)
    .then(next)
    .catch(fallback)
}

export const axiosPut = (url, data, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  if (!jwt) return fallback(MISSING_TOKEN_ERR)

  const options = { headers: { authorization: `bearer ${jwt}` } }

  return axios
    .put(url, data, options)
    .then(next)
    .catch(fallback)
}
