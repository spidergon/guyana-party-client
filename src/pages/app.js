import React from 'react'
import { Router } from '@reach/router'
import { Seo } from '../components/addons'
import Dashboard from '../components/Dashboard'

export default () => (
  <>
    <Seo title='Tableau de bord' />
    <Router>
      <Dashboard path='/app' />
    </Router>
  </>
)
