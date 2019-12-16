import React, { useEffect, useState, useContext, createContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import { gravatar, MISSING_TOKEN_ERR, reload } from '../utils'
import { navigate } from '@reach/router'

const authContext = createContext()

export const AuthProvider = ({ children }) => (
  <authContext.Provider value={useProvideAuth()}>
    {children}
  </authContext.Provider>
)

AuthProvider.propTypes = { children: PropTypes.node.isRequired }

export const useAuth = () => useContext(authContext)

function useProvideAuth() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (user) return setLoading(false)

    const jwt = Cookies.get('gp_jwt')
    const userId = Cookies.get('gp_userId')
    if (!jwt || !userId) return formatError(MISSING_TOKEN_ERR)

    axios({
      method: 'GET',
      headers: { authorization: `bearer ${jwt}` },
      url: `${process.env.API}/users/${userId}`
    })
      .then(({ data: res }) => {
        if (res.status !== 200 || !res.data) {
          return formatError('Une erreur interne est survenue')
        }
        res.data.photo = res.data.photo || gravatar(res.data.email)
        setUser(res.data)
      })
      .catch(error => formatError(error))
      .finally(() => formatError())
  }, [user])

  const formatError = error => {
    if (error) setError(error)
    setLoading(false)
  }

  const setNewUser = (newUser, token) => {
    const config = { secure: process.env.NODE_ENV === 'production' }
    Cookies.set('gp_jwt', token, config)
    Cookies.set('gp_userId', newUser._id, config)
    newUser.photo = newUser.photo || gravatar(newUser.email)
    setUser(newUser)
  }

  const loginFacebook = obj => {
    console.log(obj)
  }

  const loginGoogle = ({ tokenId }, next, fallback) => {
    if (!tokenId) return fallback('Token id missing')

    axios({
      method: 'POST',
      data: qs.stringify({ tokenId, provider: 'google' }),
      url: `${process.env.API}/auth/tokensignin`
    })
      .then(({ data }) => {
        if (data.status !== 200 || !data.token || !data.user._id) {
          return fallback('Une erreur interne est survenue')
        }
        setNewUser(data.user, data.token)
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const loginEmail = (email, password, next, fallback) => {
    axios({
      method: 'POST',
      data: qs.stringify({ email, password }),
      url: `${process.env.API}/auth/login`
    })
      .then(({ data }) => {
        if (data.status !== 200 || !data.token || !data.user._id) {
          return fallback('Une erreur interne est survenue')
        }
        setNewUser(data.user, data.token)
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const signEmail = (name, email, password, next, fallback) => {
    axios({
      method: 'POST',
      data: qs.stringify({ name, email, password }),
      url: `${process.env.API}/auth/signup`
    })
      .then(({ data }) => {
        if (data.status !== 201) {
          return fallback('Une erreur interne est survenue')
        }
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const signout = () => {
    navigate('/').then(() => {
      Cookies.remove('gp_jwt')
      Cookies.remove('gp_userId')
      setUser(null)
      reload()
    })
  }

  return {
    loading,
    error,
    user,
    loginFacebook,
    loginGoogle,
    loginEmail,
    signEmail,
    signout
  }
}
