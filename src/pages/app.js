import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { Router } from '@reach/router'
import { useAuth } from '../lib/services/authService'
import { Seo } from '../components/addons'
import Dashboard from '../components/Dashboard'
import Profile from '../components/Dashboard/Profile'
import NewEvent from '../components/Dashboard/NewEvent'
import NewGroup from '../components/Dashboard/NewGroup'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loading, user } = useAuth()

  useEffect(() => {
    if (!loading && !user) navigate('/connexion')
  }, [loading, user])

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.func
}

export default () => (
  <>
    <Seo title='Tableau de bord' />
    <Router>
      <PrivateRoute component={Dashboard} path='/app' />
      <PrivateRoute component={Profile} path='/app/profile' />
      <PrivateRoute component={NewEvent} path='/app/newevent' />
      <PrivateRoute component={NewGroup} path='/app/newgroup' />
    </Router>
  </>
)
