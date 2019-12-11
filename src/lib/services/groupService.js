import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  axiosGet,
  axiosPost,
  axiosPut,
  getBlob,
  MISSING_TOKEN_ERR
} from '../utils'

export const createGroup = (payload, next, fallback) => {
  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('author', userId)
  payload.photos = payload.photos || []
  payload.photos.forEach(photo => formData.append('files[]', photo))

  axiosPost(
    `${process.env.API}/groups`,
    formData,
    ({ data: res }) => {
      if (res.status === 201 && res.data) {
        next({ slug: res.data.slug, _id: res.data._id })
      } else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const updateGroup = (payload, next, fallback) => {
  if (!payload.id) fallback()

  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  payload.photos.forEach(photo => formData.append('files[]', photo))

  axiosPut(
    `${process.env.API}/groups/${payload.id}`,
    formData,
    ({ data: res }) => {
      if (res.status === 200 && res.data) next({})
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const archiveGroup = (id, next, fallback) => {
  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

  axiosPut(
    `${process.env.API}/groups/${id}`,
    { status: 'archived' },
    ({ data: res }) => {
      if (res.status === 200 && res.data) next()
      else fallback('Une erreur interne est survenue')
    },
    fallback
  )
}

export const useGroup = ({ id, slug }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [group, setGroup] = useState(null)

  useEffect(() => {
    if ((!id && !slug) || group) return setLoading(false)
    axiosGet(
      `${process.env.API}/groups${slug ? `?slug=${slug}` : `/${id}`}`,
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
        setGroup(res.data)
      },
      formatError
    ).finally(formatError)
  }, [group, id, slug])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, group }
}

export const useGroups = (onlyAdmin = false) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (groups.length > 0) return setLoading(false)

    const userId = Cookies.get('gp_userId')
    if (!userId) return formatError(MISSING_TOKEN_ERR)

    axiosGet(
      `${process.env.API}/groups?uid=${userId}&status=online${
        onlyAdmin ? '&admin=true' : ''
      }`,
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
        setGroups(res.data)
      },
      formatError
    ).finally(formatError)
  }, [groups, onlyAdmin])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, groups, setGroups }
}
