import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

export const createGroup = (payload, next, fallback) => {
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  if (jwt && userId) {
    const formData = new FormData()
    const { name, description, photos } = payload
    formData.append('name', name)
    formData.append('description', description)
    formData.append('author', userId)
    photos.forEach(photo => formData.append('files[]', photo))
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
      .catch(error => fallback(error))
  } else fallback(MISSING_TOKEN_ERR)
}

export const useGroups = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (groups.length === 0) {
      const userId = Cookies.get('gp_userId')
      if (userId) {
        axios
          .get(`${process.env.API}/groups?author=${userId}`)
          .then(({ data: res }) => {
            if (res.status === 200 && res.data) {
              setGroups(res.data)
            } else {
              setError('Une erreur interne est survenue')
            }
          })
          .catch(error => setError(error))
      } else {
        setError(MISSING_TOKEN_ERR)
        setLoading(false)
      }
    }
  }, [groups])

  return { loading, error, groups }
}

export const MISSING_TOKEN_ERR = 'Token de connexion requis'
export const groupPath = 'g'
