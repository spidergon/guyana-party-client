import { useEffect, useState } from 'react'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import gravatar from '../utils'

export const loginFacebook = obj => {
  console.log(obj)
}

export const loginGoogle = ({ tokenId }, next, fallback) => {
  if (tokenId) {
    axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({ tokenId, provider: 'google' }),
      url: `${process.env.API}/auth/tokensignin`
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
  } else fallback('Token id missing')
}

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

export const MISSING_TOKEN_ERR = 'Token de connexion requis'

export const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) {
      const jwt = Cookies.get('gp_jwt')
      const userId = Cookies.get('gp_userId')
      if (jwt && userId) {
        axios({
          method: 'GET',
          headers: { authorization: `bearer ${jwt}` },
          url: `${process.env.API}/users/${userId}`
        })
          .then(({ data: res }) => {
            if (res.status === 200 && res.data) {
              delete res.data.password
              res.data.photo = res.data.photo || gravatar(res.data.email)
              res.data.logout = () => {
                Cookies.remove('gp_jwt')
                Cookies.remove('gp_userId')
                setUser(null)
              }
              setUser(res.data)
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
    }
  }, [user])

  return { loading, error, user }
}
