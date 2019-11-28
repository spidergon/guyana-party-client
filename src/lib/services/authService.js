import React, { useEffect, useState, useContext, createContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import gravatar from '../utils'

const authContext = createContext()

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => useContext(authContext)

function useProvideAuth () {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [hasSignedOut, setHasSignedOut] = useState(false)

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
    if (tokenId) {
      axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({ tokenId, provider: 'google' }),
        url: `${process.env.API}/auth/tokensignin`
      })
        .then(({ data }) => {
          const { status, token, user: newUser } = data
          if (status === 200 && token && newUser._id) setNewUser(newUser, token)
          next()
        })
        .catch(fallback)
        .finally(() => setLoading(false))
    } else fallback('Token id missing')
  }

  const loginEmail = (email, password, next, fallback) => {
    axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({ email, password }),
      url: `${process.env.API}/auth/login`
    })
      .then(({ data }) => {
        const { status, token, user: newUser } = data
        if (status === 200 && token && newUser._id) setNewUser(newUser, token)
        next()
      })
      .catch(fallback)
      .finally(() => setLoading(false))
  }

  const signout = () => {
    Cookies.remove('gp_jwt')
    Cookies.remove('gp_userId')
    setHasSignedOut(true)
    setUser(null)
  }

  return {
    loading,
    error,
    user,
    loginFacebook,
    loginGoogle,
    loginEmail,
    signout,
    hasSignedOut
  }
}

export const MISSING_TOKEN_ERR = 'Token de connexion requis'
