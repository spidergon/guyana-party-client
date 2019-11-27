import { useEffect, useState } from 'react'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'

export const loginEmail = (email, password, next, fallback) => {
  axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({ email, password }),
    url: `${process.env.API}/auth/login`
  })
    .then(({ data }) => {
      const { status, token, userId } = data
      if (status === 200 && token && userId) {
        const config = { secure: process.env.NODE_ENV === 'production' }
        Cookies.set('gp_jwt', token, config)
        Cookies.set('gp_userId', userId, config)
      }
      next()
    })
    .catch(fallback)
}

export const getCredentials = () => {
  const jwt = Cookies.get('gp_jwt')
  const userId = Cookies.get('gp_userId')
  return { jwt, userId }
}

export const MISSING_TOKEN_ERR = 'Token de connexion requis'

export const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const { jwt, userId } = getCredentials()
    if (jwt && userId) {
      axios({
        method: 'GET',
        headers: { authorization: `bearer ${jwt}` },
        url: `${process.env.API}/users/${userId}`
      })
        .then(({ data }) => {
          if (data.status === 200 && data.data) {
            delete data.data.password
            console.log(data.data)
            data.data.logout = logout
            setUser(data.data)
          }
        })
        .catch(error => {
          console.log('Err:', error)
          setError(error)
        })
        .finally(() => setLoading(false))
    } else {
      setError(MISSING_TOKEN_ERR)
      setLoading(false)
    }
  }, [])

  return { loading, error, user }
}

export const logout = () => {
  Cookies.remove('gp_jwt')
  Cookies.remove('gp_userId')
}
