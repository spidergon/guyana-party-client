import { useEffect, useState } from 'react'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import { MISSING_TOKEN_ERR } from '../utils'

export const isAuthor = (user, author) => {
  return user && user._id === author
}

export const createGroup = (payload, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  if (!jwt || !userId) return fallback(MISSING_TOKEN_ERR)

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('author', userId)
  payload.photos.forEach(photo => formData.append('files[]', photo))

  axios
    .post(`${process.env.API}/groups`, formData, {
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

export const updateGroup = (payload, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  if (!jwt || !userId) return fallback(MISSING_TOKEN_ERR)

  if (userId !== payload.author) {
    return fallback('Vous ne pouvez pas éditer ce groupe')
  }

  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  payload.photos.forEach(photo => formData.append('files[]', photo))

  axios
    .put(`${process.env.API}/groups/${payload.id}`, formData, {
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

export const deleteGroup = async (payload, next, fallback) => {
  if (!payload.id || !payload.author) fallback()
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  if (!jwt || !userId) return fallback(MISSING_TOKEN_ERR)

  if (userId !== payload.author) {
    return fallback('Vous ne pouvez pas supprimer ce groupe')
  }

  axios({
    method: 'PUT',
    headers: { authorization: `bearer ${jwt}` },
    data: qs.stringify({ status: 'archived' }),
    url: `${process.env.API}/groups/${payload.id}`
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

export const useGroup = ({ id, slug }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [group, setGroup] = useState(null)

  useEffect(() => {
    if ((!id && !slug) || group) return setLoading(false)

    const query = `${process.env.API}/groups${
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
        setGroup(res.data)
      })
      .catch(formatError)
      .finally(() => formatError())
  }, [group, id, slug])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, group }
}

export const useGroups = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (groups.length > 0) return setLoading(false)

    const userId = Cookies.get('gp_userId')
    if (!userId) return formatError(MISSING_TOKEN_ERR)

    axios
      .get(`${process.env.API}/groups?author=${userId}&status=online`)
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

        setGroups(res.data)
      })
      .catch(formatError)
      .finally(() => formatError())
  }, [groups])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  return { loading, error, groups, setGroups }
}

function getBlob (photo) {
  const arrayBufferView = new Uint8Array(photo.data.data)
  return new Blob([arrayBufferView], {
    type: photo.contentType
  })
}
