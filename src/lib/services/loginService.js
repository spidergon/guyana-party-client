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
      const { status, token } = data
      if (status === 200 && token) {
        Cookies.set('gp_jwt', token, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production'
        })
      }
      next()
    })
    .catch(fallback)
}

export default loginEmail
