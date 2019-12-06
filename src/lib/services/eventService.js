import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  axiosGet,
  axiosPost,
  axiosPut,
  getBlob,
  MISSING_TOKEN_ERR
} from '../utils'
import { isAdmin, isMember } from './communityService'

export const createEvent = (payload, next, fallback) => {
  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

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

  axiosPost(
    `${process.env.API}/events`,
    formData,
    ({ data: res }) => {
      if (res.status === 201 && res.data) next(res.data.slug)
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const updateEvent = (payload, next, fallback) => {
  if (!payload.id || !payload.author) fallback()

  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

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

  axiosPut(
    `${process.env.API}/events/${payload.id}`,
    formData,
    ({ data: res }) => {
      if (res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const archiveEvent = (payload, next, fallback) => {
  if (!payload.id || !payload.author) fallback()

  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

  if (userId !== payload.author) {
    return fallback('Vous ne pouvez pas supprimer cet évènement')
  }

  axiosPut(
    `${process.env.API}/events/${payload.id}`,
    { status: 'archived' },
    ({ data: res }) => {
      if (res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const goPublic = (payload, next, fallback) => {
  if (!payload.id || !payload.author) fallback()

  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

  if (userId !== payload.author) {
    return fallback('Vous ne pouvez pas éditer cet évènement')
  }

  axiosPut(
    `${process.env.API}/events/${payload.id}`,
    { isPrivate: payload.cancel },
    ({ data: res }) => {
      if (res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const publish = (payload, next, fallback) => {
  if (!payload.id || !payload.author) fallback()

  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

  if (userId !== payload.author) {
    return fallback('Vous ne pouvez pas éditer cet évènement')
  }

  axiosPut(
    `${process.env.API}/events/${payload.id}`,
    { status: payload.cancel ? 'waiting' : 'online' },
    ({ data: res }) => {
      if (res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const requestMarkers = (search, box, next, fallback) => {
  let uid = Cookies.get('gp_userId')
  uid = uid ? `&uid=${uid}` : ''
  axiosGet(
    `${process.env.API}/search?q=${search}&box=${JSON.stringify(box)}${uid}`,
    ({ data: res }) => {
      if (res.status !== 200 || !res.data) {
        return fallback('Une erreur interne est survenue')
      }
      if (res.data.length === 0) return next([])
      next(res.data)
    }
  )
}

export const useEvent = ({ id, slug }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    if ((!id && !slug) || event) return setLoading(false)
    axiosGet(
      `${process.env.API}/events${slug ? `?slug=${slug}` : `/${id}`}`,
      ({ data: res }) => {
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
      },
      formatError
    ).finally(formatError)
  }, [event, id, slug])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, event }
}

export const useEvents = (byGroup, group) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (events.length > 0) return setLoading(false)

    if (byGroup && !group) return setLoading(false)

    const userId = Cookies.get('gp_userId')
    if (!byGroup && !userId) return formatError(MISSING_TOKEN_ERR)

    let query = `author=${userId}&status=waiting&status=online`
    if (group && group._id) {
      query = `group=${group._id}`
      if (userId) {
        // We are connected, we check that we are admin
        if (!isAdmin(group.community)) {
          // We are not admin (perhaps member): we see only online
          query += '&status=online'
          if (!isMember(group.community)) {
            // We are not member: the event has to be public
            query += '&isPrivate=false'
          }
        }
      } else {
        query = `${query}&status=online&isPrivate=false`
      }
    }

    axiosGet(
      `${process.env.API}/events?${query}`,
      ({ data: res }) => {
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
      },
      formatError
    ).finally(formatError)
  }, [byGroup, events, group])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, events, setEvents }
}

export const getAddressFromCoords = (coords, next, fallback) => {
  if (!coords || coords.length < 2) return next('')
  axiosGet(
    `https://nominatim.openstreetmap.org/reverse?format=json&lon=${coords[0]}&lat=${coords[1]}`,
    ({ data, status }) => {
      if (status === 200 && data) next(data.display_name)
      else fallback(new Error('Une erreur interne est survenue'))
    },
    fallback
  )
}
