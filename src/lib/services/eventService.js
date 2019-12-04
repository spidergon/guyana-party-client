import { useEffect, useState } from 'react'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import { getBlob, MISSING_TOKEN_ERR } from '../utils'

export const createEvent = (payload, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  if (!jwt || !userId) return fallback(MISSING_TOKEN_ERR)

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('group', payload.group)
  formData.append('description', payload.description)
  formData.append('startDate', payload.startDate)
  formData.append('endDate', payload.endDate)
  formData.append('occurrence', payload.occurrence)
  formData.append('location[address]', payload.location.address)
  formData.append('location[coordinates][0]', payload.location.coordinates[0])
  formData.append('location[coordinates][1]', payload.location.coordinates[1])
  formData.append('author', userId)
  payload.photos.forEach(photo => formData.append('files[]', photo))

  axios
    .post(`${process.env.API}/events`, formData, {
      headers: { authorization: `bearer ${jwt}` }
    })
    .then(({ data: res }) => {
      if (res.status === 201 && res.data) {
        next(res.data.slug)
      } else {
        fallback('Une erreur interne est survenue')
      }
    })
    .catch(fallback)
}

export const updateEvent = (payload, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  if (!jwt || !userId) return fallback(MISSING_TOKEN_ERR)

  if (userId !== payload.author) {
    return fallback('Vous ne pouvez pas éditer ce groupe')
  }

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('group', payload.group)
  formData.append('description', payload.description)
  formData.append('startDate', payload.startDate)
  formData.append('endDate', payload.endDate)
  formData.append('occurrence', payload.occurrence)
  formData.append('location.address', payload.location.address)
  formData.append('location.coordinates[0]', payload.location.coordinates[0])
  formData.append('location.coordinates[1]', payload.location.coordinates[1])
  payload.photos.forEach(photo => formData.append('files[]', photo))

  axios
    .put(`${process.env.API}/events/${payload.id}`, formData, {
      headers: { authorization: `bearer ${jwt}` }
    })
    .then(({ data: res }) => {
      if (res.status === 200 && res.data) {
        next()
      } else {
        fallback('Une erreur interne est survenue')
      }
    })
    .catch(fallback)
}

export const archiveEvent = async (payload, next, fallback) => {
  if (!payload.id || !payload.author) fallback()
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  if (!jwt || !userId) return fallback(MISSING_TOKEN_ERR)

  if (userId !== payload.author) {
    return fallback('Vous ne pouvez pas supprimer cet évènement')
  }

  axios({
    method: 'PUT',
    headers: { authorization: `bearer ${jwt}` },
    data: qs.stringify({ status: 'archived' }),
    url: `${process.env.API}/events/${payload.id}`
  })
    .then(({ data: res }) => {
      if (res.status === 200 && res.data) {
        next()
      } else {
        fallback('Une erreur interne est survenue')
      }
    })
    .catch(fallback)
}

export const useEvent = ({ id, slug }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    if ((!id && !slug) || event) return setLoading(false)

    const query = `${process.env.API}/events${
      slug ? `?slug=${slug}` : `/${id}`
    }`

    axios
      .get(query)
      .then(({ data: res }) => {
        if (res.status !== 200 || !res.data) {
          return formatError('Une erreur interne est survenue')
        }
        const parsePhoto = p => {
          const blob = getBlob(p)
          Object.assign(blob, {
            preview: URL.createObjectURL(blob),
            id: p._id
          })
          return blob
        }
        if (slug) {
          res.data[0].photos = res.data[0].photos.map(parsePhoto)
          res.data = res.data[0]
        } else {
          res.data.photos = res.data.photos.map(parsePhoto)
        }
        setEvent(res.data)
      })
      .catch(formatError)
      .finally(() => formatError())
  }, [event, id, slug])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, event }
}

export const useEvents = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (events.length > 0) return setLoading(false)

    const userId = Cookies.get('gp_userId')
    if (!userId) return formatError(MISSING_TOKEN_ERR)

    axios
      .get(
        `${process.env.API}/events?author=${userId}&status=waiting&status=online`
      )
      .then(({ data: res }) => {
        if (res.status !== 200 || !res.data) {
          return formatError('Une erreur interne est survenue')
        }
        if (res.data.length === 0) return formatError()
        res.data = res.data.map(d => {
          if (d.photos.length > 0) {
            d.photo = URL.createObjectURL(getBlob(d.photos[0]))
            delete d.photos
          }
          return d
        })
        setEvents(res.data)
      })
      .catch(formatError)
      .finally(() => formatError())
  }, [events])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, events, setEvents }
}

export const getAddressFromCoords = (coords, next, fallback) => {
  if (!coords || coords.length < 2) return next('')
  axios
    .get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0].toString()}&lon=${coords[1].toString()}`
    )
    .then(({ data, status }) => {
      if (status === 200 && data) next(data.display_name)
      else fallback(new Error('Une erreur interne est survenue'))
    })
    .catch(fallback)
}
