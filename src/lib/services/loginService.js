import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'

const loginEmail = (email, password, next, fallback) => {
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

export default loginEmail
