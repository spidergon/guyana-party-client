import axios from 'axios'
import Cookies from 'js-cookie'

export const reload = () => {
  if (typeof window !== 'undefined') window.location.reload()
}

export const gravatar = email => `https://www.gravatar.com/avatar/${require('md5')(email)}?d=retro`

export const purify = async dirty => require('dompurify').sanitize(dirty)

export const markToSafeHTML = markdown => {
  const Showdown = require('showdown')
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
  })
  return purify(converter.makeHtml(markdown))
}

// export const getBlob = photo => {
//   const arrayBufferView = new Uint8Array(photo.data.data)
//   return new Blob([arrayBufferView], { type: photo.contentType })
// }

export const getUID = () => Cookies.get('gp_uid')
export const getToken = () => ({ jwt: Cookies.get('gp_jwt'), uid: getUID() })

export const fetcher = url => axios.get(url).then(r => r.data)

export const axiosGet = (url, next, fallback) => {
  return axios
    .get(url)
    .then(payload => next(payload))
    .catch(fallback)
}

export const axiosPost = ({ url, data }, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  if (!jwt) return fallback(MISSING_TOKEN_ERR)

  const options = { headers: { authorization: `bearer ${jwt}` } }

  return axios
    .post(url, data, options)
    .then(next)
    .catch(fallback)
}

export const axiosPut = ({ url, data }, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  if (!jwt) return fallback(MISSING_TOKEN_ERR)

  const options = { headers: { authorization: `bearer ${jwt}` } }

  return axios
    .put(url, data, options)
    .then(next)
    .catch(fallback)
}

export const axiosDelete = (url, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  if (!jwt) return fallback(MISSING_TOKEN_ERR)

  const options = { headers: { authorization: `bearer ${jwt}` } }

  return axios
    .delete(url, options)
    .then(next)
    .catch(fallback)
}

/* Convert the coordinate (lat or lng) to DMS (degrees minutes seconds). */
const toDMS = coord => {
  const absolute = Math.abs(coord)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60)
  return `${degrees}° ${minutes}′ ${seconds}″`
}

export const gpsCoords = (lat, lng) => {
  const northSouth = `${toDMS(lat)} ${Math.sign(lat) >= 0 ? 'N' : 'S'}`
  const eastWest = `${toDMS(lng)} ${Math.sign(lng) >= 0 ? 'E' : 'W'}`
  return `${northSouth}, ${eastWest}`
}

export const compress = (files, next) => {
  if (typeof window === 'undefined') return // window not defined in ssr
  const Compress = require('client-compress')
  const compressor = new Compress({
    targetSize: 1.0,
    quality: 0.75
  })
  compressor.compress(files).then(data => next(data))
}
export const scrollTo = selector => {
  const target = document.querySelector(selector)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

export const MISSING_TOKEN_ERR = 'Token de connexion requis'

export const formatResult = res => {
  return res.map(d => {
    if (d.photos && d.photos.length > 0) {
      // d.photo = URL.createObjectURL(getBlob(d.photos[0]))
      // delete d.photos
      d.photo = `${process.env.STATIC}/${d.photos[0]}`
    }
    return d
  })
}
