import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  axiosGet,
  axiosPost,
  axiosPut,
  axiosDelete,
  fetcher,
  getUserId,
  formatResult,
  MISSING_TOKEN_ERR
} from '../utils'
import useSWR from 'swr'

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
    { url: `${process.env.API}/groups`, data: formData },
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
  payload.photos.forEach(photo => {
    if (!photo.size) formData.append('photos[]', photo.name)
    else formData.append('files[]', photo)
  })

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

export const removeGroup = (id, next, fallback) => {
  const userId = Cookies.get('gp_userId')
  if (!userId) return fallback(MISSING_TOKEN_ERR)

  axiosDelete(
    `${process.env.API}/groups/${id}`,
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
          return { preview: `${process.env.STATIC}/${p}`, name: p }
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
  const [groups, setGroups] = useState([])

  const { data, error, isValidating: loading } = useSWR(
    `${process.env.API}/groups?uid=${getUserId()}&status=online${onlyAdmin ? '&admin=true' : ''}`,
    fetcher
  )

  useEffect(() => {
    if (!error && data && data.total > 0) setGroups(formatResult(data.data))
  }, [data, error])

  return { loading, error, groups }
}

export const useArchived = () => {
  const [groups, setGroups] = useState([])

  const { data, error, isValidating: loading } = useSWR(
    `${process.env.API}/groups?author=${getUserId()}&status=archived`,
    fetcher
  )

  useEffect(() => {
    if (!error && data && data.total > 0) setGroups(formatResult(data.data))
  }, [data, error])

  return { loading, error, groups }
}
